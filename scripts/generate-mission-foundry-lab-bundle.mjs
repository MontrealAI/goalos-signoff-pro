import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = process.cwd();
const outDir = path.join(root, 'artifacts', 'mission-foundry-lab');
const configPath = path.join(root, 'config', 'mission-foundry-lab.json');
const fallbackConfigPath = path.join(path.dirname(new URL(import.meta.url).pathname), '..', 'config', 'mission-foundry-lab.json');
const config = JSON.parse(fs.readFileSync(fs.existsSync(configPath) ? configPath : fallbackConfigPath, 'utf8'));
fs.mkdirSync(outDir, { recursive: true });
const scenarioId = process.env.GOALOS_MISSION_FOUNDRY_SCENARIO || process.env.SCENARIO || 'research';
const scenario = config.scenarios.find(s => s.id === scenarioId) || config.scenarios[0];
const now = new Date().toISOString();
const sha = obj => crypto.createHash('sha256').update(JSON.stringify(obj)).digest('hex');
const candidates = config.candidateSeeds.map(seed => {
  const missionPotential = Math.round((seed.interestingness * 0.22) + (seed.learnability * 0.22) + (seed.proofability * 0.28) + (seed.reuse * 0.18) - (seed.risk * 0.10));
  const proofDebt = Math.max(0, Math.round(100 - seed.proofability + seed.risk * 0.35));
  return { ...seed, scenario: scenario.id, missionPotential, proofDebt, evidenceRoot: `sha256:${sha({ seed, scenario }).slice(0, 40)}` };
});
const admitted = candidates.find(c => c.status === 'ADMITTED');
const manifest = {
  id: 'goalos-mission-foundry-lab-artifact-bundle-v26',
  generatedAt: now,
  scenario,
  publicSafe: true,
  browserLocalEquivalent: true,
  valueMoved: 0,
  files: [
    '00_manifest.json',
    '01_generated_mission_seeds.json',
    '02_interestingness_filter_report.json',
    '03_mission_seed_certificate.json',
    '04_curriculum_ledger_entry.json',
    '05_quarantine_ledger.json',
    'README.md'
  ],
  claimBoundary: config.boundary.claimBoundary
};
const generatedMissionSeeds = {
  scenario: scenario.id,
  objective: scenario.objective,
  nextMission: scenario.nextMission,
  candidates,
  rule: 'Interestingness can allocate search, but replayable proof gates decide admission.'
};
const filterReport = {
  type: 'MissionFoundryFilterReport',
  scenario: scenario.id,
  checks: ['source accepted', 'learnability band', 'validator availability', 'evidence requirements', 'risk boundary', 'rollback plan', 'replay path', 'challenge window', 'claim boundary'],
  admitted: admitted.id,
  nonAdmitted: candidates.filter(c => c.id !== admitted.id).map(c => ({ id: c.id, status: c.status, reason: c.reason })),
  noPrivateData: true,
  noValueMoved: true
};
const certificate = {
  type: 'MissionSeedCertificate',
  candidateId: admitted.id,
  scenario: scenario.id,
  status: 'ADMITTED_FOR_PUBLIC_SAFE_DEMO_CURRICULUM',
  nextMission: scenario.nextMission,
  gates: {
    sourceAccepted: true,
    learnabilityBand: 'target-hard',
    proofRequirementsMapped: true,
    validatorAvailable: true,
    riskBoundary: true,
    rollbackPlan: true,
    replayPath: true,
    challengeWindow: true,
    claimBoundary: true,
    humanAuthority: 'final gate preserved'
  },
  evidenceRoot: admitted.evidenceRoot,
  valueMoved: 0
};
const curriculum = {
  type: 'CurriculumLedgerEntry',
  scenario: scenario.id,
  sourceMission: 'Mission 001 synthetic public-safe packet',
  admittedMissionSeed: admitted.id,
  nextMission: scenario.nextMission,
  expectedDifficulty: 'harder than source mission, still public-safe',
  purpose: 'Advance the evidence frontier without expanding claim authority.',
  noProductionAuthority: true
};
const quarantine = {
  type: 'MissionQuarantineLedger',
  entries: candidates.filter(c => c.id !== admitted.id).map(c => ({
    id: c.id,
    status: c.status,
    reason: c.reason,
    learningUse: 'negative or warning memory only; no mission authority'
  })),
  noPrivateData: true,
  noValueMoved: true
};
const readme = `# GoalOS Mission Foundry Lab v26 Artifact Bundle\n\nScenario: ${scenario.label}\n\nThis public-safe synthetic bundle demonstrates the GoalOS mission-foundry rule:\n\n> Interestingness is allocation pressure. Proof gates are admission authority.\n\nThe bundle contains generated mission seeds, an interestingness filter report, a MissionSeedCertificate, a CurriculumLedgerEntry, and a quarantine ledger. It moves no value, requests no user data, and claims no external audit or production certification.\n\n## Result\n\nAdmitted mission seed: ${admitted.id} — ${admitted.name}\n\nNext mission: ${scenario.nextMission}\n`;
const files = {
  '00_manifest.json': manifest,
  '01_generated_mission_seeds.json': generatedMissionSeeds,
  '02_interestingness_filter_report.json': filterReport,
  '03_mission_seed_certificate.json': certificate,
  '04_curriculum_ledger_entry.json': curriculum,
  '05_quarantine_ledger.json': quarantine
};
for (const [name, data] of Object.entries(files)) fs.writeFileSync(path.join(outDir, name), JSON.stringify(data, null, 2));
fs.writeFileSync(path.join(outDir, 'README.md'), readme);
fs.writeFileSync(path.join(outDir, 'bundle-summary.json'), JSON.stringify({ generatedAt: now, scenario: scenario.id, admitted: admitted.id, bundleHash: `sha256:${sha(files)}` }, null, 2));
console.log(`GoalOS Mission Foundry Lab bundle generated at ${outDir}`);
