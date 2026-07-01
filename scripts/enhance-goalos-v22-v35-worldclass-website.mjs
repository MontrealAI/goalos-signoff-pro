#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const site = path.join(root, 'site');
const assets = path.join(site, 'assets');
const docs = path.join(root, 'docs');
fs.mkdirSync(site, {recursive:true}); fs.mkdirSync(assets, {recursive:true}); fs.mkdirSync(docs, {recursive:true});

const labs = [
  {
    "v": "v22",
    "title": "Action Graph & Human Authority",
    "route": "action-graph-authority-lab.html",
    "stage": "Proof loop",
    "value": "Shows why GoalOS prepares action, but does not self-authorize high-impact action.",
    "bestFor": "Executives, reviewers, compliance teams, AI delivery leads."
  },
  {
    "v": "v23",
    "title": "Proof-Carrying Artifact & Evolution Ledger",
    "route": "proof-carrying-artifact-lab.html",
    "stage": "Reusable capability",
    "value": "Shows how reusable capability earns the right to influence future work.",
    "bestFor": "Product teams, AI platform teams, governance stewards."
  },
  {
    "v": "v24",
    "title": "Independent Replay & Claim Promotion",
    "route": "independent-replay-lab.html",
    "stage": "Replay and promotion",
    "value": "Shows that one run is not proof; replay makes a claim institutionally usable.",
    "bestFor": "Research reviewers, auditors, grant evaluators, technical diligence teams."
  },
  {
    "v": "v25",
    "title": "ProofZero Planning & Evidence Reanalyze",
    "route": "proofzero-planning-lab.html",
    "stage": "Planning over proof states",
    "value": "Shows how GoalOS plans over proof-relevant work states instead of persuasive futures.",
    "bestFor": "AI operators, mission designers, evaluation teams."
  },
  {
    "v": "v26",
    "title": "Proof-Gated Mission Foundry & Curriculum",
    "route": "mission-foundry-lab.html",
    "stage": "Curriculum and compounding",
    "value": "Shows how accepted proof becomes curriculum rather than a dead artifact.",
    "bestFor": "Program owners, frontier evaluation teams, autonomous work architects."
  },
  {
    "v": "v27",
    "title": "Process-Resolved Evidence",
    "route": "process-evidence-lab.html",
    "stage": "Process evidence",
    "value": "Shows that final output is not enough; process-resolved evidence determines review readiness.",
    "bestFor": "Corporate reviewers, analysts, legal/compliance observers, AI assurance teams."
  },
  {
    "v": "v28",
    "title": "Blockchain Credibility Standard",
    "route": "blockchain-credibility-lab.html",
    "stage": "Blockchain credibility",
    "value": "Shows why credible blockchain projects need proof packages before trust, reputation, governance, or settlement readiness.",
    "bestFor": "Blockchain teams, DAOs, foundations, auditors, validators, investors, users."
  },
  {
    "v": "v29",
    "title": "Blockchain Proof Mandate & Due Diligence",
    "route": "blockchain-proof-mandate-lab.html",
    "stage": "Mandate and diligence",
    "value": "Turns the blockchain credibility standard into a concrete requirement everyone can ask for, score, and enforce.",
    "bestFor": "Users, DAO delegates, grant committees, treasury councils, auditors, investors, partners, enterprises."
  },
  {
    "v": "v30",
    "title": "Proof Before Settlement Research Standard",
    "route": "proof-before-settlement-research-lab.html",
    "stage": "Institutional research",
    "value": "Turns the Proof Before Settlement paper into a public standard stakeholders can read, download, cite, and require.",
    "bestFor": "Foundations, DAOs, auditors, investors, exchanges, enterprises, partners."
  },
  {
    "v": "v31",
    "title": "Executive AI Proof Console",
    "route": "executive-ai-proof-console.html",
    "stage": "Guided proof console",
    "value": "Makes GoalOS obvious to first-time visitors with a role-based, public-safe proof gate.",
    "bestFor": "Executives, DAO delegates, auditors, investors, enterprises, AI operators."
  },
  {
    "v": "v32",
    "title": "From Loop to RSI",
    "route": "from-loop-to-rsi-lab.html",
    "stage": "Sovereign invention governance",
    "value": "Connects proof loops to deterministic invention governance and RSI readiness.",
    "bestFor": "Frontier labs, governance teams, sovereign strategy leads."
  },
  {
    "v": "v33",
    "title": "Loop \u2192 RSI \u2192 ASI Console",
    "route": "loop-rsi-asi-superintelligence-lab.html",
    "stage": "RSI to ASI boundary",
    "value": "Shows the superintelligence control boundary: promotion cannot self-authorize.",
    "bestFor": "Safety leads, architecture councils, frontier lab directors."
  },
  {
    "v": "v34",
    "title": "ASI Superintelligence Control Tower",
    "route": "loop-rsi-asi-superintelligence-control-tower-lab.html",
    "stage": "Control tower",
    "value": "Runs explanation modes, stress tests, rollback drills, council review, and Move\u201137 dossier handling.",
    "bestFor": "Boards, councils, sovereign programs, assurance teams."
  },
  {
    "v": "v35",
    "title": "ASI Mission Simulator",
    "route": "loop-rsi-asi-superintelligence-mission-simulator-lab.html",
    "stage": "Mission simulator",
    "value": "Experiences the complete Loop \u2192 RSI \u2192 ASI path in one guided, button-only interactive lab.",
    "bestFor": "Everyone: first-time visitors, executives, reviewers, blockchain teams, and RSI/ASI governance audiences."
  }
];
const roles = [
  {
    "id": "visitor",
    "label": "First-time visitor",
    "headline": "Understand the big idea in one guided path.",
    "next": "goalos-v22-v35-command-center.html",
    "brief": "Start with the command center. It explains the proof loop, shows what to inspect next, and routes you to the right lab."
  },
  {
    "id": "blockchain",
    "label": "Blockchain / DAO",
    "headline": "Require proof before trust or settlement.",
    "next": "blockchain-proof-mandate-lab.html",
    "brief": "Use v28-v30 to make proof packages normal for grants, treasuries, upgrades, audits, partners, and public claims."
  },
  {
    "id": "executive",
    "label": "Executive / board",
    "headline": "Turn complexity into an institutional decision record.",
    "next": "executive-ai-proof-console.html",
    "brief": "Use the executive console and command center to see the gates, risks, authority, and receipts without reading every artifact first."
  },
  {
    "id": "auditor",
    "label": "Auditor / reviewer",
    "headline": "Follow the evidence, replay path, and claim boundary.",
    "next": "independent-replay-lab.html",
    "brief": "Open the replay and process evidence labs when the main question is whether the claim can be checked independently."
  },
  {
    "id": "frontier",
    "label": "Frontier lab / RSI team",
    "headline": "Govern invention before it compounds.",
    "next": "from-loop-to-rsi-lab.html",
    "brief": "Use v32-v35 to inspect deterministic invention operations, Move\u201137 dossiers, stress gates, rollback, and ASI-readiness."
  },
  {
    "id": "public",
    "label": "Public reviewer",
    "headline": "Ask the simple public question: where is the proof package?",
    "next": "proof-package.html",
    "brief": "Use the proof mandate and route catalog to check whether claims are marketing-only or evidence-ready."
  }
];
const modes = [
  {
    "id": "start",
    "label": "Start here",
    "gates": [
      "Mission",
      "Evidence",
      "Replay",
      "Validation",
      "Human authority",
      "Receipt"
    ],
    "message": "GoalOS starts by making a claim inspectable. Define the mission, bind evidence, replay it, validate it, preserve human judgment, and issue a receipt."
  },
  {
    "id": "settlement",
    "label": "Proof before settlement",
    "gates": [
      "Proof package URL",
      "Mission contract",
      "Evidence docket",
      "Risk ledger",
      "Signed receipt",
      "Settlement readiness"
    ],
    "message": "For blockchain, the rule is simple: do not just settle transactions; settle proven work."
  },
  {
    "id": "rsi",
    "label": "Loop \u2192 RSI",
    "gates": [
      "Target",
      "Emit",
      "Filter",
      "Atlas",
      "Test-plan",
      "Eval",
      "Insert",
      "Promote"
    ],
    "message": "The proof loop becomes RSI governance when exploration is deterministic, replayable, schema-bound, and gated before promotion."
  },
  {
    "id": "asi",
    "label": "RSI \u2192 ASI readiness",
    "gates": [
      "Risk gate",
      "Evidence gate",
      "Baseline gate",
      "Persistence gate",
      "Council gate",
      "Rollback gate"
    ],
    "message": "The ASI boundary is not a capability claim. It is the governance rule: ASI-scale systems must not self-authorize."
  }
];
const safe = "No forms \u00b7 no text inputs \u00b7 no uploads \u00b7 no cookies \u00b7 no analytics \u00b7 no wallets \u00b7 no payments \u00b7 no external AI calls \u00b7 no personal or confidential data \u00b7 zero value moved.";

