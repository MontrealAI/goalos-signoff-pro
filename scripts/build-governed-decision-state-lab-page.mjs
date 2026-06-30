#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = process.cwd();
const site = path.join(root, 'site');
const assets = path.join(site, 'assets');
const localCfg = path.join(root, 'config', 'governed-decision-state-lab.json');
const fallbackCfg = path.join(path.dirname(new URL(import.meta.url).pathname), '..', 'config', 'governed-decision-state-lab.json');
const cfg = JSON.parse(fs.readFileSync(fs.existsSync(localCfg) ? localCfg : fallbackCfg, 'utf8'));
fs.mkdirSync(assets, { recursive: true });
const now = new Date().toISOString();
const sha = (v) => crypto.createHash('sha256').update(typeof v === 'string' ? v : JSON.stringify(v)).digest('hex');
const write = (rel, body) => { const p = path.join(site, rel); fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, body); };
const writeJson = (rel, obj) => write(rel, JSON.stringify(obj, null, 2));
const esc = (s) => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const publicRule = 'No forms · no uploads · no cookies · no analytics · no wallets · no payments · no personal or confidential data.';

function decisionRecord(s){
  const proofIntegrity = Math.max(0, Math.min(100, Math.round((s.evidence / Math.max(1, s.claims*2)) * 100 + (s.contradictions ? 8 : 0))));
  const contradictionCoverage = Math.max(0, Math.min(100, 100 - s.contradictions * 11));
  const riskScore = Math.max(0, Math.min(100, 100 - s.risk));
  const readiness = Math.round((proofIntegrity * .32) + (contradictionCoverage * .18) + (riskScore * .25) + (s.actionability * .25));
  const outcome = s.outcome;
  const certificate = {
    certificateId: 'GDS-' + sha(`${s.id}:${now}`).slice(0, 12).toUpperCase(),
    scenario: s.id,
    outcome,
    readiness,
    authority: s.authority,
    valueMoved: 0,
    legalRailVersion: 'v12',
    replayPath: `browser-local://${s.id}/decision-state`,
    claimBoundary: cfg.doctrine.claimBoundary,
    hashes: {
      missionContractHash: sha(`${s.id}:mission-contract`).slice(0, 32),
      claimsMatrixHash: sha(`${s.id}:claims-matrix:${s.claims}`).slice(0, 32),
      evidenceDocketHash: sha(`${s.id}:evidence:${s.evidence}`).slice(0, 32),
      verifierReportHash: sha(`${s.id}:verifier`).slice(0, 32),
      riskLedgerHash: sha(`${s.id}:risk:${s.risk}`).slice(0, 32),
      actionGraphHash: sha(`${s.id}:action-graph`).slice(0, 32)
    },
    gates: cfg.decisionGates.map((name, i) => ({ gate: name, status: (outcome === 'ESCALATE' && i > 5) ? 'HUMAN_GATE_REQUIRED' : 'PASS' }))
  };
  const claimsMatrix = Array.from({ length: s.claims }, (_, i) => ({
    claimId: `CL-${String(i+1).padStart(2,'0')}`,
    claim: ['scope', 'evidence', 'baseline', 'risk', 'decision', 'action', 'replay', 'reuse', 'boundary'][i % 9] + ' claim',
    support: i < Math.min(s.claims, Math.floor(s.evidence / 2)) ? 'supported' : 'needs more evidence',
    evidenceRefs: [`EV-${String(i*2+1).padStart(2,'0')}`, `EV-${String(i*2+2).padStart(2,'0')}`],
    boundary: 'public-safe synthetic demo claim'
  }));
  const contradictions = Array.from({ length: s.contradictions }, (_, i) => ({
    contradictionId: `CX-${String(i+1).padStart(2,'0')}`,
    issue: ['source disagreement', 'freshness uncertainty', 'scope ambiguity', 'cost assumption'][i % 4],
    status: outcome.includes('ACCEPT') ? 'resolved or bounded' : 'requires reviewer decision',
    effect: outcome === 'ESCALATE' ? 'blocks automatic acceptance' : 'included in decision boundary'
  }));
  const actionGraph = {
    graphId: 'AG-' + sha(`${s.id}:graph`).slice(0, 10),
    decisionState: outcome,
    nodes: [
      { id:'A1', label:'Accept boundary', owner:'human reviewer', status: outcome.includes('ACCEPT') ? 'ready' : 'blocked' },
      { id:'A2', label:'Request changes', owner:'delivery team', status: outcome === 'REQUEST_CHANGES' ? 'ready' : 'optional' },
      { id:'A3', label:'Escalate', owner:'authority gate', status: outcome === 'ESCALATE' ? 'required' : 'not required' },
      { id:'A4', label:'Issue receipt', owner:'GoalOS demo', status: outcome.includes('ACCEPT') ? 'ready' : 'held' },
      { id:'A5', label:'Chronicle entry', owner:'institutional memory', status: outcome.includes('ACCEPT') ? 'ready' : 'held' }
    ],
    edges: [['A1','A4'],['A2','A1'],['A3','A2'],['A4','A5']]
  };
  return {
    scenario: s.id,
    label: s.label,
    mission: s.mission,
    generatedAt: now,
    governedDecisionState: {
      objective: s.mission,
      missionContract: { status:'committed', successCriteria:'evidence-bound acceptance decision', authority:s.authority },
      claimsMatrix,
      contradictionRegister: contradictions,
      verifierReport: { verdict: outcome, proofIntegrity, contradictionCoverage, evidenceCount: s.evidence, claimCount: s.claims },
      riskLedger: { riskIndex: s.risk, status: s.risk < 35 ? 'bounded' : s.risk < 55 ? 'review-required' : 'escalated' },
      decisionCertificate: certificate,
      actionGraph,
      chronicleEntry: { status: outcome.includes('ACCEPT') ? 'ready-for-entry' : 'held', memoryRule:'Only accepted proof may become reusable institutional memory.' },
      capabilityPackage: { status: outcome.includes('ACCEPT') ? 'candidate' : 'not admitted', rule:'Capability requires replayable proof, bounded risk, and human authority.' }
    },
    metrics: { readiness, proofIntegrity, contradictionCoverage, riskScore, actionability:s.actionability },
    publicSafety: cfg.publicSafety
  };
}

