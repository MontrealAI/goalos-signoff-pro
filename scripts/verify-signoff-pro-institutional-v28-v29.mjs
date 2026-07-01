#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const site = path.join(process.cwd(), 'site');
const failures = [];
const fail = m => failures.push(m);
const read = rel => fs.readFileSync(path.join(site, rel), 'utf8');
const exists = rel => fs.existsSync(path.join(site, rel));

const required = [
  'index.html','public-demo-labs.html','goalos-public-demo-labs.html','goalos-public-demo-labs-v22-v29.json','goalos-signoff-pro-site-map-v28-v29.json',
  'blockchain-credibility-lab.html','blockchain-proof-mandate-lab.html','blockchain.html','proof-package.html','proof-mandate.html','due-diligence.html','credibility-standard.html','proof-before-settlement.html','no-proof-no-settlement.html'
];
for (const rel of required) if (!exists(rel)) fail(`missing ${rel}`);

if (exists('index.html')) {
  const html = read('index.html');
  for (const phrase of ['Blockchain proves the transaction','GoalOS proves the work','No Proof. No Trust. No Settlement.','blockchain-proof-mandate-lab.html','blockchain-credibility-lab.html','GOALOS_PUBLIC_LABS_V22_V29_START']) {
    if (!html.includes(phrase)) fail(`index.html missing phrase/link: ${phrase}`);
  }
  if (html.includes('Six new proof labs for governed autonomous work.')) fail('index.html still contains outdated v22-v27 headline');
  if (html.includes('12 packet files')) fail('index.html still says 12 packet files instead of 14');
  if ((html.match(/GOALOS_PUBLIC_LABS_V22_V29_START/g) || []).length !== 1) fail('index.html must contain exactly one v22-v29 spotlight');
  if ((html.match(/data-goalos-legal-rail="v12"/g) || []).length !== 1) fail('index.html must contain exactly one v12 legal rail');
}

if (exists('goalos-public-demo-labs-v22-v29.json')) {
  try {
    const manifest = JSON.parse(read('goalos-public-demo-labs-v22-v29.json'));
    if (!manifest.labs?.some(l => l.version === 'v28')) fail('manifest missing v28');
    if (!manifest.labs?.some(l => l.version === 'v29')) fail('manifest missing v29');
    for (const route of ['blockchain.html','proof-package.html','proof-before-settlement.html']) if (!manifest.routes?.includes(route)) fail(`manifest missing short route ${route}`);
    if (manifest.posture?.valueMoved !== 0) fail('manifest valueMoved must be 0');
  } catch (err) { fail(`manifest JSON invalid: ${err.message}`); }
}

for (const rel of required.filter(r => r.endsWith('.html'))) {
  if (!exists(rel)) continue;
  const html = read(rel);
  if (/<form\b|<input\b|<textarea\b|<select\b/i.test(html)) fail(`${rel} contains form/input/select`);
  if (/connect\s+wallet|walletconnect|document\.cookie|localStorage\b|sessionStorage\b|google-analytics|gtag\(/i.test(html)) fail(`${rel} contains blocked public-site surface`);
  if (!/No forms|no forms/i.test(html) || !/No uploads|no uploads/i.test(html) || !/No wallets|no wallets/i.test(html)) fail(`${rel} missing public-safe boundary language`);
  const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);
  for (const [i, code] of scripts.entries()) {
    try { new vm.Script(code, { filename: `${rel}:inline-script-${i}` }); }
    catch (err) { fail(`${rel} inline script ${i} syntax error: ${err.message}`); }
  }
}

if (failures.length) {
  console.error('GoalOS Signoff Pro institutional website v28-v29 gate FAILED');
  for (const f of failures) console.error(`- ${f}`);
  process.exit(1);
}
console.log('GoalOS Signoff Pro institutional website v28-v29 gate PASS');
