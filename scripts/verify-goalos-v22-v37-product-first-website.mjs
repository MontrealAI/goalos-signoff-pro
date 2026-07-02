#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd(); const site=path.join(root,'site');
const required=['index.html','public-demo-labs.html','goalos-v22-v37-command-center.html','website-guide.html','ai-research-strategy-signoff-console.html','signoff-product-protocol-ladder-lab.html','goalos-public-demo-labs-v22-v37.json','goalos-signoff-pro-site-map-v22-v37.json'];
const errors=[]; for(const rel of required) if(!fs.existsSync(path.join(site,rel))) errors.push('Missing '+rel);
const home=fs.existsSync(path.join(site,'index.html'))?fs.readFileSync(path.join(site,'index.html'),'utf8'):'';
for(const phrase of ['Know when AI work is actually done','Benchmark-ready proof','Mission 001','16 public labs','Run the v37 product console']) if(!home.includes(phrase)) errors.push('Homepage missing '+phrase);
const hub=fs.existsSync(path.join(site,'public-demo-labs.html'))?fs.readFileSync(path.join(site,'public-demo-labs.html'),'utf8'):'';
for(const phrase of ['Public demonstration suite · v22-v37','v36','v37','Every lab, one clear path']) if(!hub.includes(phrase)) errors.push('Public demo hub missing '+phrase);
const catalog=JSON.parse(fs.readFileSync(path.join(site,'goalos-public-demo-labs-v22-v37.json'),'utf8'));
if(catalog.count!==16 || catalog.labs.length!==16) errors.push('v22-v37 lab catalog should contain 16 labs');
const files=fs.readdirSync(site,{recursive:true}).filter(f=>f.endsWith('.html'));
for(const rel of files){const html=fs.readFileSync(path.join(site,rel),'utf8'); if((html.match(/data-goalos-legal-rail="v12"/g)||[]).length!==1) errors.push(`${rel}: expected exactly one legal rail`); if((html.match(/<footer\b/gi)||[]).length!==1) errors.push(`${rel}: expected exactly one footer`); if(/<form\b|<input\b|<textarea\b|<select\b|document\.cookie|localStorage|sessionStorage|google-analytics|gtag\(|walletconnect/i.test(html)) errors.push(`${rel}: contains blocked public-site fragment`);}
if(errors.length){console.error('GoalOS v22-v37 product-first website verification FAIL');errors.slice(0,100).forEach(e=>console.error(' - '+e));process.exit(1)}
console.log(`GoalOS v22-v37 product-first website verification PASS: ${files.length} HTML pages checked.`);
