#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const out = path.join(process.cwd(), 'artifacts', 'browser-beta-demo');
fs.mkdirSync(out, { recursive: true });
const generatedAt = new Date().toISOString();
const files = {
  'mission-contract.json': { objective: 'Demonstrate proof-to-acceptance for one AI deliverable', decision: 'Demo package ready for inspection', dataBoundary: 'public-safe synthetic data only', gates: ['Commission','Submit','Map','Review','Accept','Receipt'] },
  'claims-matrix.json': { claims: [{ claim: 'Mission has explicit acceptance gates', evidence: 'gate list and trace', status: 'supported' }, { claim: 'Receipt is browser-local demo', evidence: 'static generated bundle', status: 'supported' }] },
  'evidence-docket.json': { manifest: 'GoalOS browser beta demo docket', publicSafe: true, evidence: ['mission-contract.json','claims-matrix.json','risk-ledger.json','verifier-report.json'] },
  'verifier-report.json': { verdict: 'demo-ready', checks: ['no user data','no upload','no wallet','no payment','no external call'] },
  'risk-ledger.json': { risks: [{ risk: 'demo is synthetic', control: 'present as browser-local demonstration, not production proof' }] },
  'mission-receipt.json': { receiptId: 'goalos-browser-beta-demo-receipt', state: 'demo-accepted', generatedAt },
  'README.md': '# GoalOS Browser Beta Demo Bundle\n\nPublic-safe synthetic proof mission artifacts. No user data. No upload. No wallet. No value moved.\n'
};
for (const [name, content] of Object.entries(files)) fs.writeFileSync(path.join(out, name), typeof content === 'string' ? content : JSON.stringify(content, null, 2));
const manifest = { generatedAt, files: Object.keys(files), sha256: {} };
for (const name of Object.keys(files)) manifest.sha256[name] = crypto.createHash('sha256').update(fs.readFileSync(path.join(out,name))).digest('hex');
fs.writeFileSync(path.join(out,'manifest.json'), JSON.stringify(manifest,null,2));
console.log(`Generated browser beta demo bundle at ${out}`);
