import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = process.cwd();
const siteDir = path.join(root, 'site');
const assetsDir = path.join(siteDir, 'assets');
const configPath = path.join(root, 'config', 'process-evidence-lab.json');
const fallbackConfigPath = path.join(path.dirname(new URL(import.meta.url).pathname), '..', 'config', 'process-evidence-lab.json');
const config = JSON.parse(fs.readFileSync(fs.existsSync(configPath) ? configPath : fallbackConfigPath, 'utf8'));
fs.mkdirSync(assetsDir, { recursive: true });

const now = new Date().toISOString();
const digest = obj => crypto.createHash('sha256').update(JSON.stringify(obj)).digest('hex');
const esc = value => String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const reviewReady = config.candidates.find(c => c.status === 'REVIEW_READY');

const traceSteps = [
  { step: '01', name: 'Mission Contract', reason: 'Bind objective, acceptance criteria, risk class, and claim boundary before work begins.', evidence: 'mission_contract_hash', validator: 'schema pass', rollback: 'return to objective' },
  { step: '02', name: 'Source Pass', reason: 'Separate primary, secondary, derived, and uncertain sources before claims are accepted.', evidence: 'source_provenance_root', validator: 'provenance pass', rollback: 'drop unsupported source' },
  { step: '03', name: 'Tool Scope', reason: 'Record what tools were allowed, blocked, used, and why.', evidence: 'tool_scope_ledger', validator: 'least-privilege pass', rollback: 'revoke tool path' },
  { step: '04', name: 'Claim Lineage', reason: 'Tie each material claim to evidence, process step, contradiction status, and uncertainty.', evidence: 'claim_lineage_map', validator: 'claim support pass', rollback: 'downgrade claim' },
  { step: '05', name: 'Contradiction Pass', reason: 'Prevent unresolved counterevidence from becoming institutional default.', evidence: 'contradiction_register', validator: 'contradiction resolved', rollback: 'hold decision' },
  { step: '06', name: 'Process Validator', reason: 'Validate process integrity, not just final wording.', evidence: 'process_validator_report', validator: 'mesh pass', rollback: 'challenge window' },
  { step: '07', name: 'Risk Ledger', reason: 'Surface remaining risk, uncertainty, reversibility, and human authority boundary.', evidence: 'risk_ledger', validator: 'risk bounded', rollback: 'escalate' },
  { step: '08', name: 'Receipt Pointer', reason: 'Emit a public-safe receipt pointer without exposing private workpapers.', evidence: 'mission_receipt_root', validator: 'receipt ready', rollback: 'revoke receipt' }
];

