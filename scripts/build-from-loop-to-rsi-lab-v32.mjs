#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = process.cwd();
const site = path.join(root, 'site');
const assets = path.join(site, 'assets');
const configPath = path.join(root, 'config', 'from-loop-to-rsi-v32.json');
const config = fs.existsSync(configPath) ? JSON.parse(fs.readFileSync(configPath, 'utf8')) : {};
const generatedAt = new Date().toISOString();
fs.mkdirSync(assets, { recursive: true });

const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[ch]));
const hash = value => crypto.createHash('sha256').update(String(value)).digest('hex');
const write = (rel, content) => { const target = path.join(site, rel); fs.mkdirSync(path.dirname(target), { recursive: true }); fs.writeFileSync(target, content); };
const writeJson = (rel, obj) => write(rel, JSON.stringify(obj, null, 2) + '\n');

const routes = config.routes || [
  'from-loop-to-rsi-lab.html',
  'loop-to-rsi.html',
  'rsi.html',
  'agi-alpha-rsi-lab.html',
  'rsi-governance-console.html',
  'sovereign-invention-governance-lab.html',
  'deterministic-invention-os-lab.html',
  'move37-breakthrough-lab.html',
  'omni-search-control-lab.html'
];

const stages = [
  { id:'TARGET', label:'Target', purpose:'Allocate exploration pressure across archive cells, bridge regions, and themes.', artifacts:['coverage_targets.json','bridge_targets.json','omni_explore_plan.json'] },
  { id:'EMIT', label:'Emit', purpose:'Generate candidate cards under explicit constraints and targeting.', artifacts:['candidates.raw.jsonl','novelty_distance.jsonl','stage_log.jsonl'] },
  { id:'FILTER', label:'Filter', purpose:'Apply risk gates and interestingness routing without admission authority.', artifacts:['candidates.filtered.jsonl','risk_reports.jsonl','omni_interest.jsonl'] },
  { id:'ATLAS', label:'Atlas', purpose:'Extract mechanisms, causal triples, and neighborhood context for comparatives.', artifacts:['causal_atlas_triples.jsonl','neighborhood_context.jsonl'] },
  { id:'TEST-PLAN', label:'Test-plan', purpose:'Build falsification ladders and schedule cheapest useful probes.', artifacts:['falsification_ladders.jsonl','probe_schedule.jsonl'] },
  { id:'EVAL', label:'Eval', purpose:'Evaluate against incumbent, neighbor, and null baselines; mint evidence objects.', artifacts:['eval_results.jsonl','baseline_comparison.jsonl','evidence_objects.jsonl','eci_ledger.jsonl'] },
  { id:'INSERT', label:'Insert', purpose:'Update append-only archive mechanically; record breakthrough events.', artifacts:['updated_frontier_cell.csv','updated_frontier_cell.jsonl','breakthrough_events.jsonl'] },
  { id:'PROMOTE', label:'Promote', purpose:'Rank promotions by mechanical scoring and emit queue artifacts.', artifacts:['promotion_queue.csv','promotion_queue.jsonl'] }
];

const gates = [
  { id:'risk', name:'Risk gate', rule:'Prohibited-domain and unsafe-deployment signals can stop or downgrade outcomes.', signal:'BLOCK / PROBE / REFINE / ESCALATE' },
  { id:'evidence', name:'Evidence gate', rule:'Confidence cannot inflate without evidence execution; simulated evidence stays capped.', signal:'ECI capped until execution' },
  { id:'baseline', name:'Baseline gate', rule:'Every serious advantage claim is comparative against incumbent, neighbor, or null baseline.', signal:'AdvantageDelta required' },
  { id:'persistence', name:'Persistence gate', rule:'High novelty receives more skepticism and stress testing before promotion.', signal:'Probe-first for novelty ≥ 0.80' },
  { id:'authority', name:'Human authority gate', rule:'Validator/Architect Council can stop, bound, or request a dossier before release.', signal:'Council decision state' }
];

const scenarios = [
  {
    id:'loop', label:'Proof loop', title:'The current GoalOS loop',
    claim:'A mission can become accepted work only after proof, validation, human authority, and receipt.',
    sequence:['Mission','Work','Evidence','Replay','Validation','Receipt','Settlement readiness','Chronicle memory'],
    decision:'REVIEW_READY', score:92,
    dossier:'Mission Receipt + Evidence Docket',
    message:'The work loop becomes inspectable before trust or consequence moves.'
  },
  {
    id:'rsi', label:'RSI kernel', title:'From loop to recursive invention governance',
    claim:'Open-ended invention requires a deterministic governance kernel before AGI-scale systems mature.',
    sequence:['Target','Emit','Filter','Atlas','Test-plan','Eval','Insert','Promote'],
    decision:'GOVERNED_EXPLORATION', score:95,
    dossier:'Sovereign Dossier + RSI Ledger',
    message:'The proof loop is upgraded into a governed invention operating system.'
  },
  {
    id:'move37', label:'Move-37', title:'Breakthroughs as state transitions',
    claim:'A surprising candidate is not accepted as a story; it must reproduce, stress-test, persist, and be packaged.',
    sequence:['Recognize','Reproduce','Stress-test','Persistence','Dossier','Council review'],
    decision:'PROBE_FIRST', score:88,
    dossier:'Move-37 Dossier',
    message:'High novelty increases skepticism; authority remains mechanical and reviewable.'
  },
  {
    id:'omni', label:'OMNI', title:'Search control is not outcome authority',
    claim:'OMNI can improve where exploration pressure goes, but cannot bypass risk, evidence, baseline, or persistence gates.',
    sequence:['Allocate','Route','Suggest','Gate','Evaluate','Council'],
    decision:'SEARCH_CONTROL_ONLY', score:96,
    dossier:'OMNI Boundary Receipt',
    message:'Exploration becomes smarter without becoming ungoverned.'
  }
];

