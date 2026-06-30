#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { assertBoundary } from './goalos-boundary-shared.mjs';

const site = path.join(process.cwd(), 'site');
const fp = path.join(site, '404.html');
const failures = [];
if (!fs.existsSync(fp)) failures.push('404.html missing');
else assertBoundary(fs.readFileSync(fp, 'utf8'), '404.html', failures);
if (failures.length) {
  console.error('GoalOS 404 public-site rule gate FAILED');
  for (const f of failures) console.error(' - ' + f);
  process.exit(1);
}
console.log('GoalOS 404 public-site rule gate PASS');
