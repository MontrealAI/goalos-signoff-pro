
(() => {
  const scenarios = {"research":{"label":"AI research acceptance","mission":"Accept or request changes on a public-safe research synthesis package.","risk":"medium","operators":["Schema replay","Baseline replay","Adversarial replay"],"outcome":"claim-ready"},"software":{"label":"Software delivery review","mission":"Verify whether a software milestone has enough evidence to support signoff.","risk":"medium","operators":["Dependency replay","Test replay","Rollback replay"],"outcome":"claim-ready"},"procurement":{"label":"Procurement proof room","mission":"Check whether vendor claims survive evidence, baselines, risk, and replay.","risk":"high","operators":["Docket replay","Cost replay","Risk replay"],"outcome":"review-ready"},"safety":{"label":"Safety escalation packet","mission":"Preserve a safety-significant decision path without turning private traces public.","risk":"high","operators":["Boundary replay","Contradiction replay","Challenge replay"],"outcome":"human-gated"}};
  const basePacket = {"id":"GOALOS-INDEPENDENT-REPLAY-DEMO-V24","thesis":"A claim is not promoted because one run passed. It is promoted when independent replay survives manifest checks, replay logs, verifier reports, safety/cost ledgers, baselines, challenge windows, and claim boundaries.","candidates":[{"id":"C0","name":"Narrative-only demo","verdict":"REJECT","reason":"No replayable manifest, no baselines, no public evidence docket."},{"id":"C1","name":"Local packet only","verdict":"HOLD","reason":"Local verifier passes, but independent replay quorum is missing."},{"id":"C2","name":"Public replay packet","verdict":"CHALLENGE","reason":"Replay passes but challenge window and contradiction check remain open."},{"id":"C3","name":"Independent replay packet","verdict":"PROMOTE_FOR_REVIEW","reason":"Manifest, baselines, operators, validator reports, cost/safety ledgers, challenge clearance, and claim boundary pass."}],"gates":["manifest","environment","baselines","runner","proofBundle","replayLogs","validatorReports","costLedger","safetyLedger","claimsMatrix","challengeWindow","claimBoundary"],"valueMoved":0};
  const operators = {"operators":[{"id":"R1","role":"Fresh clone replay","pass":true,"checks":106},{"id":"R2","role":"Pinned environment replay","pass":true,"checks":106},{"id":"R3","role":"Adversarial boundary replay","pass":true,"checks":106}],"quorum":"3/3 public-safe synthetic operators passed","focusedTests":318,"officialFieldsMissing":0};
  const certificate = {"type":"ClaimPromotionCertificate","claimLevelBefore":"LOCAL_PACKET_PASS","claimLevelAfter":"INDEPENDENT_REPLAY_REVIEW_READY","promotedCandidate":"C3","hardRule":"No replay quorum, no claim promotion.","valueMoved":0};
  const reviewCard = {"reviewerQuestion":"Can a third party reproduce the public-safe result from the packet?","answer":"Synthetic demo answer: yes, when the packet contains manifest, baselines, runner config, replay log, validator report, cost/safety ledgers, claims matrix, and challenge-window receipt.","notClaimed":["external audit","production certification","empirical SOTA","active settlement","value movement"]};
  const steps = ['Manifest', 'Environment', 'Baselines', 'Runner config', 'ProofBundle', 'Replay logs', 'Validator reports', 'Cost ledger', 'Safety ledger', 'Claims matrix', 'Challenge window', 'Claim boundary'];
  const state = { scenario: 'research', running: false, tab: 'packet' };
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => [...document.querySelectorAll(s)];
  function renderScenario(){
    $$('.scenario').forEach(b => b.classList.toggle('active', b.dataset.scenario === state.scenario));
    const s = scenarios[state.scenario];
    const m = $('#missionText'); if(m) m.textContent = s.mission;
    const r = $('#riskText'); if(r) r.textContent = s.risk.toUpperCase();
  }
  function renderTabs(){
    $$('.tab').forEach(b => b.classList.toggle('active', b.dataset.tab === state.tab));
    const view = $('#artifactView'); if(!view) return;
    const payloads = { packet: basePacket, operators, certificate, review: reviewCard };
    view.textContent = JSON.stringify(payloads[state.tab] || basePacket, null, 2);
  }
  function setLog(lines){ const el = $('#traceLog'); if(el) el.textContent = lines.join('\n'); }
  function setMetric(id, value){ const el = document.getElementById(id); if(el) el.textContent = value; }
  function buildSteps(done = 0){
    const list = $('#stepList'); if(!list) return;
    list.innerHTML = steps.map((name, i) => '<div class="step" data-state="' + (i < done ? 'pass' : '') + '"><b>' + String(i+1).padStart(2,'0') + '</b><span>' + name + '</span><em class="status">' + (i < done ? 'PASS' : 'WAITING') + '</em></div>').join('');
  }
  async function run(){
    if(state.running) return; state.running = true;
    buildSteps(0); setMetric('q','0/3'); setMetric('tests','0'); setMetric('level','LOCAL');
    const log = ['Replay council initialized.', 'Scenario: ' + scenarios[state.scenario].label, 'Rule: one run is not enough; independent replay is the promotion gate.'];
    setLog(log);
    for(let i=0;i<steps.length;i++){
      await new Promise(r => setTimeout(r, 170));
      log.push('✓ ' + steps[i] + ' verified.');
      buildSteps(i+1); setLog(log);
      setMetric('tests', String(Math.round(((i+1)/steps.length)*318)));
      if(i===4) setMetric('q','1/3');
      if(i===7) setMetric('q','2/3');
      if(i===10) setMetric('q','3/3');
    }
    log.push('Claim promotion: INDEPENDENT_REPLAY_REVIEW_READY.');
    log.push('No value moved. Human/institutional review remains the final authority.');
    setLog(log); setMetric('level','REVIEW READY');
    state.running = false;
  }
  function download(){
    const bundle = { ...basePacket, selectedScenario: scenarios[state.scenario], operatorReports: operators, certificate, reviewCard };
    const blob = new Blob([JSON.stringify(bundle,null,2)], {type:'application/json'});
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'goalos-independent-replay-demo-bundle.json'; a.click(); URL.revokeObjectURL(a.href);
  }
  $$('.scenario').forEach(b => b.addEventListener('click', () => { state.scenario = b.dataset.scenario; renderScenario(); }));
  $$('.tab').forEach(b => b.addEventListener('click', () => { state.tab = b.dataset.tab; renderTabs(); }));
  $('#runReplay')?.addEventListener('click', run);
  $('#downloadReplay')?.addEventListener('click', download);
  buildSteps(0); renderScenario(); renderTabs();
})();
