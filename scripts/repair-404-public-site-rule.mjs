#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { repair404, assertBoundary } from './goalos-boundary-shared.mjs';

const site = path.join(process.cwd(), 'site');
if (!fs.existsSync(site)) {
  console.log('GoalOS 404 public-site rule repair skipped: site/ does not exist');
  process.exit(0);
}
const changed = repair404(site);
const fp = path.join(site, '404.html');
const failures = [];
if (!fs.existsSync(fp)) failures.push('404.html was not created');
else assertBoundary(fs.readFileSync(fp, 'utf8'), '404.html', failures);
if (failures.length) {
  console.error('GoalOS 404 public-site rule repair FAILED');
  for (const f of failures) console.error(' - ' + f);
  process.exit(1);
}
console.log(`GoalOS 404 public-site rule repair PASS — 404.html ${changed ? 'rewritten' : 'already stable'}`);
