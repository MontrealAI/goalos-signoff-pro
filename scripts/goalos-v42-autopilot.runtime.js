(() => {
  const state = { role: 'first-time', tier: 'Signoff Basic', mission: null, tab: 'mission', knowledge: null, lastPlan: null };
  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];
  const fallback = { missionTypes: [], tiers: {}, roles: [], contracts: [], routes: [] };
  const clean = text => String(text || '').toLowerCase().replace(/[^a-z0-9$\- ]+/g, ' ');
  const escapeHtml = text => String(text || '').replace(/[&<>]/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[ch]));
  const escapeAttr = text => String(text || '').replace(/"/g, '&quot;');

  async function loadKnowledge() {
    try {
      state.knowledge = await fetch('goalos-v42-autopilot-knowledge.json', { cache: 'no-store' }).then(response => response.json());
    } catch {
      state.knowledge = fallback;
    }
    init();
  }

  function scoreMission(text, mission) {
    const t = clean(text);
    let score = 0;
    for (const keyword of mission.keywords || []) {
      const key = clean(keyword);
      if (!key) continue;
      if (t.includes(key)) score += key.length > 8 ? 5 : 3;
    }
    if (mission.id === 'general-site-navigation' && t.length < 12) score += 2;
    if (state.role === 'dao' && /grant|treasury|dao|payment|settlement|milestone/.test(t)) score += 8;
    if (state.role === 'protocol' && /contract|agialpha|mainnet|token|rail/.test(t)) score += 8;
    if (state.role === 'rsi' && /rsi|asi|move|breakthrough|dossier|govern/.test(t)) score += 8;
    return score;
  }

  function bestMission(text) {
    const missions = state.knowledge.missionTypes || [];
    return missions.map(mission => ({ ...mission, score: scoreMission(text, mission) })).sort((a, b) => b.score - a.score)[0] || missions[0] || { name: 'GoalOS Site Navigation', route: 'goalos-v22-v42-command-center.html', tier: 'Signoff Basic', summary: 'Start with the command center.', id: 'general-site-navigation' };
  }

  function tierFor(mission, text) {
    const t = clean(text);
    if (/settle|payment|escrow|release reward|pay/.test(t)) return 'Signoff & Settle';
    if (/bond|challenge|slashing|dispute|appeal|secured|stake/.test(t)) return 'Signoff Secured';
    if (/verified|anchor|credential|proof card|mainnet|contract|dao|grant/.test(t)) return 'Signoff Verified';
    return mission?.tier || state.tier || 'Signoff Basic';
  }

  function criteriaFor(mission) {
    const common = [
      'The brief is explicit and frozen before review.',
      'Acceptance criteria are visible to the reviewer.',
      'Evidence is mapped to each material claim.',
      'Known limitations and unresolved risk are disclosed.'
    ];
    const map = {
      'ai-research-signoff': ['Sources are cited and freshness is checked.', 'Claims are linked to evidence or marked unsupported.', 'Disagreement, uncertainty, and decision limits are visible.'],
      'software-automation-signoff': ['Tests, screenshots, traces, and setup steps are attached.', 'Rollback and failure conditions are documented.'],
      'dao-grant-milestone': ['Milestone deliverables match the grant brief.', 'Settlement is blocked until review state is accepted.', 'Challenge window and reviewer path are specified.'],
      'contract-rail-education': ['Contract family, tier, role, and Etherscan record are explained.', 'Production-activation and user-fund boundaries remain visible.'],
      'rsi-governance': ['The pipeline is deterministic and replayable.', 'Novelty cannot bypass evidence, baseline, risk, and persistence gates.', 'Move-37 candidates require dossier packaging.'],
      'asi-mission-control': ['ASI-scale promotion cannot self-authorize.', 'Rollback, council review, and boundary gates remain mandatory.']
    };
    return [...common, ...(map[mission?.id] || [])];
  }

  function evidenceFor(mission) {
    const base = ['Mission Contract', 'Evidence Docket', 'Claim-to-Evidence Matrix', 'Reviewer Checklist', 'Mission Receipt'];
    const extra = {
      'ai-research-signoff': ['Source freshness report', 'Unsupported-claim list', 'Disagreement and uncertainty notes'],
      'software-automation-signoff': ['Test output', 'Trace log', 'Rollback note', 'Environment manifest'],
      'dao-grant-milestone': ['Grant milestone map', 'Treasury policy clause', 'Settlement readiness ledger'],
      'contract-rail-education': ['Contract family map', 'Tier-to-contract map', 'Etherscan source verification links'],
      'proof-before-settlement': ['Proof bond terms', 'Challenge window', 'Dispute path', 'Settlement readiness receipt'],
      'rsi-governance': ['Target / emit / filter / atlas / test-plan / eval / insert / promote artifacts', 'Stress-test results', 'Move-37 dossier'],
      'asi-mission-control': ['Council memo', 'Rollback drill', 'ASI boundary lock', 'Synthetic receipt']
    };
    return [...base, ...(extra[mission?.id] || [])];
  }

  function contractsFor(tier, mission) {
    const tierContracts = state.knowledge.tiers?.[tier]?.contracts || [];
    const index = state.knowledge.contracts || [];
    const selected = tierContracts.map(name => index.find(contract => contract.name === name) || { name, family: 'Protocol rail', address: '', etherscan: '' });
    if (mission?.id === 'contract-rail-education') return index.slice(0, 12);
    return selected.slice(0, 12);
  }

  function makeReceipt(plan) {
    return {
      receipt_type: 'SYNTHETIC_GOALOS_AUTOPILOT_PLAN_V42',
      public_site_only: true,
      generated_at: new Date().toISOString(),
      user_intent_hash: 'sha256:browser-local-demo',
      mission_type: plan.mission.name,
      role: state.role,
      signoff_tier: plan.tier,
      decision_state: 'PLAN_READY',
      route: plan.mission.route,
      acceptance_criteria: plan.criteria,
      evidence_required: plan.evidence,
      protocol_rails: plan.contracts.map(contract => contract.name),
      boundary: ['local text input only', 'no upload', 'no wallet', 'no payment', 'no external AI call by default', 'zero value moved']
    };
  }

  function planFromInput() {
    const input = $('#goalosIntent')?.value || '';
    const mission = bestMission(input);
    const tier = tierFor(mission, input);
    const criteria = criteriaFor(mission);
    const evidence = evidenceFor(mission);
    const contracts = contractsFor(tier, mission);
    const role = (state.knowledge.roles || []).find(item => item.id === state.role) || {};
    const alternatives = (state.knowledge.routes || []).filter(route => route.href !== mission.route).slice(0, 5);
    const plan = { input, mission, tier, criteria, evidence, contracts, role, alternatives };
    plan.receipt = makeReceipt(plan);
    return plan;
  }

  function renderPlan(plan) {
    state.lastPlan = plan;
    state.mission = plan.mission;
    const confidence = Math.min(99, Math.max(64, 62 + (plan.mission.score || 0) * 4));
    $('#missionName').textContent = plan.mission.name;
    $('#tierName').textContent = plan.tier;
    $('#routeName').textContent = plan.mission.route;
    $('#confidenceName').textContent = confidence + '%';
    $('#autopilotSummary').textContent = plan.mission.summary;
    $('#bestRoute').href = plan.mission.route;
    $('#bestRoute').textContent = 'Open recommended page';
    $('#criteriaList').innerHTML = plan.criteria.map(item => `<div class="item">${escapeHtml(item)}</div>`).join('');
    $('#evidenceList').innerHTML = plan.evidence.map(item => `<div class="item">${escapeHtml(item)}</div>`).join('');
    $('#contractsList').innerHTML = plan.contracts.length ? plan.contracts.map(contract => `<div class="mini rail"><div><h4>${escapeHtml(contract.name)}</h4><p>${escapeHtml(contract.family || 'GoalOS rail')}</p><code>${escapeHtml(contract.address || 'address in atlas')}</code></div><a class="pill" href="${escapeAttr(contract.etherscan || 'agialpha-48-contract-atlas.html')}" target="_blank" rel="noopener">Inspect</a></div>`).join('') : '<div class="mini"><h4>No chain dependency required.</h4><p>Basic Signoff can run as SaaS / browser-local proof-to-acceptance first.</p></div>';
    $('#routeList').innerHTML = [`<div class="route"><div><strong>${escapeHtml(plan.mission.name)}</strong><p>${escapeHtml(plan.mission.summary)}</p></div><a href="${escapeAttr(plan.mission.route)}">Open</a></div>`, ...plan.alternatives.map(route => `<div class="route"><div><strong>${escapeHtml(route.label)}</strong><p>${escapeHtml(route.type)}</p></div><a href="${escapeAttr(route.href)}">Open</a></div>`)].join('');
    $('#receiptBox').textContent = JSON.stringify(plan.receipt, null, 2);
    $('#stageText').textContent = `${plan.role.label || 'GoalOS'} → ${plan.mission.name} → ${plan.tier} → ${plan.mission.route}`;
    $('#autoRouteText').textContent = `Ready. GoalOS recommends ${plan.mission.route}.`;
    $$('.tabpane').forEach(pane => pane.classList.remove('active'));
    $(`#tab-${state.tab}`)?.classList.add('active');
  }

  function init() {
    $$('.roleBtn').forEach(button => button.addEventListener('click', () => {
      $$('.roleBtn').forEach(item => item.classList.remove('active'));
      button.classList.add('active');
      state.role = button.dataset.role;
      renderPlan(planFromInput());
    }));
    $$('.tab').forEach(button => button.addEventListener('click', () => {
      state.tab = button.dataset.tab;
      $$('.tab').forEach(item => item.classList.remove('active'));
      button.classList.add('active');
      $$('.tabpane').forEach(pane => pane.classList.remove('active'));
      $(`#tab-${state.tab}`)?.classList.add('active');
    }));
    $$('.example').forEach(button => button.addEventListener('click', () => {
      $('#goalosIntent').value = button.dataset.prompt;
      renderPlan(planFromInput());
      $('#goalosIntent').focus();
    }));
    $('#runAutopilot')?.addEventListener('click', () => renderPlan(planFromInput()));
    $('#nextScreen')?.addEventListener('click', () => {
      const plan = state.lastPlan || planFromInput();
      location.href = plan.mission.route;
    });
    $('#copyReceipt')?.addEventListener('click', async () => {
      const text = $('#receiptBox')?.textContent || JSON.stringify(makeReceipt(planFromInput()), null, 2);
      try {
        await navigator.clipboard.writeText(text);
        $('#autoRouteText').textContent = 'Synthetic receipt copied.';
      } catch {
        $('#autoRouteText').textContent = 'Copy failed; select the receipt manually.';
      }
    });
    $('#copyStandard')?.addEventListener('click', async () => {
      const text = 'Know when AI work is actually done. Define done, prove the work, obtain accountable review, issue a Mission Receipt, and activate protocol rails only when appropriate.';
      try {
        await navigator.clipboard.writeText(text);
        $('#autoRouteText').textContent = 'Public standard copied.';
      } catch {}
    });
    $('#goalosIntent')?.addEventListener('input', () => {
      clearTimeout(window.__goalosV42Input);
      window.__goalosV42Input = setTimeout(() => renderPlan(planFromInput()), 260);
    });
    renderPlan(planFromInput());
  }

  loadKnowledge();
})();
