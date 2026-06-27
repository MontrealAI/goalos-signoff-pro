#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import childProcess from 'node:child_process';

const root = process.cwd();
const siteDir = path.join(root, 'site');
const fail = (message) => { console.error(`User Delight Autopilot v4.1 gate: FAIL\n- ${message}`); process.exit(1); };
const exists = (rel) => fs.existsSync(path.join(siteDir, rel));
const read = (rel) => fs.readFileSync(path.join(siteDir, rel), 'utf8');

if (!fs.existsSync(siteDir)) fail('site/ directory does not exist. Run the public-site generators first.');

const required = [
  'demo-lab.html','proof-mission-builder.html','demo-gallery.html','evidence-docket-lab.html','receipt-verifier-demo.html','autonomous-demo.html','proof-mission.html','evidence-docket-demo.html','verify.html','user-delight-manifest.json','assets/user-delight-v4.css','assets/user-delight-v4.js','demo/proof-mission/mission-contract.json','demo/proof-mission/evidence-docket.json','demo/proof-mission/mission-receipt.json','demo/proof-mission/public-report.html'
];
for (const rel of required) {
  const file = path.join(siteDir, rel);
  if (!fs.existsSync(file)) fail(`Missing required artifact: ${rel}`);
  if (rel.endsWith('.html')) {
    const minSize = rel.startsWith('demo/proof-mission/') ? 1500 : 2600;
    if (fs.statSync(file).size < minSize) fail(`Generated HTML page is too thin: ${rel}`);
  }
}

try { childProcess.execFileSync(process.execPath, ['--check', path.join(siteDir, 'assets/user-delight-v4.js')], { stdio: 'pipe' }); }
catch (error) { fail(`Browser demo JavaScript has a syntax error: ${error.stderr?.toString() || error.message}`); }

const demoLab = read('demo-lab.html');
for (const marker of ['Run a proof mission demo.', 'Launch proof cycle', 'Proof-to-acceptance console', 'Choose a public-safe mission', 'No sign-in', 'No upload', 'No wallet', 'Evidence Docket']) {
  if (!demoLab.includes(marker)) fail(`demo-lab.html is missing visible demo content: ${marker}`);
}
const css = read('assets/user-delight-v4.css');
const hiddenPatterns = [/\.ud-hero\s*\{[^}]*display\s*:\s*none/i, /\.proof-console\s*\{[^}]*display\s*:\s*none/i, /\.user-delight-rail\s*\{[^}]*display\s*:\s*none/i, /opacity\s*:\s*0\s*;[^}]*\.ud-hero/i];
for (const pattern of hiddenPatterns) if (pattern.test(css)) fail('Primary demo surfaces must be visible without reveal animation.');

const index = exists('index.html') ? read('index.html') : '';
if (index) {
  const railIndex = index.indexOf('user-delight-rail');
  const footerIndex = index.search(/<footer\b/i);
  const boundaryIndex = index.indexOf('boundary-rail');
  const mainStart = index.search(/<main\b/i);
  const firstSectionEnd = mainStart >= 0 ? index.indexOf('</section>', mainStart) : -1;
  if (railIndex < 0) fail('Homepage is missing the User Delight demo rail.');
  if (footerIndex >= 0 && railIndex > footerIndex) fail('Homepage demo rail appears after the footer; it must appear before footer/legal navigation.');
  if (boundaryIndex >= 0 && railIndex > boundaryIndex) fail('Homepage demo rail appears after the legal/token boundary rail; it must appear in the user-facing product content area.');
  if (firstSectionEnd >= 0 && railIndex > firstSectionEnd + 2200) fail('Homepage demo rail is too low on the page; it should appear near the top of product content.');
}

const script = read('assets/user-delight-v4.js');
for (const marker of ['requestAnimationFrame','Launch proof cycle','paint(100)','Valid demo receipt',"join('\\n')"]) if (!script.includes(marker)) fail(`Interactive script missing marker: ${marker}`);

const allSiteFiles = [];
function walk(dir){ for(const entry of fs.readdirSync(dir,{withFileTypes:true})){ const file=path.join(dir,entry.name); if(entry.isDirectory()) walk(file); else allSiteFiles.push(file); } }
walk(siteDir);
const html = allSiteFiles.filter(file=>file.endsWith('.html')).map(file=>fs.readFileSync(file,'utf8')).join('\n');
const blocked = [
  [/contact@montreal\.ai/i,'contact@montreal.ai must not appear'],[/<form\b/i,'Forms are not allowed on public demo pages'],[/<input\b/i,'Inputs are not allowed on public demo pages'],[/<textarea\b/i,'Textareas are not allowed on public demo pages'],[/document\.cookie|set-cookie|localStorage|sessionStorage/i,'Cookies or persistent browser storage are not allowed'],[/walletconnect|connect wallet|metamask/i,'Wallet-connect language is not allowed'],[/sk_live_|ghp_[A-Za-z0-9_]+|BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY/i,'Secret-like credential marker found'],[/guaranteed\s+(roi|return|profit|yield)/i,'Guaranteed investment-return language is not allowed'],[/mainnet settlement is live|staking is live|escrow is live/i,'Unsupported live protocol claim is not allowed']
];
for (const [pattern, message] of blocked) {
  if (pattern.test(script)) fail(`${message} in assets/user-delight-v4.js`);
  const offenders = allSiteFiles
    .filter((file) => file.endsWith('.html'))
    .filter((file) => pattern.test(fs.readFileSync(file, 'utf8')))
    .map((file) => path.relative(siteDir, file));
  if (offenders.length) fail(`${message}: ${offenders.join(', ')}`);
}
if(!/info@quebec\.ai/i.test(html)) fail('info@quebec.ai must appear on public pages.');

const manifest = JSON.parse(read('user-delight-manifest.json'));
if(manifest.version !== '4.1.0-final') fail('Manifest must be version 4.1.0-final.');
if(manifest.contactEmail !== 'info@quebec.ai') fail('Manifest must use info@quebec.ai.');
for(const fix of ['homepage rail inserted before footer','demo lab visible without JavaScript reveal dependency','quality gate checks visible content rather than decorative backgrounds','legacy public textareas removed']) if(!manifest.fixes?.includes(fix)) fail(`Manifest must record fix: ${fix}`);

const docket = JSON.parse(read('demo/proof-mission/evidence-docket.json'));
if(!docket.publicSafe) fail('Demo Evidence Docket must be publicSafe=true.');
if(!docket.receipt?.evidenceHash) fail('Demo docket must include a receipt evidence hash.');

console.log('GoalOS User Delight Autopilot v4.1 gate: PASS');
console.log('Checked visible demo content, homepage placement, public-safe demo artifacts, no-user-data boundaries, and valid JavaScript.');
