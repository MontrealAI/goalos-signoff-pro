#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const ROOT = process.cwd();
const SITE = path.join(ROOT, 'site');
const ASSETS = path.join(SITE, 'assets');
const CONFIG = path.join(ROOT, 'config', 'agialpha-mainnet-contracts-v47.json');
fs.mkdirSync(SITE, { recursive: true });
fs.mkdirSync(ASSETS, { recursive: true });
fs.mkdirSync(path.join(SITE, 'contracts'), { recursive: true });

const read = p => fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : '';
const write = (rel, text) => { const p = path.join(SITE, rel); fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, text); };
const esc = s => String(s ?? '').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const slug = s => String(s).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'') || 'page';
const hash = s => crypto.createHash('sha256').update(s).digest('hex');

const oldIndex = path.join(SITE, 'index.html');
if (fs.existsSync(oldIndex)) {
  const current = read(oldIndex);
  const classic = path.join(SITE, 'classic-home-before-v47.html');
  if (!fs.existsSync(classic) && !current.includes('data-goalos-v47-frontdoor')) fs.writeFileSync(classic, current);
}

let contractConfig = { releaseFacts: {}, contracts: [] };
if (fs.existsSync(CONFIG)) contractConfig = JSON.parse(read(CONFIG));
const contracts = Array.isArray(contractConfig.contracts) ? contractConfig.contracts : [];
const families = [...new Set(contracts.map(c => c.family || 'Protocol rail'))];

