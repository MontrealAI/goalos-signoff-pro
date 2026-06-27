#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const siteDir = path.join(root, 'site');
const fail = (message) => { console.error(`User Delight Autopilot gate: FAIL\n- ${message}`); process.exit(1); };
const warn = (message) => console.warn(`User Delight Autopilot warning: ${message}`);

if (!fs.existsSync(siteDir)) fail('site/ directory does not exist. Run the site generators first.');

const required = [
  'demo-lab.html',
  'proof-mission-builder.html',
  'demo-gallery.html',
  'evidence-docket-lab.html',
  'receipt-verifier-demo.html',
  'autonomous-demo.html',
  'user-delight-manifest.json',
  'assets/user-delight.css',
  'assets/user-delight.js',
  'demo/proof-mission/mission-contract.json',
  'demo/proof-mission/evidence-docket.json',
  'demo/proof-mission/mission-receipt.json'
];
for (const rel of required) {
  const file = path.join(siteDir, rel);
  if (!fs.existsSync(file)) fail(`Missing required user-delight artifact: ${rel}`);
  if (fs.statSync(file).size < 120 && rel.endsWith('.html')) fail(`Generated page too small: ${rel}`);
}

const pages = required.filter((rel) => rel.endsWith('.html'));
const allHtml = pages.map((rel) => fs.readFileSync(path.join(siteDir, rel), 'utf8')).join('\n');
const allSiteFiles = [];
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(p); else allSiteFiles.push(p);
  }
}
walk(siteDir);

const forbiddenSiteDirs = ['node_modules', '.git', '.next'];
for (const p of allSiteFiles) {
  const rel = path.relative(siteDir, p).replaceAll(path.sep, '/');
  if (forbiddenSiteDirs.some((part) => rel.split('/').includes(part))) fail(`Forbidden build artifact in public site: ${rel}`);
  if (/\.env(\.|$)/.test(rel) || rel.endsWith('.env')) fail(`Forbidden env-like file in public site: ${rel}`);
}

const dangerousPatterns = [
  [/contact@montreal\.ai/i, 'contact@montreal.ai must not appear'],
  [/<form\b/i, 'Forms are not allowed in the public demo layer'],
  [/<input\b/i, 'Inputs are not allowed in the public demo layer'],
  [/<textarea\b/i, 'Textareas are not allowed in the public demo layer'],
  [/localStorage|sessionStorage|document\.cookie|set-cookie/i, 'Persistent browser storage or cookies are not allowed'],
  [/walletconnect|connect wallet|metamask/i, 'Wallet-connect language is not allowed in user activation demos'],
  [/stripe_live|sk_live_|ghp_[A-Za-z0-9_]+|BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY/i, 'Secret-like token or private key marker found'],
  [/guaranteed\s+(roi|return|profit|yield)/i, 'Guaranteed investment-return language is not allowed'],
  [/mainnet settlement is live|staking is live|escrow is live/i, 'Unsupported live protocol claim is not allowed']
];
for (const [pattern, message] of dangerousPatterns) {
  if (pattern.test(allHtml)) fail(message);
}
if (!/info@quebec\.ai/i.test(allHtml)) fail('info@quebec.ai must appear on the public user activation pages.');

const script = fs.readFileSync(path.join(siteDir, 'assets/user-delight.js'), 'utf8');
for (const marker of ['Launch proof cycle', 'Valid demo receipt', 'readiness', 'requestAnimationFrame']) {
  if (!script.includes(marker)) fail(`Missing interactive script marker: ${marker}`);
}
if (!script.includes("pct===100")) fail('Proof cycle must reach 100 readiness.');

const manifest = JSON.parse(fs.readFileSync(path.join(siteDir, 'user-delight-manifest.json'), 'utf8'));
if (manifest.contactEmail !== 'info@quebec.ai') fail('User delight manifest must use info@quebec.ai.');
if (!Array.isArray(manifest.pages) || manifest.pages.length < 6) fail('User delight manifest must list generated pages.');

const docket = JSON.parse(fs.readFileSync(path.join(siteDir, 'demo/proof-mission/evidence-docket.json'), 'utf8'));
if (!docket.publicSafe) fail('Demo Evidence Docket must be publicSafe=true.');
if (!docket.receipt?.receiptHash) fail('Demo Evidence Docket must include receipt hash.');

// Link check for generated demo pages only.
const localHrefs = [...allHtml.matchAll(/href="([^"]+)"/g)].map((m) => m[1]).filter((href) => !href.startsWith('http') && !href.startsWith('mailto:') && !href.startsWith('#') && !href.startsWith('javascript:'));
for (const href of localHrefs) {
  const target = href.split('#')[0].split('?')[0];
  if (!target || target === '/') continue;
  const file = path.join(siteDir, target);
  if (!fs.existsSync(file)) warn(`Generated page links to file not present in this build: ${target}`);
}

console.log('GoalOS User Delight Autopilot gate: PASS');
console.log(`Checked ${pages.length} user-facing pages, ${required.length} required artifacts, and browser-local demo behavior.`);
