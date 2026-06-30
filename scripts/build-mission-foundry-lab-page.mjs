import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = process.cwd();
const siteDir = path.join(root, 'site');
const configPath = path.join(root, 'config', 'mission-foundry-lab.json');
const fallbackConfigPath = path.join(path.dirname(new URL(import.meta.url).pathname), '..', 'config', 'mission-foundry-lab.json');
const config = JSON.parse(fs.readFileSync(fs.existsSync(configPath) ? configPath : fallbackConfigPath, 'utf8'));
fs.mkdirSync(siteDir, { recursive: true });

const now = new Date().toISOString();
const canonical = obj => JSON.stringify(obj, Object.keys(obj).sort(), 2);
const digest = obj => crypto.createHash('sha256').update(JSON.stringify(obj)).digest('hex');

const candidates = config.candidateSeeds.map(seed => {
  const missionPotential = Math.round((seed.interestingness * 0.22) + (seed.learnability * 0.22) + (seed.proofability * 0.28) + (seed.reuse * 0.18) - (seed.risk * 0.10));
  const proofDebt = Math.max(0, Math.round(100 - seed.proofability + seed.risk * 0.35));
  return { ...seed, missionPotential, proofDebt, evidenceRoot: `sha256:${digest(seed).slice(0, 32)}` };
});
const admitted = candidates.find(c => c.status === 'ADMITTED');

const publicArtifacts = {
  manifest: {
    id: config.id,
    version: config.version,
    generatedAt: now,
    primaryRoute: config.primaryRoute,
    aliases: config.aliases,
    claimBoundary: config.boundary.claimBoundary,
    canonicalDemoHash: `sha256:${digest({ candidates, scenarios: config.scenarios }).slice(0, 48)}`
  },
  curriculum: {
    id: 'generated-mission-curriculum-v26',
    source: 'accepted synthetic Evidence Docket + replay-ready claim boundary',
    objective: 'Generate harder public-safe follow-on missions only when they are learnable, proofable, validator-bounded, replayable, and safe to inspect.',
    stages: [
      'Accepted Evidence Docket',
      'Mission seed generation',
      'Interestingness filter',
      'Learnability check',
      'Validator availability',
      'Evidence requirement map',
      'Risk and rollback boundary',
      'Replay and challenge window',
      'Curriculum admission'
    ],
    admittedMission: admitted,
    candidates
  },
  certificate: {
    type: 'MissionSeedCertificate',
    candidateId: admitted.id,
    status: 'ADMITTED_FOR_PUBLIC_SAFE_DEMO_CURRICULUM',
    gates: {
      sourceAccepted: true,
      learnabilityBand: 'target-hard',
      proofRequirementsMapped: true,
      validatorAvailable: true,
      replayPath: true,
      riskBoundary: true,
      rollbackPlan: true,
      challengeWindow: true,
      claimBoundary: true,
      humanAuthority: 'final gate preserved'
    },
    nextMission: 'Mission 002 candidate — harder, replayable, bounded, public-safe follow-on mission',
    valueMoved: 0,
    evidenceRoot: admitted.evidenceRoot
  },
  filterReport: {
    type: 'InterestingnessFilterReport',
    rule: 'Interestingness is allocation pressure only. It is not admission authority.',
    admitted: candidates.filter(c => c.status === 'ADMITTED').map(c => c.id),
    held: candidates.filter(c => c.status === 'HELD').map(c => c.id),
    rejected: candidates.filter(c => c.status === 'REJECTED').map(c => c.id),
    quarantined: candidates.filter(c => c.status === 'QUARANTINED').map(c => c.id),
    reason: 'Mission seeds must be useful, learnable, proofable, bounded, replayable, and challengeable.'
  },
  quarantine: {
    type: 'MissionQuarantineLedger',
    entries: candidates.filter(c => c.status !== 'ADMITTED').map(c => ({
      candidateId: c.id,
      status: c.status,
      reason: c.reason,
      memoryRule: c.status === 'REJECTED' ? 'preserve as negative example, no mission authority' : 'preserve as warning, no production authority'
    })),
    noPrivateData: true,
    noValueMoved: true
  }
};

