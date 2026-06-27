#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = process.cwd();
const siteDir = path.join(root, 'site');
const configPath = path.join(root, 'config', 'user-delight-autopilot.json');
const config = fs.existsSync(configPath)
  ? JSON.parse(fs.readFileSync(configPath, 'utf8'))
  : { version: '3.0.0-final', contactEmail: 'info@quebec.ai', demoScenarios: [] };

const contactEmail = config.contactEmail || 'info@quebec.ai';
const baseUrl = 'https://montrealai.github.io/goalos-signoff-pro/';
const scenarios = config.demoScenarios || [];
fs.mkdirSync(siteDir, { recursive: true });
fs.mkdirSync(path.join(siteDir, 'assets'), { recursive: true });
fs.mkdirSync(path.join(siteDir, 'demo', 'proof-mission'), { recursive: true });

const esc = (value = '') => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#39;');
const slug = (value = '') => String(value).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const json = (value) => JSON.stringify(value, null, 2);
const sha256 = (text) => crypto.createHash('sha256').update(text).digest('hex');

function write(rel, content) {
  const file = path.join(siteDir, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
}

function writeIfMissing(rel, html) {
  const file = path.join(siteDir, rel);
  if (!fs.existsSync(file)) write(rel, html);
}

function fallbackPage(title, eyebrow, active, lead, links = []) {
  const body = `<p class="lead">${esc(lead)}</p><div class="cta-row">${links.map(([href,label,kind]) => `<a class="${kind || 'secondary'}" href="${href}">${esc(label)}</a>`).join('')}</div>`;
  return layout({ title, eyebrow, active, body, description: lead });
}

function cardItems(items = []) {
  return items.map((item) => `<li>${esc(item)}</li>`).join('');
}

function nav(active = 'Demo lab') {
  const links = [
    ['index.html', 'Institution'],
    ['start.html', 'Start'],
    ['demo-lab.html', 'Demo lab'],
    ['proof-mission-builder.html', 'Proof mission'],
    ['evidence-docket-lab.html', 'Evidence docket'],
    ['receipt-verifier-demo.html', 'Verifier'],
    ['examples.html', 'Examples'],
    ['agialpha.html', '$AGIALPHA'],
    ['no-user-data.html', 'Data posture']
  ];
  return `<header class="ud-nav"><a class="brand" href="index.html"><span class="brand-orb"></span><span><b>GoalOS Signoff Pro</b><small>User Activation Console</small></span></a><nav>${links.map(([href,label]) => `<a class="${label===active?'active':''}" href="${href}">${esc(label)}</a>`).join('')}</nav><a class="beta" href="request-access.html">Private beta</a></header>`;
}

function layout({ title, eyebrow, active, body, description }) {
  const fullTitle = `${title} · GoalOS Signoff Pro`;
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${esc(fullTitle)}</title>
  <meta name="description" content="${esc(description || 'GoalOS Signoff Pro user activation console for browser-local demos, proof missions, evidence dockets, and signed receipt verification.')}" />
  <meta property="og:title" content="${esc(fullTitle)}" />
  <meta property="og:description" content="${esc(description || 'Understand, demo, verify, and request GoalOS Signoff Pro proof missions.')}" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="${baseUrl}${active ? slug(active) + '.html' : ''}" />
  <link rel="stylesheet" href="assets/asi-apex-v6.css">
  <link rel="stylesheet" href="assets/user-delight.css">
</head>
<body class="ud-body" data-page="${esc(active || 'User Activation')}">
  <canvas id="delight-field" aria-hidden="true"></canvas>
  <div class="ud-aurora" aria-hidden="true"></div>
  ${nav(active)}
  <main class="ud-main">
    <section class="ud-hero reveal">
      <p class="eyebrow"><span></span>${esc(eyebrow || 'User activation')}</p>
      <h1>${title}</h1>
      ${body}
    </section>
  </main>
  <footer class="ud-footer"><b>GoalOS Signoff Pro</b><span>Browser-local demos · public-safe examples · signed receipt posture</span><a href="mailto:${contactEmail}?subject=GoalOS%20Signoff%20Pro%20public-safe%20inquiry">${contactEmail}</a></footer>
  <script src="assets/user-delight.js"></script>
</body>
</html>`;
}

function scenarioCards() {
  return scenarios.map((s, index) => `<article class="scenario-card" data-scenario="${esc(s.id)}">
    <div class="scenario-index">${String(index + 1).padStart(2, '0')}</div>
    <h3>${esc(s.title)}</h3>
    <p>${esc(s.objective)}</p>
    <div class="mini-label">Audience</div><p class="muted">${esc(s.audience)}</p>
    <button class="ghost launch-scenario" data-scenario="${esc(s.id)}">Load demo mission</button>
  </article>`).join('');
}

function proofConsole(id = 'proof-console') {
  return `<div class="proof-console" id="${esc(id)}">
    <div class="console-head"><span>Proof-to-acceptance console</span><b id="console-state">Awaiting mission</b></div>
    <div class="console-grid">
      <div class="gate-list" id="gate-list">
        ${['Commission','Submit','Map','Review','Accept','Receipt'].map((gate, i) => `<button class="gate" data-gate="${i}"><strong>${String(i+1).padStart(2,'0')}</strong><span>${gate}</span><small>${['Work requested','Evidence delivered','Criteria linked','Human assessment','Authorized decision','Signed & replayable'][i]}</small></button>`).join('')}
      </div>
      <div class="receipt-orbit">
        <div class="ring" id="readiness-ring"><span id="readiness-score">0</span><small>readiness</small></div>
        <div class="orbit-tags"><span>Evidence mapped</span><span>Integrity sealed</span><span>Human gate</span></div>
      </div>
    </div>
    <pre class="console-log" id="console-log">System ready. Select a demo mission or launch a proof cycle.</pre>
  </div>`;
}

function demoLabPage() {
  const body = `
    <div class="hero-split">
      <div>
        <p class="lead">A hands-on, browser-local walkthrough that shows how an AI deliverable becomes a mission, how evidence is mapped, how human review is preserved, and how a signed receipt is produced.</p>
        <div class="cta-row"><button class="primary" id="launch-cycle">Launch proof cycle</button><a class="secondary" href="evidence-docket-lab.html">Open sample docket</a><a class="secondary" href="receipt-verifier-demo.html">Verify demo receipt</a></div>
        <div class="trust-row"><span>No sign-in</span><span>No upload</span><span>No wallet</span><span>No cookies</span></div>
      </div>
      ${proofConsole('proof-console')}
    </div>
    <section class="section reveal"><p class="eyebrow"><span></span>Choose a public-safe mission</p><h2>Four proof missions users can understand immediately.</h2><div class="scenario-grid">${scenarioCards()}</div></section>
    <section class="section reveal"><p class="eyebrow"><span></span>What the demo creates</p><div class="deliverable-grid"><article><h3>Mission contract</h3><p>Objective, criteria, authority, and done condition.</p></article><article><h3>Evidence Docket</h3><p>Claims matrix, provenance, verifier notes, risks, and replay path.</p></article><article><h3>Mission Receipt</h3><p>Accepted version, hash, timestamp, issuer, and decision state.</p></article></div></section>`;
  return layout({ title: 'Run the proof mission demo.', eyebrow: 'Browser-local product demo', active: 'Demo lab', body, description: 'Run a browser-local GoalOS Signoff Pro demo with proof gates, evidence mapping, human review, and signed receipt replay.' });
}

function proofMissionBuilderPage() {
  const body = `
    <div class="hero-split"><div><p class="lead">Pick the mission closest to your work. GoalOS turns it into an acceptance path: contract, evidence, verifier report, decision state, receipt, and reusable capability package.</p><div class="cta-row"><a class="primary" href="demo-lab.html">Run a demo mission</a><a class="secondary" href="request-access.html">Request pilot access</a></div></div><div class="builder-panel"><h3>48-hour Proof Mission</h3><ol><li>Start with one consequential AI deliverable.</li><li>Convert the work into acceptance criteria.</li><li>Map proof to each claim.</li><li>Package the review-ready decision state.</li><li>Issue a Mission Receipt after approval.</li></ol></div></div>
    <section class="section reveal"><p class="eyebrow"><span></span>Mission templates</p><h2>Select a work package; see its proof path.</h2><div class="scenario-grid">${scenarioCards()}</div></section>
    <section class="section reveal"><p class="eyebrow"><span></span>Output package</p><div class="receipt-table"><div><b>Executive brief</b><span>Decision-ready summary for leaders.</span></div><div><b>Evidence Docket</b><span>Claims, evidence, risks, provenance, replay path.</span></div><div><b>Verifier report</b><span>What passed, what needs judgment, what remains uncertain.</span></div><div><b>Mission Receipt</b><span>Signed acceptance record for the approved version.</span></div></div></section>`;
  return layout({ title: 'Build a Proof Mission in minutes.', eyebrow: 'Proof Mission Builder', active: 'Proof mission', body, description: 'Choose a GoalOS Signoff Pro proof mission template and understand the deliverables before requesting a pilot.' });
}

function demoGalleryPage() {
  const rows = scenarios.map((s) => `<article class="gallery-card"><h3>${esc(s.title)}</h3><p>${esc(s.objective)}</p><div class="gallery-columns"><div><b>Input</b><p>${esc(s.input)}</p></div><div><b>Criteria</b><ul>${cardItems(s.criteria)}</ul></div><div><b>Outputs</b><ul>${cardItems(s.outputs)}</ul></div></div><span class="decision">${esc(s.decision)}</span></article>`).join('');
  const body = `<p class="lead">Concrete examples help teams see how GoalOS applies to their own work. Every demo is public-safe and designed for understanding, not data intake.</p><div class="cta-row"><a class="primary" href="demo-lab.html">Launch demo lab</a><a class="secondary" href="evidence-docket-lab.html">Inspect a docket</a></div><section class="section reveal"><div class="gallery-list">${rows}</div></section>`;
  return layout({ title: 'Examples that feel like real work.', eyebrow: 'Demo gallery', active: 'Examples', body, description: 'Browse public-safe proof mission examples for AI research, automation, grants, procurement, and enterprise review.' });
}

function evidenceDocketLabPage() {
  const tabs = [
    ['manifest','Manifest','Mission ID, version, signer, evidence boundary, and receipt path.'],
    ['claims','Claims matrix','Every major claim is mapped to required evidence and reviewer judgment.'],
    ['provenance','Source provenance','Evidence categories, timestamps, links, hashes, and public-safe references.'],
    ['verifier','Verifier report','Completeness checks, unresolved questions, and review-readiness notes.'],
    ['risk','Risk ledger','Known limits, assumptions, escalation triggers, and rollback notes.'],
    ['receipt','Receipt','Decision state, acceptance status, receipt hash, and replay link.']
  ];
  const body = `<div class="hero-split"><div><p class="lead">The Evidence Docket is the product’s proof room. It is where claims, evidence, risks, and decision authority become inspectable before acceptance.</p><div class="cta-row"><button class="primary" data-docket-tab="claims">Open claims matrix</button><a class="secondary" href="receipt-verifier-demo.html">Verify receipt</a></div></div><div class="docket-card"><h3>Sample docket</h3><p>AI research report acceptance</p><code>GD-DEMO-2026-001</code></div></div>
  <section class="section reveal"><div class="tabs" id="docket-tabs">${tabs.map(([id,label], i) => `<button class="tab ${i===0?'active':''}" data-tab="${id}">${label}</button>`).join('')}</div><div class="tab-panels">${tabs.map(([id,label,text], i) => `<article class="tab-panel ${i===0?'active':''}" data-panel="${id}"><h3>${label}</h3><p>${text}</p><div class="docket-lines">${['Claim boundary visible','Evidence mapped','Reviewer judgment preserved','Replay path available'].map((line, j) => `<span><b>${String(j+1).padStart(2,'0')}</b>${line}</span>`).join('')}</div></article>`).join('')}</div></section>`;
  return layout({ title: 'Inspect the Evidence Docket.', eyebrow: 'Evidence Docket Lab', active: 'Evidence docket', body, description: 'Inspect a sample GoalOS Evidence Docket with manifest, claims matrix, provenance, verifier notes, risk ledger, and receipt state.' });
}

function verifierDemoPage() {
  const receipt = demoReceipt(scenarios[0] || {});
  const body = `<div class="hero-split"><div><p class="lead">Run a demo verification without pasting anything. The verifier checks a public-safe sample Mission Receipt, confirms the decision state, and shows what a replayable acceptance record feels like.</p><div class="cta-row"><button class="primary" id="verify-receipt">Verify sample receipt</button><button class="secondary" id="reset-verifier">Reset</button></div></div><div class="verifier-card"><h3>Receipt status</h3><div id="verifier-result" class="verifier-result pending">Awaiting verification</div><code>${esc(receipt.receiptId)}</code></div></div>
  <section class="section reveal"><p class="eyebrow"><span></span>Sample receipt JSON</p><pre class="json-block" id="receipt-json">${esc(json(receipt))}</pre></section>`;
  return layout({ title: 'Verify a Mission Receipt.', eyebrow: 'Browser-local verifier demo', active: 'Verifier', body, description: 'Run a browser-local Mission Receipt verifier demo for GoalOS Signoff Pro.' });
}

function autonomousDemoPage() {
  const body = `<div class="hero-split"><div><p class="lead">Nontechnical users can generate a complete demo Proof Mission package from GitHub Actions. The workflow runs by itself, creates artifacts, and uploads a downloadable ZIP for review.</p><div class="cta-row"><a class="primary" href="https://github.com/MontrealAI/goalos-signoff-pro/actions/workflows/user-delight-autopilot.yml">Run autonomous demo</a><a class="secondary" href="demo-lab.html">Try browser demo first</a></div></div><div class="builder-panel"><h3>Autonomous artifact bundle</h3><ol><li>Mission contract</li><li>Claims matrix</li><li>Evidence Docket</li><li>Verifier report</li><li>Risk ledger</li><li>Decision state</li><li>Mission Receipt</li><li>Executive HTML summary</li></ol></div></div>
  <section class="section reveal"><p class="eyebrow"><span></span>How to run</p><div class="steps"><article><b>01</b><h3>Open Actions</h3><p>Go to the repository’s Actions tab.</p></article><article><b>02</b><h3>Select workflow</h3><p>Choose “User Delight Demo Autopilot”.</p></article><article><b>03</b><h3>Run workflow</h3><p>Pick a scenario and click Run workflow.</p></article><article><b>04</b><h3>Download artifact</h3><p>Open the completed run and download the generated proof mission bundle.</p></article></div></section>`;
  return layout({ title: 'Run the autonomous demo from GitHub.', eyebrow: 'Autonomous Demo', active: 'Demo lab', body, description: 'Run a GoalOS Signoff Pro demo Proof Mission entirely through GitHub Actions and download the generated artifacts.' });
}

function demoReceipt(s) {
  const base = {
    receiptId: 'GSP-DEMO-RECEIPT-001',
    product: 'GoalOS Signoff Pro',
    scenario: s.id || 'ai-research-report',
    title: s.title || 'AI research report acceptance',
    decision: s.decision || 'Accepted for demo',
    issuer: 'GoalOS Signoff Pro demo issuer',
    humanAuthority: 'Final acceptance belongs to the designated reviewer',
    evidenceHash: sha256(json(s || {})),
    issuedAt: '2026-06-27T00:00:00.000Z',
    replayPath: 'demo/proof-mission/evidence-docket.json',
    publicSafe: true
  };
  return { ...base, receiptHash: sha256(json(base)) };
}

function writeDemoArtifacts() {
  const scenario = scenarios[0] || { id: 'ai-research-report', title: 'AI research report acceptance', criteria: [], outputs: [] };
  const mission = {
    missionId: 'GSP-DEMO-2026-001',
    scenario: scenario.id,
    title: scenario.title,
    objective: scenario.objective,
    criteria: scenario.criteria,
    authority: 'Designated human reviewer',
    contact: contactEmail,
    dataPosture: 'Public-safe demo. No user data requested.'
  };
  const docket = {
    publicSafe: true,
    docketId: 'GSP-DEMO-DOCKET-001',
    missionId: mission.missionId,
    manifest: mission,
    claimsMatrix: scenario.criteria.map((criterion, index) => ({ id: `C${index+1}`, criterion, evidence: `E${index+1}`, status: 'mapped' })),
    verifierReport: { status: 'review-ready', notes: ['All demo criteria mapped', 'Human acceptance remains the final gate'] },
    riskLedger: [{ risk: 'Unreviewed AI output', mitigation: 'Require evidence mapping and human decision before acceptance' }],
    receipt: demoReceipt(scenario)
  };
  write('demo/proof-mission/mission-contract.json', json(mission));
  write('demo/proof-mission/evidence-docket.json', json(docket));
  write('demo/proof-mission/mission-receipt.json', json(docket.receipt));
  write('demo/proof-mission/verifier-report.json', json(docket.verifierReport));
  write('demo/proof-mission/risk-ledger.json', json(docket.riskLedger));
  write('demo/proof-mission/README.txt', `GoalOS Signoff Pro demo Proof Mission\n\nOpen demo-lab.html, evidence-docket-lab.html, and receipt-verifier-demo.html on the public site.\nContact: ${contactEmail}\n`);
}

const css = `
:root{--bg:#03080b;--panel:rgba(255,255,255,.07);--panel2:rgba(121,255,221,.10);--line:rgba(171,255,231,.25);--text:#f8f4e8;--muted:#b9c7ca;--mint:#73ffd7;--cyan:#70e9ff;--gold:#ffe98d;--violet:#a893ff;--danger:#ff7aa6;--shadow:0 30px 90px rgba(0,0,0,.45)}
*{box-sizing:border-box}html{scroll-behavior:smooth}body.ud-body{margin:0;background:radial-gradient(circle at 70% 10%,rgba(92,255,218,.18),transparent 30%),radial-gradient(circle at 18% 72%,rgba(168,147,255,.16),transparent 26%),linear-gradient(135deg,#020507,#07151a 50%,#03060c);color:var(--text);font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;min-height:100vh;overflow-x:hidden}#delight-field{position:fixed;inset:0;z-index:-2;opacity:.72}.ud-aurora{position:fixed;inset:-20%;background:conic-gradient(from 90deg at 50% 50%,transparent,rgba(91,255,216,.10),transparent,rgba(255,235,144,.08),transparent,rgba(132,115,255,.10),transparent);filter:blur(60px);animation:drift 18s linear infinite;z-index:-3}@keyframes drift{to{transform:rotate(1turn)}}
.ud-nav{position:sticky;top:0;z-index:20;display:flex;align-items:center;gap:24px;padding:18px clamp(18px,4vw,56px);background:rgba(3,8,12,.78);backdrop-filter:blur(18px);border-bottom:1px solid rgba(255,255,255,.08)}.brand{display:flex;align-items:center;gap:12px;text-decoration:none;color:var(--text);min-width:260px}.brand-orb{width:36px;height:36px;border-radius:13px;background:radial-gradient(circle,var(--mint),#0d2630 58%);box-shadow:0 0 34px rgba(115,255,215,.45);border:1px solid rgba(255,255,255,.2)}.brand b{display:block;font-size:12px;letter-spacing:.18em;text-transform:uppercase}.brand small{display:block;color:var(--muted);font-size:10px;letter-spacing:.22em;text-transform:uppercase}.ud-nav nav{display:flex;align-items:center;gap:8px;flex:1;justify-content:center;flex-wrap:wrap}.ud-nav nav a,.beta{color:var(--text);text-decoration:none;font-weight:800;font-size:12px;padding:10px 14px;border-radius:999px}.ud-nav nav a.active,.ud-nav nav a:hover{background:rgba(255,255,255,.10);box-shadow:inset 0 0 0 1px rgba(255,255,255,.14)}.beta{background:linear-gradient(135deg,var(--gold),var(--mint),var(--cyan));color:#03100e;box-shadow:0 0 32px rgba(115,255,215,.28)}
.ud-main{max-width:1180px;margin:auto;padding:clamp(72px,10vw,140px) clamp(20px,4vw,40px)}.ud-hero h1{font-size:clamp(52px,9vw,124px);line-height:.86;letter-spacing:-.08em;max-width:920px;margin:0 0 24px}.eyebrow{font-size:12px;text-transform:uppercase;letter-spacing:.36em;color:var(--mint);font-weight:900}.eyebrow span{display:inline-block;width:34px;height:1px;background:var(--mint);vertical-align:middle;margin-right:12px}.lead{font-size:clamp(18px,2vw,25px);line-height:1.42;max-width:720px;color:#e9f7f4}.muted{color:var(--muted)}.hero-split{display:grid;grid-template-columns:minmax(0,1fr) minmax(360px,.95fr);gap:44px;align-items:center}.cta-row{display:flex;gap:14px;flex-wrap:wrap;margin:28px 0}.primary,.secondary,.ghost{border:0;border-radius:999px;padding:14px 18px;font-weight:900;text-decoration:none;display:inline-flex;align-items:center;justify-content:center;cursor:pointer}.primary{background:linear-gradient(135deg,var(--gold),var(--mint),var(--cyan));color:#03100e;box-shadow:0 0 36px rgba(115,255,215,.28)}.secondary,.ghost{background:rgba(255,255,255,.10);color:var(--text);box-shadow:inset 0 0 0 1px rgba(255,255,255,.16)}.ghost{border-radius:16px;width:100%;margin-top:10px}.trust-row{display:flex;gap:10px;flex-wrap:wrap;margin-top:26px}.trust-row span,.decision{padding:9px 12px;border-radius:999px;border:1px solid var(--line);background:rgba(115,255,215,.08);color:var(--mint);font-size:12px;font-weight:900;text-transform:uppercase;letter-spacing:.12em}
.section{padding:clamp(80px,10vw,140px) 0}.section h2{font-size:clamp(38px,6vw,78px);line-height:.94;letter-spacing:-.06em;margin:0 0 34px}.scenario-grid,.deliverable-grid,.steps{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:18px}.scenario-card,.gallery-card,.builder-panel,.docket-card,.proof-console,.tab-panel,.verifier-card,.receipt-table,.steps article,.deliverable-grid article{background:linear-gradient(135deg,rgba(255,255,255,.10),rgba(115,255,215,.05));border:1px solid rgba(255,255,255,.16);border-radius:28px;box-shadow:var(--shadow);backdrop-filter:blur(16px)}.scenario-card,.gallery-card,.builder-panel,.docket-card,.tab-panel,.verifier-card,.steps article,.deliverable-grid article{padding:24px}.scenario-index{color:var(--gold);font-weight:900;letter-spacing:.12em}.scenario-card h3,.gallery-card h3,.builder-panel h3,.docket-card h3{font-size:24px;line-height:1.05;margin:12px 0}.mini-label{font-size:10px;text-transform:uppercase;letter-spacing:.2em;color:var(--mint);font-weight:900}.gallery-list{display:grid;gap:22px}.gallery-columns{display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px}.gallery-card ul{padding-left:18px}.receipt-table{overflow:hidden}.receipt-table div{display:grid;grid-template-columns:260px 1fr;gap:20px;padding:18px 22px;border-bottom:1px solid rgba(255,255,255,.10)}.receipt-table div:last-child{border-bottom:0}.receipt-table b{color:var(--mint)}
.proof-console{padding:26px;border-radius:34px;min-height:470px}.console-head{display:flex;justify-content:space-between;gap:14px;text-transform:uppercase;letter-spacing:.2em;color:var(--mint);font-size:11px;font-weight:900;margin-bottom:22px}.console-head b{color:var(--gold)}.console-grid{display:grid;grid-template-columns:220px 1fr;gap:18px}.gate-list{display:grid;gap:10px}.gate{display:grid;grid-template-columns:34px 1fr;border:1px solid var(--line);background:rgba(255,255,255,.06);color:var(--text);border-radius:15px;padding:12px;text-align:left}.gate strong{color:var(--gold)}.gate span{font-weight:900}.gate small{grid-column:2;color:var(--muted)}.gate.active{background:rgba(115,255,215,.18);box-shadow:0 0 24px rgba(115,255,215,.20);border-color:var(--mint)}.receipt-orbit{min-height:300px;border-radius:24px;background:radial-gradient(circle at 55% 42%,rgba(115,255,215,.52),rgba(112,233,255,.16) 18%,rgba(255,233,141,.10) 32%,rgba(0,0,0,.45) 56%);border:1px solid rgba(255,255,255,.12);display:grid;place-items:center;position:relative;overflow:hidden}.receipt-orbit:before,.receipt-orbit:after{content:"";position:absolute;inset:22%;border:1px dashed rgba(255,255,255,.25);border-radius:50%;animation:spin 16s linear infinite}.receipt-orbit:after{inset:12%;animation-duration:24s;border-color:rgba(115,255,215,.25)}@keyframes spin{to{transform:rotate(1turn)}}.ring{width:148px;height:148px;border-radius:50%;display:grid;place-items:center;background:conic-gradient(var(--mint) 0deg,var(--cyan) var(--angle,0deg),rgba(255,255,255,.08) var(--angle,0deg));position:relative;box-shadow:0 0 42px rgba(115,255,215,.26)}.ring:after{content:"";position:absolute;inset:14px;border-radius:50%;background:#03090c}.ring span,.ring small{z-index:1}.ring span{font-size:42px;font-weight:950}.ring small{text-transform:uppercase;letter-spacing:.2em;color:var(--mint);font-size:9px}.orbit-tags{position:absolute;bottom:18px;display:flex;gap:10px;flex-wrap:wrap;justify-content:center}.orbit-tags span{border:1px solid rgba(255,233,141,.38);border-radius:12px;padding:8px 10px;background:rgba(0,0,0,.32);text-transform:uppercase;font-size:10px;font-weight:900;letter-spacing:.12em}.console-log,.json-block{white-space:pre-wrap;overflow:auto;background:rgba(0,0,0,.45);border:1px solid rgba(255,255,255,.14);border-radius:18px;color:#d4fff1;padding:16px;margin-top:18px;max-height:360px}.tabs{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:16px}.tab{border:1px solid var(--line);background:rgba(255,255,255,.08);color:var(--text);border-radius:999px;padding:12px 16px;font-weight:900}.tab.active{background:linear-gradient(135deg,var(--gold),var(--mint));color:#03100e}.tab-panel{display:none}.tab-panel.active{display:block}.docket-lines{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-top:22px}.docket-lines span{padding:18px;border-radius:18px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.12)}.docket-lines b{display:block;color:var(--gold)}.verifier-result{font-size:28px;font-weight:950;padding:24px;border-radius:22px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.14)}.verifier-result.valid{background:rgba(115,255,215,.14);color:var(--mint);border-color:var(--mint)}.ud-footer{display:flex;align-items:center;justify-content:space-between;gap:18px;padding:26px clamp(18px,4vw,56px);border-top:1px solid rgba(255,255,255,.10);background:#020507;color:var(--muted);flex-wrap:wrap}.ud-footer a{color:var(--mint);text-decoration:none}.reveal{opacity:0;transform:translateY(18px);transition:opacity .7s ease,transform .7s ease}.reveal.visible{opacity:1;transform:none}
@media (max-width:980px){.hero-split,.scenario-grid,.deliverable-grid,.steps,.gallery-columns{grid-template-columns:1fr}.ud-nav{align-items:flex-start;flex-direction:column}.ud-nav nav{justify-content:flex-start}.brand{min-width:0}.console-grid{grid-template-columns:1fr}.docket-lines{grid-template-columns:1fr 1fr}.receipt-table div{grid-template-columns:1fr}.ud-hero h1{font-size:clamp(46px,14vw,84px)}}@media (prefers-reduced-motion:reduce){*,*:before,*:after{animation:none!important;transition:none!important}}
`;

const js = `
(() => {
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => [...r.querySelectorAll(s)];
  const canvas = $('#delight-field');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let w=0,h=0,points=[];
    const resize=()=>{w=canvas.width=innerWidth;h=canvas.height=innerHeight;points=Array.from({length:Math.min(110,Math.floor(w*h/16000))},()=>({x:Math.random()*w,y:Math.random()*h,vx:(Math.random()-.5)*.18,vy:(Math.random()-.5)*.18,r:Math.random()*1.6+.4,c:Math.random()>.68?'#ffe98d':Math.random()>.35?'#73ffd7':'#a893ff'}));};
    addEventListener('resize',resize,{passive:true}); resize();
    const draw=()=>{ctx.clearRect(0,0,w,h); for(const p of points){p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>w)p.vx*=-1;if(p.y<0||p.y>h)p.vy*=-1;ctx.beginPath();ctx.fillStyle=p.c;ctx.globalAlpha=.82;ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill();} for(let i=0;i<points.length;i++){for(let j=i+1;j<points.length;j++){const a=points[i],b=points[j],d=Math.hypot(a.x-b.x,a.y-b.y); if(d<110){ctx.strokeStyle='#73ffd7';ctx.globalAlpha=(110-d)/700;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();}}} ctx.globalAlpha=1; requestAnimationFrame(draw)}; draw();
  }
  const observer = new IntersectionObserver(entries => entries.forEach(e => e.isIntersecting && e.target.classList.add('visible')), {threshold:.08});
  $$('.reveal').forEach(el=>observer.observe(el));
  const score=$('#readiness-score'), ring=$('#readiness-ring'), state=$('#console-state'), log=$('#console-log');
  const gates=$$('.gate');
  const messages=['Mission contract committed.','Evidence categories mapped.','Criteria linked to proof.','Human review preserved.','Authorized decision recorded.','Mission Receipt signed and replayable.'];
  function setProgress(step){ gates.forEach((g,i)=>g.classList.toggle('active',i<=step)); const pct=Math.max(0,Math.round(((step+1)/gates.length)*100)); if(score) score.textContent=String(pct); if(ring) ring.style.setProperty('--angle', (pct*3.6)+'deg'); if(state) state.textContent=pct===100?'Ready':'Running'; if(log) log.textContent=messages.slice(0,step+1).map(m=>'· '+m).join('\n'); }
  function launch(){ let i=-1; if(log) log.textContent='Proof cycle launched.'; if(score) score.textContent='0'; if(ring) ring.style.setProperty('--angle','0deg'); gates.forEach(g=>g.classList.remove('active')); const tick=()=>{i++; setProgress(i); if(i<gates.length-1) setTimeout(tick,430);}; setTimeout(tick,250); }
  $('#launch-cycle')?.addEventListener('click',launch);
  $$('.launch-scenario').forEach(btn=>btn.addEventListener('click',()=>{ if(log) log.textContent='Loaded demo mission: '+btn.dataset.scenario+'\nClick Launch proof cycle to watch it complete.'; btn.closest('.scenario-card')?.classList.add('selected'); }));
  $$('.tab').forEach(tab=>tab.addEventListener('click',()=>{ const id=tab.dataset.tab; $$('.tab').forEach(t=>t.classList.toggle('active',t===tab)); $$('.tab-panel').forEach(p=>p.classList.toggle('active',p.dataset.panel===id)); }));
  $$('[data-docket-tab]').forEach(btn=>btn.addEventListener('click',()=>{$('.tab[data-tab="'+btn.dataset.docketTab+'"]')?.click()}));
  $('#verify-receipt')?.addEventListener('click',()=>{ const box=$('#verifier-result'); if(box){box.textContent='Valid demo receipt · evidence hash matched · human decision preserved';box.classList.remove('pending');box.classList.add('valid');}});
  $('#reset-verifier')?.addEventListener('click',()=>{ const box=$('#verifier-result'); if(box){box.textContent='Awaiting verification';box.classList.remove('valid');box.classList.add('pending');}});
  addEventListener('keydown',(e)=>{ if(e.key.toLowerCase()==='g') launch(); if(e.key.toLowerCase()==='h') alert('GoalOS demo shortcuts: G launches the proof cycle. Use the navigation to inspect the Evidence Docket, Receipt Verifier, and Autonomous Demo.'); });
})();
`;

write('assets/user-delight.css', css);
write('assets/user-delight.js', js);
write('demo-lab.html', demoLabPage());
write('proof-mission-builder.html', proofMissionBuilderPage());
write('demo-gallery.html', demoGalleryPage());
write('evidence-docket-lab.html', evidenceDocketLabPage());
write('receipt-verifier-demo.html', verifierDemoPage());
write('autonomous-demo.html', autonomousDemoPage());
writeIfMissing('start.html', fallbackPage('Start with one AI deliverable.', 'Start here', 'Start', 'Use the demo lab to understand the product, then inspect a sample Evidence Docket and verify a sample Mission Receipt.', [['demo-lab.html','Launch demo lab','primary'],['proof-mission-builder.html','Build a Proof Mission','secondary'],['receipt-verifier-demo.html','Verify demo receipt','secondary']]));
writeIfMissing('examples.html', fallbackPage('See proof missions in context.', 'Examples', 'Examples', 'Browse public-safe examples for AI research, automation delivery, grant milestones, and vendor review.', [['demo-gallery.html','Open demo gallery','primary'],['evidence-docket-lab.html','Inspect sample docket','secondary']]));
writeIfMissing('request-access.html', fallbackPage('Request private beta access.', 'Private beta', 'Proof mission', 'Send only a public-safe business summary to info@quebec.ai. The public site does not collect forms, uploads, accounts, wallets, cookies, or analytics.', [['mailto:info@quebec.ai?subject=GoalOS%20Signoff%20Pro%20public-safe%20inquiry','Email info@quebec.ai','primary'],['demo-lab.html','Try demo first','secondary']]));
writeIfMissing('no-user-data.html', fallbackPage('No user data is requested.', 'Data posture', 'Data posture', 'The public website is informational and demo-only: no forms, no uploads, no sign-in, no wallet, no cookies, and no analytics.', [['demo-lab.html','Run browser-local demo','primary'],['request-access.html','Contact with public-safe summary','secondary']]));
writeIfMissing('agialpha.html', fallbackPage('$AGIALPHA is external to GoalOS Signoff Pro.', '$AGIALPHA', '$AGIALPHA', '$AGIALPHA is an external Ethereum Mainnet ERC-20 token at 0xA61a3B3a130a9c20768EEBF97E21515A6046a1fA. It is not sold, issued, brokered, custodied, distributed, redeemed, staked, or made available by GoalOS, MontrealAI, or QuebecAI.', [['agialpha-token-boundary.html','Read token boundary','primary'],['demo-lab.html','Return to demo','secondary']]));
writeIfMissing('agialpha-token-boundary.html', fallbackPage('External token boundary.', '$AGIALPHA boundary', '$AGIALPHA', '$AGIALPHA is external and already deployed on Ethereum Mainnet. The public website does not sell, broker, custody, distribute, redeem, stake, or make it available.', [['agialpha.html','AGIALPHA page','primary'],['no-user-data.html','Data posture','secondary']]));
writeDemoArtifacts();

function injectRail(fileName) {
  const file = path.join(siteDir, fileName);
  if (!fs.existsSync(file)) return;
  let html = fs.readFileSync(file, 'utf8');
  if (html.includes('user-delight-rail')) return;
  const rail = `<section class="user-delight-rail" style="max-width:1180px;margin:80px auto;padding:0 24px"><div style="border:1px solid rgba(255,255,255,.14);border-radius:28px;padding:28px;background:linear-gradient(135deg,rgba(115,255,215,.12),rgba(255,255,255,.05));box-shadow:0 30px 90px rgba(0,0,0,.35)"><p style="color:#73ffd7;text-transform:uppercase;letter-spacing:.28em;font-weight:900;font-size:12px">Try GoalOS in 60 seconds</p><h2 style="font-size:clamp(34px,5vw,64px);line-height:.94;margin:0 0 16px;color:#f8f4e8">Run a browser-local proof mission demo.</h2><p style="color:#dbe8e8;max-width:760px;font-size:18px;line-height:1.5">No sign-in, no upload, no wallet. Watch a sample AI deliverable become a mission, evidence docket, review state, and receipt.</p><div style="display:flex;gap:12px;flex-wrap:wrap;margin-top:22px"><a style="background:linear-gradient(135deg,#ffe98d,#73ffd7,#70e9ff);color:#03100e;text-decoration:none;padding:14px 18px;border-radius:999px;font-weight:900" href="demo-lab.html">Launch demo lab</a><a style="color:#f8f4e8;text-decoration:none;padding:14px 18px;border-radius:999px;background:rgba(255,255,255,.10);font-weight:900" href="evidence-docket-lab.html">Inspect sample docket</a><a style="color:#f8f4e8;text-decoration:none;padding:14px 18px;border-radius:999px;background:rgba(255,255,255,.10);font-weight:900" href="receipt-verifier-demo.html">Verify demo receipt</a></div></div></section>`;
  html = html.replace('</body>', `${rail}\n</body>`);
  if (!html.includes('assets/user-delight.css')) {
    html = html.replace('</head>', '<link rel="stylesheet" href="assets/user-delight.css">\n</head>');
  }
  fs.writeFileSync(file, html);
}
['index.html','start.html','proof-mission.html','examples.html'].forEach(injectRail);

const manifest = {
  version: config.version || '3.0.0-final',
  generatedAt: new Date().toISOString(),
  product: 'GoalOS Signoff Pro',
  mode: 'user-delight-autopilot',
  contactEmail,
  pages: ['demo-lab.html','proof-mission-builder.html','demo-gallery.html','evidence-docket-lab.html','receipt-verifier-demo.html','autonomous-demo.html'],
  demoArtifacts: ['demo/proof-mission/mission-contract.json','demo/proof-mission/evidence-docket.json','demo/proof-mission/mission-receipt.json'],
  posture: config.posture || {},
  fileHashes: {}
};
for (const rel of manifest.pages.concat(manifest.demoArtifacts, ['assets/user-delight.css','assets/user-delight.js'])) {
  const file = path.join(siteDir, rel);
  if (fs.existsSync(file)) manifest.fileHashes[rel] = sha256(fs.readFileSync(file));
}
write('user-delight-manifest.json', json(manifest));
console.log(`GoalOS User Delight Autopilot generated ${manifest.pages.length} pages and ${manifest.demoArtifacts.length} demo artifacts`);
