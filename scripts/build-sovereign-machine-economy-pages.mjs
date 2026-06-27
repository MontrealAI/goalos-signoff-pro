import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const ROOT = process.cwd();
const SITE = path.join(ROOT, 'site');
const CONFIG_PATH = path.join(ROOT, 'config', 'sovereign-machine-economy.json');
const ASSET_DIR = path.join(SITE, 'assets');
const GENERATED_AT = new Date().toISOString();

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function html(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function write(file, content) {
  ensureDir(path.dirname(file));
  fs.writeFileSync(file, content);
}

function sha256(file) {
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
}

function listFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return listFiles(full);
    return [full];
  });
}

const config = readJson(CONFIG_PATH);
ensureDir(SITE);
ensureDir(ASSET_DIR);

const css = String.raw`
:root{--bg:#03070c;--bg2:#06131a;--ink:#f6f1e6;--muted:#b9c4ca;--line:rgba(255,255,255,.13);--line2:rgba(130,255,220,.3);--mint:#74ffd9;--cyan:#69d7ff;--gold:#ffe68a;--violet:#b8a1ff;--card:rgba(255,255,255,.055);--glass:rgba(8,18,27,.72);--shadow:0 30px 110px rgba(0,0,0,.5);--max:1180px}*{box-sizing:border-box}html{scroll-behavior:smooth;background:var(--bg)}body{margin:0;color:var(--ink);font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;background:radial-gradient(circle at 70% 10%,rgba(105,215,255,.17),transparent 26rem),radial-gradient(circle at 20% 24%,rgba(116,255,217,.15),transparent 30rem),linear-gradient(135deg,#020409 0%,#05141a 46%,#080713 100%);min-height:100vh;overflow-x:hidden}body:before{content:"";position:fixed;inset:0;pointer-events:none;background:linear-gradient(rgba(255,255,255,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.028) 1px,transparent 1px);background-size:74px 74px;mask-image:linear-gradient(to bottom,rgba(0,0,0,.75),rgba(0,0,0,.1));z-index:-2}body:after{content:"";position:fixed;inset:auto -10% -20% -10%;height:42vh;pointer-events:none;background:radial-gradient(ellipse at center,rgba(96,255,220,.14),transparent 70%);filter:blur(28px);z-index:-1}.mesh{position:fixed;inset:0;z-index:-1;opacity:.68}.topbar{position:sticky;top:0;z-index:10;border-bottom:1px solid var(--line);background:rgba(2,6,10,.78);backdrop-filter:blur(22px)}.nav{max-width:var(--max);margin:auto;display:flex;align-items:center;justify-content:space-between;padding:18px 22px}.brand{display:flex;gap:12px;align-items:center;text-decoration:none;color:var(--ink)}.mark{width:38px;height:38px;border-radius:14px;background:radial-gradient(circle at 45% 45%,var(--mint),#133d50 48%,#071015 70%);border:1px solid rgba(255,255,255,.25);box-shadow:0 0 34px rgba(116,255,217,.32);display:grid;place-items:center}.mark:after{content:"";width:11px;height:11px;border-radius:50%;background:var(--ink);box-shadow:0 0 18px var(--mint)}.brand small{display:block;letter-spacing:.28em;font-size:10px;color:#dfe7ea}.brand b{display:block;letter-spacing:.18em;font-size:12px}.links{display:flex;align-items:center;gap:10px}.links a{color:#eef5f4;text-decoration:none;font-size:12px;font-weight:800;padding:10px 13px;border-radius:999px}.links a:hover,.links a.active{background:rgba(255,255,255,.1);box-shadow:inset 0 0 0 1px rgba(255,255,255,.12)}.cta{background:linear-gradient(135deg,var(--gold),var(--mint),var(--cyan));color:#061013!important;box-shadow:0 0 28px rgba(116,255,217,.24)}main{position:relative}.section{max-width:var(--max);margin:auto;padding:110px 22px}.hero{min-height:calc(100vh - 76px);display:grid;grid-template-columns:minmax(0,1.02fr) minmax(380px,.98fr);gap:58px;align-items:center}.eyebrow{display:inline-flex;align-items:center;gap:12px;color:var(--mint);letter-spacing:.32em;text-transform:uppercase;font-size:11px;font-weight:900}.eyebrow:before{content:"";width:36px;height:1px;background:var(--mint);box-shadow:0 0 14px var(--mint)}h1,h2{margin:0;letter-spacing:-.075em;line-height:.88;font-weight:950}h1{font-size:clamp(58px,9.2vw,132px);max-width:760px}h2{font-size:clamp(48px,6.8vw,100px);max-width:900px}.accent{font-family:Georgia,serif;font-style:italic;font-weight:500;background:linear-gradient(90deg,var(--gold),var(--mint),var(--cyan),var(--violet));-webkit-background-clip:text;background-clip:text;color:transparent;letter-spacing:-.045em}.lead{font-size:clamp(18px,2.2vw,27px);line-height:1.48;color:#e7eef0;max-width:690px;margin:28px 0 0}.sub{color:var(--muted);font-size:16px;line-height:1.75;max-width:720px}.buttons{display:flex;gap:14px;flex-wrap:wrap;margin-top:34px}.button{display:inline-flex;align-items:center;justify-content:center;gap:10px;padding:15px 20px;border-radius:999px;text-decoration:none;color:var(--ink);font-weight:900;border:1px solid rgba(255,255,255,.18);background:rgba(255,255,255,.08)}.button.primary{color:#061014;background:linear-gradient(135deg,var(--gold),var(--mint),var(--cyan));box-shadow:0 18px 60px rgba(116,255,217,.22)}.button:hover{transform:translateY(-1px)}.stats{display:grid;grid-template-columns:repeat(4,minmax(120px,1fr));gap:12px;margin-top:36px;max-width:720px}.stat{border:1px solid var(--line);background:rgba(255,255,255,.055);border-radius:18px;padding:18px}.stat b{font-size:34px;color:var(--gold)}.stat span{display:block;color:var(--muted);letter-spacing:.14em;text-transform:uppercase;font-size:10px;font-weight:900;margin-top:8px}.console{position:relative;border:1px solid rgba(150,255,228,.28);background:linear-gradient(145deg,rgba(255,255,255,.12),rgba(255,255,255,.035));border-radius:34px;box-shadow:var(--shadow),inset 0 0 60px rgba(116,255,217,.06);padding:22px;overflow:hidden;min-height:560px}.console:before{content:"";position:absolute;inset:-40%;background:conic-gradient(from 90deg,transparent,rgba(116,255,217,.18),transparent,rgba(255,230,138,.14),transparent);animation:spin 18s linear infinite}.console>*{position:relative}.panel{border:1px solid rgba(255,255,255,.14);background:rgba(1,6,10,.64);border-radius:24px;padding:22px;backdrop-filter:blur(16px)}.panel-head{display:flex;justify-content:space-between;align-items:center;color:var(--mint);letter-spacing:.18em;text-transform:uppercase;font-weight:950;font-size:11px}.core{height:235px;display:grid;place-items:center;position:relative}.core:before,.core:after{content:"";position:absolute;border-radius:50%;border:1px solid rgba(116,255,217,.35)}.core:before{width:210px;height:210px;box-shadow:0 0 70px rgba(116,255,217,.2);animation:pulse 4s ease-in-out infinite}.core:after{width:150px;height:150px;border-color:rgba(255,230,138,.38);animation:spin 24s linear infinite}.orb{width:112px;height:112px;border-radius:50%;display:grid;place-items:center;background:radial-gradient(circle,var(--gold),var(--mint) 45%,#0a2a38 72%);color:#071015;font-size:48px;font-family:Georgia,serif;box-shadow:0 0 80px rgba(116,255,217,.55)}.steps{display:grid;gap:12px}.step{display:flex;align-items:center;gap:14px;border:1px solid rgba(116,255,217,.26);background:rgba(255,255,255,.052);border-radius:15px;padding:14px}.step b{color:var(--gold);font-size:13px}.step span{font-weight:900}.step small{display:block;color:var(--muted);margin-top:3px}.trust-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-top:14px}.trust-tile{border:1px solid rgba(255,230,138,.28);border-radius:16px;padding:14px;text-align:center;background:rgba(255,255,255,.055);font-size:11px;text-transform:uppercase;letter-spacing:.08em;font-weight:900}.flow{display:grid;grid-template-columns:repeat(6,1fr);gap:12px;margin:46px 0}.flow-card{min-height:180px;border:1px solid var(--line);background:var(--card);border-radius:28px;padding:22px;position:relative;overflow:hidden}.flow-card:before{content:attr(data-n);display:block;color:var(--gold);font-weight:950;font-size:22px;margin-bottom:32px}.flow-card h3{font-size:22px;margin:0 0 12px}.flow-card p{font-size:14px;line-height:1.55;color:var(--muted);margin:0}.split{display:grid;grid-template-columns:1fr 1fr;gap:24px}.card{border:1px solid var(--line);background:rgba(255,255,255,.055);border-radius:30px;padding:30px;box-shadow:0 30px 80px rgba(0,0,0,.25)}.card h3{font-size:28px;margin:0 0 14px}.card p,.card li{color:var(--muted);line-height:1.65}.matrix{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}.matrix .cell{border:1px solid var(--line);border-radius:22px;background:rgba(255,255,255,.052);padding:20px;min-height:150px}.cell b{color:var(--mint);display:block;margin-bottom:8px}.rail{border:1px solid var(--line2);border-radius:34px;padding:28px;background:linear-gradient(135deg,rgba(116,255,217,.07),rgba(255,230,138,.035));display:grid;grid-template-columns:repeat(3,1fr);gap:14px}.rail div{padding:18px;border-radius:22px;background:rgba(0,0,0,.22);border:1px solid rgba(255,255,255,.1)}.rail b{color:var(--gold);font-size:24px}.footer{border-top:1px solid var(--line);padding:34px 22px;color:var(--muted)}.footer-inner{max-width:var(--max);margin:auto;display:flex;justify-content:space-between;gap:20px;flex-wrap:wrap}.pill{display:inline-flex;border:1px solid var(--line);border-radius:999px;padding:8px 12px;background:rgba(255,255,255,.07);font-size:12px;font-weight:800;color:#eaf7f2}.console-row{display:grid;grid-template-columns:240px 1fr;gap:16px}.mini-list{display:grid;gap:10px}.mini-list div{border:1px solid var(--line);border-radius:14px;padding:12px;background:rgba(255,255,255,.04)}.terminal{font-family:"SFMono-Regular",ui-monospace,monospace;border:1px solid rgba(116,255,217,.24);background:rgba(0,0,0,.42);border-radius:20px;padding:18px;color:#d7fff2;line-height:1.8;min-height:210px}.no-overflow{overflow-wrap:anywhere}@keyframes spin{to{transform:rotate(360deg)}}@keyframes pulse{50%{transform:scale(1.06);opacity:.72}}@media(max-width:940px){.hero,.split,.console-row{grid-template-columns:1fr}.flow{grid-template-columns:repeat(2,1fr)}.stats,.trust-grid,.matrix,.rail{grid-template-columns:1fr 1fr}.links{display:none}.console{min-height:auto}h1{font-size:clamp(56px,18vw,92px)}}@media(max-width:620px){.section{padding:72px 18px}.flow,.stats,.trust-grid,.matrix,.rail{grid-template-columns:1fr}h1{font-size:54px}.console{padding:14px;border-radius:24px}.panel{padding:16px}.footer-inner{display:block}.brand small{letter-spacing:.18em}}
`;

