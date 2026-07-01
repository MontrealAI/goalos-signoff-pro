
(()=>{
  const labs = [{"version":"v22","route":"action-graph-authority-lab.html","chapter":"Human authority","title":"Action Graph & Human Authority","promise":"Convert accepted proof into bounded action graphs with reason, authority, rollback, and receipt boundaries.","audience":["Executive","Auditor","Builder"],"value":"See why GoalOS never treats output as automatic permission to act."},{"version":"v23","route":"proof-carrying-artifact-lab.html","chapter":"Reusable capability","title":"Proof-Carrying Artifact & Evolution Ledger","promise":"Make reusable artifacts earn upgrade rights through proof, ledgers, rollback, and evidence.","audience":["Builder","Auditor","AI operator"],"value":"Understand how accepted work becomes reusable without becoming ungoverned."},{"version":"v24","route":"independent-replay-lab.html","chapter":"Independent replay","title":"Independent Replay & Claim Promotion","promise":"Promote claims only when independent replay, review, and claim maturity gates pass.","audience":["Reviewer","Auditor","DAO"],"value":"See how one run becomes review-ready evidence."},{"version":"v25","route":"proofzero-planning-lab.html","chapter":"Planning over proof states","title":"ProofZero Planning & Evidence Reanalyze","promise":"Plan over evidence states, latent work, validators, and bounded search instead of persuasive futures.","audience":["Strategist","AI operator","Reviewer"],"value":"Explore how GoalOS reasons about what remains unproven."},{"version":"v26","route":"mission-foundry-lab.html","chapter":"Curriculum","title":"Proof-Gated Mission Foundry","promise":"Turn accepted proof into harder next missions while rejecting unproofable or unsafe mission seeds.","audience":["Program lead","Research lead","Founder"],"value":"Watch proof become a curriculum for compounding work."},{"version":"v27","route":"process-evidence-lab.html","chapter":"Process evidence","title":"Process-Resolved Evidence","promise":"Resolve evidence through process traces, lineage, provenance, and proof-native workbench views.","audience":["Auditor","Reviewer","Enterprise"],"value":"Inspect how work history becomes legible instead of anecdotal."},{"version":"v28","route":"blockchain-credibility-lab.html","chapter":"Blockchain credibility","title":"Blockchain Credibility Standard","promise":"Blockchain proves the transaction. GoalOS proves the work.","audience":["Blockchain team","DAO","Investor"],"value":"Make proof before settlement obvious."},{"version":"v29","route":"blockchain-proof-mandate-lab.html","chapter":"Proof mandate","title":"Blockchain Proof Mandate & Due Diligence","promise":"Require the proof package before trust, funding, governance, reputation, or settlement readiness escalates.","audience":["DAO delegate","Investor","Auditor"],"value":"Turn the slogan into a stakeholder checklist."},{"version":"v30","route":"proof-before-settlement-research-lab.html","chapter":"Research standard","title":"Proof Before Settlement Research Lab","promise":"Publish the institutional research standard, acceptance predicate, due-diligence rubric, and mandate clauses.","audience":["Executive","Partner","Researcher"],"value":"Give serious stakeholders a paper-grade reference."},{"version":"v31","route":"executive-ai-proof-console.html","chapter":"Guided proof console","title":"Executive AI Proof Console","promise":"Choose a role and run a public-safe proof-gate simulation with no inputs, no uploads, no wallets, and no external AI calls.","audience":["First-time visitor","Executive","DAO"],"value":"Let anyone understand GoalOS in one guided experience."},{"version":"v32","route":"from-loop-to-rsi-lab.html","chapter":"Loop to RSI","title":"From Loop to RSI","promise":"Move from proof-gated work to deterministic invention governance and RSI readiness.","audience":["Frontier lab","Policy lead","Researcher"],"value":"Connect proof loops to governed invention."},{"version":"v33","route":"loop-rsi-asi-superintelligence-lab.html","chapter":"RSI to ASI","title":"Loop → RSI → ASI Console","promise":"Escalate from mission proof to RSI governance and ASI-readiness gates without self-authorization.","audience":["Safety lead","Frontier lab","Executive"],"value":"See the superintelligence control boundary."},{"version":"v34","route":"loop-rsi-asi-superintelligence-control-tower-lab.html","chapter":"Control tower","title":"ASI Superintelligence Control Tower","promise":"Run explanation modes, stress tests, rollback drills, council review, and Move‑37 dossier handling.","audience":["Council","Executive","Red-team"],"value":"Operate the full governance cockpit."},{"version":"v35","route":"loop-rsi-asi-superintelligence-mission-simulator-lab.html","chapter":"Mission simulator","title":"ASI Mission Simulator","promise":"Choose role, mission, and explanation mode; run proof, RSI, ASI gates; generate a synthetic Mission Receipt.","audience":["Everyone","Executive","Reviewer"],"value":"Experience the complete journey in one interactive lab."}];
  const roles = {
    visitor:'First-time visitor', blockchain:'Blockchain team', executive:'Executive / board', auditor:'Auditor / reviewer', frontier:'Frontier lab / RSI team', public:'Public reviewer'
  };
  const modes = {
    tour:['Mission','Evidence','Replay','Validation','Receipt'],
    blockchain:['Claim','Proof package','Due diligence','Settlement readiness','Receipt'],
    rsi:['Target','Emit','Filter','Atlas','Eval'],
    asi:['Loop','RSI gates','ASI lock','Council','Rollback']
  };
  const messages = {
    visitor:'Start with the guided proof console, then follow the v35 mission simulator. You will understand the whole system without reading the entire archive first.',
    blockchain:'Open v28 and v29 first. The key question becomes: where is the proof package before value, governance, or reputation moves?',
    executive:'Open v30, v34, and v35. The executive lens is simple: proof before trust, council before promotion, rollback before release.',
    auditor:'Open v24, v27, and v35. Focus on replay, process-resolved evidence, risk gates, and synthetic receipt integrity.',
    frontier:'Open v32 through v35. The path is proof loop → deterministic RSI → ASI-readiness gates → council review.',
    public:'Open v31 and v35. The public version keeps the entire experience browser-local and uses buttons only.'
  };
  let state = {role:'visitor', mode:'tour', step:0};
  const $ = (id)=>document.getElementById(id);
  const safeJson = (x)=>JSON.stringify(x,null,2);
  function setPressed(group,value){ document.querySelectorAll('[data-'+group+']').forEach(b=>b.setAttribute('aria-pressed', String(b.dataset[group]===value))); }
  function routeFor(){
    if(state.role==='blockchain') return 'blockchain-proof-mandate-lab.html';
    if(state.role==='executive') return 'loop-rsi-asi-superintelligence-control-tower-lab.html';
    if(state.role==='auditor') return 'independent-replay-lab.html';
    if(state.role==='frontier') return 'from-loop-to-rsi-lab.html';
    if(state.role==='public') return 'executive-ai-proof-console.html';
    return 'loop-rsi-asi-superintelligence-mission-simulator-lab.html';
  }
  function render(){
    setPressed('role',state.role); setPressed('mode',state.mode);
    const steps = modes[state.mode] || modes.tour;
    state.step = Math.min(state.step, steps.length-1);
    const stage = $('g35-stage'); if(stage){ stage.innerHTML = steps.map((s,i)=>'<div class="goalos35-step '+(i===state.step?'active':'')+'"><b>'+String(i+1).padStart(2,'0')+' · '+s+'</b><span>'+['Define the mission boundary.','Bind evidence and provenance.','Replay or stress the claim.','Apply gates and authority.','Issue or withhold promotion.'][i%5]+'</span></div>').join(''); }
    const activeLabs = labs.filter(l=> state.mode==='tour' ? true : state.mode==='blockchain' ? ['v28','v29','v30'].includes(l.version) : state.mode==='rsi' ? ['v32','v33'].includes(l.version) : ['v33','v34','v35'].includes(l.version));
    const cards = $('g35-cards'); if(cards){ cards.innerHTML = activeLabs.slice(-6).map(l=>'<a class="goalos35-card" href="'+l.route+'"><small>'+l.version+' · '+l.chapter+'</small><h3>'+l.title+'</h3><p>'+l.value+'</p></a>').join(''); }
    const receipt = {
      role: roles[state.role], mode: state.mode, activeStep: steps[state.step], recommendedRoute: routeFor(),
      gates: ['mission-defined','evidence-bound','replay-ready','human-authority','rollback-available'],
      publicSafety: {forms:false, inputs:false, uploads:false, wallets:false, payments:false, externalAiCalls:false, valueMoved:0},
      decision: state.mode==='asi' ? 'ASI_ESCALATION_REQUIRES_COUNCIL_AND_ROLLBACK' : 'REVIEW_READY_DEMO',
      generated_at_static: 'STATIC_SAMPLE_2026_07_01T00_00_00Z'
    };
    const out = $('g35-output'); if(out){ out.textContent = 'GOALOS COMMAND CENTER\n\nRole: '+roles[state.role]+'\nMode: '+state.mode.toUpperCase()+'\nStep: '+steps[state.step]+'\n\n'+messages[state.role]+'\n\nRecommended next route: '+routeFor()+'\n\nSynthetic receipt:\n'+safeJson(receipt); }
    const open = $('g35-open'); if(open) open.href = routeFor();
    const next = $('g35-next'); if(next) next.textContent = state.step === steps.length-1 ? 'Restart cycle' : 'Next gate';
  }
  document.addEventListener('click',(e)=>{
    const role = e.target.closest('[data-role]'); if(role){ state.role=role.dataset.role; render(); }
    const mode = e.target.closest('[data-mode]'); if(mode){ state.mode=mode.dataset.mode; state.step=0; render(); }
    if(e.target.closest('#g35-next')){ const len=(modes[state.mode]||modes.tour).length; state.step=(state.step+1)%len; render(); }
    if(e.target.closest('#g35-copy')){ const text=$('g35-output')?.textContent||''; navigator.clipboard?.writeText(text).catch(()=>{}); const btn=$('g35-copy'); if(btn){ const old=btn.textContent; btn.textContent='Copied'; setTimeout(()=>btn.textContent=old,900);} }
  });
  render();
})();
