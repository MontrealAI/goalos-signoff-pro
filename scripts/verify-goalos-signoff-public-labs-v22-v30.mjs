#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const site = path.join(process.cwd(), 'site');
const failures = [];
const fail = m => failures.push(m);
const exists = rel => fs.existsSync(path.join(site, rel));
const read = rel => fs.readFileSync(path.join(site, rel), 'utf8');
const required = ['index.html','public-demo-labs.html','goalos-public-demo-labs.html','goalos-public-demo-labs-v22-v30.json','goalos-signoff-pro-site-map-v22-v30.json','proof-before-settlement-research-lab.html','proof-before-settlement-research-manifest.json','proof-before-settlement-research-demo-bundle.json','research/proof-before-settlement/GoalOS_Proof_Before_Settlement_Elite_Edition.pdf'];
for (const rel of required) if (!exists(rel)) fail(`missing ${rel}`);
if (exists('goalos-public-demo-labs-v22-v30.json')) {
  try {
    const manifest = JSON.parse(read('goalos-public-demo-labs-v22-v30.json'));
    for (const v of ['v28','v29','v30']) if (!manifest.labs?.some(l => l.version === v)) fail(`global manifest missing ${v}`);
    if (!manifest.routes?.includes('proof-before-settlement-research-lab.html')) fail('global manifest missing v30 primary route');
    if (manifest.posture?.valueMoved !== 0) fail('global manifest valueMoved must be 0');
  } catch (err) { fail(`global manifest invalid JSON: ${err.message}`); }
}
if (exists('index.html')) {
  const html = read('index.html');
  for (const phrase of ['GOALOS_PUBLIC_LABS_V22_V30_START','Blockchain proves the transaction','GoalOS proves the work','No Proof. No Trust. No Settlement.','proof-before-settlement-research-lab.html']) {
    if (!html.includes(phrase)) fail(`index.html missing ${phrase}`);
  }
  if (html.includes('12 packet files')) fail('index.html still says 12 packet files');
}
for (const rel of required.filter(r => r.endsWith('.html'))) {
  if (!exists(rel)) continue;
  const html = read(rel);
  if (/<form\b|<input\b|<textarea\b|<select\b/i.test(html)) fail(`${rel} contains form/input/select`);
  if (/walletconnect|document\.cookie|localStorage\b|sessionStorage\b|google-analytics|gtag\(/i.test(html)) fail(`${rel} contains blocked public-site surface`);
  if (!/No forms|no forms/i.test(html) || !/No wallets|no wallets/i.test(html)) fail(`${rel} missing public-safe boundary language`);
  const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);
  for (const [i, code] of scripts.entries()) {
    try { new vm.Script(code, { filename: `${rel}:inline-script-${i}` }); }
    catch (err) { fail(`${rel} inline script ${i} syntax error: ${err.message}`); }
  }
}
if (failures.length) {
  console.error('GoalOS Signoff Pro public labs v22-v30 global gate FAILED');
  for (const f of failures) console.error(`- ${f}`);
  process.exit(1);
}
console.log('GoalOS Signoff Pro public labs v22-v30 global gate PASS');
