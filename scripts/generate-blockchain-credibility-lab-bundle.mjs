#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = process.cwd();
const configPath = path.join(root, 'config', 'blockchain-credibility-lab.json');
const fallbackConfigPath = path.join(path.dirname(new URL(import.meta.url).pathname), '..', 'config', 'blockchain-credibility-lab.json');
const config = JSON.parse(fs.readFileSync(fs.existsSync(configPath) ? configPath : fallbackConfigPath, 'utf8'));
const scenarioId = process.env.GOALOS_BLOCKCHAIN_SCENARIO || process.env.SCENARIO || process.argv[2] || 'dao-grant';
const scenario = config.scenarios.find(s => s.id === scenarioId) || config.scenarios[0];
const outDir = path.join(root, 'artifacts', 'blockchain-credibility-lab');
fs.mkdirSync(outDir, { recursive: true });
const now = new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');
const digest = value => crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex');

const manifest = {
  id: config.id,
  version: config.version,
  generatedAt: now,
  scenario: scenario.id,
  title: config.title,
  claimBoundary: config.boundary.claimBoundary,
  publicRule: config.boundary.publicRule,
  valueMoved: 0,
  noUserData: true,
  noWallet: true,
  noPayments: true
};
const missionContract = {
  type: 'BlockchainCredibilityMissionContract',
  scenario: scenario.id,
  label: scenario.label,
  objective: scenario.objective,
  settlementRule: scenario.settlementRule,
  gates: config.proofGates.map(g => ({ id: g.id, name: g.name, required: true, artifact: g.artifact })),
  missionRoot: `sha256:${digest({ scenario, gates: config.proofGates }).slice(0, 48)}`
};
const evidenceDocket = {
  type: 'BlockchainCredibilityEvidenceDocket',
  scenario: scenario.id,
  proofPackage: scenario.proofPackage.map((name, i) => ({ id: `E${String(i + 1).padStart(2, '0')}`, name, status: 'present', evidenceRoot: `sha256:${digest({ name, scenario }).slice(0, 32)}` })),
  missingFromRejectedMode: ['mission contract', 'claim mapping', 'replay path', 'risk ledger', 'human signoff', 'receipt'],
  valueMoved: 0
};
const validationReport = {
  type: 'BlockchainCredibilityValidatorReport',
  acceptedCandidate: 'B3',
  candidates: config.candidates.map(c => ({ id: c.id, name: c.name, status: c.status, proofScore: c.proofScore, settlementReadiness: c.settlementReadiness, reason: c.reason })),
  verdict: 'SETTLEMENT_READY_SYNTHETIC_PUBLIC_DEMO',
  reason: 'The GoalOS proof-package candidate is complete enough to emit a synthetic settlement-readiness signal. Human authority remains required before any real-world use.',
  valueMoved: 0
};
const settlementReadiness = {
  type: 'BlockchainCredibilitySettlementReadinessSignal',
  scenario: scenario.id,
  standard: 'No Proof. No Trust. No Settlement.',
  signal: 'ready-for-human-authorized-settlement-review',
  liveSettlement: false,
  walletConnected: false,
  valueMoved: 0,
  readinessRoot: `sha256:${digest({ missionContract, evidenceDocket, validationReport }).slice(0, 48)}`
};
const receipt = {
  type: 'BlockchainCredibilityReceipt',
  receiptId: `goalos-signoff-pro-v28-${scenario.id}`,
  decisionState: 'SYNTHETIC_SETTLEMENT_REVIEW_READY',
  iconicLine: 'Blockchain proves the transaction. GoalOS proves the work.',
  receiptRoot: `sha256:${digest({ manifest, settlementReadiness }).slice(0, 48)}`,
  noUserData: true,
  noWallet: true,
  valueMoved: 0
};
const summary = {
  status: 'PASS',
  lab: config.title,
  scenario: scenario.id,
  files: 7,
  rule: 'No proof package, no serious trust, no settlement readiness.',
  generatedAt: now,
  valueMoved: 0
};
const readme = `# GoalOS Signoff Pro — Blockchain Credibility Standard Lab v28 artifact bundle\n\nScenario: ${scenario.label}\n\nRule: Blockchain proves the transaction. GoalOS proves the work. No Proof. No Trust. No Settlement.\n\nThis bundle is synthetic and public-safe. It contains no user data, no upload path, no wallet connection, no payment execution, and no value movement. It is designed to show how blockchain work can become settlement-review-ready only after mission, evidence, replay, validation, risk, human authority, and receipt gates are complete.\n`;
const files = {
  '00_manifest.json': manifest,
  '01_mission_contract.json': missionContract,
  '02_evidence_docket.json': evidenceDocket,
  '03_validator_report.json': validationReport,
  '04_settlement_readiness_signal.json': settlementReadiness,
  '05_mission_receipt.json': receipt,
  'bundle-summary.json': summary
};
for (const [name, data] of Object.entries(files)) fs.writeFileSync(path.join(outDir, name), JSON.stringify(data, null, 2) + '\n');
fs.writeFileSync(path.join(outDir, 'README.md'), readme);
console.log(`GoalOS Blockchain Credibility Lab v28 artifact bundle generated at ${outDir}`);
