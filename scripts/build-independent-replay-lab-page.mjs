import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';

const root = process.cwd();
const siteDir = path.join(root, process.env.GOALOS_SITE_DIR || 'site');
const cfgPath = path.join(root, 'config', 'independent-replay-lab.json');
const cfg = JSON.parse(await fs.readFile(cfgPath, 'utf8'));
await fs.mkdir(siteDir, { recursive: true });
await fs.mkdir(path.join(siteDir, 'assets'), { recursive: true });

const legalRail = `<aside class="legal-rail" data-goalos-legal-rail="v12"><strong>Public site rule</strong><span>No forms · no inputs · no uploads · no cookies · no analytics · no wallets · no payments · no personal or confidential data.</span><a href="no-user-data.html">Read the rule</a></aside>`;
const footer = `<footer class="site-footer" data-goalos-footer="v12"><div><strong>GoalOS Signoff Pro</strong><span>Proof-to-acceptance · evidence review · replayable packets · claim-bound receipts.</span></div><nav><a href="privacy.html">Privacy</a><a href="terms.html">Terms</a><a href="no-user-data.html">No User Data</a><a href="agialpha-token-boundary.html">$AGIALPHA boundary</a></nav></footer>`;

const scenarios = {
  research: {
    label: 'AI research acceptance',
    mission: 'Accept or request changes on a public-safe research synthesis package.',
    risk: 'medium',
    operators: ['Schema replay', 'Baseline replay', 'Adversarial replay'],
    outcome: 'claim-ready'
  },
  software: {
    label: 'Software delivery review',
    mission: 'Verify whether a software milestone has enough evidence to support signoff.',
    risk: 'medium',
    operators: ['Dependency replay', 'Test replay', 'Rollback replay'],
    outcome: 'claim-ready'
  },
  procurement: {
    label: 'Procurement proof room',
    mission: 'Check whether vendor claims survive evidence, baselines, risk, and replay.',
    risk: 'high',
    operators: ['Docket replay', 'Cost replay', 'Risk replay'],
    outcome: 'review-ready'
  },
  safety: {
    label: 'Safety escalation packet',
    mission: 'Preserve a safety-significant decision path without turning private traces public.',
    risk: 'high',
    operators: ['Boundary replay', 'Contradiction replay', 'Challenge replay'],
    outcome: 'human-gated'
  }
};

const artifacts = {
  manifest: {
    lab: cfg.name,
    version: cfg.version,
    generatedAt: new Date(0).toISOString(),
    routes: [cfg.primaryRoute, ...cfg.aliases],
    publicSafety: cfg.posture,
    claimBoundary: cfg.claimBoundary
  },
  demoBundle: {
    id: 'GOALOS-INDEPENDENT-REPLAY-DEMO-V24',
    thesis: 'A claim is not promoted because one run passed. It is promoted when independent replay survives manifest checks, replay logs, verifier reports, safety/cost ledgers, baselines, challenge windows, and claim boundaries.',
    candidates: [
      { id: 'C0', name: 'Narrative-only demo', verdict: 'REJECT', reason: 'No replayable manifest, no baselines, no public evidence docket.' },
      { id: 'C1', name: 'Local packet only', verdict: 'HOLD', reason: 'Local verifier passes, but independent replay quorum is missing.' },
      { id: 'C2', name: 'Public replay packet', verdict: 'CHALLENGE', reason: 'Replay passes but challenge window and contradiction check remain open.' },
      { id: 'C3', name: 'Independent replay packet', verdict: 'PROMOTE_FOR_REVIEW', reason: 'Manifest, baselines, operators, validator reports, cost/safety ledgers, challenge clearance, and claim boundary pass.' }
    ],
    gates: ['manifest', 'environment', 'baselines', 'runner', 'proofBundle', 'replayLogs', 'validatorReports', 'costLedger', 'safetyLedger', 'claimsMatrix', 'challengeWindow', 'claimBoundary'],
    valueMoved: 0
  },
  operators: {
    operators: [
      { id: 'R1', role: 'Fresh clone replay', pass: true, checks: 106 },
      { id: 'R2', role: 'Pinned environment replay', pass: true, checks: 106 },
      { id: 'R3', role: 'Adversarial boundary replay', pass: true, checks: 106 }
    ],
    quorum: '3/3 public-safe synthetic operators passed',
    focusedTests: 318,
    officialFieldsMissing: 0
  },
  certificate: {
    type: 'ClaimPromotionCertificate',
    claimLevelBefore: 'LOCAL_PACKET_PASS',
    claimLevelAfter: 'INDEPENDENT_REPLAY_REVIEW_READY',
    promotedCandidate: 'C3',
    hardRule: 'No replay quorum, no claim promotion.',
    valueMoved: 0
  },
  reviewCard: {
    reviewerQuestion: 'Can a third party reproduce the public-safe result from the packet?',
    answer: 'Synthetic demo answer: yes, when the packet contains manifest, baselines, runner config, replay log, validator report, cost/safety ledgers, claims matrix, and challenge-window receipt.',
    notClaimed: ['external audit', 'production certification', 'empirical SOTA', 'active settlement', 'value movement']
  }
};