const dashboard = [
  { metric:'Replayability', target:'≥95%', value:96, note:'Cycles reproducible from manifests' },
  { metric:'Schema integrity', target:'0 silent failures', value:100, note:'Repair or hard-stop semantics' },
  { metric:'Evidence quality', target:'EXECUTED share rising', value:74, note:'Simulated evidence remains bounded' },
  { metric:'Advantage confirmation', target:'Positive Δ under stress', value:82, note:'Baseline-comparative persistence' },
  { metric:'Safety posture', target:'No public data/funds', value:100, note:'Public demo has no value movement' }
];

const sourceDocuments = config.sourceDocuments || [
  { title:'AGI Alpha RSI — Sovereign Invention Governance', publicUrl:'https://github.com/MontrealAI/AGI-Alpha-Agent-v0/blob/main/docs/presentation/AGI_Alpha_RSI_Sovereign_v0.pdf', localPath:'research/rsi/AGI_Alpha_RSI_Sovereign_v0.pdf' },
  { title:'AGI Alpha RSI — Sovereign Strategy Brief', publicUrl:'https://github.com/MontrealAI/AGI-Alpha-Agent-v0/blob/main/docs/presentation/AGI_Alpha_RSI_Sovereign_Strategy_Brief_v0.pdf', localPath:'research/rsi/AGI_Alpha_RSI_Sovereign_Strategy_Brief_v0.pdf' }
];

const rsiDocSourceDir = path.join(root, 'docs', 'research', 'rsi');
for (const doc of sourceDocuments) {
  const filename = path.basename(doc.localPath || '');
  if (!filename) continue;
  const src = path.join(rsiDocSourceDir, filename);
  const dst = path.join(site, doc.localPath);
  if (fs.existsSync(src)) {
    fs.mkdirSync(path.dirname(dst), { recursive: true });
    fs.copyFileSync(src, dst);
  }
}
if (fs.existsSync(rsiDocSourceDir)) {
  const readme = path.join(rsiDocSourceDir, 'README.md');
  if (fs.existsSync(readme)) write('research/rsi/README.txt', fs.readFileSync(readme, 'utf8'));
}


const manifest = {
  id: config.id || 'GOALOS-SIGNOFF-PRO-V32-FROM-LOOP-TO-RSI',
  version: config.version || '32.0.0',
  generatedAt,
  title: config.title || 'GoalOS Signoff Pro — From Loop to RSI: Sovereign Invention Governance Lab v32',
  tagline: config.tagline || 'The proof loop becomes an invention-governance institution.',
  coreMessage: config.coreMessage || 'Blockchain proves the transaction. GoalOS proves the work. RSI governs the invention loop.',
  standard: config.standard || 'No Proof. No Trust. No Settlement. No ungoverned self-improvement.',
  claimBoundary: [
    'Public-safe demonstration only.',
    'No claim that AGI, ASI, or recursive self-improvement has been achieved.',
    'No production deployment authority.',
    'No wallet, escrow, payment, token transaction, user upload, user account, analytics, cookie, or personal data collection.',
    'The RSI console uses predefined synthetic scenarios and does not call an external AI service.'
  ],
  routes,
  stages: stages.map(s => ({ id:s.id, label:s.label, purpose:s.purpose, artifacts:s.artifacts })),
  gates,
  scenarios: scenarios.map(s => ({ id:s.id, title:s.title, decision:s.decision, dossier:s.dossier })),
  sourceDocuments
};

const pipelineArtifact = {
  id:'GOALOS-V32-DETERMINISTIC-INVENTION-PIPELINE',
  generatedAt,
  summary:'Target → Emit → Filter → Atlas → Test-plan → Eval → Insert → Promote.',
  stages,
  invariant:'Every stage produces schema-bound artifacts; failures repair or hard-stop with explicit error objects; no silent corruption.'
};

