#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = process.cwd();
const site = path.join(root, 'site');
const assets = path.join(site, 'assets');
const localCfg = path.join(root, 'config', 'proof-settlement-lab.json');
const fallbackCfg = path.join(path.dirname(new URL(import.meta.url).pathname), '..', 'config', 'proof-settlement-lab.json');
const cfg = JSON.parse(fs.readFileSync(fs.existsSync(localCfg) ? localCfg : fallbackCfg, 'utf8'));
fs.mkdirSync(assets, { recursive: true });
const now = new Date().toISOString();
const h = v => crypto.createHash('sha256').update(typeof v === 'string' ? v : JSON.stringify(v)).digest('hex');
const write = (rel, body) => { fs.mkdirSync(path.dirname(path.join(site, rel)), { recursive: true }); fs.writeFileSync(path.join(site, rel), body); };
const writeJson = (rel, obj) => write(rel, JSON.stringify(obj, null, 2));
const publicRule = 'No forms · no inputs · no uploads · no cookies · no analytics · no wallets · no payments · no personal or confidential data.';

const proofBundle = (s) => {
  const replayPass = s.verdict === 'settlement_signal' || s.verdict === 'human_gate';
  const quorum = s.verdict === 'settlement_signal' || s.verdict === 'human_gate';
  const challengeCleared = s.verdict === 'settlement_signal';
  const humanRequired = s.verdict === 'human_gate';
  const gates = {
    jobSpec: true,
    policyContext: true,
    environmentPinned: s.id !== 'output-only',
    traceRoot: s.id !== 'output-only',
    outputHash: true,
    costLedger: s.id !== 'output-only',
    safetyLedger: s.id !== 'output-only',
    replayResult: replayPass,
    validatorQuorum: quorum,
    challengeWindowClear: challengeCleared,
    riskBoundary: s.risk < 35,
    humanAuthority: !humanRequired,
    noValueMoved: true
  };
  return {
    candidate: s.candidate,
    scenario: s.id,
    mission: s.mission,
    verdict: s.verdict,
    reason: s.reason,
    proofBundleHash: h(`${s.id}:proof-bundle`).slice(0, 32),
    jobSpecHash: h(`${s.id}:job-spec`).slice(0, 24),
    traceRoot: gates.traceRoot ? h(`${s.id}:trace-root`).slice(0, 24) : null,
    outputHash: h(`${s.id}:output`).slice(0, 24),
    validatorCommits: quorum ? ['0x' + h(`${s.id}:validator-a`).slice(0, 16), '0x' + h(`${s.id}:validator-b`).slice(0, 16), '0x' + h(`${s.id}:validator-c`).slice(0, 16)] : [],
    validatorReveals: quorum ? ['PASS: replay evidence checked', 'PASS: claim boundary checked', humanRequired ? 'HOLD: human authority required' : 'PASS: challenge window clear'] : [],
    gates,
    alphaWorkUnits: s.alphaWU,
    simulatedSettlement: s.verdict === 'settlement_signal' ? 'READY_SIGNAL_ONLY' : 'NOT_READY',
    valueMoved: 0,
    walletConnection: false,
    publicSafe: true
  };
};
const bundles = Object.fromEntries(cfg.scenarios.map(s => [s.id, proofBundle(s)]));
const settlementCertificate = {
  title: 'GoalOS Proof-to-Settlement Readiness Certificate',
  generatedAt: now,
  route: cfg.route,
  rule: 'No ProofBundle, no settlement signal. Replay and validator gates must clear before any synthetic settlement readiness state is emitted.',
  selectedScenario: 'settlement-ready',
  acceptedCandidate: 'C2',
  rejectedCandidates: ['C0'],
  challengedCandidates: ['C1'],
  humanGatedCandidates: ['C3'],
  gatesRequired: cfg.gates,
  claimBoundary: cfg.doctrine.claimBoundary,
  publicSafety: cfg.publicSafety
};
settlementCertificate.hash = h(settlementCertificate);
const alphaLedger = {
  title: 'Synthetic Alpha Work Unit Ledger',
  generatedAt: now,
  note: 'Synthetic browser-local demonstration only. No token, wallet, escrow, staking, payment, custody, or Mainnet transaction is used.',
  formula: 'α-WU = difficulty × proof quality × replay pass × validator quorum × policy pass × risk adjustment',
  rows: cfg.scenarios.map(s => ({ candidate: s.candidate, scenario: s.id, alphaWU: s.alphaWU, reason: s.reason, valueMoved: 0 }))
};
alphaLedger.hash = h(alphaLedger);
const commitRevealRecord = {
  title: 'Commit-Reveal Validator Record',
  generatedAt: now,
  purpose: 'Demonstrate validator independence: commit first, reveal after proof review, then resolve challenge status.',
  validators: ['validator-a.synthetic', 'validator-b.synthetic', 'validator-c.synthetic'],
  records: Object.values(bundles).map(b => ({ candidate: b.candidate, commits: b.validatorCommits, reveals: b.validatorReveals, replayResult: b.gates.replayResult, quorum: b.gates.validatorQuorum }))
};
commitRevealRecord.hash = h(commitRevealRecord);
const challengeReceipt = {
  title: 'Challenge Window Receipt',
  generatedAt: now,
  candidates: Object.values(bundles).map(b => ({ candidate: b.candidate, challengeWindowClear: b.gates.challengeWindowClear, humanAuthority: b.gates.humanAuthority, simulatedSettlement: b.simulatedSettlement })),
  invariant: 'A challenge window is a gate, not a decoration. If replay or human authority is incomplete, settlement readiness is not emitted.'
};
challengeReceipt.hash = h(challengeReceipt);
const chronicleEntry = {
  title: 'Synthetic Chronicle Entry',
  generatedAt: now,
  entryId: 'chronicle:proof-settlement-lab:v16',
  accepted: 'C2',
  retainedWarnings: ['C1 replay gap', 'C3 human authority requirement'],
  rejected: ['C0 output-only'],
  learning: 'Economic consequence attaches to proof-cleared work, not persuasive output.',
  valueMoved: 0
};
chronicleEntry.hash = h(chronicleEntry);
const demoBundle = { package: cfg.package, version: cfg.version, generatedAt: now, doctrine: cfg.doctrine, scenarios: cfg.scenarios, proofBundles: bundles, settlementCertificate, alphaLedger, commitRevealRecord, challengeReceipt, chronicleEntry, publicSafety: cfg.publicSafety };

