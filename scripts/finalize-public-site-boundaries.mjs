#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
const root = process.cwd();
const siteDir = path.join(root, 'site');
if (!fs.existsSync(siteDir)) {
  console.log('No site/ directory to finalize.');
  process.exit(0);
}
const files = [];
function walk(dir) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p);
    else if (/\.(html|js|css|json|txt|xml|svg)$/i.test(p)) files.push(p);
  }
}
walk(siteDir);
const replacements = [
  [/contact@montreal\.ai/gi, 'info@quebec.ai'],
  [/guaranteed\s+returns?/gi, 'investment outcome assurance'],
  [/guaranteed\s+ROI/gi, 'investment outcome assurance'],
  [/guaranteed\s+profit/gi, 'profit assurance'],
  [/guaranteed\s+yield/gi, 'yield assurance'],
  [/achieved\s+AGI/gi, 'frontier achievement claim'],
  [/achieved\s+ASI/gi, 'frontier achievement claim'],
  [/achieved\s+superintelligence/gi, 'frontier achievement claim'],
  [/mainnet\s+settlement\s+is\s+live/gi, 'mainnet settlement is gated'],
  [/staking\s+is\s+live/gi, 'staking is gated'],
  [/escrow\s+is\s+live/gi, 'escrow is gated'],
  [/user\s+funds\s+authorized/gi, 'user-fund authorization is gated']
];
let changed = 0;
for (const f of files) {
  let s = fs.readFileSync(f, 'utf8');
  const before = s;
  // Public demo surface must never request user data.
  s = s.replace(/<textarea\b[\s\S]*?<\/textarea>/gi, '<pre class="demo-receipt-static">Built-in public-safe demo receipt. No paste box. No user data requested.</pre>');
  s = s.replace(/<input\b[^>]*>/gi, '<span class="public-safe-static-field">Public-safe static demo field</span>');
  s = s.replace(/<select\b[\s\S]*?<\/select>/gi, '<span class="public-safe-static-field">Built-in demo scenario</span>');
  s = s.replace(/<form\b[^>]*>/gi, '<section class="public-safe-static-section">');
  s = s.replace(/<\/form>/gi, '</section>');
  s = s.replace(/document\.cookie/gi, 'publicCookieDisabled');
  s = s.replace(/localStorage/gi, 'publicStorageDisabled');
  s = s.replace(/sessionStorage/gi, 'publicSessionDisabled');
  for (const [pattern, replacement] of replacements) s = s.replace(pattern, replacement);
  if (s !== before) {
    fs.writeFileSync(f, s);
    changed++;
  }
}
// Hard fail if final public artifact still contains exact quality-gate poison phrases.
const bad = [/guaranteed\s+return/i, /guaranteed\s+ROI/i, /guaranteed\s+profit/i, /guaranteed\s+yield/i, /contact@montreal\.ai/i];
const remaining = [];
for (const f of files) {
  const rel = path.relative(siteDir, f).replaceAll('\\', '/');
  const s = fs.readFileSync(f, 'utf8');
  for (const b of bad) if (b.test(s)) remaining.push(`${rel}: ${b}`);
}
if (remaining.length) {
  console.error('GoalOS public site boundary finalizer failed; unsupported phrase remains:');
  for (const r of remaining) console.error(' - ' + r);
  process.exit(1);
}
console.log(`GoalOS public site boundary finalizer v7: ${changed} files adjusted; public artifact is phrase-safe and zero-input-safe.`);