const records = Object.fromEntries(cfg.scenarios.map(s => [s.id, decisionRecord(s)]));
const selected = records['software-delivery'];
const governedDecisionStateCertificate = selected.governedDecisionState.decisionCertificate;
const actionGraphDemo = selected.governedDecisionState.actionGraph;
const verifierMeshReport = { title:'GoalOS Verifier Mesh Report', generatedAt: now, scenarios: Object.values(records).map(r => ({ scenario:r.scenario, verdict:r.governedDecisionState.verifierReport.verdict, proofIntegrity:r.metrics.proofIntegrity, risk:r.governedDecisionState.riskLedger })) };
verifierMeshReport.hash = sha(verifierMeshReport);
const contradictionRegister = { title:'GoalOS Contradiction Register', generatedAt: now, scenarios: Object.values(records).map(r => ({ scenario:r.scenario, contradictions:r.governedDecisionState.contradictionRegister })) };
contradictionRegister.hash = sha(contradictionRegister);
const manifest = { package: cfg.package, version: cfg.version, generatedAt: now, routes: [cfg.route, ...cfg.aliases], artifacts: cfg.artifacts, doctrine: cfg.doctrine, publicSafety: cfg.publicSafety };
manifest.hash = sha(manifest);
const demoBundle = { package: cfg.package, version: cfg.version, generatedAt: now, doctrine: cfg.doctrine, records, selectedScenario: selected.scenario, publicSafety: cfg.publicSafety };
demoBundle.hash = sha(demoBundle);
writeJson('governed-decision-state-demo-bundle.json', demoBundle);
writeJson('governed-decision-state-certificate.json', governedDecisionStateCertificate);
writeJson('action-graph-demo.json', actionGraphDemo);
writeJson('verifier-mesh-report.json', verifierMeshReport);
writeJson('contradiction-register.json', contradictionRegister);
writeJson('decision-state-manifest.json', manifest);

