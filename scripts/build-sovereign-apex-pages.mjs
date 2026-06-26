#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const ROOT = process.cwd();
const OUT = path.join(ROOT, 'site');
const NOW = new Date().toISOString();
const REPO = process.env.GITHUB_REPOSITORY || 'MontrealAI/goalos-signoff-pro';
const SHA = process.env.GITHUB_SHA || 'LOCAL_BUILD';
const REF = process.env.GITHUB_REF_NAME || 'local';
const RUN_ID = process.env.GITHUB_RUN_ID || 'LOCAL_RUN';
const RUN_ATTEMPT = process.env.GITHUB_RUN_ATTEMPT || '0';
const BASE = '/goalos-signoff-pro/';
const PROD_URL = 'https://montrealai.github.io/goalos-signoff-pro/';
const SHORT_SHA = SHA === 'LOCAL_BUILD' ? 'LOCAL' : SHA.slice(0, 12);

function rmrf(target) { fs.rmSync(target, { recursive: true, force: true }); }
function mkdir(target) { fs.mkdirSync(target, { recursive: true }); }
function write(file, body) { mkdir(path.dirname(file)); fs.writeFileSync(file, body); }
function sha256(data) { return crypto.createHash('sha256').update(data).digest('hex'); }
function fileHash(file) { return sha256(fs.readFileSync(file)); }
function esc(s) { return String(s).replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c])); }

rmrf(OUT); mkdir(path.join(OUT, 'assets'));

const pages = [
  { href: 'index.html', label: 'Command', title: 'GoalOS Signoff Pro — Institutional Proof-to-Acceptance', desc: 'The institutional acceptance layer for AI work: brief, evidence, human decision, receipt, optional verification.' },
  { href: 'platform.html', label: 'Platform', title: 'Platform — GoalOS Signoff Pro', desc: 'Mainstream SaaS workflow with optional verified receipts and a path to protocol-grade settlement.' },
  { href: 'architecture.html', label: 'Architecture', title: 'Architecture — GoalOS Signoff Pro', desc: 'Trusted architecture for evidence, roles, signed receipts, and optional IPFS/Ethereum verification.' },
  { href: 'theatre.html', label: 'Theatre', title: 'Proof Theatre — GoalOS Signoff Pro', desc: 'Interactive browser-local proof-to-acceptance theatre for demonstrating the acceptance primitive.' },
  { href: 'trust.html', label: 'Trust', title: 'Trust & Boundaries — GoalOS Signoff Pro', desc: 'Clear launch boundaries: no escrow, no custody, no Mainnet settlement, no AGIALPHA requirement in private beta.' },
  { href: 'pilot.html', label: 'Pilot', title: 'Private Beta Pilot — GoalOS Signoff Pro', desc: 'A rigorous pilot plan for AI consultants, agencies, enterprise teams, and grant/milestone reviewers.' },
  { href: 'dossier.html', label: 'Dossier', title: 'Dossier — GoalOS Signoff Pro', desc: 'Documentation, manifests, operating posture, and public production records.' }
];

const metrics = [
  ['0', 'customer funds held'],
  ['0', 'wallets required'],
  ['1', 'acceptance record'],
  ['5', 'launch templates'],
  ['100%', 'human final authority'],
  ['optional', 'verified receipts']
];

const stages = [
  ['01', 'Brief', 'Define the work, the evidence, and the acceptance gate.'],
  ['02', 'Evidence', 'Submit files, links, test results, limitations, and source notes.'],
  ['03', 'Review', 'A human reviewer checks completeness and requests changes if needed.'],
  ['04', 'Accept', 'The client approves a specific version and unresolved boundaries.'],
  ['05', 'Receipt', 'GoalOS signs a Mission Receipt with hashes, roles, and timestamps.'],
  ['06', 'Verify', 'Optional IPFS/Ethereum anchoring makes the accepted record independently checkable.']
];

function nav(active) {
  return `<header class="site-top" data-elevate>
    <a class="skip" href="#main">Skip to content</a>
    <div class="ticker"><span>GOALOS SIGNOFF PRO</span><b>PROOF-TO-ACCEPTANCE</b><span>SIGNED · HUMAN-GATED · VERIFIABLE</span></div>
    <nav class="nav-shell" aria-label="Primary navigation">
      <a class="brand" href="${BASE}index.html" aria-label="GoalOS Signoff Pro home">
        <span class="brand-sigil" aria-hidden="true"><i></i></span>
        <span><strong>GoalOS Signoff Pro</strong><small>Institutional acceptance layer</small></span>
      </a>
      <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="nav-links">Menu</button>
      <div class="nav-links" id="nav-links">
        ${pages.map(p => `<a href="${BASE}${p.href}" ${active === p.href ? 'aria-current="page"' : ''}>${p.label}</a>`).join('')}
        <a class="pill-link" href="${BASE}production-manifest.json">Manifest</a>
      </div>
    </nav>
  </header>`;
}

