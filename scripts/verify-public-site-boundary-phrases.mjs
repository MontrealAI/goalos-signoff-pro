#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { htmlFiles, assertBoundary } from './goalos-boundary-shared.mjs';

const site = path.join(process.cwd(), 'site');
if (!fs.existsSync(site)) {
  console.log('GoalOS boundary phrase verifier skipped: site/ does not exist');
  process.exit(0);
}
const errors = [];
const files = htmlFiles(site);
for (const fp of files) {
  const rel = path.relative(site, fp).replaceAll(path.sep, '/');
  const html = fs.readFileSync(fp, 'utf8');
  assertBoundary(html, rel, errors);
}
if (errors.length) {
  console.error('GoalOS public-site boundary phrase gate FAILED');
  for (const e of errors) console.error(' - ' + e);
  process.exit(1);
}
console.log(`GoalOS public-site boundary phrase gate PASS (${files.length} HTML pages checked)`);
