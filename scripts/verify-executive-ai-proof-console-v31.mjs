#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
const root = process.cwd();
const site = path.join(root, 'site');
const fail = msg => { console.error(msg); process.exit(1); };
const routes = [
  'executive-ai-proof-console.html',
  'proof-experience-console.html',
  'interactive-proof-console.html',
  'ai-proof-console.html',
  'guided-experience.html',
  'what-is-goalos.html',
  'console.html'
];
for (const route of routes) {
  const p = path.join(site, route);
  if (!fs.existsSync(p)) fail(`missing v31 route ${route}`);
  const html = fs.readFileSync(p, 'utf8');
  if (!html.includes('GoalOS Signoff Pro') || !html.includes('No Proof. No Trust. No Settlement.')) fail(`route ${route} missing core content`);
  if (/<form\b/i.test(html)) fail(`route ${route} includes a form`);
  if (/<input\b/i.test(html)) fail(`route ${route} includes an input`);
  if (/https?:\/\//i.test(html.replace(/https:\/\/montrealai\.github\.io\/goalos-signoff-pro\//g, ''))) fail(`route ${route} includes unexpected external URL`);
}
for (const route of [
  'assets/goalos-v31-experience.css',
  'assets/goalos-v31-experience.js',
  'executive-ai-proof-console-v31-manifest.json',
  'ai-console-demo-bundle.json',
  'public-safe-ai-console-boundary.json',
  'visitor-journey-map-v31.json',
  'website-experience-audit-v31.json',
  'goalos-public-demo-labs-v22-v31.json'
]) {
  if (!fs.existsSync(path.join(site, route))) fail(`missing v31 artifact ${route}`);
}
const boundary = JSON.parse(fs.readFileSync(path.join(site, 'public-safe-ai-console-boundary.json'), 'utf8'));
if (!boundary.publicConsole || !String(boundary.aiConsoleMode).includes('no user text input')) fail('boundary does not assert public-safe no-input console mode');
const manifest = JSON.parse(fs.readFileSync(path.join(site, 'executive-ai-proof-console-v31-manifest.json'), 'utf8'));
if (manifest.publicSafety.forms !== false || manifest.publicSafety.inputs !== false || manifest.publicSafety.wallets !== false || manifest.publicSafety.valueMoved !== 0) fail('manifest public-safety posture failed');
const index = path.join(site, 'index.html');
if (fs.existsSync(index)) {
  const html = fs.readFileSync(index, 'utf8');
  if (!html.includes('executive-ai-proof-console.html')) fail('homepage does not link the v31 guided console');
  if (html.includes('<b>12</b><span>packet files</span>')) fail('homepage still shows 12 packet files');
}
console.log('GoalOS Executive AI Proof Console & Guided Website Experience Lab v31 gate PASS.');