const publicArtifacts = {
  manifest: {
    id: config.id,
    version: config.version,
    generatedAt: now,
    primaryRoute: config.primaryRoute,
    aliases: config.aliases,
    claimBoundary: config.boundary.claimBoundary,
    canonicalDemoHash: `sha256:${digest({ candidates: config.candidates, traceSteps }).slice(0, 48)}`
  },
  traceLedger: {
    type: 'ActionReasonTraceLedger',
    rule: 'Final output is not enough. Each material process step must carry reason, scope, evidence, validation status, and rollback pointer.',
    candidateId: reviewReady.id,
    valueMoved: 0,
    noPrivateData: true,
    steps: traceSteps.map(step => ({
      ...step,
      evidenceRoot: `sha256:${digest(step).slice(0, 32)}`,
      publicPrivateBoundary: 'public-safe commitment only; private intelligence stays out of the public artifact'
    }))
  },
  claimLineage: {
    type: 'ClaimLineageMap',
    candidateId: reviewReady.id,
    claims: [
      { id: 'CL-001', claim: 'The deliverable is review-ready.', evidence: ['mission_contract_hash', 'source_provenance_root', 'process_validator_report'], status: 'supported', uncertainty: 'bounded' },
      { id: 'CL-002', claim: 'Material claims are linked to evidence.', evidence: ['claim_lineage_map', 'contradiction_register'], status: 'supported', uncertainty: 'bounded' },
      { id: 'CL-003', claim: 'Tool actions stayed inside declared scope.', evidence: ['tool_scope_ledger', 'action_reason_trace'], status: 'supported', uncertainty: 'bounded' },
      { id: 'CL-004', claim: 'Human authority remains final for acceptance.', evidence: ['risk_ledger', 'mission_receipt_root'], status: 'supported', uncertainty: 'explicit' }
    ],
    notClaimed: ['external audit', 'production certification', 'live settlement', 'mainnet proof', 'autonomous authority'],
    valueMoved: 0
  },
  toolScope: {
    type: 'ToolScopeLedger',
    allowed: ['public-safe source mapping', 'synthetic evidence assembly', 'schema validation', 'browser-local receipt replay'],
    blocked: ['private data ingestion', 'credential use', 'payment execution', 'wallet connection', 'external system mutation'],
    actual: ['source map', 'claim map', 'contradiction pass', 'process validator report', 'receipt pointer'],
    boundary: 'Tools are simulated and browser-local in the public demo.',
    valueMoved: 0
  },
  validatorReport: {
    type: 'ProcessValidatorReport',
    rule: 'Validate the work path, not only the final answer.',
    candidates: config.candidates.map(c => ({
      id: c.id,
      name: c.name,
      status: c.status,
      traceCompleteness: c.traceCompleteness,
      claimSupport: c.claimSupport,
      toolScope: c.toolScope,
      contradictionCoverage: c.contradictionCoverage,
      processIntegrity: c.processIntegrity,
      risk: c.risk,
      verdict: c.status === 'REVIEW_READY' ? 'decision-review ready' : c.status.toLowerCase(),
      reason: c.reason
    })),
    acceptedCandidate: reviewReady.id,
    valueMoved: 0
  }
};
publicArtifacts.bundle = {
  type: 'ProcessResolvedEvidenceDemoBundle',
  generatedAt: now,
  manifest: publicArtifacts.manifest,
  candidates: config.candidates,
  traceLedger: publicArtifacts.traceLedger,
  claimLineage: publicArtifacts.claimLineage,
  toolScope: publicArtifacts.toolScope,
  validatorReport: publicArtifacts.validatorReport,
  receipt: {
    type: 'ProcessEvidenceReceipt',
    candidateId: reviewReady.id,
    status: 'REVIEW_READY_SYNTHETIC_PUBLIC_DEMO',
    decisionState: 'human-review-ready',
    receiptRoot: `sha256:${digest({ reviewReady, traceSteps }).slice(0, 48)}`,
    valueMoved: 0,
    noUserData: true,
    noWallet: true
  }
};

const writeJson = (name, data) => fs.writeFileSync(path.join(siteDir, name), JSON.stringify(data, null, 2));
writeJson('process-evidence-manifest.json', publicArtifacts.manifest);
writeJson('action-reason-trace-ledger.json', publicArtifacts.traceLedger);
writeJson('claim-lineage-map.json', publicArtifacts.claimLineage);
writeJson('tool-scope-ledger.json', publicArtifacts.toolScope);
writeJson('process-validator-report.json', publicArtifacts.validatorReport);
writeJson('process-evidence-demo-bundle.json', publicArtifacts.bundle);

