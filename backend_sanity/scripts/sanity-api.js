// Minimal Sanity HTTP helpers for one-off maintenance scripts.
// Deliberately dependency-free: Node 18 has global fetch, and these scripts
// should not need the Studio's dependency tree installed to run.

const fs = require('fs');
const path = require('path');

const { api } = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'sanity.json'), 'utf8'),
);

const PROJECT_ID = process.env.SANITY_PROJECT_ID || api.projectId;
const DATASET = process.env.SANITY_DATASET || api.dataset;
const API_VERSION = 'v2022-02-01';
const BASE = `https://${PROJECT_ID}.api.sanity.io/${API_VERSION}/data`;

function requireToken() {
  const token = process.env.SANITY_TOKEN;
  if (!token) {
    console.error(
      'SANITY_TOKEN is not set. Create a token with Editor permissions at\n' +
        'https://www.sanity.io/manage, then re-run with:\n\n' +
        '  SANITY_TOKEN=<token> node scripts/<script>.js --apply\n',
    );
    process.exit(1);
  }
  return token;
}

async function query(groq) {
  const url = `${BASE}/query/${DATASET}?query=${encodeURIComponent(groq)}`;
  const res = await fetch(url);
  if (!res.ok)
    throw new Error(`Query failed: ${res.status} ${await res.text()}`);
  return (await res.json()).result;
}

async function mutate(mutations) {
  const res = await fetch(`${BASE}/mutate/${DATASET}?returnIds=true`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${requireToken()}`,
    },
    body: JSON.stringify({ mutations }),
  });
  const body = await res.text();
  if (!res.ok) throw new Error(`Mutation failed: ${res.status} ${body}`);
  return JSON.parse(body);
}

const isApply = () => process.argv.includes('--apply');

function banner(title) {
  console.log(`\n${title}`);
  console.log(`  project: ${PROJECT_ID}   dataset: ${DATASET}`);
  console.log(
    isApply()
      ? '  mode:    APPLY — this will write to the dataset\n'
      : '  mode:    DRY RUN — nothing will be written (pass --apply to execute)\n',
  );
}

module.exports = { query, mutate, isApply, banner, PROJECT_ID, DATASET };
