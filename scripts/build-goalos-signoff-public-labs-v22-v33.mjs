#!/usr/bin/env node
import {spawnSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd();
const candidates=['build-goalos-signoff-public-labs-v22-v32.mjs','build-goalos-signoff-public-labs-v22-v31.mjs','build-goalos-signoff-public-labs-v22-v30.mjs','build-goalos-signoff-public-labs-v22-v29.mjs','build-goalos-signoff-public-labs-v22-v27.mjs'];
for(const name of candidates){const p=path.join(root,'scripts',name); if(fs.existsSync(p)){console.log('Running prior public labs builder:',name); const r=spawnSync(process.execPath,[p],{stdio:'inherit'}); if(r.status) process.exit(r.status); break;}}
const build=path.join(root,'scripts','build-loop-rsi-asi-superintelligence-console-v33.mjs');
const verify=path.join(root,'scripts','verify-loop-rsi-asi-superintelligence-console-v33.mjs');
for(const p of [build,verify]){const r=spawnSync(process.execPath,[p],{stdio:'inherit'}); if(r.status) process.exit(r.status)}
console.log('GoalOS Signoff Pro public labs v22-v33 global build complete with Loop → RSI → ASI v33.');
