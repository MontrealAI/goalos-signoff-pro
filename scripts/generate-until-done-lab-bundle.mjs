#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = process.cwd();
const cfgPath = path.join(root, 'config', 'until-done-lab.json');
const cfg = fs.existsSync(cfgPath) ? JSON.parse(fs.readFileSync(cfgPath, 'utf8')) : { scenarios: [] };
const scenarioId = process.env.SCENARIO || process.env.GOALOS_SCENARIO || process.argv[2] || 'research';
const scenario = cfg.scenarios.find(s => s.id === scenarioId) || cfg.scenarios[0] || { id: 'research', label: 'AI research acceptance', objective: 'Public-safe synthetic objective', decision: 'Review decision', initialProofDebt: 42, finalProofDebt: 5 };
const out = path.join(root, 'artifacts', 'until-done-lab', scenario.id);
fs.mkdirSync(out, { recursive: true });
const sha = x => crypto.createHash('sha256').update(JSON.stringify(x)).digest('hex');
const now = new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');
const stages = [
  ['objective','Decision target declared',-3], ['mission_contract','Acceptance, evidence, risk, and authority fixed',-5], ['plan','Workstreams and proof requirements drafted',-4], ['claims_matrix','Claims separated from assumptions and non-claims',-5], ['evidence_gap','Missing support detected; loop triggered',2], ['evidence_docket','Evidence mapped to material claims',-11], ['contradiction_register','Contradictions surfaced and bounded',-4], ['verifier_mesh','Claims attacked by validators and negative checks',-5], ['risk_ledger','Residual risk, blocked actions, rollback recorded',-3], ['governed_decision_state','Accept/request changes/reject/escalate surface emitted',-2], ['action_graph','Next actions scoped with rollback obligations',-1], ['chronicle_entry','Only replayable accepted proof becomes memory',-1], ['done','DONE=true synthetic proof package ready',0]
];
let debt = scenario.initialProofDebt;
const proofDebtLedger = stages.map(([stage, purpose, delta], index) => {
  debt = Math.max(scenario.finalProofDebt, debt + delta);
  if (stage === 'done') debt = scenario.finalProofDebt;
  return { index:index+1, stage, purpose, proofDebt: debt };
});
const missionContract = { missionId:`GOALOS-UNTIL-DONE-${scenario.id.toUpperCase()}`, scenario:scenario.id, objective:scenario.objective, decisionToSupport:scenario.decision, requiredArtifacts:['mission_contract','claims_matrix','source_provenance','contradiction_register','evidence_docket','verifier_report','risk_ledger','decision_state','action_graph','chronicle_entry','claim_boundary_pass','qa_pass'], authority:'human final gate', noUserData:true, valueMoved:0 };
const claimsMatrix = [
  { claim:'The deliverable can be reviewed', evidence:'evidence_docket', status:'supported' },
  { claim:'All material claims have evidence or explicit uncertainty', evidence:'claims_matrix', status:'supported' },
  { claim:'The package is ready for final human decision', evidence:'verifier_report + risk_ledger', status:'bounded' }
];
const evidenceDocket = { manifest:'public-safe synthetic demo', claimsMatrixHash:sha(claimsMatrix), proofDebtLedgerHash:sha(proofDebtLedger), publicPrivateBoundary:'no private or user data present', replayPath:'browser-local deterministic demo' };
const verifierReport = { pass:true, gates:['artifact_presence','claim_support','contradiction_register','risk_ledger','rollback_path','human_authority','no_user_data'], failedGates:[], advisory:'synthetic demo only; not external audit' };
const riskLedger = { residualRisk: scenario.id === 'safety' ? 'medium - human escalation required' : 'low - review-ready synthetic package', blocked:['value movement','wallet connection','user upload','email gate'], rollback:'return to evidence collection on material claim drift' };
const decisionState = { status:'DONE_TRUE_SYNTHETIC_DEMO', recommendation:scenario.id === 'safety' ? 'escalate for human authority' : 'decision-review ready', proofDebtStart:scenario.initialProofDebt, proofDebtEnd:scenario.finalProofDebt, valueMoved:0 };
const actionGraph = { nodes:['review_docket','inspect_claims','review_risks','human_decision','issue_receipt'], edges:[['review_docket','inspect_claims'],['inspect_claims','review_risks'],['review_risks','human_decision'],['human_decision','issue_receipt']], rollback:'evidence_gap -> evidence_docket' };
const chronicleEntry = { id:`chronicle-${scenario.id}-until-done`, admitted:true, memoryRule:'accepted, replayable, claim-bounded proof only', capabilityPackage:`${scenario.id}-proof-to-decision-pattern`, valueMoved:0 };
const doneCertificate = { id:`GOALOS-DONE-${scenario.id.toUpperCase()}-SYNTHETIC`, issuedAt:now, status:'DONE=true synthetic browser-local demo', missionContractHash:sha(missionContract), evidenceDocketHash:sha(evidenceDocket), decisionStateHash:sha(decisionState), valueMoved:0 };
const manifest = { name:'GoalOS Until-DONE Mission Control Lab bundle', version:'21.0.0', scenario:scenario.id, generatedAt:now, browserLocal:true, noUserData:true, valueMoved:0 };
const files = { '00_manifest.json':manifest, '01_mission_contract.json':missionContract, '02_claims_matrix.json':claimsMatrix, '03_proof_debt_ledger.json':proofDebtLedger, '04_evidence_docket.json':evidenceDocket, '05_verifier_report.json':verifierReport, '06_risk_ledger.json':riskLedger, '07_decision_state.json':decisionState, '08_action_graph.json':actionGraph, '09_chronicle_entry.json':chronicleEntry, '10_done_certificate.json':doneCertificate };
for (const [file, data] of Object.entries(files)) fs.writeFileSync(path.join(out, file), JSON.stringify(data, null, 2));
fs.writeFileSync(path.join(out, 'README.md'), `# GoalOS Until-DONE Mission Control Lab\n\nScenario: ${scenario.label}\n\nThis public-safe synthetic artifact shows the GoalOS run-to-completion law: if evidence, contradiction handling, verifier report, risk ledger, action graph, Chronicle entry, or claim boundary is missing, the mission is not DONE.\n\nNo user data, no uploads, no wallet, no payment, no value moved.\n`);
console.log(`GoalOS Until-DONE bundle generated at ${out}`);
