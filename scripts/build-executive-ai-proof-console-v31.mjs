#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = process.cwd();
const site = path.join(root, 'site');
const assets = path.join(site, 'assets');
const configPath = path.join(root, 'config', 'executive-ai-proof-console-v31.json');
const config = fs.existsSync(configPath) ? JSON.parse(fs.readFileSync(configPath, 'utf8')) : {};
const generatedAt = new Date().toISOString();
fs.mkdirSync(assets, { recursive: true });

const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[ch]));
const hash = value => crypto.createHash('sha256').update(String(value)).digest('hex');
const write = (rel, content) => { const target = path.join(site, rel); fs.mkdirSync(path.dirname(target), { recursive: true }); fs.writeFileSync(target, content); };
const writeRoot = (rel, content) => { const target = path.join(root, rel); fs.mkdirSync(path.dirname(target), { recursive: true }); fs.writeFileSync(target, content); };
const writeJson = (rel, obj) => write(rel, JSON.stringify(obj, null, 2) + '\n');

const routes = [
  'executive-ai-proof-console.html',
  'proof-experience-console.html',
  'interactive-proof-console.html',
  'ai-proof-console.html',
  'guided-experience.html',
  'what-is-goalos.html',
  'console.html'
];

const roles = [
  {
    id: 'dao-delegate',
    name: 'DAO Delegate',
    short: 'DAO',
    question: 'Should treasury funds move?',
    situation: 'A grantee claims a milestone is complete and requests payment.',
    reject: 'Dashboard updates and Discord posts are not enough to authorize funds.',
    proofPackage: ['Mission Contract', 'Milestone Evidence Docket', 'Reviewer Report', 'Risk Ledger', 'Human / Governance Signoff', 'Mission Receipt'],
    decision: 'Settlement-ready only after evidence, validation, and authority gates pass.',
    nextRoute: 'blockchain-proof-mandate-lab.html',
    score: 94
  },
  {
    id: 'protocol-founder',
    name: 'Protocol Founder',
    short: 'Founder',
    question: 'How do we earn serious credibility?',
    situation: 'The project wants partners, users, and investors to believe execution claims.',
    reject: 'Narrative traction without inspectable proof creates fragile credibility.',
    proofPackage: ['Execution Claims Matrix', 'Evidence Docket', 'Replay Path', 'Public Boundary', 'Receipt', 'Adoption Roadmap'],
    decision: 'Publish proof packages before asking for trust, listings, partnerships, or governance support.',
    nextRoute: 'blockchain-credibility-lab.html',
    score: 91
  },
  {
    id: 'auditor',
    name: 'Auditor / Reviewer',
    short: 'Audit',
    question: 'Was the issue actually fixed?',
    situation: 'A protocol says an audit finding has been remediated.',
    reject: 'An audit badge is helpful, but does not prove the specific fix path by itself.',
    proofPackage: ['Finding-to-Fix Trace', 'Test Evidence', 'Independent Replay', 'Contradiction Pass', 'Rollback Plan', 'Validator Report'],
    decision: 'Promote the remediation claim only after replay, review, and bounded acceptance.',
    nextRoute: 'independent-replay-lab.html',
    score: 93
  },
  {
    id: 'investor',
    name: 'Investor / Partner',
    short: 'Diligence',
    question: 'Is the execution real?',
    situation: 'A team presents milestones, traction, and technical readiness claims.',
    reject: 'Slides, commits, and metrics do not become institutional proof unless claims are mapped to evidence.',
    proofPackage: ['Claims Matrix', 'Evidence Index', 'Due-Diligence Scorecard', 'Risk Boundary', 'Decision State', 'Receipt Pointer'],
    decision: 'Escalate credibility only when material claims are proof-backed and boundary-disclosed.',
    nextRoute: 'proof-before-settlement-research-lab.html',
    score: 92
  },
  {
    id: 'enterprise-buyer',
    name: 'Enterprise Buyer',
    short: 'Enterprise',
    question: 'Can we accept this vendor delivery?',
    situation: 'A vendor delivers AI-assisted blockchain work and asks for signoff.',
    reject: 'A polished deliverable is not enough without process-resolved evidence.',
    proofPackage: ['Frozen Brief', 'Criteria Mapping', 'Artifact Hashes', 'Process Evidence', 'Reviewer Notes', 'Acceptance Receipt'],
    decision: 'Accept only after done criteria, evidence, reviewer judgment, and receipt are aligned.',
    nextRoute: 'process-evidence-lab.html',
    score: 95
  },
  {
    id: 'agent-operator',
    name: 'AI Agent Operator',
    short: 'Agents',
    question: 'Should autonomous work influence future work?',
    situation: 'An agent produced a useful artifact and wants it reused in future missions.',
    reject: 'Useful output is not reusable capability until it becomes proof-carrying.',
    proofPackage: ['Candidate Artifact', 'Selection Certificate', 'Evolution Ledger', 'Canary Result', 'Rollback Receipt', 'Upgrade Right'],
    decision: 'Only proof-carrying, rollbackable artifacts may enter memory or future routing.',
    nextRoute: 'proof-carrying-artifact-lab.html',
    score: 90
  }
];