const js = String.raw`
(() => {
  const canvas = document.querySelector('.mesh');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let w = 0, h = 0, points = [];
  const colors = ['#74ffd9', '#69d7ff', '#ffe68a', '#b8a1ff'];
  function resize(){w=canvas.width=innerWidth*devicePixelRatio;h=canvas.height=innerHeight*devicePixelRatio;canvas.style.width=innerWidth+'px';canvas.style.height=innerHeight+'px';points=Array.from({length:Math.min(90,Math.max(38,Math.floor(innerWidth/16)))},(_,i)=>({x:Math.random()*w,y:Math.random()*h,vx:(Math.random()-.5)*.24*devicePixelRatio,vy:(Math.random()-.5)*.24*devicePixelRatio,c:colors[i%colors.length]}));}
  function tick(){ctx.clearRect(0,0,w,h);ctx.globalCompositeOperation='lighter';for(const p of points){if(!reduce){p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>w)p.vx*=-1;if(p.y<0||p.y>h)p.vy*=-1;}ctx.fillStyle=p.c;ctx.globalAlpha=.85;ctx.beginPath();ctx.arc(p.x,p.y,1.4*devicePixelRatio,0,Math.PI*2);ctx.fill()}for(let i=0;i<points.length;i++){for(let j=i+1;j<points.length;j++){const a=points[i],b=points[j],dx=a.x-b.x,dy=a.y-b.y,d=Math.hypot(dx,dy);if(d<150*devicePixelRatio){ctx.strokeStyle=a.c;ctx.globalAlpha=(1-d/(150*devicePixelRatio))*.18;ctx.lineWidth=.8*devicePixelRatio;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke()}}}ctx.globalAlpha=1;requestAnimationFrame(tick)}
  addEventListener('resize',resize,{passive:true});resize();tick();
  document.querySelectorAll('[data-proof-cycle]').forEach((button)=>button.addEventListener('click',()=>{document.querySelectorAll('[data-gate]').forEach((el,i)=>{setTimeout(()=>{el.classList.add('active');el.style.borderColor='rgba(116,255,217,.75)';el.style.boxShadow='0 0 28px rgba(116,255,217,.22)'},i*250)})}));
})();
`;

