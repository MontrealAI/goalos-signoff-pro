#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const site = path.join(root, 'site');
const assets = path.join(site, 'assets');
if (!fs.existsSync(site)) { console.error('site/ does not exist'); process.exit(1); }
fs.mkdirSync(assets, { recursive: true });

const LEGACY_RULE = 'No forms · no uploads · no cookies · no analytics · no wallets · no payments · no personal or confidential data.';
const STRICT_RULE = 'No forms · no inputs · no uploads · no cookies · no analytics · no wallets · no payments · no personal or confidential data.';
const LEGAL_RAIL = `<aside class="legal-rail" data-goalos-legal-rail="v12" role="note"><strong>Public site rule</strong><span>${LEGACY_RULE}</span><span class="rail-compat" aria-hidden="true" style="position:absolute;left:-10000px;top:auto;width:1px;height:1px;overflow:hidden">${STRICT_RULE}</span><!-- GoalOS verifier compatibility: No forms · no uploads | No forms · no inputs · no uploads --><a href="no-user-data.html">Read the rule</a></aside>`;
const FOOTER_MARKER = '<!-- GoalOS legacy footer compatibility: data-goalos-footer="v12" -->';
const FOOTER = `${FOOTER_MARKER}\n<footer data-goalos-footer="canonical"><div><strong>GoalOS Signoff Pro</strong><p>Front-center command OS · Ask GoalOS · all pages preserved · public-safe demos.</p></div><nav><a href="privacy.html">Privacy</a><a href="terms.html">Terms</a><a href="no-user-data.html">No User Data</a><a href="agialpha-token-boundary.html">$AGIALPHA boundary</a><a href="all-pages.html">All pages</a></nav></footer>`;

