#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = process.cwd();
const out = path.join(root, 'site');
const version = '6.0.0-final-production';
const baseUrl = 'https://montrealai.github.io/goalos-signoff-pro/';

function clean() { fs.rmSync(out, { recursive: true, force: true }); fs.mkdirSync(path.join(out, 'assets'), { recursive: true }); }
function write(rel, value) { const file = path.join(out, rel); fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, value, 'utf8'); }
function sha256(value) { return crypto.createHash('sha256').update(value).digest('hex'); }
function esc(s) { return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
function attr(s) { return esc(s); }

const nav = [
  ['index.html', 'Institution'],
  ['platform.html', 'Platform'],
  ['theatre.html', 'Proof theatre'],
  ['architecture.html', 'Architecture'],
  ['trust.html', 'Trust'],
  ['pilot.html', 'Pilot'],
  ['dossier.html', 'Dossier'],
];

function chrome(page, body, description) {
  const active = page;
  const navHtml = nav.map(([href, label]) => `<a class="nav-link ${href === active ? 'active' : ''}" href="${href}">${label}</a>`).join('');
  const title = active === 'index.html' ? 'GoalOS Signoff Pro' : `GoalOS Signoff Pro · ${nav.find(([h]) => h === active)?.[1] || 'Institution'}`;
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description || 'GoalOS Signoff Pro is the institutional acceptance layer for AI-delivered work: mission briefs, evidence, human authorization, and signed receipts.')}" />
  <meta property="og:title" content="${esc(title)}" />
  <meta property="og:description" content="${esc(description || 'Define done. Bind evidence. Preserve trust.')}" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="${baseUrl}${active}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="theme-color" content="#05070d" />
  <link rel="canonical" href="${baseUrl}${active}" />
  <link rel="stylesheet" href="assets/asi-apex-v6.css" />
</head>
<body data-page="${attr(active.replace('.html',''))}">
  <canvas id="neuralField" aria-hidden="true"></canvas>
  <div class="atmosphere" aria-hidden="true"><span></span><span></span><span></span></div>
  <header class="site-header">
    <a class="brand" href="index.html" aria-label="GoalOS Signoff Pro home">
      <span class="brand-mark"><span></span></span>
      <span><b>GoalOS Signoff Pro</b><small>Proof-to-Acceptance Institution</small></span>
    </a>
    <nav aria-label="Primary navigation">${navHtml}</nav>
    <a class="beta-pill" href="pilot.html">Private beta</a>
  </header>
  <main>${body}</main>
  <footer class="site-footer">
    <div><b>GoalOS Signoff Pro</b><span>AI-era work acceptance · evidence review · signed receipts · optional verification.</span></div>
    <nav aria-label="Footer navigation"><a href="trust.html">Trust</a><a href="dossier.html">Dossier</a><a href="production-manifest.json">Manifest</a></nav>
  </footer>
  <script src="assets/asi-apex-v6.js" defer></script>