function shell(page, body) {
  return `<!doctype html><html lang="en"><head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${esc(page.title)}</title>
    <meta name="description" content="${esc(page.desc)}" />
    <meta name="theme-color" content="#04070d" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="${esc(page.title)}" />
    <meta property="og:description" content="${esc(page.desc)}" />
    <meta property="og:url" content="${PROD_URL}${page.href === 'index.html' ? '' : page.href}" />
    <meta http-equiv="Content-Security-Policy" content="default-src 'self'; img-src 'self' data:; style-src 'self'; script-src 'self'; base-uri 'self'; form-action 'self'; connect-src 'none'; object-src 'none'; frame-ancestors 'none'" />
    <link rel="canonical" href="${PROD_URL}${page.href === 'index.html' ? '' : page.href}" />
    <link rel="stylesheet" href="${BASE}assets/sovereign-apex.css" />
    <script defer src="${BASE}assets/sovereign-apex.js"></script>
  </head><body data-page="${page.href.replace('.html','')}">
    <canvas id="starfield" aria-hidden="true"></canvas>
    <div class="aurora" aria-hidden="true"></div>
    <div class="gridveil" aria-hidden="true"></div>
    ${nav(page.href)}
    <main id="main">${body}</main>
    <footer class="footer">
      <div><strong>GoalOS Signoff Pro</strong><span>AI work acceptance · evidence review · signed receipts · optional verification</span></div>
      <div class="footer-links"><a href="${BASE}trust.html">Boundaries</a><a href="${BASE}dossier.html">Dossier</a><a href="${BASE}production-manifest.json">Manifest</a></div>
      <p>Private-beta posture. No escrow, no custody, no required wallet, no AGIALPHA requirement, no Mainnet settlement claim.</p>
    </footer>
  </body></html>`;
}

function hero() {
  return `<section class="hero apex-section">
    <div class="hero-copy">
      <p class="eyebrow"><span></span> Institutional acceptance architecture / AI work / human authority</p>
      <h1><span>Know when</span><em>AI work</em><span>is actually done.</span></h1>
      <p class="lead">GoalOS Signoff Pro turns deliverables into acceptance-grade records: a brief, evidence map, review trail, client decision, signed Mission Receipt, and optional public verification.</p>
      <div class="cta-row">
        <a class="btn primary" href="${BASE}pilot.html">Enter the private beta ↗</a>
        <a class="btn ghost" href="${BASE}architecture.html">Inspect the architecture</a>
      </div>
      <div class="boundary-strip"><b>PRIVATE BETA · DEFAULT DENY</b><span>No escrow. No custody. No required wallet. No token approval. Human final authority.</span></div>
      <ol class="micro-chain" aria-label="Proof-to-acceptance chain">${stages.map(s => `<li><b>${s[0]}</b><span>${s[1]}</span></li>`).join('')}</ol>
    </div>
    <div class="hero-orbital" data-depth="1.2" aria-label="Institutional proof constellation">
      <div class="console-head"><span>CONSTITUTIONAL ACCEPTANCE CONSOLE</span><b>READY</b></div>
      <div class="core-orb"><i></i><strong>Σ</strong><span>SIGNOFF</span></div>
      ${['Client','Builder','Reviewer','Evidence','Receipt','Verifier','Pilot','Protocol'].map((x,i)=>`<div class="sat s${i+1}"><span>${x}</span></div>`).join('')}
      <svg class="orbit-lines" viewBox="0 0 600 600" aria-hidden="true"><defs><linearGradient id="g" x1="0" x2="1"><stop stop-color="#65ffd1"/><stop offset=".5" stop-color="#fff2a8"/><stop offset="1" stop-color="#9b8cff"/></linearGradient></defs><circle cx="300" cy="300" r="158"/><circle cx="300" cy="300" r="214"/><circle cx="300" cy="300" r="260"/><path d="M105 300 C210 90 390 90 495 300 C390 510 210 510 105 300Z"/><path d="M300 105 C510 210 510 390 300 495 C90 390 90 210 300 105Z"/></svg>
      <div class="console-metrics"><span>receipt hash</span><b>${SHORT_SHA}</b><span>external authority</span><b>0</b></div>
    </div>
  </section>`;
}

function metricBand() {
  return `<section class="metric-band" aria-label="Operational posture metrics">${metrics.map(([n,l])=>`<article><strong>${n}</strong><span>${l}</span></article>`).join('')}</section>`;
}

function chainSection() {
  return `<section class="apex-section split" id="platform-chain">
    <div><p class="eyebrow"><span></span> Proof-to-acceptance chain</p><h2>From vague delivery to an accepted institutional record.</h2><p>Signoff Pro gives nontechnical stakeholders a controlled sequence: define, submit, inspect, accept, preserve, verify. The chain is deliberately simple at the surface and rigorous underneath.</p></div>
    <div class="stage-grid">${stages.map(s=>`<article class="stage-card"><b>${s[0]}</b><h3>${s[1]}</h3><p>${s[2]}</p></article>`).join('')}</div>
  </section>`;
}

function authorityPanel() {
  const rows = [
    ['Client', 'Authorizes the final acceptance decision.'],
    ['Builder', 'Supplies the deliverable and evidence package.'],
    ['Reviewer', 'Examines evidence and recommends accept, changes, or reject.'],
    ['GoalOS', 'Preserves versions, hashes files, signs receipts, and records the audit trail.'],
    ['Verifier', 'Optional IPFS/Ethereum anchoring for public receipt verification.']
  ];
  return `<section class="apex-section authority"><div class="panel-title"><p class="eyebrow"><span></span> No role may self-authorize</p><h2>Human authority is explicit, bounded, and visible.</h2></div><div class="authority-grid">${rows.map(([a,b],i)=>`<article><span>0${i+1}</span><h3>${a}</h3><p>${b}</p></article>`).join('')}</div></section>`;
}

