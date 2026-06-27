import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = process.cwd();
const scenario = process.env.GOALOS_SCENARIO || process.argv[2] || 'enterprise-ai-acceptance';
const scale = Number(process.env.GOALOS_AGENT_SCALE || process.argv[3] || 24);
const out = path.join(root, 'artifacts', 'multi-agent-sovereign-institution-demo');
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });
const h = (x) => crypto.createHash('sha256').update(typeof x === 'string' ? x : JSON.stringify(x)).digest('hex');
const now = new Date().toISOString();

const mission = {
  id: `MASI-${scenario.toUpperCase()}-${scale}`,
  scenario,
  agentScale: scale,
  createdAt: now,
  posture: 'public-safe synthetic artifact; no user data; no value moved',
  objective: 'Coordinate a large multi-agent constellation into a proof-governed institution for one bounded AI-work acceptance mission.',
  successCriteria: [
    'Role graph created',
    'Access graph scoped',
    'Proof packets emitted',
    'Validator mesh passes',
    'Risk ledger sealed',
    'Human authority remains final'
  ],
  dataBoundary: 'synthetic public-safe sample only',
  contact: 'info@quebec.ai'
};
const roleGraph = [
  ['ARCH','Architect','Mission decomposition and role contract design'],
  ['PLAN','Planner','Work graph, budget, and stopping rule'],
  ['RET','Retriever','Source mapping and provenance boundary'],
  ['EXEC','Executor','Bounded work with scoped authority'],
  ['SIM','Simulator','Counterfactual checks and cost-risk projection'],
  ['VAL','Validator','Evidence, tests, and acceptance gate'],
  ['RED','Red Team','Contradiction and failure search'],
  ['GOV','Governor','Human authority and claim boundary'],
  ['CHR','Chronicle','Replayable memory and capability lineage']
].map(([id,label,duty], index) => ({ id, label, duty, quorumWeight: index < 5 ? 1 : 2, hash: h(id+label+duty) }));
const evidenceDocket = {
  manifestHash: h(mission),
  claimsMatrix: [
    { claim: 'The system can represent a large multi-agent coordination cycle.', status: 'supported by synthetic demo artifact' },
    { claim: 'The demo moves no value and collects no user data.', status: 'supported by public-site posture' },
    { claim: 'Only proof-gated results become reusable memory.', status: 'represented in the Chronicle and capability package' }
  ],
  proofPackets: ['mission','role-graph','bounded-work','validator-report','risk-ledger','chronicle','capability-package'].map((name,i)=>({ name, packetHash: h(name+i+now), syntheticVerdict: 'pass' })),
  publicPrivateBoundary: 'public synthetic proof only; no private traces, user documents, credentials, uploads, or wallets'
};
const validatorReport = {
  verdict: 'review-ready',
  proofValid: true,
  evalPass: true,
  riskBounded: true,
  rollbackReady: true,
  humanAuthorityRequired: true,
  noAutomaticAcceptance: true,
  notes: ['Score is advisory; gates are mandatory.', 'No user data, no value movement, no live settlement.']
};
const riskLedger = {
  falseAcceptanceRisk: 'bounded by validator mesh and human authority',
  privacyRisk: 'reduced by zero-input public demo',
  settlementRisk: 'none in this public demo; no value moved',
  unsupportedClaimRisk: 'blocked by claim-boundary verifiers',
  rollback: 'demo can reset without state persistence'
};
const chronicle = {
  entryId: `CHR-${h(mission).slice(0,12)}`,
  acceptedExperience: ['role graph', 'proof packets', 'validator report', 'risk ledger'],
  reusableCapability: 'coordination demo scaffold',
  futureMission: 'harder real proof mission after public Evidence Docket review'
};
const receipt = {
  receiptId: `MASI-RCPT-${h(chronicle).slice(0,16).toUpperCase()}`,
  missionHash: h(mission),
  docketHash: h(evidenceDocket),
  validatorReportHash: h(validatorReport),
  decision: 'review-ready',
  issuer: 'GoalOS Signoff Pro public demo generator',
  createdAt: now,
  claimBoundary: 'synthetic demo receipt; no production acceptance, no live settlement, no investment claim'
};
const files = {
  'mission-contract.json': mission,
  'role-graph.json': roleGraph,
  'evidence-docket.json': evidenceDocket,
  'validator-report.json': validatorReport,
  'risk-ledger.json': riskLedger,
  'chronicle-entry.json': chronicle,
  'mission-receipt.json': receipt,
  'README.md': `# GoalOS Multi-Agent Sovereign Institution Demo\n\nThis artifact is generated autonomously by GitHub Actions. It is public-safe, synthetic, and contains no user data.\n\nScenario: ${scenario}\nAgent scale: ${scale}\n\nOpen the JSON files in this folder to inspect the mission, role graph, Evidence Docket, validator report, risk ledger, Chronicle entry, and receipt.\n\nNo form, upload, wallet, payment, cookie, analytics, or confidential data is involved.\n`
};
for (const [name, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(out, name), typeof content === 'string' ? content : JSON.stringify(content, null, 2));
}
console.log(`Generated Multi-Agent Sovereign Institution demo bundle at ${out}`);