const css = `
:root{--bg:#020908;--panel:rgba(16,38,34,.78);--panel2:rgba(6,16,16,.9);--line:rgba(112,255,222,.32);--line2:rgba(255,238,144,.34);--text:#f6f0e6;--muted:#a7bdb8;--mint:#73ffd6;--cyan:#69e8ff;--gold:#fff08a;--violet:#a98cff;--red:#ff7b93;--shadow:0 30px 120px rgba(0,0,0,.55)}
*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:radial-gradient(circle at 70% 10%,rgba(58,255,210,.2),transparent 30%),radial-gradient(circle at 5% 90%,rgba(169,140,255,.13),transparent 35%),linear-gradient(135deg,#010606,#04100f 45%,#04191a);color:var(--text);font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;overflow-x:hidden}.bg-grid:before{content:"";position:fixed;inset:0;pointer-events:none;background-image:linear-gradient(rgba(255,255,255,.045) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.045) 1px,transparent 1px);background-size:54px 54px;mask-image:linear-gradient(to bottom,rgba(0,0,0,.8),transparent 95%)}.stars{position:fixed;inset:0;pointer-events:none;opacity:.65;background-image:radial-gradient(circle at 10% 20%,var(--mint) 1.5px,transparent 2px),radial-gradient(circle at 80% 25%,var(--gold) 1px,transparent 2px),radial-gradient(circle at 30% 75%,var(--cyan) 1.2px,transparent 2px),radial-gradient(circle at 60% 60%,var(--violet) 1px,transparent 2px);background-size:480px 480px;animation:drift 28s linear infinite}@keyframes drift{from{transform:translate3d(0,0,0)}to{transform:translate3d(-120px,80px,0)}}header{position:sticky;top:0;z-index:20;background:rgba(1,8,8,.84);backdrop-filter:blur(20px);border-bottom:1px solid var(--line)}.nav{max-width:1460px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;padding:24px 46px}.brand{display:flex;align-items:center;gap:14px;font-weight:900;letter-spacing:.18em;text-transform:uppercase;font-size:13px}.sig{width:42px;height:42px;border:1px solid var(--line);border-radius:14px;background:radial-gradient(circle,var(--mint),var(--cyan) 35%,transparent 70%);box-shadow:0 0 30px rgba(115,255,214,.5)}.navlinks{display:flex;gap:24px;align-items:center}.navlinks a,.button{color:var(--text);text-decoration:none;font-weight:850;font-size:13px}.pill{padding:12px 20px;border:1px solid rgba(255,255,255,.22);border-radius:999px;background:rgba(255,255,255,.07)}.primary{color:#02100e!important;background:linear-gradient(100deg,#efffa2,#64ffe4);box-shadow:0 15px 50px rgba(115,255,214,.25)}main{position:relative;z-index:1}.section{max-width:1180px;margin:0 auto;padding:110px 36px}.hero{display:grid;grid-template-columns:1.05fr .95fr;gap:72px;align-items:center;min-height:850px}.eyebrow{display:flex;gap:12px;align-items:center;color:var(--mint);font-weight:950;text-transform:uppercase;letter-spacing:.38em;font-size:12px}.eyebrow:before{content:"";width:44px;height:1px;background:var(--mint);box-shadow:0 0 20px var(--mint)}h1{font-size:clamp(66px,8vw,132px);line-height:.82;margin:26px 0 28px;letter-spacing:-.085em}.grad{font-family:Georgia,serif;font-style:italic;font-weight:600;background:linear-gradient(100deg,var(--gold),var(--mint),var(--cyan),var(--violet));-webkit-background-clip:text;color:transparent;letter-spacing:-.065em}.lead{font-size:22px;line-height:1.5;color:#e3f4f0;max-width:650px}.law{margin:30px 0;padding:24px;border:1px solid var(--line2);border-radius:24px;background:linear-gradient(135deg,rgba(255,240,138,.12),rgba(115,255,214,.08));font-weight:900;line-height:1.45}.actions{display:flex;gap:14px;flex-wrap:wrap;margin:28px 0}.button{border:0;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;padding:15px 22px;border-radius:999px;background:rgba(255,255,255,.09);border:1px solid rgba(255,255,255,.2)}.button.primary{font-size:14px}.tags{display:flex;flex-wrap:wrap;gap:10px;margin-top:24px}.tag{border:1px solid var(--line);border-radius:999px;padding:9px 14px;font-size:11px;font-weight:950;letter-spacing:.16em;text-transform:uppercase;color:#bfffee;background:rgba(5,26,23,.7)}.console{position:relative;border:1px solid var(--line);border-radius:32px;padding:30px;background:linear-gradient(145deg,rgba(28,61,55,.92),rgba(6,20,20,.92));box-shadow:var(--shadow);overflow:hidden}.console:before{content:"";position:absolute;inset:-40%;background:conic-gradient(from 120deg,transparent,var(--mint),transparent,var(--cyan),transparent);opacity:.15;animation:spin 18s linear infinite}@keyframes spin{to{transform:rotate(1turn)}}.console>*{position:relative}.orbit{height:310px;border:1px solid rgba(255,255,255,.12);border-radius:24px;background:radial-gradient(circle at center,rgba(115,255,214,.55),transparent 18%),radial-gradient(circle at center,rgba(105,232,255,.18),transparent 38%),rgba(0,0,0,.36);display:grid;place-items:center;overflow:hidden}.alpha{width:116px;height:116px;border-radius:50%;display:grid;place-items:center;background:radial-gradient(circle at 35% 35%,#efffa2,var(--mint) 35%,var(--cyan) 70%,#071010);color:#07100e;font-family:Georgia,serif;font-size:70px;font-weight:800;box-shadow:0 0 70px rgba(115,255,214,.5)}.node{position:absolute;border:1px solid var(--line);background:rgba(2,12,12,.88);border-radius:16px;padding:12px 15px;font-size:12px;font-weight:900;text-align:center;box-shadow:0 0 30px rgba(115,255,214,.18)}.n1{left:8%;top:18%}.n2{right:9%;top:20%}.n3{left:14%;bottom:20%}.n4{right:11%;bottom:19%}.metrics{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-top:18px}.metric{border:1px solid rgba(255,255,255,.14);border-radius:18px;padding:17px;background:rgba(0,0,0,.22)}.metric b{font-size:28px;color:var(--gold)}.metric span{display:block;font-size:10px;letter-spacing:.19em;text-transform:uppercase;color:var(--muted);font-weight:900}.lab{display:grid;grid-template-columns:.86fr 1.14fr;gap:28px;align-items:start}.card{border:1px solid rgba(255,255,255,.14);border-radius:28px;background:linear-gradient(145deg,rgba(24,42,42,.85),rgba(4,13,13,.86));box-shadow:var(--shadow);padding:28px}.card h2{font-size:clamp(44px,5vw,72px);line-height:.9;letter-spacing:-.065em;margin:8px 0 18px}.scenario-grid{display:grid;gap:10px;margin:22px 0}.scenario,.candidate,.tab{cursor:pointer;border:1px solid rgba(115,255,214,.27);border-radius:16px;background:rgba(115,255,214,.07);padding:15px;color:var(--text);text-align:left;font-weight:850}.scenario.active,.tab.active{background:rgba(115,255,214,.2);border-color:var(--mint);box-shadow:0 0 22px rgba(115,255,214,.15)}.trace{display:grid;gap:12px}.trace-step{display:grid;grid-template-columns:44px 1fr auto;gap:14px;align-items:center;border:1px solid rgba(255,255,255,.13);border-radius:18px;padding:14px;background:rgba(0,0,0,.2);transform:translateY(10px);opacity:.58;transition:.45s}.trace-step.live{border-color:var(--mint);box-shadow:0 0 28px rgba(115,255,214,.18);opacity:1;transform:translateY(0)}.trace-step.done{opacity:.92}.stepnum{color:var(--gold);font-weight:950}.status{font-size:10px;text-transform:uppercase;letter-spacing:.14em;color:var(--mint);font-weight:950}.candidate-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}.candidate{min-height:230px}.candidate b{display:block;color:var(--gold);font-size:13px;margin-bottom:8px}.candidate h3{font-size:26px;line-height:1;margin:8px 0 12px;letter-spacing:-.04em}.candidate p{color:#c8d7d3;line-height:1.45}.candidate.review{border-color:var(--mint);box-shadow:0 0 40px rgba(115,255,214,.22)}.candidate.reject{border-color:rgba(255,123,147,.38)}.bars{display:grid;gap:8px;margin-top:12px}.bar{height:9px;border-radius:999px;background:rgba(255,255,255,.1);overflow:hidden}.bar i{display:block;height:100%;width:var(--w);background:linear-gradient(90deg,var(--gold),var(--mint),var(--cyan))}.tabs{display:flex;flex-wrap:wrap;gap:10px;margin:0 0 16px}.tab{font-size:13px}.panel{min-height:280px;border:1px solid rgba(255,255,255,.13);border-radius:20px;background:rgba(0,0,0,.28);padding:22px}.code{font-family:"SFMono-Regular",Consolas,monospace;font-size:13px;line-height:1.65;white-space:pre-wrap;color:#cafff1}.footer{border-top:1px solid rgba(115,255,214,.25);background:rgba(0,0,0,.58);padding:42px 36px}.footer-inner{max-width:1180px;margin:0 auto;display:flex;justify-content:space-between;gap:30px;flex-wrap:wrap;color:#dff7f1}.footer a{color:var(--mint);text-decoration:none;font-weight:900}.rail{max-width:1180px;margin:0 auto 54px;border:1px solid var(--line);border-radius:999px;padding:13px 24px;text-align:center;background:rgba(0,0,0,.72);font-size:13px}.rail b{color:var(--gold)}@media(max-width:980px){.hero,.lab{grid-template-columns:1fr}.candidate-grid,.metrics{grid-template-columns:1fr 1fr}.nav{padding:18px}.navlinks{display:none}.section{padding:80px 22px}h1{font-size:64px}.trace-step{grid-template-columns:34px 1fr}.status{display:none}}@media(max-width:620px){.candidate-grid,.metrics{grid-template-columns:1fr}.card,.console{padding:20px}.orbit{height:240px}h1{font-size:52px}.lead{font-size:18px}}
`;
fs.writeFileSync(path.join(assetsDir, 'process-evidence-v27.css'), css);

