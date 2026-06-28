import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const ROOT = process.cwd();
const SITE = path.join(ROOT, 'site');
const BASE = '/goalos-signoff-pro/';
const EMAIL = 'info@quebec.ai';

if (!fs.existsSync(SITE)) {
  console.error('site/ does not exist. Build the public site before running finalize-public-site-boundaries.mjs');
  process.exit(1);
}

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

function rel(file) {
  return path.relative(SITE, file).replaceAll('\\', '/');
}

function safeReplace(text) {
  return text
    .replace(/contact@montreal\.ai/gi, EMAIL)
    .replace(/Use this page to request a private beta conversation or a 48-hour Proof Mission\.?/gi, 'Open the browser beta directly. No request, no email, no upload, no wallet.')
    .replace(/request a private beta conversation/gi, 'open the browser beta')
    .replace(/private beta conversation/gi, 'browser beta')
    .replace(/Request pilot access/gi, 'Open browser beta')
    .replace(/Request access/gi, 'Open browser beta')
    .replace(/Email only a non-sensitive business summary to the GoalOS team and the decision it should support\.?/gi, 'Run the browser beta locally. No message, account, upload, wallet, or personal data is required.')
    .replace(/Email a non-sensitive business summary/gi, 'Run the browser beta locally')
    .replace(/mail to the GoalOS team/gi, 'browser-local demo')
    .replace(/guaranteed\s+returns?/gi, 'investment-performance promise')
    .replace(/guaranteed\s+ROI/gi, 'ROI promise')
    .replace(/guaranteed\s+profits?/gi, 'profit promise')
    .replace(/guaranteed\s+yield/gi, 'yield promise')
    .replace(/expectation\s+of\s+profit\s+from\s+others/gi, 'investment-performance expectation')
    .replace(/token sale is live/gi, 'token sale is not offered here')
    .replace(/securities offering is live/gi, 'securities offering is not made here')
    .replace(/production escrow is live/gi, 'production escrow is not part of this public browser demo')
    .replace(/mainnet settlement is live/gi, 'mainnet settlement is not part of this public browser demo')
    .replace(/AGIALPHA staking is live/gi, 'AGIALPHA staking is not part of this public browser demo')
    .replace(/Upload or describe/gi, 'Review a public-safe demo of')
    .replace(/Upload your/gi, 'Do not upload')
    .replace(/Attach evidence/gi, 'Inspect demo evidence')
    .replace(/Send the work/gi, 'Use the browser-local demo')
    .replace(/Send confidential files/gi, 'Do not send confidential files')
    .replace(/send personal data/gi, 'do not send personal data');
}

function stripInteractiveControls(html) {
  return html
    .replace(/<form\b[\s\S]*?>/gi, '<div class="static-request-panel" data-converted-form="true">')
    .replace(/<\/form>/gi, '</div>')
    .replace(/<textarea\b[\s\S]*?<\/textarea>/gi, '<pre class="static-demo-receipt" aria-label="Built-in demo receipt">Built-in demo receipt. No input required.</pre>')
    .replace(/<input\b[^>]*>/gi, '<span class="static-control-note">No input required</span>')
    .replace(/<select\b[\s\S]*?<\/select>/gi, '<span class="static-control-note">Browser-local scenario is preloaded</span>');
}

function legalRail() {
  return `<aside class="legal-rail" aria-label="Public site rule"><b>Public site rule</b><span>No forms · no uploads · no cookies · no analytics · no wallets · no payments · no personal or confidential data.</span><a href="${BASE}no-user-data.html">Read the rule</a></aside>`;
}

function legalLinksBlock() {
  return `<nav class="legal-footer-links" aria-label="Public site legal links"><a href="${BASE}no-user-data.html">No User Data</a><a href="${BASE}privacy.html">Privacy</a><a href="${BASE}terms.html">Terms</a><a href="${BASE}agialpha-token-boundary.html">$AGIALPHA Boundary</a></nav>`;
}

