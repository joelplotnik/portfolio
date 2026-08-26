export default {
  name: 'workExperience',
  title: 'Work Experience',
  // Embedded only, inside the `works` array of an `experiences` document.
  // This was declared as a `document`, which made it show up in the Studio as
  // a standalone creatable type even though nothing ever created one. Verified
  // against the dataset: there are no top-level workExperience documents, so
  // switching to `object` orphans nothing.
  type: 'object',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
    },
    {
      name: 'company',
      title: 'Company',
      type: 'string',
    },
    {
      name: 'desc',
      title: 'Description',
      type: 'string',
    },
  ],
};
