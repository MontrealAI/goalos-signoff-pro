
(() => {
  const data = [{"v":"v22","route":"action-graph-authority-lab.html","short":"Action Graph","title":"Action Graph & Human Authority","phase":"Proof loop","audience":"Executives, reviewers, compliance teams, AI delivery leads","promise":"Shows why GoalOS prepares action, but never treats output as authority."},{"v":"v23","route":"proof-carrying-artifact-lab.html","short":"Proof-Carrying Artifact","title":"Proof-Carrying Artifact & Evolution Ledger","phase":"Reusable capability","audience":"Product teams, AI platform teams, governance stewards","promise":"Lets reusable capability earn upgrade rights through evidence, rollback, and ledgers."},{"v":"v24","route":"independent-replay-lab.html","short":"Independent Replay","title":"Independent Replay & Claim Promotion","phase":"Replay and promotion","audience":"Research reviewers, auditors, grant evaluators, diligence teams","promise":"Shows that one run is not proof; replay makes a claim institutionally usable."},{"v":"v25","route":"proofzero-planning-lab.html","short":"ProofZero Planning","title":"ProofZero Planning & Evidence Reanalyze","phase":"Planning over proof states","audience":"AI operators, mission designers, evaluation teams","promise":"Plans over proof-relevant work states instead of persuasive futures."},{"v":"v26","route":"mission-foundry-lab.html","short":"Mission Foundry","title":"Proof-Gated Mission Foundry & Curriculum","phase":"Curriculum and compounding","audience":"Program owners, frontier evaluation teams, autonomous work architects","promise":"Turns accepted proof into the next harder mission and curriculum."},{"v":"v27","route":"process-evidence-lab.html","short":"Process Evidence","title":"Process-Resolved Evidence","phase":"Process evidence","audience":"Corporate reviewers, analysts, legal/compliance observers, AI assurance teams","promise":"Makes process traces and lineage reviewable, not just final outputs."},{"v":"v28","route":"blockchain-credibility-lab.html","short":"Blockchain Credibility","title":"Blockchain Credibility Standard","phase":"Blockchain credibility","audience":"Blockchain teams, DAOs, foundations, auditors, validators, investors, users","promise":"Shows why credible blockchain projects need proof packages before trust or settlement readiness."},{"v":"v29","route":"blockchain-proof-mandate-lab.html","short":"Proof Mandate","title":"Blockchain Proof Mandate & Due Diligence","phase":"Mandate and diligence","audience":"Users, DAO delegates, grant committees, treasury councils, auditors, investors, partners","promise":"Turns blockchain credibility into a requirement stakeholders can ask for, score, and enforce."},{"v":"v30","route":"proof-before-settlement-research-lab.html","short":"Proof Before Settlement","title":"Proof Before Settlement Research Standard","phase":"Institutional research","audience":"Foundations, DAOs, auditors, investors, exchanges, enterprises, partners","promise":"Turns the proof-to-settlement thesis into a paper, adoption blueprint, and due-diligence standard."},{"v":"v31","route":"executive-ai-proof-console.html","short":"Executive AI Console","title":"Executive AI Proof Console","phase":"Guided console","audience":"Executives, DAO delegates, auditors, investors, enterprises, AI operators","promise":"Makes GoalOS obvious to first-time visitors with a role-based, public-safe proof gate."},{"v":"v32","route":"from-loop-to-rsi-lab.html","short":"From Loop to RSI","title":"From Loop to RSI","phase":"Sovereign invention governance","audience":"Frontier labs, governance teams, sovereign strategy leads","promise":"Connects proof loops to deterministic invention governance and RSI readiness."},{"v":"v33","route":"loop-rsi-asi-superintelligence-lab.html","short":"Loop → RSI → ASI","title":"Loop → RSI → ASI Console","phase":"RSI to ASI boundary","audience":"Safety leads, architecture councils, frontier lab directors","promise":"Shows the superintelligence control boundary: promotion cannot self-authorize."},{"v":"v34","route":"loop-rsi-asi-superintelligence-control-tower-lab.html","short":"Control Tower","title":"ASI Superintelligence Control Tower","phase":"Control tower","audience":"Boards, councils, sovereign programs, assurance teams","promise":"Runs explanation modes, stress tests, rollback drills, council review, and Move‑37 dossier handling."},{"v":"v35","route":"loop-rsi-asi-superintelligence-mission-simulator-lab.html","short":"Mission Simulator","title":"ASI Mission Simulator","phase":"Mission simulator","audience":"First-time visitors, executives, reviewers, blockchain teams, RSI/ASI governance audiences","promise":"Lets visitors experience the complete Loop → RSI → ASI path in one guided, button-only interactive lab."}];
  const roleCopy = {
    visitor: ['First-time visitor', 'Start with the guided proof console, then open v35. The site explains GoalOS by letting you run gates, not by forcing a wall of text.'],
    blockchain: ['Blockchain / DAO', 'Begin with the proof mandate: require a proof package before trust, funding, governance, reputation, or settlement readiness.'],
    executive: ['Executive / board', 'Use the command center, the v30 research standard, and the v34 control tower to inspect decisions, proof debt, council review, and rollback.'],
    auditor: ['Auditor / reviewer', 'Inspect replay, process evidence, proof objects, and synthetic receipts before any claim matures.'],
    frontier: ['Frontier lab / RSI team', 'Follow v32 through v35: deterministic invention stages, Move-37 dossiers, persistence gates, council review, and ASI boundary control.'],
    public: ['Public reviewer', 'Use the route catalog and public artifacts to inspect the complete suite without giving data or connecting a wallet.']
  };
  const modeCopy = {
    start: ['Start here', 'Run the six proof gates, open the public lab hub, then enter the v35 mission simulator.'],
    settlement: ['Proof before settlement', 'Use v28-v30 to connect blockchain credibility, proof mandate, and institutional research.'],
    rsi: ['Loop → RSI', 'Use v32 to see how proof loops become deterministic invention governance.'],
    asi: ['RSI → ASI readiness', 'Use v33-v35 to test the superintelligence boundary: no self-authorization, council, rollback, and receipt.']
  };
  let state = {role:'visitor', mode:'start', progress:0};
  function $(s, r=document){return r.querySelector(s)}
  function $$ (s, r=document){return Array.from(r.querySelectorAll(s))}
  function render(){
    const role = roleCopy[state.role] || roleCopy.visitor;
    const mode = modeCopy[state.mode] || modeCopy.start;
    const title = $('#g35d-screen-title');
    const body = $('#g35d-screen-body');
    const route = $('#g35d-route');
    if(title) title.textContent = role[0] + ' · ' + mode[0];
    if(body) body.textContent = role[1] + ' ' + mode[1];
    const routeByMode = {start:'executive-ai-proof-console.html', settlement:'proof-before-settlement-research-lab.html', rsi:'from-loop-to-rsi-lab.html', asi:'loop-rsi-asi-superintelligence-mission-simulator-lab.html'};
    if(route) route.href = routeByMode[state.mode] || 'goalos-v22-v35-command-center.html';
    $$('.g35d-choice[data-role]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.role === state.role)));
    $$('.g35d-choice[data-mode]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.mode === state.mode)));
    $$('.g35d-step').forEach((el,i)=>el.classList.toggle('done', i <= state.progress));
    const prog = $('.g35d-progress i'); if(prog) prog.style.width = Math.min(100, 16 + state.progress * 14) + '%';
    const receipt = $('#g35d-receipt');
    if(receipt) receipt.textContent = JSON.stringify({receipt:'GOALOS-SYNTHETIC-V35', role:state.role, mode:state.mode, gates:['mission','evidence','replay','validation','authority','receipt'].slice(0,state.progress+1), valueMoved:0, publicSafe:true, note:'Deterministic browser-local demonstration only.'}, null, 2);
  }
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-role],[data-mode],[data-run-gate],[data-reset-gates],[data-copy-standard],[data-copy-receipt],[data-page-help]');
    if(!b) return;
    if(b.dataset.role){state.role=b.dataset.role; render();}
    if(b.dataset.mode){state.mode=b.dataset.mode; render();}
    if(b.dataset.runGate){state.progress=Math.min(5,state.progress+1); render();}
    if(b.dataset.resetGates){state.progress=0; render();}
    if(b.dataset.copyStandard){navigator.clipboard?.writeText('Blockchain proves the transaction. GoalOS proves the work. RSI governs invention. ASI must not self-authorize. No Proof. No Trust. No Settlement. No ungoverned superintelligence.'); b.textContent='Copied'; setTimeout(()=>b.textContent='Copy public standard',1200)}
    if(b.dataset.copyReceipt){const txt=$('#g35d-receipt')?.textContent || ''; navigator.clipboard?.writeText(txt); b.textContent='Receipt copied'; setTimeout(()=>b.textContent='Copy synthetic receipt',1200)}
    if(b.dataset.pageHelp){const panel=$('#g35d-page-help'); if(panel) panel.classList.toggle('open')}
  });
  if(!document.querySelector('.goalos-diamond-floating') && !document.body.classList.contains('g35d')){
    const rail=document.createElement('div'); rail.className='goalos-diamond-floating';
    rail.innerHTML='<a href="goalos-v22-v35-command-center.html">Command Center</a><a href="public-demo-labs.html">All labs</a><a href="loop-rsi-asi-superintelligence-mission-simulator-lab.html">v35</a><button type="button" data-page-help="true">Explain</button>';
    document.body.appendChild(rail);
    const panel=document.createElement('aside'); panel.id='g35d-page-help'; panel.className='g35d-page-help'; panel.innerHTML='<h3>What am I looking at?</h3><p>This is one page in the GoalOS Signoff Pro v22-v35 public suite. Start at the Command Center to choose a role, run proof gates, and open the best next lab. The site is static, public-safe, and moves zero value.</p><p><a class="g35d-btn primary" href="goalos-v22-v35-command-center.html">Open Command Center</a></p>'; document.body.appendChild(panel);
  }
  render();
})();
