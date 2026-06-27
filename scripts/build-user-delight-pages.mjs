#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = process.cwd();
const siteDir = path.join(root, 'site');
const contactEmail = 'info@quebec.ai';
const baseUrl = 'https://montrealai.github.io/goalos-signoff-pro/';
const version = '4.0.0-final';
fs.mkdirSync(siteDir, { recursive: true });
fs.mkdirSync(path.join(siteDir, 'assets'), { recursive: true });
fs.mkdirSync(path.join(siteDir, 'demo', 'proof-mission'), { recursive: true });

const esc = (value = '') => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#39;');
const sha256 = (value) => crypto.createHash('sha256').update(value).digest('hex');
const json = (value) => JSON.stringify(value, null, 2);

function write(rel, content) {
  const file = path.join(siteDir, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
}

const scenarios = [
  {
    id: 'ai-research-report',
    title: 'AI research report acceptance',
    short: 'A strategy report becomes a reviewable decision package.',
    audience: 'AI consultants, strategy teams, founders, operators',
    input: 'A market or product research report that needs explicit acceptance before it is reused.',
    objective: 'Determine whether the report is complete enough to support a decision.',
    criteria: ['Three competitors covered', 'Sources identified', 'Risks surfaced', 'Recommendation stated'],
    outputs: ['Mission Contract', 'Claims Matrix', 'Evidence Docket', 'Signed Mission Receipt'],
    decision: 'Accepted with two visible limitations and one follow-up question.'
  },
  {
    id: 'automation-delivery',
    title: 'Automation delivery review',
    short: 'A workflow handoff becomes acceptance-ready.',
    audience: 'Agencies, operators, software teams',
    input: 'A delivered automation, runbook, or integration that needs client signoff.',
    objective: 'Verify that the implementation meets the agreed acceptance criteria.',
    criteria: ['Workflow described', 'Test evidence present', 'Known limitations listed', 'Rollback path visible'],
    outputs: ['Verifier Report', 'Risk Ledger', 'Action Graph', 'Mission Receipt'],
    decision: 'Ready for human approval after final runbook check.'
  },
  {
    id: 'grant-milestone',
    title: 'Grant / milestone proof',
    short: 'A milestone becomes a proof docket instead of an email thread.',
    audience: 'Grant programs, DAOs, research labs, foundations',
    input: 'A milestone report, deliverable set, or implementation summary.',
    objective: 'Show exactly what was promised, what was delivered, and what remains open.',
    criteria: ['Deliverables mapped', 'Evidence attached as hashes', 'Reviewer notes preserved', 'Open items listed'],
    outputs: ['Docket Manifest', 'Milestone Receipt', 'Reviewer Notes', 'Replay Path'],
    decision: 'Accepted for the specified version only.'
  },
  {
    id: 'vendor-review',
    title: 'Vendor or AI tool review',
    short: 'A procurement decision becomes evidence-bound.',
    audience: 'Enterprise AI teams, procurement, risk teams',
    input: 'A vendor comparison or AI tool evaluation that needs defensible review.',
    objective: 'Separate supported claims from assumptions before adoption.',
    criteria: ['Claims matrix complete', 'Contradictions surfaced', 'Risk ledger present', 'Decision options clear'],
    outputs: ['Executive Brief', 'Decision State', 'Risk Ledger', 'Capability Package'],
    decision: 'Request changes: missing security evidence before acceptance.'
  }
];

const demoReceipt = {
  receiptId: 'GSP-DEMO-2026-001',
  product: 'GoalOS Signoff Pro',
  mission: 'AI research report acceptance',
  decision: 'ACCEPTED_FOR_REVIEW_REPLAY',
  issuer: 'GoalOS Signoff Pro Demo Console',
  issuedAt: '2026-06-27T00:00:00.000Z',
  evidenceHash: 'sha256:9a10f427c5ce4d4379e62a84aeb6fa64d9d15cb2aa0f2a3e7f734e0e5b611a0c',
  publicSafe: true,
  dataPosture: 'No user data. No upload. No wallet. No cookies. No analytics.',
  contact: contactEmail
};

const demoDocket = {
  docketId: 'GSP-DOCKET-DEMO-001',
  publicSafe: true,
  title: 'Sample Evidence Docket — AI research report acceptance',
  manifest: {
    mission: 'AI research report acceptance',
    objective: 'Determine whether a report is complete enough to support a decision.',
    boundary: 'Public-safe demonstration only; no private customer material.'
  },
  claimsMatrix: [
    { claim: 'Competitor coverage is complete for the agreed scope.', evidence: 'Competitor table hash', status: 'supported' },
    { claim: 'Limitations are visible before acceptance.', evidence: 'Risk ledger hash', status: 'supported' },
    { claim: 'Recommendation is linked to evidence.', evidence: 'Decision state hash', status: 'supported' }
  ],
  verifierReport: {
    verdict: 'Ready for human decision',
    checks: ['mission contract present', 'claims mapped', 'risk ledger present', 'receipt replay available']
  },
  riskLedger: [
    'Sources may be time-sensitive.',
    'Recommendation depends on pricing remaining current.',
    'Demo does not contain private data or production credentials.'
  ],
  receipt: demoReceipt
};

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
  return `<header class="ud-nav"><a class="brand" href="index.html"><span class="brand-orb"></span><span><b>GoalOS Signoff Pro</b><small>User Activation Console</small></span></a><nav>${links.map(([href, label]) => `<a class="${label === active ? 'active' : ''}" href="${href}">${esc(label)}</a>`).join('')}</nav><a class="beta" href="request-access.html">Private beta</a></header>`;
}

