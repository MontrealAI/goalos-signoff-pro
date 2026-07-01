#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
const root = process.cwd();
const site = path.join(root, 'site');
const required = [
  'v30-v34-premium-experience.html',
  'premium-experience.html',
  'proof-to-superintelligence.html',
  'assets/goalos-v30-v34-premium-ux.css',
  'assets/goalos-v30-v34-premium-ux.js',
  'goalos-v30-v34-premium-experience-manifest.json',
  'goalos-v30-v34-experience-map.json',
  'v30-v34-premium-public-safety-boundary.json'
];
let failures = [];
for(const f of required){ if(!fs.existsSync(path.join(site,f))) failures.push(`Missing ${f}`); }
const primary = ['proof-before-settlement-research-lab.html','executive-ai-proof-console.html','from-loop-to-rsi-lab.html','loop-rsi-asi-superintelligence-lab.html','loop-rsi-asi-superintelligence-control-tower-lab.html'];
for(const f of primary){
  const p = path.join(site,f);
  if(!fs.existsSync(p)){ failures.push(`Missing primary page ${f}`); continue; }
  const html = fs.readFileSync(p,'utf8');
  for(const needle of ['goalos-v30-v34-premium-ux.css','goalos-v30-v34-premium-ux.js','data-goalos-premium-patched']) if(!html.includes(needle)) failures.push(`${f} is not premium-patched: ${needle}`);
}
const hub = fs.existsSync(path.join(site,'v30-v34-premium-experience.html')) ? fs.readFileSync(path.join(site,'v30-v34-premium-experience.html'),'utf8') : '';
for(const needle of ['No Proof. No Trust. No Settlement.','No ungoverned superintelligence','Run deterministic cycle','Build synthetic receipt']) if(!hub.includes(needle)) failures.push(`Hub missing ${needle}`);
const js = fs.existsSync(path.join(site,'assets/goalos-v30-v34-premium-ux.js')) ? fs.readFileSync(path.join(site,'assets/goalos-v30-v34-premium-ux.js'),'utf8') : '';
for(const bad of ['fetch(','XMLHttpRequest','localStorage','document.cookie','<input','<textarea','<form']) if(js.includes(bad) || hub.includes(bad)) failures.push(`Forbidden public-safe pattern present: ${bad}`);
if(failures.length){ console.error(failures.join('\n')); process.exit(1); }
console.log('GoalOS v30-v34 premium experience assurance verification PASS');
