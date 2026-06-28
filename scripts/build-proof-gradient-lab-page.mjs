#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const ROOT = process.cwd();
const SITE = path.join(ROOT, 'site');
const ASSETS = path.join(SITE, 'assets');
const cfgPath = path.join(ROOT, 'config', 'proof-gradient-lab.json');
const cfg = fs.existsSync(cfgPath) ? JSON.parse(fs.readFileSync(cfgPath, 'utf8')) : {};
const version = cfg.version || '13.0.0-final';
const baseUrl = cfg.baseUrl || 'https://montrealai.github.io/goalos-signoff-pro/';
const generatedAt = new Date().toISOString();
const commit = process.env.GITHUB_SHA || 'local';

fs.mkdirSync(SITE, { recursive: true });
fs.mkdirSync(ASSETS, { recursive: true });

const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const hash = value => crypto.createHash('sha256').update(String(value)).digest('hex');
const write = (rel, content) => { fs.mkdirSync(path.dirname(path.join(SITE, rel)), { recursive: true }); fs.writeFileSync(path.join(SITE, rel), content); };
const writeJson = (rel, obj) => write(rel, JSON.stringify(obj, null, 2));

const publicRule = 'No forms · no uploads · no cookies · no analytics · no wallets · no payments · no personal or confidential data.';

const candidates = [
  {
    id: 'C0',
    title: 'Persuasive output',
    type: 'Narrative answer',
    summary: 'Looks fluent, but has no trace root, no baseline, no replay path, and no risk ledger.',
    quality: 76, proof: 0, eval: 0, risk: 42, cost: 8, rollback: 0, canary: 0, scope: 0, challenge: 0,
    decision: 'Reject', reason: 'Proof is absent.'
  },
  {
    id: 'C1',
    title: 'Agent activity trace',
    type: 'Busy workflow',
    summary: 'Shows many steps and tool-like events, but does not bind claims to evidence or compare a baseline.',
    quality: 68, proof: 36, eval: 20, risk: 34, cost: 31, rollback: 10, canary: 0, scope: 18, challenge: 0,
    decision: 'Reject', reason: 'Activity is not proof.'
  },
  {
    id: 'C2',
    title: 'Proof packet candidate',
    type: 'Evidence-bearing work',
    summary: 'Includes hashes, a claims matrix, cost ledger, and verifier notes, but rollback readiness is incomplete.',
    quality: 82, proof: 83, eval: 78, risk: 16, cost: 22, rollback: 34, canary: 63, scope: 70, challenge: 74,
    decision: 'Hold', reason: 'Rollback gate is not ready.'
  },
  {
    id: 'C3',
    title: 'Proof-carrying capability',
    type: 'Upgrade-ready artifact',
    summary: 'Binds objective, run, proof, validation, cost/risk, rollback, canary scope, and challenge window.',
    quality: 86, proof: 96, eval: 92, risk: 7, cost: 18, rollback: 93, canary: 88, scope: 94, challenge: 90,
    decision: 'Promote', reason: 'All hard gates clear.'
  }
];

const gates = [
  ['ProofValid', c => c.proof >= 80, 'The work must carry a verifiable proof packet.'],
  ['EvalPass', c => c.eval >= 75, 'An evaluator or verifier must pass the candidate.'],
  ['Risk ≤ ρ', c => c.risk <= 20, 'The risk ledger must stay inside the declared boundary.'],
  ['RollbackReady', c => c.rollback >= 80, 'A safe rollback target must exist before propagation.'],
  ['CanaryReady', c => c.canary >= 75, 'The release must be scope-limited before expansion.'],
  ['ScopeAuthorized', c => c.scope >= 75, 'The candidate may only affect the authorized scope.'],
  ['ChallengeCleared', c => c.challenge >= 75, 'Challenge window or review burden must be clear.']
];

function scoreCandidate(c){
  const value = (0.22*c.quality) + (0.28*c.proof) + (0.22*c.eval) + (0.10*c.rollback) + (0.08*c.canary) + (0.07*c.scope) + (0.03*c.challenge) - (0.35*c.risk) - (0.08*c.cost);
  return Number(Math.max(0, Math.min(100, value)).toFixed(2));
}

