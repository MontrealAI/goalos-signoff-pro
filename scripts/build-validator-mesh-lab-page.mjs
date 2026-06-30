import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = process.cwd();
const site = path.join(root, 'site');
const cfgPath = path.join(root, 'config', 'validator-mesh-lab.json');
const fallbackCfgPath = path.join(path.dirname(new URL(import.meta.url).pathname), '..', 'config', 'validator-mesh-lab.json');
const cfg = JSON.parse(fs.readFileSync(fs.existsSync(cfgPath) ? cfgPath : fallbackCfgPath, 'utf8'));
fs.mkdirSync(site, { recursive: true });

const now = new Date().toISOString();
const stable = (obj) => JSON.stringify(obj, Object.keys(obj).sort(), 2);
const hash = (obj) => crypto.createHash('sha256').update(JSON.stringify(obj)).digest('hex');

const artifacts = {
  manifest: {
    schema: 'goalos.validator_mesh_lab.manifest.v20',
    version: cfg.version,
    generatedAt: now,
    routes: ['validator-mesh-lab.html', 'falsification-lab.html'],
    posture: 'browser-local synthetic public demonstration',
    valueMoved: 0,
    userDataCollected: false,
    claimBoundary: cfg.claimBoundary,
    evidenceObjects: [
      'validator-mesh-demo-bundle.json',
      'commit-reveal-verifier-record.json',
      'falsification-report.json',
      'validator-diversity-ledger.json',
      'challenge-resolution-receipt.json'
    ]
  },
  commitReveal: {
    schema: 'goalos.commit_reveal_verifier_record.demo.v20',
    missionId: 'VALIDATOR-MESH-LAB-001',
    commitPhase: cfg.candidates.map((c, i) => ({ validator: `V${i + 1}`, commitHash: `sha256:${hash({ c: c.id, v: i, phase: 'commit' }).slice(0, 32)}`, revealed: true })),
    revealPhase: cfg.candidates.map((c, i) => ({ validator: `V${i + 1}`, verdict: c.result, proofIntegrity: c.proofIntegrity, consensus: c.validatorConsensus })),
    antiHerding: 'commit-before-reveal synthetic demonstration',
    valueMoved: 0
  },
  falsification: {
    schema: 'goalos.falsification_report.demo.v20',
    negativeControls: [
      'unsupported authority claim',
      'missing replay path',
      'contradiction register gap',
      'collusive-looking quorum',
      'high-impact human gate bypass attempt'
    ],
    outcomes: cfg.candidates.map(c => ({ candidate: c.id, result: c.result, reason: c.reason })),
    falseAcceptanceBlocked: 3,
    acceptedForDecisionReview: 'C3',
    valueMoved: 0
  },
  diversity: {
    schema: 'goalos.validator_diversity_ledger.demo.v20',
    validators: [
      { id: 'V1', role: 'source reality', independence: 'synthetic-independent', weight: 1 },
      { id: 'V2', role: 'claim support', independence: 'synthetic-independent', weight: 1 },
      { id: 'V3', role: 'contradiction', independence: 'synthetic-independent', weight: 1 },
      { id: 'V4', role: 'risk ledger', independence: 'synthetic-independent', weight: 1 },
      { id: 'V5', role: 'replay path', independence: 'synthetic-independent', weight: 1 },
      { id: 'V6', role: 'negative controls', independence: 'synthetic-independent', weight: 1 },
      { id: 'V7', role: 'human authority boundary', independence: 'synthetic-independent', weight: 1 }
    ],
    quorumRule: 'diverse roles plus challenge clearance',
    herdingPenalty: 'applied to C2',
    valueMoved: 0
  },
  challenge: {
    schema: 'goalos.challenge_resolution_receipt.demo.v20',
    challengeWindow: 'synthetic-open-then-cleared-for-C3',
    challengers: ['negative-control-runner', 'risk-sentinel', 'contradiction-checker'],
    resolution: 'C3 survives; C0-C2 fail or remain held',
    nextAction: 'human decision review may inspect C3; no automatic authority granted',
    valueMoved: 0
  }
};
artifacts.bundle = {
  schema: 'goalos.validator_mesh_lab.bundle.v20',
  generatedAt: now,
  manifestHash: hash(artifacts.manifest),
  commitmentHashes: Object.fromEntries(Object.entries(artifacts).filter(([k]) => k !== 'bundle').map(([k, v]) => [k, hash(v)])),
  artifacts: Object.keys(artifacts).filter(k => k !== 'bundle'),
  claimBoundary: cfg.claimBoundary,
  valueMoved: 0
};