const omniBoundary = {
  id:'GOALOS-V32-OMNI-SEARCH-CONTROL-BOUNDARY',
  generatedAt,
  allowed:'OMNI may influence targeting, allocation, interestingness, and probe prioritization.',
  disallowed:'OMNI may not bypass risk gates, evidence gates, baseline comparisons, persistence tests, council stop authority, or dossier packaging.',
  slogan:'Search control is not outcome authority.',
  checks:gates.map(g => ({ gate:g.name, protectedBy:g.rule }))
};

const move37Dossier = {
  id:'GOALOS-V32-MOVE37-BREAKTHROUGH-DOSSIER',
  generatedAt,
  definition:'A breakthrough candidate becomes an audited state transition, not a narrative claim.',
  trigger:{ noveltyDistance:'>= 0.80 synthetic threshold', advantageDelta:'positive vs selected baselines', risk:'within allowed public-safe boundary', confidence:'bounded by ECI semantics' },
  mandatorySteps:['Recognize','Reproduce with fixed seeds','Stress-test policy shocks','Persistence gate','Dossier package','Architect/Validator Council review'],
  decision:'PROBE_FIRST_UNTIL_PERSISTENCE_CONFIRMED'
};

const councilCharter = {
  id:'GOALOS-V32-ARCHITECT-VALIDATOR-COUNCIL-CHARTER',
  generatedAt,
  purpose:'Independent design authority and verification council for governed invention loops.',
  authorities:['stop authority','dossier requirement','risk boundary escalation','baseline policy approval','release/rollback decision','public claim boundary review'],
  operatingRule:'No promotion, release, settlement signal, or memory propagation for high-novelty results without proof, replay, stress, persistence, and council-bounded decision state.'
};

const dashboardSchema = {
  id:'GOALOS-V32-RSI-OPERATIONAL-DASHBOARD-SCHEMA',
  generatedAt,
  metrics:dashboard,
  leadershipQuestion:'Can this invention loop be trusted to keep exploring without becoming ungoverned?',
  minimumDecisionAsks:['Authorize bounded pilot','Set replayability KPI','Define security boundary','Constitute council','Adopt dossier standard']
};

const transitionMap = {
  id:'GOALOS-V32-FROM-LOOP-TO-RSI-TRANSITION-MAP',
  generatedAt,
  fromLoop:['Mission','Evidence Docket','Replay Log','Validator Report','Human Signoff','Mission Receipt','Settlement readiness'],
  toRSI:['Target','Emit','Filter','Atlas','Test-plan','Eval','Insert','Promote','Council','Dossier','Chronicle'],
  translation:[
    ['Mission Contract','Target allocation and exploration brief'],
    ['Evidence Docket','Evidence objects + ECI ledger'],
    ['Replay Log','Deterministic manifests and stage logs'],
    ['Validator Report','Council review + baseline-comparative eval'],
    ['Mission Receipt','Dossier index + promotion decision state'],
    ['Chronicle','Append-only RSI archive and stepping-stone memory']
  ]
};

const demoBundle = {
  id:'GOALOS-V32-FROM-LOOP-TO-RSI-DEMO-BUNDLE',
  generatedAt,
  publicSafe:true,
  zeroValueMoved:true,
  artifactHashes:{
    manifest: hash(JSON.stringify(manifest)),
    pipeline: hash(JSON.stringify(pipelineArtifact)),
    omniBoundary: hash(JSON.stringify(omniBoundary)),
    move37Dossier: hash(JSON.stringify(move37Dossier)),
    councilCharter: hash(JSON.stringify(councilCharter)),
    dashboardSchema: hash(JSON.stringify(dashboardSchema)),
    transitionMap: hash(JSON.stringify(transitionMap))
  },
  scenarios: scenarios.map(s => ({ id:s.id, decision:s.decision, syntheticReadinessScore:s.score, dossier:s.dossier, receiptPointer:`GOALOS-V32-${s.id.toUpperCase()}-${hash(s.id).slice(0,10)}` }))
};