const useCases = [
  {
    id:'ai-report-signoff', title:'AI research report signoff', audience:'AI consultant, agency, client reviewer',
    type:'I delivered an AI research report to a client and need proof it is ready to accept.',
    goal:'Turn a report into an acceptance-ready Mission Receipt.', tier:'Signoff Basic or Verified', route:'ai-research-strategy-signoff-console.html',
    produces:['brief and success criteria','claim-to-source matrix','freshness and missing-source checks','reviewer decision path','signed Mission Receipt'],
    steps:['Paste the outcome you need accepted.','GoalOS defines done and lists the evidence required.','Reviewer accepts, requests changes, or rejects.','Receipt preserves what was delivered and what remains limited.']
  },
  {
    id:'client-deliverable', title:'Client deliverable acceptance', audience:'Freelancer, consultant, enterprise buyer',
    type:'A client needs to approve an AI-assisted automation project before final payment.',
    goal:'Make acceptance explicit before reputation or payment changes.', tier:'Signoff Basic', route:'signoff-product-core.html',
    produces:['acceptance criteria','artifact checklist','change-request path','acceptance receipt','unresolved-risk ledger'],
    steps:['Describe the deliverable and what counts as done.','GoalOS maps work to acceptance gates.','Client reviews with a simple status.','Receipt becomes the shared record.']
  },
  {
    id:'dao-grant', title:'DAO grant milestone release', audience:'DAO delegate, treasury council, grantee',
    type:'Release a DAO grant milestone only if the proof package passes review.',
    goal:'Move from status update to proof-gated milestone readiness.', tier:'Signoff Verified or Secured', route:'blockchain-proof-mandate-lab.html',
    produces:['milestone proof package','review checklist','challenge window concept','contract rail map','settlement readiness memo'],
    steps:['State the grant milestone.','GoalOS identifies proof objects and reviewer authority.','DAO sees what passed, failed, or remains uncertain.','Funding decision is tied to evidence, not announcements.']
  },
  {
    id:'audit-remediation', title:'Audit remediation proof', audience:'Protocol team, auditor, security reviewer',
    type:'We fixed audit findings and need a replayable signoff package before release.',
    goal:'Prove each fix is mapped to evidence and residual risk.', tier:'Signoff Secured', route:'proof-before-settlement-research-lab.html',
    produces:['finding-to-fix matrix','test and replay checklist','risk ledger','review signoff','release gate recommendation'],
    steps:['Describe the findings and target release.','GoalOS maps every claim to proof.','Reviewer checks tests, replay, and rollback.','Release is marked ready only when gates pass.']
  },
  {
    id:'protocol-upgrade', title:'Protocol upgrade readiness', audience:'Protocol founder, governance council, validator',
    type:'Prepare a protocol upgrade for governance with proof, rollback, and reviewer authority.',
    goal:'Turn an upgrade proposal into a governed decision package.', tier:'Signoff Secured', route:'action-graph-authority-lab.html',
    produces:['scoped action graph','rollback plan','risk boundary','authority map','decision receipt'],
    steps:['Explain the proposed upgrade.','GoalOS identifies required evidence and stop conditions.','Reviewers inspect action, authority, and rollback.','Governance receives a clean decision object.']
  },
  {
    id:'enterprise-ai', title:'Enterprise AI workflow acceptance', audience:'Enterprise buyer, AI delivery lead, compliance team',
    type:'An internal AI automation is ready for business acceptance, but compliance needs evidence.',
    goal:'Make AI work safe to accept inside an organization.', tier:'Signoff Basic or Verified', route:'executive-ai-proof-console.html',
    produces:['business criteria','evidence checklist','risk disclosure','human authority path','audit-friendly receipt'],
    steps:['Describe the workflow and prohibited claims.','GoalOS builds a review checklist.','Business owner decides accept or changes needed.','Receipt records scope and limits.']
  },
  {
    id:'mainnet-rails', title:'Understand the 48 Mainnet contracts', audience:'Investor, auditor, protocol operator, technical reviewer',
    type:'Show me which 48 Ethereum Mainnet contracts support Signoff Verified and Signoff & Settle.',
    goal:'Make the protocol rails legible without forcing users into wallet operations.', tier:'Verified / Secured / Settle', route:'agialpha-48-contract-atlas.html',
    produces:['contract family map','tier-to-contract map','Etherscan links','public-safe boundary','next Signoff tier explanation'],
    steps:['Ask for a contract family, tier, or stage.','GoalOS filters the rail map.','User opens the atlas or individual contract page.','Boundary stays read-only and educational.']
  },
  {
    id:'move37', title:'Move-37 / RSI breakthrough governance', audience:'Frontier lab, safety lead, Architect / Validator Council',
    type:'Govern a Move-37 breakthrough candidate with replay, stress tests, and a dossier.',
    goal:'Treat a breakthrough as an audited state transition, not a narrative.', tier:'RSI governance', route:'loop-rsi-asi-superintelligence-mission-simulator-lab.html',
    produces:['target-emission-eval path','reproduction package','policy-shock tests','persistence gate','dossier and council route'],
    steps:['Describe the candidate and risk boundary.','GoalOS routes through deterministic RSI gates.','Candidate is reproduced, stress tested, and packaged.','Council receives a dossier rather than hype.']
  },
  {
    id:'reviewer-market', title:'Independent reviewer package', audience:'Reviewer, grant evaluator, audit council',
    type:'I need an independent reviewer to decide whether the work deserves acceptance.',
    goal:'Separate output from acceptance authority.', tier:'Signoff Verified or Secured', route:'independent-replay-lab.html',
    produces:['reviewer checklist','evidence map','replay requirement','decision options','credential-ready receipt'],
    steps:['Explain the work and reviewer role.','GoalOS lists what the reviewer must inspect.','Reviewer outcome is recorded.','Receipt states accepted, changes needed, or rejected.']
  },
  {
    id:'treasury-payment', title:'Treasury payment readiness', audience:'Treasury council, foundation, payer, grantee',
    type:'Prepare payment release only after accepted proof and review.',
    goal:'Keep payment separate from acceptance until evidence passes.', tier:'Signoff & Settle later', route:'proof-to-settlement-standard-lab.html',
    produces:['payment-readiness checklist','proof-to-payment rail map','dispute path','challenge boundary','settlement memo'],
    steps:['State what value should move and why.','GoalOS first produces proof-to-acceptance.','Protocol rails are shown as optional later activation.','Payment readiness depends on proof, not persuasion.']
  }
];

const publicBoundary = 'Public-safe demo. Local command text is processed in the browser by default. No uploads. No cookies. No analytics. No wallets. No payments. No external AI call by default. No personal or confidential data required. Zero value moved.';
const legalRail = `<aside class="legal-rail" data-goalos-legal-rail="v12"><strong>Public site boundary</strong><br>${publicBoundary} Optional live AI mode would require a separate server endpoint, explicit authorization, rate limits, route allowlists, and secret management.</aside>`;
const footer = `<footer><strong>GoalOS Signoff Pro</strong><br>Proof-to-acceptance public site · complete command experience v47 · Mission 001 preserved · all existing pages remain navigable.<br>${publicBoundary}</footer>`;