const gates = [
  ['G1', 'Mission', 'What was promised?', 'Mission Contract'],
  ['G2', 'Evidence', 'What was delivered?', 'Evidence Docket'],
  ['G3', 'Replay', 'Can the path be checked?', 'Replay Log'],
  ['G4', 'Validation', 'What passed or failed?', 'Validator Report'],
  ['G5', 'Risk', 'What still needs caution?', 'Risk Ledger'],
  ['G6', 'Human Authority', 'Who accepts it?', 'Signoff Record'],
  ['G7', 'Receipt', 'What can be referenced?', 'Mission Receipt'],
  ['G8', 'Settlement Readiness', 'What consequence may move?', 'Readiness Signal']
];

const journey = [
  { step: 'Start', label: 'I need the big idea', route: 'executive-ai-proof-console.html', value: 'guided, role-based proof console' },
  { step: 'Understand', label: 'Why blockchain needs it', route: 'blockchain-credibility-lab.html', value: 'v28 credibility standard' },
  { step: 'Require', label: 'How stakeholders ask for proof', route: 'blockchain-proof-mandate-lab.html', value: 'v29 due-diligence mandate' },
  { step: 'Cite', label: 'Give me the serious paper', route: 'proof-before-settlement-research-lab.html', value: 'v30 institutional research standard' },
  { step: 'Inspect', label: 'Show all public labs', route: 'public-demo-labs.html', value: 'v22-v30 proof curriculum' },
  { step: 'Replay', label: 'Run the proof loop', route: 'mission-001-replay.html', value: 'Mission 001 browser replay' }
];

const manifest = {
  id: 'GOALOS-SIGNOFF-PRO-V31-EXECUTIVE-AI-PROOF-CONSOLE',
  version: config.version || '31.0.0',
  generatedAt,
  title: config.title || 'GoalOS Signoff Pro — Executive AI Proof Console & Guided Website Experience Lab v31',
  purpose: 'Make the GoalOS Signoff Pro website immediately understandable, interactive, useful, and executive-friendly without collecting data or connecting wallets.',
  coreMessage: config.coreMessage || 'Blockchain proves the transaction. GoalOS proves the work.',
  standard: config.standard || 'No Proof. No Trust. No Settlement.',
  publicSafety: config.publicSafety || { forms:false, inputs:false, uploads:false, cookies:false, analytics:false, wallets:false, payments:false, personalData:false, valueMoved:0 },
  routes,
  roles: roles.map(({ id, name, question, nextRoute }) => ({ id, name, question, nextRoute })),
  gates: gates.map(([id, name, question, artifact]) => ({ id, name, question, artifact }))
};

const demoBundle = {
  manifestId: manifest.id,
  artifactHash: hash(JSON.stringify(manifest)),
  generatedAt,
  publicSafe: true,
  zeroValueMoved: true,
  scenarios: roles.map(role => ({
    id: role.id,
    role: role.name,
    question: role.question,
    situation: role.situation,
    rejectedMode: role.reject,
    requiredProofPackage: role.proofPackage,
    decision: role.decision,
    syntheticReadinessScore: role.score,
    receiptPointer: `GOALOS-V31-${role.id.toUpperCase()}-${hash(role.id).slice(0, 10)}`
  }))
};

const boundary = {
  publicConsole: true,
  aiConsoleMode: 'browser-local synthetic console; no API call; no prompt box; no user text input; no data collection',
  allowedInteractions: ['scenario buttons', 'role buttons', 'tabs', 'demo run button', 'copy static phrase button'],
  disallowedInteractions: ['text entry', 'file upload', 'wallet connection', 'payment', 'cookie tracking', 'analytics beacon', 'personal/confidential data request'],
  message: 'The console is dynamic and AI-styled, but public-safe. It demonstrates how GoalOS would reason over proof states using predefined synthetic scenarios.'
};

