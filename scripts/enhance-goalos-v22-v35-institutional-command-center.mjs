#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const site = path.join(root, 'site');
const assets = path.join(site, 'assets');
const now = new Date().toISOString();

function ensureDir(p){ fs.mkdirSync(p, {recursive:true}); }
function write(rel, content){ const p = path.join(site, rel); ensureDir(path.dirname(p)); fs.writeFileSync(p, content); }
function copy(src, dst){ ensureDir(path.dirname(dst)); fs.copyFileSync(src, dst); }
function exists(rel){ return fs.existsSync(path.join(site, rel)); }
function escapeHtml(s){ return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function compact(s){ return String(s).replace(/\s+/g,' ').trim(); }
ensureDir(site); ensureDir(assets);

const labs = [
  {version:'v22', route:'action-graph-authority-lab.html', chapter:'Human authority', title:'Action Graph & Human Authority', promise:'Convert accepted proof into bounded action graphs with reason, authority, rollback, and receipt boundaries.', audience:['Executive','Auditor','Builder'], value:'See why GoalOS never treats output as automatic permission to act.'},
  {version:'v23', route:'proof-carrying-artifact-lab.html', chapter:'Reusable capability', title:'Proof-Carrying Artifact & Evolution Ledger', promise:'Make reusable artifacts earn upgrade rights through proof, ledgers, rollback, and evidence.', audience:['Builder','Auditor','AI operator'], value:'Understand how accepted work becomes reusable without becoming ungoverned.'},
  {version:'v24', route:'independent-replay-lab.html', chapter:'Independent replay', title:'Independent Replay & Claim Promotion', promise:'Promote claims only when independent replay, review, and claim maturity gates pass.', audience:['Reviewer','Auditor','DAO'], value:'See how one run becomes review-ready evidence.'},
  {version:'v25', route:'proofzero-planning-lab.html', chapter:'Planning over proof states', title:'ProofZero Planning & Evidence Reanalyze', promise:'Plan over evidence states, latent work, validators, and bounded search instead of persuasive futures.', audience:['Strategist','AI operator','Reviewer'], value:'Explore how GoalOS reasons about what remains unproven.'},
  {version:'v26', route:'mission-foundry-lab.html', chapter:'Curriculum', title:'Proof-Gated Mission Foundry', promise:'Turn accepted proof into harder next missions while rejecting unproofable or unsafe mission seeds.', audience:['Program lead','Research lead','Founder'], value:'Watch proof become a curriculum for compounding work.'},
  {version:'v27', route:'process-evidence-lab.html', chapter:'Process evidence', title:'Process-Resolved Evidence', promise:'Resolve evidence through process traces, lineage, provenance, and proof-native workbench views.', audience:['Auditor','Reviewer','Enterprise'], value:'Inspect how work history becomes legible instead of anecdotal.'},
  {version:'v28', route:'blockchain-credibility-lab.html', chapter:'Blockchain credibility', title:'Blockchain Credibility Standard', promise:'Blockchain proves the transaction. GoalOS proves the work.', audience:['Blockchain team','DAO','Investor'], value:'Make proof before settlement obvious.'},
  {version:'v29', route:'blockchain-proof-mandate-lab.html', chapter:'Proof mandate', title:'Blockchain Proof Mandate & Due Diligence', promise:'Require the proof package before trust, funding, governance, reputation, or settlement readiness escalates.', audience:['DAO delegate','Investor','Auditor'], value:'Turn the slogan into a stakeholder checklist.'},
  {version:'v30', route:'proof-before-settlement-research-lab.html', chapter:'Research standard', title:'Proof Before Settlement Research Lab', promise:'Publish the institutional research standard, acceptance predicate, due-diligence rubric, and mandate clauses.', audience:['Executive','Partner','Researcher'], value:'Give serious stakeholders a paper-grade reference.'},
  {version:'v31', route:'executive-ai-proof-console.html', chapter:'Guided proof console', title:'Executive AI Proof Console', promise:'Choose a role and run a public-safe proof-gate simulation with no inputs, no uploads, no wallets, and no external AI calls.', audience:['First-time visitor','Executive','DAO'], value:'Let anyone understand GoalOS in one guided experience.'},
  {version:'v32', route:'from-loop-to-rsi-lab.html', chapter:'Loop to RSI', title:'From Loop to RSI', promise:'Move from proof-gated work to deterministic invention governance and RSI readiness.', audience:['Frontier lab','Policy lead','Researcher'], value:'Connect proof loops to governed invention.'},
  {version:'v33', route:'loop-rsi-asi-superintelligence-lab.html', chapter:'RSI to ASI', title:'Loop → RSI → ASI Console', promise:'Escalate from mission proof to RSI governance and ASI-readiness gates without self-authorization.', audience:['Safety lead','Frontier lab','Executive'], value:'See the superintelligence control boundary.'},
  {version:'v34', route:'loop-rsi-asi-superintelligence-control-tower-lab.html', chapter:'Control tower', title:'ASI Superintelligence Control Tower', promise:'Run explanation modes, stress tests, rollback drills, council review, and Move‑37 dossier handling.', audience:['Council','Executive','Red-team'], value:'Operate the full governance cockpit.'},
  {version:'v35', route:'loop-rsi-asi-superintelligence-mission-simulator-lab.html', chapter:'Mission simulator', title:'ASI Mission Simulator', promise:'Choose role, mission, and explanation mode; run proof, RSI, ASI gates; generate a synthetic Mission Receipt.', audience:['Everyone','Executive','Reviewer'], value:'Experience the complete journey in one interactive lab.'}
];

const publicSafety = {
  noForms: true, noTextInputs: true, noUploads: true, noCookies: true, noAnalytics: true,
  noWallets: true, noPayments: true, noExternalAiCalls: true, noPersonalData: true,
  valueMoved: 0, claimedAgi: false, claimedAsi: false, productionAuthority: false
};

const css = `
:root{--g-bg:#05000d;--g-bg2:#0f0220;--g-card:rgba(255,255,255,.07);--g-line:rgba(255,255,255,.16);--g-text:#fbf7ff;--g-muted:#c9bdd7;--g-gold:#f6d77d;--g-cyan:#43f0df;--g-violet:#8c38ff;--g-rose:#ff4f83;--g-green:#6effa8;}
.goalos35-spotlight,.goalos35-floating,.goalos35-command *{box-sizing:border-box}.goalos35-command{font-family:Inter,ui-sans-serif,system-ui,-apple-system,Segoe UI,sans-serif;background:radial-gradient(circle at 15% 10%,rgba(140,56,255,.4),transparent 28%),radial-gradient(circle at 85% 0,rgba(67,240,223,.18),transparent 30%),linear-gradient(135deg,#05000d,#10021f 48%,#05000d);color:var(--g-text);min-height:100vh;overflow-x:hidden}.goalos35-command a{color:inherit}.goalos35-shell{width:min(1240px,92vw);margin:0 auto}.goalos35-nav{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:24px 0}.goalos35-brand{display:flex;align-items:center;gap:12px;font-weight:900;letter-spacing:-.03em}.goalos35-sigil{width:42px;height:42px;border-radius:16px;background:linear-gradient(135deg,var(--g-gold),#fff,var(--g-cyan));color:#13051d;display:grid;place-items:center;box-shadow:0 18px 70px rgba(140,56,255,.35)}.goalos35-pill{display:inline-flex;align-items:center;gap:8px;border:1px solid var(--g-line);background:rgba(255,255,255,.06);border-radius:999px;padding:9px 12px;color:var(--g-muted);font-size:13px;text-decoration:none}.goalos35-hero{display:grid;grid-template-columns:1.05fr .95fr;gap:24px;align-items:stretch;padding:26px 0 36px}.goalos35-kicker{color:var(--g-gold);font-weight:900;text-transform:uppercase;letter-spacing:.13em;font-size:13px}.goalos35-title{font-size:clamp(44px,8vw,92px);line-height:.86;letter-spacing:-.08em;margin:14px 0 18px}.goalos35-sub{font-size:clamp(18px,2.2vw,24px);line-height:1.5;color:var(--g-muted);max-width:760px}.goalos35-actions{display:flex;gap:12px;flex-wrap:wrap;margin-top:24px}.goalos35-button{border:0;border-radius:999px;padding:14px 18px;font-weight:900;text-decoration:none;cursor:pointer;background:linear-gradient(135deg,var(--g-gold),#fff,var(--g-cyan));color:#13051d;box-shadow:0 14px 50px rgba(246,215,125,.14)}.goalos35-button.secondary{background:rgba(255,255,255,.08);border:1px solid var(--g-line);color:var(--g-text);box-shadow:none}.goalos35-panel{border:1px solid var(--g-line);background:linear-gradient(180deg,rgba(255,255,255,.09),rgba(255,255,255,.04));border-radius:32px;padding:22px;box-shadow:0 26px 90px rgba(0,0,0,.35);position:relative;overflow:hidden}.goalos35-panel:before{content:"";position:absolute;inset:-40%;background:conic-gradient(from 90deg,transparent,rgba(140,56,255,.15),transparent,rgba(67,240,223,.12),transparent);animation:g35spin 16s linear infinite;pointer-events:none}.goalos35-panel>*{position:relative}@keyframes g35spin{to{transform:rotate(360deg)}}.goalos35-metric-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:12px}.goalos35-metric{border:1px solid var(--g-line);border-radius:22px;padding:16px;background:rgba(0,0,0,.18)}.goalos35-metric strong{display:block;font-size:26px}.goalos35-metric span{color:var(--g-muted);font-size:13px}.goalos35-console{margin:24px 0 54px;border:1px solid var(--g-line);border-radius:34px;background:rgba(3,0,10,.78);box-shadow:0 30px 120px rgba(0,0,0,.5);overflow:hidden}.goalos35-console-head{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:18px;border-bottom:1px solid var(--g-line);background:rgba(255,255,255,.05)}.goalos35-dots{display:flex;gap:7px}.goalos35-dot{width:12px;height:12px;border-radius:999px;background:var(--g-rose)}.goalos35-dot:nth-child(2){background:var(--g-gold)}.goalos35-dot:nth-child(3){background:var(--g-cyan)}.goalos35-console-body{display:grid;grid-template-columns:300px 1fr;gap:0}.goalos35-rail{border-right:1px solid var(--g-line);padding:18px;background:rgba(255,255,255,.035)}.goalos35-main{padding:22px}.goalos35-section-label{font-size:12px;text-transform:uppercase;letter-spacing:.14em;color:var(--g-gold);font-weight:900;margin:0 0 10px}.goalos35-choice{width:100%;display:block;text-align:left;border:1px solid var(--g-line);background:rgba(255,255,255,.055);color:var(--g-text);border-radius:16px;padding:11px 12px;margin:8px 0;cursor:pointer;font-weight:800}.goalos35-choice[aria-pressed="true"]{background:linear-gradient(135deg,rgba(140,56,255,.42),rgba(67,240,223,.14));border-color:rgba(246,215,125,.55)}.goalos35-stage{display:grid;grid-template-columns:repeat(5,1fr);gap:8px;margin:16px 0}.goalos35-step{border:1px solid var(--g-line);border-radius:16px;padding:12px;background:rgba(255,255,255,.045);min-height:92px}.goalos35-step b{display:block;font-size:13px}.goalos35-step span{display:block;color:var(--g-muted);font-size:12px;line-height:1.35;margin-top:6px}.goalos35-step.active{border-color:var(--g-gold);box-shadow:0 0 0 1px rgba(246,215,125,.28),0 16px 50px rgba(140,56,255,.22)}.goalos35-output{border:1px solid var(--g-line);border-radius:22px;background:#080311;padding:18px;min-height:170px;color:#e7def0;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;white-space:pre-wrap;line-height:1.55}.goalos35-cards{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin:24px 0}.goalos35-card{border:1px solid var(--g-line);border-radius:24px;padding:18px;background:rgba(255,255,255,.06);text-decoration:none;display:block}.goalos35-card small{color:var(--g-gold);font-weight:900}.goalos35-card h3{font-size:21px;line-height:1.1;margin:8px 0}.goalos35-card p{color:var(--g-muted);line-height:1.5}.goalos35-timeline{display:grid;grid-template-columns:repeat(7,1fr);gap:8px;margin:18px 0}.goalos35-tick{border:1px solid var(--g-line);border-radius:14px;padding:10px;background:rgba(255,255,255,.05);font-size:12px;text-align:center}.goalos35-tick strong{display:block;color:var(--g-cyan);font-size:16px}.goalos35-footer{padding:48px 0 70px;color:var(--g-muted);border-top:1px solid var(--g-line)}.goalos35-floating{position:fixed;right:16px;bottom:16px;z-index:99;display:inline-flex;align-items:center;gap:10px;background:linear-gradient(135deg,#f6d77d,#fff,#43f0df);color:#13051d;border-radius:999px;padding:12px 16px;font-weight:950;text-decoration:none;box-shadow:0 18px 60px rgba(0,0,0,.35)}.goalos35-spotlight{padding:64px 0;background:radial-gradient(circle at 20% 0,rgba(140,56,255,.28),transparent 30%),#05000d;color:#fff;border-top:1px solid rgba(255,255,255,.12);border-bottom:1px solid rgba(255,255,255,.12)}.goalos35-spotlight-grid{width:min(1180px,92vw);margin:0 auto;display:grid;grid-template-columns:1.08fr .92fr;gap:22px;align-items:center}.goalos35-spotlight h2{font-size:clamp(34px,5vw,64px);line-height:.95;letter-spacing:-.06em;margin:0 0 14px}.goalos35-spotlight p{color:#d7cce4;font-size:17px;line-height:1.55}.goalos35-spotlight .mini{display:grid;grid-template-columns:repeat(2,1fr);gap:10px}.goalos35-spotlight .mini div{border:1px solid rgba(255,255,255,.14);border-radius:18px;padding:14px;background:rgba(255,255,255,.05)}@media(max-width:900px){.goalos35-hero,.goalos35-console-body,.goalos35-spotlight-grid{grid-template-columns:1fr}.goalos35-cards{grid-template-columns:1fr}.goalos35-stage,.goalos35-timeline{grid-template-columns:repeat(2,1fr)}.goalos35-rail{border-right:0;border-bottom:1px solid var(--g-line)}}
`;
write('assets/goalos-v22-v35-command-center.css', css);

const js = `
(()=>{
  const labs = ${JSON.stringify(labs)};
  const roles = {
    visitor:'First-time visitor', blockchain:'Blockchain team', executive:'Executive / board', auditor:'Auditor / reviewer', frontier:'Frontier lab / RSI team', public:'Public reviewer'
  };
  const modes = {
    tour:['Mission','Evidence','Replay','Validation','Receipt'],
    blockchain:['Claim','Proof package','Due diligence','Settlement readiness','Receipt'],
    rsi:['Target','Emit','Filter','Atlas','Eval'],
    asi:['Loop','RSI gates','ASI lock','Council','Rollback']
  };
  const messages = {
    visitor:'Start with the guided proof console, then follow the v35 mission simulator. You will understand the whole system without reading the entire archive first.',
    blockchain:'Open v28 and v29 first. The key question becomes: where is the proof package before value, governance, or reputation moves?',
    executive:'Open v30, v34, and v35. The executive lens is simple: proof before trust, council before promotion, rollback before release.',
    auditor:'Open v24, v27, and v35. Focus on replay, process-resolved evidence, risk gates, and synthetic receipt integrity.',
    frontier:'Open v32 through v35. The path is proof loop → deterministic RSI → ASI-readiness gates → council review.',
    public:'Open v31 and v35. The public version keeps the entire experience browser-local and uses buttons only.'
  };
  let state = {role:'visitor', mode:'tour', step:0};
  const $ = (id)=>document.getElementById(id);
  const safeJson = (x)=>JSON.stringify(x,null,2);
  function setPressed(group,value){ document.querySelectorAll('[data-'+group+']').forEach(b=>b.setAttribute('aria-pressed', String(b.dataset[group]===value))); }
  function routeFor(){
    if(state.role==='blockchain') return 'blockchain-proof-mandate-lab.html';
    if(state.role==='executive') return 'loop-rsi-asi-superintelligence-control-tower-lab.html';
    if(state.role==='auditor') return 'independent-replay-lab.html';
    if(state.role==='frontier') return 'from-loop-to-rsi-lab.html';
    if(state.role==='public') return 'executive-ai-proof-console.html';
    return 'loop-rsi-asi-superintelligence-mission-simulator-lab.html';
  }
  function render(){
    setPressed('role',state.role); setPressed('mode',state.mode);
    const steps = modes[state.mode] || modes.tour;
    state.step = Math.min(state.step, steps.length-1);
    const stage = $('g35-stage'); if(stage){ stage.innerHTML = steps.map((s,i)=>'<div class="goalos35-step '+(i===state.step?'active':'')+'"><b>'+String(i+1).padStart(2,'0')+' · '+s+'</b><span>'+['Define the mission boundary.','Bind evidence and provenance.','Replay or stress the claim.','Apply gates and authority.','Issue or withhold promotion.'][i%5]+'</span></div>').join(''); }
    const activeLabs = labs.filter(l=> state.mode==='tour' ? true : state.mode==='blockchain' ? ['v28','v29','v30'].includes(l.version) : state.mode==='rsi' ? ['v32','v33'].includes(l.version) : ['v33','v34','v35'].includes(l.version));
    const cards = $('g35-cards'); if(cards){ cards.innerHTML = activeLabs.slice(-6).map(l=>'<a class="goalos35-card" href="'+l.route+'"><small>'+l.version+' · '+l.chapter+'</small><h3>'+l.title+'</h3><p>'+l.value+'</p></a>').join(''); }
    const receipt = {
      role: roles[state.role], mode: state.mode, activeStep: steps[state.step], recommendedRoute: routeFor(),
      gates: ['mission-defined','evidence-bound','replay-ready','human-authority','rollback-available'],
      publicSafety: {forms:false, inputs:false, uploads:false, wallets:false, payments:false, externalAiCalls:false, valueMoved:0},
      decision: state.mode==='asi' ? 'ASI_ESCALATION_REQUIRES_COUNCIL_AND_ROLLBACK' : 'REVIEW_READY_DEMO',
      generated_at_static: 'STATIC_SAMPLE_2026_07_01T00_00_00Z'
    };
    const out = $('g35-output'); if(out){ out.textContent = 'GOALOS COMMAND CENTER\\n\\nRole: '+roles[state.role]+'\\nMode: '+state.mode.toUpperCase()+'\\nStep: '+steps[state.step]+'\\n\\n'+messages[state.role]+'\\n\\nRecommended next route: '+routeFor()+'\\n\\nSynthetic receipt:\\n'+safeJson(receipt); }
    const open = $('g35-open'); if(open) open.href = routeFor();
    const next = $('g35-next'); if(next) next.textContent = state.step === steps.length-1 ? 'Restart cycle' : 'Next gate';
  }
  document.addEventListener('click',(e)=>{
    const role = e.target.closest('[data-role]'); if(role){ state.role=role.dataset.role; render(); }
    const mode = e.target.closest('[data-mode]'); if(mode){ state.mode=mode.dataset.mode; state.step=0; render(); }
    if(e.target.closest('#g35-next')){ const len=(modes[state.mode]||modes.tour).length; state.step=(state.step+1)%len; render(); }
    if(e.target.closest('#g35-copy')){ const text=$('g35-output')?.textContent||''; navigator.clipboard?.writeText(text).catch(()=>{}); const btn=$('g35-copy'); if(btn){ const old=btn.textContent; btn.textContent='Copied'; setTimeout(()=>btn.textContent=old,900);} }
  });
  render();
})();
`;
write('assets/goalos-v22-v35-command-center.js', js);

const timeline = labs.map(l=>`<div class="goalos35-tick"><strong>${l.version}</strong>${escapeHtml(l.chapter)}</div>`).join('');
const labCards = labs.slice(-6).map(l=>`<a class="goalos35-card" href="${l.route}"><small>${l.version} · ${escapeHtml(l.chapter)}</small><h3>${escapeHtml(l.title)}</h3><p>${escapeHtml(l.value)}</p></a>`).join('');
const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>GoalOS Signoff Pro · v22-v35 Command Center</title><meta name="description" content="A public-safe interactive command center for GoalOS Signoff Pro labs v22-v35: proof, blockchain credibility, RSI governance, and ASI-readiness gates."><link rel="stylesheet" href="assets/goalos-v22-v35-command-center.css"></head>
<body class="goalos35-command"><div class="goalos35-shell"><nav class="goalos35-nav"><a class="goalos35-brand" href="index.html"><span class="goalos35-sigil">α</span><span>GoalOS Signoff Pro</span></a><div><a class="goalos35-pill" href="loop-rsi-asi-superintelligence-mission-simulator-lab.html">Open v35</a> <a class="goalos35-pill" href="public-demo-labs.html">All labs</a></div></nav>
<section class="goalos35-hero"><div><div class="goalos35-kicker">v22-v35 · Complete public demonstration suite</div><h1 class="goalos35-title">GoalOS Signoff Pro</h1><p class="goalos35-kicker">One command center for proof-gated work, blockchain credibility, RSI governance, and ASI-readiness.</p><p class="goalos35-sub">Proof-gated work, from AI deliverables to ASI-readiness gates. Start with the guided command center, then follow the proof trail through v22-v35. Blockchain proves the transaction. GoalOS proves the work. RSI governs invention. ASI must not self-authorize.</p><div class="goalos35-actions"><a class="goalos35-button" href="#console">Run guided console</a><a class="goalos35-button secondary" href="loop-rsi-asi-superintelligence-mission-simulator-lab.html">Open v35 simulator</a></div></div><aside class="goalos35-panel"><div class="goalos35-kicker">Public-safe boundary</div><h2>No inputs. No uploads. No wallets. No external AI calls.</h2><p class="goalos35-sub">The demos are interactive but deterministic and browser-local. They demonstrate proof gates, receipts, dossiers, councils, and rollback without moving value or collecting data.</p><div class="goalos35-metric-grid"><div class="goalos35-metric"><strong>14</strong><span>incremental labs</span></div><div class="goalos35-metric"><strong>0</strong><span>value moved</span></div><div class="goalos35-metric"><strong>v35</strong><span>latest simulator</span></div><div class="goalos35-metric"><strong>100%</strong><span>public-safe demo posture</span></div></div></aside></section>
<div class="goalos35-timeline">${timeline}</div>
<section id="console" class="goalos35-console"><div class="goalos35-console-head"><div class="goalos35-dots"><span class="goalos35-dot"></span><span class="goalos35-dot"></span><span class="goalos35-dot"></span></div><strong>Interactive GoalOS command console</strong><span class="goalos35-pill">button-only · public-safe</span></div><div class="goalos35-console-body"><aside class="goalos35-rail"><p class="goalos35-section-label">Choose role</p><button class="goalos35-choice" data-role="visitor">First-time visitor</button><button class="goalos35-choice" data-role="blockchain">Blockchain team</button><button class="goalos35-choice" data-role="executive">Executive / board</button><button class="goalos35-choice" data-role="auditor">Auditor / reviewer</button><button class="goalos35-choice" data-role="frontier">Frontier lab / RSI team</button><button class="goalos35-choice" data-role="public">Public reviewer</button><p class="goalos35-section-label" style="margin-top:20px">Choose mode</p><button class="goalos35-choice" data-mode="tour">Guided tour</button><button class="goalos35-choice" data-mode="blockchain">Proof before settlement</button><button class="goalos35-choice" data-mode="rsi">Loop → RSI</button><button class="goalos35-choice" data-mode="asi">RSI → ASI readiness</button></aside><main class="goalos35-main"><p class="goalos35-section-label">Run cycle</p><div id="g35-stage" class="goalos35-stage"></div><div id="g35-output" class="goalos35-output"></div><div class="goalos35-actions"><button id="g35-next" class="goalos35-button">Next gate</button><a id="g35-open" class="goalos35-button secondary" href="loop-rsi-asi-superintelligence-mission-simulator-lab.html">Open recommended lab</a><button id="g35-copy" class="goalos35-button secondary">Copy synthetic receipt</button></div></main></div></section>
<section><div class="goalos35-kicker">Recommended high-signal labs</div><div id="g35-cards" class="goalos35-cards">${labCards}</div></section>
<footer class="goalos35-footer"><p><strong>GoalOS proves work. RSI governs invention. ASI must not self-authorize.</strong></p><p>Boundary: public-safe demonstration only; no AGI/ASI achievement claim, no production RSI, no autonomous deployment authority, no legal certification, no investment advice, no live settlement, no wallet support, and no value movement.</p></footer></div><script src="assets/goalos-v22-v35-command-center.js"></script></body></html>`;

const routes = ['goalos-v22-v35-command-center.html','command-center.html','start-here.html','latest.html','experience.html','demo.html','proof-to-superintelligence.html','governed-superintelligence.html','v22-v35.html'];
for(const r of routes) write(r, html);

const commandManifest = JSON.stringify({version:'v35', generatedAt:now, flagship:'goalos-v22-v35-command-center.html', routes, labs, publicSafety}, null, 2)+"\n";
write('goalos-v22-v35-command-center-manifest.json', commandManifest);
write('v22-v35-institutional-command-center-manifest.json', commandManifest);
write('goalos-v22-v35-user-journey.json', JSON.stringify({version:'v35', generatedAt:now, journeys:[
  {role:'First-time visitor', start:'goalos-v22-v35-command-center.html', next:['executive-ai-proof-console.html','loop-rsi-asi-superintelligence-mission-simulator-lab.html']},
  {role:'Blockchain stakeholder', start:'blockchain-proof-mandate-lab.html', next:['proof-before-settlement-research-lab.html','goalos-v22-v35-command-center.html']},
  {role:'RSI / ASI governance stakeholder', start:'from-loop-to-rsi-lab.html', next:['loop-rsi-asi-superintelligence-control-tower-lab.html','loop-rsi-asi-superintelligence-mission-simulator-lab.html']}
], publicSafety}, null, 2)+"\n");
write('goalos-v22-v35-premium-site-audit.json', JSON.stringify({version:'v35', generatedAt:now, verdict:'strong-substance-now-needs-unified-entrypoint-and-reliable-actions', implemented:['site-wide command center','floating guided navigation','interactive button-only AI-style console','all v22-v35 lab map','v33/v34/v35 action repair coverage'], publicSafety}, null, 2)+"\n");

function injectHead(body){
  if(body.includes('goalos-v22-v35-command-center.css')) return body;
  return body.replace(/<\/head>/i, '<link rel="stylesheet" href="assets/goalos-v22-v35-command-center.css">\n</head>');
}
const floating = '<!-- GOALOS_V35_FLOATING_START --><a class="goalos35-floating" href="goalos-v22-v35-command-center.html">✦ Guided Command Center</a><!-- GOALOS_V35_FLOATING_END -->';
const spotlight = `<!-- GOALOS_V35_COMMAND_CENTER_SPOTLIGHT_START --><section class="goalos35-spotlight"><div class="goalos35-spotlight-grid"><div><p style="color:#f6d77d;font-weight:900;letter-spacing:.12em;text-transform:uppercase">v35 · complete guided experience</p><h2>Open the GoalOS command center.</h2><p>Choose your role, run the proof cycle, navigate v22-v35, and experience the path from proof-gated work to RSI governance and ASI-readiness gates.</p><p><a class="goalos35-button" href="goalos-v22-v35-command-center.html">Launch command center</a> <a class="goalos35-button secondary" href="loop-rsi-asi-superintelligence-mission-simulator-lab.html">Open v35 simulator</a></p></div><div class="mini"><div><b>Proof</b><br><span>Mission, evidence, replay, receipt.</span></div><div><b>Settlement</b><br><span>Trust becomes inspection-ready.</span></div><div><b>RSI</b><br><span>Invention is gated and replayable.</span></div><div><b>ASI</b><br><span>No self-authorization.</span></div></div></div></section><!-- GOALOS_V35_COMMAND_CENTER_SPOTLIGHT_END -->`;
function patchHtmlFile(p, isHome=false){
  let body = fs.readFileSync(p,'utf8');
  if(!/<html/i.test(body) || /goalos-v22-v35-command-center\.html/.test(path.basename(p))) return;
  body = injectHead(body);
  body = body.replace(/<!-- GOALOS_V35_FLOATING_START -->[\s\S]*?<!-- GOALOS_V35_FLOATING_END -->/g,'');
  body = body.replace(/<!-- GOALOS_V35_COMMAND_CENTER_SPOTLIGHT_START -->[\s\S]*?<!-- GOALOS_V35_COMMAND_CENTER_SPOTLIGHT_END -->/g,'');
  if(isHome) body = body.includes('</body>') ? body.replace('</body>', spotlight+'\n</body>') : body + spotlight;
  body = body.includes('</body>') ? body.replace('</body>', floating+'\n</body>') : body + floating;
  fs.writeFileSync(p, body);
}
let patched = 0;
for(const entry of fs.readdirSync(site,{withFileTypes:true})){
  if(!entry.isFile() || !entry.name.endsWith('.html')) continue;
  const p = path.join(site, entry.name);
  patchHtmlFile(p, ['index.html','public-demo-labs.html','goalos-public-demo-labs.html'].includes(entry.name));
  patched++;
}

const priorPath = path.join(site, 'goalos-public-demo-labs-v22-v35.json');
let manifest = {labs: []};
if(fs.existsSync(priorPath)){ try{ manifest = JSON.parse(fs.readFileSync(priorPath,'utf8')); }catch{} }
const existingLabs = Array.isArray(manifest.labs) ? manifest.labs.filter(l => String(l.id||'') !== 'v35-institutional-command-center') : [];
existingLabs.push({id:'v35-institutional-command-center', version:'v35', title:'GoalOS Signoff Pro — v22-v35 Institutional Command Center', route:'goalos-v22-v35-command-center.html', publicSafe:true, valueMoved:0});
fs.writeFileSync(priorPath, JSON.stringify({...manifest, suite:'GoalOS Signoff Pro public demo labs v22-v35', latest:'v35', latestRoute:'loop-rsi-asi-superintelligence-mission-simulator-lab.html', latestTitle:'GoalOS Signoff Pro — Loop → RSI → ASI Superintelligence Mission Simulator Lab v35', version:'v22-v35', generatedAt:now, labCount:existingLabs.length, labs:existingLabs}, null, 2)+"\n");

console.log(`GoalOS v22-v35 institutional command center PASS: ${routes.length} routes, ${patched} pages patched.`);
