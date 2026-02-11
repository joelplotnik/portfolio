# Portfolio App

A modern portfolio website built with React and Sanity CMS, featuring smooth animations and a clean, professional design.

## Tech Stack

- **Frontend**: React 18, Framer Motion, SCSS
- **Backend**: Sanity CMS (Headless CMS)
- **Deployment**: Netlify

## Project Structure

```
Portfolio/
├── frontend_react/          # React frontend application
├── backend_sanity/          # Sanity CMS backend
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
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
REACT_APP_SANITY_TOKEN=your_token
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
REACT_APP_SANITY_TOKEN=your_sanity_api_token
```

Get these values from your Sanity dashboard at `sanity.io/manage`.

## Deployment to Netlify

1. Build the frontend application:

```bash
cd frontend_react
npm run build
```

2. Deploy to Netlify:
   - Drag and drop the `build` folder from `frontend_react/` into Netlify
   - Or connect your Git repository for automatic deployments

### Netlify Configuration

For automatic deployments from Git, add these build settings in Netlify:

- **Build command**: `cd frontend_react && npm run build`
- **Publish directory**: `frontend_react/build`
- **Environment variables**: Add your Sanity credentials

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

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

### Backend (`backend_sanity/package.json`)

- `sanity start` - Start Sanity studio
- `sanity build` - Build for production

## License

This project is unlicensed. Contact the author for usage permissions.

## Author

**Joel Plotnik**

- Email: joelplotnik@gmail.com
- Portfolio: https://joelplotnik.com/

---

**Note**: Make sure to configure your Sanity environment variables before running the application.