const scenarioButtons = config.scenarios.map((s, i) => `<button class="scenario ${i === 0 ? 'active' : ''}" data-scenario="${esc(s.id)}"><strong>${esc(s.label)}</strong><br><span>${esc(s.objective)}</span></button>`).join('\n');
const candidatesHtml = config.candidates.map(c => `<article class="candidate ${c.status === 'REVIEW_READY' ? 'review' : c.status === 'REJECTED' ? 'reject' : ''}" data-candidate="${esc(c.id)}">
  <b>${esc(c.id)} · ${esc(c.status)}</b>
  <h3>${esc(c.name)}</h3>
  <p>${esc(c.summary)}</p>
  <div class="bars" aria-label="synthetic process metrics">
    <div class="bar"><i style="--w:${esc(c.traceCompleteness)}%"></i></div>
    <div class="bar"><i style="--w:${esc(c.processIntegrity)}%"></i></div>
  </div>
</article>`).join('\n');
const traceHtml = traceSteps.map(step => `<div class="trace-step" data-step="${esc(step.step)}"><span class="stepnum">${esc(step.step)}</span><div><strong>${esc(step.name)}</strong><br><small>${esc(step.reason)}</small></div><span class="status">waiting</span></div>`).join('\n');

const appData = JSON.stringify({ config, traceSteps, artifacts: publicArtifacts }, null, 2).replace(/</g, '\\u003c');

