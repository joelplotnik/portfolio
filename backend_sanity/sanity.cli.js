import { defineCliConfig } from 'sanity/cli';

// Separate from sanity.config.js on purpose: this is what the `sanity` CLI
// reads for build/deploy/dataset commands, while sanity.config.js configures
// the Studio itself. v2 kept both in sanity.json.
export default defineCliConfig({
  api: {
    projectId: 'e612k9ar',
    dataset: 'production',
  },
});
