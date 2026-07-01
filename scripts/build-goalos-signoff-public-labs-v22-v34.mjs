#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
function run(script, required = false) {
  if (!fs.existsSync(script)) {
    console.log(`Skipping optional script: ${script}`);
    if (required) process.exit(1);
    return;
  }
  const res = spawnSync(process.execPath, [script], { stdio: 'inherit' });
  if (res.status !== 0) process.exit(res.status ?? 1);
}
run('scripts/build-goalos-production-site.mjs', false);
run('scripts/build-goalos-signoff-public-labs-v22-v33.mjs', false);
run('scripts/build-loop-rsi-asi-superintelligence-control-tower-v34.mjs', true);
run('scripts/verify-loop-rsi-asi-superintelligence-control-tower-v34.mjs', true);
console.log('GoalOS Signoff Pro public labs v22-v34 global build complete');