function architectureMap() {
  const nodes = ['Brief','Criteria','Evidence','AI Assistant','Reviewer','Decision','Receipt','IPFS','Ethereum','Protocol Roadmap'];
  return `<section class="apex-section architecture-map"><p class="eyebrow"><span></span> Trusted architecture</p><h2>Experience above. Proof beneath. Boundaries throughout.</h2><div class="map-shell">${nodes.map((n,i)=>`<div class="map-node n${i+1}"><b>${String(i+1).padStart(2,'0')}</b><span>${n}</span></div>`).join('')}<svg viewBox="0 0 1000 480" aria-hidden="true"><path d="M70 245 C210 120 280 120 420 245 S650 370 790 245 S925 120 960 245"/><path d="M70 245 C260 360 380 360 520 245 S710 130 960 245"/><path d="M500 50 L500 430"/><path d="M120 100 L900 380"/></svg></div></section>`;
}

function theatre() {
  return `<section class="theatre apex-section"><div class="theatre-head"><p class="eyebrow"><span></span> Browser-local decision theatre</p><h2>Run a proof-to-acceptance simulation.</h2><p>No network request. No customer data. This local demonstration makes the product posture tangible.</p></div><div class="theatre-grid"><div class="mission-card"><label>Mission preset</label><select id="missionPreset"><option>AI research report signoff</option><option>Automation delivery acceptance</option><option>Software milestone review</option><option>Grant milestone evidence review</option></select><label>Acceptance posture</label><select id="posture"><option>Institutional diligence</option><option>Client-fast review</option><option>Compliance-sensitive review</option></select><button id="runTheatre" class="btn primary" type="button">Launch acceptance flight</button><button id="resetTheatre" class="btn ghost" type="button">Reset</button><p class="hint">Keyboard: G launch · R reset · ? help</p></div><div class="flight-card"><div class="flight-status"><span>STATE</span><b id="flightState">AWAITING BRIEF</b><span>CHAIN</span><b id="flightHash">000000000000</b></div><div class="gate-row" id="gateRow">${stages.map(s=>`<button type="button" data-gate="${s[0]}">${s[0]}<span>${s[1]}</span></button>`).join('')}</div><div class="graph-theatre"><div class="graph-core">Σ</div>${['CL','BU','RV','EV','RC','VF'].map((x,i)=>`<i class="g${i+1}">${x}</i>`).join('')}</div></div><div class="review-card"><div class="score-ring"><b id="readiness">—</b><span>review readiness</span></div><h3 id="terminalTitle">No cycle has run.</h3><p id="terminalCopy">Launch a local acceptance flight to generate a review-ready trace.</p><dl><div><dt>Factual certification</dt><dd>human review required</dd></div><div><dt>Settlement</dt><dd>not authorized</dd></div><div><dt>External actions</dt><dd>0</dd></div></dl><button id="copySummary" class="btn soft" type="button">Copy executive summary</button></div></div><pre class="chronicle" id="chronicle">00:00 SYSTEM · Acceptance theatre ready. No data has left this browser.</pre></section>`;
}

function trustBoundary() {
  return `<section class="apex-section trust-boundary"><p class="eyebrow"><span></span> Institutional trust boundary</p><h2>Ambition without ambiguity.</h2><div class="boundary-grid">${[
    ['Allowed now','Create briefs, collect evidence, request changes, accept work, sign receipts, optionally anchor accepted hashes.'],
    ['Not claimed','No legal approval, no audit guarantee, no factual certification, no automatic payment release, no Mainnet settlement authorization.'],
    ['Later protocol path','AGIALPHA-secured reviewer bonds, disputes, and proof-to-payment only after protocol gates, audits, and production authorization.']
  ].map(([h,p])=>`<article><h3>${h}</h3><p>${p}</p></article>`).join('')}</div></section>`;
}

function docsGrid() {
  const docs = [
    ['Executive brief','Board-ready product position and milestone sequence.'],
    ['Product requirements','Templates, journeys, review loop, receipt flow.'],
    ['Security model','Roles, storage, receipt signing, public artifact boundary.'],
    ['Pilot playbook','10 Signoffs, 7 completions, 3 repeat-intent users.'],
    ['Verified receipts','Optional IPFS/Ethereum anchoring, not escrow.'],
    ['Protocol roadmap','Path to AGIALPHA, bonded review, and proof-to-payment.']
  ];
  return `<section class="apex-section docs-grid"><p class="eyebrow"><span></span> Product dossier</p><h2>Documentation built for executives, engineers, pilots, and reviewers.</h2><div class="cards">${docs.map(([h,p])=>`<article><h3>${h}</h3><p>${p}</p><a href="${BASE}dossier.html">Open dossier →</a></article>`).join('')}</div></section>`;
}

