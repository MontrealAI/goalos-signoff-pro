#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const ROOT = process.cwd();
const OUT = path.join(ROOT, 'artifacts', 'proof-gated-coordination-demo');
const scenario = process.env.SCENARIO || 'research-synthesis';
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });
const generatedAt = new Date().toISOString();
const hash = x => crypto.createHash('sha256').update(JSON.stringify(x)).digest('hex');
const mission = {
  id: `PGC-${Date.now()}`,
  scenario,
  objective: 'Demonstrate how a large multi-agent system becomes a proof-governed sovereign institution.',
  mode: 'public-safe synthetic artifact',
  dataBoundary: 'no user data, no uploads, no credentials, no wallets, no value moved',
  coordinationLaw: 'Maximum verified useful work per unit of risk, cost, latency, and proof debt.'
};
const roleGraph = {
  roles: ['Coordinator','Planner','Builder','Evidence Scout','Validator','Risk Sentinel','Chronicle','Human Gate'],
  edges: [['Coordinator','Planner'],['Planner','Builder'],['Builder','Evidence Scout'],['Evidence Scout','Validator'],['Validator','Risk Sentinel'],['Risk Sentinel','Human Gate'],['Human Gate','Chronicle']],
  stopRule: 'validator pass plus human-gate readiness, otherwise request changes or reject'
};
const claimsMatrix = [
  { claim: 'Coordination requires proof gates, not more conversation.', evidence: 'Role graph plus proof bundle plus verifier report.', status: 'supported in demo' },
  { claim: 'Only accepted work should enter Chronicle memory.', evidence: 'Chronicle entry includes accepted synthetic experience only.', status: 'supported in demo' },
  { claim: 'Settlement remains simulated on the public site.', evidence: 'valueMoved=0 and no walletRequired.', status: 'supported in demo' }
];
const proofBundle = { traceRoot: hash(roleGraph), outputHash: hash(claimsMatrix), costLedger: { syntheticUnits: 12, currency: 'none' }, safetyLedger: { criticalIncidents: 0, personalData: 0, valueMoved: 0 } };
const verifierReport = { verdict: 'review-ready synthetic demo', checks: ['claims mapped','risk visible','no data captured','human gate preserved','receipt sealed'], rejectedClaims: [] };
const riskLedger = { riskState: 'bounded synthetic demo', risks: ['coordination overhead','false acceptance','unsupported claims','proof debt'], controls: ['validator gate','risk sentinel','claim boundary','no user data','no value moved'] };
const evidenceDocket = { manifest: mission, roleGraph, claimsMatrix, proofBundle, verifierReport, riskLedger };
const chronicleEntry = { id: 'CHRONICLE-PGC-001', admitted: true, admissionRule: 'synthetic accepted proof only', reusableCapability: 'proof-gated coordination pattern' };
const missionReceipt = { id: 'GOALOS-PGC-RECEIPT-001', generatedAt, docketHash: hash(evidenceDocket), decisionState: 'review-ready', synthetic: true, dataCaptured: 'none', valueMoved: 0 };
const files = { 'mission-contract.json': mission, 'role-graph.json': roleGraph, 'claims-matrix.json': claimsMatrix, 'proof-bundle.json': proofBundle, 'evidence-docket.json': evidenceDocket, 'verifier-report.json': verifierReport, 'risk-ledger.json': riskLedger, 'chronicle-entry.json': chronicleEntry, 'mission-receipt.json': missionReceipt };
for (const [name, value] of Object.entries(files)) fs.writeFileSync(path.join(OUT, name), JSON.stringify(value, null, 2));
fs.writeFileSync(path.join(OUT, 'README.md'), `# GoalOS Proof-Gated Coordination Demo\n\nGenerated: ${generatedAt}\n\nThis is a public-safe synthetic artifact bundle. It contains no user data, no confidential data, no wallet data, no payments, and no value movement.\n\n## Files\n\n${Object.keys(files).map(f=>`- ${f}`).join('\n')}\n\n## Thesis\n\nLarge multi-agent systems coordinate to maximum effect when every action can become bounded work, proof, validation, Chronicle memory, and reusable capability.\n`);
console.log(`Proof-gated coordination demo bundle generated at ${OUT}`);
