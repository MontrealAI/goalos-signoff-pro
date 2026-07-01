#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root = process.cwd();
const siteDir = path.join(root, 'site');
const failures = [];
const fail = msg => failures.push(msg);
const read = file => fs.readFileSync(file, 'utf8');
const manifestPath = path.join(siteDir, 'goalos-public-demo-labs-v22-v29.json');
let manifest = null;
if (!fs.existsSync(manifestPath)) fail('goalos-public-demo-labs-v22-v29.json missing');
else {
  try { manifest = JSON.parse(read(manifestPath)); }
  catch (err) { fail(`goalos-public-demo-labs-v22-v29.json invalid JSON: ${err.message}`); }
}
const htmlRoutes = new Set(['public-demo-labs.html', 'goalos-public-demo-labs.html', 'blockchain-proof-mandate-lab.html']);
const jsonArtifacts = new Set(['goalos-public-demo-labs-v22-v29.json', 'blockchain-proof-mandate-demo-bundle.json']);
if (manifest) {
  if (manifest.posture?.valueMoved !== 0) fail('v22-v29 global manifest valueMoved must be 0');
  if (!manifest.labs?.some(l => l.version === 'v29' && l.route === 'blockchain-proof-mandate-lab.html')) fail('v22-v29 manifest must include v29 proof mandate lab');
  for (const route of manifest.routes || []) if (route.endsWith('.html')) htmlRoutes.add(route);
  for (const lab of manifest.labs || []) {
    if (lab.route) htmlRoutes.add(lab.route);
    for (const alias of lab.aliases || []) htmlRoutes.add(alias);
    for (const artifact of lab.artifacts || []) jsonArtifacts.add(artifact);
  }
}
const forbiddenTokens = ['guaranteed project success', 'investment recommendation', 'live mainnet settlement is live', 'custody of user funds activated'];
for (const route of [...htmlRoutes].sort()) {
  const file = path.join(siteDir, route);
  if (!fs.existsSync(file)) { fail(`${route} missing`); continue; }
  const html = read(file);
  if (!/No forms|No inputs|No uploads|no forms|no inputs|no uploads/.test(html)) fail(`${route} missing public-safe no-form/no-input/no-upload language`);
  if (/Route Not Found|not part of the receipt map/i.test(html)) fail(`${route} contains fallback route text`);
  for (const token of forbiddenTokens) if (html.includes(token)) fail(`${route} contains forbidden public-site token: ${token}`);
  const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);
  for (const [i, code] of scripts.entries()) {
    try { new vm.Script(code, { filename: `${route}:inline-script-${i}` }); }
    catch (err) { fail(`${route} inline script ${i} syntax error: ${err.message}`); }
  }
}
for (const artifact of [...jsonArtifacts].sort()) {
  const file = path.join(siteDir, artifact);
  if (!fs.existsSync(file)) { fail(`${artifact} missing`); continue; }
  try { JSON.parse(read(file)); }
  catch (err) { fail(`${artifact} is not valid JSON: ${err.message}`); }
}
const indexPath = path.join(siteDir, 'index.html');
if (!fs.existsSync(indexPath)) fail('index.html missing');
else {
  const index = read(indexPath);
  if (!index.includes('GOALOS_PUBLIC_LABS_V22_V29_START')) fail('index.html missing v22-v29 spotlight marker');
  if (!index.includes('blockchain-proof-mandate-lab.html')) fail('index.html missing link to blockchain-proof-mandate-lab.html');
}
if (failures.length) {
  console.error('GoalOS Signoff Pro public labs v22-v29 global gate FAILED');
  for (const f of failures) console.error(`- ${f}`);
  process.exit(1);
}
console.log(`GoalOS Signoff Pro public labs v22-v29 global gate PASS (${htmlRoutes.size} HTML routes, ${jsonArtifacts.size} JSON artifacts)`);