const writeJson = (name, obj) => fs.writeFileSync(path.join(site, name), JSON.stringify(obj, null, 2) + '\n');
writeJson('validator-mesh-manifest.json', artifacts.manifest);
writeJson('validator-mesh-demo-bundle.json', artifacts.bundle);
writeJson('commit-reveal-verifier-record.json', artifacts.commitReveal);
writeJson('falsification-report.json', artifacts.falsification);
writeJson('validator-diversity-ledger.json', artifacts.diversity);
writeJson('challenge-resolution-receipt.json', artifacts.challenge);

const legalRail = `<aside class="legal-rail" data-goalos-legal-rail="v12"><strong>Public site rule</strong><span>No forms · no inputs · no uploads · no cookies · no analytics · no wallets · no payments · no personal or confidential data.</span><a href="no-user-data.html">Read the rule</a></aside>`;
const footer = `<footer class="footer" data-goalos-footer="canonical"><div><strong>GoalOS Signoff Pro</strong><p>Proof-governed acceptance · evidence dockets · validator mesh · human authority.</p></div><nav><a href="browser-beta.html">Browser beta</a><a href="mission-001.html">Mission 001</a><a href="evidence-docket-demo.html">Evidence docket</a><a href="no-user-data.html">No User Data</a><a href="agialpha-token-boundary.html">$AGIALPHA boundary</a></nav></footer>`;