const evaluated = candidates.map(c => {
  const gateResults = gates.map(([name, fn, explanation]) => ({ name, pass: Boolean(fn(c)), explanation }));
  const hardPass = gateResults.every(g => g.pass);
  return { ...c, proofGradientScore: scoreCandidate(c), gateResults, hardPass, selected: hardPass && c.decision === 'Promote' };
});
const selected = evaluated.find(c => c.selected);

const selectionCertificate = {
  schema: 'goalos.selection_certificate.v13.public_demo',
  version,
  generatedAt,
  commit,
  page: 'proof-gradient-lab.html',
  claimBoundary: 'Browser-local synthetic demonstration. Not an external audit, production certification, live settlement, or empirical SOTA claim.',
  selectionLaw: 'Score is advisory; hard gates are mandatory.',
  objective: 'Show why output becomes institution-grade only after proof, validation, risk control, rollback readiness, and challenge clearance.',
  candidates: evaluated.map(c => ({ id:c.id, title:c.title, type:c.type, score:c.proofGradientScore, decision:c.selected ? 'PROMOTE' : c.decision.toUpperCase(), hardGatePass:c.hardPass, failedGates:c.gateResults.filter(g => !g.pass).map(g => g.name) })),
  selectedCandidate: selected?.id || null,
  certificateHash: hash(JSON.stringify({ evaluated, selected:selected?.id, version }))
};

const evolutionLedgerEntry = {
  schema: 'goalos.evolution_ledger_entry.v13.public_demo',
  entryType: 'SelectionCertificate',
  candidateId: selected?.id,
  artifactClass: 'capability_package',
  previousState: 'candidate',
  nextState: 'canary_ready',
  proofRoot: hash(JSON.stringify(selected)),
  evidenceDocketPointer: 'proof-gradient-demo-docket.json',
  selectionCertificatePointer: 'proof-gradient-selection-certificate.json',
  rollbackTarget: 'C2-proof-packet-candidate',
  publicPrivateBoundary: 'Only public-safe hashes, scores, claim boundaries, and synthetic artifacts are written to this public demo.',
  ledgerHash: hash(JSON.stringify(selectionCertificate) + 'ledger')
};

const demoDocket = {
  schema: 'goalos.evidence_docket_6_1.public_demo',
  version,
  generatedAt,
  mission: 'Selection Gate Lab',
  purpose: 'Demonstrate that a proof page is an audit surface: claims, baselines, proof packets, costs, risks, gates, replay path, and boundaries.',
  claimsMatrix: [
    { claim: 'Output alone is not institution-grade work.', evidence: ['C0 fails ProofValid and EvalPass'], status: 'supported in demo' },
    { claim: 'Agent activity is not enough without evidence binding.', evidence: ['C1 has traces but fails proof/eval gates'], status: 'supported in demo' },
    { claim: 'Proof must include rollback readiness before propagation.', evidence: ['C2 passes proof but fails RollbackReady'], status: 'supported in demo' },
    { claim: 'Accepted work can become reusable capability only after all hard gates clear.', evidence: ['C3 passes all gates and emits SelectionCertificate'], status: 'supported in demo' }
  ],
  baselines: evaluated.map(c => ({ id:c.id, title:c.title, proofGradientScore:c.proofGradientScore, decision:c.selected ? 'PROMOTE' : c.decision })),
  proofPackets: evaluated.map(c => ({ candidateId:c.id, proofRoot:hash(JSON.stringify(c)).slice(0,32), gateResults:c.gateResults })),
  costLedger: evaluated.map(c => ({ candidateId:c.id, syntheticCost:c.cost, coordinationOverhead:c.id === 'C1' ? 31 : c.id === 'C3' ? 9 : 12 })),
  riskLedger: evaluated.map(c => ({ candidateId:c.id, risk:c.risk, criticalSafetyIncidents:0, dataBoundary:'public synthetic demo only' })),
  selectionCertificate,
  evolutionLedgerEntry,
  replayPath: ['Open page','Click Run Selection Gate','Observe candidates','Inspect hard gates','Download certificate','Download Evidence Docket'],
  publicRule
};

writeJson('proof-gradient-selection-certificate.json', selectionCertificate);
writeJson('proof-gradient-evolution-ledger-entry.json', evolutionLedgerEntry);
writeJson('proof-gradient-demo-docket.json', demoDocket);

