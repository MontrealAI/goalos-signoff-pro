#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
const run = script => {
  if (!fs.existsSync(script)) { console.log(`skip missing ${script}`); return; }
  const r = spawnSync(process.execPath, [script], { stdio: 'inherit' });
  if (r.status !== 0) process.exit(r.status || 1);
};
run('scripts/build-goalos-production-site.mjs');
run('scripts/build-goalos-signoff-public-labs-v22-v30.mjs');
console.log('GoalOS Signoff Pro institutional website build v22-v30 PASS');
