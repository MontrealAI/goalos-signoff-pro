#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
const site = path.join(process.cwd(), 'site');
const required = [
  'mission-001.html',
  'proof-gradient-lab.html',
  'capability-compounding-lab.html',
  'sovereign-experience-stream-lab.html'
];
const errors=[];
for (const file of required) {
  const full=path.join(site,file);
  if (!fs.existsSync(full)) errors.push(`${file} is missing`);
  else {
    const html=fs.readFileSync(full,'utf8');
    if (/Route Not Found|This corridor is not part of the receipt map/i.test(html)) errors.push(`${file} contains fallback route-not-found content`);
  }
}
if (errors.length) { console.error('GoalOS public demo route registry FAILED'); errors.forEach(e=>console.error(`- ${e}`)); process.exit(1); }
console.log('GoalOS public demo route registry PASS');
