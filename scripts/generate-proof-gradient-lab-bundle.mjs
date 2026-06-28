#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const ROOT = process.cwd();
const OUT = path.join(ROOT, 'artifacts', 'proof-gradient-lab');
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });
const hash = v => crypto.createHash('sha256').update(String(v)).digest('hex');
const writeJson = (name, obj) => fs.writeFileSync(path.join(OUT, name), JSON.stringify(obj, null, 2));

const candidates = [
  { id:'C0', title:'Persuasive output', status:'rejected', failed:['ProofValid','EvalPass','Risk <= rho','RollbackReady','CanaryReady','ScopeAuthorized','ChallengeCleared'] },
  { id:'C1', title:'Agent activity trace', status:'rejected', failed:['ProofValid','EvalPass','Risk <= rho','RollbackReady','CanaryReady','ScopeAuthorized','ChallengeCleared'] },
  { id:'C2', title:'Proof packet candidate', status:'held', failed:['RollbackReady','CanaryReady'] },
  { id:'C3', title:'Proof-carrying capability', status:'promoted', failed:[] }
];
const manifest = { schema:'goalos.proof_gradient_lab.bundle.v13', generatedAt:new Date().toISOString(), status:'public-safe synthetic artifact', dataBoundary:'No user data, no uploads, no wallet, no value moved', claimBoundary:'Synthetic demonstration of GoalOS selection gates; not external audit or empirical SOTA.' };
const selectionCertificate = { schema:'goalos.selection_certificate.v13.public_demo', selectedCandidate:'C3', candidates, hardGateRule:'Score is advisory; hard gates are mandatory.', certificateHash:hash(JSON.stringify(candidates)) };
const evidenceDocket = { schema:'goalos.evidence_docket_6_1.public_demo', manifest, claimsMatrix:[
  { claim:'Output alone is not institution-grade work.', evidence:'C0 rejected by proof gates' },
  { claim:'Agent activity is not proof.', evidence:'C1 rejected despite workflow activity' },
  { claim:'Rollback readiness matters.', evidence:'C2 held despite partial proof' },
  { claim:'Proof-carrying capability can evolve.', evidence:'C3 promoted after all hard gates clear' }
], selectionCertificate, replayPath:['Open proof-gradient-lab.html','Run Selection Gate','Download certificate','Inspect docket'] };
const evolutionLedgerEntry = { schema:'goalos.evolution_ledger_entry.v13.public_demo', type:'SelectionCertificate', candidateId:'C3', proofRoot:hash(JSON.stringify(selectionCertificate)), docketRoot:hash(JSON.stringify(evidenceDocket)), nextState:'canary_ready' };
writeJson('00_manifest.json', manifest);
writeJson('01_candidates.json', { candidates });
writeJson('02_selection_certificate.json', selectionCertificate);
writeJson('03_evidence_docket.json', evidenceDocket);
writeJson('04_evolution_ledger_entry.json', evolutionLedgerEntry);
fs.writeFileSync(path.join(OUT, 'README.md'), `# GoalOS Proof Gradient Selection Lab\n\nThis public-safe synthetic artifact demonstrates the core GoalOS idea: score is advisory; hard proof gates decide what may evolve.\n\nRun the public browser demo at proof-gradient-lab.html after deployment.\n\nNo user data. No uploads. No wallet. No value moved.\n`);
console.log(`GoalOS Proof Gradient Lab artifact generated at ${OUT}`);
