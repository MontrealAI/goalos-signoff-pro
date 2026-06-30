import fs from 'node:fs';
import path from 'node:path';

const site = path.join(process.cwd(), 'site');
const routes = [
  'validator-mesh-lab.html',
  'falsification-lab.html',
  'validator-mesh-demo-bundle.json',
  'commit-reveal-verifier-record.json',
  'falsification-report.json',
  'validator-diversity-ledger.json',
  'challenge-resolution-receipt.json',
  'validator-mesh-manifest.json'
];
const errors = [];
for (const route of routes) {
  const fp = path.join(site, route);
  if (!fs.existsSync(fp)) { errors.push(`${route} missing`); continue; }
  const raw = fs.readFileSync(fp, 'utf8');
  if (route.endsWith('.html') && /route not found/i.test(raw)) errors.push(`${route} degraded to Route Not Found`);
  if (route.endsWith('.json')) {
    try { JSON.parse(raw); } catch { errors.push(`${route} invalid JSON`); }
  }
}
if (fs.existsSync(path.join(site, 'index.html'))) {
  const index = fs.readFileSync(path.join(site, 'index.html'), 'utf8');
  const linkPos = index.indexOf('validator-mesh-lab.html');
  const footerPos = index.search(/<footer\b/i);
  if (linkPos === -1) errors.push('homepage does not link validator-mesh-lab.html');
  if (footerPos !== -1 && linkPos > footerPos) errors.push('homepage validator mesh link appears after footer');
}
if (errors.length) {
  console.error('GoalOS public demo route registry FAILED');
  for (const e of errors) console.error(' - ' + e);
  process.exit(1);
}
console.log('GoalOS public demo route registry PASS');
