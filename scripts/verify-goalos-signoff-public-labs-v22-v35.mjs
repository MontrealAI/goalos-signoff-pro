#!/usr/bin/env node
import {spawnSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd();
function run(script, required=false){
  const p=path.join(root,'scripts',script);
  if(!fs.existsSync(p)){
    if(required){ console.error('Missing required verification script', script); process.exit(1); }
    console.log('Skipping missing optional verification script:', script);
    return;
  }
  const r=spawnSync(process.execPath,[p],{stdio:'inherit'});
  if(r.status!==0) process.exit(r.status||1);
}
run('verify-loop-rsi-asi-superintelligence-console-v33.mjs', true);
run('verify-loop-rsi-asi-superintelligence-control-tower-v34.mjs', true);
run('verify-goalos-v30-v34-premium-experience.mjs', true);
run('verify-loop-rsi-asi-superintelligence-mission-simulator-v35.mjs', true);
run('verify-goalos-v22-v35-institutional-command-center.mjs', true);
run('verify-public-artifact-safety.mjs');
console.log('GoalOS Signoff Pro public labs v22-v35 global verification PASS.');
