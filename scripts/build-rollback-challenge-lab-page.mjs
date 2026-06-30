#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const site = path.join(root, 'site');
fs.mkdirSync(site, { recursive: true });
const cfgPath = path.join(root, 'config', 'rollback-challenge-lab.json');
const cfg = fs.existsSync(cfgPath) ? JSON.parse(fs.readFileSync(cfgPath, 'utf8')) : { version: '19.0.0' };

const legalRail = 'No forms · no inputs · no uploads · no cookies · no analytics · no wallets · no payments · no personal or confidential data.';
const claimBoundary = 'Browser-local synthetic demonstration. No certification claim, no external audit claim, no value movement, no active settlement, no custody, no staking, no autonomous production authority.';

const candidates = [
  {
    id: 'C0',
    name: 'Persuasive release note',
    class: 'output-only',
    outcome: 'blocked',
    reason: 'No rollback target. No replay path. No release authority.',
    score: 72,
    proof: 12,
    rollback: 0,
    challenge: 11,
    risk: 64
  },
  {
    id: 'C1',
    name: 'Proof packet with contradiction',
    class: 'challenged',
    outcome: 'rolled_back',
    reason: 'Challenge window found unsupported claim boundary drift.',
    score: 84,
    proof: 78,
    rollback: 71,
    challenge: 38,
    risk: 49
  },
  {
    id: 'C2',
    name: 'Canary release candidate',
    class: 'paused',
    outcome: 'paused',
    reason: 'Canary monitor found delayed-risk signal. Release held.',
    score: 88,
    proof: 86,
    rollback: 82,
    challenge: 79,
    risk: 42
  },
  {
    id: 'C3',
    name: 'Rollbackable proof-carrying artifact',
    class: 'release_ready',
    outcome: 'release_ready',
    reason: 'Proof, replay, rollback, canary, challenge, scope, and human gate clear.',
    score: 91,
    proof: 94,
    rollback: 96,
    challenge: 92,
    risk: 12
  }
];

const bundle = {
  manifest: {
    lab: 'GoalOS Signoff Pro — Rollback & Challenge Window Lab',
    version: cfg.version || '19.0.0',
    generatedAt: new Date().toISOString(),
    publicSitePosture: legalRail,
    claimBoundary
  },
  mission: {
    objective: 'Demonstrate why release authority requires proof, challenge clearance, canary monitoring, and rollback readiness.',
    doctrine: 'No proof, no propagation. No rollback, no release.',
    userOutcome: 'Understand how GoalOS prevents persuasive but unsafe AI output from becoming institutional default.'
  },
  candidates,
  challengeWindowRecord: {
    windowId: 'CW-001-SYNTHETIC',
    phase: ['commit', 'review', 'challenge', 'replay', 'decision'],
    checks: ['proof integrity', 'claim boundary', 'replay path', 'rollback target', 'canary monitor', 'human authority'],
    result: {
      blocked: ['C0'],
      rolledBack: ['C1'],
      paused: ['C2'],
      releaseReady: ['C3']
    }
  },
  rollbackReceipt: {
    receiptId: 'ROLLBACK-001-SYNTHETIC',
    rollbackTarget: 'last-known-good-proof-carrying-artifact-v0',
    rollbackReason: 'challenge-window contradiction and boundary drift in candidate C1',
    reversible: true,
    valueMoved: 0
  },
  canaryMonitorReport: {
    canaryId: 'CANARY-001-SYNTHETIC',
    scope: 'public-safe browser simulation',
    delayedRiskSignal: 'detected in C2',
    promotionState: 'held for review'
  },
  releaseReadinessCertificate: {
    candidate: 'C3',
    releaseState: 'simulation_release_ready',
    gates: {
      proofValid: true,
      evalPass: true,
      rollbackReady: true,
      canaryReady: true,
      scopeAuthorized: true,
      challengeCleared: true,
      humanGateRequired: true
    }
  },
  failureMemoryEntry: {
    chronicleRule: 'Rejected or rolled-back traces remain as warnings, not reusable authority.',
    reusableWarning: 'High score without rollback is not release-grade work.',
    nextMissionEffect: 'future routing penalizes proof debt and missing rollback plans'
  }
};

