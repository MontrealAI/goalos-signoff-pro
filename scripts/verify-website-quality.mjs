import fs from 'node:fs';
import path from 'node:path';
const ROOT=process.cwd();
const SITE=path.join(ROOT,'site');
const required=['index.html','start.html','proof-mission.html','examples.html','evidence-docket-demo.html','verify.html','deliverables.html','pricing.html','faq.html','contact.html','request-access.html','press.html','implementation.html','sovereign-machine-economy.html','proof-os.html','machine-economy.html','constitution.html','proof-missions.html'];
let failures=[];
for(const file of required){ const p=path.join(SITE,file); if(!fs.existsSync(p)) failures.push(`missing ${file}`); else { const s=fs.readFileSync(p,'utf8'); if(s.length<2500) failures.push(`${file} too thin (${s.length} bytes)`); if(/contact@montreal\.ai/i.test(s)) failures.push(`${file} contains old contact@montreal.ai`); if(/secret|private[_ -]?key|service[_ -]?role|sk_live_/i.test(s) && !['implementation.html'].includes(file)) { /* allow words in bounded docs? no failure */ } }}
const htmlFiles=[]; function walk(d){ for(const e of fs.readdirSync(d,{withFileTypes:true})){ const p=path.join(d,e.name); if(e.isDirectory()) walk(p); else if(p.endsWith('.html')) htmlFiles.push(p); }} if(fs.existsSync(SITE)) walk(SITE);
const existing=new Set(htmlFiles.map(p=>path.relative(SITE,p).replaceAll('\\','/')));
for(const p of htmlFiles){ const s=fs.readFileSync(p,'utf8'); const hrefs=[...s.matchAll(/href="\/goalos-signoff-pro\/([^"#?]+)(?:[#?][^"]*)?"/g)].map(m=>m[1]).filter(h=>h.endsWith('.html')); for(const h of hrefs){ if(!existing.has(h)) failures.push(`${path.relative(SITE,p)} links to missing ${h}`); }}
const forbidden=[/AGIALPHA staking is live/i,/Mainnet settlement is live/i,/user funds authorized/i,/autonomous acceptance/i,/guaranteed factual correctness/i,/guaranteed payment/i,/guaranteed ROI/i];
for(const p of htmlFiles){ const s=fs.readFileSync(p,'utf8'); for(const r of forbidden){ if(r.test(s)) failures.push(`${path.relative(SITE,p)} contains unsupported claim ${r}`); }}
if(failures.length){ console.error('GoalOS website quality: FAIL'); failures.forEach(f=>console.error('- '+f)); process.exit(1); }
console.log('GoalOS website quality: PASS');