</body>
</html>`;
}

function proofConsole() {
  const gates = [
    ['01','Commission','Work requested'],['02','Submit','Evidence delivered'],['03','Map','Criteria linked'],['04','Review','Human assessment'],['05','Accept','Authorized decision'],['06','Receipt','Signed & replayable']
  ];
  return `<section class="proof-console" aria-label="GoalOS acceptance console">
    <div class="console-top"><span>Institutional intelligence</span><b>Review mode</b></div>
    <div class="orbital-stage">
      <div class="sig-core"><span>α</span><small>Signoff</small></div>
      <i style="--a:0deg">BR</i><i style="--a:60deg">EV</i><i style="--a:120deg">RV</i><i style="--a:180deg">AC</i><i style="--a:240deg">RC</i><i style="--a:300deg">VR</i>
      <svg viewBox="0 0 560 360" aria-hidden="true">
        <defs><linearGradient id="pulse" x1="0" x2="1"><stop stop-color="#70ffe1"/><stop offset=".5" stop-color="#89b7ff"/><stop offset="1" stop-color="#ffe98a"/></linearGradient></defs>
        <path d="M64 190 C158 60 400 60 500 188" />
        <path d="M58 172 C190 248 354 246 506 164" />
        <path d="M95 250 C210 100 350 102 465 246" />
        <circle cx="280" cy="180" r="104" />
        <circle cx="280" cy="180" r="150" />
      </svg>
    </div>
    <div class="gate-grid">${gates.map(([n,t,d]) => `<article><b>${n}</b><span>${t}</span><small>${d}</small></article>`).join('')}</div>
    <div class="console-status"><span>Authority</span><b>Human gate</b><span>Replay</span><b>Available</b><span>Evidence</span><b>Bound</b></div>
  </section>`;
}

const featureCards = [
  ['Brief', 'Define acceptance before work begins.', 'A mission starts as a decision contract: deliverables, criteria, evidence requirements, and review authority.'],
  ['Evidence', 'Map every artifact to criteria.', 'Files, links, notes, tests, and limitations become a reviewable evidence plane instead of a scattered conversation.'],
  ['Review', 'Preserve judgment and dissent.', 'The product distinguishes automated checks from human authorization, so review can be fast without becoming invisible.'],
  ['Receipt', 'Seal the accepted version.', 'A signed Mission Receipt records the brief, evidence fingerprints, decision, timestamp, and verification path.'],
];

function featureGrid() { return `<div class="feature-grid">${featureCards.map((c, i) => `<article class="glass-card reveal"><span>${String(i+1).padStart(2,'0')}</span><h3>${c[0]}</h3><b>${c[1]}</b><p>${c[2]}</p></article>`).join('')}</div>`; }

const pages = new Map();

pages.set('index.html', chrome('index.html', `
  <section class="hero sovereign-hero">
    <div class="hero-copy reveal">
      <p class="eyebrow"><span></span>AI-era acceptance command surface</p>
      <h1>The Signoff Institution</h1>
      <p class="hero-lede">Define done. Bind evidence. Preserve judgment. Issue receipts that executives, reviewers, and systems can independently inspect.</p>
      <div class="authority-banner"><b>Human authority is the final gate</b><span>Every accepted version becomes a signed record with evidence attached, dissent preserved, and verification ready.</span></div>
      <div class="hero-actions"><a class="primary" href="pilot.html">Enter private beta</a><a class="secondary" href="theatre.html">Launch proof theatre</a><button class="ghost" type="button" data-help>Command help</button></div>
      <div class="stat-grid"><article><b>6</b><span>Acceptance gates</span></article><article><b>12</b><span>Evidence planes</span></article><article><b>1</b><span>Human authority</span></article><article><b>∞</b><span>Receipt replay</span></article></div>
    </div>
    <div class="hero-visual reveal delay-1">${proofConsole()}</div>
  </section>
  <section class="section split reveal">
    <div><p class="eyebrow"><span></span>From output to accountable delivery</p><h2>AI work becomes institutional when acceptance is explicit.</h2><p>GoalOS Signoff Pro is built for agencies, enterprise pilots, grant programs, and high-trust teams that need more than a file handoff. The product converts AI-assisted delivery into a governed acceptance record.</p></div>
    ${featureGrid()}
  </section>
`, 'GoalOS Signoff Pro is the institutional acceptance layer for AI-delivered work.'));

pages.set('platform.html', chrome('platform.html', `
  <section class="page-hero reveal"><p class="eyebrow"><span></span>Platform</p><h1>Acceptance infrastructure for serious AI work.</h1><p>The workflow feels simple to the customer: define the work, collect the evidence, review the delivery, issue the receipt. Underneath, every state is structured for replay, audit, and optional verification.</p></section>
  <section class="section">${featureGrid()}</section>
  <section class="section command-strip reveal"><article><b>01</b><h3>Mission brief</h3><p>Criteria before output. The customer and builder share the same acceptance map.</p></article><article><b>02</b><h3>Evidence plane</h3><p>Artifacts become linked proof, not attachments lost in a thread.</p></article><article><b>03</b><h3>Human signoff</h3><p>Automated assistance prepares the decision; human authority finalizes it.</p></article><article><b>04</b><h3>Receipt memory</h3><p>The accepted version can be verified, replayed, exported, and anchored.</p></article></section>
`, 'A mainstream SaaS workflow for accepting AI-delivered work with optional verified receipts.'));

pages.set('theatre.html', chrome('theatre.html', `
  <section class="page-hero compact reveal"><p class="eyebrow"><span></span>Live proof theatre</p><h1>Watch an acceptance record form.</h1><p>Launch a proof cycle and watch the acceptance record move from commission to receipt: evidence mapped, reviewer judgment captured, acceptance authorized, receipt sealed.</p></section>
  <section class="section theatre-grid reveal">
    <div class="theatre-panel"><h2>Mission control</h2><p>Launch a proof cycle and watch each gate advance into the receipt rail.</p><div class="hero-actions"><button class="primary" type="button" data-launch-cycle>Launch proof cycle</button><button class="secondary" type="button" data-reset-cycle>Reset</button></div><pre id="cycleLog">System ready. Awaiting bounded mission.</pre></div>
    <div class="ring-panel"><div class="readiness-ring" data-score="0" style="--score:0%"><b>0</b><span>Awaiting mission</span></div><div class="cycle-steps"><span>01 Commission</span><span>02 Submit</span><span>03 Map</span><span>04 Review</span><span>05 Accept</span><span>06 Receipt</span></div></div>
  </section>
