#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
const site=path.join(process.cwd(),'site');
const required=['loop-rsi-asi-superintelligence-lab.html','loop-to-rsi-to-asi.html','rsi-to-asi-superintelligence.html','asi-superintelligence-console.html','superintelligence-governance-console.html','sovereign-asi-readiness-lab.html','recursive-self-improvement-to-asi-lab.html','asi-mission-control.html','invention-to-superintelligence-console.html','no-ungoverned-superintelligence.html','goalos-public-demo-labs-v22-v33.json','goalos-signoff-pro-site-map-v22-v33.json'];
const errors=[];
for(const rel of required){if(!fs.existsSync(path.join(site,rel))) errors.push(`Missing required v33 file: ${rel}`)}
const htmlPath=path.join(site,'loop-rsi-asi-superintelligence-lab.html');
if(fs.existsSync(htmlPath)){
  const html=fs.readFileSync(htmlPath,'utf8');
  for(const token of ['Loop','RSI','ASI','proof']){if(!html.toLowerCase().includes(token.toLowerCase())) errors.push(`v33 page missing expected token: ${token}`)}
  for(const bad of ['<form','<input','<textarea','type="file"','fetch(','XMLHttpRequest','document.cookie','walletconnect']){if(html.toLowerCase().includes(bad.toLowerCase())) errors.push(`Forbidden public-safe pattern in v33 HTML: ${bad}`)}
}
for(const rel of ['goalos-public-demo-labs-v22-v33.json','goalos-signoff-pro-site-map-v22-v33.json']){
  const p=path.join(site,rel); if(fs.existsSync(p)){try{JSON.parse(fs.readFileSync(p,'utf8'))}catch(e){errors.push(`Invalid JSON ${rel}: ${e.message}`)}}
}
if(errors.length){console.error(errors.join('\n')); process.exit(1)}
console.log('GoalOS v33 Loop → RSI → ASI verification PASS');