const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>GoalOS Signoff Pro — Process-Resolved Evidence Lab</title>
  <meta name="description" content="A browser-local GoalOS lab showing that final output is not enough: institutional work requires process-resolved evidence, tool scope, claim lineage, validators, risk, and receipt replay.">
  <link rel="stylesheet" href="assets/process-evidence-v27.css">
</head>
<body class="bg-grid">
<div class="stars" aria-hidden="true"></div>
<header><nav class="nav" aria-label="GoalOS navigation"><a class="brand" href="index.html"><span class="sig"></span><span>GoalOS Signoff Pro<br><small>Process-Resolved Evidence</small></span></a><div class="navlinks"><a href="browser-beta.html">Browser beta</a><a href="mission-001.html">Mission 001</a><a href="proof-gradient-lab.html">Selection gate</a><a href="capability-compounding-lab.html">Compounding</a><a href="independent-replay-lab.html">Replay</a><a href="mission-foundry-lab.html">Foundry</a><a class="pill primary" href="#lab">Run lab</a></div></nav></header>
<main>
  <section class="section hero">
    <div>
      <div class="eyebrow">Proof-native workbench</div>
      <h1>Final output is <span class="grad">not</span> proof.</h1>
      <p class="lead">GoalOS makes the work path inspectable: every material claim, tool action, contradiction, validator decision, risk boundary, rollback pointer, and receipt root becomes part of the review surface.</p>
      <div class="law">Process-resolved evidence is the difference between a persuasive answer and institution-ready work.</div>
      <div class="actions"><a class="button primary" href="#lab">Run process pass</a><a class="button" href="evidence-docket-demo.html">Inspect Evidence Docket</a><a class="button" href="governed-decision-state-lab.html">Decision State</a></div>
      <div class="tags"><span class="tag">Browser-local</span><span class="tag">No input</span><span class="tag">No upload</span><span class="tag">No wallet</span><span class="tag">No value moved</span></div>
    </div>
    <div class="console" aria-label="process evidence console">
      <div class="eyebrow">Institutional trace</div>
      <div class="orbit"><div class="alpha">α</div><div class="node n1">Claims<br>lineage</div><div class="node n2">Tool<br>scope</div><div class="node n3">Verifier<br>mesh</div><div class="node n4">Receipt<br>root</div></div>
      <div class="metrics"><div class="metric"><b id="mTrace">0</b><span>trace complete</span></div><div class="metric"><b id="mClaims">0</b><span>claim support</span></div><div class="metric"><b id="mRisk">100</b><span>hidden risk</span></div><div class="metric"><b id="mReady">0</b><span>review ready</span></div></div>
    </div>
  </section>
  <section class="section lab" id="lab">
    <div class="card">
      <div class="eyebrow">Choose public-safe scenario</div>
      <h2>Run the process gate.</h2>
      <p class="lead" style="font-size:18px">Nothing is submitted. The scenarios are synthetic and run completely in this browser page.</p>
      <div class="scenario-grid">${scenarioButtons}</div>
      <div class="actions"><button class="button primary" id="runLab">Run process pass</button><button class="button" id="resetLab">Reset</button><button class="button" id="downloadBundle">Download demo bundle</button></div>
    </div>
    <div class="card">
      <div class="eyebrow">Evidence-state trace</div>
      <div class="trace" id="traceList">${traceHtml}</div>
    </div>
  </section>
  <section class="section">
    <div class="eyebrow">Four candidates enter</div>
    <h1 style="font-size:clamp(52px,6vw,96px);max-width:1000px">Only the process-resolved artifact becomes decision-review ready.</h1>
    <div class="candidate-grid">${candidatesHtml}</div>
  </section>
  <section class="section">
    <div class="card">
      <div class="eyebrow">Evidence Docket view</div>
      <h2>Inspect the public-safe proof room.</h2>
      <div class="tabs"><button class="tab active" data-tab="trace">Trace ledger</button><button class="tab" data-tab="claims">Claim lineage</button><button class="tab" data-tab="tools">Tool scope</button><button class="tab" data-tab="validator">Validator report</button><button class="tab" data-tab="receipt">Receipt</button></div>
      <div class="panel"><div class="code" id="tabPanel"></div></div>
    </div>
  </section>