writeJson('proof-settlement-demo-bundle.json', demoBundle);
writeJson('settlement-readiness-certificate.json', settlementCertificate);
writeJson('alpha-work-unit-ledger.json', alphaLedger);
writeJson('commit-reveal-validator-record.json', commitRevealRecord);
writeJson('challenge-window-receipt.json', challengeReceipt);
writeJson('simulated-chronicle-entry.json', chronicleEntry);
writeJson(cfg.manifestRoute, { package: cfg.package, version: cfg.version, generatedAt: now, route: cfg.route, aliasRoute: cfg.aliasRoute, artifacts: ['proof-settlement-demo-bundle.json', 'settlement-readiness-certificate.json', 'alpha-work-unit-ledger.json', 'commit-reveal-validator-record.json', 'challenge-window-receipt.json', 'simulated-chronicle-entry.json'], publicSafety: cfg.publicSafety });

const css = `:root{--bg:#020807;--panel:rgba(16,31,30,.76);--panel2:rgba(4,12,14,.88);--line:rgba(113,255,220,.3);--text:#fff8ea;--muted:#b9c8c5;--mint:#75ffdd;--aqua:#69eaff;--gold:#fff08a;--violet:#bba8ff;--red:#ff7895;--hold:#ffd36e;--ok:#7effbf;--r:28px}*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:radial-gradient(circle at 82% 8%,rgba(105,234,255,.24),transparent 34%),radial-gradient(circle at 18% 78%,rgba(146,106,255,.14),transparent 28%),linear-gradient(120deg,#020707,#071311 54%,#061021);color:var(--text);font-family:Inter,ui-sans-serif,system-ui,-apple-system,Segoe UI,Arial,sans-serif;overflow-x:hidden}body:before{content:"";position:fixed;inset:0;z-index:-2;background-image:linear-gradient(rgba(255,255,255,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.03) 1px,transparent 1px);background-size:84px 84px;mask-image:linear-gradient(to bottom,rgba(0,0,0,.95),rgba(0,0,0,.24))}#field{position:fixed;inset:0;z-index:-1;opacity:.62}.topbar{min-height:88px;padding:18px clamp(20px,5vw,72px);display:flex;gap:22px;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:10;background:rgba(1,7,8,.92);border-bottom:1px solid var(--line);backdrop-filter:blur(18px)}.brand{display:flex;gap:14px;align-items:center;color:var(--text);text-decoration:none;text-transform:uppercase;letter-spacing:.18em;font-size:12px}.brand small{display:block;color:var(--muted);font-size:10px;margin-top:3px}.orb{width:42px;height:42px;border-radius:14px;border:1px solid var(--line);background:radial-gradient(circle,var(--mint),#2a4f78 48%,#061110 70%);box-shadow:0 0 32px rgba(113,255,220,.42)}nav{display:flex;gap:9px;flex-wrap:wrap;align-items:center}nav a{color:var(--text);font-weight:950;text-decoration:none;font-size:13px;padding:10px 12px;border-radius:999px}nav a[aria-current="page"],nav a:hover{background:rgba(255,255,255,.12);box-shadow:inset 0 0 0 1px rgba(255,255,255,.14)}main{width:min(1180px,calc(100% - 34px));margin:auto}.hero{min-height:calc(100vh - 88px);display:grid;grid-template-columns:minmax(0,1fr) minmax(370px,540px);gap:clamp(34px,7vw,88px);align-items:center;padding:clamp(70px,10vw,142px) 0}.eyebrow{color:var(--mint);letter-spacing:.38em;text-transform:uppercase;font-weight:950;font-size:12px;margin:0 0 18px}.hero h1,.section h2,.lab h2{font-size:clamp(54px,8vw,108px);line-height:.88;letter-spacing:-.075em;margin:0 0 24px}.hero h1 em{display:block;font-family:Georgia,serif;font-style:italic;font-weight:500;letter-spacing:-.05em;background:linear-gradient(90deg,var(--gold),var(--mint),var(--aqua),var(--violet));-webkit-background-clip:text;color:transparent}.lead{font-size:clamp(18px,2vw,24px);line-height:1.46;color:#eef8f5;max-width:760px}.cta{display:flex;gap:12px;flex-wrap:wrap;align-items:center;margin:28px 0}.btn,button{border:0;border-radius:999px;padding:15px 22px;font-weight:950;color:var(--text);background:rgba(255,255,255,.13);box-shadow:inset 0 0 0 1px rgba(255,255,255,.18);text-decoration:none;cursor:pointer}.primary{color:#04100d;background:linear-gradient(100deg,var(--gold),var(--mint),var(--aqua));box-shadow:0 0 28px rgba(113,255,220,.35)}.chips{display:flex;gap:10px;flex-wrap:wrap}.chip{border:1px solid var(--line);border-radius:999px;padding:9px 13px;text-transform:uppercase;letter-spacing:.13em;color:#c9fff1;font-weight:900;font-size:11px;background:rgba(1,10,12,.5)}.panel{border:1px solid var(--line);border-radius:var(--r);background:linear-gradient(135deg,rgba(255,255,255,.13),rgba(255,255,255,.04));box-shadow:0 24px 80px rgba(0,0,0,.34),inset 0 0 0 1px rgba(255,255,255,.05);backdrop-filter:blur(14px)}.settlement-card{padding:22px}.card-head{display:flex;justify-content:space-between;gap:12px;text-transform:uppercase;letter-spacing:.28em;color:var(--mint);font-weight:950;font-size:11px}.ledger-flow{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin:22px 0}.gate{padding:15px;border:1px solid var(--line);border-radius:18px;background:rgba(0,0,0,.33);min-height:86px}.gate b{display:block;color:var(--gold);font-size:16px}.gate strong{display:block;margin:5px 0 4px}.gate span{font-size:12px;color:var(--muted)}.nucleus{height:230px;border-radius:26px;background:radial-gradient(circle at center,var(--mint),var(--aqua) 18%,rgba(113,255,220,.15) 38%,rgba(0,0,0,.52) 67%);display:grid;place-items:center;font-size:72px;font-family:Georgia,serif;color:#03110e;position:relative;overflow:hidden}.nucleus:before,.nucleus:after{content:"";position:absolute;inset:18px;border:1px dashed rgba(255,255,255,.26);border-radius:50%;animation:spin 14s linear infinite}.nucleus:after{inset:44px;animation-duration:9s;animation-direction:reverse}.settle-status{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:12px}.settle-status article{padding:15px;border:1px solid rgba(255,255,255,.12);border-radius:18px;background:rgba(0,0,0,.28)}.settle-status b{display:block;color:var(--gold);font-size:28px}.section,.lab{padding:clamp(64px,8vw,118px) 0}.section-head{display:flex;justify-content:space-between;gap:28px;align-items:end;margin-bottom:28px}.section-head h2{font-size:clamp(44px,6.3vw,86px);max-width:850px}.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}.card{border:1px solid rgba(255,255,255,.15);border-radius:24px;background:rgba(255,255,255,.07);padding:24px;min-height:220px}.card h3{font-size:34px;line-height:.95;letter-spacing:-.05em;margin:0 0 16px}.card p{color:var(--muted);line-height:1.55}.lab-grid{display:grid;grid-template-columns:420px minmax(0,1fr);gap:18px}.scenario-grid{display:grid;gap:10px}.scenario{width:100%;text-align:left;border-radius:20px;padding:16px;background:rgba(0,0,0,.28);border:1px solid rgba(255,255,255,.14);box-shadow:none}.scenario.active{border-color:var(--mint);background:rgba(113,255,220,.12)}.scenario small{color:var(--gold);font-weight:950}.scenario strong{display:block;font-size:18px;margin:6px 0}.scenario span{color:var(--muted);font-size:13px;line-height:1.35}.metrics{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin-top:14px}.metric{padding:16px;border:1px solid rgba(255,255,255,.14);border-radius:18px;background:rgba(255,255,255,.06)}.metric b{display:block;color:var(--gold);font-size:30px}.metric span{color:var(--muted);text-transform:uppercase;letter-spacing:.14em;font-size:10px;font-weight:900}.trace{margin-top:14px;min-height:180px;padding:18px;border:1px solid var(--line);border-radius:20px;background:rgba(0,0,0,.42);font-family:ui-monospace,SFMono-Regular,Menlo,monospace;color:#cffff0;line-height:1.6}.stage-board{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-top:14px}.stage-cell{border:1px solid rgba(255,255,255,.12);border-radius:18px;padding:13px;background:rgba(255,255,255,.06)}.stage-cell.pass{border-color:rgba(126,255,191,.6);box-shadow:0 0 22px rgba(126,255,191,.12)}.stage-cell.hold{border-color:rgba(255,211,110,.55)}.stage-cell.fail{border-color:rgba(255,120,149,.55)}.tabs{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px}.tab{padding:10px 14px;border-radius:999px}.tab.active{background:rgba(113,255,220,.18);box-shadow:inset 0 0 0 1px var(--line)}pre.code{white-space:pre-wrap;max-height:590px;overflow:auto;border:1px solid rgba(255,255,255,.15);border-radius:22px;background:rgba(0,0,0,.5);padding:20px;color:#d7fff5;line-height:1.45}.artifacts{display:grid;grid-template-columns:repeat(2,1fr);gap:12px}.artifact{display:block;border:1px solid var(--line);border-radius:18px;padding:16px;text-decoration:none;color:var(--text);background:rgba(255,255,255,.06)}.artifact b{display:block;color:var(--mint);margin-bottom:5px}.artifact span{color:var(--muted)}footer{border-top:1px solid rgba(113,255,220,.2);padding:38px clamp(20px,5vw,72px);display:flex;justify-content:space-between;gap:24px;color:var(--muted);background:rgba(0,0,0,.38)}footer a{color:var(--mint);font-weight:900;text-decoration:none}.legal-rail{width:min(1180px,calc(100% - 34px));margin:24px auto 42px;padding:16px 20px;border:1px solid var(--line);border-radius:999px;text-align:center;background:rgba(0,0,0,.52);font-size:13px}.legal-rail b{color:var(--gold)}@keyframes spin{to{transform:rotate(360deg)}}@media(max-width:980px){.hero,.lab-grid{grid-template-columns:1fr}.grid,.artifacts{grid-template-columns:1fr}.ledger-flow,.stage-board{grid-template-columns:repeat(2,1fr)}.section-head{display:block}.topbar{position:relative}footer{display:block}.legal-rail{border-radius:22px}}@media(max-width:560px){.hero h1,.section h2,.lab h2{font-size:44px}.ledger-flow,.stage-board,.settle-status,.metrics{grid-template-columns:1fr}nav a{font-size:12px;padding:8px}}`;
write('assets/proof-settlement-lab-v16.css', css);

