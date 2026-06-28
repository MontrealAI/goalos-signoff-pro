#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const site = path.join(root, 'site');
const required = [
  'sovereign-experience-stream-lab.html',
  'sovereign-experience-lab.html',
  'assets/sovereign-experience-v15.css',
  'assets/sovereign-experience-v15.js',
  'sovereign-experience-stream-demo-bundle.json',
  'grounded-reward-ledger.json',
  'temporal-option-registry.json',
  'router-policy-update-certificate.json',
  'experience-reanalyze-report.json'
];
const fail = (msg) => { console.error(`GoalOS Sovereign Experience Stream Lab gate FAILED\n- ${msg}`); process.exit(1); };
for (const file of required) {
  if (!fs.existsSync(path.join(site, file))) fail(`${file} is missing`);
}
const html = fs.readFileSync(path.join(site, 'sovereign-experience-stream-lab.html'), 'utf8');
if (html.includes('Route Not Found') || html.includes('This corridor is not part of the receipt map')) fail('experience lab route resolved to fallback 404 content');
for (const pattern of [/<form\b/i, /<input\b/i, /<textarea\b/i, /<select\b/i]) {
  if (pattern.test(html)) fail(`forbidden public data-entry element found: ${pattern}`);
}
for (const phrase of ['Sovereign experience stream', 'Evidence becomes', 'Run experience stream', 'Grounded Reward Ledger', 'Temporal Option Registry', 'Policy Update Certificate', 'No forms · no inputs · no uploads']) {
  if (!html.includes(phrase)) fail(`required phrase missing from experience lab: ${phrase}`);
}
const rails = (html.match(/Public site rule/g) || []).length;
if (rails !== 1) fail(`expected exactly one public-site rule rail on experience lab, found ${rails}`);
const footerCount = (html.match(/<footer\b/g) || []).length;
if (footerCount !== 1) fail(`expected exactly one footer on experience lab, found ${footerCount}`);
const js = fs.readFileSync(path.join(site, 'assets/sovereign-experience-v15.js'), 'utf8');
for (const forbidden of ['localStorage', 'sessionStorage', 'document.cookie', 'walletconnect', 'connect wallet', 'gtag(']) {
  if (js.toLowerCase().includes(forbidden.toLowerCase())) fail(`forbidden browser behavior marker found in JS: ${forbidden}`);
}
new Function(js);
const bundle = JSON.parse(fs.readFileSync(path.join(site, 'sovereign-experience-stream-demo-bundle.json'), 'utf8'));
if (!bundle.scenarios || !bundle.scenarios.research || !bundle.scenarios.software) fail('experience demo bundle does not contain expected scenarios');
for (const [id, item] of Object.entries(bundle.scenarios)) {
  if (!Array.isArray(item.events) || item.events.length < 7) fail(`scenario ${id} has too few experience events`);
  const accepted = item.events.filter(e => e.verdict === 'accepted').length;
  const held = item.events.filter(e => e.verdict === 'quarantined').length;
  const rejected = item.events.filter(e => e.verdict === 'rejected').length;
  if (accepted < 4 || held < 1 || rejected < 1) fail(`scenario ${id} does not exercise accepted/held/rejected paths`);
  if (!(item.after.verifiedWork > item.before.verifiedWork)) fail(`scenario ${id} does not improve verified work`);
  if (!(item.after.proofDebt < item.before.proofDebt)) fail(`scenario ${id} does not reduce proof debt`);
}
const reward = JSON.parse(fs.readFileSync(path.join(site, 'grounded-reward-ledger.json'), 'utf8'));
if (!Array.isArray(reward.signals) || reward.signals.length < 5) fail('grounded reward ledger has insufficient signals');
const options = JSON.parse(fs.readFileSync(path.join(site, 'temporal-option-registry.json'), 'utf8'));
if (!Array.isArray(options.options) || options.options.length < 3) fail('temporal option registry has insufficient options');
const policy = JSON.parse(fs.readFileSync(path.join(site, 'router-policy-update-certificate.json'), 'utf8'));
if (!policy.gates || !policy.gates.replayPass || !policy.gates.noPrivateData) fail('policy update certificate is missing hard gates');
const indexPath = path.join(site, 'index.html');
if (fs.existsSync(indexPath)) {
  const index = fs.readFileSync(indexPath, 'utf8');
  if (!index.includes('sovereign-experience-stream-lab.html') && !index.includes('sovereign-experience-lab.html')) fail('homepage does not link to the Sovereign Experience Stream Lab');
  const railIdx = index.indexOf('GOALOS-SOVEREIGN-EXPERIENCE-HOME-RAIL');
  const footerIdx = index.indexOf('<footer');
  if (railIdx !== -1 && footerIdx !== -1 && railIdx > footerIdx) fail('homepage experience rail appears after footer');
}
console.log('GoalOS Sovereign Experience Stream Lab gate PASS');
