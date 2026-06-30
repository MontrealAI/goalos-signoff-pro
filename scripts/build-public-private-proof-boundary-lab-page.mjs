#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = process.cwd();
const site = path.join(root, 'site');
const assets = path.join(site, 'assets');
const localCfg = path.join(root, 'config', 'public-private-proof-boundary-lab.json');
const fallbackCfg = path.join(path.dirname(new URL(import.meta.url).pathname), '..', 'config', 'public-private-proof-boundary-lab.json');
const cfg = JSON.parse(fs.readFileSync(fs.existsSync(localCfg) ? localCfg : fallbackCfg, 'utf8'));
fs.mkdirSync(assets, { recursive: true });
const now = new Date().toISOString();
const h = (v) => crypto.createHash('sha256').update(typeof v === 'string' ? v : JSON.stringify(v)).digest('hex');
const write = (rel, body) => { fs.mkdirSync(path.dirname(path.join(site, rel)), { recursive: true }); fs.writeFileSync(path.join(site, rel), body); };
const writeJson = (rel, obj) => write(rel, JSON.stringify(obj, null, 2));
const publicRule = 'No forms · no uploads · no cookies · no analytics · no wallets · no payments · no personal or confidential data.';

const boundaryRecord = (s) => {
  const privateManifest = s.privateArtifacts.map((name, i) => ({
    privateArtifact: `PRIVATE_${String(i + 1).padStart(2, '0')}`,
    class: name,
    publicHandling: 'withheld from public artifact',
    publicPointer: `hash:${h(`${s.id}:${name}:private`).slice(0, 24)}`,
    disclosure: 'not disclosed'
  }));
  const publicCommitments = s.publicArtifacts.map((name, i) => ({
    field: name,
    commitment: `0x${h(`${s.id}:${name}:public`).slice(0, 32)}`,
    purpose: ['claim support', 'verification', 'risk review', 'replay boundary'][i % 4]
  }));
  const redactionMap = privateManifest.map((row, i) => ({
    privateArtifact: row.privateArtifact,
    redactionAction: ['hash-only', 'summary-only', 'reason-code-only', 'withhold-private-appendix'][i % 4],
    publicField: publicCommitments[i % publicCommitments.length]?.field || 'claim boundary',
    leakCheck: 'PASS'
  }));
  const accepted = s.risk < 45;
  const decisionState = accepted ? 'PUBLIC_PROOF_READY' : 'HUMAN_GATE_REQUIRED';
  return {
    scenario: s.id,
    label: s.label,
    mission: s.mission,
    generatedAt: now,
    claimBoundary: cfg.doctrine.claimBoundary,
    publicPrivateBoundary: cfg.doctrine.rule,
    privateAppendixManifest: privateManifest,
    publicProofCommitments: publicCommitments,
    redactionMap,
    redactionMapHash: h(redactionMap),
    proofPacketHash: h(`${s.id}:proof-packet`).slice(0, 40),
    validatorAttestationHash: h(`${s.id}:validator-attestation`).slice(0, 40),
    proofLedgerCommitment: `0x${h(`${s.id}:proof-ledger-commitment`).slice(0, 40)}`,
    riskSummary: { index: s.risk, status: s.risk < 45 ? 'bounded' : 'escalated', publicLeakRisk: Math.max(1, 100 - s.redactionScore) },
    scores: { redactionScore: s.redactionScore, proofIntegrity: s.proofIntegrity, publicReadiness: s.publicReadiness },
    decisionState,
    replayPathStatus: accepted ? 'PUBLIC_SAFE_REPLAY_PATH_AVAILABLE' : 'REPLAY_PATH_HELD_FOR_SCOPED_REVIEW',
    valueMoved: 0,
    legalRailVersion: 'v12',
    allowedToPublish: accepted,
    blockedPublicFields: cfg.blockedPublicFields,
    requiredPublicFields: cfg.requiredPublicFields
  };
};