function layout({ fileName, title, eyebrow, active, description, body }) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)} · GoalOS Signoff Pro</title>
<meta name="description" content="${esc(description)}">
<meta property="og:title" content="${esc(title)} · GoalOS Signoff Pro">
<meta property="og:description" content="${esc(description)}">
<meta property="og:type" content="website">
<meta property="og:url" content="${baseUrl}${fileName}">
<link rel="stylesheet" href="assets/asi-apex-v6.css">
<link rel="stylesheet" href="assets/user-delight-v4.css">
</head>
<body class="ud-body" data-page="${esc(active)}">
<canvas id="delight-field" aria-hidden="true"></canvas>
<div class="ud-aurora" aria-hidden="true"></div>
${nav(active)}
<main class="ud-main">
<section class="ud-hero reveal">
<p class="eyebrow"><span></span>${esc(eyebrow)}</p>
<h1>${title}</h1>
${body}
</section>
</main>
<footer class="ud-footer"><b>GoalOS Signoff Pro</b><span>No sign-in · no upload · no wallet · no cookies · no analytics</span><a href="mailto:${contactEmail}?subject=GoalOS%20Signoff%20Pro%20public-safe%20inquiry">${contactEmail}</a></footer>
<script src="assets/user-delight-v4.js"></script>
</body>
</html>`;
}

function chips(items) {
  return items.map((item) => `<span>${esc(item)}</span>`).join('');
}

function proofConsole() {
  const gates = [
    ['01', 'Commission', 'Work requested'],
    ['02', 'Submit', 'Evidence delivered'],
    ['03', 'Map', 'Claims linked'],
    ['04', 'Review', 'Human assessment'],
    ['05', 'Accept', 'Authorized decision'],
    ['06', 'Receipt', 'Signed and replayable']
  ];
  return `<div class="proof-console" id="proof-console">
    <div class="console-head"><span>Proof-to-acceptance console</span><b id="console-state">Awaiting mission</b></div>
    <div class="console-grid">
      <div class="gate-list" id="gate-list">${gates.map(([n, g, d], i) => `<button class="gate" type="button" data-gate="${i}"><strong>${n}</strong><span>${g}</span><small>${d}</small></button>`).join('')}</div>
      <div class="receipt-orbit"><div class="ring" id="readiness-ring"><span id="readiness-score">0</span><small>readiness</small></div><div class="orbit-tags"><span>Evidence mapped</span><span>Integrity sealed</span><span>Human gate</span></div></div>
    </div>
    <pre class="console-log" id="console-log">System ready. Choose a mission or launch the proof cycle.</pre>
  </div>`;
}

function scenarioCards() {
  return scenarios.map((s, i) => `<article class="scenario-card" data-scenario="${esc(s.id)}"><div class="scenario-index">${String(i + 1).padStart(2, '0')}</div><h3>${esc(s.title)}</h3><p>${esc(s.short)}</p><p class="mini-label">Audience</p><p class="muted">${esc(s.audience)}</p><button class="ghost launch-scenario" type="button" data-scenario="${esc(s.id)}">Load this mission</button></article>`).join('');
}

function demoLabPage() {
  const body = `<div class="hero-split"><div><p class="lead">A real product demo, not a blank theatre: choose a public-safe mission, launch the acceptance cycle, watch the gates advance, then inspect the sample docket and verify the demo receipt.</p><div class="cta-row"><button class="primary" id="launch-cycle" type="button">Launch proof cycle</button><a class="secondary" href="evidence-docket-lab.html">Inspect sample docket</a><a class="secondary" href="receipt-verifier-demo.html">Verify demo receipt</a></div><div class="trust-row">${chips(['No sign-in','No upload','No wallet','No cookies','No analytics'])}</div></div>${proofConsole()}</div><section class="section reveal"><p class="eyebrow"><span></span>Choose a public-safe mission</p><h2>Four demos users can understand immediately.</h2><div class="scenario-grid">${scenarioCards()}</div></section><section class="section reveal"><p class="eyebrow"><span></span>What the demo creates</p><div class="deliverable-grid"><article><h3>Mission Contract</h3><p>Objective, acceptance criteria, authority, boundary, and done condition.</p></article><article><h3>Evidence Docket</h3><p>Claims, evidence, verifier notes, risk ledger, and replay path.</p></article><article><h3>Decision State</h3><p>What passed, what remains uncertain, and what needs human judgment.</p></article><article><h3>Mission Receipt</h3><p>Accepted version, hash, timestamp, issuer, and verification posture.</p></article></div></section>`;
  write('demo-lab.html', layout({ fileName: 'demo-lab.html', title: 'Run a proof mission demo.', eyebrow: 'Browser-local demo lab', active: 'Demo lab', description: 'Run a browser-local GoalOS proof mission demo with gates, evidence mapping, human review, and receipt replay.', body }));
}

function proofMissionBuilderPage() {
  const body = `<div class="hero-split"><div><p class="lead">Select one serious AI deliverable. GoalOS turns it into a proof mission: contract, criteria, evidence, verifier report, decision state, receipt, and reusable capability package.</p><div class="cta-row"><a class="primary" href="demo-lab.html">Run demo first</a><a class="secondary" href="request-access.html">Request a Proof Mission</a></div></div><div class="builder-panel"><h3>48-hour Proof Mission</h3><ol><li>Define the work.</li><li>Map proof to each claim.</li><li>Review the decision state.</li><li>Seal the receipt.</li><li>Reuse what was learned.</li></ol></div></div><section class="section reveal"><p class="eyebrow"><span></span>Mission templates</p><div class="scenario-grid">${scenarioCards()}</div></section>`;
  write('proof-mission-builder.html', layout({ fileName: 'proof-mission-builder.html', title: 'Build a Proof Mission in minutes.', eyebrow: 'Mission builder', active: 'Proof mission', description: 'Choose a proof mission template and see the GoalOS deliverable package.', body }));
}

function galleryPage() {
  const cards = scenarios.map((s) => `<article class="gallery-card"><h3>${esc(s.title)}</h3><p>${esc(s.objective)}</p><div class="gallery-columns"><div><b>Input</b><p>${esc(s.input)}</p></div><div><b>Criteria</b><ul>${s.criteria.map(c => `<li>${esc(c)}</li>`).join('')}</ul></div><div><b>Outputs</b><ul>${s.outputs.map(o => `<li>${esc(o)}</li>`).join('')}</ul></div></div><span class="decision">${esc(s.decision)}</span></article>`).join('');
  write('demo-gallery.html', layout({ fileName: 'demo-gallery.html', title: 'See Proof Missions in context.', eyebrow: 'Demo gallery', active: 'Examples', description: 'Browse public-safe GoalOS Proof Mission examples.', body: `<p class="lead">Examples make the product concrete. Each public-safe scenario shows the input, the proof path, and the decision state.</p><div class="gallery-list">${cards}</div>` }));
}

function evidenceDocketPage() {
  const panels = [
    ['Manifest', demoDocket.manifest],
    ['Claims matrix', demoDocket.claimsMatrix],
    ['Verifier report', demoDocket.verifierReport],
    ['Risk ledger', demoDocket.riskLedger],
    ['Receipt', demoReceipt]
  ];
  const body = `<p class="lead">A public-safe sample Evidence Docket. It shows what proof looks like without collecting or exposing user data.</p><div class="tabs">${panels.map(([name], i) => `<button class="tab ${i === 0 ? 'active' : ''}" type="button" data-tab="${esc(name)}">${esc(name)}</button>`).join('')}</div>${panels.map(([name, data], i) => `<section class="tab-panel ${i === 0 ? 'active' : ''}" data-panel="${esc(name)}"><h2>${esc(name)}</h2><pre class="json-block">${esc(json(data))}</pre></section>`).join('')}<div class="cta-row"><a class="primary" href="receipt-verifier-demo.html">Verify demo receipt</a><a class="secondary" href="demo/proof-mission/evidence-docket.json">Open JSON docket</a></div>`;
  write('evidence-docket-lab.html', layout({ fileName: 'evidence-docket-lab.html', title: 'Inspect a sample Evidence Docket.', eyebrow: 'Evidence Docket Lab', active: 'Evidence docket', description: 'Inspect a sample public-safe Evidence Docket with claims, verifier report, risk ledger, and receipt.', body }));
}

function verifierPage() {
  const body = `<div class="hero-split"><div><p class="lead">The verifier demonstrates the acceptance record: receipt ID, decision state, evidence hash, issuer, and public-safe data posture.</p><div class="cta-row"><button class="primary" id="verify-receipt" type="button">Verify demo receipt</button><button class="secondary" id="reset-verifier" type="button">Reset</button></div><div id="verifier-result" class="verifier-result pending">Awaiting verification</div></div><div class="verifier-card"><h3>Demo receipt JSON</h3><pre class="json-block">${esc(json(demoReceipt))}</pre></div></div>`;
  write('receipt-verifier-demo.html', layout({ fileName: 'receipt-verifier-demo.html', title: 'Verify a demo Mission Receipt.', eyebrow: 'Receipt verifier', active: 'Verifier', description: 'Verify a sample GoalOS Mission Receipt in a browser-local public demo.', body }));
}

function autonomousDemoPage() {
  const body = `<p class="lead">The GitHub Action version generates the same kind of public-safe proof package as a downloadable artifact. Nontechnical users can run it from the Actions tab.</p><div class="steps"><article><b>01</b><h3>Open Actions</h3><p>Select User Delight Demo Autopilot.</p></article><article><b>02</b><h3>Choose scenario</h3><p>AI research, automation, grant, or vendor review.</p></article><article><b>03</b><h3>Run workflow</h3><p>GitHub generates the proof package.</p></article><article><b>04</b><h3>Download artifact</h3><p>Inspect mission contract, docket, ledger, and receipt.</p></article></div><div class="cta-row"><a class="primary" href="demo-lab.html">Try browser demo</a><a class="secondary" href="demo/proof-mission/public-report.html">Open generated report</a></div>`;
  write('autonomous-demo.html', layout({ fileName: 'autonomous-demo.html', title: 'Run the demo autonomously.', eyebrow: 'GitHub Actions autopilot', active: 'Demo lab', description: 'Run the GoalOS demo autonomously from GitHub Actions and download a proof package artifact.', body }));
}

function fallbackPages() {
  const pages = [
    ['start.html', 'Start with one AI deliverable.', 'Start here', 'Start', 'Understand GoalOS in one minute, then run the demo, inspect a sample Evidence Docket, and verify a Mission Receipt.', [['demo-lab.html','Launch demo lab'],['evidence-docket-lab.html','See example docket'],['receipt-verifier-demo.html','Verify receipt']]],
    ['examples.html', 'Proof Mission examples.', 'Examples', 'Examples', 'See how GoalOS applies to AI research, automation delivery, grant milestones, and vendor review.', [['demo-gallery.html','Open gallery'],['proof-mission-builder.html','Build mission']]],
    ['request-access.html', 'Request private beta access.', 'Private beta', 'Proof mission', 'Email only a non-sensitive business summary to info@quebec.ai. The public site has no form, upload, sign-in, wallet, cookie, or analytics.', [['mailto:info@quebec.ai?subject=GoalOS%20Signoff%20Pro%20public-safe%20inquiry','Email info@quebec.ai'],['demo-lab.html','Try demo first']]],
    ['no-user-data.html', 'No user data is requested.', 'Data posture', 'Data posture', 'The public site is informational and demo-only: no forms, no uploads, no sign-in, no wallet, no cookies, and no analytics.', [['demo-lab.html','Run browser-local demo']]],
    ['agialpha.html', '$AGIALPHA is external.', '$AGIALPHA', '$AGIALPHA', '$AGIALPHA is an external Ethereum Mainnet ERC-20 token at 0xA61a3B3a130a9c20768EEBF97E21515A6046a1fA. It is not sold, issued, brokered, custodied, distributed, redeemed, staked, or made available by GoalOS, MontrealAI, or QuebecAI.', [['agialpha-token-boundary.html','Read boundary']]],
    ['agialpha-token-boundary.html', 'External token boundary.', '$AGIALPHA boundary', '$AGIALPHA', '$AGIALPHA is external to the public site and not part of a sale, custody, brokerage, redemption, staking, or investment offer by GoalOS, MontrealAI, or QuebecAI.', [['agialpha.html','AGIALPHA page']]],
    ['proof-mission.html', 'Request a 48-hour Proof Mission.', 'Proof Mission', 'Proof mission', 'Start with one serious AI deliverable. Inspect the demo, then request a public-safe pilot conversation through info@quebec.ai.', [['proof-mission-builder.html','Build a Proof Mission'],['demo-lab.html','Run demo first']]],
    ['evidence-docket-demo.html', 'See what proof looks like.', 'Evidence Docket', 'Evidence docket', 'Inspect a public-safe sample Evidence Docket: manifest, claims matrix, provenance, verifier report, risk ledger, decision state, and receipt.', [['evidence-docket-lab.html','Open Evidence Docket Lab'],['receipt-verifier-demo.html','Verify demo receipt']]],
    ['verify.html', 'Verify a Mission Receipt.', 'Verifier', 'Verifier', 'Use the browser-local demo verifier to see how a receipt confirms the accepted version, evidence hash, decision state, and replay path.', [['receipt-verifier-demo.html','Open verifier demo'],['demo-lab.html','Launch demo lab']]]
  ];
  for (const [file, title, eyebrow, active, lead, links] of pages) {
    if (!fs.existsSync(path.join(siteDir, file))) {
      const linkHtml = links.map(([href, label], i) => `<a class="${i === 0 ? 'primary' : 'secondary'}" href="${href}">${esc(label)}</a>`).join('');
      write(file, layout({ fileName: file, title, eyebrow, active, description: lead, body: `<p class="lead">${esc(lead)}</p><div class="cta-row">${linkHtml}</div>` }));
    }
  }
}

function writeDemoArtifacts() {
  write('demo/proof-mission/mission-contract.json', json({ missionId: 'GSP-DEMO-MISSION-001', title: scenarios[0].title, objective: scenarios[0].objective, criteria: scenarios[0].criteria, publicSafe: true, contact: contactEmail }));
  write('demo/proof-mission/evidence-docket.json', json(demoDocket));
  write('demo/proof-mission/mission-receipt.json', json(demoReceipt));
  write('demo/proof-mission/verifier-report.json', json(demoDocket.verifierReport));
  write('demo/proof-mission/risk-ledger.json', json(demoDocket.riskLedger));
  write('demo/proof-mission/public-report.html', layout({ fileName: 'demo/proof-mission/public-report.html', title: 'Demo Proof Mission Report', eyebrow: 'Generated report', active: 'Demo lab', description: 'Public-safe generated Proof Mission report.', body: `<p class="lead">This generated report summarizes the demo proof package.</p><pre class="json-block">${esc(json({ mission: scenarios[0], docket: demoDocket, receipt: demoReceipt }))}</pre>` }));
}

function stripExistingRail(html) {
  return html.replace(/\n?<section class="user-delight-rail"[\s\S]*?<\/section>\n?/g, '\n');
}

function injectHomepageRail(fileName) {
  const file = path.join(siteDir, fileName);
  if (!fs.existsSync(file)) return;
  let html = fs.readFileSync(file, 'utf8');
  html = stripExistingRail(html);
  if (!html.includes('assets/user-delight-v4.css')) html = html.replace('</head>', '<link rel="stylesheet" href="assets/user-delight-v4.css">\n</head>');
  if (!html.includes('assets/user-delight-v4.js')) html = html.replace('</body>', '<script src="assets/user-delight-v4.js"></script>\n</body>');
  const rail = `<section class="user-delight-rail reveal"><div class="rail-copy"><p class="rail-kicker">Try GoalOS in 60 seconds</p><h2>Run a browser-local proof mission demo.</h2><p>No sign-in, no upload, no wallet. Watch a sample AI deliverable become a mission, Evidence Docket, review state, and Mission Receipt.</p><div class="rail-actions"><a class="rail-primary" href="demo-lab.html">Launch demo lab</a><a class="rail-secondary" href="evidence-docket-lab.html">Inspect sample docket</a><a class="rail-secondary" href="receipt-verifier-demo.html">Verify demo receipt</a></div></div><div class="rail-orbit" aria-hidden="true"><span>Mission</span><span>Evidence</span><span>Review</span><span>Receipt</span></div></section>`;
  // Insert the activation rail immediately after the homepage hero, not below legal/footer rails.
  if (html.includes('user-delight-rail')) return;
  const splitSectionIndex = html.search(/<section class="section split/i);
  const boundaryIndex = html.indexOf('boundary-rail');
  const mainIndex = html.search(/<main\b/i);
  if (splitSectionIndex >= 0) {
    html = `${html.slice(0, splitSectionIndex)}${rail}\n${html.slice(splitSectionIndex)}`;
  } else if (boundaryIndex >= 0) {
    html = `${html.slice(0, boundaryIndex)}${rail}\n${html.slice(boundaryIndex)}`;
  } else if (/<main\b[^>]*>/i.test(html)) {
    html = html.replace(/(<main\b[^>]*>)/i, `$1\n${rail}`);
  } else if (/<footer\b/i.test(html)) {
    html = html.replace(/<footer\b/i, `${rail}\n<footer`);
  } else {
    html = html.replace('</body>', `${rail}\n</body>`);
  }
  fs.writeFileSync(file, html);
}

const css = `
:root{--bg:#02070a;--panel:rgba(255,255,255,.085);--line:rgba(255,255,255,.16);--text:#fbf7ee;--muted:#b7c8c9;--mint:#73ffd7;--cyan:#72e8ff;--gold:#ffe98d;--violet:#b8a4ff;--shadow:0 34px 110px rgba(0,0,0,.42)}*{box-sizing:border-box}body.ud-body{margin:0;min-height:100vh;overflow-x:hidden;color:var(--text);background:radial-gradient(circle at 72% 8%,rgba(92,255,218,.20),transparent 28%),radial-gradient(circle at 18% 78%,rgba(168,147,255,.16),transparent 26%),linear-gradient(135deg,#020507,#06191a 48%,#03060d);font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}#delight-field{position:fixed;inset:0;z-index:-2;opacity:.72}.ud-aurora{position:fixed;inset:-20%;z-index:-3;background:conic-gradient(from 90deg at 50% 50%,transparent,rgba(115,255,215,.10),transparent,rgba(255,233,141,.08),transparent,rgba(168,147,255,.10),transparent);filter:blur(70px);animation:drift 22s linear infinite}@keyframes drift{to{transform:rotate(1turn)}}.ud-nav{position:sticky;top:0;z-index:50;display:flex;align-items:center;gap:24px;padding:18px clamp(18px,4vw,56px);background:rgba(2,7,10,.84);backdrop-filter:blur(18px);border-bottom:1px solid rgba(255,255,255,.10)}.brand{display:flex;align-items:center;gap:12px;text-decoration:none;color:var(--text);min-width:280px}.brand-orb{width:38px;height:38px;border-radius:14px;background:radial-gradient(circle,var(--mint),#0c2630 62%);box-shadow:0 0 34px rgba(115,255,215,.45);border:1px solid rgba(255,255,255,.24)}.brand b{display:block;font-size:12px;letter-spacing:.18em;text-transform:uppercase}.brand small{display:block;color:var(--muted);font-size:10px;letter-spacing:.22em;text-transform:uppercase}.ud-nav nav{display:flex;align-items:center;gap:8px;flex:1;justify-content:center;flex-wrap:wrap}.ud-nav nav a,.beta{color:var(--text);text-decoration:none;font-weight:850;font-size:12px;padding:10px 14px;border-radius:999px}.ud-nav nav a.active,.ud-nav nav a:hover{background:rgba(255,255,255,.12);box-shadow:inset 0 0 0 1px rgba(255,255,255,.16)}.beta{background:linear-gradient(135deg,var(--gold),var(--mint),var(--cyan));color:#03100e;box-shadow:0 0 32px rgba(115,255,215,.30)}.ud-main{max-width:1200px;margin:auto;padding:clamp(52px,7vw,92px) clamp(20px,4vw,40px)}.ud-hero h1{font-size:clamp(48px,8vw,116px);line-height:.88;letter-spacing:-.075em;max-width:940px;margin:0 0 24px}.eyebrow{font-size:12px;text-transform:uppercase;letter-spacing:.34em;color:var(--mint);font-weight:950}.eyebrow span{display:inline-block;width:34px;height:1px;background:var(--mint);vertical-align:middle;margin-right:12px}.lead{font-size:clamp(18px,2vw,24px);line-height:1.45;max-width:760px;color:#e9f7f4}.muted{color:var(--muted)}.hero-split{display:grid;grid-template-columns:minmax(0,1fr) minmax(420px,.98fr);gap:44px;align-items:center}.cta-row{display:flex;gap:14px;flex-wrap:wrap;margin:28px 0}.primary,.secondary,.ghost{border:0;border-radius:999px;padding:14px 18px;font-weight:950;text-decoration:none;display:inline-flex;align-items:center;justify-content:center;cursor:pointer}.primary{background:linear-gradient(135deg,var(--gold),var(--mint),var(--cyan));color:#03100e;box-shadow:0 0 38px rgba(115,255,215,.30)}.secondary,.ghost{background:rgba(255,255,255,.10);color:var(--text);box-shadow:inset 0 0 0 1px rgba(255,255,255,.18)}.ghost{border-radius:16px;width:100%;margin-top:10px}.trust-row{display:flex;gap:10px;flex-wrap:wrap;margin-top:26px}.trust-row span,.decision{padding:9px 12px;border-radius:999px;border:1px solid var(--line);background:rgba(115,255,215,.08);color:var(--mint);font-size:12px;font-weight:950;text-transform:uppercase;letter-spacing:.12em}.section{padding:clamp(72px,9vw,122px) 0}.section h2{font-size:clamp(36px,5.6vw,72px);line-height:.95;letter-spacing:-.06em;margin:0 0 34px}.scenario-grid,.deliverable-grid,.steps{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:18px}.scenario-card,.gallery-card,.builder-panel,.proof-console,.tab-panel,.verifier-card,.steps article,.deliverable-grid article{background:linear-gradient(135deg,rgba(255,255,255,.11),rgba(115,255,215,.05));border:1px solid rgba(255,255,255,.17);border-radius:30px;box-shadow:var(--shadow);backdrop-filter:blur(16px);padding:24px}.scenario-index{color:var(--gold);font-weight:950;letter-spacing:.12em}.scenario-card h3,.gallery-card h3,.builder-panel h3{font-size:24px;line-height:1.06;margin:12px 0}.mini-label{font-size:10px;text-transform:uppercase;letter-spacing:.2em;color:var(--mint);font-weight:950}.gallery-list{display:grid;gap:22px}.gallery-columns{display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px}.gallery-card ul{padding-left:18px}.proof-console{min-height:500px}.console-head{display:flex;justify-content:space-between;gap:14px;text-transform:uppercase;letter-spacing:.2em;color:var(--mint);font-size:11px;font-weight:950;margin-bottom:22px}.console-head b{color:var(--gold)}.console-grid{display:grid;grid-template-columns:230px 1fr;gap:18px}.gate-list{display:grid;gap:10px}.gate{display:grid;grid-template-columns:38px 1fr;border:1px solid var(--line);background:rgba(255,255,255,.07);color:var(--text);border-radius:16px;padding:12px;text-align:left}.gate strong{color:var(--gold)}.gate span{font-weight:950}.gate small{grid-column:2;color:var(--muted)}.gate.active{background:rgba(115,255,215,.18);box-shadow:0 0 24px rgba(115,255,215,.22);border-color:var(--mint)}.receipt-orbit{min-height:330px;border-radius:26px;background:radial-gradient(circle at 55% 42%,rgba(115,255,215,.56),rgba(112,233,255,.18) 18%,rgba(255,233,141,.11) 32%,rgba(0,0,0,.47) 56%);border:1px solid rgba(255,255,255,.14);display:grid;place-items:center;position:relative;overflow:hidden}.receipt-orbit:before,.receipt-orbit:after{content:"";position:absolute;inset:22%;border:1px dashed rgba(255,255,255,.28);border-radius:50%;animation:spin 16s linear infinite}.receipt-orbit:after{inset:12%;animation-duration:24s;border-color:rgba(115,255,215,.28)}@keyframes spin{to{transform:rotate(1turn)}}.ring{width:154px;height:154px;border-radius:50%;display:grid;place-items:center;background:conic-gradient(var(--mint) 0deg,var(--cyan) var(--angle,0deg),rgba(255,255,255,.10) var(--angle,0deg));position:relative;box-shadow:0 0 45px rgba(115,255,215,.30)}.ring:after{content:"";position:absolute;inset:14px;border-radius:50%;background:#03090c}.ring span,.ring small{z-index:1}.ring span{font-size:44px;font-weight:950}.ring small{text-transform:uppercase;letter-spacing:.2em;color:var(--mint);font-size:9px}.orbit-tags{position:absolute;bottom:18px;display:flex;gap:10px;flex-wrap:wrap;justify-content:center}.orbit-tags span{border:1px solid rgba(255,233,141,.40);border-radius:12px;padding:8px 10px;background:rgba(0,0,0,.34);text-transform:uppercase;font-size:10px;font-weight:950;letter-spacing:.12em}.console-log,.json-block{white-space:pre-wrap;overflow:auto;background:rgba(0,0,0,.48);border:1px solid rgba(255,255,255,.15);border-radius:18px;color:#d4fff1;padding:16px;margin-top:18px;max-height:380px}.tabs{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:16px}.tab{border:1px solid var(--line);background:rgba(255,255,255,.09);color:var(--text);border-radius:999px;padding:12px 16px;font-weight:950}.tab.active{background:linear-gradient(135deg,var(--gold),var(--mint));color:#03100e}.tab-panel{display:none}.tab-panel.active{display:block}.verifier-result{font-size:28px;font-weight:950;padding:24px;border-radius:22px;background:rgba(255,255,255,.09);border:1px solid rgba(255,255,255,.15)}.verifier-result.valid{background:rgba(115,255,215,.16);color:var(--mint);border-color:var(--mint)}.user-delight-rail{max-width:1180px;margin:clamp(32px,5vw,72px) auto;padding:0 24px;display:grid;grid-template-columns:minmax(0,1fr) 340px;gap:20px;align-items:center}.rail-copy{border:1px solid rgba(255,255,255,.16);border-radius:30px;padding:32px;background:linear-gradient(135deg,rgba(115,255,215,.14),rgba(255,255,255,.06));box-shadow:var(--shadow)}.rail-kicker{color:var(--mint);text-transform:uppercase;letter-spacing:.28em;font-weight:950;font-size:12px}.rail-copy h2{font-size:clamp(34px,5vw,64px);line-height:.94;margin:0 0 16px;color:#f8f4e8;letter-spacing:-.06em}.rail-copy p{color:#dbe8e8;max-width:760px;font-size:18px;line-height:1.5}.rail-actions{display:flex;gap:12px;flex-wrap:wrap;margin-top:22px}.rail-primary,.rail-secondary{border-radius:999px;padding:14px 18px;text-decoration:none;font-weight:950}.rail-primary{background:linear-gradient(135deg,var(--gold),var(--mint),var(--cyan));color:#03100e}.rail-secondary{color:#f8f4e8;background:rgba(255,255,255,.10)}.rail-orbit{min-height:250px;border:1px solid rgba(255,255,255,.16);border-radius:30px;background:radial-gradient(circle,var(--mint),rgba(112,233,255,.20) 22%,rgba(255,233,141,.08) 42%,rgba(255,255,255,.04));box-shadow:var(--shadow);display:grid;place-items:center;position:relative}.rail-orbit span{position:absolute;padding:9px 12px;border-radius:999px;background:rgba(0,0,0,.46);border:1px solid rgba(255,255,255,.16);font-size:12px;font-weight:900}.rail-orbit span:nth-child(1){top:24px}.rail-orbit span:nth-child(2){right:20px}.rail-orbit span:nth-child(3){bottom:24px}.rail-orbit span:nth-child(4){left:20px}.ud-footer{display:flex;align-items:center;justify-content:space-between;gap:18px;padding:26px clamp(18px,4vw,56px);border-top:1px solid rgba(255,255,255,.10);background:#020507;color:var(--muted);flex-wrap:wrap}.ud-footer a{color:var(--mint);text-decoration:none}.reveal{animation:rise .7s ease both}@keyframes rise{from{opacity:.001;transform:translateY(16px)}to{opacity:1;transform:none}}@media (max-width:980px){.hero-split,.scenario-grid,.deliverable-grid,.steps,.gallery-columns,.user-delight-rail{grid-template-columns:1fr}.ud-nav{align-items:flex-start;flex-direction:column}.ud-nav nav{justify-content:flex-start}.brand{min-width:0}.console-grid{grid-template-columns:1fr}.ud-hero h1{font-size:clamp(44px,13vw,82px)}}@media (prefers-reduced-motion:reduce){*,*:before,*:after{animation:none!important;transition:none!important}}
`;

const clientJs = String.raw`(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const canvas = $('#delight-field');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = 0;
    let height = 0;
    let points = [];
    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      points = Array.from({ length: Math.min(120, Math.floor(width * height / 15000)) }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
        r: Math.random() * 1.6 + 0.4,
        c: Math.random() > 0.68 ? '#ffe98d' : Math.random() > 0.35 ? '#73ffd7' : '#a893ff'
      }));
    };
    window.addEventListener('resize', resize, { passive: true });
    resize();
    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      for (const p of points) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
        ctx.beginPath();
        ctx.globalAlpha = 0.82;
        ctx.fillStyle = p.c;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const a = points[i];
          const b = points[j];
          const distance = Math.hypot(a.x - b.x, a.y - b.y);
          if (distance < 110) {
            ctx.globalAlpha = (110 - distance) / 700;
            ctx.strokeStyle = '#73ffd7';
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;
      window.requestAnimationFrame(draw);
    };
    draw();
  }

  const score = $('#readiness-score');
  const ring = $('#readiness-ring');
  const state = $('#console-state');
  const log = $('#console-log');
  const gates = $$('.gate');
  const messages = [
    'Mission contract committed.',
    'Evidence categories mapped.',
    'Criteria linked to proof.',
    'Human review preserved.',
    'Authorized decision recorded.',
    'Mission Receipt signed and replayable.'
  ];

  const setProgress = (step) => {
    gates.forEach((gate, index) => gate.classList.toggle('active', index <= step));
    const pct = Math.max(0, Math.round(((step + 1) / Math.max(1, gates.length)) * 100));
    if (score) score.textContent = String(pct);
    if (ring) ring.style.setProperty('--angle', (pct * 3.6) + 'deg');
    if (state) state.textContent = pct === 100 ? 'Ready' : 'Running';
    if (log) log.textContent = messages.slice(0, step + 1).map((message) => '· ' + message).join('\n');
  };

  const launch = () => {
    let step = -1;
    if (log) log.textContent = 'Proof cycle launched.';
    if (score) score.textContent = '0';
    if (ring) ring.style.setProperty('--angle', '0deg');
    gates.forEach((gate) => gate.classList.remove('active'));
    const tick = () => {
      step += 1;
      setProgress(step);
      if (step < gates.length - 1) window.setTimeout(tick, 430);
    };
    window.setTimeout(tick, 220);
  };

  $('#launch-cycle')?.addEventListener('click', launch);
  $$('.launch-scenario').forEach((button) => {
    button.addEventListener('click', () => {
      $$('.scenario-card').forEach((card) => card.classList.remove('selected'));
      button.closest('.scenario-card')?.classList.add('selected');
      if (log) log.textContent = 'Loaded demo mission: ' + button.dataset.scenario + '\nClick Launch proof cycle to watch it complete.';
    });
  });
  $$('.tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      const id = tab.dataset.tab;
      $$('.tab').forEach((item) => item.classList.toggle('active', item === tab));
      $$('.tab-panel').forEach((panel) => panel.classList.toggle('active', panel.dataset.panel === id));
    });
  });
  $('#verify-receipt')?.addEventListener('click', () => {
    const box = $('#verifier-result');
    if (box) {
      box.textContent = 'Valid demo receipt · evidence hash matched · human decision preserved';
      box.classList.remove('pending');
      box.classList.add('valid');
    }
  });
  $('#reset-verifier')?.addEventListener('click', () => {
    const box = $('#verifier-result');
    if (box) {
      box.textContent = 'Awaiting verification';
      box.classList.remove('valid');
      box.classList.add('pending');
    }
  });
  window.addEventListener('keydown', (event) => {
    if (event.key.toLowerCase() === 'g') launch();
  });
})();`;

write('assets/user-delight-v4.css', css);
write('assets/user-delight-v4.js', clientJs);
demoLabPage();
proofMissionBuilderPage();
galleryPage();
evidenceDocketPage();
verifierPage();
autonomousDemoPage();
fallbackPages();
writeDemoArtifacts();
['index.html', 'start.html', 'proof-mission.html', 'examples.html'].forEach(injectHomepageRail);

const manifest = {
  version,
  generatedAt: new Date().toISOString(),
  product: 'GoalOS Signoff Pro',
  mode: 'user-delight-autopilot-v4',
  contactEmail,
  pages: ['demo-lab.html','proof-mission-builder.html','demo-gallery.html','evidence-docket-lab.html','receipt-verifier-demo.html','autonomous-demo.html'],
  demoArtifacts: ['demo/proof-mission/mission-contract.json','demo/proof-mission/evidence-docket.json','demo/proof-mission/mission-receipt.json','demo/proof-mission/public-report.html'],
  fixes: ['demo content visible without JavaScript dependency', 'valid browser JavaScript', 'homepage rail inserted before footer'],
  fileHashes: {}
};
for (const rel of manifest.pages.concat(manifest.demoArtifacts, ['assets/user-delight-v4.css', 'assets/user-delight-v4.js'])) {
  const file = path.join(siteDir, rel);
  if (fs.existsSync(file)) manifest.fileHashes[rel] = sha256(fs.readFileSync(file));
}
write('user-delight-manifest.json', json(manifest));
console.log(`GoalOS User Delight Autopilot v4 generated ${manifest.pages.length} pages and ${manifest.demoArtifacts.length} demo artifacts`);