fs.writeFileSync(path.join(siteDir, 'mission-foundry-manifest.json'), JSON.stringify(publicArtifacts.manifest, null, 2));
fs.writeFileSync(path.join(siteDir, 'generated-mission-curriculum.json'), JSON.stringify(publicArtifacts.curriculum, null, 2));
fs.writeFileSync(path.join(siteDir, 'mission-seed-certificate.json'), JSON.stringify(publicArtifacts.certificate, null, 2));
fs.writeFileSync(path.join(siteDir, 'interestingness-filter-report.json'), JSON.stringify(publicArtifacts.filterReport, null, 2));
fs.writeFileSync(path.join(siteDir, 'mission-quarantine-ledger.json'), JSON.stringify(publicArtifacts.quarantine, null, 2));
fs.writeFileSync(path.join(siteDir, 'mission-foundry-demo-bundle.json'), JSON.stringify(publicArtifacts, null, 2));

const assetDir = path.join(siteDir, 'assets');
fs.mkdirSync(assetDir, { recursive: true });
fs.writeFileSync(path.join(assetDir, 'mission-foundry-v26.css'), `
:root{--bg:#020807;--panel:rgba(19,42,39,.78);--panel2:rgba(6,18,22,.86);--line:rgba(114,255,225,.34);--line2:rgba(255,232,127,.35);--text:#fff8ed;--muted:#b8c7c2;--mint:#67ffd7;--aqua:#6ee7ff;--gold:#fff08a;--violet:#b8a2ff;--red:#ff8fa3;--shadow:0 32px 120px rgba(63,255,210,.17)}
*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:radial-gradient(circle at 78% 22%,rgba(80,255,216,.24),transparent 34%),radial-gradient(circle at 18% 80%,rgba(138,108,255,.16),transparent 34%),linear-gradient(135deg,#020807,#031413 48%,#050914);color:var(--text);font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;min-height:100vh;overflow-x:hidden}.grid-bg{position:fixed;inset:0;pointer-events:none;background-image:linear-gradient(rgba(255,255,255,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.04) 1px,transparent 1px);background-size:72px 72px;mask-image:linear-gradient(to bottom,rgba(0,0,0,.95),rgba(0,0,0,.22));z-index:-3}.aurora{position:fixed;inset:-20%;background:conic-gradient(from 210deg,transparent,rgba(103,255,215,.18),rgba(184,162,255,.16),rgba(255,240,138,.12),transparent);filter:blur(60px);animation:spin 28s linear infinite;z-index:-4}.stars{position:fixed;inset:0;pointer-events:none;z-index:-2;background-image:radial-gradient(circle at 12% 18%,var(--mint) 1px,transparent 2px),radial-gradient(circle at 30% 76%,var(--gold) 1px,transparent 2px),radial-gradient(circle at 82% 40%,var(--aqua) 1px,transparent 2px),radial-gradient(circle at 68% 88%,var(--violet) 1px,transparent 2px);opacity:.75}.topbar{position:sticky;top:0;z-index:40;display:flex;justify-content:space-between;align-items:center;gap:24px;padding:22px 5vw;background:rgba(2,8,9,.84);backdrop-filter:blur(18px);border-bottom:1px solid var(--line)}.brand{display:flex;align-items:center;gap:14px;text-decoration:none;color:var(--text);font-weight:900;letter-spacing:.18em;text-transform:uppercase;font-size:12px}.sigil{width:40px;height:40px;border-radius:14px;border:1px solid var(--line);background:radial-gradient(circle,var(--aqua),var(--mint) 27%,rgba(9,29,31,.9) 58%);box-shadow:0 0 32px rgba(103,255,215,.55)}.brand span{display:block;color:var(--muted);font-size:10px;letter-spacing:.2em}.nav{display:flex;gap:20px;align-items:center;flex-wrap:wrap}.nav a{color:var(--text);text-decoration:none;font-size:13px;font-weight:800}.nav a.active,.pill{border:1px solid rgba(255,255,255,.16);background:rgba(255,255,255,.08);border-radius:999px;padding:10px 15px}.cta{display:inline-flex;align-items:center;justify-content:center;padding:14px 20px;border-radius:999px;background:linear-gradient(115deg,var(--gold),var(--mint),var(--aqua));color:#04100e;text-decoration:none;font-weight:950;box-shadow:0 18px 50px rgba(103,255,215,.24);border:0;cursor:pointer}.wrap{width:min(1180px,calc(100vw - 38px));margin:0 auto}.hero{min-height:calc(100vh - 86px);display:grid;grid-template-columns:1.05fr .95fr;gap:52px;align-items:center;padding:90px 0 60px}.eyebrow{color:var(--mint);font-weight:950;letter-spacing:.36em;text-transform:uppercase;font-size:12px;display:flex;align-items:center;gap:12px}.eyebrow:before{content:"";width:44px;height:1px;background:var(--mint);box-shadow:0 0 18px var(--mint)}h1{font-size:clamp(56px,8vw,126px);line-height:.82;letter-spacing:-.075em;margin:24px 0 26px;max-width:780px}.gradient{font-family:Georgia,serif;font-style:italic;font-weight:500;background:linear-gradient(110deg,var(--gold),var(--mint),var(--aqua),var(--violet));-webkit-background-clip:text;background-clip:text;color:transparent;letter-spacing:-.05em}.lead{font-size:clamp(18px,2vw,26px);line-height:1.35;color:#e9f7f1;max-width:680px}.callout{border:1px solid var(--line2);background:linear-gradient(120deg,rgba(255,240,138,.12),rgba(103,255,215,.08));border-radius:24px;padding:20px 22px;margin:28px 0;box-shadow:var(--shadow)}.callout strong{color:var(--gold);letter-spacing:.16em;text-transform:uppercase;font-size:13px}.actions{display:flex;gap:14px;flex-wrap:wrap;margin:26px 0}.secondary{background:rgba(255,255,255,.09);color:var(--text);border:1px solid rgba(255,255,255,.18)}.chips{display:flex;gap:10px;flex-wrap:wrap;margin-top:18px}.chip{border:1px solid var(--line);border-radius:999px;padding:9px 12px;color:#dffff8;font-size:12px;font-weight:900;letter-spacing:.13em;text-transform:uppercase;background:rgba(4,18,18,.7)}.console{border:1px solid var(--line);border-radius:34px;background:linear-gradient(145deg,rgba(63,96,85,.65),rgba(8,20,22,.92));padding:24px;box-shadow:var(--shadow);position:relative;overflow:hidden}.console:before{content:"";position:absolute;inset:-30%;background:radial-gradient(circle at 64% 42%,rgba(103,255,215,.28),transparent 22%),radial-gradient(circle at 36% 72%,rgba(255,240,138,.12),transparent 24%);animation:pulse 5s ease-in-out infinite alternate}.console-inner{position:relative;display:grid;grid-template-columns:1fr 1fr;gap:16px}.node-field{grid-row:span 2;min-height:370px;border-radius:28px;background:rgba(0,9,11,.82);border:1px solid rgba(255,255,255,.1);position:relative;overflow:hidden}.alpha{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:136px;height:136px;border-radius:999px;background:radial-gradient(circle,var(--gold),var(--mint) 38%,var(--aqua));display:grid;place-items:center;color:#07120f;font-size:74px;font-family:Georgia,serif;font-weight:900;box-shadow:0 0 70px rgba(103,255,215,.55)}.orbit{position:absolute;inset:42px;border:1px dashed rgba(103,255,215,.28);border-radius:50%;animation:spin 14s linear infinite}.orbit.o2{inset:78px;border-color:rgba(255,240,138,.28);animation-duration:19s;animation-direction:reverse}.mini{position:absolute;border:1px solid var(--line);background:rgba(3,18,20,.9);border-radius:16px;padding:12px;min-width:122px;text-align:center;font-weight:900;font-size:13px}.mini span{display:block;color:var(--muted);font-size:10px;margin-top:4px}.m1{left:32px;top:70px}.m2{right:32px;top:90px}.m3{left:44px;bottom:72px}.m4{right:40px;bottom:70px}.gate{border:1px solid var(--line);border-radius:20px;background:rgba(4,22,20,.72);padding:16px;min-height:130px}.gate b{display:block;color:var(--gold);font-size:20px;margin-bottom:8px}.gate h3{margin:0 0 7px;font-size:19px}.gate p{margin:0;color:var(--muted);font-size:14px;line-height:1.35}.section{padding:82px 0}.panel{border:1px solid var(--line);border-radius:34px;background:linear-gradient(145deg,rgba(20,48,44,.82),rgba(4,13,16,.9));box-shadow:var(--shadow);padding:30px;overflow:hidden}.lab-grid{display:grid;grid-template-columns:.95fr 1.05fr;gap:22px}.scenario-row{display:flex;gap:10px;flex-wrap:wrap;margin:18px 0 22px}.scenario{border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.07);color:var(--text);border-radius:999px;padding:12px 14px;font-weight:900;cursor:pointer}.scenario.active{border-color:var(--mint);color:#06130f;background:linear-gradient(115deg,var(--gold),var(--mint),var(--aqua))}.mission-path{display:grid;gap:10px;margin-top:18px}.step{display:flex;align-items:center;gap:12px;border:1px solid rgba(255,255,255,.12);background:rgba(0,9,12,.55);border-radius:16px;padding:13px}.step .num{width:32px;height:32px;border-radius:50%;display:grid;place-items:center;background:rgba(103,255,215,.12);border:1px solid var(--line);color:var(--gold);font-weight:950}.step.on{border-color:var(--mint);box-shadow:0 0 28px rgba(103,255,215,.18)}.seed-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}.seed{border:1px solid rgba(255,255,255,.14);border-radius:22px;background:rgba(4,16,18,.72);padding:17px;position:relative;transition:.35s ease}.seed h3{margin:8px 0 8px;font-size:24px;line-height:1}.seed small{color:var(--gold);font-weight:950;letter-spacing:.18em}.seed p{color:var(--muted);line-height:1.35}.seed.active{transform:translateY(-4px);border-color:var(--mint);box-shadow:0 22px 60px rgba(103,255,215,.16)}.status{display:inline-flex;border-radius:999px;padding:7px 10px;font-size:11px;font-weight:950;letter-spacing:.12em;border:1px solid rgba(255,255,255,.14)}.ADMITTED{color:#04100e;background:linear-gradient(115deg,var(--gold),var(--mint));}.HELD{color:var(--gold);background:rgba(255,240,138,.12)}.REJECTED{color:#ffd5dd;background:rgba(255,143,163,.12)}.QUARANTINED{color:var(--violet);background:rgba(184,162,255,.12)}.bars{display:grid;gap:8px;margin-top:12px}.bar{height:8px;background:rgba(255,255,255,.09);border-radius:99px;overflow:hidden}.bar i{display:block;height:100%;width:0;background:linear-gradient(90deg,var(--gold),var(--mint),var(--aqua));transition:width 1s ease}.trace{font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;background:rgba(0,7,9,.76);border:1px solid rgba(103,255,215,.24);border-radius:22px;padding:18px;min-height:230px;white-space:pre-wrap;color:#d9fff4;line-height:1.6}.artifact-tabs{display:flex;gap:10px;flex-wrap:wrap;margin:16px 0}.tab{border:1px solid rgba(255,255,255,.16);background:rgba(255,255,255,.08);color:var(--text);border-radius:999px;padding:10px 13px;font-weight:900;cursor:pointer}.tab.active{border-color:var(--mint);color:#06130f;background:linear-gradient(115deg,var(--mint),var(--aqua))}.jsonbox{font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;background:#02090b;border:1px solid rgba(103,255,215,.24);border-radius:22px;padding:18px;min-height:260px;overflow:auto;white-space:pre-wrap;color:#d9fff4}.ribbon{border:1px solid var(--line);border-radius:24px;padding:18px;background:rgba(0,8,10,.62);display:flex;justify-content:space-between;gap:18px;flex-wrap:wrap;margin-top:24px}.metric{min-width:140px}.metric strong{display:block;color:var(--gold);font-size:32px}.metric span{color:var(--muted);font-size:12px;letter-spacing:.14em;text-transform:uppercase;font-weight:900}.footer{border-top:1px solid rgba(103,255,215,.22);background:rgba(0,4,6,.86);padding:40px 5vw;display:flex;justify-content:space-between;gap:24px;flex-wrap:wrap}.footer a{color:var(--mint);text-decoration:none;font-weight:900;margin-right:18px}.legal-rail{width:min(980px,calc(100vw - 38px));margin:28px auto;border:1px solid var(--line);border-radius:999px;background:rgba(0,7,9,.84);padding:12px 18px;display:flex;justify-content:center;align-items:center;gap:14px;box-shadow:0 10px 44px rgba(103,255,215,.13);font-size:13px;text-align:center}.legal-rail b{color:var(--gold)}@keyframes spin{to{transform:rotate(360deg)}}@keyframes pulse{from{opacity:.75;transform:scale(1)}to{opacity:1;transform:scale(1.04)}}@media(max-width:920px){.hero,.lab-grid{grid-template-columns:1fr}.console-inner,.seed-grid{grid-template-columns:1fr}.node-field{min-height:330px}.nav{display:none}h1{font-size:clamp(54px,18vw,88px)}.footer{display:block}.legal-rail{border-radius:28px;display:block;line-height:1.7}.topbar{padding:18px 4vw}.hero{padding-top:55px}}`);

