#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
const ROOT=process.cwd(); const SITE=path.join(ROOT,'site');
const required=['index.html','goalos-universal-command-os-v44.html','goalos-v22-v44-command-center.html','all-pages.html','goalos-v44-knowledge.json','goalos-v44-route-catalog.json','assets/goalos-v44-command-os.css','assets/goalos-v44-command-os.js','agialpha-48-contract-atlas.html','mission-001.html'];
const errors=[];
function walk(dir,out=[]){if(!fs.existsSync(dir))return out;for(const e of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,e.name);if(e.isDirectory())walk(p,out);else out.push(p)}return out}
function rel(p){return path.relative(SITE,p).replaceAll('\\','/');}
for(const r of required) if(!fs.existsSync(path.join(SITE,r))) errors.push(`Missing ${r}`);
const htmls=walk(SITE).filter(f=>f.endsWith('.html'));
if(htmls.length<80) errors.push(`Expected at least 80 HTML pages after v44, found ${htmls.length}`);
for(const f of htmls){const h=fs.readFileSync(f,'utf8'); const r=rel(f); if((h.match(/data-goalos-legal-rail="v12"/g)||[]).length!==1) errors.push(`${r} must contain exactly one v12 legal rail`); if((h.match(/<footer\b/gi)||[]).length!==1) errors.push(`${r} must contain exactly one footer`); if(/<form\b|<input\b|<textarea\b|<select\b/i.test(h)) errors.push(`${r} still contains blocked form/input/textarea/select tag`);}
const main=fs.existsSync(path.join(SITE,'goalos-universal-command-os-v44.html'))?fs.readFileSync(path.join(SITE,'goalos-universal-command-os-v44.html'),'utf8'):'';
for(const phrase of ['Tell GoalOS what you want','role="textbox"','contenteditable="true"','Intent','Mission','Proof','Route','48-contract rail map','synthetic Mission Receipt']) if(!main.includes(phrase)) errors.push(`v44 command page missing phrase: ${phrase}`);
const index=fs.existsSync(path.join(SITE,'index.html'))?fs.readFileSync(path.join(SITE,'index.html'),'utf8'):'';
for(const phrase of ['Tell GoalOS what you want','Benchmark-ready proof','Mission 001']) if(!index.includes(phrase)) errors.push(`Homepage missing ${phrase}`);
let k={topics:[]}; try{k=JSON.parse(fs.readFileSync(path.join(SITE,'goalos-v44-knowledge.json'),'utf8'));}catch(e){errors.push('Knowledge JSON is not parseable');}
if(!Array.isArray(k.topics)||k.topics.length<50) errors.push('Knowledge map must contain at least 50 topics');
const contracts=walk(path.join(SITE,'contracts')).filter(f=>f.endsWith('.html'));
if(contracts.length && contracts.length<49) errors.push(`Expected contracts index + 48 contract pages when contracts directory exists; found ${contracts.length}`);
if(errors.length){console.error('GoalOS Universal Command OS v44 verification FAILED'); for(const e of errors.slice(0,120)) console.error('- '+e); process.exit(1);}console.log(`GoalOS Universal Command OS v44 verification PASS: ${htmls.length} HTML pages, ${k.topics.length} topics, ${Math.max(0,contracts.length-1)} contracts indexed.`);
