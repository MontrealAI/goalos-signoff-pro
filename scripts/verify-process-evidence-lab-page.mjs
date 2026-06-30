import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root = process.cwd();
const siteDir = path.join(root, 'site');
const configPath = path.join(root, 'config', 'process-evidence-lab.json');
const fallbackConfigPath = path.join(path.dirname(new URL(import.meta.url).pathname), '..', 'config', 'process-evidence-lab.json');
const config = JSON.parse(fs.readFileSync(fs.existsSync(configPath) ? configPath : fallbackConfigPath, 'utf8'));
const routes = [config.primaryRoute, ...config.aliases];
let failures = [];
const fail = msg => failures.push(msg);
const read = file => fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';

if (!fs.existsSync(siteDir)) fail('site directory missing');
for (const route of routes) {
  const file = path.join(siteDir, route);
  if (!fs.existsSync(file)) { fail(`${route} missing`); continue; }
  const html = read(file);
  const railCount = (html.match(/data-goalos-legal-rail="v12"/g) || []).length;
  const footerCount = (html.match(/data-goalos-footer="canonical"/g) || []).length;
  if (railCount !== 1) fail(`${route} must contain exactly one canonical v12 legal rail, found ${railCount}`);
  if (footerCount !== 1) fail(`${route} must contain exactly one canonical footer, found ${footerCount}`);
  if (/Route Not Found|not part of the receipt map/i.test(html)) fail(`${route} contains Route Not Found fallback text`);
  for (const required of ['Final output is', 'Process-resolved evidence', 'Run process pass', 'Claim lineage', 'Tool scope', 'ProcessValidatorReport', 'ActionReasonTraceLedger']) {
    if (!html.includes(required)) fail(`${route} missing required public demo phrase: ${required}`);
  }
  for (const forbidden of ['<form', '<input', '<textarea', '<select', 'mailto:', 'contact@montreal.ai', 'localStorage', 'sessionStorage', 'document.cookie', 'gtag(', 'GoogleAnalyticsObject']) {
    if (html.includes(forbidden)) fail(`${route} contains forbidden public artifact token: ${forbidden}`);
  }
  const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);
  for (const [i, code] of scripts.entries()) {
    try { new vm.Script(code, { filename: `${route}:inline-script-${i}` }); }
    catch (err) { fail(`${route} inline script ${i} syntax error: ${err.message}`); }
  }
}

for (const artifact of config.publicArtifacts) {
  const file = path.join(siteDir, artifact);
  if (!fs.existsSync(file)) { fail(`${artifact} missing`); continue; }
  try { JSON.parse(read(file)); }
  catch (err) { fail(`${artifact} is not valid JSON: ${err.message}`); }
}

const bundlePath = path.join(siteDir, 'process-evidence-demo-bundle.json');
if (fs.existsSync(bundlePath)) {
  const bundle = JSON.parse(read(bundlePath));
  if (!Array.isArray(bundle.candidates) || bundle.candidates.length !== 4) fail('process-evidence-demo-bundle must include four candidates');
  const accepted = bundle.candidates.filter(c => c.status === 'REVIEW_READY');
  if (accepted.length !== 1 || accepted[0].id !== 'C3') fail('exactly C3 must be REVIEW_READY');
  if (!bundle.traceLedger?.steps || bundle.traceLedger.steps.length < 8) fail('trace ledger must include at least eight process steps');
  if (!bundle.claimLineage?.claims || bundle.claimLineage.claims.length < 4) fail('claim lineage map must include at least four claims');
  if (bundle.receipt?.valueMoved !== 0) fail('receipt valueMoved must be 0');
  if (!bundle.receipt?.noUserData) fail('receipt must state noUserData');
}

const validatorPath = path.join(siteDir, 'process-validator-report.json');
if (fs.existsSync(validatorPath)) {
  const report = JSON.parse(read(validatorPath));
  if (report.acceptedCandidate !== 'C3') fail('process validator report must accept C3');
  if (!report.candidates.some(c => c.id === 'C0' && c.status === 'REJECTED')) fail('validator report must reject C0');
  if (!report.candidates.some(c => c.id === 'C1' && c.status === 'QUARANTINED')) fail('validator report must quarantine C1');
  if (!report.candidates.some(c => c.id === 'C2' && c.status === 'HELD')) fail('validator report must hold C2');
}

if (failures.length) {
  console.error('GoalOS Process-Resolved Evidence Lab v27 gate FAILED');
  for (const f of failures) console.error(` - ${f}`);
  process.exit(1);
}
console.log(`GoalOS Process-Resolved Evidence Lab v27 gate PASS (${routes.length} routes, ${config.publicArtifacts.length} artifacts)`);
