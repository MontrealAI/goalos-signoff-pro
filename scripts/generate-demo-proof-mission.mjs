import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const ROOT = process.cwd();
const OUT = path.join(ROOT, 'artifacts/demo-proof-mission');
fs.rmSync(OUT,{recursive:true,force:true}); fs.mkdirSync(OUT,{recursive:true});
function sha(obj){return 'sha256:'+crypto.createHash('sha256').update(JSON.stringify(obj,null,2)).digest('hex');}
const mission = {id:'proof-mission-demo-001',title:'AI Research Report Acceptance',decisionToSupport:'Should the client accept the AI-assisted market research report?',acceptanceCriteria:['Five competitors covered','Sources dated within twelve months','Pricing comparison attached','Risks and uncertainties disclosed','Final recommendation stated'],reviewer:'Designated human reviewer',contact:'info@quebec.ai'};
const claims = {claims:[{id:'C1',claim:'The report covers five competitors.',evidence:['E1'],status:'supported'},{id:'C2',claim:'Pricing comparison is current.',evidence:['E2'],status:'needs-human-confirmation'},{id:'C3',claim:'Risks are disclosed.',evidence:['E3'],status:'supported'}]};
const risk = {risks:[{id:'R1',risk:'Some price sources may change quickly.',mitigation:'Date-stamp source checks and request reviewer confirmation.'},{id:'R2',risk:'Recommendation depends on assumptions about target segment.',mitigation:'Surface assumptions in decision deck.'}]};
const verifier = {verdict:'ready-for-human-review',checks:['claim support','source freshness','contradiction scan','acceptance criteria completeness','risk disclosure'],openItems:['Reviewer should confirm pricing recency.']};
const decision = {state:'REQUEST_CHANGES_READY_FOR_REVIEW',allowedDecisions:['ACCEPT','REQUEST_CHANGES','REJECT','ESCALATE'],rationale:'Most criteria are supported; pricing recency requires reviewer confirmation.'};
const receipt = {publicId:'GS-DEMO-RESEARCH-001',title:mission.title,issuer:'GoalOS Signoff Pro Demo',issuedAt:new Date().toISOString(),decision:decision.state,hashes:{missionContract:sha(mission),claimsMatrix:sha(claims),riskLedger:sha(risk),verifierReport:sha(verifier),decisionState:sha(decision)}};
const files = {'mission-contract.json':mission,'claims-matrix.json':claims,'risk-ledger.json':risk,'verifier-report.json':verifier,'decision-state.json':decision,'mission-receipt.json':receipt,'evidence-docket.json':{manifest:mission,claims,risk,verifier,decision,receipt,replayPath:['Open mission contract','Inspect claims matrix','Review evidence hashes','Read risk ledger','Verify receipt']}};
for (const [name,obj] of Object.entries(files)) fs.writeFileSync(path.join(OUT,name), JSON.stringify(obj,null,2));
fs.writeFileSync(path.join(OUT,'README.md'), `# Demo Proof Mission\n\nThis public-safe demo package shows the GoalOS Signoff Pro proof mission shape.\n\nFiles:\n${Object.keys(files).map(f=>`- ${f}`).join('\n')}\n\nContact: info@quebec.ai\n`);
fs.writeFileSync(path.join(OUT,'public-report.html'), `<!doctype html><html><head><meta charset="utf-8"><title>Demo Proof Mission</title></head><body><h1>Demo Proof Mission</h1><p>Decision state: ${decision.state}</p><p>Receipt: ${receipt.publicId}</p></body></html>`);
console.log('Demo Proof Mission generated at artifacts/demo-proof-mission');