const css = `:root{--bg:#020909;--panel:rgba(255,255,255,.075);--panel2:rgba(116,255,221,.09);--line:rgba(116,255,221,.32);--text:#fff9ef;--muted:#b9c8c7;--mint:#7cffd7;--aqua:#69eaff;--gold:#fff08a;--violet:#bba4ff;--red:#ff8aa0}*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:radial-gradient(circle at 72% 12%,rgba(87,255,218,.20),transparent 30%),radial-gradient(circle at 10% 72%,rgba(126,96,255,.12),transparent 28%),linear-gradient(120deg,#020909,#041818 56%,#071020);color:var(--text);font-family:Inter,ui-sans-serif,system-ui,-apple-system,Segoe UI,Arial,sans-serif;overflow-x:hidden}body:before{content:"";position:fixed;inset:0;pointer-events:none;background-image:linear-gradient(rgba(255,255,255,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.04) 1px,transparent 1px);background-size:72px 72px;mask-image:linear-gradient(to bottom,#000,transparent 92%)}body:after{content:"";position:fixed;inset:0;pointer-events:none;background:radial-gradient(circle at var(--mx,50%) var(--my,50%),rgba(116,255,221,.12),transparent 22%);transition:.2s}.topbar{position:sticky;top:0;z-index:20;display:flex;align-items:center;justify-content:space-between;gap:24px;padding:22px clamp(22px,5vw,78px);background:rgba(1,7,8,.86);backdrop-filter:blur(20px);border-bottom:1px solid rgba(116,255,221,.28)}.brand{display:flex;align-items:center;gap:14px;text-decoration:none;color:var(--text);font-weight:950;text-transform:uppercase;letter-spacing:.18em;font-size:12px}.mark{width:36px;height:36px;border-radius:12px;background:radial-gradient(circle,var(--gold),var(--mint) 45%,var(--aqua));box-shadow:0 0 34px rgba(116,255,221,.6)}nav{display:flex;gap:20px;align-items:center;flex-wrap:wrap}nav a{color:var(--text);font-size:13px;text-decoration:none;font-weight:900}.pill,.btn,button{border:0;border-radius:999px;padding:13px 20px;background:linear-gradient(100deg,var(--gold),var(--mint),var(--aqua));color:#06120d;font-weight:950;cursor:pointer;box-shadow:0 0 30px rgba(116,255,221,.24);text-decoration:none;display:inline-flex;align-items:center;gap:8px}.btn.secondary,button.secondary{background:rgba(255,255,255,.12);color:var(--text);box-shadow:inset 0 0 0 1px rgba(255,255,255,.18)}.wrap{width:min(1220px,calc(100% - 36px));margin:0 auto}.hero{min-height:calc(100vh - 80px);display:grid;grid-template-columns:minmax(0,.95fr) minmax(420px,1.05fr);gap:42px;align-items:center;padding:80px 0}.eyebrow{display:flex;gap:12px;align-items:center;text-transform:uppercase;letter-spacing:.35em;color:var(--mint);font-size:12px;font-weight:950}.eyebrow:before{content:"";width:38px;height:2px;background:linear-gradient(90deg,var(--mint),transparent)}h1,h2{margin:0;line-height:.87;letter-spacing:-.075em;font-size:clamp(62px,8vw,124px)}h1 em,h2 em{font-family:Georgia,serif;font-weight:500;font-style:italic;background:linear-gradient(100deg,var(--gold),var(--mint),var(--aqua),var(--violet));-webkit-background-clip:text;background-clip:text;color:transparent}.lead{font-size:clamp(18px,2vw,24px);line-height:1.45;color:#e4f5f1;max-width:760px}.hero-card,.panel,.console{border:1px solid rgba(255,255,255,.14);border-radius:34px;background:linear-gradient(135deg,rgba(255,255,255,.13),rgba(116,255,221,.07));box-shadow:0 30px 100px rgba(0,0,0,.42),inset 0 0 0 1px rgba(116,255,221,.12);overflow:hidden}.decision-card{padding:28px}.decision-orbit{position:relative;min-height:480px;border-radius:28px;background:radial-gradient(circle at 50% 50%,rgba(116,255,221,.36),transparent 18%),rgba(0,7,9,.66);border:1px solid rgba(255,255,255,.09);overflow:hidden}.decision-orbit:before{content:"";position:absolute;inset:70px;border-radius:50%;border:1px dashed rgba(116,255,221,.32);animation:spin 26s linear infinite}.core{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:128px;height:128px;border-radius:50%;display:grid;place-items:center;background:radial-gradient(circle,var(--gold),var(--mint) 47%,var(--aqua));color:#06120d;font:74px Georgia,serif;box-shadow:0 0 70px rgba(116,255,221,.7)}.node{position:absolute;width:190px;border-radius:20px;background:rgba(3,14,15,.86);border:1px solid var(--line);padding:16px;transition:.35s;box-shadow:0 10px 35px rgba(0,0,0,.25)}.node b{color:var(--gold);font-size:12px;letter-spacing:.15em;text-transform:uppercase}.node strong{display:block;margin:6px 0;font-size:17px}.node span{display:block;color:var(--muted);font-size:12px;line-height:1.35}.node.active{transform:translateY(-8px) scale(1.02);box-shadow:0 0 36px rgba(116,255,221,.28),inset 0 0 0 1px var(--mint)}.n1{left:24px;top:36px}.n2{right:30px;top:38px}.n3{left:20px;bottom:126px}.n4{right:22px;bottom:126px}.n5{left:50%;bottom:28px;transform:translateX(-50%)}.n5.active{transform:translateX(-50%) translateY(-8px) scale(1.02)}.actions{display:flex;gap:12px;flex-wrap:wrap;margin-top:28px}.badges{display:flex;flex-wrap:wrap;gap:9px;margin-top:22px}.badge{border:1px solid var(--line);border-radius:999px;padding:9px 13px;font-size:11px;font-weight:950;letter-spacing:.14em;text-transform:uppercase;color:#d8fff5;background:rgba(0,7,8,.62)}.section{padding:clamp(72px,10vw,130px) 0;border-top:1px solid rgba(255,255,255,.08)}.section-head{display:grid;grid-template-columns:minmax(0,1fr) minmax(340px,470px);gap:32px;align-items:end;margin-bottom:34px}.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}.card{border:1px solid rgba(255,255,255,.13);border-radius:26px;background:rgba(255,255,255,.07);padding:28px}.card h3{font-size:clamp(29px,3.5vw,48px);line-height:.9;letter-spacing:-.055em;margin:0 0 16px}.card p{color:var(--muted);font-size:16px;line-height:1.54}.lab{display:grid;grid-template-columns:minmax(300px,.85fr) minmax(420px,1.15fr);gap:28px;align-items:start}.scenario-grid{display:grid;gap:12px}.scenario{width:100%;text-align:left;border-radius:20px;border:0;padding:18px;background:rgba(255,255,255,.07);box-shadow:inset 0 0 0 1px rgba(255,255,255,.12);color:var(--text)}.scenario small{display:block;color:var(--mint);font-size:10px;text-transform:uppercase;letter-spacing:.16em;font-weight:950}.scenario strong{display:block;font-size:20px;margin:6px 0}.scenario span{display:block;color:var(--muted);line-height:1.4}.scenario.active{background:linear-gradient(135deg,rgba(116,255,221,.22),rgba(255,240,138,.08));box-shadow:inset 0 0 0 1px var(--mint),0 0 30px rgba(116,255,221,.18)}.metrics{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin:16px 0}.metric{border:1px solid rgba(255,255,255,.13);border-radius:18px;padding:16px;background:rgba(255,255,255,.06)}.metric b{display:block;font-size:30px;color:var(--gold)}.metric span{font-size:10px;text-transform:uppercase;letter-spacing:.14em;color:var(--muted);font-weight:900}.trace{min-height:188px;border-radius:20px;padding:18px;background:rgba(0,6,8,.82);border:1px solid rgba(116,255,221,.24);font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;color:#c9fff0;line-height:1.55}.tabs{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px}.tab.active{background:linear-gradient(100deg,rgba(255,240,138,.32),rgba(116,255,221,.28));box-shadow:inset 0 0 0 1px var(--mint)}.code{min-height:420px;overflow:auto;border-radius:22px;padding:22px;background:rgba(0,6,8,.82);border:1px solid rgba(255,255,255,.12);color:#d6fff5;line-height:1.45}.artifacts{display:grid;grid-template-columns:repeat(2,1fr);gap:14px}.artifact{display:block;border:1px solid rgba(255,255,255,.13);border-radius:18px;padding:18px;text-decoration:none;color:var(--text);background:rgba(255,255,255,.07)}.artifact b{display:block;color:var(--mint);margin-bottom:6px}.artifact span{color:var(--muted)}footer{border-top:1px solid rgba(255,255,255,.12);padding:52px clamp(20px,5vw,72px);display:flex;justify-content:space-between;gap:30px;background:rgba(1,5,6,.82)}footer p{color:var(--muted)}.legal-rail{width:min(1180px,calc(100% - 34px));margin:0 auto 36px;border:1px solid var(--line);border-radius:999px;padding:15px 22px;text-align:center;background:rgba(0,7,8,.88);box-shadow:0 0 34px rgba(116,255,221,.16);font-size:13px;color:#d8fff5}.legal-rail b{color:var(--gold);margin-right:8px}@keyframes spin{to{transform:rotate(360deg)}}@media(max-width:1040px){.hero,.section-head,.lab{grid-template-columns:1fr}.grid,.artifacts{grid-template-columns:1fr}.decision-orbit{min-height:620px}.n1,.n2,.n3,.n4,.n5{position:relative;left:auto;right:auto;top:auto;bottom:auto;transform:none;width:auto;margin:10px}.n5.active,.node.active{transform:translateY(-6px)}.core{position:relative;left:auto;top:auto;transform:none;margin:42px auto}.decision-orbit:before{display:none}}@media(max-width:650px){h1,h2{font-size:48px}.metrics{grid-template-columns:repeat(2,1fr)}.topbar{position:relative;align-items:flex-start;flex-direction:column}footer{display:block}.legal-rail{border-radius:24px}}`;
write('assets/governed-decision-state-lab-v18.css', css);

