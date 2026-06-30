import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const site = path.join(root, 'site');
const requiredHtml = ['validator-mesh-lab.html', 'falsification-lab.html'];
const requiredJson = [
  'validator-mesh-demo-bundle.json',
  'commit-reveal-verifier-record.json',
  'falsification-report.json',
  'validator-diversity-ledger.json',
  'challenge-resolution-receipt.json',
  'validator-mesh-manifest.json'
];
const errors = [];
const fail = (msg) => errors.push(msg);
const count = (s, re) => (s.match(re) || []).length;
if (!fs.existsSync(site)) fail('site/ directory is missing');

for (const file of requiredHtml) {
  const fp = path.join(site, file);
  if (!fs.existsSync(fp)) { fail(`${file} missing`); continue; }
  const html = fs.readFileSync(fp, 'utf8');
  if (/route not found/i.test(html)) fail(`${file} contains Route Not Found fallback`);
  if (count(html, /data-goalos-legal-rail="v12"/g) !== 1) fail(`${file} must contain exactly one v12 legal rail`);
  if (count(html, /data-goalos-footer="canonical"/g) !== 1) fail(`${file} must contain exactly one canonical footer`);
  for (const marker of [
    'Trust is not a score.',
    'It is a mesh.',
    'Run the falsification gauntlet.',
    'One validator is not authority.',
    'Falsification is a feature.',
    'Challenge becomes memory.',
    'validator-mesh-demo-bundle.json'
  ]) if (!html.includes(marker)) fail(`${file} missing marker: ${marker}`);
  const blocked = [/<form\b/i, /<input\b/i, /<textarea\b/i, /<select\b/i, /mailto:/i, /contact@montreal\.ai/i, /document\.cookie/i, /localStorage/i, /sessionStorage/i, /connect\s*wallet/i, /ethereum\.request/i, /guaranteed\s+(return|profit|yield|roi)/i, /achieved\s+(agi|asi|superintelligence)/i];
  for (const re of blocked) if (re.test(html)) fail(`${file} contains blocked pattern: ${re}`);
}

for (const file of requiredJson) {
  const fp = path.join(site, file);
  if (!fs.existsSync(fp)) { fail(`${file} missing`); continue; }
  let obj;
  try { obj = JSON.parse(fs.readFileSync(fp, 'utf8')); } catch { fail(`${file} is not valid JSON`); continue; }
  const raw = JSON.stringify(obj).toLowerCase();
  if (/guaranteed\s+(return|profit|yield|roi)/.test(raw)) fail(`${file} contains unsupported economic phrase`);
  if (/contact@montreal\.ai/.test(raw)) fail(`${file} contains blocked email`);
  if (/private\s*key|seed\s*phrase|api\s*key/.test(raw)) fail(`${file} contains secret-like phrase`);
  if (obj.valueMoved && obj.valueMoved !== 0) fail(`${file} must have valueMoved 0 when present`);
}

const bundle = JSON.parse(fs.readFileSync(path.join(site, 'validator-mesh-demo-bundle.json'), 'utf8'));
if (bundle.schema !== 'goalos.validator_mesh_lab.bundle.v20') fail('bundle schema mismatch');
if (bundle.valueMoved !== 0) fail('bundle valueMoved must be 0');
const falsification = JSON.parse(fs.readFileSync(path.join(site, 'falsification-report.json'), 'utf8'));
if (falsification.falseAcceptanceBlocked < 3) fail('falsification report should block at least three bad candidates');
if (falsification.acceptedForDecisionReview !== 'C3') fail('C3 should be the decision-review-ready candidate');
const diversity = JSON.parse(fs.readFileSync(path.join(site, 'validator-diversity-ledger.json'), 'utf8'));
if (!Array.isArray(diversity.validators) || diversity.validators.length < 7) fail('validator diversity ledger needs at least seven validators');
const challenge = JSON.parse(fs.readFileSync(path.join(site, 'challenge-resolution-receipt.json'), 'utf8'));
if (!/C3 survives/.test(challenge.resolution)) fail('challenge receipt should preserve C3 survival decision');

if (errors.length) {
  console.error('GoalOS Validator Mesh & Falsification Lab gate FAILED');
  for (const e of errors) console.error(' - ' + e);
  process.exit(1);
}
console.log('GoalOS Validator Mesh & Falsification Lab v20 gate PASS');
