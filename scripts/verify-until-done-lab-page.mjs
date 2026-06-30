#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const site = path.join(process.cwd(), 'site');
const fail = msg => { console.error('GoalOS Until-DONE Mission Control Lab gate FAILED'); console.error('- ' + msg); process.exit(1); };
const req = rel => { const p = path.join(site, rel); if (!fs.existsSync(p)) fail(`${rel} missing`); return fs.readFileSync(p, 'utf8'); };
const count = (s, needle) => (s.match(new RegExp(needle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;

for (const rel of ['until-done-lab.html', 'mission-control-lab.html', 'proof-debt-lab.html']) {
  const html = req(rel);
  if (/Route Not Found|not part of the receipt map/i.test(html)) fail(`${rel} degraded to route fallback`);
  for (const phrase of ['GoalOS runs until', 'Run until DONE', 'proof debt', 'Governed Decision State', 'Chronicle', 'No Evidence Docket, no DONE']) {
    if (!html.includes(phrase)) fail(`${rel} missing required phrase: ${phrase}`);
  }
  for (const forbidden of [/<form\b/i, /<input\b/i, /<textarea\b/i, /<select\b/i, /type=["']file["']/i, /mailto:/i, /connect wallet/i, /walletconnect/i, /localStorage/i, /sessionStorage/i, /document\.cookie/i, /gtag\(/i, /google-analytics/i, /plausible/i]) {
    if (forbidden.test(html)) fail(`${rel} contains forbidden public-site surface: ${forbidden}`);
  }
  if (count(html, 'data-goalos-legal-rail="v12"') !== 1) fail(`${rel} must contain exactly one v12 legal rail`);
  if (count(html, 'data-goalos-footer="v12"') !== 1) fail(`${rel} must contain exactly one v12 footer`);
  const scriptBlocks = [...html.matchAll(/<script>([\s\S]*?)<\/script>/gi)].map(m => m[1]);
  for (const js of scriptBlocks) {
    try { new Function(js); } catch (e) { fail(`${rel} has invalid browser JavaScript: ${e.message}`); }
  }
}

const artifacts = ['until-done-demo-bundle.json','mission-done-certificate.json','proof-debt-burndown-ledger.json','until-done-action-graph.json','until-done-chronicle-entry.json','until-done-manifest.json'];
for (const rel of artifacts) JSON.parse(req(rel));
const bundle = JSON.parse(req('until-done-demo-bundle.json'));
if (!bundle.missionContract || !bundle.proofDebtLedger || !bundle.decisionState || !bundle.certificate) fail('demo bundle missing core objects');
if (bundle.decisionState.valueMoved !== 0) fail('valueMoved must be 0');
if (!Array.isArray(bundle.proofDebtLedger) || bundle.proofDebtLedger.length < 10) fail('proof debt ledger too shallow');
if (bundle.proofDebtLedger[0].proofDebt <= bundle.proofDebtLedger.at(-1).proofDebt) fail('proof debt must decrease');
if (!String(bundle.certificate.status).includes('DONE=true')) fail('certificate must declare DONE=true synthetic status');
console.log(`GoalOS Until-DONE Mission Control Lab v21 gate PASS (${artifacts.length} artifacts checked)`);
