#!/usr/bin/env node
import {spawnSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd();
function run(script, required=false){const p=path.join(root,'scripts',script); if(!fs.existsSync(p)){if(required){console.error('Missing required verification script:',script);process.exit(1)} console.log('Skipping optional verification:',script); return;} const r=spawnSync(process.execPath,[p],{stdio:'inherit'}); if(r.status!==0)process.exit(r.status||1);}
run('verify-signoff-product-protocol-ladder-v36.mjs', true);
run('verify-signoff-product-first-console-v37.mjs', true);
run('verify-goalos-v22-v37-product-first-website.mjs', true);
run('verify-public-artifact-safety.mjs');
console.log('GoalOS Signoff Pro public labs v22-v37 global verification PASS.');
