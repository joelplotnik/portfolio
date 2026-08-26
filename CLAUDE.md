# CLAUDE.md

Personal portfolio site: single-page React frontend that reads its content from a Sanity CMS studio.

## Layout

```
Portfolio/
├── netlify.toml          # deploy config (base = frontend_react)
├── .nvmrc                # Node 22
├── frontend_react/       # Vite 8 + React 18 — the actual site
└── backend_sanity/       # Sanity Studio v6 — content schemas + admin UI
```

There is **no** root `package.json` and no npm workspace — the two apps are independent, with conflicting trees (React 18 vs React 17). Always `cd` into one of them before running anything. Both use **npm**; their `package-lock.json` files are committed.

## Commands

```bash
# Frontend (http://localhost:3000)
cd frontend_react && npm install
cd frontend_react && npm start          # or `npm run dev` — same thing
cd frontend_react && npm run build      # → frontend_react/build/, deployed to Netlify
cd frontend_react && npm run preview    # serve the production build locally
cd frontend_react && npm run lint

# Sanity Studio (http://localhost:3333)
cd backend_sanity && npm install
cd backend_sanity && npm run dev        # `sanity dev` — v2's `sanity start` is gone
cd backend_sanity && npm run build      # → backend_sanity/dist/
cd backend_sanity && npm run deploy     # publishes the hosted studio
```

**Always go through the npm scripts, never a bare `sanity`.** The scripts resolve the CLI from `node_modules`; a globally installed `sanity` shadows it and fails in misleading ways — a stale v2 global, and a v6 global installed under the wrong Node version, both did exactly that during the migration.

There is no test suite. **`npm run build` does not lint** — Vite and ESLint are separate, unlike CRA where linting ran inside the build. Run `npm run lint` yourself before pushing, or chain it into `build` if you want deploys to fail on lint errors.

## Environment

`frontend_react/.env` (git-ignored; both must also be set in Netlify):

```
REACT_APP_SANITY_PROJECT_ID=e612k9ar   # public — also in backend_sanity/sanity.json
SANITY_TOKEN=<sanity token with write access>   # server-side only
```

**The `REACT_APP_` prefix is a security boundary, not a naming convention.** CRA inlines every `REACT_APP_*` var into the public bundle. The write token therefore must *not* carry that prefix — it is read only by the Netlify Function. Never rename it to `REACT_APP_SANITY_TOKEN`.

The browser client in [client.js](frontend_react/src/client.js) is unauthenticated: the production dataset allows public reads, so no token is needed for content. The only write is the contact form, which goes through the function below.

`client.js` exports `isConfigured` and degrades rather than throwing when `REACT_APP_SANITY_PROJECT_ID` is missing — `@sanity/client` throws on construction, and at module scope that blanked the entire site. Keep the client construction inside that guard; don't "simplify" it back to an unconditional call.

## Frontend architecture

Entry: [index.js](frontend_react/src/index.js) → [App.js](frontend_react/src/App.js), which renders six sections in fixed order: `Navbar, Header, About, Work, Skills, Testimonials, Footer`. There is no router; navigation is anchor links to section IDs.

**Two HOC wrappers** in [src/wrapper/](frontend_react/src/wrapper/) compose every section. Sections export the wrapped version as default:

```js
export default AppWrap(MotionWrap(About, 'app__about'), 'about', 'app__whitebg');
//                     ^ framer-motion scroll-in    ^ id + social/nav rails + copyright
```

- `AppWrap(Component, idName, classNames)` — supplies the section `id` (the anchor target), the left `SocialMedia` rail, the right `NavigationDots` rail, and the copyright block.
- `MotionWrap(Component, classNames)` — the scroll-into-view fade/rise animation.
- `Header` uses `AppWrap` only (no `MotionWrap`); it animates internally.

**Section IDs don't all match component names.** `Footer` is registered as `contact`, not `footer`.

Anchor lists come from one place: [constants/sections.js](frontend_react/src/constants/sections.js). `sections` is the full ordered list (used by `NavigationDots`); `navLinks` is the same list minus `testimonials` (used by `Navbar`, both the desktop and mobile menus). Adding or renaming a section means editing that file, the `AppWrap` id on the component, and the render order in [App.js](frontend_react/src/App.js) — nothing else.

**Barrel files** re-export everything; a new component/container/wrapper is invisible until added to its `index.js` ([container](frontend_react/src/container/index.js), [components](frontend_react/src/components/index.js), [wrapper](frontend_react/src/wrapper/index.js)).