function page(title, body, extraHead='') {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)} · GoalOS Signoff Pro</title>
<meta name="description" content="GoalOS Signoff Pro v47 universal command experience: tell GoalOS what you want and receive the mission, proof plan, evidence checklist, reviewer path, contract rails, recommended page, and receipt.">
<link rel="stylesheet" href="assets/goalos-v47-command.css">
${extraHead}
</head>
<body data-goalos-v47="true">
${body}
${legalRail}
${footer}
<script src="assets/goalos-v47-command.js"></script>
</body>
</html>`;
}

function topNav() {
  return `<header class="topbar"><a class="brand" href="index.html"><span class="orb"></span><span><strong>GoalOS Signoff Pro</strong><small>Universal Command OS v47</small></span></a><nav><a href="goalos-universal-command-center.html">Command</a><a href="use-cases.html">Use cases</a><a href="ask-goalos.html">Ask</a><a href="all-pages.html">All pages</a><a href="agialpha-48-contract-atlas.html">48 contracts</a><a href="browser-beta.html">Browser beta</a></nav></header>`;
}

function commandHero() {
  const chips = useCases.slice(0,6).map(u=>`<button class="chip" data-fill-command="${esc(u.type)}">${esc(u.title)}</button>`).join('');
  const useCards = useCases.map((u,i)=>`<article class="use-card" id="use-${esc(u.id)}"><div class="eyebrow">Solved use case ${String(i+1).padStart(2,'0')}</div><h3>${esc(u.title)}</h3><p>${esc(u.goal)}</p><div class="meta"><span>${esc(u.audience)}</span><span>${esc(u.tier)}</span></div><div class="mini"><strong>Type:</strong> ${esc(u.type)}</div><div class="mini"><strong>GoalOS takes care of:</strong> ${u.produces.map(esc).join(' · ')}</div><ol>${u.steps.map(s=>`<li>${esc(s)}</li>`).join('')}</ol><p><a class="btn secondary" href="${esc(u.route)}">Open recommended path</a> <button class="btn ghost" data-fill-command="${esc(u.type)}">Try this</button></p></article>`).join('');
  return `${topNav()}
<main class="shell command-shell" data-goalos-v47-frontdoor>
<section class="hero command-first">
  <div class="hero-copy">
    <p class="eyebrow">Front-and-center command experience · v47</p>
    <h1>Tell GoalOS what you want.</h1>
    <p class="lead">Describe the outcome in normal language. GoalOS turns it into a mission, acceptance criteria, evidence checklist, reviewer path, 48-contract rail map, recommended page, and synthetic Mission Receipt.</p>
    <div class="hero-actions"><a class="btn primary" href="#command">Start with one box</a><a class="btn secondary" href="use-cases.html">See solved use cases</a><a class="btn secondary" href="classic-home-before-v47.html">Classic Signoff page</a></div>
  </div>
  <aside class="coach-card"><p class="eyebrow">How to use it</p><ol><li>Type what you want accepted, reviewed, paid, governed, or explained.</li><li>Press Run GoalOS.</li><li>Open the recommended page or copy the generated mission plan.</li></ol><p class="safe">Local by default. No upload. No wallet. No payment. No external AI call.</p></aside>
</section>

<section class="command-grid" id="command">
  <article class="panel command-panel">
    <p class="eyebrow">One box</p>
    <h2>What should GoalOS take care of?</h2>
    <div class="command-box" role="textbox" aria-label="Describe what you want GoalOS to take care of" contenteditable="true" spellcheck="true" data-command-box>I delivered an AI research report to a client and need proof it is ready to accept.</div>
    <div class="chips">${chips}</div>
    <div class="command-actions"><button class="btn primary" data-run-command>Run GoalOS</button><button class="btn secondary" data-clear-command>Clear</button><button class="btn ghost" data-copy-standard>Copy public standard</button></div>
  </article>
  <article class="panel result-panel" aria-live="polite" data-command-result>
    <p class="eyebrow">GoalOS plan</p>
    <h2>Ready to compile your mission.</h2>
    <p>Run the command box to generate the proof path, acceptance plan, recommended page, and synthetic receipt.</p>
  </article>
</section>

<section class="section"><div class="section-head"><p class="eyebrow">Solved, end-to-end use cases</p><h2>Start here if you are not technical.</h2><p>Every card gives a plain-language request, the proof path GoalOS generates, and the page to open next.</p></div><div class="use-grid">${useCards}</div></section>

