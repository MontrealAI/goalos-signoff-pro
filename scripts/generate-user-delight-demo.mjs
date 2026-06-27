#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = process.cwd();
const configPath = path.join(root, 'config', 'user-delight-autopilot.json');
const config = fs.existsSync(configPath) ? JSON.parse(fs.readFileSync(configPath, 'utf8')) : { demoScenarios: [], contactEmail: 'info@quebec.ai' };
const args = Object.fromEntries(process.argv.slice(2).map((arg) => {
  const [k, ...rest] = arg.replace(/^--/, '').split('=');
  return [k, rest.join('=') || true];
}));
const scenarioId = String(args.scenario || process.env.SCENARIO || config.demoScenarios?.[0]?.id || 'ai-research-report');
const scenario = (config.demoScenarios || []).find((s) => s.id === scenarioId) || config.demoScenarios?.[0] || {
  id: 'ai-research-report', title: 'AI research report acceptance', objective: 'Demo proof mission', criteria: [], outputs: []
};
const outDir = path.join(root, 'artifacts', 'user-delight-demo', scenario.id);
fs.mkdirSync(outDir, { recursive: true });
const sha256 = (value) => crypto.createHash('sha256').update(typeof value === 'string' ? value : JSON.stringify(value)).digest('hex');
const writeJson = (file, value) => fs.writeFileSync(path.join(outDir, file), JSON.stringify(value, null, 2));

