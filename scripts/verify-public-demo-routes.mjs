#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
const site=path.join(process.cwd(),'site');
const required=['governed-decision-state-lab.html','decision-state-lab.html'];
const optional=[
 ['proof-gradient-lab.html','Proof Gradient'],['capability-compounding-lab.html','Capability Compounding'],['sovereign-experience-stream-lab.html','Sovereign Experience'],['proof-settlement-lab.html','Proof Settlement'],['public-private-proof-boundary-lab.html','Public Private Boundary']
];
let errors=[];
for(const rel of required){ const p=path.join(site,rel); if(!fs.existsSync(p)) errors.push(`${rel} missing`); else if(fs.readFileSync(p,'utf8').includes('Route Not Found')) errors.push(`${rel} is Route Not Found fallback`); }
for(const [rel,label] of optional){ const p=path.join(site,rel); if(fs.existsSync(p) && fs.readFileSync(p,'utf8').includes('Route Not Found')) errors.push(`${label} route degraded to Route Not Found`); }
if(errors.length){ console.error('GoalOS public demo route registry FAILED'); errors.forEach(e=>console.error(' - '+e)); process.exit(1); }
console.log('GoalOS public demo route registry PASS');
