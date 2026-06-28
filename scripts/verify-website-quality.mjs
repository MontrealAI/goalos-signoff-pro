#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const ROOT = process.cwd();
const SITE = path.join(ROOT, 'site');
const errors = [];
function run(label, file) {
  if (!fs.existsSync(path.join(ROOT, file))) return;
  const res = spawnSync(process.execPath, [file], { cwd: ROOT, encoding: 'utf8' });
  process.stdout.write(res.stdout || '');
  process.stderr.write(res.stderr || '');
  if (res.status !== 0) errors.push(`${label} failed`);
}

run('GoalOS production site verifier', 'scripts/verify-goalos-production-site.mjs');
run('Proof Gradient route verifier', 'scripts/verify-proof-gradient-lab-page.mjs');
run('Capability Compounding Lab verifier', 'scripts/verify-capability-compounding-lab-page.mjs');
run('Public demo route registry verifier', 'scripts/verify-public-demo-routes.mjs');

if (!fs.existsSync(SITE)) errors.push('site directory missing.');
else {
  const htmlFiles = [];
  const walk = dir => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(p);
      else if (entry.isFile() && entry.name.endsWith('.html')) htmlFiles.push(p);
    }
  };
  walk(SITE);
  if (!htmlFiles.length) errors.push('No HTML pages generated.');
  for (const file of htmlFiles) {
    const rel = path.relative(SITE, file);
    const html = fs.readFileSync(file, 'utf8');
    if (/Route Not Found/i.test(html) && rel !== '404.html') errors.push(`${rel} is route-not-found fallback.`);
    for (const tag of ['<form', '<input', '<textarea', '<select']) if (html.toLowerCase().includes(tag)) errors.push(`${rel} contains forbidden public input tag ${tag}`);
    if ((html.match(/Public site rule/g) || []).length !== 1) errors.push(`${rel} must contain exactly one public-site rule.`);
    if ((html.match(/<footer\b/gi) || []).length !== 1) errors.push(`${rel} must contain exactly one footer.`);
  }
  const comp = path.join(SITE, 'capability-compounding-lab.html');
  if (!fs.existsSync(comp)) errors.push('capability-compounding-lab.html missing.');
  else {
    const html = fs.readFileSync(comp, 'utf8');
    if (!(html.includes('Watch proof become capability') || html.includes('Living Chronicle control room'))) errors.push('Capability page missing dynamic lab section.');
    if (!(html.includes('capability-compounding-demo-bundle.json') || html.includes('Download demo bundle'))) errors.push('Capability page missing demo bundle link.');
  }
}

if (errors.length) {
  console.error('GoalOS website quality gate FAILED');
  for (const e of errors) console.error(' - ' + e);
  process.exit(1);
}
console.log('GoalOS website quality gate PASS');
