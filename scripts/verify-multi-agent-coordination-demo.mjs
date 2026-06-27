#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import childProcess from 'node:child_process';

const root = process.cwd();
const siteDir = path.join(root, 'site');
function fail(msg){ console.error('Multi-Agent Sovereign Institution gate: FAIL'); console.error('- ' + msg); process.exit(1); }
function exists(rel){ return fs.existsSync(path.join(siteDir, rel)); }
function read(rel){ return fs.readFileSync(path.join(siteDir, rel), 'utf8'); }
if(!fs.existsSync(siteDir)) fail('site/ is missing. Run the builders first.');
const required = [
  'multi-agent-sovereign-institution.html',
  'coordination-theatre.html',
  'proof-governed-swarm.html',
  'agent-constellation-lab.html',
  'coordination-manifest.json',
  'multi-agent-demo-bundle.json',
  'assets/multi-agent-institution.css',
  'assets/multi-agent-institution.js'
];
for(const rel of required) if(!exists(rel)) fail(`Missing ${rel}`);
const files=[];
function walk(dir){ for(const ent of fs.readdirSync(dir,{withFileTypes:true})){ const p=path.join(dir,ent.name); if(ent.isDirectory()) walk(p); else if(/\.(html|css|js|json|txt|svg)$/i.test(p)) files.push(p); } }
walk(siteDir);
const publicText = files.map(f=>`\n--- ${path.relative(siteDir,f)} ---\n` + fs.readFileSync(f,'utf8')).join('\n');
for(const rel of ['multi-agent-sovereign-institution.html','coordination-theatre.html','proof-governed-swarm.html','agent-constellation-lab.html']){
  const h = read(rel);
  if(h.length < 6400) fail(`${rel} is too thin for a flagship multi-agent demo.`);
  for(const marker of ['proof-governed','multi-agent','Evidence Docket','human authority','No forms','No upload','No wallet','No analytics']){
    if(!h.toLowerCase().includes(marker.toLowerCase())) fail(`${rel} missing marker: ${marker}`);
  }
}
for(const bad of [
  /<form\b/i,
  /<input\b/i,
  /<textarea\b/i,
  /<select\b/i,
  /document\.cookie|localStorage|sessionStorage/i,
  /walletconnect|connect wallet|metamask/i,
  /contact@montreal\.ai/i,
  /achieved\s+(agi|asi|superintelligence)/i,
  /guaranteed\s+(roi|return|profit|yield|optimality)/i,
  /mainnet settlement is live|staking is live|escrow is live/i,
  /user data collected|upload your file|paste your/i
]){
  if(bad.test(publicText)) fail(`Blocked public marker matched: ${bad}`);
}
if(!publicText.includes('info@quebec.ai')) fail('info@quebec.ai must appear in the public site.');
const index = exists('index.html') ? read('index.html') : '';
if(index && !index.includes('multi-agent-home-rail')) fail('Homepage missing multi-agent rail.');
if(index){
  const rail = index.indexOf('multi-agent-home-rail');
  const footer = index.search(/<footer\b/i);
  if(footer >= 0 && rail > footer) fail('Multi-agent homepage rail appears after footer.');
}
try { childProcess.execFileSync(process.execPath, ['--check', path.join(siteDir, 'assets', 'multi-agent-institution.js')], {stdio:'pipe'}); }
catch(e){ fail('Browser JS syntax check failed: ' + (e.stderr?.toString() || e.message)); }
const js = read('assets/multi-agent-institution.js');
for(const marker of ['requestAnimationFrame','coordination-trace','Launch coordination cycle']){
  if(!publicText.includes(marker) && !js.includes(marker)) fail(`Missing dynamic marker: ${marker}`);
}
const manifest = JSON.parse(read('coordination-manifest.json'));
if(!manifest.noUserData || !manifest.noInputs || !manifest.noValueMoved) fail('Manifest must preserve no-user-data/no-input/no-value-moved posture.');
const bundle = JSON.parse(read('multi-agent-demo-bundle.json'));
if(!bundle.mission || !bundle.constellation || !bundle.evidenceDocket || !bundle.receipt) fail('Demo bundle missing mission, constellation, evidenceDocket, or receipt.');
if(bundle.receipt.noValueMoved !== true) fail('Demo receipt must state noValueMoved true.');
console.log('Multi-Agent Sovereign Institution gate: PASS');
console.log(`Scanned ${files.length} public files. Demo is browser-local, no-input, no-user-data, and claim-bounded.`);