async function writeJson(name, obj) {
  const p = path.join(siteDir, name);
  await fs.writeFile(p, JSON.stringify(obj, null, 2) + '\n');
}
await writeJson('independent-replay-demo-bundle.json', artifacts.demoBundle);
await writeJson('replay-operator-reports.json', artifacts.operators);
await writeJson('claim-promotion-certificate.json', artifacts.certificate);
await writeJson('public-evidence-review-card.json', artifacts.reviewCard);
await writeJson('reproduction-manifest.json', artifacts.manifest);
await writeJson('independent-replay-manifest.json', artifacts.manifest);

const css = `
:root{--bg:#020908;--panel:rgba(22,42,39,.74);--line:rgba(112,255,224,.28);--text:#fff7ea;--muted:#b8c9cc;--mint:#65ffd8;--gold:#fff18a;--violet:#b59cff;--bad:#ff7f9f;--warn:#ffd36b}*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:radial-gradient(circle at 80% 10%,rgba(67,255,216,.20),transparent 30%),radial-gradient(circle at 8% 80%,rgba(154,130,255,.15),transparent 26%),linear-gradient(180deg,#020908,#061514 55%,#020908);color:var(--text);font-family:Inter,ui-sans-serif,system-ui,-apple-system,Segoe UI,sans-serif;overflow-x:hidden}body:before{content:"";position:fixed;inset:0;pointer-events:none;background-image:linear-gradient(rgba(255,255,255,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.035) 1px,transparent 1px);background-size:64px 64px;mask-image:linear-gradient(to bottom,#000,transparent 92%)}a{color:inherit;text-decoration:none}.topbar{height:86px;display:flex;align-items:center;justify-content:space-between;padding:0 5vw;border-bottom:1px solid var(--line);background:rgba(0,8,9,.86);backdrop-filter:blur(18px);position:sticky;top:0;z-index:5}.brand{display:flex;gap:14px;align-items:center;font-size:12px;letter-spacing:.28em;text-transform:uppercase;font-weight:900}.mark{width:36px;height:36px;border-radius:12px;background:radial-gradient(circle,var(--mint),#234e5c 45%,#050908 70%);box-shadow:0 0 30px rgba(101,255,216,.5);border:1px solid var(--line)}.nav{display:flex;gap:24px;align-items:center;font-size:13px;font-weight:800}.nav a{opacity:.9}.cta,.btn{border:1px solid rgba(255,255,255,.22);border-radius:999px;padding:14px 20px;font-weight:900;background:rgba(255,255,255,.10);box-shadow:inset 0 1px rgba(255,255,255,.18);cursor:pointer;color:var(--text);display:inline-flex;align-items:center;gap:10px}.cta,.btn.primary{color:#06110e;background:linear-gradient(100deg,#f4ff9b,#64ffd9,#61d9ff);border:0;box-shadow:0 0 36px rgba(101,255,216,.35)}.hero{min-height:calc(100vh - 86px);display:grid;grid-template-columns:minmax(0,1.05fr) minmax(360px,.95fr);gap:56px;align-items:center;width:min(1180px,92vw);margin:0 auto;padding:8vh 0}.eyebrow{letter-spacing:.38em;color:var(--mint);text-transform:uppercase;font-weight:900;font-size:12px}.hero h1{font-size:clamp(56px,8vw,118px);line-height:.82;margin:20px 0 22px;letter-spacing:-.08em;max-width:760px}.italic{font-family:Georgia,serif;font-style:italic;font-weight:500;background:linear-gradient(100deg,#fff48a,#83ffd9,#7ddfff,#b59cff);-webkit-background-clip:text;background-clip:text;color:transparent;letter-spacing:-.06em}.lead{font-size:clamp(18px,2vw,24px);line-height:1.45;max-width:720px;color:#eef7f4}.notice{margin:28px 0;padding:18px 20px;border:1px solid rgba(255,240,138,.25);background:linear-gradient(135deg,rgba(255,241,138,.11),rgba(101,255,216,.07));border-radius:22px;color:#fff6c9}.actions{display:flex;flex-wrap:wrap;gap:12px}.pillrow{display:flex;flex-wrap:wrap;gap:10px;margin-top:24px}.pill{border:1px solid var(--line);color:#c9fff4;border-radius:999px;padding:9px 12px;font-size:11px;font-weight:900;letter-spacing:.15em;text-transform:uppercase;background:rgba(0,0,0,.25)}.console{border:1px solid var(--line);background:linear-gradient(145deg,rgba(39,78,70,.8),rgba(7,14,16,.88));border-radius:36px;padding:26px;box-shadow:0 35px 110px rgba(0,0,0,.55),0 0 70px rgba(101,255,216,.12);position:relative;overflow:hidden}.console:before{content:"";position:absolute;inset:-40%;background:conic-gradient(from 110deg,transparent,rgba(101,255,216,.16),transparent,rgba(255,241,138,.12),transparent);animation:spin 18s linear infinite}.console>*{position:relative}.console-head{display:flex;justify-content:space-between;gap:16px;color:var(--mint);font-size:11px;font-weight:900;letter-spacing:.22em;text-transform:uppercase}.orb{width:min(430px,80vw);height:min(430px,80vw);margin:22px auto;position:relative;border-radius:50%;display:grid;place-items:center;background:radial-gradient(circle,#72ffe1 0 18%,rgba(101,255,216,.18) 19% 33%,transparent 34%),repeating-radial-gradient(circle,rgba(255,255,255,.12) 0 1px,transparent 1px 42px)}.orb:before,.orb:after{content:"";position:absolute;inset:28px;border:1px dashed rgba(255,255,255,.2);border-radius:50%;animation:spin 28s linear infinite}.orb:after{inset:68px;animation-direction:reverse}.alpha{font-family:Georgia,serif;font-size:82px;color:#02140f}.node{position:absolute;width:86px;min-height:60px;padding:12px;border:1px solid var(--line);border-radius:16px;background:rgba(1,12,13,.84);display:grid;place-items:center;text-align:center;box-shadow:0 10px 30px rgba(0,0,0,.35)}.node strong{color:var(--mint)}.node small{color:var(--muted);font-size:10px}.n1{top:0;left:50%;transform:translate(-50%,-20%)}.n2{right:0;top:32%}.n3{right:12%;bottom:6%}.n4{left:12%;bottom:6%}.n5{left:0;top:32%}.metrics{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}.metric{border:1px solid rgba(255,255,255,.16);background:rgba(255,255,255,.07);border-radius:16px;padding:18px}.metric b{display:block;color:var(--gold);font-size:28px}.metric span{display:block;color:var(--muted);font-size:10px;text-transform:uppercase;letter-spacing:.2em;font-weight:900}.section{width:min(1180px,92vw);margin:0 auto;padding:8vh 0}.grid{display:grid;grid-template-columns:1fr 1fr;gap:24px}.card{border:1px solid rgba(255,255,255,.14);background:linear-gradient(150deg,rgba(31,52,50,.78),rgba(8,13,16,.83));border-radius:28px;padding:28px;box-shadow:0 25px 75px rgba(0,0,0,.35)}.card h2{font-size:clamp(34px,5vw,76px);line-height:.9;letter-spacing:-.07em;margin:8px 0 18px}.scenario-row{display:flex;gap:10px;flex-wrap:wrap;margin:20px 0}.scenario{font-size:12px;padding:11px 13px;border-radius:999px;border:1px solid rgba(255,255,255,.18);background:rgba(255,255,255,.08);color:var(--text);font-weight:900;cursor:pointer}.scenario.active{background:linear-gradient(100deg,#f4ff9b,#64ffd9);color:#06110e;border:0}.timeline{display:grid;gap:10px;margin-top:18px}.step{display:grid;grid-template-columns:42px 1fr auto;gap:14px;align-items:center;border:1px solid rgba(255,255,255,.14);background:rgba(0,0,0,.25);border-radius:16px;padding:14px}.step b{color:var(--gold)}.step[data-state="pass"]{border-color:rgba(101,255,216,.6);box-shadow:0 0 22px rgba(101,255,216,.12)}.step[data-state="fail"]{border-color:rgba(255,127,159,.55)}.status{font-size:10px;text-transform:uppercase;letter-spacing:.18em;color:var(--muted);font-weight:900}.log{min-height:300px;background:#020909;border:1px solid rgba(101,255,216,.22);border-radius:20px;padding:18px;color:#cdfdef;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:13px;line-height:1.65;white-space:pre-wrap}.tabs{display:flex;gap:8px;flex-wrap:wrap;margin:0 0 14px}.tab{border:1px solid rgba(255,255,255,.16);background:rgba(255,255,255,.08);border-radius:999px;padding:10px 14px;color:var(--text);font-weight:900;cursor:pointer}.tab.active{border-color:var(--mint);color:#06110e;background:linear-gradient(100deg,#f4ff9b,#64ffd9)}pre{max-height:360px;overflow:auto;background:#020909;border:1px solid rgba(255,255,255,.13);border-radius:18px;padding:18px;color:#d6fff7;font-size:12px}.rail{border:1px solid var(--line);border-radius:28px;padding:26px;background:rgba(101,255,216,.06)}.site-footer{display:flex;justify-content:space-between;gap:24px;padding:52px 5vw;border-top:1px solid var(--line);background:rgba(0,5,8,.78)}.site-footer div{display:grid;gap:10px}.site-footer span{color:var(--muted)}.site-footer nav{display:flex;flex-wrap:wrap;align-items:center;gap:24px;color:#a8fff0;font-weight:900}.legal-rail{width:min(960px,92vw);margin:28px auto 48px;padding:14px 18px;border-radius:999px;border:1px solid rgba(101,255,216,.32);display:flex;gap:10px;align-items:center;justify-content:center;background:rgba(0,8,9,.78);font-size:13px}.legal-rail strong{color:var(--gold)}.legal-rail span{color:#d7e9e8}.legal-rail a{background:linear-gradient(100deg,#f4ff9b,#64ffd9);color:#06110e;padding:8px 13px;border-radius:999px;font-weight:900}@keyframes spin{to{transform:rotate(360deg)}}@media(max-width:900px){.topbar{height:auto;min-height:78px;align-items:flex-start;gap:18px;flex-direction:column;padding:18px 5vw}.nav{overflow-x:auto;max-width:100%;padding-bottom:8px}.hero,.grid{grid-template-columns:1fr}.hero h1{font-size:clamp(48px,16vw,82px)}.metrics{grid-template-columns:1fr}.site-footer,.legal-rail{border-radius:0;flex-direction:column;align-items:flex-start}.orb{transform:scale(.88);transform-origin:center}.step{grid-template-columns:34px 1fr}}
`;
await fs.writeFile(path.join(siteDir, 'assets', 'independent-replay-v24.css'), css);