const records = Object.fromEntries(cfg.scenarios.map(s => [s.id, boundaryRecord(s)]));
const selected = records['research-acceptance'];
const publicProofCommitments = {
  title: 'GoalOS Public Proof Commitments',
  generatedAt: now,
  doctrine: cfg.doctrine.law,
  commitments: Object.values(records).map(r => ({ scenario: r.scenario, proofLedgerCommitment: r.proofLedgerCommitment, proofPacketHash: r.proofPacketHash, validatorAttestationHash: r.validatorAttestationHash, decisionState: r.decisionState }))
};
publicProofCommitments.hash = h(publicProofCommitments);
const privateAppendixManifest = {
  title: 'Private Appendix Manifest — Public-Safe',
  generatedAt: now,
  note: 'This manifest lists private classes and hashes only. It contains no private source material, no credentials, no prompts, no user data, and no unredacted content.',
  scenarios: Object.values(records).map(r => ({ scenario: r.scenario, privateAppendixManifest: r.privateAppendixManifest }))
};
privateAppendixManifest.hash = h(privateAppendixManifest);
const redactionMap = {
  title: 'GoalOS Boundary Redaction Map',
  generatedAt: now,
  invariant: 'Private execution stays private; public proof remains verifiable.',
  scenarios: Object.values(records).map(r => ({ scenario: r.scenario, redactionMap: r.redactionMap, redactionMapHash: r.redactionMapHash }))
};
redactionMap.hash = h(redactionMap);
const evidenceDocketBoundary = {
  title: 'Evidence Docket Boundary Record',
  generatedAt: now,
  selectedScenario: selected.scenario,
  manifest: {
    publicFields: cfg.requiredPublicFields,
    blockedPublicFields: cfg.blockedPublicFields,
    publicRule,
    route: cfg.route
  },
  record: selected
};
evidenceDocketBoundary.hash = h(evidenceDocketBoundary);
const proofLedgerCommitment = {
  title: 'Proof Ledger Commitment Set',
  generatedAt: now,
  rule: 'Do not put intelligence on-chain. Put proof of intelligence on-chain.',
  commitments: Object.values(records).map(r => ({ scenario: r.scenario, publicCommitment: r.proofLedgerCommitment, decisionState: r.decisionState, valueMoved: 0 }))
};
proofLedgerCommitment.hash = h(proofLedgerCommitment);
const demoBundle = {
  package: cfg.package,
  version: cfg.version,
  generatedAt: now,
  doctrine: cfg.doctrine,
  scenarios: cfg.scenarios,
  records,
  publicProofCommitments,
  privateAppendixManifest,
  redactionMap,
  evidenceDocketBoundary,
  proofLedgerCommitment,
  publicSafety: cfg.publicSafety
};
demoBundle.hash = h(demoBundle);

writeJson('proof-boundary-demo-bundle.json', demoBundle);
writeJson('public-proof-commitments.json', publicProofCommitments);
writeJson('private-appendix-manifest.json', privateAppendixManifest);
writeJson('redaction-map.json', redactionMap);
writeJson('evidence-docket-boundary.json', evidenceDocketBoundary);
writeJson('proof-ledger-commitment.json', proofLedgerCommitment);
writeJson(cfg.manifestRoute, {
  package: cfg.package,
  version: cfg.version,
  generatedAt: now,
  route: cfg.route,
  aliasRoute: cfg.aliasRoute,
  artifacts: ['proof-boundary-demo-bundle.json', 'public-proof-commitments.json', 'private-appendix-manifest.json', 'redaction-map.json', 'evidence-docket-boundary.json', 'proof-ledger-commitment.json'],
  publicSafety: cfg.publicSafety,
  claimBoundary: cfg.doctrine.claimBoundary
});