const jsonSafe = data => JSON.stringify(data).replace(/</g, '\\u003c');
const page = (route) => `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>GoalOS Signoff Pro — Proof-Gated Mission Foundry & Curriculum Lab</title>
<meta name="description" content="A browser-local GoalOS demo showing how accepted proof becomes harder, safer, proof-gated future missions.">
<link rel="stylesheet" href="assets/mission-foundry-v26.css">
</head>
<body>
<div class="grid-bg"></div><div class="aurora"></div><div class="stars"></div>
<header class="topbar">
  <a class="brand" href="index.html"><span class="sigil"></span><div>GoalOS Signoff Pro<span>Mission Foundry Lab</span></div></a>
  <nav class="nav" aria-label="GoalOS demos">
    <a href="browser-beta.html">Browser beta</a><a href="mission-001.html">Mission 001</a><a href="independent-replay-lab.html">Replay</a><a class="active" href="mission-foundry-lab.html">Mission foundry</a><a href="evidence-docket-demo.html">Docket</a><a href="agialpha.html">$AGIALPHA</a><a href="no-user-data.html">Data posture</a>
  </nav>
  <a class="cta" href="#lab">Run foundry</a>
</header>
<main>
<section class="hero wrap">
  <div>
    <div class="eyebrow">Proof-gated mission generation</div>
    <h1>Accepted proof becomes the next <span class="gradient">harder mission.</span></h1>
    <p class="lead">GoalOS does not generate tasks for spectacle. It turns accepted evidence into harder public-safe missions only when they are learnable, proofable, validator-bounded, replayable, and safe to inspect.</p>
    <div class="callout"><strong>The foundry law</strong><p>Interestingness is allocation pressure. Proof gates are admission authority.</p></div>
    <div class="actions"><a class="cta" href="#lab">Forge next mission</a><a class="cta secondary" href="mission-001.html">Inspect Mission 001</a><a class="cta secondary" href="independent-replay-lab.html">Replay council</a></div>
    <div class="chips"><span class="chip">Browser-local</span><span class="chip">No input</span><span class="chip">No upload</span><span class="chip">No value moved</span></div>
  </div>
  <aside class="console" aria-label="Proof-gated mission foundry console">
    <div class="console-inner">
      <div class="node-field"><div class="orbit"></div><div class="orbit o2"></div><div class="alpha">α</div><div class="mini m1">Accepted proof<span>source</span></div><div class="mini m2">Mission seed<span>candidate</span></div><div class="mini m3">Validator<span>available</span></div><div class="mini m4">Replay path<span>required</span></div></div>
      <div class="gate"><b>01</b><h3>Accepted experience</h3><p>The foundry starts from proof-cleared public-safe experience.</p></div>
      <div class="gate"><b>02</b><h3>Generated mission seed</h3><p>Candidate missions are created, then attacked by proof gates.</p></div>
      <div class="gate"><b>03</b><h3>Curriculum admission</h3><p>Only bounded, replayable, challengeable missions enter the queue.</p></div>
      <div class="gate"><b>04</b><h3>Harder mission</h3><p>The next mission must improve the evidence frontier, not inflate claims.</p></div>
    </div>
  </aside>
</section>
<section class="section wrap" id="lab">
  <div class="panel">
    <div class="eyebrow">Browser-local lab</div>
    <h2 style="font-size:clamp(42px,6vw,84px);line-height:.9;letter-spacing:-.06em;margin:22px 0">Generate the next mission. Then gate it.</h2>
    <p class="lead">Choose a scenario. The browser will create four synthetic mission seeds and admit only the one that can produce public-safe proof.</p>
    <div class="scenario-row" id="scenarios"></div>
    <div class="actions"><button class="cta" id="runBtn" type="button">Run foundry gate</button><button class="cta secondary" id="downloadBtn" type="button">Download demo bundle</button></div>
    <div class="lab-grid">
      <div>
        <div class="mission-path" id="path"></div>
        <div class="trace" id="trace">System ready. Accepted proof awaits mission foundry pass.</div>
      </div>
      <div class="seed-grid" id="seeds"></div>
    </div>
    <div class="ribbon"><div class="metric"><strong id="admittedMetric">0</strong><span>Admitted mission</span></div><div class="metric"><strong id="quarantineMetric">0</strong><span>Quarantine entries</span></div><div class="metric"><strong id="proofMetric">0%</strong><span>Proofability</span></div><div class="metric"><strong id="riskMetric">—</strong><span>Risk boundary</span></div></div>
  </div>
</section>
<section class="section wrap">
  <div class="panel">
    <div class="eyebrow">Inspectable artifacts</div>
    <h2 style="font-size:clamp(40px,5vw,76px);line-height:.9;letter-spacing:-.06em;margin:20px 0">A mission seed is admitted only with receipts.</h2>
    <div class="artifact-tabs" id="tabs"></div>
    <pre class="jsonbox" id="jsonbox"></pre>
  </div>
</section>
</main>
<footer class="footer" data-goalos-footer="canonical">
  <div><strong>GoalOS Signoff Pro</strong><p>AI-era work acceptance · mission foundry · evidence review · signed receipts · reusable capability.</p></div>
  <div><a href="mission-foundry-lab.html">Mission foundry</a><a href="mission-001.html">Mission 001</a><a href="no-user-data.html">No User Data</a><a href="privacy.html">Privacy</a><a href="terms.html">Terms</a><a href="agialpha-token-boundary.html">$AGIALPHA Boundary</a></div>
</footer>
<div class="legal-rail" data-goalos-legal-rail="v12"><b>Public site rule</b> No forms · no inputs · no uploads · no cookies · no analytics · no wallets · no payments · no personal or confidential data.</div>
<script>
const CONFIG=${jsonSafe(config)};
const ARTIFACTS=${jsonSafe(publicArtifacts)};
const candidates=${jsonSafe(candidates)};
let selected=CONFIG.scenarios[0].id;
const qs=s=>document.querySelector(s);
const pathSteps=['Accepted Evidence Docket','Mission seed generation','Interestingness filter','Learnability check','Validator availability','Evidence requirement map','Risk + rollback boundary','Replay + challenge window','Curriculum admission'];
function scenario(){return CONFIG.scenarios.find(s=>s.id===selected)||CONFIG.scenarios[0];}
function renderScenarios(){qs('#scenarios').innerHTML=CONFIG.scenarios.map(s=>'<button type="button" class="scenario '+(s.id===selected?'active':'')+'" data-scenario="'+s.id+'">'+s.label+'</button>').join('');document.querySelectorAll('[data-scenario]').forEach(b=>b.addEventListener('click',()=>{selected=b.dataset.scenario;renderScenarios();reset();}));}
function renderPath(active=-1){qs('#path').innerHTML=pathSteps.map((s,i)=>'<div class="step '+(i<=active?'on':'')+'"><span class="num">'+String(i+1).padStart(2,'0')+'</span><b>'+s+'</b></div>').join('');}
function renderSeeds(active=-1){qs('#seeds').innerHTML=candidates.map((c,i)=>'<article class="seed '+(i===active?'active':'')+'"><small>'+c.id+'</small><span class="status '+c.status+'">'+c.status+'</span><h3>'+c.name+'</h3><p>'+c.reason+'</p><div class="bars"><div>Proofability '+c.proofability+'<div class="bar"><i style="width:'+(i<=active?c.proofability:0)+'%"></i></div></div><div>Mission potential '+c.missionPotential+'<div class="bar"><i style="width:'+(i<=active?Math.max(0,c.missionPotential):0)+'%"></i></div></div><div>Proof debt '+c.proofDebt+'<div class="bar"><i style="width:'+(i<=active?Math.min(100,c.proofDebt):0)+'%"></i></div></div></div></article>').join('');}
function renderTabs(){const tabs=[['manifest','Manifest'],['curriculum','Curriculum'],['certificate','Seed certificate'],['filterReport','Filter report'],['quarantine','Quarantine ledger']];qs('#tabs').innerHTML=tabs.map((t,i)=>'<button type="button" class="tab '+(i===0?'active':'')+'" data-tab="'+t[0]+'">'+t[1]+'</button>').join('');document.querySelectorAll('[data-tab]').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('.tab').forEach(x=>x.classList.remove('active'));b.classList.add('active');qs('#jsonbox').textContent=JSON.stringify(ARTIFACTS[b.dataset.tab],null,2);}));qs('#jsonbox').textContent=JSON.stringify(ARTIFACTS.manifest,null,2);}
function reset(){renderPath(-1);renderSeeds(-1);qs('#trace').textContent='System ready. '+scenario().objective;qs('#admittedMetric').textContent='0';qs('#quarantineMetric').textContent='0';qs('#proofMetric').textContent='0%';qs('#riskMetric').textContent='—';}
function run(){reset();let i=0;const lines=['Mission class: '+scenario().missionClass,'Source: accepted synthetic Evidence Docket','Rule: interestingness can allocate attention, but cannot admit a mission.'];const timer=setInterval(()=>{renderPath(i);renderSeeds(Math.min(i,candidates.length-1));const seed=candidates[Math.min(i,candidates.length-1)];lines.push(seed.id+' '+seed.status+' — '+seed.reason);qs('#trace').textContent=lines.join('\\n');if(i>=pathSteps.length-1){clearInterval(timer);const admitted=candidates.find(c=>c.status==='ADMITTED');qs('#admittedMetric').textContent='1';qs('#quarantineMetric').textContent=String(candidates.filter(c=>c.status!=='ADMITTED').length);qs('#proofMetric').textContent=admitted.proofability+'%';qs('#riskMetric').textContent='Bounded';lines.push('MISSION SEED CERTIFICATE EMITTED: '+admitted.id);lines.push('Next: '+scenario().nextMission);qs('#trace').textContent=lines.join('\\n');}i++;},420);}
function download(){const blob=new Blob([JSON.stringify(ARTIFACTS,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='goalos-mission-foundry-demo-bundle.json';document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(url);}
renderScenarios();renderPath(-1);renderSeeds(-1);renderTabs();reset();qs('#runBtn').addEventListener('click',run);qs('#downloadBtn').addEventListener('click',download);
</script>
</body>
</html>`;

