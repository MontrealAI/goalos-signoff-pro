#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const site = path.join(root, 'site');
const fail = msg => { console.error('GoalOS Sovereign Experience Stream Lab v15.2 gate FAILED'); console.error('- '+msg); process.exit(1); };
const required = [
  'sovereign-experience-stream-lab.html',
  'sovereign-experience-lab.html',
  'assets/sovereign-experience-v15-2.css',
  'assets/sovereign-experience-v15-2.js',
  'sovereign-experience-stream-demo-bundle.json',
  'grounded-reward-ledger.json',
  'temporal-option-registry.json',
  'router-policy-update-certificate.json',
  'experience-reanalyze-report.json',
  'sovereign-experience-stream-manifest.json'
];
for (const rel of required) if (!fs.existsSync(path.join(site, rel))) fail(`${rel} is missing`);
for (const rel of ['sovereign-experience-stream-lab.html','sovereign-experience-lab.html']) {
  const html = fs.readFileSync(path.join(site, rel), 'utf8');
  if (html.includes('Route Not Found') || html.includes('not part of the receipt map')) fail(`${rel} is fallback 404 content`);
  if ((html.match(/data-goalos-legal-rail="v12"/g) || []).length !== 1) fail(`${rel} must contain exactly one v12 legal rail`);
  if ((html.match(/Public site rule/g) || []).length !== 1) fail(`${rel} must contain exactly one Public site rule phrase`);
  if ((html.match(/<footer\b/gi) || []).length !== 1) fail(`${rel} must contain exactly one footer`);
  for (const re of [/<form\b/i, /<input\b/i, /<textarea\b/i, /<select\b/i]) if (re.test(html)) fail(`${rel} contains forbidden data-entry element ${re}`);
  for (const phrase of ['Accepted proof becomes sovereign experience','Run the sovereign experience stream','Grounded Reward Ledger','Temporal Option Registry','Router Policy Update Certificate','Evidence Docket','No forms · no inputs · no uploads']) {
    if (!html.includes(phrase)) fail(`${rel} missing required phrase: ${phrase}`);
  }
  if (html.length < 10000) fail(`${rel} is too thin (${html.length} bytes)`);
}
const js = fs.readFileSync(path.join(site, 'assets/sovereign-experience-v15-2.js'), 'utf8');
for (const forbidden of ['localStorage','sessionStorage','document.cookie','walletconnect','connect wallet','gtag(','plausible']) if (js.toLowerCase().includes(forbidden.toLowerCase())) fail(`forbidden browser behavior marker found in JS: ${forbidden}`);
new Function(js);
const bundle = JSON.parse(fs.readFileSync(path.join(site, 'sovereign-experience-stream-demo-bundle.json'), 'utf8'));
if (!bundle.scenarios || Object.keys(bundle.scenarios).length < 4) fail('experience bundle must contain at least four scenarios');
for (const [id, item] of Object.entries(bundle.scenarios)) {
  if (!Array.isArray(item.events) || item.events.length < 10) fail(`${id} has too few events`);
  const accepted = item.events.filter(e => e.verdict === 'accepted').length;
  const held = item.events.filter(e => e.verdict === 'quarantined').length;
  const rejected = item.events.filter(e => e.verdict === 'rejected').length;
  if (accepted < 6 || held < 1 || rejected < 1) fail(`${id} does not exercise accepted/quarantined/rejected paths`);
  if (!(item.after.verifiedWork > item.before.verifiedWork)) fail(`${id} does not improve verified work`);
  if (!(item.after.proofDebt < item.before.proofDebt)) fail(`${id} does not reduce proof debt`);
  if (!(item.after.rewardRisk < item.before.rewardRisk)) fail(`${id} does not reduce reward risk`);
  if (!item.option || !item.option.validator) fail(`${id} missing temporal option`);
}
const reward = JSON.parse(fs.readFileSync(path.join(site, 'grounded-reward-ledger.json'), 'utf8'));
if (!Array.isArray(reward.signals) || reward.signals.length < 6) fail('grounded reward ledger requires at least six signals');
const options = JSON.parse(fs.readFileSync(path.join(site, 'temporal-option-registry.json'), 'utf8'));
if (!Array.isArray(options.options) || options.options.length < 4) fail('temporal option registry requires at least four options');
const policy = JSON.parse(fs.readFileSync(path.join(site, 'router-policy-update-certificate.json'), 'utf8'));
if (!policy.gates || !policy.gates.proofValid || !policy.gates.replayPass || !policy.gates.noPrivateData) fail('policy update certificate missing hard gates');
const reanalyze = JSON.parse(fs.readFileSync(path.join(site, 'experience-reanalyze-report.json'), 'utf8'));
if (!Array.isArray(reanalyze.findings) || reanalyze.findings.length < 4) fail('reanalyze report too thin');
if (fs.existsSync(path.join(site, 'index.html'))) {
  const home = fs.readFileSync(path.join(site, 'index.html'), 'utf8');
  if (!home.includes('sovereign-experience-stream-lab.html')) fail('homepage does not link sovereign experience stream lab');
  const homeRail = home.indexOf('GOALOS-SOVEREIGN-EXPERIENCE-HOME-RAIL');
  const footer = home.indexOf('<footer');
  if (homeRail !== -1 && footer !== -1 && homeRail > footer) fail('homepage experience rail appears after footer');
}
console.log('GoalOS Sovereign Experience Stream Lab v15.2 gate PASS');
