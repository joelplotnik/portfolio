// Server-side proxy for the contact form.
//
// The browser bundle is public, so it cannot hold a Sanity token with write
// scope. This function keeps the token server-side and is the only thing that
// writes `contact` documents. SANITY_TOKEN is deliberately NOT prefixed with
// REACT_APP_ — Create React App inlines every REACT_APP_* var into the bundle.

const sanityClient = require('@sanity/client');

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_LENGTH = { name: 100, email: 254, message: 5000 };

// Built lazily, not at module scope: @sanity/client throws on missing config
// as soon as it is constructed, which would crash the whole function on import
// and mask the clear error below with an opaque 502.
const buildClient = () =>
  sanityClient({
    projectId:
      process.env.SANITY_PROJECT_ID || process.env.REACT_APP_SANITY_PROJECT_ID,
    dataset: process.env.SANITY_DATASET || 'production',
    apiVersion: '2022-02-01',
    token: process.env.SANITY_TOKEN,
    useCdn: false,
  });

const json = (statusCode, body) => ({
  statusCode,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
});

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return json(405, { error: 'Method not allowed.' });
  }

  const projectId =
    process.env.SANITY_PROJECT_ID || process.env.REACT_APP_SANITY_PROJECT_ID;
  if (!process.env.SANITY_TOKEN || !projectId) {
    console.error(
      'Contact form misconfigured. SANITY_TOKEN set:',
      Boolean(process.env.SANITY_TOKEN),
      '| projectId set:',
      Boolean(projectId),
    );
    return json(500, { error: 'The contact form is not configured.' });
  }

  let payload;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch (err) {
    return json(400, { error: 'Invalid request body.' });
  }

  // This endpoint is public, so revalidate everything. The client-side checks
  // in Footer.jsx are for fast feedback only and are trivially bypassed.
  const name = String(payload.name || '').trim();
  const email = String(payload.email || '').trim();
  const message = String(payload.message || '').trim();

  if (!name || !email || !message) {
    return json(400, { error: 'Please fill in all fields.' });
  }
  if (!EMAIL_PATTERN.test(email)) {
    return json(400, { error: 'Please enter a valid email address.' });
  }

  const tooLong = Object.entries({ name, email, message }).find(
    ([field, value]) => value.length > MAX_LENGTH[field],
  );
  if (tooLong) {
    return json(400, { error: `Your ${tooLong[0]} is too long.` });
  }

  try {
    await buildClient().create({ _type: 'contact', name, email, message });
    return json(200, { ok: true });
  } catch (err) {
    console.error('Failed to create contact document:', err);
    return json(502, { error: 'Something went wrong. Please try again.' });
  }
};