function writeJson(name, value) {
  fs.writeFileSync(path.join(site, name), `${JSON.stringify(value, null, 2)}\n`);
}
writeJson('rollback-challenge-demo-bundle.json', bundle);
writeJson('challenge-window-record.json', bundle.challengeWindowRecord);
writeJson('rollback-receipt-demo.json', bundle.rollbackReceipt);
writeJson('canary-monitor-report.json', bundle.canaryMonitorReport);
writeJson('release-readiness-certificate.json', bundle.releaseReadinessCertificate);
writeJson('failure-memory-entry.json', bundle.failureMemoryEntry);
writeJson('rollback-challenge-manifest.json', bundle.manifest);

const jsonBundle = JSON.stringify(bundle).replace(/</g, '\\u003c');
const css = String.raw`
:root{--bg:#020706;--panel:rgba(13,31,28,.72);--panel2:rgba(23,53,47,.78);--line:rgba(120,255,220,.26);--text:#fff8ec;--muted:#b8cac6;--mint:#6fffe0;--cyan:#70d8ff;--gold:#ffe777;--violet:#b99cff;--red:#ff7b98;--green:#aaffc6;--shadow:0 30px 120px rgba(53,255,207,.12)}*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:radial-gradient(circle at 72% 22%,rgba(69,255,218,.22),transparent 30%),radial-gradient(circle at 18% 78%,rgba(158,114,255,.16),transparent 28%),linear-gradient(135deg,#020706,#031310 42%,#07151f);color:var(--text);font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;overflow-x:hidden}.grid:before{content:"";position:fixed;inset:0;z-index:-3;background-image:linear-gradient(rgba(255,255,255,.045) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.045) 1px,transparent 1px);background-size:72px 72px;mask-image:linear-gradient(to bottom,rgba(0,0,0,.85),rgba(0,0,0,.2));}.stars{position:fixed;inset:0;z-index:-2;pointer-events:none}.stars i{position:absolute;width:3px;height:3px;border-radius:50%;background:var(--mint);box-shadow:0 0 16px var(--mint);opacity:.72;animation:drift 12s ease-in-out infinite alternate}@keyframes drift{to{transform:translate3d(30px,-18px,0);opacity:.32}}header{position:sticky;top:0;z-index:20;display:flex;align-items:center;justify-content:space-between;padding:26px 7vw;background:rgba(2,7,7,.82);backdrop-filter:blur(24px);border-bottom:1px solid var(--line)}.brand{display:flex;align-items:center;gap:14px;font-weight:900;letter-spacing:.16em;text-transform:uppercase;font-size:12px}.mark{width:42px;height:42px;border:1px solid var(--line);border-radius:14px;background:radial-gradient(circle,var(--mint),#0a1e1a 50%,#07110f);box-shadow:0 0 34px rgba(111,255,224,.45)}nav{display:flex;gap:24px;align-items:center;flex-wrap:wrap}nav a{color:var(--text);text-decoration:none;font-weight:800;font-size:13px}.pill{border:1px solid rgba(255,255,255,.22);border-radius:999px;padding:13px 18px;background:rgba(255,255,255,.08)}.cta{background:linear-gradient(135deg,#f5ff9b,#63f3ff);color:#01110e;border:0;border-radius:999px;padding:15px 22px;font-weight:1000;text-decoration:none;box-shadow:0 18px 44px rgba(111,255,224,.25)}main{position:relative}.hero{min-height:calc(100vh - 94px);display:grid;grid-template-columns:1.03fr .97fr;gap:54px;align-items:center;width:min(1240px,88vw);margin:0 auto;padding:92px 0 70px}.eyebrow{display:flex;gap:12px;align-items:center;color:var(--mint);font-size:12px;letter-spacing:.42em;text-transform:uppercase;font-weight:1000}.eyebrow:before{content:"";width:38px;height:1px;background:var(--mint);box-shadow:0 0 15px var(--mint)}h1{font-size:clamp(58px,7.4vw,128px);line-height:.82;letter-spacing:-.09em;margin:24px 0 28px}.accent{font-family:Georgia,serif;font-style:italic;letter-spacing:-.06em;background:linear-gradient(100deg,var(--gold),var(--mint),var(--cyan),var(--violet));-webkit-background-clip:text;background-clip:text;color:transparent}.lead{font-size:clamp(19px,2vw,27px);line-height:1.35;color:#f4fbf7;max-width:700px}.notice{border:1px solid rgba(255,231,119,.36);background:linear-gradient(135deg,rgba(255,231,119,.14),rgba(111,255,224,.08));border-radius:24px;padding:20px 22px;margin:30px 0;max-width:720px}.controls{display:flex;gap:14px;flex-wrap:wrap}.button{appearance:none;border:1px solid rgba(255,255,255,.22);border-radius:999px;padding:15px 22px;background:rgba(255,255,255,.1);color:var(--text);font-weight:1000;cursor:pointer}.button.primary{background:linear-gradient(135deg,#f6ff9b,#5df5ff);color:#00110f;border:0}.chips{display:flex;gap:10px;flex-wrap:wrap;margin-top:26px}.chip{border:1px solid var(--line);border-radius:999px;color:#ddfff8;background:rgba(4,23,20,.66);padding:9px 13px;font-size:11px;letter-spacing:.12em;text-transform:uppercase;font-weight:1000}.console{position:relative;border:1px solid var(--line);background:linear-gradient(145deg,rgba(36,72,65,.8),rgba(5,14,17,.82));box-shadow:var(--shadow);border-radius:38px;padding:28px;min-height:610px;overflow:hidden}.console:after{content:"";position:absolute;inset:auto -15% -18% 30%;height:260px;background:radial-gradient(circle,rgba(111,255,224,.24),transparent 62%);filter:blur(3px)}.consoleHead{display:flex;justify-content:space-between;color:var(--mint);font-size:11px;letter-spacing:.28em;text-transform:uppercase;font-weight:1000;margin-bottom:22px}.stageGrid{display:grid;grid-template-columns:1fr 1.15fr;gap:22px}.steps{display:grid;gap:12px}.step{border:1px solid var(--line);background:rgba(2,13,12,.7);border-radius:17px;padding:17px;display:grid;grid-template-columns:42px 1fr;gap:12px;align-items:start;transition:.35s transform,.35s border-color,.35s background}.step.active{transform:translateX(8px);border-color:var(--mint);background:rgba(40,105,90,.5);box-shadow:0 0 30px rgba(111,255,224,.14)}.step b{color:var(--gold)}.step strong{display:block;font-size:17px}.step small{color:var(--muted)}.orbWrap{position:relative;min-height:396px;border:1px solid rgba(255,255,255,.16);border-radius:24px;background:radial-gradient(circle at center,rgba(111,255,224,.18),rgba(0,0,0,.4) 58%);overflow:hidden}.orb{position:absolute;left:50%;top:50%;width:154px;height:154px;transform:translate(-50%,-50%);border-radius:50%;display:grid;place-items:center;background:radial-gradient(circle at 40% 35%,#f5ff99,#69ffe2 48%,#3459ff);box-shadow:0 0 62px rgba(111,255,224,.62);font-family:Georgia,serif;font-size:66px;color:#03110e}.ring{position:absolute;left:50%;top:50%;border:1px dashed rgba(255,255,255,.25);border-radius:50%;transform:translate(-50%,-50%);animation:spin 18s linear infinite}.r1{width:240px;height:240px}.r2{width:318px;height:318px;animation-duration:28s}.r3{width:390px;height:390px;animation-duration:36s;animation-direction:reverse}@keyframes spin{to{transform:translate(-50%,-50%) rotate(360deg)}}.node{position:absolute;border:1px solid var(--line);background:#04100e;border-radius:18px;padding:12px 14px;min-width:116px;text-align:center;font-size:12px;font-weight:1000;box-shadow:0 16px 38px rgba(0,0,0,.25)}.node span{display:block;color:var(--muted);font-size:10px;margin-top:4px}.n0{left:4%;top:10%}.n1{right:5%;top:11%}.n2{left:2%;bottom:16%}.n3{right:5%;bottom:16%}.panelSec{width:min(1240px,88vw);margin:0 auto;padding:72px 0}.sectionTitle{font-size:clamp(42px,5.6vw,86px);line-height:.92;letter-spacing:-.075em;margin:0 0 22px}.labGrid{display:grid;grid-template-columns:.92fr 1.08fr;gap:28px}.card{border:1px solid rgba(255,255,255,.18);border-radius:28px;background:linear-gradient(145deg,rgba(31,52,48,.78),rgba(8,18,22,.74));padding:28px;box-shadow:var(--shadow)}.candidateList{display:grid;gap:14px}.candidate{border:1px solid rgba(255,255,255,.14);border-radius:20px;padding:18px;display:grid;grid-template-columns:54px 1fr auto;gap:16px;align-items:center;background:rgba(0,0,0,.22);transition:.35s}.candidate.good{border-color:rgba(170,255,198,.54)}.candidate.warn{border-color:rgba(255,231,119,.5)}.candidate.bad{border-color:rgba(255,123,152,.45)}.candidate b{font-size:22px;color:var(--gold)}.candidate strong{display:block;font-size:18px}.candidate small{color:var(--muted)}.badge{border-radius:999px;padding:8px 11px;font-size:10px;text-transform:uppercase;letter-spacing:.1em;font-weight:1000;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.14)}.trace{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;background:#020807;border:1px solid rgba(255,255,255,.14);border-radius:22px;padding:20px;min-height:300px;white-space:pre-wrap;color:#d8fff7;line-height:1.55;overflow:auto}.metricGrid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-top:18px}.metric{border:1px solid rgba(255,255,255,.14);border-radius:18px;padding:18px;background:rgba(255,255,255,.06)}.metric strong{display:block;font-size:32px;color:var(--gold);line-height:1}.metric span{color:var(--muted);font-size:11px;letter-spacing:.16em;text-transform:uppercase;font-weight:1000}.tabs{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px}.tab{border:1px solid rgba(255,255,255,.2);background:rgba(255,255,255,.08);color:var(--text);border-radius:999px;padding:11px 14px;font-weight:900;cursor:pointer}.tab.active{background:rgba(111,255,224,.18);border-color:var(--mint)}pre{margin:0;white-space:pre-wrap;color:#dffef7;line-height:1.45;font-size:13px}.doctrine{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}.doctrine .card h3{font-size:32px;line-height:.95;letter-spacing:-.055em;margin:10px 0}.footer{border-top:1px solid rgba(255,255,255,.14);background:rgba(0,0,0,.36);padding:48px 7vw;display:flex;justify-content:space-between;gap:30px;flex-wrap:wrap}.footer a{color:var(--mint);text-decoration:none;font-weight:900;margin-right:16px}.legalRail{width:min(1040px,88vw);margin:28px auto 52px;border:1px solid var(--line);border-radius:999px;background:rgba(0,0,0,.64);padding:14px 22px;text-align:center;color:#dffef7;font-size:12px}.legalRail b{color:var(--gold)}@media(max-width:980px){.hero,.labGrid{grid-template-columns:1fr}.stageGrid{grid-template-columns:1fr}.doctrine{grid-template-columns:1fr}.metricGrid{grid-template-columns:repeat(2,1fr)}nav{display:none}h1{font-size:64px}.console{min-height:auto}.orbWrap{min-height:340px}}`;