const css = `:root{--bg:#020807;--panel:rgba(14,31,29,.76);--panel2:rgba(4,12,14,.90);--line:rgba(115,255,221,.30);--line2:rgba(255,240,138,.34);--text:#fff8ec;--muted:#b9c8c5;--mint:#74ffdd;--aqua:#68eaff;--gold:#fff08a;--violet:#bfa8ff;--red:#ff7f9f;--ok:#7effbf;--r:28px}*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:radial-gradient(circle at 78% 14%,rgba(104,234,255,.23),transparent 34%),radial-gradient(circle at 22% 78%,rgba(151,118,255,.14),transparent 30%),linear-gradient(120deg,#020807,#061313 52%,#061121);color:var(--text);font-family:Inter,ui-sans-serif,system-ui,-apple-system,Segoe UI,Arial,sans-serif;overflow-x:hidden}body:before{content:"";position:fixed;inset:0;z-index:-2;background-image:linear-gradient(rgba(255,255,255,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.03) 1px,transparent 1px);background-size:84px 84px;mask-image:linear-gradient(to bottom,rgba(0,0,0,.96),rgba(0,0,0,.22))}#field{position:fixed;inset:0;z-index:-1;opacity:.58}.topbar{min-height:88px;padding:18px clamp(20px,5vw,72px);display:flex;gap:20px;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:10;background:rgba(1,7,8,.92);border-bottom:1px solid var(--line);backdrop-filter:blur(18px)}.brand{display:flex;gap:14px;align-items:center;color:var(--text);text-decoration:none;text-transform:uppercase;letter-spacing:.18em;font-size:12px;font-weight:900}.brand small{display:block;color:var(--muted);font-size:10px;margin-top:4px}.orb{width:42px;height:42px;border-radius:14px;border:1px solid var(--line);background:radial-gradient(circle,var(--mint),#2a4f78 48%,#061110 70%);box-shadow:0 0 32px rgba(113,255,220,.42)}nav{display:flex;gap:8px;flex-wrap:wrap;align-items:center}nav a{color:var(--text);font-weight:950;text-decoration:none;font-size:13px;padding:10px 12px;border-radius:999px}nav a[aria-current="page"],nav a:hover{background:rgba(255,255,255,.12);box-shadow:inset 0 0 0 1px rgba(255,255,255,.14)}main{width:min(1180px,calc(100% - 34px));margin:auto}.hero{min-height:calc(100vh - 88px);display:grid;grid-template-columns:minmax(0,1.05fr) minmax(370px,.95fr);gap:clamp(34px,7vw,88px);align-items:center;padding:clamp(70px,10vw,142px) 0}.eyebrow{color:var(--mint);letter-spacing:.38em;text-transform:uppercase;font-weight:950;font-size:12px;margin:0 0 18px}.hero h1,.section h2,.lab h2{font-size:clamp(52px,8vw,108px);line-height:.88;letter-spacing:-.075em;margin:0 0 24px}.hero h1 em{display:block;font-family:Georgia,serif;font-style:italic;font-weight:500;letter-spacing:-.05em;background:linear-gradient(90deg,var(--gold),var(--mint),var(--aqua),var(--violet));-webkit-background-clip:text;color:transparent}.lead{font-size:clamp(18px,2vw,23px);line-height:1.48;color:#edf8f5;max-width:780px}.cta{display:flex;gap:12px;flex-wrap:wrap;align-items:center;margin:28px 0}.btn,button{border:0;border-radius:999px;padding:15px 22px;font-weight:950;color:var(--text);background:rgba(255,255,255,.13);box-shadow:inset 0 0 0 1px rgba(255,255,255,.18);text-decoration:none;cursor:pointer}.primary{color:#04100d;background:linear-gradient(100deg,var(--gold),var(--mint),var(--aqua));box-shadow:0 0 28px rgba(113,255,220,.35)}.chips{display:flex;gap:10px;flex-wrap:wrap}.chip{border:1px solid var(--line);border-radius:999px;padding:9px 13px;text-transform:uppercase;letter-spacing:.13em;color:#c9fff1;font-weight:900;font-size:11px;background:rgba(1,10,12,.5)}.panel{border:1px solid var(--line);border-radius:var(--r);background:linear-gradient(135deg,rgba(255,255,255,.12),rgba(255,255,255,.045));box-shadow:0 24px 90px rgba(0,0,0,.44),inset 0 0 0 1px rgba(255,255,255,.05);backdrop-filter:blur(18px)}.boundary-card{padding:28px;min-height:540px;position:relative;overflow:hidden}.card-head{display:flex;justify-content:space-between;gap:20px;text-transform:uppercase;letter-spacing:.24em;color:#bfffee;font-size:12px;font-weight:950;margin-bottom:24px}.boundary-stage{position:relative;min-height:360px;border-radius:24px;background:radial-gradient(circle at 52% 48%,rgba(116,255,221,.38),transparent 22%),rgba(0,8,10,.55);border:1px solid rgba(255,255,255,.1);overflow:hidden}.core{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:134px;height:134px;border-radius:50%;display:grid;place-items:center;background:radial-gradient(circle,var(--gold),var(--mint) 45%,var(--aqua));color:#03110d;font-family:Georgia,serif;font-size:70px;box-shadow:0 0 70px rgba(116,255,221,.55)}.lane{position:absolute;width:180px;border:1px solid var(--line);border-radius:18px;background:rgba(3,14,15,.84);padding:16px;transition:.35s transform,.35s box-shadow}.lane b{display:block;color:var(--gold);font-size:12px;text-transform:uppercase;letter-spacing:.15em}.lane strong{display:block;font-size:17px;margin:6px 0}.lane span{display:block;color:var(--muted);font-size:12px;line-height:1.36}.lane[data-i="0"]{left:22px;top:34px}.lane[data-i="1"]{right:24px;top:54px}.lane[data-i="2"]{left:32px;bottom:42px}.lane[data-i="3"]{right:28px;bottom:34px}.lane.active{transform:translateY(-8px);box-shadow:0 0 36px rgba(116,255,221,.22),inset 0 0 0 1px var(--mint)}.flow-line{position:absolute;inset:0;background:conic-gradient(from 0deg at 50% 50%,transparent 0 14%,rgba(116,255,221,.5) 15%,transparent 17% 39%,rgba(255,240,138,.48) 40%,transparent 43% 64%,rgba(104,234,255,.42) 65%,transparent 68% 89%,rgba(191,168,255,.42) 90%,transparent 93%);filter:blur(10px);opacity:.55;animation:spin 15s linear infinite}.kpis{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:18px}.kpis article,.metric{border:1px solid rgba(255,255,255,.14);border-radius:18px;padding:16px;background:rgba(255,255,255,.06)}.kpis b,.metric b{display:block;color:var(--gold);font-size:26px}.kpis span,.metric span{text-transform:uppercase;letter-spacing:.14em;color:var(--muted);font-size:10px;font-weight:900}.section,.lab{padding:clamp(80px,12vw,150px) 0;border-top:1px solid rgba(255,255,255,.08)}.section-head{display:grid;grid-template-columns:1fr minmax(280px,430px);gap:32px;align-items:end;margin-bottom:34px}.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}.card{border:1px solid rgba(255,255,255,.13);border-radius:24px;padding:28px;background:rgba(255,255,255,.07)}.card h3{font-size:clamp(28px,4vw,46px);line-height:.94;letter-spacing:-.055em;margin:0 0 16px}.card p{color:var(--muted);font-size:16px;line-height:1.55}.lab-grid{display:grid;grid-template-columns:minmax(0,.92fr) minmax(380px,1.08fr);gap:28px}.scenario-grid{display:grid;gap:12px}.scenario{width:100%;text-align:left;border-radius:20px;padding:18px 18px;box-shadow:inset 0 0 0 1px rgba(255,255,255,.12);background:rgba(255,255,255,.07)}.scenario small{display:block;text-transform:uppercase;letter-spacing:.16em;color:var(--mint);font-weight:950;font-size:10px}.scenario strong{display:block;font-size:21px;margin:6px 0}.scenario span{color:var(--muted);line-height:1.42}.scenario.active{background:linear-gradient(135deg,rgba(116,255,221,.2),rgba(255,240,138,.09));box-shadow:inset 0 0 0 1px var(--mint),0 0 28px rgba(116,255,221,.18)}.metrics{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin:18px 0}.trace{min-height:186px;border-radius:20px;padding:18px;background:rgba(0,6,8,.78);border:1px solid rgba(116,255,221,.24);font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;color:#c9fff0;line-height:1.55}.trace div{opacity:.9}.tabs{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px}.tab.active{background:linear-gradient(100deg,rgba(255,240,138,.32),rgba(116,255,221,.27));box-shadow:inset 0 0 0 1px var(--mint)}.stage-board{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin-bottom:14px}.stage{border:1px solid rgba(255,255,255,.12);border-radius:18px;padding:16px;background:rgba(255,255,255,.06)}.stage.ok{border-color:rgba(126,255,191,.55)}.stage.hold{border-color:rgba(255,211,110,.55)}.stage.private{border-color:rgba(255,127,159,.5)}.stage b{display:block;color:var(--gold);margin-bottom:5px}.code{min-height:360px;overflow:auto;border-radius:22px;padding:22px;background:rgba(0,6,8,.82);border:1px solid rgba(255,255,255,.12);color:#d6fff5;line-height:1.45}.artifacts{display:grid;grid-template-columns:repeat(2,1fr);gap:14px}.artifact{display:block;border:1px solid rgba(255,255,255,.13);border-radius:18px;padding:18px;text-decoration:none;color:var(--text);background:rgba(255,255,255,.07)}.artifact b{display:block;color:var(--mint);margin-bottom:6px}.artifact span{color:var(--muted)}footer{border-top:1px solid rgba(255,255,255,.12);padding:52px clamp(20px,5vw,72px);display:flex;justify-content:space-between;gap:30px;background:rgba(1,5,6,.82)}footer p{color:var(--muted)}.legal-rail{width:min(1180px,calc(100% - 34px));margin:0 auto 36px;border:1px solid var(--line);border-radius:999px;padding:15px 22px;text-align:center;background:rgba(0,7,8,.88);box-shadow:0 0 34px rgba(116,255,221,.16);font-size:13px;color:#d8fff5}.legal-rail b{color:var(--gold);margin-right:8px}@keyframes spin{to{transform:rotate(360deg)}}@media(max-width:980px){.hero,.section-head,.lab-grid{grid-template-columns:1fr}.grid,.artifacts{grid-template-columns:1fr}.metrics,.kpis{grid-template-columns:repeat(2,1fr)}.topbar{position:relative}nav{justify-content:flex-start}.boundary-card{min-height:620px}.boundary-stage{min-height:440px}}@media(max-width:600px){.hero h1,.section h2,.lab h2{font-size:48px}.metrics,.stage-board{grid-template-columns:1fr}.lane{position:relative;left:auto!important;right:auto!important;top:auto!important;bottom:auto!important;width:auto;margin:10px}.boundary-stage{padding:14px;display:grid;align-content:end}.core{position:relative;left:auto;top:auto;transform:none;margin:110px auto 20px}.flow-line{display:none}footer{display:block}.legal-rail{border-radius:24px}}`;
write('assets/public-private-proof-boundary-lab-v17.css', css);

