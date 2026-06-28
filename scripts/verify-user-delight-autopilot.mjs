#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import childProcess from 'node:child_process';

const root = process.cwd();
const siteDir = path.join(root, 'site');
const errors = [];
const fail = (message) => errors.push(message);
const exists = (rel) => fs.existsSync(path.join(siteDir, rel));
const read = (rel) => fs.readFileSync(path.join(siteDir, rel), 'utf8');
function walk(dir, out=[]){ if(!fs.existsSync(dir)) return out; for(const entry of fs.readdirSync(dir,{withFileTypes:true})){ const file=path.join(dir,entry.name); if(entry.isDirectory()) walk(file,out); else out.push(file); } return out; }

if (!fs.existsSync(siteDir)) fail('site/ directory does not exist. Run the public-site generators first.');

const required = [
  'demo-lab.html','evidence-docket-demo.html','verify.html',
  'demo/proof-mission/mission-contract.json','demo/proof-mission/evidence-docket.json','demo/proof-mission/mission-receipt.json','demo/proof-mission/public-report.html'
];
for (const rel of required) {
  const file = path.join(siteDir, rel);
  if (!fs.existsSync(file)) fail(`Missing required artifact: ${rel}`);
  else if (rel.endsWith('.html') && fs.statSync(file).size < 2200) fail(`Generated HTML page is too thin: ${rel}`);
}

for (const js of ['assets/user-delight-v4.js','assets/browser-beta-v8.js']) {
  const file = path.join(siteDir, js);
  if (fs.existsSync(file)) {
    try { childProcess.execFileSync(process.execPath, ['--check', file], { stdio: 'pipe' }); }
    catch (error) { fail(`${js} has a syntax error: ${error.stderr?.toString() || error.message}`); }
  }
}

if (exists('demo-lab.html')) {
  const demoLab = read('demo-lab.html');
  const acceptableDemoProfiles = [
    ['Run a proof mission demo.', 'Launch proof cycle', 'Proof-to-acceptance console', 'Choose a public-safe mission', 'No sign-in', 'No upload', 'No wallet', 'Evidence Docket'],
    ['Browser beta', 'Launch proof cycle', 'Proof-to-acceptance console', 'Open browser beta', 'No sign-in', 'No upload', 'No wallet', 'Evidence Docket'],
    ['Run the product in your browser.', 'Launch proof cycle', 'Download demo docket', 'No account', 'No email', 'No upload', 'No wallet', 'Evidence Docket']
  ];
  const matched = acceptableDemoProfiles.some(profile => profile.every(marker => demoLab.includes(marker)));
  if (!matched) fail('demo-lab.html is missing a complete visible demo profile. Expected either User Delight v4.1 markers or Browser Beta v8 markers.');
}

const allSiteFiles = walk(siteDir);
const htmlFiles = allSiteFiles.filter(file=>file.endsWith('.html'));
const html = htmlFiles.map(file=>fs.readFileSync(file,'utf8')).join('\n');
const blocked = [
  [/contact@montreal\.ai/i,'contact@montreal.ai must not appear'],
  [/<form\b/i,'Forms are not allowed on public demo pages'],
  [/<input\b/i,'Inputs are not allowed on public demo pages'],
  [/<textarea\b/i,'Textareas are not allowed on public demo pages'],
  [/<select\b/i,'Selects are not allowed on public demo pages'],
  [/document\.cookie|set-cookie|localStorage|sessionStorage/i,'Cookies or persistent browser storage are not allowed'],
  [/walletconnect|connect wallet|metamask/i,'Wallet-connect language is not allowed'],
  [/sk_live_|ghp_[A-Za-z0-9_]+|BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY/i,'Secret-like credential marker found'],
  [/guaranteed\s+(roi|return|profit|yield)/i,'Guaranteed investment-return language is not allowed'],
  [/mainnet settlement is live|staking is live|escrow is live/i,'Unsupported live protocol claim is not allowed']
];
for (const [pattern, message] of blocked) {
  const offenders = allSiteFiles
    .filter((file) => /\.(html|js|json|txt)$/i.test(file))
    .filter((file) => pattern.test(fs.readFileSync(file, 'utf8')))
    .map((file) => path.relative(siteDir, file).replaceAll('\\','/'));
  if (offenders.length) fail(`${message}: ${offenders.slice(0,20).join(', ')}${offenders.length>20?' ...':''}`);
}
if(!/info@quebec\.ai/i.test(html)) fail('info@quebec.ai must appear on public pages.');

if (exists('index.html')) {
  const index = read('index.html');
  const demoSignals = ['browser-local proof mission demo','Holy Grail candidate','proof-governed institution','Open browser beta','Run the product in your browser'].filter(s => index.includes(s)).length;
  if (demoSignals < 1) fail('Homepage is missing a visible browser demo or proof loop entry point.');
  const footerIndex = index.search(/<footer\b/i);
  const railCandidates = ['browser beta','holy-grail-rail','user-delight-rail','multi-agent'].map(s => index.indexOf(s)).filter(i => i >= 0);
  const firstRail = railCandidates.length ? Math.min(...railCandidates) : -1;
  if (firstRail < 0) fail('Homepage is missing browser-demo product content.');
  if (footerIndex >= 0 && firstRail > footerIndex) fail('Homepage demo content appears after the footer.');
}

for (const json of ['demo/proof-mission/evidence-docket.json','demo/proof-mission/mission-receipt.json']) {
  if (exists(json)) {
    try { JSON.parse(read(json)); } catch { fail(`${json} is not valid JSON`); }
  }
}
if (exists('demo/proof-mission/evidence-docket.json')) {
  const docket = JSON.parse(read('demo/proof-mission/evidence-docket.json'));
  if(!docket.publicSafe) fail('Demo Evidence Docket must be publicSafe=true.');
}

if (errors.length) {
  console.error('GoalOS User Delight Autopilot gate: FAIL');
  for (const e of errors) console.error(`- ${e}`);
  process.exit(1);
}
console.log(`GoalOS User Delight Autopilot gate: PASS (${htmlFiles.length} HTML pages scanned)`);