function button(href, label, cls='') { return `<a class="pg-btn ${cls}" href="${esc(href)}">${esc(label)}</a>`; }
function chip(t) { return `<span class="pg-chip">${esc(t)}</span>`; }
function candidateCards(){
  return evaluated.map(c => `<article class="pg-candidate" data-candidate="${c.id}">
    <div class="pg-candidate-top"><b>${esc(c.id)}</b><span>${esc(c.type)}</span></div>
    <h3>${esc(c.title)}</h3>
    <p>${esc(c.summary)}</p>
    <div class="pg-score"><span>Proof Gradient</span><strong>${c.proofGradientScore}</strong></div>
    <div class="pg-bars">
      ${[['quality',c.quality],['proof',c.proof],['eval',c.eval],['risk',100-c.risk],['rollback',c.rollback]].map(([k,v]) => `<div><span>${esc(k)}</span><i><em style="width:${Math.max(4, v)}%"></em></i></div>`).join('')}
    </div>
    <div class="pg-result ${c.selected ? 'promote' : c.decision.toLowerCase()}">${c.selected ? 'PROMOTE' : esc(c.decision.toUpperCase())}</div>
  </article>`).join('');
}
function gateRows(){
  return gates.map(([name,,explanation], i) => `<div class="pg-gate" data-gate="${esc(name)}"><b>${String(i+1).padStart(2,'0')}</b><strong>${esc(name)}</strong><span>${esc(explanation)}</span><i></i></div>`).join('');
}
function tableRows(){
  return evaluated.map(c => `<tr><td><b>${esc(c.id)}</b><br>${esc(c.title)}</td><td>${c.proofGradientScore}</td><td>${c.gateResults.filter(g=>g.pass).length}/${gates.length}</td><td>${c.gateResults.filter(g=>!g.pass).map(g=>g.name).join(', ') || 'None'}</td><td>${c.selected ? 'PROMOTE' : esc(c.decision)}</td></tr>`).join('');
}

