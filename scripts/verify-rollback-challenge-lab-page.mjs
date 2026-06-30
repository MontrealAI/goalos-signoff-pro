#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const site = path.join(process.cwd(), 'site');
const requiredHtml = ['rollback-challenge-lab.html', 'challenge-window-lab.html'];
const requiredArtifacts = [
  'rollback-challenge-demo-bundle.json',
  'challenge-window-record.json',
  'rollback-receipt-demo.json',
  'canary-monitor-report.json',
  'release-readiness-certificate.json',
  'failure-memory-entry.json',
  'rollback-challenge-manifest.json'
];
const errors = [];
function count(s, needle){ return (s.match(new RegExp(needle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length; }
function assert(cond, msg){ if(!cond) errors.push(msg); }
for (const file of requiredHtml) {
  const p = path.join(site, file);
  assert(fs.existsSync(p), `${file} missing`);
  if (!fs.existsSync(p)) continue;
  const html = fs.readFileSync(p, 'utf8');
  assert(!html.includes('Route Not Found'), `${file} contains fallback route`);
  assert(html.includes('Rollback & Challenge Window Lab') || html.includes('rollback before release'), `${file} missing page identity`);
  assert(html.includes('Run challenge window'), `${file} missing primary action`);
  assert(html.includes('Challenge') && html.includes('Rollback') && html.includes('Canary') && html.includes('Release'), `${file} missing control stages`);
  assert(count(html, 'data-goalos-legal-rail="v12"') === 1, `${file} must contain exactly one v12 legal rail`);
  assert(count(html, 'data-goalos-footer="v12"') === 1, `${file} must contain exactly one v12 footer`);
  assert(!/<form\b/i.test(html), `${file} contains a form`);
  assert(!/<input\b/i.test(html), `${file} contains an input`);
  assert(!/<textarea\b/i.test(html), `${file} contains a textarea`);
  assert(!/<select\b/i.test(html), `${file} contains a select`);
  assert(!/mailto:/i.test(html), `${file} contains an email gate`);
  assert(!/contact@montreal\.ai/i.test(html), `${file} contains forbidden email`);
  assert(!/connect wallet|walletconnect|window\.ethereum/i.test(html), `${file} contains wallet path`);
  assert(!/document\.cookie|localStorage|sessionStorage/i.test(html), `${file} contains browser storage/cookie path`);
  assert(!/google-analytics|gtag\(|plausible|segment\.com|mixpanel/i.test(html), `${file} contains analytics marker`);
  assert(!/guaranteed return|guaranteed profit|guaranteed yield|achieved asi|achieved agi|live settlement|staking activation|production certification/i.test(html), `${file} contains unsupported claim phrase`);
}
for (const file of requiredArtifacts) {
  const p = path.join(site, file);
  assert(fs.existsSync(p), `${file} missing`);
  if (fs.existsSync(p)) {
    const data = JSON.parse(fs.readFileSync(p, 'utf8'));
    assert(JSON.stringify(data).length > 120, `${file} too small`);
  }
}
const bundlePath = path.join(site, 'rollback-challenge-demo-bundle.json');
if (fs.existsSync(bundlePath)) {
  const b = JSON.parse(fs.readFileSync(bundlePath, 'utf8'));
  assert(Array.isArray(b.candidates) && b.candidates.length === 4, 'bundle must contain four candidates');
  assert(b.candidates.some(c => c.outcome === 'release_ready'), 'bundle must include a release-ready synthetic candidate');
  assert(b.candidates.some(c => c.outcome === 'rolled_back'), 'bundle must include a rolled-back synthetic candidate');
  assert(b.rollbackReceipt?.valueMoved === 0, 'rollback receipt must show no value moved');
}
if (errors.length) {
  console.error('GoalOS Rollback & Challenge Window Lab gate FAILED');
  for (const e of errors) console.error(' - ' + e);
  process.exit(1);
}
console.log('GoalOS Rollback & Challenge Window Lab v19 gate PASS');
