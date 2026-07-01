#!/usr/bin/env node
import {spawnSync} from 'node:child_process';
import fs from 'node:fs';
const optional = [
  'scripts/build-goalos-production-site.mjs',
  'scripts/build-goalos-signoff-public-labs-v22-v27.mjs',
  'scripts/build-blockchain-credibility-lab-page.mjs',
  'scripts/build-blockchain-proof-mandate-lab-page.mjs',
  'scripts/build-proof-before-settlement-research-lab-v30.mjs',
  'scripts/build-executive-ai-proof-console-v31.mjs',
  'scripts/build-from-loop-to-rsi-lab-v32.mjs',
  'scripts/build-loop-rsi-asi-superintelligence-console-v33.mjs'
];
for (const script of optional) {
  if (!fs.existsSync(script)) { console.log('Skipping optional script:', script); continue; }
  console.log('Running', script);
  const r = spawnSync('node', [script], {stdio:'inherit'});
  if (r.status !== 0) process.exit(r.status || 1);
}
const v = spawnSync('node', ['scripts/verify-loop-rsi-asi-superintelligence-console-v33.mjs'], {stdio:'inherit'});
if (v.status !== 0) process.exit(v.status || 1);
console.log('GoalOS Signoff Pro public labs v22-v33 global gate PASS');
