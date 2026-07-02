
(() => {
  const state = {role:'first_timer', mode:'start', plan:null, timer:null};
  const $ = (id) => document.getElementById(id);
  const safeRoutes = new Set((window.GOALOS_V41_DATA?.routeAllowlist || []).map(String));
  const playbooks = window.GOALOS_V41_DATA?.playbooks || [];
  const contracts = window.GOALOS_V41_CONTRACTS || [];
  const examples = {
    first_timer: 'I am new. Show me the fastest way to understand GoalOS and what to click first.',
    ai_consultant: 'I delivered an AI research report to a client and need proof that it is ready to accept.',
    client_reviewer: 'A vendor says the AI-assisted work is done. Help me review it and decide whether to accept it.',
    dao_treasury: 'We need to release a DAO grant milestone only if the proof package passes review.',
    protocol_operator: 'Explain which 48 Mainnet contracts support verified signoff, reviewer bonds, disputes, and settlement.',
    rsi_governance: 'I want to govern a Move-37 / RSI breakthrough candidate with hard gates, replay, stress tests, and a dossier.'
  };
  function tokenize(text){return String(text||'').toLowerCase().replace(/[^a-z0-9$\-\s]/g,' ').split(/\s+/).filter(Boolean)}
  function scorePlaybook(text, p){const t=tokenize(text);let score=0;for(const k of p.keywords||[]){const kk=k.toLowerCase(); if(text.toLowerCase().includes(kk)) score+=kk.length>5?6:4; if(t.includes(kk)) score+=4;} if(p.id.includes(state.mode)) score+=2; return score;}
  function findContract(text){const lower=String(text||'').toLowerCase();return contracts.find(c => lower.includes(String(c.name||'').toLowerCase()) || lower.includes(String(c.address||'').toLowerCase()) || lower.includes(String(c.slug||'').toLowerCase()));}
  function bestPlan(text){
    const contract = findContract(text);
    let ranked = playbooks.map(p=>({...p,score:scorePlaybook(text,p)})).sort((a,b)=>b.score-a.score);
    let chosen = ranked[0] || playbooks[0];
    if(contract){ chosen = playbooks.find(p=>p.id==='contract_rails') || chosen; chosen = {...chosen, matchedContract: contract}; }
    if(!String(text||'').trim()) chosen = playbooks.find(p=>p.id==='ai_research_strategy_signoff') || chosen;
    const id = 'GOALOS-V41-' + new Date().toISOString().slice(0,10).replaceAll('-','') + '-' + Math.random().toString(36).slice(2,7).toUpperCase();
    const route = contract ? `contracts/${contract.slug}.html` : chosen.route;
    return {
      missionId:id,
      createdAt:new Date().toISOString(),
      role:state.role,
      mode:state.mode,
      userIntent:String(text||'').trim() || examples[state.role],
      playbook:chosen.id,
      title:chosen.title,
      summary:chosen.summary,
      tier:chosen.tier,
      decision:chosen.receiptDecision,
      route,
      confidence: Math.min(99, Math.max(68, 70 + Math.round((chosen.score||0)*2.4))),
      criteria:chosen.criteria||[],
      evidence:chosen.evidence||[],
      proofObjects:chosen.proofObjects||[],
      contracts: chosen.matchedContract ? [chosen.matchedContract.name, ...(chosen.contracts||[]).slice(0,5)] : (chosen.contracts||[]),
      matchedContract: chosen.matchedContract || null,
      steps:[
        ['Interpret intent','Convert the plain-language request into a mission type, role, and acceptance path.'],
        ['Define done','Create acceptance criteria, prohibited claims, review authority, and success conditions.'],
        ['Plan evidence','Generate the docket checklist, claim boundaries, risk ledger, and replay needs.'],
        ['Route review','Select the proper Signoff, proof, protocol, or RSI page and reviewer path.'],
        ['Issue receipt','Prepare a synthetic Mission Receipt and next action.']
      ]
    };
  }
  function escape(s){return String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]))}
  function routeIsSafe(route){return safeRoutes.has(route) || /^contracts\/[a-z0-9\-]+\.html$/.test(route)}
  function receipt(plan){return JSON.stringify({mission_id:plan.missionId,decision_state:plan.decision,role:plan.role,mode:plan.mode,playbook:plan.playbook,recommended_route:plan.route,confidence:plan.confidence,criteria:plan.criteria,evidence:plan.evidence,proof_objects:plan.proofObjects,protocol_rails:plan.contracts,public_safe:'local input only; no upload; no wallet; no payment; no external AI call by default',created_at:plan.createdAt},null,2)}
  function render(plan){
    state.plan=plan;
    const routeSafe = routeIsSafe(plan.route);
    $('result').innerHTML = `
      <div class="eyebrow">Autopilot mission plan</div>
      <h2>${escape(plan.title)}</h2>
      <p class="muted">${escape(plan.summary)}</p>
      <div class="status">
        <div class="metric"><strong>${plan.confidence}%</strong><span>route confidence</span></div>
        <div class="metric"><strong>${escape(plan.tier.split(' ')[0])}</strong><span>recommended tier</span></div>
        <div class="metric"><strong>${plan.criteria.length}</strong><span>acceptance gates</span></div>
        <div class="metric"><strong>${plan.contracts.length}</strong><span>protocol rails</span></div>
      </div>
      <div class="route-card"><strong>Recommended next page:</strong><br><a href="${routeSafe?escape(plan.route):'#'}">${escape(plan.route)}</a><br><span class="muted">${routeSafe?'Same-site route allowlisted.':'Route blocked by allowlist.'}</span></div>
      ${plan.matchedContract?`<div class="notice"><strong>Matched contract:</strong> ${escape(plan.matchedContract.name)} · ${escape(plan.matchedContract.address)} · ${escape(plan.matchedContract.family||'')}</div>`:''}
      <h3>GoalOS will take care of</h3>
      <div class="steps">${plan.steps.map((s,i)=>`<div class="step"><div class="num">${i+1}</div><div><strong>${escape(s[0])}</strong><br><span class="muted">${escape(s[1])}</span></div></div>`).join('')}</div>
      <h3>Acceptance criteria</h3><div class="list">${plan.criteria.map(x=>`<div>${escape(x)}</div>`).join('')}</div>
      <h3>Evidence checklist</h3><div class="list">${plan.evidence.map(x=>`<div>${escape(x)}</div>`).join('')}</div>
      <h3>Protocol rails</h3><div class="contracts">${plan.contracts.map(x=>`<div class="contract">${escape(x)}</div>`).join('')}</div>
      <h3>Synthetic Mission Receipt</h3><pre class="receipt" id="receiptText">${escape(receipt(plan))}</pre>
      <div class="button-row"><button class="primary" id="openRoute">Open recommended page</button><button id="copyReceipt">Copy receipt JSON</button><button id="downloadPlan">Download plan</button><button class="gold" id="autoRoute">Auto-route in 5s</button></div>
    `;
    $('openRoute').onclick=()=>{ if(routeSafe) location.href=plan.route; };
    $('copyReceipt').onclick=()=>copy(receipt(plan));
    $('downloadPlan').onclick=()=>download(plan.missionId+'.json', receipt(plan));
    $('autoRoute').onclick=()=>startRoute(plan.route, routeSafe);
  }
  function startRoute(route, safe){if(!safe)return; clearTimeout(state.timer); let n=5; const btn=$('autoRoute'); const tick=()=>{btn.textContent=`Routing in ${n}s · cancel`; if(n--<=0){location.href=route;return;} state.timer=setTimeout(tick,1000)}; btn.onclick=()=>{clearTimeout(state.timer); btn.textContent='Auto-route canceled';}; tick();}
  function copy(text){navigator.clipboard?.writeText(text).then(()=>toast('Copied.')).catch(()=>toast('Copy unavailable in this browser.'))}
  function download(name,text){const blob=new Blob([text],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}
  function toast(msg){const t=$('toast'); if(!t) return; t.textContent=msg; t.style.opacity='1'; setTimeout(()=>t.style.opacity='0',1500)}
  function run(){render(bestPlan($('intent').value));}
  function init(){
    document.querySelectorAll('[data-role]').forEach(b=>b.onclick=()=>{state.role=b.dataset.role;document.querySelectorAll('[data-role]').forEach(x=>x.classList.toggle('active',x===b)); if(!$('intent').value.trim()) $('intent').value=examples[state.role]||'';});
    document.querySelectorAll('[data-mode]').forEach(b=>b.onclick=()=>{state.mode=b.dataset.mode;document.querySelectorAll('[data-mode]').forEach(x=>x.classList.toggle('active',x===b));});
    document.querySelectorAll('[data-example]').forEach(b=>b.onclick=()=>{$('intent').value=b.dataset.example; run();});
    $('runAutopilot').onclick=run; $('intent').addEventListener('keydown',e=>{if((e.metaKey||e.ctrlKey)&&e.key==='Enter')run();});
    $('copyStandard').onclick=()=>copy('Tell GoalOS what you want. GoalOS turns it into a mission, proof plan, review route, protocol map, and receipt.');
    $('intent').value=examples.first_timer; run();
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init); else init();
})();
