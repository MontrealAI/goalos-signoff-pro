(() => {
  const pages = [
    {v:'v30',title:'Proof Before Settlement',href:'proof-before-settlement-research-lab.html',tag:'Research standard',why:'Turns blockchain credibility into a formal proof-before-settlement paper and adoption artifact.'},
    {v:'v31',title:'Executive AI Proof Console',href:'executive-ai-proof-console.html',tag:'Guided onboarding',why:'Explains GoalOS to first-time visitors through role-based proof gates.'},
    {v:'v32',title:'From Loop to RSI',href:'from-loop-to-rsi-lab.html',tag:'Sovereign invention governance',why:'Shows how proof loops become deterministic invention governance.'},
    {v:'v33',title:'Loop → RSI → ASI',href:'loop-rsi-asi-superintelligence-lab.html',tag:'ASI-readiness escalation',why:'Demonstrates why superintelligence-scale promotion cannot self-authorize.'},
    {v:'v34',title:'Superintelligence Control Tower',href:'loop-rsi-asi-superintelligence-control-tower-lab.html',tag:'Complete control tower',why:'Runs gates, shock tests, rollback, council review, dossier, and receipt.'}
  ];
  const standards = [
    'Blockchain proves the transaction. GoalOS proves the work.',
    'No Proof. No Trust. No Settlement.',
    'RSI governs invention. ASI must not self-authorize.',
    'Search may guide allocation. Proof decides promotion.'
  ];
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => Array.from(root.querySelectorAll(s));
  function ready(fn){document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', fn) : fn();}
  function pageKey(){const p=(location.pathname.split('/').pop() || 'index.html').toLowerCase();return pages.find(x=>p===x.href || p.includes(x.href.replace('.html',''))) || pages.find(x=>document.title.toLowerCase().includes(x.v)) || pages[0];}
  function copy(text){if(navigator.clipboard){navigator.clipboard.writeText(text).catch(()=>{});} announce('Copied the public standard to your clipboard.');}
  function announce(msg){let live=$('#gx-premium-live'); if(!live){return;} live.innerHTML = '<b>Console:</b> ' + msg;}
  function setProgress(n){const bar=$('#gx-premium-progress span'); if(bar) bar.style.width=Math.max(10,Math.min(100,n))+'%';}
  function injectNavigator(){
    if($('#gx-premium-launch')) return;
    document.body.classList.add('gx-premium-ready');
    const wrap=document.createElement('div');wrap.className='gx-premium-shell';wrap.innerHTML=`<div class="gx-floating-launch"><button id="gx-premium-launch" class="gx-launch-btn" type="button" aria-controls="gx-premium-panel" aria-expanded="false">✦ Guided console</button></div><section id="gx-premium-panel" class="gx-panel" aria-label="GoalOS guided experience console"><div class="gx-panel-inner"><div class="gx-panel-top"><div><span class="gx-kicker">Experience navigator</span><h3>GoalOS v30–v34</h3><p>Choose the next proof lab, run a quick tour, or copy the core public standard.</p></div><button class="gx-close" id="gx-premium-close" aria-label="Close navigator">×</button></div><div class="gx-progress" id="gx-premium-progress" aria-hidden="true"><span></span></div><div class="gx-nav-list">${pages.map(p=>`<a class="gx-nav-link" href="${p.href}"><span><b>${p.v} · ${p.title}</b><small>${p.tag}</small></span><span>→</span></a>`).join('')}<a class="gx-nav-link" href="v30-v34-premium-experience.html"><span><b>Premium experience hub</b><small>Start here if you want the full guided path.</small></span><span>→</span></a></div><div class="gx-stage-row" aria-label="GoalOS maturity path"><span class="gx-stage active">Proof</span><span class="gx-stage">Settlement</span><span class="gx-stage">RSI</span><span class="gx-stage">ASI gates</span><span class="gx-stage">Receipt</span></div><div class="gx-premium-actions"><button class="gx-btn primary" type="button" data-gx-action="explain">Explain this page</button><button class="gx-btn cyan" type="button" data-gx-action="tour">Run 3-step tour</button><button class="gx-btn gold" type="button" data-gx-action="copy">Copy standard</button></div><div class="gx-live" id="gx-premium-live"><b>Console:</b> Ready. This demo is browser-local and uses no external AI call.</div></div></section>`;
    document.body.appendChild(wrap);
    const panel=$('#gx-premium-panel'), btn=$('#gx-premium-launch');
    btn.addEventListener('click',()=>{const open=panel.classList.toggle('open');btn.setAttribute('aria-expanded',open?'true':'false'); if(open) announce('Pick any v30–v34 experience. The recommended path is v31 → v30 → v32 → v33 → v34.');});
    $('#gx-premium-close').addEventListener('click',()=>{panel.classList.remove('open');btn.setAttribute('aria-expanded','false');});
    document.addEventListener('keydown',e=>{if(e.key==='Escape'){panel.classList.remove('open');btn.setAttribute('aria-expanded','false');}});
    $$('[data-gx-action]').forEach(b=>b.addEventListener('click',()=>handleAction(b.dataset.gxAction)));
  }
  function handleAction(action){
    const p=pageKey();
    if(action==='copy') return copy(standards.join('\n'));
    if(action==='explain') {setProgress(83); return announce(`${p.v} explains ${p.title}: ${p.why} The visitor should leave knowing the next decision, the required proof package, and the public-safe boundary.`);}
    if(action==='tour') return runTour();
  }
  function runTour(){
    const candidates=[$('h1'), $('[id*="console"]'), $('[id*="dossier"]'), $('[id*="sources"]'), $('main')].filter(Boolean);
    let i=0; setProgress(25); announce('Tour started. Step 1: the headline states the decision standard.');
    function step(){candidates.forEach(x=>x.classList.remove('gx-highlight')); if(!candidates[i]){setProgress(100); announce('Tour complete. Next: open the hub, then run the Control Tower.'); return;} candidates[i].classList.add('gx-highlight'); candidates[i].scrollIntoView({behavior:'smooth',block:'center'}); announce(`Tour step ${i+1}/${candidates.length}: inspect the highlighted area.`); setProgress(30+(i*14)); i++; setTimeout(step,1400);} step();
  }
  function enhancePageSpotlight(){
    if($('#gx-premium-spotlight') || location.pathname.endsWith('v30-v34-premium-experience.html')) return;
    const p=pageKey();
    const html=`<section id="gx-premium-spotlight" class="gx-premium-shell gx-premium-spotlight" aria-label="GoalOS v30 to v34 premium experience"><div class="gx-premium-card"><div class="gx-premium-grid"><div><span class="gx-kicker">Premium guided experience</span><h2>${p.v} is part of the <span class="gx-gradient">Proof → RSI → ASI</span> path.</h2><p>${p.why}</p><div class="gx-premium-actions"><a class="gx-btn primary" href="v30-v34-premium-experience.html">Open the premium hub</a><button class="gx-btn cyan" type="button" data-gx-action="explain">Explain this page</button><button class="gx-btn gold" type="button" data-gx-action="tour">Run guided tour</button></div></div><div class="gx-pill-grid"><div class="gx-pill"><b>Self-explanatory</b><span>Every page now has a visible “what am I looking at?” layer.</span></div><div class="gx-pill"><b>Actionable</b><span>Visitors are guided to the next lab, next gate, and next proof object.</span></div><div class="gx-pill"><b>Public-safe</b><span>No inputs, uploads, wallets, cookies, analytics, payments, or external AI calls.</span></div><div class="gx-pill"><b>Institutional</b><span>Research, proofs, councils, gates, rollback, dossiers, and receipts.</span></div></div></div></div></section>`;
    const header=document.querySelector('header');
    if(header) header.insertAdjacentHTML('afterend', html); else document.body.insertAdjacentHTML('afterbegin', html);
    $$('[data-gx-action]').forEach(b=>{if(!b.dataset.gxBound){b.dataset.gxBound='1';b.addEventListener('click',()=>handleAction(b.dataset.gxAction));}});
  }
  ready(()=>{injectNavigator(); enhancePageSpotlight();});
})();