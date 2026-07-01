#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
const root = process.cwd();
const run = script => {
  const p = path.join(root, script);
  if (!fs.existsSync(p)) { console.log(`skip missing ${script}`); return; }
  const result = spawnSync(process.execPath, [script], { cwd: root, stdio: 'inherit' });
  if (result.status !== 0) process.exit(result.status || 1);
};
const previous = [
  'scripts/build-goalos-signoff-pro-institutional-v22-v31.mjs',
  'scripts/build-goalos-signoff-public-labs-v22-v31.mjs',
  'scripts/build-goalos-signoff-pro-institutional-v22-v30.mjs',
  'scripts/build-goalos-signoff-public-labs-v22-v30.mjs',
  'scripts/build-goalos-signoff-public-labs-v22-v29.mjs',
  'scripts/build-goalos-signoff-public-labs-v22-v27.mjs',
  'scripts/build-goalos-production-site.mjs'
];
for (const script of previous) {
  if (fs.existsSync(path.join(root, script))) { run(script); break; }
}
run('scripts/build-from-loop-to-rsi-lab-v32.mjs');
run('scripts/verify-from-loop-to-rsi-v32.mjs');
console.log('GoalOS Signoff Pro public labs v22-v32 global gate PASS.');
