import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root = process.cwd();
const siteDir = path.join(root, 'site');
const configPath = path.join(root, 'config', 'mission-foundry-lab.json');
const fallbackConfigPath = path.join(path.dirname(new URL(import.meta.url).pathname), '..', 'config', 'mission-foundry-lab.json');
const config = JSON.parse(fs.readFileSync(fs.existsSync(configPath) ? configPath : fallbackConfigPath, 'utf8'));
const requiredRoutes = [config.primaryRoute, ...config.aliases];
const requiredArtifacts = config.publicArtifacts;
let failures = [];
const fail = msg => failures.push(msg);
const read = file => fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';

if (!fs.existsSync(siteDir)) fail('site directory missing');

for (const route of requiredRoutes) {
  const file = path.join(siteDir, route);
  if (!fs.existsSync(file)) { fail(`${route} missing`); continue; }
  const html = read(file);
  const railCount = (html.match(/data-goalos-legal-rail="v12"/g) || []).length;
  const footerCount = (html.match(/data-goalos-footer="canonical"/g) || []).length;
  if (railCount !== 1) fail(`${route} must contain exactly one v12 legal rail, found ${railCount}`);
  if (footerCount !== 1) fail(`${route} must contain exactly one canonical footer, found ${footerCount}`);
  if (/Route Not Found|not part of the receipt map/i.test(html)) fail(`${route} contains Route Not Found fallback text`);
  if (!/Accepted proof becomes the next[\s\S]{0,80}harder mission/i.test(html)) fail(`${route} missing flagship headline`);
  if (!/Interestingness is allocation pressure/i.test(html)) fail(`${route} missing foundry law`);
  if (!/Run foundry gate/i.test(html)) fail(`${route} missing interactive run CTA`);
  if (!/MissionSeedCertificate/i.test(html)) fail(`${route} missing MissionSeedCertificate public artifact reference`);
  if (!/No forms · no inputs · no uploads · no cookies · no analytics · no wallets · no payments · no personal or confidential data\./.test(html)) fail(`${route} missing canonical public-site rule`);
  for (const forbidden of ['<form', '<input', '<textarea', '<select', 'mailto:', 'contact@montreal.ai', 'localStorage', 'sessionStorage', 'document.cookie', 'gtag(', 'GoogleAnalyticsObject']) {
    if (html.includes(forbidden)) fail(`${route} contains forbidden public artifact token: ${forbidden}`);
  }
  const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);
  for (const [i, code] of scripts.entries()) {
    try { new vm.Script(code, { filename: `${route}:inline-script-${i}` }); }
    catch (err) { fail(`${route} inline script ${i} syntax error: ${err.message}`); }
  }
}

for (const artifact of requiredArtifacts) {
  const file = path.join(siteDir, artifact);
  if (!fs.existsSync(file)) { fail(`${artifact} missing`); continue; }
  try { JSON.parse(read(file)); }
  catch (err) { fail(`${artifact} is not valid JSON: ${err.message}`); }
}

const bundlePath = path.join(siteDir, 'mission-foundry-demo-bundle.json');
if (fs.existsSync(bundlePath)) {
  const bundle = JSON.parse(read(bundlePath));
  const candidates = bundle.curriculum?.candidates || [];
  if (candidates.length !== 4) fail('mission-foundry-demo-bundle must include four candidate mission seeds');
  const admitted = candidates.filter(c => c.status === 'ADMITTED');
  if (admitted.length !== 1 || admitted[0].id !== 'M3') fail('exactly M3 must be admitted by the synthetic foundry gate');
  if (bundle.certificate?.valueMoved !== 0) fail('MissionSeedCertificate valueMoved must be 0');
  if (!bundle.certificate?.gates?.replayPath) fail('MissionSeedCertificate must include replayPath gate');
  if (!bundle.certificate?.gates?.challengeWindow) fail('MissionSeedCertificate must include challengeWindow gate');
  const rejected = candidates.filter(c => ['REJECTED','HELD','QUARANTINED'].includes(c.status));
  if (rejected.length !== 3) fail('three non-admitted candidates must be preserved as rejected/held/quarantined');
}

const publicFiles = fs.existsSync(siteDir) ? fs.readdirSync(siteDir, { recursive: true }).filter(f => typeof f === 'string') : [];
for (const rel of publicFiles) {
  if (!/\.(html|json|js|css|md|txt)$/i.test(rel)) continue;
  const text = read(path.join(siteDir, rel));
  for (const phrase of ['guaranteed return', 'guaranteed ROI', 'guaranteed profit', 'achieved AGI', 'achieved ASI', 'mainnet settlement is live', 'live staking activated', 'production certification is complete', 'external audit complete']) {
    if (text.toLowerCase().includes(phrase.toLowerCase())) fail(`${rel} contains unsupported phrase: ${phrase}`);
  }
}

if (failures.length) {
  console.error('GoalOS Mission Foundry Lab v26 gate FAILED');
  for (const f of failures) console.error(`- ${f}`);
  process.exit(1);
}
console.log(`GoalOS Mission Foundry Lab v26 gate PASS (${requiredRoutes.length} routes, ${requiredArtifacts.length} artifacts)`);
