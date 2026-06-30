#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = process.cwd();
const site = path.join(root, 'site');
const configPath = path.join(root, 'config', 'until-done-lab.json');
const cfg = fs.existsSync(configPath) ? JSON.parse(fs.readFileSync(configPath, 'utf8')) : {
  scenarios: [
    { id: 'research', label: 'AI research acceptance', objective: 'Move one AI research deliverable from persuasive draft to governed decision state.', decision: 'Accept, request changes, reject, or escalate.', initialProofDebt: 42, finalProofDebt: 5 }
  ]
};
fs.mkdirSync(site, { recursive: true });

const canon = value => JSON.stringify(value, Object.keys(value).sort(), 2);
const sha = value => crypto.createHash('sha256').update(typeof value === 'string' ? value : JSON.stringify(value)).digest('hex');
const now = new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');

const stages = [
  { id: 'objective', label: 'Objective', purpose: 'Decision target declared.', debt: -3, state: 'advance' },
  { id: 'contract', label: 'Mission Contract', purpose: 'Success, failure, evidence, authority, and risk criteria fixed.', debt: -5, state: 'advance' },
  { id: 'plan', label: 'Plan', purpose: 'Work streams, validators, claim boundaries, and replay path drafted.', debt: -4, state: 'advance' },
  { id: 'claims', label: 'Claims Matrix', purpose: 'Major claims separated from assumptions and non-claims.', debt: -5, state: 'advance' },
  { id: 'evidence-gap', label: 'Evidence Gap', purpose: 'Missing support detected. GoalOS loops back instead of accepting.', debt: +2, state: 'loop' },
  { id: 'evidence', label: 'Evidence Docket', purpose: 'Public-safe evidence mapped to every material claim.', debt: -11, state: 'advance' },
  { id: 'contradiction', label: 'Contradiction Register', purpose: 'Conflicts surfaced and resolved or bounded.', debt: -4, state: 'advance' },
  { id: 'verify', label: 'Verifier Mesh', purpose: 'Sources, claims, risk, replay, and boundary checks attack the package.', debt: -5, state: 'advance' },
  { id: 'risk', label: 'Risk Ledger', purpose: 'Remaining uncertainty, blocked actions, rollback, and escalation state recorded.', debt: -3, state: 'advance' },
  { id: 'decision', label: 'Governed Decision State', purpose: 'Acceptance surface created: accept, request changes, reject, or escalate.', debt: -2, state: 'advance' },
  { id: 'action', label: 'Action Graph', purpose: 'Next actions scoped with owners, gates, and rollback conditions.', debt: -1, state: 'advance' },
  { id: 'chronicle', label: 'Chronicle', purpose: 'Only accepted, replayable, claim-bounded state may become memory.', debt: -1, state: 'advance' },
  { id: 'done', label: 'DONE', purpose: 'All required artifacts exist and gates pass. Human authority remains final.', debt: 0, state: 'done' }
];

