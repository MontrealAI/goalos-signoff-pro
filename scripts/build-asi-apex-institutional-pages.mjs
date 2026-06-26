#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const root = path.resolve(path.dirname(__filename), '..');
const out = path.join(root, 'site');
const owner = 'MontrealAI';
const repo = 'goalos-signoff-pro';
const basePath = `/${repo}/`;
const productionUrl = `https://montrealai.github.io/${repo}/`;
const sha = process.env.GITHUB_SHA || 'LOCAL_BUILD';
const runId = process.env.GITHUB_RUN_ID || 'LOCAL_RUN';
const generatedAt = new Date().toISOString();

function cleanDir(dir){ fs.rmSync(dir,{recursive:true,force:true}); fs.mkdirSync(dir,{recursive:true}); }
function ensureDir(dir){ fs.mkdirSync(dir,{recursive:true}); }
function write(rel, content){ const file = path.join(out, rel); ensureDir(path.dirname(file)); fs.writeFileSync(file, content); }
function hashBuffer(buf){ return crypto.createHash('sha256').update(buf).digest('hex'); }
function hashFile(file){ return hashBuffer(fs.readFileSync(file)); }
function esc(s){ return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function asset(p){ return basePath + p.replace(/^\/+/, ''); }

const nav = [
  ['Platform','platform.html'],
  ['ASI Theatre','theatre.html'],
  ['Architecture','architecture.html'],
  ['Trust','trust.html'],
  ['Pilot','pilot.html'],
  ['Dossier','dossier.html']
];
const metrics = [
  ['0','funds moved'],['0','external actions'],['6','acceptance gates'],['12','evidence planes'],['∞','receipt replay'],['1','human authority']
];
const chain = ['Commission','Submit','Map','Review','Accept','Receipt'];

function layout({title,description,active,body,script = ''}){
  const navHtml = nav.map(([label,href])=>`<a class="nav-link ${active===label?'active':''}" href="${asset(href)}">${label}</a>`).join('');
  return `<!doctype html>
<html lang="en" data-build="asi-apex-v4">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}" />
  <meta name="theme-color" content="#02040a" />
  <meta property="og:title" content="${esc(title)}" />
  <meta property="og:description" content="${esc(description)}" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="${productionUrl}" />
  <link rel="canonical" href="${productionUrl}" />
  <link rel="stylesheet" href="${asset('assets/asi-apex.css')}" />
</head>
<body>
  <a class="skip" href="#main">Skip to content</a>
  <canvas id="asi-field" aria-hidden="true"></canvas>
  <div class="aurora" aria-hidden="true"></div>
  <div class="grid-veil" aria-hidden="true"></div>
  <header class="site-header" data-elevate>
    <div class="brand-lockup">
      <a href="${asset('index.html')}" aria-label="GoalOS Signoff Pro home" class="brand-mark"><span class="sigil"><i></i></span><span><b>GoalOS Signoff Pro</b><em>Proof-to-acceptance foundation</em></span></a>
    </div>
    <nav class="nav" aria-label="Primary navigation">${navHtml}</nav>
    <a class="nav-cta" href="${asset('pilot.html')}">Private beta</a>
  </header>
  <main id="main">${body}</main>
  <footer class="footer">
    <div><b>GoalOS Signoff Pro</b><span>AI-era work acceptance · evidence review · signed receipts · optional verification.</span></div>
    <div class="footer-links"><a href="${asset('trust.html')}">Trust boundary</a><a href="${asset('dossier.html')}">Dossier</a><a href="${asset('production-manifest.json')}">Manifest</a></div>
  </footer>
  <div class="command-help" id="command-help" role="dialog" aria-modal="false" aria-label="Command help" hidden>
    <div><button class="close-help" type="button" aria-label="Close command help">×</button><p class="eyebrow">Command surface</p><h2>Keyboard controls</h2><dl><dt>G</dt><dd>Launch proof theatre</dd><dt>R</dt><dd>Reset local simulation</dd><dt>H</dt><dd>Safe hold</dd><dt>?</dt><dd>Open or close this panel</dd></dl><p class="boundary">Local visual simulation only. No network call, wallet action, settlement, or authority is granted.</p></div>
  </div>
  <script src="${asset('assets/asi-apex.js')}" defer></script>
  ${script}
</body>
</html>`;
}

function heroConsole(){
  const chainHtml = chain.map((s,i)=>`<li><b>${String(i+1).padStart(2,'0')}</b><span>${s}</span></li>`).join('');
  const metricHtml = metrics.map(([v,l])=>`<div class="metric"><strong>${v}</strong><span>${l}</span></div>`).join('');
  return `<section class="hero section-x">
    <div class="hero-copy reveal">
      <p class="eyebrow"><span></span>AI-era acceptance command surface</p>
      <h1>THE SIGNOFF <i>INSTITUTION</i></h1>
      <p class="subtitle">Define done. Bind the evidence. Preserve dissent. Stop at human authority. Issue a receipt that executives, reviewers, and systems can verify.</p>
      <div class="boundary-strip"><b>DEFAULT DENY</b><span>No escrow. No token transfer. No autonomous acceptance. No production settlement. Human approval remains the final gate.</span></div>
      <div class="cta-row"><a class="primary" href="${asset('pilot.html')}">Enter the private beta</a><a class="secondary" href="${asset('theatre.html')}">Launch the proof theatre</a><button class="ghost" data-help type="button">Command help</button></div>
      <div class="metrics">${metricHtml}</div>
    </div>
    <div class="hero-orb reveal" data-tilt>
      <div class="orb-card">
        <div class="orb-top"><span>INSTITUTIONAL INTELLIGENCE</span><b>REVIEW MODE</b></div>
        <div class="orbital-system" aria-label="GoalOS proof orbit visual">
          <div class="core"><span>α</span><small>SIGNOFF</small></div>
          <i class="orbit o1"></i><i class="orbit o2"></i><i class="orbit o3"></i>
          <b class="node n1">BR</b><b class="node n2">EV</b><b class="node n3">RV</b><b class="node n4">AC</b><b class="node n5">RC</b><b class="node n6">VR</b>
          <svg viewBox="0 0 600 420" class="beam-map" aria-hidden="true"><path d="M300 210 C210 120 120 150 100 260"/><path d="M300 210 C380 80 500 120 510 240"/><path d="M300 210 C250 330 420 350 490 285"/><path d="M300 210 C190 270 160 360 230 385"/></svg>
        </div>
        <ul class="proof-chain">${chainHtml}</ul>
        <div class="orb-status"><span>AUTHORITY</span><b>HUMAN REVIEW</b><span>EXTERNAL ACTIONS</span><b>0</b></div>
      </div>
    </div>
  </section>`;
}

function index(){
  const phaseCards = [
    ['01','Contract','Plain-language mission, acceptance criteria, evidence requirements, reviewer and boundary.'],
    ['02','Prove','Builder submits work, files, sources, limitations, and a claim-to-evidence map.'],
    ['03','Review','Reviewer inspects completeness, dissent, risks, and unresolved requirements.'],
    ['04','Authorize','Client accepts a specific version. The system does not self-authorize.'],
    ['05','Seal','GoalOS issues a signed Mission Receipt and optional verification anchor.'],
    ['06','Replay','Receipt, file fingerprints, and decision history remain independently inspectable.']
  ].map(([n,t,d])=>`<article class="phase reveal"><b>${n}</b><h3>${t}</h3><p>${d}</p></article>`).join('');
  const council = ['Client authority','Builder evidence','Reviewer judgment','Evidence assistant','Receipt signer','Verification anchor','Human frontier','Audit memory'].map((x,i)=>`<div class="council-seat" style="--i:${i}"><span>${x}</span></div>`).join('');
  const body = `${heroConsole()}
  <section class="ticker" aria-label="System boundary"><span>PROOF BEFORE PERMISSION</span><span>HUMAN AUTHORITY</span><span>RECEIPT REPLAY</span><span>OPTIONAL VERIFICATION</span><span>NO ESCROW IN PHASE 1</span></section>
  <section class="section-x split reveal"><div><p class="eyebrow"><span></span>From AI output to accepted work</p><h2>Corporate acceptance for the ASI era.</h2><p>Signoff Pro turns ambiguous AI-assisted deliverables into a governed acceptance record: what was promised, what was submitted, what evidence supports it, who reviewed it, and who accepted the final version.</p></div><div class="panel ledger-panel"><h3>Mission receipt posture</h3><ul><li><b>Scope</b><span>Private beta · SaaS-first</span></li><li><b>Verification</b><span>Optional IPFS / Ethereum anchor</span></li><li><b>Settlement</b><span>Not authorized</span></li><li><b>Final authority</b><span>Human client decision</span></li></ul></div></section>
  <section class="section-x"><div class="phase-grid">${phaseCards}</div></section>
  <section class="section-x console-theatre reveal" id="theatre-preview"><div class="console-left"><p class="eyebrow"><span></span>Live proof theatre</p><h2>Watch a mission earn review.</h2><p>A local cinematic simulation shows the acceptance pipeline without contacting any external system. Use it to explain GoalOS to executives without overstating capability.</p><div class="cta-row"><button class="primary" data-launch type="button">Launch proof cycle</button><button class="secondary" data-reset type="button">Reset</button></div><ol class="event-log" data-log><li>System ready. Awaiting bounded mission.</li></ol></div><div class="console-right"><div class="score-ring" data-score><span>00</span><small>review readiness</small></div><div class="gate-board" data-gates>${chain.map((c,i)=>`<span data-gate="${i}">${String(i+1).padStart(2,'0')} ${c}</span>`).join('')}</div></div></section>
  <section class="section-x council reveal"><div><p class="eyebrow"><span></span>Agentic effects, corporate control</p><h2>A beautiful system that refuses unearned authority.</h2><p>The visual language is dynamic and AI-native, but the product posture remains institutional: review gates, receipt replay, boundary clarity, and human authorization.</p></div><div class="council-orbit">${council}<div class="council-core">SIGNOFF<br/><small>PRO</small></div></div></section>`;
  return layout({title:'GoalOS Signoff Pro · Institutional acceptance for AI work',description:'Elite proof-to-acceptance platform for AI-assisted work, evidence review, signed receipts, and optional verification.',active:'Platform',body});
}

function platform(){
 const cards = [
  ['Brief console','Define deliverables, acceptance criteria, reviewers, deadline, risk tier, and evidence requirements.'],
  ['Evidence matrix','Map every claim and file to the acceptance criterion it supports.'],
  ['Change-request loop','Preserve version history, reviewer comments, requested changes, and final accepted version.'],
  ['Receipt engine','Issue signed Mission Receipts with file fingerprints and replay instructions.'],
  ['Verification upgrade','Optionally anchor accepted receipt hashes after the private beta gate.'],
  ['Corporate dashboard','Operate pilots with templates, role permissions, and clear success metrics.']
 ].map(([t,d])=>`<article class="feature reveal"><h3>${t}</h3><p>${d}</p></article>`).join('');
 return layout({title:'GoalOS Signoff Pro · Platform',description:'The product platform for AI work acceptance and receipt verification.',active:'Platform',body:`<section class="page-hero section-x"><p class="eyebrow"><span></span>Platform architecture</p><h1>One acceptance layer. Many AI workflows.</h1><p>GoalOS Signoff Pro is the missing institutional layer between AI-generated work and business acceptance.</p></section><section class="section-x feature-grid">${cards}</section><section class="section-x split"><div class="panel command-card reveal"><h2>What executives see</h2><p>A clean acceptance dashboard: open deliverables, missing evidence, review status, final decision, and signed receipt.</p></div><div class="panel command-card reveal"><h2>What systems see</h2><p>Structured JSON, file fingerprints, criterion mappings, receipt status, and optional verification references.</p></div></section>`});
}

function theatre(){
 return layout({title:'GoalOS Signoff Pro · ASI Theatre',description:'Interactive proof-to-acceptance theatre for explaining the GoalOS Signoff flow.',active:'ASI Theatre',body:`<section class="theatre-full"><div class="theatre-header"><p class="eyebrow"><span></span>Interactive institutional theatre</p><h1>Compose the mission. Watch proof assemble.</h1><p>This browser-local theatre demonstrates acceptance flow: mission, evidence, review, authorization, receipt. It does not contact a server or execute a transaction.</p></div><div class="theatre-grid"><aside class="mission-card"><h2>Mission contract</h2><label>Consequential work unit<textarea data-mission>Prepare an investor-grade AI workflow assessment with sources, risks, limitations, and a recommended go/no-go decision.</textarea></label><label>Operating posture<select data-posture><option>Institutional proof</option><option>Conservative review</option><option>Speed with evidence</option></select></label><button class="primary wide" data-launch type="button">Generate local proof flight</button><button class="secondary wide" data-reset type="button">Reset theatre</button><p class="boundary mini">Local simulation. No external action. No acceptance granted.</p></aside><section class="flight-card"><div class="flight-stage"><canvas id="theatre-canvas" aria-label="Proof flight visualization"></canvas><div class="flight-core">α<br/><small>review</small></div></div><div class="gate-board theatre-gates" data-gates>${chain.map((c,i)=>`<span data-gate="${i}">${String(i+1).padStart(2,'0')} ${c}</span>`).join('')}</div><ol class="event-log tall" data-log><li>Mission contract awaiting commitment.</li></ol></section><aside class="decision-card"><h2>Human frontier</h2><div class="score-ring large" data-score><span>00</span><small>review readiness</small></div><ul><li><b>Factual correctness</b><span>Not certified</span></li><li><b>Production</b><span>Private beta</span></li><li><b>Settlement</b><span>Not authorized</span></li><li><b>External actions</b><span>0</span></li></ul><button class="ghost wide" data-help type="button">Open command help</button></aside></div></section>`});
}

function architecture(){
 const layers = ['Customer workspaces','Mission contract','Evidence matrix','Review chamber','Decision authority','Receipt signer','Verification anchor','Audit chronicle'].map((x,i)=>`<li><b>${String(i+1).padStart(2,'0')}</b><span>${x}</span></li>`).join('');
 return layout({title:'GoalOS Signoff Pro · Architecture',description:'Trusted product architecture for GoalOS Signoff Pro.',active:'Architecture',body:`<section class="page-hero section-x"><p class="eyebrow"><span></span>Trusted architecture</p><h1>Polished surface. Governed substrate.</h1><p>The website presents a premium institutional front door while keeping product boundaries precise and verifiable.</p></section><section class="section-x split"><div class="architecture-stack reveal"><ol>${layers}</ol></div><div class="panel reveal"><h2>Design principles</h2><p>Default deny, human approval, evidence before acceptance, receipt replay, optional verification, no silent authority escalation.</p><div class="mini-orbits"><span></span><span></span><span></span></div></div></section><section class="section-x proof-map"><h2>Architecture posture</h2><div class="phase-grid">${['No app secrets in public artifact','No customer data on Pages','No settlement claim','No AGIALPHA activation claim','No external scripts','Manifest-bound deployment'].map((x,i)=>`<article class="phase"><b>${String(i+1).padStart(2,'0')}</b><h3>${x}</h3><p>Verified at build time by the autonomous Pages workflow.</p></article>`).join('')}</div></section>`});
}

function trust(){
 const rows = [['Customer funds','Not held by this public site'],['Customer data','Not published to Pages'],['AI verdicts','Not automatic authority'],['Verification','Optional receipt anchoring'],['Human decision','Required for acceptance'],['Mainnet settlement','Not authorized']].map(([a,b])=>`<li><b>${a}</b><span>${b}</span></li>`).join('');
 return layout({title:'GoalOS Signoff Pro · Trust',description:'Boundary, safety, and governance posture for GoalOS Signoff Pro.',active:'Trust',body:`<section class="page-hero section-x"><p class="eyebrow"><span></span>Trust boundary</p><h1>Prestige without ambiguity.</h1><p>GoalOS Signoff Pro uses a high-authority visual system while making limitations explicit. Beautiful interfaces must not imply unearned authority.</p></section><section class="section-x split"><div class="panel ledger-panel reveal"><h2>Public boundary ledger</h2><ul>${rows}</ul></div><div class="panel reveal"><h2>Institutional assurance posture</h2><p>Every public release includes a production manifest, file hashes, curated artifact boundary, and a credential scan before deployment.</p><a class="secondary" href="${asset('production-manifest.json')}">Open production manifest</a></div></section>`});
}

function pilot(){
 return layout({title:'GoalOS Signoff Pro · Private Beta',description:'Private beta entry for GoalOS Signoff Pro.',active:'Pilot',body:`<section class="page-hero section-x"><p class="eyebrow"><span></span>Private beta protocol</p><h1>Ten signoffs. Zero ambiguity.</h1><p>The first milestone is simple: complete ten real acceptance workflows with clients, builders, and reviewers, then measure whether receipts reduce confusion.</p></section><section class="section-x split"><div class="panel reveal"><h2>Pilot success signal</h2><p>7/10 workflows completed, 3 users willing to reuse, no lost evidence, no broken receipt, no security incident.</p></div><div class="panel reveal"><h2>Who should join</h2><p>AI consultants, agencies, research teams, grant reviewers, and operators who already need better delivery acceptance records.</p></div></section><section class="section-x cta-block"><h2>Request private access</h2><p>Use the current repository process to wire the SaaS runtime after the public front door is live.</p></section>`});
}

function dossier(){
 const docs = ['Executive brief','Product strategy','Trust model','Private beta plan','Receipt specification','Verified receipts roadmap','AGIALPHA boundary','Release checklist'].map(x=>`<a href="https://github.com/${owner}/${repo}/tree/main/docs">${x}</a>`).join('');
 return layout({title:'GoalOS Signoff Pro · Dossier',description:'Documentation and evidence dossier for GoalOS Signoff Pro.',active:'Dossier',body:`<section class="page-hero section-x"><p class="eyebrow"><span></span>Evidence dossier</p><h1>Documentation as an institutional surface.</h1><p>The public site links to controlled repository docs without copying internal implementation material into Pages.</p></section><section class="section-x dossier-links">${docs}</section><section class="section-x panel"><h2>Release manifest</h2><p>Every autonomous Pages deployment writes a manifest with commit, run, generation time, file hashes, and an overall site hash.</p><a class="primary" href="${asset('production-manifest.json')}">Inspect manifest</a></section>`});
}

function page404(){ return layout({title:'GoalOS Signoff Pro · Not Found',description:'Not found',active:'',body:`<section class="page-hero section-x"><p class="eyebrow"><span></span>404</p><h1>Route not sealed.</h1><p>The requested page is not part of the published evidence surface.</p><a class="primary" href="${asset('index.html')}">Return home</a></section>`}); }

const css = String.raw`
:root{--bg:#02040a;--panel:rgba(10,16,27,.68);--panel2:rgba(15,24,42,.82);--line:rgba(185,255,229,.18);--text:#f8f3e8;--muted:#aeb9c9;--mint:#72ffd4;--cyan:#72dfff;--gold:#ffe986;--violet:#b899ff;--pink:#ff77bb;--shadow:0 30px 90px rgba(0,0,0,.55);--max:1180px}*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:radial-gradient(circle at 76% 8%,rgba(101,238,255,.16),transparent 32%),radial-gradient(circle at 14% 70%,rgba(160,110,255,.13),transparent 35%),var(--bg);color:var(--text);font-family:Inter,ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;line-height:1.5;overflow-x:hidden}a{color:inherit;text-decoration:none}.skip{position:absolute;left:-999px}.skip:focus{left:1rem;top:1rem;z-index:99;background:#fff;color:#000;padding:.8rem 1rem;border-radius:999px}#asi-field{position:fixed;inset:0;z-index:-4;background:#02040a}.aurora{position:fixed;inset:-20%;z-index:-3;background:conic-gradient(from 120deg,transparent,rgba(114,255,212,.12),rgba(184,153,255,.10),transparent,rgba(255,233,134,.09),transparent);filter:blur(80px);animation:aurora 22s linear infinite}.grid-veil{position:fixed;inset:0;z-index:-2;background-image:linear-gradient(rgba(255,255,255,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.04) 1px,transparent 1px);background-size:72px 72px;mask-image:linear-gradient(to bottom,rgba(0,0,0,.65),transparent 85%)}@keyframes aurora{to{transform:rotate(360deg)}}.site-header{position:sticky;top:0;z-index:50;display:flex;align-items:center;justify-content:space-between;gap:1rem;padding:1rem clamp(1rem,3vw,3rem);border-bottom:1px solid rgba(255,255,255,.09);background:rgba(2,4,10,.72);backdrop-filter:blur(18px)}.brand-mark{display:flex;align-items:center;gap:.8rem}.sigil{width:42px;height:42px;border:1px solid rgba(114,255,212,.45);border-radius:14px;display:grid;place-items:center;box-shadow:0 0 35px rgba(114,255,212,.22)}.sigil i{width:18px;height:18px;border-radius:50%;background:radial-gradient(circle,var(--gold),var(--mint) 45%,transparent 46%);box-shadow:0 0 22px var(--mint)}.brand-mark b{display:block;text-transform:uppercase;letter-spacing:.12em;font-size:.78rem}.brand-mark em{display:block;color:var(--muted);font-size:.67rem;letter-spacing:.16em;text-transform:uppercase;font-style:normal}.nav{display:flex;gap:.35rem;align-items:center;flex-wrap:wrap}.nav-link,.nav-cta{padding:.65rem .9rem;border:1px solid transparent;border-radius:999px;color:#dce6f3;font-size:.78rem;font-weight:800}.nav-link.active,.nav-link:hover,.nav-cta{border-color:rgba(255,255,255,.16);background:rgba(255,255,255,.07)}.nav-cta{background:linear-gradient(135deg,var(--gold),var(--mint));color:#0b0d13}.section-x{max-width:var(--max);margin:0 auto;padding:clamp(4rem,8vw,8rem) clamp(1rem,3vw,2rem)}.hero{display:grid;grid-template-columns:minmax(0,1.05fr) minmax(360px,.9fr);gap:4rem;align-items:center;min-height:calc(100vh - 80px)}.eyebrow{font-size:.75rem;letter-spacing:.28em;text-transform:uppercase;color:var(--mint);font-weight:900;display:flex;align-items:center;gap:.7rem}.eyebrow span{width:34px;height:2px;background:linear-gradient(90deg,var(--mint),transparent)}h1{font-size:clamp(4rem,10.5vw,9.8rem);line-height:.78;margin:.35em 0 .25em;letter-spacing:-.08em;text-transform:uppercase}h1 i{font-family:Georgia,serif;font-style:italic;font-weight:400;background:linear-gradient(90deg,var(--gold),var(--mint),var(--cyan),var(--violet));-webkit-background-clip:text;color:transparent;text-transform:none;letter-spacing:-.06em}h2{font-size:clamp(2rem,5vw,5rem);line-height:.92;letter-spacing:-.06em;margin:.1em 0 .25em}.subtitle,.page-hero p,.split p{font-size:clamp(1.05rem,2vw,1.35rem);color:#d8e0ef;max-width:760px}.boundary-strip,.boundary{border:1px solid rgba(255,119,187,.35);background:linear-gradient(90deg,rgba(255,119,187,.14),rgba(114,255,212,.06));border-radius:18px;padding:1rem;margin:1.7rem 0;color:#ecd7e4}.boundary-strip b{letter-spacing:.22em;color:#ff9cca;margin-right:.7rem;font-size:.72rem}.boundary-strip span{color:#f0e8ee}.cta-row{display:flex;gap:.8rem;flex-wrap:wrap;align-items:center}.primary,.secondary,.ghost{display:inline-flex;align-items:center;justify-content:center;border-radius:999px;padding:.9rem 1.2rem;font-weight:900;border:1px solid rgba(255,255,255,.17);cursor:pointer}.primary{background:linear-gradient(135deg,var(--gold),var(--mint),var(--cyan));color:#0b0d13;box-shadow:0 0 45px rgba(114,255,212,.25)}.secondary{background:rgba(255,255,255,.06);color:#fff}.ghost{background:transparent;color:#dce6f3}.metrics{display:grid;grid-template-columns:repeat(3,1fr);gap:.65rem;margin-top:2rem}.metric{border:1px solid rgba(255,255,255,.13);background:rgba(255,255,255,.05);border-radius:18px;padding:1rem}.metric strong{display:block;font-size:2rem;color:var(--gold)}.metric span{display:block;text-transform:uppercase;font-size:.65rem;letter-spacing:.18em;color:var(--muted)}.hero-orb{perspective:1200px}.orb-card,.panel,.phase,.feature,.mission-card,.flight-card,.decision-card,.command-card{border:1px solid rgba(255,255,255,.13);background:linear-gradient(135deg,rgba(255,255,255,.09),rgba(255,255,255,.035));box-shadow:var(--shadow);backdrop-filter:blur(18px);border-radius:32px}.orb-card{padding:1.1rem;min-height:620px;position:relative;overflow:hidden}.orb-card:before{content:"";position:absolute;inset:-40%;background:radial-gradient(circle at 72% 20%,rgba(114,255,212,.22),transparent 28%),radial-gradient(circle at 28% 76%,rgba(184,153,255,.20),transparent 32%);animation:spin 18s linear infinite}.orb-card>*{position:relative}.orb-top,.orb-status{display:flex;justify-content:space-between;gap:1rem;text-transform:uppercase;letter-spacing:.16em;font-size:.68rem;color:var(--muted)}.orb-top b,.orb-status b{color:var(--mint)}.orbital-system{height:390px;position:relative;margin:2rem 0;border-radius:26px;background:radial-gradient(circle at 50% 50%,rgba(114,255,212,.14),transparent 35%)}.core,.council-core,.flight-core{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:150px;height:150px;border-radius:50%;display:grid;place-items:center;text-align:center;background:radial-gradient(circle,var(--gold),var(--mint) 45%,var(--violet));color:#061014;box-shadow:0 0 50px rgba(114,255,212,.45)}.core span{font-family:Georgia,serif;font-size:4.8rem;line-height:1}.core small,.flight-core small{display:block;letter-spacing:.18em;text-transform:uppercase;font-weight:900}.orbit{position:absolute;border:1px dashed rgba(255,255,255,.18);border-radius:50%;left:50%;top:50%;transform:translate(-50%,-50%)}.o1{width:250px;height:250px;animation:spin 19s linear infinite}.o2{width:340px;height:200px;animation:spin 24s linear infinite reverse}.o3{width:420px;height:300px;animation:spin 29s linear infinite}.node{position:absolute;width:54px;height:54px;border-radius:50%;display:grid;place-items:center;background:#07101d;border:1px solid var(--mint);box-shadow:0 0 18px rgba(114,255,212,.3);font-size:.8rem}.n1{left:50%;top:2%}.n2{right:10%;top:18%}.n3{right:5%;bottom:24%}.n4{left:50%;bottom:4%}.n5{left:8%;bottom:22%}.n6{left:9%;top:18%}.beam-map{position:absolute;inset:0;width:100%;height:100%;fill:none;stroke:rgba(114,255,212,.45);stroke-width:2;filter:drop-shadow(0 0 8px rgba(114,255,212,.5))}.proof-chain{display:grid;grid-template-columns:repeat(3,1fr);gap:.55rem;padding:0;list-style:none}.proof-chain li{border:1px solid rgba(255,255,255,.12);border-radius:16px;padding:.75rem;background:rgba(0,0,0,.22)}.proof-chain b{color:var(--mint);margin-right:.5rem}.ticker{display:flex;gap:2rem;overflow:hidden;border-block:1px solid rgba(255,255,255,.1);padding:1rem;white-space:nowrap;background:#04070d}.ticker span{color:var(--gold);font-weight:900;letter-spacing:.24em;font-size:.72rem;animation:marq 26s linear infinite}.split{display:grid;grid-template-columns:1fr 1fr;gap:2rem;align-items:center}.panel{padding:2rem}.ledger-panel ul,.decision-card ul{list-style:none;padding:0;margin:0}.ledger-panel li,.decision-card li{display:flex;justify-content:space-between;border-bottom:1px solid rgba(255,255,255,.1);padding:1rem 0;gap:1rem}.ledger-panel span,.decision-card span{color:var(--muted);text-align:right}.phase-grid,.feature-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1rem}.phase,.feature{padding:1.4rem;min-height:190px}.phase b{color:var(--gold);font-size:1.2rem}.phase h3,.feature h3{font-size:1.35rem;margin:.7rem 0}.phase p,.feature p{color:var(--muted)}.console-theatre{display:grid;grid-template-columns:.85fr 1fr;gap:1rem}.console-left,.console-right{padding:2rem;border:1px solid rgba(255,255,255,.13);background:rgba(0,0,0,.24);border-radius:32px}.score-ring{width:170px;height:170px;border-radius:50%;border:8px solid rgba(114,255,212,.14);box-shadow:inset 0 0 30px rgba(114,255,212,.2),0 0 40px rgba(114,255,212,.25);display:grid;place-items:center;margin:auto;background:conic-gradient(from 0deg,var(--mint) var(--score,0%),rgba(255,255,255,.12) 0)}.score-ring span{font-size:3rem;font-weight:950}.score-ring small{text-transform:uppercase;letter-spacing:.14em;color:var(--muted);font-size:.58rem}.gate-board{display:grid;gap:.55rem;margin-top:1.2rem}.gate-board span{border:1px solid rgba(255,255,255,.12);border-radius:14px;padding:.8rem;background:rgba(255,255,255,.04);color:var(--muted);font-size:.78rem;text-transform:uppercase;letter-spacing:.08em}.gate-board span.on{border-color:var(--mint);color:#fff;box-shadow:0 0 22px rgba(114,255,212,.2)}.event-log{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;color:#bdebdc;max-height:200px;overflow:auto;background:rgba(0,0,0,.24);border:1px solid rgba(255,255,255,.1);border-radius:16px;padding:1rem}.event-log li{margin:.35rem 0}.council{display:grid;grid-template-columns:.8fr 1fr;gap:2rem;align-items:center}.council-orbit{height:520px;position:relative}.council-seat{position:absolute;left:50%;top:50%;width:150px;min-height:70px;border:1px solid rgba(255,255,255,.13);background:rgba(255,255,255,.06);border-radius:20px;padding:.8rem;display:grid;place-items:center;text-align:center;transform:rotate(calc(var(--i)*45deg)) translateX(210px) rotate(calc(var(--i)*-45deg));font-size:.78rem;color:#dce6f3}.page-hero{padding-bottom:2rem}.page-hero h1{font-size:clamp(3.4rem,8vw,8rem)}.architecture-stack ol{list-style:none;margin:0;padding:0;display:grid;gap:.7rem}.architecture-stack li{display:flex;gap:1rem;align-items:center;border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.05);border-radius:20px;padding:1.1rem}.architecture-stack b{color:var(--gold)}.mini-orbits{height:180px;position:relative}.mini-orbits span{position:absolute;left:50%;top:50%;border:1px dashed rgba(114,255,212,.35);border-radius:50%;transform:translate(-50%,-50%);animation:spin 14s linear infinite}.mini-orbits span:nth-child(1){width:80px;height:80px}.mini-orbits span:nth-child(2){width:130px;height:100px;animation-duration:20s}.mini-orbits span:nth-child(3){width:190px;height:130px;animation-duration:28s;animation-direction:reverse}.theatre-full{padding:clamp(2rem,5vw,5rem);min-height:calc(100vh - 80px)}.theatre-header{max-width:950px}.theatre-header h1{font-size:clamp(3rem,7vw,7rem)}.theatre-grid{display:grid;grid-template-columns:300px 1fr 300px;gap:1rem;align-items:stretch}.mission-card,.flight-card,.decision-card{padding:1.2rem}.mission-card textarea,.mission-card select{width:100%;margin:.5rem 0 1rem;border:1px solid rgba(255,255,255,.16);background:rgba(0,0,0,.25);border-radius:14px;color:#fff;padding:.9rem}.mission-card textarea{min-height:170px}.wide{width:100%;margin:.35rem 0}.mini{font-size:.82rem}.flight-stage{height:430px;position:relative;border:1px solid rgba(255,255,255,.11);border-radius:24px;overflow:hidden;background:radial-gradient(circle at center,rgba(114,255,212,.09),transparent 42%)}#theatre-canvas{position:absolute;inset:0;width:100%;height:100%}.flight-core{width:110px;height:110px}.tall{max-height:220px}.dossier-links{display:grid;grid-template-columns:repeat(4,1fr);gap:1rem}.dossier-links a{padding:1.4rem;border:1px solid rgba(255,255,255,.13);border-radius:20px;background:rgba(255,255,255,.05);font-weight:900}.cta-block{text-align:center;border-top:1px solid rgba(255,255,255,.1)}.footer{display:flex;justify-content:space-between;gap:1rem;padding:2rem clamp(1rem,3vw,3rem);border-top:1px solid rgba(255,255,255,.1);background:#02040a;color:var(--muted)}.footer b{display:block;color:#fff}.footer-links{display:flex;gap:1rem}.command-help{position:fixed;inset:0;z-index:100;background:rgba(0,0,0,.65);display:grid;place-items:center;padding:1rem}.command-help[hidden]{display:none}.command-help>div{max-width:520px;background:#0b101b;border:1px solid rgba(255,255,255,.16);border-radius:28px;padding:2rem;box-shadow:var(--shadow);position:relative}.close-help{position:absolute;right:1rem;top:1rem;border:0;background:#fff;color:#000;border-radius:50%;width:32px;height:32px}.command-help dl{display:grid;grid-template-columns:60px 1fr;gap:.7rem}.command-help dt{background:rgba(255,255,255,.08);border-radius:10px;text-align:center;padding:.45rem;color:var(--gold);font-weight:900}.command-help dd{margin:0;color:var(--muted)}.reveal{opacity:0;transform:translateY(28px);transition:opacity .8s ease,transform .8s ease}.reveal.on{opacity:1;transform:none}@keyframes spin{to{transform:translate(-50%,-50%) rotate(360deg)}}@keyframes marq{from{transform:translateX(0)}to{transform:translateX(-1200px)}}@media(max-width:1000px){.hero,.split,.console-theatre,.council,.theatre-grid{grid-template-columns:1fr}.nav{display:none}.metrics,.phase-grid,.feature-grid,.dossier-links{grid-template-columns:1fr 1fr}.hero{min-height:auto}.orb-card{min-height:560px}.theatre-grid{display:block}.mission-card,.flight-card,.decision-card{margin-bottom:1rem}}@media(max-width:640px){h1{font-size:3.8rem}.metrics,.phase-grid,.feature-grid,.dossier-links{grid-template-columns:1fr}.proof-chain{grid-template-columns:1fr}.footer{display:block}.council-seat{transform:rotate(calc(var(--i)*45deg)) translateX(128px) rotate(calc(var(--i)*-45deg));width:110px}.council-orbit{height:360px}.site-header{align-items:flex-start}.nav-cta{display:none}}@media(prefers-reduced-motion:reduce){*,*:before,*:after{animation:none!important;transition:none!important;scroll-behavior:auto!important}#asi-field{display:none}.reveal{opacity:1;transform:none}}
`;

const js = String.raw`
(function(){
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const qs = (s, r=document) => r.querySelector(s);
  const qsa = (s, r=document) => Array.from(r.querySelectorAll(s));
  const rand = (a,b) => a + Math.random()*(b-a);
  const canvas = qs('#asi-field');
  if(canvas && !reduce){
    const ctx = canvas.getContext('2d');
    let w=0,h=0,dpr=1,mouse={x:0,y:0,active:false};
    let nodes=[];
    function resize(){ dpr=Math.min(2,window.devicePixelRatio||1); w=canvas.width=Math.floor(innerWidth*dpr); h=canvas.height=Math.floor(innerHeight*dpr); canvas.style.width=innerWidth+'px'; canvas.style.height=innerHeight+'px'; nodes=Array.from({length:Math.min(130,Math.floor(innerWidth/9))},(_,i)=>({x:rand(0,w),y:rand(0,h),vx:rand(-.22,.22)*dpr,vy:rand(-.18,.18)*dpr,r:rand(.8,2.2)*dpr,t:i%7})); }
    function draw(){ ctx.clearRect(0,0,w,h); const g=ctx.createRadialGradient(w*.72,h*.18,0,w*.72,h*.18,Math.max(w,h)*.7); g.addColorStop(0,'rgba(114,255,212,.075)'); g.addColorStop(.45,'rgba(154,126,255,.035)'); g.addColorStop(1,'rgba(0,0,0,0)'); ctx.fillStyle=g; ctx.fillRect(0,0,w,h); for(const p of nodes){ p.x+=p.vx; p.y+=p.vy; if(p.x<0||p.x>w)p.vx*=-1; if(p.y<0||p.y>h)p.vy*=-1; const mx=mouse.x*dpr,my=mouse.y*dpr,dx=p.x-mx,dy=p.y-my,dist=Math.hypot(dx,dy); if(mouse.active && dist<210*dpr){ p.x+=dx/(dist+1)*.9; p.y+=dy/(dist+1)*.9; } }
      for(let i=0;i<nodes.length;i++){ for(let j=i+1;j<nodes.length;j++){ const a=nodes[i],b=nodes[j],d=Math.hypot(a.x-b.x,a.y-b.y); if(d<115*dpr){ ctx.globalAlpha=(1-d/(115*dpr))*.28; ctx.strokeStyle=a.t===b.t?'#72ffd4':'#788cff'; ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke(); } } }
      ctx.globalAlpha=1; for(const p of nodes){ ctx.fillStyle=p.t%3===0?'#72ffd4':p.t%3===1?'#ffe986':'#b899ff'; ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill(); } requestAnimationFrame(draw); }
    addEventListener('resize',resize,{passive:true}); addEventListener('pointermove',e=>{mouse.x=e.clientX;mouse.y=e.clientY;mouse.active=true},{passive:true}); addEventListener('pointerleave',()=>{mouse.active=false},{passive:true}); resize(); draw();
  }
  const io = 'IntersectionObserver' in window ? new IntersectionObserver(entries=>entries.forEach(e=>{ if(e.isIntersecting)e.target.classList.add('on'); }),{threshold:.12}) : null; qsa('.reveal').forEach(el=>io?io.observe(el):el.classList.add('on'));
  qsa('[data-tilt]').forEach(card=>{ if(reduce)return; card.addEventListener('pointermove',e=>{ const r=card.getBoundingClientRect(); const x=(e.clientX-r.left)/r.width-.5; const y=(e.clientY-r.top)/r.height-.5; card.style.transform='rotateY('+x*8+'deg) rotateX('+(-y*8)+'deg)'; }); card.addEventListener('pointerleave',()=>{card.style.transform='';}); });
  const help=qs('#command-help'); function toggleHelp(v){ if(!help)return; help.hidden = typeof v==='boolean' ? !v : !help.hidden; }
  qsa('[data-help]').forEach(b=>b.addEventListener('click',()=>toggleHelp(true))); qsa('.close-help').forEach(b=>b.addEventListener('click',()=>toggleHelp(false)));
  const lines=['Mission contract committed.','Evidence planes mapped.','Reviewer dissent preserved.','Acceptance boundary checked.','Receipt digest sealed.','Human decision required.'];
  function runTheatre(){ const gates=qsa('[data-gate]'); const logs=qsa('[data-log]'); const scores=qsa('[data-score]'); gates.forEach(g=>g.classList.remove('on')); scores.forEach(s=>{s.style.setProperty('--score','0%'); const n=s.querySelector('span'); if(n)n.textContent='00';}); logs.forEach(l=>l.innerHTML='<li>Proof flight initialized. External authority remains zero.</li>'); let i=0; const tick=()=>{ if(i>=gates.length){logs.forEach(l=>l.insertAdjacentHTML('beforeend','<li>Terminal disposition: ready for human review. No action executed.</li>')); return;} gates.forEach(g=>{ if(Number(g.dataset.gate)<=i)g.classList.add('on'); }); const score=String(Math.min(92,18+i*13)).padStart(2,'0'); scores.forEach(s=>{s.style.setProperty('--score',(18+i*13)+'%'); const n=s.querySelector('span'); if(n)n.textContent=score;}); logs.forEach(l=>{l.insertAdjacentHTML('beforeend','<li>'+lines[i]+'</li>'); l.scrollTop=l.scrollHeight;}); i++; setTimeout(tick,420);}; tick(); drawMiniFlight(); }
  function resetTheatre(){ qsa('[data-gate]').forEach(g=>g.classList.remove('on')); qsa('[data-log]').forEach(l=>l.innerHTML='<li>System reset. Awaiting bounded mission.</li>'); qsa('[data-score]').forEach(s=>{s.style.setProperty('--score','0%'); const n=s.querySelector('span'); if(n)n.textContent='00';}); }
  qsa('[data-launch]').forEach(b=>b.addEventListener('click',runTheatre)); qsa('[data-reset]').forEach(b=>b.addEventListener('click',resetTheatre));
  function drawMiniFlight(){ const c=qs('#theatre-canvas'); if(!c)return; const ctx=c.getContext('2d'); const r=c.getBoundingClientRect(); const d=Math.min(2,devicePixelRatio||1); c.width=Math.floor(r.width*d); c.height=Math.floor(r.height*d); const w=c.width,h=c.height; let t=0; function frame(){ ctx.clearRect(0,0,w,h); ctx.strokeStyle='rgba(114,255,212,.22)'; ctx.lineWidth=1*d; for(let k=0;k<8;k++){ ctx.beginPath(); ctx.ellipse(w/2,h/2,80*d+k*22*d,42*d+k*13*d,t/35+k*.4,0,Math.PI*2); ctx.stroke(); } for(let i=0;i<16;i++){ const a=t/38+i*Math.PI*2/16; const x=w/2+Math.cos(a)*(120+Math.sin(t/22+i)*60)*d; const y=h/2+Math.sin(a*1.25)*(70+Math.cos(t/27+i)*50)*d; ctx.fillStyle=i%3===0?'#72ffd4':i%3===1?'#ffe986':'#b899ff'; ctx.beginPath(); ctx.arc(x,y,3*d,0,Math.PI*2); ctx.fill(); } t++; if(t<240 && !reduce)requestAnimationFrame(frame); } frame(); }
  addEventListener('keydown',e=>{ if(['INPUT','TEXTAREA','SELECT'].includes((e.target||{}).tagName))return; if(e.key==='?' ){ e.preventDefault(); toggleHelp(); } if(e.key.toLowerCase()==='g') runTheatre(); if(e.key.toLowerCase()==='r') resetTheatre(); if(e.key.toLowerCase()==='h'){ qsa('[data-log]').forEach(l=>l.insertAdjacentHTML('beforeend','<li>Safe hold engaged. Review boundary preserved.</li>')); } });
})();
`;

cleanDir(out); ensureDir(path.join(out,'assets'));
write('assets/asi-apex.css', css);
write('assets/asi-apex.js', js);
write('index.html', index());
write('platform.html', platform());
write('theatre.html', theatre());
write('architecture.html', architecture());
write('trust.html', trust());
write('pilot.html', pilot());
write('dossier.html', dossier());
write('404.html', page404());
write('robots.txt', `User-agent: *\nAllow: /\nSitemap: ${productionUrl}sitemap.xml\n`);
write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${['','platform.html','theatre.html','architecture.html','trust.html','pilot.html','dossier.html'].map(p=>`<url><loc>${productionUrl}${p}</loc></url>`).join('')}</urlset>\n`);
write('apex-manifest.txt', `GoalOS Signoff Pro ASI Apex v4\nGenerated: ${generatedAt}\nRepository: ${owner}/${repo}\nCommit: ${sha}\nRun: ${runId}\nBoundary: public curated static artifact only\n`);

const files=[];
(function walk(dir){ for(const ent of fs.readdirSync(dir,{withFileTypes:true})){ const abs=path.join(dir,ent.name); if(ent.isDirectory()) walk(abs); else files.push(abs); } })(out);
const manifestFiles=files.sort().map(abs=>({path:path.relative(out,abs).replace(/\\/g,'/'),sha256:hashFile(abs),bytes:fs.statSync(abs).size}));
const siteHash=hashBuffer(Buffer.from(JSON.stringify(manifestFiles),'utf8'));
write('production-manifest.json', JSON.stringify({schema:'goalos.signoff_pro.asi_apex_pages.v4',status:'PUBLIC_STATIC_ARTIFACT_READY',repository:`${owner}/${repo}`,productionUrl,commit:sha,runId,generatedAt,boundary:{publicArtifactOnly:true,customerData:false,credentials:false,escrow:false,settlement:false,agialphaActivation:false,externalNetworkDependency:false},effects:['canvas neural constellation','proof theatre','orbital institution map','scroll reveal','keyboard command surface','responsive aurora field'],files:manifestFiles,siteHash},null,2)+'\n');

const forbiddenNames = [/^\.env/i,/node_modules/,/\.git/,/\.next/,/package-lock\.json$/,/\.pem$/,/\.key$/,/\.p12$/,/\.pfx$/];
const forbiddenText = /(BEGIN\s+(RSA |EC |OPENSSH |)PRIVATE KEY|SUPABASE_SERVICE_ROLE|STRIPE_SECRET|sk_live_|sk_test_|MNEMONIC|SEED_PHRASE|PRIVATE_KEY=|API_SECRET|RPC_URL=)/i;
for(const abs of files.concat([path.join(out,'production-manifest.json')])){
  const rel=path.relative(out,abs).replace(/\\/g,'/');
  if(forbiddenNames.some(r=>r.test(rel))) throw new Error(`Refusing artifact file ${rel}`);
  const text=fs.readFileSync(abs,'utf8');
  if(forbiddenText.test(text)) throw new Error(`Refusing credential-like text in ${rel}`);
}
console.log(`Built ASI Apex site at ${out}`);
console.log(`Files: ${manifestFiles.length}`);
console.log(`Site hash: ${siteHash}`);
