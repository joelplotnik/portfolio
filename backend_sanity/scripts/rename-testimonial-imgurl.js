#!/usr/bin/env node
/**
 * Renames the `imgurl` field on testimonials documents to `imgUrl`.
 *
 * Every other schema in this project spells the field `imgUrl`; testimonials
 * was the lone lowercase outlier, which is an easy typo to make when writing
 * queries. Renaming the schema field alone would orphan the existing images,
 * so the stored documents have to be patched too.
 *
 * Safe to re-run: documents that already carry `imgUrl` are skipped.
 *
 *   node scripts/rename-testimonial-imgurl.js            # dry run
 *   SANITY_TOKEN=<token> node scripts/rename-testimonial-imgurl.js --apply
 */

const { query, mutate, isApply, banner } = require('./sanity-api');

async function main() {
  banner('Rename testimonials.imgurl -> testimonials.imgUrl');

  // Include drafts: a draft carrying the old field would otherwise be missed
  // and would reintroduce it the moment someone publishes.
  const docs = await query(
    '*[_type == "testimonials"]{_id, _rev, name, imgurl, imgUrl}',
  );

  // GROQ projects absent fields as explicit null, not undefined, so test
  // truthiness rather than `!== undefined`.
  const needing = docs.filter((d) => d.imgurl && !d.imgUrl);
  const already = docs.filter((d) => d.imgUrl);

  console.log(`  ${docs.length} testimonials document(s) found`);
  already.forEach((d) =>
    console.log(`    skip    ${d._id}  ${d.name} (already imgUrl)`),
  );
  needing.forEach((d) => console.log(`    rename  ${d._id}  ${d.name}`));

  if (!needing.length) {
    console.log('\n  Nothing to do.\n');
    return;
  }

  const mutations = needing.map((d) => ({
    patch: {
      id: d._id,
      // Optimistic concurrency: fails the whole transaction if the document
      // changed between the read above and this write.
      ifRevisionID: d._rev,
      set: { imgUrl: d.imgurl },
      unset: ['imgurl'],
    },
  }));

  if (!isApply()) {
    console.log(
      `\n  Would patch ${mutations.length} document(s). Re-run with --apply.\n`,
    );
    return;
  }

  const result = await mutate(mutations);
  console.log(`\n  Patched ${result.results.length} document(s).\n`);
}

main().catch((err) => {
  console.error('\n  FAILED:', err.message, '\n');
  process.exit(1);
});