write(path.join(ASSET_DIR, 'sme.css'), css);
write(path.join(ASSET_DIR, 'sme.js'), js);

function nav(active) {
  const links = [
    ['index.html', 'Signoff Pro'],
    ['sovereign-machine-economy.html', 'Sovereign Economy'],
    ['proof-os.html', 'Proof OS'],
    ['machine-economy.html', 'Machine Economy'],
    ['constitution.html', 'Constitution'],
    ['proof-missions.html', 'Proof Missions']
  ];
  return `<header class="topbar"><nav class="nav"><a class="brand" href="index.html"><span class="mark"></span><span><b>GOALOS SIGNOFF PRO</b><small>SOVEREIGN MACHINE ECONOMY</small></span></a><div class="links">${links.map(([href, label]) => `<a class="${label===active?'active':''}" href="${href}">${label}</a>`).join('')}<a class="cta" href="proof-missions.html">Proof mission</a></div></nav></header>`;
}

function layout({ title, description, active, body }) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${html(title)} · GoalOS Signoff Pro</title><meta name="description" content="${html(description)}"><meta property="og:title" content="${html(title)}"><meta property="og:description" content="${html(description)}"><meta property="og:type" content="website"><meta name="theme-color" content="#03070c"><link rel="stylesheet" href="assets/sme.css"></head><body><canvas class="mesh" aria-hidden="true"></canvas>${nav(active)}<main>${body}</main><footer class="footer"><div class="footer-inner"><div><b>GoalOS Signoff Pro</b><br>Mission briefs · evidence dockets · reviewer decisions · signed receipts · reusable capability.</div><div><a class="pill" href="production-manifest.json">Production manifest</a> <a class="pill" href="sme-manifest.json">SME manifest</a></div></div></footer><script src="assets/sme.js" defer></script></body></html>`;
}

function consoleBlock() {
  return `<div class="console"><div class="panel"><div class="panel-head"><span>Proof-to-acceptance console</span><span>Review mode</span></div><div class="console-row" style="margin-top:22px"><div class="steps">${['Commission|Work requested','Submit|Evidence delivered','Map|Claims mapped','Review|Human assessment','Accept|Authorized approval','Receipt|Signed & sealed'].map((s,i)=>{const [a,b]=s.split('|');return `<div class="step" data-gate><b>0${i+1}</b><div><span>${a}</span><small>${b}</small></div></div>`}).join('')}</div><div class="panel"><div class="core"><div class="orb">α</div></div><div class="trust-grid"><div class="trust-tile">Evidence<br>mapped</div><div class="trust-tile">Integrity<br>sealed</div><div class="trust-tile">Human<br>authority</div><div class="trust-tile">Receipt<br>replay</div></div></div></div></div></div>`;
}

const modulesCards = config.modules.map((module, i) => `<article class="flow-card" data-n="0${i+1}"><h3>${html(module.title)}</h3><p>${html(module.short)}</p></article>`).join('');
const moduleMatrix = config.modules.map((module) => `<div class="cell"><b>${html(module.publicObject)}</b>${html(module.description)}</div>`).join('');
const previousMapping = config.previousIterationMapping.map((item) => `<div><b>${html(item.source)}</b><p>${html(item.reimplementedAs)} — ${html(item.description)}</p></div>`).join('');

write(path.join(SITE, 'sovereign-machine-economy.html'), layout({
  title: config.product,
  description: config.doctrine.shortThesis,
  active: 'Sovereign Economy',
  body: `<section class="section hero"><div><div class="eyebrow">GoalOS AGIALPHA Ascension</div><h1>Sovereign <span class="accent">Machine</span> Economy.</h1><p class="lead">${html(config.doctrine.subheadline)}</p><p class="sub">${html(config.doctrine.shortThesis)}</p><div class="buttons"><a class="button primary" href="proof-missions.html">${html(config.doctrine.primaryCta)}</a><a class="button" href="constitution.html">${html(config.doctrine.secondaryCta)}</a></div><div class="stats"><div class="stat"><b>6</b><span>acceptance gates</span></div><div class="stat"><b>12</b><span>evidence planes</span></div><div class="stat"><b>1</b><span>human frontier</span></div><div class="stat"><b>∞</b><span>receipt replay</span></div></div></div>${consoleBlock()}</section><section class="section"><div class="eyebrow">Machine economy stack</div><h2>A governed market surface for AI work.</h2><div class="flow">${modulesCards}</div></section><section class="section"><div class="split"><div class="card"><div class="eyebrow">Initial iteration reimplemented</div><h2>Agent. Node. Jobs. One proof economy.</h2><p class="sub">The previous surfaces become one coherent product posture: orchestration, runtime, proof, review, acceptance, receipt, and reusable capability.</p></div><div class="card">${previousMapping}</div></div></section>`
}));

write(path.join(SITE, 'proof-os.html'), layout({
  title: 'Proof OS for AI Work',
  description: 'A mission moves from objective to governed decision state through proof, verification, and human acceptance.',
  active: 'Proof OS',
  body: `<section class="section hero"><div><div class="eyebrow">Proof OS</div><h1>Set the objective. <span class="accent">Earn</span> the decision.</h1><p class="lead">Mission briefs become contracts. Outputs become evidence. Evidence becomes a decision state that teams can inspect, defend, act on, or reject.</p><div class="buttons"><button class="button primary" data-proof-cycle>Launch proof cycle</button><a class="button" href="dossier.html">Inspect dossier</a></div></div>${consoleBlock()}</section><section class="section"><div class="matrix">${moduleMatrix}</div></section>`
}));

write(path.join(SITE, 'machine-economy.html'), layout({
  title: 'Machine Economy Architecture',
  description: 'Agents, jobs, validators, memory, markets, settlement rails, and governance become one proof-bearing work substrate.',
  active: 'Machine Economy',
  body: `<section class="section"><div class="eyebrow">Machine economy</div><h1>Agents become useful when work becomes proof.</h1><p class="lead">The economy is expressed as roles and records: agents, jobs, validators, tools, memory, markets, settlement rails, governance, and capacity allocation.</p><div class="rail"><div><b>01</b><p>Bounded jobs produce artifacts, hashes, receipts, and review-ready proof.</p></div><div><b>02</b><p>Validators and reviewers convert outputs into accepted, rejected, or escalated states.</p></div><div><b>03</b><p>Accepted capabilities become reusable institutional memory with replayable context.</p></div></div></section><section class="section"><div class="split"><div class="card"><h2>Market surface</h2><p>Work requests, evidence packets, reviewer decisions, and receipts become legible enough for future settlement rails, reputation, and capability exchange.</p></div><div class="card"><h2>Control surface</h2><p>Authority is represented through scoped roles, required review, challenge windows, rollback targets, and reusable proof packets.</p></div></div></section>`
}));

write(path.join(SITE, 'constitution.html'), layout({
  title: 'AEP-001 Constitution',
  description: 'The object model behind proof-carrying intelligence organizations.',
  active: 'Constitution',
  body: `<section class="section"><div class="eyebrow">AEP-001 Constitution</div><h1>Aim. Act. Prove. <span class="accent">Evolve.</span></h1><p class="lead">The public doctrine maps to implementation objects: GoalOSCommit, RunCommitment, ProofPacket, EvalAttestation, SelectionCertificate, EvolutionLedgerEntry, and EvidenceDocket.</p><div class="matrix">${moduleMatrix}</div></section><section class="section"><div class="card"><h2>Selection gate calculus</h2><p>Score is advisory. Gates are mechanical: proof integrity, evaluation pass, scope authorization, rollback readiness, reviewer decision, and replay path.</p><div class="terminal">ProofValid → EvalPass → ScopeAuthorized → RollbackReady → ReviewComplete → ReceiptSealed</div></div></section>`
}));

write(path.join(SITE, 'proof-missions.html'), layout({
  title: 'Founding Proof Missions',
  description: 'Bring one serious AI delivery into GoalOS Signoff Pro and leave with a proof-backed governed decision state.',
  active: 'Proof Missions',
  body: `<section class="section hero"><div><div class="eyebrow">Private beta</div><h1>Bring one serious AI delivery into <span class="accent">Signoff.</span></h1><p class="lead">Ideal first missions: AI strategy reports, automation milestones, software handoffs, grant reviews, procurement diligence, and internal AI pilot acceptance.</p><div class="buttons"><a class="button primary" href="mailto:${html(config.pilotEmail)}?subject=GoalOS%20Signoff%20Pro%20Proof%20Mission">Request proof mission access</a><a class="button" href="sovereign-machine-economy.html">Inspect the economy</a></div></div><div class="console"><div class="panel"><div class="panel-head"><span>Founding proof mission</span><span>48-hour wedge</span></div><div class="core"><div class="orb">✓</div></div><div class="steps"><div class="step"><b>01</b><div><span>Objective</span><small>What decision must this support?</small></div></div><div class="step"><b>02</b><div><span>Docket</span><small>What evidence makes it reviewable?</small></div></div><div class="step"><b>03</b><div><span>Receipt</span><small>What was accepted, by whom, and when?</small></div></div></div></div></div></section>`
}));

function injectIntoIndex() {
  const indexPath = path.join(SITE, 'index.html');
  if (!fs.existsSync(indexPath)) return;
  let content = fs.readFileSync(indexPath, 'utf8');
  if (!content.includes('sovereign-machine-economy.html')) {
    content = content.replace(/<\/main>/i, `<section class="section"><div class="card"><div class="eyebrow">GoalOS AGIALPHA Ascension</div><h2>Sovereign Machine Economy</h2><p class="sub">The Signoff product is now connected to the broader GoalOS doctrine: mission commitments, evidence dockets, reviewer gates, signed receipts, and reusable capability.</p><div class="buttons"><a class="button primary" href="sovereign-machine-economy.html">Enter Sovereign Economy</a><a class="button" href="proof-os.html">Inspect Proof OS</a></div></div></section></main>`);
  }
  if (!content.includes('assets/sme.css')) content = content.replace(/<\/head>/i, '<link rel="stylesheet" href="assets/sme.css"></head>');
  if (!content.includes('assets/sme.js')) content = content.replace(/<\/body>/i, '<script src="assets/sme.js" defer></script></body>');
  fs.writeFileSync(indexPath, content);
}

injectIntoIndex();

const pages = config.publicPages.map((page) => page.file);
const existingSitemap = path.join(SITE, 'sitemap.xml');
const urls = ['index.html', ...pages].map((file) => `<url><loc>${config.productionUrl}${file}</loc></url>`).join('\n');
write(existingSitemap, `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`);
write(path.join(SITE, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${config.productionUrl}sitemap.xml\n`);