const audit = {
  id: 'GOALOS-SIGNOFF-PRO-WEBSITE-EXPERIENCE-AUDIT-V31',
  generatedAt,
  liveSiteAssessment: 'Strong public-alpha proof architecture; not yet the best possible experience for first-time visitors without a guided executive console.',
  strengths: [
    'Homepage explains proof-to-acceptance and browser-local safety.',
    'Mission 001 exposes a reproducibility packet and baseline ladder.',
    'v28, v29, and v30 create a strong blockchain credibility narrative.',
    'Public-safe posture is consistent: no forms, uploads, wallets, analytics, payments, or personal data.'
  ],
  upgradeFocus: [
    'Add a visitor-first guided console.',
    'Add role-based pathways for DAOs, auditors, investors, founders, enterprises, and AI operators.',
    'Add dynamic proof-gate visualization without user input.',
    'Add homepage entry point and floating guided-tour affordance across pages.',
    'Fix visible 12/14 packet-file mismatch where possible.'
  ],
  additiveOnly: true
};

const css = String.raw`
:root{--bg:#03070b;--ink:#f8fff9;--muted:#b9cbd0;--line:rgba(255,255,255,.13);--mint:#86ffdf;--cyan:#68e9ff;--gold:#ffe889;--rose:#ff8fb6;--panel:rgba(255,255,255,.065);--shadow:0 32px 110px rgba(0,0,0,.45)}*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:radial-gradient(circle at 14% 0,rgba(134,255,223,.18),transparent 32%),radial-gradient(circle at 92% 10%,rgba(255,232,137,.14),transparent 34%),linear-gradient(145deg,#020609,#061418 52%,#03070b);color:var(--ink);font-family:Inter,ui-sans-serif,system-ui,-apple-system,Segoe UI,sans-serif;overflow-x:hidden}a{color:inherit}.top{position:sticky;top:0;z-index:60;display:flex;align-items:center;justify-content:space-between;gap:16px;padding:16px clamp(18px,4vw,56px);background:rgba(3,7,11,.76);backdrop-filter:blur(20px);border-bottom:1px solid var(--line)}.brand{display:flex;align-items:center;gap:12px;text-decoration:none;font-weight:950;letter-spacing:.11em;text-transform:uppercase}.logo{width:32px;height:32px;border-radius:12px;background:linear-gradient(135deg,var(--gold),var(--mint),var(--cyan));box-shadow:0 0 40px rgba(134,255,223,.28)}nav{display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end}nav a,.pill{font-size:13px;font-weight:900;text-decoration:none;padding:10px 13px;border:1px solid rgba(255,255,255,.13);border-radius:999px;color:#eafdff}.wrap{width:min(1220px,calc(100% - 36px));margin:0 auto}.hero{min-height:760px;display:grid;grid-template-columns:1.03fr .97fr;align-items:center;gap:42px;padding:82px 0}.eyebrow{color:var(--mint);font-weight:950;letter-spacing:.30em;text-transform:uppercase;font-size:12px}.h1{font-size:clamp(54px,7vw,112px);line-height:.84;letter-spacing:-.075em;margin:18px 0}.h1 span{display:block;color:transparent;background:linear-gradient(100deg,var(--gold),var(--mint),var(--cyan));-webkit-background-clip:text;background-clip:text}.lead{font-size:clamp(18px,2.1vw,26px);line-height:1.48;color:#e4f4f2;max-width:880px}.actions{display:flex;gap:12px;flex-wrap:wrap;margin-top:26px}.btn{display:inline-flex;align-items:center;justify-content:center;min-height:48px;padding:0 19px;border-radius:999px;text-decoration:none;border:1px solid rgba(255,255,255,.15);font-weight:950;background:rgba(255,255,255,.04);color:#efffff;cursor:pointer}.btn.primary{border:0;background:linear-gradient(120deg,var(--gold),var(--mint),var(--cyan));color:#031010}.safe{display:flex;flex-wrap:wrap;gap:8px;margin-top:28px}.safe span{font-size:12px;color:#d5e4e7;border:1px solid rgba(255,255,255,.13);border-radius:999px;padding:8px 10px}.console{border:1px solid rgba(134,255,223,.25);border-radius:36px;background:linear-gradient(145deg,rgba(255,255,255,.09),rgba(255,255,255,.035));box-shadow:var(--shadow);overflow:hidden}.console-head{display:flex;justify-content:space-between;gap:12px;align-items:center;padding:18px 20px;border-bottom:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.035)}.console-head b{color:var(--mint)}.console-body{padding:20px}.role-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:9px}.role-btn{min-height:58px;border-radius:18px;border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.055);color:#f9fffd;font-weight:950;cursor:pointer}.role-btn.active{background:linear-gradient(135deg,rgba(255,232,137,.25),rgba(134,255,223,.18));border-color:rgba(255,232,137,.55)}.screen{margin-top:16px;border:1px solid rgba(255,255,255,.11);border-radius:28px;background:rgba(1,4,6,.54);overflow:hidden}.screen-top{display:flex;gap:8px;padding:13px 16px;border-bottom:1px solid rgba(255,255,255,.09)}.dot{width:10px;height:10px;border-radius:50%;background:var(--rose)}.dot:nth-child(2){background:var(--gold)}.dot:nth-child(3){background:var(--mint)}.screen-content{padding:18px;min-height:360px}.screen h2{font-size:32px;line-height:1;margin:0 0 8px;letter-spacing:-.04em}.screen p{color:var(--muted);line-height:1.5}.status-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin:16px 0}.stat{padding:14px;border-radius:18px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.09)}.stat b{display:block;font-size:26px;color:var(--gold)}.log{font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;font-size:13px;color:#d8fff5;border-radius:18px;background:#020607;border:1px solid rgba(134,255,223,.18);padding:14px;min-height:126px;white-space:pre-wrap}.section{padding:70px 0}.section h2{font-size:clamp(38px,5.4vw,84px);line-height:.9;letter-spacing:-.07em;margin:0 0 16px}.two{display:grid;grid-template-columns:1fr 1fr;gap:22px}.card{padding:26px;border:1px solid var(--line);border-radius:30px;background:var(--panel);box-shadow:0 18px 60px rgba(0,0,0,.22)}.card h3{font-size:26px;letter-spacing:-.035em;margin:0 0 10px}.card p,.card li{color:var(--muted);line-height:1.55}.gates{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}.gate{position:relative;min-height:156px;padding:18px;border-radius:24px;border:1px solid rgba(255,255,255,.13);background:rgba(255,255,255,.05);overflow:hidden}.gate b{display:inline-flex;width:42px;height:42px;align-items:center;justify-content:center;border-radius:14px;background:linear-gradient(135deg,var(--gold),var(--mint));color:#031010}.gate h3{margin:14px 0 8px}.gate p{color:var(--muted);line-height:1.45}.gate.active{border-color:rgba(134,255,223,.58);background:linear-gradient(145deg,rgba(134,255,223,.16),rgba(255,232,137,.08))}.journey{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:10px}.journey a{text-decoration:none}.journey-card{height:100%;padding:18px;border-radius:22px;border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.045)}.journey-card b{color:var(--gold)}.journey-card span{display:block;margin-top:8px;color:var(--muted);font-size:13px;line-height:1.4}.copybox{display:flex;gap:12px;align-items:center;justify-content:space-between;padding:20px;border-radius:26px;border:1px solid rgba(255,232,137,.32);background:rgba(255,232,137,.08)}.copybox code{font-size:clamp(18px,2.2vw,30px);font-weight:950;color:#fff8ee;white-space:normal}.footer{border-top:1px solid rgba(255,255,255,.12);padding:30px 0 44px;color:var(--muted)}.v31-guide{position:fixed;right:18px;bottom:18px;z-index:1000;display:inline-flex;align-items:center;gap:8px;padding:13px 15px;border-radius:999px;background:linear-gradient(135deg,#ffe889,#86ffdf,#68e9ff);color:#031010;font-weight:950;text-decoration:none;box-shadow:0 18px 50px rgba(0,0,0,.35)}@media(max-width:980px){.hero,.two{grid-template-columns:1fr}.journey{grid-template-columns:repeat(2,minmax(0,1fr))}.gates{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:660px){.top{align-items:flex-start;flex-direction:column}.h1{font-size:52px}.role-grid,.status-grid,.gates,.journey{grid-template-columns:1fr}.screen-content{min-height:420px}}`;