const css = `
:root{--bg:#020b0b;--panel:rgba(246,255,245,.09);--panel2:rgba(94,255,217,.12);--line:rgba(136,255,223,.32);--text:#fff8ec;--muted:#b8cacb;--aqua:#65ffe0;--lime:#d8ff99;--gold:#ffec89;--violet:#a994ff;--red:#ff8aa0;--shadow:0 24px 90px rgba(67,255,214,.16)}
*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:radial-gradient(circle at 82% 16%,rgba(70,255,211,.18),transparent 30%),radial-gradient(circle at 12% 88%,rgba(169,148,255,.13),transparent 28%),linear-gradient(180deg,#010607,#051819 54%,#020809);color:var(--text);font-family:Inter,ui-sans-serif,system-ui,-apple-system,Segoe UI,sans-serif;overflow-x:hidden}.grid:before{content:"";position:fixed;inset:0;pointer-events:none;background-image:linear-gradient(rgba(255,255,255,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.035) 1px,transparent 1px);background-size:68px 68px;mask-image:linear-gradient(180deg,rgba(0,0,0,.8),rgba(0,0,0,.15));z-index:-2}.stars{position:fixed;inset:0;z-index:-1;pointer-events:none}.stars i{position:absolute;width:3px;height:3px;border-radius:50%;background:var(--aqua);box-shadow:0 0 18px var(--aqua);opacity:.75;animation:float 9s ease-in-out infinite}.stars i:nth-child(3n){background:var(--gold);box-shadow:0 0 18px var(--gold)}.stars i:nth-child(4n){background:var(--violet);box-shadow:0 0 18px var(--violet)}@keyframes float{50%{transform:translateY(-18px) translateX(12px);opacity:1}}.top{position:sticky;top:0;z-index:20;display:flex;align-items:center;justify-content:space-between;gap:24px;padding:22px 7vw;border-bottom:1px solid var(--line);background:rgba(2,8,9,.88);backdrop-filter:blur(18px)}.brand{display:flex;gap:14px;align-items:center;text-decoration:none;color:var(--text);font-size:12px;font-weight:900;letter-spacing:.22em;text-transform:uppercase}.sigil{width:42px;height:42px;border-radius:14px;border:1px solid var(--line);background:radial-gradient(circle,var(--aqua),#102428 42%,#061112);box-shadow:0 0 32px rgba(101,255,224,.6)}.brand small{display:block;color:var(--muted);font-size:10px;letter-spacing:.26em}.nav{display:flex;align-items:center;gap:18px}.nav a{color:var(--text);text-decoration:none;font-weight:800;font-size:12px}.nav .cta{padding:12px 18px;border-radius:999px;background:linear-gradient(135deg,var(--lime),var(--aqua));color:#001314;box-shadow:0 18px 50px rgba(101,255,224,.23)}.hero{min-height:84vh;display:grid;grid-template-columns:minmax(0,1fr) minmax(360px,600px);gap:56px;align-items:center;max-width:1280px;margin:0 auto;padding:92px 32px 70px}.eyebrow{display:flex;align-items:center;gap:12px;color:var(--aqua);font-size:12px;font-weight:950;letter-spacing:.38em;text-transform:uppercase}.eyebrow:before{content:"";width:54px;height:1px;background:var(--aqua);box-shadow:0 0 16px var(--aqua)}h1{font-size:clamp(54px,8.6vw,128px);line-height:.85;margin:22px 0 24px;letter-spacing:-.08em;max-width:780px}.grad{font-family:Georgia,serif;font-style:italic;font-weight:500;background:linear-gradient(90deg,var(--gold),var(--lime),var(--aqua),var(--violet));-webkit-background-clip:text;color:transparent}p.lead{font-size:clamp(18px,2vw,25px);line-height:1.45;color:#e9f7f2;max-width:720px}.claim{margin:28px 0;padding:18px 20px;border:1px solid rgba(255,236,137,.45);border-radius:18px;background:rgba(255,236,137,.08);font-weight:850}.buttons{display:flex;flex-wrap:wrap;gap:14px;margin:30px 0}.btn{border:1px solid rgba(255,255,255,.24);background:rgba(255,255,255,.11);color:var(--text);text-decoration:none;padding:14px 20px;border-radius:999px;font-weight:900;cursor:pointer}.btn.primary{background:linear-gradient(135deg,var(--lime),var(--aqua));color:#001414;border:0;box-shadow:0 20px 70px rgba(101,255,224,.24)}.chips{display:flex;flex-wrap:wrap;gap:10px}.chip{border:1px solid var(--line);border-radius:999px;padding:8px 12px;font-size:11px;font-weight:900;letter-spacing:.12em;text-transform:uppercase;color:#dff}.mesh-card{position:relative;border:1px solid var(--line);background:linear-gradient(135deg,rgba(255,255,255,.14),rgba(101,255,224,.08));border-radius:34px;padding:24px;box-shadow:var(--shadow);min-height:590px;overflow:hidden}.mesh-card:before{content:"";position:absolute;inset:-20%;background:conic-gradient(from 120deg,transparent,rgba(101,255,224,.25),transparent,rgba(255,236,137,.18),transparent);animation:spin 18s linear infinite;opacity:.8}.mesh-inner{position:relative;background:rgba(1,10,11,.74);border:1px solid rgba(255,255,255,.16);border-radius:28px;min-height:540px;padding:26px;overflow:hidden}.mesh-core{position:absolute;left:50%;top:45%;width:164px;height:164px;transform:translate(-50%,-50%);border-radius:50%;background:radial-gradient(circle,var(--gold),var(--aqua) 45%,#14252a 72%);display:grid;place-items:center;color:#031010;font-family:Georgia,serif;font-size:68px;box-shadow:0 0 80px rgba(101,255,224,.65)}.orbit{position:absolute;left:50%;top:45%;width:320px;height:320px;border:1px dashed rgba(255,255,255,.18);border-radius:50%;transform:translate(-50%,-50%);animation:spin 35s linear infinite}.orbit.o2{width:430px;height:430px;animation-duration:48s;animation-direction:reverse}.vnode{position:absolute;width:86px;height:62px;border:1px solid var(--line);border-radius:18px;background:rgba(3,18,20,.92);display:grid;place-items:center;text-align:center;font-weight:900;font-size:12px;box-shadow:0 12px 36px rgba(0,0,0,.25)}.vnode small{display:block;color:var(--muted);font-size:9px;font-weight:700}.v1{left:50%;top:6%;transform:translateX(-50%)}.v2{right:5%;top:24%}.v3{right:10%;bottom:22%}.v4{left:50%;bottom:5%;transform:translateX(-50%)}.v5{left:8%;bottom:22%}.v6{left:5%;top:24%}.v7{left:50%;top:80%;transform:translateX(-50%)}@keyframes spin{to{transform:translate(-50%,-50%) rotate(360deg)}}.statusbar{position:absolute;left:26px;right:26px;bottom:26px;display:grid;grid-template-columns:repeat(4,1fr);gap:10px}.metric{border:1px solid rgba(255,255,255,.16);border-radius:16px;padding:14px;background:rgba(255,255,255,.08)}.metric b{font-size:28px;color:var(--gold)}.metric span{display:block;color:var(--muted);font-size:10px;font-weight:900;letter-spacing:.16em;text-transform:uppercase}.section{max-width:1220px;margin:0 auto;padding:84px 32px}.lab{display:grid;grid-template-columns:minmax(320px,470px) minmax(0,1fr);gap:28px;align-items:start}.panel{border:1px solid rgba(255,255,255,.18);border-radius:28px;background:rgba(255,255,255,.08);box-shadow:var(--shadow);padding:26px}.panel h2{font-size:clamp(34px,5vw,70px);letter-spacing:-.07em;line-height:.88;margin:0 0 18px}.scenario-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.scenario,.candidate{border:1px solid rgba(255,255,255,.18);border-radius:18px;background:rgba(255,255,255,.07);padding:16px;cursor:pointer}.scenario.active,.candidate.active{border-color:var(--aqua);box-shadow:0 0 0 1px rgba(101,255,224,.25) inset}.candidate{display:grid;grid-template-columns:48px 1fr auto;gap:14px;align-items:center;margin-bottom:12px}.badge{width:48px;height:48px;border-radius:14px;background:rgba(101,255,224,.16);display:grid;place-items:center;color:var(--gold);font-weight:950}.result{font-size:11px;font-weight:950;letter-spacing:.12em;text-transform:uppercase;color:var(--aqua)}.result.bad{color:var(--red)}.trace{min-height:230px;border-radius:20px;border:1px solid rgba(101,255,224,.22);background:#000b0c;padding:18px;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;color:#cafff3;line-height:1.7;overflow:auto}.tabs{display:flex;flex-wrap:wrap;gap:10px;margin:16px 0}.tab{border:1px solid rgba(255,255,255,.22);background:rgba(255,255,255,.08);color:var(--text);border-radius:999px;padding:10px 14px;font-weight:900;cursor:pointer}.tab.active{background:var(--panel2);border-color:var(--aqua)}pre{white-space:pre-wrap;word-break:break-word;margin:0;border-radius:18px;background:#000b0c;border:1px solid rgba(255,255,255,.12);padding:18px;color:#dff;font-size:13px;line-height:1.55}.law{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px}.law .panel{min-height:260px}.law h3{font-size:36px;line-height:.95;letter-spacing:-.06em;margin:0 0 18px}.footer{border-top:1px solid var(--line);padding:44px 7vw;display:flex;justify-content:space-between;gap:32px;background:rgba(0,0,0,.42)}.footer p{color:var(--muted)}.footer nav{display:flex;gap:18px;flex-wrap:wrap}.footer a{color:var(--aqua);font-weight:900;text-decoration:none}.legal-rail{max-width:1120px;margin:26px auto 54px;border:1px solid var(--line);border-radius:999px;padding:12px 18px;background:rgba(0,0,0,.62);display:flex;align-items:center;justify-content:center;gap:12px;font-size:12px}.legal-rail strong{color:var(--gold)}.legal-rail a{margin-left:10px;border-radius:999px;padding:9px 14px;background:var(--lime);color:#001414;text-decoration:none;font-weight:900}@media(max-width:980px){.hero,.lab{grid-template-columns:1fr}.nav a:not(.cta){display:none}.mesh-card{min-height:520px}.law{grid-template-columns:1fr}.footer{flex-direction:column}.legal-rail{border-radius:24px;flex-direction:column;text-align:center}.statusbar{grid-template-columns:repeat(2,1fr)}}@media(max-width:620px){.hero,.section{padding-left:20px;padding-right:20px}h1{font-size:58px}.mesh-card{padding:12px}.mesh-inner{min-height:480px}.vnode{width:72px;height:54px;font-size:10px}.statusbar{left:14px;right:14px;bottom:14px}.scenario-grid{grid-template-columns:1fr}.candidate{grid-template-columns:40px 1fr}.top{padding:16px 20px}.brand small{display:none}}
`;

