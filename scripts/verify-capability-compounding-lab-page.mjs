#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const site = path.join(root, 'site');
const fail = msg => { console.error(`GoalOS Capability Compounding Lab gate FAILED\n- ${msg}`); process.exit(1); };
const read = rel => fs.existsSync(path.join(site, rel)) ? fs.readFileSync(path.join(site, rel), 'utf8') : '';
if (!fs.existsSync(site)) fail('site/ does not exist. Run the production site generator first.');
const required = [
  'capability-compounding-lab.html',
  'assets/capability-compounding-v14-2.css',
  'assets/capability-compounding-v14-2.js',
  'capability-compounding-demo-bundle.json',
  'capability-package-library.json',
  'chronicle-compounding-entry.json',
  'capability-compounding-scoreboard.json',
  'capability-compounding-manifest.json'
];
for (const file of required) if (!fs.existsSync(path.join(site, file))) fail(`Missing required file: ${file}`);
const forbidden = [
  /<form\b/i, /<input\b/i, /<textarea\b/i, /<select\b/i, /type=["']file["']/i,
  /mailto:/i, /contact@montreal\.ai/i, /connect[- ]?wallet/i, /walletconnect/i,
  /document\.cookie/i, /localStorage/i, /sessionStorage/i, /google-analytics/i, /gtag\(/i, /plausible\.io/i,
  /guaranteed\s+(return|profit|yield|roi)/i, /achieved\s+(agi|asi|superintelligence)/i,
  /live\s+(escrow|staking)/i, /mainnet settlement is live/i
];
for (const rel of required) {
  const txt = read(rel);
  for (const pattern of forbidden) if (pattern.test(txt)) fail(`${rel} contains forbidden public-site pattern: ${pattern}`);
}
const html = read('capability-compounding-lab.html');
if (/Route Not Found|not part of the receipt map/i.test(html)) fail('capability-compounding-lab.html is rendering a Route Not Found fallback');
const combinedLength = html.length + read('assets/capability-compounding-v14-2.css').length + read('assets/capability-compounding-v14-2.js').length;
if (html.length < 8000 || combinedLength < 26000) fail(`Enhanced flagship lab is too thin: html=${html.length}, combined=${combinedLength}`);
const requiredPhrases = [
  'Accepted proof becomes', 'institutional memory', 'Choose the public-safe mission series', 'Watch proof become capability',
  'Evidence-state trace', 'Capability library', 'Chronicle', 'Transfer matrix', 'Score does not write memory',
  'No proof, no memory', 'No eval, no propagation', 'No replay, no capability'
];
for (const phrase of requiredPhrases) if (!html.includes(phrase)) fail(`capability-compounding-lab.html missing required phrase: ${phrase}`);
const railCount = (html.match(/Public site rule/g) || []).length;
if (railCount !== 1) fail(`capability-compounding-lab.html must contain exactly one Public site rule rail; found ${railCount}`);
const footerCount = (html.match(/<footer\b/gi) || []).length;
if (footerCount !== 1) fail(`capability-compounding-lab.html must contain exactly one footer; found ${footerCount}`);
const footerIndex = html.search(/<footer\b/i);
const labIndex = html.indexOf('Watch proof become capability');
if (footerIndex >= 0 && labIndex > footerIndex) fail('Main lab content appears after the footer.');
const bundle = JSON.parse(read('capability-compounding-demo-bundle.json'));
if (bundle.schema !== 'goalos.capability_compounding.interactive_demo_bundle.v2') fail('Demo bundle schema mismatch.');
if (!Array.isArray(bundle.scenarios) || bundle.scenarios.length < 4) fail('Demo bundle must contain at least four scenarios.');
if (!Array.isArray(bundle.gates) || bundle.gates.length < 8) fail('Demo bundle must include hard gates.');
for (const scenario of bundle.scenarios) {
  if (!Array.isArray(scenario.cycles) || scenario.cycles.length !== 3) fail(`Scenario ${scenario.scenario?.id || 'unknown'} must contain exactly three compounding cycles.`);
  const first = scenario.cycles[0], last = scenario.cycles.at(-1);
  if (last.verifiedWork <= first.verifiedWork) fail(`Verified work must increase for scenario ${scenario.scenario.id}.`);
  if (last.proofDebt >= first.proofDebt) fail(`Proof debt must decrease for scenario ${scenario.scenario.id}.`);
  if (!scenario.cycles.every(c => c.capability_package && c.evidence_docket_hash && c.selection_certificate_hash && c.proof_packet_hash)) fail(`Scenario ${scenario.scenario.id} missing proof/capability fields.`);
}
const library = JSON.parse(read('capability-package-library.json'));
if (!Array.isArray(library.capabilities) || library.capabilities.length < 12) fail('Capability library must contain the scenario capability packages.');
const chronicle = JSON.parse(read('chronicle-compounding-entry.json'));
if (!Array.isArray(chronicle.entries) || chronicle.entries.length < 12) fail('Chronicle must contain the scenario entries.');
const scoreboard = JSON.parse(read('capability-compounding-scoreboard.json'));
if (!Array.isArray(scoreboard.metrics) || scoreboard.metrics.length < 4) fail('Scoreboard must include all scenarios.');
const js = read('assets/capability-compounding-v14-2.js');
new Function(js);
const css = read('assets/capability-compounding-v14-2.css');
if (!css.includes('@media') || !css.includes('grid-template-columns')) fail('CSS must include responsive production layout rules.');
console.log(`GoalOS Capability Compounding Lab gate PASS (${bundle.scenarios.length} scenarios, ${library.capabilities.length} capability packages)`);