const js = `(() => {
const data = ${JSON.stringify(demoBundle)};
let current = 'settlement-ready';
const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));
const trace = $('[data-trace]');
const board = $('[data-board]');
const code = $('[data-panel-json]');
const title = $('[data-panel-title]');
const metrics = {alpha:$('[data-metric="alpha"] b'), readiness:$('[data-metric="readiness"] b'), risk:$('[data-metric="risk"] b'), challenge:$('[data-metric="challenge"] b')};
function bundle(){ return data.proofBundles[current]; }
function render(panel='bundle'){
 const b = bundle();
 const passed = Object.values(b.gates).filter(Boolean).length;
 const total = Object.keys(b.gates).length;
 metrics.alpha.textContent = b.alphaWorkUnits;
 metrics.readiness.textContent = Math.round((passed/total)*100)+'%';
 metrics.risk.textContent = data.scenarios.find(s=>s.id===current).risk;
 metrics.challenge.textContent = b.gates.challengeWindowClear ? 'clear' : (b.gates.validatorQuorum ? 'open' : 'blocked');
 const gateRows = Object.entries(b.gates).map(([k,v])=>'<article class="stage-cell '+(v?'pass':(k==='humanAuthority'||k==='challengeWindowClear'?'hold':'fail'))+'"><b>'+(v?'PASS':(k==='humanAuthority'||k==='challengeWindowClear'?'HOLD':'FAIL'))+'</b><span>'+k+'</span></article>').join('');
 board.innerHTML = gateRows;
 trace.innerHTML = [
  '• Scenario: '+b.candidate+' / '+b.scenario,
  '• JobSpec hash: '+b.jobSpecHash,
  '• ProofBundle: '+b.proofBundleHash,
  '• Replay result: '+(b.gates.replayResult?'PASS':'NOT CLEARED'),
  '• Validator quorum: '+(b.gates.validatorQuorum?'PASS':'NOT CLEARED'),
  '• Challenge window: '+(b.gates.challengeWindowClear?'CLEAR':'OPEN / BLOCKED'),
  '• Settlement readiness: '+b.simulatedSettlement,
  '• Value moved: 0'
 ].join('<br>');
 const panels = {bundle:b, certificate:data.settlementCertificate, ledger:data.alphaLedger, validators:data.commitRevealRecord, challenge:data.challengeReceipt, chronicle:data.chronicleEntry};
 title.textContent = {bundle:'ProofBundle',certificate:'Settlement Readiness Certificate',ledger:'α-Work Unit Ledger',validators:'Commit-Reveal Record',challenge:'Challenge Window Receipt',chronicle:'Chronicle Entry'}[panel] || 'ProofBundle';
 code.textContent = JSON.stringify(panels[panel] || b, null, 2);
}
$$('.scenario').forEach(btn=>btn.addEventListener('click',()=>{current=btn.dataset.scenario;$$('.scenario').forEach(x=>x.classList.remove('active'));btn.classList.add('active');render(document.querySelector('.tab.active')?.dataset.panel || 'bundle')}));
$$('.tab').forEach(btn=>btn.addEventListener('click',()=>{$$('.tab').forEach(x=>x.classList.remove('active'));btn.classList.add('active');render(btn.dataset.panel)}));
$('[data-run]').addEventListener('click',()=>{const order=['output-only','proof-with-gap','human-gated','settlement-ready'];let i=0;trace.innerHTML='• Starting proof-to-settlement control loop...';const tick=()=>{current=order[i%order.length];$$('.scenario').forEach(x=>x.classList.toggle('active',x.dataset.scenario===current));render(document.querySelector('.tab.active')?.dataset.panel || 'bundle');i++;if(i<order.length)setTimeout(tick,720)};setTimeout(tick,500)});
$('[data-reset]').addEventListener('click',()=>{current='settlement-ready';$$('.scenario').forEach(x=>x.classList.toggle('active',x.dataset.scenario===current));render()});
$('[data-download]').addEventListener('click',()=>{const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='goalos-proof-settlement-lab-demo-bundle.json';a.click();URL.revokeObjectURL(a.href)});
render();
})();`;
write('assets/proof-settlement-lab-v16.js', js);

