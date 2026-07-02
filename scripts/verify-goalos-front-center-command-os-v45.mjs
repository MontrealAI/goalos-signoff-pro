#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
const root = process.cwd();
const site = path.join(root, 'site');
const required = [
  'index.html',
  'goalos-universal-command-center.html',
  'goalos-v22-v45-command-center.html',
  'goalos-command-center.html',
  'tell-goalos.html',
  'chat.html',
  'ask-goalos.html',
  'all-pages.html',
  'site-map.html',
  'routes.html',
  'goalos-v45-route-catalog.json',
  'goalos-v45-knowledge.json',
  'goalos-v45-command-center-manifest.json',
  'assets/goalos-v45-command-os.css',
  'assets/goalos-v45-command-os.js'
];
const failures = [];
function exists(rel){ return fs.existsSync(path.join(site, rel)); }
function read(rel){ return exists(rel) ? fs.readFileSync(path.join(site, rel), 'utf8') : ''; }
function walk(dir){ const out=[]; if(!fs.existsSync(dir)) return out; for(const e of fs.readdirSync(dir,{withFileTypes:true})){ const fp=path.join(dir,e.name); if(e.isDirectory()) out.push(...walk(fp)); else if(e.isFile() && e.name.endsWith('.html')) out.push(fp); } return out; }
for(const rel of required) if(!exists(rel)) failures.push(`Missing ${rel}`);
const home = read('index.html');
for(const phrase of ['Tell GoalOS what you want', 'Mission 001', 'Benchmark-ready proof', '48', 'contenteditable', 'GoalOS answer']){
  if(!home.includes(phrase)) failures.push(`Homepage missing phrase: ${phrase}`);
}
for(const blocked of [/<form\b/i, /<input\b/i, /<textarea\b/i, /<select\b/i, /localStorage\b/i, /sessionStorage\b/i, /document\.cookie/i, /api\.openai\.com/i, /anthropic\.com/i, /generativelanguage\.googleapis\.com/i, /WalletConnect/i, /window\.ethereum/i]){
  if(blocked.test(home)) failures.push(`Homepage contains blocked pattern ${blocked}`);
}
const manifest = JSON.parse(read('goalos-v45-command-center-manifest.json') || '{}');
if(manifest.version !== 'v45') failures.push('Manifest version is not v45');
if(!manifest.publicSafe || manifest.publicSafe.externalAiCallsByDefault !== false || manifest.publicSafe.valueMoved !== 0) failures.push('Manifest public-safe boundary is wrong');
if((manifest.contractsIndexed || 0) < 48) failures.push('Expected at least 48 contract rails indexed');
const knowledge = JSON.parse(read('goalos-v45-knowledge.json') || '{}');
if(!Array.isArray(knowledge.scenarios) || knowledge.scenarios.length < 7) failures.push('Knowledge map missing scenario coverage');
const catalog = JSON.parse(read('goalos-v45-route-catalog.json') || '{}');
if(!Array.isArray(catalog.pages) || catalog.pages.length < 50) failures.push('Route catalog should include at least 50 pages');
const htmlFiles = walk(site);
if(htmlFiles.length < 50) failures.push(`Expected at least 50 HTML pages, found ${htmlFiles.length}`);
let launcherCount = 0;
for(const fp of htmlFiles){
  const rel=path.relative(site,fp).replaceAll(path.sep,'/');
  const html=fs.readFileSync(fp,'utf8');
  if((html.match(/data-goalos-legal-rail="v12"/g)||[]).length !== 1) failures.push(`${rel} must contain exactly one v12 legal rail`);
  if((html.match(/<footer\b/gi)||[]).length !== 1) failures.push(`${rel} must contain exactly one footer`);
  if(/<form\b|<input\b|<textarea\b|<select\b/i.test(html)) failures.push(`${rel} contains forbidden form/input/textarea/select tag`);
  if(/localStorage\b|sessionStorage\b|document\.cookie|WalletConnect|window\.ethereum|api\.openai\.com|anthropic\.com|generativelanguage\.googleapis\.com/i.test(html)) failures.push(`${rel} contains unsafe browser/API marker`);
  if(html.includes('data-goalos-v45-launcher="true"')) launcherCount++;
}
if(launcherCount < 10) failures.push('Expected floating Ask GoalOS launcher across existing pages');
if(!exists('agialpha-48-contract-atlas.html')) failures.push('48-contract atlas route missing');
if(exists('contracts/index.html')){
  const ci=read('contracts/index.html');
  if(!ci.includes('All 48 Mainnet rails')) failures.push('contracts/index.html missing 48-contract index text');
}
if(failures.length){ console.error('GoalOS Front-and-Center Command OS v45 verification FAILED'); failures.slice(0,100).forEach(f=>console.error('- '+f)); process.exit(1); }
console.log(`GoalOS Front-and-Center Command OS v45 verification PASS: ${htmlFiles.length} HTML pages, ${manifest.contractsIndexed || 48} contracts indexed, ${knowledge.scenarios.length} command scenarios.`);
