#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const site = path.join(root, 'site');
const fail = (m) => { console.error(`GoalOS public demo route registry FAILED\n- ${m}`); process.exit(1); };
const candidates = [
  ['mission-001.html', 'config/mission-001-benchmark.json'],
  ['proof-gradient-lab.html', 'config/proof-gradient-lab.json'],
  ['capability-compounding-lab.html', 'config/capability-compounding-lab.json'],
  ['sovereign-experience-stream-lab.html', 'config/sovereign-experience-stream-lab.json'],
  ['sovereign-experience-lab.html', 'config/sovereign-experience-stream-lab.json'],
  ['proof-settlement-lab.html', 'config/proof-settlement-lab.json'],
  ['settlement-control-lab.html', 'config/proof-settlement-lab.json'],
  ['public-private-proof-boundary-lab.html', 'config/public-private-proof-boundary-lab.json'],
  ['proof-boundary-lab.html', 'config/public-private-proof-boundary-lab.json']
];
const required = candidates.filter(([, cfg]) => fs.existsSync(path.join(root, cfg)));
for (const [route] of required) {
  const file = path.join(site, route);
  if (!fs.existsSync(file)) fail(`${route} is missing`);
  const html = fs.readFileSync(file, 'utf8');
  if (/Route Not Found/i.test(html)) fail(`${route} contains Route Not Found fallback`);
  const rails = (html.match(/data-goalos-legal-rail="v12"/g) || []).length;
  if (rails !== 1) fail(`${route} must contain exactly one v12 legal rail; found ${rails}`);
  const footers = (html.match(/<footer\b/g) || []).length;
  if (footers !== 1) fail(`${route} must contain exactly one footer; found ${footers}`);
}
console.log(`GoalOS public demo route registry PASS (${required.length} routes checked)`);
