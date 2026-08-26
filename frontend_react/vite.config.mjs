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
  css: {
    preprocessorOptions: {
      scss: {
        // Vite 5 still defaults to sass's legacy renderSync API, which warns on
        // every file. dart-sass 1.99 supports the modern compiler API.
        api: 'modern-compiler',
      },
    },
  },
  server: {
    port: 3000,
  },
});
