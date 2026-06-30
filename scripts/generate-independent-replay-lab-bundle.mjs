import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';

const scenario = process.env.GOALOS_REPLAY_SCENARIO || process.argv[2] || 'research';
const allowed = new Set(['research','software','procurement','safety']);
if (!allowed.has(scenario)) throw new Error(`Unsupported scenario: ${scenario}`);
const outDir = path.join(process.cwd(), 'artifacts', 'independent-replay-lab');
await fs.mkdir(outDir, { recursive: true });
const stableHash = (obj) => crypto.createHash('sha256').update(JSON.stringify(obj)).digest('hex');
const manifest = { id:'GOALOS-INDEPENDENT-REPLAY-LAB-V24', scenario, generatedAt:new Date(0).toISOString(), valueMoved:0, posture:['browser-local','no-input','no-upload','no-wallet','no-payment','no-user-data'] };
const packet = { mission:'Independent replay and claim promotion demonstration', scenario, requiredFiles:['manifest','environment','baselines','runner','proofBundle','replayLogs','validatorReports','costLedger','safetyLedger','claimsMatrix','challengeWindow','claimBoundary'], officialFieldsMissing:0 };
const operators = [
  { id:'R1', role:'fresh clone replay', passed:true, checks:106 },
  { id:'R2', role:'pinned environment replay', passed:true, checks:106 },
  { id:'R3', role:'adversarial boundary replay', passed:true, checks:106 }
];
const replay = { quorum:'3/3', focusedTests:318, operators, result:'PASS' };
const certificate = { type:'ClaimPromotionCertificate', claimLevelBefore:'LOCAL_PACKET_PASS', claimLevelAfter:'INDEPENDENT_REPLAY_REVIEW_READY', hardRule:'No replay quorum, no claim promotion.', promotedCandidate:'C3', valueMoved:0 };
const falsifier = { whatWouldFail:['missing baseline ladder','hidden human intervention','private-only trace','unreplayable output','critical safety incident','claim boundary failure'], criticalSafetyIncidents:0 };
const files = {
  '00_manifest.json': manifest,
  '01_public_packet_manifest.json': packet,
  '02_replay_operator_reports.json': replay,
  '03_claim_promotion_certificate.json': certificate,
  '04_falsification_card.json': falsifier,
  'README.md': `# GoalOS Independent Replay Lab v24\n\nScenario: ${scenario}\n\nRule: one run is not proof. Replay makes it public.\n\nNo forms, inputs, uploads, wallets, analytics, payments, user data, confidential data, or value movement.\n`
};
for (const [name, payload] of Object.entries(files)) {
  const body = name.endsWith('.md') ? payload : JSON.stringify(payload, null, 2) + '\n';
  await fs.writeFile(path.join(outDir, name), body);
}
const summary = { ...manifest, files:Object.keys(files), bundleHash:stableHash(files) };
await fs.writeFile(path.join(outDir, 'bundle-summary.json'), JSON.stringify(summary, null, 2) + '\n');
console.log(`GoalOS Independent Replay Lab bundle generated at ${outDir}`);