const files = listFiles(SITE).filter((file) => fs.statSync(file).isFile()).sort();
const hashes = Object.fromEntries(files.map((file) => [path.relative(SITE, file).replaceAll('\\\\', '/'), sha256(file)]));
const siteHash = crypto.createHash('sha256').update(Object.entries(hashes).map(([k, v]) => `${k}:${v}`).join('\n')).digest('hex');
const manifest = {
  product: config.product,
  repository: config.repository,
  productionUrl: config.productionUrl,
  generatedAt: GENERATED_AT,
  githubSha: process.env.GITHUB_SHA || 'local',
  githubRunId: process.env.GITHUB_RUN_ID || 'local',
  pages,
  hashes,
  siteHash,
  artifactBoundary: 'public-static-curated-pages-only'
};
write(path.join(SITE, 'sme-manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);

const existingManifestPath = path.join(SITE, 'production-manifest.json');
let productionManifest = {};
if (fs.existsSync(existingManifestPath)) {
  try { productionManifest = readJson(existingManifestPath); } catch { productionManifest = {}; }
}
productionManifest.sovereignMachineEconomy = { generatedAt: GENERATED_AT, siteHash, pages };
write(existingManifestPath, `${JSON.stringify(productionManifest, null, 2)}\n`);

const forbidden = ['.env', 'BEGIN PRIVATE KEY', 'SUPABASE_SERVICE_ROLE', 'STRIPE_SECRET_KEY', 'sk_live_', 'wallet private key', 'seed phrase', 'mnemonic', 'Mainnet settlement is live', 'AGIALPHA staking is live', 'achieved ASI', 'superintelligence achieved'];
const publicFiles = listFiles(SITE).filter((file) => fs.statSync(file).isFile());
const hits = [];
for (const file of publicFiles) {
  const rel = path.relative(SITE, file);
  const text = fs.readFileSync(file, 'utf8');
  for (const marker of forbidden) if (text.includes(marker)) hits.push(`${rel}: ${marker}`);
}
if (hits.length) {
  console.error('Public artifact boundary violation:\n' + hits.join('\n'));
  process.exit(1);
}

console.log(`Sovereign Machine Economy pages generated: ${pages.join(', ')}`);
console.log(`Site hash: ${siteHash}`);
