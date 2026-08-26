import sanityClient from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

const projectId = import.meta.env.REACT_APP_SANITY_PROJECT_ID;

// @sanity/client throws on a missing projectId as soon as it is constructed.
// At module scope that took down the whole React tree, so a single missing
// environment variable rendered a blank page with nothing but a console error.
// Degrade instead: each section falls into its own error path and the rest of
// the site still renders.
export const isConfigured = Boolean(projectId);

if (!isConfigured) {
  console.error(
    'REACT_APP_SANITY_PROJECT_ID is not set, so CMS content cannot load. ' +
      'Set it in frontend_react/.env locally, and in Netlify under ' +
      'Site configuration -> Environment variables (Builds scope).',
  );
}

const notConfigured = () =>
  Promise.reject(new Error('Sanity client is not configured.'));

// Read-only and unauthenticated. The production dataset allows public reads,
// and this client ships in the browser bundle, so it must never hold a token.
// The contact form's write goes through netlify/functions/submit-contact.js.
export const client = isConfigured
  ? sanityClient({
      projectId,
      dataset: 'production',
      apiVersion: '2022-02-01',
      useCdn: true,
    })
  : { fetch: notConfigured, create: notConfigured };

const builder = isConfigured ? imageUrlBuilder(client) : null;

// Falls back to an empty src rather than throwing, so an unconfigured build
// renders broken images instead of crashing the page.
export const urlFor = (source) => (builder ? builder.image(source) : '');
