import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = process.cwd();
const siteDir = path.join(root, 'site');
const assetDir = path.join(siteDir, 'assets');
const configPath = path.join(root, 'config', 'holy-grail-browser-demo.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
fs.mkdirSync(assetDir, { recursive: true });

const noDataRail = 'No forms · no uploads · no cookies · no analytics · no wallets · no payments · no personal or confidential data.';
const titleSuffix = 'GoalOS Signoff Pro';

const esc = (value) => String(value).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const sha256 = (s) => crypto.createHash('sha256').update(s).digest('hex');

function write(file, contents) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, contents);
}

function page({ title, active, eyebrow, headline, lead, body, ctas = '', visual = '', sections = '' }) {
  const nav = [
    ['Institution', 'index.html'], ['Start', 'start.html'], ['Demo Lab', 'demo-lab.html'],
    ['Holy Grail', 'holy-grail.html'], ['Proof Machine', 'proof-gated-work-machine.html'],
    ['Proof Run 001', 'proof-run-001.html'], ['Evidence Docket', 'evidence-docket-demo.html'],
    ['$AGIALPHA', 'agialpha.html'], ['Data posture', 'no-user-data.html']
  ];
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)} · ${titleSuffix}</title>
  <meta name="description" content="A browser-local, no-user-data proof-gated work demo for GoalOS Signoff Pro.">
  <link rel="stylesheet" href="assets/holy-grail-browser.css">
</head>
<body data-page="${esc(active)}">
  <canvas id="hgField" aria-hidden="true"></canvas>
  <div class="hg-aurora" aria-hidden="true"></div>
  <header class="hg-topbar">
    <a class="hg-brand" href="index.html" aria-label="GoalOS Signoff Pro home"><span class="hg-mark">G</span><span><b>GoalOS Signoff Pro</b><small>Proof-gated work machine</small></span></a>
    <nav class="hg-nav" aria-label="Primary navigation">${nav.map(([label, href]) => `<a class="${active === href ? 'active' : ''}" href="${href}">${label}</a>`).join('')}</nav>
    <a class="hg-cta" href="proof-run-001.html">Run proof loop</a>
  </header>
  <main>
    <section class="hg-hero">
      <div class="hg-copy">
        <p class="hg-eyebrow">${esc(eyebrow)}</p>
        <h1>${headline}</h1>
        <p class="hg-lead">${lead}</p>
        ${body ? `<p class="hg-bodycopy">${body}</p>` : ''}
        ${ctas}
      </div>
      ${visual}
    </section>
    ${sections}
    <section class="hg-section two hg-proof-standard"><div><p class="hg-eyebrow">What this makes felt</p><h2>Proof-gated open-ended work, not ungoverned autonomy.</h2><p>The demo is designed to make the core idea intuitive: raw output is abundant; proof-bearing experience is scarce. A mission does not earn influence by sounding impressive. It earns influence only when evidence, validation, replay, risk, and human authority agree.</p></div><div class="hg-question-card"><h3>What the browser shows</h3><ol><li>A mission begins as an explicit commitment.</li><li>Work becomes useful only when it emits evidence.</li><li>Proof becomes memory only after validation.</li><li>Reusable capability inherits only accepted experience.</li><li>Economic consequence is represented as a gated signal; this public demo moves zero value.</li><li>The next step is Proof Run 001 with an inspectable Evidence Docket.</li></ol></div></section>
    <section class="hg-section"><p class="hg-eyebrow">Object model</p><h2>From answer to institution-grade record.</h2><div class="hg-cards six"><article><b>GoalOSCommit</b><p>Declares the mission, authority, constraints, success criteria, risk class, and claim boundary.</p></article><article><b>RunCommitment</b><p>Records the bounded execution corridor: tools, context, policy root, budget, and permitted actions.</p></article><article><b>ProofPacket</b><p>Captures trace roots, output hashes, policy decisions, cost, latency, errors, signatures, and evidence pointers.</p></article><article><b>EvalAttestation</b><p>Separates persuasion from acceptance by requiring evaluator state and a signed verdict.</p></article><article><b>Evidence Docket</b><p>Shows the claim, baseline, proof packets, risk ledger, public/private boundary, and replay path.</p></article><article><b>Evolution Gate</b><p>Only validated, scoped, rollbackable work can influence future capability. The demo makes that gate visible.</p></article></div></section>
  </main>
  <div class="hg-site-rule"><strong>Public demo rule</strong><span>${noDataRail}</span></div>
  <footer class="hg-footer"><b>GoalOS Signoff Pro</b><span>Proof-gated open-ended work · Evidence Dockets · Mission Receipts · Reusable capability</span><a href="mailto:${config.contact}?subject=GoalOS%20Proof%20Mission%20Inquiry">${config.contact}</a></footer>
  <script src="assets/holy-grail-browser.js"></script>
