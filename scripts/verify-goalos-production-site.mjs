#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const SITE = path.join(ROOT, 'site');
const required = [
  'index.html','browser-beta.html','demo-lab.html','proof-gated-coordination.html','coordination-law.html','coordination-stack.html','coordination-lab.html','proof-selection-theatre.html','agent-constellation-lab.html','coordination-theatre.html','proof-governed-swarm.html','coordination-benchmark.html','evidence-docket-demo.html','verify.html','proof-run-001.html','holy-grail.html','multi-agent-sovereign-institution.html','no-user-data.html','agialpha-token-boundary.html','production-manifest.json','proof-gated-coordination-demo-bundle.json','assets/goalos-production-v11.css','assets/goalos-production-v11.js'
];
const fail = msg => { console.error(`GoalOS production site gate FAILED\n- ${msg}`); process.exit(1); };
if (!fs.existsSync(SITE)) fail('site/ directory does not exist. Run node scripts/build-goalos-production-site.mjs first.');
for (const rel of required) if (!fs.existsSync(path.join(SITE, rel))) fail(`missing required file: ${rel}`);
const htmlFiles = fs.readdirSync(SITE, { recursive: true }).filter(f => f.endsWith('.html')).sort();
if (htmlFiles.length < 50) fail(`expected at least 50 HTML pages, found ${htmlFiles.length}`);
const publicFiles = fs.readdirSync(SITE, { recursive: true }).filter(f => fs.statSync(path.join(SITE, f)).isFile()).sort();
const allText = publicFiles.map(f => `\n--- ${f} ---\n` + fs.readFileSync(path.join(SITE, f), 'utf8')).join('\n');
const blockedPatterns = [
  [/<form\b/i, 'form tag'], [/<input\b/i, 'input tag'], [/<textarea\b/i, 'textarea tag'], [/<select\b/i, 'select tag'],
  [/mailto:/i, 'email-gated mailto link'], [/contact@montreal\.ai/i, 'contact@montreal.ai'], [/document\.cookie|localStorage|sessionStorage/i, 'browser storage/cookie API'],
  [/connect wallet|walletconnect|window\.ethereum/i, 'wallet connection language/API'], [/google-analytics|gtag\(|googletagmanager|plausible\.io|mixpanel|segment\.com/i, 'analytics/tracking marker'],
  [/guaranteed\s+(return|profit|yield|roi)/i, 'guaranteed economic-result phrase'], [/live\s+(escrow|staking|mainnet settlement)/i, 'unsupported live chain/funds claim'],
  [/achieved\s+(agi|asi|superintelligence)/i, 'unsupported achieved AGI/ASI claim']
];
for (const [re, name] of blockedPatterns) if (re.test(allText)) fail(`blocked marker found: ${name}`);
for (const rel of htmlFiles) {
  const html = fs.readFileSync(path.join(SITE, rel), 'utf8');
  const rails = (html.match(/data-goalos-legal-rail=/g) || []).length;
  if (rails !== 1) fail(`${rel} has ${rails} legal rails; expected exactly 1`);
  if ((html.match(/<footer\b/g) || []).length !== 1) fail(`${rel} does not have exactly one footer`);
  if (html.length < 4000 && !['404.html'].includes(rel)) fail(`${rel} is too thin (${html.length} bytes)`);
  if (!html.includes('No forms · no uploads · no cookies')) fail(`${rel} missing public-site rule text`);
}
const index = fs.readFileSync(path.join(SITE, 'index.html'), 'utf8');
const footerAt = index.indexOf('<footer');
const betaAt = index.indexOf('Open browser beta · available to everyone');
const coordAt = index.indexOf('Watch the swarm become an institution');
if (betaAt < 0 || betaAt > footerAt) fail('homepage browser beta module is missing or appears after footer');
if (coordAt < 0 || coordAt > footerAt) fail('homepage coordination module is missing or appears after footer');
if (index.includes('Use this page to request a private beta conversation')) fail('legacy email-gated beta language remains on homepage');
const coord = fs.readFileSync(path.join(SITE, 'proof-gated-coordination.html'), 'utf8');
for (const phrase of ['missing control architecture','Proof-gated coordination','Maximum coordination is not maximum autonomy','Watch the swarm become an institution']) {
  if (!coord.includes(phrase)) fail(`proof-gated-coordination.html missing phrase: ${phrase}`);
}
const beta = fs.readFileSync(path.join(SITE, 'browser-beta.html'), 'utf8');
for (const phrase of ['No request. No email.','Launch proof cycle','Download demo docket']) if (!beta.includes(phrase)) fail(`browser-beta.html missing phrase: ${phrase}`);
const js = fs.readFileSync(path.join(SITE, 'assets/goalos-production-v11.js'), 'utf8');
try { new Function(js); } catch (err) { fail(`browser JS syntax error: ${err.message}`); }
const manifest = JSON.parse(fs.readFileSync(path.join(SITE, 'production-manifest.json'), 'utf8'));
if (!manifest.siteHash || !manifest.pageCount) fail('production-manifest.json missing siteHash/pageCount');
const bundle = JSON.parse(fs.readFileSync(path.join(SITE, 'proof-gated-coordination-demo-bundle.json'), 'utf8'));
if (bundle.dataCaptured !== 'none' || bundle.valueMoved !== 0 || bundle.walletRequired !== false) fail('coordination demo bundle violates public posture');
console.log(`GoalOS production site gate PASS (${htmlFiles.length} HTML pages, ${publicFiles.length} public files scanned)`);
