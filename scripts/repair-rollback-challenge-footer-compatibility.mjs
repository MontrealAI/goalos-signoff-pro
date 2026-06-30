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
let changed = 0;
const failures = [];
const missing = [];
for (const route of routes) {
  const fp = path.join(site, route);
  if (!fs.existsSync(fp)) { missing.push(route); continue; }
  const before = fs.readFileSync(fp, 'utf8');
  const after = normalizeBoundary(before);
  assertBoundary(after, route, failures);
  if (after !== before) { fs.writeFileSync(fp, after); changed++; }
}
if (failures.length) {
  console.error('GoalOS Rollback Challenge footer repair FAILED');
  for (const f of failures) console.error(' - ' + f);
  process.exit(1);
}
if (missing.length) console.log(`GoalOS Rollback Challenge footer repair skipped missing optional routes: ${missing.join(', ')}`);
console.log(`GoalOS Rollback Challenge footer repair PASS — ${changed} routes updated`);