const css = String.raw`
:root{--bg:#020807;--panel:rgba(20,44,39,.78);--panel2:rgba(5,14,16,.86);--line:rgba(113,255,223,.30);--text:#fff8ed;--muted:#b9cbca;--mint:#6fffe0;--cyan:#64e8ff;--gold:#fff08b;--rose:#ff8bbd;--shadow:0 28px 90px rgba(0,0,0,.42);--radius:28px}*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:radial-gradient(circle at 76% 12%,rgba(111,255,224,.18),transparent 34%),radial-gradient(circle at 17% 72%,rgba(139,111,255,.16),transparent 30%),linear-gradient(120deg,#020706,#051313 55%,#07112a);color:var(--text);font-family:Inter,ui-sans-serif,system-ui,-apple-system,Segoe UI,Arial,sans-serif;overflow-x:hidden}body:before{content:"";position:fixed;inset:0;pointer-events:none;background-image:linear-gradient(rgba(255,255,255,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.03) 1px,transparent 1px);background-size:88px 88px;mask-image:linear-gradient(to bottom,rgba(0,0,0,.95),rgba(0,0,0,.2));z-index:-2}.pg-field{position:fixed;inset:0;z-index:-1;opacity:.62}.pg-topbar{height:92px;display:flex;align-items:center;justify-content:space-between;gap:24px;padding:0 clamp(22px,5vw,72px);position:sticky;top:0;z-index:10;background:rgba(1,7,9,.90);border-bottom:1px solid var(--line);backdrop-filter:blur(18px)}.pg-brand{display:flex;align-items:center;gap:14px;color:var(--text);text-decoration:none;text-transform:uppercase;letter-spacing:.18em;font-size:12px;font-weight:900}.pg-brand small{display:block;color:var(--muted);font-size:10px;margin-top:3px}.pg-logo{width:42px;height:42px;border:1px solid var(--line);border-radius:13px;background:radial-gradient(circle,var(--mint),#203f5d 45%,#051111 70%);box-shadow:0 0 35px rgba(111,255,224,.45)}.pg-nav{display:flex;gap:10px;align-items:center;flex-wrap:wrap}.pg-nav a{color:var(--text);text-decoration:none;font-weight:850;font-size:13px;padding:10px 13px;border-radius:999px}.pg-nav a.active,.pg-nav a:hover{background:rgba(255,255,255,.12);box-shadow:inset 0 0 0 1px rgba(255,255,255,.13)}.pg-wrap{width:min(1180px,calc(100% - 36px));margin:0 auto}.pg-hero{min-height:calc(100vh - 92px);display:grid;grid-template-columns:minmax(0,1fr) minmax(360px,540px);gap:clamp(36px,7vw,86px);align-items:center;padding:clamp(72px,11vw,150px) 0}.pg-eyebrow{color:var(--mint);text-transform:uppercase;letter-spacing:.38em;font-size:12px;font-weight:950;margin:0 0 14px}.pg-hero h1,.pg-section h2,.pg-demo h2{font-size:clamp(54px,8.2vw,112px);line-height:.86;letter-spacing:-.075em;margin:12px 0 24px;max-width:900px}.pg-hero h1 em{display:block;font-family:Georgia,serif;font-style:italic;font-weight:500;background:linear-gradient(90deg,var(--gold),var(--mint),var(--cyan));-webkit-background-clip:text;color:transparent;letter-spacing:-.04em}.pg-lead{font-size:clamp(18px,2vw,24px);line-height:1.45;color:#e7f0ee;max-width:760px}.pg-ctas{display:flex;gap:14px;flex-wrap:wrap;margin:28px 0}.pg-btn{appearance:none;border:0;text-decoration:none;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;min-height:48px;padding:0 24px;border-radius:999px;color:var(--text);background:rgba(255,255,255,.12);box-shadow:inset 0 0 0 1px rgba(255,255,255,.18);font-weight:950}.pg-btn.primary{background:linear-gradient(120deg,#f3ff9c,var(--mint),var(--cyan));color:#03100f;box-shadow:0 18px 48px rgba(111,255,224,.28)}.pg-safe{display:flex;gap:10px;flex-wrap:wrap;margin-top:20px}.pg-chip{display:inline-flex;border:1px solid var(--line);border-radius:999px;padding:9px 12px;color:#dff;letter-spacing:.1em;text-transform:uppercase;font-size:11px;font-weight:950;background:rgba(0,0,0,.25)}.pg-console,.pg-section,.pg-card,.pg-demo,.pg-candidate,.pg-table,.pg-ledger{border:1px solid var(--line);border-radius:var(--radius);background:linear-gradient(145deg,rgba(39,68,61,.76),rgba(5,16,18,.82));box-shadow:var(--shadow);backdrop-filter:blur(14px)}.pg-console{padding:28px}.pg-console-top{display:flex;justify-content:space-between;color:var(--mint);letter-spacing:.28em;text-transform:uppercase;font-size:12px;font-weight:950;margin-bottom:20px}.pg-orbit{min-height:410px;border-radius:24px;background:radial-gradient(circle at 50% 45%,rgba(111,255,224,.36),transparent 24%),rgba(0,0,0,.36);border:1px solid rgba(255,255,255,.1);display:grid;place-items:center;overflow:hidden;position:relative}.pg-core{width:190px;height:190px;border-radius:50%;display:grid;place-items:center;background:radial-gradient(circle,var(--mint),#6deeff 42%,transparent 45%);box-shadow:0 0 90px rgba(111,255,224,.42);font:italic 70px Georgia,serif;color:#06110f}.pg-orbit i{position:absolute;border:1px dashed rgba(255,255,255,.26);border-radius:50%;animation:pgspin 18s linear infinite}.pg-orbit i:nth-child(1){width:280px;height:280px}.pg-orbit i:nth-child(2){width:360px;height:360px;animation-duration:25s}.pg-orbit i:nth-child(3){width:440px;height:440px;animation-duration:33s}.pg-orbit span{position:absolute;padding:12px 15px;border-radius:16px;border:1px solid var(--line);background:rgba(0,0,0,.62);font-weight:900;font-size:12px;text-align:center}.pg-orbit span:nth-of-type(1){top:38px;left:38px}.pg-orbit span:nth-of-type(2){top:42px;right:42px}.pg-orbit span:nth-of-type(3){bottom:42px;left:48px}.pg-orbit span:nth-of-type(4){bottom:42px;right:48px}.pg-section{padding:clamp(28px,5vw,56px);margin:48px 0}.pg-section-head{display:grid;grid-template-columns:minmax(0,1fr) minmax(280px,500px);gap:36px;align-items:end;margin-bottom:28px}.pg-section h2,.pg-demo h2{font-size:clamp(42px,6vw,84px)}.pg-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:16px}.pg-card,.pg-candidate{padding:24px}.pg-card h3,.pg-candidate h3{font-size:clamp(22px,2.6vw,36px);line-height:.95;margin:0 0 14px;letter-spacing:-.05em}.pg-card p,.pg-candidate p{color:#d6e7e3;line-height:1.54}.pg-candidate-top{display:flex;justify-content:space-between;gap:12px;color:var(--mint);font-size:12px;text-transform:uppercase;letter-spacing:.18em;font-weight:950;margin-bottom:14px}.pg-score{display:flex;align-items:end;justify-content:space-between;border-top:1px solid rgba(255,255,255,.10);border-bottom:1px solid rgba(255,255,255,.10);padding:12px 0;margin:16px 0}.pg-score span{text-transform:uppercase;letter-spacing:.14em;font-size:10px;color:var(--muted)}.pg-score strong{font-size:38px;color:var(--gold)}.pg-bars{display:grid;gap:8px}.pg-bars div{display:grid;grid-template-columns:82px 1fr;gap:10px;align-items:center}.pg-bars span{font-size:10px;text-transform:uppercase;color:#d6e2e2;letter-spacing:.14em}.pg-bars i{height:9px;border-radius:999px;background:rgba(255,255,255,.10);overflow:hidden}.pg-bars em{height:100%;display:block;border-radius:999px;background:linear-gradient(90deg,var(--gold),var(--mint),var(--cyan))}.pg-result{margin-top:16px;padding:10px;border-radius:12px;text-align:center;font-weight:950;background:rgba(255,255,255,.08);color:var(--gold)}.pg-result.promote{background:rgba(111,255,224,.15);color:var(--mint)}.pg-result.reject{color:var(--rose)}.pg-demo{display:grid;grid-template-columns:minmax(0,1fr) minmax(340px,.9fr);gap:32px;padding:clamp(28px,5vw,54px);margin:48px 0}.pg-runlog,pre.pg-code{border:1px solid rgba(111,255,224,.24);border-radius:16px;background:rgba(0,0,0,.50);padding:18px;color:#cafff3;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;white-space:pre-wrap;line-height:1.55;overflow:auto}.pg-gates{display:grid;gap:10px}.pg-gate{display:grid;grid-template-columns:42px 1fr;gap:12px;align-items:center;border:1px solid rgba(111,255,224,.22);border-radius:16px;background:rgba(0,0,0,.25);padding:14px}.pg-gate b{color:var(--gold)}.pg-gate strong{font-size:16px}.pg-gate span{grid-column:2;color:#cfe0dd;font-size:13px}.pg-gate i{grid-column:1/-1;height:8px;border-radius:999px;background:rgba(255,255,255,.11);overflow:hidden}.pg-gate i:after{content:"";display:block;height:100%;width:0;background:linear-gradient(90deg,var(--gold),var(--mint));transition:width .5s}.pg-gate.pass i:after{width:100%}.pg-gate.pass{border-color:rgba(111,255,224,.65)}.pg-gate.fail{border-color:rgba(255,139,189,.45)}.pg-run-controls{display:flex;gap:14px;flex-wrap:wrap;margin:20px 0}.pg-table{overflow:auto}.pg-table table{width:100%;border-collapse:collapse;min-width:820px}th,td{padding:16px 18px;border-bottom:1px solid rgba(255,255,255,.12);text-align:left;vertical-align:top}th{color:var(--mint);font-size:12px;text-transform:uppercase;letter-spacing:.18em}.pg-ledger{padding:24px;display:grid;grid-template-columns:1fr 1fr;gap:20px}.pg-ledger article{border:1px solid rgba(255,255,255,.10);border-radius:18px;background:rgba(0,0,0,.24);padding:18px}.pg-ledger b{color:var(--gold);display:block;margin-bottom:8px}.pg-footer{width:100vw;margin-left:calc(50% - 50vw);padding:42px clamp(22px,5vw,72px) 78px;border-top:1px solid var(--line);background:rgba(0,0,0,.55);display:grid;grid-template-columns:1fr 1fr;gap:28px}.pg-footer nav{justify-content:flex-end}.pg-footer a{color:var(--mint);font-weight:900;text-decoration:none}.pg-footer b{display:block}.pg-footer span{display:block;color:#cadbd8;margin-top:8px}.site-rule{grid-column:1/-1;justify-self:center;border:1px solid var(--line);border-radius:999px;padding:12px 18px;display:flex;gap:10px;align-items:center;flex-wrap:wrap;background:rgba(0,0,0,.55);max-width:min(100%,860px)}.site-rule b{color:var(--gold)}.site-rule span{font-size:13px}.site-rule a{background:linear-gradient(120deg,#f3ff9c,var(--mint));color:#03100f;border-radius:999px;padding:10px 15px;text-decoration:none}@keyframes pgspin{to{transform:rotate(360deg)}}@media(max-width:1020px){.pg-topbar{position:relative;height:auto;align-items:flex-start;padding:18px}.pg-topbar,.pg-nav{flex-direction:column}.pg-hero,.pg-demo,.pg-section-head,.pg-ledger{grid-template-columns:1fr}.pg-grid{grid-template-columns:1fr}.pg-hero h1{font-size:clamp(48px,14vw,80px)}.pg-footer{grid-template-columns:1fr}.pg-footer nav{justify-content:flex-start}.site-rule{border-radius:18px}}
`;

