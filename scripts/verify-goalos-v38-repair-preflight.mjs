#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
const required=[
  'scripts/build-goalos-signoff-public-labs-v22-v38.mjs',
  'scripts/build-agialpha-48-contract-atlas-v38.mjs',
  'scripts/verify-goalos-signoff-public-labs-v22-v38.mjs',
  'scripts/verify-agialpha-48-contract-atlas-v38.mjs',
  'config/agialpha-mainnet-contracts-v38.json',
  '.github/workflows/goalos-signoff-v38-agialpha-48-contract-atlas.yml'
];
const missing=required.filter(f=>!fs.existsSync(path.join(process.cwd(),f)));
if(missing.length){console.error('GoalOS v38 repair preflight FAIL'); missing.forEach(f=>console.error('- missing '+f)); process.exit(1)}
const cfg=JSON.parse(fs.readFileSync('config/agialpha-mainnet-contracts-v38.json','utf8'));
if(!Array.isArray(cfg.contracts)||cfg.contracts.length!==48){console.error('Expected 48 contracts in v38 config');process.exit(1)}
console.log('GoalOS v38 repair preflight PASS: required workflow, scripts, config, and 48-contract manifest are present.');
