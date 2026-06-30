#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { htmlFiles, normalizeFooter, assertBoundary, stripLegalRails, insertLegalRailBeforeFooter } from './goalos-boundary-shared.mjs';

const site = path.join(process.cwd(), 'site');
if (!fs.existsSync(site)) {
  console.log('GoalOS public-site footer compatibility repair skipped: site/ does not exist');
  process.exit(0);
}
const failures = [];
let changed = 0;
const files = htmlFiles(site);
for (const fp of files) {
  const rel = path.relative(site, fp).replaceAll(path.sep, '/');
  if (rel.startsWith('404')) continue;
  const before = fs.readFileSync(fp, 'utf8');
  let html = before;
  // Preserve the current page body, but canonicalize footer compatibility and the legal rail.
  html = insertLegalRailBeforeFooter(normalizeFooter(stripLegalRails(html))).replace(/\n{3,}/g, '\n\n');
  assertBoundary(html, rel, failures);
  if (html !== before) { fs.writeFileSync(fp, html); changed++; }
}
if (failures.length) {
  console.error('GoalOS public-site footer compatibility repair FAILED');
  for (const f of failures) console.error(' - ' + f);
  process.exit(1);
}
console.log(`GoalOS public-site footer compatibility repair PASS — ${files.length} HTML pages checked, ${changed} updated`);
