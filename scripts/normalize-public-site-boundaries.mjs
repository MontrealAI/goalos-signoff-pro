#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { htmlFiles, normalizeBoundary, assertBoundary, repair404 } from './goalos-boundary-shared.mjs';

const site = path.join(process.cwd(), 'site');
if (!fs.existsSync(site)) {
  console.log('GoalOS public-site boundary normalizer skipped: site/ does not exist');
  process.exit(0);
}
let changed = repair404(site) ? 1 : 0;
const failures = [];
const files = htmlFiles(site);
for (const fp of files) {
  const rel = path.relative(site, fp).replaceAll(path.sep, '/');
  if (rel === '404.html') {
    const html404 = fs.readFileSync(fp, 'utf8');
    assertBoundary(html404, rel, failures);
    continue;
  }
  const before = fs.readFileSync(fp, 'utf8');
  const html = normalizeBoundary(before);
  assertBoundary(html, rel, failures);
  if (html !== before) { fs.writeFileSync(fp, html); changed++; }
}
if (failures.length) {
  console.error('GoalOS public-site boundary normalizer FAILED');
  for (const f of failures) console.error(' - ' + f);
  process.exit(1);
}
console.log(`GoalOS public-site boundary normalizer PASS — ${files.length} HTML pages checked, ${changed} updated`);