function index() { return shell(pages[0], `${hero()}${metricBand()}${chainSection()}${theatre()}${authorityPanel()}${architectureMap()}${trustBoundary()}${docsGrid()}`); }
function platform() { return shell(pages[1], `<section class="page-hero apex-section"><p class="eyebrow"><span></span> Platform</p><h1>Mainstream SaaS, optional verification, protocol-compatible evidence.</h1><p>GoalOS Signoff Pro packages acceptance into a role-aware, evidence-bound workflow that mainstream teams can adopt before touching wallets, escrow, or tokens.</p></section>${chainSection()}${authorityPanel()}${docsGrid()}`); }
function architecture() { return shell(pages[2], `<section class="page-hero apex-section"><p class="eyebrow"><span></span> Architecture dossier</p><h1>Signed receipts, strict boundaries, verifiable optional anchoring.</h1><p>The public website is a curated static artifact. The private SaaS app handles projects. The verified receipt path anchors hashes only. The protocol roadmap remains gated.</p></section>${architectureMap()}${trustBoundary()}${theatre()}`); }
function theatrePage() { return shell(pages[3], `<section class="page-hero apex-section"><p class="eyebrow"><span></span> Proof Theatre</p><h1>A cinematic local simulation of proof-to-acceptance.</h1><p>Demonstrate GoalOS without private customer data, external calls, wallets, settlement, or model execution.</p></section>${theatre()}`); }
function trust() { return shell(pages[4], `<section class="page-hero apex-section"><p class="eyebrow"><span></span> Trust & boundaries</p><h1>Trusted posture comes from clarity, not vague autonomy.</h1><p>Signoff Pro is designed to make capability, authority, evidence, acceptance, and verification legible to nontechnical stakeholders.</p></section>${trustBoundary()}${authorityPanel()}${metricBand()}`); }
function pilot() { return shell(pages[5], `<section class="page-hero apex-section"><p class="eyebrow"><span></span> Private beta</p><h1>Launch with ten real Signoffs, not empty protocol theatre.</h1><p>The pilot proves whether AI consultants, agencies, and institutional teams value explicit acceptance records before launching settlement or token economics.</p></section><section class="apex-section pilot-plan"><div class="cards">${[
  ['Target','10 attempted Signoffs, 7 completed, 3 repeat-intent users, 0 lost evidence, 0 broken receipts.'],
  ['Audience','AI consultants, small AI agencies, enterprise AI pilots, grant/milestone reviewers.'],
  ['Package','Five templates, evidence assistant, review loop, signed receipts, optional verified receipt upgrade.'],
  ['Decision','Continue only if customers say it improves approval clarity, invoice confidence, or review discipline.']
].map(([h,p])=>`<article><h3>${h}</h3><p>${p}</p></article>`).join('')}</div></section>`); }
function dossier() { return shell(pages[6], `<section class="page-hero apex-section"><p class="eyebrow"><span></span> Dossier</p><h1>Production manifest, operating posture, and documentation index.</h1><p>This public dossier records how the production site was generated, what it claims, and what remains outside the launch boundary.</p></section>${docsGrid()}<section class="apex-section manifest-card"><h2>Production record</h2><p>Commit <code>${esc(SHORT_SHA)}</code> · run <code>${esc(RUN_ID)}</code> · generated <code>${esc(NOW)}</code></p><a class="btn primary" href="${BASE}production-manifest.json">Open production manifest</a></section>`); }

