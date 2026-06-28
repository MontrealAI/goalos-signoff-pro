#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = process.cwd();
const site = path.join(root, 'site');
const configPath = path.join(root, 'config', 'sovereign-experience-stream-lab.json');
const fallbackConfigPath = path.join(path.dirname(new URL(import.meta.url).pathname), '..', 'config', 'sovereign-experience-stream-lab.json');
const config = JSON.parse(fs.readFileSync(fs.existsSync(configPath) ? configPath : fallbackConfigPath, 'utf8'));
fs.mkdirSync(site, { recursive: true });
fs.mkdirSync(path.join(site, 'assets'), { recursive: true });

const email = 'info@quebec.ai';
const generatedAt = new Date().toISOString();
const hash = (value) => crypto.createHash('sha256').update(typeof value === 'string' ? value : JSON.stringify(value)).digest('hex');
const safeJson = (obj) => JSON.stringify(obj, null, 2);

function footer(active = '') {
  return `
<footer class="v15-footer">
  <div><strong>GoalOS Signoff Pro</strong><p>Proof-to-acceptance · governed experience · reusable capability.</p></div>
  <nav aria-label="Footer navigation">
    <a href="browser-beta.html">Browser beta</a>
    <a href="mission-001.html">Mission 001</a>
    <a href="proof-gradient-lab.html">Selection Gate</a>
    <a href="capability-compounding-lab.html">Compounding</a>
    <a href="sovereign-experience-stream-lab.html" ${active === 'experience' ? 'aria-current="page"' : ''}>Experience Stream</a>
    <a href="no-user-data.html">No User Data</a>
    <a href="privacy.html">Privacy</a>
    <a href="terms.html">Terms</a>
    <a href="agialpha-token-boundary.html">$AGIALPHA Boundary</a>
  </nav>
</footer>
<div class="public-rule" role="note"><strong>Public site rule</strong><span>No forms · no inputs · no uploads · no cookies · no analytics · no wallets · no payments · no personal or confidential data.</span><a href="no-user-data.html">Read the rule</a></div>`;
}

function nav(active='experience') {
  const links = [
    ['Institution', 'index.html'],
    ['Browser beta', 'browser-beta.html'],
    ['Mission 001', 'mission-001.html'],
    ['Selection gate', 'proof-gradient-lab.html'],
    ['Compounding', 'capability-compounding-lab.html'],
    ['Experience', 'sovereign-experience-stream-lab.html'],
    ['Docket', 'evidence-docket-demo.html'],
    ['$AGIALPHA', 'agialpha.html'],
    ['Data posture', 'no-user-data.html']
  ];
  return `<header class="v15-topbar"><a class="brand" href="index.html" aria-label="GoalOS home"><span class="brand-orb"></span><span><strong>GOALOS SIGNOFF PRO</strong><small>SOVEREIGN EXPERIENCE STREAM</small></span></a><nav>${links.map(([label, href]) => `<a href="${href}" ${active==='experience' && label==='Experience' ? 'aria-current="page"' : ''}>${label}</a>`).join('')}</nav><a class="cta" href="browser-beta.html">Open browser beta</a></header>`;
}

function makeExperience(scenario) {
  const base = [
    ['mission-contract', 'Mission Contract', 'objective signed; criteria and boundaries fixed', 'accepted'],
    ['tool-trace', 'Tool Trace', 'bounded tool decision recorded with policy root', 'accepted'],
    ['proof-packet', 'Proof Packet', 'output hash, trace root, cost, latency, and signatures emitted', 'accepted'],
    ['validator-pass', 'Validator Pass', 'evidence and claim boundary checked', 'accepted'],
    ['reward-signal', 'Grounded Reward', 'cost, risk, reproducibility, and usefulness scored', 'accepted'],
    ['suspicious-trace', 'Suspicious Trace', 'looks useful but replay is incomplete; quarantined', 'quarantined'],
    ['unsupported-claim', 'Unsupported Claim', 'candidate makes a claim not carried by evidence', 'rejected'],
    ['delayed-outcome', 'Delayed Outcome', 'later observation confirms durable usefulness', scenario.id === 'software' || scenario.id === 'defensive' ? 'accepted' : 'quarantined'],
    ['policy-update', 'Policy Update', 'routing prior updates only from accepted replayable events', scenario.id === 'defensive' ? 'accepted' : 'accepted']
  ];
  const events = base.slice(0, scenario.events).map((e, i) => ({
    eventId: `exp-${scenario.id}-${String(i + 1).padStart(2, '0')}`,
    kind: e[0],
    label: e[1],
    observation: e[2],
    verdict: e[3],
    replayable: e[3] === 'accepted',
    validator: e[3] === 'accepted' ? 'pass' : e[3] === 'quarantined' ? 'hold' : 'fail',
    hash: hash(`${scenario.id}:${i}:${e.join('|')}`).slice(0, 16)
  }));
  return events;
}

