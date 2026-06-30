import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = process.cwd();
const configPath = path.join(root, 'config', 'process-evidence-lab.json');
const fallbackConfigPath = path.join(path.dirname(new URL(import.meta.url).pathname), '..', 'config', 'process-evidence-lab.json');
const config = JSON.parse(fs.readFileSync(fs.existsSync(configPath) ? configPath : fallbackConfigPath, 'utf8'));
const scenario = process.env.SCENARIO || process.argv[2] || 'research';
const scenarioObj = config.scenarios.find(s => s.id === scenario) || config.scenarios[0];
const outDir = path.join(root, 'artifacts', 'process-evidence-lab');
fs.mkdirSync(outDir, { recursive: true });
const now = new Date().toISOString();
const digest = obj => crypto.createHash('sha256').update(JSON.stringify(obj)).digest('hex');
const reviewReady = config.candidates.find(c => c.status === 'REVIEW_READY');
const trace = [
  'Mission Contract', 'Source Pass', 'Tool Scope', 'Claim Lineage', 'Contradiction Pass', 'Process Validator', 'Risk Ledger', 'Receipt Pointer'
].map((name, i) => ({
  id: `P${String(i + 1).padStart(2, '0')}`,
  name,
  status: 'PASS',
  root: `sha256:${digest({ name, scenarioObj, i }).slice(0, 32)}`,
  rollbackPointer: i < 6 ? 'return-to-proof-work' : 'revoke-or-escalate',
  publicPrivateBoundary: 'public-safe commitment only'
}));
const manifest = {
  id: config.id,
  version: config.version,
  generatedAt: now,
  scenario: scenarioObj,
  claimBoundary: config.boundary.claimBoundary,
  valueMoved: 0,
  noUserData: true,
  noWallet: true
};
const candidates = config.candidates.map(c => ({ ...c, evidenceRoot: `sha256:${digest({ c, scenarioObj }).slice(0, 32)}` }));
const traceLedger = { type: 'ActionReasonTraceLedger', scenario: scenarioObj.id, acceptedCandidate: reviewReady.id, steps: trace, valueMoved: 0 };
const claimLineage = { type: 'ClaimLineageMap', claims: ['mission-bound', 'source-supported', 'tool-scoped', 'contradiction-cleared', 'human-gated'].map((claim, i) => ({ id: `CL-${String(i+1).padStart(3,'0')}`, claim, status: 'supported', evidence: trace[Math.min(i, trace.length-1)].root })), valueMoved: 0 };
const toolScope = { type: 'ToolScopeLedger', allowed: ['public-safe source mapping', 'schema validation', 'browser-local replay'], blocked: ['private data ingestion','credential use','payment execution','wallet connection'], actual: ['claim map','contradiction pass','receipt pointer'], valueMoved: 0 };
const validatorReport = { type: 'ProcessValidatorReport', acceptedCandidate: 'C3', candidates: candidates.map(c => ({ id: c.id, status: c.status, reason: c.reason })), valueMoved: 0 };
const receipt = { type: 'ProcessEvidenceReceipt', candidateId: 'C3', status: 'REVIEW_READY_SYNTHETIC_PUBLIC_DEMO', receiptRoot: `sha256:${digest({ traceLedger, claimLineage, validatorReport }).slice(0, 48)}`, noUserData: true, valueMoved: 0 };
const readme = `# GoalOS Process-Resolved Evidence Lab artifact bundle\n\nScenario: ${scenarioObj.label}\n\nThis is a synthetic public-safe demo bundle. It contains no user data, no uploads, no wallet connection, no payment execution, and no value movement.\n\nCore rule: final output is not enough. Process-resolved evidence requires trace steps, claim lineage, tool scope, validator status, risk boundary, rollback pointers, and a receipt root.\n`;
const files = {
  '00_manifest.json': manifest,
  '01_candidates.json': candidates,
  '02_action_reason_trace_ledger.json': traceLedger,
  '03_claim_lineage_map.json': claimLineage,
  '04_tool_scope_ledger.json': toolScope,
  '05_process_validator_report.json': validatorReport,
  '06_process_evidence_receipt.json': receipt,
  'bundle-summary.json': { status: 'PASS', acceptedCandidate: 'C3', files: 8, valueMoved: 0, generatedAt: now }
};
for (const [name, data] of Object.entries(files)) fs.writeFileSync(path.join(outDir, name), JSON.stringify(data, null, 2));
fs.writeFileSync(path.join(outDir, 'README.md'), readme);
console.log(`GoalOS Process-Resolved Evidence Lab bundle generated at ${outDir}`);
