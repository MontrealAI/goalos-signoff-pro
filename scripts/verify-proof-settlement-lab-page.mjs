#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const site = path.join(root, 'site');
const route = 'proof-settlement-lab.html';
const alias = 'settlement-control-lab.html';
const errors = [];
const read = rel => fs.readFileSync(path.join(site, rel), 'utf8');
const exists = rel => fs.existsSync(path.join(site, rel));
function assert(cond, msg){ if(!cond) errors.push(msg); }
for (const rel of [route, alias]) {
  assert(exists(rel), `${rel} missing`);
  if (exists(rel)) {
    const html = read(rel);
    assert(!/Route Not Found/i.test(html), `${rel} contains Route Not Found fallback`);
    assert(/No ProofBundle/i.test(html), `${rel} missing proof-settlement headline`);
    assert(/Settlement readiness console/i.test(html), `${rel} missing readiness console`);
    assert(/Commit-Reveal/i.test(html), `${rel} missing commit-reveal panel`);
    assert(/synthetic α-WU/i.test(html), `${rel} missing alpha work unit metric`);
    assert((html.match(/data-goalos-legal-rail="v12"/g) || []).length === 1, `${rel} must contain exactly one v12 legal rail`);
    assert((html.match(/<footer\b/gi) || []).length === 1, `${rel} must contain exactly one footer`);
    assert(!/<form\b/i.test(html), `${rel} contains form`);
    assert(!/<input\b/i.test(html), `${rel} contains input`);
    assert(!/<textarea\b/i.test(html), `${rel} contains textarea`);
    assert(!/<select\b/i.test(html), `${rel} contains select`);
    assert(!/walletconnect|connect wallet|web3modal|ethereum\.request|metamask/i.test(html), `${rel} contains wallet/API connection marker`);
    assert(!/google-analytics|gtag\(|analytics\.js|pixel/i.test(html), `${rel} contains analytics marker`);
    assert(!/contact@montreal\.ai/i.test(html), `${rel} contains blocked contact email`);
    assert(!/guaranteed\s+(return|profit|yield|roi)/i.test(html), `${rel} contains blocked guaranteed-return phrase`);
    assert(!/achieved\s+(agi|asi|superintelligence)/i.test(html), `${rel} contains unsupported achievement phrase`);
    assert(!/live\s+(settlement|staking|escrow)/i.test(html), `${rel} contains unsupported live-operation phrase`);
  }
}
for (const rel of ['proof-settlement-demo-bundle.json','settlement-readiness-certificate.json','alpha-work-unit-ledger.json','commit-reveal-validator-record.json','challenge-window-receipt.json','simulated-chronicle-entry.json','proof-settlement-lab-manifest.json']) {
  assert(exists(rel), `${rel} missing`);
  if (exists(rel)) {
    const raw = read(rel);
    assert(!/guaranteed\s+(return|profit|yield|roi)/i.test(raw), `${rel} contains blocked guaranteed-return phrase`);
    assert(!/live\s+(settlement|staking|escrow)/i.test(raw), `${rel} contains unsupported live-operation phrase`);
    JSON.parse(raw);
  }
}
const bundle = JSON.parse(read('proof-settlement-demo-bundle.json'));
assert(bundle.proofBundles['settlement-ready'].simulatedSettlement === 'READY_SIGNAL_ONLY', 'settlement-ready scenario must emit READY_SIGNAL_ONLY');
assert(bundle.proofBundles['output-only'].alphaWorkUnits === 0, 'output-only candidate must have zero alpha work units');
assert(bundle.alphaLedger.rows.every(r => r.valueMoved === 0), 'alpha ledger must move zero value');
assert(bundle.publicSafety.noValueMoved === true, 'public safety must state no value moved');
if (exists('index.html')) {
  const idx = read('index.html');
  const railPos = idx.indexOf('GOALOS-PROOF-SETTLEMENT-HOME-RAIL');
  const footerPos = idx.indexOf('<footer');
  assert(railPos >= 0, 'homepage missing proof-settlement rail');
  assert(footerPos < 0 || railPos < footerPos, 'homepage proof-settlement rail must appear before footer');
}
if (errors.length) {
  console.error('GoalOS Proof-to-Settlement Control Lab gate FAILED');
  for (const e of errors) console.error(' - ' + e);
  process.exit(1);
}
console.log('GoalOS Proof-to-Settlement Control Lab v16 gate PASS');
