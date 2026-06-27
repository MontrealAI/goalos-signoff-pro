#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = process.cwd();
const configPath = path.join(root, 'config', 'goalos-delight-demo-lab.json');
if (!fs.existsSync(configPath)) throw new Error('Missing config/goalos-delight-demo-lab.json');
const cfg = JSON.parse(fs.readFileSync(configPath, 'utf8'));
const scenarioArg = process.argv.find(a => a.startsWith('--scenario='))?.split('=')[1] || process.env.SCENARIO || 'ai-research-report';
const scenario = cfg.demos.find(d => d.id === scenarioArg) || cfg.demos[0];
const ts = new Date().toISOString().replace(/[:.]/g, '-');
const out = path.join(root, 'artifacts', 'delight-demo', `${scenario.id}-${ts}`);
fs.mkdirSync(out, { recursive: true });
const sha = (obj) => crypto.createHash('sha256').update(typeof obj === 'string' ? obj : JSON.stringify(obj)).digest('hex');
const json = (name, value) => { fs.writeFileSync(path.join(out, name), JSON.stringify(value, null, 2)); return sha(value); };

const missionContract = {
  type: 'GoalOSDemoMissionContract',
  demo: true,
  publicSafeSample: true,
  generatedAt: new Date().toISOString(),
  contact: cfg.contactEmail,
  missionId: `GSP-DEMO-${scenario.id.toUpperCase()}-${Date.now()}`,
  title: scenario.title,
  audience: scenario.audience,
  objective: scenario.objective,
  decisionToSupport: scenario.decision,
  riskClass: scenario.riskClass,
  criteria: scenario.criteria,
  noUserData: true,
  noUploads: true,
  noExternalCalls: true,
  authority: 'human reviewer remains final authority'
};
const claimsMatrix = scenario.criteria.map((criterion, i) => ({
  criterion,
  claim: `Demo criterion ${i + 1} is reviewable in this public-safe proof mission.`,
  evidenceId: scenario.sampleEvidence[i % scenario.sampleEvidence.length].id,
  status: i < scenario.criteria.length - 1 ? 'supported' : 'requires human review',
  reviewerNote: i < scenario.criteria.length - 1 ? 'Sample evidence mapped.' : 'Final approval remains a human decision.'
}));
const riskLedger = {
  riskClass: scenario.riskClass,
  blockedByDesign: ['personal data collection', 'file uploads', 'wallet connection', 'payments', 'external scans', 'credential requests', 'unsupported claims'],
  openRisks: ['Real customer use requires a separately scoped review process.'],
  humanGate: 'required before real-world acceptance'
};
const verifierReport = {
  verifier: 'GoalOS public demo verifier',
  checks: [
    ['Mission contract present', true],
    ['Claims matrix present', true],
    ['Evidence references present', true],
    ['Risk ledger present', true],
    ['Human authority preserved', true],
    ['No customer data included', true]
  ],
  verdict: scenario.outcome,
  readinessScore: scenario.score
};
const decisionState = {
  state: scenario.outcome,
  reviewerAuthority: 'human reviewer',
  acceptanceBoundary: 'demo receipt only; public-safe sample',
  nextAction: scenario.outcome.includes('Changes') ? 'request changes' : 'review and accept if appropriate'
};
const actionGraph = [
  { step: 'Commission', status: 'complete', output: 'Mission contract' },
  { step: 'Submit', status: 'complete', output: 'Sample evidence references' },
  { step: 'Map', status: 'complete', output: 'Claims matrix' },
  { step: 'Review', status: 'complete', output: 'Verifier report' },
  { step: 'Authorize', status: 'human-gated', output: 'Decision state' },
  { step: 'Receipt', status: 'demo-sealed', output: 'Mission receipt' }
];
const evidenceDocket = {
  manifest: missionContract,
  claimsMatrix,
  sourceProvenance: scenario.sampleEvidence,
  verifierReport,
  riskLedger,
  decisionState,
  actionGraph,
  replayPath: 'Run scripts/generate-delight-demo-proof-mission.mjs --scenario=' + scenario.id
};
const receipt = {
  type: 'GoalOSDemoMissionReceipt',
  receiptId: missionContract.missionId.replace('GSP-DEMO', 'GSP-RECEIPT'),
  demo: true,
  publicSafeSample: true,
  missionContractHash: 'sha256:' + sha(missionContract),
  evidenceDocketHash: 'sha256:' + sha(evidenceDocket),
  claimsMatrixHash: 'sha256:' + sha(claimsMatrix),
  decision: scenario.outcome,
  issuer: 'GoalOS Signoff Pro demo generator',
  generatedAt: missionContract.generatedAt,
  contact: cfg.contactEmail
};

const hashes = {
  'mission-contract.json': json('mission-contract.json', missionContract),
  'claims-matrix.json': json('claims-matrix.json', claimsMatrix),
  'risk-ledger.json': json('risk-ledger.json', riskLedger),
  'verifier-report.json': json('verifier-report.json', verifierReport),
  'decision-state.json': json('decision-state.json', decisionState),
  'action-graph.json': json('action-graph.json', actionGraph),
  'evidence-docket.json': json('evidence-docket.json', evidenceDocket),
  'mission-receipt.json': json('mission-receipt.json', receipt)
};
const html = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${scenario.title} · GoalOS Demo Report</title><style>body{margin:0;font-family:Inter,system-ui,sans-serif;background:#05090d;color:#f7f0df}main{width:min(980px,92vw);margin:0 auto;padding:54px 0}h1{font-size:clamp(42px,7vw,86px);line-height:.9;letter-spacing:-.06em}.pill{display:inline-block;border:1px solid #7fffd455;border-radius:999px;padding:8px 12px;color:#7fffd4;font-weight:800}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:16px}.card{border:1px solid #ffffff22;background:#ffffff0c;border-radius:22px;padding:22px}pre{white-space:pre-wrap;background:#000;border-radius:18px;padding:18px;color:#caffec}</style></head><body><main><p class="pill">GoalOS public-safe demo · no user data</p><h1>${scenario.title}</h1><p>${scenario.objective}</p><section class="grid"><div class="card"><b>Decision</b><p>${scenario.outcome}</p></div><div class="card"><b>Readiness</b><p>${scenario.score}/100</p></div><div class="card"><b>Authority</b><p>Human reviewer remains final gate.</p></div></section><h2>Artifacts</h2><pre>${JSON.stringify(hashes,null,2)}</pre></main></body></html>`;
fs.writeFileSync(path.join(out, 'public-report.html'), html);
fs.writeFileSync(path.join(out, 'README.md'), `# ${scenario.title}\n\nThis is a public-safe autonomous GoalOS Signoff Pro demo artifact package. It contains no user data, no uploads, no credentials, no wallet material, and no private files.\n\n## Files\n\n${Object.keys(hashes).map(f=>`- \`${f}\``).join('\n')}\n- \`public-report.html\`\n\n## Scenario\n\n${scenario.objective}\n\n## Result\n\n${scenario.outcome}\n`);
fs.writeFileSync(path.join(out, 'artifact-manifest.json'), JSON.stringify({ generatedAt: missionContract.generatedAt, scenario: scenario.id, outputDirectory: out, hashes }, null, 2));
console.log(`GoalOS demo proof mission generated at ${out}`);
console.log(`Scenario: ${scenario.id}`);
console.log(`Receipt: ${receipt.receiptId}`);
