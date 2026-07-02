#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd(); const site=path.join(root,'site');
const required=[
  'ask-goalos.html','chat.html','goalos-v22-v39-command-center.html','goalos-v39-navigator-knowledge.json','goalos-v39-autonomous-navigator-manifest.json','goalos-v39-question-route-map.json','assets/goalos-v39-navigator.css','assets/goalos-v39-navigator.js'
];
let fail=false;
for(const r of required){if(!fs.existsSync(path.join(site,r))){console.error('Missing v39 file:',r); fail=true;}}
if(fail) process.exit(1);
const k=JSON.parse(fs.readFileSync(path.join(site,'goalos-v39-navigator-knowledge.json'),'utf8'));
if((k.contracts||[]).length!==48){console.error(`Expected 48 contracts in navigator knowledge, found ${(k.contracts||[]).length}`);process.exit(1)}
if((k.topics||[]).length<70){console.error(`Expected at least 70 v39 answer routes, found ${(k.topics||[]).length}`);process.exit(1)}
const js=fs.readFileSync(path.join(site,'assets/goalos-v39-navigator.js'),'utf8').toLowerCase();
for(const banned of ['api.openai.com','anthropic.com/v1','googleapis.com','posthog','googletagmanager','plausible.io']){if(js.includes(banned)){console.error('External service marker found in navigator JS:',banned);process.exit(1)}}
const html=[]; (function walk(d){for(const e of fs.readdirSync(d,{withFileTypes:true})){const p=path.join(d,e.name); if(e.isDirectory()) walk(p); else if(e.isFile()&&p.endsWith('.html')) html.push(p)}})(site);
for(const p of [path.join(site,'index.html'),path.join(site,'public-demo-labs.html'),path.join(site,'agialpha-48-contract-atlas.html')]){
  if(fs.existsSync(p)){
    const h=fs.readFileSync(p,'utf8');
    if(!h.includes('data-goalos-v39="js"')){console.error('Missing v39 widget injection in',path.relative(site,p));process.exit(1)}
  }
}
console.log(`GoalOS Autonomous Site Navigator v39 verification PASS: ${html.length} HTML pages, ${(k.topics||[]).length} answer routes, ${(k.contracts||[]).length} contracts.`);
