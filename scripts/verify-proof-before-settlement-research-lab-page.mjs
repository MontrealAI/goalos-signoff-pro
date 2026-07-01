#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { config } from './proof-before-settlement-research-lab-core.mjs';

const site = path.join(process.cwd(), 'site');
const failures = [];
const fail = m => failures.push(m);
const exists = rel => fs.existsSync(path.join(site, rel));
const read = rel => fs.readFileSync(path.join(site, rel), 'utf8');

const required = [config.primaryRoute, ...config.aliases, config.manifestRoute, 'proof-before-settlement-research-demo-bundle.json', ...config.paperAssets.map(a => a.path)];
for (const rel of required) if (!exists(rel)) fail(`missing ${rel}`);

for (const rel of [config.primaryRoute, ...config.aliases]) {
  if (!exists(rel)) continue;
  const html = read(rel);
  for (const phrase of ['Blockchain proves the transaction', 'GoalOS proves the work', 'No Proof. No Trust. No Settlement.', 'Make proof inevitable', 'Public site rule']) {
    if (!html.includes(phrase)) fail(`${rel} missing phrase: ${phrase}`);
  }
  for (const phrase of ['no forms', 'no wallets', 'zero value moved']) {
    if (!html.toLowerCase().includes(phrase)) fail(`${rel} missing boundary phrase: ${phrase}`);
  }
  if (/<form\b|<input\b|<textarea\b|<select\b/i.test(html)) fail(`${rel} contains form/input/select`);
  if (/walletconnect|document\.cookie|localStorage\b|sessionStorage\b|google-analytics|gtag\(/i.test(html)) fail(`${rel} contains blocked public-site surface`);
  const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);
  for (const [i, code] of scripts.entries()) {
    try { new vm.Script(code, { filename: `${rel}:inline-script-${i}` }); }
    catch (err) { fail(`${rel} inline script ${i} syntax error: ${err.message}`); }
  }
}

if (exists(config.manifestRoute)) {
  try {
    const manifest = JSON.parse(read(config.manifestRoute));
    if (manifest.version !== 'v30') fail('v30 manifest has wrong version');
    if (manifest.posture?.valueMoved !== 0) fail('v30 manifest valueMoved must be 0');
    if (manifest.boundary?.liveSettlement !== false) fail('v30 manifest must not claim live settlement');
    for (const a of config.paperAssets) if (!manifest.paperAssets?.some(x => x.path === a.path)) fail(`manifest missing paper asset ${a.path}`);
  } catch (err) { fail(`v30 manifest invalid JSON: ${err.message}`); }
}

if (failures.length) {
  console.error('GoalOS Proof Before Settlement Research Lab v30 gate FAILED');
  for (const f of failures) console.error(`- ${f}`);
  process.exit(1);
}
console.log('GoalOS Proof Before Settlement Research Lab v30 gate PASS');
