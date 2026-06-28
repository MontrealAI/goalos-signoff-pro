import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const site = path.join(root, 'site');
const fail = (msg) => { console.error(`GoalOS Capability Compounding Lab gate FAILED\n- ${msg}`); process.exit(1); };
const required = [
  'capability-compounding-lab.html',
  'assets/capability-compounding-v14.css',
  'assets/capability-compounding-v14.js',
  'capability-compounding-demo-bundle.json',
  'capability-package-library.json',
  'chronicle-compounding-entry.json',
  'capability-compounding-manifest.json'
];
for (const file of required) if (!fs.existsSync(path.join(site, file))) fail(`Missing required file: ${file}`);

const files = [];
function walk(dir) {
  for (const entry of fs.readdirSync(dir)) {
    const p = path.join(dir, entry);
    const st = fs.statSync(p);
    if (st.isDirectory()) walk(p); else files.push(p);
  }
}
walk(site);
const publicFiles = required.map(rel => path.join(site, rel));
const htmlFiles = files.filter(p => p.endsWith('.html'));
const disallowedHtml = [/<form\b/i, /<input\b/i, /<textarea\b/i, /<select\b/i, /type=["']file["']/i];
const blockedPhrases = [
  /contact@montreal\.ai/i,
  /guaranteed\s+(return|profit|yield|roi)/i,
  /achieved\s+(agi|asi|superintelligence)/i,
  /live\s+(escrow|staking|mainnet settlement)/i,
  /connect\s+wallet/i,
  /walletconnect/i,
  /document\.cookie/i,
  /localStorage/i,
  /sessionStorage/i,
  /google-analytics/i,
  /gtag\(/i,
  /plausible\.io/i,
  /mailto:/i
];
for (const file of publicFiles) {
  const rel = path.relative(site, file).replaceAll('\\','/');
  const txt = fs.readFileSync(file, 'utf8');
  for (const re of blockedPhrases) if (re.test(txt)) fail(`${rel} contains blocked phrase/pattern: ${re}`);
  if (file.endsWith('.html')) {
    for (const re of disallowedHtml) if (re.test(txt)) fail(`${rel} contains disallowed public input/control: ${re}`);
    const railCount = (txt.match(/Public site rule/g) || []).length;
    if (railCount !== 1) fail(`${rel} must contain exactly one Public site rule rail; found ${railCount}`);
    const footerCount = (txt.match(/<footer\b/gi) || []).length;
    if (footerCount !== 1) fail(`${rel} must contain exactly one footer; found ${footerCount}`);
  }
}

const page = fs.readFileSync(path.join(site, 'capability-compounding-lab.html'), 'utf8');
for (const phrase of [
  'Accepted proof becomes',
  'Memory accepts only proof',
  'Run compounding cycle',
  'Capability ledger',
  'No proof, no memory'
]) if (!page.includes(phrase)) fail(`capability-compounding-lab.html missing phrase: ${phrase}`);

const bundle = JSON.parse(fs.readFileSync(path.join(site, 'capability-compounding-demo-bundle.json'), 'utf8'));
if (bundle.schema !== 'goalos.capability_compounding.demo_bundle.v1') fail('Demo bundle schema mismatch.');
if (!Array.isArray(bundle.missions) || bundle.missions.length !== 3) fail('Demo bundle must contain exactly three missions.');
if (!bundle.missions.every(m => m.capability_package && m.evidence_docket_hash && m.selection_certificate)) fail('Every mission must include capability package, evidence docket hash, and selection certificate.');
if (bundle.metrics.verified_work_end <= bundle.metrics.verified_work_start) fail('Verified work must increase across the synthetic compounding run.');
if (bundle.metrics.proof_debt_end >= bundle.metrics.proof_debt_start) fail('Proof debt must decrease across the synthetic compounding run.');
const library = JSON.parse(fs.readFileSync(path.join(site, 'capability-package-library.json'), 'utf8'));
if (!Array.isArray(library.capabilities) || library.capabilities.length !== 3) fail('Capability library must contain three public-safe demo capabilities.');
const chronicle = JSON.parse(fs.readFileSync(path.join(site, 'chronicle-compounding-entry.json'), 'utf8'));
if (!Array.isArray(chronicle.entries) || chronicle.entries.length !== 3) fail('Chronicle demo must contain three entries.');
const js = fs.readFileSync(path.join(site, 'assets/capability-compounding-v14.js'), 'utf8');
new Function(js);

console.log(`GoalOS Capability Compounding Lab gate PASS (${htmlFiles.length} HTML pages scanned, ${publicFiles.length} public files scanned)`);
