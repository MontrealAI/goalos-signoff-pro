import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const OUT=path.join(process.cwd(),'artifacts/demo-proof-mission');
fs.mkdirSync(OUT,{recursive:true});
const now=new Date().toISOString();
function hash(o){return 'sha256:'+crypto.createHash('sha256').update(JSON.stringify(o)).digest('hex');}
const missionContract={id:'pm-ai-research-report-demo',title:'AI Research Report Acceptance',decisionToSupport:'Should the client accept this AI-assisted competitive analysis as delivered?',successCriteria:['Five competitors covered','Source list attached','Pricing comparison present','Limitations disclosed','Recommendation traceable to evidence'],failureCriteria:['Missing competitor coverage','Unmapped claims','Unsupported pricing claims','No human decision recorded'],riskClass:'commercial-review',reviewRequirement:'human acceptance required',contact:'info@quebec.ai',createdAt:now};
const claimsMatrix={missionId:missionContract.id,claims:[{claim:'Five competitors are covered',evidence:['report-sections-2-6','source-table'],status:'supported'},{claim:'Pricing comparison is ready for decision',evidence:['pricing-table','dated-source-links'],status:'requires-freshness-review'},{claim:'Recommendation follows from evidence',evidence:['decision-matrix','risk-ledger'],status:'supported-with-caveats'}]};
const riskLedger={missionId:missionContract.id,risks:[{risk:'Source freshness',severity:'medium',mitigation:'Reviewer checks dated links before acceptance'},{risk:'AI-generated synthesis may omit competitor nuance',severity:'medium',mitigation:'Preserve limitations and request changes if needed'},{risk:'Decision may be reused outside scope',severity:'low',mitigation:'Receipt states accepted version and decision context'}]};
const verifierReport={missionId:missionContract.id,checks:[{check:'required sections present',status:'pass'},{check:'claims mapped to evidence',status:'pass'},{check:'pricing freshness',status:'review'},{check:'limitations disclosed',status:'pass'}],recommendation:'ready-for-human-review'};
const decisionState={missionId:missionContract.id,decision:'REQUEST_CHANGES_READY_FOR_REVIEW',reviewer:'demo reviewer',rationale:'Core evidence is mapped; pricing freshness should be confirmed before acceptance.'};
const receipt={publicId:'GS-DEMO-RESEARCH-001',missionId:missionContract.id,issuedAt:now,decision:decisionState.decision,hashes:{missionContract:hash(missionContract),claimsMatrix:hash(claimsMatrix),riskLedger:hash(riskLedger),verifierReport:hash(verifierReport),decisionState:hash(decisionState)}};
const files={
 'mission-contract.json':missionContract,
 'claims-matrix.json':claimsMatrix,
 'risk-ledger.json':riskLedger,
 'verifier-report.json':verifierReport,
 'decision-state.json':decisionState,
 'mission-receipt.json':receipt,
 'README.md':`# Demo Proof Mission\n\nThis public-safe demo shows how a single AI-assisted deliverable becomes a mission contract, claims matrix, risk ledger, verifier report, decision state, and Mission Receipt. Contact: info@quebec.ai\n`
};
for(const [name,obj] of Object.entries(files)){ fs.writeFileSync(path.join(OUT,name), typeof obj==='string'?obj:JSON.stringify(obj,null,2)+'\n'); }
console.log('Demo Proof Mission generated at artifacts/demo-proof-mission');