const js = String.raw`
(function(){
  const candidates = __CANDIDATES__;
  const certificate = __CERTIFICATE__;
  const docket = __DOCKET__;
  const log = document.querySelector('[data-pg-log]');
  const gates = Array.from(document.querySelectorAll('.pg-gate'));
  const run = document.querySelector('[data-run-selection]');
  const reset = document.querySelector('[data-reset-selection]');
  function line(t){ if(log){ log.textContent += '\n' + t; log.scrollTop = log.scrollHeight; } }
  function setCandidate(id){ document.querySelectorAll('.pg-candidate').forEach(el => el.classList.toggle('active', el.dataset.candidate === id)); }
  function clear(){ gates.forEach(g => g.classList.remove('pass','fail')); if(log) log.textContent = 'System ready. Click Run Selection Gate.'; setCandidate(''); }
  function download(name, obj){ const blob = new Blob([JSON.stringify(obj,null,2)], {type:'application/json'}); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove(); setTimeout(()=>URL.revokeObjectURL(url), 500); }
  document.querySelector('[data-download-certificate]')?.addEventListener('click', () => download('proof-gradient-selection-certificate.json', certificate));
  document.querySelector('[data-download-docket]')?.addEventListener('click', () => download('proof-gradient-demo-docket.json', docket));
  reset?.addEventListener('click', clear);
  run?.addEventListener('click', async () => {
    clear();
    line('Selection gate opened. Score is advisory; hard gates are mandatory.');
    for (const c of candidates) {
      setCandidate(c.id);
      line('Inspecting ' + c.id + ': ' + c.title + ' — score ' + c.proofGradientScore);
      await new Promise(r => setTimeout(r, 350));
      for (let i=0;i<c.gateResults.length;i++) {
        const g = c.gateResults[i];
        gates[i]?.classList.toggle('pass', g.pass);
        gates[i]?.classList.toggle('fail', !g.pass);
        line('  ' + g.name + ': ' + (g.pass ? 'PASS' : 'FAIL'));
        await new Promise(r => setTimeout(r, 140));
      }
      if (c.selected) line('PROMOTE: ' + c.title + ' emitted a SelectionCertificate and EvolutionLedgerEntry.');
      else line(c.decision.toUpperCase() + ': ' + c.reason);
      await new Promise(r => setTimeout(r, 450));
    }
    setCandidate('C3');
    gates.forEach(g => { g.classList.remove('fail'); g.classList.add('pass'); });
    line('Terminal disposition: only proof-carrying capability can influence future work.');
  });
  const canvas = document.querySelector('.pg-field');
  if(canvas){
    const ctx = canvas.getContext('2d'); let w,h,pts=[];
    function resize(){ w=canvas.width=innerWidth*devicePixelRatio; h=canvas.height=innerHeight*devicePixelRatio; pts=Array.from({length:72},()=>({x:Math.random()*w,y:Math.random()*h,vx:(Math.random()-.5)*.22*devicePixelRatio,vy:(Math.random()-.5)*.22*devicePixelRatio,r:(Math.random()*1.7+0.7)*devicePixelRatio})); }
    function frame(){ ctx.clearRect(0,0,w,h); for(const p of pts){ p.x+=p.vx; p.y+=p.vy; if(p.x<0||p.x>w)p.vx*=-1; if(p.y<0||p.y>h)p.vy*=-1; ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fillStyle='rgba(111,255,224,.72)'; ctx.fill(); }
      for(let i=0;i<pts.length;i++)for(let j=i+1;j<pts.length;j++){ const a=pts[i],b=pts[j],d=Math.hypot(a.x-b.x,a.y-b.y); if(d<150*devicePixelRatio){ ctx.strokeStyle='rgba(111,255,224,'+(1-d/(150*devicePixelRatio))*.18+')'; ctx.lineWidth=1; ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke(); }} requestAnimationFrame(frame); }
    addEventListener('resize',resize,{passive:true}); resize(); frame();
  }
})();
`;

