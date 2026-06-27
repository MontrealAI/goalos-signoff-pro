#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const site = path.join(process.cwd(), 'site');
const required = [
  'index.html','browser-beta.html','demo-lab.html','proof-run-001.html','holy-grail.html','multi-agent-sovereign-institution.html','coordination-theatre.html','evidence-docket-demo.html','verify.html','contact.html','browser-beta-manifest.json','assets/browser-beta-v8.css','assets/browser-beta-v8.js'
];
const fail = msg => { console.error(`GoalOS Browser Beta Production gate FAILED\n- ${msg}`); process.exit(1); };
if (!fs.existsSync(site)) fail('site directory missing');
for (const f of required) if (!fs.existsSync(path.join(site, f))) fail(`missing required file: ${f}`);

const htmlFiles = fs.readdirSync(site).filter(f => f.endsWith('.html'));
const all = fs.readdirSync(site, { recursive: true }).filter(f => fs.statSync(path.join(site, f)).isFile());

const blockedGlobal = [
  /Use this page to request a private beta conversation or a 48-hour Proof Mission/i,
  /contact@montreal\.ai/i,
  /mailto:/i,
  /guaranteed return/i,
  /guaranteed ROI/i,
  /guaranteed profit/i,
  /guaranteed yield/i,
  /achieved ASI/i,
  /achieved AGI/i,
  /achieved superintelligence/i,
  /live escrow/i,
  /live staking/i,
  /Mainnet settlement is live/i,
  /connect wallet/i,
  /walletconnect/i,
  /gtag\(/i,
  /google-analytics/i,
  /analytics\.js/i,
  /localStorage/i,
  /sessionStorage/i,
  /document\.cookie/i
];
for (const rel of all) {
  const p = path.join(site, rel);
  const txt = fs.readFileSync(p, 'utf8');
  for (const re of blockedGlobal) if (re.test(txt)) fail(`${rel} contains blocked phrase/pattern: ${re}`);
}

const noInputPages = ['index.html','browser-beta.html','demo-lab.html','proof-run-001.html','holy-grail.html','multi-agent-sovereign-institution.html','coordination-theatre.html','evidence-docket-demo.html','verify.html','contact.html','request-access.html','pilot.html'];
for (const rel of noInputPages) {
  const p = path.join(site, rel);
  if (!fs.existsSync(p)) continue;
  const html = fs.readFileSync(p, 'utf8');
  for (const tag of ['form','textarea','input','select']) {
    const re = new RegExp(`<${tag}\\b`, 'i');
    if (re.test(html)) fail(`${rel} contains <${tag}>; public beta pages must be no-input`);
  }
  if (!html.includes('browser-beta-v8.css')) fail(`${rel} missing final CSS`);
}

const index = fs.readFileSync(path.join(site,'index.html'), 'utf8');
const heroIdx = index.indexOf('The Signoff');
const betaIdx = index.indexOf('Run the product in your browser');
const footerIdx = index.indexOf('<footer');
if (heroIdx < 0) fail('index.html missing final hero');
if (betaIdx < 0) fail('index.html missing browser beta module');
if (footerIdx < 0) fail('index.html missing footer');
if (!(heroIdx < betaIdx && betaIdx < footerIdx)) fail('homepage ordering broken: browser beta must appear before footer');
if (!index.includes('Open browser beta')) fail('homepage missing Open browser beta CTA');

const contact = fs.readFileSync(path.join(site,'contact.html'), 'utf8');
if (!contact.includes('No request') || !contact.includes('No email') || !contact.includes('Open browser beta')) fail('contact page must present open browser beta with no email/request gate');

const demo = fs.readFileSync(path.join(site,'demo-lab.html'), 'utf8');
if (demo.length < 6500) fail('demo-lab.html too thin; likely blank or incomplete');
if (!demo.includes('Launch proof cycle') || !demo.includes('Download demo docket')) fail('demo-lab.html missing primary demo controls');

const css = fs.readFileSync(path.join(site,'assets/browser-beta-v8.css'), 'utf8');
for (const token of ['@media(max-width:980px)','overflow-x:hidden','bbv8-hero','bbv8-lab']) if (!css.includes(token)) fail(`final CSS missing ${token}`);

console.log(`GoalOS Browser Beta Production gate PASS (${htmlFiles.length} HTML files checked, ${all.length} public files scanned)`);
