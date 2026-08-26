// Fails fast with a readable message when the active Node is too old.
//
// Vite 8 imports `styleText` from node:util, which only exists in newer Node.
// Without this guard, `npm start` on Node 18 dies with a SyntaxError pointing
// at a file inside rolldown, which gives no hint that the Node version is the
// problem. nvm's `default` alias is easy to leave on an older version, so this
// is a realistic mistake rather than a theoretical one.

const REQUIRED = [20, 19];
const [major, minor] = process.versions.node.split('.').map(Number);

if (major < REQUIRED[0] || (major === REQUIRED[0] && minor < REQUIRED[1])) {
  const want = REQUIRED.join('.');
  console.error(
    `\n  This project needs Node >=${want}; you are on ${process.versions.node}.\n` +
      `  The repo pins the version in .nvmrc, so from anywhere in the project:\n\n` +
      `      nvm use\n\n` +
      `  To stop this recurring in new shells:\n\n` +
      `      nvm alias default 22\n`,
  );
  process.exit(1);
}
