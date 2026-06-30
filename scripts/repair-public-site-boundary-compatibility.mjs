#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { htmlFiles, normalizeBoundary, assertBoundary } from './goalos-boundary-shared.mjs';

const site = path.join(process.cwd(), 'site');
if (!fs.existsSync(site)) {
  console.log('GoalOS public-site boundary compatibility repair skipped: site/ does not exist');
  process.exit(0);
}
const files = htmlFiles(site);
const failures = [];
let changed = 0;
for (const fp of files) {
  const rel = path.relative(site, fp).replaceAll(path.sep, '/');
  if (rel.startsWith('404')) continue;
  const before = fs.readFileSync(fp, 'utf8');
  const html = normalizeBoundary(before);
  assertBoundary(html, rel, failures);
  if (html !== before) { fs.writeFileSync(fp, html); changed++; }
}
if (failures.length) {
  console.error('GoalOS public-site boundary compatibility repair FAILED');
  for (const f of failures) console.error(' - ' + f);
  process.exit(1);
}
console.log(`GoalOS public-site boundary compatibility repair PASS — ${files.length} HTML pages checked, ${changed} updated`);
