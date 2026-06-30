#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = process.cwd();
const site = path.join(root, 'site');
const configPath = path.join(root, 'config', 'action-graph-authority-lab.json');
const cfg = fs.existsSync(configPath) ? JSON.parse(fs.readFileSync(configPath, 'utf8')) : {
  version: '22.0.0',
  routes: ['action-graph-authority-lab.html', 'human-authority-action-lab.html', 'scoped-action-lab.html'],
  scenarios: [
    { id: 'research', label: 'AI research acceptance', objective: 'Move a public-safe AI deliverable into a scoped action graph.', decision: 'decision-review ready', risk: 'medium', allowedActions: 6, blockedActions: 2 }
  ]
};
fs.mkdirSync(site, { recursive: true });

const now = new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');
const sha = value => crypto.createHash('sha256').update(typeof value === 'string' ? value : JSON.stringify(value)).digest('hex');

const graphStages = [
  { id: 'decision-state', label: 'Decision State', rule: 'Evidence has been reviewed; the next step is not execution, but action scoping.', posture: 'ready' },
  { id: 'action-proposal', label: 'Action Proposal', rule: 'Candidate actions are written as explicit nodes with purpose, owner, evidence, and stop condition.', posture: 'ready' },
  { id: 'scope-check', label: 'Scope Check', rule: 'Actions outside mission authority are blocked before they become work.', posture: 'gate' },
  { id: 'proof-requirement', label: 'Proof Requirement', rule: 'Every action must cite the claim, docket item, verifier note, and risk ledger entry that justifies it.', posture: 'gate' },
  { id: 'authority-check', label: 'Human Authority', rule: 'High-impact action remains gated. GoalOS can prepare; a person or designated institution decides.', posture: 'human' },
  { id: 'action-reason', label: 'Action-Reason Trace', rule: 'Reason, tool, permission scope, expected observation, actual observation, validator status, and rollback pointer are logged.', posture: 'trace' },
  { id: 'rollback-path', label: 'Rollback Path', rule: 'No action becomes release-ready unless the rollback target and monitoring condition are recorded.', posture: 'rollback' },
  { id: 'receipt', label: 'Receipt', rule: 'The action plan emits a receipt-ready package with valueMoved = 0 in the public browser demo.', posture: 'receipt' },
  { id: 'chronicle-boundary', label: 'Chronicle Boundary', rule: 'Only completed, scoped, claim-bounded action states may become reusable institutional memory.', posture: 'done' }
];

function actionCandidates(scenario) {
  return [
    { id: 'A1', label: 'Review Evidence Docket', status: 'allowed', owner: 'human reviewer', proof: 'claims matrix + verifier report', rollback: 'return to evidence gathering', reason: 'Reviewer needs a bounded basis for decision.' },
    { id: 'A2', label: 'Request targeted changes', status: 'allowed', owner: 'mission owner', proof: 'risk ledger + contradiction register', rollback: 'preserve previous decision state', reason: 'Open risks must be converted into concrete change requests.' },
    { id: 'A3', label: 'Issue public-safe receipt', status: scenario.risk === 'high-impact' ? 'held' : 'allowed', owner: 'receipt signer', proof: 'redacted docket + public boundary', rollback: 'revoke or supersede receipt', reason: 'Accepted evidence can become a receipt only within the public/private proof boundary.' },
    { id: 'A4', label: 'Execute external action', status: 'blocked', owner: 'not delegated in browser demo', proof: 'missing human authority', rollback: 'not applicable because action is blocked', reason: 'GoalOS demonstration cannot move value, submit forms, contact systems, deploy code, or act externally.' },
    { id: 'A5', label: 'Admit capability pattern', status: scenario.allowedActions > 4 ? 'allowed' : 'held', owner: 'Chronicle steward', proof: 'DONE certificate + replay path', rollback: 'downgrade capability to warning memory', reason: 'Reusable capability requires evidence, replay, and claim boundaries.' },
    { id: 'A6', label: 'Settlement readiness note', status: 'simulated', owner: 'protocol reviewer', proof: 'proof bundle + challenge window', rollback: 'no settlement; valueMoved remains 0', reason: 'The demo can show readiness logic without custody, escrow, staking, or payments.' },
    { id: 'A7', label: 'High-impact release', status: scenario.risk.includes('high') ? 'blocked' : 'held', owner: 'designated authority', proof: 'requires separate authorization', rollback: 'must be specified before release', reason: 'High-impact release is never authorized by a public browser demo.' }
  ];
}