function ensureHeadCss(html) {
  const links = [
    `<link rel="stylesheet" href="${BASE}assets/legal-zero-data.css">`,
    `<link rel="stylesheet" href="${BASE}assets/legal-rail-final.css">`
  ];
  for (const link of links) {
    if (!html.includes(link)) {
      html = /<\/head>/i.test(html) ? html.replace(/<\/head>/i, `${link}</head>`) : `${link}${html}`;
    }
  }
  return html;
}

function finalizeHtml(html) {
  html = safeReplace(html);
  html = stripInteractiveControls(html);
  html = html.replace(/<aside\b[^>]*class=["'][^"']*legal-rail[^"']*["'][\s\S]*?<\/aside>/gi, '');
  html = ensureHeadCss(html);
  if (!html.includes('legal-footer-links')) {
    html = /<\/footer>/i.test(html) ? html.replace(/<\/footer>/i, `${legalLinksBlock()}</footer>`) : html;
  }
  if (/<\/body>/i.test(html)) html = html.replace(/<\/body>/i, `${legalRail()}</body>`);
  else html = `${html}${legalRail()}`;
  return html;
}


function fallbackLegalPage(title, eyebrow, body, bullets = []) {
  const cards = bullets.map((b, i) => `<article class="legal-card"><b>${String(i+1).padStart(2,'0')}</b><h3>${b[0]}</h3><p>${b[1]}</p></article>`).join('');
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${title} · GoalOS Signoff Pro</title><link rel="stylesheet" href="${BASE}assets/legal-rail-final.css"></head><body class="legal-page"><main class="legal-shell"><p class="eyebrow">${eyebrow}</p><h1>${title}</h1><p class="lead">${body}</p><section class="legal-grid">${cards}</section><p class="legal-note">The public website is an information and browser-local demonstration surface. It does not provide accounts, file intake, payments, wallets, analytics, tracking, or data-submission features. The browser beta uses preloaded synthetic examples so visitors can inspect a proof mission, Evidence Docket, review state, and receipt without providing material. This design keeps the public site useful while preserving privacy by non-collection.</p><p class="legal-note">Operationally, the rule is simple: use the website to learn, inspect, and run public-safe local demonstrations. Do not provide personal information, confidential business records, credentials, private keys, payment details, regulated data, customer material, health records, government identifiers, or third-party data. The public website is not a hosted workspace and is not an intake system.</p><p class="legal-note">The public browser experience is intentionally claim-bounded. It demonstrates proof-to-acceptance architecture, evidence mapping, human authority, receipt replay, and public-safe artifact bundles. It does not move funds, execute settlement, open escrow, use wallet features, submit transactions, create accounts, or make tokens available.</p><p><a class="legal-cta" href="${BASE}browser-beta.html">Open the browser beta</a></p></main></body></html>`;
}

function ensureFallbackLegalPages() {
  const common = [
    ['No forms', 'The public site does not expose form submission or account intake.'],
    ['No uploads', 'The browser demo uses built-in public-safe sample artifacts only.'],
    ['No tracking', 'No analytics, cookies, tracking pixels, wallet features, or payments are used.'],
    ['No confidential material', 'Visitors should not provide personal, confidential, regulated, credential, or customer material.']
  ];
  const pages = {
    'no-user-data.html': fallbackLegalPage('No User Data', 'ZERO-DATA PUBLIC SITE RULE', 'GoalOS Signoff Pro is designed as a public information and browser-local demonstration surface that does not request, collect, store, process, or transmit visitor-provided data.', common),
    'privacy.html': fallbackLegalPage('Privacy', 'PRIVACY BY NON-COLLECTION', 'The privacy posture is simple: the public website avoids user-data collection by design and keeps the browser beta local to the visitor device.', common),
    'terms.html': fallbackLegalPage('Terms', 'PUBLIC DEMONSTRATION TERMS', 'The public website presents browser-local demonstrations, documentation, and sample proof artifacts. It is not a hosted workspace, payment service, wallet, settlement service, or advisory service.', common),
    'legal.html': fallbackLegalPage('Legal Boundary', 'CLAIM-BOUND PUBLIC SITE', 'GoalOS Signoff Pro presents architecture, demonstrations, and public-safe sample artifacts while preserving proof, review, and deployment boundaries.', common),
    'data-policy.html': fallbackLegalPage('Data Policy', 'DATA MINIMIZATION BY DESIGN', 'The public website uses built-in sample artifacts only. No public page needs visitor files, accounts, credentials, private keys, personal records, or confidential documents.', common),
    'acceptable-use.html': fallbackLegalPage('Acceptable Use', 'SAFE PUBLIC DEMO USE', 'Use the public site to inspect demonstrations, read documentation, and download synthetic sample artifacts. Do not provide sensitive material or attempt to connect external systems.', common),
    'investment-boundary.html': fallbackLegalPage('Investment Boundary', 'NO INVESTMENT OFFER', 'GoalOS Signoff Pro does not sell, issue, broker, custody, distribute, redeem, stake, or make tokens available through the public website.', common),
    'cookie-policy.html': fallbackLegalPage('Cookie Policy', 'NO COOKIES', 'The public website does not need cookies for its browser-local demonstrations and does not install analytics or tracking cookies.', common),
    'subprocessors.html': fallbackLegalPage('Subprocessors', 'NO PUBLIC SITE PROCESSORS', 'The public website does not route visitor-provided data to subprocessors because the public demo does not ask visitors to provide data.', common),
    'security-boundary.html': fallbackLegalPage('Security Boundary', 'PUBLIC-SAFE DEMONSTRATION SURFACE', 'The public site avoids credential collection, wallet features, file intake, and hosted data workflows. Demonstration artifacts are synthetic and public-safe.', common)
  };
  for (const [name, html] of Object.entries(pages)) {
    const p = path.join(SITE, name);
    if (!fs.existsSync(p) || fs.readFileSync(p, 'utf8').length < 1500) fs.writeFileSync(p, html, 'utf8');
  }
  const manifest = path.join(SITE, 'legal-zero-data-manifest.json');
  if (!fs.existsSync(manifest)) {
    fs.writeFileSync(manifest, JSON.stringify({version:'8.1.1-universal-legal-rail', posture:'zero-user-data public browser demo', contactEmail:EMAIL, noForms:true, noUploads:true, noCookies:true, noAnalytics:true, noWallets:true, noPayments:true, generatedAt:new Date().toISOString()}, null, 2), 'utf8');
  }
}

fs.mkdirSync(path.join(SITE, 'assets'), { recursive: true });

const railCss = `
.static-request-panel{display:block}.static-control-note{display:inline-flex;align-items:center;border:1px solid rgba(108,247,220,.28);border-radius:999px;padding:.55rem .8rem;color:#dcfff8;background:rgba(108,247,220,.08);font-weight:800}.static-demo-receipt{white-space:pre-wrap;border:1px solid rgba(108,247,220,.22);border-radius:18px;padding:1rem;background:rgba(0,0,0,.28);color:#d9fff8}.legal-footer-links{display:flex;gap:1rem;align-items:center;justify-content:center;flex-wrap:wrap;margin-top:1rem}.legal-footer-links a{color:#89ffe8;text-decoration:none;font-weight:850}.legal-rail{position:fixed;left:50%;bottom:22px;transform:translateX(-50%);z-index:9999;display:flex;gap:12px;align-items:center;justify-content:center;max-width:min(980px,calc(100vw - 28px));padding:10px 14px;border:1px solid rgba(108,247,220,.28);border-radius:999px;background:rgba(1,7,10,.86);backdrop-filter:blur(18px);box-shadow:0 20px 90px rgba(0,0,0,.42),0 0 40px rgba(108,247,220,.10);font-family:Inter,ui-sans-serif,system-ui,-apple-system,Segoe UI,Arial,sans-serif}.legal-rail b{color:#fff59e;white-space:nowrap;font-weight:950}.legal-rail span{color:#dff8f5;font-size:.82rem;line-height:1.25}.legal-rail a{white-space:nowrap;text-decoration:none;border-radius:999px;padding:8px 12px;color:#001311;background:linear-gradient(135deg,#f9ff9e,#67f7e5);font-weight:950}@media(max-width:780px){.legal-rail{position:static;transform:none;margin:20px auto;border-radius:22px;max-width:calc(100vw - 28px);flex-wrap:wrap}.legal-rail span{font-size:.78rem;text-align:center}}.legal-page{min-height:100vh;background:radial-gradient(circle at 70% 20%,rgba(64,245,223,.16),transparent 34%),#03090d;color:#f7f2e8;font-family:Inter,ui-sans-serif,system-ui,-apple-system,Segoe UI,Arial,sans-serif}.legal-shell{max-width:1100px;margin:0 auto;padding:110px 24px 140px}.legal-shell h1{font-size:clamp(3rem,8vw,7rem);line-height:.9;margin:.15em 0}.eyebrow{letter-spacing:.32em;color:#73ffe6;font-weight:950}.lead{font-size:clamp(1.1rem,2vw,1.5rem);max-width:760px;color:#d9eee9}.legal-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px;margin:42px 0}.legal-card{border:1px solid rgba(108,247,220,.22);border-radius:24px;background:rgba(255,255,255,.055);padding:22px}.legal-card b{color:#fff59e}.legal-card h3{margin:.5rem 0;color:#fff}.legal-card p,.legal-note{color:#cfe5e1;line-height:1.7}.legal-cta{display:inline-flex;margin-top:12px;border-radius:999px;padding:14px 20px;background:linear-gradient(135deg,#f9ff9e,#67f7e5);color:#001311;text-decoration:none;font-weight:950}@media(max-width:780px){.legal-grid{grid-template-columns:1fr}}body{padding-bottom:72px}@media(max-width:780px){body{padding-bottom:0}}
`;
fs.writeFileSync(path.join(SITE, 'assets/legal-rail-final.css'), railCss.trim() + '\n', 'utf8');

ensureFallbackLegalPages();
const files = walk(SITE);
let htmlCount = 0;
let touchedHtml = 0;
for (const file of files) {
  const r = rel(file);
  if (/\.(html|json|js|css|txt|svg|xml)$/i.test(r)) {
    let text = fs.readFileSync(file, 'utf8');
    const next = safeReplace(text);
    if (next !== text) fs.writeFileSync(file, next, 'utf8');
  }
}
for (const file of walk(SITE).filter(f => f.endsWith('.html'))) {
  htmlCount += 1;
  const before = fs.readFileSync(file, 'utf8');
  const after = finalizeHtml(before);
  if (after !== before) touchedHtml += 1;
  fs.writeFileSync(file, after, 'utf8');
}

const allFiles = walk(SITE).filter(f => fs.statSync(f).isFile());
const manifest = {
  version: '8.1.0-legal-rail-all-pages-final',
  generatedAt: new Date().toISOString(),
  publicSite: 'https://montrealai.github.io/goalos-signoff-pro/',
  contactEmail: EMAIL,
  posture: 'public-browser-beta-zero-user-data-by-design',
  htmlPagesFinalized: htmlCount,
  htmlPagesTouched: touchedHtml,
  railRequiredOnEveryHtmlPage: true,
  rules: [
    'no forms', 'no inputs', 'no textareas', 'no uploads', 'no wallets', 'no cookies', 'no analytics', 'no payments', 'no personal or confidential data'
  ],
  sha256: Object.fromEntries(allFiles.map(f => [rel(f), crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex')]))
};
fs.writeFileSync(path.join(SITE, 'public-boundary-finalization-manifest.json'), JSON.stringify(manifest, null, 2), 'utf8');
console.log(`GoalOS public boundary finalizer complete: legal rail on ${htmlCount}/${htmlCount} HTML pages`);
