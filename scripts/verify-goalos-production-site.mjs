#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const ROOT = process.cwd();
const SITE = path.join(ROOT, 'site');
const required = [
  'index.html','browser-beta.html','demo-lab.html','theatre.html','proof-run-001.html','holy-grail.html','proof-gated-work-machine.html','compounding-loop.html','multi-agent-sovereign-institution.html','coordination-theatre.html','proof-governed-swarm.html','agent-constellation-lab.html','coordination-benchmark.html','evidence-docket-demo.html','verify.html','start.html','proof-mission.html','examples.html','deliverables.html','how-it-works.html','pricing.html','faq.html','contact.html','request-access.html','pilot.html','privacy.html','terms.html','no-user-data.html','agialpha.html','agialpha-token-boundary.html','production-manifest.json','browser-beta-demo-bundle.json'
];
const errors = [];
function fail(msg){ errors.push(msg); }
function walk(dir){ return fs.readdirSync(dir,{withFileTypes:true}).flatMap(d=>{ const p=path.join(dir,d.name); return d.isDirectory()?walk(p):[p]; }); }
if (!fs.existsSync(SITE)) fail('site directory does not exist. Run node scripts/build-goalos-production-site.mjs first.');
for (const rel of required) if (!fs.existsSync(path.join(SITE, rel))) fail(`missing required file: ${rel}`);
const files = fs.existsSync(SITE) ? walk(SITE) : [];
const htmlFiles = files.filter(f => f.endsWith('.html'));
if (htmlFiles.length < 40) fail(`too few HTML pages generated: ${htmlFiles.length}`);
const bannedFragments = [
  '<form', '<input', '<textarea', '<select', 'mailto:', 'contact@montreal.ai',
  'Use this page to request a private beta conversation', 'request a private beta conversation',
  'guaranteed return', 'guaranteed profit', 'guaranteed yield', 'guaranteed ROI', 'risk-free',
  'achieved AGI', 'achieved ASI', 'achieved superintelligence', 'connect wallet', 'walletconnect',
  'gtag(', 'google-analytics', 'analytics.js', 'plausible.io', 'document.cookie', 'localStorage', 'sessionStorage',
  'live escrow', 'staking is live', 'mainnet settlement is live'
];
const hrefRe = /href=["']([^"']+)["']/gi;
for (const file of htmlFiles) {
  const rel = path.relative(SITE, file).replaceAll(path.sep, '/');
  const html = fs.readFileSync(file, 'utf8');
  const lower = html.toLowerCase();
  if (html.length < 3200 && !['404.html'].includes(rel)) fail(`${rel} is too thin (${html.length} bytes)`);
  for (const frag of bannedFragments) if (lower.includes(frag.toLowerCase())) fail(`${rel} contains banned public artifact fragment: ${frag}`);
  const railCount = (html.match(/data-goalos-legal-rail/g) || []).length;
  if (railCount !== 1) fail(`${rel} must contain exactly one legal rail; found ${railCount}`);
  if (!html.includes('No forms · no uploads · no cookies · no analytics · no wallets · no payments · no personal or confidential data.')) fail(`${rel} missing canonical public site rule`);
  if (!html.includes('<main>') || !html.includes('</main>')) fail(`${rel} missing main landmark`);
  if (!html.includes('<footer class="footer">')) fail(`${rel} missing canonical footer`);
  if (html.indexOf('<footer class="footer">') < html.indexOf('<main>')) fail(`${rel} footer appears before main content`);
  let m;
  while ((m = hrefRe.exec(html))) {
    const href = m[1];
    if (href.includes('%20') || href.includes(' ') || href.includes('&body=') || href.includes('?subject=') || href.includes('"')) fail(`${rel} has unsafe or malformed href: ${href}`);
    if (href.startsWith('#') || href.startsWith('http')) continue;
    const clean = href.split('#')[0].split('?')[0];
    if (clean.endsWith('.html') && !fs.existsSync(path.join(SITE, clean))) fail(`${rel} links to missing page: ${clean}`);
  }
}
const index = fs.existsSync(path.join(SITE,'index.html')) ? fs.readFileSync(path.join(SITE,'index.html'),'utf8') : '';
if (!index.includes('Run GoalOS now. No request. No email.')) fail('homepage missing open browser beta message');
if (index.includes('MULTI-AGENT COORDINATION') && index.indexOf('MULTI-AGENT COORDINATION') > index.indexOf('<footer')) fail('homepage contains legacy unstyled multi-agent block after footer');
if (!index.includes('Open browser beta')) fail('homepage missing Open browser beta CTA');
const beta = fs.existsSync(path.join(SITE,'browser-beta.html')) ? fs.readFileSync(path.join(SITE,'browser-beta.html'),'utf8') : '';
if (!beta.includes('Open browser beta.') || !beta.includes('No request. No email.')) fail('browser beta page missing open/no-email posture');
const cssPath = path.join(SITE, 'assets', 'goalos-production-v10.css');
const jsPath = path.join(SITE, 'assets', 'goalos-production-v10.js');
if (!fs.existsSync(cssPath)) fail('missing v10 CSS');
if (!fs.existsSync(jsPath)) fail('missing v10 JS');
if (fs.existsSync(cssPath)) {
  const css = fs.readFileSync(cssPath, 'utf8');
  if (/\.site-rule\s*\{[^}]*position\s*:\s*(fixed|sticky)/i.test(css)) fail('legal rail must not be fixed or sticky');
  if (!css.includes('overflow-x:hidden')) fail('CSS should prevent horizontal overflow');
  if (!css.includes('@media')) fail('CSS missing responsive media queries');
}
if (fs.existsSync(jsPath)) {
  try { execFileSync(process.execPath, ['--check', jsPath], { stdio:'pipe' }); } catch (e) { fail(`JavaScript syntax check failed: ${String(e.stderr || e.message).slice(0, 400)}`); }
}
const publicFiles = files.filter(f => !f.includes(`${path.sep}.git${path.sep}`));
for (const f of publicFiles) {
  const rel = path.relative(SITE,f).replaceAll(path.sep,'/');
  if (/\.(env|pem|key)$/i.test(rel)) fail(`forbidden public file: ${rel}`);
  if (rel.includes('node_modules/') || rel.includes('.next/') || rel.includes('.git/')) fail(`forbidden public artifact path: ${rel}`);
  if (/\.(html|js|json|txt|xml|css)$/i.test(rel)) {
    const txt = fs.readFileSync(f,'utf8');
    if (/sk_live_[A-Za-z0-9]+|ghp_[A-Za-z0-9]{20,}|xox[baprs]-[A-Za-z0-9-]{20,}|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----/.test(txt)) fail(`${rel} contains secret-like value`);
  }
}
if (errors.length) {
  console.error('GoalOS production site gate FAILED');
  for (const e of errors.slice(0, 80)) console.error(`- ${e}`);
  if (errors.length > 80) console.error(`... ${errors.length - 80} more errors`);
  process.exit(1);
}
console.log(`GoalOS production site gate PASS (${htmlFiles.length} HTML pages, ${files.length} public files scanned)`);