**Sanity access** is via [client.js](frontend_react/src/client.js), exporting `client` (GROQ queries) and `urlFor(source)` (image URL builder — required for any Sanity image field; raw `imgUrl` objects won't render in `<img src>`).

**Contact form writes go server-side.** [Footer.jsx](frontend_react/src/container/Footer/Footer.jsx) POSTs to `/.netlify/functions/submit-contact` ([source](frontend_react/netlify/functions/submit-contact.js)), which holds `SANITY_TOKEN` and creates the `contact` document. The function revalidates every field — the client-side checks are for fast feedback only and are trivially bypassed. Because the endpoint is public, keep the length caps and validation there.

Running `npm start` alone leaves that endpoint 404ing. To exercise the form locally use `npx netlify dev`, which serves the function alongside the dev server and loads `.env`.

**Data-fetching pattern** — every content section does the same thing: `useState` + `useEffect`, GROQ query, `.then` sets state and clears `isLoading`, `.catch` logs and clears `isLoading`, and the JSX renders a `Loading...` block while pending. Match this shape when adding a section rather than introducing a data library.

## Styling

SCSS via `sass` (dart-sass), one `.scss` file colocated per component and imported by it. No CSS modules — class names are global and namespaced by hand with the `app__` / BEM-ish convention (`app__work-item`, `app__skills-exp-year`).

- Design tokens are CSS custom properties in [index.css](frontend_react/src/index.css) (`--primary-color`, `--secondary-color: #4bbb7d` is the green accent, `--font-base`). Use the variables, not raw hex.
- Shared utility classes live in [App.scss](frontend_react/src/App.scss): `app__flex`, `app__container`, `app__wrapper`, `head-text`, `p-text`, `bold-text`, `app__whitebg` / `app__primarybg`, `sr-only`.
- Responsive breakpoints used throughout: `min-width: 2000px` (scale up for large displays), `max-width: 900px`, `max-width: 450px`, and `max-width: 500px` (hides the social/nav rails).

Local static images are imported and re-exported through [constants/images.js](frontend_react/src/constants/images.js) as one `images` object — add both the `import` and the key in the exported object.

## Sanity backend

Studio **v6** (`sanity` ^6, React 19, styled-components 6). Two config files, split by purpose:

- [sanity.config.js](backend_sanity/sanity.config.js) — the Studio itself: schema types and plugins
- [sanity.cli.js](backend_sanity/sanity.cli.js) — what the `sanity` CLI reads for build/deploy/dataset commands

Schemas in [backend_sanity/schemas/](backend_sanity/schemas/); a new schema file must be imported **and** added to the `schemaTypes` array in [schemas/index.js](backend_sanity/schemas/index.js) or it won't appear. Plain objects are fine — `defineType` is optional and unused here.

Validate changes with `npx sanity schema validate`; it catches bad type references without starting the Studio.

| Type | Notes |
|---|---|
| `about` | title, description, imgUrl |
| `work` | title, description, projectLink, codeLink, imgUrl, tags[] |
| `skills` | name, bgColor (hex string used as inline style), icon |
| `experiences` | year, works[] of `workExperience`; hidden `order` number field drives sorting |
| `workExperience` | name, company, desc — an `object`, embedded only inside `experiences.works` |
| `testimonials` | name, company, imgUrl, feedback |
| `brands` | imgUrl, name |
| `contact` | name, email, message — **written by the site**, not authored in the studio |

`experiences.order` is a plain editable number and `Skills.jsx` queries `| order(order asc)`. It used to be hidden and driven by `sanity-plugin-order-documents`, which was abandoned in 2022 and never ported past Studio v2. With three documents, an editable number beat adopting `@sanity/orderable-document-list` — that would have meant an `orderRank` field, a data migration, and a frontend query change. **Set `order` explicitly on any new entry**, or it sorts as null.

### Known data traps

- `testimonials.imgUrl` was spelled `imgurl` until it was renamed. [Testimonials.jsx](frontend_react/src/container/Testimonials/Testimonials.jsx) still reads `test.imgUrl ?? test.imgurl`; that fallback exists only until `backend_sanity/scripts/rename-testimonial-imgurl.js` has been applied everywhere, then it can go.
- Work filter buttons are derived from the tags present in the fetched documents, so a new tag in Sanity appears automatically and no filter can render that matches nothing. Note that `All` is the reset sentinel *and* exists as a literal tag on at least one document — [Work.jsx](frontend_react/src/container/Work/Work.jsx) deletes it from the derived set to avoid rendering it twice. Don't remove that line without also cleaning up the CMS.
- `work` has no `name` field — it's `title`. Don't reintroduce `work.name`; it silently yields `undefined`.
- `Testimonials` and `Skills` fetch two document types with `Promise.all`; keep that shape if you add a third.

## Conventions

- Function components only, no TypeScript, no PropTypes on the frontend.
- **Any file containing JSX must be `.jsx`.** Vite's esbuild will not parse JSX from a `.js` file. Non-JSX modules (`client.js`, barrels, constants) stay `.js`.
- No `import React` — the automatic JSX runtime handles it. Import hooks and `Fragment` by name instead.
- **Prettier owns formatting.** Config is `.prettierrc` at the repo root and applies to both apps (Prettier resolves config by walking up from the file). Run `npm run format` in either package; `npm run format:check` verifies without writing. Single quotes, trailing commas, 80 columns. Don't hand-format against it.
- Import order is *not* enforced by anything. Most files group side-effect imports, then external packages, then relative ones — follow that by hand.
- External links always carry `target="_blank" rel="noreferrer"`.
- Icon buttons and bare anchors need `aria-label` (and `sr-only` text where the link has no visible content) — accessibility was cleaned up deliberately in a recent commit; don't regress it.

## Maintenance scripts

[backend_sanity/scripts/](backend_sanity/scripts/) holds one-off data migrations. They use the Sanity HTTP API directly through `fetch` and have no dependencies, so they run without the Studio's tree installed.

**Every script is dry-run by default and needs `--apply` to write.** Keep that convention for anything added there.

```bash
cd backend_sanity
node scripts/rename-testimonial-imgurl.js                    # preview
SANITY_TOKEN=<token> node scripts/rename-testimonial-imgurl.js --apply
```

The token needs Editor permission and is the same one the contact-form function uses.

**Migrations that rename a field must be sequenced against deploys.** Renaming `imgurl` before the site read `imgUrl` briefly broke the live testimonial images. The safe order is: ship code that reads both, deploy, migrate the data, then remove the fallback with a follow-up script. `remove-legacy-imgurl-field.js` is the pending final step — it refuses to run on any document that would lose its only image reference. Two gotchas the existing scripts already account for: GROQ projects absent fields as explicit `null` rather than `undefined`, so test truthiness rather than `!== undefined`; and the API version in the URL needs its `v` prefix (`v2022-02-01`) or every request 404s.

## Deployment

Netlify, configured by [netlify.toml](netlify.toml) at the repo root — that file overrides the dashboard UI. `base = "frontend_react"`, so Netlify runs `npm ci` against the frontend's lockfile and `publish = "build"` resolves to `frontend_react/build`. Node is pinned to 18 via `NODE_VERSION`.

Reproduce a deploy locally with `cd frontend_react && npm ci && npm run build`. `npm ci` matters — it installs exactly the committed lockfile, which is what Netlify does.

The Sanity Studio is **not** deployed by Netlify; it publishes separately with `sanity deploy`. Live at www.joelplotnik.com.

## Gotchas

- **Commit the lockfiles.** `frontend_react/package-lock.json` and `backend_sanity/package-lock.json` are tracked on purpose — Netlify installs from a fresh clone, so an untracked lockfile means every deploy re-resolves the whole tree and inherits upstream breakage like the typescript issue above.
- Styling uses dart-sass. Don't reintroduce `node-sass` — it caps out around Node 17. No SCSS here uses `@import` or legacy `/` division, so it's clean against dart-sass deprecations.
- Env vars reach the browser through `import.meta.env`, **not** `process.env` — Vite does not shim the latter. `vite.config.js` sets `envPrefix: ["VITE_", "REACT_APP_"]` so the pre-existing `REACT_APP_*` names still work and no Netlify changes were needed. Inside `netlify/functions/` it is still real Node, so `process.env` is correct there.
- `backend_sanity` uses **npm**. It needs Node >=22.12 (declared in its `engines`), same toolchain as the frontend.
- `frontend_react/build/` is git-ignored build output that's present on disk. Don't read it to understand current source.
- **Node is pinned to 22** by `.nvmrc` and `netlify.toml`; keep the two in sync. Vite 8 and sass 1.103 both require `>=20.19`. `frontend_react` declares `engines.node` and runs `scripts/require-node.mjs` before `dev`/`start`/`build`, so an old Node fails with a readable message instead of a `styleText` SyntaxError from inside rolldown.
- **Never run `npm install`/`npm ci` for the frontend on Node 18.** Its npm 8 has an optional-dependency bug (npm/cli#4828) that silently skips rolldown's platform binary, and the build then dies with "Cannot find native binding". The lockfile is fine when this happens — `rm -rf node_modules && npm ci` on Node 22 fixes it.
- The 2 remaining `npm audit` findings are both `react-tooltip` → `uuid`, which needs a `buf` argument react-tooltip never passes. Not reachable, and clearing it means rewriting the Skills tooltips across two major versions.
- `vite.config.mjs` is `.mjs` on purpose. `"type": "module"` in package.json would fix Vite's CJS warning too, but would also make Node treat the CommonJS Netlify function as ESM and crash it.