const scenarioBundles = Object.fromEntries(config.scenarios.map(s => {
  const events = makeExperience(s);
  const accepted = events.filter(e => e.verdict === 'accepted').length;
  const quarantined = events.filter(e => e.verdict === 'quarantined').length;
  const rejected = events.filter(e => e.verdict === 'rejected').length;
  const before = { verifiedWork: 61, proofDebt: 42, routingWaste: 29, falseAcceptanceRisk: 12, reusableOptions: 1 };
  const after = {
    verifiedWork: 61 + accepted * 5,
    proofDebt: Math.max(7, 42 - accepted * 4 - rejected * 2),
    routingWaste: Math.max(8, 29 - accepted * 2 - quarantined),
    falseAcceptanceRisk: Math.max(1, 12 - rejected * 3 - quarantined),
    reusableOptions: 1 + accepted
  };
  return [s.id, { scenario: s, events, before, after }];
}));

const mainBundle = {
  package: config.package,
  version: config.version,
  generatedAt,
  route: config.route,
  claimBoundary: config.doctrine.claimBoundary,
  doctrine: config.doctrine,
  scenarios: scenarioBundles,
  publicSafety: {
    browserLocal: true,
    noForms: true,
    noUploads: true,
    noWallets: true,
    noCookies: true,
    noTrackingPixels: true,
    noValueMoved: true,
    noPersonalData: true,
    noConfidentialData: true
  }
};

const rewardLedger = {
  ledger: 'Grounded Reward Ledger',
  generatedAt,
  purpose: 'Separate validator acceptance from consequence measurement; update routing only from replayable, accepted experience.',
  signals: [
    { signal: 'validatorVerdict', weight: 0.24, source: 'synthetic validator pass / hold / fail' },
    { signal: 'replayability', weight: 0.21, source: 'deterministic demo replay status' },
    { signal: 'costReduction', weight: 0.16, source: 'synthetic cost ledger delta' },
    { signal: 'riskReduction', weight: 0.18, source: 'synthetic risk ledger delta' },
    { signal: 'futureReuse', weight: 0.21, source: 'temporal option admission' }
  ],
  rejectedSignals: [
    'unreplayable persuasion',
    'unsupported activity volume',
    'private-only trace without public-safe proof commitment'
  ],
  hash: ''
};
rewardLedger.hash = hash(rewardLedger);

const optionRegistry = {
  registry: 'Temporal Option Registry',
  generatedAt,
  options: [
    { id: 'option-proof-review-v1', initiation: 'AI deliverable requires acceptance', validator: 'evidence docket pass', termination: 'receipt emitted', riskClass: 'low-public-demo', status: 'active-demo' },
    { id: 'option-claim-boundary-v1', initiation: 'claim exceeds support', validator: 'claim-boundary gate', termination: 'revise or reject', riskClass: 'claim-safety', status: 'active-demo' },
    { id: 'option-replay-before-reuse-v1', initiation: 'experience proposed for reuse', validator: 'replay gate', termination: 'accepted or quarantined', riskClass: 'memory-integrity', status: 'active-demo' }
  ],
  admissionRule: 'A temporal option enters the registry only if replayable, validator-approved, claim-bounded, and safe to reuse.',
  hash: ''
};
optionRegistry.hash = hash(optionRegistry);

const policyCert = {
  certificate: 'Router Policy Update Certificate',
  generatedAt,
  decision: 'promote-synthetic-router-prior',
  reason: 'Accepted replayable experience improves verified-work estimate and reduces proof debt in this browser-local demonstration.',
  gates: {
    proofValid: true,
    replayPass: true,
    riskWithinBoundary: true,
    quarantineRespected: true,
    noPrivateData: true,
    humanAuthorityPreserved: true
  },
  notClaimed: [
    'external audit',
    'production certification',
    'empirical benchmark victory',
    'value movement'
  ],
  hash: ''
};
policyCert.hash = hash(policyCert);

const reanalyzeReport = {
  report: 'Experience Reanalyze Report',
  generatedAt,
  summary: 'Historical synthetic events are re-read under the current proof gates. Accepted events may improve future routing; quarantined and rejected events remain warnings only.',
  findings: [
    { id: 'f-01', title: 'Activity is not proof', action: 'reject activity-only traces as policy-update material' },
    { id: 'f-02', title: 'Replay changes authority', action: 'promote only replayable accepted experience' },
    { id: 'f-03', title: 'Quarantine preserves learning without propagation', action: 'retain suspicious traces as warnings, not routing authority' },
    { id: 'f-04', title: 'Temporal options reduce future proof debt', action: 'admit bounded macro-workflows with validators and termination rules' }
  ],
  hash: ''
};
reanalyzeReport.hash = hash(reanalyzeReport);

