#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = process.cwd();
const site = path.join(root, 'site');
const configPath = path.join(root, 'config', 'goalos-delight-demo-lab.json');
if (!fs.existsSync(configPath)) throw new Error('Missing config/goalos-delight-demo-lab.json');
const cfg = JSON.parse(fs.readFileSync(configPath, 'utf8'));
fs.mkdirSync(site, { recursive: true });
fs.mkdirSync(path.join(site, 'assets'), { recursive: true });
fs.mkdirSync(path.join(site, 'demo-data'), { recursive: true });

const now = new Date().toISOString();
const brand = 'GoalOS Signoff Pro';
const email = cfg.contactEmail || 'info@quebec.ai';
const pages = [];
const esc = (value) => String(value ?? '').replace(/[&<>"]/g, (ch) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[ch]));
const slug = (value) => String(value).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const hash = (text) => crypto.createHash('sha256').update(text).digest('hex');

function writeFile(rel, content) {
  const full = path.join(site, rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content);
  pages.push(rel);
}

function nav(active) {
  const items = [
    ['index.html','Institution'], ['start.html','Start'], ['demo-lab.html','Demo Lab'], ['proof-mission.html','Proof Mission'],
    ['evidence-docket-demo.html','Evidence Docket'], ['verify.html','Verifier'], ['examples.html','Examples'],
    ['agialpha.html','AGIALPHA'], ['no-user-data.html','No User Data']
  ];
  return `<nav class="topbar"><a class="brand" href="index.html"><span class="brand-mark">◎</span><span><b>${brand}</b><em>Proof-to-acceptance institution</em></span></a><div class="navlinks">${items.map(([href,label])=>`<a ${active===href?'class="active"':''} href="${href}">${label}</a>`).join('')}</div><a class="cta" href="request-access.html">Request proof mission</a></nav>`;
}

function shell({title, eyebrow, headline, sub, active, body, footer = true}) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${esc(title)} · GoalOS Signoff Pro</title>
<meta name="description" content="GoalOS Signoff Pro user demo lab: browser-local proof mission demos, Evidence Dockets, and Mission Receipt verification." />
<link rel="stylesheet" href="assets/delight-demo.css" />
</head>
<body data-page="${esc(active || '')}">
<canvas id="proof-field" aria-hidden="true"></canvas>
${nav(active)}
<main>
<section class="hero compact">
  <div class="hero-copy reveal">
    <p class="eyebrow">${esc(eyebrow)}</p>
    <h1>${headline}</h1>
    <p class="sub">${esc(sub)}</p>
    <div class="hero-actions"><a href="demo-lab.html" class="primary">Open demo lab</a><a href="evidence-docket-demo.html" class="secondary">Inspect sample docket</a></div>
  </div>
  <div class="orbit-card reveal delay"><div class="orbital-core"><span>✓</span></div><div class="orbit-step s1">Brief</div><div class="orbit-step s2">Evidence</div><div class="orbit-step s3">Review</div><div class="orbit-step s4">Receipt</div></div>
</section>
${body}
</main>
${footer ? `<footer><b>${brand}</b><span>Browser-local public-safe demos · no forms · no uploads · no cookies · no analytics · ${esc(email)}</span><a href="legal.html">Legal</a><a href="production-manifest.json">Manifest</a></footer>` : ''}
<script src="assets/delight-demo.js"></script>
</body>
</html>`;
}

const missionOptions = cfg.demos.map((d, i) => `<button class="mission-choice ${i===0?'selected':''}" data-mission="${esc(d.id)}"><b>${esc(d.shortTitle)}</b><span>${esc(d.audience)}</span></button>`).join('');
const missionData = JSON.stringify(cfg.demos);
writeFile('demo-data/public-safe-missions.json', JSON.stringify({ generatedAt: now, demos: cfg.demos }, null, 2));

writeFile('demo-lab.html', shell({
  title: 'Demo Lab', active: 'demo-lab.html', eyebrow: 'USER ACTIVATION LAB',
  headline: 'Run the proof experience without giving us data.',
  sub: 'Choose a public-safe sample mission, watch the acceptance gates move, download a demo Evidence Docket, and verify a Mission Receipt entirely in your browser.',
  body: `<section class="panel-grid two lab" id="demo-lab" data-missions='${esc(missionData)}'>
  <article class="panel tall reveal"><p class="eyebrow">01 · Choose sample</p><h2>Pick a proof mission.</h2><p>These demos use predefined public-safe examples. They do not ask for files, accounts, wallets, or private information.</p><div class="choice-list">${missionOptions}</div><button class="primary wide" id="launch-demo">Launch autonomous demo</button></article>
  <article class="panel tall reveal delay"><p class="eyebrow">02 · Watch gates</p><h2 id="demo-title">AI research report acceptance</h2><p id="demo-objective">Evaluate a public-safe AI research deliverable against evidence, freshness, limitation, and decision-readiness criteria.</p><div class="readiness"><svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="48"></circle><circle id="readiness-ring" cx="60" cy="60" r="48"></circle></svg><div><strong id="readiness-score">0</strong><span id="readiness-state">Awaiting run</span></div></div><div class="gate-list" id="gate-list"></div><div class="terminal" id="demo-terminal">System ready. Select a sample mission and launch the proof cycle.</div><div class="button-row"><button class="secondary" id="download-docket">Download demo docket</button><button class="secondary" id="download-receipt">Download demo receipt</button></div></article>
</section>
<section class="ribbon reveal"><span>Browser local</span><span>Sample data only</span><span>Evidence mapped</span><span>Human gate preserved</span><span>Receipt replayable</span></section>`
}));

function cards(demos) {
  return demos.map(d => `<article class="panel mission-card reveal"><p class="eyebrow">${esc(d.riskClass)}</p><h3>${esc(d.title)}</h3><p>${esc(d.objective)}</p><ul>${d.criteria.slice(0,4).map(x=>`<li>${esc(x)}</li>`).join('')}</ul><a class="secondary" href="demo-lab.html#${esc(d.id)}">Run sample</a></article>`).join('');
}
writeFile('examples.html', shell({
  title: 'Examples', active: 'examples.html', eyebrow: 'SEE YOURSELF IN THE PRODUCT',
  headline: 'Real-looking missions users can understand immediately.',
  sub: 'Concrete sample scenarios translate the architecture into everyday work: research, automation, procurement, milestones, and defensive readiness.',
  body: `<section class="card-grid">${cards(cfg.demos)}</section>`
}));

writeFile('evidence-docket-demo.html', shell({
  title: 'Evidence Docket Demo', active: 'evidence-docket-demo.html', eyebrow: 'PUBLIC-SAFE PROOF ROOM',
  headline: 'This is what proof looks like.',
  sub: 'A sample Evidence Docket shows the claim, evidence, risk, verifier report, decision state, receipt, and replay path without asking for user material.',
  body: `<section class="docket reveal" id="docket-demo" data-missions='${esc(missionData)}'>
  <aside class="tabs" role="tablist">
    ${['Manifest','Claims Matrix','Source Provenance','Evidence','Verifier Report','Risk Ledger','Decision State','Action Graph','Receipt','Replay Path'].map((t,i)=>`<button class="tab ${i===0?'active':''}" data-tab="${slug(t)}">${esc(t)}</button>`).join('')}
  </aside>
  <article class="tab-panel panel"><p class="eyebrow" id="docket-eyebrow">Manifest</p><h2 id="docket-title">AI research report acceptance</h2><div id="docket-content"></div><button class="primary" id="docket-download">Download sample docket JSON</button></article>
</section>`
}));

writeFile('verify.html', shell({
  title: 'Mission Receipt Verifier', active: 'verify.html', eyebrow: 'BROWSER-LOCAL RECEIPT REPLAY',
  headline: 'Verify the sample receipt without sending anything.',
  sub: 'The verifier runs in your browser with embedded public-safe demo receipts. Paste is optional; the default sample proves the workflow instantly.',
  body: `<section class="panel-grid two verifier" id="receipt-verifier" data-missions='${esc(missionData)}'>
  <article class="panel reveal"><p class="eyebrow">Sample receipt</p><h2>Receipt replay console</h2><p>Click verify to inspect a demo Mission Receipt. No server call is made; this public site has no verifier backend.</p><pre id="receipt-json"></pre><div class="button-row"><button class="primary" id="verify-sample">Verify sample receipt</button><button class="secondary" id="copy-sample">Copy JSON</button></div></article>
  <article class="panel reveal delay"><p class="eyebrow">Verification result</p><h2 id="verify-status">Awaiting verification</h2><div class="result-grid" id="verify-result"></div></article>
</section>`
}));

writeFile('start.html', shell({
  title: 'Start', active: 'start.html', eyebrow: 'START IN 60 SECONDS',
  headline: 'Start with one AI deliverable.',
  sub: 'Pick one serious AI-assisted work package, inspect a sample docket, run a demo receipt, then request a public-safe proof mission summary.',
  body: `<section class="steps reveal"><article><b>01</b><h3>Choose a proof mission type</h3><p>Research, automation, procurement, milestone, or defensive readiness.</p></article><article><b>02</b><h3>Inspect the demo docket</h3><p>See exactly how claims, evidence, risk, and receipts fit together.</p></article><article><b>03</b><h3>Run the autonomous demo</h3><p>Use sample data in the browser or run a GitHub Action that exports demo artifacts.</p></article><article><b>04</b><h3>Request a scoped review</h3><p>Send only a public-safe business summary to ${esc(email)}.</p></article></section><section class="panel spotlight"><h2>Pick your next action.</h2><div class="button-row"><a class="primary" href="demo-lab.html">Run demo lab</a><a class="secondary" href="proof-mission.html">Request proof mission</a><a class="secondary" href="verify.html">Verify receipt</a></div></section>`
}));

writeFile('autonomous-demos.html', shell({
  title: 'Autonomous Demos', active: 'demo-lab.html', eyebrow: 'GITHUB ACTIONS DEMO RUNNER',
  headline: 'Generate a full demo Proof Mission with one click.',
  sub: 'Repository users can run a workflow that creates a complete public-safe proof package and uploads it as a GitHub artifact.',
  body: `<section class="panel-grid two"><article class="panel"><p class="eyebrow">Nontechnical path</p><h2>Run from GitHub Actions.</h2><ol><li>Open the repository.</li><li>Click <b>Actions</b>.</li><li>Choose <b>Generate Delight Demo Proof Mission</b>.</li><li>Click <b>Run workflow</b>.</li><li>Download the uploaded demo artifact.</li></ol></article><article class="panel"><p class="eyebrow">Artifact output</p><h2>What the workflow creates</h2><ul><li>mission-contract.json</li><li>claims-matrix.json</li><li>evidence-docket.json</li><li>verifier-report.json</li><li>risk-ledger.json</li><li>decision-state.json</li><li>mission-receipt.json</li><li>public-report.html</li></ul></article></section>`
}));

writeFile('assets/delight-demo.css', `:root{--bg:#02070b;--panel:rgba(255,255,255,.08);--line:rgba(153,255,228,.25);--mint:#7fffd4;--cyan:#68d7ff;--gold:#ffe47a;--cream:#f5efe2;--muted:#aab7c2;--violet:#a58cff}*{box-sizing:border-box}body{margin:0;background:radial-gradient(circle at 72% 20%,rgba(71,225,206,.22),transparent 34%),radial-gradient(circle at 16% 78%,rgba(146,101,255,.12),transparent 30%),#02070b;color:var(--cream);font-family:Inter,ui-sans-serif,system-ui,-apple-system,Segoe UI,sans-serif;min-height:100vh}#proof-field{position:fixed;inset:0;z-index:-1;opacity:.8}.topbar{position:sticky;top:0;z-index:10;display:flex;align-items:center;gap:24px;padding:18px clamp(18px,4vw,54px);border-bottom:1px solid rgba(255,255,255,.1);background:rgba(2,7,11,.78);backdrop-filter:blur(18px)}.brand{display:flex;align-items:center;gap:12px;text-decoration:none;color:var(--cream);min-width:260px}.brand-mark{display:grid;place-items:center;width:42px;height:42px;border-radius:13px;border:1px solid var(--line);box-shadow:0 0 28px rgba(127,255,212,.38);color:var(--mint)}.brand b{display:block;letter-spacing:.18em;font-size:12px;text-transform:uppercase}.brand em{font-style:normal;display:block;color:var(--muted);font-size:10px;letter-spacing:.24em;text-transform:uppercase}.navlinks{display:flex;gap:8px;flex:1;justify-content:center;flex-wrap:wrap}.navlinks a,.cta,.primary,.secondary,.mission-choice,.tab{border:1px solid rgba(255,255,255,.14);border-radius:999px;padding:10px 15px;color:var(--cream);text-decoration:none;font-weight:800;font-size:13px;background:rgba(255,255,255,.06)}.navlinks a.active,.cta,.primary{background:linear-gradient(135deg,#edff9d,#65e8ff);color:#04100c;border-color:transparent;box-shadow:0 0 32px rgba(105,232,255,.25)}main{width:min(1180px,92vw);margin:0 auto}.hero{display:grid;grid-template-columns:minmax(0,1.08fr) minmax(320px,.92fr);gap:54px;align-items:center;min-height:72vh;padding:86px 0 42px}.hero.compact{min-height:62vh}.eyebrow{letter-spacing:.32em;color:var(--mint);font-weight:900;text-transform:uppercase;font-size:12px}.hero h1{font-size:clamp(48px,8vw,116px);line-height:.88;margin:.1em 0 .25em;letter-spacing:-.08em;text-wrap:balance}.sub{font-size:clamp(18px,2vw,24px);line-height:1.45;color:#d7e1e5;max-width:780px}.hero-actions,.button-row{display:flex;gap:12px;flex-wrap:wrap;margin-top:24px}.secondary{background:rgba(255,255,255,.07);color:var(--cream)}.primary,.secondary{display:inline-flex;align-items:center;justify-content:center}.orbit-card{min-height:420px;border:1px solid var(--line);border-radius:38px;background:linear-gradient(145deg,rgba(255,255,255,.13),rgba(255,255,255,.03));position:relative;box-shadow:inset 0 1px 0 rgba(255,255,255,.16),0 30px 90px rgba(0,0,0,.45);overflow:hidden}.orbital-core{position:absolute;inset:24% 24%;border-radius:50%;background:radial-gradient(circle,var(--mint),#2bd6ff 34%,rgba(11,24,31,.9) 58%);display:grid;place-items:center;box-shadow:0 0 90px rgba(127,255,212,.5)}.orbital-core:before{content:"";position:absolute;inset:-40px;border:1px dashed rgba(255,255,255,.24);border-radius:50%;animation:spin 18s linear infinite}.orbital-core span{font-size:58px;color:#00130e}.orbit-step{position:absolute;padding:12px 16px;border:1px solid var(--line);border-radius:16px;background:rgba(2,7,11,.7);font-weight:900}.s1{top:52px;left:54px}.s2{top:78px;right:48px}.s3{bottom:82px;left:42px}.s4{bottom:52px;right:54px}@keyframes spin{to{rotate:360deg}}.panel-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:24px;margin:40px 0}.card-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:22px;margin:40px 0 80px}.panel,.mission-card{border:1px solid rgba(255,255,255,.14);border-radius:28px;background:linear-gradient(145deg,rgba(255,255,255,.11),rgba(255,255,255,.04));padding:clamp(24px,3vw,42px);box-shadow:0 30px 80px rgba(0,0,0,.28);backdrop-filter:blur(18px)}.panel h2,.mission-card h3{font-size:clamp(30px,4vw,54px);line-height:.94;letter-spacing:-.06em;margin:.1em 0 .35em}.tall{min-height:560px}.choice-list{display:grid;gap:12px;margin:24px 0}.mission-choice{border-radius:18px;text-align:left;padding:16px 18px;display:grid;gap:4px;cursor:pointer}.mission-choice span{font-size:12px;color:var(--muted)}.mission-choice.selected{border-color:var(--mint);box-shadow:0 0 0 1px rgba(127,255,212,.25)}.wide{width:100%;border-radius:18px}.readiness{display:flex;align-items:center;gap:22px;margin:22px 0}.readiness svg{width:132px;height:132px;transform:rotate(-90deg)}.readiness circle{fill:none;stroke:rgba(255,255,255,.14);stroke-width:10}.readiness #readiness-ring{stroke:var(--mint);stroke-dasharray:301;stroke-dashoffset:301;filter:drop-shadow(0 0 14px rgba(127,255,212,.8));transition:stroke-dashoffset .9s ease}.readiness strong{font-size:54px}.readiness span{display:block;color:var(--muted);text-transform:uppercase;letter-spacing:.2em;font-size:11px}.gate-list{display:grid;gap:9px;margin:18px 0}.gate{display:flex;justify-content:space-between;border:1px solid rgba(127,255,212,.25);border-radius:15px;padding:12px 14px;background:rgba(127,255,212,.04)}.gate.done{background:rgba(127,255,212,.14);border-color:var(--mint)}.terminal,pre{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;background:#03090d;border:1px solid rgba(255,255,255,.12);border-radius:18px;padding:18px;color:#c7ffe7;line-height:1.6;white-space:pre-wrap;overflow:auto;max-height:260px}.ribbon,.steps{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:14px;margin:36px 0 90px}.ribbon span,.steps article{border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.05);border-radius:22px;padding:18px;font-weight:900}.steps b{color:var(--gold);font-size:24px}.steps h3{margin:.5em 0 .3em}.docket{display:grid;grid-template-columns:250px minmax(0,1fr);gap:20px;margin:40px 0 90px}.tabs{display:grid;gap:10px;align-self:start;position:sticky;top:98px}.tab{border-radius:14px;text-align:left}.tab.active{border-color:var(--mint);color:var(--mint)}.result-grid{display:grid;gap:12px}.result-grid div{display:flex;justify-content:space-between;border-bottom:1px solid rgba(255,255,255,.1);padding:12px 0}.spotlight{text-align:center;margin:40px 0 90px}.reveal{opacity:0;transform:translateY(18px);animation:reveal .8s ease forwards}.delay{animation-delay:.12s}@keyframes reveal{to{opacity:1;transform:none}}footer{display:flex;justify-content:space-between;gap:18px;flex-wrap:wrap;padding:28px clamp(18px,4vw,54px);border-top:1px solid rgba(255,255,255,.1);color:var(--muted);font-size:13px}footer a{color:var(--cream);text-decoration:none}@media(max-width:900px){.hero,.panel-grid,.docket{grid-template-columns:1fr}.topbar{position:relative}.brand{min-width:0}.navlinks{justify-content:flex-start}.hero{min-height:auto;padding-top:44px}.orbit-card{min-height:330px}.panel h2{font-size:36px}}`);

writeFile('assets/delight-demo.js', `(() => {const canvas=document.getElementById('proof-field');if(canvas){const ctx=canvas.getContext('2d');let w,h,pts=[];const resize=()=>{w=canvas.width=innerWidth*devicePixelRatio;h=canvas.height=innerHeight*devicePixelRatio;pts=Array.from({length:Math.min(120,Math.floor(innerWidth/12))},()=>({x:Math.random()*w,y:Math.random()*h,vx:(Math.random()-.5)*.18*devicePixelRatio,vy:(Math.random()-.5)*.18*devicePixelRatio,r:Math.random()*1.8+0.5}))};addEventListener('resize',resize,{passive:true});resize();function draw(){ctx.clearRect(0,0,w,h);ctx.fillStyle='rgba(127,255,212,.65)';ctx.strokeStyle='rgba(104,215,255,.13)';for(const p of pts){p.x=(p.x+p.vx+w)%w;p.y=(p.y+p.vy+h)%h;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill()}for(let i=0;i<pts.length;i++){for(let j=i+1;j<pts.length;j++){const a=pts[i],b=pts[j],dx=a.x-b.x,dy=a.y-b.y,d=Math.hypot(dx,dy);if(d<150*devicePixelRatio){ctx.globalAlpha=(1-d/(150*devicePixelRatio))*.5;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();ctx.globalAlpha=1}}}requestAnimationFrame(draw)}draw()}
const missions = (()=>{const node=document.querySelector('[data-missions]');if(!node) return [];try{return JSON.parse(node.dataset.missions)}catch{return []}})();
const gates=['Commission','Submit','Map','Review','Accept','Receipt'];let current=missions[0];
function receiptFor(m){return {receiptId:'GSP-DEMO-'+m.id.toUpperCase(),product:'GoalOS Signoff Pro',demo:true,decision:m.outcome,mission:m.title,score:m.score,evidence:m.sampleEvidence.map(e=>e.hash),publicBoundary:'public-safe sample only',issuer:'GoalOS demo generator',timestamp:new Date().toISOString(),contact:'info@quebec.ai'}}
function docketFor(m){return {manifest:{mission:m.title,objective:m.objective,riskClass:m.riskClass,generatedAt:new Date().toISOString()},claimsMatrix:m.criteria.map((c,i)=>({criterion:c,evidence:m.sampleEvidence[i%m.sampleEvidence.length].id,status:i<4?'supported':'requires human review'})),sourceProvenance:m.sampleEvidence,verifierReport:{questions:['Are the claims mapped?','Are risks visible?','Is human review preserved?'],verdict:m.outcome,score:m.score},riskLedger:{riskClass:m.riskClass,blocked:['private data','credential material','unsupported settlement claims'],humanGate:'required'},decisionState:{state:m.outcome,authority:'human reviewer',receipt:'issued only after acceptance'},actionGraph:['Prepare docket','Review claims','Accept / request changes / reject','Seal receipt'],receipt:receiptFor(m),replayPath:'Open demo-lab.html and select '+m.id}}
function download(name,data){const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(url)}
function selectMission(id){current=missions.find(m=>m.id===id)||missions[0];document.querySelectorAll('.mission-choice').forEach(b=>b.classList.toggle('selected',b.dataset.mission===current.id));const title=document.getElementById('demo-title');if(title) title.textContent=current.title;const obj=document.getElementById('demo-objective');if(obj) obj.textContent=current.objective;renderGates(0);setScore(0,'Awaiting run');const term=document.getElementById('demo-terminal');if(term) term.textContent='System ready. Sample mission loaded: '+current.shortTitle+'.'}
function renderGates(n){const el=document.getElementById('gate-list');if(!el)return;el.innerHTML=gates.map((g,i)=>'<div class="gate '+(i<n?'done':'')+'"><b>0'+(i+1)+' '+g+'</b><span>'+(i<n?'PASS':'pending')+'</span></div>').join('')}
function setScore(score,label){const ring=document.getElementById('readiness-ring');if(ring) ring.style.strokeDashoffset=301-(301*score/100);const s=document.getElementById('readiness-score');if(s)s.textContent=String(score);const l=document.getElementById('readiness-state');if(l)l.textContent=label}
document.querySelectorAll('.mission-choice').forEach(b=>b.addEventListener('click',()=>selectMission(b.dataset.mission)));
const launch=document.getElementById('launch-demo');if(launch) launch.addEventListener('click',()=>{let i=0;renderGates(0);setScore(0,'Running');const term=document.getElementById('demo-terminal');term.textContent='Mission contract committed.';const lines=['Evidence planes mapped.','Claims linked to criteria.','Verifier report assembled.','Risk ledger sealed.','Human authority preserved.','Mission Receipt ready for replay.'];const t=setInterval(()=>{i++;renderGates(i);setScore(Math.min(100,Math.round((i/gates.length)*current.score)),i===gates.length?'Ready for human decision':'Gate '+i+' passed');term.textContent+='\n· '+lines[i-1];if(i>=gates.length)clearInterval(t)},520)});
const dd=document.getElementById('download-docket');if(dd)dd.addEventListener('click',()=>download('goalos-demo-evidence-docket-'+current.id+'.json',docketFor(current)));const dr=document.getElementById('download-receipt');if(dr)dr.addEventListener('click',()=>download('goalos-demo-mission-receipt-'+current.id+'.json',receiptFor(current)));
const docket=document.getElementById('docket-demo');if(docket){const content=document.getElementById('docket-content');const title=document.getElementById('docket-title');const eyebrow=document.getElementById('docket-eyebrow');const data=docketFor(missions[0]);function renderTab(key,label){eyebrow.textContent=label;title.textContent=missions[0].title;const value=data[key]||data[key.replace(/-([a-z])/g,(_,c)=>c.toUpperCase())]||data.manifest;content.innerHTML='<pre>'+JSON.stringify(value,null,2)+'</pre>'}document.querySelectorAll('.tab').forEach(tab=>tab.addEventListener('click',()=>{document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));tab.classList.add('active');renderTab(tab.dataset.tab,tab.textContent)}));renderTab('manifest','Manifest');document.getElementById('docket-download')?.addEventListener('click',()=>download('goalos-sample-evidence-docket.json',data))}
const verifier=document.getElementById('receipt-verifier');if(verifier){const rec=receiptFor(missions[0]);document.getElementById('receipt-json').textContent=JSON.stringify(rec,null,2);document.getElementById('verify-sample').addEventListener('click',()=>{document.getElementById('verify-status').textContent='Receipt verified';document.getElementById('verify-result').innerHTML=Object.entries({Receipt:rec.receiptId,Decision:rec.decision,Issuer:rec.issuer,Timestamp:rec.timestamp,'Evidence hashes':rec.evidence.length,'Public boundary':rec.publicBoundary}).map(([k,v])=>'<div><b>'+k+'</b><span>'+v+'</span></div>').join('')});document.getElementById('copy-sample').addEventListener('click',()=>navigator.clipboard?.writeText(JSON.stringify(rec,null,2)))}})();`);

const manifest = {
  generatedAt: now,
  generator: 'scripts/build-delight-demo-lab-pages.mjs',
  version: cfg.version,
  contactEmail: email,
  zeroDataPosture: cfg.zeroDataPosture,
  pages,
  siteHash: hash(pages.sort().map(p => p + ':' + hash(fs.readFileSync(path.join(site, p)))).join('\n'))
};
writeFile('delight-demo-manifest.json', JSON.stringify(manifest, null, 2));

// Patch existing homepage if present, without relying on exact legacy markup.
const indexPath = path.join(site, 'index.html');
if (fs.existsSync(indexPath)) {
  let html = fs.readFileSync(indexPath, 'utf8');
  if (!html.includes('demo-lab.html')) {
    html = html.replace('</main>', `<section style="width:min(1180px,92vw);margin:60px auto;padding:32px;border:1px solid rgba(127,255,212,.25);border-radius:28px;background:rgba(255,255,255,.06);color:#f5efe2"><p style="letter-spacing:.28em;color:#7fffd4;font-weight:900;text-transform:uppercase;font-size:12px">Try it now</p><h2 style="font-size:clamp(36px,5vw,72px);line-height:.92;margin:.15em 0">Run a public-safe proof mission demo.</h2><p style="font-size:20px;max-width:760px;color:#c7d4dc">Open the Demo Lab, inspect a sample Evidence Docket, verify a Mission Receipt, and download the demo artifacts — no account, no upload, no tracking.</p><p><a href="demo-lab.html" style="display:inline-block;padding:13px 18px;border-radius:999px;background:linear-gradient(135deg,#edff9d,#65e8ff);color:#03100c;text-decoration:none;font-weight:900">Open Demo Lab</a> <a href="verify.html" style="display:inline-block;margin-left:8px;padding:13px 18px;border-radius:999px;border:1px solid rgba(255,255,255,.2);color:#f5efe2;text-decoration:none;font-weight:900">Verify sample receipt</a></p></section></main>`);
    fs.writeFileSync(indexPath, html);
  }
}

console.log(`GoalOS Delight Demo Lab generated ${pages.length} files`);
console.log(`Site hash ${manifest.siteHash}`);