const css = String.raw`
:root{--bg:#05030b;--bg2:#100019;--ink:#fffaf3;--muted:#cfc2df;--line:rgba(255,255,255,.14);--violet:#a855ff;--magenta:#ff4fa3;--cyan:#3ff6df;--gold:#ffe18a;--orange:#ffb25f;--panel:rgba(255,255,255,.065);--panel2:rgba(255,255,255,.095);--shadow:0 36px 110px rgba(0,0,0,.48)}*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;color:var(--ink);background:radial-gradient(circle at 18% 0,rgba(168,85,255,.24),transparent 32%),radial-gradient(circle at 86% 5%,rgba(255,79,163,.22),transparent 32%),radial-gradient(circle at 50% 56%,rgba(63,246,223,.10),transparent 40%),linear-gradient(180deg,#05030b,#0b0614 48%,#040207);font-family:Inter,ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;min-height:100vh}.noise:before{content:"";position:fixed;inset:0;pointer-events:none;opacity:.17;background-image:linear-gradient(120deg,rgba(255,255,255,.045) 1px,transparent 1px);background-size:12px 12px;mask-image:linear-gradient(to bottom,#000,transparent 85%)}a{color:inherit}.wrap{width:min(1180px,92vw);margin:auto}.nav{position:sticky;top:0;z-index:30;backdrop-filter:blur(20px);background:rgba(5,3,11,.72);border-bottom:1px solid var(--line)}.nav-inner{display:flex;align-items:center;justify-content:space-between;gap:18px;padding:15px 0}.brand{display:flex;gap:10px;align-items:center;font-weight:950;letter-spacing:-.03em}.mark{width:36px;height:36px;border-radius:12px;background:linear-gradient(135deg,var(--gold),var(--violet),var(--cyan));box-shadow:0 0 50px rgba(168,85,255,.45)}.nav-links{display:flex;gap:10px;flex-wrap:wrap}.nav-links a,.pill{padding:9px 12px;border:1px solid var(--line);border-radius:999px;text-decoration:none;color:var(--muted);font-weight:800;font-size:13px;background:rgba(255,255,255,.035)}.hero{position:relative;padding:74px 0 44px}.eyebrow{display:inline-flex;gap:10px;align-items:center;color:var(--gold);text-transform:uppercase;letter-spacing:.24em;font-size:12px;font-weight:950}.hero-grid{display:grid;grid-template-columns:1.05fr .95fr;gap:24px;align-items:stretch;margin-top:24px}.hero-card,.panel{position:relative;border:1px solid var(--line);background:linear-gradient(145deg,rgba(255,255,255,.085),rgba(255,255,255,.035));border-radius:34px;box-shadow:var(--shadow);overflow:hidden}.hero-card{padding:clamp(28px,5vw,56px)}.hero-card:before{content:"";position:absolute;inset:-35%;background:radial-gradient(circle,rgba(168,85,255,.22),transparent 42%);transform:rotate(13deg);pointer-events:none}.hero h1{position:relative;margin:0;font-size:clamp(48px,8vw,116px);line-height:.82;letter-spacing:-.085em}.grad{background:linear-gradient(90deg,var(--gold),var(--magenta),var(--violet),var(--cyan));-webkit-background-clip:text;background-clip:text;color:transparent}.lead{position:relative;max-width:940px;color:#f2e9ff;font-size:clamp(18px,2.3vw,25px);line-height:1.5;margin:22px 0 0}.cta{display:flex;gap:12px;flex-wrap:wrap;margin-top:28px;position:relative}.btn{display:inline-flex;align-items:center;gap:10px;padding:14px 18px;border-radius:999px;text-decoration:none;font-weight:950;border:1px solid var(--line);background:rgba(255,255,255,.06);color:var(--ink);cursor:pointer}.btn.primary{background:linear-gradient(135deg,var(--gold),var(--magenta),var(--violet));color:#16071e;border:0}.btn.cyan{background:linear-gradient(135deg,var(--cyan),#9bfff0);color:#031513;border:0}.brief{padding:28px;display:grid;gap:16px}.metric{border:1px solid var(--line);border-radius:24px;padding:18px;background:rgba(0,0,0,.19)}.metric b{display:block;font-size:32px;letter-spacing:-.05em}.metric span{display:block;color:var(--muted);margin-top:4px}.section{padding:36px 0}.section h2{font-size:clamp(34px,5vw,68px);letter-spacing:-.06em;line-height:.92;margin:0 0 16px}.section p{color:var(--muted);font-size:17px;line-height:1.6}.console{display:grid;grid-template-columns:320px 1fr;gap:18px}.tabs{display:grid;gap:10px}.tab{width:100%;text-align:left;border:1px solid var(--line);border-radius:22px;background:rgba(255,255,255,.055);color:var(--ink);padding:16px;cursor:pointer;font-weight:900}.tab.active{background:linear-gradient(135deg,rgba(255,225,138,.22),rgba(168,85,255,.28));border-color:rgba(255,225,138,.44)}.stage-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-top:18px}.stage{border:1px solid var(--line);border-radius:18px;padding:13px;background:rgba(255,255,255,.045);min-height:120px}.stage.hot{border-color:rgba(63,246,223,.6);box-shadow:0 0 0 1px rgba(63,246,223,.12),0 18px 60px rgba(63,246,223,.08)}.stage small{display:block;color:var(--gold);font-weight:950;letter-spacing:.13em;text-transform:uppercase}.stage b{display:block;margin-top:8px}.stage p{font-size:13px;line-height:1.45;margin:8px 0 0}.panel.pad{padding:26px}.decision{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:18px}.decision-card{border:1px solid var(--line);background:rgba(0,0,0,.2);border-radius:20px;padding:16px}.decision-card b{font-size:13px;text-transform:uppercase;letter-spacing:.14em;color:var(--gold)}.decision-card div{margin-top:8px;font-size:20px;font-weight:950}.gates{display:grid;grid-template-columns:repeat(5,1fr);gap:12px}.gate{border:1px solid var(--line);border-radius:22px;padding:18px;background:rgba(255,255,255,.045)}.gate:before{content:"";display:block;width:32px;height:32px;border-radius:11px;background:linear-gradient(135deg,var(--magenta),var(--violet),var(--cyan));margin-bottom:12px}.gate b{display:block}.gate p{font-size:14px}.pipeline{display:flex;gap:10px;flex-wrap:wrap;margin-top:18px}.node{position:relative;flex:1 1 118px;min-height:92px;border:1px solid rgba(168,85,255,.42);background:rgba(0,0,0,.24);border-radius:20px;padding:14px}.node:after{content:"→";position:absolute;right:-14px;top:34px;color:var(--violet);font-weight:950}.node:last-child:after{content:""}.node b{display:block}.node small{display:block;color:var(--muted);margin-top:6px}.dash{display:grid;grid-template-columns:repeat(5,1fr);gap:12px}.bar{height:10px;border-radius:999px;background:rgba(255,255,255,.08);overflow:hidden;margin-top:12px}.bar i{display:block;height:100%;background:linear-gradient(90deg,var(--gold),var(--magenta),var(--cyan));border-radius:inherit}.sources{display:grid;grid-template-columns:repeat(2,1fr);gap:14px}.source{border:1px solid var(--line);border-radius:24px;padding:18px;background:rgba(255,255,255,.045)}.source a{display:inline-block;margin-top:10px;color:var(--cyan);font-weight:950;text-decoration:none}.rail{display:flex;gap:8px;flex-wrap:wrap}.rail span{border:1px solid var(--line);background:rgba(0,0,0,.22);padding:8px 10px;border-radius:999px;color:var(--muted);font-weight:800;font-size:13px}.floating{position:fixed;right:18px;bottom:18px;z-index:40;background:linear-gradient(135deg,var(--gold),var(--magenta),var(--violet));color:#16071e;border:0;border-radius:999px;padding:13px 15px;font-weight:950;text-decoration:none;box-shadow:0 18px 50px rgba(0,0,0,.38)}footer{border-top:1px solid var(--line);padding:34px 0;color:var(--muted);margin-top:50px}@media(max-width:920px){.hero-grid,.console,.sources{grid-template-columns:1fr}.gates,.dash{grid-template-columns:1fr 1fr}.stage-grid{grid-template-columns:1fr 1fr}.decision{grid-template-columns:1fr}}@media(max-width:560px){.stage-grid,.gates,.dash{grid-template-columns:1fr}.nav-links{display:none}.hero h1{font-size:52px}}`;

