(function(){
  const script = document.currentScript || document.querySelector('script[src$="goalos-v39-navigator.js"]');
  const scriptUrl = script ? new URL(script.getAttribute('src'), location.href) : new URL('assets/goalos-v39-navigator.js', location.href);
  const siteBase = new URL(scriptUrl.href.replace(/assets\/goalos-v39-navigator\.js(?:\?.*)?$/, ''), location.href);
  const knowledgeUrl = new URL('goalos-v39-navigator-knowledge.json', siteBase);
  let knowledge = {topics:[],quickQuestions:['Where should I start?','Explain the 48 contracts','What is GoalOS Signoff?'],roles:[]};
  let autoRoute = true;
  const stopWords = new Set('the a an and or to of in on for with is are was were be been what how why where when should i me my our your this that do does did can could would show open explain tell about please goalos'.split(' '));
  const esc = s => String(s ?? '').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const routeUrl = route => new URL(route || 'goalos-v22-v39-command-center.html', siteBase).href;
  const tokenize = s => String(s||'').toLowerCase().replace(/0x[a-f0-9]{40}/g, m => ' '+m+' ').replace(/[^a-z0-9$]+/g,' ').split(/\s+/).filter(w=>w && !stopWords.has(w));
  function scoreTopic(q,t){
    const ql=String(q||'').toLowerCase();
    const keys = Array.isArray(t.keywords) ? t.keywords : String(t.keywords||'').split(/[, ]+/);
    let score=0;
    if(ql.includes(String(t.title||'').toLowerCase())) score+=12;
    if(t.route && ql.includes(String(t.route).replace(/\.html$/,'').replace(/[-/]/g,' '))) score+=8;
    for(const k of keys){
      const kl=String(k||'').toLowerCase(); if(!kl) continue;
      if(ql.includes(kl)) score += Math.min(14, Math.max(3, kl.length/3));
    }
    const qt=tokenize(q); const kt=tokenize(`${t.title} ${keys.join(' ')} ${t.answer||''}`);
    const kset=new Set(kt);
    for(const w of qt){ if(kset.has(w)) score+=2; }
    const address=(ql.match(/0x[a-f0-9]{40}/)||[])[0];
    if(address && JSON.stringify(t).toLowerCase().includes(address)) score+=60;
    return score;
  }
  function findAnswer(q){
    const question = String(q||'').trim();
    const topics = knowledge.topics || [];
    if(!question) return topics.find(t=>t.id==='start') || topics[0];
    const ranked = topics.map(t=>[scoreTopic(question,t),t]).sort((a,b)=>b[0]-a[0]);
    let top = ranked[0]?.[1]; let score = ranked[0]?.[0] || 0;
    if(score < 3){
      top = topics.find(t=>t.id==='start') || topics[0];
      return {...top, title:'I can route that', answer:'I can help with Signoff, Mission 001, public labs, the 48 Mainnet contracts, $AGIALPHA rails, Proof Before Settlement, RSI/ASI governance, and public-safe boundaries. The command center is the best next page for broad questions.'};
    }
    return top;
  }
  function addMessage(root, kind, html){
    const list=root.querySelector('[data-v39-messages]'); if(!list) return;
    const el=document.createElement('div'); el.className='v39-msg v39-msg-'+kind; el.innerHTML=html; list.appendChild(el); list.scrollTop=list.scrollHeight; return el;
  }
  function speak(root, q){
    addMessage(root,'user',esc(q));
    const topic=findAnswer(q);
    const url=routeUrl(topic.route);
    const same = new URL(location.href).pathname === new URL(url).pathname;
    const id='g39_'+Math.random().toString(36).slice(2);
    const answer=`<strong>${esc(topic.title)}</strong><br>${esc(topic.answer||'Open the recommended page to continue.')}<div class="v39-route-card"><span>Recommended page</span><a href="${esc(url)}" data-v39-open-route>${esc(topic.route||'Open')}</a>${same?'':'<span class="v39-countdown" id="'+id+'">Auto-opening in 4 seconds. <button type="button" class="v39-chip" data-v39-cancel="'+id+'">Stay here</button></span>'}</div>`;
    addMessage(root,'bot',answer);
    if(autoRoute && !same){
      let left=4; const el=document.getElementById(id); let cancelled=false;
      const timer=setInterval(()=>{ if(cancelled){clearInterval(timer);return;} left--; if(el) el.firstChild && (el.firstChild.textContent=`Auto-opening in ${left} second${left===1?'':'s'}. `); if(left<=0){clearInterval(timer); location.href=url;} },1000);
      root.querySelectorAll('[data-v39-cancel="'+id+'"]').forEach(b=>b.addEventListener('click',()=>{cancelled=true;if(el)el.textContent='Auto-route cancelled. Use the button when ready.';}));
    }
  }
  function buildInner(root){
    if(root.querySelector('[data-v39-messages]')) return;
    const label = root.getAttribute('data-v39-label') || 'GoalOS Navigator';
    const quick=(knowledge.quickQuestions||[]).slice(0,12).map(q=>`<button type="button" class="v39-chip" data-v39-question="${esc(q)}">${esc(q)}</button>`).join('');
    const id='v39q_'+Math.random().toString(36).slice(2);
    root.innerHTML=`<div class="v39-console-head"><div><span class="v39-live-dot"></span><strong>${esc(label)}</strong><small>Answer → route → inspect</small></div><button type="button" data-v39-toggle-auto class="v39-mini">Auto-route: on</button></div><div class="v39-messages" data-v39-messages></div><form class="v39-form" data-v39-form><label for="${id}">Ask a public website question</label><div><input id="${id}" name="question" autocomplete="off" maxlength="220" placeholder="Ask about Signoff, contracts, v35…"><button type="submit">Ask</button></div><small>Browser-local route matching. Do not enter personal, confidential, wallet, or payment information.</small></form><div class="v39-suggest"><strong>Try one:</strong>${quick}</div>`;
  }
  function initRoot(root){
    if(root.dataset.v39Ready) return; root.dataset.v39Ready='true';
    buildInner(root);
    const msgs=root.querySelector('[data-v39-messages]');
    if(msgs && !msgs.children.length){ addMessage(root,'bot','<strong>Ask me where to go.</strong><br>I can route you through Signoff, Mission 001, v22–v39 labs, the 48-contract atlas, $AGIALPHA rails, and RSI/ASI governance.'); }
    root.querySelectorAll('[data-v39-question]').forEach(btn=>btn.addEventListener('click',()=>speak(root,btn.getAttribute('data-v39-question'))));
    root.querySelectorAll('[data-v39-toggle-auto]').forEach(btn=>btn.addEventListener('click',()=>{autoRoute=!autoRoute;btn.textContent='Auto-route: '+(autoRoute?'on':'off');}));
    const form=root.querySelector('[data-v39-form]');
    if(form){ form.addEventListener('submit',e=>{e.preventDefault(); const input=form.querySelector('input[name="question"]'); const q=input?.value?.trim(); if(q){ input.value=''; speak(root,q); }}); }
  }
  function makeWidget(){
    if(document.querySelector('[data-v39-chat-root]') || document.querySelector('.goalos-v39-widget')) return;
    const launcher=document.createElement('button'); launcher.className='goalos-v39-launcher'; launcher.type='button'; launcher.innerHTML='Ask GoalOS'; launcher.setAttribute('aria-expanded','false');
    const quick=(knowledge.quickQuestions||[]).slice(0,8).map(q=>`<button type="button" class="v39-chip" data-v39-question="${esc(q)}">${esc(q)}</button>`).join('');
    const widget=document.createElement('aside'); widget.className='goalos-v39-widget'; widget.setAttribute('aria-label','Ask GoalOS navigator'); widget.innerHTML=`<div class="v39-console" data-v39-chat-root><div class="v39-console-head"><div><span class="v39-live-dot"></span><strong>Ask GoalOS</strong><small>Answer → route</small></div><button type="button" class="v39-close">Close</button></div><div class="v39-messages" data-v39-messages></div><form class="v39-form" data-v39-form><label class="v39-sr-only" for="v39-widget-question">Ask a website question</label><div><input id="v39-widget-question" name="question" autocomplete="off" maxlength="220" placeholder="Ask about Signoff, contracts, v35…"><button type="submit">Ask</button></div><small>Local answer routing. No external AI call.</small></form><div class="v39-suggest">${quick}</div></div>`;
    document.body.appendChild(launcher); document.body.appendChild(widget);
    launcher.addEventListener('click',()=>{const open=widget.getAttribute('data-open')==='true'; widget.setAttribute('data-open',open?'false':'true'); launcher.setAttribute('aria-expanded',open?'false':'true'); if(!open) setTimeout(()=>widget.querySelector('input')?.focus(),40);});
    widget.querySelector('.v39-close').addEventListener('click',()=>{widget.setAttribute('data-open','false'); launcher.setAttribute('aria-expanded','false');});
    initRoot(widget.querySelector('[data-v39-chat-root]'));
  }
  fetch(knowledgeUrl, {cache:'no-store'}).then(r=>r.ok?r.json():knowledge).then(k=>{knowledge=k||knowledge; document.querySelectorAll('[data-v39-chat-root]').forEach(initRoot); makeWidget(); document.addEventListener('click',e=>{const b=e.target.closest('[data-v39-question]'); if(b){const root=b.closest('[data-v39-chat-root]') || document.querySelector('[data-v39-chat-root]'); if(root && !b.closest('[data-v39-chat-root]')) speak(root,b.getAttribute('data-v39-question'));}});}).catch(()=>{document.querySelectorAll('[data-v39-chat-root]').forEach(initRoot); makeWidget();});
})();