const nav = [
  ['Institution','index.html'], ['Browser beta','browser-beta.html'], ['Mission 001','mission-001.html'], ['Selection gate','proof-gradient-lab.html'], ['Compounding','capability-compounding-lab.html'], ['Experience','sovereign-experience-stream-lab.html'], ['Settlement lab','proof-settlement-lab.html'], ['Docket','evidence-docket-demo.html'], ['$AGIALPHA','agialpha-token-boundary.html'], ['Data posture','no-user-data.html']
];
const navHtml = nav.map(([label,href]) => `<a href="${href}"${href===cfg.route?' aria-current="page"':''}>${label}</a>`).join('');
const footer = `<footer><div><strong>GoalOS Signoff Pro</strong><p>Proof-to-acceptance · evidence dockets · validator gates · simulated settlement readiness · human authority.</p></div><nav><a href="privacy.html">Privacy</a><a href="terms.html">Terms</a><a href="no-user-data.html">No User Data</a><a href="agialpha-token-boundary.html">$AGIALPHA Boundary</a></nav></footer><div class="legal-rail" data-goalos-legal-rail="v12"><b>Public site rule</b> ${publicRule}</div>`;
const artifactsHtml = ['proof-settlement-demo-bundle.json','settlement-readiness-certificate.json','alpha-work-unit-ledger.json','commit-reveal-validator-record.json','challenge-window-receipt.json','simulated-chronicle-entry.json'].map(f => `<a class="artifact" href="${f}"><b>${f}</b><span>Public-safe synthetic artifact</span></a>`).join('');
const scenariosHtml = cfg.scenarios.map(s => `<button class="scenario ${s.id==='settlement-ready'?'active':''}" data-scenario="${s.id}"><small>${s.candidate} · ${s.verdict.replace(/_/g,' ')}</small><strong>${s.label}</strong><span>${s.mission}</span></button>`).join('');
const gatesHtml = cfg.gates.slice(0,8).map((g,i)=>`<article class="gate"><b>${String(i+1).padStart(2,'0')}</b><strong>${g}</strong><span>${['job boundary','policy root','runtime proof','dependency integrity','input commitment','output commitment','trace commitment','resource ledger'][i] || 'gate'}</span></article>`).join('');
const page = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>GoalOS Proof-to-Settlement Control Lab</title><meta name="description" content="A browser-local GoalOS demo: no ProofBundle, no settlement signal."><link rel="stylesheet" href="assets/proof-settlement-lab-v16.css"></head><body><canvas id="field" aria-hidden="true"></canvas><header class="topbar"><a class="brand" href="index.html"><span class="orb"></span><span>GoalOS Signoff Pro<small>Proof-to-settlement control lab</small></span></a><nav>${navHtml}</nav></header><main><section class="hero"><div><p class="eyebrow">Proof becomes economic control</p><h1>No ProofBundle. <em>No settlement signal.</em></h1><p class="lead">This browser-local lab shows the GoalOS economic boundary: persuasive output does not earn settlement readiness. Only replayable proof, validator quorum, challenge clearance, risk control, and human authority can emit a synthetic settlement signal.</p><div class="cta"><a class="btn primary" href="#lab">Run settlement lab</a><a class="btn" href="mission-001.html">Inspect Mission 001</a><a class="btn" href="agialpha-token-boundary.html">Read $AGIALPHA boundary</a></div><div class="chips">${['browser-local','no wallet','no escrow','no payment','no value moved'].map(x=>`<span class="chip">${x}</span>`).join('')}</div></div><div class="panel settlement-card"><div class="card-head"><span>Settlement readiness console</span><span>simulation mode</span></div><div class="nucleus">α</div><div class="ledger-flow">${gatesHtml}</div><div class="settle-status"><article><b>0</b><span>value moved</span></article><article><b>38.6</b><span>synthetic α-WU</span></article><article><b>C2</b><span>proof-cleared candidate</span></article></div></div></section>
<section class="section"><div class="section-head"><div><p class="eyebrow">The settlement law</p><h2>Economic consequence must be earned by proof.</h2></div><p class="lead">GoalOS separates output from authority. A report can be useful, but it cannot become settlement-ready until proof, replay, validators, risk boundaries, challenge windows, and human gates clear.</p></div><div class="grid"><article class="card"><h3>Output is not work.</h3><p>Polished AI text can start review, but without trace roots, evidence, replay, and validation it remains non-settleable.</p></article><article class="card"><h3>Proof is not enough alone.</h3><p>Claims and hashes still need replay, independent validator reveals, risk ledgers, and challenge windows.</p></article><article class="card"><h3>Authority remains gated.</h3><p>Even strong proof may stop at a human gate when the risk class or scope requires explicit review.</p></article></div></section>
<section class="lab" id="lab"><div class="section-head"><div><p class="eyebrow">Browser-local lab</p><h2>Run the proof-to-settlement control loop.</h2></div><p class="lead">Choose a candidate. The lab shows why GoalOS rejects output-only work, holds replay gaps, preserves human authority, and emits settlement readiness only when every gate clears.</p></div><div class="lab-grid"><div><div class="scenario-grid">${scenariosHtml}</div><div class="cta"><button class="primary" data-run>Run all candidates</button><button data-reset>Reset</button><button data-download>Download demo bundle</button></div><div class="metrics"><article class="metric" data-metric="alpha"><b>0</b><span>synthetic α-WU</span></article><article class="metric" data-metric="readiness"><b>0%</b><span>readiness</span></article><article class="metric" data-metric="risk"><b>0</b><span>risk index</span></article><article class="metric" data-metric="challenge"><b>—</b><span>challenge window</span></article></div><div class="trace" data-trace></div></div><div><div class="tabs"><button class="tab active" data-panel="bundle">ProofBundle</button><button class="tab" data-panel="certificate">Certificate</button><button class="tab" data-panel="ledger">α-WU</button><button class="tab" data-panel="validators">Validators</button><button class="tab" data-panel="challenge">Challenge</button><button class="tab" data-panel="chronicle">Chronicle</button></div><h3 data-panel-title>ProofBundle</h3><div class="stage-board" data-board></div><pre class="code" data-panel-json>{}</pre></div></div></section>
<section class="section"><div class="section-head"><div><p class="eyebrow">Protocol objects</p><h2>Settlement readiness has typed evidence.</h2></div><p class="lead">The lab emits public-safe artifacts for the proof bundle, validator commit-reveal record, synthetic α-Work Unit ledger, challenge-window receipt, simulated settlement-readiness certificate, and Chronicle entry.</p></div><div class="artifacts">${artifactsHtml}</div></section>
<section class="section"><div class="section-head"><div><p class="eyebrow">Claim boundary</p><h2>Simulation, not value movement.</h2></div><p class="lead">This page demonstrates the control architecture. It does not connect a wallet, custody assets, move funds, release escrow, perform protocol bonding, or perform a Mainnet transaction. $AGIALPHA is referenced only as an external protocol-token boundary.</p></div><div class="grid"><article class="card"><h3>No wallet.</h3><p>The demo is fully browser-local and uses no Web3 provider, wallet connection, transaction, private credential or signature request.</p></article><article class="card"><h3>No value moved.</h3><p>All settlement records are synthetic readiness signals. They exist to show proof-to-settlement logic, not to transfer funds.</p></article><article class="card"><h3>No user data.</h3><p>The page has no forms, no text boxes, no uploads, no analytics, no cookies, and no user account path.</p></article></div></section></main>${footer}<script src="assets/proof-settlement-lab-v16.js"></script><script>(()=>{const c=document.getElementById('field'),x=c.getContext('2d');let w,h,p=[];function r(){w=c.width=innerWidth;h=c.height=innerHeight;p=Array.from({length:92},()=>({x:Math.random()*w,y:Math.random()*h,vx:(Math.random()-.5)*.24,vy:(Math.random()-.5)*.24}))}function a(){x.clearRect(0,0,w,h);p.forEach((q,i)=>{q.x=(q.x+q.vx+w)%w;q.y=(q.y+q.vy+h)%h;x.fillStyle=i%4?'rgba(117,255,221,.75)':'rgba(255,240,138,.85)';x.fillRect(q.x,q.y,2,2);for(let j=i+1;j<p.length;j++){const d=Math.hypot(q.x-p[j].x,q.y-p[j].y);if(d<112){x.strokeStyle='rgba(117,255,221,'+(0.18-d/700)+')';x.beginPath();x.moveTo(q.x,q.y);x.lineTo(p[j].x,p[j].y);x.stroke()}}});requestAnimationFrame(a)}addEventListener('resize',r);r();a()})()</script></body></html>`;
write(cfg.route, page);
write(cfg.aliasRoute, page);

function injectHomeRail(){
  const idx = path.join(site, 'index.html');
  const rail = `<section class="section" data-goalos-module="GOALOS-PROOF-SETTLEMENT-HOME-RAIL"><div class="section-head"><div><p class="eyebrow">Proof-to-settlement control</p><h2>No ProofBundle. No settlement signal.</h2></div><p class="lead">Run the browser-local settlement lab: output-only work is rejected, replay gaps are challenged, human gates are preserved, and only proof-cleared work emits a synthetic settlement-readiness certificate.</p></div><div class="cta"><a class="btn primary" href="proof-settlement-lab.html">Open settlement lab</a><a class="btn" href="settlement-readiness-certificate.json">Inspect certificate</a></div></section>`;
  if (!fs.existsSync(idx)) { write('index.html', `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>GoalOS Signoff Pro</title><link rel="stylesheet" href="assets/proof-settlement-lab-v16.css"></head><body><main>${rail}</main>${footer}</body></html>`); return; }
  let s = fs.readFileSync(idx, 'utf8');
  if (s.includes('GOALOS-PROOF-SETTLEMENT-HOME-RAIL')) return;
  const pos = s.indexOf('<footer');
  s = pos >= 0 ? s.slice(0, pos) + rail + s.slice(pos) : s + rail;
  fs.writeFileSync(idx, s);
}
injectHomeRail();
console.log(`GoalOS Proof-to-Settlement Control Lab v${cfg.version} generated ${cfg.route} and ${cfg.aliasRoute}`);
