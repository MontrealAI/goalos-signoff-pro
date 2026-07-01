#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
const root = process.cwd();
const site = path.join(root, 'site');
const required = [
  'index.html','public-demo-labs.html','goalos-v22-v35-command-center.html','start-here.html','website-guide.html',
  'action-graph-authority-lab.html','proof-carrying-artifact-lab.html','independent-replay-lab.html','proofzero-planning-lab.html','mission-foundry-lab.html','process-evidence-lab.html',
  'blockchain-credibility-lab.html','blockchain-proof-mandate-lab.html','proof-before-settlement-research-lab.html','executive-ai-proof-console.html','from-loop-to-rsi-lab.html',
  'loop-rsi-asi-superintelligence-lab.html','loop-rsi-asi-superintelligence-control-tower-lab.html','loop-rsi-asi-superintelligence-mission-simulator-lab.html',
  'assets/goalos-v30-v34-premium-ux.js','assets/goalos-v35-worldclass-companion.css','goalos-v22-v35-route-catalog.json','goalos-v22-v35-experience-audit.json'
];
let failures = [];
for (const rel of required) if (!fs.existsSync(path.join(site, rel))) failures.push('Missing '+rel);
const index = fs.readFileSync(path.join(site,'index.html'),'utf8');
const labs = fs.readFileSync(path.join(site,'public-demo-labs.html'),'utf8');
const js = fs.readFileSync(path.join(site,'assets/goalos-v30-v34-premium-ux.js'),'utf8');
if (/v22-v30|v22–v30/.test(index)) failures.push('Homepage still contains stale v22-v30 language.');
if (!/v22[–-]v35/.test(labs)) failures.push('Public demo hub does not advertise v22-v35.');
for (const v of ['v22','v23','v24','v25','v26','v27','v28','v29','v30','v31','v32','v33','v34','v35']) if (!labs.includes(v)) failures.push('Public demo hub missing '+v);
if (js.includes('enhancePageSpotlight') || js.includes('gx-premium-spotlight')) failures.push('Premium JS still injects the large top spotlight.');
if (!js.includes('Guided console') || !js.includes('Command Center')) failures.push('Premium JS missing compact guided console/command center navigation.');
const htmlFiles = fs.readdirSync(site).filter(f=>f.endsWith('.html'));
for (const file of htmlFiles) {
  const h = fs.readFileSync(path.join(site,file),'utf8');
  if (/<form\b|<input\b|<textarea\b/i.test(h)) failures.push(file+' contains form/input/textarea.');
  if (!h.includes('no uploads') && !h.includes('No uploads') && !h.includes('no text inputs')) failures.push(file+' missing visible public-safe boundary language.');
}
const catalog = JSON.parse(fs.readFileSync(path.join(site,'goalos-v22-v35-route-catalog.json'),'utf8'));
if (!catalog.labs || catalog.labs.length !== 14) failures.push('Route catalog should contain exactly 14 labs.');
if (failures.length) { console.error('GoalOS v22-v35 world-class website verification FAILED'); for (const f of failures) console.error(' - '+f); process.exit(1); }
console.log(`GoalOS v22-v35 world-class website verification PASS: ${htmlFiles.length} HTML pages, 14 labs, compact navigator active.`);