const clientJs = `
(() => {
  const scenarios = ${JSON.stringify(scenarios)};
  const basePacket = ${JSON.stringify(artifacts.demoBundle)};
  const operators = ${JSON.stringify(artifacts.operators)};
  const certificate = ${JSON.stringify(artifacts.certificate)};
  const reviewCard = ${JSON.stringify(artifacts.reviewCard)};
  const steps = ['Manifest', 'Environment', 'Baselines', 'Runner config', 'ProofBundle', 'Replay logs', 'Validator reports', 'Cost ledger', 'Safety ledger', 'Claims matrix', 'Challenge window', 'Claim boundary'];
  const state = { scenario: 'research', running: false, tab: 'packet' };
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => [...document.querySelectorAll(s)];
  function renderScenario(){
    $$('.scenario').forEach(b => b.classList.toggle('active', b.dataset.scenario === state.scenario));
    const s = scenarios[state.scenario];
    const m = $('#missionText'); if(m) m.textContent = s.mission;
    const r = $('#riskText'); if(r) r.textContent = s.risk.toUpperCase();
  }
  function renderTabs(){
    $$('.tab').forEach(b => b.classList.toggle('active', b.dataset.tab === state.tab));
    const view = $('#artifactView'); if(!view) return;
    const payloads = { packet: basePacket, operators, certificate, review: reviewCard };
    view.textContent = JSON.stringify(payloads[state.tab] || basePacket, null, 2);
  }
  function setLog(lines){ const el = $('#traceLog'); if(el) el.textContent = lines.join('\\n'); }
  function setMetric(id, value){ const el = document.getElementById(id); if(el) el.textContent = value; }
  function buildSteps(done = 0){
    const list = $('#stepList'); if(!list) return;
    list.innerHTML = steps.map((name, i) => '<div class="step" data-state="' + (i < done ? 'pass' : '') + '"><b>' + String(i+1).padStart(2,'0') + '</b><span>' + name + '</span><em class="status">' + (i < done ? 'PASS' : 'WAITING') + '</em></div>').join('');
  }
  async function run(){
    if(state.running) return; state.running = true;
    buildSteps(0); setMetric('q','0/3'); setMetric('tests','0'); setMetric('level','LOCAL');
    const log = ['Replay council initialized.', 'Scenario: ' + scenarios[state.scenario].label, 'Rule: one run is not enough; independent replay is the promotion gate.'];
    setLog(log);
    for(let i=0;i<steps.length;i++){
      await new Promise(r => setTimeout(r, 170));
      log.push('✓ ' + steps[i] + ' verified.');
      buildSteps(i+1); setLog(log);
      setMetric('tests', String(Math.round(((i+1)/steps.length)*318)));
      if(i===4) setMetric('q','1/3');
      if(i===7) setMetric('q','2/3');
      if(i===10) setMetric('q','3/3');
    }
    log.push('Claim promotion: INDEPENDENT_REPLAY_REVIEW_READY.');
    log.push('No value moved. Human/institutional review remains the final authority.');
    setLog(log); setMetric('level','REVIEW READY');
    state.running = false;
  }
  function download(){
    const bundle = { ...basePacket, selectedScenario: scenarios[state.scenario], operatorReports: operators, certificate, reviewCard };
    const blob = new Blob([JSON.stringify(bundle,null,2)], {type:'application/json'});
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'goalos-independent-replay-demo-bundle.json'; a.click(); URL.revokeObjectURL(a.href);
  }
  $$('.scenario').forEach(b => b.addEventListener('click', () => { state.scenario = b.dataset.scenario; renderScenario(); }));
  $$('.tab').forEach(b => b.addEventListener('click', () => { state.tab = b.dataset.tab; renderTabs(); }));
  $('#runReplay')?.addEventListener('click', run);
  $('#downloadReplay')?.addEventListener('click', download);
  buildSteps(0); renderScenario(); renderTabs();
})();
`;
await fs.writeFile(path.join(siteDir, 'assets', 'independent-replay-v24.js'), clientJs);