const js = `const DATA=${JSON.stringify({ records, demoBundle }, null, 0)};
const qs=(s,r=document)=>r.querySelector(s); const qsa=(s,r=document)=>Array.from(r.querySelectorAll(s));
let active='research-acceptance'; let panel='public'; let running=false;
const panels={ public:'publicProofCommitments', private:'privateAppendixManifest', redaction:'redactionMap', docket:'evidenceDocketBoundary', ledger:'proofLedgerCommitment', bundle:'demoBundle' };
function current(){return DATA.records[active]}
function printTrace(lines){const t=qs('[data-trace]');t.innerHTML=lines.map((l,i)=>'<div>'+String(i+1).padStart(2,'0')+'. '+l+'</div>').join('')}
function metrics(){const r=current(); qs('[data-metric="redaction"] b').textContent=r.scores.redactionScore+'%'; qs('[data-metric="integrity"] b').textContent=r.scores.proofIntegrity+'%'; qs('[data-metric="risk"] b').textContent=r.riskSummary.index; qs('[data-metric="state"] b').textContent=r.decisionState.replace('PUBLIC_PROOF_READY','READY').replace('HUMAN_GATE_REQUIRED','HELD')}
function board(){const r=current(); const rows=[['PRIVATE','Raw material withheld',r.privateAppendixManifest.length+' private classes','private'],['BOUNDARY','Redaction map emitted',r.redactionMapHash.slice(0,16)+'…','ok'],['PUBLIC','Proof commitments emitted',r.publicProofCommitments.length+' public commitments','ok'],['GATED',r.decisionState,r.replayPathStatus,r.allowedToPublish?'ok':'hold']]; qs('[data-board]').innerHTML=rows.map(x=>'<article class="stage '+x[3]+'"><b>'+x[0]+'</b><strong>'+x[1]+'</strong><span>'+x[2]+'</span></article>').join('')}
function jsonPanel(){let obj; if(panel==='bundle') obj=DATA.demoBundle; else obj=DATA.demoBundle[panels[panel]]; qs('[data-panel-title]').textContent={public:'Public proof commitments',private:'Private appendix manifest',redaction:'Redaction map',docket:'Evidence Docket boundary',ledger:'Proof Ledger commitment',bundle:'Full demo bundle'}[panel]; qs('[data-panel-json]').textContent=JSON.stringify(obj,null,2)}
function render(){qsa('.scenario').forEach(b=>b.classList.toggle('active',b.dataset.scenario===active)); qsa('.tab').forEach(b=>b.classList.toggle('active',b.dataset.panel===panel)); qsa('.lane').forEach((l,i)=>l.classList.toggle('active', i===({private:0,redaction:1,public:2,ledger:3,bundle:3,docket:3}[panel]||0))); metrics(); board(); jsonPanel(); const r=current(); printTrace(['Scenario loaded: '+r.label,'Private appendix classified; raw content withheld.','Redaction map hash: '+r.redactionMapHash.slice(0,18)+'…','Public proof commitments emitted: '+r.publicProofCommitments.length,'Decision state: '+r.decisionState,'. Value moved: 0.'])}
function run(){if(running)return; running=true; const r=current(); const steps=['Mission contract read.','Private execution classified.','Blocked public fields checked: '+r.blockedPublicFields.length+'.','Redaction actions applied.','Public commitments generated.','Validator attestation hash linked.','Risk summary computed.','Decision state emitted: '+r.decisionState+'.']; let i=0; const tick=()=>{printTrace(steps.slice(0,i+1)); qsa('.lane').forEach((l,k)=>l.classList.toggle('active', k===Math.min(3,Math.floor(i/2)))); i++; if(i<steps.length) setTimeout(tick,360); else running=false}; tick()}
function download(){const blob=new Blob([JSON.stringify(DATA.demoBundle,null,2)],{type:'application/json'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='goalos-public-private-proof-boundary-demo-bundle.json'; a.click(); setTimeout(()=>URL.revokeObjectURL(a.href),500)}
qsa('.scenario').forEach(b=>b.addEventListener('click',()=>{active=b.dataset.scenario;render()})); qsa('.tab').forEach(b=>b.addEventListener('click',()=>{panel=b.dataset.panel;render()})); qs('[data-run]').addEventListener('click',run); qs('[data-reset]').addEventListener('click',render); qs('[data-download]').addEventListener('click',download); render();`;
write('assets/public-private-proof-boundary-lab-v17.js', js);

