#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = process.cwd();
const out = path.join(root, 'artifacts', 'proof-settlement-lab');
const cfgPath = path.join(root, 'config', 'proof-settlement-lab.json');
const fallback = path.join(path.dirname(new URL(import.meta.url).pathname), '..', 'config', 'proof-settlement-lab.json');
const cfg = JSON.parse(fs.readFileSync(fs.existsSync(cfgPath) ? cfgPath : fallback, 'utf8'));
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });
const now = new Date().toISOString();
const h = v => crypto.createHash('sha256').update(typeof v === 'string' ? v : JSON.stringify(v)).digest('hex');
const write = (name,obj) => fs.writeFileSync(path.join(out,name), JSON.stringify(obj,null,2));
const proofBundle = s => {
 const ready = s.id === 'settlement-ready';
 const human = s.id === 'human-gated';
 const replay = ready || human;
 const quorum = ready || human;
 return {
  candidate:s.candidate,
  scenario:s.id,
  mission:s.mission,
  proofBundleHash:h(`${s.id}:proof-bundle`).slice(0,32),
  jobSpecHash:h(`${s.id}:job-spec`).slice(0,24),
  traceRoot: s.id === 'output-only' ? null : h(`${s.id}:trace`).slice(0,24),
  gates:{proofBundle:s.id!=='output-only', replay, validatorQuorum:quorum, challengeWindow:ready, riskBoundary:s.risk<35, humanAuthority:!human, noValueMoved:true},
  alphaWorkUnits:s.alphaWU,
  simulatedSettlement:ready?'READY_SIGNAL_ONLY':'NOT_READY',
  valueMoved:0
 };
};
const bundles = cfg.scenarios.map(proofBundle);
const manifest = { package:cfg.package, version:cfg.version, generatedAt:now, claimBoundary:cfg.doctrine.claimBoundary, publicSafety:cfg.publicSafety, contents:['00_manifest.json','01_job_specs.json','02_proof_bundles.json','03_commit_reveal_validator_record.json','04_alpha_work_unit_ledger.json','05_challenge_window_receipt.json','06_settlement_readiness_certificate.json','07_chronicle_entry.json','README.md'] };
const validator = { generatedAt:now, validators:['validator-a.synthetic','validator-b.synthetic','validator-c.synthetic'], records:bundles.map(b=>({candidate:b.candidate, commit:h(`${b.candidate}:commit`).slice(0,20), reveal:b.gates.validatorQuorum ? (b.gates.humanAuthority ? 'PASS' : 'HOLD_HUMAN_AUTHORITY') : 'NO_QUORUM', replay:b.gates.replay})) };
const ledger = { generatedAt:now, formula:'synthetic α-WU = difficulty × proof quality × replay pass × validator quorum × policy pass × risk adjustment', rows:bundles.map(b=>({candidate:b.candidate, alphaWorkUnits:b.alphaWorkUnits, valueMoved:0, settlement:b.simulatedSettlement})) };
const challenge = { generatedAt:now, rows:bundles.map(b=>({candidate:b.candidate, challengeWindowClear:b.gates.challengeWindow, simulatedSettlement:b.simulatedSettlement})) };
const cert = { generatedAt:now, selected:'C2', rule:'No ProofBundle, no settlement signal.', gatesRequired:cfg.gates, valueMoved:0, hash:null };
cert.hash = h(cert);
const chronicle = { generatedAt:now, accepted:'C2', warnings:['C1 replay gap','C3 human authority gate'], rejected:['C0 output-only'], lesson:'Economic consequence attaches to proof-cleared work, not persuasive output.', valueMoved:0 };
write('00_manifest.json', manifest);
write('01_job_specs.json', cfg.scenarios.map(s=>({candidate:s.candidate, scenario:s.id, mission:s.mission, risk:s.risk})));
write('02_proof_bundles.json', bundles);
write('03_commit_reveal_validator_record.json', validator);
write('04_alpha_work_unit_ledger.json', ledger);
write('05_challenge_window_receipt.json', challenge);
write('06_settlement_readiness_certificate.json', cert);
write('07_chronicle_entry.json', chronicle);
fs.writeFileSync(path.join(out,'README.md'), `# GoalOS Proof-to-Settlement Control Lab\n\nSynthetic public-safe artifact bundle. No wallet, no escrow, no payment, no custody, no Mainnet transaction, and no value moved.\n\nCore rule: **No ProofBundle, no settlement signal.**\n\nRun source page: proof-settlement-lab.html\n`);
console.log(`GoalOS proof-settlement lab bundle generated at ${out}`);
