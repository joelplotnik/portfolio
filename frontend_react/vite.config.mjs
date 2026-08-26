import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  build: {
    // Netlify publishes `build`, so keep Vite's output there rather than the
    // default `dist`. Changing it would require editing netlify.toml too.
    outDir: 'build',
  },
  // Keep reading the existing REACT_APP_* variables. Renaming them to VITE_*
  // would mean re-entering them in the Netlify dashboard for no benefit;
  // VITE_* still works for anything added later.
  envPrefix: ['VITE_', 'REACT_APP_'],
  // No css.preprocessorOptions needed: Vite 8 uses dart-sass's modern compiler
  // API by default. On Vite 5 this required an explicit
  // `css.preprocessorOptions.scss.api = 'modern-compiler'` to silence the
  // legacy-js-api deprecation warning.
  server: {
    port: 3000,
  },
});
