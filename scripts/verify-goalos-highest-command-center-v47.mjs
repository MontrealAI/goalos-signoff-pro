#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
const ROOT=process.cwd();
const SITE=path.join(ROOT,'site');
const fail=[];
function exists(rel){return fs.existsSync(path.join(SITE,rel))}
function read(rel){return exists(rel)?fs.readFileSync(path.join(SITE,rel),'utf8'):''}
function walk(dir){let out=[]; if(!fs.existsSync(dir))return out; for(const e of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,e.name); if(e.isDirectory()) out=out.concat(walk(p)); else if(/\.(html|js)$/i.test(e.name)) out.push(p)} return out}
const required=['index.html','goalos-universal-command-center.html','ask-goalos.html','use-cases.html','all-pages.html','agialpha-48-contract-atlas.html','contracts/index.html','goalos-v47-route-catalog.json','goalos-v47-use-cases.json','assets/goalos-v47-command.css','assets/goalos-v47-command.js'];
for(const r of required) if(!exists(r)) fail.push(`Missing ${r}`);
const home=read('index.html');
for(const phrase of ['Tell GoalOS what you want','What should GoalOS take care of','Mission 001','Benchmark-ready proof','48-contract','Solved use case']) if(!home.includes(phrase)) fail.push(`Homepage missing phrase: ${phrase}`);
if(!home.includes('role="textbox"')) fail.push('Homepage must expose command field with role textbox.');
if(home.includes('<form')||home.includes('<input')||home.includes('<textarea')||home.includes('<select')) fail.push('Homepage contains blocked native control tag.');
const use=JSON.parse(read('goalos-v47-use-cases.json')||'{"useCases":[]}');
if(!Array.isArray(use.useCases)||use.useCases.length<10) fail.push('Expected at least 10 solved use cases.');
const route=JSON.parse(read('goalos-v47-route-catalog.json')||'{"routes":[]}');
if(!Array.isArray(route.routes)||route.routes.length<50) fail.push(`Expected route catalog to preserve at least 50 pages, found ${route.routes?.length||0}.`);
const contractPages=fs.existsSync(path.join(SITE,'contracts'))?fs.readdirSync(path.join(SITE,'contracts')).filter(f=>f.endsWith('.html')):[];
if(contractPages.length<49) fail.push(`Expected contracts index plus 48 contract pages, found ${contractPages.length}.`);
const files=walk(SITE);
const blocked=[/<form\b/i,/<input\b/i,/<textarea\b/i,/<select\b/i,/window\.ethereum|ethereum\.request|WalletConnect/i,/api\.openai\.com|anthropic\.com|generativelanguage\.googleapis\.com/i,/document\.cookie\s*=/i,/localStorage|sessionStorage/i,/fetch\(\s*["']https?:\/\//i];
for(const file of files){const rel=path.relative(SITE,file).replaceAll(path.sep,'/'); const txt=fs.readFileSync(file,'utf8'); for(const re of blocked){if(re.test(txt)) fail.push(`${rel} contains blocked fragment ${re}`)} if(file.endsWith('.html')){const rails=(txt.match(/data-goalos-legal-rail="v12"/g)||[]).length; const foot=(txt.match(/<footer\b/gi)||[]).length; if(rails!==1) fail.push(`${rel} must contain exactly one v12 legal rail`); if(foot!==1) fail.push(`${rel} must contain exactly one footer`);}}
if(fail.length){console.error('GoalOS v47 highest command center verification FAIL'); fail.slice(0,80).forEach(x=>console.error('- '+x)); process.exit(1)}
console.log(`GoalOS v47 highest command center verification PASS: ${route.routes.length} routes, ${use.useCases.length} solved use cases, ${contractPages.length} contract pages.`);
