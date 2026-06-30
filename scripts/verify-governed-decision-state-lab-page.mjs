#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const site = path.join(root, 'site');
const required = [
  'governed-decision-state-lab.html',
  'decision-state-lab.html',
  'governed-decision-state-demo-bundle.json',
  'governed-decision-state-certificate.json',
  'action-graph-demo.json',
  'verifier-mesh-report.json',
  'contradiction-register.json',
  'decision-state-manifest.json'
];
const htmlRoutes = ['governed-decision-state-lab.html','decision-state-lab.html'];
const legacyNeedle = 'No forms · no uploads';
const strictNeedle = 'No forms · no inputs · no uploads';
const forbidden = ['<form','<input','<textarea','<select','connect wallet','walletconnect','localStorage','sessionStorage','document.cookie','gtag(','mailto:','contact@montreal.ai'];
const must = ['Not a report','decision state','Run decision state','claims matrix','risk ledger','Action graph'];
const errors = [];
const exists = (rel) => fs.existsSync(path.join(site, rel));
const read = (rel) => fs.readFileSync(path.join(site, rel), 'utf8');

if (!fs.existsSync(site)) errors.push('site/ missing');
for (const rel of required) if (!exists(rel)) errors.push(`${rel} missing`);

if (!errors.length) {
  for (const rel of htmlRoutes) {
    const html = read(rel);
    const lower = html.toLowerCase();
    if (html.includes('Route Not Found')) errors.push(`${rel} contains Route Not Found fallback`);
    if ((html.match(/data-goalos-legal-rail="v12"/g) || []).length !== 1) errors.push(`${rel} must contain exactly one v12 legal rail`);
    if ((html.match(/data-goalos-footer="canonical"/g) || []).length !== 1) errors.push(`${rel} must contain exactly one canonical footer`);
    if ((html.match(/<footer\b/gi) || []).length !== 1) errors.push(`${rel} must contain exactly one footer element`);
    for (const bad of forbidden) if (lower.includes(bad.toLowerCase())) errors.push(`${rel} contains forbidden public-site marker: ${bad}`);
    for (const phrase of must) if (!lower.includes(phrase.toLowerCase())) errors.push(`${rel} missing required phrase: ${phrase}`);
    if (!html.includes(legacyNeedle)) errors.push(`${rel} missing required phrase: ${legacyNeedle}`);
    if (!html.includes(strictNeedle)) errors.push(`${rel} missing required phrase: ${strictNeedle}`);
  }
  for (const rel of ['governed-decision-state-demo-bundle.json','governed-decision-state-certificate.json','action-graph-demo.json','verifier-mesh-report.json','contradiction-register.json','decision-state-manifest.json']) {
    const txt = read(rel);
    try { JSON.parse(txt); } catch (e) { errors.push(`${rel} is not valid JSON: ${e.message}`); continue; }
    const lower = txt.toLowerCase();
    for (const bad of ['guaranteed return','guaranteed profit','achieved agi','achieved asi','superintelligence achieved','active mainnet settlement','mainnet settlement is live','contact@montreal.ai']) {
      if (lower.includes(bad)) errors.push(`${rel} contains unsupported phrase: ${bad}`);
    }
  }
  const cert = JSON.parse(read('governed-decision-state-certificate.json'));
  if (cert.valueMoved !== 0) errors.push('decision certificate must not move value');
}

if (errors.length) {
  console.error('GoalOS Governed Decision State Lab v18.5 gate FAILED');
  for (const e of errors) console.error(' - ' + e);
  process.exit(1);
}
console.log('GoalOS Governed Decision State Lab v18.5 gate PASS');
