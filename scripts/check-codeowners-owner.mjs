#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const codeownersPath = path.join(root, '.github', 'CODEOWNERS');
const reportPath = path.join(root, 'verification', 'codeowners-owner-check.json');
const failures = [];
const warnings = [];

if (!fs.existsSync(codeownersPath)) {
  failures.push('missing .github/CODEOWNERS');
} else {
  const text = fs.readFileSync(codeownersPath, 'utf8');
  const activeLines = text.split(/\r?\n/).filter(line => line.trim() && !line.trim().startsWith('#'));
  if (!activeLines.length) failures.push('CODEOWNERS has no active owner rules');
  if (!activeLines.some(line => line.includes('@MontrealAI'))) failures.push('CODEOWNERS must include active @MontrealAI ownership rules');
  if (activeLines.some(line => /__CODEOWNER__|@your-github|@your-org|@your-/.test(line))) failures.push('CODEOWNERS contains placeholder owner text in an active rule');
  if (!activeLines.some(line => line.startsWith('.github/CODEOWNERS'))) warnings.push('recommended: explicitly protect .github/CODEOWNERS with @MontrealAI');
  if (!activeLines.some(line => line.startsWith('.github/workflows/'))) warnings.push('recommended: explicitly protect .github/workflows/ with @MontrealAI');
  if (!activeLines.some(line => line.startsWith('src/'))) warnings.push('recommended: explicitly protect src/ with @MontrealAI');
}

const status = failures.length ? 'FAIL' : 'CONFIGURED_MONTREALAI';
fs.mkdirSync(path.dirname(reportPath), { recursive: true });
fs.writeFileSync(reportPath, JSON.stringify({ schema: 'goalos.signoff.codeowners_owner_check.v1', status, repositoryOwner: '@MontrealAI', checkedAt: new Date().toISOString(), failures, warnings }, null, 2) + '\n');
if (failures.length) {
  console.error('CODEOWNERS OWNER CHECK FAIL');
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log('CODEOWNERS CONFIGURED FOR MONTREALAI');
if (warnings.length) console.log(warnings.join('\n'));