const js = String.raw`
(function(){
  const scenarios = ${JSON.stringify(scenarios)};
  const stages = ${JSON.stringify(stages)};
  const gates = ${JSON.stringify(gates)};
  const dashboard = ${JSON.stringify(dashboard)};
  const $ = sel => document.querySelector(sel);
  const $$ = sel => Array.from(document.querySelectorAll(sel));
  function render(id){
    const s = scenarios.find(x => x.id === id) || scenarios[0];
    $$('.tab').forEach(btn => btn.classList.toggle('active', btn.dataset.scenario === s.id));
    const title = $('#scenario-title'); if(title) title.textContent = s.title;
    const claim = $('#scenario-claim'); if(claim) claim.textContent = s.claim;
    const msg = $('#scenario-message'); if(msg) msg.textContent = s.message;
    const decision = $('#scenario-decision'); if(decision) decision.textContent = s.decision;
    const dossier = $('#scenario-dossier'); if(dossier) dossier.textContent = s.dossier;
    const score = $('#scenario-score'); if(score) score.textContent = String(s.score) + '/100';
    const seq = $('#scenario-sequence');
    if(seq) seq.innerHTML = s.sequence.map((item, i) => '<div class="node"><b>' + item + '</b><small>Step ' + (i+1) + '</small></div>').join('');
    const sg = $('#stage-grid');
    if(sg){
      sg.innerHTML = stages.map(st => '<article class="stage ' + (s.sequence.map(x=>x.toLowerCase()).includes(st.label.toLowerCase()) || s.id==='rsi' ? 'hot' : '') + '"><small>' + st.id + '</small><b>' + st.label + '</b><p>' + st.purpose + '</p></article>').join('');
    }
  }
  document.addEventListener('click', e => {
    const tab = e.target.closest('.tab');
    if(tab) render(tab.dataset.scenario);
    const copy = e.target.closest('[data-copy]');
    if(copy && navigator.clipboard){ navigator.clipboard.writeText(copy.dataset.copy).catch(()=>{}); copy.textContent = 'Copied'; setTimeout(()=>copy.textContent='Copy tagline', 1100); }
  });
  const gatesEl = $('#gates');
  if(gatesEl) gatesEl.innerHTML = gates.map(g => '<article class="gate"><b>' + g.name + '</b><p>' + g.rule + '</p><span class="pill">' + g.signal + '</span></article>').join('');
  const dash = $('#dashboard');
  if(dash) dash.innerHTML = dashboard.map(m => '<article class="metric"><b>' + m.value + '%</b><span>' + m.metric + ' · ' + m.target + '</span><div class="bar"><i style="width:' + m.value + '%"></i></div><p>' + m.note + '</p></article>').join('');
  render('rsi');
})();`;

