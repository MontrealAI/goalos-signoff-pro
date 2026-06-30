#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const site = path.join(process.cwd(), 'site');
const errors = [];
const exists = rel => fs.existsSync(path.join(site, rel));
function checkPage(rel, phrase, required = false) {
  if (!exists(rel)) { if (required) errors.push(`${rel} missing`); return; }
  const html = fs.readFileSync(path.join(site, rel), 'utf8');
  if (/Route Not Found/i.test(html)) errors.push(`${rel} contains Route Not Found fallback`);
  const rail = (html.match(/data-goalos-legal-rail="v12"/g) || []).length;
  if (rail !== 1) errors.push(`${rel} must contain exactly one v12 legal rail, found ${rail}`);
  const foot = (html.match(/<footer\b/gi) || []).length;
  if (foot !== 1) errors.push(`${rel} must contain exactly one footer, found ${foot}`);
  if (phrase && !html.toLowerCase().includes(phrase.toLowerCase())) errors.push(`${rel} missing phrase: ${phrase}`);
}
checkPage('proof-settlement-lab.html', 'No ProofBundle', true);
checkPage('settlement-control-lab.html', 'No ProofBundle', true);
checkPage('mission-001.html', 'Mission 001');
checkPage('proof-gradient-lab.html', 'Score is advisory');
checkPage('capability-compounding-lab.html', 'Accepted proof becomes');
checkPage('sovereign-experience-stream-lab.html', 'sovereign experience');
if (errors.length) {
  console.error('GoalOS public demo route registry FAILED');
  for (const e of errors) console.error(' - ' + e);
  process.exit(1);
}
console.log('GoalOS public demo route registry PASS');
