#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { config, siteDir } from './blockchain-proof-mandate-lab-core.mjs';

const requiredPhrases = [
  'GoalOS Signoff Pro',
  'Blockchain Proof Mandate',
  'Due Diligence Lab v29',
  'Require the proof package.',
  'Where is the proof package?',
  'Blockchain proves the transaction. GoalOS proves the work.',
  'No proof package, no serious trust.',
  'No validation, no settlement.',
  'No receipt, no credibility.',
  config.publicSiteRule
];
const routes = [config.primaryRoute, ...config.aliases];
const artifacts = [
  'blockchain-proof-mandate-lab-manifest.json',
  'proof-package-request-card.json',
  'stakeholder-requirement-map.json',
  'blockchain-due-diligence-scorecard.json',
  'dao-proof-requirement-policy.json',
  'grant-treasury-rfp-proof-template.json',
  'settlement-readiness-decision-tree.json',
  'public-proof-dashboard-schema.json',
  'blockchain-proof-mandate-demo-bundle.json',
  config.manifestRoute
];
const errors = [];
for (const route of routes) {
  const file = path.join(siteDir, route);
  if (!fs.existsSync(file)) { errors.push(`missing route ${route}`); continue; }
  const html = fs.readFileSync(file, 'utf8');
  for (const phrase of requiredPhrases) if (!html.includes(phrase)) errors.push(`${route} missing phrase: ${phrase}`);
  if (/<form\b/i.test(html)) errors.push(`${route} contains a form tag`);
  if (/<input\b/i.test(html)) errors.push(`${route} contains an input tag`);
  if (/<textarea\b/i.test(html)) errors.push(`${route} contains a textarea tag`);
  if (/<select\b/i.test(html)) errors.push(`${route} contains a select tag`);
  if (/window\.ethereum|walletconnect|metamask|fetch\(|XMLHttpRequest|localStorage|sessionStorage/i.test(html)) errors.push(`${route} contains disallowed live-network, wallet, or storage-like code`);
  if (/guaranteed project success|investment recommendation|live mainnet settlement/i.test(html)) errors.push(`${route} contains forbidden overclaim language`);
  if ((html.match(/data-goalos-legal-rail="v12"/g) || []).length !== 1) errors.push(`${route} must contain exactly one v12 legal rail`);
  if ((html.match(/<footer\b/gi) || []).length !== 1) errors.push(`${route} must contain exactly one footer`);
}
for (const artifact of artifacts) {
  const file = path.join(siteDir, artifact);
  if (!fs.existsSync(file)) { errors.push(`missing artifact ${artifact}`); continue; }
  try {
    const parsed = JSON.parse(fs.readFileSync(file, 'utf8'));
    const text = JSON.stringify(parsed);
    if (!text.includes('valueMoved')) errors.push(`${artifact} does not declare valueMoved`);
    if (text.includes('"valueMoved":1') || text.includes('"valueMoved": 1')) errors.push(`${artifact} appears to move value`);
    if (/private key|seed phrase|mnemonic|customer data|confidential customer/i.test(text)) errors.push(`${artifact} contains forbidden sensitive-language pattern`);
  } catch (err) { errors.push(`${artifact} is not valid JSON: ${err.message}`); }
}
if (errors.length) {
  console.error('GoalOS Blockchain Proof Mandate & Due Diligence Lab v29 verification FAILED');
  for (const e of errors) console.error(`- ${e}`);
  process.exit(1);
}
console.log(`GoalOS Blockchain Proof Mandate & Due Diligence Lab v29 verification PASS: ${routes.length} routes, ${artifacts.length} JSON artifacts.`);
