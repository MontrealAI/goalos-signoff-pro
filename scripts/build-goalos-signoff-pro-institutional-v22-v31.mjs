#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
const run = script => {
  const result = spawnSync(process.execPath, [script], { cwd: process.cwd(), stdio: 'inherit' });
  if (result.status !== 0) process.exit(result.status || 1);
};
run('scripts/build-goalos-signoff-public-labs-v22-v31.mjs');