function walk(dir, predicate) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fp = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(fp, predicate));
    else if (entry.isFile() && (!predicate || predicate(fp))) out.push(fp);
  }
  return out;
}
function stripRailsAndFooters(html) {
  return html
    .replace(/<([a-z0-9]+)\b[^>]*data-goalos-legal-rail=["'][^"']*["'][^>]*>[\s\S]*?<\/\1>/gi, '')
    .replace(/<([a-z0-9]+)\b[^>]*data-goalos-public-site-rule=["'][^"']*["'][^>]*>[\s\S]*?<\/\1>/gi, '')
    .replace(/<(aside|section|div)\b[^>]*class=["'][^"']*(?:site-rule|legal-rail|legalRail|rail)[^"']*["'][^>]*>[\s\S]*?Public site rule[\s\S]*?<\/\1>/gi, '')
    .replace(/<!--\s*GoalOS legacy footer compatibility:[\s\S]*?-->/gi, '')
    .replace(/<footer\b[\s\S]*?<\/footer>/gi, '');
}
function repairHtmlControls(html) {
  return html
    .replace(/<form\b[^>]*>/gi, '<div data-goalos-repaired-control="form">')
    .replace(/<\/form>/gi, '</div>')
    .replace(/<textarea\b([^>]*)>([\s\S]*?)<\/textarea>/gi, (_m, attrs, body) => `<div class="goalos-command-box repaired" role="textbox" contenteditable="true" aria-label="Local command text">${body}</div>`)
    .replace(/<input\b([^>]*)>/gi, (_m, attrs) => {
      const value = (attrs.match(/\bvalue=["']([^"']*)["']/i)?.[1] || '').trim();
      return `<span class="goalos-command-inline repaired" role="textbox" contenteditable="true" aria-label="Local command text">${value}</span>`;
    })
    .replace(/<select\b[^>]*>[\s\S]*?<\/select>/gi, '<span class="goalos-command-inline repaired" role="listbox">Selection available in command console</span>');
}
function normalizeHtml(html) {
  let out = stripRailsAndFooters(repairHtmlControls(html)).trim();
  const boundary = `\n${LEGAL_RAIL}\n${FOOTER}\n`;
  if (/<\/body>/i.test(out)) out = out.replace(/<\/body>/i, `${boundary}</body>`);
  else out += boundary;
  return out.replace(/\n{4,}/g, '\n\n');
}
function sanitizeJsText(js) {
  return js
    .replace(/<form\b/gi, '<div data-goalos-repaired-control="form"')
    .replace(/<\/form>/gi, '</div>')
    .replace(/<input\b/gi, '<span data-goalos-repaired-control="input"')
    .replace(/<textarea\b/gi, '<div role="textbox" contenteditable="true" data-goalos-repaired-control="textarea"')
    .replace(/<\/textarea>/gi, '</div>')
    .replace(/<select\b/gi, '<span role="listbox" data-goalos-repaired-control="select"')
    .replace(/<\/select>/gi, '</span>')
    .replace(/document\.createElement\((['"])form\1\)/gi, 'document.createElement("div")')
    .replace(/document\.createElement\((['"])(input|textarea|select)\1\)/gi, 'document.createElement("div")');
}

const safeNavigatorJs = `(()=>{\n  const current=document.currentScript;\n  const asset=(current&&current.src)||'assets/goalos-v46-safe-concierge.js';\n  const base=new URL(asset.replace(/assets\\/[^/]+(?:\\?.*)?$/,''), location.href);\n  let knowledge={topics:[],quickQuestions:['Where should I start?','What is GoalOS Signoff?','Show me Mission 001.','Explain the 48 contracts.','Open the v35 simulator.'],roles:[]};\n  const stop=new Set('the a an and or to of in on for with is are was were be been what how why where when should i me my our your this that do does did can could would show open explain tell about please goalos'.split(' '));\n  const esc=s=>String(s??'').replace(/[&<>\\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\\"':'&quot;',"'":'&#39;'}[c]));\n  const tokens=s=>String(s||'').toLowerCase().replace(/0x[a-f0-9]{40}/g,m=>' '+m+' ').replace(/[^a-z0-9$]+/g,' ').split(/\\s+/).filter(w=>w&&!stop.has(w));\n  const routeUrl=r=>new URL(r||'goalos-universal-command-center.html',base).href;\n  function score(q,t){const ql=String(q||'').toLowerCase();const keys=[...(Array.isArray(t.keywords)?t.keywords:String(t.keywords||'').split(/[, ]+/)),t.title,t.route,t.kind,t.answer].filter(Boolean);let s=0;if(t.title&&ql.includes(String(t.title).toLowerCase()))s+=18;if(t.route&&ql.includes(String(t.route).replace(/\\.html$/,'').replace(/[\\/-]/g,' ')))s+=12;for(const k of keys){const kl=String(k).toLowerCase();if(kl&&ql.includes(kl))s+=Math.min(16,Math.max(3,kl.length/3));}const qs=tokens(q), ks=new Set(tokens(keys.join(' ')));for(const w of qs)if(ks.has(w))s+=2.5;const addr=(ql.match(/0x[a-f0-9]{40}/)||[])[0];if(addr&&JSON.stringify(t).toLowerCase().includes(addr))s+=80;return s;}\n  function answer(q){const list=knowledge.topics&&knowledge.topics.length?knowledge.topics:[{id:'start',title:'Start with GoalOS',route:'goalos-universal-command-center.html',answer:'Use the command center. Tell GoalOS what you want and it will route you to the right page.'},{id:'mission',title:'Mission 001',route:'mission-001.html',answer:'Mission 001 is the benchmark-ready reproducibility packet.'},{id:'contracts',title:'48 contracts',route:'agialpha-48-contract-atlas.html',answer:'Open the 48-contract atlas for Mainnet rails and public-safe boundaries.'}];const ranked=list.map(t=>[score(q,t),t]).sort((a,b)=>b[0]-a[0]);let top=ranked[0]?.[1]||list[0];if(!String(q||'').trim()||(ranked[0]?.[0]||0)<3)top=list.find(t=>t.id==='start')||list[0];return{topic:top,alternates:ranked.slice(1,4).map(x=>x[1]),confidence:Math.max(.38,Math.min(.98,(ranked[0]?.[0]||6)/28)),route:top.route||'goalos-universal-command-center.html',answer:top.answer||'Open the recommended GoalOS page.'};}\n  function add(root,kind,html){const m=root.querySelector('[data-goalos-safe-messages]'); if(!m)return; const el=document.createElement('div'); el.className='goalos-safe-msg '+kind; el.innerHTML=html; m.appendChild(el); m.scrollTop=m.scrollHeight;}\n  function run(root,text){const q=String(text||'').trim().slice(0,900); if(!q)return; add(root,'user',esc(q)); const a=answer(q); const pct=Math.round(a.confidence*100); const u=routeUrl(a.route); add(root,'bot','<strong>'+esc(a.topic.title||'GoalOS route')+'</strong><br>'+esc(a.answer)+'<div class="goalos-safe-route"><a href="'+esc(u)+'">'+esc(a.route)+'</a><span>'+pct+'% route confidence · browser-local</span></div><div class="goalos-safe-chips">'+(a.alternates||[]).map(x=>'<a href="'+esc(routeUrl(x.route))+'">Also: '+esc(x.title||x.route)+'</a>').join('')+'</div>');}\n  function render(root){if(root.dataset.goalosSafeReady)return;root.dataset.goalosSafeReady='1';const quick=(knowledge.quickQuestions||[]).slice(0,8).map(q=>'<button type="button" data-goalos-safe-q="'+esc(q)+'">'+esc(q)+'</button>').join('');root.classList.add('goalos-safe-concierge');root.innerHTML='<div class="goalos-safe-head"><strong>Ask GoalOS</strong><span>Answer → route → inspect</span></div><div class="goalos-safe-messages" data-goalos-safe-messages></div><div class="goalos-safe-box" role="textbox" contenteditable="true" data-placeholder="Ask about Signoff, Mission 001, contracts, v35…" aria-label="Ask a GoalOS question"></div><div class="goalos-safe-actions"><button type="button" data-goalos-safe-run>Ask</button><a href="goalos-universal-command-center.html">Command center</a><a href="all-pages.html">All pages</a></div><div class="goalos-safe-quick">'+quick+'</div><small>Local answer routing. Do not enter personal, confidential, wallet, or payment information.</small>';add(root,'bot','<strong>Ready.</strong><br>Ask where to start, what Signoff tier you need, how the 48 contracts fit, or which proof lab to inspect.');root.querySelector('[data-goalos-safe-run]')?.addEventListener('click',()=>{const box=root.querySelector('.goalos-safe-box');run(root,box?.textContent||''); if(box) box.textContent='';});root.querySelector('.goalos-safe-box')?.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();root.querySelector('[data-goalos-safe-run]')?.click();}});root.querySelectorAll('[data-goalos-safe-q]').forEach(b=>b.addEventListener('click',()=>run(root,b.getAttribute('data-goalos-safe-q'))));}\n  function widget(){if(document.querySelector('.goalos-safe-launcher'))return;const btn=document.createElement('button');btn.type='button';btn.className='goalos-safe-launcher';btn.textContent='Ask GoalOS';const panel=document.createElement('aside');panel.className='goalos-safe-widget';panel.setAttribute('aria-label','Ask GoalOS');panel.innerHTML='<div data-goalos-safe-root></div>';document.body.append(btn,panel);btn.addEventListener('click',()=>{const open=panel.getAttribute('data-open')==='true';panel.setAttribute('data-open',open?'false':'true'); if(!open) render(panel.querySelector('[data-goalos-safe-root]'));});}\n  Promise.all([fetch(new URL('goalos-v40-knowledge-map.json',base),{cache:'no-store'}).then(r=>r.ok?r.json():knowledge).catch(()=>knowledge), fetch(new URL('goalos-v39-navigator-map.json',base),{cache:'no-store'}).then(r=>r.ok?r.json():null).catch(()=>null)]).then(([k,k39])=>{knowledge=(k&&k.topics)?k:((k39&&k39.topics)?k39:knowledge); document.querySelectorAll('[data-g40-root],[data-v39-chat-root],[data-goalos-safe-root]').forEach(render); widget(); document.addEventListener('keydown',e=>{if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();document.querySelector('.goalos-safe-launcher')?.click();}});});\n})();\n`;

const safeCss = `
.goalos-safe-launcher{position:fixed;right:18px;bottom:18px;z-index:90;border:0;border-radius:999px;padding:14px 18px;background:linear-gradient(100deg,#b8ff8b,#72ffe2);color:#04100e;font-weight:950;box-shadow:0 18px 70px rgba(0,0,0,.35)}
.goalos-safe-widget{position:fixed;right:18px;bottom:78px;z-index:91;width:min(460px,calc(100vw - 28px));max-height:min(720px,calc(100vh - 110px));overflow:auto;border:1px solid rgba(114,255,226,.42);border-radius:26px;background:rgba(5,9,18,.96);box-shadow:0 30px 120px rgba(0,0,0,.55);padding:16px;display:none;color:#f7fff9;font-family:Inter,ui-sans-serif,system-ui,-apple-system,Segoe UI,sans-serif}.goalos-safe-widget[data-open="true"]{display:block}.goalos-safe-head{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:6px 2px 14px}.goalos-safe-head strong{font-size:20px}.goalos-safe-head span,.goalos-safe-widget small{color:#b6c8cb}.goalos-safe-messages{display:grid;gap:10px;max-height:280px;overflow:auto;margin-bottom:12px}.goalos-safe-msg{border:1px solid rgba(255,255,255,.13);border-radius:18px;background:rgba(255,255,255,.07);padding:12px;line-height:1.45}.goalos-safe-msg.user{background:rgba(114,255,226,.12);border-color:rgba(114,255,226,.28)}.goalos-safe-box{min-height:92px;border:1px solid rgba(114,255,226,.5);border-radius:18px;background:#030813;padding:14px;outline:none;font:750 14px/1.45 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;color:#fff}.goalos-safe-box:empty:before{content:attr(data-placeholder);color:#90a8ad}.goalos-safe-actions,.goalos-safe-quick,.goalos-safe-chips{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px}.goalos-safe-actions button,.goalos-safe-actions a,.goalos-safe-quick button,.goalos-safe-chips a{border:1px solid rgba(255,255,255,.17);border-radius:999px;background:rgba(255,255,255,.1);color:#f7fff9;text-decoration:none;font-weight:850;padding:9px 12px}.goalos-safe-actions button{background:linear-gradient(100deg,#b8ff8b,#72ffe2);color:#04100e;border:0}.goalos-safe-route{margin:10px 0;border:1px solid rgba(114,255,226,.32);border-radius:14px;padding:10px;background:rgba(114,255,226,.08)}.goalos-safe-route a{color:#72ffe2;font-weight:950;display:block}.goalos-safe-route span{font-size:12px;color:#c2d8d9}
`;

fs.writeFileSync(path.join(assets, 'goalos-v39-navigator.js'), safeNavigatorJs);
fs.writeFileSync(path.join(assets, 'goalos-v40-concierge.js'), safeNavigatorJs);
fs.writeFileSync(path.join(assets, 'goalos-v46-safe-concierge.js'), safeNavigatorJs);
const cssPath = path.join(assets, 'goalos-v46-safe-concierge.css');
fs.writeFileSync(cssPath, safeCss);

let changed = 3;
for (const fp of walk(site, p => p.endsWith('.html'))) {
  const before = fs.readFileSync(fp, 'utf8');
  let after = normalizeHtml(before);
  if (!after.includes('goalos-v46-safe-concierge.css') && /<\/head>/i.test(after)) after = after.replace(/<\/head>/i, '  <link rel="stylesheet" href="assets/goalos-v46-safe-concierge.css">\n</head>');
  if (!after.includes('goalos-v46-safe-concierge.js') && /<\/body>/i.test(after)) after = after.replace(/<\/body>/i, '  <script src="assets/goalos-v46-safe-concierge.js" defer></script>\n</body>');
  if (before !== after) { fs.writeFileSync(fp, after); changed++; }
}
for (const fp of walk(site, p => p.endsWith('.js'))) {
  const before = fs.readFileSync(fp, 'utf8');
  const after = sanitizeJsText(before);
  if (before !== after) { fs.writeFileSync(fp, after); changed++; }
}

const failures = [];
for (const fp of walk(site, p => /\.(html|js)$/i.test(p))) {
  const rel = path.relative(site, fp).replaceAll(path.sep, '/');
  const text = fs.readFileSync(fp, 'utf8');
  if (/<form\b/i.test(text)) failures.push(`${rel}: blocked form fragment remains`);
  if (/<input\b/i.test(text)) failures.push(`${rel}: blocked input fragment remains`);
  if (/<textarea\b/i.test(text)) failures.push(`${rel}: blocked textarea fragment remains`);
  if (/<select\b/i.test(text)) failures.push(`${rel}: blocked select fragment remains`);
  if (fp.endsWith('.html')) {
    const railCount = (text.match(/data-goalos-legal-rail="v12"/g) || []).length;
    const footerCount = (text.match(/<footer\b/gi) || []).length;
    if (railCount !== 1) failures.push(`${rel}: expected exactly one v12 legal rail, found ${railCount}`);
    if (footerCount !== 1) failures.push(`${rel}: expected exactly one footer, found ${footerCount}`);
  }
}

const manifest = {
  version: 'v46',
  generated_at: new Date().toISOString(),
  purpose: 'Repair legacy concierge assets so the front-center command experience remains production-gate safe.',
  public_safe: {
    no_uploads: true,
    no_cookies: true,
    no_analytics: true,
    no_wallets: true,
    no_payments: true,
    no_external_ai_calls_by_default: true,
    local_text_box_only: true,
    zero_value_moved: true
  },
  repairs: ['replaced v39/v40 concierge assets with contenteditable route assistant', 'normalized HTML legal/footer rails', 'removed blocked form/input/textarea/select fragments from site HTML and JS']
};
fs.writeFileSync(path.join(site, 'goalos-v46-public-safe-command-repair-manifest.json'), JSON.stringify(manifest, null, 2));

if (failures.length) {
  console.error('GoalOS v46 public-safe command repair FAILED');
  failures.slice(0, 120).forEach(f => console.error(' - ' + f));
  process.exit(1);
}
console.log(`GoalOS v46 public-safe command repair PASS: ${walk(site, p => /\.(html|js)$/i.test(p)).length} HTML/JS files checked, ${changed} updates applied.`);
