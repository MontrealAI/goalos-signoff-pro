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
if (fs.existsSync(path.join(root, 'scripts/build-goalos-signoff-pro-institutional-v22-v30.mjs'))) {
  run('scripts/build-goalos-signoff-pro-institutional-v22-v30.mjs');
} else if (fs.existsSync(path.join(root, 'scripts/build-goalos-signoff-public-labs-v22-v30.mjs'))) {
  run('scripts/build-goalos-signoff-public-labs-v22-v30.mjs');
} else if (fs.existsSync(path.join(root, 'scripts/build-goalos-signoff-public-labs-v22-v29.mjs'))) {
  run('scripts/build-goalos-signoff-public-labs-v22-v29.mjs');
}
run('scripts/build-executive-ai-proof-console-v31.mjs');
run('scripts/verify-executive-ai-proof-console-v31.mjs');
console.log('GoalOS Signoff Pro public labs v22-v31 global gate PASS.');
