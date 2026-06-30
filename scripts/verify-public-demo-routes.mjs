import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const site = path.join(root, 'site');
const configDir = path.join(root, 'config');
const errors = [];
const fail = (msg) => errors.push(msg);
const required = new Set(['validator-mesh-lab.html', 'falsification-lab.html']);

function addRoute(value) {
  if (!value || typeof value !== 'string') return;
  required.add(value.endsWith('.html') ? value : `${value}.html`);
}

if (fs.existsSync(configDir)) {
  for (const file of fs.readdirSync(configDir).filter(f => f.endsWith('.json'))) {
    try {
      const cfg = JSON.parse(fs.readFileSync(path.join(configDir, file), 'utf8'));
      if (cfg.slug && /lab|mission|proof|replay|docket|evidence|validator|settlement|boundary|decision|challenge|process|foundry/i.test(cfg.slug)) addRoute(cfg.slug);
      if (Array.isArray(cfg.aliases)) for (const alias of cfg.aliases) addRoute(alias);
      if (Array.isArray(cfg.routes)) for (const route of cfg.routes) addRoute(route);
    } catch {}
  }
}

for (const route of [...required].sort()) {
  const fp = path.join(site, route);
  if (!fs.existsSync(fp)) { fail(`${route} missing`); continue; }
  const raw = fs.readFileSync(fp, 'utf8');
  if (/route\s+not\s+found|not\s+part\s+of\s+the\s+receipt\s+map/i.test(raw)) fail(`${route} degraded to Route Not Found`);
  const legal = (raw.match(/data-goalos-legal-rail="v12"/g) || []).length;
  const canonicalFooter = (raw.match(/data-goalos-footer="canonical"/g) || []).length;
  if (legal !== 1) fail(`${route} must contain exactly one v12 legal rail; found ${legal}`);
  if (canonicalFooter > 1) fail(`${route} must not contain duplicate canonical footers; found ${canonicalFooter}`);
  if (/<form\b|<input\b|<textarea\b|<select\b|mailto:|document\.cookie|localStorage|sessionStorage|ethereum\.request/i.test(raw)) fail(`${route} contains a blocked user-data or wallet surface`);
}

const jsonRoutes = [
  'validator-mesh-demo-bundle.json',
  'commit-reveal-verifier-record.json',
  'falsification-report.json',
  'validator-diversity-ledger.json',
  'challenge-resolution-receipt.json',
  'validator-mesh-manifest.json'
];
for (const route of jsonRoutes) {
  const fp = path.join(site, route);
  if (!fs.existsSync(fp)) { fail(`${route} missing`); continue; }
  try { JSON.parse(fs.readFileSync(fp, 'utf8')); } catch { fail(`${route} invalid JSON`); }
}

if (fs.existsSync(path.join(site, 'index.html'))) {
  const index = fs.readFileSync(path.join(site, 'index.html'), 'utf8');
  const linkPos = index.indexOf('validator-mesh-lab.html');
  const footerPos = index.search(/<footer\b/i);
  if (linkPos === -1) fail('homepage does not link validator-mesh-lab.html');
  if (footerPos !== -1 && linkPos > footerPos) fail('homepage validator mesh link appears after footer');
}

if (errors.length) {
  console.error('GoalOS public demo route registry FAILED');
  for (const e of errors) console.error(' - ' + e);
  process.exit(1);
}
console.log(`GoalOS public demo route registry PASS — ${required.size} HTML routes verified`);