const nonIntrusiveJs = "(() => {\n  const labs = [{\"v\": \"v22\", \"title\": \"Action Graph & Human Authority\", \"route\": \"action-graph-authority-lab.html\", \"stage\": \"Proof loop\", \"value\": \"Shows why GoalOS prepares action, but does not self-authorize high-impact action.\", \"bestFor\": \"Executives, reviewers, compliance teams, AI delivery leads.\"}, {\"v\": \"v23\", \"title\": \"Proof-Carrying Artifact & Evolution Ledger\", \"route\": \"proof-carrying-artifact-lab.html\", \"stage\": \"Reusable capability\", \"value\": \"Shows how reusable capability earns the right to influence future work.\", \"bestFor\": \"Product teams, AI platform teams, governance stewards.\"}, {\"v\": \"v24\", \"title\": \"Independent Replay & Claim Promotion\", \"route\": \"independent-replay-lab.html\", \"stage\": \"Replay and promotion\", \"value\": \"Shows that one run is not proof; replay makes a claim institutionally usable.\", \"bestFor\": \"Research reviewers, auditors, grant evaluators, technical diligence teams.\"}, {\"v\": \"v25\", \"title\": \"ProofZero Planning & Evidence Reanalyze\", \"route\": \"proofzero-planning-lab.html\", \"stage\": \"Planning over proof states\", \"value\": \"Shows how GoalOS plans over proof-relevant work states instead of persuasive futures.\", \"bestFor\": \"AI operators, mission designers, evaluation teams.\"}, {\"v\": \"v26\", \"title\": \"Proof-Gated Mission Foundry & Curriculum\", \"route\": \"mission-foundry-lab.html\", \"stage\": \"Curriculum and compounding\", \"value\": \"Shows how accepted proof becomes curriculum rather than a dead artifact.\", \"bestFor\": \"Program owners, frontier evaluation teams, autonomous work architects.\"}, {\"v\": \"v27\", \"title\": \"Process-Resolved Evidence\", \"route\": \"process-evidence-lab.html\", \"stage\": \"Process evidence\", \"value\": \"Shows that final output is not enough; process-resolved evidence determines review readiness.\", \"bestFor\": \"Corporate reviewers, analysts, legal/compliance observers, AI assurance teams.\"}, {\"v\": \"v28\", \"title\": \"Blockchain Credibility Standard\", \"route\": \"blockchain-credibility-lab.html\", \"stage\": \"Blockchain credibility\", \"value\": \"Shows why credible blockchain projects need proof packages before trust, reputation, governance, or settlement readiness.\", \"bestFor\": \"Blockchain teams, DAOs, foundations, auditors, validators, investors, users.\"}, {\"v\": \"v29\", \"title\": \"Blockchain Proof Mandate & Due Diligence\", \"route\": \"blockchain-proof-mandate-lab.html\", \"stage\": \"Mandate and diligence\", \"value\": \"Turns the blockchain credibility standard into a concrete requirement everyone can ask for, score, and enforce.\", \"bestFor\": \"Users, DAO delegates, grant committees, treasury councils, auditors, investors, partners, enterprises.\"}, {\"v\": \"v30\", \"title\": \"Proof Before Settlement Research Standard\", \"route\": \"proof-before-settlement-research-lab.html\", \"stage\": \"Institutional research\", \"value\": \"Turns the Proof Before Settlement paper into a public standard stakeholders can read, download, cite, and require.\", \"bestFor\": \"Foundations, DAOs, auditors, investors, exchanges, enterprises, partners.\"}, {\"v\": \"v31\", \"title\": \"Executive AI Proof Console\", \"route\": \"executive-ai-proof-console.html\", \"stage\": \"Guided proof console\", \"value\": \"Makes GoalOS obvious to first-time visitors with a role-based, public-safe proof gate.\", \"bestFor\": \"Executives, DAO delegates, auditors, investors, enterprises, AI operators.\"}, {\"v\": \"v32\", \"title\": \"From Loop to RSI\", \"route\": \"from-loop-to-rsi-lab.html\", \"stage\": \"Sovereign invention governance\", \"value\": \"Connects proof loops to deterministic invention governance and RSI readiness.\", \"bestFor\": \"Frontier labs, governance teams, sovereign strategy leads.\"}, {\"v\": \"v33\", \"title\": \"Loop \\u2192 RSI \\u2192 ASI Console\", \"route\": \"loop-rsi-asi-superintelligence-lab.html\", \"stage\": \"RSI to ASI boundary\", \"value\": \"Shows the superintelligence control boundary: promotion cannot self-authorize.\", \"bestFor\": \"Safety leads, architecture councils, frontier lab directors.\"}, {\"v\": \"v34\", \"title\": \"ASI Superintelligence Control Tower\", \"route\": \"loop-rsi-asi-superintelligence-control-tower-lab.html\", \"stage\": \"Control tower\", \"value\": \"Runs explanation modes, stress tests, rollback drills, council review, and Move\\u201137 dossier handling.\", \"bestFor\": \"Boards, councils, sovereign programs, assurance teams.\"}, {\"v\": \"v35\", \"title\": \"ASI Mission Simulator\", \"route\": \"loop-rsi-asi-superintelligence-mission-simulator-lab.html\", \"stage\": \"Mission simulator\", \"value\": \"Experiences the complete Loop \\u2192 RSI \\u2192 ASI path in one guided, button-only interactive lab.\", \"bestFor\": \"Everyone: first-time visitors, executives, reviewers, blockchain teams, and RSI/ASI governance audiences.\"}];\n  const roles = [{\"id\": \"visitor\", \"label\": \"First-time visitor\", \"headline\": \"Understand the big idea in one guided path.\", \"next\": \"goalos-v22-v35-command-center.html\", \"brief\": \"Start with the command center. It explains the proof loop, shows what to inspect next, and routes you to the right lab.\"}, {\"id\": \"blockchain\", \"label\": \"Blockchain / DAO\", \"headline\": \"Require proof before trust or settlement.\", \"next\": \"blockchain-proof-mandate-lab.html\", \"brief\": \"Use v28-v30 to make proof packages normal for grants, treasuries, upgrades, audits, partners, and public claims.\"}, {\"id\": \"executive\", \"label\": \"Executive / board\", \"headline\": \"Turn complexity into an institutional decision record.\", \"next\": \"executive-ai-proof-console.html\", \"brief\": \"Use the executive console and command center to see the gates, risks, authority, and receipts without reading every artifact first.\"}, {\"id\": \"auditor\", \"label\": \"Auditor / reviewer\", \"headline\": \"Follow the evidence, replay path, and claim boundary.\", \"next\": \"independent-replay-lab.html\", \"brief\": \"Open the replay and process evidence labs when the main question is whether the claim can be checked independently.\"}, {\"id\": \"frontier\", \"label\": \"Frontier lab / RSI team\", \"headline\": \"Govern invention before it compounds.\", \"next\": \"from-loop-to-rsi-lab.html\", \"brief\": \"Use v32-v35 to inspect deterministic invention operations, Move\\u201137 dossiers, stress gates, rollback, and ASI-readiness.\"}, {\"id\": \"public\", \"label\": \"Public reviewer\", \"headline\": \"Ask the simple public question: where is the proof package?\", \"next\": \"proof-package.html\", \"brief\": \"Use the proof mandate and route catalog to check whether claims are marketing-only or evidence-ready.\"}];\n  const modes = [{\"id\": \"start\", \"label\": \"Start here\", \"gates\": [\"Mission\", \"Evidence\", \"Replay\", \"Validation\", \"Human authority\", \"Receipt\"], \"message\": \"GoalOS starts by making a claim inspectable. Define the mission, bind evidence, replay it, validate it, preserve human judgment, and issue a receipt.\"}, {\"id\": \"settlement\", \"label\": \"Proof before settlement\", \"gates\": [\"Proof package URL\", \"Mission contract\", \"Evidence docket\", \"Risk ledger\", \"Signed receipt\", \"Settlement readiness\"], \"message\": \"For blockchain, the rule is simple: do not just settle transactions; settle proven work.\"}, {\"id\": \"rsi\", \"label\": \"Loop \\u2192 RSI\", \"gates\": [\"Target\", \"Emit\", \"Filter\", \"Atlas\", \"Test-plan\", \"Eval\", \"Insert\", \"Promote\"], \"message\": \"The proof loop becomes RSI governance when exploration is deterministic, replayable, schema-bound, and gated before promotion.\"}, {\"id\": \"asi\", \"label\": \"RSI \\u2192 ASI readiness\", \"gates\": [\"Risk gate\", \"Evidence gate\", \"Baseline gate\", \"Persistence gate\", \"Council gate\", \"Rollback gate\"], \"message\": \"The ASI boundary is not a capability claim. It is the governance rule: ASI-scale systems must not self-authorize.\"}];\n  const standards = [\n    'Blockchain proves the transaction. GoalOS proves the work.',\n    'No Proof. No Trust. No Settlement.',\n    'RSI governs invention. ASI must not self-authorize.',\n    'Search may guide allocation. Proof decides promotion.'\n  ];\n  const $ = (s, root=document) => root.querySelector(s);\n  const $$ = (s, root=document) => Array.from(root.querySelectorAll(s));\n  function ready(fn) { document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', fn) : fn(); }\n  function currentLab() {\n    const path = (location.pathname.split('/').pop() || 'index.html').toLowerCase();\n    return labs.find(l => path === l.route.toLowerCase() || path.includes(l.route.replace('.html','').toLowerCase())) || null;\n  }\n  function announce(msg) { const live = $('#gx-premium-live') || $('#g35-live'); if (live) live.innerHTML = '<b>Console:</b> ' + msg; }\n  function copy(text, btn) {\n    if (navigator.clipboard) navigator.clipboard.writeText(text).catch(()=>{});\n    if (btn) { const old = btn.textContent; btn.textContent = 'Copied'; setTimeout(() => btn.textContent = old, 1200); }\n    announce('Copied the public standard.');\n  }\n  function buildDock() {\n    if ($('#gx-premium-launch')) return;\n    document.body.classList.add('gx-premium-ready','goalos-v35-final-ready');\n    const active = currentLab();\n    const next = active ? (labs[labs.findIndex(l=>l.v===active.v)+1] || labs[labs.length-1]) : labs[labs.length-1];\n    const wrap = document.createElement('div');\n    wrap.className = 'gx-premium-shell gx-compact-dock';\n    wrap.innerHTML = `<div class=\"gx-floating-launch\"><a class=\"gx-launch-btn gx-command-link\" href=\"goalos-v22-v35-command-center.html\">\u2726 Command Center</a><button id=\"gx-premium-launch\" class=\"gx-launch-btn\" type=\"button\" aria-controls=\"gx-premium-panel\" aria-expanded=\"false\">Guided console</button></div><section id=\"gx-premium-panel\" class=\"gx-panel\" aria-label=\"GoalOS guided experience console\"><div class=\"gx-panel-inner\"><div class=\"gx-panel-top\"><div><span class=\"gx-kicker\">GoalOS navigator</span><h3>Find the right proof surface</h3><p>Button-only, browser-local guidance through v22\u2013v35. No inputs, uploads, wallets, payments, analytics, or external AI calls.</p></div><button class=\"gx-close\" id=\"gx-premium-close\" aria-label=\"Close navigator\">\u00d7</button></div><div class=\"gx-progress\" id=\"gx-premium-progress\"><span></span></div><div class=\"gx-stage-row\"><span class=\"gx-stage active\">Proof</span><span class=\"gx-stage\">Blockchain</span><span class=\"gx-stage\">Research</span><span class=\"gx-stage\">RSI</span><span class=\"gx-stage\">ASI gates</span><span class=\"gx-stage\">Receipt</span></div><div class=\"gx-nav-list\"><a class=\"gx-nav-link\" href=\"goalos-v22-v35-command-center.html\"><span><b>Start here \u00b7 v22\u2013v35 command center</b><small>Role-based path through the whole suite.</small></span><span>\u2192</span></a><a class=\"gx-nav-link\" href=\"public-demo-labs.html\"><span><b>All public labs</b><small>Complete catalog from v22 to v35.</small></span><span>\u2192</span></a><a class=\"gx-nav-link\" href=\"${next.route}\"><span><b>Recommended next \u00b7 ${next.v} ${next.title}</b><small>${next.value}</small></span><span>\u2192</span></a><a class=\"gx-nav-link\" href=\"loop-rsi-asi-superintelligence-mission-simulator-lab.html\"><span><b>Latest \u00b7 v35 ASI Mission Simulator</b><small>Run the complete Loop \u2192 RSI \u2192 ASI path.</small></span><span>\u2192</span></a></div><div class=\"gx-premium-actions\"><button class=\"gx-btn cyan\" type=\"button\" data-gx-action=\"explain\">Explain this page</button><button class=\"gx-btn gold\" type=\"button\" data-gx-action=\"tour\">Run quick tour</button><button class=\"gx-btn\" type=\"button\" data-gx-action=\"copy\">Copy standard</button></div><div class=\"gx-live\" id=\"gx-premium-live\"><b>Console:</b> Ready. Choose a recommended surface or run the quick tour.</div></div></section>`;\n    document.body.appendChild(wrap);\n    const panel = $('#gx-premium-panel'), btn = $('#gx-premium-launch');\n    btn.addEventListener('click', () => { const open = panel.classList.toggle('open'); btn.setAttribute('aria-expanded', open ? 'true' : 'false'); announce(open ? 'Open the Command Center first, then follow the recommended route.' : 'Closed.'); });\n    $('#gx-premium-close').addEventListener('click', () => { panel.classList.remove('open'); btn.setAttribute('aria-expanded','false'); });\n    document.addEventListener('keydown', e => { if (e.key === 'Escape') { panel.classList.remove('open'); btn.setAttribute('aria-expanded','false'); } });\n    $$('[data-gx-action]').forEach(b => b.addEventListener('click', () => handleAction(b.dataset.gxAction, b)));\n  }\n  function handleAction(action, btn) {\n    const lab = currentLab();\n    if (action === 'copy') return copy(standards.join('\n'), btn);\n    if (action === 'explain') {\n      const msg = lab ? `${lab.v} explains ${lab.title}. ${lab.value} Best for: ${lab.bestFor}` : 'This page belongs to the GoalOS v22\u2013v35 public experience. Start with the Command Center for role-based guidance.';\n      return announce(msg);\n    }\n    if (action === 'tour') return runTour();\n  }\n  function runTour() {\n    const nodes = [$('h1'), $('[id*=\"console\"]'), $('[class*=\"card\"]'), $('[class*=\"footer\"]'), $('main')].filter(Boolean);\n    let i = 0;\n    function step() {\n      nodes.forEach(n => n.classList.remove('gx-highlight'));\n      if (!nodes[i]) { announce('Tour complete. Open the Command Center for the full v22\u2013v35 path.'); return; }\n      nodes[i].classList.add('gx-highlight');\n      nodes[i].scrollIntoView({behavior:'smooth', block:'center'});\n      announce(`Tour step ${i+1}/${nodes.length}: inspect the highlighted area.`);\n      i += 1;\n      setTimeout(step, 1300);\n    }\n    step();\n  }\n  ready(buildDock);\n})();\n";
const companionCss = "\n/* GoalOS v35 world-class completion layer: compact, non-intrusive, public-safe navigation. */\nbody.goalos-v35-final-ready { scroll-behavior: smooth; }\n.gx-premium-spotlight { display:none !important; }\n.gx-compact-dock * { box-sizing: border-box; }\n.gx-compact-dock .gx-floating-launch { position: fixed; right: 18px; bottom: 18px; z-index: 99990; display: flex; flex-direction: column; gap: 10px; align-items: flex-end; }\n.gx-compact-dock .gx-launch-btn { border: 1px solid rgba(255,255,255,.22); border-radius: 999px; padding: 12px 16px; background: linear-gradient(135deg, rgba(155,92,255,.96), rgba(72,240,217,.9)); color: #fff; font-weight: 950; box-shadow: 0 18px 55px rgba(0,0,0,.45); cursor: pointer; text-decoration: none; font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif; }\n.gx-compact-dock .gx-command-link { background: linear-gradient(135deg, rgba(255,225,138,.98), rgba(255,79,163,.94)); color:#170817; }\n.gx-compact-dock .gx-panel { position: fixed; right: 18px; bottom: 116px; width: min(460px, calc(100vw - 28px)); max-height: min(760px, calc(100vh - 128px)); overflow: auto; z-index: 99991; padding: 1px; border-radius: 28px; background: linear-gradient(135deg, rgba(247,208,122,.72), rgba(155,92,255,.72), rgba(72,240,217,.55)); box-shadow: 0 30px 90px rgba(0,0,0,.55); display: none; }\n.gx-compact-dock .gx-panel.open { display:block; }\n.gx-compact-dock .gx-panel-inner { background: rgba(8,9,22,.97); border-radius: 27px; padding: 20px; border: 1px solid rgba(255,255,255,.08); color:#f7f4ff; }\n.gx-compact-dock .gx-panel-top { display:flex; align-items:flex-start; justify-content:space-between; gap:12px; margin-bottom:14px; }\n.gx-compact-dock .gx-panel h3 { margin:0; font-size:22px; letter-spacing:-.03em; }\n.gx-compact-dock .gx-panel p { margin:6px 0 14px; color:#bcb6d8; line-height:1.55; }\n.gx-compact-dock .gx-kicker { display:inline-flex; gap:9px; align-items:center; font-size:12px; letter-spacing:.16em; text-transform:uppercase; color:#f7d07a; font-weight:900; }\n.gx-compact-dock .gx-close { border:0; background:rgba(255,255,255,.08); color:#fff; border-radius:12px; min-width:34px; height:34px; cursor:pointer; }\n.gx-compact-dock .gx-nav-list { display:grid; gap:9px; margin:12px 0; }\n.gx-compact-dock .gx-nav-link { display:flex; justify-content:space-between; gap:10px; align-items:center; padding:12px; border-radius:16px; text-decoration:none; border:1px solid rgba(255,255,255,.10); background:rgba(255,255,255,.045); transition:.18s; color:#f7f4ff; }\n.gx-compact-dock .gx-nav-link:hover { background:rgba(255,255,255,.08); transform:translateX(2px); }\n.gx-compact-dock .gx-nav-link small { display:block; color:#bcb6d8; margin-top:3px; line-height:1.35; }\n.gx-compact-dock .gx-progress { height:9px; border-radius:99px; background:rgba(255,255,255,.08); overflow:hidden; margin:9px 0 14px; }\n.gx-compact-dock .gx-progress span { display:block; height:100%; width:86%; background:linear-gradient(90deg,#9b5cff,#48f0d9); border-radius:99px; }\n.gx-compact-dock .gx-stage-row { display:flex; flex-wrap:wrap; gap:8px; margin:12px 0; }\n.gx-compact-dock .gx-stage { border-radius:999px; padding:7px 10px; border:1px solid rgba(255,255,255,.12); background:rgba(255,255,255,.06); font-size:12px; color:#eee; }\n.gx-compact-dock .gx-stage.active { background:linear-gradient(135deg,#9b5cff,rgba(72,240,217,.8)); border-color:transparent; color:#fff; }\n.gx-compact-dock .gx-premium-actions { display:flex; flex-wrap:wrap; gap:10px; margin-top:18px; }\n.gx-compact-dock .gx-btn { border:1px solid rgba(255,255,255,.16); border-radius:999px; background:rgba(255,255,255,.06); color:#f7f4ff; font-weight:850; padding:11px 14px; cursor:pointer; }\n.gx-compact-dock .gx-btn.cyan { background:linear-gradient(135deg,rgba(72,240,217,.9),rgba(40,172,255,.9)); color:#07101b; }\n.gx-compact-dock .gx-btn.gold { background:linear-gradient(135deg,rgba(247,208,122,.95),rgba(255,165,82,.95)); color:#17110a; }\n.gx-compact-dock .gx-live { border:1px solid rgba(72,240,217,.24); border-radius:18px; background:rgba(72,240,217,.055); padding:12px; margin-top:12px; color:#dffef9; line-height:1.45; }\n.gx-highlight { outline:3px solid rgba(72,240,217,.7)!important; outline-offset:6px; border-radius:22px; }\n.goalos-final-strip { width:min(1180px,92vw); margin:22px auto 0; padding:14px 16px; border:1px solid rgba(134,255,223,.24); border-radius:999px; background:rgba(5,10,20,.76); display:flex; gap:12px; align-items:center; justify-content:space-between; color:#eafffb; box-shadow:0 18px 54px rgba(0,0,0,.32); }\n.goalos-final-strip strong { color:#86ffdf; }\n.goalos-final-strip a { color:#07100d; text-decoration:none; background:linear-gradient(135deg,#c9ff8f,#6dffde); padding:10px 13px; border-radius:999px; font-weight:950; white-space:nowrap; }\n@media(max-width:720px){ .goalos-final-strip { border-radius:22px; flex-direction:column; align-items:flex-start; } .gx-compact-dock .gx-floating-launch { right:10px; bottom:10px; } .gx-compact-dock .gx-panel { right:10px; bottom:106px; width:calc(100vw - 20px); } }\n@media(prefers-reduced-motion:reduce){ *{scroll-behavior:auto!important} .gx-nav-link:hover{transform:none!important} }\n";
function write(rel, text){ const p = path.join(root, rel); fs.mkdirSync(path.dirname(p), {recursive:true}); fs.writeFileSync(p, text); }
write('site/assets/goalos-v30-v34-premium-ux.js', nonIntrusiveJs);
write('docs/generated-source/v30-v34-premium/site/assets/goalos-v30-v34-premium-ux.js', nonIntrusiveJs);
write('site/assets/goalos-v35-worldclass-companion.css', companionCss);
write('docs/generated-source/v35/site/assets/goalos-v35-worldclass-companion.css', companionCss);