fs.writeFileSync(path.join(site, 'sovereign-experience-stream-demo-bundle.json'), safeJson(mainBundle));
fs.writeFileSync(path.join(site, 'grounded-reward-ledger.json'), safeJson(rewardLedger));
fs.writeFileSync(path.join(site, 'temporal-option-registry.json'), safeJson(optionRegistry));
fs.writeFileSync(path.join(site, 'router-policy-update-certificate.json'), safeJson(policyCert));
fs.writeFileSync(path.join(site, 'experience-reanalyze-report.json'), safeJson(reanalyzeReport));

const css = `
:root{--bg:#030908;--panel:rgba(18,35,33,.72);--panel2:rgba(16,28,32,.88);--line:rgba(112,255,220,.35);--mint:#6bffd8;--aqua:#6de8ff;--cream:#fff8ea;--gold:#fff188;--violet:#bda7ff;--muted:#b9c9c8;--danger:#ff7d9b;--hold:#ffd56a;--ok:#72ffc8}*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:radial-gradient(circle at 72% 12%,rgba(28,130,103,.4),transparent 32%),radial-gradient(circle at 12% 82%,rgba(97,85,174,.26),transparent 30%),linear-gradient(180deg,#020707,#06120f 55%,#04080a);color:var(--cream);font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;min-height:100vh;overflow-x:hidden}body:before{content:"";position:fixed;inset:0;pointer-events:none;background-image:linear-gradient(rgba(255,255,255,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.035) 1px,transparent 1px);background-size:64px 64px;mask-image:linear-gradient(#000,transparent 88%);z-index:-2}body:after{content:"";position:fixed;inset:0;pointer-events:none;background:radial-gradient(circle at 50% 50%,transparent 0 40%,rgba(0,0,0,.46) 82%);z-index:-1}.v15-topbar{position:sticky;top:0;z-index:20;min-height:78px;display:flex;align-items:center;justify-content:space-between;gap:22px;padding:16px 5vw;border-bottom:1px solid rgba(111,255,218,.22);background:rgba(3,8,9,.84);backdrop-filter:blur(18px)}.brand{display:flex;align-items:center;gap:13px;color:var(--cream);text-decoration:none;letter-spacing:.22em;font-size:12px}.brand small{display:block;color:var(--muted);font-size:10px;letter-spacing:.26em}.brand-orb{width:34px;height:34px;border:1px solid var(--mint);border-radius:12px;background:radial-gradient(circle,#e7ff9e 0 14%,#62fbdb 18% 35%,#132b31 40%);box-shadow:0 0 26px rgba(107,255,216,.65)}.v15-topbar nav{display:flex;gap:8px;align-items:center;flex-wrap:wrap;justify-content:center}.v15-topbar nav a,.cta{color:var(--cream);text-decoration:none;font-weight:800;font-size:12px;padding:10px 12px;border-radius:999px}.v15-topbar nav a[aria-current=page],.v15-topbar nav a:hover{background:rgba(255,255,255,.12)}.cta{background:linear-gradient(135deg,#f8ff97,#5ef0ff);color:#03110f;box-shadow:0 16px 42px rgba(93,255,225,.23);white-space:nowrap}.wrap{width:min(1180px,92vw);margin:0 auto}.hero{padding:128px 0 78px;display:grid;grid-template-columns:minmax(0,1.02fr) minmax(360px,.98fr);gap:54px;align-items:center}.eyebrow{color:var(--mint);letter-spacing:.46em;font-size:12px;font-weight:900;text-transform:uppercase;display:flex;gap:14px;align-items:center}.eyebrow:before{content:"";width:34px;height:1px;background:var(--mint);box-shadow:0 0 16px var(--mint)}h1{font-size:clamp(54px,8vw,108px);line-height:.82;margin:24px 0 24px;letter-spacing:-.075em}h1 em{font-family:Georgia,serif;font-weight:500;font-style:italic;background:linear-gradient(90deg,#f7ff9d,#73ffd4,#6cecff,#b69cff);-webkit-background-clip:text;background-clip:text;color:transparent}.lead{font-size:clamp(18px,2vw,24px);line-height:1.45;color:#e8f5f3;max-width:720px}.callout{margin:26px 0;padding:18px;border:1px solid rgba(255,241,136,.32);background:linear-gradient(135deg,rgba(255,241,136,.14),rgba(107,255,216,.08));border-radius:22px;color:#fff6c3}.actions{display:flex;gap:12px;flex-wrap:wrap;margin:30px 0}.btn{border:0;border-radius:999px;padding:14px 20px;font-weight:950;cursor:pointer;color:#03110f;background:linear-gradient(135deg,#f6ff9d,#58efff);box-shadow:0 18px 42px rgba(93,255,222,.18);text-decoration:none;display:inline-flex;align-items:center;justify-content:center}.btn.secondary{background:rgba(255,255,255,.1);color:var(--cream);border:1px solid rgba(255,255,255,.18)}.pillrow{display:flex;gap:9px;flex-wrap:wrap}.pill{font-size:11px;letter-spacing:.14em;font-weight:900;color:#cafff3;border:1px solid rgba(107,255,216,.42);border-radius:999px;padding:8px 12px;background:rgba(3,16,16,.62)}.console{border:1px solid var(--line);border-radius:30px;background:linear-gradient(145deg,rgba(95,130,114,.3),rgba(7,18,19,.92));padding:24px;box-shadow:0 28px 80px rgba(0,0,0,.45),inset 0 0 80px rgba(111,255,218,.06);position:relative;overflow:hidden}.console:before{content:"";position:absolute;width:260px;height:260px;border-radius:50%;right:-80px;top:-80px;background:radial-gradient(circle,rgba(107,255,216,.36),transparent 62%);filter:blur(10px)}.console-head{display:flex;justify-content:space-between;align-items:center;gap:20px;color:var(--mint);font-size:11px;font-weight:950;letter-spacing:.28em;text-transform:uppercase;position:relative}.experience-orbit{position:relative;height:370px;border:1px solid rgba(255,255,255,.1);border-radius:24px;background:radial-gradient(circle at 52% 52%,rgba(107,255,216,.25),rgba(7,15,16,.8) 36%,rgba(1,5,7,.95) 70%);margin:22px 0;overflow:hidden}.experience-orbit .core{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:132px;height:132px;border-radius:50%;display:grid;place-items:center;text-align:center;color:#041210;font-weight:950;letter-spacing:.15em;background:radial-gradient(circle,#fff783 0 9%,#6bffd8 34%,#75ddff 74%,#182835 100%);box-shadow:0 0 60px rgba(107,255,216,.55)}.ring{position:absolute;inset:58px;border-radius:50%;border:1px dashed rgba(107,255,216,.28);animation:spin 28s linear infinite}.ring.two{inset:86px;border-color:rgba(255,241,136,.25);animation-duration:42s;animation-direction:reverse}.node{position:absolute;width:118px;min-height:56px;border:1px solid rgba(107,255,216,.35);border-radius:16px;background:rgba(3,13,15,.82);display:grid;place-items:center;text-align:center;font-size:12px;font-weight:900;padding:10px;box-shadow:0 14px 38px rgba(0,0,0,.25)}.node small{display:block;color:var(--muted);font-size:10px;font-weight:700;margin-top:4px}.n1{left:28px;top:50px}.n2{right:32px;top:52px}.n3{left:35px;bottom:56px}.n4{right:36px;bottom:58px}.metrics{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}.metric{border:1px solid rgba(255,255,255,.12);border-radius:18px;padding:14px;background:rgba(255,255,255,.06)}.metric strong{font-size:28px;color:var(--gold);display:block}.metric span{font-size:10px;letter-spacing:.18em;text-transform:uppercase;color:var(--muted);font-weight:900}.section{padding:72px 0}.section-title{font-size:clamp(38px,5vw,72px);line-height:.9;letter-spacing:-.06em;margin:14px 0 18px}.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}.card,.lab-panel{border:1px solid rgba(255,255,255,.14);border-radius:26px;background:linear-gradient(145deg,rgba(255,255,255,.09),rgba(255,255,255,.035));padding:24px;box-shadow:0 18px 50px rgba(0,0,0,.28)}.card h3,.lab-panel h3{font-size:28px;line-height:1;margin:0 0 12px;letter-spacing:-.04em}.card p,.lab-panel p{color:var(--muted);line-height:1.58}.lab{display:grid;grid-template-columns:.72fr 1.28fr;gap:22px;align-items:start}.scenario-list{display:grid;gap:10px}.scenario{width:100%;text-align:left;border:1px solid rgba(107,255,216,.28);border-radius:18px;background:rgba(3,15,16,.75);color:var(--cream);padding:16px;cursor:pointer}.scenario.active,.scenario:hover{border-color:var(--mint);box-shadow:0 0 0 1px rgba(107,255,216,.3),0 18px 48px rgba(107,255,216,.08)}.scenario strong{display:block;font-size:17px}.scenario small{display:block;color:var(--muted);margin-top:6px}.stagebar{display:grid;grid-template-columns:repeat(5,1fr);gap:10px;margin-bottom:18px}.stage{border:1px solid rgba(255,255,255,.14);border-radius:16px;padding:12px;min-height:76px;background:rgba(0,0,0,.22);font-weight:900;color:var(--muted)}.stage.active{border-color:var(--mint);color:var(--cream);box-shadow:0 0 34px rgba(107,255,216,.12)}.stage.done{border-color:rgba(114,255,200,.45);color:var(--ok)}.trace{height:318px;overflow:auto;border:1px solid rgba(107,255,216,.24);border-radius:20px;background:rgba(0,5,7,.68);padding:16px;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;font-size:13px;line-height:1.58}.trace .ok{color:var(--ok)}.trace .hold{color:var(--hold)}.trace .bad{color:var(--danger)}.tabs{display:flex;gap:8px;flex-wrap:wrap;margin:18px 0}.tab{border:1px solid rgba(255,255,255,.18);background:rgba(255,255,255,.08);color:var(--cream);border-radius:999px;padding:10px 14px;cursor:pointer;font-weight:900}.tab.active{border-color:var(--mint);background:rgba(107,255,216,.12)}pre{white-space:pre-wrap;word-break:break-word;background:rgba(0,5,7,.72);border:1px solid rgba(255,255,255,.12);border-radius:20px;padding:16px;color:#dffff7;min-height:220px;max-height:360px;overflow:auto}.comparison{display:grid;grid-template-columns:1fr 1fr;gap:18px}.scorecard{border:1px solid rgba(107,255,216,.22);border-radius:22px;padding:20px;background:rgba(0,0,0,.22)}.scoreline{display:flex;justify-content:space-between;border-bottom:1px solid rgba(255,255,255,.08);padding:10px 0;color:var(--muted)}.scoreline strong{color:var(--cream)}.v15-footer{border-top:1px solid rgba(107,255,216,.18);margin-top:72px;padding:46px 5vw 72px;background:rgba(1,5,7,.72);display:flex;justify-content:space-between;gap:30px;align-items:flex-start}.v15-footer p{color:var(--muted)}.v15-footer nav{display:flex;gap:18px;flex-wrap:wrap;justify-content:flex-end}.v15-footer a{color:#b9fff1;text-decoration:none;font-weight:800}.public-rule{width:min(920px,92vw);margin:0 auto 42px;border:1px solid rgba(107,255,216,.35);border-radius:999px;padding:12px 14px;display:flex;gap:12px;align-items:center;justify-content:center;background:rgba(0,6,7,.86);box-shadow:0 12px 38px rgba(0,0,0,.35)}.public-rule strong{color:var(--gold)}.public-rule span{color:var(--muted);font-size:13px}.public-rule a{background:linear-gradient(135deg,#f6ff9d,#76ffe6);color:#03110f;text-decoration:none;font-weight:900;border-radius:999px;padding:9px 13px}.mini{font-size:12px;color:var(--muted);line-height:1.5}.home-rail{margin:72px auto 0;width:min(980px,92vw);border:1px solid rgba(107,255,216,.35);border-radius:28px;background:linear-gradient(145deg,rgba(107,255,216,.12),rgba(255,255,255,.035));padding:32px}.home-rail h2{font-size:clamp(34px,5vw,72px);line-height:.92;letter-spacing:-.06em;margin:10px 0}.home-rail p{max-width:780px;color:var(--muted);line-height:1.55}@keyframes spin{to{transform:rotate(360deg)}}@media(max-width:900px){.v15-topbar{position:relative;align-items:flex-start;flex-direction:column}.hero,.lab,.comparison{grid-template-columns:1fr}.grid{grid-template-columns:1fr}.metrics,.stagebar{grid-template-columns:repeat(2,1fr)}.experience-orbit{height:420px}.node{position:relative;left:auto!important;right:auto!important;top:auto!important;bottom:auto!important;margin:10px;width:100%}.experience-orbit{display:grid;grid-template-columns:1fr;gap:8px;padding:160px 16px 16px}.v15-footer{flex-direction:column}.v15-footer nav{justify-content:flex-start}.public-rule{border-radius:24px;flex-direction:column;text-align:center}h1{font-size:56px}}`;
fs.writeFileSync(path.join(site, 'assets', 'sovereign-experience-v15.css'), css);