</body>
</html>`;
}

const loopCards = config.loop.map((s, i) => `<button class="hg-step" data-step="${i}" type="button"><span>${String(i + 1).padStart(2, '0')}</span><b>${esc(s.label)}</b><small>${esc(s.caption)}</small></button>`).join('');
const questions = config.questions.map((q) => `<li>${esc(q)}</li>`).join('');
const artifacts = config.demoArtifacts.map((a) => `<span>${esc(a)}</span>`).join('');

const consoleVisual = `<aside class="hg-console" aria-label="Browser-local proof console">
  <div class="hg-console-head"><span>Proof-gated work console</span><b>Browser local</b></div>
  <div class="hg-orbit-wrap"><div class="hg-core"><span>PROOF</span><b>0%</b><small>ready</small></div><div class="hg-ring r1"></div><div class="hg-ring r2"></div><div class="hg-ring r3"></div></div>
  <div class="hg-console-grid">${loopCards}</div>
  <div class="hg-mini-ledger"><span>Claim support</span><b>gated</b><span>Replay path</span><b>sealed</b><span>Value moved</span><b>0</b></div>
</aside>`;

const ctasMain = `<div class="hg-actions"><a class="primary" href="proof-run-001.html">Run the browser proof loop</a><a href="evidence-docket-demo.html">Inspect sample docket</a><a href="proof-gated-work-machine.html">See the work machine</a></div>`;

write(path.join(siteDir, 'holy-grail.html'), page({
  title: 'Holy Grail Candidate', active: 'holy-grail.html', eyebrow: 'Proof-gated open-ended work',
  headline: `A <em>Holy Grail candidate</em> for governed autonomous work.`,
  lead: `Not because it is merely computationally expressive. The rare layer is proof-gated work that can become verified experience, reusable capability, institutional memory, and a harder next mission.`,
  body: `The browser demo shows proof-gated open-ended work without asking for data: mission, work, proof, validation, chronicle, capability, settlement signal, reinvestment, harder mission.`,
  ctas: ctasMain,
  visual: consoleVisual,
  sections: `<section class="hg-section two"><div><p class="hg-eyebrow">The precise claim</p><h2>Not infinite output. A governed compounding loop.</h2><p>Raw generation creates text. GoalOS turns bounded work into a record that can be inspected, challenged, remembered, and reused. The page is claim-bounded: it presents a candidate architecture and a browser-local simulation, not an achievement claim.</p></div><div class="hg-question-card"><h3>The ten questions every mission must answer</h3><ol>${questions}</ol></div></section>
  <section class="hg-loop"><p class="hg-eyebrow">Mission → harder mission</p><h2>Only verified experience can influence the next cycle.</h2><div class="hg-loop-grid">${config.loop.map((s, i) => `<article><span>${String(i+1).padStart(2,'0')}</span><b>${esc(s.label)}</b><p>${esc(s.caption)}</p></article>`).join('')}</div></section>`
}));

write(path.join(siteDir, 'proof-gated-work-machine.html'), page({
  title: 'Proof-Gated Work Machine', active: 'proof-gated-work-machine.html', eyebrow: 'Universal work, gated by evidence',
  headline: `Computation becomes institution only when it can <em>prove</em>.`,
  lead: `A normal agent platform tries a task. GoalOS converts an objective into a proof-carrying work record: what was attempted, what happened, what passed, what failed, what can be reused.`,
  body: `The public browser version is deliberately no-input and no-wallet. It demonstrates the state machine, not a live settlement system.`,
  ctas: `<div class="hg-actions"><a class="primary" href="proof-run-001.html">Launch Proof Run 001 demo</a><a href="holy-grail.html">Read the thesis</a></div>`,
  visual: consoleVisual,
  sections: `<section class="hg-section"><p class="hg-eyebrow">Proof machine components</p><h2>Computation + proof + governance + memory + economic consequence.</h2><div class="hg-cards six"><article><b>Mission</b><p>Bounded objective, success criteria, risk class, authority, and done condition.</p></article><article><b>Evidence Docket</b><p>Claims matrix, proof packets, verifier report, risk ledger, replay path, and claim boundary.</p></article><article><b>Validation</b><p>Unsupported claims are rejected. Score is advisory; gates are mandatory.</p></article><article><b>Chronicle</b><p>Accepted work becomes durable institutional memory rather than ephemeral output.</p></article><article><b>Capability package</b><p>Reusable patterns become future mission capacity under explicit boundaries.</p></article><article><b>Settlement signal</b><p>Where a separate protocol context enables it, proof can become economically consequential. This public demo moves no value.</p></article></div></section>
  <section class="hg-section two"><div class="hg-equation"><span>Output × Proof × Validation × Reuse</span><b>→ trusted work</b></div><div><p class="hg-eyebrow">Operating rule</p><h2>No proof, no evolution.</h2><p>The demo treats every state transition as a gate. Missing evidence sends the run backward; accepted proof creates a reusable event.</p></div></section>`
}));

write(path.join(siteDir, 'proof-run-001.html'), page({
  title: 'Proof Run 001 Browser Demo', active: 'proof-run-001.html', eyebrow: 'Browser-local proof run',
  headline: `Run Proof Run 001 <em>without sending anything</em>.`,
  lead: `Click once. The browser advances a sample mission through proof, validation, chronicle, capability, and a simulated settlement signal.`,
  body: `Everything is generated locally from a public-safe example. No input boxes. No upload. No account. No wallet.`,
  ctas: `<div class="hg-actions"><button class="primary" id="hgRun" type="button">Launch proof loop</button><button id="hgReset" type="button">Reset</button><button id="hgDownload" type="button">Download demo docket</button></div>`,
  visual: consoleVisual,
  sections: `<section class="hg-section two proof-stage"><div><p class="hg-eyebrow">Live local trace</p><h2 id="hgStageTitle">System ready.</h2><p id="hgStageText">Awaiting mission. The sample run will produce a mission contract, Evidence Docket, verifier report, risk ledger, Chronicle entry, capability package, and settlement signal.</p><div class="hg-terminal" id="hgTerminal"><p>Ready. Browser-local simulation loaded.</p></div></div><div class="hg-artifacts"><h3>Artifacts created by the run</h3>${artifacts}</div></section>`
}));

write(path.join(siteDir, 'compounding-loop.html'), page({
  title: 'Compounding Loop', active: 'compounding-loop.html', eyebrow: 'Verified experience compounds',
  headline: `From one accepted mission to a harder future mission.`,
  lead: `The prize is not a single report. It is a loop where accepted proof becomes memory, memory becomes reusable capability, and reusable capability raises the level of the next mission.`,
  ctas: `<div class="hg-actions"><a class="primary" href="proof-run-001.html">Run the loop</a><a href="holy-grail.html">Read the thesis</a></div>`,
  visual: consoleVisual,
  sections: `<section class="hg-loop"><p class="hg-eyebrow">Compounding chain</p><h2>Mission → Work → Proof → Validation → Verified Experience → Chronicle → Capability → Settlement Signal → Reinvestment → Harder Mission</h2><div class="hg-loop-grid">${config.loop.map((s, i) => `<article><span>${String(i+1).padStart(2,'0')}</span><b>${esc(s.label)}</b><p>${esc(s.caption)}</p></article>`).join('')}</div></section>`
}));

const css = `:root{--bg:#03070b;--panel:rgba(10,22,27,.76);--line:rgba(143,255,223,.28);--mint:#75ffd6;--cyan:#69dfff;--gold:#ffe88e;--cream:#f4efe4;--muted:#b6c5c8;--violet:#9b85ff;--danger:#ff8bb9}*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:radial-gradient(circle at 72% 18%,rgba(75,255,215,.16),transparent 28%),radial-gradient(circle at 18% 70%,rgba(151,123,255,.14),transparent 30%),linear-gradient(135deg,#020509,#061018 55%,#03070b);color:var(--cream);font-family:Inter,ui-sans-serif,system-ui,-apple-system,Segoe UI,sans-serif;min-height:100vh;overflow-x:hidden}#hgField{position:fixed;inset:0;width:100%;height:100%;z-index:-3;opacity:.68}.hg-aurora{position:fixed;inset:-20%;z-index:-2;background:conic-gradient(from 120deg at 65% 35%,transparent,rgba(84,255,214,.12),transparent,rgba(117,140,255,.16),transparent,rgba(255,232,142,.08),transparent);filter:blur(70px);animation:drift 16s ease-in-out infinite alternate}.hg-topbar{position:sticky;top:0;z-index:10;display:flex;align-items:center;gap:24px;justify-content:center;min-height:78px;padding:14px 5vw;background:rgba(2,7,11,.78);backdrop-filter:blur(18px);border-bottom:1px solid rgba(143,255,223,.18)}.hg-brand{position:absolute;left:5vw;text-decoration:none;color:var(--cream);display:flex;align-items:center;gap:12px}.hg-mark{width:42px;height:42px;border-radius:13px;display:grid;place-items:center;background:radial-gradient(circle,var(--mint),#183b45 55%,#081116);box-shadow:0 0 34px rgba(117,255,214,.5);font-weight:900;color:#001}.hg-brand b{display:block;text-transform:uppercase;letter-spacing:.18em;font-size:12px}.hg-brand small{display:block;text-transform:uppercase;letter-spacing:.24em;font-size:10px;color:var(--muted)}.hg-nav{display:flex;gap:10px;flex-wrap:wrap;justify-content:center}.hg-nav a,.hg-cta{color:var(--cream);text-decoration:none;font-size:13px;font-weight:800;padding:11px 14px;border-radius:999px}.hg-nav a.active,.hg-nav a:hover{background:rgba(255,255,255,.1);box-shadow:inset 0 0 0 1px rgba(255,255,255,.14)}.hg-cta{position:absolute;right:5vw;background:linear-gradient(90deg,#eaff9e,#65f6ff);color:#02100d}main{position:relative}.hg-hero{display:grid;grid-template-columns:minmax(0,1.02fr) minmax(360px,.98fr);gap:48px;align-items:center;min-height:calc(100vh - 78px);max-width:1240px;margin:0 auto;padding:90px 30px 70px}.hg-copy{min-width:0}.hg-eyebrow{color:var(--mint);text-transform:uppercase;letter-spacing:.34em;font-weight:900;font-size:12px;margin:0 0 22px;display:flex;gap:12px;align-items:center}.hg-eyebrow:before{content:"";width:34px;height:2px;background:linear-gradient(90deg,transparent,var(--mint))}h1{font-size:clamp(56px,8vw,112px);line-height:.87;letter-spacing:-.085em;margin:0 0 26px;max-width:920px}h1 em{font-family:Georgia,serif;font-weight:500;font-style:italic;background:linear-gradient(90deg,#fff3a1,#76ffd6,#75c8ff,#a48dff);-webkit-background-clip:text;background-clip:text;color:transparent;letter-spacing:-.06em}.hg-lead{font-size:clamp(20px,2.15vw,31px);line-height:1.28;font-weight:800;color:#e9f7f4;max-width:760px}.hg-bodycopy{font-size:17px;line-height:1.65;color:var(--muted);max-width:720px}.hg-actions{display:flex;gap:14px;flex-wrap:wrap;margin-top:30px}.hg-actions a,.hg-actions button{appearance:none;border:1px solid rgba(255,255,255,.16);background:rgba(255,255,255,.08);color:var(--cream);border-radius:999px;padding:15px 20px;font-weight:900;text-decoration:none;cursor:pointer;box-shadow:0 12px 36px rgba(0,0,0,.22)}.hg-actions .primary,.hg-actions button.primary{background:linear-gradient(100deg,#fff59b,#71ffd7,#67dfff);color:#03110f;border:0}.hg-console{position:relative;min-height:560px;border:1px solid rgba(136,255,225,.28);border-radius:36px;background:linear-gradient(145deg,rgba(21,38,42,.82),rgba(5,10,16,.84));box-shadow:0 44px 120px rgba(0,0,0,.55),inset 0 0 90px rgba(117,255,214,.08);padding:28px;overflow:hidden}.hg-console:before{content:"";position:absolute;inset:-1px;border-radius:36px;background:linear-gradient(130deg,rgba(255,232,142,.35),rgba(117,255,214,.08),rgba(105,223,255,.25));z-index:-1}.hg-console-head{display:flex;justify-content:space-between;text-transform:uppercase;letter-spacing:.25em;font-size:12px;color:var(--mint);font-weight:900}.hg-orbit-wrap{position:absolute;right:-90px;top:90px;width:470px;height:470px;display:grid;place-items:center}.hg-core{position:relative;z-index:3;width:168px;height:168px;border-radius:50%;display:grid;place-items:center;background:radial-gradient(circle,#fffbb0 0 8%,#72ffd6 9% 42%,#10242f 70%);box-shadow:0 0 60px rgba(117,255,214,.8),0 0 140px rgba(105,223,255,.35);color:#02110f;text-align:center}.hg-core span{font-size:12px;letter-spacing:.25em;font-weight:900}.hg-core b{font-size:44px}.hg-core small{text-transform:uppercase;letter-spacing:.22em;font-size:10px}.hg-ring{position:absolute;border-radius:50%;border:1px solid rgba(117,255,214,.3);animation:spin 16s linear infinite}.r1{width:240px;height:240px}.r2{width:340px;height:340px;border-color:rgba(255,232,142,.25);animation-duration:22s}.r3{width:440px;height:440px;border-color:rgba(105,223,255,.18);animation-duration:30s}.hg-console-grid{position:relative;z-index:4;display:grid;gap:14px;max-width:300px;margin-top:28px}.hg-step{border:1px solid rgba(117,255,214,.32);background:rgba(255,255,255,.065);border-radius:18px;padding:14px 16px;text-align:left;color:var(--cream);display:grid;grid-template-columns:34px 1fr;gap:2px 12px;cursor:pointer}.hg-step span{grid-row:1/3;color:var(--gold);font-weight:900}.hg-step b{font-size:18px}.hg-step small{color:var(--muted)}.hg-step.active{background:linear-gradient(90deg,rgba(117,255,214,.22),rgba(105,223,255,.08));box-shadow:0 0 28px rgba(117,255,214,.25)}.hg-mini-ledger{position:absolute;right:26px;bottom:28px;left:340px;display:grid;grid-template-columns:1fr auto;gap:8px 18px;border:1px solid rgba(255,232,142,.25);border-radius:22px;padding:18px;background:rgba(0,0,0,.32);font-size:12px;text-transform:uppercase;letter-spacing:.16em}.hg-mini-ledger b{color:var(--gold)}.hg-section{max-width:1180px;margin:0 auto;padding:80px 30px}.hg-section.two{display:grid;grid-template-columns:1fr 1fr;gap:32px;align-items:center}.hg-section h2,.hg-loop h2{font-size:clamp(42px,5.5vw,78px);line-height:.92;letter-spacing:-.06em;margin:0 0 20px}.hg-section p{color:var(--muted);font-size:18px;line-height:1.68}.hg-question-card,.hg-equation,.proof-stage>div,.hg-artifacts{border:1px solid rgba(255,255,255,.16);background:rgba(255,255,255,.065);border-radius:28px;padding:28px;box-shadow:inset 0 0 60px rgba(117,255,214,.04)}.hg-question-card ol{display:grid;gap:12px;margin:0;padding-left:24px}.hg-question-card li{font-size:18px;font-weight:800}.hg-loop{max-width:1240px;margin:0 auto;padding:90px 30px}.hg-loop-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:16px}.hg-loop-grid article,.hg-cards article{border:1px solid rgba(143,255,223,.2);background:linear-gradient(145deg,rgba(255,255,255,.08),rgba(255,255,255,.035));border-radius:22px;padding:22px;min-height:160px}.hg-loop-grid span{color:var(--gold);font-weight:900}.hg-loop-grid b,.hg-cards b{display:block;font-size:20px;margin:12px 0}.hg-loop-grid p,.hg-cards p{color:var(--muted);line-height:1.5}.hg-cards.six{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}.hg-equation span{display:block;font-size:38px;font-weight:900;letter-spacing:-.05em;background:linear-gradient(90deg,#fff3a1,#76ffd6,#7ccfff);-webkit-background-clip:text;color:transparent}.hg-equation b{display:block;font-size:20px;margin-top:14px}.hg-terminal{background:#03070b;border:1px solid rgba(117,255,214,.18);border-radius:18px;padding:18px;min-height:190px;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;color:#caffef;box-shadow:inset 0 0 36px rgba(0,0,0,.5);overflow:auto}.hg-terminal p{margin:0 0 8px;color:#caffef;font-size:14px}.hg-artifacts{display:grid;gap:10px}.hg-artifacts span{display:block;border:1px solid rgba(117,255,214,.18);border-radius:14px;padding:12px;background:rgba(0,0,0,.24);font-family:ui-monospace,monospace;color:#f4f2df}.hg-site-rule{position:sticky;bottom:0;z-index:9;width:max-content;max-width:calc(100% - 24px);margin:0 auto 12px;border:1px solid rgba(117,255,214,.28);background:rgba(3,7,11,.78);backdrop-filter:blur(16px);border-radius:999px;padding:10px 14px;display:flex;gap:12px;align-items:center;font-size:12px}.hg-site-rule strong{color:var(--gold)}.hg-footer{border-top:1px solid rgba(143,255,223,.15);background:rgba(2,6,10,.92);padding:30px 5vw;display:flex;gap:18px;justify-content:space-between;align-items:center;flex-wrap:wrap}.hg-footer span{color:var(--muted)}.hg-footer a{color:var(--mint)}@keyframes spin{to{transform:rotate(360deg)}}@keyframes drift{to{transform:translate3d(3%,4%,0) rotate(7deg)}}@media(max-width:980px){.hg-hero,.hg-section.two{grid-template-columns:1fr}.hg-console{min-height:620px}.hg-mini-ledger{position:relative;left:auto;right:auto;bottom:auto;margin-top:24px}.hg-orbit-wrap{right:-150px;top:160px}.hg-loop-grid,.hg-cards.six{grid-template-columns:1fr 1fr}.hg-brand,.hg-cta{position:static}.hg-topbar{justify-content:flex-start;flex-wrap:wrap}.hg-nav{order:3;width:100%}}@media(max-width:620px){h1{font-size:52px}.hg-loop-grid,.hg-cards.six{grid-template-columns:1fr}.hg-hero{padding:50px 18px}.hg-section,.hg-loop{padding:56px 18px}.hg-console{padding:20px}.hg-orbit-wrap{opacity:.45}.hg-site-rule{border-radius:18px;display:block}.hg-footer{display:block}}
`;
write(path.join(assetDir, 'holy-grail-browser.css'), css);

const js = `(function(){
const canvas=document.getElementById('hgField');
if(canvas){const ctx=canvas.getContext('2d');let w,h,pts=[];function resize(){w=canvas.width=innerWidth*devicePixelRatio;h=canvas.height=innerHeight*devicePixelRatio;pts=Array.from({length:Math.min(90,Math.floor(innerWidth/18))},()=>({x:Math.random()*w,y:Math.random()*h,vx:(Math.random()-.5)*.22*devicePixelRatio,vy:(Math.random()-.5)*.22*devicePixelRatio,r:(Math.random()*1.8+0.8)*devicePixelRatio,c:Math.random()>.72?'#ffe88e':Math.random()>.5?'#75ffd6':'#8bb7ff'}));}resize();addEventListener('resize',resize,{passive:true});(function draw(){ctx.clearRect(0,0,w,h);for(const p of pts){p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>w)p.vx*=-1;if(p.y<0||p.y>h)p.vy*=-1;ctx.beginPath();ctx.fillStyle=p.c;ctx.globalAlpha=.75;ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill()}for(let i=0;i<pts.length;i++){for(let j=i+1;j<pts.length;j++){const a=pts[i],b=pts[j],dx=a.x-b.x,dy=a.y-b.y,d=Math.hypot(dx,dy);if(d<150*devicePixelRatio){ctx.globalAlpha=(1-d/(150*devicePixelRatio))*.18;ctx.strokeStyle='#75ffd6';ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke()}}}ctx.globalAlpha=1;requestAnimationFrame(draw)})()}
const steps=[...document.querySelectorAll('.hg-step')];
const core=document.querySelector('.hg-core b');
const coreSmall=document.querySelector('.hg-core small');
const run=document.getElementById('hgRun');const reset=document.getElementById('hgReset');const dl=document.getElementById('hgDownload');const title=document.getElementById('hgStageTitle');const text=document.getElementById('hgStageText');const term=document.getElementById('hgTerminal');
const stages=[
['Mission committed','A bounded AI-delivered work package is converted into a mission contract.'],
['Work executed','The sample work packet runs through a scoped proof envelope.'],
['Evidence docket formed','Claims, evidence, hashes, risks, and replay path are packaged.'],
['Validation gate cleared','Unsupported claims are rejected; supported claims proceed.'],
['Verified experience recorded','Accepted proof becomes a reusable experience event.'],
['Chronicle updated','The institution remembers what was proven.'],
['Capability packaged','The reusable pattern becomes future mission capacity.'],
['Settlement signal prepared','A proof-backed economic signal is prepared; the public demo moves no value.'],
['Reinvestment simulated','Accepted capability is routed toward a harder future mission.'],
['Harder mission ready','Only verified experience influences the next cycle.']
];
let timer=null;function setStep(i){steps.forEach((s,k)=>s.classList.toggle('active',k<=i));if(core)core.textContent=Math.round(((i+1)/stages.length)*100)+'%';if(coreSmall)coreSmall.textContent=i>=stages.length-1?'ready':'running';if(title)title.textContent=stages[i][0]+'.';if(text)text.textContent=stages[i][1];if(term){const p=document.createElement('p');p.textContent='• '+stages[i][0]+' — '+stages[i][1];term.appendChild(p);term.scrollTop=term.scrollHeight}}
function launch(){clearInterval(timer);if(term)term.innerHTML='<p>Proof Run 001 initialized. Browser-local execution only.</p>';let i=0;setStep(0);timer=setInterval(()=>{i++;if(i>=stages.length){clearInterval(timer);return}setStep(i)},720)}
function clear(){clearInterval(timer);steps.forEach(s=>s.classList.remove('active'));if(core)core.textContent='0%';if(coreSmall)coreSmall.textContent='ready';if(title)title.textContent='System ready.';if(text)text.textContent='Awaiting mission. The sample run will produce a mission contract, Evidence Docket, verifier report, risk ledger, Chronicle entry, capability package, and settlement signal.';if(term)term.innerHTML='<p>Ready. Browser-local simulation loaded.</p>'}
function download(){const demo={type:'GoalOSBrowserLocalProofRun001',createdAt:new Date().toISOString(),publicDemo:true,noUserData:true,valueMoved:0,contact:'info@quebec.ai',claimBoundary:'Holy Grail candidate, not achievement claim.',loop:stages.map((s,i)=>({step:i+1,title:s[0],status:'demo_pass',note:s[1]})),artifacts:['mission-contract.json','evidence-docket.json','verifier-report.json','risk-ledger.json','chronicle-entry.json','capability-package.json','settlement-signal.json']};const blob=new Blob([JSON.stringify(demo,null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='goalos-proof-run-001-browser-demo.json';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),5000)}
if(run)run.addEventListener('click',launch);if(reset)reset.addEventListener('click',clear);if(dl)dl.addEventListener('click',download);steps.forEach((s,i)=>s.addEventListener('click',()=>setStep(i)));})();`;
write(path.join(assetDir, 'holy-grail-browser.js'), js);

// public-safe demo artifact for direct links and artifact safety checks
const demoBundle = {
  type: 'GoalOSHolyGrailBrowserDemo',
  version: config.version,
  generatedAt: new Date().toISOString(),
  noUserData: true,
  browserLocal: true,
  valueMoved: 0,
  tokenBoundary: config.token.publicBoundary,
  claimBoundary: config.claimBoundary.primary,
  nextProof: config.claimBoundary.nextProof,
  loop: config.loop,
  sampleArtifacts: config.demoArtifacts
};
write(path.join(siteDir, 'holy-grail-demo-bundle.json'), JSON.stringify(demoBundle, null, 2));

const manifest = {
  generatedAt: new Date().toISOString(),
  generator: 'scripts/build-holy-grail-browser-demo.mjs',
  version: config.version,
  pages: ['holy-grail.html','proof-gated-work-machine.html','proof-run-001.html','compounding-loop.html'],
  noUserData: true,
  browserLocal: true,
  valueMoved: 0,
  siteHash: sha256(JSON.stringify(demoBundle))
};
write(path.join(siteDir, 'holy-grail-browser-manifest.json'), JSON.stringify(manifest, null, 2));

// Homepage insertion: keep above footer/legal rails, never below them.
const indexPath = path.join(siteDir, 'index.html');
if (fs.existsSync(indexPath)) {
  let html = fs.readFileSync(indexPath, 'utf8');
  html = html.replace(/<!-- GOALOS_HOLY_GRAIL_BROWSER_START -->[\s\S]*?<!-- GOALOS_HOLY_GRAIL_BROWSER_END -->/g, '');
  const block = `
<!-- GOALOS_HOLY_GRAIL_BROWSER_START -->
<section class="hg-home-rail" style="max-width:1120px;margin:72px auto 42px;padding:0 24px;position:relative;z-index:2">
  <div style="border:1px solid rgba(143,255,223,.22);background:linear-gradient(135deg,rgba(117,255,214,.12),rgba(255,255,255,.04));border-radius:32px;padding:32px;box-shadow:0 28px 80px rgba(0,0,0,.35)">
    <p style="margin:0 0 12px;color:#75ffd6;text-transform:uppercase;letter-spacing:.28em;font-size:12px;font-weight:900">Browser-local proof machine</p>
    <h2 style="margin:0 0 12px;color:#f4efe4;font-size:clamp(34px,5vw,66px);line-height:.92;letter-spacing:-.06em">Run the Holy Grail candidate demo.</h2>
    <p style="margin:0 0 22px;color:#c6d4d7;font-size:18px;line-height:1.55;max-width:840px">A proof-gated open-ended work loop: Mission → Work → Proof → Validation → Chronicle → Reusable Capability → Settlement Signal → Harder Mission. It runs entirely in your browser and asks for nothing.</p>
    <div style="display:flex;gap:12px;flex-wrap:wrap"><a href="holy-grail.html" style="text-decoration:none;border-radius:999px;padding:14px 18px;background:linear-gradient(90deg,#fff59b,#71ffd7,#67dfff);color:#03110f;font-weight:900">Open the flagship demo</a><a href="proof-run-001.html" style="text-decoration:none;border-radius:999px;padding:14px 18px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.16);color:#f4efe4;font-weight:900">Launch Proof Run 001</a><a href="proof-gated-work-machine.html" style="text-decoration:none;border-radius:999px;padding:14px 18px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.16);color:#f4efe4;font-weight:900">See the work machine</a></div>
  </div>
</section>
<!-- GOALOS_HOLY_GRAIL_BROWSER_END -->`;
  const footerIndex = html.search(/<footer\b|<div class="[^\"]*(site-rule|legal|footer|boundary)[^\"]*"/i);
  if (footerIndex >= 0) html = html.slice(0, footerIndex) + block + '\n' + html.slice(footerIndex);
  else html = html.replace(/<\/main>/i, block + '\n</main>');
  write(indexPath, html);
}

console.log(`GoalOS Holy Grail Browser Demo generated ${manifest.pages.length} pages at ${siteDir}`);
