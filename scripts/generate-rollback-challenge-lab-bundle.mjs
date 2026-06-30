#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const out = path.join(process.cwd(), 'artifacts', 'rollback-challenge-lab');
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });
const scenario = process.env.SCENARIO || process.argv[2] || 'research-brief';
const now = new Date().toISOString();
const hash = x => crypto.createHash('sha256').update(JSON.stringify(x)).digest('hex');
const manifest = {
  lab: 'GoalOS Signoff Pro — Rollback & Challenge Window Lab',
  version: '19.0.0',
  scenario,
  generatedAt: now,
  publicSafe: true,
  valueMoved: 0,
  posture: 'synthetic browser-local demonstration; no production release authority'
};
const candidates = [
  { id: 'C0', title: 'Output-only candidate', decision: 'blocked', failure: 'missing rollback target and replay path' },
  { id: 'C1', title: 'Challenged proof packet', decision: 'rolled_back', failure: 'claim-boundary contradiction found during challenge window' },
  { id: 'C2', title: 'Canary candidate', decision: 'paused', failure: 'delayed-risk signal triggered canary hold' },
  { id: 'C3', title: 'Rollbackable proof-carrying artifact', decision: 'release_ready_simulation', gates: ['proof', 'eval', 'rollback', 'canary', 'scope', 'challenge', 'human gate'] }
];
const challenge = { windowId: 'CW-001-SYNTHETIC', scenario, phases: ['commit','review','challenge','replay','decision'], candidates, hash: '' };
challenge.hash = hash(challenge);
const rollback = { receiptId: 'ROLLBACK-001-SYNTHETIC', target: 'last-known-good-artifact-v0', candidate: 'C1', reversible: true, valueMoved: 0, hash: '' };
rollback.hash = hash(rollback);
const canary = { canaryId: 'CANARY-001-SYNTHETIC', candidate: 'C2', scope: 'public-safe simulation', status: 'held', reason: 'delayed risk signal', hash: '' };
canary.hash = hash(canary);
const release = { certificateId: 'RELEASE-READY-001-SYNTHETIC', candidate: 'C3', status: 'simulation_release_ready', humanAuthority: 'required', valueMoved: 0, hash: '' };
release.hash = hash(release);
const memory = { entryId: 'FAILURE-MEMORY-001-SYNTHETIC', rule: 'Rejected and rolled-back traces become warnings, not authority.', warnings: ['High score without rollback is not release-grade work.'], hash: '' };
memory.hash = hash(memory);
const files = {
  '00_manifest.json': manifest,
  '01_candidates.json': candidates,
  '02_challenge_window_record.json': challenge,
  '03_rollback_receipt.json': rollback,
  '04_canary_monitor_report.json': canary,
  '05_release_readiness_certificate.json': release,
  '06_failure_memory_entry.json': memory,
  'README.md': `# GoalOS Rollback & Challenge Window Lab\n\nScenario: ${scenario}\n\nThis public-safe synthetic bundle demonstrates that release authority requires proof, challenge clearance, canary monitoring, and rollback readiness. No value moved. No user data.\n`
};
for (const [name, value] of Object.entries(files)) {
  fs.writeFileSync(path.join(out, name), typeof value === 'string' ? value : JSON.stringify(value, null, 2) + '\n');
}
console.log(`Rollback challenge demo bundle generated at ${out}`);
