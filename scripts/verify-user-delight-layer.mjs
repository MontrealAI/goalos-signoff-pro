import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const site = path.join(root, 'site');
const reportDir = path.join(root, 'verification');
fs.mkdirSync(reportDir, { recursive: true });

const required = [
  'start.html','proof-mission.html','proof-mission-demo.html','examples.html','evidence-docket-demo.html','verify.html','deliverables.html','how-it-works.html','pricing.html','faq.html','contact.html','request-access.html','press.html','glossary.html','implementation.html','trust-architecture.html','demo-lab.html','user-delight-manifest.json','assets/user-delight.css','assets/user-delight.js'
];
const failures = [];
const warnings = [];
function fail(m){ failures.push(m); }
function warn(m){ warnings.push(m); }
function read(rel){ return fs.readFileSync(path.join(site, rel), 'utf8'); }

if (!fs.existsSync(site)) fail('Missing site/ directory. Build the Pages site first.');
for (const rel of required) if (!fs.existsSync(path.join(site, rel))) fail(`Missing required user-delight artifact: ${rel}`);

const pages = required.filter(f => f.endsWith('.html'));
for (const rel of pages) {
  if (!fs.existsSync(path.join(site, rel))) continue;
  const html = read(rel);
  if (html.length < 5200) fail(`${rel} is too thin (${html.length} bytes)`);
  if (!html.includes('info@quebec.ai')) fail(`${rel} does not include info@quebec.ai`);
  if (/contact@montreal\.ai/i.test(html)) fail(`${rel} contains contact@montreal.ai`);
  if (/<form\b/i.test(html)) fail(`${rel} contains a form tag; public site must not collect data`);
  if (/google-analytics|gtag\(|segment\.io|mixpanel|hotjar|clarity\.ms/i.test(html)) fail(`${rel} contains tracking/analytics marker`);
  if (/walletconnect|connect wallet/i.test(html)) fail(`${rel} contains wallet-connect language`);
  if (/live escrow|staking is live|mainnet settlement is live/i.test(html)) fail(`${rel} contains unsupported live settlement/staking claim`);
  if (!/browser-local|public-safe|No upload|no upload|No forms|no forms/i.test(html)) warn(`${rel} does not visibly state public-safe/browser-local/no-form posture`);
}

if (fs.existsSync(path.join(site,'proof-mission-demo.html'))) {
  const h = read('proof-mission-demo.html');
  for (const marker of ['Launch autonomous demo','data-run-proof','data-proof-log','Download demo docket']) if (!h.includes(marker)) fail(`proof-mission-demo.html missing ${marker}`);
}
if (fs.existsSync(path.join(site,'evidence-docket-demo.html'))) {
  const h = read('evidence-docket-demo.html');
  for (const marker of ['Manifest','Claims','Evidence','Risk','Receipt','Replay']) if (!h.includes(marker)) fail(`evidence-docket-demo.html missing tab ${marker}`);
}
if (fs.existsSync(path.join(site,'verify.html'))) {
  const h = read('verify.html');
  for (const marker of ['Verify demo receipt','data-verify-output','demo-sha256']) if (!h.includes(marker)) fail(`verify.html missing ${marker}`);
}
if (fs.existsSync(path.join(site,'user-delight-manifest.json'))) {
  try { const m = JSON.parse(read('user-delight-manifest.json')); if (!m.siteHash || !m.fileHashes) fail('user-delight-manifest.json missing siteHash/fileHashes'); } catch(e) { fail('user-delight-manifest.json is invalid JSON'); }
}
const js = fs.existsSync(path.join(site,'assets/user-delight.js')) ? read('assets/user-delight.js') : '';
if (/fetch\(|XMLHttpRequest|navigator\.sendBeacon|localStorage|sessionStorage/i.test(js)) fail('user-delight.js contains network/storage behavior');
if (!js.includes('GoalOSDemo')) fail('user-delight.js missing GoalOSDemo demo API');

const report = { status: failures.length ? 'FAIL' : 'PASS', checkedAt: new Date().toISOString(), failures, warnings, required };
fs.writeFileSync(path.join(reportDir, 'USER_DELIGHT_LAYER_REPORT.json'), JSON.stringify(report, null, 2));
fs.writeFileSync(path.join(reportDir, 'USER_DELIGHT_LAYER_REPORT.md'), `# GoalOS User Delight Layer Report\n\nStatus: **${report.status}**\n\n## Failures\n${failures.length ? failures.map(f=>`- ${f}`).join('\n') : 'None'}\n\n## Warnings\n${warnings.length ? warnings.map(w=>`- ${w}`).join('\n') : 'None'}\n`);
if (failures.length) { console.error('GoalOS User Delight Layer: FAIL'); for (const f of failures) console.error('- '+f); process.exit(1); }
console.log('GoalOS User Delight Layer: PASS');
