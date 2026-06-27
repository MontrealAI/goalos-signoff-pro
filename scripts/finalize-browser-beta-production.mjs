#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const site = path.join(process.cwd(), 'site');
if (!fs.existsSync(site)) throw new Error('site directory not found. Run page generators first.');

const htmlFiles = fs.readdirSync(site).filter(f => f.endsWith('.html'));
const replacements = [
  [/Use this page to request a private beta conversation or a 48-hour Proof Mission\.?/gi, 'Open the browser beta directly. No request, no email, no upload.'],
  [/Private beta conversation/gi, 'Browser beta session'],
  [/Request a private beta conversation/gi, 'Open the browser beta'],
  [/Request private beta/gi, 'Open browser beta'],
  [/Request pilot access/gi, 'Open browser beta'],
  [/Request access/gi, 'Open browser beta'],
  [/Private beta/gi, 'Browser beta'],
  [/mailto:[^"'\s<>]+/gi, 'browser-beta.html'],
  [/contact@montreal\.ai/gi, 'info@quebec.ai'],
  [/guaranteed returns?/gi, 'economic outcome claim'],
  [/guaranteed ROI/gi, 'economic outcome claim'],
  [/guaranteed profits?/gi, 'economic outcome claim'],
  [/guaranteed yield/gi, 'economic outcome claim']
];

function stripInteractive(html) {
  return html
    .replace(/<form\b[^>]*>/gi, '<div class="bbv8-formless-block">')
    .replace(/<\/form>/gi, '</div>')
    .replace(/<textarea\b[\s\S]*?<\/textarea>/gi, '<div class="bbv8-static-demo-box">Built-in demo receipt. No text entry required.</div>')
    .replace(/<input\b[^>]*>/gi, '<span class="bbv8-static-demo-chip">No input required</span>')
    .replace(/<select\b[\s\S]*?<\/select>/gi, '<span class="bbv8-static-demo-chip">Built-in demo scenario</span>');
}

function ensureAssets(html) {
  if (!html.includes('assets/browser-beta-v8.css')) html = html.replace(/<\/head>/i, '<link rel="stylesheet" href="assets/browser-beta-v8.css"></head>');
  if (!html.includes('assets/browser-beta-v8.js')) html = html.replace(/<\/body>/i, '<script src="assets/browser-beta-v8.js"></script></body>');
  return html;
}

for (const file of htmlFiles) {
  const p = path.join(site, file);
  let html = fs.readFileSync(p, 'utf8');
  for (const [re, val] of replacements) html = html.replace(re, val);
  html = stripInteractive(html);
  html = ensureAssets(html);
  // Make legacy sticky legal rails non-overlapping without deleting the legal posture.
  html = html.replace(/class="([^"]*(?:public-site-rule|legal-rail|zero-data-rail|boundary-rail|agialpha-boundary|bottom-rail)[^"]*)"/gi, (m, cls) => `class="${cls} bbv8-boundary"`);
  fs.writeFileSync(p, html);
}

// If older generators created footer-before-demo glitches, the new index/contact/browser-beta pages from build-browser-beta-experience are authoritative.
// This file intentionally does not overwrite those pages; it only hardens all generated output after every generator has run.
console.log(`GoalOS browser beta production finalizer hardened ${htmlFiles.length} HTML files.`);
