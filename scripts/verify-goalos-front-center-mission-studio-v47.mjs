#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd();
const site=path.join(root,'site');
const required=['index.html','goalos-front-center.html','goalos-command-studio.html','ask-goalos.html','goalos-use-cases.html','all-pages.html','goalos-v47-knowledge.json','goalos-v47-route-catalog.json','goalos-v47-use-cases.json','assets/goalos-v47-mission-studio.css','assets/goalos-v47-mission-studio.js'];
const errors=[];
const exists=rel=>fs.existsSync(path.join(site,rel));
for(const rel of required) if(!exists(rel)) errors.push(`Missing ${rel}`);
function walk(d){const out=[]; if(!fs.existsSync(d)) return out; for(const e of fs.readdirSync(d,{withFileTypes:true})){const p=path.join(d,e.name); if(e.isDirectory()) out.push(...walk(p)); else if(/\.(html|js)$/i.test(e.name)) out.push(p);} return out;}
const files=walk(site);
const html=files.filter(p=>p.endsWith('.html'));
if(html.length<50) errors.push(`Expected at least 50 HTML pages, found ${html.length}`);
const bad=[[/<form\b/i,'form tag'],[/<input\b/i,'input tag'],[/<textarea\b/i,'textarea tag'],[/<select\b/i,'select tag'],[/document\.cookie/i,'cookie API'],[/localStorage|sessionStorage/i,'browser storage'],[/api\.openai\.com|anthropic\.com|generativelanguage\.googleapis\.com/i,'external AI endpoint'],[/fetch\(\s*["']https?:\/\//i,'external fetch'],[/window\.ethereum|ethereum\.request|WalletConnect/i,'wallet API']];
for(const file of files){
  const rel=path.relative(site,file).replaceAll(path.sep,'/');
  const txt=fs.readFileSync(file,'utf8');
  for(const [re,label] of bad) if(re.test(txt)) errors.push(`${rel} contains ${label}`);
  if(file.endsWith('.html')){
    const legal=(txt.match(/data-goalos-legal-rail="v12"/g)||[]).length;
    const footer=(txt.match(/<footer\b/gi)||[]).length;
    if(legal!==1) errors.push(`${rel} has ${legal} legal rails`);
    if(footer!==1) errors.push(`${rel} has ${footer} footers`);
  }
}
const index=exists('index.html')?fs.readFileSync(path.join(site,'index.html'),'utf8'):'';
for(const phrase of ['Tell GoalOS what you want','What do you want GoalOS to take care of','Mission 001','Benchmark-ready proof','Solved use cases']) if(!index.includes(phrase)) errors.push(`index missing ${phrase}`);
const useCases=exists('goalos-v47-use-cases.json')?JSON.parse(fs.readFileSync(path.join(site,'goalos-v47-use-cases.json'),'utf8')):[];
if(!Array.isArray(useCases) || useCases.length<10) errors.push('Expected at least 10 solved use cases');
const knowledge=exists('goalos-v47-knowledge.json')?JSON.parse(fs.readFileSync(path.join(site,'goalos-v47-knowledge.json'),'utf8')):{};
if(!Array.isArray(knowledge.topics) || knowledge.topics.length<12) errors.push('Knowledge map missing topics');
if(!Array.isArray(knowledge.routes) || knowledge.routes.length<50) errors.push('Knowledge map missing route catalog');
for(const route of ['ai-research-strategy-signoff-console.html','agialpha-48-contract-atlas.html','mission-001.html','loop-rsi-asi-superintelligence-mission-simulator-lab.html']) {
  if(!JSON.stringify(knowledge).includes(route)) errors.push(`Knowledge map missing route ${route}`);
}
if(errors.length){console.error('GoalOS front-center mission studio v47 verification FAILED'); errors.slice(0,80).forEach(e=>console.error('- '+e)); process.exit(1);} 
console.log(`GoalOS front-center mission studio v47 verification PASS: ${html.length} HTML pages, ${useCases.length} use cases, ${knowledge.routes.length} routes.`);
