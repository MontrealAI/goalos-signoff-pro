#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { normalizeBoundary, assertBoundary } from './goalos-boundary-shared.mjs';

const site = path.join(process.cwd(), 'site');
const routes = ['rollback-challenge-lab.html', 'challenge-window-lab.html'];
if (!fs.existsSync(site)) {
  console.log('GoalOS Rollback Challenge footer repair skipped: site/ does not exist');
  process.exit(0);
}
const failures = [];
let changed = 0;
let touched = 0;
for (const route of routes) {
  const fp = path.join(site, route);
  if (!fs.existsSync(fp)) continue;
  touched++;
  const before = fs.readFileSync(fp, 'utf8');
  const html = normalizeBoundary(before);
  assertBoundary(html, route, failures);
  if (!html.includes('Rollback') || !html.includes('Challenge')) failures.push(`${route} missing rollback/challenge identity`);
  if (html !== before) { fs.writeFileSync(fp, html); changed++; }
}
if (touched === 0) {
  console.log('GoalOS Rollback Challenge footer repair skipped: rollback routes not generated');
  process.exit(0);
}
if (failures.length) {
  console.error('GoalOS Rollback Challenge footer repair FAILED');
  for (const f of failures) console.error(' - ' + f);
  process.exit(1);
}
console.log(`GoalOS Rollback Challenge footer repair PASS — ${touched} routes checked, ${changed} updated`);
