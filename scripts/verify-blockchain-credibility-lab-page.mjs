#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root = process.cwd();
const siteDir = path.join(root, 'site');
const configPath = path.join(root, 'config', 'blockchain-credibility-lab.json');
const fallbackConfigPath = path.join(path.dirname(new URL(import.meta.url).pathname), '..', 'config', 'blockchain-credibility-lab.json');
const config = JSON.parse(fs.readFileSync(fs.existsSync(configPath) ? configPath : fallbackConfigPath, 'utf8'));
const failures = [];
const fail = msg => failures.push(msg);
const read = file => fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
const routes = [config.primaryRoute, ...config.aliases];
const forbidden = ['<form', '<input', '<textarea', '<select', 'localStorage', 'sessionStorage', 'document.cookie', 'gtag(', 'GoogleAnalyticsObject', 'mailto:', 'connectWallet(', 'approveToken(', 'broadcastTransaction('];
const required = ['Blockchain proves the transaction', 'GoalOS proves the work', 'No Proof. No Trust. No Settlement.', 'proof package', 'Settlement readiness', 'GoalOS settles trust', 'No forms', 'No inputs', 'No uploads'];

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
  for (const phrase of required) if (!html.includes(phrase)) fail(`${route} missing required phrase: ${phrase}`);
  for (const token of forbidden) if (html.includes(token)) fail(`${route} contains forbidden token: ${token}`);
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
const bundlePath = path.join(siteDir, 'blockchain-credibility-demo-bundle.json');
if (fs.existsSync(bundlePath)) {
  const bundle = JSON.parse(read(bundlePath));
  if (!Array.isArray(bundle.scenarios) || bundle.scenarios.length < 6) fail('bundle must include at least six blockchain scenarios');
  if (!bundle.requirementMap?.gates || bundle.requirementMap.gates.length < 8) fail('bundle must include at least eight proof gates');
  if (bundle.receipt?.valueMoved !== 0) fail('receipt valueMoved must be 0');
  if (!bundle.receipt?.noUserData || !bundle.receipt?.noWallet) fail('receipt must state noUserData and noWallet');
  if (!bundle.readinessLedger?.candidates?.some(c => c.id === 'B3' && c.status === 'SETTLEMENT_READY_SYNTHETIC')) fail('B3 must be settlement-ready synthetic');
  if (!bundle.readinessLedger?.candidates?.some(c => c.id === 'B0' && c.status === 'REJECTED')) fail('B0 must be rejected');
}
const standardPath = path.join(siteDir, 'no-proof-no-settlement-standard.json');
if (fs.existsSync(standardPath)) {
  const standard = JSON.parse(read(standardPath));
  if (standard.tagline !== 'No Proof. No Trust. No Settlement.') fail('standard tagline mismatch');
  if (standard.valueMoved !== 0) fail('standard valueMoved must be 0');
}
if (failures.length) {
  console.error('GoalOS Blockchain Credibility Standard Lab v28 gate FAILED');
  for (const f of failures) console.error(` - ${f}`);
  process.exit(1);
}
console.log(`GoalOS Blockchain Credibility Standard Lab v28 gate PASS (${routes.length} routes, ${config.publicArtifacts.length} artifacts)`);