const js = `
(() => {
  const DATA = ${JSON.stringify(mainBundle)};
  const state = { scenario: 'research', running: false, lastPanel: 'docket' };
  const stages = ['Capture', 'Replay', 'Reward', 'Reanalyze', 'Promote'];
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => Array.from(document.querySelectorAll(s));
  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  function scenarioData(){ return DATA.scenarios[state.scenario]; }
  function setScenario(id){ state.scenario = id; $$('.scenario').forEach(b => b.classList.toggle('active', b.dataset.scenario === id)); resetLab(); }
  function metric(id, value){ const el = document.querySelector('[data-metric="'+id+'"] strong'); if(el) el.textContent = value; }
  function renderMetrics(bundle){ metric('verified', bundle.before.verifiedWork); metric('debt', bundle.before.proofDebt); metric('waste', bundle.before.routingWaste); metric('options', bundle.before.reusableOptions); }
  function line(text, cls=''){ const t = $('#trace'); const div = document.createElement('div'); div.className = cls; div.textContent = text; t.appendChild(div); t.scrollTop = t.scrollHeight; }
  function setStage(i){ $$('.stage').forEach((el, idx) => { el.classList.toggle('active', idx === i); el.classList.toggle('done', idx < i); }); }
  function panelObject(){ const b = scenarioData(); const accepted = b.events.filter(e=>e.verdict==='accepted'); const quarantined = b.events.filter(e=>e.verdict==='quarantined'); const rejected = b.events.filter(e=>e.verdict==='rejected'); const panels = {
    docket: { title:'Evidence Docket', data:{ mission:b.scenario.label, objective:b.scenario.objective, claims:['Accepted experience may update future routing.','Quarantined experience is retained as warning, not authority.','Rejected experience cannot become memory.'], events:b.events.map(e=>({eventId:e.eventId,label:e.label,verdict:e.verdict,hash:e.hash})) } },
    reward: { title:'Grounded Reward Ledger', data:{ accepted:accepted.length, quarantined:quarantined.length, rejected:rejected.length, before:b.before, after:b.after, rewardRule:'Validator acceptance is not enough; replay, risk, cost, and future reuse decide learning authority.' } },
    options: { title:'Temporal Option Registry', data:{ admittedOptions: accepted.slice(0,4).map((e,i)=>({optionId:'option-'+b.scenario.id+'-'+(i+1), sourceEvent:e.eventId, validator:'replay-and-boundary-pass', termination:'receipt-or-escalation'})), rejectedAsOptions: rejected.map(e=>e.eventId) } },
    policy: { title:'Policy Update Certificate', data:{ decision:'promote synthetic routing prior', source:'accepted replayable events only', hardGates:{ replayPass:true, riskBoundary:true, noPrivateData:true, humanAuthority:true }, blocked: quarantined.concat(rejected).map(e=>({eventId:e.eventId,reason:e.verdict==='quarantined'?'held for replay':'unsupported claim'})) } }
  };
  return panels[state.lastPanel] || panels.docket;
  }
  function renderPanel(name){ state.lastPanel = name; $$('.tab').forEach(t=>t.classList.toggle('active', t.dataset.panel===name)); const p = panelObject(); $('#panelTitle').textContent = p.title; $('#panelJson').textContent = JSON.stringify(p.data, null, 2); }
  function resetLab(){ state.running = false; const b=scenarioData(); $('#trace').innerHTML=''; line('System ready. Select a scenario or launch the sovereign experience stream.'); setStage(-1); renderMetrics(b); renderPanel(state.lastPanel); }
  async function run(){ if(state.running) return; state.running = true; const b=scenarioData(); $('#trace').innerHTML=''; renderMetrics(b); for(let i=0;i<stages.length;i++){ setStage(i); line('['+stages[i]+'] gate opened.'); await sleep(360); if(i===0){ for(const e of b.events){ line('capture '+e.eventId+' · '+e.label+' · '+e.hash, e.verdict==='accepted'?'ok':e.verdict==='quarantined'?'hold':'bad'); await sleep(170); } }
      if(i===1){ for(const e of b.events){ line((e.replayable?'replay pass ':'replay hold ') + e.eventId, e.replayable?'ok':e.verdict==='quarantined'?'hold':'bad'); await sleep(140); } }
      if(i===2){ line('grounded reward ledger updated: validator verdict separated from consequence signal.', 'ok'); await sleep(360); }
      if(i===3){ line('reanalyze: accepted events become learning material; held events become warnings.', 'hold'); await sleep(360); }
      if(i===4){ line('policy certificate emitted: future routing may use accepted replayable experience only.', 'ok'); await sleep(360); } }
    setStage(5); metric('verified', b.after.verifiedWork); metric('debt', b.after.proofDebt); metric('waste', b.after.routingWaste); metric('options', b.after.reusableOptions); renderPanel('policy'); line('DONE: verified experience stream sealed. No user data. No value moved.', 'ok'); state.running=false; }
  function download(){ const b=scenarioData(); const blob = new Blob([JSON.stringify({package:DATA.package, generatedAt:new Date().toISOString(), scenario:b.scenario, events:b.events, before:b.before, after:b.after, claimBoundary:DATA.claimBoundary}, null, 2)], { type:'application/json' }); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'goalos-sovereign-experience-'+state.scenario+'.json'; document.body.appendChild(a); a.click(); URL.revokeObjectURL(a.href); a.remove(); }
  document.addEventListener('click', (e)=>{ const s=e.target.closest('[data-scenario]'); if(s) setScenario(s.dataset.scenario); const p=e.target.closest('[data-panel]'); if(p) renderPanel(p.dataset.panel); if(e.target.closest('[data-run]')) run(); if(e.target.closest('[data-download]')) download(); if(e.target.closest('[data-reanalyze]')) { renderPanel('reward'); line('reanalyze requested: reading accepted, held, and rejected synthetic events.', 'hold'); } });
  document.addEventListener('DOMContentLoaded', resetLab);
})();`;
fs.writeFileSync(path.join(site, 'assets', 'sovereign-experience-v15.js'), js);

