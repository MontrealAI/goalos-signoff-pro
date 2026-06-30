#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
const site = path.join(process.cwd(), 'site');
const fail = msg => { console.error('GoalOS public demo route registry FAILED'); console.error('- ' + msg); process.exit(1); };
const required = [
  'action-graph-authority-lab.html',
  'human-authority-action-lab.html',
  'scoped-action-lab.html'
];
const optional = [
  'proof-gradient-lab.html','capability-compounding-lab.html','sovereign-experience-stream-lab.html','proof-settlement-lab.html','public-private-proof-boundary-lab.html','governed-decision-state-lab.html','rollback-challenge-lab.html','validator-mesh-lab.html','until-done-lab.html'
];
for (const rel of required) {
  const p = path.join(site, rel);
  if (!fs.existsSync(p)) fail(`${rel} missing`);
  const html = fs.readFileSync(p, 'utf8');
  if (/Route Not Found|not part of the receipt map/i.test(html)) fail(`${rel} degraded to fallback`);
}
for (const rel of optional) {
  const p = path.join(site, rel);
  if (fs.existsSync(p)) {
    const html = fs.readFileSync(p, 'utf8');
    if (/Route Not Found|not part of the receipt map/i.test(html)) fail(`${rel} degraded to fallback`);
  }
}
console.log(`GoalOS public demo route registry PASS (${required.length} required routes checked)`);
