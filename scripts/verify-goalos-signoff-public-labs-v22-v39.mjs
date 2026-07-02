#!/usr/bin/env node
import {spawnSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd(); const site=path.join(root,'site');
function exists(rel){return fs.existsSync(path.join(site,rel));}
function run(script, required=false){const p=path.join(root,'scripts',script); if(!fs.existsSync(p)){if(required){console.error('Missing required script',script);process.exit(1)} console.log('Skipping optional script',script); return;} const r=spawnSync(process.execPath,[p],{stdio:'inherit'}); if(r.status!==0) process.exit(r.status||1);}
// v39 adds a runtime chat input, so do not re-run the older v38 static-site verifier after v39 pages exist.
// Instead verify the core v38 contract-atlas objects directly, then verify the v39 navigator.
const requiredV38=['agialpha-48-contract-atlas.html','contracts/index.html','agialpha-48-contract-atlas-v38-data.json','goalos-public-demo-labs-v22-v38.json'];
for(const r of requiredV38){if(!exists(r)){console.error('Missing v38 contract-atlas dependency:',r);process.exit(1)}}
const data=JSON.parse(fs.readFileSync(path.join(site,'agialpha-48-contract-atlas-v38-data.json'),'utf8'));
if((data.contracts||[]).length!==48){console.error('Expected 48 v38 contracts, found '+((data.contracts||[]).length));process.exit(1)}
for(const c of data.contracts||[]){if(!exists(`contracts/${c.slug}.html`)){console.error('Missing v38 contract page '+c.slug);process.exit(1)}}
run('verify-autonomous-site-navigator-v39.mjs', true);
console.log('GoalOS Signoff Pro public labs v22-v39 global verification PASS.');
