#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = process.cwd();
const scenario = process.env.GOALOS_SCENARIO || process.argv[2] || 'research';
const out = path.join(root, 'artifacts', 'sovereign-experience-stream-lab', scenario);
fs.mkdirSync(out, { recursive: true });
const sha = (x) => crypto.createHash('sha256').update(JSON.stringify(x)).digest('hex');
const now = new Date().toISOString();
const scenarioLabels = {
  research: 'AI research acceptance',
  software: 'Software delivery review',
  defensive: 'Defensive readiness packet',
  policy: 'Policy option proof'
};
const label = scenarioLabels[scenario] || scenarioLabels.research;
const experienceEvents = [
  { id: 'E1', state: 'mission committed', action: 'define acceptance criteria', observation: 'criteria bound', validator: 'pass', risk: 0.12, cost: 1.0, memoryEffect: 'candidate' },
  { id: 'E2', state: 'evidence mapped', action: 'link claims to proof packets', observation: 'claims supported', validator: 'pass', risk: 0.1, cost: 1.2, memoryEffect: 'candidate' },
  { id: 'E3', state: 'validator pass', action: 'run replay check', observation: 'replay stable', validator: 'pass', risk: 0.08, cost: 1.1, memoryEffect: 'accepted' },
  { id: 'E4', state: 'reward ledger', action: 'separate acceptance from consequence', observation: 'future routing signal calibrated', validator: 'pass', risk: 0.07, cost: 0.8, memoryEffect: 'accepted' },
  { id: 'E5', state: 'suspicious trace', action: 'attempt memory update', observation: 'replay incomplete', validator: 'hold', risk: 0.31, cost: 0.7, memoryEffect: 'quarantined' },
  { id: 'E6', state: 'unsupported claim', action: 'attempt claim propagation', observation: 'evidence absent', validator: 'fail', risk: 0.44, cost: 0.4, memoryEffect: 'rejected' },
  { id: 'E7', state: 'temporal option', action: 'package accepted workflow', observation: 'bounded macro-workflow emitted', validator: 'pass', risk: 0.06, cost: 0.9, memoryEffect: 'accepted' }
].map(e => ({ ...e, eventHash: sha([scenario, e]).slice(0, 24) }));
const manifest = {
  package: 'GoalOS Sovereign Experience Stream Lab',
  version: '15.0.0-final',
  generatedAt: now,
  scenario,
  label,
  claimBoundary: 'Synthetic public-safe artifact. No user data, no external execution, no value moved.',
  files: [
    '00_manifest.json',
    '01_experience_stream.json',
    '02_grounded_reward_ledger.json',
    '03_temporal_option_registry.json',
    '04_reanalyze_report.json',
    '05_policy_update_certificate.json',
    'README.md'
  ]
};
const rewardLedger = {
  scenario,
  validatorRewardSeparation: true,
  acceptedSignals: experienceEvents.filter(e => e.validator === 'pass').map(e => e.id),
  quarantinedSignals: experienceEvents.filter(e => e.validator === 'hold').map(e => e.id),
  rejectedSignals: experienceEvents.filter(e => e.validator === 'fail').map(e => e.id),
  scoreBefore: { verifiedWork: 61, proofDebt: 42, routingWaste: 29 },
  scoreAfter: { verifiedWork: 88, proofDebt: 13, routingWaste: 11 }
};
const options = {
  options: [
    { id: 'option-evidence-review-v1', initiation: 'deliverable requires acceptance', validator: 'Evidence Docket pass', termination: 'Mission Receipt emitted' },
    { id: 'option-replay-before-reuse-v1', initiation: 'trace proposed for future routing', validator: 'replay gate', termination: 'accept / quarantine / reject' },
    { id: 'option-claim-boundary-v1', initiation: 'claim exceeds support', validator: 'claim boundary', termination: 'revise or reject' }
  ]
};
const reanalyze = {
  findings: [
    'Experience event E3 can update future routing because it is replayable and validator-approved.',
    'Experience event E5 is retained as a warning but cannot update routing authority.',
    'Experience event E6 is rejected and cannot enter Chronicle memory.',
    'Temporal options are admitted only with validator, termination rule, and risk boundary.'
  ]
};
const cert = {
  certificate: 'RouterPolicyUpdateCertificate',
  decision: 'demo-promote',
  promotedFrom: experienceEvents.filter(e => e.memoryEffect === 'accepted').map(e => e.eventHash),
  blockedFromPolicy: experienceEvents.filter(e => e.memoryEffect !== 'accepted').map(e => e.eventHash),
  gates: { proofValid: true, replayPass: true, riskBoundary: true, noPrivateData: true, humanAuthorityPreserved: true },
  certificateHash: ''
};
cert.certificateHash = sha(cert);
const write = (name, obj) => fs.writeFileSync(path.join(out, name), JSON.stringify(obj, null, 2));
write('00_manifest.json', manifest);
write('01_experience_stream.json', { scenario, events: experienceEvents });
write('02_grounded_reward_ledger.json', rewardLedger);
write('03_temporal_option_registry.json', options);
write('04_reanalyze_report.json', reanalyze);
write('05_policy_update_certificate.json', cert);
fs.writeFileSync(path.join(out, 'README.md'), `# GoalOS Sovereign Experience Stream Lab\n\nScenario: ${label}\n\nThis artifact is public-safe and synthetic. It demonstrates how accepted, replayable evidence becomes governed experience for future routing. Held traces remain warnings. Rejected traces cannot become memory.\n\nNo user data, no external execution, no value moved.\n`);
console.log(`Generated sovereign experience lab bundle at ${out}`);