function makeBundle(scenario = cfg.scenarios[0]) {
  const actionGraph = {
    actionGraphId: `GOALOS-ACTION-GRAPH-${scenario.id.toUpperCase()}-SYNTHETIC`,
    scenario: scenario.id,
    objective: scenario.objective,
    decision: scenario.decision,
    authority: 'human final gate',
    nodes: actionCandidates(scenario),
    edges: [
      ['decision-state','action-proposal'], ['action-proposal','scope-check'], ['scope-check','proof-requirement'],
      ['proof-requirement','authority-check'], ['authority-check','action-reason'], ['action-reason','rollback-path'],
      ['rollback-path','receipt'], ['receipt','chronicle-boundary']
    ],
    invariant: 'No high-impact action without scope, trace, validator, human authority, and rollback.',
    valueMoved: 0
  };
  const authorityGate = {
    gateId: `HUMAN-AUTHORITY-${scenario.id.toUpperCase()}-SYNTHETIC`,
    authorityRequired: true,
    browserDemoAuthority: 'none',
    reason: 'The public browser demo prepares an inspectable action state; it does not execute external actions.',
    blockedSurfaces: ['payments','wallets','uploads','forms','external submissions','deployments','credential use','customer data processing'],
    valueMoved: 0
  };
  const actionReasonTrace = graphStages.map((stage, index) => ({
    index: index + 1,
    stage: stage.id,
    label: stage.label,
    rule: stage.rule,
    posture: stage.posture,
    expectedObservation: index < graphStages.length - 1 ? 'advance or block with reason' : 'receipt-ready action state',
    validatorStatus: stage.posture === 'human' ? 'requires human final gate' : 'synthetic pass',
    rollbackPointer: stage.posture === 'rollback' ? 'last-known-good decision state' : 'return to previous safe stage',
    evidencePointer: `demo://evidence/${scenario.id}/${stage.id}`,
    valueMoved: 0
  }));
  const rollbackMap = {
    rollbackMapId: `ROLLBACK-MAP-${scenario.id.toUpperCase()}-SYNTHETIC`,
    lastKnownGoodState: 'governed_decision_state_v0',
    rollbackTargets: actionCandidates(scenario).map(a => ({ actionId: a.id, status: a.status, rollback: a.rollback })),
    monitoringCondition: 'Any unsupported claim, missing proof pointer, or human-authority failure returns the mission to proof work.',
    valueMoved: 0
  };
  const receipt = {
    receiptId: `GOALOS-ACTION-RECEIPT-${scenario.id.toUpperCase()}-SYNTHETIC`,
    issuedAt: now,
    actionGraphHash: sha(actionGraph),
    authorityGateHash: sha(authorityGate),
    rollbackMapHash: sha(rollbackMap),
    status: 'ACTION_GRAPH_READY_FOR_HUMAN_REVIEW_SYNTHETIC',
    publicBoundary: 'browser-local, no user data, no external action, no value moved',
    valueMoved: 0
  };
  const manifest = {
    name: 'GoalOS Action Graph & Human Authority Lab',
    version: cfg.version || '22.0.0',
    generatedAt: now,
    scenario: scenario.id,
    browserLocal: true,
    noUserData: true,
    valueMoved: 0,
    routes: cfg.routes
  };
  return { manifest, actionGraph, authorityGate, actionReasonTrace, rollbackMap, receipt };
}

const bundles = Object.fromEntries(cfg.scenarios.map(s => [s.id, makeBundle(s)]));
const defaultBundle = bundles.research || Object.values(bundles)[0];