const script = String.raw`
const DATA = ${jsonBundle};
const steps = Array.from(document.querySelectorAll('.step'));
const trace = document.querySelector('[data-trace]');
const metrics = {
  blocked: document.querySelector('[data-metric="blocked"]'),
  rollback: document.querySelector('[data-metric="rollback"]'),
  challenge: document.querySelector('[data-metric="challenge"]'),
  readiness: document.querySelector('[data-metric="readiness"]')
};
const tabs = Array.from(document.querySelectorAll('[data-tab]'));
const jsonPanel = document.querySelector('[data-json-panel]');
const candidates = Array.from(document.querySelectorAll('.candidate'));
const tabData = {
  challenge: DATA.challengeWindowRecord,
  rollback: DATA.rollbackReceipt,
  canary: DATA.canaryMonitorReport,
  release: DATA.releaseReadinessCertificate,
  memory: DATA.failureMemoryEntry
};
function write(text){ trace.textContent += text + '\n'; trace.scrollTop = trace.scrollHeight; }
function renderTab(key){
  tabs.forEach(t => t.classList.toggle('active', t.dataset.tab === key));
  jsonPanel.textContent = JSON.stringify(tabData[key], null, 2);
}
function reset(){
  trace.textContent = 'System ready. Awaiting challenge-window run.';
  steps.forEach(s => s.classList.remove('active'));
  candidates.forEach(c => c.classList.remove('good','warn','bad'));
  metrics.blocked.textContent = '0'; metrics.rollback.textContent = '0'; metrics.challenge.textContent = '0'; metrics.readiness.textContent = '0%';
  renderTab('challenge');
}
async function run(){
  reset(); trace.textContent = '';
  const flow = [
    ['commit','GoalOSCommit sealed: objective, proof requirement, rollback obligation, claim boundary.'],
    ['execute','Bounded run emits hashes, proof packets, cost/risk ledger, and candidate release record.'],
    ['challenge','Challenge window opens: contradictions, boundary drift, replay gaps, validator conflict.'],
    ['canary','Canary monitor checks delayed risk before authority expands.'],
    ['rollback','Rollback drill tests last-known-good artifact and recovery receipt.'],
    ['release','Only C3 reaches simulation release-readiness; human authority remains final gate.']
  ];
  let i = 0;
  for (const [id,line] of flow){
    const el = document.querySelector('[data-step="' + id + '"]');
    if(el) el.classList.add('active');
    write('• ' + line);
    await new Promise(r => setTimeout(r, 430));
    i++;
    metrics.challenge.textContent = String(i);
  }
  DATA.candidates.forEach((c, idx) => {
    const el = document.querySelector('[data-candidate="' + c.id + '"]');
    const cls = c.outcome === 'release_ready' ? 'good' : c.outcome === 'blocked' || c.outcome === 'rolled_back' ? 'bad' : 'warn';
    if(el) el.classList.add(cls);
    setTimeout(() => write(c.id + ': ' + c.reason), 280 + idx * 180);
  });
  setTimeout(() => { metrics.blocked.textContent = '3'; metrics.rollback.textContent = '1'; metrics.readiness.textContent = '100%'; renderTab('release'); }, 1300);
}
function downloadBundle(){
  const blob = new Blob([JSON.stringify(DATA, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'goalos-rollback-challenge-demo-bundle.json'; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 500);
}
document.querySelector('[data-run]')?.addEventListener('click', run);
document.querySelector('[data-reset]')?.addEventListener('click', reset);
document.querySelector('[data-download]')?.addEventListener('click', downloadBundle);
tabs.forEach(t => t.addEventListener('click', () => renderTab(t.dataset.tab)));
reset();`;

