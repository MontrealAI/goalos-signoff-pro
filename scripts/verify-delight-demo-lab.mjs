#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const site = path.join(root, 'site');
const requiredPages = [
  'demo-lab.html',
  'autonomous-demos.html',
  'examples.html',
  'evidence-docket-demo.html',
  'verify.html',
  'start.html',
  'delight-demo-manifest.json',
  'assets/delight-demo.css',
  'assets/delight-demo.js',
  'demo-data/public-safe-missions.json'
];
const requiredText = [
  'Open demo lab',
  'no forms',
  'no uploads',
  'no cookies',
  'no analytics',
  'info@quebec.ai',
  'Evidence Docket',
  'Mission Receipt',
  'browser-local',
  'public-safe'
];
const banned = [
  'contact@montreal.ai',
  'Buy AGIALPHA from GoalOS',
  'guaranteed return',
  'profit guarantee',
  'upload your file',
  'connect wallet to continue',
  'enter your private key'
];
const errors = [];
for (const rel of requiredPages) {
  const p = path.join(site, rel);
  if (!fs.existsSync(p)) errors.push(`Missing required demo lab artifact: ${rel}`);
  else if (fs.statSync(p).size < 200 && rel.endsWith('.html')) errors.push(`Demo page too thin: ${rel}`);
}
let corpus = '';
if (fs.existsSync(site)) {
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (/\.(html|js|css|json|txt|md)$/.test(entry.name)) corpus += '\n' + fs.readFileSync(full, 'utf8');
    }
  };
  walk(site);
}
for (const text of requiredText) if (!corpus.includes(text)) errors.push(`Required public text missing: ${text}`);
for (const text of banned) if (corpus.toLowerCase().includes(text.toLowerCase())) errors.push(`Banned phrase found: ${text}`);
const demoConfig = path.join(root, 'config', 'goalos-delight-demo-lab.json');
if (!fs.existsSync(demoConfig)) errors.push('Missing config/goalos-delight-demo-lab.json');
else {
  const cfg = JSON.parse(fs.readFileSync(demoConfig, 'utf8'));
  if (!Array.isArray(cfg.demos) || cfg.demos.length < 5) errors.push('Need at least five public-safe demo missions');
  if (cfg.contactEmail !== 'info@quebec.ai') errors.push('Demo lab contact email must be info@quebec.ai');
  if (cfg.zeroDataPosture?.forms !== false || cfg.zeroDataPosture?.uploads !== false || cfg.zeroDataPosture?.analytics !== false) errors.push('Zero-data posture must explicitly disable forms, uploads, and analytics');
}
if (errors.length) {
  console.error('GoalOS Delight Demo Lab gate: FAIL');
  for (const e of errors) console.error('- ' + e);
  process.exit(1);
}
console.log('GoalOS Delight Demo Lab gate: PASS');
console.log(`Required pages: ${requiredPages.length}`);
