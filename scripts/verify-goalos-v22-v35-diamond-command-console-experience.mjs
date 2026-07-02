#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
const root = process.cwd();
const site = path.join(root, 'site');
const required = [
  'index.html','public-demo-labs.html','goalos-public-demo-labs.html','goalos-v22-v35-command-center.html','website-guide.html','start-here.html','latest.html','command-center.html','experience.html','demo.html','proof-to-superintelligence.html','governed-superintelligence.html','v22-v35.html','start.html','all-labs.html','labs.html','docs.html','documentation.html',
  'action-graph-authority-lab.html','proof-carrying-artifact-lab.html','independent-replay-lab.html','proofzero-planning-lab.html','mission-foundry-lab.html','process-evidence-lab.html','blockchain-credibility-lab.html','blockchain-proof-mandate-lab.html','proof-before-settlement-research-lab.html','executive-ai-proof-console.html','from-loop-to-rsi-lab.html','loop-rsi-asi-superintelligence-lab.html','loop-rsi-asi-superintelligence-control-tower-lab.html','loop-rsi-asi-superintelligence-mission-simulator-lab.html',
  'goalos-v22-v35-route-catalog.json','goalos-v22-v35-experience-audit.json','goalos-v22-v35-diamond-command-console-manifest.json','assets/goalos-diamond-v35.css','assets/goalos-diamond-v35.js'
];
const errors=[];
function read(rel){ const p=path.join(site, rel); return fs.existsSync(p) ? fs.readFileSync(p,'utf8') : ''; }
for(const rel of required){ if(!fs.existsSync(path.join(site,rel))) errors.push(`Missing required v22-v35 diamond file: site/${rel}`); }
const home=read('index.html');
const hub=read('public-demo-labs.html');
const command=read('goalos-v22-v35-command-center.html');
const v35=read('loop-rsi-asi-superintelligence-mission-simulator-lab.html');
for(const [rel,text] of [['index.html',home],['public-demo-labs.html',hub],['goalos-v22-v35-command-center.html',command],['loop-rsi-asi-superintelligence-mission-simulator-lab.html',v35]]){
  for(const phrase of ['v22','v35','public-safe','zero value moved']) if(!text.toLowerCase().includes(phrase.toLowerCase())) errors.push(`${rel} missing phrase: ${phrase}`);
  for(const bad of ['Public site ruleNo forms','Public demonstration suite · v22-v30','nine public-safe labs','Six new proof labs','v22-v30 proof curriculum','<!-- GOALOS_V31_GLOBAL_GUIDE -->','<!-- GOALOS_V32_GLOBAL_RSI_GUIDE -->']) if(text.includes(bad)) errors.push(`${rel} contains stale fragment: ${bad}`);
  for(const re of [/<form\b/i,/<input\b/i,/<textarea\b/i,/<select\b/i,/<script\b[^>]+src=["']https?:\/\//i,/document\.cookie/i,/localStorage\b/i,/sessionStorage\b/i,/google-analytics|gtag\(|plausible|mixpanel/i]) if(re.test(text)) errors.push(`${rel} contains forbidden public fragment ${re}`);
}
const catalog = JSON.parse(read('goalos-v22-v35-route-catalog.json') || '{}');
if(!Array.isArray(catalog.labs) || catalog.labs.length !== 14) errors.push('Route catalog must contain exactly 14 labs.');
if(catalog.version !== 'v35') errors.push('Route catalog must declare latest version v35.');
for(const lab of catalog.labs || []){
  if(!lab.route || !fs.existsSync(path.join(site, lab.route))) errors.push(`Catalog lab missing route: ${lab.v || '?'} ${lab.route || ''}`);
}
const htmlFiles = fs.existsSync(site) ? fs.readdirSync(site,{recursive:true}).filter(f=>f.endsWith('.html')) : [];
let ruleNo=[];
for(const rel of htmlFiles){ const t=read(rel); if(t.includes('Public site ruleNo forms')) ruleNo.push(rel); }
if(ruleNo.length) errors.push(`Found malformed public-site rule text in: ${ruleNo.slice(0,10).join(', ')}`);
if(errors.length){ console.error('GoalOS Diamond v22-v35 command console verification FAILED'); for(const e of errors.slice(0,80)) console.error(' - '+e); process.exit(1); }
console.log(`GoalOS Diamond v22-v35 command console verification PASS: ${htmlFiles.length} HTML pages, 14 labs, complete navigation through v35.`);
