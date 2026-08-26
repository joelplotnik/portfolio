#!/usr/bin/env node
/**
 * Removes the legacy `imgurl` field from testimonials documents.
 *
 * rename-testimonial-imgurl.js moved the value to `imgUrl`, but `imgurl` was
 * written back afterwards so that already-deployed code — which still read the
 * old name — kept working. Once every environment runs a build that reads
 * `imgUrl`, the duplicate can go.
 *
 * ONLY run this after the deployed site reads `imgUrl`. Check with:
 *   curl -s https://joelplotnik.com/ | grep -o '/assets/index-[^"]*\.js'
 * then confirm that bundle contains `imgUrl`.
 *
 * Refuses to unset `imgurl` on any document that lacks `imgUrl`, so it cannot
 * remove the only copy of an image reference.
 *
 *   node scripts/remove-legacy-imgurl-field.js            # dry run
 *   SANITY_TOKEN=<token> node scripts/remove-legacy-imgurl-field.js --apply
 */

const { query, mutate, isApply, banner } = require('./sanity-api');

async function main() {
  banner('Remove legacy testimonials.imgurl');

  const docs = await query(
    '*[_type == "testimonials"]{_id, _rev, name, imgurl, imgUrl}',
  );

  // GROQ projects absent fields as null, so test truthiness, not `!== undefined`.
  const safe = docs.filter((d) => d.imgurl && d.imgUrl);
  const unsafe = docs.filter((d) => d.imgurl && !d.imgUrl);
  const done = docs.filter((d) => !d.imgurl);

  done.forEach((d) =>
    console.log(`    skip    ${d._id}  ${d.name} (already clean)`),
  );
  safe.forEach((d) => console.log(`    unset   ${d._id}  ${d.name}`));
  unsafe.forEach((d) =>
    console.log(`    REFUSE  ${d._id}  ${d.name} (has imgurl but no imgUrl)`),
  );

  if (unsafe.length) {
    console.error(
      '\n  ABORT: some documents would lose their only image reference.\n' +
        '  Run rename-testimonial-imgurl.js first.\n',
    );
    process.exit(1);
  }

  if (!safe.length) {
    console.log('\n  Nothing to do.\n');
    return;
  }

  if (!isApply()) {
    console.log(
      `\n  Would unset imgurl on ${safe.length} document(s). Re-run with --apply.\n`,
    );
    return;
  }

  const result = await mutate(
    safe.map((d) => ({
      patch: { id: d._id, ifRevisionID: d._rev, unset: ['imgurl'] },
    })),
  );
  console.log(`\n  Cleaned ${result.results.length} document(s).\n`);
}

main().catch((err) => {
  console.error('\n  FAILED:', err.message, '\n');
  process.exit(1);
});