const css = `:root{--bg:#03050a;--panel:#0b111d;--ink:#f7f2e8;--muted:#aab4c5;--line:rgba(255,255,255,.13);--a:#73ffd8;--b:#fff0a6;--c:#9a8cff;--d:#73c9ff;--rose:#ff7bad;--shadow:0 30px 100px rgba(0,0,0,.55)}*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:#03050a;color:var(--ink);font-family:Inter,ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;min-height:100vh;overflow-x:hidden}a{color:inherit;text-decoration:none}button,select{font:inherit}#starfield{position:fixed;inset:0;z-index:-4;background:radial-gradient(circle at 78% 8%,rgba(85,255,210,.13),transparent 30%),radial-gradient(circle at 18% 70%,rgba(147,120,255,.16),transparent 35%),#03050a}.aurora{position:fixed;inset:-30%;z-index:-3;background:conic-gradient(from 180deg at 50% 50%,transparent,rgba(98,255,214,.08),transparent,rgba(255,239,160,.08),transparent,rgba(130,124,255,.1),transparent);filter:blur(90px);animation:spin 32s linear infinite}.gridveil{position:fixed;inset:0;z-index:-2;background-image:linear-gradient(rgba(255,255,255,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.035) 1px,transparent 1px);background-size:48px 48px;mask-image:radial-gradient(circle at 50% 20%,#000,transparent 78%)}@keyframes spin{to{transform:rotate(360deg)}}.skip{position:absolute;left:12px;top:-60px;background:var(--b);color:#071018;padding:10px 14px;border-radius:12px;z-index:10}.skip:focus{top:12px}.site-top{position:sticky;top:0;z-index:20;background:rgba(3,5,10,.78);backdrop-filter:blur(24px);border-bottom:1px solid var(--line)}.ticker{height:36px;display:flex;justify-content:center;gap:20px;align-items:center;font-size:10px;letter-spacing:.34em;text-transform:uppercase;color:var(--muted);border-bottom:1px solid var(--line)}.ticker b{color:var(--a)}.nav-shell{max-width:1240px;margin:auto;padding:18px 22px;display:flex;align-items:center;justify-content:space-between;gap:20px}.brand{display:flex;gap:12px;align-items:center}.brand-sigil{width:42px;height:42px;border-radius:14px;background:radial-gradient(circle,var(--a),var(--c));display:grid;place-items:center;box-shadow:0 0 40px rgba(115,255,216,.35)}.brand-sigil i{width:17px;height:17px;border-radius:50%;border:2px solid #fff;background:rgba(3,5,10,.5)}.brand strong{display:block;letter-spacing:.04em}.brand small{display:block;color:var(--muted);text-transform:uppercase;font-size:10px;letter-spacing:.22em}.nav-links{display:flex;gap:8px;align-items:center}.nav-links a,.nav-toggle{padding:10px 14px;border-radius:999px;color:#dfe7ef;border:1px solid transparent;font-weight:800;font-size:13px}.nav-links a[aria-current=page],.nav-links a:hover,.nav-toggle:hover{border-color:var(--line);background:rgba(255,255,255,.07)}.pill-link{border-color:var(--line)!important}.nav-toggle{display:none;background:transparent;color:var(--ink)}main{position:relative}.apex-section{max-width:1240px;margin:0 auto;padding:92px 22px}.hero{display:grid;grid-template-columns:minmax(0,1.05fr) minmax(420px,.95fr);gap:56px;align-items:center;min-height:780px}.eyebrow{display:flex;gap:12px;align-items:center;text-transform:uppercase;letter-spacing:.28em;font-weight:900;font-size:12px;color:var(--a)}.eyebrow span{width:36px;height:1px;background:var(--a);box-shadow:0 0 20px var(--a)}h1,h2,h3,p{margin-top:0}h1{font-size:clamp(54px,8.7vw,126px);line-height:.82;letter-spacing:-.08em;margin-bottom:28px}h1 em{display:block;font-family:Georgia,serif;font-style:italic;font-weight:400;letter-spacing:-.06em;background:linear-gradient(105deg,var(--b),var(--a),var(--d),var(--c));-webkit-background-clip:text;color:transparent}h2{font-size:clamp(38px,5.5vw,78px);line-height:.92;letter-spacing:-.06em;margin-bottom:20px}h3{font-size:20px}.lead,.page-hero p,.split p{font-size:clamp(18px,2vw,24px);line-height:1.6;color:#d9e0ea;max-width:760px}.cta-row{display:flex;gap:14px;flex-wrap:wrap;margin:32px 0}.btn{border:1px solid var(--line);padding:14px 20px;border-radius:999px;font-weight:900;display:inline-flex;align-items:center;justify-content:center;gap:10px;cursor:pointer}.btn.primary{background:linear-gradient(110deg,var(--b),var(--a),var(--d));color:#061018;box-shadow:0 0 42px rgba(115,255,216,.22)}.btn.ghost,.btn.soft{background:rgba(255,255,255,.06)}.boundary-strip{border:1px solid rgba(255,123,173,.42);background:rgba(255,123,173,.08);padding:16px 18px;border-radius:16px;display:flex;gap:16px;align-items:center;max-width:760px;color:#dfe7ef}.boundary-strip b{color:#ffd6e4;letter-spacing:.18em;font-size:11px;white-space:nowrap}.micro-chain{display:flex;gap:8px;flex-wrap:wrap;list-style:none;margin:24px 0 0;padding:0}.micro-chain li{padding:9px 12px;border:1px solid var(--line);border-radius:999px;background:rgba(255,255,255,.05);font-size:12px;text-transform:uppercase;letter-spacing:.14em}.micro-chain b{color:var(--a);margin-right:6px}.hero-orbital{height:610px;position:relative;border:1px solid rgba(115,255,216,.28);border-radius:38px;background:linear-gradient(140deg,rgba(255,255,255,.1),rgba(255,255,255,.025));box-shadow:var(--shadow),inset 0 0 80px rgba(115,255,216,.08);overflow:hidden}.hero-orbital:before{content:"";position:absolute;inset:0;background:linear-gradient(90deg,rgba(255,255,255,.04) 1px,transparent 1px),linear-gradient(rgba(255,255,255,.04) 1px,transparent 1px);background-size:34px 34px;mask-image:linear-gradient(#000,transparent 95%)}.console-head,.console-metrics{position:absolute;left:28px;right:28px;display:flex;justify-content:space-between;align-items:center;border:1px solid var(--line);border-radius:20px;padding:16px 18px;background:rgba(3,5,10,.45);backdrop-filter:blur(16px);font-size:11px;letter-spacing:.2em;text-transform:uppercase}.console-head{top:28px}.console-head b{color:var(--a)}.console-metrics{bottom:28px}.console-metrics b{color:var(--b)}.core-orb{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:168px;height:168px;border-radius:50%;display:grid;place-items:center;background:radial-gradient(circle at 35% 25%,#fff,var(--a),var(--c),#0b1020 72%);box-shadow:0 0 80px rgba(115,255,216,.5),0 0 120px rgba(154,140,255,.25);text-align:center;color:#071018}.core-orb strong{font-family:Georgia,serif;font-size:74px;line-height:.8}.core-orb span{font-size:11px;font-weight:900;letter-spacing:.22em}.orbit-lines{position:absolute;inset:34px;fill:none;stroke:url(#g);stroke-width:1.2;opacity:.36}.sat{position:absolute;width:86px;height:86px;border-radius:50%;display:grid;place-items:center;border:1px solid rgba(115,255,216,.55);background:#081321;color:#fff;font-size:11px;font-weight:900;letter-spacing:.1em;text-align:center;box-shadow:0 0 30px rgba(115,255,216,.15)}.s1{left:48%;top:83px}.s2{right:100px;top:142px}.s3{right:70px;bottom:180px}.s4{left:48%;bottom:84px}.s5{left:85px;bottom:180px}.s6{left:82px;top:145px}.s7{right:200px;bottom:82px}.s8{left:210px;top:82px}.metric-band{display:grid;grid-template-columns:repeat(6,1fr);border-top:1px solid var(--line);border-bottom:1px solid var(--line);background:linear-gradient(90deg,rgba(255,240,166,.9),rgba(115,255,216,.82),rgba(154,140,255,.82));color:#061018}.metric-band article{padding:30px 24px;border-right:1px solid rgba(3,5,10,.18)}.metric-band strong{display:block;font-size:38px;letter-spacing:-.05em}.metric-band span{text-transform:uppercase;letter-spacing:.2em;font-size:11px;font-weight:900}.split{display:grid;grid-template-columns:.8fr 1.2fr;gap:38px;align-items:start}.stage-grid,.authority-grid,.cards{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}.stage-card,.authority article,.cards article,.boundary-grid article,.manifest-card,.mission-card,.flight-card,.review-card{border:1px solid var(--line);border-radius:28px;padding:24px;background:linear-gradient(145deg,rgba(255,255,255,.08),rgba(255,255,255,.025));box-shadow:0 20px 70px rgba(0,0,0,.25)}.stage-card b,.authority span{color:var(--b);font-size:24px}.stage-card p,.authority p,.cards p,.boundary-grid p{color:var(--muted);line-height:1.55}.authority{border-top:1px solid var(--line);border-bottom:1px solid var(--line)}.authority-grid{grid-template-columns:repeat(5,1fr)}.architecture-map h2{max-width:900px}.map-shell{position:relative;height:520px;border:1px solid var(--line);border-radius:34px;background:radial-gradient(circle at 50% 40%,rgba(115,255,216,.12),rgba(255,255,255,.035));overflow:hidden}.map-shell svg{position:absolute;inset:0;width:100%;height:100%;fill:none;stroke:rgba(115,255,216,.32);stroke-width:2}.map-node{position:absolute;z-index:2;width:142px;min-height:72px;border:1px solid var(--line);border-radius:18px;background:rgba(3,5,10,.76);display:flex;gap:10px;align-items:center;padding:14px;box-shadow:0 10px 34px rgba(0,0,0,.3)}.map-node b{color:var(--a)}.n1{left:5%;top:10%}.n2{left:30%;top:8%}.n3{right:28%;top:9%}.n4{right:5%;top:18%}.n5{left:43%;top:42%;transform:scale(1.15)}.n6{left:8%;bottom:14%}.n7{left:30%;bottom:9%}.n8{right:31%;bottom:11%}.n9{right:8%;bottom:14%}.n10{left:43%;bottom:4%}.theatre{border-top:1px solid var(--line);border-bottom:1px solid var(--line)}.theatre-head{display:grid;grid-template-columns:1fr 1fr;gap:30px}.theatre-grid{display:grid;grid-template-columns:.7fr 1.35fr .85fr;gap:18px}.mission-card label{display:block;color:var(--a);font-size:11px;letter-spacing:.2em;text-transform:uppercase;margin:14px 0 8px}.mission-card select{width:100%;border:1px solid var(--line);background:#07101d;color:var(--ink);border-radius:14px;padding:12px}.hint{color:var(--muted);font-size:13px}.flight-status{display:grid;grid-template-columns:auto 1fr auto 1fr;gap:10px;align-items:center;border-bottom:1px solid var(--line);padding-bottom:14px}.flight-status span{font-size:10px;color:var(--muted);letter-spacing:.2em}.flight-status b{color:var(--a);font-size:12px}.gate-row{display:grid;grid-template-columns:repeat(6,1fr);gap:8px;margin:16px 0}.gate-row button{border:1px solid var(--line);border-radius:14px;background:rgba(255,255,255,.05);color:var(--ink);padding:10px;font-size:12px}.gate-row button.done{background:rgba(115,255,216,.14);border-color:rgba(115,255,216,.55)}.gate-row span{display:block;font-size:10px;color:var(--muted)}.graph-theatre{position:relative;height:290px;border:1px solid var(--line);border-radius:22px;overflow:hidden;background:radial-gradient(circle at center,rgba(115,255,216,.12),transparent 45%),linear-gradient(rgba(255,255,255,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.03) 1px,transparent 1px);background-size:auto,24px 24px,24px 24px}.graph-core{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:86px;height:86px;border-radius:50%;display:grid;place-items:center;font-family:Georgia,serif;font-size:42px;background:radial-gradient(circle,var(--b),var(--a),#122);color:#061018}.graph-theatre i{position:absolute;width:46px;height:46px;border-radius:50%;display:grid;place-items:center;border:1px solid var(--a);font-style:normal;background:#081221;font-size:12px;font-weight:900}.g1{left:50%;top:25px}.g2{right:90px;top:70px}.g3{right:75px;bottom:72px}.g4{left:50%;bottom:25px}.g5{left:90px;bottom:72px}.g6{left:75px;top:70px}.review-card{text-align:center}.score-ring{width:150px;height:150px;border-radius:50%;border:8px solid rgba(115,255,216,.18);margin:0 auto 20px;display:grid;place-items:center;box-shadow:inset 0 0 30px rgba(115,255,216,.18)}.score-ring b{font-size:42px;color:var(--b)}.score-ring span{font-size:10px;text-transform:uppercase;color:var(--muted);letter-spacing:.14em}.review-card dl{text-align:left;border-top:1px solid var(--line);margin-top:20px}.review-card div{display:flex;justify-content:space-between;border-bottom:1px solid var(--line);padding:12px 0}.review-card dt{color:var(--muted)}.review-card dd{margin:0;color:var(--a);font-weight:900}.chronicle{grid-column:1/-1;white-space:pre-wrap;border:1px solid var(--line);border-radius:22px;background:#050912;color:#b8ffd4;padding:18px;min-height:180px;max-height:260px;overflow:auto}.boundary-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}.page-hero{min-height:440px;padding-top:140px}.footer{max-width:1240px;margin:auto;padding:60px 22px 80px;border-top:1px solid var(--line);display:grid;gap:18px;color:var(--muted)}.footer strong{display:block;color:var(--ink)}.footer-links{display:flex;gap:18px;flex-wrap:wrap}.footer-links a{color:var(--a)}code{background:rgba(255,255,255,.08);padding:2px 6px;border-radius:6px}@media(max-width:960px){.ticker{display:none}.nav-toggle{display:inline-flex}.nav-links{display:none;position:absolute;left:16px;right:16px;top:86px;background:#07101d;border:1px solid var(--line);border-radius:20px;padding:12px;flex-direction:column}.nav-links.open{display:flex}.hero,.split,.theatre-head,.theatre-grid{grid-template-columns:1fr}.hero{min-height:auto}.hero-orbital{height:520px}.metric-band{grid-template-columns:repeat(2,1fr)}.stage-grid,.authority-grid,.cards,.boundary-grid{grid-template-columns:1fr}.authority-grid{grid-template-columns:1fr}.apex-section{padding:64px 18px}h1{font-size:64px}.boundary-strip{display:block}.gate-row{grid-template-columns:repeat(3,1fr)}}@media(prefers-reduced-motion:reduce){*,*:before,*:after{animation:none!important;transition:none!important;scroll-behavior:auto!important}.aurora{display:none}}`;