const page = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>GoalOS Signoff Pro — Sovereign Experience Stream Lab</title>
<meta name="description" content="A browser-local GoalOS demo showing how replayable accepted evidence becomes governed experience, reward ledgers, temporal options, and safer future routing." />
<link rel="stylesheet" href="assets/sovereign-experience-v15.css" />
</head>
<body>
${nav('experience')}
<main>
  <section class="hero wrap">
    <div>
      <div class="eyebrow">Sovereign experience stream</div>
      <h1>Evidence becomes <em>training authority</em> only after proof.</h1>
      <p class="lead">GoalOS does not let every trace become memory. Accepted, replayable, claim-bound events may improve future routing. Suspicious events are quarantined. Unsupported events are rejected.</p>
      <div class="callout"><strong>The next core idea:</strong> evidence bundles are not only audit records — they become governed experience streams for safer future work.</div>
      <div class="actions">
        <button class="btn" data-run>Run experience stream</button>
        <button class="btn secondary" data-reanalyze>Reanalyze prior traces</button>
        <button class="btn secondary" data-download>Download demo bundle</button>
      </div>
      <div class="pillrow"><span class="pill">Browser-local</span><span class="pill">No user text entry</span><span class="pill">No upload</span><span class="pill">No wallet</span><span class="pill">No value moved</span></div>
    </div>
    <aside class="console" aria-label="Sovereign experience console">
      <div class="console-head"><span>Experience control plane</span><span>Review mode</span></div>
      <div class="experience-orbit">
        <div class="ring"></div><div class="ring two"></div>
        <div class="core">GOALOS<br/>EXPERIENCE</div>
        <div class="node n1">Evidence Event<small>state · action · observation</small></div>
        <div class="node n2">Replay Gate<small>accepted or held</small></div>
        <div class="node n3">Grounded Reward Ledger<small>consequence separated</small></div>
        <div class="node n4">Policy Update<small>only after proof</small></div>
      </div>
      <div class="metrics">
        <div class="metric" data-metric="verified"><strong>61</strong><span>verified work</span></div>
        <div class="metric" data-metric="debt"><strong>42</strong><span>proof debt</span></div>
        <div class="metric" data-metric="waste"><strong>29</strong><span>routing waste</span></div>
        <div class="metric" data-metric="options"><strong>1</strong><span>temporal options</span></div>
      </div>
    </aside>
  </section>

  <section class="section wrap">
    <div class="eyebrow">The missing bridge</div>
    <h2 class="section-title">From proof record to governed learning.</h2>
    <div class="grid">
      <article class="card"><h3>Evidence event</h3><p>Each synthetic event records state, action, observation, validation, cost, risk, and memory effect. Output alone is not enough.</p></article>
      <article class="card"><h3>Replay before reuse</h3><p>Replayable accepted experience can inform future routing. Held events become warnings. Rejected events cannot update policy.</p></article>
      <article class="card"><h3>Temporal option</h3><p>Repeated accepted patterns become bounded macro-workflows with initiation conditions, validators, termination rules, and risk class.</p></article>
    </div>
  </section>

  <section class="section wrap" id="lab">
    <div class="eyebrow">Browser-local lab</div>
    <h2 class="section-title">Watch GoalOS choose what the next mission is allowed to learn from.</h2>
    <div class="lab">
      <aside class="lab-panel">
        <h3>Choose a public-safe scenario</h3>
        <p>No information is submitted. These are synthetic scenarios already inside the page.</p>
        <div class="scenario-list">
          ${config.scenarios.map((s,i)=>`<button class="scenario ${i===0?'active':''}" data-scenario="${s.id}"><strong>${s.label}</strong><small>${s.objective}</small></button>`).join('')}
        </div>
        <div class="actions"><button class="btn" data-run>Run stream</button><button class="btn secondary" data-download>Download</button></div>
      </aside>
      <section class="lab-panel">
        <div class="stagebar">${['Capture','Replay','Reward','Reanalyze','Promote'].map((s,i)=>`<div class="stage"><small>0${i+1}</small><br/>${s}</div>`).join('')}</div>
        <div class="trace" id="trace" aria-live="polite"></div>
        <div class="tabs"><button class="tab active" data-panel="docket">Docket</button><button class="tab" data-panel="reward">Grounded reward ledger</button><button class="tab" data-panel="options">Temporal Option Registry</button><button class="tab" data-panel="policy">Policy certificate</button></div>
        <h3 id="panelTitle">Evidence Docket</h3>
        <pre id="panelJson"></pre>
      </section>
    </div>
  </section>

  <section class="section wrap">
    <div class="eyebrow">Before / after</div>
    <h2 class="section-title">The institution improves by refusing bad memory.</h2>
    <div class="comparison">
      <div class="scorecard"><h3>Without GoalOS</h3><div class="scoreline"><span>Activity traces</span><strong>many</strong></div><div class="scoreline"><span>Replay authority</span><strong>unclear</strong></div><div class="scoreline"><span>Proof debt</span><strong>accumulates</strong></div><div class="scoreline"><span>Memory risk</span><strong>high</strong></div><p>Everything persuasive can accidentally influence the next run.</p></div>
      <div class="scorecard"><h3>With GoalOS</h3><div class="scoreline"><span>Accepted experience</span><strong>replayable</strong></div><div class="scoreline"><span>Quarantine</span><strong>preserved</strong></div><div class="scoreline"><span>Policy update</span><strong>certified</strong></div><div class="scoreline"><span>Future routing</span><strong>bounded</strong></div><p>Only proof-carrying experience becomes learning authority.</p></div>
    </div>
  </section>

  <section class="section wrap">
    <div class="eyebrow">Public artifacts</div>
    <h2 class="section-title">Inspect the experience packet.</h2>
    <div class="grid">
      <a class="card" href="sovereign-experience-stream-demo-bundle.json"><h3>Experience bundle</h3><p>Full synthetic scenario set, events, metrics, and public-safety boundary.</p></a>
      <a class="card" href="grounded-reward-ledger.json"><h3>Grounded Reward Ledger</h3><p>Signals, weights, and rejected signals for guarded routing updates.</p></a>
      <a class="card" href="temporal-option-registry.json"><h3>Temporal Option Registry</h3><p>Reusable macro-workflows admitted only after replay and validation.</p></a>
      <a class="card" href="router-policy-update-certificate.json"><h3>Policy Update Certificate</h3><p>Certificate showing hard gates before synthetic routing promotion.</p></a>
      <a class="card" href="experience-reanalyze-report.json"><h3>Reanalyze report</h3><p>How prior traces are reread as accepted experience, warnings, or rejects.</p></a>
      <a class="card" href="capability-compounding-lab.html"><h3>Next: compounding</h3><p>See how accepted proof becomes reusable capability across missions.</p></a>
    </div>
  </section>
