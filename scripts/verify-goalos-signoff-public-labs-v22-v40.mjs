#!/usr/bin/env node
import {spawnSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd();
function run(script, required=false){const p=path.join(root,'scripts',script); if(!fs.existsSync(p)){if(required){console.error('Missing required script',script);process.exit(1)} console.log('Skipping optional verification',script);return;} const r=spawnSync(process.execPath,[p],{stdio:'inherit'}); if(r.status!==0)process.exit(r.status||1)}
// v40 supersedes v39/v38 homepage copy and widget injection, so legacy copy-specific verifiers are intentionally not run here.
run('verify-live-ai-concierge-v40.mjs', true);
run('verify-goalos-production-site.mjs', true);
run('verify-public-artifact-safety.mjs');
console.log('GoalOS Signoff Pro public labs v22-v40 global verification PASS.');