const js = String.raw`
(()=>{const roles=${JSON.stringify(roles)};const gates=${JSON.stringify(gates)};const $=(s,r=document)=>r.querySelector(s);const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));let active=roles[0];function renderRole(){if(!$('#role-title'))return;$$('.role-btn').forEach(b=>b.classList.toggle('active',b.dataset.role===active.id));$('#role-title').textContent=active.name;$('#role-question').textContent=active.question;$('#role-situation').textContent=active.situation;$('#role-reject').textContent=active.reject;$('#role-proof').innerHTML=active.proofPackage.map(x=>'<li>'+x+'</li>').join('');$('#role-decision').textContent=active.decision;$('#readiness').textContent=active.score;$('#receipt').textContent='GOALOS-V31-'+active.id.toUpperCase();$('#next-route').setAttribute('href',active.nextRoute);$('#next-route').textContent='Open next best lab';$('#console-log').textContent='GoalOS console ready. Select a role, then run the proof gates.\nPublic-safe mode: no prompt box, no upload, no wallet, no data leaves the page.';$$('.gate').forEach(g=>g.classList.remove('active'))}function run(){const log=$('#console-log');if(!log)return;log.textContent='';let i=0;const lines=['Mission loaded: '+active.situation,'Rejected unsupported mode: '+active.reject,'Proof package required: '+active.proofPackage.join(' · ')];const tick=()=>{if(i<gates.length){const gate=gates[i];const el=$('.gate[data-gate="'+gate[0]+'"]');if(el)el.classList.add('active');lines.push('PASS '+gate[0]+' — '+gate[1]+': '+gate[3]);log.textContent=lines.join('\n');i++;setTimeout(tick,230)}else{lines.push('DECISION — '+active.decision);lines.push('RECEIPT POINTER — GOALOS-V31-'+active.id.toUpperCase());lines.push('VALUE MOVED — 0. Public demonstration only.');log.textContent=lines.join('\n')}};tick()}document.addEventListener('click',e=>{const role=e.target.closest('[data-role]');if(role){active=roles.find(r=>r.id===role.dataset.role)||roles[0];renderRole()}if(e.target.closest('[data-run-v31]'))run();if(e.target.closest('[data-copy-standard]')){navigator.clipboard?.writeText('Blockchain proves the transaction. GoalOS proves the work. No Proof. No Trust. No Settlement.').catch(()=>{});e.target.textContent='Copied standard';setTimeout(()=>e.target.textContent='Copy standard',1400)}});document.addEventListener('DOMContentLoaded',renderRole)})();`;

