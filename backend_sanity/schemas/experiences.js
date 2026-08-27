export default {
  name: 'experiences',
  title: 'Experiences',
  type: 'document',
  fields: [
    {
      name: 'order',
      title: 'Order',
      type: 'number',
      description:
        'Lower numbers appear first. The site sorts on this field, so set it ' +
        'explicitly on every entry.',
      // Was hidden and driven by sanity-plugin-order-documents, which was
      // abandoned in 2022 and never ported past Studio v2. With three
      // documents, an editable number beats reintroducing a drag-and-drop
      // plugin plus an orderRank data migration.
    },
    {
      name: 'year',
      title: 'Year',
      type: 'string',
    },
    {
      name: 'works',
      title: 'Works',
      type: 'array',
      of: [{ type: 'workExperience' }],
    },
  ],
  orderings: [
    {
      title: 'Year',
      name: 'year',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
};