const desiredNav = [
  ['Institution','index.html'], ['Browser beta','browser-beta.html'], ['Mission 001','mission-001.html'], ['Selection gate','proof-gradient-lab.html'], ['Compounding','capability-compounding-lab.html'], ['Experience','sovereign-experience-stream-lab.html'], ['Settlement','proof-settlement-lab.html'], ['Proof boundary',cfg.route], ['Docket','evidence-docket-demo.html'], ['Verifier','verify.html'], ['$AGIALPHA','agialpha-token-boundary.html'], ['Data posture','no-user-data.html']
];
const nav = desiredNav.filter(([,href]) => href === cfg.route || fs.existsSync(path.join(site, href)) || ['index.html','browser-beta.html','evidence-docket-demo.html','verify.html','no-user-data.html','agialpha-token-boundary.html'].includes(href));
const navHtml = nav.map(([label,href]) => `<a href="${href}"${href===cfg.route?' aria-current="page"':''}>${label}</a>`).join('');
const footer = `<footer class="footer"><div><strong>GoalOS Signoff Pro</strong><p>Proof-to-acceptance · evidence dockets · private execution boundary · public proof commitments.</p></div><nav><a href="privacy.html">Privacy</a><a href="terms.html">Terms</a><a href="no-user-data.html">No User Data</a><a href="agialpha-token-boundary.html">$AGIALPHA Boundary</a></nav></footer><div class="legal-rail site-rule" data-goalos-legal-rail="v12"><b>Public site rule</b> ${publicRule}</div>`;
const lanesHtml = cfg.lanes.map((l,i)=>`<article class="lane" data-i="${i}"><b>${l.status}</b><strong>${l.label}</strong><span>${l.description}</span></article>`).join('');
const scenariosHtml = cfg.scenarios.map((s,i)=>`<button class="scenario ${i===0?'active':''}" data-scenario="${s.id}"><small>${s.id.replace(/-/g,' ')}</small><strong>${s.label}</strong><span>${s.mission}</span></button>`).join('');
const artifactsHtml = ['proof-boundary-demo-bundle.json','public-proof-commitments.json','private-appendix-manifest.json','redaction-map.json','evidence-docket-boundary.json','proof-ledger-commitment.json'].map(f=>`<a class="artifact" href="${f}"><b>${f}</b><span>Public-safe synthetic proof-boundary artifact</span></a>`).join('');
const page = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>GoalOS Public-Private Proof Boundary Lab</title><meta name="description" content="A browser-local GoalOS demo: private intelligence stays private; public proof remains verifiable."><link rel="stylesheet" href="assets/public-private-proof-boundary-lab-v17.css"></head><body><canvas id="field" aria-hidden="true"></canvas><header class="topbar"><a class="brand" href="index.html"><span class="orb"></span><span>GoalOS Signoff Pro<small>Public-private proof boundary lab</small></span></a><nav>${navHtml}</nav></header><main><section class="hero"><div><p class="eyebrow">Public proof / private intelligence</p><h1>Do not publish private intelligence. <em>Publish proof commitments.</em></h1><p class="lead">This browser-local lab demonstrates the GoalOS proof boundary: raw execution, prompts, traces, customer files, credentials, and privileged notes remain private; the public site receives only hashes, summaries, attestations, redaction maps, risk summaries, and claim boundaries.</p><div class="cta"><a class="btn primary" href="#lab">Run boundary pass</a><a class="btn" href="evidence-docket-demo.html">Inspect Evidence Docket</a><a class="btn" href="proof-ledger-commitment.json">Open proof commitment</a></div><div class="chips">${['browser-local','no data collection','hash commitments','private appendix withheld','public proof only'].map(x=>`<span class="chip">${x}</span>`).join('')}</div></div><div class="panel boundary-card"><div class="card-head"><span>Proof-boundary console</span><span>review mode</span></div><div class="boundary-stage"><div class="flow-line"></div><div class="core">α</div>${lanesHtml}</div><div class="kpis"><article><b>0</b><span>private values exposed</span></article><article><b>6</b><span>public artifacts</span></article><article><b>v12</b><span>legal rail</span></article></div></div></section>
<section class="section"><div class="section-head"><div><p class="eyebrow">The boundary law</p><h2>A proof page is not a leak.</h2></div><p class="lead">GoalOS separates public accountability from private execution. A reviewer can inspect commitments, attestations, risk summaries, and claim boundaries without exposing the sensitive material that produced the work.</p></div><div class="grid"><article class="card"><h3>Private execution stays scoped.</h3><p>Raw traces, prompts, enterprise documents, privileged notes, and sensitive tool outputs stay outside the public artifact.</p></article><article class="card"><h3>Public proof stays verifiable.</h3><p>Hashes, roots, attestations, risk summaries, policy roots, and decision states create enough structure to coordinate trust.</p></article><article class="card"><h3>Claims remain bounded.</h3><p>The public page says what passed, what failed, what was withheld, and why the proof boundary exists.</p></article></div></section>
<section class="lab" id="lab"><div class="section-head"><div><p class="eyebrow">Browser-local lab</p><h2>Run the boundary pass.</h2></div><p class="lead">Choose a scenario. The lab classifies private material, emits redaction decisions, writes public proof commitments, and decides whether the public-safe Evidence Docket can be published.</p></div><div class="lab-grid"><div><div class="scenario-grid">${scenariosHtml}</div><div class="cta"><button class="primary" data-run>Run boundary pass</button><button data-reset>Reset</button><button data-download>Download demo bundle</button></div><div class="metrics"><article class="metric" data-metric="redaction"><b>0%</b><span>redaction score</span></article><article class="metric" data-metric="integrity"><b>0%</b><span>proof integrity</span></article><article class="metric" data-metric="risk"><b>0</b><span>risk index</span></article><article class="metric" data-metric="state"><b>—</b><span>decision state</span></article></div><div class="trace" data-trace></div></div><div><div class="tabs"><button class="tab active" data-panel="public">Public proof</button><button class="tab" data-panel="private">Private manifest</button><button class="tab" data-panel="redaction">Redaction</button><button class="tab" data-panel="docket">Docket</button><button class="tab" data-panel="ledger">Ledger</button><button class="tab" data-panel="bundle">Bundle</button></div><h3 data-panel-title>Public proof commitments</h3><div class="stage-board" data-board></div><pre class="code" data-panel-json>{}</pre></div></div></section>
<section class="section"><div class="section-head"><div><p class="eyebrow">Public artifacts</p><h2>Inspect the safe proof surface.</h2></div><p class="lead">The lab emits a public-safe bundle, proof commitments, a private appendix manifest, redaction map, Evidence Docket boundary, and Proof Ledger commitment. The manifest describes withheld classes without disclosing private content.</p></div><div class="artifacts">${artifactsHtml}</div></section>
<section class="section"><div class="section-head"><div><p class="eyebrow">Claim boundary</p><h2>Proof without exposure.</h2></div><p class="lead">This page is a synthetic browser-local demonstration. It has no forms, no input boxes, no uploads, no wallet connection, no analytics, no cookies, no payments, no personal data, no confidential data, and no value movement.</p></div><div class="grid"><article class="card"><h3>No raw traces.</h3><p>The public artifact shows only commitments, summaries, and reason codes; raw private content is deliberately absent.</p></article><article class="card"><h3>No self-authorizing proof.</h3><p>Public readiness still depends on redaction, validator attestation, risk state, replay boundary, and human authority when required.</p></article><article class="card"><h3>No data request.</h3><p>Users do not type, paste, submit, upload, connect, or identify themselves to use the demo.</p></article></div></section></main>${footer}<script src="assets/public-private-proof-boundary-lab-v17.js"></script><script>(()=>{const c=document.getElementById('field'),x=c.getContext('2d');let w,h,p=[];function r(){w=c.width=innerWidth;h=c.height=innerHeight;p=Array.from({length:98},()=>({x:Math.random()*w,y:Math.random()*h,vx:(Math.random()-.5)*.24,vy:(Math.random()-.5)*.24}))}function a(){x.clearRect(0,0,w,h);p.forEach((q,i)=>{q.x=(q.x+q.vx+w)%w;q.y=(q.y+q.vy+h)%h;x.fillStyle=i%4?'rgba(117,255,221,.76)':'rgba(255,240,138,.86)';x.fillRect(q.x,q.y,2,2);for(let j=i+1;j<p.length;j++){const d=Math.hypot(q.x-p[j].x,q.y-p[j].y);if(d<112){x.strokeStyle='rgba(117,255,221,'+(0.18-d/720)+')';x.beginPath();x.moveTo(q.x,q.y);x.lineTo(p[j].x,p[j].y);x.stroke()}}});requestAnimationFrame(a)}addEventListener('resize',r);r();a()})()</script></body></html>`;
write(cfg.route, page);
write(cfg.aliasRoute, page);

function injectHomeRail(){
  const idx = path.join(site, 'index.html');
  const rail = `<section class="section" data-goalos-module="GOALOS-PUBLIC-PRIVATE-BOUNDARY-HOME-RAIL"><div class="section-head"><div><p class="eyebrow">Public proof / private intelligence</p><h2>A proof page is not a leak.</h2></div><p class="lead">Run the browser-local Proof Boundary Lab: private execution stays private while public proof commitments, redaction maps, attestations, and claim boundaries remain inspectable.</p></div><div class="cta"><a class="btn primary" href="${cfg.route}">Open Proof Boundary Lab</a><a class="btn" href="public-proof-commitments.json">Inspect commitments</a></div></section>`;
  if (!fs.existsSync(idx)) { write('index.html', `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>GoalOS Signoff Pro</title><link rel="stylesheet" href="assets/public-private-proof-boundary-lab-v17.css"></head><body><main>${rail}</main>${footer}</body></html>`); return; }
  let s = fs.readFileSync(idx, 'utf8');
  if (s.includes('GOALOS-PUBLIC-PRIVATE-BOUNDARY-HOME-RAIL')) return;
  const pos = s.indexOf('<footer');
  s = pos >= 0 ? s.slice(0, pos) + rail + s.slice(pos) : s + rail;
  fs.writeFileSync(idx, s);
}
injectHomeRail();
console.log(`GoalOS Public-Private Proof Boundary Lab v${cfg.version} generated ${cfg.route} and ${cfg.aliasRoute}`);