function makeBundle(scenario = cfg.scenarios[0]) {
  let debt = scenario.initialProofDebt;
  const ledger = stages.map((s, index) => {
    debt = Math.max(scenario.finalProofDebt, debt + s.debt);
    if (s.id === 'done') debt = scenario.finalProofDebt;
    return { index: index + 1, stage: s.id, label: s.label, state: s.state, proofDebt: debt, purpose: s.purpose };
  });
  const missionContract = {
    missionId: 'GOALOS-UNTIL-DONE-LAB-001',
    scenario: scenario.id,
    objective: scenario.objective,
    decisionToSupport: scenario.decision,
    doneCondition: ['mission_contract', 'claims_matrix', 'source_provenance', 'contradiction_register', 'evidence_docket', 'verifier_report', 'risk_ledger', 'governed_decision_state', 'action_graph', 'chronicle_entry', 'claim_boundary_pass', 'qa_pass'],
    authority: 'human final gate',
    dataBoundary: 'public synthetic demo only; no user data collected'
  };
  const decisionState = {
    status: 'DONE_TRUE_SYNTHETIC_DEMO',
    recommendation: scenario.id === 'safety' ? 'escalate to human authority with bounded next action' : 'decision-review ready',
    claimsSupported: 8,
    unresolvedClaims: 0,
    openRisks: scenario.id === 'safety' ? 3 : 1,
    proofDebtStart: scenario.initialProofDebt,
    proofDebtEnd: scenario.finalProofDebt,
    valueMoved: 0
  };
  const actionGraph = {
    nodes: ['review_docket', 'inspect_claims', 'check_risk_ledger', 'human_decision', 'issue_receipt'],
    edges: [['review_docket','inspect_claims'], ['inspect_claims','check_risk_ledger'], ['check_risk_ledger','human_decision'], ['human_decision','issue_receipt']],
    rollback: 'return to evidence collection if a material claim loses support'
  };
  const chronicle = {
    chronicleEntryId: `chronicle-${scenario.id}-until-done-demo`,
    admitsToMemory: true,
    rule: 'Only replayable, claim-bounded, validator-reviewed proof can influence future work.',
    capabilityPackage: `${scenario.id}-proof-to-decision-pattern`,
    valueMoved: 0
  };
  const certificate = {
    certificateId: `GOALOS-DONE-${scenario.id.toUpperCase()}-SYNTHETIC`,
    issuedAt: now,
    missionContractHash: sha(missionContract),
    proofDebtLedgerHash: sha(ledger),
    decisionStateHash: sha(decisionState),
    status: 'DONE=true; browser-local synthetic demonstration',
    claimBoundary: 'No external audit, no production certification, no settlement, no value movement.'
  };
  return { manifest: { name: 'GoalOS Until-DONE Mission Control Lab', version: '21.0.0', scenario: scenario.id, generatedAt: now, browserLocal: true, noUserData: true, valueMoved: 0 }, missionContract, proofDebtLedger: ledger, decisionState, actionGraph, chronicle, certificate };
}

