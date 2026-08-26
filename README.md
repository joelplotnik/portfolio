# Portfolio App

A modern portfolio website built with React and Sanity CMS, featuring smooth animations and a clean, professional design.

## Tech Stack

- **Frontend**: React 18, Vite 5, Framer Motion, SCSS
- **Backend**: Sanity CMS (Headless CMS)
- **Deployment**: Netlify

## Project Structure

```
Portfolio/
├── netlify.toml             # Netlify deploy configuration
├── .nvmrc                   # Pinned Node version (18)
├── frontend_react/          # React frontend application
└── backend_sanity/          # Sanity CMS backend
```

The two apps are independent — each has its own `package.json` and committed
`package-lock.json`. There is no root manifest and no npm workspace, so `cd`
into the app you're working on first. Both use npm.

## Getting Started

### Prerequisites

- Node.js 18 (see `.nvmrc` — `nvm use` will pick it up)
- npm
- Sanity account (for CMS backend)

### Backend Setup (Sanity CMS)

1. Navigate to the backend directory:

```bash
cd backend_sanity
```

2. Install dependencies:

```bash
npm install
```

3. Start the Sanity studio:

```bash
sanity start
```

This will start the Sanity CMS studio at `http://localhost:3333`

### Frontend Setup

1. Navigate to the frontend directory:

```bash
cd frontend_react
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the `frontend_react` directory with your Sanity credentials:

```
REACT_APP_SANITY_PROJECT_ID=your_project_id
SANITY_TOKEN=your_token
```

4. Start the development server:

```bash
npm start
```

The application will be available at `http://localhost:3000`

## Environment Variables

Create a `.env` file in the `frontend_react` directory:

```
REACT_APP_SANITY_PROJECT_ID=your_sanity_project_id
SANITY_TOKEN=your_sanity_api_token
```

Get these values from your Sanity dashboard at `sanity.io/manage`.

## Deployment to Netlify

Deploys are driven by [`netlify.toml`](netlify.toml) in the repo root, which
overrides any build settings in the Netlify dashboard:

- **Base directory**: `frontend_react` (Netlify installs from its lockfile here)
- **Build command**: `npm run build`
- **Publish directory**: `build` (relative to base → `frontend_react/build`)
- **Node version**: 18, via `NODE_VERSION`

The only thing that still has to be set in the Netlify dashboard is the
**environment variables** (`REACT_APP_SANITY_PROJECT_ID` and `SANITY_TOKEN`).

> **Note:** `SANITY_TOKEN` deliberately has no `REACT_APP_` prefix. Create React
> App inlines every `REACT_APP_*` variable into the public JavaScript bundle, so
> a write-scoped token must never use that prefix. It is read only by the
> Netlify Function that handles contact form submissions.

To reproduce a deploy locally, match what Netlify actually runs:

```bash
cd frontend_react
npm ci          # installs exactly the committed lockfile, as Netlify does
npm run build
```

The Sanity Studio is deployed separately with `sanity deploy`, not by Netlify.

## Features

- ✅ Responsive design
- ✅ Smooth animations with Framer Motion
- ✅ Dynamic content management with Sanity CMS
- ✅ Modern React 18 architecture
- ✅ SCSS styling with CSS variables
- ✅ Mobile-first approach

## Sections

- **Header**: Hero section with introduction
- **About**: Personal information and background
- **Work**: Portfolio projects with filtering
- **Skills**: Technical skills and experience
- **Testimonials**: Client recommendations
- **Footer**: Contact information and social links

## Content Management

The portfolio content is managed through Sanity CMS. You can:

- Add/edit portfolio projects
- Update skills and experience
- Manage testimonials
- Modify personal information

Access the CMS at `http://localhost:3333` when running `sanity start`.

## Development

### Adding New Projects

1. Open Sanity CMS (`sanity start`)
2. Navigate to "Work" section
3. Add new project with:
   - Title
   - Description
   - Project link
   - Code link (GitHub)
   - Tags (for filtering)
   - Featured image

### Updating Skills

1. Open Sanity CMS
2. Navigate to "Skills" section
3. Add or update technical skills
4. Upload skill icons

## Scripts

### Frontend (`frontend_react/package.json`)

- `npm start` (or `npm run dev`) - Start the Vite dev server on port 3000
- `npm run build` - Build for production into `build/`
- `npm run preview` - Serve the production build locally
- `npm run lint` - Run ESLint

Note that `npm run build` does **not** run ESLint; they are separate steps.

### Backend (`backend_sanity/package.json`)

- `sanity start` - Start Sanity studio
- `sanity build` - Build for production

## License

This project is unlicensed. Contact the author for usage permissions.

## Author

**Joel Plotnik**

- Portfolio: www.joelplotnik.com

---

**Note**: Make sure to configure your Sanity environment variables before running the application.