const js = `const DATA=${JSON.stringify({records,demoBundle}, null, 0)};
const qs=(s,r=document)=>r.querySelector(s); const qsa=(s,r=document)=>Array.from(r.querySelectorAll(s));
let active='software-delivery'; let panel='state'; let running=false;
document.addEventListener('pointermove',e=>{document.body.style.setProperty('--mx',e.clientX+'px');document.body.style.setProperty('--my',e.clientY+'px')});
const panels={state:(r)=>r.governedDecisionState,certificate:(r)=>r.governedDecisionState.decisionCertificate,claims:(r)=>r.governedDecisionState.claimsMatrix,risk:(r)=>r.governedDecisionState.riskLedger,actions:(r)=>r.governedDecisionState.actionGraph,bundle:()=>DATA.demoBundle};
function current(){return DATA.records[active]}
function trace(lines){qs('[data-trace]').innerHTML=lines.map((l,i)=>'<div>'+String(i+1).padStart(2,'0')+'. '+l+'</div>').join('')}
function metrics(){const r=current(); qs('[data-m="readiness"] b').textContent=r.metrics.readiness; qs('[data-m="proof"] b').textContent=r.metrics.proofIntegrity; qs('[data-m="risk"] b').textContent=r.governedDecisionState.riskLedger.riskIndex; qs('[data-m="outcome"] b').textContent=r.governedDecisionState.decisionCertificate.outcome.replace('ACCEPT_WITH_RECEIPT','ACCEPT').replace('ACCEPT_WITH_BOUNDARY','ACCEPT').replace('REQUEST_CHANGES','CHANGES')}
function render(){const r=current(); qsa('.scenario').forEach(b=>b.classList.toggle('active',b.dataset.scenario===active)); qsa('.tab').forEach(b=>b.classList.toggle('active',b.dataset.panel===panel)); qsa('.node').forEach((n,i)=>n.classList.toggle('active',i===({state:0,claims:1,risk:2,actions:3,certificate:4,bundle:4}[panel]||0))); metrics(); qs('[data-title]').textContent=r.label; qs('[data-panel-title]').textContent={state:'Governed Decision State',certificate:'Decision certificate',claims:'Claims matrix',risk:'Risk ledger',actions:'Action graph',bundle:'Full demo bundle'}[panel]; qs('[data-json]').textContent=JSON.stringify(panels[panel](r),null,2); trace(['Scenario loaded: '+r.label,'Mission contract committed.','Claims: '+r.governedDecisionState.claimsMatrix.length+' · Evidence refs mapped.','Contradictions surfaced: '+r.governedDecisionState.contradictionRegister.length+'.','Current decision state: '+r.governedDecisionState.decisionCertificate.outcome+'.'])}
function run(){if(running)return; running=true; const r=current(); const steps=['Objective converted to mission contract.','Claims matrix assembled and evidence-bound.','Contradiction register checked.','Verifier mesh emitted report.','Risk ledger and authority gate evaluated.','Decision state created: '+r.governedDecisionState.decisionCertificate.outcome+'.','Action graph scoped.','Chronicle/capability admission rule applied.']; let i=0; const tick=()=>{trace(steps.slice(0,i+1)); qsa('.node').forEach((n,k)=>n.classList.toggle('active',k===Math.min(4,Math.floor(i/2)))); i++; if(i<steps.length) setTimeout(tick,360); else {running=false; panel='certificate'; render();}}; tick();}
function download(){const blob=new Blob([JSON.stringify(DATA.demoBundle,null,2)],{type:'application/json'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='goalos-governed-decision-state-demo-bundle.json'; a.click(); setTimeout(()=>URL.revokeObjectURL(a.href),500)}
qsa('.scenario').forEach(b=>b.addEventListener('click',()=>{active=b.dataset.scenario;render()})); qsa('.tab').forEach(b=>b.addEventListener('click',()=>{panel=b.dataset.panel;render()})); qs('[data-run]').addEventListener('click',run); qs('[data-reset]').addEventListener('click',render); qs('[data-download]').addEventListener('click',download); render();`;
write('assets/governed-decision-state-lab-v18.js', js);

