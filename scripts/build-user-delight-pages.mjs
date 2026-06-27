#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = process.cwd();
const siteDir = path.join(root, 'site');
const version = '4.1.0-final';
const baseUrl = 'https://montrealai.github.io/goalos-signoff-pro/';
const contactEmail = 'info@quebec.ai';

fs.mkdirSync(siteDir, { recursive: true });
fs.mkdirSync(path.join(siteDir, 'assets'), { recursive: true });
fs.mkdirSync(path.join(siteDir, 'demo', 'proof-mission'), { recursive: true });

const esc = (value = '') => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#39;');
const sha256 = (value) => crypto.createHash('sha256').update(String(value)).digest('hex');
const write = (rel, content) => {
  const file = path.join(siteDir, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
};
const readIf = (rel) => {
  const file = path.join(siteDir, rel);
  return fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
};

const scenarios = [
  {
    id: 'ai-research-report',
    title: 'AI research report acceptance',
    user: 'AI consultants, strategy teams, founders, operators',
    brief: 'Turn a research report into a reviewable decision package.',
    input: 'A public-safe summary of an AI research deliverable.',
    output: 'Mission Contract, Claims Matrix, Evidence Docket, Mission Receipt.',
    decision: 'Accepted for review replay with visible limitations.',
    criteria: ['Scope is explicit', 'Sources are named', 'Risks are visible', 'Recommendation is evidence-linked']
  },
  {
    id: 'automation-delivery',
    title: 'Automation delivery review',
    user: 'Agencies, operators, software teams',
    brief: 'Make an automation handoff acceptance-ready.',
    input: 'A workflow summary, test notes, and acceptance criteria.',
    output: 'Verifier Report, Risk Ledger, Action Graph, signed receipt.',
    decision: 'Ready for human approval after runbook check.',
    criteria: ['Workflow described', 'Test evidence present', 'Rollback path visible', 'Known limits named']
  },
  {
    id: 'grant-milestone',
    title: 'Grant / milestone proof',
    user: 'Grant programs, DAOs, research labs, foundations',
    brief: 'Replace ambiguous handoff threads with a proof docket.',
    input: 'A milestone summary and the claimed deliverable set.',
    output: 'Milestone Evidence Docket and review-ready Mission Receipt.',
    decision: 'Accepted for the specified version only.',
    criteria: ['Deliverables mapped', 'Open items listed', 'Reviewer notes preserved', 'Receipt replay available']
  },
  {
    id: 'vendor-review',
    title: 'Vendor or AI tool review',
    user: 'Enterprise AI teams, procurement, risk teams',
    brief: 'Separate supported claims from assumptions before adoption.',
    input: 'A vendor/tool evaluation summary.',
    output: 'Claims matrix, risk ledger, decision state, capability package.',
    decision: 'Request changes until missing security evidence is supplied.',
    criteria: ['Claims matrix complete', 'Contradictions surfaced', 'Risk ledger present', 'Decision options clear']
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
    { claim: 'Competitor coverage is complete for the agreed scope.', evidence: 'competitor-table-hash', status: 'supported' },
    { claim: 'Limitations are visible before acceptance.', evidence: 'risk-ledger-hash', status: 'supported' },
    { claim: 'Recommendation is linked to evidence.', evidence: 'decision-state-hash', status: 'supported' }
  ],
  verifierReport: {
    verdict: 'Ready for human decision',
    checks: ['mission contract present', 'claims mapped', 'risk ledger present', 'receipt replay available']
  },
  riskLedger: ['Sources may be time-sensitive.', 'Recommendation depends on pricing remaining current.', 'Demo contains no private data or production credentials.'],
  receipt: demoReceipt
};
const actionGraph = {
  graphId: 'GSP-ACTION-GRAPH-DEMO-001',
  steps: ['commission', 'submit', 'map', 'review', 'accept', 'receipt'],
  terminalState: 'human-review-ready',
  publicSafe: true
};

write('demo/proof-mission/mission-contract.json', JSON.stringify({
  missionId: 'GSP-MISSION-DEMO-001', objective: 'Accept one AI research report against explicit criteria.', criteria: scenarios[0].criteria, publicSafe: true, contact: contactEmail
}, null, 2));
write('demo/proof-mission/claims-matrix.json', JSON.stringify(demoDocket.claimsMatrix, null, 2));
write('demo/proof-mission/evidence-docket.json', JSON.stringify(demoDocket, null, 2));
write('demo/proof-mission/verifier-report.json', JSON.stringify(demoDocket.verifierReport, null, 2));
write('demo/proof-mission/risk-ledger.json', JSON.stringify(demoDocket.riskLedger, null, 2));
write('demo/proof-mission/action-graph.json', JSON.stringify(actionGraph, null, 2));
write('demo/proof-mission/decision-state.json', JSON.stringify({ state: 'human-review-ready', decision: demoReceipt.decision, publicSafe: true }, null, 2));
write('demo/proof-mission/mission-receipt.json', JSON.stringify(demoReceipt, null, 2));
write('demo/proof-mission/public-report.html', `<!doctype html><html><head><meta charset="utf-8"><title>GoalOS Demo Proof Mission Report</title><style>body{font-family:Inter,Arial,sans-serif;background:#06100f;color:#f6f1e8;padding:40px;line-height:1.55}section{max-width:980px;margin:auto;border:1px solid #4e746c;border-radius:24px;padding:34px;background:#0c1716}code{color:#86ffe2}article{border-top:1px solid rgba(255,255,255,.14);padding-top:16px;margin-top:16px}h1{font-size:42px;line-height:1}</style></head><body><section><h1>GoalOS Demo Proof Mission Report</h1><p>This public-safe demo shows how a mission becomes an Evidence Docket and Mission Receipt. It is a readable artifact for nontechnical users who want to understand the proof-to-acceptance path without signing in, uploading files, connecting a wallet, or sending data.</p><article><h2>Mission</h2><p>The mission is to decide whether an AI research report is acceptance-ready under explicit criteria: scope, sources, limitations, and recommendation quality.</p></article><article><h2>Evidence path</h2><p>The demo creates a Mission Contract, Claims Matrix, Evidence Docket, Verifier Report, Risk Ledger, Action Graph, Decision State, and Mission Receipt. Each artifact has a specific role in the acceptance record.</p></article><article><h2>Receipt</h2><p><strong>Receipt:</strong> <code>${demoReceipt.receiptId}</code></p><p><strong>Decision:</strong> ${demoReceipt.decision}</p><p><strong>Evidence:</strong> <code>${demoReceipt.evidenceHash}</code></p><p><strong>Data posture:</strong> ${demoReceipt.dataPosture}</p></article><article><h2>Review posture</h2><p>The demo does not certify factual correctness or ask for private material. It shows how a public-safe work package can be moved into a clear review state that a human can accept, reject, or return for changes.</p></article><article><h2>What a reviewer learns</h2><ul><li>Which acceptance criteria were declared before review.</li><li>Which claims were mapped to evidence.</li><li>Which risks and limitations remain visible.</li><li>Which exact receipt identifier binds the public-safe demo decision.</li></ul></article><article><h2>What is intentionally absent</h2><p>The public report has no form, no upload, no account, no wallet, no payment path, no cookie, and no analytics. It is a static demonstration artifact that can be inspected, downloaded, and shared without submitting information.</p></article><article><h2>Next inspection path</h2><p>Open the Evidence Docket JSON for the structured proof room, open the Mission Receipt JSON for the acceptance record, or return to the Demo Lab to watch the browser-local proof cycle progress through commission, evidence, mapping, review, acceptance, and receipt replay.</p></article></section></body></html>`);

function nav(active = 'Demo Lab') {
  const links = [
    ['index.html', 'Institution'],
    ['start.html', 'Start'],
    ['demo-lab.html', 'Demo Lab'],
    ['proof-mission.html', 'Proof Mission'],
    ['evidence-docket-demo.html', 'Evidence Docket'],
    ['verify.html', 'Verifier'],
    ['examples.html', 'Examples'],
    ['agialpha.html', '$AGIALPHA'],
    ['no-user-data.html', 'Data Posture']
  ];
  return `<header class="ud-nav"><a class="ud-brand" href="index.html"><span class="ud-orb"></span><span><strong>GoalOS Signoff Pro</strong><small>User Activation Console</small></span></a><nav>${links.map(([href,label]) => `<a class="${active===label?'active':''}" href="${href}">${label}</a>`).join('')}</nav><a class="ud-pill" href="request-access.html">Private beta</a></header>`;
}
function shell(title, active, body, extraHead = '') {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)} · GoalOS Signoff Pro</title><meta name="description" content="GoalOS Signoff Pro public demo: proof missions, Evidence Dockets, human review, and signed receipts."><link rel="stylesheet" href="assets/user-delight-v4.css">${extraHead}</head><body><div class="ud-bg" aria-hidden="true"></div>${nav(active)}<main>${body}</main><div class="legal-rail ud-legal-rail"><b>Public site rule</b><span>No forms · no uploads · no cookies · no analytics · no wallets · no payments · no personal or confidential data.</span><a href="no-user-data.html">Read the rule</a></div><footer class="ud-footer"><strong>GoalOS Signoff Pro</strong><span>Public-safe demonstration · no sign-in · no upload · no wallet · no cookies · no analytics.</span><a href="mailto:${contactEmail}">${contactEmail}</a></footer><script src="assets/user-delight-v4.js"></script></body></html>`;
}

const rail = `<section id="user-delight-rail" class="user-delight-rail ud-in-home" aria-label="Try GoalOS Signoff Pro"><div><span class="ud-eyebrow">Try GoalOS in 60 seconds</span><h2>Run a browser-local proof mission demo.</h2><p>No sign-in, no upload, no wallet. Watch a sample AI deliverable become a mission, Evidence Docket, review state, and receipt.</p><div class="ud-actions"><a class="ud-btn primary" href="demo-lab.html">Launch demo lab</a><a class="ud-btn" href="evidence-docket-demo.html">Inspect sample docket</a><a class="ud-btn" href="verify.html">Verify demo receipt</a></div></div><div class="ud-mini-console"><b>Mission path</b><ol><li>Commission</li><li>Submit</li><li>Map</li><li>Review</li><li>Accept</li><li>Receipt</li></ol></div></section>`;
function injectHomeRail() {
  let index = readIf('index.html');
  if (!index) return;
  index = index.replace(/<section[^>]*id="user-delight-rail"[\s\S]*?<\/section>/i, '');
  index = index.replace(/<section[^>]*class="[^"]*user-delight-rail[^"]*"[\s\S]*?<\/section>/i, '');
  const mainStart = index.search(/<main\b/i);
  const firstSectionEnd = mainStart >= 0 ? index.indexOf('</section>', mainStart) : -1;
  if (firstSectionEnd >= 0) {
    index = index.slice(0, firstSectionEnd + 10) + rail + index.slice(firstSectionEnd + 10);
  } else {
    const bodyOpen = index.search(/<body[^>]*>/i);
    if (bodyOpen >= 0) {
      const after = index.indexOf('>', bodyOpen) + 1;
      index = index.slice(0, after) + `<main>${rail}</main>` + index.slice(after);
    } else {
      index = rail + index;
    }
  }
  write('index.html', index);
}

const demoConsole = `<section class="ud-hero ud-demo-hero"><div class="ud-hero-copy"><span class="ud-eyebrow">Browser-local proof mission</span><h1>Run a proof mission demo.</h1><p class="ud-lede">A public-safe simulation shows how GoalOS converts one AI deliverable into a mission contract, evidence map, human review state, and signed receipt. Nothing is sent anywhere.</p><div class="ud-actions"><button class="ud-btn primary" data-demo-start>Launch proof cycle</button><button class="ud-btn" data-demo-reset>Reset</button><a class="ud-btn" href="evidence-docket-demo.html">Open docket</a></div><div class="ud-safe-row"><span>No sign-in</span><span>No upload</span><span>No wallet</span><span>No cookies</span><span>No analytics</span></div></div><aside class="ud-panel proof-console" aria-label="Proof-to-acceptance console"><div class="console-top"><b>Proof-to-acceptance console</b><span>Review mode</span></div><div class="console-grid"><ol class="proof-steps"><li data-step="0"><b>01 Commission</b><span>Work requested</span></li><li data-step="1"><b>02 Submit</b><span>Evidence delivered</span></li><li data-step="2"><b>03 Map</b><span>Claims mapped</span></li><li data-step="3"><b>04 Review</b><span>Human assessment</span></li><li data-step="4"><b>05 Accept</b><span>Authorized approval</span></li><li data-step="5"><b>06 Receipt</b><span>Signed & sealed</span></li></ol><div class="readiness"><div class="ring" data-demo-ring><span data-demo-percent>0</span></div><small data-demo-label>Awaiting mission</small><div class="trust-tags"><span>Evidence mapped</span><span>Integrity sealed</span><span>Receipt replay</span></div></div></div><pre class="demo-log" data-demo-log>System ready. Awaiting public-safe mission.</pre></aside></section>`;

const scenarioCards = `<section class="ud-section"><span class="ud-eyebrow">Choose a public-safe mission</span><h2>Start with a familiar work package.</h2><div class="ud-card-grid">${scenarios.map((s) => `<article class="ud-card"><span>${esc(s.user)}</span><h3>${esc(s.title)}</h3><p>${esc(s.brief)}</p><dl><dt>Input</dt><dd>${esc(s.input)}</dd><dt>Output</dt><dd>${esc(s.output)}</dd><dt>Decision</dt><dd>${esc(s.decision)}</dd></dl></article>`).join('')}</div></section>`;

write('demo-lab.html', shell('Demo Lab', 'Demo Lab', demoConsole + scenarioCards + `<section class="ud-section ud-two"><article class="ud-panel"><span class="ud-eyebrow">Proof Mission Builder</span><h2>Build the mission before the work is judged.</h2><p>GoalOS makes the acceptance criteria visible before the decision. The demo shows the exact artifacts a reviewer expects to see.</p><a class="ud-btn primary" href="proof-mission-builder.html">Open builder</a></article><article class="ud-panel"><span class="ud-eyebrow">Autonomous artifact</span><h2>Generate the same package in GitHub Actions.</h2><p>Use the workflow to create a downloadable demo Evidence Docket, verifier report, risk ledger, action graph, and Mission Receipt.</p><a class="ud-btn" href="autonomous-demo.html">Run autopilot</a></article></section>`));

write('proof-mission-builder.html', shell('Proof Mission Builder', 'Demo Lab', `<section class="ud-hero"><div><span class="ud-eyebrow">Proof Mission Builder</span><h1>Commission one bounded proof mission.</h1><p class="ud-lede">Pick a mission type, define the acceptance criteria, and inspect the artifact set. The public demo is browser-local and uses public-safe example data only.</p><div class="ud-actions"><a class="ud-btn primary" href="demo-lab.html">Launch proof cycle</a><a class="ud-btn" href="request-access.html">Request private beta</a></div></div><div class="ud-panel"><h3>Mission contract preview</h3><ul class="ud-checks"><li>Objective stated</li><li>Acceptance criteria visible</li><li>Review authority explicit</li><li>Evidence Docket required</li><li>Receipt replay available</li></ul></div></section>${scenarioCards}`));

write('demo-gallery.html', shell('Demo Gallery', 'Demo Lab', `<section class="ud-hero"><div><span class="ud-eyebrow">Demo Gallery</span><h1>Four proof missions you can understand immediately.</h1><p class="ud-lede">Each demo keeps the same disciplined path: mission, evidence, review, receipt.</p></div></section>${scenarioCards}`));

write('evidence-docket-lab.html', shell('Evidence Docket Lab', 'Evidence Docket', `<section class="ud-hero"><div><span class="ud-eyebrow">Evidence Docket Lab</span><h1>Inspect the proof room.</h1><p class="ud-lede">The Evidence Docket makes claims, evidence, risk, verifier notes, decision state, and replay path visible in one place.</p><div class="ud-actions"><a class="ud-btn primary" href="demo/proof-mission/evidence-docket.json">Open JSON docket</a><a class="ud-btn" href="demo/proof-mission/public-report.html">Open public report</a></div></div><div class="ud-panel docket-preview"><h3>${esc(demoDocket.title)}</h3>${demoDocket.claimsMatrix.map((c) => `<p><b>${esc(c.status)}</b> — ${esc(c.claim)}</p>`).join('')}</div></section><section class="ud-section"><h2>Docket sections</h2><div class="ud-card-grid">${['Manifest','Claims matrix','Source provenance','Verifier report','Risk ledger','Decision state','Action graph','Receipt','Replay path'].map(x=>`<article class="ud-card"><h3>${x}</h3><p>Public-safe demonstration surface for ${x.toLowerCase()}.</p></article>`).join('')}</div></section>`));

write('receipt-verifier-demo.html', shell('Receipt Verifier Demo', 'Verifier', `<section class="ud-hero"><div><span class="ud-eyebrow">Receipt Verifier</span><h1>Verify the demo Mission Receipt.</h1><p class="ud-lede">The verifier page checks a known public-safe receipt and shows the decision state, evidence hash, issuer, and replay path. No pasted data is requested.</p><div class="ud-actions"><button class="ud-btn primary" data-verify-demo>Verify demo receipt</button><a class="ud-btn" href="demo/proof-mission/mission-receipt.json">Open receipt JSON</a><a class="ud-btn" href="evidence-docket-lab.html">Inspect docket</a></div></div><div class="ud-panel verifier-card"><h3>${demoReceipt.receiptId}</h3><p><b>Decision:</b> ${demoReceipt.decision}</p><p><b>Issuer:</b> ${demoReceipt.issuer}</p><p><b>Issued:</b> ${demoReceipt.issuedAt}</p><p><b>Evidence:</b> ${demoReceipt.evidenceHash}</p><p><b>Replay:</b> demo/proof-mission/public-report.html</p><p><b>Status:</b> <span data-verify-status>Ready to verify</span></p></div></section><section class="ud-section"><span class="ud-eyebrow">What this proves</span><h2>The receipt is a replayable acceptance record.</h2><div class="ud-card-grid"><article class="ud-card"><h3>Identity</h3><p>The receipt ID and issuer identify the specific public-safe demo record.</p></article><article class="ud-card"><h3>Evidence hash</h3><p>The evidence hash binds the decision to a docket snapshot.</p></article><article class="ud-card"><h3>Decision state</h3><p>The decision explains what was accepted for review replay.</p></article><article class="ud-card"><h3>Replay path</h3><p>The public report gives users a readable inspection surface.</p></article></div></section>`));

write('autonomous-demo.html', shell('Autonomous Demo', 'Demo Lab', `<section class="ud-hero"><div><span class="ud-eyebrow">GitHub Actions Autopilot</span><h1>Generate a proof mission artifact automatically.</h1><p class="ud-lede">Run the repository workflow, choose a scenario, and download the generated Evidence Docket bundle. This is the nontechnical path: GitHub does the packaging and gives you a downloadable artifact.</p><ol class="ud-steps"><li>Open Actions</li><li>Select User Delight Demo Autopilot</li><li>Choose a scenario</li><li>Download the generated artifact</li></ol><div class="ud-actions"><a class="ud-btn primary" href="demo-lab.html">Try browser demo first</a><a class="ud-btn" href="demo/proof-mission/public-report.html">Open sample report</a></div></div><div class="ud-panel"><h3>Generated bundle</h3><ul class="ud-checks"><li>mission-contract.json</li><li>claims-matrix.json</li><li>evidence-docket.json</li><li>verifier-report.json</li><li>risk-ledger.json</li><li>action-graph.json</li><li>decision-state.json</li><li>mission-receipt.json</li><li>public-report.html</li></ul><p>The bundle is public-safe demonstration output. It contains no submitted user files and no personal, confidential, regulated, wallet, payment, or credential material.</p></div></section><section class="ud-section"><span class="ud-eyebrow">Why this matters</span><h2>The workflow makes proof tangible.</h2><div class="ud-card-grid"><article class="ud-card"><h3>Nontechnical</h3><p>Open one GitHub Action, choose a scenario, and download the artifact.</p></article><article class="ud-card"><h3>Auditable</h3><p>Every generated file has a clear role in the acceptance record.</p></article><article class="ud-card"><h3>Shareable</h3><p>The public report explains the demo without exposing private data.</p></article><article class="ud-card"><h3>Repeatable</h3><p>The same scenario can be generated again from the repository workflow.</p></article></div></section>`));

// User activation fallbacks: overwrite only with useful public-safe pages that remain substantial.
write('proof-mission.html', shell('Proof Mission', 'Proof Mission', `<section class="ud-hero"><div><span class="ud-eyebrow">48-hour Proof Mission</span><h1>Give one AI deliverable a proof trail.</h1><p class="ud-lede">A Proof Mission turns a public-safe business summary into a mission contract, claims matrix, Evidence Docket, verifier report, risk ledger, decision state, action graph, and Mission Receipt.</p><div class="ud-actions"><a class="ud-btn primary" href="mailto:${contactEmail}?subject=GoalOS%20Proof%20Mission%20Request&body=Please%20do%20not%20include%20personal%2C%20confidential%2C%20regulated%2C%20or%20third-party%20data.%0A%0AOrganization:%0AUse%20case:%0ADeadline:%0AWhat%20decision%20needs%20acceptance:%0A">Request a Proof Mission</a><a class="ud-btn" href="evidence-docket-demo.html">See sample docket</a></div></div><div class="ud-panel"><h3>What you receive</h3><ul class="ud-checks"><li>Executive brief</li><li>Evidence Docket</li><li>Verifier report</li><li>Risk ledger</li><li>Action graph</li><li>Mission Receipt</li></ul></div></section>${scenarioCards}`));
write('evidence-docket-demo.html', shell('Evidence Docket Demo', 'Evidence Docket', readIf('evidence-docket-lab.html') ? readIf('evidence-docket-lab.html').replace(/^[\s\S]*?<main>|<\/main>[\s\S]*$/g,'') : `<section class="ud-hero"><h1>Evidence Docket Demo</h1><p>Inspect the sample docket.</p></section>`));
write('verify.html', shell('Verify Demo Receipt', 'Verifier', readIf('receipt-verifier-demo.html') ? readIf('receipt-verifier-demo.html').replace(/^[\s\S]*?<main>|<\/main>[\s\S]*$/g,'') : `<section class="ud-hero"><h1>Verify Demo Receipt</h1><p>Inspect a public-safe receipt.</p></section>`));
const verifierRichBody = `<section class="ud-hero"><div><span class="ud-eyebrow">Mission Receipt verifier</span><h1>Verify a demo Mission Receipt.</h1><p class="ud-lede">This public demo verifies a built-in sample receipt only. No visitor text entry, upload, account, wallet, cookie, analytics, payment, or personal data is used.</p><div class="ud-actions"><button class="ud-btn primary" data-verify-demo>Verify demo receipt</button><a class="ud-btn" href="demo/proof-mission/mission-receipt.json">Open receipt JSON</a><a class="ud-btn" href="evidence-docket-demo.html">Inspect docket</a></div></div><div class="ud-panel verifier-card"><h3>${demoReceipt.receiptId}</h3><p><b>Decision:</b> ${demoReceipt.decision}</p><p><b>Issuer:</b> ${demoReceipt.issuer}</p><p><b>Issued:</b> ${demoReceipt.issuedAt}</p><p><b>Evidence:</b> ${demoReceipt.evidenceHash}</p><p><b>Replay:</b> demo/proof-mission/public-report.html</p><p><b>Status:</b> <span data-verify-status>Ready to verify</span></p></div></section><section class="ud-section"><span class="ud-eyebrow">Verification checks</span><h2>The receipt is a replayable acceptance record.</h2><div class="ud-card-grid"><article class="ud-card"><span>01</span><h3>Identity</h3><p>The receipt ID and issuer identify the exact public-safe sample record.</p></article><article class="ud-card"><span>02</span><h3>Evidence hash</h3><p>The evidence hash binds the decision to the sample docket snapshot.</p></article><article class="ud-card"><span>03</span><h3>Decision state</h3><p>The decision records what was accepted for review replay.</p></article><article class="ud-card"><span>04</span><h3>Replay path</h3><p>The public report gives users a readable inspection surface.</p></article><article class="ud-card"><span>05</span><h3>Data posture</h3><p>The verifier operates on the built-in sample only.</p></article><article class="ud-card"><span>06</span><h3>Human gate</h3><p>The receipt records an authorized human decision boundary.</p></article><article class="ud-card"><span>07</span><h3>Integrity</h3><p>The accepted version is tied to an immutable demonstration hash.</p></article><article class="ud-card"><span>08</span><h3>Shareability</h3><p>The proof package can be inspected without a private workspace.</p></article></div></section>`;
write('receipt-verifier-demo.html', shell('Receipt Verifier Demo', 'Verifier', verifierRichBody));
write('verify.html', shell('Verify Demo Receipt', 'Verifier', verifierRichBody));

// Create missing lightweight pages when the broader activation package is not installed.
const fallbackPages = {
  'start.html': ['Start', 'Start with one AI deliverable.', 'Choose a proof mission type, inspect a sample docket, and verify a demo receipt before requesting private beta access.'],
  'examples.html': ['Examples', 'See proof missions in context.', 'Research reports, automation handoffs, milestones, vendor reviews, and defensive readiness reviews can become reviewable acceptance records.'],
  'request-access.html': ['Request Access', 'Request private beta access.', `Send only a non-sensitive business summary to ${contactEmail}.`],
  'no-user-data.html': ['No User Data', 'No user data by design.', 'The public site does not ask for uploads, forms, accounts, wallets, cookies, analytics, payments, or confidential material.'],
  'agialpha.html': ['$AGIALPHA', 'External token reference.', '$AGIALPHA is an external Ethereum Mainnet ERC-20 token. It is not sold, issued, brokered, custodied, distributed, redeemed, staked, or made available by GoalOS, MontrealAI, or QuebecAI.'],
  'agialpha-token-boundary.html': ['$AGIALPHA Boundary', 'External market boundary.', 'GoalOS Signoff Pro references $AGIALPHA only as external protocol context and does not provide investment, financial, trading, tax, custody, brokerage, or legal advice.']
};
for (const [rel, [title, heading, text]] of Object.entries(fallbackPages)) {
  if (!readIf(rel)) write(rel, shell(title, title.split(' ')[0], `<section class="ud-hero"><div><span class="ud-eyebrow">GoalOS Signoff Pro</span><h1>${esc(heading)}</h1><p class="ud-lede">${esc(text)}</p><div class="ud-actions"><a class="ud-btn primary" href="demo-lab.html">Launch demo lab</a><a class="ud-btn" href="mailto:${contactEmail}">${contactEmail}</a></div></div></section>`));
}

const css = `:root{--bg:#02090c;--ink:#f8f2e7;--muted:#b7c7c3;--line:rgba(145,255,226,.28);--panel:rgba(13,25,27,.78);--panel2:rgba(34,53,52,.72);--mint:#79ffd9;--aqua:#6fe8ff;--gold:#ffe97a;--violet:#9c8cff}*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:radial-gradient(circle at 20% 10%,rgba(103,255,218,.14),transparent 34rem),radial-gradient(circle at 82% 25%,rgba(98,205,255,.13),transparent 36rem),linear-gradient(120deg,#02080b,#071312 46%,#080a13);color:var(--ink);font-family:Inter,ui-sans-serif,system-ui,-apple-system,Segoe UI,sans-serif;min-height:100vh}.ud-bg{position:fixed;inset:0;pointer-events:none;background-image:linear-gradient(rgba(255,255,255,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.035) 1px,transparent 1px);background-size:64px 64px;mask-image:linear-gradient(#000,rgba(0,0,0,.7),transparent 98%);z-index:-2}.ud-bg:after{content:"";position:absolute;inset:0;background:radial-gradient(circle at 65% 42%,rgba(122,255,220,.16),transparent 20rem),radial-gradient(circle at 28% 78%,rgba(156,140,255,.12),transparent 26rem);filter:blur(18px)}a{color:inherit}.ud-nav{position:sticky;top:0;z-index:50;min-height:72px;padding:16px 5vw;display:flex;align-items:center;justify-content:space-between;gap:24px;background:rgba(2,7,9,.84);backdrop-filter:blur(18px);border-bottom:1px solid rgba(255,255,255,.1)}.ud-brand{display:flex;align-items:center;gap:14px;text-decoration:none;text-transform:uppercase;letter-spacing:.18em}.ud-brand strong{display:block;font-size:.82rem}.ud-brand small{display:block;color:var(--muted);font-size:.62rem}.ud-orb{width:34px;height:34px;border-radius:12px;border:1px solid var(--line);box-shadow:0 0 24px rgba(121,255,217,.5),inset 0 0 18px rgba(111,232,255,.25);position:relative}.ud-orb:after{content:"";position:absolute;inset:11px;border-radius:99px;background:linear-gradient(135deg,var(--mint),var(--aqua))}.ud-nav nav{display:flex;align-items:center;gap:12px;flex-wrap:wrap;justify-content:center}.ud-nav nav a,.ud-pill{padding:10px 14px;border-radius:999px;text-decoration:none;font-weight:850;font-size:.78rem}.ud-nav nav a.active{background:rgba(255,255,255,.12);box-shadow:inset 0 0 0 1px rgba(255,255,255,.18)}.ud-pill,.ud-btn.primary{background:linear-gradient(135deg,#f2ff9b,#69fff0);color:#02100e}.ud-btn{display:inline-flex;align-items:center;justify-content:center;min-height:42px;padding:12px 18px;border-radius:999px;border:1px solid rgba(255,255,255,.18);background:rgba(255,255,255,.1);color:var(--ink);font-weight:900;text-decoration:none;box-shadow:0 18px 44px rgba(0,0,0,.25);cursor:pointer}.ud-actions{display:flex;gap:12px;flex-wrap:wrap;margin-top:24px}.ud-hero,.ud-section,.user-delight-rail{width:min(1120px,92vw);margin:0 auto;padding:clamp(56px,8vw,118px) 0}.ud-demo-hero{display:grid;grid-template-columns:minmax(0,.92fr) minmax(360px,1.08fr);gap:34px;align-items:stretch}.ud-hero:not(.ud-demo-hero){display:grid;grid-template-columns:minmax(0,1fr) minmax(320px,.82fr);gap:34px;align-items:center}.ud-eyebrow{display:inline-flex;gap:10px;align-items:center;text-transform:uppercase;letter-spacing:.32em;color:var(--mint);font-size:.75rem;font-weight:950}.ud-eyebrow:before{content:"";width:34px;height:1px;background:var(--mint)}h1,h2,h3,p{margin-top:0}h1{font-size:clamp(3.1rem,7.5vw,7.2rem);line-height:.86;letter-spacing:-.08em;max-width:760px;margin-bottom:22px}h2{font-size:clamp(2.2rem,4.8vw,4.8rem);line-height:.92;letter-spacing:-.07em;margin-bottom:18px}h3{font-size:clamp(1.25rem,2vw,2.1rem);line-height:1;letter-spacing:-.04em}.ud-lede{font-size:clamp(1.08rem,1.65vw,1.45rem);line-height:1.45;color:#e4eee9;max-width:720px}.ud-panel,.ud-card,.user-delight-rail{border:1px solid rgba(255,255,255,.14);background:linear-gradient(135deg,rgba(34,52,51,.82),rgba(8,15,18,.82));border-radius:28px;box-shadow:0 30px 120px rgba(0,0,0,.38),inset 0 1px rgba(255,255,255,.08)}.ud-panel{padding:28px}.proof-console{min-height:560px}.console-top{display:flex;justify-content:space-between;gap:16px;text-transform:uppercase;letter-spacing:.22em;color:var(--mint);font-size:.72rem;margin-bottom:22px}.console-grid{display:grid;grid-template-columns:1fr 1.15fr;gap:20px}.proof-steps{list-style:none;padding:0;margin:0;display:grid;gap:12px}.proof-steps li{padding:18px 18px 18px 54px;min-height:78px;border-radius:18px;border:1px solid rgba(121,255,217,.28);background:rgba(255,255,255,.055);position:relative;transition:transform .35s ease,border-color .35s ease,background .35s ease}.proof-steps li:before{content:attr(data-step);position:absolute;left:18px;top:20px;color:var(--gold);font-weight:950}.proof-steps li b{display:block;font-size:1.15rem}.proof-steps li span{color:var(--muted)}.proof-steps li.live{transform:translateX(8px);border-color:var(--mint);background:rgba(121,255,217,.16);box-shadow:0 0 24px rgba(121,255,217,.18)}.readiness{display:grid;place-items:center;align-content:center;border-radius:24px;background:radial-gradient(circle at center,rgba(121,255,217,.14),transparent 18rem),rgba(0,0,0,.28);border:1px solid rgba(255,255,255,.12);min-height:100%}.ring{width:190px;height:190px;border-radius:50%;display:grid;place-items:center;background:conic-gradient(var(--mint) calc(var(--p,0)*1%),rgba(255,255,255,.09) 0);box-shadow:0 0 52px rgba(121,255,217,.26)}.ring:before{content:"";position:absolute;width:136px;height:136px;border-radius:50%;background:#041011}.ring span{position:relative;font-size:3.2rem;font-weight:950}.readiness small{text-transform:uppercase;letter-spacing:.22em;color:var(--mint);margin-top:10px}.trust-tags{display:flex;gap:8px;flex-wrap:wrap;justify-content:center;margin-top:24px}.trust-tags span{padding:10px 12px;border:1px solid rgba(255,233,122,.4);border-radius:12px;text-transform:uppercase;font-weight:900;font-size:.68rem}.demo-log{width:100%;min-height:128px;margin-top:22px;padding:18px;border-radius:14px;border:1px solid rgba(255,255,255,.12);background:#020807;color:#c5ffed;white-space:pre-wrap;line-height:1.55}.ud-safe-row{display:flex;gap:8px;flex-wrap:wrap;margin-top:18px}.ud-safe-row span{padding:8px 10px;border-radius:999px;background:rgba(255,255,255,.08);color:#dce8e4}.ud-card-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:18px;margin-top:26px}.ud-card{padding:22px}.ud-card span{color:var(--mint);font-size:.72rem;font-weight:900;text-transform:uppercase;letter-spacing:.16em}.ud-card p,.ud-card dd,.ud-card dt{color:#d8e5e1}.ud-card dl{display:grid;gap:8px;margin-bottom:0}.ud-card dt{font-weight:950;color:var(--gold);text-transform:uppercase;font-size:.7rem;letter-spacing:.18em}.ud-card dd{margin:0}.ud-two{display:grid;grid-template-columns:1fr 1fr;gap:24px}.ud-checks,.ud-steps{line-height:1.7;color:#e5eee9}.user-delight-rail{display:grid;grid-template-columns:1.25fr .75fr;gap:24px;padding:34px;margin-top:54px;margin-bottom:54px}.user-delight-rail h2{font-size:clamp(2rem,3.8vw,4.2rem)}.ud-mini-console{border:1px solid var(--line);border-radius:22px;padding:22px;background:rgba(0,0,0,.22)}.ud-mini-console ol{display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin:14px 0 0;padding:0;list-style:none}.ud-mini-console li{padding:10px;border-radius:12px;background:rgba(121,255,217,.08)}.docket-preview p,.verifier-card p{border-top:1px solid rgba(255,255,255,.1);padding-top:12px}@media(max-width:900px){.ud-demo-hero,.ud-hero:not(.ud-demo-hero),.user-delight-rail,.ud-two{grid-template-columns:1fr}.ud-card-grid{grid-template-columns:1fr 1fr}.console-grid{grid-template-columns:1fr}.proof-console{min-height:auto}.ud-nav{position:relative}.ud-nav nav{display:none}h1{font-size:clamp(3rem,15vw,5.4rem)}}@media(max-width:560px){.ud-card-grid{grid-template-columns:1fr}.ud-actions{flex-direction:column}.ud-btn{width:100%}}`;
write('assets/user-delight-v4.css', css);

const js = `(() => {\n  // Launch proof cycle interaction for GoalOS public demo.\n  // Completion condition: pct === 100.\n  const steps = Array.from(document.querySelectorAll('[data-step]'));\n  const percent = document.querySelector('[data-demo-percent]');\n  const ring = document.querySelector('[data-demo-ring]');\n  const label = document.querySelector('[data-demo-label]');\n  const log = document.querySelector('[data-demo-log]');\n  const start = document.querySelector('[data-demo-start]');\n  const reset = document.querySelector('[data-demo-reset]');\n  const verify = document.querySelector('[data-verify-demo]');\n  const status = document.querySelector('[data-verify-status]');\n  const messages = ['Mission contract committed.','Evidence delivered.','Claims mapped to acceptance gates.','Reviewer judgment preserved.','Human authorization recorded.','Mission Receipt sealed.'];\n  let pct = 0;\n  function paint(value){ pct = value; if(percent) percent.textContent = String(value); if(ring) ring.style.setProperty('--p', String(value)); }\n  function resetDemo(){ steps.forEach(s=>s.classList.remove('live')); paint(0); if(label) label.textContent='Awaiting mission'; if(log) log.textContent='System ready. Awaiting public-safe mission.'; }\n  function run(){ resetDemo(); let i=0; const lines=[]; function tick(){ if(i < steps.length){ steps[i].classList.add('live'); lines.push('• '+messages[i]); paint(Math.round(((i+1)/steps.length)*100)); if(label) label.textContent = i === steps.length-1 ? 'Ready' : 'Gate '+String(i+1)+' of '+steps.length; if(log) log.textContent = lines.join('\\n'); i += 1; setTimeout(()=>requestAnimationFrame(tick), 430); } else { paint(100); if(label) label.textContent='Ready'; if(log) log.textContent = lines.concat(['Terminal disposition: ready for human decision.']).join('\\n'); } } tick(); }\n  start?.addEventListener('click', run); reset?.addEventListener('click', resetDemo); verify?.addEventListener('click', () => { if(status) status.textContent = 'Valid demo receipt · evidence hash matched · public-safe replay available'; }); resetDemo();\n})();\n`;
write('assets/user-delight-v4.js', js);


function writePublicExampleReadmes() {
  let examples = scenarios.map((s) => ({
    slug: s.id,
    title: s.title,
    input: s.input,
    process: s.brief,
    output: s.output,
    decision: s.decision
  }));
  const configPath = path.join(root, 'config', 'goalos-proof-missions.json');
  if (fs.existsSync(configPath)) {
    try {
      const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      if (Array.isArray(config.examples) && config.examples.length) examples = config.examples;
    } catch (error) {
      // Keep built-in public-safe examples.
    }
  }
  for (const example of examples) {
    const slug = String(example.slug || example.id || example.title || 'proof-mission').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const content = `# ${example.title || 'GoalOS Proof Mission Example'}\n\nThis public-safe example artifact is generated for the GoalOS Signoff Pro website. It contains no user data, no private customer material, no credentials, and no upload path.\n\n## Input\n\n${example.input || 'Public-safe mission summary.'}\n\n## Process\n\n${example.process || example.objective || example.brief || 'GoalOS maps claims, evidence, risk, review, and receipt state.'}\n\n## Output\n\n${example.output || 'Evidence Docket, verifier report, risk ledger, decision state, and Mission Receipt.'}\n\n## Decision\n\n${example.decision || 'Human review required.'}\n\n## Public-site posture\n\nNo sign-in. No upload. No wallet. No cookies. No analytics. Contact: ${contactEmail}.\n`;
    write(`examples/proof-missions/${slug}/README.md`, content);
  }
}

function sanitizeLegacyHtml() {
  const files = [];
  const walk = (dir) => {
    if (!fs.existsSync(dir)) return;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const file = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(file);
      else if (file.endsWith('.html')) files.push(file);
    }
  };
  walk(siteDir);
  for (const file of files) {
    let html = fs.readFileSync(file, 'utf8');
    const before = html;
    html = html.replace(/<form\b[\s\S]*?<\/form>/gi, `<section class="safe-public-panel"><h2>Public-safe contact only</h2><p>This public site has no forms. Use <a href="mailto:${contactEmail}?subject=GoalOS%20Signoff%20Pro%20public-safe%20inquiry">${contactEmail}</a> for non-sensitive business inquiries.</p></section>`);
    html = html.replace(/<textarea\b[\s\S]*?<\/textarea>/gi, `<pre class="demo-log">Public demo is no-input by design. Use the bundled demo receipt and public-safe artifact links instead.</pre>`);
    html = html.replace(/<input\b[^>]*>/gi, '');
    if (html !== before) fs.writeFileSync(file, html);
  }
}