`, 'Interactive browser-local proof theatre for the Signoff acceptance workflow.'));

pages.set('architecture.html', chrome('architecture.html', `
  <section class="page-hero reveal"><p class="eyebrow"><span></span>Architecture</p><h1>Trusted work acceptance, designed as layers.</h1><p>Each layer has a narrow job: capture the brief, organize evidence, support review, record decision, generate receipt, and optionally verify the record externally.</p></section>
  <section class="section architecture-map reveal">
    ${['Workspace','Brief engine','Evidence graph','Review console','Receipt signer','Verification bridge'].map((x,i)=>`<article><b>${String(i+1).padStart(2,'0')}</b><h3>${x}</h3><p>${['Role-aware project room for client, builder, reviewer, and observer.','Acceptance criteria, deliverables, and required evidence are composed before delivery.','Artifacts, claims, and limitations connect to criteria.','Automated checks support the reviewer without replacing final judgment.','Accepted versions become signed Mission Receipts.','Optional IPFS or Ethereum anchors can publish a digest of the accepted record.'][i]}</p></article>`).join('')}
  </section>
`, 'Layered architecture for evidence-backed AI work acceptance.'));

pages.set('trust.html', chrome('trust.html', `
  <section class="page-hero reveal"><p class="eyebrow"><span></span>Trust</p><h1>Authority is visible from the first brief to the final receipt.</h1><p>GoalOS Signoff Pro makes trust operational: clear roles, bounded decisions, evidence fingerprints, preserved change history, and receipts that can be independently checked.</p></section>
  <section class="section trust-ledger reveal">
    <article><span>Authority</span><h3>Human signoff</h3><p>Acceptance is an explicit decision by the client or designated reviewer. The interface makes the final gate visible and accountable.</p><b>Final gate</b></article>
    <article><span>Evidence</span><h3>Bound artifacts</h3><p>Submissions are tied to criteria, limitations, and file fingerprints so the accepted version can be replayed later.</p><b>Replayable</b></article>
    <article><span>Review</span><h3>Preserved dissent</h3><p>Change requests, reviewer notes, and unresolved risks stay attached to the mission history instead of vanishing after approval.</p><b>Inspectable</b></article>
    <article><span>Verification</span><h3>Receipt anchor</h3><p>Signed receipts are structured for export and optional external anchoring without changing the accepted work record.</p><b>Portable</b></article>
  </section>
  <section class="section signature-chamber reveal"><div><p class="eyebrow"><span></span>Operational posture</p><h2>The product speaks through controls, not claims.</h2><p>Signoff Pro presents the user with clear gates: evidence mapped, reviewer judgment captured, acceptance authorized, receipt sealed. The trust model is experienced as the workflow itself.</p></div><div class="seal-card"><b>MISSION RECEIPT</b><span>Brief hash</span><i>8A7F · 9C21 · B0D4</i><span>Decision</span><i>Accepted by authorized reviewer</i><span>Replay</span><i>Evidence, notes, and receipt available</i></div></section>
`, 'Trust architecture for GoalOS Signoff Pro: human authority, evidence replay, and signed receipts.'));

pages.set('pilot.html', chrome('pilot.html', `
  <section class="page-hero reveal"><p class="eyebrow"><span></span>Private beta</p><h1>Bring one serious AI delivery into Signoff.</h1><p>The pilot is designed for agencies, consultants, AI teams, and grant programs that already deliver consequential work and want a cleaner acceptance record.</p></section>
  <section class="section pilot-panel reveal"><div><h2>Ideal first pilots</h2><ul><li>AI research or strategy deliverable</li><li>Automation implementation milestone</li><li>Software feature handoff</li><li>Grant or bounty milestone review</li><li>Internal AI pilot acceptance</li></ul></div><div><h2>Success signal</h2><p>Five real Signoffs attempted. Three completed end-to-end. Two users say they would use it again. Zero broken receipts.</p><a class="primary" href="mailto:info@quebec.ai?subject=GoalOS%20Signoff%20Pro%20Private%20Beta">Request pilot access</a></div></section>
