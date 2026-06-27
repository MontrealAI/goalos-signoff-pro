#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const site = path.join(root, 'site');
const required = [
  'multi-agent-sovereign-institution.html',
  'coordination-theatre.html',
  'proof-governed-swarm.html',
  'agent-constellation-lab.html',
  'coordination-benchmark.html',
  'coordination-manifest.json',
  'multi-agent-demo-bundle.json',
  'assets/multi-agent-institution-v2.css',
  'assets/multi-agent-institution-v2.js'
];
const banned = [
  /<form\b/i, /<input\b/i, /<textarea\b/i, /<select\b/i,
  /localStorage/i, /sessionStorage/i, /document\.cookie/i,
  /walletconnect/i, /connect wallet/i, /ethereum\.request/i,
  /gtag\(/i, /google-analytics/i, /plausible\.io/i, /segment\.com/i,
  /contact@montreal\.ai/i,
  /guaranteed\s+(return|profit|yield)/i,
  /live\s+(escrow|staking|mainnet settlement)/i,
  /achieved\s+(agi|asi)/i
];
let errors = [];
for (const rel of required) {
  const file = path.join(site, rel);
  if (!fs.existsSync(file)) errors.push(`Missing required file: ${rel}`);
  else if (fs.statSync(file).size < (rel.endsWith('.html') ? 4500 : 500)) errors.push(`File too thin: ${rel}`);
}
if (fs.existsSync(site)) {
  const files = [];
  const walk = d => { for (const e of fs.readdirSync(d, {withFileTypes:true})) { const p=path.join(d,e.name); if(e.isDirectory()) walk(p); else if(/\.(html|js|json|css)$/i.test(e.name)) files.push(p); } };
  walk(site);
  for (const file of files) {
    const rel = path.relative(site, file).replaceAll('\\','/');
    const text = fs.readFileSync(file, 'utf8');
    for (const re of banned) if (re.test(text)) errors.push(`Banned public artifact pattern ${re} in ${rel}`);
  }
  const home = path.join(site, 'index.html');
  if (fs.existsSync(home)) {
    const html = fs.readFileSync(home, 'utf8');
    const rail = html.indexOf('multi-agent-home-rail');
    const footer = html.search(/<footer\b/i);
    if (rail === -1) errors.push('Homepage rail missing: multi-agent-home-rail');
    if (rail !== -1 && footer !== -1 && rail > footer) errors.push('Homepage rail appears after footer.');
  }
  const demo = fs.readFileSync(path.join(site, 'coordination-theatre.html'), 'utf8');
  if (!demo.includes('Launch coordination cycle')) errors.push('Coordination theatre lacks launch button text.');
  if (!demo.includes('coordination-trace')) errors.push('Coordination theatre lacks visible trace surface.');
}
if (errors.length) {
  console.error('GoalOS Multi-Agent Sovereign Institution v2 gate: FAIL');
  for (const err of errors) console.error('-', err);
  process.exit(1);
}
console.log('GoalOS Multi-Agent Sovereign Institution v2 gate: PASS');
console.log(`Checked ${required.length} required files and public no-data boundaries.`);
