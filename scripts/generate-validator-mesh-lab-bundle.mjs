import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = process.cwd();
const out = process.env.GOALOS_ARTIFACT_DIR || path.join(root, 'artifacts', 'validator-mesh-lab');
const scenario = process.env.GOALOS_SCENARIO || process.argv[2] || 'research-brief';
fs.mkdirSync(out, { recursive: true });
const now = new Date().toISOString();
const digest = (obj) => crypto.createHash('sha256').update(JSON.stringify(obj)).digest('hex');
const scenarios = {
  'research-brief': 'AI research brief acceptance',
  'software-delivery': 'Software delivery review',
  'procurement-dossier': 'Procurement proof room',
  'safety-escalation': 'Safety escalation packet'
};
const mission = {
  schema: 'goalos.validator_mesh_lab.mission.v20',
  missionId: `VMESH-${scenario.toUpperCase().replace(/[^A-Z0-9]+/g, '-')}-001`,
  scenario,
  title: scenarios[scenario] || scenarios['research-brief'],
  objective: 'Demonstrate how independent validators, negative controls, commit-reveal records, and challenge windows convert persuasive output into proof-governed decision support.',
  dataBoundary: 'public synthetic demo only; no user data; no confidential data',
  valueMoved: 0
};
const candidates = [
  { id: 'C0', result: 'REJECTED', reason: 'unsupported claims and no replay path', proofIntegrity: 18 },
  { id: 'C1', result: 'CHALLENGED', reason: 'contradiction register gap', proofIntegrity: 54 },
  { id: 'C2', result: 'QUARANTINED', reason: 'validator diversity and commit-reveal checks fail', proofIntegrity: 61 },
  { id: 'C3', result: 'ACCEPTED_FOR_DECISION_REVIEW', reason: 'proof, replay, negative controls, diverse validators, and challenge clearance pass', proofIntegrity: 94 }
];
const verifierMesh = {
  schema: 'goalos.validator_mesh_report.v20',
  validators: ['source-reality', 'claim-support', 'contradiction-register', 'risk-ledger', 'replay-path', 'negative-controls', 'human-authority-boundary'],
  quorum: '5 of 7 minimum plus no critical contradiction and no human-gate bypass',
  candidateVerdicts: candidates,
  acceptedForDecisionReview: 'C3',
  automaticAuthority: false,
  valueMoved: 0
};
const commitReveal = {
  schema: 'goalos.commit_reveal_record.v20',
  commitRoot: `sha256:${digest({ mission, phase: 'commit' })}`,
  revealRoot: `sha256:${digest({ mission, candidates, phase: 'reveal' })}`,
  validatorsCommittedBeforeReveal: true,
  herdingCheck: 'C2 quarantined in synthetic demo',
  valueMoved: 0
};
const falsification = {
  schema: 'goalos.falsification_ladder.v20',
  negativeControls: ['missing evidence', 'unsupported source', 'contradiction injection', 'collusive quorum', 'replay gap'],
  blocked: ['C0', 'C1', 'C2'],
  survived: 'C3',
  valueMoved: 0
};
const challenge = {
  schema: 'goalos.challenge_resolution.v20',
  challengeWindow: 'synthetic demo challenge window',
  records: [
    { candidate: 'C0', challenge: 'no evidence', resolution: 'rejected' },
    { candidate: 'C1', challenge: 'contradiction survives', resolution: 'held' },
    { candidate: 'C2', challenge: 'weak validator independence', resolution: 'quarantined' },
    { candidate: 'C3', challenge: 'negative controls and replay pass', resolution: 'decision-review ready' }
  ],
  valueMoved: 0
};
const decision = {
  schema: 'goalos.validator_mesh_decision_state.v20',
  decisionState: 'C3_ACCEPTED_FOR_HUMAN_DECISION_REVIEW',
  cannotBecomeAuthority: ['C0', 'C1', 'C2'],
  warningMemory: ['missing replay path', 'contradiction drift', 'collusive-looking quorum'],
  receiptReady: true,
  finalAuthority: 'human/institutional reviewer',
  valueMoved: 0
};
const manifest = {
  schema: 'goalos.validator_mesh_bundle_manifest.v20',
  generatedAt: now,
  files: {
    mission: '00_manifest.json',
    candidates: '01_candidates.json',
    verifierMesh: '02_verifier_mesh_report.json',
    commitReveal: '03_commit_reveal_record.json',
    falsification: '04_falsification_ladder.json',
    challenge: '05_challenge_resolution.json',
    decision: '06_decision_state.json'
  },
  hashAlgorithm: 'sha256',
  claimBoundary: 'Synthetic public-safe demo. No external audit, no production certification, no live settlement, no value movement, no user data.',
  valueMoved: 0
};
const files = {
  '00_manifest.json': manifest,
  '01_candidates.json': candidates,
  '02_verifier_mesh_report.json': verifierMesh,
  '03_commit_reveal_record.json': commitReveal,
  '04_falsification_ladder.json': falsification,
  '05_challenge_resolution.json': challenge,
  '06_decision_state.json': decision
};
manifest.fileHashes = Object.fromEntries(Object.entries(files).map(([name, obj]) => [name, digest(obj)]));
for (const [name, obj] of Object.entries(files)) fs.writeFileSync(path.join(out, name), JSON.stringify(obj, null, 2) + '\n');
fs.writeFileSync(path.join(out, 'README.md'), `# GoalOS Validator Mesh & Falsification Lab\n\nScenario: ${scenario}\n\nThis public-safe artifact demonstrates GoalOS verifier-mesh logic: candidates are challenged by independent validator roles, negative controls, commit-reveal records, and challenge-window resolution before any decision-review state is admitted.\n\nResult: C3 is accepted for human decision review. C0-C2 are rejected, held, or quarantined. No value moved. No user data.\n`);
console.log(`GoalOS Validator Mesh Lab bundle generated at ${out}`);