write('assets/goalos-v31-experience.css', css + '\n');
write('assets/goalos-v31-experience.js', js + '\n');

function consoleHtml(route) {
  const roleButtons = roles.map((r, i) => `<button class="role-btn${i===0?' active':''}" data-role="${esc(r.id)}"><span>${esc(r.short)}</span><br>${esc(r.name)}</button>`).join('');
  const gateCards = gates.map(([id, name, question, artifact]) => `<article class="gate" data-gate="${esc(id)}"><b>${esc(id)}</b><h3>${esc(name)}</h3><p>${esc(question)}</p><p><strong>${esc(artifact)}</strong></p></article>`).join('');
  const journeyCards = journey.map(j => `<a href="${esc(j.route)}"><div class="journey-card"><b>${esc(j.step)}</b><span>${esc(j.label)}</span><span>${esc(j.value)}</span></div></a>`).join('');
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>GoalOS Signoff Pro — Executive AI Proof Console v31</title><meta name="description" content="A public-safe interactive GoalOS console that explains proof-gated work, blockchain credibility, and proof before settlement."><meta property="og:title" content="GoalOS Executive AI Proof Console"><meta property="og:description" content="Blockchain proves the transaction. GoalOS proves the work. No Proof. No Trust. No Settlement."><link rel="stylesheet" href="assets/goalos-v31-experience.css"><script defer src="assets/goalos-v31-experience.js"></script></head><body data-goalos-v31-route="${esc(route)}"><header class="top"><a class="brand" href="index.html"><span class="logo"></span><span>GoalOS Signoff Pro</span></a><nav><a href="index.html">Institution</a><a href="public-demo-labs.html">All labs</a><a href="blockchain-credibility-lab.html">v28</a><a href="blockchain-proof-mandate-lab.html">v29</a><a href="proof-before-settlement-research-lab.html">v30</a><a href="no-user-data.html">Safety</a></nav></header><main class="wrap"><section class="hero"><div><p class="eyebrow">Public experience upgrade · v31</p><h1 class="h1">The guided AI proof console. <span>Proof made obvious.</span></h1><p class="lead">A first-time visitor can now understand GoalOS in minutes: choose a role, run a synthetic proof gate, see what evidence is required, and follow the best next page. It is dynamic, useful, executive-friendly, and public-safe.</p><div class="actions"><a class="btn primary" href="#console">Run the console</a><a class="btn" href="public-demo-labs.html">View all labs</a><a class="btn" href="research/proof-before-settlement/GoalOS_Proof_Before_Settlement_Elite_Edition.pdf">Download paper</a></div><div class="safe"><span>No forms</span><span>No inputs</span><span>No uploads</span><span>No cookies</span><span>No analytics</span><span>No wallets</span><span>No payments</span><span>No personal or confidential data</span><span>0 value moved</span></div></div><aside class="console" id="console"><div class="console-head"><span>GoalOS AI Proof Console</span><b>Public-safe synthetic mode</b></div><div class="console-body"><div class="role-grid">${roleButtons}</div><div class="screen"><div class="screen-top"><span class="dot"></span><span class="dot"></span><span class="dot"></span></div><div class="screen-content"><h2 id="role-title">DAO Delegate</h2><p id="role-question"></p><p id="role-situation"></p><div class="status-grid"><div class="stat"><b id="readiness">94</b><span>readiness signal</span></div><div class="stat"><b>0</b><span>value moved</span></div><div class="stat"><b>8</b><span>proof gates</span></div></div><p><strong>Reject:</strong> <span id="role-reject"></span></p><p><strong>Required proof package:</strong></p><ul id="role-proof"></ul><p><strong>Decision:</strong> <span id="role-decision"></span></p><p><strong>Receipt pointer:</strong> <span id="receipt"></span></p><div class="actions"><button class="btn primary" data-run-v31>Run proof gates</button><a class="btn" id="next-route" href="blockchain-proof-mandate-lab.html">Open next best lab</a></div><pre class="log" id="console-log"></pre></div></div></div></aside></section><section class="section"><p class="eyebrow">The proof package</p><h2>What every serious blockchain claim should expose.</h2><div class="gates">${gateCards}</div></section><section class="section two"><article class="card"><p class="eyebrow">Before GoalOS</p><h3>Claim-based credibility</h3><p>Announcements, dashboards, screenshots, badges, and governance posts can help, but they do not always prove that the underlying work was complete, reviewed, replayable, bounded, and accepted.</p><ul><li>Hard to audit after the fact.</li><li>Easy to overclaim.</li><li>Difficult to connect to settlement decisions.</li></ul></article><article class="card"><p class="eyebrow">With GoalOS</p><h3>Proof-packaged credibility</h3><p>The mission, evidence, replay path, validation, risk, human authority, and signed receipt become inspectable before trust, settlement readiness, reputation, or governance consequences move.</p><ul><li>Clearer decisions.</li><li>Better accountability.</li><li>More credible public trust.</li></ul></article></section><section class="section"><p class="eyebrow">Best first path</p><h2>Guide every visitor to the right proof surface.</h2><div class="journey">${journeyCards}</div></section><section class="section"><div class="copybox"><code>Blockchain proves the transaction. GoalOS proves the work. No Proof. No Trust. No Settlement.</code><button class="btn primary" data-copy-standard>Copy standard</button></div></section></main><footer class="wrap footer"><b>GoalOS Signoff Pro v31</b><p>Executive AI Proof Console & Guided Website Experience Lab. Dynamic, useful, no-input, browser-local, public-safe demonstration only.</p><aside class="site-rule" data-goalos-legal-rail="v12" style="position:sticky;bottom:0;z-index:80;padding:13px 18px;text-align:center;background:rgba(3,7,11,.92);backdrop-filter:blur(16px);border-top:1px solid rgba(255,255,255,.13);color:#b9cbd0;font-size:13px"><b style="color:#86ffdf">Public site rule</b> No forms · no inputs · no uploads · no cookies · no analytics · no wallets · no payments · no personal or confidential data · zero value moved.</aside></footer><a class="v31-guide" href="executive-ai-proof-console.html" aria-label="Open GoalOS guided console">✦ Guided console</a></body></html>`;
}

const html = consoleHtml(routes[0]);
for (const route of routes) write(route, html.replace(`data-goalos-v31-route="${routes[0]}"`, `data-goalos-v31-route="${route}"`));

writeJson('executive-ai-proof-console-v31-manifest.json', manifest);
writeJson('ai-console-demo-bundle.json', demoBundle);
writeJson('public-safe-ai-console-boundary.json', boundary);
writeJson('visitor-journey-map-v31.json', { generatedAt, journey });
writeJson('website-experience-audit-v31.json', audit);

function loadLabsManifest() {
  const candidates = ['goalos-public-demo-labs-v22-v30.json','goalos-public-demo-labs-v22-v29.json','goalos-public-demo-labs-v22-v27.json'];
  for (const file of candidates) {
    const p = path.join(site, file);
    if (fs.existsSync(p)) {
      try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch {}
    }
  }
  return { generatedAt, labs: [] };
}
const labsManifest = loadLabsManifest();
const labs = Array.isArray(labsManifest.labs) ? labsManifest.labs.filter(l => String(l.version) !== 'v31' && String(l.version) !== '31') : [];
labs.push({
  version: 'v31',
  title: 'Executive AI Proof Console & Guided Website Experience Lab',
  route: 'executive-ai-proof-console.html',
  purpose: 'Makes GoalOS immediately understandable through role-based, interactive, public-safe proof consoles.',
  proofLoop: 'Role → situation → proof package → proof gates → decision → best next lab.',
  bestFor: 'First-time visitors, executives, DAOs, auditors, investors, enterprises, AI operators, and blockchain teams.',
  valueMoved: 0
});
writeJson('goalos-public-demo-labs-v22-v31.json', { ...labsManifest, generatedAt, version: 'v22-v31', labCount: labs.length, labs });

const homepagePatch = `<!-- GOALOS_V31_EXECUTIVE_PROOF_CONSOLE_START --><section class="goalos-v31-executive-proof-console" style="width:min(1180px,92vw);margin:88px auto;padding:clamp(26px,4vw,46px);border:1px solid rgba(134,255,223,.36);border-radius:42px;background:radial-gradient(circle at 16% 0,rgba(134,255,223,.18),transparent 34%),radial-gradient(circle at 92% 8%,rgba(255,232,137,.15),transparent 36%),linear-gradient(145deg,rgba(8,24,29,.96),rgba(3,7,11,.98));box-shadow:0 36px 120px rgba(0,0,0,.46)"><div style="color:#86ffdf;font-weight:950;letter-spacing:.24em;text-transform:uppercase;font-size:12px">GoalOS Signoff Pro · v31 guided experience</div><h2 style="font-size:clamp(42px,7vw,96px);line-height:.84;letter-spacing:-.08em;margin:16px 0 18px;color:#fff8ee">The AI proof console.<br><span style="background:linear-gradient(90deg,#ffe889,#86ffdf,#68e9ff);-webkit-background-clip:text;background-clip:text;color:transparent">Proof made obvious.</span></h2><p style="max-width:960px;color:#d9edf0;font-size:19px;line-height:1.58">Choose your role, run a public-safe proof gate, see the required evidence package, and follow the right next lab. Dynamic and interactive, but still no forms, no inputs, no uploads, no wallets, no analytics, no payments, and zero value moved.</p><p><a href="executive-ai-proof-console.html" style="display:inline-block;margin:12px 10px 0 0;padding:15px 19px;border-radius:999px;background:linear-gradient(135deg,#ffe889,#86ffdf,#68e9ff);color:#061010;font-weight:950;text-decoration:none">Open the guided console</a><a href="goalos-public-demo-labs-v22-v31.json" style="display:inline-block;margin:12px 10px 0 0;padding:15px 19px;border-radius:999px;border:1px solid rgba(255,255,255,.18);color:#d9edf0;text-decoration:none;font-weight:850">Inspect v31 manifest</a></p><div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:22px"><span style="padding:9px 11px;border-radius:999px;border:1px solid rgba(255,255,255,.13);color:#d9edf0">DAO delegates</span><span style="padding:9px 11px;border-radius:999px;border:1px solid rgba(255,255,255,.13);color:#d9edf0">Auditors</span><span style="padding:9px 11px;border-radius:999px;border:1px solid rgba(255,255,255,.13);color:#d9edf0">Investors</span><span style="padding:9px 11px;border-radius:999px;border:1px solid rgba(255,255,255,.13);color:#d9edf0">Enterprises</span><span style="padding:9px 11px;border-radius:999px;border:1px solid rgba(255,255,255,.13);color:#d9edf0">AI operators</span></div></section><!-- GOALOS_V31_EXECUTIVE_PROOF_CONSOLE_END -->`;

function addHeadAsset(html, rel) {
  if (html.includes(rel)) return html;
  return html.replace(/<\/head>/i, `<link rel="stylesheet" href="${rel}"></head>`);
}
function addGlobalGuide(html) {
  if (html.includes('GOALOS_V31_GLOBAL_GUIDE')) return html;
  const snippet = `<!-- GOALOS_V31_GLOBAL_GUIDE --><a href="executive-ai-proof-console.html" style="position:fixed;right:18px;bottom:18px;z-index:9999;display:inline-flex;align-items:center;gap:8px;padding:13px 15px;border-radius:999px;background:linear-gradient(135deg,#ffe889,#86ffdf,#68e9ff);color:#031010;font-family:Inter,ui-sans-serif,system-ui,-apple-system,Segoe UI,sans-serif;font-weight:950;text-decoration:none;box-shadow:0 18px 50px rgba(0,0,0,.35)">✦ Guided console</a>`;
  return html.replace(/<\/body>/i, snippet + '</body>');
}

const indexPath = path.join(site, 'index.html');
if (fs.existsSync(indexPath)) {
  let index = fs.readFileSync(indexPath, 'utf8');
  index = index.replace(/<b>12<\/b>\s*<span>packet files<\/span>/g, '<b>14</b><span>packet files</span>');
  index = index.replace(/<!-- GOALOS_V31_EXECUTIVE_PROOF_CONSOLE_START -->[\s\S]*?<!-- GOALOS_V31_EXECUTIVE_PROOF_CONSOLE_END -->/g, '');
  const heroClose = index.indexOf('</section><section class="demo-panel"');
  if (heroClose >= 0) index = index.slice(0, heroClose + '</section>'.length) + homepagePatch + index.slice(heroClose + '</section>'.length);
  else {
    const mainStart = index.indexOf('<main>');
    if (mainStart >= 0) index = index.slice(0, mainStart + '<main>'.length) + homepagePatch + index.slice(mainStart + '<main>'.length);
    else index = index.replace(/<\/body>/i, homepagePatch + '</body>');
  }
  index = addGlobalGuide(index);
  fs.writeFileSync(indexPath, index);
}

const publicLabsPath = path.join(site, 'public-demo-labs.html');
if (fs.existsSync(publicLabsPath)) {
  let hub = fs.readFileSync(publicLabsPath, 'utf8');
  hub = hub.replace(/<!-- GOALOS_V31_PUBLIC_HUB_START -->[\s\S]*?<!-- GOALOS_V31_PUBLIC_HUB_END -->/g, '');
  const hubPatch = `<!-- GOALOS_V31_PUBLIC_HUB_START --><section style="width:min(1180px,92vw);margin:58px auto;padding:32px;border:1px solid rgba(134,255,223,.34);border-radius:34px;background:linear-gradient(145deg,rgba(8,24,29,.94),rgba(3,7,11,.97));box-shadow:0 24px 90px rgba(0,0,0,.38)"><div style="color:#86ffdf;font-weight:950;letter-spacing:.24em;text-transform:uppercase;font-size:12px">v31 · guided experience</div><h2 style="font-size:clamp(36px,5vw,76px);line-height:.9;letter-spacing:-.07em;margin:14px 0;color:#fff8ee">Executive AI Proof Console</h2><p style="max-width:880px;color:#d9edf0;font-size:18px;line-height:1.56">A role-based, dynamic console that makes every lab easier to understand. Start here when the visitor asks: what is this, why does it matter, and what should I inspect next?</p><p><a href="executive-ai-proof-console.html" style="display:inline-block;margin-top:10px;padding:14px 18px;border-radius:999px;background:linear-gradient(135deg,#ffe889,#86ffdf,#68e9ff);color:#061010;font-weight:950;text-decoration:none">Open v31 console</a></p></section><!-- GOALOS_V31_PUBLIC_HUB_END -->`;
  hub = hub.replace(/<\/main>/i, hubPatch + '</main>');
  fs.writeFileSync(publicLabsPath, hub);
}

for (const file of fs.existsSync(site) ? fs.readdirSync(site) : []) {
  if (!file.endsWith('.html')) continue;
  const p = path.join(site, file);
  let htmlFile = fs.readFileSync(p, 'utf8');
  htmlFile = htmlFile.replace(/Public site rule No forms · no uploads · no cookies · no analytics · no wallets · no payments · no personal or confidential data\.No forms · no inputs · no uploads · no cookies · no analytics · no wallets · no payments · no personal or confidential data\./g, 'Public site rule No forms · no inputs · no uploads · no cookies · no analytics · no wallets · no payments · no personal or confidential data.');
  htmlFile = addGlobalGuide(htmlFile);
  fs.writeFileSync(p, htmlFile);
}

const sitemapPath = path.join(site, 'sitemap.xml');
if (fs.existsSync(sitemapPath)) {
  let xml = fs.readFileSync(sitemapPath, 'utf8');
  const base = 'https://montrealai.github.io/goalos-signoff-pro/';
  const additions = routes.filter(r => !xml.includes(base + r)).map(r => `  <url><loc>${base}${r}</loc></url>`).join('\n');
  if (additions) xml = xml.replace(/<\/urlset>/, additions + '\n</urlset>');
  fs.writeFileSync(sitemapPath, xml);
}

writeRoot('verification/EXECUTIVE_AI_PROOF_CONSOLE_V31_VALIDATION.md', `# GoalOS Signoff Pro v31 Validation\n\nGenerated: ${generatedAt}\n\nThis validation record covers the additive v31 guided experience upgrade.\n\n## Guarantees\n\n- Adds the Executive AI Proof Console and aliases.\n- Preserves existing pages and labs.\n- Uses buttons, tabs, and static scenario data only.\n- Adds no forms, inputs, uploads, cookies, analytics, wallets, payments, or personal/confidential data.\n- Moves zero value.\n\n## Routes\n\n${routes.map(r => `- \`${r}\``).join('\n')}\n`);
console.log(`GoalOS Executive AI Proof Console v31 generated ${routes.length} routes, patched homepage/demo hub when available, and preserved public-safe posture.`);
