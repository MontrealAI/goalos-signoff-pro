#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = process.cwd();
const out = path.join(root, 'artifacts', 'sovereign-experience-stream-lab');
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });
const scenario = process.env.SCENARIO || process.argv[2] || 'research';
const now = new Date().toISOString();
const hash = v => crypto.createHash('sha256').update(typeof v === 'string' ? v : JSON.stringify(v)).digest('hex');
const events = [
  ['mission-contract','accepted'], ['bounded-action','accepted'], ['proof-packet','accepted'], ['validator-pass','accepted'], ['grounded-reward','accepted'], ['suspicious-trace','quarantined'], ['unsupported-claim','rejected'], ['delayed-outcome', scenario === 'software' || scenario === 'defensive' ? 'accepted' : 'quarantined'], ['policy-update','accepted'], ['temporal-option','accepted'], ['chronicle-write','accepted'], ['future-routing','accepted']
].map(([kind,verdict],i)=>({eventId:`EXP-${scenario.toUpperCase()}-${String(i+1).padStart(2,'0')}`, kind, verdict, replayable:verdict==='accepted', hash:hash(`${scenario}:${kind}:${verdict}`).slice(0,18)}));
const accepted = events.filter(e=>e.verdict==='accepted').length;
const quarantined = events.filter(e=>e.verdict==='quarantined').length;
const rejected = events.filter(e=>e.verdict==='rejected').length;
const manifest = { package:'GoalOS Sovereign Experience Stream Lab v15.2 demo bundle', generatedAt:now, scenario, publicSafety:{ noInputs:true, noUploads:true, noWallets:true, noValueMoved:true, noUserData:true }, files:['00_manifest.json','01_experience_stream.json','02_grounded_reward_ledger.json','03_temporal_option_registry.json','04_reanalyze_report.json','05_policy_update_certificate.json','README.md'] };
const stream = { scenario, events, counts:{accepted, quarantined, rejected}, rule:'Accepted replayable events may update future routing. Quarantined events remain warnings. Rejected events cannot become memory.' };
const reward = { scenario, signals:['validatorVerdict','replayability','riskReduction','proofDebtReduction','futureReuse','delayedOutcome'], accepted, quarantined, rejected, blockedSignals:['activity without proof','unsupported claim','private-only trace'] };
const options = { scenario, options:[{id:`option-${scenario}-proof-cycle-v2`, initiation:'mission requires governed acceptance', validator:'replay + claim boundary + risk ledger', termination:'receipt or human gate', evidenceEvents:events.filter(e=>e.verdict==='accepted').slice(0,5).map(e=>e.eventId)}] };
const reanalyze = { scenario, findings:['Output is not memory','Replay changes authority','Quarantine preserves warning without propagation','Options reduce future proof debt'] };
const certificate = { scenario, decision:'promote synthetic routing prior from accepted replayable experience only', gates:{proofValid:true,replayPass:true,quarantineRespected:true,noPrivateData:true,humanAuthorityPreserved:true}, notClaimed:['external audit','production certification','empirical SOTA','value movement'] };
function write(name,obj){fs.writeFileSync(path.join(out,name), typeof obj === 'string' ? obj : JSON.stringify(obj,null,2));}
write('00_manifest.json', manifest); write('01_experience_stream.json', stream); write('02_grounded_reward_ledger.json', reward); write('03_temporal_option_registry.json', options); write('04_reanalyze_report.json', reanalyze); write('05_policy_update_certificate.json', certificate); write('README.md', `# GoalOS Sovereign Experience Stream Lab\n\nScenario: ${scenario}\n\nThis synthetic public-safe bundle demonstrates the GoalOS learning boundary: accepted replayable experience may update future routing; quarantined experience remains warning material; rejected events never become institutional memory.\n\nNo user data, no uploads, no wallet, no value moved.\n`);
console.log(`GoalOS Sovereign Experience Stream Lab bundle generated at ${out}`);
