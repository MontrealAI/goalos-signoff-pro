#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
function run(cmd,args){const r=spawnSync(cmd,args,{stdio:'inherit',shell:false}); if(r.status!==0) process.exit(r.status||1);}
run('node',['scripts/repair-goalos-v44-command-inputs-and-boundaries.mjs']);
run('node',['scripts/verify-goalos-universal-command-os-v44.mjs']);
console.log('GoalOS Signoff Pro public suite v22-v44 verification PASS.');
