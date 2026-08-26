# CLAUDE.md

Personal portfolio site: single-page React frontend that reads its content from a Sanity CMS studio.

## Layout

```
Portfolio/
├── netlify.toml          # deploy config (base = frontend_react)
├── .nvmrc                # Node 18
├── frontend_react/       # Create React App (react-scripts 5) — the actual site
└── backend_sanity/       # Sanity Studio v2 — content schemas + admin UI
```

There is **no** root `package.json` and no npm workspace — the two apps are independent, with conflicting trees (React 18 vs React 17). Always `cd` into one of them before running anything. Both use **npm**; their `package-lock.json` files are committed.

## Commands

```bash
# Frontend (http://localhost:3000)
cd frontend_react && npm install
cd frontend_react && npm start
cd frontend_react && npm run build      # → frontend_react/build/, deployed to Netlify

# Sanity Studio (http://localhost:3333)
cd backend_sanity && sanity start
cd backend_sanity && sanity deploy      # publishes the hosted studio
```

No test suite exists beyond the CRA default. No lint/format script is wired up — `frontend_react/package.json` only carries the stock `eslintConfig` (`react-app`).

## Environment

`frontend_react/.env` (git-ignored, must exist locally and in Netlify's env settings):

```
REACT_APP_SANITY_PROJECT_ID=e612k9ar
REACT_APP_SANITY_TOKEN=<sanity api token with write access>
```

The token needs **write** permission because the contact form calls `client.create()` from the browser. CRA inlines env vars at build time, so this token ships inside the public bundle — treat it as semi-public, keep its scope minimal, and never widen it.

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

**Data-fetching pattern** — every content section does the same thing: `useState` + `useEffect`, GROQ query, `.then` sets state and clears `isLoading`, `.catch` logs and clears `isLoading`, and the JSX renders a `Loading...` block while pending. Match this shape when adding a section rather than introducing a data library.

## Styling

SCSS via `sass` (dart-sass), one `.scss` file colocated per component and imported by it. No CSS modules — class names are global and namespaced by hand with the `app__` / BEM-ish convention (`app__work-item`, `app__skills-exp-year`).

- Design tokens are CSS custom properties in [index.css](frontend_react/src/index.css) (`--primary-color`, `--secondary-color: #4bbb7d` is the green accent, `--font-base`). Use the variables, not raw hex.
- Shared utility classes live in [App.scss](frontend_react/src/App.scss): `app__flex`, `app__container`, `app__wrapper`, `head-text`, `p-text`, `bold-text`, `app__whitebg` / `app__primarybg`, `sr-only`.
- Responsive breakpoints used throughout: `min-width: 2000px` (scale up for large displays), `max-width: 900px`, `max-width: 450px`, and `max-width: 500px` (hides the social/nav rails).

Local static images are imported and re-exported through [constants/images.js](frontend_react/src/constants/images.js) as one `images` object — add both the `import` and the key in the exported object.

## Sanity backend

Studio **v2** (`@sanity/base` ^2.30, React 17, parts-based `sanity.json`). This is a legacy generation — v3+ config syntax (`sanity.config.js`, `defineType`) will not work here. Don't upgrade the studio piecemeal.

Schemas in [backend_sanity/schemas/](backend_sanity/schemas/); a new schema file must be imported **and** added to the `types` array in [schema.js](backend_sanity/schemas/schema.js) or it won't appear.

| Type | Notes |
|---|---|
| `about` | title, description, imgUrl |
| `work` | title, description, projectLink, codeLink, imgUrl, tags[] |
| `skills` | name, bgColor (hex string used as inline style), icon |
| `experiences` | year, works[] of `workExperience`; hidden `order` number field drives sorting |
| `workExperience` | name, company, desc — declared `document` but used inline inside `experiences` |
| `testimonials` | name, company, **`imgurl`** (lowercase — inconsistent with the rest), feedback |
| `brands` | imgUrl, name |
| `contact` | name, email, message — **written by the site**, not authored in the studio |

The `sanity-plugin-order-documents` plugin provides the drag-ordering that populates `experiences.order`; `Skills.jsx` queries `| order(order asc)` to respect it.

### Known data traps

- `testimonials.imgurl` is lowercase while every other image field is `imgUrl`. Easy to typo.
- [Work.jsx](frontend_react/src/container/Work/Work.jsx) hardcodes its filter buttons — `UI/UX, Web App, Mobile App, React JS, All` — and these strings must exactly match tags entered in Sanity, or a filter silently returns nothing. (Untagged documents no longer crash, they just never match a filter.)
- `work` has no `name` field — it's `title`. Don't reintroduce `work.name`; it silently yields `undefined`.
- `Testimonials` and `Skills` fetch two document types with `Promise.all`; keep that shape if you add a third.

## Conventions

- Function components only, no TypeScript, no PropTypes on the frontend.
- Containers are `.jsx`, everything else (`client.js`, wrappers, barrels, constants) is `.js`.
- Newer files use single quotes with sorted imports (external before internal); older files (`Header.jsx`, wrappers) use double quotes and unsorted imports. There's no formatter enforcing either — match the file you're editing.
- External links always carry `target="_blank" rel="noreferrer"`.
- Icon buttons and bare anchors need `aria-label` (and `sr-only` text where the link has no visible content) — accessibility was cleaned up deliberately in a recent commit; don't regress it.

## Deployment

Netlify, configured by [netlify.toml](netlify.toml) at the repo root — that file overrides the dashboard UI. `base = "frontend_react"`, so Netlify runs `npm ci` against the frontend's lockfile and `publish = "build"` resolves to `frontend_react/build`. Node is pinned to 18 via `NODE_VERSION`.

Netlify sets `CI=true`, which promotes eslint warnings to errors — reproduce a deploy locally with `cd frontend_react && npm ci && CI=true npm run build`, not a plain `npm run build`.

The Sanity Studio is **not** deployed by Netlify; it publishes separately with `sanity deploy`. Live at www.joelplotnik.com.

## Gotchas

- **`overrides.typescript` in [frontend_react/package.json](frontend_react/package.json) is load-bearing.** `react-scripts@5.0.1` declares `typescript` as an optional peer at `^3.2.1 || ^4`, but a fresh npm resolve now pulls typescript 7, whose changed API crashes `@typescript-eslint/type-utils` on load. The jest eslint plugin then fails to register and the build dies with a misleading `Environment key "jest/globals" is unknown`. The override pins it to `^4.9.5`. Don't remove it, and if that error ever reappears, check the resolved typescript version first.
- **Commit the lockfiles.** `frontend_react/package-lock.json` and `backend_sanity/package-lock.json` are tracked on purpose — Netlify installs from a fresh clone, so an untracked lockfile means every deploy re-resolves the whole tree and inherits upstream breakage like the typescript issue above.
- Styling uses dart-sass (`sass`), which has no native binding and works on current Node. Don't reintroduce `node-sass` — it caps out around Node 17. No SCSS in this project uses `@import` or legacy `/` division, so it's clean against dart-sass deprecations.
- Verify a real build with `cd frontend_react && CI=true npm run build`. `CI=true` promotes eslint warnings to errors, which is what Netlify does — a build that passes locally without it can still fail on deploy.
- `backend_sanity` uses **npm**, but a stale `yarn.lock` also sits there. Don't install with yarn; the two managers resolve this v2 dependency tree differently.
- `frontend_react/build/` is git-ignored build output that's present on disk. Don't read it to understand current source.
- **Node is pinned to 18** by `.nvmrc` and `netlify.toml`. Node 18 is past EOL, but it's the version this stack is verified on; moving up means re-verifying react-scripts 5 and the typescript override together, not just bumping the pin.
