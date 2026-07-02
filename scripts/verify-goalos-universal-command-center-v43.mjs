import fs from 'node:fs';
import path from 'node:path';
const root = process.cwd();
const site = path.join(root, 'site');
function exists(r){return fs.existsSync(path.join(site,r))}
function read(r){return fs.readFileSync(path.join(site,r),'utf8')}
function fail(m){console.error('ERROR:',m);process.exit(1)}
const required=['index.html','goalos-universal-command-center.html','goalos-v22-v43-command-center.html','all-pages.html','agialpha-48-contract-atlas.html','contracts/index.html','goalos-v43-route-catalog.json','goalos-v43-knowledge.json','assets/goalos-v43-command-center.css','assets/goalos-v43-command-center.js'];
for(const r of required) if(!exists(r)) fail(`Missing ${r}`);
const catalog=JSON.parse(read('goalos-v43-route-catalog.json'));
const knowledge=JSON.parse(read('goalos-v43-knowledge.json'));
if(!Array.isArray(catalog.pages)||catalog.pages.length<50) fail(`Route catalog too small: ${catalog.pages?.length}`);
if(!Array.isArray(knowledge.topics)||knowledge.topics.length<80) fail(`Knowledge map too small: ${knowledge.topics?.length}`);
const contractPages=catalog.pages.filter(p=>p.route.startsWith('contracts/')&&p.route.endsWith('.html'));
if(contractPages.length<49) fail(`Expected 48 contract pages plus index; found ${contractPages.length}`);
const home=read('index.html');
for(const phrase of ['Tell GoalOS what you','What should GoalOS take care of','48-contract','Mission 001','No uploads']) if(!home.includes(phrase)) fail(`Homepage missing phrase: ${phrase}`);
const js=read('assets/goalos-v43-command-center.js');
for(const bad of ['api.openai.com','anthropic.com','window.ethereum','ethereum.request','localStorage.setItem','document.cookie']) if(js.includes(bad)) fail(`Unsafe browser-side behavior: ${bad}`);
const htmlFiles=[]; function walk(d){for(const ent of fs.readdirSync(d,{withFileTypes:true})){const p=path.join(d,ent.name); if(ent.isDirectory()) walk(p); else if(ent.name.endsWith('.html')) htmlFiles.push(p)}} walk(site);
let broken=[]; for(const p of catalog.pages){if(!exists(p.route)) broken.push(p.route)}; if(broken.length) fail(`Catalog references missing pages: ${broken.slice(0,10).join(', ')}`);
console.log(`GoalOS Universal Command Center v43 verification PASS: ${htmlFiles.length} HTML pages, ${contractPages.length-1} contracts, ${knowledge.topics.length} topics.`);