const clientJs = `(() => { const $ = (s, r=document) => r.querySelector(s); const $$ = (s, r=document) => [...r.querySelectorAll(s)]; const nav = $('.nav-toggle'); if(nav){ nav.addEventListener('click', () => { const links = $('#nav-links'); const open = !links.classList.contains('open'); links.classList.toggle('open', open); nav.setAttribute('aria-expanded', String(open)); }); } const c = $('#starfield'); if(c){ const ctx = c.getContext('2d'); let w=0,h=0,dpr=1; const pts = Array.from({length:150}, (_,i)=>({x:Math.random(),y:Math.random(),z:Math.random(),r:Math.random()*1.7+.3, a:Math.random()*6.28})); const resize=()=>{dpr=Math.min(devicePixelRatio||1,2);w=innerWidth;h=innerHeight;c.width=w*dpr;c.height=h*dpr;c.style.width=w+'px';c.style.height=h+'px';ctx.setTransform(dpr,0,0,dpr,0,0)}; addEventListener('resize',resize,{passive:true}); resize(); let t=0; function draw(){t+=.004;ctx.clearRect(0,0,w,h);ctx.fillStyle='#03050a';ctx.fillRect(0,0,w,h);for(const p of pts){const x=p.x*w+Math.sin(t+p.a)*18*p.z;const y=p.y*h+Math.cos(t+p.a)*10*p.z;ctx.globalAlpha=.25+.55*p.z;ctx.fillStyle=p.z>.66?'#73ffd8':p.z>.33?'#fff0a6':'#9a8cff';ctx.beginPath();ctx.arc(x,y,p.r,0,7);ctx.fill()}ctx.globalAlpha=.16;ctx.strokeStyle='#73ffd8';for(let i=0;i<pts.length;i+=5){const a=pts[i],b=pts[(i*7+11)%pts.length];ctx.beginPath();ctx.moveTo(a.x*w,a.y*h);ctx.lineTo(b.x*w,b.y*h);ctx.stroke()}requestAnimationFrame(draw)} if(!matchMedia('(prefers-reduced-motion: reduce)').matches) draw(); }
const run=$('#runTheatre'), reset=$('#resetTheatre'), chrono=$('#chronicle'); const gates=$$('#gateRow button'); const state=$('#flightState'), hash=$('#flightHash'), readiness=$('#readiness'), title=$('#terminalTitle'), copy=$('#terminalCopy'); const lines=['Brief committed: acceptance criteria sealed.','Evidence package mapped to five criteria.','Reviewer inspection opened with limitations preserved.','Change-request path available; final authority remains client-side.','Mission Receipt signed with artifact fingerprints.','Optional verified receipt ready: hashes only, no custody.']; function launch(){gates.forEach(g=>g.classList.remove('done')); if(chrono) chrono.textContent='00:00 SYSTEM · Acceptance flight initialized.\\n'; if(state) state.textContent='RUNNING'; if(readiness) readiness.textContent='0'; lines.forEach((line,i)=>setTimeout(()=>{gates[i]?.classList.add('done'); if(chrono) chrono.textContent += String(i+1).padStart(2,'0')+':00 GATE · '+line+'\\n'; if(readiness) readiness.textContent=String([18,36,54,72,88,94][i]); if(hash) hash.textContent = Math.random().toString(16).slice(2,14).toUpperCase(); if(i===lines.length-1){ if(state) state.textContent='HUMAN REVIEW READY'; if(title) title.textContent='Review-ready Signoff package generated.'; if(copy) copy.textContent='The brief, evidence, decision path, and receipt boundary are complete. Client acceptance remains human-controlled.';}},350+i*420)); } function clear(){gates.forEach(g=>g.classList.remove('done')); if(chrono) chrono.textContent='00:00 SYSTEM · Acceptance theatre ready. No data has left this browser.'; if(state) state.textContent='AWAITING BRIEF'; if(hash) hash.textContent='000000000000'; if(readiness) readiness.textContent='—'; if(title) title.textContent='No cycle has run.'; if(copy) copy.textContent='Launch a local acceptance flight to generate a review-ready trace.';} run?.addEventListener('click',launch); reset?.addEventListener('click',clear); $('#copySummary')?.addEventListener('click',()=>navigator.clipboard?.writeText('GoalOS Signoff Pro creates acceptance-grade records for AI work: brief, evidence, human decision, signed receipt, optional verification.').catch(()=>{})); addEventListener('keydown',e=>{if(['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName||''))return; if(e.key.toLowerCase()==='g')launch(); if(e.key.toLowerCase()==='r')clear();});
})();`;

