#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
const site = path.join(process.cwd(), 'site');
const routes = ['goalos-v22-v35-command-center.html','command-center.html','start-here.html','latest.html','proof-to-superintelligence.html','governed-superintelligence.html','v22-v35.html'];
const required = ['loop-rsi-asi-superintelligence-mission-simulator-lab.html','loop-rsi-asi-superintelligence-control-tower-lab.html','loop-rsi-asi-superintelligence-lab.html','from-loop-to-rsi-lab.html','executive-ai-proof-console.html','proof-before-settlement-research-lab.html','blockchain-proof-mandate-lab.html','blockchain-credibility-lab.html'];
function fail(m){ console.error('ERROR:', m); process.exit(1); }
for(const r of routes){ const p=path.join(site,r); if(!fs.existsSync(p)) fail('Missing command center route '+r); const h=fs.readFileSync(p,'utf8'); if(!h.includes('One command center')) fail('Missing command center marker in '+r); if(/<\s*(form|input|textarea|select)\b/i.test(h)) fail('Forbidden form/input/select in '+r); if(!h.includes('assets/goalos-v22-v35-command-center.js') && !h.includes('assets/goalos-ultimate-v35.js')) fail('Missing command center JS asset link in '+r); }
for(const r of required){ if(!fs.existsSync(path.join(site,r))) fail('Missing required lab route '+r); }
for(const a of ['goalos-v22-v35-command-center-manifest.json','goalos-v22-v35-user-journey.json','goalos-v22-v35-premium-site-audit.json']){ const p=path.join(site,a); if(!fs.existsSync(p)) fail('Missing artifact '+a); try{ JSON.parse(fs.readFileSync(p,'utf8')); }catch(e){ fail('Invalid JSON '+a+': '+e.message); } }
const manifest = JSON.parse(fs.readFileSync(path.join(site,'goalos-v22-v35-command-center-manifest.json'),'utf8'));
if(manifest.publicSafety.valueMoved !== 0) fail('valueMoved must be zero');
if(manifest.publicSafety.noExternalAiCalls !== true) fail('noExternalAiCalls must be true');
console.log('GoalOS v22-v35 institutional command center verification PASS:', routes.length, 'routes.');
