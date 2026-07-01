#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
const root = process.cwd();
const site = path.join(root, 'site');
const errors = [];
const requiredRoutes = ['from-loop-to-rsi-lab.html','loop-to-rsi.html','rsi.html','agi-alpha-rsi-lab.html','rsi-governance-console.html','sovereign-invention-governance-lab.html','deterministic-invention-os-lab.html','move37-breakthrough-lab.html','omni-search-control-lab.html'];
const requiredJson = ['from-loop-to-rsi-v32-manifest.json','deterministic-invention-pipeline-v32.json','omni-search-control-boundary-v32.json','move37-breakthrough-dossier-v32.json','rsi-operational-dashboard-schema-v32.json','architect-validator-council-charter-v32.json','from-loop-to-rsi-transition-map-v32.json','from-loop-to-rsi-demo-bundle.json','rsi-source-document-index-v32.json','goalos-public-demo-labs-v22-v32.json'];
const requiredPhrases = ['From Loop','RSI','deterministic invention','Search control','outcome authority','Move-37','No ungoverned','data-goalos-legal-rail="v12"'];
const blocked = [/<form\b/i,/<input\b/i,/<textarea\b/i,/<select\b/i,/document\.cookie/i,/localStorage\b/i,/sessionStorage\b/i,/google-analytics/i,/gtag\(/i,/plausible/i,/connect\s+wallet/i,/live\s+(escrow|staking|mainnet\s+settlement)/i,/guaranteed\s+(return|profit|yield|roi)/i,/contact@montreal\.ai/i];
for (const r of requiredRoutes) {
  const p = path.join(site, r);
  if (!fs.existsSync(p)) { errors.push(`Missing route ${r}`); continue; }
  const t = fs.readFileSync(p, 'utf8');
  if (t.length < 6500) errors.push(`${r} is too thin (${t.length} bytes)`);
  if ((t.match(/data-goalos-legal-rail="v12"/g)||[]).length !== 1) errors.push(`${r} must contain exactly one v12 legal rail`);
  if ((t.match(/<footer\b/gi)||[]).length !== 1) errors.push(`${r} must contain exactly one footer`);
  for (const phrase of requiredPhrases) if (!t.includes(phrase)) errors.push(`${r} missing phrase ${phrase}`);
  for (const re of blocked) if (re.test(t)) errors.push(`${r} contains blocked fragment ${re}`);
}
for (const j of requiredJson) {
  const p = path.join(site, j);
  if (!fs.existsSync(p)) { errors.push(`Missing JSON ${j}`); continue; }
  try { JSON.parse(fs.readFileSync(p, 'utf8')); } catch (e) { errors.push(`${j} is invalid JSON: ${e.message}`); }
}
const manifest = fs.existsSync(path.join(site, 'from-loop-to-rsi-v32-manifest.json')) ? JSON.parse(fs.readFileSync(path.join(site, 'from-loop-to-rsi-v32-manifest.json'), 'utf8')) : {};
if (!Array.isArray(manifest.stages) || manifest.stages.length !== 8) errors.push('Manifest must define 8 RSI stages.');
if (!Array.isArray(manifest.gates) || manifest.gates.length < 5) errors.push('Manifest must define at least 5 gates.');
const pipeline = fs.existsSync(path.join(site, 'deterministic-invention-pipeline-v32.json')) ? JSON.parse(fs.readFileSync(path.join(site, 'deterministic-invention-pipeline-v32.json'), 'utf8')) : {};
if (!pipeline.summary || !pipeline.summary.includes('Target')) errors.push('Pipeline summary missing Target stage.');
const pdfs = ['research/rsi/AGI_Alpha_RSI_Sovereign_v0.pdf','research/rsi/AGI_Alpha_RSI_Sovereign_Strategy_Brief_v0.pdf'];
for (const pdf of pdfs) if (!fs.existsSync(path.join(site, pdf))) console.warn(`Warning: optional source PDF missing: ${pdf}`);
if (errors.length) { console.error('GoalOS From Loop to RSI v32 gate: FAIL'); errors.slice(0, 80).forEach(e => console.error('- ' + e)); process.exit(1); }
console.log('GoalOS From Loop to RSI v32 gate PASS.');
