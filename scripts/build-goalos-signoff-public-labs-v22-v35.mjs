#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
const root = process.cwd();
const requiredUpload = [
  'scripts/build-goalos-signoff-public-labs-v22-v35.mjs',
  'scripts/build-loop-rsi-asi-superintelligence-mission-simulator-v35.mjs',
  'scripts/verify-loop-rsi-asi-superintelligence-mission-simulator-v35.mjs',
  'scripts/enhance-goalos-v30-v34-premium-experience.mjs',
  'scripts/enhance-goalos-v22-v35-institutional-command-center.mjs',
  'docs/generated-source/v35/site/loop-rsi-asi-superintelligence-mission-simulator-lab.html'
];
const missing = requiredUpload.filter(rel => !fs.existsSync(path.join(root, rel)));
if(missing.length){
  console.error('GoalOS v35 package is incomplete. Re-upload the full one-go package contents to the repository root. Missing files:');
  for(const m of missing) console.error(' - ' + m);
  process.exit(1);
}
function run(script, required=false){
  const p=path.join(root,'scripts',script);
  if(!fs.existsSync(p)){
    if(required) throw new Error('Missing required script: '+script);
    console.log('Skipping missing optional script:', script);
    return;
  }
  console.log('Running', script);
  const r=spawnSync(process.execPath,[p],{stdio:'inherit'});
  if(r.status!==0) process.exit(r.status||1);
}
run('build-goalos-production-site.mjs', true);
run('build-goalos-signoff-public-labs-v22-v27.mjs', true);
for(const script of [
  'build-blockchain-credibility-lab-page.mjs',
  'build-blockchain-proof-mandate-lab-page.mjs',
  'build-proof-before-settlement-research-lab-page.mjs',
  'build-executive-ai-proof-console-v31.mjs',
  'build-from-loop-to-rsi-lab-v32.mjs',
  'build-loop-rsi-asi-superintelligence-console-v33.mjs',
  'build-loop-rsi-asi-superintelligence-control-tower-v34.mjs',
  'enhance-goalos-v30-v34-premium-experience.mjs',
  'build-loop-rsi-asi-superintelligence-mission-simulator-v35.mjs',
  'enhance-goalos-v22-v35-institutional-command-center.mjs'
]) run(script, true);
console.log('GoalOS Signoff Pro public labs v22-v35 global build complete.');