const nav = [['Browser beta','browser-beta.html'],['Mission 001','mission-001.html'],['Selection gate','proof-gradient-lab.html'],['Compounding','capability-compounding-lab.html'],['Decision state','governed-decision-state-lab.html'],['Data posture','no-user-data.html']];
function page(active){
  const navHtml = nav.map(([label,href]) => `<a href="${href}">${label}</a>`).join('');
  const scenarioButtons = cfg.scenarios.map(s => `<button class="scenario" data-scenario="${esc(s.id)}"><small>${esc(s.outcome.replaceAll('_',' '))}</small><strong>${esc(s.label)}</strong><span>${esc(s.mission)}</span></button>`).join('');
  const artifactLinks = cfg.artifacts.map(a => `<a class="artifact" href="${a}"><b>${a}</b><span>Public-safe synthetic artifact generated by the browser lab.</span></a>`).join('');
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>GoalOS Signoff Pro — Governed Decision State Lab</title><meta name="description" content="A browser-local demonstration of GoalOS converting AI output into governed decision state, evidence docket, verifier report, risk ledger, action graph, and receipt."><link rel="stylesheet" href="assets/governed-decision-state-lab-v18.css"></head><body><header class="topbar"><a class="brand" href="index.html"><span class="mark"></span><span>GoalOS Signoff Pro<br><small>Governed Decision State Lab</small></span></a><nav>${navHtml}<a class="pill" href="governed-decision-state-lab.html#lab">Run the lab</a></nav></header><main><section class="hero wrap"><div><div class="eyebrow">The core deliverable</div><h1>Not a report. <em>A decision state.</em></h1><p class="lead">AI can produce a document. GoalOS produces the inspectable state around that document: objective, claims matrix, evidence, contradictions, verifier report, risk ledger, authority, action graph, Chronicle entry, and reusable capability rule.</p><div class="actions"><a class="btn" href="#lab">Run decision state</a><a class="btn secondary" href="mission-001.html">Inspect Mission 001</a><a class="btn secondary" href="evidence-docket-demo.html">Open Evidence Docket</a></div><div class="badges"><span class="badge">Browser-local</span><span class="badge">No input</span><span class="badge">No upload</span><span class="badge">No wallet</span><span class="badge">No value moved</span></div></div><div class="hero-card decision-card"><div class="eyebrow">Proof-to-action console</div><div class="decision-orbit"><div class="core">α</div><article class="node n1 active"><b>01</b><strong>Mission</strong><span>Objective becomes signed acceptance criteria.</span></article><article class="node n2"><b>02</b><strong>Evidence</strong><span>Claims map to support, uncertainty, and boundaries.</span></article><article class="node n3"><b>03</b><strong>Risk</strong><span>Contradictions and unresolved exposure remain visible.</span></article><article class="node n4"><b>04</b><strong>Action</strong><span>Accept, request changes, reject, or escalate.</span></article><article class="node n5"><b>05</b><strong>Memory</strong><span>Only accepted proof can enter Chronicle.</span></article></div></div></section><section class="section"><div class="wrap section-head"><div><div class="eyebrow">Why it matters</div><h2>Acceptance is a state, not a vibe.</h2></div><p class="lead">A governed decision state lets reviewers see what is claimed, what is supported, what is unresolved, what risk remains, who has authority, and what action is safe to take next.</p></div><div class="wrap grid"><article class="card"><h3>Claims become inspectable.</h3><p>The claims matrix separates every claim from the evidence that supports it, the uncertainty that limits it, and the boundary that prevents overreach.</p></article><article class="card"><h3>Risk stays visible.</h3><p>Contradictions, missing support, scope gaps, and unresolved assumptions remain in the risk ledger instead of disappearing inside prose.</p></article><article class="card"><h3>Action becomes bounded.</h3><p>The result is not an automatic action. It is a human-review-ready decision state with scoped next steps and rollback/failure conditions.</p></article></div></section><section class="section" id="lab"><div class="wrap lab"><aside class="panel" style="padding:24px"><div class="eyebrow">Decision scenarios</div><h2 style="font-size:54px;margin:16px 0 20px">Choose a proof room.</h2><div class="scenario-grid">${scenarioButtons}</div><div class="actions"><button data-run>Run decision state</button><button class="secondary" data-reset>Reset</button><button class="secondary" data-download>Download bundle</button></div></aside><section class="console" style="padding:24px"><div class="eyebrow" data-title>Software delivery review</div><div class="metrics"><article class="metric" data-m="readiness"><b>—</b><span>readiness</span></article><article class="metric" data-m="proof"><b>—</b><span>proof integrity</span></article><article class="metric" data-m="risk"><b>—</b><span>risk index</span></article><article class="metric" data-m="outcome"><b>—</b><span>decision</span></article></div><div class="trace" data-trace></div><div style="height:18px"></div><div class="tabs"><button class="tab active secondary" data-panel="state">Decision state</button><button class="tab secondary" data-panel="certificate">Certificate</button><button class="tab secondary" data-panel="claims">Claims</button><button class="tab secondary" data-panel="risk">Risk</button><button class="tab secondary" data-panel="actions">Action graph</button><button class="tab secondary" data-panel="bundle">Bundle</button></div><h3 data-panel-title>Governed Decision State</h3><pre class="code" data-json></pre></section></div></section><section class="section"><div class="wrap section-head"><div><div class="eyebrow">Generated public artifacts</div><h2>Decision state becomes replayable.</h2></div><p class="lead">The browser lab emits public-safe synthetic artifacts that show the structure of the proof room without collecting user material.</p></div><div class="wrap artifacts">${artifactLinks}</div></section></main><footer><div><strong>GoalOS Signoff Pro</strong><p>AI-era work acceptance · evidence review · governed decision states · signed receipts.</p></div><nav><a href="privacy.html">Privacy</a><a href="terms.html">Terms</a><a href="no-user-data.html">No User Data</a><a href="agialpha-token-boundary.html">$AGIALPHA boundary</a></nav></footer><div class="legal-rail" data-goalos-legal-rail="v12"><b>Public site rule</b>${publicRule}</div><script src="assets/governed-decision-state-lab-v18.js"></script></body></html>`;
}

const html = page();
write(cfg.route, html);
for (const alias of cfg.aliases) write(alias, html.replaceAll(cfg.route, alias));

// Insert a homepage rail if an index exists and does not already link to the page.
const indexPath = path.join(site, 'index.html');
if (fs.existsSync(indexPath)) {
  let index = fs.readFileSync(indexPath, 'utf8');
  if (!index.includes('governed-decision-state-lab.html')) {
    const rail = `<section class="section"><div class="wrap" style="border:1px solid rgba(116,255,221,.32);border-radius:30px;padding:34px;background:rgba(116,255,221,.08)"><div class="eyebrow">Governed decision state</div><h2 style="font-size:clamp(42px,6vw,80px);line-height:.9;margin:12px 0">The deliverable is not a report. It is a decision state.</h2><p class="lead">Run the browser-local lab: claims, evidence, contradictions, verifier report, risk ledger, action graph, Chronicle rule, and capability package.</p><a class="btn" href="governed-decision-state-lab.html">Open the decision state lab</a></div></section>`;
    const footer = index.search(/<footer\b/i);
    index = footer >= 0 ? index.slice(0, footer) + rail + index.slice(footer) : index.replace('</main>', rail + '</main>');
    fs.writeFileSync(indexPath, index);
  }
}
console.log('GoalOS Governed Decision State Lab v18 generated.');
