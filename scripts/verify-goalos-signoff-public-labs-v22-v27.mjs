#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import vm from 'node:vm';

const root = process.cwd();
const siteDir = path.join(root, 'site');
const manifestPath = path.join(siteDir, 'goalos-public-demo-labs-v22-v27.json');
const failures = [];
const fail = msg => failures.push(msg);
const read = file => fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';

const verifierScripts = [
  'scripts/verify-action-graph-authority-lab-page.mjs',
  'scripts/verify-proof-carrying-artifact-lab-page.mjs',
  'scripts/verify-independent-replay-lab-page.mjs',
  'scripts/verify-proofzero-planning-lab-page.mjs',
  'scripts/verify-mission-foundry-lab-page.mjs',
  'scripts/verify-process-evidence-lab-page.mjs'
];

for (const script of verifierScripts) {
  const p = path.join(root, script);
  if (!fs.existsSync(p)) { fail(`${script} missing`); continue; }
  const result = spawnSync(process.execPath, [script], { cwd: root, encoding: 'utf8' });
  if (result.status !== 0) {
    fail(`${script} failed\n${result.stdout || ''}${result.stderr || ''}`.trim());
  } else if (result.stdout.trim()) {
    console.log(result.stdout.trim());
  }
}

if (!fs.existsSync(siteDir)) fail('site directory missing');
if (!fs.existsSync(manifestPath)) fail('goalos-public-demo-labs-v22-v27.json missing');
let manifest = null;
try { manifest = JSON.parse(read(manifestPath)); }
catch (err) { fail(`manifest JSON invalid: ${err.message}`); }

const forbiddenTokens = ['<form', '<input', '<textarea', '<select', 'localStorage', 'sessionStorage', 'document.cookie', 'gtag(', 'GoogleAnalyticsObject', 'mailto:'];
const unsupportedPhrases = ['guaranteed return', 'guaranteed ROI', 'guaranteed profit', 'achieved AGI', 'achieved ASI', 'mainnet settlement is live', 'live staking activated', 'production certification is complete', 'external audit complete'];
const htmlRoutes = new Set();
const jsonArtifacts = new Set(['goalos-public-demo-labs-v22-v27.json']);

if (manifest) {
  if (manifest.posture?.valueMoved !== 0) fail('global manifest valueMoved must be 0');
  for (const route of manifest.routes || []) {
    if (route.endsWith('.html')) htmlRoutes.add(route);
    if (route.endsWith('.json')) jsonArtifacts.add(route);
  }
  for (const lab of manifest.labs || []) {
    if (!lab.route || !lab.title || !lab.version) fail(`lab manifest entry incomplete: ${JSON.stringify(lab)}`);
    if (lab.route) htmlRoutes.add(lab.route);
    for (const alias of lab.aliases || []) htmlRoutes.add(alias);
    for (const artifact of lab.artifacts || []) jsonArtifacts.add(artifact);
  }
}

const requiredPrimary = [
  'public-demo-labs.html',
  'goalos-public-demo-labs.html',
  'action-graph-authority-lab.html',
  'proof-carrying-artifact-lab.html',
  'independent-replay-lab.html',
  'proofzero-planning-lab.html',
  'mission-foundry-lab.html',
  'process-evidence-lab.html'
];
for (const route of requiredPrimary) htmlRoutes.add(route);

for (const route of [...htmlRoutes].sort()) {
  const file = path.join(siteDir, route);
  if (!fs.existsSync(file)) { fail(`${route} missing`); continue; }
  const html = read(file);
  if (/Route Not Found|not part of the receipt map/i.test(html)) fail(`${route} contains fallback route text`);
  if (!/No forms|No inputs|No uploads|no forms|no inputs|no uploads/.test(html)) fail(`${route} missing public-safe no-form/no-input/no-upload language`);
  for (const token of forbiddenTokens) if (html.includes(token)) fail(`${route} contains forbidden public-site token: ${token}`);
  for (const phrase of unsupportedPhrases) if (html.toLowerCase().includes(phrase.toLowerCase())) fail(`${route} contains unsupported phrase: ${phrase}`);
  const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);
  for (const [i, code] of scripts.entries()) {
    try { new vm.Script(code, { filename: `${route}:inline-script-${i}` }); }
    catch (err) { fail(`${route} inline script ${i} syntax error: ${err.message}`); }
  }
}

for (const artifact of [...jsonArtifacts].sort()) {
  const file = path.join(siteDir, artifact);
  if (!fs.existsSync(file)) { fail(`${artifact} missing`); continue; }
  const text = read(file);
  try { JSON.parse(text); }
  catch (err) { fail(`${artifact} is not valid JSON: ${err.message}`); }
  for (const phrase of unsupportedPhrases) if (text.toLowerCase().includes(phrase.toLowerCase())) fail(`${artifact} contains unsupported phrase: ${phrase}`);
}

const indexPath = path.join(siteDir, 'index.html');
if (!fs.existsSync(indexPath)) fail('index.html missing');
else {
  const index = read(indexPath);
  for (const route of ['public-demo-labs.html', 'action-graph-authority-lab.html', 'proof-carrying-artifact-lab.html', 'independent-replay-lab.html', 'proofzero-planning-lab.html', 'mission-foundry-lab.html', 'process-evidence-lab.html']) {
    if (!index.includes(route)) fail(`index.html missing link to ${route}`);
  }
  if (!index.includes('GOALOS_PUBLIC_LABS_V22_V27_START')) fail('index.html missing global public labs marker');
}

if (failures.length) {
  console.error('GoalOS Signoff Pro public labs v22-v27 global gate FAILED');
  for (const f of failures) console.error(`- ${f}`);
  process.exit(1);
}
console.log(`GoalOS Signoff Pro public labs v22-v27 global gate PASS (${htmlRoutes.size} HTML routes, ${jsonArtifacts.size} JSON artifacts)`);
