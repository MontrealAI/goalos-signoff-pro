#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
const site = path.join(process.cwd(),'site');
const routes = ["loop-rsi-asi-superintelligence-mission-simulator-lab.html", "asi-mission-simulator.html", "sovereign-asi-flight-simulator.html", "proof-gated-asi-simulator.html", "superintelligence-simulation-console.html", "rsi-to-asi-control-simulator.html", "goalos-asi-mission-control.html", "loop-rsi-asi-v35.html", "no-ungoverned-asi.html", "v35.html"];
const artifacts = ["asi-mission-simulator-v35-manifest.json", "asi-mission-simulator-scenarios-v35.json", "asi-mission-simulator-state-machine-v35.json", "asi-mission-simulator-kpi-dashboard-v35.json", "asi-mission-simulator-public-safe-boundary-v35.json", "asi-mission-simulator-engagement-map-v35.json", "asi-mission-simulator-move37-dossier-v35.json", "asi-mission-simulator-synthetic-receipt-v35.json", "asi-mission-simulator-demo-bundle-v35.json", "goalos-public-demo-labs-v22-v35.json", "goalos-signoff-pro-site-map-v22-v35.json"];
function fail(msg){ console.error('ERROR:', msg); process.exit(1); }
for(const r of routes){ const p=path.join(site,r); if(!fs.existsSync(p)) fail('Missing route '+r); const html=fs.readFileSync(p,'utf8'); if(!html.includes('Loop → RSI → ASI')) fail('Missing marker in '+r); if(/<\s*(form|input|textarea|select)/i.test(html)) fail('Forbidden form/input element in '+r); }
for(const a of artifacts){ const p=path.join(site,a); if(!fs.existsSync(p)) fail('Missing artifact '+a); try{ JSON.parse(fs.readFileSync(p,'utf8')); }catch(e){ fail('Invalid JSON '+a+': '+e.message); } }
const m=JSON.parse(fs.readFileSync(path.join(site,'asi-mission-simulator-v35-manifest.json'),'utf8'));
if(m.publicSafety.valueMoved!==0) fail('valueMoved must be zero');
if(m.publicSafety.externalAiCalls!==false) fail('externalAiCalls must be false');
if(m.publicSafety.claimedAsi!==false) fail('claimedAsi must be false');
console.log('GoalOS Loop → RSI → ASI Superintelligence Mission Simulator Lab v35 verification PASS:', routes.length, 'routes,', artifacts.length, 'artifacts.');
