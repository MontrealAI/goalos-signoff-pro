import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = process.cwd();
const out = path.join(root, 'artifacts', 'capability-compounding-lab');
fs.mkdirSync(out, { recursive: true });
const cfgPath = path.join(root, 'config', 'capability-compounding-lab.json');
const cfg = fs.existsSync(cfgPath) ? JSON.parse(fs.readFileSync(cfgPath, 'utf8')) : JSON.parse(fs.readFileSync(path.join(path.dirname(new URL(import.meta.url).pathname), '..', 'config', 'capability-compounding-lab.json'), 'utf8'));
const hash = x => crypto.createHash('sha256').update(JSON.stringify(x)).digest('hex');
const manifest = {
  schema: 'goalos.capability_compounding.autopilot_manifest.v1',
  version: cfg.version,
  title: cfg.title,
  generated_at: new Date(0).toISOString(),
  public_safety: ['no user data','no confidential data','no uploads','no wallet','no payments','no value moved'],
  claim_boundary: cfg.claimBoundary
};
const missions = cfg.missions.map((m, i) => ({
  ...m,
  mission_contract: {
    objective: m.objective,
    successCriteria: ['claims mapped', 'evidence docket present', 'risk ledger present', 'selection gate passed', 'rollback path present'],
    failureCriteria: ['unsupported claim', 'missing replay path', 'risk boundary exceeded'],
    authority: 'human final gate for real use; browser-local synthetic authority for this demo'
  },
  proof_bundle: {
    traceRoot: hash(['trace', m.id]),
    outputHash: hash(['output', m.id]),
    evalRoot: hash(['eval', m.id]),
    policyDecisionRoot: hash(['policy', m.id]),
    valueMoved: 0
  },
  selection_certificate: {
    decision: 'accepted_for_synthetic_chronicle',
    proofValid: true,
    evalPass: true,
    riskWithinBoundary: true,
    rollbackReady: true,
    challengeCleared: true
  },
  capability_package: {
    id: m.acceptedCapability,
    class: 'public-safe synthetic capability package',
    versionHash: hash(['capability', m.acceptedCapability]),
    lineage: i === 0 ? [] : cfg.missions.slice(0, i).map(x => x.acceptedCapability),
    reuseScope: 'browser-local demonstration only'
  }
}));
const evidenceDocket = {
  schema: 'goalos.evidence_docket.capability_compounding_demo.v1',
  manifest,
  claims_matrix: [
    { claim: 'Accepted proof becomes reusable capability.', status: 'demonstrated synthetically', evidence: 'selection certificates and capability packages' },
    { claim: 'Proof debt decreases as Chronicle memory compounds.', status: 'demonstrated synthetically', evidence: 'mission metrics across M1-M3' },
    { claim: 'Real-world empirical performance is not claimed.', status: 'bounded', evidence: 'claim boundary' }
  ],
  missions,
  scoreboard: {
    verifiedWorkStart: cfg.missions[0].verifiedWork,
    verifiedWorkEnd: cfg.missions[cfg.missions.length - 1].verifiedWork,
    proofDebtStart: cfg.missions[0].proofDebt,
    proofDebtEnd: cfg.missions[cfg.missions.length - 1].proofDebt
  }
};
const chronicle = { schema: 'goalos.chronicle.capability_compounding_demo.v1', entries: missions.map(m => ({ mission: m.id, capability: m.acceptedCapability, proofBundle: m.proof_bundle.traceRoot })) };
const receipt = { schema: 'goalos.mission_receipt.capability_compounding_demo.v1', receiptId: 'capability-compounding-demo-001', evidenceDocketHash: hash(evidenceDocket), chronicleHash: hash(chronicle), valueMoved: 0, decision: 'synthetic_demo_complete' };
const files = {
  '00_manifest.json': manifest,
  '01_mission_series.json': missions,
  '02_evidence_docket.json': evidenceDocket,
  '03_capability_library.json': { capabilities: missions.map(m => m.capability_package) },
  '04_chronicle_entry.json': chronicle,
  '05_mission_receipt.json': receipt
};
for (const [name, obj] of Object.entries(files)) fs.writeFileSync(path.join(out, name), JSON.stringify(obj, null, 2));
fs.writeFileSync(path.join(out, 'README.md'), `# GoalOS Capability Compounding Lab\n\nThis public-safe artifact bundle demonstrates the GoalOS compounding rule:\n\n> Accepted proof becomes reusable capability.\n\nThe bundle is synthetic and browser/local-action safe. It contains no user data, no confidential data, no wallet action, no payment, and no value movement.\n\n## Files\n\n${Object.keys(files).map(f => `- ${f}`).join('\n')}\n\n## Claim boundary\n\n${cfg.claimBoundary}\n`);
console.log(`Capability compounding demo bundle generated at ${out}`);
