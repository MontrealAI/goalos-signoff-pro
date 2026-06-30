#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
const site = path.join(process.cwd(), 'site');
const required = [
  'rollback-challenge-lab.html',
  'challenge-window-lab.html'
];
const optionalImportant = [
  'mission-001.html','proof-gradient-lab.html','capability-compounding-lab.html','sovereign-experience-stream-lab.html','proof-settlement-lab.html','public-private-proof-boundary-lab.html','governed-decision-state-lab.html'
];
const errors = [];
for (const file of required) {
  const p = path.join(site, file);
  if (!fs.existsSync(p)) errors.push(`${file} missing`);
  else if (fs.readFileSync(p, 'utf8').includes('Route Not Found')) errors.push(`${file} is fallback route`);
}
for (const file of optionalImportant) {
  const p = path.join(site, file);
  if (fs.existsSync(p) && fs.readFileSync(p, 'utf8').includes('Route Not Found')) errors.push(`${file} exists but is fallback route`);
}
if (errors.length) { console.error('GoalOS public demo route registry FAILED'); errors.forEach(e=>console.error(' - '+e)); process.exit(1); }
console.log('GoalOS public demo route registry PASS');