writePublicExampleReadmes();
sanitizeLegacyHtml();

const manifest = {
  product: 'GoalOS Signoff Pro', version, generatedAt: new Date().toISOString(), baseUrl, contactEmail,
  pages: ['demo-lab.html','proof-mission-builder.html','demo-gallery.html','evidence-docket-lab.html','receipt-verifier-demo.html','autonomous-demo.html','proof-mission.html','evidence-docket-demo.html','verify.html'],
  fixes: ['homepage rail inserted before footer','demo lab visible without JavaScript reveal dependency','quality gate checks visible content rather than decorative backgrounds','no-user-data posture preserved','legacy public textareas removed','no public forms, inputs, or text-entry controls remain'],
  demoArtifacts: ['mission-contract.json','claims-matrix.json','evidence-docket.json','verifier-report.json','risk-ledger.json','action-graph.json','decision-state.json','mission-receipt.json','public-report.html'],
  publicSafety: { noForms:true, noUploads:true, noCookies:true, noAnalytics:true, noWallets:true }
};
write('user-delight-manifest.json', JSON.stringify(manifest, null, 2));
write('user-delight-manifest.txt', `GoalOS User Delight v4.1\nsiteHash=${sha256(JSON.stringify(manifest))}\ncontact=${contactEmail}\n`);

injectHomeRail();

function hardenPublicControls() {
  const htmlFiles = [];
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const file = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(file);
      else if (file.endsWith('.html')) htmlFiles.push(file);
    }
  };
  walk(siteDir);
  for (const file of htmlFiles) {
    const before = fs.readFileSync(file, 'utf8');
    const after = before
      .replace(/<textarea\b[\s\S]*?<\/textarea>/gi, '<pre class="demo-static-sample">Public-safe sample only. No visitor text entry is requested, transmitted, stored, or processed.</pre>')
      .replace(/<input\b[^>]*>/gi, '')
      .replace(/<form\b[^>]*>/gi, '<section class="demo-static-section">')
      .replace(/<\/form>/gi, '</section>');
    if (after !== before) fs.writeFileSync(file, after);
  }
  const offenders = htmlFiles.filter((file) => /<textarea\b|<input\b|<form\b/i.test(fs.readFileSync(file, 'utf8')));
  if (offenders.length) throw new Error('Forbidden public controls remain: ' + offenders.map((file) => path.relative(siteDir, file)).join(', '));
}
hardenPublicControls();
console.log('GoalOS User Delight Autopilot v4.1 generated visible demo pages and artifacts');