</main>
${footer('experience')}
<script src="assets/sovereign-experience-v15.js"></script>
</body>
</html>`;
fs.writeFileSync(path.join(site, config.route), page);
// Stable alias for users who expect the shorter lab URL.
fs.writeFileSync(path.join(site, 'sovereign-experience-lab.html'), page.replaceAll('sovereign-experience-stream-lab.html', 'sovereign-experience-lab.html'));

function upsertHomeRail() {
  const indexPath = path.join(site, 'index.html');
  if (!fs.existsSync(indexPath)) return;
  let html = fs.readFileSync(indexPath, 'utf8');
  const rail = `
<!-- GOALOS-SOVEREIGN-EXPERIENCE-HOME-RAIL -->
<section class="home-rail" id="sovereign-experience-stream">
  <div class="eyebrow">Sovereign experience stream</div>
  <h2>Only accepted experience teaches the institution.</h2>
  <p>Run a browser-local lab showing how GoalOS turns proof into governed experience: accepted events may update future routing, suspicious events are quarantined, and unsupported claims never become memory.</p>
  <div class="actions"><a class="btn" href="sovereign-experience-stream-lab.html">Open Experience Stream Lab</a><a class="btn secondary" href="grounded-reward-ledger.json">Inspect reward ledger</a><a class="btn secondary" href="temporal-option-registry.json">View temporal options</a></div>
  <div class="pillrow"><span class="pill">No user text entry</span><span class="pill">Replay before reuse</span><span class="pill">Quarantine before learning</span><span class="pill">Policy update certificate</span></div>
</section>`;
  html = html.replace(/<!-- GOALOS-SOVEREIGN-EXPERIENCE-HOME-RAIL -->[\s\S]*?(?=<footer|<div class="public-rule"|<\/main>|<\/body>)/, '');
  const anchors = ['<footer', '<div class="public-rule"', '</main>', '</body>'];
  let inserted = false;
  for (const anchor of anchors) {
    const idx = html.indexOf(anchor);
    if (idx !== -1) { html = html.slice(0, idx) + rail + '\n' + html.slice(idx); inserted = true; break; }
  }
  if (!inserted) html += rail;
  // Ensure stylesheet is present on homepage.
  if (!html.includes('sovereign-experience-v15.css')) {
    html = html.replace('</head>', '<link rel="stylesheet" href="assets/sovereign-experience-v15.css" /></head>');
  }
  fs.writeFileSync(indexPath, html);
}
upsertHomeRail();

console.log(`GoalOS Sovereign Experience Stream Lab generated: ${config.route}`);
console.log(`Artifacts: ${config.publicArtifacts.join(', ')}`);
