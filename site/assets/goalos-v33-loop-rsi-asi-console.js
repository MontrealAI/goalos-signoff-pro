(() => {
  const $ = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => [...root.querySelectorAll(sel)];
  const roleData = {
    executive:{label:'Sovereign Executive',view:'Authorize or pause strategic capability programs with legible proof, stop authority, and receipts.',ask:'Should this program advance from proof loop to governed RSI pilot, and under which gates?'},
    council:{label:'Architect / Validator Council',view:'Independent verification, design authority, and hard stop authority over promotion.',ask:'Which gates are non-bypassable before a Move-37 or ASI-adjacent claim can mature?'},
    safety:{label:'Safety & Assurance Lead',view:'Assume failure modes, force stress tests, and make rollback/pause the default when proof is thin.',ask:'What could go wrong, and which evidence prevents false promotion?'},
    frontier:{label:'Frontier Lab Director',view:'Convert rapid discovery pressure into replayable, baseline-comparative, audit-ready progress.',ask:'How do we preserve velocity without letting novelty bypass evidence?'},
    investor:{label:'Invention Capital Operator',view:'Allocate capital only to proof-bearing stepping stones with measurable advantage and persistence.',ask:'Which lane earns funding, which lane needs a probe, and which lane should stop?'},
    public:{label:'Public Reviewer',view:'Understand what is being claimed, what is proven, and what remains a public-safe simulation.',ask:'Where is the proof package and what is not being claimed?'}
  };
  const scenarios = {
    pilot:{label:'Governed RSI pilot',novelty:.58,advantage:.14,evidence:.78,persistence:.72,risk:.22,authority:.64,summary:'A pilot seeks authorization to run deterministic invention cycles under proof gates and council review.'},
    move37:{label:'Move-37 candidate',novelty:.88,advantage:.24,evidence:.69,persistence:.62,risk:.39,authority:.54,summary:'A high-novelty candidate appears valuable, but must be reproduced, stress-tested, persisted, and packaged.'},
    asi:{label:'ASI-scale escalation',novelty:.93,advantage:.31,evidence:.74,persistence:.67,risk:.58,authority:.49,summary:'The system detects a potentially ASI-adjacent capability escalation and defaults to gated containment.'},
    trap:{label:'Novelty trap / false breakthrough',novelty:.91,advantage:.05,evidence:.42,persistence:.28,risk:.34,authority:.42,summary:'A candidate is surprising but weakly evidenced and fails baseline/persistence tests; it must not promote.'},
    redteam:{label:'Red-team policy shock',novelty:.71,advantage:.17,evidence:.81,persistence:.44,risk:.67,authority:.71,summary:'A promising lane faces policy-shock fragility; the correct state is probe, restrict, or pause.'}
  };
  const flows = {
    loop:['Mission','Work','Evidence','Validation','Receipt','Chronicle'],
    rsi:['TARGET','EMIT','FILTER','ATLAS','TEST-PLAN','EVAL','INSERT','PROMOTE'],
    asi:['Boundary','Sandbox','Red-team','Council','Pause/Rollback','Controlled Promotion']
  };
  const state = {role:'executive',scenario:'asi',phase:'loop',runs:0,shock:0,receipt:null};
  function score(){
    const s = {...scenarios[state.scenario]};
    s.risk = Math.min(1, s.risk + state.shock*.08);
    s.persistence = Math.max(0, s.persistence - state.shock*.06);
    s.evidence = Math.max(0, s.evidence - state.shock*.02);
    return s;
  }
  function gateStatus(s){
    const highNovelty = s.novelty >= .80;
    const gates = [
      {id:'risk',label:'Risk',value:1-s.risk,threshold:.55,probe:.40,why:'prohibited-domain, misuse, adverse effects, and containment checks'},
      {id:'evidence',label:'Evidence',value:s.evidence,threshold:.74,probe:.55,why:'executed evidence, ECI semantics, provenance, artifact hashes'},
      {id:'baseline',label:'Baseline',value:s.advantage >= .18 ? .82 : s.advantage >= .10 ? .62 : .31,threshold:.70,probe:.50,why:'incumbent / nearest-neighbor / null-baseline comparison'},
      {id:'persistence',label:'Persistence',value:s.persistence - (highNovelty ? .08 : 0),threshold:.68,probe:.48,why:'shock-tested advantage and reproduction under fixed seeds'},
      {id:'authority',label:'Authority',value:s.authority,threshold:.72,probe:.52,why:'human authority, council stop power, release/rollback decision'}
    ];
    return gates.map(g => ({...g,status:g.value>=g.threshold?'PASS':g.value>=g.probe?'PROBE':'BLOCK'}));
  }
  function decision(gates,s){
    if(gates.some(g=>g.status==='BLOCK')) return 'BLOCKED_OR_PAUSED';
    if(gates.some(g=>g.status==='PROBE') || s.novelty>=.80) return 'PROBE_FIRST_DOSSIER_REQUIRED';
    if(state.phase==='asi') return 'ASI_READINESS_REVIEW_READY';
    if(state.phase==='rsi') return 'RSI_PROMOTION_REVIEW_READY';
    return 'PROOF_LOOP_REVIEW_READY';
  }
  function receipt(){
    const s=score(), gates=gateStatus(s), d=decision(gates,s);
    return {
      receipt_id:`GOALOS-V33-ASI-${state.scenario.toUpperCase()}-${String(state.runs).padStart(3,'0')}`,
      title:'Loop → RSI → ASI Superintelligence Governance Console synthetic receipt',
      generated_at:new Date().toISOString(),
      persona:roleData[state.role].label,
      scenario:scenarios[state.scenario].label,
      phase:state.phase,
      decision_state:d,
      proof_loop:flows.loop,
      rsi_pipeline:flows.rsi,
      asi_governance_horizon:flows.asi,
      gates:gates.map(g=>({gate:g.label,status:g.status,value:Number(g.value.toFixed(2)),reason:g.why})),
      boundary:{public_demo:true,achieved_asi_claim:false,external_ai_call:false,user_data:false,value_moved:0,release_authority:false},
      rule:'Search may guide allocation. Proof decides promotion. Human authority controls release.'
    };
  }
  function fmt(n){return Math.round(n*100)+'%'}
  function addLine(who, txt){
    const box=$('#consoleLines'); if(!box) return;
    const line=document.createElement('div'); line.className='line'; line.innerHTML=`<div class="who">${who}</div><div class="txt">${txt}</div>`; box.appendChild(line); box.scrollTop=box.scrollHeight;
  }
  function phaseText(){return state.phase==='loop'?'Proof Loop':state.phase==='rsi'?'RSI Kernel':'ASI Governance Horizon'}
  function render(){
    const s=score(), gates=gateStatus(s), rec=receipt(); state.receipt=rec;
    $$('#roleChoices .choice').forEach(b=>b.setAttribute('aria-pressed', b.dataset.role===state.role?'true':'false'));
    $$('#scenarioChoices .choice').forEach(b=>b.setAttribute('aria-pressed', b.dataset.scenario===state.scenario?'true':'false'));
    $('#personaLabel').textContent=roleData[state.role].label;
    $('#personaAsk').textContent=roleData[state.role].ask;
    $('#scenarioLabel').textContent=scenarios[state.scenario].label;
    $('#scenarioSummary').textContent=scenarios[state.scenario].summary;
    $('#phaseLabel').textContent=phaseText();
    $('#decisionState').textContent=rec.decision_state.replaceAll('_',' ');
    $('#runCount').textContent=String(state.runs);
    $('#shockLevel').textContent=String(state.shock);
    $('#noveltyMetric').textContent=fmt(s.novelty);
    $('#advantageMetric').textContent=fmt(s.advantage);
    $('#evidenceMetric').textContent=fmt(s.evidence);
    $('#persistenceMetric').textContent=fmt(Math.max(0,s.persistence));
    const activeFlow=state.phase==='loop'?flows.loop:state.phase==='rsi'?flows.rsi:flows.asi;
    $('#flowBoard').innerHTML=activeFlow.map((x,i)=>`<div class="step ${i<=Math.min(state.runs, activeFlow.length-1)?'done':''}"><b>${x}</b><small>${state.phase==='asi' && i===4?'default-safe':''}</small></div>`).join('');
    $('#gateBoard').innerHTML=gates.map(g=>`<div class="gate ${g.status.toLowerCase()}"><b>${g.label}</b><div class="status">${g.status}</div><small>${fmt(Math.max(0,Math.min(1,g.value)))}</small><p class="compact dim">${g.why}</p></div>`).join('');
    $('#receiptJson').textContent=JSON.stringify(rec,null,2);
    $('#councilAdvice').innerHTML = advice(rec,gates,s).map(x=>`<li>${x}</li>`).join('');
    $$('.state').forEach(el=>el.classList.toggle('active', el.dataset.phase===state.phase));
  }
  function advice(rec,gates,s){
    const out=[];
    if(s.novelty>=.80) out.push('High novelty triggers higher skepticism: probe-first, reproduce, stress-test, then dossier.');
    if(gates.some(g=>g.id==='risk'&&g.status!=='PASS')) out.push('Risk gate is not clean: pause promotion and require containment / prohibited-domain review.');
    if(gates.some(g=>g.id==='baseline'&&g.status!=='PASS')) out.push('Baseline advantage is not mature: compare against incumbent, nearest neighbor, and null baseline before promotion.');
    if(gates.some(g=>g.id==='persistence'&&g.status!=='PASS')) out.push('Persistence is insufficient: run fixed-seed reproduction and policy-shock stress tests.');
    if(rec.decision_state.includes('ASI')) out.push('ASI is a governance horizon here, not an achieved capability claim; require council stop authority and rollback.');
    if(out.length<3) out.push('Prepare a review-ready dossier with receipt, claims matrix, evidence index, and human authority note.');
    return out;
  }
  function init(){
    $$('#roleChoices .choice').forEach(b=>b.addEventListener('click',()=>{state.role=b.dataset.role; addLine('Console',`Persona set to ${roleData[state.role].label}. ${roleData[state.role].view}`); render();}));
    $$('#scenarioChoices .choice').forEach(b=>b.addEventListener('click',()=>{state.scenario=b.dataset.scenario; state.runs=0; state.shock=0; addLine('Console',`Scenario loaded: ${scenarios[state.scenario].label}. ${scenarios[state.scenario].summary}`); render();}));
    $$('[data-phase]').forEach(b=>b.addEventListener('click',()=>{state.phase=b.dataset.phase; state.runs++; addLine('Console',`Running ${phaseText()}: gates update deterministically from the selected scenario.`); render();}));
    $('#stressBtn')?.addEventListener('click',()=>{state.shock=(state.shock+1)%4; state.runs++; addLine('Red-team',`Policy shock level set to ${state.shock}. Persistence and risk gates recalculated.`); render();});
    $('#dossierBtn')?.addEventListener('click',()=>{state.phase='asi'; state.runs++; addLine('Dossier',`Move-37 → ASI dossier assembled: recognition, reproduction, stress tests, persistence gate, council note, rollback plan.`); render();});
    $('#copyBtn')?.addEventListener('click',async()=>{const txt=$('#receiptJson').textContent; try{await navigator.clipboard.writeText(txt); addLine('Console','Synthetic receipt copied to clipboard.');}catch{addLine('Console','Copy unavailable in this browser; receipt remains visible for manual copy.');}});
    $('#resetBtn')?.addEventListener('click',()=>{state.phase='loop'; state.runs=0; state.shock=0; $('#consoleLines').innerHTML=''; addLine('Console','Reset complete. Choose a role and scenario, then run the proof loop.'); render();});
    addLine('Console','Welcome. This is a browser-local AI-style governance console: no text input, no external model call, no wallet, no payment, no data capture.');
    addLine('Console','Start with the proof loop, escalate to RSI, then inspect ASI-readiness gates without claiming achieved ASI.');
    render();
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init); else init();
})();
