#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
const root = process.cwd();
const site = path.join(root, 'site');
const required = [
  'index.html','public-demo-labs.html','goalos-v22-v35-command-center.html','start-here.html','latest.html','command-center.html','experience.html','demo.html','proof-to-superintelligence.html','governed-superintelligence.html','v22-v35.html',
  'action-graph-authority-lab.html','proof-carrying-artifact-lab.html','independent-replay-lab.html','proofzero-planning-lab.html','mission-foundry-lab.html','process-evidence-lab.html','blockchain-credibility-lab.html','blockchain-proof-mandate-lab.html','proof-before-settlement-research-lab.html','executive-ai-proof-console.html','from-loop-to-rsi-lab.html','loop-rsi-asi-superintelligence-lab.html','loop-rsi-asi-superintelligence-control-tower-lab.html','loop-rsi-asi-superintelligence-mission-simulator-lab.html',
  'goalos-public-demo-labs-v22-v35.json','goalos-signoff-pro-site-map-v22-v35.json','v22-v35-institutional-command-center-manifest.json','asi-mission-simulator-v35-manifest.json'
];
const errors = [];
for (const rel of required) if (!fs.existsSync(path.join(site, rel))) errors.push(`Missing required route/artifact: site/${rel}`);
const flagship = required.filter(f => f.endsWith('.html'));
const forbidden = [
  [/<form\b/i, 'form element'], [/<input\b[^>]*(type=["']?(text|file|email|password|tel|search|url)|>)/i, 'text/file input'], [/google-analytics|gtag\(|googletagmanager|segment\.com|mixpanel|plausible/i, 'analytics tracker'], [/<script\b[^>]+src=["']https?:\/\//i, 'third-party external script'], [/checkout|payment button|pay now/i, 'payment language'], [/enter (personal|confidential|customer) data|upload your/i, 'data request']
];
for (const rel of flagship) {
  const text = fs.existsSync(path.join(site, rel)) ? fs.readFileSync(path.join(site, rel), 'utf8') : '';
  if (!/public-safe|public safe|No inputs|No public|browser-local|deterministic/i.test(text)) errors.push(`Missing public-safe boundary copy: site/${rel}`);
  for (const [re, label] of forbidden) if (re.test(text)) errors.push(`Forbidden ${label} in site/${rel}`);
}
if (errors.length) { console.error('Site route integrity FAIL'); for (const e of errors) console.error(' - ' + e); process.exit(1); }
console.log(`Site route integrity PASS (${required.length} routes/artifacts and ${flagship.length} flagship pages checked).`);