const timestamp = new Date().toISOString();
const mission = {
  schema: 'goalos.demo.mission-contract.v1',
  missionId: `GSP-DEMO-${scenario.id.toUpperCase().replace(/[^A-Z0-9]/g, '-')}`,
  generatedAt: timestamp,
  product: 'GoalOS Signoff Pro',
  scenario: scenario.id,
  title: scenario.title,
  audience: scenario.audience,
  objective: scenario.objective,
  inputBoundary: 'Public-safe demonstration content only. No user data requested or required.',
  acceptanceCriteria: scenario.criteria,
  reviewAuthority: 'Designated human reviewer',
  contact: config.contactEmail || 'info@quebec.ai'
};
const claimsMatrix = scenario.criteria.map((criterion, index) => ({
  claimId: `CLAIM-${String(index + 1).padStart(2, '0')}`,
  criterion,
  evidenceId: `EVID-${String(index + 1).padStart(2, '0')}`,
  evidenceType: ['manifest', 'source', 'test', 'risk', 'review', 'receipt'][index % 6],
  status: 'mapped',
  reviewerJudgment: index < scenario.criteria.length - 1 ? 'complete in demo' : 'human decision required'
}));
const verifierReport = {
  schema: 'goalos.demo.verifier-report.v1',
  missionId: mission.missionId,
  status: 'review-ready',
  checks: [
    { check: 'Acceptance criteria present', result: 'pass' },
    { check: 'Evidence mapped to criteria', result: 'pass' },
    { check: 'Risk ledger present', result: 'pass' },
    { check: 'Human final gate preserved', result: 'pass' },
    { check: 'No external action required', result: 'pass' }
  ],
  notes: ['Demo artifact is public-safe and suitable for user education.']
};
const riskLedger = [
  { risk: 'AI output accepted without evidence', mitigation: 'Require criteria-to-evidence mapping before acceptance', severity: 'high' },
  { risk: 'Ambiguous approval state', mitigation: 'Record explicit human decision and receipt status', severity: 'medium' },
  { risk: 'Private data exposure', mitigation: 'Use public-safe demo content only', severity: 'high' }
];
const actionGraph = [
  { step: 'Commission', output: 'Mission contract' },
  { step: 'Submit', output: 'Evidence categories' },
  { step: 'Map', output: 'Claims matrix' },
  { step: 'Review', output: 'Verifier report' },
  { step: 'Accept', output: 'Decision state' },
  { step: 'Receipt', output: 'Mission Receipt' }
];
const decisionState = {
  schema: 'goalos.demo.decision-state.v1',
  missionId: mission.missionId,
  decision: scenario.decision || 'Review-ready',
  humanAuthority: 'Final decision belongs to a designated human reviewer',
  evidenceDocketStatus: 'complete for demo',
  actionGraphStatus: 'generated',
  receiptStatus: 'issued for demo'
};
const evidenceDocket = {
  schema: 'goalos.demo.evidence-docket.v1',
  docketId: `${mission.missionId}-DOCKET`,
  mission,
  claimsMatrix,
  verifierReport,
  riskLedger,
  actionGraph,
  decisionState,
  publicSafe: true,
  claimBoundary: 'Demonstration artifact. It does not certify real-world truth, payment, legal status, investment value, or production authorization.'
};
const receiptBase = {
  schema: 'goalos.demo.mission-receipt.v1',
  receiptId: `${mission.missionId}-RECEIPT`,
  missionId: mission.missionId,
  docketHash: sha256(evidenceDocket),
  decisionHash: sha256(decisionState),
  status: 'signed-demo-receipt',
  issuedAt: timestamp,
  issuer: 'GoalOS Signoff Pro demo generator',
  replayPath: './evidence-docket.json',
  publicSafe: true
};
const receipt = { ...receiptBase, receiptHash: sha256(receiptBase) };
writeJson('mission-contract.json', mission);
writeJson('claims-matrix.json', claimsMatrix);
writeJson('verifier-report.json', verifierReport);
writeJson('risk-ledger.json', riskLedger);
writeJson('action-graph.json', actionGraph);
writeJson('decision-state.json', decisionState);
writeJson('evidence-docket.json', evidenceDocket);
writeJson('mission-receipt.json', receipt);
const html = `<!doctype html><html><head><meta charset="utf-8"><title>${scenario.title} · GoalOS Demo Proof Mission</title><style>body{font-family:Inter,system-ui,sans-serif;background:#050b0d;color:#f8f4e8;line-height:1.5;margin:0;padding:40px}main{max-width:900px;margin:auto}.card{border:1px solid rgba(115,255,215,.25);background:rgba(255,255,255,.06);border-radius:24px;padding:24px;margin:18px 0}h1{font-size:56px;line-height:.95}.pill{display:inline-block;border:1px solid rgba(255,233,141,.35);border-radius:999px;padding:8px 12px;color:#73ffd7;text-transform:uppercase;font-weight:900;font-size:12px}code{color:#ffe98d}</style></head><body><main><span class="pill">Generated demo Proof Mission</span><h1>${scenario.title}</h1><p>${scenario.objective}</p><div class="card"><h2>Mission receipt</h2><p><b>Receipt ID:</b> <code>${receipt.receiptId}</code></p><p><b>Docket hash:</b> <code>${receipt.docketHash}</code></p><p><b>Decision:</b> ${decisionState.decision}</p></div><div class="card"><h2>Included artifacts</h2><ul><li>mission-contract.json</li><li>claims-matrix.json</li><li>evidence-docket.json</li><li>verifier-report.json</li><li>risk-ledger.json</li><li>decision-state.json</li><li>mission-receipt.json</li></ul></div></main></body></html>`;
fs.writeFileSync(path.join(outDir, 'public-report.html'), html);
fs.writeFileSync(path.join(outDir, 'README.md'), `# ${scenario.title}\n\nThis is a public-safe GoalOS Signoff Pro demo Proof Mission generated by GitHub Actions.\n\n## Included\n\n- mission-contract.json\n- claims-matrix.json\n- evidence-docket.json\n- verifier-report.json\n- risk-ledger.json\n- action-graph.json\n- decision-state.json\n- mission-receipt.json\n- public-report.html\n\nContact: ${config.contactEmail || 'info@quebec.ai'}\n`);
console.log(`Generated demo Proof Mission at ${outDir}`);
