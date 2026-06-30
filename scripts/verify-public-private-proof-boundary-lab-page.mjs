#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const site = path.join(root, 'site');
const route = path.join(site, 'public-private-proof-boundary-lab.html');
const alias = path.join(site, 'proof-boundary-lab.html');
const requiredArtifacts = [
  'proof-boundary-demo-bundle.json',
  'public-proof-commitments.json',
  'private-appendix-manifest.json',
  'redaction-map.json',
  'evidence-docket-boundary.json',
  'proof-ledger-commitment.json',
  'public-private-proof-boundary-manifest.json'
];
const fail = (m) => { console.error(`GoalOS Public-Private Proof Boundary Lab gate FAILED\n- ${m}`); process.exit(1); };
const count = (s, needle) => (s.match(new RegExp(needle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
const read = p => fs.readFileSync(p, 'utf8');
if (!fs.existsSync(route)) fail('public-private-proof-boundary-lab.html is missing');
if (!fs.existsSync(alias)) fail('proof-boundary-lab.html alias is missing');
for (const rel of requiredArtifacts) if (!fs.existsSync(path.join(site, rel))) fail(`${rel} is missing`);
const html = read(route);
if (/Route Not Found/i.test(html)) fail('public-private-proof-boundary-lab.html is serving the fallback route page');
if (!/Run boundary pass/i.test(html)) fail('interactive boundary pass CTA is missing');
if (!/Private execution stays scoped/i.test(html)) fail('private execution explanation is missing');
if (!/Public proof stays verifiable/i.test(html)) fail('public proof explanation is missing');
if (!/data-goalos-legal-rail="v12"/.test(html)) fail('canonical v12 legal rail is missing');
if (count(html, 'data-goalos-legal-rail="v12"') !== 1) fail('public-private-proof-boundary-lab.html must contain exactly one v12 legal rail');
if (count(html, '<footer') !== 1) fail('public-private-proof-boundary-lab.html must contain exactly one footer');
if (/<form\b/i.test(html)) fail('forms are not allowed');
if (/<input\b/i.test(html)) fail('inputs are not allowed');
if (/<textarea\b/i.test(html)) fail('textareas are not allowed');
if (/<select\b/i.test(html)) fail('selects are not allowed');
for (const phrase of ['contact@montreal.ai', 'guaranteed return', 'guaranteed profit', 'live escrow', 'live staking', 'mainnet settlement is live', 'connect wallet', 'walletconnect', 'document.cookie', 'localStorage', 'sessionStorage', 'gtag(', 'google-analytics']) {
  if (html.toLowerCase().includes(phrase.toLowerCase())) fail(`unsupported or unsafe phrase found: ${phrase}`);
}
const bundle = JSON.parse(read(path.join(site, 'proof-boundary-demo-bundle.json')));
if (!bundle.records || Object.keys(bundle.records).length < 4) fail('demo bundle must contain at least four boundary scenarios');
if (!bundle.publicSafety?.noForms || !bundle.publicSafety?.noInputs || !bundle.publicSafety?.noUploads) fail('publicSafety posture is incomplete');
for (const [id, record] of Object.entries(bundle.records)) {
  if (!record.privateAppendixManifest?.length) fail(`${id} missing private appendix manifest`);
  if (!record.publicProofCommitments?.length) fail(`${id} missing public proof commitments`);
  if (!record.redactionMapHash) fail(`${id} missing redaction map hash`);
  if (!record.proofLedgerCommitment) fail(`${id} missing proof ledger commitment`);
  if (record.valueMoved !== 0) fail(`${id} must move zero value`);
  for (const row of record.privateAppendixManifest) {
    if (/disclosed/i.test(row.disclosure) && !/not disclosed/i.test(row.disclosure)) fail(`${id} private appendix manifest appears to disclose private material`);
  }
}
const commitments = JSON.parse(read(path.join(site, 'public-proof-commitments.json')));
if (!Array.isArray(commitments.commitments) || commitments.commitments.length < 4) fail('public proof commitment file is incomplete');
const redaction = JSON.parse(read(path.join(site, 'redaction-map.json')));
if (!Array.isArray(redaction.scenarios) || redaction.scenarios.length < 4) fail('redaction map is incomplete');
console.log('GoalOS Public-Private Proof Boundary Lab v17 gate PASS');
