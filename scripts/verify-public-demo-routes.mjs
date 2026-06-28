#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
const root = process.cwd();
const site = path.join(root, 'site');
const fail = msg => { console.error('GoalOS public demo route registry FAILED'); console.error('- '+msg); process.exit(1); };
const routes = [
  ['mission-001.html','Mission 001'],
  ['proof-gradient-lab.html','Selection Gate'],
  ['capability-compounding-lab.html','Compounding'],
  ['sovereign-experience-stream-lab.html','Sovereign experience'],
  ['sovereign-experience-lab.html','Sovereign experience'],
  ['evidence-docket-demo.html','Evidence']
];
for (const [rel,label] of routes) {
  const p = path.join(site, rel);
  if (!fs.existsSync(p)) fail(`${rel} is missing`);
  const html = fs.readFileSync(p, 'utf8');
  if (html.includes('Route Not Found') || html.includes('not part of the receipt map')) fail(`${rel} resolves to fallback 404`);
  if (!html.toLowerCase().includes(label.toLowerCase().split(' ')[0])) fail(`${rel} appears to miss route content for ${label}`);
  if ((html.match(/data-goalos-legal-rail="v12"/g)||[]).length !== 1) fail(`${rel} must contain exactly one v12 legal rail`);
  if ((html.match(/<footer\b/gi)||[]).length !== 1) fail(`${rel} must contain exactly one footer`);
}
console.log('GoalOS public demo route registry PASS');