const bundles = Object.fromEntries(cfg.scenarios.map(s => [s.id, makeBundle(s)]));
const defaultBundle = bundles.research || Object.values(bundles)[0];

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>GoalOS Signoff Pro — Until-DONE Mission Control Lab</title>
<meta name="description" content="A browser-local GoalOS lab showing how objectives become proof-backed DONE states instead of unsupported reports." />
<style>
:root{--bg:#020807;--panel:rgba(20,37,34,.74);--panel2:rgba(7,16,18,.86);--line:rgba(120,255,222,.34);--line2:rgba(255,232,126,.46);--mint:#75ffd7;--cyan:#72e9ff;--cream:#fff8eb;--gold:#fff08a;--muted:#b9c9ca;--danger:#ff7e9f;--purple:#b7a0ff;--shadow:0 30px 80px rgba(0,0,0,.44),0 0 60px rgba(117,255,215,.12)}
*{box-sizing:border-box}body{margin:0;background:radial-gradient(circle at 74% 20%,rgba(54,255,213,.21),transparent 30%),radial-gradient(circle at 14% 82%,rgba(162,126,255,.16),transparent 31%),linear-gradient(120deg,#020807,#051312 48%,#051018);color:var(--cream);font-family:Inter,ui-sans-serif,system-ui,-apple-system,Segoe UI,Arial,sans-serif;overflow-x:hidden}body:before{content:"";position:fixed;inset:0;background-image:linear-gradient(rgba(255,255,255,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.035) 1px,transparent 1px);background-size:64px 64px;mask-image:linear-gradient(to bottom,rgba(0,0,0,.9),rgba(0,0,0,.18));pointer-events:none}a{color:inherit;text-decoration:none}.nav{position:sticky;top:0;z-index:20;display:flex;align-items:center;justify-content:space-between;padding:18px 5vw;background:rgba(2,7,8,.86);backdrop-filter:blur(20px);border-bottom:1px solid var(--line)}.brand{display:flex;gap:14px;align-items:center}.mark{width:42px;height:42px;border:1px solid var(--line);border-radius:14px;background:radial-gradient(circle,var(--mint),var(--cyan) 32%,transparent 38%);box-shadow:0 0 30px rgba(117,255,215,.5)}.brand b{font-size:12px;letter-spacing:.2em}.brand span{display:block;font-size:10px;letter-spacing:.24em;color:var(--muted)}.navlinks{display:flex;gap:24px;align-items:center;font-size:12px;font-weight:800}.pill{border:1px solid rgba(255,255,255,.2);padding:11px 18px;border-radius:999px;background:rgba(255,255,255,.08)}.primary{background:linear-gradient(135deg,#eaff9b,#5deeff);color:#04110f;border:0;box-shadow:0 0 30px rgba(117,255,215,.32)}button{font:inherit;cursor:pointer;color:inherit;border:1px solid rgba(255,255,255,.22);background:rgba(255,255,255,.09);border-radius:999px;padding:13px 18px;font-weight:900}button.primary{color:#04110f}.hero{min-height:88vh;display:grid;grid-template-columns:minmax(0,1.04fr) minmax(360px,.96fr);gap:56px;align-items:center;width:min(1180px,92vw);margin:0 auto;padding:80px 0}.eyebrow{color:var(--mint);letter-spacing:.35em;text-transform:uppercase;font-weight:900;font-size:12px}.eyebrow:before{content:"";display:inline-block;width:38px;height:1px;background:var(--mint);vertical-align:middle;margin-right:16px;box-shadow:0 0 18px var(--mint)}h1{font-size:clamp(58px,8.6vw,128px);line-height:.86;letter-spacing:-.08em;margin:22px 0 20px}.grad{font-family:Georgia,serif;font-style:italic;font-weight:400;background:linear-gradient(100deg,var(--gold),var(--mint),var(--cyan),var(--purple));-webkit-background-clip:text;color:transparent}.lead{font-size:clamp(18px,2.1vw,24px);line-height:1.5;max-width:680px;color:#edf8f5}.rule{margin:24px 0;padding:18px 20px;border:1px solid var(--line2);border-radius:20px;background:linear-gradient(135deg,rgba(255,240,138,.12),rgba(117,255,215,.09));font-weight:900;color:var(--gold)}.actions{display:flex;flex-wrap:wrap;gap:14px;margin:26px 0}.chips{display:flex;gap:10px;flex-wrap:wrap}.chip{font-size:11px;letter-spacing:.13em;font-weight:900;border:1px solid var(--line);border-radius:999px;padding:9px 12px;background:rgba(4,18,17,.7);color:#cffff4}.console{position:relative;border:1px solid var(--line);border-radius:34px;background:linear-gradient(145deg,rgba(23,57,50,.83),rgba(4,12,14,.86));padding:22px;box-shadow:var(--shadow);overflow:hidden}.console:before{content:"";position:absolute;inset:-70px;background:conic-gradient(from 120deg,transparent,var(--mint),transparent,var(--cyan),transparent);opacity:.16;animation:spin 14s linear infinite}.inner{position:relative;background:rgba(2,8,9,.78);border:1px solid rgba(255,255,255,.08);border-radius:24px;padding:18px}.topline{display:flex;justify-content:space-between;color:var(--mint);letter-spacing:.24em;font-size:10px;font-weight:900}.machine{display:grid;grid-template-columns:1.1fr .9fr;gap:18px;margin-top:18px}.stages{display:grid;gap:9px}.stage{display:flex;gap:12px;align-items:flex-start;padding:14px;border:1px solid var(--line);border-radius:14px;background:rgba(30,56,51,.67);transition:.25s transform,.25s border,.25s background}.stage.active{transform:translateX(8px);border-color:var(--gold);background:rgba(255,240,138,.13)}.stage.loop{border-color:rgba(255,126,159,.68);background:rgba(255,126,159,.08)}.num{color:var(--gold);font-weight:1000}.stage b{display:block}.stage span{font-size:12px;color:var(--muted)}.orbbox{min-height:380px;display:grid;place-items:center;border:1px solid rgba(255,255,255,.12);border-radius:22px;background:radial-gradient(circle at 50% 48%,rgba(117,255,215,.28),transparent 25%),#02090a;position:relative;overflow:hidden}.orb{width:174px;height:174px;border-radius:50%;display:grid;place-items:center;background:radial-gradient(circle,#fff08a 0 10%,#75ffd7 36%,#72e9ff 70%,#071114 72%);color:#020807;font-size:70px;font-family:Georgia,serif;font-weight:900;box-shadow:0 0 70px rgba(117,255,215,.65);animation:pulse 2.8s ease-in-out infinite}.ring{position:absolute;border:1px dashed rgba(117,255,215,.4);border-radius:50%;animation:spin 18s linear infinite}.r1{width:250px;height:250px}.r2{width:330px;height:330px;animation-duration:24s;animation-direction:reverse}.status{position:absolute;bottom:18px;left:18px;right:18px;display:grid;grid-template-columns:repeat(2,1fr);gap:10px}.metric{border:1px solid rgba(255,255,255,.14);border-radius:14px;padding:12px;background:rgba(255,255,255,.06)}.metric b{font-size:26px;color:var(--gold)}.metric span{display:block;font-size:10px;letter-spacing:.18em;color:var(--muted);text-transform:uppercase}.section{width:min(1180px,92vw);margin:0 auto;padding:70px 0}.labgrid{display:grid;grid-template-columns:.9fr 1.1fr;gap:24px}.card{border:1px solid rgba(120,255,222,.28);border-radius:26px;background:var(--panel);box-shadow:var(--shadow);padding:26px}.card h2{font-size:clamp(36px,4.5vw,70px);line-height:.93;letter-spacing:-.06em;margin:8px 0 16px}.scenario{display:grid;gap:10px}.scenario button{text-align:left;border-radius:16px;padding:16px;background:rgba(255,255,255,.07)}.scenario button.active{border-color:var(--gold);background:rgba(255,240,138,.12)}.trace{height:330px;overflow:auto;background:rgba(0,0,0,.55);border:1px solid rgba(255,255,255,.14);border-radius:20px;padding:18px;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;color:#d5fff5;font-size:13px;line-height:1.65}.debtbar{height:18px;background:rgba(255,255,255,.09);border-radius:999px;overflow:hidden;border:1px solid rgba(255,255,255,.12)}.debtfill{height:100%;width:100%;background:linear-gradient(90deg,var(--danger),var(--gold),var(--mint));transition:width .5s ease}.tabs{display:flex;gap:10px;flex-wrap:wrap;margin:16px 0}.tabs button{padding:10px 14px}.tabs button.active{background:rgba(117,255,215,.18);border-color:var(--mint)}pre{white-space:pre-wrap;word-break:break-word;background:rgba(0,0,0,.5);border:1px solid rgba(255,255,255,.12);border-radius:18px;padding:18px;min-height:250px;color:#d6fff6}.path{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}.path div{border:1px solid var(--line);border-radius:18px;padding:18px;background:rgba(255,255,255,.06)}.footer{border-top:1px solid rgba(120,255,222,.26);padding:40px 5vw;background:rgba(0,0,0,.42);display:flex;justify-content:space-between;gap:22px}.legal-rail{width:min(980px,92vw);margin:22px auto 48px;border:1px solid var(--line);border-radius:999px;background:rgba(1,8,8,.82);padding:13px 20px;text-align:center;font-size:12px}.legal-rail b{color:var(--gold)}@keyframes spin{to{transform:rotate(360deg)}}@keyframes pulse{50%{transform:scale(1.04);filter:saturate(1.2)}}@media(max-width:960px){.hero,.labgrid{grid-template-columns:1fr}.navlinks{display:none}.machine{grid-template-columns:1fr}.path{grid-template-columns:1fr 1fr}h1{font-size:56px}.footer{display:block}.hero{padding-top:40px}}
</style>
</head>
<body>
<header class="nav"><a class="brand" href="index.html"><span class="mark"></span><span><b>GOALOS SIGNOFF PRO</b><span>UNTIL-DONE MISSION CONTROL</span></span></a><nav class="navlinks"><a href="browser-beta.html">Browser beta</a><a href="mission-001.html">Mission 001</a><a href="proof-gradient-lab.html">Selection gate</a><a href="capability-compounding-lab.html">Compounding</a><a href="validator-mesh-lab.html">Verifier mesh</a><a class="pill primary" href="until-done-lab.html">Run the lab</a></nav></header>
<main>
<section class="hero">
  <div>
    <div class="eyebrow">Run-to-completion proof state machine</div>
    <h1>GoalOS runs until <span class="grad">proof is done.</span></h1>
    <p class="lead">AI creates output. GoalOS turns the objective into a mission contract, burns down proof debt, loops when evidence is missing, and emits a governed decision state only when the required proof package exists.</p>
    <div class="rule">No Evidence Docket, no DONE. No verifier pass, no decision state. No rollback path, no release.</div>
    <div class="actions"><button class="primary" data-run>Run until DONE</button><a class="pill" href="mission-001.html">Inspect Mission 001</a><a class="pill" href="governed-decision-state-lab.html">Decision State Lab</a></div>
    <div class="chips"><span class="chip">BROWSER-LOCAL</span><span class="chip">NO INPUT</span><span class="chip">NO UPLOAD</span><span class="chip">NO WALLET</span><span class="chip">NO VALUE MOVED</span></div>
  </div>
  <div class="console" aria-label="GoalOS until-DONE proof console">
    <div class="inner">
      <div class="topline"><span>MISSION CONTROL</span><span id="mode">AWAITING RUN</span></div>
      <div class="machine">
        <div class="stages" id="stageList"></div>
        <div class="orbbox"><span class="ring r1"></span><span class="ring r2"></span><div class="orb">α</div><div class="status"><div class="metric"><b id="donePct">0</b><span>DONE readiness</span></div><div class="metric"><b id="debtMetric">42</b><span>proof debt</span></div><div class="metric"><b id="loopsMetric">0</b><span>loops</span></div><div class="metric"><b id="gatesMetric">0</b><span>gates clear</span></div></div></div>
      </div>
    </div>
  </div>
</section>
<section class="section labgrid">
  <div class="card">
    <div class="eyebrow">Choose one public-safe objective</div>
    <h2>Watch proof debt burn down.</h2>
    <p>The lab uses synthetic scenarios. Nothing is typed, pasted, uploaded, stored, or transmitted.</p>
    <div class="scenario" id="scenarioButtons"></div>
  </div>
  <div class="card">
    <div class="eyebrow">Evidence-state trace</div>
    <h2>Every gap returns to work.</h2>
    <div class="debtbar" aria-label="Proof debt remaining"><div class="debtfill" id="debtFill"></div></div>
    <div class="actions"><button class="primary" data-run>Run until DONE</button><button data-reset>Reset</button><button data-download>Download demo bundle</button></div>
    <div class="trace" id="trace">System ready. Awaiting objective.</div>
  </div>
</section>
<section class="section labgrid">
  <div class="card">
    <div class="eyebrow">Decision-state tabs</div>
    <h2>Not a report. A DONE object.</h2>
    <div class="tabs" id="tabs"></div>
    <pre id="tabPanel"></pre>
  </div>
  <div class="card">
    <div class="eyebrow">Control law</div>
    <h2>If anything is missing, GoalOS loops.</h2>
    <div class="path"><div><b>01 Commit</b><p>Define objective, success criteria, risk, authority, and evidence requirements.</p></div><div><b>02 Prove</b><p>Map claims to evidence, contradictions, proof packets, and verifier checks.</p></div><div><b>03 Decide</b><p>Convert evidence into accept, request changes, reject, or escalate.</p></div><div><b>04 Chronicle</b><p>Only accepted, replayable, claim-bounded proof enters reusable memory.</p></div></div>
  </div>
</section>
</main>
<footer class="footer" data-goalos-footer="v12"><div><b>GoalOS Signoff Pro</b><p>AI-era work acceptance · proof debt burn-down · governed decision states · reusable capability.</p></div><div><a href="privacy.html">Privacy</a> · <a href="terms.html">Terms</a> · <a href="no-user-data.html">No User Data</a> · <a href="agialpha-token-boundary.html">$AGIALPHA boundary</a></div></footer>
<div class="legal-rail" data-goalos-legal-rail="v12"><b>Public site rule</b> No forms · no inputs · no uploads · no cookies · no analytics · no wallets · no payments · no personal or confidential data.</div>
<script>
const CONFIG = ${JSON.stringify({ scenarios: cfg.scenarios, stages, bundles })};
let scenario = CONFIG.scenarios[0].id;
let step = -1;
let timer = null;
const $ = s => document.querySelector(s);
const all = s => [...document.querySelectorAll(s)];
const trace = msg => { const box = $('#trace'); box.textContent += '\\n' + msg; box.scrollTop = box.scrollHeight; };
function bundle(){ return CONFIG.bundles[scenario]; }
function activeScenario(){ return CONFIG.scenarios.find(s => s.id === scenario) || CONFIG.scenarios[0]; }
function renderScenarios(){ $('#scenarioButtons').innerHTML = CONFIG.scenarios.map(s => '<button data-scenario="'+s.id+'"><b>'+s.label+'</b><br><span>'+s.objective+'</span></button>').join(''); all('[data-scenario]').forEach(b=>b.onclick=()=>{scenario=b.dataset.scenario; reset();}); }
function renderStages(){ $('#stageList').innerHTML = CONFIG.stages.slice(0,6).map((s,i)=>'<div class="stage" data-stage="'+i+'"><span class="num">'+String(i+1).padStart(2,'0')+'</span><span><b>'+s.label+'</b><span>'+s.purpose+'</span></span></div>').join(''); }
function renderTabs(){ const tabs = ['missionContract','proofDebtLedger','decisionState','actionGraph','chronicle','certificate']; $('#tabs').innerHTML = tabs.map((t,i)=>'<button data-tab="'+t+'" class="'+(i===0?'active':'')+'">'+t.replace(/([A-Z])/g,' $1')+'</button>').join(''); all('[data-tab]').forEach(b=>b.onclick=()=>showTab(b.dataset.tab)); showTab('missionContract'); }
function showTab(name){ all('[data-tab]').forEach(b=>b.classList.toggle('active',b.dataset.tab===name)); $('#tabPanel').textContent = JSON.stringify(bundle()[name], null, 2); }
function setProgress(i){ const sc = activeScenario(); const pct = Math.min(100, Math.round(((i+1)/CONFIG.stages.length)*100)); const entry = bundle().proofDebtLedger[Math.max(0,i)] || { proofDebt: sc.initialProofDebt }; $('#donePct').textContent = pct; $('#debtMetric').textContent = entry.proofDebt; $('#debtFill').style.width = Math.max(6, Math.round(100*entry.proofDebt/sc.initialProofDebt)) + '%'; $('#gatesMetric').textContent = Math.min(12, Math.max(0,i-1)); $('#loopsMetric').textContent = i >= 4 ? 1 : 0; $('#mode').textContent = pct === 100 ? 'DONE TRUE' : 'RUNNING'; all('.stage').forEach((el,k)=>{ el.classList.toggle('active',k===i%6); el.classList.toggle('loop', CONFIG.stages[i]?.state === 'loop' && k===i%6); }); }
function reset(){ clearInterval(timer); step = -1; $('#trace').textContent = 'System ready. Awaiting objective: ' + activeScenario().label + '.'; $('#mode').textContent = 'AWAITING RUN'; $('#donePct').textContent = 0; $('#debtMetric').textContent = activeScenario().initialProofDebt; $('#debtFill').style.width = '100%'; $('#loopsMetric').textContent = 0; $('#gatesMetric').textContent = 0; renderScenarios(); renderStages(); renderTabs(); all('[data-scenario]').forEach(b=>b.classList.toggle('active',b.dataset.scenario===scenario)); }
function run(){ reset(); timer = setInterval(()=>{ step++; if(step >= CONFIG.stages.length){ clearInterval(timer); trace('DONE=true. Human review-ready package emitted. Value moved: 0.'); showTab('certificate'); return; } const s = CONFIG.stages[step]; setProgress(step); trace((step+1)+'. '+s.label+': '+s.purpose + (s.state==='loop' ? ' Returning to proof work.' : '')); }, 620); }
function download(){ const data = JSON.stringify(bundle(), null, 2); const blob = new Blob([data], {type:'application/json'}); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'goalos-until-done-demo-bundle.json'; a.click(); URL.revokeObjectURL(a.href); }
all('[data-run]').forEach(b=>b.onclick=run); all('[data-reset]').forEach(b=>b.onclick=reset); all('[data-download]').forEach(b=>b.onclick=download);
reset();
</script>
</body>
</html>`;

for (const route of ['until-done-lab.html', 'mission-control-lab.html', 'proof-debt-lab.html']) {
  fs.writeFileSync(path.join(site, route), html);
}
fs.writeFileSync(path.join(site, 'until-done-demo-bundle.json'), JSON.stringify(defaultBundle, null, 2));
fs.writeFileSync(path.join(site, 'mission-done-certificate.json'), JSON.stringify(defaultBundle.certificate, null, 2));
fs.writeFileSync(path.join(site, 'proof-debt-burndown-ledger.json'), JSON.stringify(defaultBundle.proofDebtLedger, null, 2));
fs.writeFileSync(path.join(site, 'until-done-action-graph.json'), JSON.stringify(defaultBundle.actionGraph, null, 2));
fs.writeFileSync(path.join(site, 'until-done-chronicle-entry.json'), JSON.stringify(defaultBundle.chronicle, null, 2));
fs.writeFileSync(path.join(site, 'until-done-manifest.json'), JSON.stringify(defaultBundle.manifest, null, 2));

function injectHomeRail() {
  const home = path.join(site, 'index.html');
  if (!fs.existsSync(home)) return;
  let src = fs.readFileSync(home, 'utf8');
  if (src.includes('until-done-lab.html')) return;
  const rail = `<section class="goalos-extension-rail until-done-rail" style="width:min(1080px,92vw);margin:56px auto;padding:30px;border:1px solid rgba(120,255,222,.34);border-radius:28px;background:rgba(20,37,34,.72)"><div style="letter-spacing:.26em;color:#75ffd7;text-transform:uppercase;font-weight:900;font-size:12px">Until-DONE Mission Control</div><h2 style="font-size:clamp(34px,5vw,72px);line-height:.92;letter-spacing:-.06em;margin:14px 0;color:#fff8eb">GoalOS runs until proof is done.</h2><p style="max-width:780px;color:#d9f1ed;font-size:18px">Watch proof debt burn down as a mission contract becomes claims, evidence, verification, risk state, decision state, action graph, Chronicle entry, and DONE certificate.</p><p><a href="until-done-lab.html" style="display:inline-block;padding:13px 18px;border-radius:999px;background:linear-gradient(135deg,#eaff9b,#5deeff);color:#04110f;font-weight:900;text-decoration:none">Run Until-DONE Lab</a></p></section>`;
  const idx = src.search(/<footer|data-goalos-footer=/i);
  src = idx >= 0 ? src.slice(0, idx) + rail + src.slice(idx) : src + rail;
  fs.writeFileSync(home, src);
}
injectHomeRail();
console.log('GoalOS Until-DONE Mission Control Lab v21 generated');