`, 'Private beta pilot page for GoalOS Signoff Pro.'));

pages.set('dossier.html', chrome('dossier.html', `
  <section class="page-hero reveal"><p class="eyebrow"><span></span>Dossier</p><h1>The launch record for the acceptance layer.</h1><p>Use this page to inspect the product narrative, production manifest, and operational handoff materials.</p></section>
  <section class="section dossier-grid reveal">
    <a href="production-manifest.json"><b>Production manifest</b><span>Generated commit, run, file hashes, site hash.</span></a>
    <a href="sitemap.xml"><b>Sitemap</b><span>Published production routes.</span></a>
    <a href="robots.txt"><b>Robots</b><span>Public indexing policy.</span></a>
    <a href="https://github.com/MontrealAI/goalos-signoff-pro"><b>Repository</b><span>Source, workflows, docs, and product code.</span></a>
  </section>
`, 'Launch dossier and production manifest for GoalOS Signoff Pro.'));

pages.set('404.html', chrome('404.html', `
  <section class="page-hero reveal"><p class="eyebrow"><span></span>Route not found</p><h1>This corridor is not part of the receipt map.</h1><p>Return to the institution surface and continue through a published route.</p><p><a class="primary" href="index.html">Return home</a></p></section>
`, 'GoalOS Signoff Pro page not found.'));

const css = String.raw`:root{color-scheme:dark;--bg:#03060b;--ink:#fbf7ed;--muted:#b7c2d4;--dim:#738198;--line:rgba(255,255,255,.14);--glass:rgba(14,20,31,.72);--glass2:rgba(255,255,255,.055);--aqua:#72ffe0;--cyan:#73d7ff;--violet:#a893ff;--gold:#ffe58a;--orange:#f4b44e;--radius:28px;--shadow:0 34px 100px rgba(0,0,0,.48),inset 0 1px 0 rgba(255,255,255,.08)}*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:radial-gradient(circle at 72% 14%,rgba(75,197,255,.14),transparent 32%),radial-gradient(circle at 21% 20%,rgba(92,255,211,.09),transparent 30%),linear-gradient(120deg,#02040a,#07111a 45%,#070611);color:var(--ink);font-family:Inter,ui-sans-serif,system-ui,-apple-system,Segoe UI,sans-serif;overflow-x:hidden}body:before{content:"";position:fixed;inset:0;z-index:-4;background-image:linear-gradient(rgba(255,255,255,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.035) 1px,transparent 1px);background-size:78px 78px;mask-image:linear-gradient(to bottom,rgba(0,0,0,.75),transparent 86%)}#neuralField{position:fixed;inset:0;z-index:-3;width:100%;height:100%;opacity:.82}.atmosphere{position:fixed;inset:-20%;z-index:-2;filter:blur(22px);pointer-events:none}.atmosphere span{position:absolute;border-radius:999px;mix-blend-mode:screen;opacity:.25}.atmosphere span:nth-child(1){width:55vw;height:18vw;background:linear-gradient(90deg,var(--aqua),transparent);top:20%;left:52%;transform:rotate(-18deg)}.atmosphere span:nth-child(2){width:48vw;height:16vw;background:linear-gradient(90deg,var(--violet),transparent);bottom:8%;left:20%;transform:rotate(24deg)}.atmosphere span:nth-child(3){width:36vw;height:12vw;background:linear-gradient(90deg,var(--gold),transparent);top:54%;right:8%;transform:rotate(8deg)}a{color:inherit;text-decoration:none}.site-header{height:88px;position:sticky;top:0;z-index:20;display:flex;align-items:center;gap:28px;padding:0 clamp(22px,4vw,64px);background:rgba(4,8,14,.82);backdrop-filter:blur(22px);border-bottom:1px solid var(--line)}.brand{display:flex;align-items:center;gap:14px;min-width:270px}.brand-mark{width:42px;height:42px;border-radius:13px;border:1px solid rgba(114,255,224,.48);display:grid;place-items:center;box-shadow:0 0 42px rgba(114,255,224,.25),inset 0 0 24px rgba(114,255,224,.14)}.brand-mark span{width:13px;height:13px;border-radius:50%;background:linear-gradient(135deg,var(--aqua),var(--violet));box-shadow:0 0 20px var(--aqua)}.brand b{display:block;text-transform:uppercase;letter-spacing:.18em;font-size:12px}.brand small{display:block;text-transform:uppercase;letter-spacing:.22em;color:var(--muted);font-size:10px}nav{display:flex;align-items:center;justify-content:center;gap:8px;flex:1}.nav-link{font-weight:800;font-size:13px;padding:12px 16px;border-radius:999px;color:#e8eef7}.nav-link.active,.nav-link:hover{background:rgba(255,255,255,.09);box-shadow:inset 0 0 0 1px var(--line)}.beta-pill,.primary,.secondary,.ghost{border:0;border-radius:999px;padding:14px 22px;font-weight:900;cursor:pointer}.beta-pill,.primary{background:linear-gradient(135deg,#fff18b,#69ffde,#75d9ff);color:#04100d;box-shadow:0 14px 50px rgba(114,255,224,.28)}.secondary,.ghost{background:rgba(255,255,255,.065);color:var(--ink);box-shadow:inset 0 0 0 1px var(--line)}main{min-height:calc(100vh - 88px)}.hero,.section,.page-hero{width:min(1180px,calc(100% - 40px));margin:0 auto}.hero{min-height:calc(100vh - 88px);display:grid;grid-template-columns:minmax(0,1fr) minmax(390px,520px);gap:clamp(32px,5vw,72px);align-items:center;padding:clamp(70px,8vw,128px) 0}.hero-copy{max-width:720px}.eyebrow{display:flex;align-items:center;gap:12px;color:var(--aqua);text-transform:uppercase;letter-spacing:.32em;font-weight:900;font-size:12px}.eyebrow span{display:inline-block;width:42px;height:1px;background:linear-gradient(90deg,var(--aqua),transparent)}h1,h2,h3,p{margin-top:0}h1{font-size:clamp(54px,8.2vw,116px);line-height:.87;letter-spacing:-.075em;margin-bottom:26px;max-width:820px;text-wrap:balance}h2{font-size:clamp(42px,6.8vw,86px);line-height:.9;letter-spacing:-.065em;margin-bottom:22px;text-wrap:balance}h3{font-size:22px;letter-spacing:-.02em;margin-bottom:10px}.hero-lede,.page-hero p,.section p{font-size:clamp(17px,1.45vw,22px);line-height:1.58;color:#dbe4ee;max-width:720px}.authority-banner{margin:28px 0;padding:18px 20px;border-radius:20px;background:linear-gradient(90deg,rgba(255,229,138,.14),rgba(114,255,224,.09));box-shadow:inset 0 0 0 1px rgba(255,255,255,.14)}.authority-banner b{display:block;color:var(--gold);font-size:14px;text-transform:uppercase;letter-spacing:.12em}.authority-banner span{display:block;color:#e8eef7;margin-top:8px;line-height:1.5}.hero-actions{display:flex;gap:12px;flex-wrap:wrap;margin:28px 0}.stat-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;max-width:660px;margin-top:30px}.stat-grid article{padding:18px;border-radius:18px;background:var(--glass2);box-shadow:inset 0 0 0 1px var(--line)}.stat-grid b{font-size:36px;color:var(--gold);line-height:1}.stat-grid span{display:block;color:var(--muted);text-transform:uppercase;letter-spacing:.16em;font-size:11px;margin-top:8px}.proof-console{position:relative;border-radius:34px;background:linear-gradient(145deg,rgba(255,255,255,.12),rgba(7,12,20,.72));box-shadow:var(--shadow),0 0 0 1px rgba(114,255,224,.25);padding:24px;overflow:hidden}.proof-console:before{content:"";position:absolute;inset:-20%;background:radial-gradient(circle at 55% 35%,rgba(114,255,224,.22),transparent 34%),radial-gradient(circle at 72% 52%,rgba(255,229,138,.18),transparent 24%);pointer-events:none}.console-top,.console-status{position:relative;z-index:2;display:flex;justify-content:space-between;gap:16px;text-transform:uppercase;letter-spacing:.18em;font-size:11px;color:#b6c2d2}.console-top b,.console-status b{color:var(--aqua)}.orbital-stage{height:330px;position:relative;display:grid;place-items:center;margin:12px 0}.orbital-stage svg{position:absolute;inset:0;width:100%;height:100%;opacity:.82}.orbital-stage path,.orbital-stage circle{fill:none;stroke:url(#pulse);stroke-width:1;stroke-dasharray:6 10;animation:dash 18s linear infinite}.sig-core{width:154px;height:154px;border-radius:50%;display:grid;place-items:center;background:radial-gradient(circle,#fff98a 0,#76ffe3 32%,#7db8ff 62%,rgba(168,147,255,.4));box-shadow:0 0 70px rgba(114,255,224,.65),0 0 120px rgba(168,147,255,.35);z-index:2;text-align:center;color:#04100d}.sig-core span{font-family:Georgia,serif;font-size:70px;font-weight:900}.sig-core small{display:block;text-transform:uppercase;letter-spacing:.32em;font-weight:900;font-size:11px;margin-top:-20px}.orbital-stage i{position:absolute;z-index:3;width:54px;height:54px;border-radius:50%;display:grid;place-items:center;background:#07101a;border:1px solid rgba(114,255,224,.72);font-style:normal;font-weight:900;transform:rotate(var(--a)) translate(168px) rotate(calc(-1 * var(--a)));box-shadow:0 0 28px rgba(114,255,224,.22)}.gate-grid{position:relative;z-index:2;display:grid;grid-template-columns:repeat(3,1fr);gap:10px}.gate-grid article{padding:14px;border-radius:16px;background:rgba(0,0,0,.28);box-shadow:inset 0 0 0 1px rgba(255,255,255,.13)}.gate-grid b{color:var(--aqua)}.gate-grid span{display:block;font-weight:900}.gate-grid small{color:var(--muted)}.console-status{margin-top:18px;justify-content:space-around}.section{padding:90px 0}.split{display:grid;grid-template-columns:.8fr 1.2fr;gap:46px;align-items:start}.feature-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}.glass-card,.command-strip article,.architecture-map article,.trust-ledger article,.theatre-panel,.ring-panel,.pilot-panel>div,.dossier-grid a,.seal-card{border-radius:var(--radius);background:linear-gradient(145deg,rgba(255,255,255,.09),rgba(255,255,255,.035));box-shadow:var(--shadow),inset 0 0 0 1px var(--line);padding:26px}.glass-card span,.architecture-map b,.command-strip b,.trust-ledger span{color:var(--gold);font-weight:900;letter-spacing:.15em}.glass-card b{display:block;color:#fff;margin-bottom:12px}.page-hero{padding:clamp(80px,11vw,160px) 0 70px}.page-hero.compact{padding-bottom:30px}.command-strip,.architecture-map,.trust-ledger,.dossier-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:16px}.architecture-map{grid-template-columns:repeat(3,minmax(0,1fr))}.trust-ledger{grid-template-columns:repeat(2,minmax(0,1fr))}.trust-ledger b{display:inline-block;margin-top:12px;color:var(--aqua);text-transform:uppercase;letter-spacing:.12em}.theatre-grid{display:grid;grid-template-columns:1fr 1.15fr;gap:22px}.theatre-panel pre{min-height:178px;padding:18px;border-radius:18px;background:rgba(0,0,0,.45);color:#c7ffec;line-height:1.65;overflow:auto;border:1px solid var(--line)}.ring-panel{display:grid;place-items:center;gap:22px}.readiness-ring{width:190px;height:190px;border-radius:50%;display:grid;place-items:center;text-align:center;background:conic-gradient(var(--aqua) 0 var(--score,0%),rgba(255,255,255,.1) var(--score,0%) 100%);box-shadow:0 0 70px rgba(114,255,224,.26);position:relative}.readiness-ring:after{content:"";position:absolute;inset:18px;border-radius:50%;background:#07101a}.readiness-ring b,.readiness-ring span{position:relative;z-index:2}.readiness-ring b{font-size:58px}.readiness-ring span{text-transform:uppercase;color:var(--aqua);letter-spacing:.14em;font-size:11px}.cycle-steps{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;width:100%}.cycle-steps span{padding:13px 16px;border-radius:14px;border:1px solid rgba(114,255,224,.46);background:rgba(114,255,224,.06);font-weight:800;text-transform:uppercase;font-size:12px;transition:background .35s ease,box-shadow .35s ease,transform .35s ease}.cycle-steps span.hot{background:linear-gradient(135deg,rgba(114,255,224,.18),rgba(255,229,138,.12));box-shadow:0 0 28px rgba(114,255,224,.22),inset 0 0 0 1px rgba(114,255,224,.7);transform:translateY(-1px)}.signature-chamber,.pilot-panel{display:grid;grid-template-columns:1fr 1fr;gap:22px;align-items:center}.seal-card span,.seal-card i{display:block}.seal-card span{text-transform:uppercase;color:var(--dim);letter-spacing:.16em;font-size:11px}.seal-card i{font-style:normal;color:#fff;margin:8px 0 18px}.dossier-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.dossier-grid a span{display:block;color:var(--muted);margin-top:8px}.site-footer{border-top:1px solid var(--line);padding:30px clamp(22px,4vw,64px);display:flex;align-items:center;justify-content:space-between;background:rgba(3,6,11,.9)}.site-footer b,.site-footer span{display:block}.site-footer span{color:var(--muted)}.site-footer nav{flex:0;gap:22px}.reveal{opacity:0;transform:translateY(20px);transition:opacity .8s ease,transform .8s ease}.reveal.in{opacity:1;transform:none}.delay-1{transition-delay:.12s}@keyframes dash{to{stroke-dashoffset:-220}}@media (max-width:980px){.site-header{height:auto;min-height:86px;flex-wrap:wrap;padding:18px}.brand{min-width:auto}.hero,.split,.theatre-grid,.signature-chamber,.pilot-panel{grid-template-columns:1fr}.hero{padding-top:56px}.hero-visual{max-width:620px}.stat-grid,.command-strip,.architecture-map,.trust-ledger,.dossier-grid{grid-template-columns:repeat(2,1fr)}}@media (max-width:640px){.hero,.section,.page-hero{width:min(100% - 28px,1180px)}h1{font-size:clamp(48px,16vw,76px)}h2{font-size:clamp(38px,12vw,62px)}.feature-grid,.gate-grid,.stat-grid,.command-strip,.architecture-map,.trust-ledger,.dossier-grid,.cycle-steps{grid-template-columns:1fr}.proof-console{padding:18px}.orbital-stage{height:270px}.orbital-stage i{transform:rotate(var(--a)) translate(128px) rotate(calc(-1 * var(--a)))}.site-footer{display:grid;gap:18px}}@media (prefers-reduced-motion:reduce){*,*:before,*:after{animation:none!important;transition:none!important}.reveal{opacity:1;transform:none}#neuralField{display:none}}`;

const js = String.raw`(()=>{const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];const c=$('#neuralField'),ctx=c?.getContext('2d');let w=0,h=0,dpr=1,p={x:0,y:0,active:false};function resize(){if(!c||!ctx)return;dpr=Math.min(devicePixelRatio||1,2);w=innerWidth;h=innerHeight;c.width=w*dpr;c.height=h*dpr;c.style.width=w+'px';c.style.height=h+'px';ctx.setTransform(dpr,0,0,dpr,0,0)}let pts=[];function seed(){pts=Array.from({length:Math.min(105,Math.floor(innerWidth/16))},(_,i)=>({x:Math.random()*w,y:Math.random()*h,vx:(Math.random()-.5)*.18,vy:(Math.random()-.5)*.18,r:Math.random()*1.8+0.7,hue:i%3}))}function draw(){if(!ctx)return;ctx.clearRect(0,0,w,h);ctx.globalCompositeOperation='lighter';for(const a of pts){a.x+=a.vx;a.y+=a.vy;if(a.x<0||a.x>w)a.vx*=-1;if(a.y<0||a.y>h)a.vy*=-1;const dx=a.x-p.x,dy=a.y-p.y,dd=Math.hypot(dx,dy);if(p.active&&dd<180){a.x+=dx/dd*.18;a.y+=dy/dd*.18}ctx.beginPath();ctx.fillStyle=a.hue===0?'rgba(112,255,224,.9)':a.hue===1?'rgba(139,183,255,.85)':'rgba(255,229,138,.82)';ctx.arc(a.x,a.y,a.r,0,Math.PI*2);ctx.fill()}for(let i=0;i<pts.length;i++)for(let j=i+1;j<pts.length;j++){const A=pts[i],B=pts[j],dist=Math.hypot(A.x-B.x,A.y-B.y);if(dist<125){ctx.strokeStyle='rgba(112,255,224,'+(0.13*(1-dist/125))+')';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(A.x,A.y);ctx.lineTo(B.x,B.y);ctx.stroke()}}ctx.globalCompositeOperation='source-over';requestAnimationFrame(draw)}addEventListener('resize',()=>{resize();seed()},{passive:true});addEventListener('pointermove',e=>{p={x:e.clientX,y:e.clientY,active:true}},{passive:true});addEventListener('pointerleave',()=>p.active=false,{passive:true});resize();seed();draw();const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('in')}),{threshold:.16});$$('.reveal').forEach(el=>io.observe(el));const log=$('#cycleLog');const ring=$('.readiness-ring');const ringNumber=ring?.querySelector('b');const ringLabel=ring?.querySelector('span');function setRing(score,label){if(!ring)return;ring.style.setProperty('--score',score+'%');ring.dataset.score=String(score);if(ringNumber)ringNumber.textContent=String(score);if(ringLabel)ringLabel.textContent=label}const steps=[['Mission contract committed.',12,'Commission'],['Evidence planes mapped.',31,'Evidence mapped'],['Criteria connected to submitted artifacts.',49,'Mapping'],['Reviewer judgment preserved.',67,'Review'],['Acceptance boundary checked.',84,'Authorization'],['Receipt digest sealed.',96,'Receipt sealed'],['Terminal disposition: ready for authorized signoff.',100,'Ready']];$('[data-launch-cycle]')?.addEventListener('click',()=>{let i=0;if(log)log.textContent='';setRing(0,'Starting cycle');$$('.cycle-steps span').forEach(s=>s.classList.remove('hot'));const tick=()=>{const [message,score,label]=steps[i];if(log)log.textContent+='· '+message+'\n';setRing(score,label);$$('.cycle-steps span')[Math.min(i,$$('.cycle-steps span').length-1)]?.classList.add('hot');i++;if(i<steps.length)setTimeout(tick,320)};setTimeout(tick,160)});$('[data-reset-cycle]')?.addEventListener('click',()=>{if(log)log.textContent='System ready. Awaiting bounded mission.';setRing(0,'Awaiting mission');$$('.cycle-steps span').forEach(s=>s.classList.remove('hot'))});$('[data-help]')?.addEventListener('click',()=>alert('Command surface: G launches the proof theatre, R resets theatre state, H opens this help.'));addEventListener('keydown',e=>{if(e.key.toLowerCase()==='g')$('[data-launch-cycle]')?.click();if(e.key.toLowerCase()==='r')$('[data-reset-cycle]')?.click();if(e.key.toLowerCase()==='h')$('[data-help]')?.click()})})();`;

clean();
write('assets/asi-apex-v6.css', css);
write('assets/asi-apex-v6.js', js);
for (const [file, html] of pages) write(file, html);
write('robots.txt', `User-agent: *\nAllow: /\nSitemap: ${baseUrl}sitemap.xml\n`);
write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${[...pages.keys()].filter(p=>p!=='404.html').map(p=>`\n  <url><loc>${baseUrl}${p}</loc></url>`).join('')}\n</urlset>\n`);

const files = [];
function walk(dir) { for (const entry of fs.readdirSync(dir, { withFileTypes: true })) { const p = path.join(dir, entry.name); if (entry.isDirectory()) walk(p); else files.push(path.relative(out, p).replaceAll(path.sep, '/')); } }
walk(out);
const hashes = Object.fromEntries(files.map(f => [f, sha256(fs.readFileSync(path.join(out, f)))]));
const manifest = {
  product: 'GoalOS Signoff Pro',
  site: 'ASI Apex v6.1 Final Production',
  version,
  repository: process.env.GITHUB_REPOSITORY || 'MontrealAI/goalos-signoff-pro',
  commit: process.env.GITHUB_SHA || 'LOCAL_BUILD',
  runId: process.env.GITHUB_RUN_ID || 'LOCAL_BUILD',
  generatedAt: new Date().toISOString(),
  url: baseUrl,
  artifactPolicy: 'Curated static public site only; no app secrets, customer workspace data, or private runtime configuration are published.',
  routes: [...pages.keys()].filter(p => p !== '404.html'),
  hashes,
  siteHash: sha256(JSON.stringify(hashes, null, 2))
};
write('production-manifest.json', JSON.stringify(manifest, null, 2) + '\n');
write('apex-manifest.txt', `GoalOS Signoff Pro — ASI Apex v6.1 Final Production\n${baseUrl}\nSite hash: ${manifest.siteHash}\n`);

const forbiddenFiles = [/\.env/i, /node_modules/i, /\.git/i, /\.next/i, /private/i];
const forbiddenText = [/BEGIN [A-Z ]*PRIVATE KEY/i, /MNEMONIC/i, /SEED_PHRASE/i, /SERVICE_ROLE/i, /SUPABASE_SERVICE/i, /STRIPE_SECRET/i, /sk_live_/i, /WALLET_PRIVATE/i, /AGIALPHA_TREASURY_KEY/i];
const after = [];
walk(out);
for (const f of files) {
  if (forbiddenFiles.some(rx => rx.test(f))) throw new Error(`Forbidden file in site artifact: ${f}`);
  const text = fs.readFileSync(path.join(out, f), 'utf8');
  for (const rx of forbiddenText) if (rx.test(text)) throw new Error(`Secret-like text found in ${f}: ${rx}`);
}
console.log(`GoalOS Signoff Pro ASI Apex v6.1 generated ${files.length} files at ${out}`);
console.log(`Site hash ${manifest.siteHash}`);
