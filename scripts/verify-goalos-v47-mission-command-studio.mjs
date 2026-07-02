#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd(), site=path.join(root,'site');
function read(rel){return fs.readFileSync(path.join(site,rel),'utf8')}
function walk(dir){let out=[]; if(!fs.existsSync(dir)) return out; for(const e of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,e.name); if(e.isDirectory()) out=out.concat(walk(p)); else out.push(p)} return out}
const required=['index.html','goalos-mission-command-studio.html','goalos-universal-command-center.html','ask-goalos.html','all-pages.html','use-cases.html','goalos-v47-route-catalog.json','goalos-v47-use-cases.json','assets/goalos-v47-mission-command.css','assets/goalos-v47-mission-command.js'];
const errors=[];
for(const rel of required) if(!fs.existsSync(path.join(site,rel))) errors.push(`Missing required v47 file: ${rel}`);
const home=fs.existsSync(path.join(site,'index.html'))?read('index.html'):'';
for(const needle of ['Tell GoalOS what you want','GoalOS will take care of','Best solved use cases','AI Research & Strategy Signoff','DAO Grant Milestone Proof','Understand the 48 Mainnet Trust Rails','RSI / Move-37 Breakthrough Dossier']) if(!home.includes(needle)) errors.push(`Homepage missing: ${needle}`);
const cat=JSON.parse(read('goalos-v47-route-catalog.json'));
const cases=JSON.parse(read('goalos-v47-use-cases.json'));
if(cat.routeCount<20) errors.push(`Route catalog too small: ${cat.routeCount}`);
if(cases.useCases.length<8) errors.push('Expected at least 8 solved use cases');
const bad=/(<form\b|<input\b|<textarea\b|<select\b|localStorage|sessionStorage|document\.cookie\s*=|fetch\(\s*["']https?:\/\/|api\.openai\.com|anthropic\.com|generativelanguage\.googleapis\.com|WalletConnect|window\.ethereum|ethereum\.request|gtag\(|google-analytics|plausible)/i;
for(const f of walk(site).filter(f=>/\.(html|js)$/i.test(f))){const rel=path.relative(site,f).replaceAll(path.sep,'/'); const t=fs.readFileSync(f,'utf8'); if(bad.test(t)) errors.push(`${rel} contains public-safety blocked pattern`);}
for(const f of walk(site).filter(f=>f.endsWith('.html'))){const rel=path.relative(site,f).replaceAll(path.sep,'/'); const t=fs.readFileSync(f,'utf8'); const rail=(t.match(/data-goalos-legal-rail="v12"/g)||[]).length; const foot=(t.match(/data-goalos-footer="canonical"/g)||[]).length; if(rail!==1) errors.push(`${rel} must contain exactly one v12 legal rail`); if(foot!==1) errors.push(`${rel} must contain exactly one canonical footer`);}
if(errors.length){console.error('GoalOS v47 mission command verification FAIL'); for(const e of errors.slice(0,80)) console.error(' - '+e); if(errors.length>80) console.error(` - ... ${errors.length-80} more`); process.exit(1);} 
console.log(`GoalOS v47 mission command verification PASS: ${cat.routeCount} routes, ${cases.useCases.length} solved use cases.`);
