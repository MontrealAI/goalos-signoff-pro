#!/usr/bin/env node
import {spawnSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd();
function run(script, required=false){
  const p=path.join(root,'scripts',script);
  if(!fs.existsSync(p)){ if(required){console.error('Missing required script', script); process.exit(1)}; console.log('Skipping optional script', script); return; }
  const r=spawnSync(process.execPath,[p],{stdio:'inherit'});
  if(r.status!==0) process.exit(r.status||1);
}
run('build-goalos-signoff-public-labs-v22-v39.mjs', true);
run('build-live-ai-concierge-v40.mjs', true);
run('repair-goalos-v22-v40-html-integrity.mjs', true);
console.log('GoalOS Signoff Pro public labs v22-v40 global build complete.');