const page = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>GoalOS — Independent Replay & Claim Promotion Lab</title><meta name="description" content="A browser-local GoalOS lab showing how claims become review-ready only after independent replay."><link rel="stylesheet" href="assets/independent-replay-v24.css"></head><body><header class="topbar"><a class="brand" href="index.html"><span class="mark"></span><span>GoalOS Signoff Pro<br><small>Independent Replay Lab</small></span></a><nav class="nav"><a href="browser-beta.html">Browser beta</a><a href="mission-001.html">Mission 001</a><a href="proof-gradient-lab.html">Selection gate</a><a href="capability-compounding-lab.html">Compounding</a><a href="governed-decision-state-lab.html">Decision state</a><a href="validator-mesh-lab.html">Validator mesh</a><a href="proof-carrying-artifact-lab.html">Artifacts</a></nav><a class="cta" href="#lab">Run replay</a></header><main><section class="hero"><div><div class="eyebrow">Public reproducibility is the promotion gate</div><h1>One run is not proof. <span class="italic">Replay makes it public.</span></h1><p class="lead">GoalOS turns a passing packet into a review-ready claim only when independent replay operators can reproduce the manifest, baselines, runner config, ProofBundle, ledgers, validator report, claims matrix, and challenge-window record.</p><div class="notice"><strong>No replay quorum, no claim promotion.</strong><br>A beautiful demo can inspire. A replayable packet can be inspected. GoalOS separates the two.</div><div class="actions"><a class="btn primary" href="#lab">Run independent replay</a><a class="btn" href="mission-001.html">Inspect Mission 001</a><a class="btn" href="benchmark-packet.html">Benchmark packet</a></div><div class="pillrow"><span class="pill">Browser-local</span><span class="pill">No input</span><span class="pill">No upload</span><span class="pill">No wallet</span><span class="pill">No value moved</span></div></div><aside class="console" aria-label="Replay console diagram"><div class="console-head"><span>Replay council</span><span>Review mode</span></div><div class="orb"><span class="alpha">α</span><div class="node n1"><strong>R1</strong><small>Fresh clone</small></div><div class="node n2"><strong>R2</strong><small>Env pins</small></div><div class="node n3"><strong>R3</strong><small>Boundary</small></div><div class="node n4"><strong>QC</strong><small>Claim gate</small></div><div class="node n5"><strong>ED</strong><small>Docket</small></div></div><div class="metrics"><div class="metric"><b id="q">0/3</b><span>Replay quorum</span></div><div class="metric"><b id="tests">0</b><span>Focused tests</span></div><div class="metric"><b id="level">LOCAL</b><span>Claim level</span></div></div></aside></section><section class="section" id="lab"><div class="grid"><article class="card"><div class="eyebrow">Mission replay control</div><h2>Promote only what strangers can replay.</h2><p id="missionText" class="lead"></p><div class="scenario-row"><button class="scenario active" data-scenario="research">Research</button><button class="scenario" data-scenario="software">Software</button><button class="scenario" data-scenario="procurement">Procurement</button><button class="scenario" data-scenario="safety">Safety</button></div><p><strong>Risk class:</strong> <span id="riskText">MEDIUM</span></p><div class="actions"><button id="runReplay" class="btn primary">Run replay council</button><button id="downloadReplay" class="btn">Download demo bundle</button></div><div class="timeline" id="stepList"></div></article><article class="card"><div class="eyebrow">Live trace</div><h2>Replay evidence state.</h2><div class="log" id="traceLog">Replay council ready. Awaiting scenario.</div></article></div></section><section class="section"><div class="grid"><article class="card"><div class="eyebrow">Public evidence objects</div><h2>What gets promoted.</h2><p>The page emits a synthetic <strong>ClaimPromotionCertificate</strong> when independent replay gates clear.</p><p><a class="btn" href="claim-promotion-certificate.json">Open certificate JSON</a></p><div class="tabs"><button class="tab active" data-tab="packet">Packet</button><button class="tab" data-tab="operators">Operators</button><button class="tab" data-tab="certificate">Certificate</button><button class="tab" data-tab="review">Review card</button></div><pre id="artifactView"></pre></article><article class="rail"><div class="eyebrow">Claim ladder</div><h2>From local pass to public review.</h2><p class="lead">GoalOS refuses to treat private success, hidden traces, or one local verifier as public completion. The claim ladder advances only when the evidence is replayable, bounded, and inspectable.</p><div class="timeline"><div class="step" data-state="fail"><b>L0</b><span>Narrative-only demo</span><em class="status">reject</em></div><div class="step"><b>L1</b><span>Local packet pass</span><em class="status">hold</em></div><div class="step"><b>L2</b><span>Public packet replay</span><em class="status">challenge</em></div><div class="step" data-state="pass"><b>L3</b><span>Independent replay quorum</span><em class="status">review ready</em></div></div></article></div></section></main>${footer}${legalRail}<script src="assets/independent-replay-v24.js"></script></body></html>`;

for (const route of [cfg.primaryRoute, ...cfg.aliases]) await fs.writeFile(path.join(siteDir, route), page);

async function maybeInjectHomepage() {
  const p = path.join(siteDir, 'index.html');
  try {
    let html = await fs.readFile(p, 'utf8');
    if (html.includes('independent-replay-lab.html')) return;
    const rail = `<section class="section goalos-extension-rail" data-goalos-demo="independent-replay-v24"><div class="card"><div class="eyebrow">Independent replay</div><h2>One run is not proof. Replay makes it public.</h2><p>Run the browser-local replay council and see how GoalOS promotes only packets that survive independent reproduction.</p><div class="actions"><a class="btn primary" href="independent-replay-lab.html">Open replay lab</a><a class="btn" href="reproduction-manifest.json">Inspect manifest</a></div></div></section>`;
    const idx = html.indexOf('<footer');
    if (idx >= 0) html = html.slice(0, idx) + rail + html.slice(idx); else html += rail;
    await fs.writeFile(p, html);
  } catch {}
}
await maybeInjectHomepage();

const manifestHash = crypto.createHash('sha256').update(JSON.stringify(artifacts)).digest('hex');
console.log(`GoalOS Independent Replay Lab v${cfg.version} generated at ${siteDir}`);
console.log(`Routes: ${[cfg.primaryRoute, ...cfg.aliases].join(', ')}`);
console.log(`Artifact hash: ${manifestHash}`);
