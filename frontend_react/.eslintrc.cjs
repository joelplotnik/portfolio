module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: 'detect' } },
  plugins: ['react-refresh'],
  rules: {
    // This codebase is plain JS with no runtime type checking anywhere;
    // requiring propTypes would mean adding them purely to satisfy the linter.
    'react/prop-types': 'off',
    // Every section is exported through the AppWrap/MotionWrap HOCs, so these
    // files necessarily export non-component values. The pattern is deliberate.
    'react-refresh/only-export-components': 'off',
  },
  overrides: [
    {
      // Netlify Functions run in Node and are CommonJS, not browser ESM.
      files: ['netlify/functions/**/*.js'],
      env: { node: true, browser: false },
      parserOptions: { sourceType: 'script' },
    },
    {
      files: ['vite.config.js'],
      env: { node: true },
    },
  ],
};