<section class="section split"><article class="panel"><p class="eyebrow">Chat window</p><h2>Ask a question. Go to the right place.</h2><p>The floating Ask GoalOS panel is available across pages. It answers locally using the site map and routes visitors to the right product console, proof lab, Mission 001 artifact, contract rail, or RSI/ASI governance page.</p><p><a class="btn primary" href="ask-goalos.html">Open Ask GoalOS</a></p></article><article class="panel"><p class="eyebrow">Protocol underneath</p><h2>48 Mainnet contracts, made legible.</h2><p>The user does not need to understand every contract first. GoalOS maps each request to the relevant tier: Basic, Verified, Secured, or Settle-ready.</p><p><a class="btn secondary" href="agialpha-48-contract-atlas.html">Explore 48-contract atlas</a></p></article></section><section class="section split"><article class="panel"><p class="eyebrow">Benchmark-ready proof</p><h2>Mission 001 stays visible.</h2><p>Mission 001 preserves the benchmark-ready packet: mission contract, environment, B0-B6 baselines, runner config, proof bundle, replay log, ledgers, validator report, scoreboard, and claims matrix.</p><p><a class="btn primary" href="mission-001.html">Open Mission 001</a><a class="btn secondary" href="mission-001/00_manifest.json">Open manifest</a></p></article><article class="panel"><p class="eyebrow">All pages preserved</p><h2>Nothing disappears.</h2><p>The command center adds a new front door and route catalog while keeping existing pages, labs, receipts, contract pages, and Mission 001 artifacts navigable.</p><p><a class="btn secondary" href="all-pages.html">Browse all pages</a></p></article></section>
</main>`;
}

function atlasPage() {
  const byFamily = families.map(f=>`<section class="family"><h3>${esc(f)}</h3><div class="contract-grid">${contracts.filter(c=>c.family===f).map(c=>`<article class="contract-card"><p class="eyebrow">${esc(c.primaryTier || 'Rail')}</p><h4>${esc(c.name)}</h4><p>${esc(c.description || c.role || 'Protocol rail.')}</p><p class="mono">${esc(c.address)}</p><p><a class="btn ghost" href="contracts/${esc(c.slug)}.html">Plain-English page</a> <a class="btn secondary" href="${esc(c.etherscanUrl)}">Etherscan</a></p></article>`).join('')}</div></section>`).join('');
  return page('AGIALPHA 48-Contract Atlas', `${topNav()}<main class="shell"><section class="hero"><div><p class="eyebrow">AGIALPHA protocol rails · read-only public atlas</p><h1>Make the 48 Mainnet contracts legible.</h1><p class="lead">Explore each GoalOS-created Ethereum Mainnet contract by family, Signoff tier, and proof-to-payment stage. This is educational and read-only: no wallet, no token approval, no transaction, no value moved.</p><p><a class="btn primary" href="goalos-universal-command-center.html">Ask GoalOS which rails matter</a><a class="btn secondary" href="contracts/index.html">Open contract index</a></p></div><aside class="stats"><div><b>${contracts.length}</b><span>GoalOS-created contracts</span></div><div><b>1</b><span>Ethereum Mainnet</span></div><div><b>48/48</b><span>source verification per release record</span></div></aside></section>${byFamily}</main>`);
}

function contractPage(c) {
  return page(c.name, `${topNav()}<main class="shell"><section class="hero"><div><p class="eyebrow">${esc(c.family)} · ${esc(c.primaryTier || 'Rail')}</p><h1>${esc(c.name)}</h1><p class="lead">${esc(c.description || c.role || 'GoalOS protocol rail.')}</p><p><a class="btn primary" href="${esc(c.etherscanUrl)}">Open Etherscan</a><a class="btn secondary" href="../agialpha-48-contract-atlas.html">Back to atlas</a></p></div><aside class="panel"><h2>Contract facts</h2><p><strong>Address</strong></p><p class="mono">${esc(c.address)}</p><p><strong>Tier</strong><br>${esc((c.productTiers || [c.primaryTier || 'Rail']).join(', '))}</p><p><strong>Boundary</strong><br>${esc(c.productionBoundary || 'Read-only public atlas. No production activation claim.')}</p></aside></section><section class="section"><h2>Where this fits</h2><div class="steps"><div><b>1</b><span>Mission / proof object</span></div><div><b>2</b><span>${esc((c.flowStages || ['Protocol rail']).join(' · '))}</span></div><div><b>3</b><span>Public reference and audit path</span></div></div></section></main>`);
}

function allPagesPage() {
  const htmls = fs.readdirSync(SITE, { recursive: true }).filter(f => f.endsWith('.html')).map(f=>String(f).replaceAll('\\','/')).sort();
  const cards = htmls.map(f=>`<article class="route-card"><h3>${esc(f.replace(/\.html$/,''))}</h3><p>${esc(routeDescription(f))}</p><a class="btn ghost" href="${esc(f)}">Open page</a></article>`).join('');
  return page('All pages', `${topNav()}<main class="shell"><section class="hero"><div><p class="eyebrow">Complete site index</p><h1>Every page remains accessible.</h1><p class="lead">Use this catalog when you want to inspect all public pages, labs, contracts, receipts, dockets, and command centers.</p><p><a class="btn primary" href="goalos-universal-command-center.html">Use command center</a></p></div><aside class="stats"><div><b>${htmls.length}</b><span>HTML pages indexed</span></div><div><b>${contracts.length}</b><span>contract rails</span></div></aside></section><section class="route-grid">${cards}</section></main>`);
}
function routeDescription(f){
  if(f.includes('contract')) return 'Contract or protocol rail page.';
  if(f.includes('mission-001')) return 'Mission 001 reproducibility artifact.';
  if(f.includes('rsi')||f.includes('asi')) return 'RSI / ASI governance or simulator page.';
  if(f.includes('proof')||f.includes('lab')) return 'Public proof lab or evidence demo.';
  if(f.includes('signoff')) return 'GoalOS Signoff product or acceptance page.';
  return 'GoalOS public website page.';
}

function useCasesPage(){
  const rows = useCases.map((u,i)=>`<article class="playbook"><p class="eyebrow">Use case ${i+1}</p><h2>${esc(u.title)}</h2><p>${esc(u.goal)}</p><div class="mini"><strong>What to type:</strong> ${esc(u.type)}</div><div class="two"><div><h3>GoalOS produces</h3><ul>${u.produces.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div><div><h3>End-to-end path</h3><ol>${u.steps.map(x=>`<li>${esc(x)}</li>`).join('')}</ol></div></div><p><button class="btn primary" data-fill-command="${esc(u.type)}">Try in command box</button><a class="btn secondary" href="${esc(u.route)}">Open next page</a></p></article>`).join('');
  return page('Solved use cases', `${topNav()}<main class="shell"><section class="hero"><div><p class="eyebrow">Non-technical playbooks</p><h1>What can I actually do with GoalOS?</h1><p class="lead">Start with a real outcome. GoalOS compiles it into mission, evidence, review, receipt, and route.</p></div></section><section class="playbook-list">${rows}</section></main>`);
}

function askPage(){return page('Ask GoalOS', `${topNav()}<main class="shell"><section class="hero"><div><p class="eyebrow">Live local site concierge</p><h1>Ask a question. Go to the right place.</h1><p class="lead">Ask about Signoff, Mission 001, evidence dockets, proof labs, the 48 Mainnet contracts, or RSI/ASI governance. The answer runs locally by default and routes you to the best same-site page.</p></div></section><section class="command-grid"><article class="panel command-panel"><p class="eyebrow">Question</p><h2>What do you need?</h2><div class="command-box" role="textbox" aria-label="Ask GoalOS a website question" contenteditable="true" data-command-box>Where should I start if I am new?</div><div class="command-actions"><button class="btn primary" data-run-command>Ask GoalOS</button><button class="btn secondary" data-clear-command>Clear</button></div></article><article class="panel result-panel" data-command-result><p class="eyebrow">Answer</p><h2>Ask a question to get routed.</h2><p>GoalOS will recommend the right page and explain why.</p></article></section></main>`)};

const css = `:root{--bg:#050913;--panel:#111727cc;--panel2:#172234cc;--line:#314158;--text:#fff7e8;--muted:#c5d1e6;--aqua:#65f7e8;--green:#a2ff9b;--gold:#ffe979;--pink:#ff77ca;--purple:#8b5cf6}*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:radial-gradient(circle at 20% 0%,#32146a 0,#0a1720 42%,#030611 100%);color:var(--text);font-family:Inter,ui-sans-serif,system-ui,-apple-system,Segoe UI,Arial,sans-serif;line-height:1.45}body:before{content:"";position:fixed;inset:0;background:linear-gradient(rgba(255,255,255,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.035) 1px,transparent 1px);background-size:64px 64px;pointer-events:none;mask-image:linear-gradient(#000,transparent 90%)}a{color:inherit}.topbar{position:sticky;top:0;z-index:20;display:flex;align-items:center;justify-content:space-between;gap:18px;padding:18px clamp(18px,5vw,72px);background:rgba(3,6,17,.78);backdrop-filter:blur(18px);border-bottom:1px solid rgba(255,255,255,.1)}.brand{display:flex;align-items:center;gap:12px;text-decoration:none}.brand small{display:block;color:var(--muted);letter-spacing:.22em;text-transform:uppercase;font-size:10px}.orb{width:32px;height:32px;border-radius:11px;background:radial-gradient(circle at 35% 30%,#a6ffda,#4ef7ff 35%,#274cff 65%,#070817);box-shadow:0 0 30px #4ef7ff}.topbar nav{display:flex;gap:8px;flex-wrap:wrap}.topbar nav a,.btn,.chip{border:1px solid rgba(255,255,255,.18);border-radius:999px;background:rgba(255,255,255,.1);color:var(--text);text-decoration:none;padding:10px 14px;font-weight:800;display:inline-flex;align-items:center;gap:8px;cursor:pointer}.btn.primary,.chip:hover{background:linear-gradient(90deg,var(--green),var(--aqua));color:#061014;border:0}.btn.secondary{background:rgba(255,255,255,.13)}.btn.ghost{background:rgba(255,255,255,.06)}.shell{max-width:1180px;margin:0 auto;padding:clamp(24px,5vw,80px) 22px}.hero{display:grid;grid-template-columns:minmax(0,1.6fr) minmax(300px,.9fr);gap:22px;align-items:stretch;margin-bottom:28px}.hero>div,.coach-card,.panel,.use-card,.contract-card,.route-card,.playbook,.family{border:1px solid rgba(255,255,255,.16);border-radius:28px;background:linear-gradient(135deg,rgba(255,255,255,.11),rgba(255,255,255,.035));box-shadow:0 30px 90px rgba(0,0,0,.28);padding:clamp(24px,4vw,44px)}.hero h1{font-size:clamp(48px,8vw,112px);line-height:.86;margin:10px 0 20px;letter-spacing:-.07em}.lead{font-size:clamp(17px,2vw,23px);max-width:780px;color:#f3f6ff}.eyebrow{letter-spacing:.34em;text-transform:uppercase;color:var(--aqua);font-size:12px;font-weight:900}.safe,.mono{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace}.command-grid{display:grid;grid-template-columns:minmax(320px,.85fr) minmax(360px,1.15fr);gap:22px;margin:28px 0}.command-box{min-height:210px;border:1px solid rgba(101,247,232,.45);border-radius:24px;background:rgba(0,0,0,.42);padding:22px;font:700 18px/1.5 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;color:#fff;outline:none;white-space:pre-wrap;box-shadow:inset 0 0 0 1px rgba(255,255,255,.04)}.command-box:focus{box-shadow:0 0 0 4px rgba(101,247,232,.18),inset 0 0 0 1px rgba(255,255,255,.06)}.chips,.command-actions,.hero-actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:16px}.result-panel h2{font-size:clamp(28px,4vw,56px);line-height:.95;margin:.1em 0}.metric-grid,.stats,.steps{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin:18px 0}.stats{grid-template-columns:1fr}.metric,.stats div,.steps div,.mini,.meta span{border:1px solid rgba(255,255,255,.16);border-radius:18px;background:rgba(255,255,255,.07);padding:14px}.metric b,.stats b{display:block;color:var(--gold);font-size:30px}.section{margin:42px 0}.section h2{font-size:clamp(34px,5vw,72px);letter-spacing:-.06em;line-height:.9}.use-grid,.contract-grid,.route-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}.use-card h3,.contract-card h4,.route-card h3{font-size:24px;margin:6px 0}.meta{display:flex;gap:8px;flex-wrap:wrap}.playbook-list{display:grid;gap:20px}.two{display:grid;grid-template-columns:1fr 1fr;gap:18px}.family{margin:24px 0}.floating-ask{position:fixed;right:18px;bottom:18px;z-index:40;display:flex;gap:8px;align-items:flex-end}.ask-card{display:none;width:min(430px,calc(100vw - 36px));max-height:72vh;overflow:auto;border:1px solid rgba(101,247,232,.4);border-radius:24px;background:#07111e;padding:18px;box-shadow:0 30px 90px #000}.ask-card.open{display:block}.ask-card .command-box{min-height:120px;font-size:14px}.legal-rail{max-width:1180px;margin:24px auto;padding:16px 22px;border:1px solid rgba(162,255,155,.35);background:rgba(7,60,42,.55);border-radius:18px;color:#eaffed}footer{border-top:1px solid rgba(255,255,255,.13);padding:30px clamp(18px,5vw,72px);color:var(--muted);background:rgba(3,6,17,.65)}@media(max-width:900px){.hero,.command-grid,.two{grid-template-columns:1fr}.use-grid,.contract-grid,.route-grid,.metric-grid{grid-template-columns:1fr}.topbar{align-items:flex-start;flex-direction:column}.hero h1{font-size:58px}}`;
const js = `(()=>{const useCases=${JSON.stringify(useCases)};const contracts=${JSON.stringify(contracts.slice(0,48))};const $=(s,r=document)=>r.querySelector(s);const $$=(s,r=document)=>[...r.querySelectorAll(s)];function text(el){return (el?.innerText||'').trim()}function score(q,u){const hay=(u.title+' '+u.audience+' '+u.type+' '+u.goal+' '+u.tier+' '+u.produces.join(' ')).toLowerCase();return q.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean).reduce((n,w)=>n+(hay.includes(w)?1:0),0)}function pick(q){let best=useCases[0],bestScore=-1;for(const u of useCases){let s=score(q,u);if(/contract|mainnet|rail|agialpha|48/.test(q.toLowerCase())&&u.id==='mainnet-rails')s+=10;if(/dao|grant|milestone|treasury/.test(q.toLowerCase())&&u.id==='dao-grant')s+=8;if(/audit|finding|security|fix/.test(q.toLowerCase())&&u.id==='audit-remediation')s+=8;if(/move|rsi|asi|breakthrough|dossier/.test(q.toLowerCase())&&u.id==='move37')s+=10;if(/report|research|strategy|source|citation/.test(q.toLowerCase())&&u.id==='ai-report-signoff')s+=8;if(s>bestScore){best=u;bestScore=s}}return {u:best,confidence:Math.min(96,62+bestScore*5)}}function railCount(u){if(u.id==='mainnet-rails')return 48;if(/Settle/.test(u.tier))return 9;if(/Secured/.test(u.tier))return 8;if(/Verified/.test(u.tier))return 6;return 0}function receipt(u,conf,q){return {mission_id:'GOALOS-V47-'+new Date().toISOString().slice(0,10).replaceAll('-',''),decision_state:'SIGNOFF_READY',local_demo:true,request:q,playbook:u.id,recommended_tier:u.tier,recommended_route:u.route,confidence:conf,zero_value_moved:true,external_ai_call:false,proof_objects:u.produces}}function render(q,target){const {u,confidence}=pick(q||'start');const r=receipt(u,confidence,q);const html='<p class="eyebrow">Compiled mission plan</p><h2>'+u.title+'</h2><p>'+u.goal+'</p><div class="metric-grid"><div class="metric"><b>'+confidence+'%</b><span>route confidence</span></div><div class="metric"><b>'+u.tier.split(' ')[0]+'</b><span>recommended tier</span></div><div class="metric"><b>'+u.produces.length+'</b><span>proof objects</span></div><div class="metric"><b>'+railCount(u)+'</b><span>protocol rails</span></div></div><h3>GoalOS will take care of</h3><ol>'+u.steps.map(x=>'<li>'+x+'</li>').join('')+'</ol><h3>Evidence checklist</h3><ul>'+u.produces.map(x=>'<li>'+x+'</li>').join('')+'</ul><p class="mini"><strong>Recommended page:</strong> <a href="'+u.route+'">'+u.route+'</a></p><pre class="mini safe">'+JSON.stringify(r,null,2)+'</pre><p><a class="btn primary" href="'+u.route+'">Open recommended page</a> <button class="btn secondary" data-copy-json>Copy receipt JSON</button> <button class="btn ghost" data-download-plan>Download plan</button></p>';target.innerHTML=html;target.dataset.receipt=JSON.stringify(r,null,2)}function run(){const box=$('[data-command-box]');const out=$('[data-command-result]');if(box&&out)render(text(box),out)}document.addEventListener('click',e=>{const fill=e.target.closest('[data-fill-command]');if(fill){const box=$('[data-command-box]');if(box){box.innerText=fill.dataset.fillCommand;box.focus();run()}}if(e.target.closest('[data-run-command]'))run();if(e.target.closest('[data-clear-command]')){const box=$('[data-command-box]');if(box){box.innerText='';box.focus()}}if(e.target.closest('[data-copy-standard]'))navigator.clipboard?.writeText('Know when AI work is actually done. Define done, prove the work, obtain review, issue a Mission Receipt.');if(e.target.closest('[data-copy-json]')){const out=$('[data-command-result]');navigator.clipboard?.writeText(out?.dataset.receipt||'{}')}if(e.target.closest('[data-download-plan]')){const out=$('[data-command-result]');const blob=new Blob([out?.dataset.receipt||'{}'],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='goalos-mission-plan.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1200)}if(e.target.closest('[data-toggle-ask]'))$('.ask-card')?.classList.toggle('open')});function installFloating(){if($('.floating-ask'))return;const wrap=document.createElement('div');wrap.className='floating-ask';wrap.innerHTML='<div class="ask-card"><p class="eyebrow">Ask GoalOS</p><h3>Ask a question. Go to the right place.</h3><div class="command-box" role="textbox" contenteditable="true" data-command-box>Where should I start?</div><p><button class="btn primary" data-run-command>Ask</button><a class="btn secondary" href="all-pages.html">All pages</a></p><div data-command-result><p>Ask a question to get a route.</p></div></div><button class="btn primary" data-toggle-ask>Tell GoalOS</button>';document.body.appendChild(wrap)}document.addEventListener('DOMContentLoaded',()=>{installFloating();if($('[data-command-result]')&&$('[data-command-box]'))run()})})();`;

fs.writeFileSync(path.join(ASSETS,'goalos-v47-command.css'), css);
fs.writeFileSync(path.join(ASSETS,'goalos-v47-command.js'), js);
// Keep legacy concierge assets scanner-safe if present or expected.
fs.writeFileSync(path.join(ASSETS,'goalos-v39-navigator.js'), js);
fs.writeFileSync(path.join(ASSETS,'goalos-v40-concierge.js'), js);
fs.writeFileSync(path.join(ASSETS,'goalos-v46-safe-concierge.js'), js);

write('index.html', page('Tell GoalOS what you want', commandHero()));
const command = page('Universal Command Center', commandHero());
const aliases = ['goalos-universal-command-center.html','goalos-v22-v47-command-center.html','goalos-command-center.html','goalos-command.html','goalos-command-os.html','goalos-universal-command-os.html','goalos-front-center-command.html','goalos-take-care.html','goalos-take-care-of-everything.html','tell-goalos.html','one-box-command.html','mission-autopilot.html','mission-compiler.html','intent-to-mission.html','intent-to-outcome.html','v47.html'];
for (const a of aliases) write(a, command);
write('ask-goalos.html', askPage());
write('chat.html', askPage());
write('site-navigator.html', askPage());
write('help.html', askPage());
write('use-cases.html', useCasesPage());
write('solved-use-cases.html', useCasesPage());
write('agialpha-48-contract-atlas.html', atlasPage());
write('contract-atlas.html', atlasPage());
write('48-contracts.html', atlasPage());
write('contracts/index.html', atlasPage());
for (const c of contracts) write(`contracts/${c.slug}.html`, contractPage(c));
write('all-pages.html', allPagesPage());
write('site-map.html', allPagesPage());
write('sitemap.html', allPagesPage());
write('routes.html', allPagesPage());
write('labs-index.html', allPagesPage());

const routeCatalog = fs.readdirSync(SITE,{recursive:true}).filter(f=>String(f).endsWith('.html')).map(f=>String(f).replaceAll('\\','/')).sort().map(f=>({route:f,title:f.replace(/\.html$/,''),description:routeDescription(f)}));
write('goalos-v47-route-catalog.json', JSON.stringify({version:'v47',generatedAt:new Date().toISOString(),htmlPages:routeCatalog.length,routes:routeCatalog},null,2));
write('goalos-v47-use-cases.json', JSON.stringify({version:'v47',useCases},null,2));
write('goalos-v47-command-manifest.json', JSON.stringify({version:'v47',mission:'Front-and-center GoalOS command experience',htmlPages:routeCatalog.length,contractsIndexed:contracts.length,publicSafe:true,blockedNativeControls:false,receiptHash:hash(JSON.stringify(useCases)+contracts.length)},null,2));

// Install a lightweight global launcher on existing HTML pages unless they already use v47.
const htmlFiles = fs.readdirSync(SITE,{recursive:true}).filter(f=>String(f).endsWith('.html')).map(f=>String(f).replaceAll('\\','/'));
for (const rel of htmlFiles) {
  const p = path.join(SITE, rel); let txt = read(p);
  if (!txt.includes('goalos-v47-command.css')) txt = txt.replace('</head>', '<link rel="stylesheet" href="assets/goalos-v47-command.css">\n</head>');
  // For nested contract pages, correct relative path.
  if (rel.includes('/')) txt = txt.replace('href="assets/goalos-v47-command.css"','href="../assets/goalos-v47-command.css"');
  if (!txt.includes('goalos-v47-command.js')) txt = txt.replace('</body>', `<script src="${rel.includes('/')?'../':''}assets/goalos-v47-command.js"></script>\n</body>`);
  fs.writeFileSync(p, txt);
}
console.log(`GoalOS v47 highest command experience built: ${routeCatalog.length} pages, ${contracts.length} contracts indexed.`);
