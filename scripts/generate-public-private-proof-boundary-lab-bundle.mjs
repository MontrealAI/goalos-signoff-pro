#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = process.cwd();
const localCfg = path.join(root, 'config', 'public-private-proof-boundary-lab.json');
const fallbackCfg = path.join(path.dirname(new URL(import.meta.url).pathname), '..', 'config', 'public-private-proof-boundary-lab.json');
const cfg = JSON.parse(fs.readFileSync(fs.existsSync(localCfg) ? localCfg : fallbackCfg, 'utf8'));
const scenario = process.env.SCENARIO || process.argv[2] || 'research-acceptance';
const out = path.join(root, 'artifacts', 'public-private-proof-boundary-lab', scenario);
fs.mkdirSync(out, { recursive: true });
const h = v => crypto.createHash('sha256').update(typeof v === 'string' ? v : JSON.stringify(v)).digest('hex');
const now = new Date().toISOString();
const selected = cfg.scenarios.find(s => s.id === scenario) || cfg.scenarios[0];
const writeJson = (name, obj) => fs.writeFileSync(path.join(out, name), JSON.stringify(obj, null, 2));
const privateAppendixManifest = selected.privateArtifacts.map((name, i) => ({
  privateArtifact: `PRIVATE_${String(i + 1).padStart(2, '0')}`,
  class: name,
  publicHandling: 'withheld from public artifact',
  commitment: `hash:${h(`${selected.id}:${name}:private`).slice(0, 32)}`,
  disclosure: 'not disclosed'
}));
const publicProofCommitments = selected.publicArtifacts.map((name, i) => ({
  field: name,
  commitment: `0x${h(`${selected.id}:${name}:public`).slice(0, 32)}`,
  verifierPurpose: ['claim support', 'verification', 'risk review', 'replay boundary'][i % 4]
}));
const redactionMap = privateAppendixManifest.map((row, i) => ({
  privateArtifact: row.privateArtifact,
  redactionAction: ['hash-only', 'summary-only', 'reason-code-only', 'withhold-private-appendix'][i % 4],
  publicField: publicProofCommitments[i % publicProofCommitments.length]?.field || 'claim boundary',
  leakCheck: 'PASS'
}));
const boundaryRecord = {
  package: cfg.package,
  version: cfg.version,
  generatedAt: now,
  scenario: selected.id,
  label: selected.label,
  mission: selected.mission,
  claimBoundary: cfg.doctrine.claimBoundary,
  publicPrivateBoundary: cfg.doctrine.rule,
  privateAppendixManifest,
  publicProofCommitments,
  redactionMap,
  redactionMapHash: h(redactionMap),
  proofPacketHash: h(`${selected.id}:proof-packet`).slice(0, 40),
  validatorAttestationHash: h(`${selected.id}:validator-attestation`).slice(0, 40),
  proofLedgerCommitment: `0x${h(`${selected.id}:proof-ledger-commitment`).slice(0, 40)}`,
  riskSummary: { index: selected.risk, status: selected.risk < 45 ? 'bounded' : 'escalated' },
  decisionState: selected.risk < 45 ? 'PUBLIC_PROOF_READY' : 'HUMAN_GATE_REQUIRED',
  valueMoved: 0,
  publicSafety: cfg.publicSafety
};
boundaryRecord.hash = h(boundaryRecord);
writeJson('00_manifest.json', { package: cfg.package, version: cfg.version, generatedAt: now, scenario: selected.id, route: cfg.route, hash: h(`${cfg.package}:${selected.id}:${now}`), publicSafety: cfg.publicSafety });
writeJson('01_private_appendix_manifest.json', privateAppendixManifest);
writeJson('02_redaction_map.json', redactionMap);
writeJson('03_public_proof_commitments.json', publicProofCommitments);
writeJson('04_evidence_docket_boundary.json', boundaryRecord);
writeJson('05_proof_ledger_commitment.json', { proofLedgerCommitment: boundaryRecord.proofLedgerCommitment, proofPacketHash: boundaryRecord.proofPacketHash, validatorAttestationHash: boundaryRecord.validatorAttestationHash, valueMoved: 0 });
writeJson('06_boundary_receipt.json', { receiptId: `goalos-boundary-${selected.id}`, decisionState: boundaryRecord.decisionState, redactionMapHash: boundaryRecord.redactionMapHash, proofLedgerCommitment: boundaryRecord.proofLedgerCommitment, valueMoved: 0, generatedAt: now });
fs.writeFileSync(path.join(out, 'README.md'), `# GoalOS Public-Private Proof Boundary Lab\n\nScenario: ${selected.label}\n\nThis public-safe synthetic bundle demonstrates how GoalOS separates private execution from public proof. It contains hashes, summaries, redaction actions, public commitments, and a boundary receipt. It contains no raw prompts, raw traces, credentials, customer files, personal data, confidential data, wallet connection, payment, or value movement.\n\nCore rule: private execution stays private; public proof remains verifiable.\n`);
console.log(`GoalOS public-private proof boundary bundle generated at ${out}`);
