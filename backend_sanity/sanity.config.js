import { visionTool } from '@sanity/vision';
import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';

import { schemaTypes } from './schemas';

// Replaces the v2 sanity.json. Everything that used to be declared as "parts"
// and a plugin-name list is now plain configuration.
export default defineConfig({
  name: 'default',
  title: 'Portfolio',

  projectId: 'e612k9ar',
  dataset: 'production',

  plugins: [structureTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },
});
