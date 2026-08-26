#!/usr/bin/env node
/**
 * Deletes documents of type `experience` (singular).
 *
 * The schema defines `experiences` (plural). The singular type is a leftover
 * from an earlier schema version: the documents are duplicates of entries that
 * now live as `experiences`, they are invisible in the Studio because no schema
 * matches them, and nothing references them.
 *
 * Prints each document in full before deleting so the content can be checked.
 *
 *   node scripts/delete-orphaned-experience-docs.js            # dry run
 *   SANITY_TOKEN=<token> node scripts/delete-orphaned-experience-docs.js --apply
 */

const { query, mutate, isApply, banner } = require('./sanity-api');

async function main() {
  banner('Delete orphaned `experience` documents');

  const orphans = await query('*[_type == "experience"]');
  if (!orphans.length) {
    console.log('  None found. Nothing to do.\n');
    return;
  }

  // Refuse to delete anything still referenced, even though the schema is gone.
  const referenced = await query(
    'count(*[references(*[_type == "experience"]._id)])',
  );
  if (referenced > 0) {
    console.error(
      `  ABORT: ${referenced} document(s) still reference these. Not deleting.\n`,
    );
    process.exit(1);
  }

  console.log(
    `  ${orphans.length} orphaned document(s), 0 inbound references:\n`,
  );
  orphans.forEach((d) => {
    const years = d.year ? ` year=${d.year}` : '';
    const works = (d.works || []).map((w) => `${w.name} @ ${w.company}`);
    console.log(`    ${d._id}${years}`);
    works.forEach((w) => console.log(`        - ${w}`));
  });

  if (!isApply()) {
    console.log(
      `\n  Would delete ${orphans.length} document(s). Re-run with --apply.\n`,
    );
    return;
  }

  const result = await mutate(orphans.map((d) => ({ delete: { id: d._id } })));
  console.log(`\n  Deleted ${(result.results || []).length} document(s).\n`);
}

main().catch((err) => {
  console.error('\n  FAILED:', err.message, '\n');
  process.exit(1);
});
