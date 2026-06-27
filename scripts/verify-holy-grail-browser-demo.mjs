#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import childProcess from 'node:child_process';
const root = process.cwd();
const siteDir = path.join(root, 'site');
function fail(msg){ console.error('Holy Grail Browser Demo v6 gate: FAIL'); console.error('- ' + msg); process.exit(1); }
function read(rel){ return fs.readFileSync(path.join(siteDir, rel), 'utf8'); }
function exists(rel){ return fs.existsSync(path.join(siteDir, rel)); }
if(!fs.existsSync(siteDir)) fail('site/ is missing. Run the builders first.');
const required = ['holy-grail.html','proof-run-001.html','proof-gated-work-machine.html','compounding-loop.html','holy-grail-demo-bundle.json','holy-grail-browser-manifest.json','assets/holy-grail-v6.css','assets/holy-grail-v6.js'];
for(const rel of required) if(!exists(rel)) fail(`Missing ${rel}`);
const files=[];
function walk(dir){ for(const ent of fs.readdirSync(dir,{withFileTypes:true})){ const p=path.join(dir,ent.name); if(ent.isDirectory()) walk(p); else if(/\.(html|js|css|json|txt|svg)$/i.test(p)) files.push(p); }}
walk(siteDir);
const publicText = files.map(f=>`\n--- ${path.relative(siteDir,f)} ---\n`+fs.readFileSync(f,'utf8')).join('\n');
for(const rel of ['holy-grail.html','proof-run-001.html','compounding-loop.html']){
  const h = read(rel);
  if(h.length < 9000) fail(`${rel} is too thin for a flagship browser demo.`);
  for(const marker of ['No sign-in','No input','No upload','No wallet','No cookies','No analytics','proof loop','Evidence Docket']){
    if(!h.toLowerCase().includes(marker.toLowerCase())) fail(`${rel} missing marker: ${marker}`);
  }
}
for(const bad of [/<form\b/i, /<input\b/i, /<textarea\b/i, /<select\b/i, /document\.cookie|localStorage|sessionStorage/i, /walletconnect|connect wallet|metamask/i, /contact@montreal\.ai/i, /achieved\s+(agi|asi|superintelligence)/i, /guaranteed\s+(roi|return|profit|yield)/i, /mainnet settlement is live|staking is live|escrow is live/i]){
  if(bad.test(publicText)) fail(`Blocked public marker matched: ${bad}`);
}
if(!publicText.includes('info@quebec.ai')) fail('info@quebec.ai must appear in the public site.');
const index = exists('index.html') ? read('index.html') : '';
if(index && !index.includes('goalos-holy-grail-rail')) fail('homepage missing Holy Grail rail.');
if(index){
  const rail = index.indexOf('goalos-holy-grail-rail');
  const footer = index.search(/<footer\b/i);
  if(footer >= 0 && rail > footer) fail('Holy Grail homepage rail appears after footer.');
}
try { childProcess.execFileSync(process.execPath, ['--check', path.join(siteDir,'assets/holy-grail-v6.js')], {stdio:'pipe'}); }
catch(e){ fail('Browser JS syntax check failed: ' + (e.stderr?.toString() || e.message)); }
const js = read('assets/holy-grail-v6.js');
for(const marker of ['requestAnimationFrame','downloadBundle','renderDocket']){
  if(!js.includes(marker)) fail(`Browser JS missing marker: ${marker}`);
}
const bundle = JSON.parse(read('holy-grail-demo-bundle.json'));
if(!bundle.missionContract || !bundle.evidenceDocket || !bundle.verifierReport || !bundle.receipt) fail('Demo bundle missing required proof artifacts.');
if(bundle.receipt.noValueMoved !== true) fail('Demo receipt must state noValueMoved true.');
console.log('Holy Grail Browser Demo v6 gate: PASS');
console.log(`Scanned ${files.length} public files. No forms, inputs, uploads, wallets, cookies, analytics, unsupported claims, or value movement.`);
