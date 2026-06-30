#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { normalizeBoundary, assertBoundary } from './goalos-boundary-shared.mjs';

const site = path.join(process.cwd(), 'site');
const routes = ['governed-decision-state-lab.html', 'decision-state-lab.html'];
if (!fs.existsSync(site)) {
  console.log('GoalOS Governed Decision State public-rule repair skipped: site/ does not exist');
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
  console.error('GoalOS Governed Decision State public-rule repair FAILED');
  for (const f of failures) console.error(' - ' + f);
  process.exit(1);
}
if (missing.length) console.log(`GoalOS Governed Decision State public-rule repair skipped missing optional routes: ${missing.join(', ')}`);
console.log(`GoalOS Governed Decision State public-rule repair PASS — ${changed} routes updated`);
