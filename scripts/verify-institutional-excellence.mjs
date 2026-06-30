#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const site = path.join(root, 'site');
const failures = [];
const fail = message => failures.push(message);
const read = file => fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';

const requiredDocs = [
  'README.md',
  'AGENTS.md',
  'CONTRIBUTING.md',
  'SECURITY.md',
  'SUPPORT.md',
  'docs/INDEX.md',
  'docs/START_HERE.md',
  'docs/EXECUTIVE_BRIEF.md',
  'docs/DEMO_CATALOG.md',
  'docs/REPOSITORY_MAP.md',
  'docs/ARCHITECTURE.md',
  'docs/VERIFICATION.md',
  'docs/PUBLIC_SITE_OPERATIONS.md',
  'docs/CODEX_RUNBOOK.md',
  'docs/CLAIM_BOUNDARY.md',
  'docs/AGIALPHA_EXTERNAL_TOKEN_BOUNDARY.md',
  'docs/GLOSSARY.md',
  'docs/FAQ.md',
  'docs/RELEASE_CHECKLIST.md',
  'docs/INSTITUTIONAL_EXCELLENCE_REPORT.md',
  'docs/CROSS_REPO_HANDOFF.md'
];

for (const file of requiredDocs) {
  if (!fs.existsSync(path.join(root, file))) fail(`required documentation file missing: ${file}`);
}

const readme = read(path.join(root, 'README.md'));
for (const phrase of [
  '30-second explanation',
  'Best first clicks',
  'Six Signoff gates',
  'What this repository does not do',
  'What would prove more',
  'What would falsify'
]) {
  if (!readme.includes(phrase)) fail(`README missing expected section/phrase: ${phrase}`);
}

const requiredRoutes = [
  'index.html',
  'public-demo-labs.html',
  'goalos-public-demo-labs.html',
  'action-graph-authority-lab.html',
  'human-authority-action-lab.html',
  'proof-carrying-artifact-lab.html',
  'evolution-ledger-lab.html',
  'independent-replay-lab.html',
  'replay-council-lab.html',
  'claim-promotion-lab.html',
  'proofzero-planning-lab.html',
  'evidence-reanalyze-lab.html',
  'mission-foundry-lab.html',
  'curriculum-lab.html',
  'process-evidence-lab.html',
  'process-trace-lab.html'
];

for (const route of requiredRoutes) {
  const file = path.join(site, route);
  if (!fs.existsSync(file)) { fail(`required public route missing: ${route}`); continue; }
  const html = read(file);
  if (!/no (forms|inputs|uploads|wallets|payments)|No (forms|inputs|uploads|wallets|payments)/.test(html)) {
    fail(`${route} missing visible public-safe boundary language`);
  }
}

const implementationRisks = [
  /ethereum\.request\s*\(\s*\{\s*method:\s*['"]eth_requestAccounts['"]/,
  /wallet_addEthereumChain/,
  /eth_sendTransaction/,
  /<input\s+type=["']file["']/i,
  /<form\s+[^>]*action=/i,
  /document\.cookie\s*=/,
  /gtag\s*\(/,
  /googletagmanager\.com/,
  /plausible\.io/,
  /posthog/i
];

for (const route of requiredRoutes) {
  const file = path.join(site, route);
  if (!fs.existsSync(file)) continue;
  const html = read(file);
  for (const pattern of implementationRisks) {
    if (pattern.test(html)) fail(`${route} contains prohibited public implementation pattern: ${pattern}`);
  }
}

const manifestPath = path.join(site, 'goalos-public-demo-labs-v22-v27.json');
if (!fs.existsSync(manifestPath)) fail('v22-v27 global manifest missing');
else {
  const manifest = JSON.parse(read(manifestPath));
  if (manifest.posture?.valueMoved !== 0) fail('v22-v27 manifest must record zero value moved');
  if ((manifest.labs || []).length !== 6) fail('v22-v27 manifest must list exactly six labs');
}

if (failures.length) {
  console.error('Institutional excellence gate FAILED');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Institutional excellence gate PASS');
