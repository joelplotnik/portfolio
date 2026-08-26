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

const fs = require('fs');
const path = require('path');

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

  // Deletion is irreversible and this project's Sanity plan keeps no document
  // history, so dump the raw documents first. The content also survives in the
  // `experiences` documents, but this makes the originals recoverable.
  const backupDir = path.join(__dirname, 'backups');
  fs.mkdirSync(backupDir, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = path.join(backupDir, `experience-orphans-${stamp}.json`);
  fs.writeFileSync(backupPath, JSON.stringify(orphans, null, 2) + '\n');
  console.log(`\n  Backed up to ${path.relative(process.cwd(), backupPath)}`);

  const result = await mutate(orphans.map((d) => ({ delete: { id: d._id } })));
  console.log(`  Deleted ${(result.results || []).length} document(s).\n`);
}

main().catch((err) => {
  console.error('\n  FAILED:', err.message, '\n');
  process.exit(1);
});
