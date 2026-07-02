#!/usr/bin/env node
import {spawnSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd();
function run(script, required=false){const p=path.join(root,'scripts',script); if(!fs.existsSync(p)){if(required){console.error('Missing required script',script);process.exit(1)} console.log('Skipping optional script',script); return;} const r=spawnSync(process.execPath,[p],{stdio:'inherit'}); if(r.status!==0)process.exit(r.status||1);}
run('build-goalos-signoff-public-labs-v22-v35.mjs');
run('build-signoff-product-protocol-ladder-v36.mjs');
run('build-signoff-product-first-console-v37.mjs');
run('build-agialpha-48-contract-atlas-v38.mjs',true);
run('repair-goalos-v22-v38-html-integrity.mjs');
console.log('GoalOS Signoff Pro public labs v22-v38 global build complete.');
