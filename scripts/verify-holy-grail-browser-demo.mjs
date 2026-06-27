import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const siteDir = path.join(root, 'site');
const required = [
  'holy-grail.html',
  'proof-gated-work-machine.html',
  'proof-run-001.html',
  'compounding-loop.html',
  'assets/holy-grail-browser.css',
  'assets/holy-grail-browser.js',
  'holy-grail-browser-manifest.json',
  'holy-grail-demo-bundle.json'
];
const errors = [];
const read = (p) => fs.readFileSync(path.join(siteDir, p), 'utf8');
for (const f of required) {
  if (!fs.existsSync(path.join(siteDir, f))) errors.push(`Missing required Holy Grail browser demo file: ${f}`);
}
if (errors.length === 0) {
  const pages = ['holy-grail.html','proof-gated-work-machine.html','proof-run-001.html','compounding-loop.html'];
  for (const p of pages) {
    const html = read(p);
    if (html.length < 7500) errors.push(`${p} is too thin for the flagship browser demo (${html.length} bytes).`);
    for (const forbidden of ['<textarea', '<input', '<form', 'walletconnect', 'connect wallet', 'posthog', 'gtag(', 'google-analytics', 'plausible.io', 'contact@montreal.ai']) {
      if (html.toLowerCase().includes(forbidden)) errors.push(`${p} contains forbidden public demo marker: ${forbidden}`);
    }
    for (const requiredText of ['Browser-local', 'No forms', 'no uploads', 'no cookies', 'no analytics', 'no wallets', 'no payments']) {
      if (!html.includes(requiredText)) errors.push(`${p} missing required no-user-data/public-demo text: ${requiredText}`);
    }
  }
  const holy = read('holy-grail.html');
  for (const phrase of ['Holy Grail candidate', 'proof-gated open-ended work', 'Only verified experience can influence the next cycle']) {
    if (!holy.includes(phrase)) errors.push(`holy-grail.html missing flagship phrase: ${phrase}`);
  }
  const proofRun = read('proof-run-001.html');
  for (const phrase of ['Launch proof loop', 'Download demo docket', 'No input boxes', 'No upload', 'No account', 'No wallet']) {
    if (!proofRun.includes(phrase)) errors.push(`proof-run-001.html missing browser-local proof run phrase: ${phrase}`);
  }
  const js = read('assets/holy-grail-browser.js');
  for (const phrase of ['GoalOSBrowserLocalProofRun001', 'valueMoved:0', 'noUserData:true']) {
    if (!js.replace(/\s+/g, '').includes(phrase.replace(/\s+/g, ''))) errors.push(`holy-grail-browser.js missing deterministic demo marker: ${phrase}`);
  }
  const css = read('assets/holy-grail-browser.css');
  for (const phrase of ['#hgField', '.hg-console', '.hg-orbit-wrap']) {
    if (!css.includes(phrase)) errors.push(`holy-grail-browser.css missing visual/effects selector: ${phrase}`);
  }
  const manifest = JSON.parse(read('holy-grail-browser-manifest.json'));
  if (manifest.browserLocal !== true || manifest.noUserData !== true || manifest.valueMoved !== 0) errors.push('Holy Grail manifest must assert browserLocal=true, noUserData=true, valueMoved=0.');
  const bundle = JSON.parse(read('holy-grail-demo-bundle.json'));
  if (bundle.valueMoved !== 0 || bundle.noUserData !== true) errors.push('Demo bundle must be public-safe and move zero value.');
  if (!JSON.stringify(bundle).includes('Settlement Signal')) errors.push('Demo bundle must include the settlement signal stage.');

  if (fs.existsSync(path.join(siteDir, 'index.html'))) {
    const index = read('index.html');
    const rail = index.indexOf('GOALOS_HOLY_GRAIL_BROWSER_START');
    const footer = index.search(/<footer\b|Privacy|Terms|No User Data/i);
    if (rail < 0) errors.push('Homepage missing Holy Grail browser demo rail.');
    if (rail >= 0 && footer >= 0 && rail > footer) errors.push('Homepage Holy Grail browser demo rail appears below legal/footer navigation.');
  }
}

if (errors.length) {
  console.error('GoalOS Holy Grail Browser Demo gate: FAIL');
  for (const e of errors) console.error(`- ${e}`);
  process.exit(1);
}
console.log('GoalOS Holy Grail Browser Demo gate: PASS');
