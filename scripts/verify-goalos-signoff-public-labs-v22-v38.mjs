#!/usr/bin/env node
import {spawnSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd();
function run(script, required=false){const p=path.join(root,'scripts',script); if(!fs.existsSync(p)){if(required){console.error('Missing required verification script',script);process.exit(1)} console.log('Skipping optional verification script',script); return;} const r=spawnSync(process.execPath,[p],{stdio:'inherit'}); if(r.status!==0)process.exit(r.status||1);}
run('verify-agialpha-48-contract-atlas-v38.mjs',true);
run('verify-goalos-production-site.mjs');
run('verify-public-artifact-safety.mjs');
run('verify-signoff-product-protocol-ladder-v36.mjs');
run('verify-signoff-product-first-console-v37.mjs');
console.log('GoalOS Signoff Pro public labs v22-v38 global verification PASS.');
