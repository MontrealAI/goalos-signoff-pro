#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = process.cwd();
const configPath = path.join(root, 'config', 'proof-carrying-artifact-lab.json');
const cfg = fs.existsSync(configPath) ? JSON.parse(fs.readFileSync(configPath, 'utf8')) : {
  version: '23.0.0',
  scenarios: [{ id: 'research', label: 'Research acceptance workflow', artifactClass: 'capability-package', objective: 'Turn a public-safe research acceptance workflow into a reusable proof-carrying capability.', riskClass: 'medium', domain: 'AI research review' }]
};
const scenarioId = process.env.SCENARIO || process.argv[2] || cfg.scenarios[0].id;
const scenario = cfg.scenarios.find(s => s.id === scenarioId) || cfg.scenarios[0];
const now = new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');
const sha = value => crypto.createHash('sha256').update(typeof value === 'string' ? value : JSON.stringify(value)).digest('hex');

function versions(scenario) {
  return [
    { id: 'V0', label: 'Persuasive artifact', status: 'REJECTED', proofValid: false, evalPass: false, rollbackReady: false, challengeWindowCleared: false, verifiedValue: 12, proofDebt: 88, reason: 'Output is not a reusable artifact.' },
    { id: 'V1', label: 'Proof-linked candidate', status: 'HELD', proofValid: true, evalPass: false, rollbackReady: false, challengeWindowCleared: false, verifiedValue: 41, proofDebt: 54, reason: 'Evidence exists but baseline and scope are incomplete.' },
    { id: 'V2', label: 'Canary candidate', status: 'CANARY', proofValid: true, evalPass: true, rollbackReady: true, challengeWindowCleared: false, verifiedValue: 67, proofDebt: 23, reason: 'Canary and challenge window remain open.' },
    { id: 'V3', label: 'Proof-carrying artifact', status: 'ACTIVE_SYNTHETIC', proofValid: true, evalPass: true, rollbackReady: true, challengeWindowCleared: true, verifiedValue: scenario.riskClass === 'high' ? 72 : 84, proofDebt: scenario.riskClass === 'high' ? 18 : 9, reason: 'All hard gates clear within synthetic browser-demo scope.' }
  ].map(v => ({ ...v, versionHash: sha(`${scenario.id}:${v.id}:${v.label}:${v.status}`).slice(0, 32), proofPacketRoot: v.proofValid ? sha(`proof:${scenario.id}:${v.id}`).slice(0, 32) : null, valueMoved: 0 }));
}
const immutableVersions = versions(scenario);
const active = immutableVersions.find(v => v.status === 'ACTIVE_SYNTHETIC');
const bundle = {
  manifest: { name: 'GoalOS Proof-Carrying Artifact Lab Autopilot Bundle', version: cfg.version || '23.0.0', generatedAt: now, scenario: scenario.id, browserLocal: true, noUserData: true, valueMoved: 0 },
  artifactVault: { artifactFamilyId: `GOALOS-PCA-${scenario.id.toUpperCase()}-SYNTHETIC`, artifactClass: scenario.artifactClass, objective: scenario.objective, domain: scenario.domain, riskClass: scenario.riskClass, immutableVersions, invariant: 'No silent mutation; every reusable version must carry proof and rollback metadata.', valueMoved: 0 },
  proofHistory: immutableVersions.map(v => ({ version: v.id, versionHash: v.versionHash, proofPacketRoot: v.proofPacketRoot, verdict: v.status, verifiedValue: v.verifiedValue, proofDebt: v.proofDebt, reason: v.reason, valueMoved: 0 })),
  selectionCertificate: { certificateId: `SELECTION-CERT-${scenario.id.toUpperCase()}-V3-SYNTHETIC`, promotedVersion: active.id, promotedVersionHash: active.versionHash, decision: 'PROMOTE_WITHIN_SYNTHETIC_BROWSER_SCOPE', hardGates: { proofValid: true, evalPass: true, riskWithinBoundary: true, rollbackReady: true, canaryReady: true, scopeAuthorized: true, challengeWindowCleared: true }, valueMoved: 0 },
  evolutionLedgerEntry: { ledgerEntryId: `EVOLUTION-LEDGER-${scenario.id.toUpperCase()}-${active.id}-SYNTHETIC`, generatedAt: now, eventType: 'SELECTION_CERTIFICATE_EMITTED', versionHash: active.versionHash, proofRoot: active.proofPacketRoot, valueMoved: 0 },
  rolloutReceipt: { receiptId: `ROLLOUT-RECEIPT-${scenario.id.toUpperCase()}-SYNTHETIC`, status: 'SYNTHETIC_CANARY_CLEARED', valueMoved: 0 },
  rollbackReceipt: { receiptId: `ROLLBACK-RECEIPT-${scenario.id.toUpperCase()}-SYNTHETIC`, status: 'ROLLBACK_READY_SYNTHETIC', lastKnownGoodState: `${scenario.id}-last-known-good-V2`, valueMoved: 0 },
  upgradeRight: { rightId: `PROOF-BACKED-UPGRADE-RIGHT-${scenario.id.toUpperCase()}-SYNTHETIC`, right: 'May influence future synthetic missions within explicit public-safe scope after selection gates clear.', active: true, valueMoved: 0 }
};
const outDir = path.join(root, 'artifacts', `proof-carrying-artifact-lab-${scenario.id}`);
fs.mkdirSync(outDir, { recursive: true });
function write(name, data) { fs.writeFileSync(path.join(outDir, name), JSON.stringify(data, null, 2) + '\n'); }
write('00_manifest.json', bundle.manifest);
write('01_artifact_vault.json', bundle.artifactVault);
write('02_proof_history.json', bundle.proofHistory);
write('03_selection_certificate.json', bundle.selectionCertificate);
write('04_evolution_ledger_entry.json', bundle.evolutionLedgerEntry);
write('05_rollout_receipt.json', bundle.rolloutReceipt);
write('06_rollback_receipt.json', bundle.rollbackReceipt);
write('07_upgrade_right.json', bundle.upgradeRight);
fs.writeFileSync(path.join(outDir, 'README.md'), `# GoalOS Proof-Carrying Artifact Lab Bundle\n\nScenario: ${scenario.label}\n\nThis public-safe synthetic bundle demonstrates that reusable intelligence must become a proof-carrying artifact before it can influence future work.\n\nPublic-site posture: no forms, no inputs, no uploads, no wallet, no cookies, no analytics, no personal data, no confidential data, and no value moved.\n`);
console.log(`GoalOS Proof-Carrying Artifact Lab bundle generated at ${outDir}`);