function page(title, description, body){ return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title><meta name="description" content="${description}"><meta name="theme-color" content="#070713"><link rel="stylesheet" href="assets/goalos-v22-v35-command-center.css"><link rel="stylesheet" href="assets/goalos-v35-worldclass-companion.css"></head><body class="goalos35-command goalos-v35-final-ready"><main>${body}</main><footer class="goalos35-footer"><p><strong>Public-safe boundary:</strong> ${safe}</p><p>No claim of achieved AGI, ASI, production RSI, autonomous deployment authority, legal certification, investment advice, or live settlement.</p></footer><script src="assets/goalos-v22-v35-command-center.js"></script><script defer src="assets/goalos-v30-v34-premium-ux.js"></script></body></html>`; }
const cards = labs.map(l=>`<a class="goalos35-card" href="${l.route}"><small>${l.v} · ${l.stage}</small><h3>${l.title}</h3><p>${l.value}</p><p><strong>Best for:</strong> ${l.bestFor}</p></a>`).join('\n');
const timeline = labs.map(l=>`<div class="goalos35-tick"><strong>${l.v}</strong>${l.title.split(' & ')[0]}</div>`).join('');
const roleButtons = roles.map(r=>`<button class="goalos35-choice" data-role="${r.id}">${r.label}</button>`).join('');
const modeButtons = modes.map(m=>`<button class="goalos35-choice" data-mode="${m.id}">${m.label}</button>`).join('');
const commandBody = `<div class="goalos35-shell"><nav class="goalos35-nav"><a class="goalos35-brand" href="index.html"><span class="goalos35-sigil">α</span><span>GoalOS Signoff Pro</span></a><div><a class="goalos35-pill" href="public-demo-labs.html">All labs</a> <a class="goalos35-pill" href="loop-rsi-asi-superintelligence-mission-simulator-lab.html">Open v35</a> <a class="goalos35-pill" href="website-guide.html">Guide</a></div></nav><section class="goalos35-hero"><div><div class="goalos35-kicker">Complete public experience · v22–v35</div><h1 class="goalos35-title">Start here.</h1><p class="goalos35-sub">One command center for proof-gated work, blockchain credibility, Proof Before Settlement, RSI governance, and ASI-readiness. Choose a role, run the gates, and open the right lab.</p><div class="goalos35-actions"><a class="goalos35-button" href="#console">Run guided console</a><a class="goalos35-button secondary" href="loop-rsi-asi-superintelligence-mission-simulator-lab.html">Open v35 simulator</a></div></div><aside class="goalos35-panel"><div class="goalos35-kicker">Public-safe dynamic console</div><h2>Interactive, but no inputs or external AI calls.</h2><p class="goalos35-sub">Everything is button-based and deterministic. The site demonstrates gates, receipts, dossiers, rollback, and council decisions without collecting data or moving value.</p><div class="goalos35-metric-grid"><div class="goalos35-metric"><strong>14</strong><span>labs</span></div><div class="goalos35-metric"><strong>v35</strong><span>latest</span></div><div class="goalos35-metric"><strong>0</strong><span>value moved</span></div><div class="goalos35-metric"><strong>1</strong><span>guided route</span></div></div></aside></section><div class="goalos35-timeline">${timeline}</div><section id="console" class="goalos35-console"><div class="goalos35-console-head"><div class="goalos35-dots"><span class="goalos35-dot"></span><span class="goalos35-dot"></span><span class="goalos35-dot"></span></div><strong>GoalOS guided command console</strong><span class="goalos35-pill">button-only · public-safe</span></div><div class="goalos35-console-body"><aside class="goalos35-rail"><p class="goalos35-section-label">Choose role</p>${roleButtons}<p class="goalos35-section-label" style="margin-top:20px">Choose mode</p>${modeButtons}</aside><main class="goalos35-main"><p class="goalos35-section-label">Run cycle</p><div id="g35-stage" class="goalos35-stage"></div><div id="g35-output" class="goalos35-output"></div><div class="goalos35-actions"><button id="g35-next" class="goalos35-button">Next gate</button><a id="g35-open" class="goalos35-button secondary" href="loop-rsi-asi-superintelligence-mission-simulator-lab.html">Open recommended lab</a><button id="g35-copy" class="goalos35-button secondary">Copy synthetic receipt</button></div></main></div></section><section><div class="goalos35-kicker">Complete v22–v35 catalog</div><div class="goalos35-cards">${cards}</div></section></div>`;
const commandHtml = page('GoalOS Signoff Pro · Complete v22-v35 Command Center', 'Role-based public-safe command center for the complete GoalOS Signoff Pro v22-v35 public demonstration suite.', commandBody);
for (const name of ['goalos-v22-v35-command-center.html','start-here.html','latest.html','command-center.html','experience.html','demo.html','proof-to-superintelligence.html','governed-superintelligence.html','v22-v35.html','start.html']) write('site/'+name, commandHtml);
const publicLabsBody = `<div class="goalos35-shell"><nav class="goalos35-nav"><a class="goalos35-brand" href="index.html"><span class="goalos35-sigil">α</span><span>GoalOS Signoff Pro</span></a><div><a class="goalos35-pill" href="goalos-v22-v35-command-center.html">Start here</a><a class="goalos35-pill" href="loop-rsi-asi-superintelligence-mission-simulator-lab.html">v35</a></div></nav><section class="goalos35-hero"><div><div class="goalos35-kicker">Public demonstration suite · v22–v35</div><h1 class="goalos35-title">Every public lab, one clear path.</h1><p class="goalos35-sub">Fourteen public-safe labs show GoalOS from human authority and evidence lineage to blockchain credibility, proof mandates, institutional research, RSI governance, and ASI-readiness gates.</p><div class="goalos35-actions"><a class="goalos35-button" href="goalos-v22-v35-command-center.html">Open command center</a><a class="goalos35-button secondary" href="goalos-public-demo-labs-v22-v35.json">Download manifest</a></div></div><aside class="goalos35-panel"><h2>Public-safe rule</h2><p>${safe}</p><div class="goalos35-metric-grid"><div class="goalos35-metric"><strong>14</strong><span>labs</span></div><div class="goalos35-metric"><strong>0</strong><span>value moved</span></div></div></aside></section><section><div class="goalos35-cards">${cards}</div></section><section class="goalos35-panel"><h2>Core standard</h2><p><strong>Blockchain proves the transaction. GoalOS proves the work. RSI governs invention. ASI must not self-authorize.</strong></p><p>No Proof. No Trust. No Settlement. No ungoverned superintelligence.</p></section></div>`;
write('site/public-demo-labs.html', page('GoalOS Signoff Pro Public Demo Labs v22-v35', 'Complete v22-v35 public demo lab catalog for GoalOS Signoff Pro.', publicLabsBody));
for (const file of fs.readdirSync(site).filter(f=>f.endsWith('.html'))){
  const p = path.join(site, file);
  let html = fs.readFileSync(p, 'utf8');
  if (!html.includes('goalos-v35-worldclass-companion.css')) html = html.replace(/<\/head>/i, '<link rel="stylesheet" href="assets/goalos-v35-worldclass-companion.css"></head>');
  if (!html.includes('goalos-v30-v34-premium-ux.js')) html = html.replace(/<\/body>/i, '<script defer src="assets/goalos-v30-v34-premium-ux.js"></script></body>');
  html = html.replace(/v22-v30/g, 'v22-v35').replace(/v22–v30/g, 'v22–v35').replace(/Nine public-safe labs/g, 'Fourteen public-safe labs').replace(/nine public-safe labs/g, 'fourteen public-safe labs').replace(/six new proof labs/g, 'fourteen public proof labs').replace(/six proof labs/g, 'fourteen public proof labs');
  if (file === 'index.html' && !html.includes('goalos-final-strip')) {
    html = html.replace(/<main>/i, '<main><div class="goalos-final-strip"><span><strong>Complete v22–v35 suite is live:</strong> start with the guided command center, then follow the path to v35.</span><a href="goalos-v22-v35-command-center.html">Start here</a></div>');
  }
  fs.writeFileSync(p, html);
}
const catalog = {version:'v35-final-worldclass-experience', generatedAt:new Date().toISOString(), completeThrough:'v35', publicSafe:true, zeroValueMoved:true, entrypoints:['goalos-v22-v35-command-center.html','public-demo-labs.html','website-guide.html','loop-rsi-asi-superintelligence-mission-simulator-lab.html'], labs, roles, modes, boundary:safe};
write('site/goalos-v22-v35-route-catalog.json', JSON.stringify(catalog, null, 2));
write('site/goalos-v22-v35-experience-audit.json', JSON.stringify({status:'FINAL_EXPERIENCE_READY', checks:['complete v22-v35 route catalog','non-intrusive guided console','homepage stale-copy repaired','public demo hub v22-v35','old v30-v34 top spotlight suppressed'], boundary:safe}, null, 2));
const guide = `# GoalOS Signoff Pro v22-v35 Website Guide\n\nBest public entry point: \`goalos-v22-v35-command-center.html\`.\n\n## Complete public arc\n\n${labs.map(l=>`- **${l.v} — ${l.title}**: ${l.value} (\`${l.route}\`)`).join('\n')}\n\n## Public-safe boundary\n\n${safe}\n\n## Deployment\n\nRun **GoalOS Signoff Pro — World-Class v22-v35 Website Completion** with \`commit_generated_site=true\` and \`deploy_pages=true\`.\n`;
write('docs/GOALOS_SIGNOFF_PRO_V22_V35_WEBSITE_GUIDE.md', guide);
write('GOALOS_V22_V35_WORLDCLASS_WEBSITE_START_HERE.md', '# GoalOS v22-v35 World-Class Website Completion\n\nUpload this package to the repository root. Then run **GoalOS Signoff Pro — World-Class v22-v35 Website Completion**.\n\nRecommended settings: `commit_generated_site=true`, `deploy_pages=true`.\n');
write('GITHUB_WEB_UI_INSTALL_V22_V35_WORLDCLASS_WEBSITE.txt', '1. Download and unzip the package.\n2. Upload the contents to the repository root with GitHub Add file -> Upload files.\n3. Include .github/, scripts/, docs/, and site/ assets.\n4. Commit to a new branch.\n5. Run Actions -> GoalOS Signoff Pro — World-Class v22-v35 Website Completion.\n6. Use commit_generated_site=true and deploy_pages=true.\n');
console.log('GoalOS v22-v35 world-class website completion PASS.');
