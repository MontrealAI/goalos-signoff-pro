#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const site = path.join(root, 'site');
const configPath = path.join(root, 'config', 'proof-carrying-artifact-lab.json');
const cfg = fs.existsSync(configPath) ? JSON.parse(fs.readFileSync(configPath, 'utf8')) : {
  routes: ['proof-carrying-artifact-lab.html', 'artifact-vault-lab.html', 'evolution-ledger-lab.html', 'upgrade-right-lab.html']
};
const requiredArtifacts = [
  'proof-carrying-artifact-demo-bundle.json',
  'artifact-vault-index.json',
  'selection-certificate-demo.json',
  'evolution-ledger-entry-demo.json',
  'rollout-receipt-demo.json',
  'rollback-receipt-demo.json',
  'proof-backed-upgrade-right.json',
  'proof-carrying-artifact-manifest.json'
];
const fail = message => { console.error(`GoalOS Proof-Carrying Artifact Lab gate FAILED\n- ${message}`); process.exit(1); };
const count = (s, re) => (s.match(re) || []).length;
if (!fs.existsSync(site)) fail('site directory is missing');
for (const route of cfg.routes) {
  const file = path.join(site, route);
  if (!fs.existsSync(file)) fail(`${route} is missing`);
  const html = fs.readFileSync(file, 'utf8');
  if (/Route Not Found/i.test(html)) fail(`${route} degraded to Route Not Found fallback`);
  for (const needle of ['Proof-Carrying Artifact', 'Evolution Ledger', 'Run artifact gate', 'SelectionCertificate', 'proof-backed upgrade']) {
    if (!html.toLowerCase().includes(needle.toLowerCase())) fail(`${route} missing required content: ${needle}`);
  }
  const legalCount = count(html, /data-goalos-legal-rail="v12"/g);
  if (legalCount !== 1) fail(`${route} must contain exactly one canonical v12 legal rail; found ${legalCount}`);
  const footerCount = count(html, /data-goalos-footer="v12"/g);
  if (footerCount !== 1) fail(`${route} must contain exactly one canonical v12 footer; found ${footerCount}`);
  const blocked = [/<form\b/i, /<input\b/i, /<textarea\b/i, /<select\b/i, /type=["']file["']/i, /mailto:/i, /contact@montreal\.ai/i, /connect\s+wallet/i, /document\.cookie/i, /localStorage/i, /sessionStorage/i, /navigator\.sendBeacon/i, /gtag\(/i, /google-analytics/i, /plausible\.io/i, /guaranteed\s+(return|roi|profit|yield)/i, /live\s+(escrow|staking|mainnet\s+settlement)/i];
  for (const re of blocked) if (re.test(html)) fail(`${route} contains blocked public-site pattern: ${re}`);
  const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);
  for (const [i, script] of scripts.entries()) {
    try { new Function(script); } catch (err) { fail(`${route} inline script ${i + 1} has invalid syntax: ${err.message}`); }
  }
}
for (const artifact of requiredArtifacts) {
  const file = path.join(site, artifact);
  if (!fs.existsSync(file)) fail(`${artifact} is missing`);
  const text = fs.readFileSync(file, 'utf8');
  if (/guaranteed\s+(return|roi|profit|yield)/i.test(text)) fail(`${artifact} contains unsupported economic phrase`);
  if (/contact@montreal\.ai/i.test(text)) fail(`${artifact} contains blocked email address`);
}
const bundle = JSON.parse(fs.readFileSync(path.join(site, 'proof-carrying-artifact-demo-bundle.json'), 'utf8'));
if (!bundle.artifactVault?.immutableVersions?.some(v => v.status === 'ACTIVE_SYNTHETIC')) fail('bundle does not contain an active synthetic proof-carrying artifact');
if (!bundle.selectionCertificate?.hardGates?.rollbackReady) fail('selection certificate does not prove rollback readiness');
if (!bundle.evolutionLedgerEntry?.proofRoot) fail('evolution ledger entry missing proof root');
if (bundle.upgradeRight?.valueMoved !== 0) fail('upgrade right must preserve valueMoved = 0');
console.log(`GoalOS Proof-Carrying Artifact Lab gate PASS (${cfg.routes.length} routes, ${requiredArtifacts.length} artifacts)`);
