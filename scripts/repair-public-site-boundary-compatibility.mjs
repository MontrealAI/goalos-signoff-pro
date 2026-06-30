#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { htmlFiles, normalizeBoundary, assertBoundary, repair404 } from './goalos-boundary-shared.mjs';

const site = path.join(process.cwd(), 'site');
if (!fs.existsSync(site)) {
  console.log('GoalOS public-site boundary compatibility repair skipped: site/ does not exist');
  process.exit(0);
}
let changed = repair404(site) ? 1 : 0;
const failures = [];
for (const fp of htmlFiles(site)) {
  const rel = path.relative(site, fp).replaceAll(path.sep, '/');
  if (rel === '404.html') {
    assertBoundary(fs.readFileSync(fp, 'utf8'), rel, failures);
    continue;
  }
  const before = fs.readFileSync(fp, 'utf8');
  const after = normalizeBoundary(before);
  assertBoundary(after, rel, failures);
  if (after !== before) { fs.writeFileSync(fp, after); changed++; }
}
if (failures.length) {
  console.error('GoalOS public-site boundary compatibility repair FAILED');
  for (const f of failures) console.error(' - ' + f);
  process.exit(1);
}
console.log(`GoalOS public-site boundary compatibility repair PASS — ${htmlFiles(site).length} HTML pages checked, ${changed} updated`);
