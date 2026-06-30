#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
const site = path.join(process.cwd(), 'site');
const required = ['until-done-lab.html','mission-control-lab.html','proof-debt-lab.html'];
const optional = ['mission-001.html','mission-001-replay.html','proof-gradient-lab.html','capability-compounding-lab.html','sovereign-experience-stream-lab.html','proof-settlement-lab.html','public-private-proof-boundary-lab.html','governed-decision-state-lab.html','rollback-challenge-lab.html','validator-mesh-lab.html'];
function fail(msg){ console.error('GoalOS public demo route registry FAILED'); console.error('- '+msg); process.exit(1); }
for (const rel of required) {
  const p = path.join(site, rel);
  if (!fs.existsSync(p)) fail(`${rel} missing`);
  const html = fs.readFileSync(p, 'utf8');
  if (/Route Not Found|not part of the receipt map/i.test(html)) fail(`${rel} is a route fallback`);
  if ((html.match(/data-goalos-legal-rail="v12"/g)||[]).length !== 1) fail(`${rel} must contain exactly one v12 legal rail`);
  if ((html.match(/data-goalos-footer="v12"/g)||[]).length !== 1) fail(`${rel} must contain exactly one v12 footer`);
}
for (const rel of optional) {
  const p = path.join(site, rel);
  if (!fs.existsSync(p)) continue;
  const html = fs.readFileSync(p, 'utf8');
  if (/Route Not Found|not part of the receipt map/i.test(html)) fail(`${rel} exists but is route fallback`);
}
console.log(`GoalOS public demo route registry PASS (${required.length} required routes, ${optional.filter(r=>fs.existsSync(path.join(site,r))).length} optional routes found)`);