const nav = `<header><div class="brand"><div class="mark"></div><div>GoalOS Signoff Pro<br><span style="color:#9fb8b2;font-size:10px;letter-spacing:.18em">Rollback Challenge Lab</span></div></div><nav><a href="./index.html">Institution</a><a href="./mission-001.html">Mission 001</a><a href="./proof-gradient-lab.html">Selection gate</a><a href="./governed-decision-state-lab.html">Decision state</a><a href="./proof-boundary-lab.html">Boundary</a><a href="./proof-settlement-lab.html">Settlement</a></nav><a class="cta" href="./browser-beta.html">Open browser beta</a></header>`;
const footer = `<footer class="footer" data-goalos-footer="v12"><div><strong>GoalOS Signoff Pro</strong><p style="color:#b8cac6">Proof-to-acceptance · challenge windows · rollback receipts · human authority.</p></div><div><a href="./privacy.html">Privacy</a><a href="./terms.html">Terms</a><a href="./no-user-data.html">No User Data</a><a href="./agialpha-token-boundary.html">$AGIALPHA Boundary</a></div></footer><div class="legalRail" data-goalos-legal-rail="v12"><b>Public site rule</b> ${legalRail}</div>`;

const page = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Rollback & Challenge Window Lab — GoalOS Signoff Pro</title><meta name="description" content="A browser-local demonstration of GoalOS challenge windows, rollback receipts, canary monitoring, and release-readiness gates."><style>${css}</style></head><body class="grid"><div class="stars" aria-hidden="true">${Array.from({length:40},(_,i)=>`<i style="left:${(i*37)%100}%;top:${(i*61)%100}%;animation-delay:${(i%9)*.4}s"></i>`).join('')}</div>${nav}<main><section class="hero"><div><div class="eyebrow">Rollback before release</div><h1>Trust is earned when failure is <span class="accent">reversible.</span></h1><p class="lead">GoalOS does not turn persuasive AI output into authority. It opens a challenge window, tests replay, runs a canary, checks rollback readiness, and records what failed before anything can propagate.</p><div class="notice"><strong>No rollback, no release.</strong><br>High scores are advisory. Proof, challenge clearance, canary monitoring, and rollback receipts decide whether work may become release-ready.</div><div class="controls"><button class="button primary" data-run>Run challenge window</button><button class="button" data-reset>Reset</button><button class="button" data-download>Download demo bundle</button></div><div class="chips"><span class="chip">Browser-local</span><span class="chip">No input</span><span class="chip">No upload</span><span class="chip">No value moved</span></div></div><div class="console"><div class="consoleHead"><span>Proof-to-release console</span><span>Review mode</span></div><div class="stageGrid"><div class="steps"><div class="step" data-step="commit"><b>01</b><div><strong>Commit</strong><small>Mission and rollback obligation sealed.</small></div></div><div class="step" data-step="execute"><b>02</b><div><strong>Execute</strong><small>Bounded work emits proof packets.</small></div></div><div class="step" data-step="challenge"><b>03</b><div><strong>Challenge</strong><small>Claims, contradictions, and replay are contested.</small></div></div><div class="step" data-step="canary"><b>04</b><div><strong>Canary</strong><small>Limited release surface watches delayed risk.</small></div></div><div class="step" data-step="rollback"><b>05</b><div><strong>Rollback</strong><small>Recovery receipt proves reversibility.</small></div></div><div class="step" data-step="release"><b>06</b><div><strong>Release-ready</strong><small>Human authority remains the final gate.</small></div></div></div><div class="orbWrap"><div class="ring r1"></div><div class="ring r2"></div><div class="ring r3"></div><div class="orb">α</div><div class="node n0">Challenge<span>window</span></div><div class="node n1">Canary<span>monitor</span></div><div class="node n2">Rollback<span>receipt</span></div><div class="node n3">Memory<span>warning</span></div></div></div></div></section><section class="panelSec" id="lab"><div class="eyebrow">Release authority is earned</div><h2 class="sectionTitle">Four candidates enter. Only rollbackable proof can advance.</h2><div class="labGrid"><div class="card"><div class="candidateList">${candidates.map(c=>`<div class="candidate" data-candidate="${c.id}"><b>${c.id}</b><div><strong>${c.name}</strong><small>${c.reason}</small></div><span class="badge">${c.outcome.replaceAll('_',' ')}</span></div>`).join('')}</div><div class="metricGrid"><div class="metric"><strong data-metric="blocked">0</strong><span>blocked / held</span></div><div class="metric"><strong data-metric="rollback">0</strong><span>rollback receipts</span></div><div class="metric"><strong data-metric="challenge">0</strong><span>challenge phases</span></div><div class="metric"><strong data-metric="readiness">0%</strong><span>release readiness</span></div></div></div><div class="card"><h3 style="font-size:34px;letter-spacing:-.055em;margin:0 0 14px">Evidence-state trace</h3><div class="trace" data-trace></div></div></div></section><section class="panelSec"><div class="labGrid"><div class="card"><div class="eyebrow">Inspect the receipts</div><h2 class="sectionTitle">The system remembers the failure without granting it authority.</h2><p class="lead" style="font-size:20px">Rejected and rolled-back traces become warnings. They can improve future routing, but they cannot become trusted institutional memory, reusable capability, or settlement-ready work.</p></div><div class="card"><div class="tabs"><button class="tab active" data-tab="challenge">Challenge</button><button class="tab" data-tab="rollback">Rollback</button><button class="tab" data-tab="canary">Canary</button><button class="tab" data-tab="release">Release</button><button class="tab" data-tab="memory">Memory</button></div><pre data-json-panel></pre></div></div></section><section class="panelSec"><div class="eyebrow">Institutional release law</div><div class="doctrine"><div class="card"><b>01</b><h3>Challenge before authority.</h3><p>Accepted work must survive a window where contradictions, missing replay, evaluator disagreement, and boundary drift can be surfaced.</p></div><div class="card"><b>02</b><h3>Rollback before release.</h3><p>If the system cannot return to a known-good state, the candidate does not deserve expansion.</p></div><div class="card"><b>03</b><h3>Failure becomes warning.</h3><p>GoalOS preserves failures as institutional caution, not as reusable authority.</p></div></div></section></main>${footer}<script>${script}</script></body></html>`;

for (const route of ['rollback-challenge-lab.html', 'challenge-window-lab.html']) {
  fs.writeFileSync(path.join(site, route), page);
}

function insertHomepageRail() {
  const indexPath = path.join(site, 'index.html');
  if (!fs.existsSync(indexPath)) return;
  let html = fs.readFileSync(indexPath, 'utf8');
  if (html.includes('rollback-challenge-lab.html')) return;
  const rail = `<section class="goalos-extension-card" data-goalos-extension="rollback-challenge-v19" style="max-width:1040px;margin:72px auto;padding:34px;border:1px solid rgba(111,255,224,.28);border-radius:28px;background:linear-gradient(135deg,rgba(22,56,50,.82),rgba(5,15,20,.72));"><p style="color:#6fffe0;letter-spacing:.28em;text-transform:uppercase;font-weight:900;font-size:12px">Rollback before release</p><h2 style="font-size:clamp(38px,5vw,72px);line-height:.9;letter-spacing:-.07em;margin:0 0 18px;color:#fff8ec">Run the challenge window.</h2><p style="color:#d9eee9;max-width:760px;font-size:18px;line-height:1.45">Watch GoalOS block unsupported output, roll back a challenged candidate, hold a canary, and admit only rollbackable proof to release-readiness.</p><a href="./rollback-challenge-lab.html" style="display:inline-block;margin-top:18px;background:linear-gradient(135deg,#f6ff9b,#5df5ff);color:#00110f;padding:14px 20px;border-radius:999px;font-weight:900;text-decoration:none">Open rollback lab</a></section>`;
  const footerIdx = html.search(/<footer\b|<div[^>]+data-goalos-footer=/i);
  if (footerIdx >= 0) html = html.slice(0, footerIdx) + rail + html.slice(footerIdx);
  else html = html.replace(/<\/body>/i, `${rail}</body>`);
  fs.writeFileSync(indexPath, html);
}
insertHomepageRail();
console.log('GoalOS Rollback & Challenge Window Lab v19 generated.');
