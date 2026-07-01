#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
const root = process.cwd();
const dir = path.join(root, '.github', 'workflows');
const files = fs.existsSync(dir) ? fs.readdirSync(dir).filter(f => /\.ya?ml$/i.test(f)) : [];
const missing = [];
const refs = [];
for (const file of files) {
  const rel = path.join('.github', 'workflows', file);
  const text = fs.readFileSync(path.join(root, rel), 'utf8');
  const re = /node\s+(scripts\/[A-Za-z0-9._\/-]+\.mjs)\b/g;
  let m;
  while ((m = re.exec(text))) {
    refs.push(`${rel} -> ${m[1]}`);
    if (!fs.existsSync(path.join(root, m[1]))) missing.push(`${rel} references missing ${m[1]}`);
  }
}
if (missing.length) {
  console.error('Workflow/script integrity FAIL');
  for (const item of missing) console.error(' - ' + item);
  process.exit(1);
}
console.log(`Workflow/script integrity PASS (${refs.length} node script references checked).`);
