
(() => {
  const tiers = {
    basic: {name:'Signoff Basic', decision:'ACCEPTANCE_READY', score:84, user:'Define done, submit evidence, review, issue receipt.', protocol:'Evidence Docket + Mission Receipt. No chain required.', agi:'No AGIALPHA required.', gates:['Brief frozen','Evidence mapped','Checks complete','Reviewer decision','Signed receipt'], next:'Open browser beta'},
    verified: {name:'Signoff Verified', decision:'ANCHOR_READY', score:78, user:'Hash receipt and evidence commitments. Customer sees “Verified by GoalOS”.', protocol:'Commit registry, artifact registry, evidence docket, proof bundle, proof card, credential.', agi:'Sponsored protocol fee only after gated release.', gates:['Receipt hash','Docket hash','Proof bundle','Credential','No funds moved'], next:'Inspect protocol ladder'},
    secured: {name:'Signoff Secured', decision:'BONDING_GATED', score:64, user:'Accountable review with challenge window and reputation.', protocol:'ReviewerBond, evaluator staking, attestation, replay, falsification, slashing court.', agi:'Reviewer/evaluator/challenge bonds after audit and authorization.', gates:['Reviewer bond','Challenge window','Replay packet','Slashing path','Appeal path'], next:'Read boundary'},
    settle: {name:'Signoff & Settle', decision:'FUTURE_PRODUCTION_GATED', score:41, user:'Payment releases only after accepted proof.', protocol:'JobRegistry, reward vault, treasury router, dispute/appeal, chronicle.', agi:'Settlement, rewards, stake, challenge, treasury routing.', gates:['Escrow authorization','Accepted proof','Challenge clear','Reward release','Chronicle update'], next:'Do not enable public funds yet'}
  };
  const roles = {
    consultant:'AI consultant / small agency', client:'Client reviewer', dao:'DAO / treasury council', enterprise:'Enterprise buyer', protocol:'Protocol operator', auditor:'Independent reviewer'
  };
  let tier='basic', role='consultant', gate=0;
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];
  function draw(){
    const t=tiers[tier];
    $$('.tier-btn').forEach(b=>b.classList.toggle('active', b.dataset.tier===tier));
    $$('.role-btn').forEach(b=>b.classList.toggle('active', b.dataset.role===role));
    const out=$('#v36ConsoleOutput'); if(!out) return;
    out.innerHTML = `<p class="eyebrow">${roles[role]} · ${t.name}</p><h2>${t.name}</h2><p class="lead">${t.user}</p><div class="grid two"><div class="card"><h3>User sees</h3><p>${t.user}</p></div><div class="card"><h3>Protocol underneath</h3><p>${t.protocol}</p></div><div class="card"><h3>$AGIALPHA role</h3><p>${t.agi}</p></div><div class="card"><h3>Decision</h3><p><b>${t.decision}</b><br>Readiness ${t.score}/100</p></div></div><div class="phase">${t.gates.map((g,i)=>`<span class="${i<=gate?'done':''}">${String(i+1).padStart(2,'0')} ${g}</span>`).join('')}</div><p><button class="btn primary" id="v36NextGate">Run next gate</button> <button class="btn" id="v36Reset">Reset</button> <button class="btn gold" id="v36Copy">Copy receipt</button></p><pre class="receipt" id="v36Receipt">${JSON.stringify({goalos:'Signoff Pro', lab:'v36 Product Core & Protocol Ladder', role:roles[role], tier:t.name, decision:t.decision, readiness:t.score, publicSafe:true, valueMoved:0, gates:t.gates.slice(0,gate+1), boundary:'No public funds, wallets, uploads, external AI calls, or production settlement in this demo.'},null,2)}</pre>`;
    $('#v36NextGate')?.addEventListener('click',()=>{gate=(gate+1)%t.gates.length; draw();});
    $('#v36Reset')?.addEventListener('click',()=>{gate=0; draw();});
    $('#v36Copy')?.addEventListener('click',()=>navigator.clipboard?.writeText($('#v36Receipt').textContent));
  }
  document.addEventListener('click', e=>{const tb=e.target.closest('[data-tier]'); if(tb){tier=tb.dataset.tier; gate=0; draw();} const rb=e.target.closest('[data-role]'); if(rb){role=rb.dataset.role; gate=0; draw();}});
  document.addEventListener('DOMContentLoaded', draw);
})();
