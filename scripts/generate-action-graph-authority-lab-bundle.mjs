#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = process.cwd();
const out = process.env.GOALOS_ACTION_GRAPH_OUT || path.join(root, 'artifacts', 'action-graph-authority-lab');
const scenarioId = process.env.SCENARIO || process.argv[2] || 'research';
const cfgPath = path.join(root, 'config', 'action-graph-authority-lab.json');
const cfg = fs.existsSync(cfgPath) ? JSON.parse(fs.readFileSync(cfgPath, 'utf8')) : { version:'22.0.0', scenarios:[{id:'research',label:'AI research acceptance',objective:'Move work into scoped action graph.',decision:'review ready',risk:'medium',allowedActions:6,blockedActions:2}] };
const scenario = cfg.scenarios.find(s => s.id === scenarioId) || cfg.scenarios[0];
const now = new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');
const sha = value => crypto.createHash('sha256').update(typeof value === 'string' ? value : JSON.stringify(value)).digest('hex');
fs.mkdirSync(out, { recursive: true });
const actions = [
  { id:'A1', label:'Review Evidence Docket', status:'allowed', owner:'human reviewer', proof:'claims matrix + verifier report', rollback:'return to evidence gathering' },
  { id:'A2', label:'Request targeted changes', status:'allowed', owner:'mission owner', proof:'risk ledger + contradiction register', rollback:'preserve previous decision state' },
  { id:'A3', label:'Issue public-safe receipt', status:scenario.risk === 'high-impact' ? 'held' : 'allowed', owner:'receipt signer', proof:'redacted docket + public boundary', rollback:'revoke or supersede receipt' },
  { id:'A4', label:'Execute external action', status:'blocked', owner:'not delegated in browser demo', proof:'missing human authority', rollback:'blocked before action' },
  { id:'A5', label:'Admit capability pattern', status:scenario.allowedActions > 4 ? 'allowed' : 'held', owner:'Chronicle steward', proof:'DONE certificate + replay path', rollback:'downgrade capability to warning memory' },
  { id:'A6', label:'Settlement readiness note', status:'simulated', owner:'protocol reviewer', proof:'proof bundle + challenge window', rollback:'no settlement; valueMoved remains 0' }
];
const actionGraph = { actionGraphId:`GOALOS-ACTION-GRAPH-${scenario.id.toUpperCase()}-SYNTHETIC`, scenario:scenario.id, objective:scenario.objective, decision:scenario.decision, authority:'human final gate', nodes:actions, invariant:'No high-impact action without scope, trace, validator, human authority, and rollback.', valueMoved:0 };
const authorityGate = { authorityRequired:true, browserDemoAuthority:'none', blockedSurfaces:['payments','wallets','uploads','forms','external submissions','deployments','credential use'], valueMoved:0 };
const actionReasonTrace = actions.map((a,i)=>({index:i+1, actionId:a.id, action:a.label, status:a.status, reason:'Action must be justified by evidence and bounded by authority.', permissionScope:a.status === 'blocked' ? 'none' : 'public-safe review only', validatorStatus:a.status === 'blocked' ? 'blocked by authority gate' : 'synthetic pass; human final gate preserved', rollbackPointer:a.rollback, evidencePointer:`demo://evidence/${scenario.id}/${a.id}`, valueMoved:0}));
const rollbackMap = { lastKnownGoodState:'governed_decision_state_v0', rollbackTargets:actions.map(a=>({actionId:a.id,status:a.status,rollback:a.rollback})), monitoringCondition:'Unsupported claim, missing proof pointer, or authority failure returns to proof work.', valueMoved:0 };
const receipt = { receiptId:`GOALOS-ACTION-RECEIPT-${scenario.id.toUpperCase()}-SYNTHETIC`, issuedAt:now, actionGraphHash:sha(actionGraph), authorityGateHash:sha(authorityGate), rollbackMapHash:sha(rollbackMap), status:'ACTION_GRAPH_READY_FOR_HUMAN_REVIEW_SYNTHETIC', publicBoundary:'browser-local, no user data, no external action, no value moved', valueMoved:0 };
const manifest = { name:'GoalOS Action Graph & Human Authority Lab', version:cfg.version || '22.0.0', generatedAt:now, scenario:scenario.id, browserLocal:true, noUserData:true, valueMoved:0 };
const bundle = { manifest, actionGraph, authorityGate, actionReasonTrace, rollbackMap, receipt };
const files = {
  '00_manifest.json': manifest,
  '01_action_graph.json': actionGraph,
  '02_authority_gate.json': authorityGate,
  '03_action_reason_trace.json': actionReasonTrace,
  '04_rollback_map.json': rollbackMap,
  '05_receipt.json': receipt,
  'README.md': `# GoalOS Action Graph & Human Authority Lab\n\nScenario: ${scenario.label}\n\nThis public-safe artifact demonstrates proof-to-action control. It contains no user data and moves no value.\n\nCore rule: no high-impact action without scope, trace, validator, human authority, and rollback.\n`
};
for (const [name, value] of Object.entries(files)) fs.writeFileSync(path.join(out, name), typeof value === 'string' ? value : JSON.stringify(value, null, 2) + '\n');
console.log(`GoalOS Action Graph & Human Authority Lab bundle generated at ${out}`);