const page = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Validator Mesh & Falsification Lab — GoalOS Signoff Pro</title><meta name="description" content="A browser-local GoalOS demo showing how proof survives independent validators, negative controls, challenge windows, and falsification before it can support a decision."><style>${css}</style></head><body class="grid"><div class="stars" aria-hidden="true">${Array.from({length:38},(_,i)=>`<i style="left:${(i*37)%100}%;top:${(i*61)%100}%;animation-delay:${(i%9)*.37}s"></i>`).join('')}</div><header class="top"><a class="brand" href="index.html"><span class="sigil"></span><span>GoalOS Signoff Pro<small>Validator Mesh Lab</small></span></a><nav class="nav"><a href="browser-beta.html">Browser beta</a><a href="mission-001.html">Mission 001</a><a href="proof-gradient-lab.html">Selection gate</a><a href="capability-compounding-lab.html">Compounding</a><a href="governed-decision-state-lab.html">Decision state</a><a class="cta" href="#lab">Run verifier mesh</a></nav></header><main><section class="hero"><div><div class="eyebrow">Proof survives challenge</div><h1>Trust is not a score. <span class="grad">It is a mesh.</span></h1><p class="lead">GoalOS does not accept an AI deliverable because one evaluator is impressed. It asks a verifier mesh to attack the claim: source reality, support, contradiction, risk, replay, negative controls, and human authority boundary.</p><div class="claim">The public demonstration is simple: persuasive output fails; collusive-looking approval is quarantined; proof that survives diverse validators and challenge becomes decision-review ready.</div><div class="buttons"><a class="btn primary" href="#lab">Run verifier mesh</a><a class="btn" href="governed-decision-state-lab.html">Inspect decision state</a><a class="btn" href="evidence-docket-demo.html">Open evidence docket</a></div><div class="chips"><span class="chip">browser-local</span><span class="chip">no input</span><span class="chip">no upload</span><span class="chip">no wallet</span><span class="chip">no value moved</span></div></div><div class="mesh-card" aria-label="validator mesh visual"><div class="mesh-inner"><div class="orbit"></div><div class="orbit o2"></div><div class="mesh-core">α</div><div class="vnode v1">Source<small>reality</small></div><div class="vnode v2">Claims<small>support</small></div><div class="vnode v3">Contradict<small>register</small></div><div class="vnode v4">Replay<small>path</small></div><div class="vnode v5">Risk<small>ledger</small></div><div class="vnode v6">Negative<small>controls</small></div><div class="vnode v7">Human<small>gate</small></div><div class="statusbar"><div class="metric"><b id="m-quorum">0/7</b><span>quorum</span></div><div class="metric"><b id="m-false">0</b><span>false accepts blocked</span></div><div class="metric"><b id="m-proof">0%</b><span>proof integrity</span></div><div class="metric"><b id="m-result">Ready</b><span>state</span></div></div></div></div></section><section id="lab" class="section lab"><div class="panel"><div class="eyebrow">Browser-local lab</div><h2>Run the falsification gauntlet.</h2><p class="lead">Choose a synthetic mission class, then run every candidate through independent validators, commit-reveal records, negative controls, and challenge resolution.</p><div class="scenario-grid" id="scenarioGrid">${cfg.scenarios.map((s,i)=>`<button class="scenario ${i===0?'active':''}" data-scenario="${s.id}"><strong>${s.label}</strong><br><span>${s.riskClass}</span></button>`).join('')}</div><div class="buttons"><button class="btn primary" id="runBtn">Run all candidates</button><button class="btn" id="downloadBtn">Download demo bundle</button></div><div class="trace" id="trace">System ready. Awaiting validator mesh run.</div></div><div class="panel"><div class="eyebrow">Candidate docket</div><div id="candidateList">${cfg.candidates.map((c,i)=>`<article class="candidate ${i===0?'active':''}" data-candidate="${c.id}"><div class="badge">${c.id}</div><div><strong>${c.title}</strong><br><span>${c.reason}</span></div><div class="result ${c.result.includes('REJECT')||c.result.includes('QUARANTINE')?'bad':''}">${c.result}</div></article>`).join('')}</div><div class="tabs"><button class="tab active" data-tab="proof">Proof packet</button><button class="tab" data-tab="validators">Validator mesh</button><button class="tab" data-tab="falsification">Falsification</button><button class="tab" data-tab="challenge">Challenge</button><button class="tab" data-tab="decision">Decision</button></div><pre id="tabPane"></pre></div></section><section class="section"><div class="eyebrow">Institutional law</div><div class="law"><article class="panel"><h3>One validator is not authority.</h3><p>GoalOS separates source checks, claim support, contradiction, replay, risk, and human gate review. Agreement must survive independent roles.</p></article><article class="panel"><h3>Falsification is a feature.</h3><p>Negative controls, challenge windows, and replay attempts are not friction. They are what prevents convincing output from becoming trusted work.</p></article><article class="panel"><h3>Challenge becomes memory.</h3><p>Failed candidates are not wasted. They become warning memory: what was missing, what contradicted, and what cannot influence future missions.</p></article></div></section></main>${footer}${legalRail}<script id="validator-mesh-data" type="application/json">${JSON.stringify({cfg,artifacts}, null, 2).replace(/</g,'\\u003c')}</script><script>
(()=>{const data=JSON.parse(document.getElementById('validator-mesh-data').textContent);let scenario=data.cfg.scenarios[0].id;let candidate=data.cfg.candidates[0];const $=s=>document.querySelector(s);const $$=s=>Array.from(document.querySelectorAll(s));const panes={proof:()=>({candidate:candidate.id,title:candidate.title,proofIntegrity:candidate.proofIntegrity,traceRoot:'sha256:'+candidate.id.toLowerCase()+'9f3d4c2a',outputHash:'sha256:'+candidate.id.toLowerCase()+'bb71a09',replayPath:candidate.id==='C3'?'complete':'incomplete-or-held',valueMoved:0}),validators:()=>data.artifacts.diversity,falsification:()=>data.artifacts.falsification,challenge:()=>data.artifacts.challenge,decision:()=>({scenario,candidate:candidate.id,result:candidate.result,humanAuthority:'final gate preserved',institutionalMemory:candidate.id==='C3'?'admit as review-ready synthetic example':'preserve as warning; do not promote',automaticAuthority:false,valueMoved:0})};function renderTab(){const active=$('.tab.active').dataset.tab;$('#tabPane').textContent=JSON.stringify(panes[active](),null,2)}function setCandidate(id){candidate=data.cfg.candidates.find(c=>c.id===id)||data.cfg.candidates[0];$$('.candidate').forEach(x=>x.classList.toggle('active',x.dataset.candidate===id));renderTab()}async function run(){const trace=$('#trace');trace.textContent='';$('#m-result').textContent='Run';for(let i=0;i<data.cfg.candidates.length;i++){const c=data.cfg.candidates[i];setCandidate(c.id);$('#m-quorum').textContent=(i+2)+'/7';$('#m-proof').textContent=c.proofIntegrity+'%';$('#m-false').textContent=String(Math.min(i+1,3));trace.textContent+='\n'+c.id+' · '+c.title+' → '+c.result+' — '+c.reason;await new Promise(r=>setTimeout(r,520));}$('#m-quorum').textContent='7/7';$('#m-result').textContent='Gated';trace.textContent+='\n\nDecision: C3 is decision-review ready. C0-C2 do not become authority.';setCandidate('C3')}$$('.scenario').forEach(b=>b.addEventListener('click',()=>{$$('.scenario').forEach(x=>x.classList.remove('active'));b.classList.add('active');scenario=b.dataset.scenario;renderTab()}));$$('.candidate').forEach(c=>c.addEventListener('click',()=>setCandidate(c.dataset.candidate)));$$('.tab').forEach(t=>t.addEventListener('click',()=>{$$('.tab').forEach(x=>x.classList.remove('active'));t.classList.add('active');renderTab()}));$('#runBtn').addEventListener('click',run);$('#downloadBtn').addEventListener('click',()=>{const blob=new Blob([JSON.stringify(data.artifacts.bundle,null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='goalos-validator-mesh-demo-bundle.json';a.click();URL.revokeObjectURL(a.href)});renderTab();})();
</script></body></html>`;

fs.writeFileSync(path.join(site, 'validator-mesh-lab.html'), page);
fs.writeFileSync(path.join(site, 'falsification-lab.html'), page.replace(/<title>.*?<\/title>/, '<title>Falsification Lab — GoalOS Signoff Pro</title>'));

function injectHomepageRail(){
  const indexPath = path.join(site, 'index.html');
  if (!fs.existsSync(indexPath)) return;
  let html = fs.readFileSync(indexPath, 'utf8');
  if (html.includes('validator-mesh-lab.html')) return;
  const rail = `<section class="section validator-mesh-home-rail"><div class="panel"><div class="eyebrow">Verifier mesh</div><h2>Proof is not accepted. It is attacked first.</h2><p>Run a browser-local falsification lab: independent validators, negative controls, challenge windows, and a decision-ready proof package.</p><div class="buttons"><a class="btn primary" href="validator-mesh-lab.html">Run the validator mesh</a><a class="btn" href="falsification-lab.html">Open falsification lab</a></div></div></section>`;
  const footerIndex = html.search(/<footer\b/i);
  const mainClose = html.search(/<\/main>/i);
  if (mainClose !== -1) html = html.slice(0, mainClose) + rail + html.slice(mainClose);
  else if (footerIndex !== -1) html = html.slice(0, footerIndex) + rail + html.slice(footerIndex);
  else html += rail;
  fs.writeFileSync(indexPath, html);
}
injectHomepageRail();

console.log(`GoalOS Validator Mesh & Falsification Lab v${cfg.version} generated at ${site}`);
