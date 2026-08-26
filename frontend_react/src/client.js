import sanityClient from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

// Read-only and unauthenticated. The production dataset allows public reads,
// and this client ships in the browser bundle, so it must never hold a token.
// The contact form's write goes through netlify/functions/submit-contact.js.
export const client = sanityClient({
  projectId: process.env.REACT_APP_SANITY_PROJECT_ID,
  dataset: "production",
  apiVersion: "2022-02-01",
  useCdn: true,
});

const builder = imageUrlBuilder(client);

export const urlFor = (source) => builder.image(source);