function shell(body){
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Proof Gradient Selection Lab · GoalOS Signoff Pro</title><meta name="description" content="A browser-local public demonstration of the GoalOS Proof Gradient: score is advisory; hard proof gates decide what may evolve."><style>${css}</style></head><body><canvas class="pg-field" aria-hidden="true"></canvas><header class="pg-topbar"><a class="pg-brand" href="index.html"><span class="pg-logo"></span><span>GoalOS Signoff Pro<small>Proof Gradient Selection Lab</small></span></a><nav class="pg-nav" aria-label="Main navigation"><a href="index.html">Institution</a><a href="browser-beta.html">Browser beta</a><a href="mission-001.html">Mission 001</a><a class="active" href="proof-gradient-lab.html">Proof Gradient</a><a href="evidence-docket-demo.html">Docket</a><a href="verify.html">Verifier</a><a href="agialpha.html">$AGIALPHA</a></nav></header><main class="pg-wrap">${body}</main></body></html>`;
}

const body = `
<section class="pg-hero"><div><p class="pg-eyebrow">Proof-Backed Upgrade Right</p><h1>Score is advisory. <em>Gates decide.</em></h1><p class="pg-lead">This is the core GoalOS idea in one browser-local lab: an output may look brilliant, an agent may look busy, and a proof packet may look promising — but only work that passes every hard gate can become institutional memory and reusable capability.</p><div class="pg-ctas">${button('#lab','Run Selection Gate','primary')}${button('proof-gradient-selection-certificate.json','Open certificate')}${button('proof-gradient-demo-docket.json','Open Evidence Docket')}</div><div class="pg-safe">${['Browser-local','No input','No upload','No wallet','No value moved'].map(chip).join('')}</div></div><aside class="pg-console"><div class="pg-console-top"><span>Selection Gate Console</span><span>Review Mode</span></div><div class="pg-orbit"><i></i><i></i><i></i><div class="pg-core">α</div><span>Proof<br>Valid</span><span>Eval<br>Pass</span><span>Rollback<br>Ready</span><span>Challenge<br>Clear</span></div></aside></section>
<section class="pg-section"><div class="pg-section-head"><div><p class="pg-eyebrow">Four candidates enter</p><h2>Only proof-carrying work survives.</h2></div><p class="pg-lead">The lab compares output, activity, partial proof, and a proof-carrying capability. GoalOS separates persuasion from authority: only accepted proof can influence future work.</p></div><div class="pg-grid">${candidateCards()}</div></section>
<section class="pg-demo" id="lab"><div><p class="pg-eyebrow">Browser-local run</p><h2>Run the Selection Gate.</h2><p>No server. No account. No uploaded material. The browser runs a deterministic public demo of the Proof Gradient Selection Law and emits a synthetic selection certificate.</p><div class="pg-run-controls"><button class="pg-btn primary" data-run-selection>Run Selection Gate</button><button class="pg-btn" data-reset-selection>Reset</button><button class="pg-btn" data-download-certificate>Download certificate</button><button class="pg-btn" data-download-docket>Download docket</button></div><pre class="pg-runlog" data-pg-log>System ready. Click Run Selection Gate.</pre></div><div><div class="pg-gates">${gateRows()}</div></div></section>
<section class="pg-section"><div class="pg-section-head"><div><p class="pg-eyebrow">Proof Gradient Selection Law</p><h2>Proof creates the upgrade right.</h2></div><p class="pg-lead">The numerical score helps rank candidates, but it cannot override hard gates. A high-scoring artifact still fails if proof, evaluation, risk, rollback, canary, scope, or challenge-window requirements are missing.</p></div><div class="pg-table"><table><thead><tr><th>Candidate</th><th>Score</th><th>Gate pass</th><th>Failed gates</th><th>Disposition</th></tr></thead><tbody>${tableRows()}</tbody></table></div></section>
<section class="pg-section"><div class="pg-section-head"><div><p class="pg-eyebrow">Evolution Ledger</p><h2>Accepted proof becomes memory.</h2></div><p class="pg-lead">The selected candidate emits a SelectionCertificate, an EvolutionLedgerEntry, and an Evidence Docket. That is the difference between a demo answer and a reusable institutional capability.</p></div><div class="pg-ledger"><article><b>SelectionCertificate</b><p>Candidate C3 is promoted because every hard gate clears. The certificate binds the candidate, gate results, proof root, claim boundary, and selected state.</p>${button('proof-gradient-selection-certificate.json','Inspect certificate','primary')}</article><article><b>EvolutionLedgerEntry</b><p>The public demo writes a compact synthetic ledger entry: proof root, evidence pointer, rollback target, and public/private boundary.</p>${button('proof-gradient-evolution-ledger-entry.json','Inspect ledger entry')}</article><article><b>Evidence Docket</b><p>The docket shows claims, baselines, proof packets, cost/risk ledgers, gate outcomes, and replay path. It is an audit room, not a marketing page.</p>${button('proof-gradient-demo-docket.json','Inspect docket')}</article><article><b>Capability package</b><p>The selected proof-carrying artifact can influence future demo runs only because the selection gate cleared. No proof, no propagation.</p>${button('proof-gated-coordination.html','Open coordination demo')}</article></div></section>
<footer class="pg-footer"><div><b>GoalOS Signoff Pro</b><span>AI-era work acceptance · proof-backed upgrade rights · Evidence Dockets · browser-local demos.</span></div><nav><a href="privacy.html">Privacy</a><a href="terms.html">Terms</a><a href="no-user-data.html">No User Data</a><a href="agialpha-token-boundary.html">$AGIALPHA boundary</a></nav><div class="site-rule" data-goalos-legal-rail="v12"><b>Public site rule</b><span>${esc(publicRule)}</span><a href="no-user-data.html">Read the rule</a></div></footer>
<script>${js.replace('__CANDIDATES__', JSON.stringify(evaluated)).replace('__CERTIFICATE__', JSON.stringify(selectionCertificate)).replace('__DOCKET__', JSON.stringify(demoDocket))}</script>`;

write('proof-gradient-lab.html', shell(body));

function injectHomepageRail(){
  const index = path.join(SITE, 'index.html');
  if (!fs.existsSync(index)) return;
  let html = fs.readFileSync(index, 'utf8');
  if (html.includes('proof-gradient-lab.html')) return;
  const rail = `<section class="section" data-proof-gradient-rail><div class="section-head"><div><p class="eyebrow">Proof Gradient Selection</p><h2>Watch an output earn the right to evolve.</h2></div><p>Run the new browser-local Selection Gate lab: four candidate artifacts enter; only the one with proof, evals, risk control, rollback readiness, scope, and challenge clearance becomes reusable capability.</p></div><div class="cta-row"><a class="btn primary" href="proof-gradient-lab.html">Run Selection Gate</a><a class="btn" href="proof-gradient-demo-docket.json">Inspect demo docket</a><a class="btn" href="proof-gradient-selection-certificate.json">Open certificate</a></div></section>`;
  const footerIdx = html.indexOf('<footer');
  if (footerIdx >= 0) html = html.slice(0, footerIdx) + rail + html.slice(footerIdx);
  else html = html.replace('</main>', rail + '</main>');
  fs.writeFileSync(index, html);
}

injectHomepageRail();

const manifestPath = path.join(SITE, 'production-manifest.json');
if (fs.existsSync(manifestPath)) {
  try {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    manifest.proofGradientLab = {
      version,
      generatedAt,
      page: 'proof-gradient-lab.html',
      certificate: 'proof-gradient-selection-certificate.json',
      docket: 'proof-gradient-demo-docket.json',
      selectedCandidate: selected?.id,
      publicRule
    };
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  } catch {}
}

const sitemapPath = path.join(SITE, 'sitemap.xml');
if (fs.existsSync(sitemapPath)) {
  let xml = fs.readFileSync(sitemapPath, 'utf8');
  if (!xml.includes('proof-gradient-lab.html')) {
    xml = xml.replace('</urlset>', `<url><loc>${baseUrl}proof-gradient-lab.html</loc></url></urlset>`);
    fs.writeFileSync(sitemapPath, xml);
  }
}

console.log(`GoalOS Proof Gradient Selection Lab generated (${version})`);
console.log('Generated: proof-gradient-lab.html, proof-gradient-selection-certificate.json, proof-gradient-demo-docket.json');
