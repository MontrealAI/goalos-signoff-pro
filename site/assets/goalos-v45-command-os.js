
(function(){
  const topics = [{"id":"start","label":"Start / explain GoalOS","keywords":["start","new","understand","what is","guide","first","where"],"route":"goalos-universal-command-center.html","tier":"Orientation","confidence":92,"mission":"Fastest GoalOS orientation","summary":"Explain the product, proof loop, labs, 48 rails, and safest next click.","criteria":["Visitor understands what Signoff does.","Visitor sees the best first page.","Visitor can open the full page catalog."],"evidence":["Command answer","Recommended route","Public-safe boundary note"],"rails":["No chain dependency"]},{"id":"signoff","label":"AI work signoff","keywords":["client","report","research","strategy","accept","done","signoff","approve","review","deliverable","agency"],"route":"ai-research-strategy-signoff-console.html","tier":"Signoff Basic","confidence":90,"mission":"AI Research & Strategy Signoff","summary":"Define done, map evidence, check claims, collect review decision, and issue a Mission Receipt.","criteria":["Brief and success criteria are explicit.","Claims are mapped to evidence or marked uncertain.","Reviewer can accept, request changes, or reject."],"evidence":["Deliverable reference","Claim-to-source matrix","Reviewer checklist","Limitations and unresolved risks"],"rails":["AEPGoalOSCommitRegistry","AEPEvidenceDocketRegistry","ProofCardRegistry","ProofCredentialRegistry"]},{"id":"mission001","label":"Mission 001 benchmark","keywords":["mission 001","benchmark","replay","packet","reproduce","baseline","scoreboard","manifest"],"route":"mission-001.html","tier":"Benchmark-ready proof","confidence":88,"mission":"Mission 001 reproducibility packet","summary":"Open the packet with mission contract, environment, B0-B6 baselines, proof bundle, replay log, ledgers, validator report, scoreboard, and claims matrix.","criteria":["Packet files exist.","Replay path is public-safe.","Claims matrix is inspectable."],"evidence":["Manifest","Replay log","Validator report","Scoreboard"],"rails":["No chain dependency"]},{"id":"contracts","label":"48 contract rails","keywords":["48","contract","contracts","ethereum","mainnet","agialpha","token","rail","rails","verified","etherscan"],"route":"agialpha-48-contract-atlas.html","tier":"Protocol atlas","confidence":89,"mission":"AGIALPHA 48-contract rail exploration","summary":"Explain the modular protocol rails underneath Signoff without requiring wallet, payment, or production activation.","criteria":["Visitor sees contract families.","Visitor understands which rails map to which Signoff tier.","Visitor can open individual contract pages."],"evidence":["Contract atlas","Family map","Tier map","Release boundary"],"rails":["48 GoalOS-created Mainnet contracts","Canonical AGIALPHA reference"]},{"id":"settlement","label":"Proof-to-payment path","keywords":["settle","settlement","payment","pay","dao","grant","treasury","milestone","reward","escrow","bond","stake","reviewer"],"route":"proof-before-settlement-research-lab.html","tier":"Signoff & Settle path","confidence":84,"mission":"Proof-to-payment readiness","summary":"Keep the customer in Signoff, then map accepted work to optional protocol rails after activation, audit, and authorization gates.","criteria":["Brief defines payment conditions.","Evidence and review pass.","Dispute path is defined before payment logic."],"evidence":["Acceptance receipt","Proof bundle","Reviewer decision","Challenge boundary"],"rails":["JobRegistry","AEPRewardVault","TreasuryRouter","ReviewerBondRegistry","DisputeRegistry"]},{"id":"rsi","label":"RSI / ASI governance","keywords":["rsi","asi","superintelligence","move","breakthrough","move-37","governance","invention","dossier","omni","recursive"],"route":"loop-rsi-asi-superintelligence-mission-simulator-lab.html","tier":"Governance console","confidence":86,"mission":"Loop → RSI → ASI governance path","summary":"Route to the deterministic invention governance demos: target, emit, filter, atlas, test-plan, eval, insert, promote.","criteria":["Search does not become outcome authority.","Evidence and baseline gates remain mechanical.","Breakthrough candidates become dossiers, not narratives."],"evidence":["Dossier","Stress tests","Persistence gate","Council note"],"rails":["Architect / Validator Council","Append-only ledger","Rollback drill"]},{"id":"labs","label":"All public labs","keywords":["all labs","labs","demo","demos","public suite","everything","pages","catalog","site map"],"route":"public-demo-labs.html","tier":"Public suite","confidence":87,"mission":"Explore every public lab","summary":"Open the complete public demo suite and page catalog, preserving all existing pages.","criteria":["Every lab is findable.","Every route is navigable.","Visitor can return to the command center."],"evidence":["Route catalog","All-pages index","Floating command launcher"],"rails":["No chain dependency"]}];
  const defaultTopic = topics[0];
  let role = 'First-time visitor';
  let current = defaultTopic;
  let timer = null;
  const $ = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));
  function clean(s){return (s||'').toLowerCase().replace(/[^a-z0-9$-s]/g,' ');}  
  function match(text){
    const q = clean(text);
    if(!q.trim()) return defaultTopic;
    let best = defaultTopic, bestScore = 0;
    for(const topic of topics){
      let score = 0;
      for(const kw of topic.keywords){ if(q.includes(clean(kw))) score += kw.length + 8; }
      if(topic.id === 'contracts' && /(48|contract|mainnet|agialpha|etherscan)/.test(q)) score += 35;
      if(topic.id === 'rsi' && /(rsi|asi|moves*37|superintelligence|breakthrough|omni)/.test(q)) score += 35;
      if(topic.id === 'signoff' && /(done|accept|client|report|review|approve|deliverable)/.test(q)) score += 30;
      if(topic.id === 'settlement' && /(pay|payment|grant|dao|treasury|milestone|reward|settle)/.test(q)) score += 30;
      if(score > bestScore){ best = topic; bestScore = score; }
    }
    return Object.assign({}, best, {confidence: Math.min(98, Math.max(best.confidence, Math.round(62 + bestScore/2)))});
  }
  function receipt(topic, text){
    return {
      mission_id:'GOALOS-V45-'+new Date().toISOString().slice(0,10).replaceAll('-','')+'-'+topic.id.toUpperCase(),
      decision_state:'SYNTHETIC_PLAN_READY',
      role,
      requested_intent:(text||'').slice(0,240),
      mission_type:topic.mission,
      recommended_route:topic.route,
      confidence:topic.confidence,
      signoff_tier:topic.tier,
      criteria:topic.criteria,
      evidence_checklist:topic.evidence,
      protocol_rails:topic.rails,
      public_boundary:'browser_local_command_demo_no_uploads_no_wallets_no_payments_zero_value_moved'
    };
  }
  function render(topic, text){
    current = topic;
    const plan = $('[data-v45-plan]');
    if(!plan) return;
    const rec = receipt(topic, text);
    $('[data-v45-mission]').textContent = topic.mission;
    $('[data-v45-summary]').textContent = topic.summary;
    $('[data-v45-confidence]').textContent = topic.confidence + '%';
    $('[data-v45-tier]').textContent = topic.tier;
    $('[data-v45-route]').textContent = topic.route;
    $('[data-v45-route-link]').setAttribute('href', topic.route);
    $('[data-v45-route-link]').textContent = topic.route;
    $('[data-v45-criteria]').innerHTML = topic.criteria.map((x,i)=>'<li><strong>'+(i+1)+'.</strong> '+escapeHtml(x)+'</li>').join('');
    $('[data-v45-evidence]').innerHTML = topic.evidence.map((x,i)=>'<li><strong>'+(i+1)+'.</strong> '+escapeHtml(x)+'</li>').join('');
    $('[data-v45-rails]').innerHTML = topic.rails.map(x=>'<span class="chip">'+escapeHtml(x)+'</span>').join('');
    $('[data-v45-receipt]').textContent = JSON.stringify(rec,null,2);
    $('[data-v45-answer]').textContent = 'GoalOS read the request, selected '+topic.label+', and prepared the route '+topic.route+'.';
  }
  function escapeHtml(s){ return String(s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])); }
  function runFromBox(){ const box = $('[data-v45-box]'); const text = box ? box.textContent.trim() : ''; render(match(text), text); }
  function copyText(t){ if(navigator.clipboard && navigator.clipboard.writeText){ navigator.clipboard.writeText(t).catch(()=>{}); } }
  function routeNow(){ if(current && current.route) window.location.href = current.route; }
  function startAuto(){ clearInterval(timer); let n=5; const btn = $('[data-v45-auto]'); if(btn) btn.textContent='Auto-route in '+n+'s'; timer=setInterval(()=>{ n--; if(btn) btn.textContent=n>0?'Auto-route in '+n+'s':'Opening…'; if(n<=0){clearInterval(timer); routeNow();}},1000); }
  function bind(){
    $$('[data-v45-role]').forEach(btn=>btn.addEventListener('click',()=>{ role=btn.textContent.trim(); $$('[data-v45-role]').forEach(b=>b.classList.remove('active')); btn.classList.add('active'); runFromBox(); }));
    $$('[data-v45-example]').forEach(btn=>btn.addEventListener('click',()=>{ const box=$('[data-v45-box]'); if(box){box.textContent=btn.getAttribute('data-v45-example'); box.focus(); runFromBox();}}));
    const box = $('[data-v45-box]'); if(box){ box.addEventListener('keydown', e=>{ if(e.key==='Enter' && !e.shiftKey){ e.preventDefault(); runFromBox(); }}); box.addEventListener('input', runFromBox); }
    $('[data-v45-run]')?.addEventListener('click',runFromBox);
    $('[data-v45-open]')?.addEventListener('click',routeNow);
    $('[data-v45-auto]')?.addEventListener('click',startAuto);
    $('[data-v45-copy]')?.addEventListener('click',()=>copyText($('[data-v45-receipt]')?.textContent||''));
    $('[data-v45-copy-standard]')?.addEventListener('click',()=>copyText('Tell GoalOS what you want. GoalOS turns intent into mission, evidence, review, receipt, and route.'));
    $$('[data-goalos-v45-mini-toggle]').forEach(btn=>btn.addEventListener('click',()=>{ const panel=btn.parentElement.querySelector('.goalos-v45-mini'); if(panel) panel.hidden=!panel.hidden; }));
    $$('[data-goalos-v45-mini-run]').forEach(btn=>btn.addEventListener('click',()=>{ const root=btn.closest('.goalos-v45-mini'); const text=root?.querySelector('.goalos-v45-mini-box')?.textContent.trim()||''; const topic=match(text); const ans=root?.querySelector('.goalos-v45-mini-answer'); if(ans) ans.innerHTML='<strong>'+escapeHtml(topic.label)+'</strong><br><a href="'+topic.route+'">Open '+topic.route+'</a><p>'+escapeHtml(topic.summary)+'</p>'; }));
    window.addEventListener('keydown', e=>{ if((e.ctrlKey||e.metaKey) && e.key.toLowerCase()==='k'){ e.preventDefault(); window.location.href='goalos-universal-command-center.html'; }});
    runFromBox();
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', bind); else bind();
})();