const routes = [config.primaryRoute, ...config.aliases];
for (const route of routes) fs.writeFileSync(path.join(siteDir, route), page(route));

function insertHomepageRail() {
  const indexPath = path.join(siteDir, 'index.html');
  if (!fs.existsSync(indexPath)) return;
  let html = fs.readFileSync(indexPath, 'utf8');
  if (html.includes('mission-foundry-lab.html')) return;
  const rail = `<section class="section wrap" data-goalos-module="mission-foundry-v26"><div class="panel"><div class="eyebrow">Mission Foundry</div><h2 style="font-size:clamp(38px,5vw,70px);line-height:.92;letter-spacing:-.06em;margin:18px 0">Accepted proof becomes the next harder mission.</h2><p class="lead">Run a browser-local foundry pass: generate mission seeds, reject unproofable ideas, quarantine risky candidates, and admit only the bounded replayable mission.</p><div class="actions"><a class="cta" href="mission-foundry-lab.html">Open Mission Foundry</a><a class="cta secondary" href="generated-mission-curriculum.json">Inspect curriculum JSON</a></div></div></section>`;
  const footerIndex = html.indexOf('<footer');
  if (footerIndex >= 0) html = html.slice(0, footerIndex) + rail + html.slice(footerIndex);
  else html += rail;
  fs.writeFileSync(indexPath, html);
}
insertHomepageRail();
console.log(`GoalOS Mission Foundry Lab v26 generated ${routes.length} routes and ${config.publicArtifacts.length} artifacts at ${siteDir}`);
