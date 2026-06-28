#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const SITE = path.join(ROOT, 'site');
const fail = msg => { console.error(`GoalOS Proof Gradient Lab gate FAILED\n- ${msg}`); process.exit(1); };
const read = rel => fs.existsSync(path.join(SITE, rel)) ? fs.readFileSync(path.join(SITE, rel), 'utf8') : '';

const required = [
  'proof-gradient-lab.html',
  'proof-gradient-selection-certificate.json',
  'proof-gradient-evolution-ledger-entry.json',
  'proof-gradient-demo-docket.json'
];
for (const rel of required) {
  if (!fs.existsSync(path.join(SITE, rel))) fail(`Missing ${rel}`);
}

const page = read('proof-gradient-lab.html');
if (page.length < 16000) fail('proof-gradient-lab.html is too thin for a flagship public demonstration');
const mustContain = [
  'Score is advisory',
  'Gates decide',
  'Proof Gradient Selection Law',
  'SelectionCertificate',
  'EvolutionLedgerEntry',
  'Evidence Docket',
  'No forms · no uploads · no cookies · no analytics · no wallets · no payments · no personal or confidential data.',
  'Run Selection Gate',
  'Download certificate',
  'Download docket'
];
for (const phrase of mustContain) if (!page.includes(phrase)) fail(`Missing required page phrase: ${phrase}`);

const forbidden = [
  /<form\b/i,
  /<input\b/i,
  /<textarea\b/i,
  /<select\b/i,
  /mailto:/i,
  /contact@montreal\.ai/i,
  /connect[- ]?wallet/i,
  /localStorage/i,
  /sessionStorage/i,
  /document\.cookie/i,
    /tracking pixel/i,
  /guaranteed return/i,
  /guaranteed profit/i,
  /guaranteed yield/i,
  /achieved\s+AGI/i,
  /achieved\s+ASI/i,
  /achieved\s+superintelligence/i,
  /live escrow/i,
  /live staking/i,
  /mainnet settlement is live/i
];
for (const pattern of forbidden) if (pattern.test(page)) fail(`Forbidden public-site pattern found in proof-gradient-lab.html: ${pattern}`);

const legalRailCount = (page.match(/Public site rule/g) || []).length;
if (legalRailCount !== 1) fail(`Expected exactly one legal rail on proof-gradient-lab.html, found ${legalRailCount}`);

let cert, docket, ledger;
try { cert = JSON.parse(read('proof-gradient-selection-certificate.json')); } catch { fail('Selection certificate is not valid JSON'); }
try { docket = JSON.parse(read('proof-gradient-demo-docket.json')); } catch { fail('Evidence docket is not valid JSON'); }
try { ledger = JSON.parse(read('proof-gradient-evolution-ledger-entry.json')); } catch { fail('Evolution ledger entry is not valid JSON'); }
if (cert.selectedCandidate !== 'C3') fail('Selection certificate does not promote C3');
if (!cert.candidates || cert.candidates.length !== 4) fail('Selection certificate must include four candidates');
if (!docket.claimsMatrix || docket.claimsMatrix.length < 4) fail('Evidence docket claims matrix is incomplete');
if (!docket.proofPackets || docket.proofPackets.length !== 4) fail('Evidence docket proof packets are incomplete');
if (ledger.entryType !== 'SelectionCertificate') fail('Evolution ledger entry has wrong type');

const index = read('index.html');
if (index) {
  if (!index.includes('proof-gradient-lab.html')) fail('Homepage does not link to proof-gradient-lab.html');
  const linkIdx = index.indexOf('proof-gradient-lab.html');
  const footerIdx = index.indexOf('<footer');
  if (footerIdx >= 0 && linkIdx > footerIdx) fail('Homepage proof-gradient rail appears after footer');
}

console.log('GoalOS Proof Gradient Selection Lab gate PASS');
console.log(`Checked ${required.length} artifacts; selected candidate ${cert.selectedCandidate}; legal rail count ${legalRailCount}`);