write('assets/goalos-v32-rsi.css', css);
write('assets/goalos-v32-rsi.js', js);

function page(route){
  const sourceLinks = sourceDocuments.map(d => `<article class="source"><h3>${esc(d.title)}</h3><p>Source document for the v32 lab. Use the local file only if it is approved for public release; the public GitHub URL was provided as context for this package.</p><a href="${esc(d.publicUrl)}">Open public GitHub source →</a><br><a href="${esc(d.localPath)}">Open local copy →</a></article>`).join('');
  const stageNodes = stages.map(s => `<div class="node"><b>${esc(s.label)}</b><small>${esc(s.id)}</small></div>`).join('');
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>GoalOS Signoff Pro — From Loop to RSI Lab v32</title><meta name="description" content="A public-safe GoalOS Signoff Pro demonstration showing how the proof loop becomes sovereign invention governance for RSI-scale systems."><link rel="stylesheet" href="assets/goalos-v32-rsi.css"></head><body class="noise" data-goalos-v32-route="${esc(route)}"><nav class="nav"><div class="wrap nav-inner"><a class="brand" href="index.html" style="text-decoration:none"><span class="mark"></span><span>GoalOS Signoff Pro</span></a><div class="nav-links"><a href="executive-ai-proof-console.html">Guided console</a><a href="proof-before-settlement-research-lab.html">v30 paper</a><a href="from-loop-to-rsi-lab.html">v32 RSI</a><a href="goalos-public-demo-labs-v22-v32.json">Manifest</a></div></div></nav><main><section class="hero"><div class="wrap"><div class="eyebrow">🔱 AGI Alpha RSI v0 · public-safe demonstration</div><div class="hero-grid"><div class="hero-card"><h1>From Loop<br><span class="grad">to RSI.</span></h1><p class="lead">The GoalOS proof loop becomes a governance institution for open-ended invention: deterministic stages, schema-bound artifacts, mechanical gates, council authority, and auditable dossiers before AGI-scale systems mature.</p><div class="cta"><a class="btn primary" href="#console">Open RSI console</a><a class="btn" href="research/rsi/AGI_Alpha_RSI_Sovereign_v0.pdf">View presentation</a><a class="btn" href="research/rsi/AGI_Alpha_RSI_Sovereign_Strategy_Brief_v0.pdf">View strategy brief</a></div></div><aside class="brief panel"><div class="metric"><b>No ungoverned RSI</b><span>Search control never becomes outcome authority.</span></div><div class="metric"><b>8 stages</b><span>Target → Emit → Filter → Atlas → Test-plan → Eval → Insert → Promote.</span></div><div class="metric"><b>5 hard gates</b><span>Risk, evidence, baseline, persistence, human authority.</span></div><div class="rail"><span>No forms</span><span>No uploads</span><span>No user data</span><span>No wallet actions</span><span>Zero value moved</span><span>No external AI call</span></div></aside></div></div></section><section class="section" id="console"><div class="wrap"><h2>Sovereign invention governance console</h2><p>Choose a scenario. The console shows how GoalOS evolves from proof-gated settlement into RSI-grade invention governance. It is dynamic and useful, but it uses only predefined public-safe scenarios.</p><div class="console"><div class="tabs"><button class="tab active" data-scenario="rsi">🔱 RSI kernel</button><button class="tab" data-scenario="loop">⛓ Proof loop</button><button class="tab" data-scenario="move37">⚡ Move-37 breakthrough</button><button class="tab" data-scenario="omni">◈ OMNI boundary</button><button class="btn cyan" data-copy="Blockchain proves the transaction. GoalOS proves the work. RSI governs the invention loop.">Copy tagline</button></div><article class="panel pad"><div class="eyebrow">Interactive decision state</div><h2 id="scenario-title" style="margin-top:10px"></h2><p id="scenario-claim"></p><p id="scenario-message"></p><div id="scenario-sequence" class="pipeline"></div><div class="decision"><div class="decision-card"><b>Decision</b><div id="scenario-decision"></div></div><div class="decision-card"><b>Dossier</b><div id="scenario-dossier"></div></div><div class="decision-card"><b>Readiness</b><div id="scenario-score"></div></div></div></article></div></div></section><section class="section"><div class="wrap"><h2>The deterministic invention OS</h2><p>RSI v32 turns a single acceptance loop into a repeatable invention operating model. Every stage emits artifacts that can be validated, replayed, bounded, and reviewed.</p><div class="pipeline">${stageNodes}</div><div id="stage-grid" class="stage-grid"></div></div></section><section class="section"><div class="wrap"><h2>Search control ≠ outcome authority</h2><p>OMNI can guide exploration allocation, but cannot admit outcomes. Results still pass through mechanical gates before promotion, release, memory propagation, settlement signal, or public claim escalation.</p><div id="gates" class="gates"></div></div></section><section class="section"><div class="wrap"><h2>Move-37 handling: surprise is not authority</h2><div class="panel pad"><p>A breakthrough is not accepted because it is exciting. High novelty increases skepticism. The result must reproduce, survive stress tests, persist against baselines, and be packaged as a dossier for council review.</p><div class="pipeline"><div class="node"><b>Recognize</b><small>novelty + Δ thresholds</small></div><div class="node"><b>Reproduce</b><small>fixed seeds + hashes</small></div><div class="node"><b>Stress-test</b><small>policy shocks</small></div><div class="node"><b>Persist</b><small>positive under shocks</small></div><div class="node"><b>Dossier</b><small>review package</small></div><div class="node"><b>Council</b><small>bounded authority</small></div></div></div></div></section><section class="section"><div class="wrap"><h2>Minimum leadership dashboard</h2><p>The institution should not ask leaders to trust stories. It should show replayability, evidence quality, exploration quality, advantage confirmation, and safety posture.</p><div id="dashboard" class="dash"></div></div></section><section class="section"><div class="wrap"><h2>Source materials and public boundary</h2><p>The v32 lab is built from the AGI Alpha RSI thesis: build the governance institution first; preserve deterministic replay, schema-bound artifacts, baseline discipline, and breakthrough dossiers; keep search control separate from outcome authority.</p><div class="sources">${sourceLinks}</div><div class="panel pad" style="margin-top:16px"><div class="eyebrow">Claim boundary</div><p>This public lab does not claim achieved AGI, achieved ASI, achieved recursive self-improvement, production deployment authority, financial return, security certification, or external factual certification. It is an additive public demonstration of the governance architecture.</p></div></div></section></main><a class="floating" href="from-loop-to-rsi-lab.html">🔱 From Loop to RSI</a><footer><div class="wrap" data-goalos-legal-rail="v12"><b>GoalOS Signoff Pro v32.</b> Public-safe demonstration only: no forms, no uploads, no user accounts, no analytics, no payments, no personal data, no external AI call, and zero value moved.</div></footer><script src="assets/goalos-v32-rsi.js"></script></body></html>`;
}

const html = page(routes[0]);
for (const route of routes) write(route, html.replace(`data-goalos-v32-route="${routes[0]}"`, `data-goalos-v32-route="${route}"`));

writeJson('from-loop-to-rsi-v32-manifest.json', manifest);
writeJson('deterministic-invention-pipeline-v32.json', pipelineArtifact);
writeJson('omni-search-control-boundary-v32.json', omniBoundary);
writeJson('move37-breakthrough-dossier-v32.json', move37Dossier);
writeJson('rsi-operational-dashboard-schema-v32.json', dashboardSchema);
writeJson('architect-validator-council-charter-v32.json', councilCharter);
writeJson('from-loop-to-rsi-transition-map-v32.json', transitionMap);
writeJson('from-loop-to-rsi-demo-bundle.json', demoBundle);
writeJson('rsi-source-document-index-v32.json', { id:'GOALOS-V32-RSI-SOURCE-DOCUMENT-INDEX', generatedAt, sourceDocuments, publicReleaseReviewRecommended:true });
write('research/rsi/executive-brief.txt', `GoalOS Signoff Pro v32 — From Loop to RSI\n\nCore message: Blockchain proves the transaction. GoalOS proves the work. RSI governs the invention loop.\n\nThesis: the proof loop should become an invention-governance institution before AGI-scale systems mature. Public-safe demonstration only.\n`);

function loadLabsManifest() {
  const candidates = ['goalos-public-demo-labs-v22-v31.json','goalos-public-demo-labs-v22-v30.json','goalos-public-demo-labs-v22-v29.json','goalos-public-demo-labs-v22-v27.json'];
  for (const file of candidates) {
    const p = path.join(site, file);
    if (fs.existsSync(p)) {
      try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch {}
    }
  }
  return { generatedAt, labs: [] };
}
const labsManifest = loadLabsManifest();
const labs = Array.isArray(labsManifest.labs) ? labsManifest.labs.filter(l => !['v32','32'].includes(String(l.version))) : [];
labs.push({
  version:'v32',
  title:'From Loop to RSI: Sovereign Invention Governance Lab',
  route:'from-loop-to-rsi-lab.html',
  purpose:'Shows how the GoalOS proof loop expands into deterministic invention governance for RSI-scale systems.',
  proofLoop:'Proof loop → deterministic invention OS → mechanical gates → Move-37 dossier → council-bounded promotion.',
  bestFor:'Executives, AI governance leaders, blockchain founders, DAO councils, auditors, national-scale strategy teams, and frontier AI governance programs.',
  valueMoved:0
});
writeJson('goalos-public-demo-labs-v22-v32.json', { ...labsManifest, generatedAt, version:'v22-v32', labCount:labs.length, labs });

const sitemapPath = path.join(site, 'goalos-signoff-pro-site-map-v22-v32.json');
writeJson('goalos-signoff-pro-site-map-v22-v32.json', { generatedAt, version:'v22-v32', featuredRoutes:routes, sourceDocuments, manifests:['from-loop-to-rsi-v32-manifest.json','goalos-public-demo-labs-v22-v32.json'] });

const spotlight = `<!-- GOALOS_V32_FROM_LOOP_TO_RSI_START --><section class="goalos-v32-from-loop-to-rsi" style="width:min(1180px,92vw);margin:88px auto;padding:clamp(26px,4vw,50px);border:1px solid rgba(168,85,255,.44);border-radius:42px;background:radial-gradient(circle at 18% 0,rgba(168,85,255,.22),transparent 34%),radial-gradient(circle at 90% 8%,rgba(255,79,163,.18),transparent 36%),linear-gradient(145deg,rgba(16,0,25,.96),rgba(5,3,11,.98));box-shadow:0 36px 120px rgba(0,0,0,.48)"><div style="color:#ffe18a;font-weight:950;letter-spacing:.24em;text-transform:uppercase;font-size:12px">GoalOS Signoff Pro · v32 · From Loop to RSI</div><h2 style="font-size:clamp(42px,7vw,96px);line-height:.84;letter-spacing:-.08em;margin:16px 0 18px;color:#fffaf3">The proof loop becomes<br><span style="background:linear-gradient(90deg,#ffe18a,#ff4fa3,#a855ff,#3ff6df);-webkit-background-clip:text;background-clip:text;color:transparent">sovereign invention governance.</span></h2><p style="max-width:980px;color:#f2e9ff;font-size:19px;line-height:1.58">v32 connects GoalOS Signoff Pro to AGI Alpha RSI: deterministic invention stages, schema-bound artifacts, mechanical risk/evidence/baseline/persistence gates, Move-37 dossiers, and council-bounded authority before recursive self-improvement becomes ungoverned.</p><p><a href="from-loop-to-rsi-lab.html" style="display:inline-block;margin:12px 10px 0 0;padding:15px 19px;border-radius:999px;background:linear-gradient(135deg,#ffe18a,#ff4fa3,#a855ff);color:#16071e;font-weight:950;text-decoration:none">Open v32 RSI lab</a><a href="goalos-public-demo-labs-v22-v32.json" style="display:inline-block;margin:12px 10px 0 0;padding:15px 19px;border-radius:999px;border:1px solid rgba(255,255,255,.18);color:#f2e9ff;text-decoration:none;font-weight:850">Inspect v32 manifest</a></p></section><!-- GOALOS_V32_FROM_LOOP_TO_RSI_END -->`;
function addFloating(html){
  if(html.includes('GOALOS_V32_GLOBAL_RSI_GUIDE')) return html;
  const snippet = `<!-- GOALOS_V32_GLOBAL_RSI_GUIDE --><a href="from-loop-to-rsi-lab.html" style="position:fixed;right:18px;bottom:72px;z-index:9998;display:inline-flex;align-items:center;gap:8px;padding:13px 15px;border-radius:999px;background:linear-gradient(135deg,#ffe18a,#ff4fa3,#a855ff);color:#16071e;font-family:Inter,ui-sans-serif,system-ui,-apple-system,Segoe UI,sans-serif;font-weight:950;text-decoration:none;box-shadow:0 18px 50px rgba(0,0,0,.35)">🔱 From Loop to RSI</a>`;
  return html.replace(/<\/body>/i, snippet + '</body>');
}
const indexPath = path.join(site, 'index.html');
if(fs.existsSync(indexPath)){
  let index = fs.readFileSync(indexPath, 'utf8');
  index = index.replace(/<!-- GOALOS_V32_FROM_LOOP_TO_RSI_START -->[\s\S]*?<!-- GOALOS_V32_FROM_LOOP_TO_RSI_END -->/g, '');
  const marker = '<!-- GOALOS_V31_EXECUTIVE_PROOF_CONSOLE_END -->';
  const m = index.indexOf(marker);
  if(m >= 0) index = index.slice(0, m + marker.length) + spotlight + index.slice(m + marker.length);
  else {
    const heroClose = index.indexOf('</section><section');
    if(heroClose >= 0) index = index.slice(0, heroClose + '</section>'.length) + spotlight + index.slice(heroClose + '</section>'.length);
    else index = index.replace(/<\/body>/i, spotlight + '</body>');
  }
  index = addFloating(index);
  fs.writeFileSync(indexPath, index);
}

for (const file of fs.readdirSync(site).filter(f => f.endsWith('.html'))) {
  const p = path.join(site, file);
  if (file === 'index.html') continue;
  let htmlFile = fs.readFileSync(p, 'utf8');
  if (htmlFile.includes('data-goalos-legal-rail="v12"') && !htmlFile.includes('GOALOS_V32_GLOBAL_RSI_GUIDE')) {
    htmlFile = addFloating(htmlFile);
    fs.writeFileSync(p, htmlFile);
  }
}

console.log(`GoalOS Signoff Pro v32 From Loop to RSI generated ${routes.length} routes and 9 JSON artifacts.`);
