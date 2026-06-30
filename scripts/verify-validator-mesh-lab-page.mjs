import fs from 'node:fs';
import path from 'node:path';

const site = path.join(process.cwd(), 'site');
const htmlRoutes = ['validator-mesh-lab.html', 'falsification-lab.html'];
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
const read = (rel) => fs.readFileSync(path.join(site, rel), 'utf8');
const count = (text, needle) => (text.match(needle) || []).length;

for (const file of htmlRoutes) {
  const fp = path.join(site, file);
  if (!fs.existsSync(fp)) { fail(`${file} missing`); continue; }
  const html = read(file);
  const railCount = count(html, /data-goalos-legal-rail="v12"/g);
  const footerCount = count(html, /data-goalos-footer="canonical"/g);
  if (railCount !== 1) fail(`${file} must contain exactly one v12 legal rail; found ${railCount}`);
  if (footerCount !== 1) fail(`${file} must contain exactly one canonical footer; found ${footerCount}`);
  const railPos = html.indexOf('data-goalos-legal-rail="v12"');
  const footerPos = html.indexOf('data-goalos-footer="canonical"');
  if (railPos === -1 || footerPos === -1 || railPos > footerPos) fail(`${file} legal rail must appear before canonical footer`);
  if (/route\s+not\s+found|not\s+part\s+of\s+the\s+receipt\s+map/i.test(html)) fail(`${file} degraded to Route Not Found`);
  for (const marker of [
    'Trust is not a score.',
    'It is a mesh.',
    'Run the falsification gauntlet.',
    'One validator is not authority.',
    'Falsification is a feature.',
    'Challenge becomes memory.',
    'validator-mesh-demo-bundle.json',
    'human authority boundary'
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
  if (Object.prototype.hasOwnProperty.call(obj, 'valueMoved') && obj.valueMoved !== 0) fail(`${file} must have valueMoved 0 when present`);
}

const bundlePath = path.join(site, 'validator-mesh-demo-bundle.json');
if (fs.existsSync(bundlePath)) {
  const bundle = JSON.parse(fs.readFileSync(bundlePath, 'utf8'));
  if (bundle.schema !== 'goalos.validator_mesh_lab.bundle.v20') fail('bundle schema mismatch');
  if (bundle.valueMoved !== 0) fail('bundle valueMoved must be 0');
}
const falsificationPath = path.join(site, 'falsification-report.json');
if (fs.existsSync(falsificationPath)) {
  const falsification = JSON.parse(fs.readFileSync(falsificationPath, 'utf8'));
  if (falsification.falseAcceptanceBlocked < 3) fail('falsification report should block at least three bad candidates');
  if (falsification.acceptedForDecisionReview !== 'C3') fail('C3 should be the decision-review-ready candidate');
}
const diversityPath = path.join(site, 'validator-diversity-ledger.json');
if (fs.existsSync(diversityPath)) {
  const diversity = JSON.parse(fs.readFileSync(diversityPath, 'utf8'));
  if (!Array.isArray(diversity.validators) || diversity.validators.length < 7) fail('validator diversity ledger needs at least seven validators');
}
const challengePath = path.join(site, 'challenge-resolution-receipt.json');
if (fs.existsSync(challengePath)) {
  const challenge = JSON.parse(fs.readFileSync(challengePath, 'utf8'));
  if (!/C3 survives/.test(challenge.resolution)) fail('challenge receipt should preserve C3 survival decision');
}

if (errors.length) {
  console.error('GoalOS Validator Mesh & Falsification Lab gate FAILED');
  for (const e of errors) console.error(' - ' + e);
  process.exit(1);
}
console.log('GoalOS Validator Mesh & Falsification Lab v20.2 gate PASS');