function writeJson(name, value) { fs.writeFileSync(path.join(site, name), JSON.stringify(value, null, 2) + '\n'); }
writeJson('action-graph-demo-bundle.json', defaultBundle);
writeJson('scoped-action-plan.json', defaultBundle.actionGraph);
writeJson('human-authority-gate.json', defaultBundle.authorityGate);
writeJson('action-reason-trace.json', defaultBundle.actionReasonTrace);
writeJson('action-rollback-map.json', defaultBundle.rollbackMap);
writeJson('action-graph-receipt.json', defaultBundle.receipt);
writeJson('action-graph-authority-manifest.json', defaultBundle.manifest);

const bundleJson = JSON.stringify(bundles).replace(/</g, '\\u003c');
const configJson = JSON.stringify({ version: cfg.version || '22.0.0', scenarios: cfg.scenarios, stages: graphStages }).replace(/</g, '\\u003c');

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>GoalOS Signoff Pro — Action Graph & Human Authority Lab</title>
<meta name="description" content="A browser-local GoalOS lab showing how a governed decision becomes scoped, proof-bound, rollbackable action without autonomous external execution." />
<style>
:root{--bg:#020807;--panel:rgba(20,37,34,.78);--panel2:rgba(6,14,16,.9);--line:rgba(120,255,222,.34);--line2:rgba(255,232,126,.48);--mint:#75ffd7;--cyan:#72e9ff;--cream:#fff8eb;--gold:#fff08a;--muted:#b9c9ca;--danger:#ff7e9f;--purple:#b7a0ff;--shadow:0 30px 80px rgba(0,0,0,.44),0 0 60px rgba(117,255,215,.12)}
*{box-sizing:border-box}body{margin:0;background:radial-gradient(circle at 75% 20%,rgba(54,255,213,.20),transparent 30%),radial-gradient(circle at 15% 84%,rgba(162,126,255,.16),transparent 31%),linear-gradient(120deg,#020807,#051312 50%,#051018);color:var(--cream);font-family:Inter,ui-sans-serif,system-ui,-apple-system,Segoe UI,Arial,sans-serif;overflow-x:hidden}body:before{content:"";position:fixed;inset:0;background-image:linear-gradient(rgba(255,255,255,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.035) 1px,transparent 1px);background-size:64px 64px;mask-image:linear-gradient(to bottom,rgba(0,0,0,.9),rgba(0,0,0,.18));pointer-events:none}a{color:inherit;text-decoration:none}.nav{position:sticky;top:0;z-index:20;display:flex;align-items:center;justify-content:space-between;padding:18px 5vw;background:rgba(2,7,8,.86);backdrop-filter:blur(20px);border-bottom:1px solid var(--line)}.brand{display:flex;gap:14px;align-items:center}.mark{width:42px;height:42px;border:1px solid var(--line);border-radius:14px;background:radial-gradient(circle,var(--mint),var(--cyan) 32%,transparent 38%);box-shadow:0 0 30px rgba(117,255,215,.5)}.brand b{font-size:12px;letter-spacing:.2em}.brand span{display:block;font-size:10px;letter-spacing:.24em;color:var(--muted)}.navlinks{display:flex;gap:22px;align-items:center;font-size:12px;font-weight:850}.pill{border:1px solid rgba(255,255,255,.2);padding:11px 18px;border-radius:999px;background:rgba(255,255,255,.08)}.primary{background:linear-gradient(135deg,#eaff9b,#5deeff);color:#04110f;border:0;box-shadow:0 0 30px rgba(117,255,215,.32)}button{font:inherit;cursor:pointer;color:inherit;border:1px solid rgba(255,255,255,.22);background:rgba(255,255,255,.09);border-radius:999px;padding:13px 18px;font-weight:900}button.primary{color:#04110f}.hero{min-height:90vh;display:grid;grid-template-columns:minmax(0,1.02fr) minmax(360px,.98fr);gap:54px;align-items:center;width:min(1200px,92vw);margin:0 auto;padding:80px 0}.eyebrow{color:var(--mint);letter-spacing:.35em;text-transform:uppercase;font-weight:900;font-size:12px}.eyebrow:before{content:"";display:inline-block;width:38px;height:1px;background:var(--mint);vertical-align:middle;margin-right:16px;box-shadow:0 0 18px var(--mint)}h1{font-size:clamp(56px,8.2vw,124px);line-height:.86;letter-spacing:-.08em;margin:22px 0 20px}.grad{font-family:Georgia,serif;font-style:italic;font-weight:400;background:linear-gradient(100deg,var(--gold),var(--mint),var(--cyan),var(--purple));-webkit-background-clip:text;color:transparent}.lead{font-size:clamp(18px,2.05vw,24px);line-height:1.5;max-width:700px;color:#edf8f5}.rule{margin:24px 0;padding:18px 20px;border:1px solid var(--line2);border-radius:20px;background:linear-gradient(135deg,rgba(255,240,138,.12),rgba(117,255,215,.09));font-weight:900;color:var(--gold)}.actions{display:flex;flex-wrap:wrap;gap:14px;margin:26px 0}.chips{display:flex;gap:10px;flex-wrap:wrap}.chip{font-size:11px;letter-spacing:.13em;font-weight:900;border:1px solid var(--line);border-radius:999px;padding:9px 12px;background:rgba(4,18,17,.7);color:#cffff4}.console{position:relative;border:1px solid var(--line);border-radius:34px;background:linear-gradient(145deg,rgba(23,57,50,.83),rgba(4,12,14,.86));padding:22px;box-shadow:var(--shadow);overflow:hidden}.console:before{content:"";position:absolute;inset:-70px;background:conic-gradient(from 120deg,transparent,var(--mint),transparent,var(--cyan),transparent);opacity:.16;animation:spin 16s linear infinite}.inner{position:relative;background:rgba(2,8,9,.78);border:1px solid rgba(255,255,255,.08);border-radius:26px;padding:24px;min-height:580px}.topline{display:flex;justify-content:space-between;color:var(--mint);font-size:11px;letter-spacing:.22em;font-weight:900}.orb{width:160px;height:160px;margin:25px auto;border-radius:50%;display:grid;place-items:center;background:radial-gradient(circle,var(--gold),var(--mint) 34%,var(--cyan) 58%,rgba(117,255,215,.05) 59%);box-shadow:0 0 90px rgba(117,255,215,.45);position:relative}.orb:before,.orb:after{content:"";position:absolute;inset:-32px;border:1px dashed rgba(117,255,215,.34);border-radius:50%;animation:spin 12s linear infinite}.orb:after{inset:-58px;border-color:rgba(255,240,138,.25);animation-duration:19s;animation-direction:reverse}.orb b{font-family:Georgia,serif;font-size:74px;color:#06100e}.graph{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:28px}.node{border:1px solid rgba(117,255,215,.35);border-radius:18px;background:rgba(255,255,255,.06);padding:14px;min-height:82px;transition:.35s}.node.active{border-color:var(--gold);box-shadow:0 0 26px rgba(255,240,138,.25);transform:translateY(-3px)}.node.blocked{border-color:rgba(255,126,159,.7);box-shadow:0 0 24px rgba(255,126,159,.22)}.num{color:var(--gold);font-weight:950;letter-spacing:.12em} .node b{display:block;margin-top:5px}.node small{color:var(--muted)}.metrics{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-top:20px}.metric{border:1px solid rgba(255,255,255,.13);border-radius:16px;background:rgba(255,255,255,.06);padding:14px}.metric strong{display:block;color:var(--mint);font-size:26px}.metric span{font-size:10px;letter-spacing:.18em;text-transform:uppercase;color:var(--muted);font-weight:900}.section{width:min(1180px,92vw);margin:0 auto;padding:86px 0}.panel{border:1px solid var(--line);border-radius:30px;background:linear-gradient(145deg,rgba(23,57,50,.72),rgba(4,12,14,.82));padding:30px;box-shadow:var(--shadow)}.lab{display:grid;grid-template-columns:.9fr 1.1fr;gap:24px}.scenario{border:1px solid rgba(255,255,255,.13);background:rgba(255,255,255,.06);border-radius:20px;padding:16px;margin:10px 0;cursor:pointer}.scenario.active{border-color:var(--mint);box-shadow:0 0 22px rgba(117,255,215,.18)}.scenario b{display:block}.scenario span{color:var(--muted);font-size:13px}.trace{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;background:#020808;border:1px solid rgba(255,255,255,.14);border-radius:18px;padding:18px;min-height:210px;white-space:pre-wrap;color:#d4fff2}.tabs{display:flex;flex-wrap:wrap;gap:10px;margin-bottom:14px}.tabs button{padding:10px 14px}.tabs button.active{background:rgba(117,255,215,.18);border-color:var(--mint)}pre{white-space:pre-wrap;word-break:break-word;margin:0;font-size:12px;line-height:1.55;color:#d5fff3}.footer{border-top:1px solid rgba(117,255,215,.24);background:rgba(0,0,0,.46);padding:42px 5vw;display:flex;justify-content:space-between;gap:28px;color:#d4e4e4}.rail{width:min(900px,92vw);margin:28px auto 54px;border:1px solid var(--line);border-radius:999px;padding:12px 18px;text-align:center;background:#020808;color:#cfeee8;font-size:13px}.rail b{color:var(--gold)}@keyframes spin{to{transform:rotate(360deg)}}@media(max-width:900px){.hero,.lab{grid-template-columns:1fr}.navlinks{display:none}.metrics{grid-template-columns:repeat(2,1fr)}h1{font-size:58px}.footer{display:block}.graph{grid-template-columns:1fr 1fr}}
</style>
</head>
<body>
<nav class="nav"><a class="brand" href="./"><span class="mark"></span><span><b>GOALOS SIGNOFF PRO</b><span>ACTION GRAPH AUTHORITY LAB</span></span></a><div class="navlinks"><a href="browser-beta.html">Browser beta</a><a href="mission-001.html">Mission 001</a><a href="governed-decision-state-lab.html">Decision state</a><a href="until-done-lab.html">Until DONE</a><a href="validator-mesh-lab.html">Verifier mesh</a><a href="no-user-data.html">Data posture</a></div><a class="pill primary" href="browser-beta.html">Open browser beta</a></nav>
<main>
<section class="hero">
  <div>
    <div class="eyebrow">Proof-to-action control</div>
    <h1>Action is not authority. <span class="grad">Proof earns scope.</span></h1>
    <p class="lead">GoalOS turns an accepted decision state into a scoped action graph: reason, owner, proof requirement, human authority, rollback path, and receipt boundary.</p>
    <div class="rule">No high-impact action without scope, trace, validator, human authority, and rollback.</div>
    <div class="actions"><button class="primary" data-run>Run action graph</button><button data-download>Download action package</button><a class="pill" href="governed-decision-state-lab.html">Inspect decision state</a></div>
    <div class="chips"><span class="chip">BROWSER-LOCAL</span><span class="chip">NO INPUT</span><span class="chip">NO UPLOAD</span><span class="chip">NO WALLET</span><span class="chip">NO VALUE MOVED</span></div>
  </div>
  <div class="console" aria-label="Proof-to-action console"><div class="inner"><div class="topline"><span>SCOPED ACTION CONSOLE</span><span id="mode">AWAITING RUN</span></div><div class="orb"><b>α</b></div><div class="graph" id="nodeGraph"></div><div class="metrics"><div class="metric"><strong id="scopedMetric">0</strong><span>Scoped actions</span></div><div class="metric"><strong id="blockedMetric">0</strong><span>Blocked actions</span></div><div class="metric"><strong id="authorityMetric">HOLD</strong><span>Human gate</span></div><div class="metric"><strong>0</strong><span>Value moved</span></div></div></div></div>
</section>
<section class="section"><div class="lab"><div class="panel"><div class="eyebrow">Choose scenario</div><h2>One decision. Many possible actions.</h2><p class="lead" style="font-size:18px">The lab shows why GoalOS does not jump from “looks right” to “do it.” It converts the decision into bounded actions and blocks anything outside authority.</p><div id="scenarios"></div><div class="actions"><button class="primary" data-run>Run action graph</button><button data-reset>Reset</button></div><div class="trace" id="trace">System ready. Awaiting governed decision state.</div></div><div class="panel"><div class="eyebrow">Inspectable package</div><h2>Action Graph artifact</h2><div class="tabs" id="tabs"></div><pre id="tabPanel"></pre></div></div></section>
<section class="section"><div class="panel"><div class="eyebrow">Core GoalOS idea</div><h2>Proof-to-action is a boundary, not an autopilot.</h2><div class="graph" style="grid-template-columns:repeat(4,1fr)"><div class="node"><span class="num">01</span><b>Decision state</b><small>Evidence supports a decision.</small></div><div class="node"><span class="num">02</span><b>Action graph</b><small>Next actions become explicit nodes.</small></div><div class="node"><span class="num">03</span><b>Authority gate</b><small>Human or institutional permission remains final.</small></div><div class="node"><span class="num">04</span><b>Receipt boundary</b><small>The public demo signs nothing, moves nothing, and records no user data.</small></div></div></div></section>
</main>
<footer class="footer" data-goalos-footer="v12"><div><b>GoalOS Signoff Pro</b><p>AI-era work acceptance · evidence review · scoped action graphs · human authority.</p></div><div class="navlinks" style="display:flex"><a href="privacy.html">Privacy</a><a href="terms.html">Terms</a><a href="no-user-data.html">No User Data</a><a href="agialpha-token-boundary.html">$AGIALPHA Boundary</a></div></footer>
<div class="rail" data-goalos-legal-rail="v12"><b>Public site rule</b> No forms · no inputs · no uploads · no cookies · no analytics · no wallets · no payments · no personal or confidential data.</div>
<script>
const CONFIG = ${configJson};
const BUNDLES = ${bundleJson};
let scenario = CONFIG.scenarios[0].id;
let step = -1;
let timer = null;
const $ = s => document.querySelector(s);
const all = s => [...document.querySelectorAll(s)];
const activeScenario = () => CONFIG.scenarios.find(s => s.id === scenario) || CONFIG.scenarios[0];
const bundle = () => BUNDLES[scenario] || Object.values(BUNDLES)[0];
function trace(line){ $('#trace').textContent += '\\n' + line; $('#trace').scrollTop = $('#trace').scrollHeight; }
function renderScenarios(){ $('#scenarios').innerHTML = CONFIG.scenarios.map(s=>'<div class="scenario '+(s.id===scenario?'active':'')+'" data-scenario="'+s.id+'"><b>'+s.label+'</b><span>'+s.objective+'</span></div>').join(''); all('[data-scenario]').forEach(el=>el.onclick=()=>{ scenario=el.dataset.scenario; reset(); }); }
function renderGraph(){ const nodes = ['Decision State','Action Proposal','Scope Check','Proof Requirement','Human Authority','Action-Reason','Rollback Path','Receipt','Chronicle Boundary']; $('#nodeGraph').innerHTML = nodes.map((n,i)=>'<div class="node" data-node="'+i+'"><span class="num">'+String(i+1).padStart(2,'0')+'</span><b>'+n+'</b><small>'+CONFIG.stages[i].posture+'</small></div>').join(''); }
function renderTabs(){ const tabs = ['actionGraph','authorityGate','actionReasonTrace','rollbackMap','receipt','manifest']; $('#tabs').innerHTML = tabs.map((t,i)=>'<button data-tab="'+t+'" class="'+(i===0?'active':'')+'">'+t.replace(/([A-Z])/g,' $1')+'</button>').join(''); all('[data-tab]').forEach(b=>b.onclick=()=>showTab(b.dataset.tab)); showTab('actionGraph'); }
function showTab(name){ all('[data-tab]').forEach(b=>b.classList.toggle('active', b.dataset.tab===name)); $('#tabPanel').textContent = JSON.stringify(bundle()[name], null, 2); }
function setProgress(i){ const stage = CONFIG.stages[i]; $('#mode').textContent = i >= CONFIG.stages.length-1 ? 'RECEIPT READY' : stage.label.toUpperCase(); all('[data-node]').forEach((n,k)=>{ n.classList.toggle('active',k===i); n.classList.toggle('blocked', stage && stage.posture==='human' && k===i); }); const b = bundle(); const scoped = b.actionGraph.nodes.filter(n=>n.status==='allowed' || n.status==='simulated').length; const blocked = b.actionGraph.nodes.filter(n=>n.status==='blocked').length; $('#scopedMetric').textContent = Math.min(scoped, Math.max(0,i)); $('#blockedMetric').textContent = i >= 2 ? blocked : 0; $('#authorityMetric').textContent = i >= 4 ? 'FINAL' : 'HOLD'; }
function reset(){ clearInterval(timer); step = -1; renderScenarios(); renderGraph(); renderTabs(); const sc = activeScenario(); $('#trace').textContent = 'System ready. Scenario: '+sc.label+'. Decision: '+sc.decision+'.'; $('#mode').textContent = 'AWAITING RUN'; $('#scopedMetric').textContent = 0; $('#blockedMetric').textContent = 0; $('#authorityMetric').textContent = 'HOLD'; }
function run(){ reset(); timer = setInterval(()=>{ step++; if(step >= CONFIG.stages.length){ clearInterval(timer); trace('Receipt-ready action state emitted. No external action. No value moved.'); showTab('receipt'); return; } const s = CONFIG.stages[step]; setProgress(step); trace((step+1)+'. '+s.label+': '+s.rule); if(s.posture === 'human') trace('   Human final gate: action is prepared, not self-authorized.'); }, 650); }
function download(){ const data = JSON.stringify(bundle(), null, 2); const blob = new Blob([data], {type:'application/json'}); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'goalos-action-graph-demo-bundle.json'; a.click(); URL.revokeObjectURL(a.href); }
all('[data-run]').forEach(b=>b.onclick=run); all('[data-reset]').forEach(b=>b.onclick=reset); all('[data-download]').forEach(b=>b.onclick=download);
reset();
</script>
</body>
</html>`;

for (const route of cfg.routes) fs.writeFileSync(path.join(site, route), html);

const homePath = path.join(site, 'index.html');
if (fs.existsSync(homePath)) {
  let home = fs.readFileSync(homePath, 'utf8');
  if (!home.includes('action-graph-authority-lab.html')) {
    const rail = `<section class="goalos-home-demo-rail goalos-v22-action-graph" style="width:min(980px,92vw);margin:80px auto;padding:34px;border:1px solid rgba(120,255,222,.34);border-radius:28px;background:linear-gradient(145deg,rgba(23,57,50,.76),rgba(4,12,14,.84));box-shadow:0 30px 80px rgba(0,0,0,.38)"><div style="color:#75ffd7;letter-spacing:.28em;text-transform:uppercase;font-weight:900;font-size:12px">Proof-to-action control</div><h2 style="font-size:clamp(36px,5vw,72px);line-height:.92;letter-spacing:-.06em;margin:14px 0;color:#fff8eb">Turn a decision into a scoped action graph.</h2><p style="max-width:760px;color:#d9eeee;font-size:18px;line-height:1.55">GoalOS does not act because output exists. It prepares bounded actions with reason, proof, authority, rollback, and receipt boundaries.</p><p><a href="action-graph-authority-lab.html" style="display:inline-block;padding:14px 20px;border-radius:999px;background:linear-gradient(135deg,#eaff9b,#5deeff);color:#04110f;font-weight:900;text-decoration:none">Open Action Graph Lab</a></p></section>`;
    const footerIdx = home.search(/<footer\b/i);
    home = footerIdx >= 0 ? home.slice(0, footerIdx) + rail + home.slice(footerIdx) : home.replace(/<\/body>/i, rail + '</body>');
    fs.writeFileSync(homePath, home);
  }
}

console.log(`GoalOS Action Graph & Human Authority Lab v${cfg.version || '22.0.0'} generated ${cfg.routes.length} routes at ${site}`);
