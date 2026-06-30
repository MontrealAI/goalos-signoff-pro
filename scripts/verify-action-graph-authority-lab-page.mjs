#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const site = path.join(process.cwd(), 'site');
const routes = ['action-graph-authority-lab.html','human-authority-action-lab.html','scoped-action-lab.html'];
const artifacts = ['action-graph-demo-bundle.json','scoped-action-plan.json','human-authority-gate.json','action-reason-trace.json','action-rollback-map.json','action-graph-receipt.json','action-graph-authority-manifest.json'];
const fail = msg => { console.error('GoalOS Action Graph & Human Authority Lab gate FAILED'); console.error('- ' + msg); process.exit(1); };
const req = rel => { const p = path.join(site, rel); if (!fs.existsSync(p)) fail(`${rel} missing`); return fs.readFileSync(p, 'utf8'); };
const count = (s, needle) => (s.match(new RegExp(needle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;

for (const rel of routes) {
  const html = req(rel);
  if (/Route Not Found|not part of the receipt map/i.test(html)) fail(`${rel} degraded to route fallback`);
  for (const phrase of ['Action is not authority', 'Proof earns scope', 'Run action graph', 'Human Authority', 'Action-Reason Trace', 'No high-impact action without scope']) {
    if (!html.includes(phrase)) fail(`${rel} missing required phrase: ${phrase}`);
  }
  for (const forbidden of [/<form\b/i, /<input\b/i, /<textarea\b/i, /<select\b/i, /type=["']file["']/i, /mailto:/i, /connect wallet/i, /walletconnect/i, /localStorage/i, /sessionStorage/i, /document\.cookie/i, /gtag\(/i, /google-analytics/i, /plausible/i]) {
    if (forbidden.test(html)) fail(`${rel} contains forbidden public-site surface: ${forbidden}`);
  }
  if (count(html, 'data-goalos-legal-rail="v12"') !== 1) fail(`${rel} must contain exactly one v12 legal rail`);
  if (count(html, 'data-goalos-footer="v12"') !== 1) fail(`${rel} must contain exactly one v12 footer`);
  const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/gi)].map(m => m[1]);
  for (const js of scripts) { try { new Function(js); } catch (e) { fail(`${rel} has invalid browser JavaScript: ${e.message}`); } }
}

for (const rel of artifacts) JSON.parse(req(rel));
const bundle = JSON.parse(req('action-graph-demo-bundle.json'));
if (!bundle.actionGraph || !bundle.authorityGate || !bundle.actionReasonTrace || !bundle.rollbackMap || !bundle.receipt) fail('demo bundle missing core objects');
if (bundle.actionGraph.valueMoved !== 0 || bundle.authorityGate.valueMoved !== 0 || bundle.receipt.valueMoved !== 0) fail('valueMoved must remain 0');
if (!bundle.actionGraph.nodes.some(n => n.status === 'blocked')) fail('action graph must block at least one unsafe action');
if (!bundle.actionReasonTrace.some(t => String(t.validatorStatus).includes('human final gate'))) fail('action reason trace must preserve human final gate');
if (!String(bundle.actionGraph.invariant).includes('No high-impact action')) fail('action graph invariant missing high-impact boundary');
if (!Array.isArray(bundle.rollbackMap.rollbackTargets) || bundle.rollbackMap.rollbackTargets.length < 5) fail('rollback map too shallow');
console.log(`GoalOS Action Graph & Human Authority Lab v22 gate PASS (${routes.length} routes, ${artifacts.length} artifacts checked)`);