</main>
<footer class="footer" data-goalos-footer="canonical"><div class="footer-inner"><div><strong>GoalOS Signoff Pro</strong><br><span>AI-era work acceptance · process evidence · claim lineage · signed receipts.</span></div><div><a href="no-user-data.html">No User Data</a> &nbsp; <a href="privacy.html">Privacy</a> &nbsp; <a href="terms.html">Terms</a> &nbsp; <a href="agialpha-token-boundary.html">$AGIALPHA Boundary</a></div></div></footer>
<div class="rail" data-goalos-legal-rail="v12"><b>Public site rule</b> ${esc(config.boundary.publicRule)}</div>
<script>
const APP_DATA = ${appData};
const $ = sel => document.querySelector(sel);
const $$ = sel => [...document.querySelectorAll(sel)];
let activeScenario = APP_DATA.config.scenarios[0].id;
let running = false;
const artifactsByTab = {
  trace: APP_DATA.artifacts.traceLedger,
  claims: APP_DATA.artifacts.claimLineage,
  tools: APP_DATA.artifacts.toolScope,
  validator: APP_DATA.artifacts.validatorReport,
  receipt: APP_DATA.artifacts.bundle.receipt
};
function setPanel(tab){ $('#tabPanel').textContent = JSON.stringify(artifactsByTab[tab], null, 2); $$('.tab').forEach(b => b.classList.toggle('active', b.dataset.tab === tab)); }
setPanel('trace');
$$('.tab').forEach(b => b.addEventListener('click', () => setPanel(b.dataset.tab)));
$$('.scenario').forEach(b => b.addEventListener('click', () => { activeScenario = b.dataset.scenario; $$('.scenario').forEach(x => x.classList.toggle('active', x === b)); }));
function animateNumber(id, from, to, ms){ const el = document.getElementById(id); const start = performance.now(); function tick(t){ const p = Math.min(1, (t-start)/ms); const eased = 1 - Math.pow(1-p, 3); el.textContent = Math.round(from + (to-from)*eased); if(p<1) requestAnimationFrame(tick); } requestAnimationFrame(tick); }
function reset(){ running=false; $$('.trace-step').forEach(step => { step.classList.remove('live','done'); step.querySelector('.status').textContent='waiting'; }); ['mTrace','mClaims','mReady'].forEach(id => document.getElementById(id).textContent='0'); document.getElementById('mRisk').textContent='100'; }
function run(){ if(running) return; running=true; reset(); running=true; animateNumber('mTrace',0,96,2200); animateNumber('mClaims',0,94,2200); animateNumber('mRisk',100,12,2200); animateNumber('mReady',0,97,2200); const steps = $$('.trace-step'); steps.forEach((step,i)=> setTimeout(()=>{ step.classList.add('live'); step.querySelector('.status').textContent='checking'; setTimeout(()=>{ step.classList.remove('live'); step.classList.add('done'); step.querySelector('.status').textContent='passed'; if(i===steps.length-1) running=false; }, 560); }, i*340)); }
function downloadBundle(){ const scenario = APP_DATA.config.scenarios.find(s => s.id === activeScenario); const bundle = {...APP_DATA.artifacts.bundle, selectedScenario: scenario, downloadedAt: new Date().toISOString()}; const blob = new Blob([JSON.stringify(bundle,null,2)], {type:'application/json'}); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'goalos-process-evidence-demo-bundle.json'; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url); }
$('#runLab').addEventListener('click', run); $('#resetLab').addEventListener('click', reset); $('#downloadBundle').addEventListener('click', downloadBundle);
</script>
</body>
</html>`;

for (const route of [config.primaryRoute, ...config.aliases]) {
  fs.writeFileSync(path.join(siteDir, route), html);
}
console.log(`GoalOS Process-Resolved Evidence Lab v${config.version} generated ${1 + config.aliases.length} routes and ${config.publicArtifacts.length} artifacts at ${siteDir}`);