const routes = new Map([
  ['index.html', index()], ['platform.html', platform()], ['architecture.html', architecture()], ['theatre.html', theatrePage()], ['trust.html', trust()], ['pilot.html', pilot()], ['dossier.html', dossier()]
]);
routes.set('404.html', shell({href:'404.html', title:'Not Found — GoalOS Signoff Pro', desc:'Page not found.'}, `<section class="page-hero apex-section"><p class="eyebrow"><span></span> 404</p><h1>Signal not found.</h1><p>The requested route is outside the published production artifact.</p><a class="btn primary" href="${BASE}index.html">Return to command</a></section>`));

write(path.join(OUT,'assets','sovereign-apex.css'), css);
write(path.join(OUT,'assets','sovereign-apex.js'), clientJs);
for (const [file, body] of routes) write(path.join(OUT, file), body);
write(path.join(OUT,'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${PROD_URL}sitemap.xml\n`);
write(path.join(OUT,'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${pages.map(p=>`<url><loc>${PROD_URL}${p.href === 'index.html' ? '' : p.href}</loc><lastmod>${NOW.slice(0,10)}</lastmod><changefreq>weekly</changefreq><priority>${p.href==='index.html'?'1.0':'0.8'}</priority></url>`).join('')}</urlset>`);
write(path.join(OUT,'apex-manifest.txt'), `GoalOS Signoff Pro Sovereign Apex Site\nGenerated: ${NOW}\nRepository: ${REPO}\nCommit: ${SHA}\nRun: ${RUN_ID}\n`);

const files = [];
function walk(dir){ for(const entry of fs.readdirSync(dir,{withFileTypes:true})){ const p=path.join(dir,entry.name); if(entry.isDirectory()) walk(p); else files.push(p); }}
walk(OUT);
const fileRecords = files.map(p => ({ path: path.relative(OUT,p).replaceAll('\\\\','/'), bytes: fs.statSync(p).size, sha256: fileHash(p) })).sort((a,b)=>a.path.localeCompare(b.path));
const manifest = { schemaVersion:'goalos.signoff.apex.production.v3', repository: REPO, productionUrl: PROD_URL, generatedAt: NOW, commit: SHA, ref: REF, runId: RUN_ID, runAttempt: RUN_ATTEMPT, posture: { launch: 'private-beta-public-front-door', customerFundsHeld: 0, walletsRequired: false, escrowEnabled: false, agialphaRequired: false, mainnetSettlementClaim: false, externalActionsByArtifact: 0 }, pages: pages.map(p=>p.href), files: fileRecords, siteHash: sha256(JSON.stringify(fileRecords)) };
write(path.join(OUT,'production-manifest.json'), JSON.stringify(manifest,null,2)+'\n');
console.log(`Generated ${fileRecords.length} files in ${path.relative(ROOT,OUT)}`);
console.log(`Production URL: ${PROD_URL}`);
