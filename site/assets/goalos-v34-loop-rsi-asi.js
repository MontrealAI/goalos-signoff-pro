
const DATA = {
  "version": "v34",
  "lab": "GoalOS Signoff Pro \u2014 Loop \u2192 RSI \u2192 ASI Superintelligence Control Tower Lab v34",
  "publicSafety": {
    "forms": false,
    "textInputs": false,
    "uploads": false,
    "cookies": false,
    "analytics": false,
    "wallets": false,
    "payments": false,
    "externalAiCalls": false,
    "personalData": false,
    "valueMoved": 0,
    "liveRsi": false,
    "claimedAgi": false,
    "claimedAsi": false,
    "productionAuthority": false
  },
  "personas": {
    "firstTimer": {
      "label": "First-time visitor",
      "summary": "You want the one-minute explanation.",
      "lens": "Show the proof loop in plain language and avoid jargon."
    },
    "executive": {
      "label": "Sovereign / enterprise executive",
      "summary": "You decide whether to authorize a pilot.",
      "lens": "Show decision state, budget posture, risk, rollback, and council requirements."
    },
    "validator": {
      "label": "Architect / Validator Council",
      "summary": "You decide whether a candidate can advance.",
      "lens": "Inspect deterministic artifacts, stress tests, baseline deltas, and stop authority."
    },
    "frontier": {
      "label": "Frontier lab director",
      "summary": "You care about fast discovery without unsafe promotion.",
      "lens": "Balance exploration speed with reproducibility and persistence gates."
    },
    "safety": {
      "label": "Safety & assurance lead",
      "summary": "You hunt failure modes before scale.",
      "lens": "Focus on prohibited domains, model risk, red-team shocks, and rollback."
    },
    "capital": {
      "label": "Invention capital operator",
      "summary": "You allocate resources to verified compounding advantage.",
      "lens": "Look for evidence quality, probe ROI, stepping-stone reuse, and claim maturity."
    },
    "public": {
      "label": "Public reviewer",
      "summary": "You ask what can be trusted.",
      "lens": "Demand proof packages before accepting grand claims."
    }
  },
  "explainModes": {
    "simple": "Explain it like a public product demo: no proof package means no credible promotion.",
    "executive": "Explain it like a board memo: the pilot is only acceptable with hard gates, council oversight, and rollback.",
    "technical": "Explain it like an engineering review: every cycle emits schema-bound artifacts, hashes, ledgers, and replay paths.",
    "governance": "Explain it like an institutional control system: search is allocation, not authority; human council owns escalation.",
    "redteam": "Explain it like a red-team brief: assume false positives, metric capture, political pressure, and novelty traps."
  },
  "scenarios": {
    "proofLoop": {
      "label": "GoalOS proof loop",
      "plain": "A normal AI-work claim is converted into a proof package before acceptance.",
      "state": "REVIEW_READY",
      "score": 82,
      "novelty": 0.34,
      "advantage": 12.5,
      "decision": "Proceed to review. Work is not trusted until the evidence docket, replay path, and receipt are complete.",
      "metrics": {
        "Replayability": 86,
        "Evidence quality": 78,
        "Baseline discipline": 74,
        "Risk control": 88,
        "Human authority": 92,
        "Rollback readiness": 70
      },
      "gates": {
        "risk": "pass",
        "evidence": "pass",
        "baseline": "warn",
        "persistence": "warn",
        "council": "pass",
        "rollback": "warn",
        "asi": "locked"
      },
      "receiptClass": "Proof work receipt"
    },
    "rsiPilot": {
      "label": "Governed RSI pilot",
      "plain": "A deterministic invention cycle is authorized only as a bounded pilot with replayability KPI.",
      "state": "PILOT_AUTHORIZABLE",
      "score": 76,
      "novelty": 0.58,
      "advantage": 18.9,
      "decision": "Authorize a bounded pilot if replayability, baseline, evidence, and stop-authority conditions are written into the mission.",
      "metrics": {
        "Replayability": 79,
        "Evidence quality": 72,
        "Baseline discipline": 81,
        "Risk control": 75,
        "Human authority": 88,
        "Rollback readiness": 77
      },
      "gates": {
        "risk": "pass",
        "evidence": "pass",
        "baseline": "pass",
        "persistence": "warn",
        "council": "pass",
        "rollback": "pass",
        "asi": "locked"
      },
      "receiptClass": "RSI pilot authorization receipt"
    },
    "move37": {
      "label": "Move\u201137 candidate",
      "plain": "High novelty and baseline advantage appear promising, so the system must become more skeptical, not less.",
      "state": "DOSSIER_REQUIRED",
      "score": 68,
      "novelty": 0.84,
      "advantage": 31.2,
      "decision": "Package a Move\u201137 dossier. Do not promote until reproduction, shock persistence, and independent review pass.",
      "metrics": {
        "Replayability": 73,
        "Evidence quality": 69,
        "Baseline discipline": 86,
        "Risk control": 71,
        "Human authority": 90,
        "Rollback readiness": 66
      },
      "gates": {
        "risk": "warn",
        "evidence": "pass",
        "baseline": "pass",
        "persistence": "warn",
        "council": "pass",
        "rollback": "warn",
        "asi": "locked"
      },
      "receiptClass": "Move\u201137 dossier receipt"
    },
    "asiThreshold": {
      "label": "ASI-scale escalation review",
      "plain": "A claim approaches superintelligence-scale impact; the system must not be allowed to self-promote.",
      "state": "ASI_CLAIM_LOCKED",
      "score": 41,
      "novelty": 0.93,
      "advantage": 45.0,
      "decision": "Lock the ASI claim. Require extraordinary independent replay, containment, rollback, red-team review, and council authorization.",
      "metrics": {
        "Replayability": 62,
        "Evidence quality": 58,
        "Baseline discipline": 80,
        "Risk control": 46,
        "Human authority": 96,
        "Rollback readiness": 44
      },
      "gates": {
        "risk": "block",
        "evidence": "warn",
        "baseline": "pass",
        "persistence": "block",
        "council": "pass",
        "rollback": "block",
        "asi": "locked"
      },
      "receiptClass": "ASI boundary lock receipt"
    },
    "noveltyTrap": {
      "label": "Novelty trap / false breakthrough",
      "plain": "The candidate looks exciting but fails baseline persistence and therefore cannot be promoted.",
      "state": "BLOCKED_PROBE_ONLY",
      "score": 24,
      "novelty": 0.91,
      "advantage": 4.2,
      "decision": "Reject promotion. Keep only a probe record and anti-pattern note in the Chronicle.",
      "metrics": {
        "Replayability": 66,
        "Evidence quality": 43,
        "Baseline discipline": 38,
        "Risk control": 61,
        "Human authority": 89,
        "Rollback readiness": 72
      },
      "gates": {
        "risk": "warn",
        "evidence": "warn",
        "baseline": "block",
        "persistence": "block",
        "council": "pass",
        "rollback": "pass",
        "asi": "locked"
      },
      "receiptClass": "Rejected novelty-trap receipt"
    },
    "redTeam": {
      "label": "Red-team policy shock",
      "plain": "Policy, metric, and operator-capture shocks are applied before any promotion can happen.",
      "state": "RED_TEAM_ACTIVE",
      "score": 53,
      "novelty": 0.72,
      "advantage": 20.4,
      "decision": "Hold escalation until shock deltas, adverse side effects, and council dissent are resolved.",
      "metrics": {
        "Replayability": 71,
        "Evidence quality": 66,
        "Baseline discipline": 69,
        "Risk control": 52,
        "Human authority": 94,
        "Rollback readiness": 59
      },
      "gates": {
        "risk": "block",
        "evidence": "pass",
        "baseline": "warn",
        "persistence": "warn",
        "council": "pass",
        "rollback": "warn",
        "asi": "locked"
      },
      "receiptClass": "Red-team hold receipt"
    },
    "capital": {
      "label": "Invention capital allocation",
      "plain": "Funding increases only when proof quality, replayability, and advantage persistence improve.",
      "state": "ALLOCATE_TO_PROBES",
      "score": 74,
      "novelty": 0.63,
      "advantage": 22.1,
      "decision": "Allocate budget to probes and dossier preparation, not unreviewed deployment.",
      "metrics": {
        "Replayability": 80,
        "Evidence quality": 76,
        "Baseline discipline": 79,
        "Risk control": 74,
        "Human authority": 82,
        "Rollback readiness": 71
      },
      "gates": {
        "risk": "pass",
        "evidence": "pass",
        "baseline": "pass",
        "persistence": "warn",
        "council": "warn",
        "rollback": "pass",
        "asi": "locked"
      },
      "receiptClass": "Capital allocation receipt"
    }
  },
  "stages": [
    {
      "id": "objective",
      "zone": "LOOP",
      "name": "Objective",
      "plain": "State the work claim and success criteria.",
      "artifact": "mission_contract.json",
      "why": "No mission, no proof target."
    },
    {
      "id": "evidence",
      "zone": "LOOP",
      "name": "Evidence Docket",
      "plain": "Map deliverables to criteria and risks.",
      "artifact": "evidence_docket.json",
      "why": "Output becomes reviewable evidence."
    },
    {
      "id": "signoff",
      "zone": "LOOP",
      "name": "Human Signoff",
      "plain": "Human authority accepts, rejects, or blocks.",
      "artifact": "mission_receipt.json",
      "why": "Acceptance is a governed decision."
    },
    {
      "id": "target",
      "zone": "RSI",
      "name": "Target",
      "plain": "Allocate exploration pressure through bounded search control.",
      "artifact": "targets/coverage_targets.json",
      "why": "Search control is allocation only."
    },
    {
      "id": "emit",
      "zone": "RSI",
      "name": "Emit",
      "plain": "Generate candidates under schema constraints.",
      "artifact": "candidates.raw.jsonl",
      "why": "Candidates are not outcomes."
    },
    {
      "id": "filter",
      "zone": "RSI",
      "name": "Filter",
      "plain": "Risk and interestingness gates route candidates.",
      "artifact": "risk_reports.jsonl",
      "why": "OMNI cannot insert or promote."
    },
    {
      "id": "atlas",
      "zone": "RSI",
      "name": "Atlas",
      "plain": "Extract mechanism context and comparatives.",
      "artifact": "causal_atlas_triples.jsonl",
      "why": "Context prevents one-off hype."
    },
    {
      "id": "testplan",
      "zone": "RSI",
      "name": "Test-plan",
      "plain": "Build falsification ladders and cheap probes.",
      "artifact": "falsification_ladders.jsonl",
      "why": "Skepticism is designed in."
    },
    {
      "id": "eval",
      "zone": "RSI",
      "name": "Eval",
      "plain": "Compare against incumbent, neighbor, and null baselines.",
      "artifact": "baseline_comparison.jsonl",
      "why": "Advantage must be measured."
    },
    {
      "id": "insert",
      "zone": "RSI",
      "name": "Insert",
      "plain": "Append to archive only when gates allow.",
      "artifact": "updated_frontier_cell.jsonl",
      "why": "State is monotonic and auditable."
    },
    {
      "id": "promote",
      "zone": "RSI",
      "name": "Promote",
      "plain": "Queue promotions mechanically; no bypass.",
      "artifact": "promotion_queue.jsonl",
      "why": "Promotion is earned by proof."
    },
    {
      "id": "asiGate",
      "zone": "ASI",
      "name": "ASI Boundary",
      "plain": "Lock ASI-scale claims behind extraordinary controls.",
      "artifact": "asi_boundary_lock.json",
      "why": "No self-authorized superintelligence."
    },
    {
      "id": "council",
      "zone": "ASI",
      "name": "Council Review",
      "plain": "Independent Architect / Validator Council exercises stop authority.",
      "artifact": "council_review_note.json",
      "why": "Authority is institutional, not model-internal."
    },
    {
      "id": "rollback",
      "zone": "ASI",
      "name": "Rollback Drill",
      "plain": "Verify containment, reversibility, and release gates.",
      "artifact": "rollback_drill_report.json",
      "why": "No rollback, no release."
    }
  ],
  "gates": [
    {
      "id": "risk",
      "name": "Risk gate",
      "meaning": "Prohibited domains, unsafe escalation, and adverse side effects are blocked."
    },
    {
      "id": "evidence",
      "name": "Evidence gate",
      "meaning": "Claims must be bound to reproducible artifacts and evidence objects."
    },
    {
      "id": "baseline",
      "name": "Baseline gate",
      "meaning": "Claims are compared to incumbent, nearest-neighbor, and null baselines."
    },
    {
      "id": "persistence",
      "name": "Persistence gate",
      "meaning": "High novelty must survive stress tests and fixed-seed reproduction."
    },
    {
      "id": "council",
      "name": "Council gate",
      "meaning": "Independent human authority is required for strategic escalation."
    },
    {
      "id": "rollback",
      "name": "Rollback gate",
      "meaning": "Containment, kill-switch, and rollback drills must pass before release."
    },
    {
      "id": "asi",
      "name": "ASI claim lock",
      "meaning": "ASI-scale claims are locked until extraordinary evidence and governance pass."
    }
  ],
  "maturity": [
    {
      "level": "L0",
      "name": "Narrative claim",
      "body": "A claim exists, but proof is scattered or missing."
    },
    {
      "level": "L1",
      "name": "Evidence packet",
      "body": "Evidence exists and is mapped to explicit acceptance criteria."
    },
    {
      "level": "L2",
      "name": "Replayable work",
      "body": "A reviewer can inspect the replay path and verify what happened."
    },
    {
      "level": "L3",
      "name": "Governed RSI pilot",
      "body": "A deterministic invention cycle is bounded by schema, baselines, and ledgers."
    },
    {
      "level": "L4",
      "name": "Move\u201137 dossier",
      "body": "High-novelty advantage is reproduced, stressed, and packaged for council review."
    },
    {
      "level": "L5",
      "name": "ASI boundary lock",
      "body": "Superintelligence-scale escalation is locked behind extraordinary proof and rollback."
    },
    {
      "level": "L6",
      "name": "Sovereign invention governance",
      "body": "Institutional control, council authority, and compounding ledgers become permanent infrastructure."
    }
  ],
  "dossier": [
    {
      "name": "Recognition note",
      "detail": "Why the candidate crossed novelty or advantage thresholds."
    },
    {
      "name": "Reproduction manifest",
      "detail": "Fixed seeds, artifact hashes, environment, and replay instructions."
    },
    {
      "name": "Stress-test bundle",
      "detail": "Policy shocks, sensitivity deltas, and failure-mode register."
    },
    {
      "name": "Persistence report",
      "detail": "Minimum pass rate under shocks and baseline comparison."
    },
    {
      "name": "Rollback plan",
      "detail": "Containment, stop authority, monitoring, and release gates."
    },
    {
      "name": "Council memo",
      "detail": "Decision asks, dissent register, and approval boundaries."
    },
    {
      "name": "Synthetic receipt",
      "detail": "Public-safe record of decision state and remaining proof debt."
    }
  ],
  "shocks": [
    "distribution shift",
    "adversarial framing",
    "metric capture",
    "operator pressure",
    "political capture",
    "budget pressure",
    "evaluator disagreement",
    "containment failure",
    "rollback failure",
    "novelty euphoria"
  ],
  "sourceDocuments": [
    {
      "title": "AGI Alpha RSI \u2014 Sovereign Invention Governance presentation",
      "path": "research/rsi/AGI_Alpha_RSI_Sovereign_v0.pdf"
    },
    {
      "title": "AGI Alpha RSI \u2014 Sovereign Strategy Brief",
      "path": "research/rsi/AGI_Alpha_RSI_Sovereign_Strategy_Brief_v0.pdf"
    }
  ]
};
let activePersona = 'firstTimer';
let activeScenario = 'proofLoop';
let activeMode = 'simple';
let cycleIndex = 0;
let latestReceipt = null;
const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function init() {
  const personas = $('#persona-list');
  personas.innerHTML = Object.entries(DATA.personas).map(([id,p]) => `<button type="button" class="choice" data-persona="${id}">${esc(p.label)}<small>${esc(p.summary)}</small></button>`).join('');
  const scenarios = $('#scenario-list');
  scenarios.innerHTML = Object.entries(DATA.scenarios).map(([id,s]) => `<button type="button" class="choice" data-scenario="${id}">${esc(s.label)}<small>${esc(s.plain)}</small></button>`).join('');
  $('#pipeline').innerHTML = DATA.stages.map(s => `<article class="stage-card" data-stage="${s.id}" data-zone="${s.zone}"><b>${esc(s.name)}</b><small>${esc(s.plain)}</small></article>`).join('');
  $('#gate-grid').innerHTML = DATA.gates.map(g => `<article class="gate"><span class="gate-status warn" data-gate-status="${g.id}">PENDING</span><h3>${esc(g.name)}</h3><p>${esc(g.meaning)}</p></article>`).join('');
  $('#maturity-grid').innerHTML = DATA.maturity.map(m => `<article class="maturity-card"><b>${esc(m.level)}</b><h3>${esc(m.name)}</h3><p>${esc(m.body)}</p></article>`).join('');
  $('#dossier-grid').innerHTML = DATA.dossier.map((d,i) => `<article class="dossier-step"><span class="artifact-pill">${String(i+1).padStart(2,'0')}</span><h3>${esc(d.name)}</h3><p>${esc(d.detail)}</p></article>`).join('');
  selectPersona('firstTimer'); selectScenario('proofLoop'); setMode('simple'); buildReceipt(false);
}
function selectPersona(id) { activePersona = DATA.personas[id] ? id : 'firstTimer'; $$('#persona-list .choice').forEach(b => b.classList.toggle('active', b.dataset.persona === activePersona)); brief(); }
function selectScenario(id) { activeScenario = DATA.scenarios[id] ? id : 'proofLoop'; $$('#scenario-list .choice').forEach(b => b.classList.toggle('active', b.dataset.scenario === activeScenario)); const s = DATA.scenarios[activeScenario]; $('#scenario-title').textContent = s.label; $('#scenario-summary').textContent = s.plain; $('#decision-state').textContent = s.state; $('#decision-note').textContent = s.decision; $('#score').textContent = s.score; $('.score-ring').style.setProperty('--score', s.score); updateMetrics(s.metrics); updateGates(s.gates); renderArtifacts([]); brief(); buildReceipt(false); }
function setMode(id) { activeMode = DATA.explainModes[id] ? id : 'simple'; $$('.mode').forEach(b => b.classList.toggle('active', b.dataset.mode === activeMode)); brief(); }
function updateMetrics(metrics) { $('#metric-list').innerHTML = Object.entries(metrics).map(([k,v]) => `<div class="metric"><b><span>${esc(k)}</span><span>${v}%</span></b><div class="bar"><span style="width:${v}%"></span></div></div>`).join(''); }
function updateGates(gates) { DATA.gates.forEach(g => { const el = document.querySelector(`[data-gate-status="${g.id}"]`); const status = gates[g.id] || 'warn'; el.className = 'gate-status ' + status; el.textContent = status.toUpperCase(); }); }
function renderArtifacts(list) { $('#artifact-strip').innerHTML = (list.length ? list : ['awaiting cycle']).map(x => `<span class="artifact-pill">${esc(x)}</span>`).join(''); }
function writeLog(txt) { const el = $('#ai-log'); el.textContent = txt; el.scrollTop = 0; }
function appendLog(txt) { const el = $('#ai-log'); el.textContent += '\n' + txt; el.scrollTop = el.scrollHeight; }
function brief() {
  const p = DATA.personas[activePersona], s = DATA.scenarios[activeScenario];
  writeLog(`GoalOS v34 AI-style briefing console

Role: ${p.label}
Lens: ${p.lens}

Scenario: ${s.label}
State: ${s.state}

Mode: ${activeMode} — ${DATA.explainModes[activeMode]}

Plain answer: ${s.decision}

Boundary: this is a deterministic browser-local demo. It does not call an AI API, collect user input, connect wallets, move value, or claim achieved AGI/ASI.`);
}
function runCycle() {
  cycleIndex += 1; const s = DATA.scenarios[activeScenario]; const p = DATA.personas[activePersona]; let i = 0, artifacts = [];
  $$('.stage-card').forEach(c => c.classList.remove('active','done'));
  renderArtifacts([]);
  writeLog(`cycle ${cycleIndex} started — Loop → RSI → ASI control tower
role: ${p.label}
scenario: ${s.label}
rule: no self-authorized ASI
`);
  const timer = setInterval(() => {
    if (i >= DATA.stages.length) { clearInterval(timer); appendLog(`
final decision state: ${s.state}
readiness score: ${s.score}
receipt class: ${s.receiptClass}
result: ${s.decision}`); buildReceipt(true); return; }
    const stage = DATA.stages[i++]; const card = document.querySelector(`[data-stage="${stage.id}"]`);
    if (card) { card.classList.add('active'); setTimeout(() => { card.classList.remove('active'); card.classList.add('done'); }, 360); }
    artifacts.push(stage.artifact); renderArtifacts(artifacts.slice(-12));
    appendLog(`[${stage.zone}/${stage.id}] ${stage.plain}
  artifact: ${stage.artifact}
  why: ${stage.why}`);
  }, 300);
}
function stressTest() {
  const s = DATA.scenarios[activeScenario];
  const base = activeScenario === 'proofLoop' ? 7 : activeScenario === 'rsiPilot' ? 7 : activeScenario === 'move37' ? 6 : activeScenario === 'capital' ? 7 : activeScenario === 'redTeam' ? 3 : activeScenario === 'noveltyTrap' ? 2 : 2;
  appendLog('\npolicy-shock suite:');
  DATA.shocks.forEach((shock, i) => appendLog(`  shock_${String(i+1).padStart(2,'0')}: ${shock} → ${i < base ? 'PASS' : 'FAIL/PENDING'}`));
  appendLog(base >= 8 ? 'shock result: strong persistence candidate; still requires council review.' : base >= 6 ? 'shock result: dossier continues; no deployment authority.' : 'shock result: blocked or probe-only; no escalation.');
}
function rollbackDrill() {
  const s = DATA.scenarios[activeScenario];
  const pass = ['proofLoop','rsiPilot','capital'].includes(activeScenario);
  appendLog('\nrollback drill:');
  ['monitoring boundary','stop signal','state snapshot','release freeze','reversal path','operator notification','council acknowledgement'].forEach((x,i)=> appendLog(`  ${i+1}. ${x} → ${pass || i < 4 ? 'PASS' : 'REQUIRED'}`));
  appendLog(pass ? 'rollback result: acceptable for bounded pilot.' : 'rollback result: insufficient for ASI-scale escalation.');
}
function councilReview() {
  const s = DATA.scenarios[activeScenario];
  const verdict = s.state.includes('LOCKED') || s.state.includes('BLOCKED') ? 'HOLD / DO NOT PROMOTE' : s.state.includes('DOSSIER') ? 'REQUIRE DOSSIER' : 'REVIEW READY';
  appendLog(`
Architect / Validator Council note:
  verdict: ${verdict}
  stop authority: active
  self-promotion: prohibited
  next action: ${s.decision}`);
}
function buildDossier() {
  const s = DATA.scenarios[activeScenario];
  appendLog('\nMove‑37 → ASI dossier builder:');
  DATA.dossier.forEach((d,i)=> appendLog(`  ${String(i+1).padStart(2,'0')} ${d.name} — ${d.detail}`));
  appendLog(`dossier status: ${s.state}; proof debt remains until all gates pass.`);
}
function makeMemo() {
  const p = DATA.personas[activePersona], s = DATA.scenarios[activeScenario];
  const memo = `BOARD MEMO — GoalOS v34 Control Tower

Core standard: GoalOS proves the work. RSI governs the invention loop. ASI must not self-authorize.

Audience: ${p.label}
Scenario: ${s.label}
Decision state: ${s.state}
Readiness score: ${s.score}/100

Recommended action: ${s.decision}

Required before escalation: evidence docket, deterministic replay, baseline comparison, policy-shock persistence, independent council review, rollback drill, signed receipt.

Public boundary: no external AI call, no uploads, no wallet, no payment, no value moved, no claim of achieved AGI/ASI.`;
  $('#memo').textContent = memo; copyText(memo, 'Board memo copied');
}
function buildReceipt(showLog=true) {
  const s = DATA.scenarios[activeScenario], p = DATA.personas[activePersona];
  latestReceipt = {
    receipt_id: `GOALOS-LOOP-RSI-ASI-V34-${activeScenario.toUpperCase()}-${String(cycleIndex || 1).padStart(3,'0')}`,
    lab: DATA.lab,
    version: DATA.version,
    public_safe: true,
    value_moved: 0,
    external_ai_calls: false,
    user_inputs: false,
    persona: p.label,
    scenario: s.label,
    explanation_mode: activeMode,
    decision_state: s.state,
    readiness_score: s.score,
    novelty_distance: s.novelty,
    advantage_delta_percent: s.advantage,
    gates: s.gates,
    required_dossier: DATA.dossier.map(d => d.name),
    mandatory_boundary: ['not achieved AGI','not achieved ASI or superintelligence','not live RSI','not autonomous deployment','no wallet','no payment','no external AI call','zero value moved','no self-authorized promotion'],
    decision_note: s.decision,
    generated_at: new Date().toISOString()
  };
  $('#receipt-json').textContent = JSON.stringify(latestReceipt, null, 2);
  if (showLog) appendLog('\nsynthetic Mission Receipt generated → receipt JSON updated.');
}
function guidedTour() {
  selectPersona('executive'); setMode('executive'); selectScenario('asiThreshold');
  writeLog('Guided tour loaded: Executive + ASI-scale escalation review.\nStep 1: explain. Step 2: run cycle. Step 3: stress-test. Step 4: rollback drill. Step 5: council review. Step 6: receipt.');
  setTimeout(runCycle, 800); setTimeout(stressTest, 6100); setTimeout(rollbackDrill, 7600); setTimeout(councilReview, 9100); setTimeout(() => buildReceipt(true), 10300);
}
function copyText(txt, label='Copied') { navigator.clipboard?.writeText(txt).then(()=>toast(label)).catch(()=>toast('Copy unavailable')); }
function toast(message) { const el = document.createElement('div'); el.className = 'toast'; el.textContent = message; document.body.appendChild(el); setTimeout(()=>el.remove(), 1500); }
document.addEventListener('DOMContentLoaded', () => {
  init();
  document.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    if (b.dataset.persona) selectPersona(b.dataset.persona);
    if (b.dataset.scenario) selectScenario(b.dataset.scenario);
    if (b.dataset.mode) setMode(b.dataset.mode);
    if (b.dataset.action === 'run') runCycle();
    if (b.dataset.action === 'stress') stressTest();
    if (b.dataset.action === 'rollback') rollbackDrill();
    if (b.dataset.action === 'council') councilReview();
    if (b.dataset.action === 'dossier') buildDossier();
    if (b.dataset.action === 'receipt') buildReceipt(true);
    if (b.dataset.action === 'memo') makeMemo();
    if (b.dataset.action === 'tour') guidedTour();
    if (b.dataset.action === 'copy-receipt') copyText(JSON.stringify(latestReceipt || {status:'run the console first'}, null, 2), 'Receipt copied');
    if (b.dataset.action === 'copy-standard') copyText('GoalOS proves the work. RSI governs the invention loop. ASI must not self-authorize. No Proof. No Trust. No Settlement. No ungoverned superintelligence.', 'Standard copied');
  });
});
