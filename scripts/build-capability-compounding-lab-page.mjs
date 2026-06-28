#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = process.cwd();
const site = path.join(root, 'site');
const cfgPath = path.join(root, 'config', 'capability-compounding-lab.json');
const cfg = fs.existsSync(cfgPath) ? JSON.parse(fs.readFileSync(cfgPath, 'utf8')) : {
  version:'14.2.0-final-production',
  title:'GoalOS Capability Compounding Lab',
  slug:'capability-compounding-lab.html',
  thesis:'Accepted proof becomes reusable capability. Reusable capability makes the next mission cheaper, safer, faster, and more verifiable.',
  publicSiteRule:'No forms · no inputs · no uploads · no cookies · no analytics · no wallets · no payments · no personal or confidential data.',
  claimBoundary:'Synthetic browser-local public demonstration. No external audit, production certification, value movement, activated settlement, staking activation, empirical SOTA, or AGI/ASI attainment is claimed.',
  scenarios:[
    {id:'research',name:'AI research acceptance',mission:'Convert an AI research output into a bounded Evidence Docket and review-ready decision state.',risk:'medium',domain:'research'},
    {id:'software',name:'Software delivery review',mission:'Convert an AI-assisted implementation milestone into criteria-mapped evidence and a signed demo receipt.',risk:'medium',domain:'software'},
    {id:'security',name:'Defensive readiness packet',mission:'Convert a defensive, repo-owned security review into a public-safe proof packet and capability archive.',risk:'high',domain:'security'},
    {id:'policy',name:'Policy option proof',mission:'Convert competing policy options into a claims matrix, contradiction ledger, and governed decision state.',risk:'medium',domain:'policy'}
  ],
  cycles:[
    {id:'M1',name:'First governed decision',capability:'ClaimMatrixVerifier-v1',verifiedWork:62,proofDebt:38,costIndex:100,riskIndex:22,reuse:0,stage:'Mission contract → Evidence Docket → Selection Gate'},
    {id:'M2',name:'Reuse the proof pattern',capability:'EvidenceRoutingTemplate-v1',verifiedWork:77,proofDebt:24,costIndex:82,riskIndex:16,reuse:19,stage:'Prior capability → Faster docket assembly → Lower proof debt'},
    {id:'M3',name:'Harder mission with memory',capability:'ReplayReadyMissionDocket-v1',verifiedWork:88,proofDebt:11,costIndex:71,riskIndex:9,reuse:34,stage:'Chronicle memory → Capability package → Harder mission'}
  ],
  gates:['Mission Contract','Claims Matrix','Evidence Docket','Verifier Report','Risk Ledger','Selection Certificate','Chronicle Entry','Capability Package'],
  law:['No proof, no memory.','No eval, no propagation.','No replay, no capability.']
};

fs.mkdirSync(path.join(site, 'assets'), { recursive: true });
const out = rel => path.join(site, rel);
const esc = v => String(v).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const sha256 = v => crypto.createHash('sha256').update(typeof v === 'string' ? v : JSON.stringify(v)).digest('hex');
const write = (rel, text) => fs.writeFileSync(out(rel), text);

const scenarioBundles = cfg.scenarios.map((scenario, sidx) => {
  const offset = sidx * 3;
  const cycles = cfg.cycles.map((cycle, idx) => ({
    ...cycle,
    verifiedWork: Math.min(97, cycle.verifiedWork + offset),
    proofDebt: Math.max(4, cycle.proofDebt - offset),
    costIndex: Math.max(52, cycle.costIndex - offset * 2),
    riskIndex: Math.max(4, cycle.riskIndex - offset),
    mission_contract_hash: sha256(['mission', scenario.id, cycle.id, cycle.stage]),
    evidence_docket_hash: sha256(['docket', scenario.id, cycle.id, cycle.verifiedWork, cycle.proofDebt]),
    proof_packet_hash: sha256(['proof', scenario.id, cycle.id, cycle.capability]),
    selection_certificate_hash: sha256(['selection', scenario.id, cycle.id, 'accept_for_demo_chronicle']),
    chronicle_entry_id: `chronicle:${scenario.id}:${cycle.id}:accepted`,
    capability_package: {
      id: `${cycle.capability}:${scenario.id}`,
      initiation_condition: `future public-safe ${scenario.domain} mission with matching acceptance criteria`,
      proof_history: [`proof:${scenario.id}:${cycle.id}`],
      risk_boundary: scenario.risk,
      replay_path: `capability-compounding-lab.html#${scenario.id}-${cycle.id.toLowerCase()}`,
      reuse_scope: 'synthetic browser demonstration only'
    }
  }));
  return {
    scenario,
    cycles,
    metrics: {
      verified_work_start: cycles[0].verifiedWork,
      verified_work_end: cycles.at(-1).verifiedWork,
      proof_debt_start: cycles[0].proofDebt,
      proof_debt_end: cycles.at(-1).proofDebt,
      cost_index_start: cycles[0].costIndex,
      cost_index_end: cycles.at(-1).costIndex,
      risk_index_start: cycles[0].riskIndex,
      risk_index_end: cycles.at(-1).riskIndex,
      reuse_lift_points: cycles.at(-1).verifiedWork - cycles[0].verifiedWork,
      proof_debt_reduction_points: cycles[0].proofDebt - cycles.at(-1).proofDebt
    }
  };
});

const bundle = {
  schema: 'goalos.capability_compounding.interactive_demo_bundle.v2',
  version: cfg.version,
  generated_at: new Date(0).toISOString(),
  thesis: cfg.thesis,
  invariant: 'Only accepted proof becomes reusable capability; only reusable capability can influence harder future missions.',
  public_site_rule: cfg.publicSiteRule,
  claim_boundary: cfg.claimBoundary,
  scenarios: scenarioBundles,
  gates: cfg.gates,
  law: cfg.law,
  default_scenario: 'research'
};
const library = {
  schema: 'goalos.capability_library.interactive_public_demo.v2',
  admission_rule: 'ProofValid AND EvalPass AND RiskWithinBoundary AND RollbackReady AND ChallengeCleared AND HumanGatePreserved',
  capabilities: scenarioBundles.flatMap(s => s.cycles.map(c => c.capability_package))
};
const chronicle = {
  schema: 'goalos.chronicle.compounding_public_demo.v2',
  rule: 'Accepted work writes Chronicle entries; unsupported output does not become memory.',
  entries: scenarioBundles.flatMap(s => s.cycles.map(c => ({
    id: c.chronicle_entry_id,
    scenario: s.scenario.id,
    mission: c.id,
    accepted_capability: c.capability_package.id,
    evidence_docket_hash: c.evidence_docket_hash,
    selection_certificate_hash: c.selection_certificate_hash,
    value_moved: 0
  })))
};
const scoreboard = {
  schema: 'goalos.capability_compounding.scoreboard.v2',
  metrics: scenarioBundles.map(s => ({
    scenario: s.scenario.id,
    verifiedWork: `${s.metrics.verified_work_start}→${s.metrics.verified_work_end}`,
    proofDebt: `${s.metrics.proof_debt_start}→${s.metrics.proof_debt_end}`,
    costIndex: `${s.metrics.cost_index_start}→${s.metrics.cost_index_end}`,
    riskIndex: `${s.metrics.risk_index_start}→${s.metrics.risk_index_end}`,
    reusableCapabilities: s.cycles.length
  }))
};
write('capability-compounding-demo-bundle.json', JSON.stringify(bundle, null, 2));
write('capability-package-library.json', JSON.stringify(library, null, 2));
write('chronicle-compounding-entry.json', JSON.stringify(chronicle, null, 2));
write('capability-compounding-scoreboard.json', JSON.stringify(scoreboard, null, 2));
write('capability-compounding-manifest.json', JSON.stringify({
  page: cfg.slug,
  artifacts: ['capability-compounding-demo-bundle.json','capability-package-library.json','chronicle-compounding-entry.json','capability-compounding-scoreboard.json'],
  bundle_hash: sha256(bundle),
  generated_by: 'scripts/build-capability-compounding-lab-page.mjs',
  version: cfg.version,
  public_site_rule: cfg.publicSiteRule
}, null, 2));

const css = String.raw`
:root{--bg:#020807;--bg2:#061817;--panel:rgba(16,34,32,.76);--panel2:rgba(5,16,16,.92);--line:rgba(118,255,217,.34);--line2:rgba(255,237,138,.32);--mint:#78ffda;--cyan:#68e8ff;--gold:#ffed8a;--violet:#a792ff;--cream:#fff8ec;--muted:#b7cac8;--bad:#ff7d9c;--ok:#78ffda;--shadow:0 32px 90px rgba(0,0,0,.48),0 0 110px rgba(102,255,220,.12)}
*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;color:var(--cream);background:radial-gradient(circle at 74% 16%,rgba(81,255,218,.18),transparent 28%),radial-gradient(circle at 18% 88%,rgba(127,107,255,.16),transparent 32%),linear-gradient(180deg,#010403,#061816 58%,#020807);font-family:Inter,ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;overflow-x:hidden}body:before{content:"";position:fixed;inset:0;background-image:linear-gradient(rgba(255,255,255,.045) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.035) 1px,transparent 1px);background-size:72px 72px;mask-image:linear-gradient(to bottom,rgba(0,0,0,.84),rgba(0,0,0,.08));pointer-events:none}.stars{position:fixed;inset:0;pointer-events:none;opacity:.6;background-image:radial-gradient(circle at 8% 22%,var(--mint) 0 1px,transparent 2px),radial-gradient(circle at 82% 12%,var(--gold) 0 1px,transparent 2px),radial-gradient(circle at 68% 82%,var(--cyan) 0 1px,transparent 2px),radial-gradient(circle at 20% 66%,var(--violet) 0 1px,transparent 2px);background-size:410px 370px;animation:drift 18s linear infinite}.nav{position:sticky;top:0;z-index:50;display:flex;justify-content:space-between;align-items:center;padding:24px clamp(20px,5vw,72px);background:rgba(2,6,8,.84);border-bottom:1px solid var(--line);backdrop-filter:blur(18px)}.brand{display:flex;gap:14px;align-items:center;color:var(--cream);text-decoration:none;text-transform:uppercase;letter-spacing:.18em;font-size:12px;font-weight:950}.brand small{font-size:10px;color:var(--muted);letter-spacing:.28em}.mark{width:42px;height:42px;border-radius:14px;border:1px solid var(--line);background:radial-gradient(circle,var(--mint),#0a2a28 44%,#06100f 66%);box-shadow:0 0 36px rgba(118,255,217,.45)}.navlinks{display:flex;gap:18px;align-items:center;flex-wrap:wrap}.navlinks a{color:var(--cream);text-decoration:none;font-weight:900;font-size:13px}.navlinks .cta,.btn.primary{background:linear-gradient(135deg,var(--gold),var(--mint),var(--cyan));color:#02110e;border:0;box-shadow:0 14px 45px rgba(105,255,220,.26)}.navlinks .cta{border-radius:999px;padding:14px 21px}.wrap{width:min(1180px,calc(100% - 40px));margin:auto}.hero{min-height:calc(100vh - 92px);display:grid;grid-template-columns:minmax(0,1.02fr) minmax(380px,.98fr);gap:clamp(34px,6vw,82px);align-items:center;padding:clamp(78px,10vh,140px) 0}.eyebrow{display:flex;align-items:center;gap:14px;color:var(--mint);font-size:12px;font-weight:1000;text-transform:uppercase;letter-spacing:.42em}.eyebrow:before{content:"";width:48px;height:2px;background:var(--mint);box-shadow:0 0 18px var(--mint)}h1{font-size:clamp(56px,8.6vw,122px);line-height:.82;letter-spacing:-.078em;margin:28px 0 22px;max-width:780px}h2{font-size:clamp(44px,6.2vw,88px);line-height:.86;letter-spacing:-.066em;margin:16px 0 18px}h3{font-size:clamp(24px,2.2vw,34px);line-height:.96;letter-spacing:-.05em;margin:0 0 12px}.gradient{font-family:Georgia,serif;font-style:italic;font-weight:500;background:linear-gradient(90deg,var(--gold),var(--mint),var(--cyan),var(--violet));-webkit-background-clip:text;background-clip:text;color:transparent}.lead{font-size:clamp(18px,2.1vw,25px);line-height:1.45;color:#e6f4f2;max-width:720px}.small{color:var(--muted);line-height:1.55}.actions{display:flex;gap:14px;flex-wrap:wrap;margin:30px 0}.btn{appearance:none;border:1px solid rgba(255,255,255,.18);background:rgba(255,255,255,.09);color:var(--cream);border-radius:999px;padding:14px 20px;font-weight:1000;text-decoration:none;cursor:pointer}.btn:hover{transform:translateY(-1px);border-color:rgba(118,255,217,.58)}.chips,.metrics{display:flex;gap:11px;flex-wrap:wrap}.chip{padding:9px 13px;border:1px solid var(--line);border-radius:999px;background:rgba(3,14,13,.66);color:#d6fff5;text-transform:uppercase;letter-spacing:.11em;font-size:11px;font-weight:950}.stage{border:1px solid var(--line);background:linear-gradient(150deg,rgba(47,86,78,.78),rgba(5,18,17,.92));border-radius:36px;padding:26px;box-shadow:var(--shadow);position:relative;overflow:hidden}.stage:before{content:"";position:absolute;inset:-35%;background:conic-gradient(from 80deg,transparent,rgba(118,255,217,.24),transparent,rgba(255,237,138,.16),transparent);animation:spin 16s linear infinite;opacity:.55}.stage>*{position:relative}.capsule{border:1px solid rgba(255,255,255,.14);background:radial-gradient(circle at 50% 50%,rgba(118,255,217,.42),rgba(104,232,255,.12) 20%,rgba(255,237,138,.07) 42%,rgba(0,0,0,.22) 64%);border-radius:28px;min-height:360px;position:relative;display:grid;place-items:center;overflow:hidden}.core{width:142px;height:142px;border-radius:50%;display:grid;place-items:center;background:radial-gradient(circle,var(--gold),var(--mint) 45%,var(--cyan));color:#031410;font:italic 72px Georgia,serif;box-shadow:0 0 85px rgba(118,255,217,.58)}.orbitRing{position:absolute;border:1px dashed rgba(118,255,217,.28);border-radius:50%;animation:spin 22s linear infinite}.r1{width:230px;height:230px}.r2{width:310px;height:310px;animation-duration:31s;animation-direction:reverse}.node{position:absolute;border:1px solid var(--line);border-radius:16px;background:rgba(4,17,17,.92);padding:12px 14px;min-width:128px;text-align:center;box-shadow:0 0 26px rgba(118,255,217,.12);transition:.35s}.node b{display:block;color:var(--mint);font-size:12px}.node span{font-size:11px;color:var(--muted)}.node.active{border-color:var(--gold);box-shadow:0 0 30px rgba(255,237,138,.24)}.n1{left:30px;top:76px}.n2{right:36px;top:88px}.n3{left:48px;bottom:72px}.n4{right:46px;bottom:78px}.statGrid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-top:18px}.stat{border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.06);border-radius:20px;padding:16px}.stat strong{display:block;font-size:24px;color:var(--gold)}.stat span{font-size:10px;color:var(--muted);letter-spacing:.18em;text-transform:uppercase}.section{padding:80px 0}.panel,.tile{border:1px solid rgba(255,255,255,.16);background:var(--panel);border-radius:28px;padding:26px;box-shadow:0 18px 52px rgba(0,0,0,.22)}.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}.lab{display:grid;grid-template-columns:minmax(320px,.95fr) minmax(360px,1.05fr);gap:20px;align-items:start}.scenarioGrid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-top:22px}.scenario{border:1px solid rgba(118,255,217,.24);background:rgba(8,22,21,.78);border-radius:20px;padding:18px;text-align:left;color:var(--cream);cursor:pointer}.scenario b{display:block;color:var(--gold);font-size:13px}.scenario span{display:block;color:var(--muted);font-size:12px;margin-top:6px}.scenario.active{border-color:var(--mint);box-shadow:0 0 32px rgba(118,255,217,.18);transform:translateY(-2px)}.timeline{display:grid;gap:12px;margin-top:18px}.step{display:grid;grid-template-columns:54px 1fr 78px;gap:12px;align-items:center;border:1px solid rgba(255,255,255,.12);background:rgba(0,0,0,.18);border-radius:18px;padding:14px;transition:.35s}.step.done{border-color:rgba(118,255,217,.62);background:rgba(118,255,217,.09)}.step.active{border-color:rgba(255,237,138,.72);background:rgba(255,237,138,.08)}.step .id{color:var(--gold);font-weight:1000}.step .score{font-weight:1000;color:var(--mint)}.bar{height:10px;border-radius:999px;background:rgba(255,255,255,.09);border:1px solid rgba(255,255,255,.12);overflow:hidden;margin:14px 0}.bar i{display:block;height:100%;width:var(--w,0%);background:linear-gradient(90deg,var(--gold),var(--mint),var(--cyan));box-shadow:0 0 18px rgba(118,255,217,.35);transition:width .8s ease}.dials{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin:18px 0}.dial{aspect-ratio:1;border:1px solid rgba(118,255,217,.24);border-radius:50%;display:grid;place-items:center;background:conic-gradient(var(--mint) var(--value,0deg),rgba(255,255,255,.08) 0);position:relative}.dial:before{content:"";position:absolute;inset:12px;background:#061211;border-radius:50%}.dial span{position:relative;text-align:center;font-weight:1000}.dial small{display:block;color:var(--muted);font-size:9px;letter-spacing:.12em;text-transform:uppercase;margin-top:4px}.matrix{display:grid;gap:10px}.matrixRow{display:grid;grid-template-columns:1.2fr 1fr 1fr .9fr;gap:10px;align-items:center;border:1px solid rgba(255,255,255,.12);border-radius:16px;padding:12px;background:rgba(0,0,0,.15)}.matrixRow b{color:var(--gold)}.matrixRow strong{color:var(--mint)}.trace{white-space:pre-wrap;min-height:220px;max-height:360px;overflow:auto;border:1px solid rgba(255,255,255,.13);background:rgba(0,0,0,.42);border-radius:18px;padding:18px;color:#d7fff4;font:13px/1.5 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace}.tabs{display:flex;gap:10px;flex-wrap:wrap;margin:12px 0}.tab{border:1px solid rgba(255,255,255,.16);background:rgba(255,255,255,.07);color:var(--cream);border-radius:999px;padding:10px 14px;font-weight:900;cursor:pointer}.tab.active{border-color:var(--mint);color:#041411;background:var(--mint)}.law{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}.law .panel{min-height:190px}.num{color:var(--gold);font-weight:1000;letter-spacing:.16em}footer{border-top:1px solid rgba(118,255,217,.22);background:rgba(0,0,0,.55);display:flex;align-items:center;justify-content:space-between;gap:24px;padding:42px clamp(20px,5vw,72px);position:relative}footer p{color:var(--muted)}footer a{color:var(--mint);text-decoration:none;font-weight:900;margin-left:22px}.legal-rail{width:min(1100px,calc(100% - 40px));margin:24px auto 42px;border:1px solid var(--line);background:rgba(0,0,0,.6);border-radius:999px;padding:14px 22px;text-align:center;color:var(--cream);box-shadow:0 12px 40px rgba(0,0,0,.25)}.legal-rail b{color:var(--gold)}@keyframes spin{to{transform:rotate(360deg)}}@keyframes drift{to{background-position:410px 370px}}@media(max-width:980px){.hero,.lab{grid-template-columns:1fr}.grid,.scenarioGrid,.law{grid-template-columns:1fr}.statGrid,.dials{grid-template-columns:repeat(2,1fr)}.nav{position:relative;align-items:flex-start}.navlinks{justify-content:flex-end}.matrixRow{grid-template-columns:1fr}.capsule{min-height:320px}h1{font-size:clamp(54px,16vw,88px)}}@media(max-width:620px){.wrap{width:min(100% - 28px,1180px)}.nav{padding:18px}.navlinks a:not(.cta){display:none}.stage,.panel,.tile{border-radius:22px;padding:20px}.step{grid-template-columns:1fr}.legal-rail{border-radius:22px}.hero{padding-top:48px}.statGrid,.dials{grid-template-columns:1fr}footer{display:block}footer a{display:inline-block;margin:10px 14px 0 0}}
`;
write('assets/capability-compounding-v14-2.css', css.trim());

const js = `
(() => {
  const bundle = ${JSON.stringify(bundle)};
  const byId = Object.fromEntries(bundle.scenarios.map(s => [s.scenario.id, s]));
  let activeScenario = bundle.default_scenario;
  let running = false;
  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];
  const trace = $('[data-trace]');
  const output = $('[data-output]');
  const metric = name => $('[data-metric="' + name + '"]');
  const log = line => { if (trace) trace.textContent += '\\n' + line; };
  const setText = (name, value) => { const el = metric(name); if (el) el.textContent = value; };
  const scenario = () => byId[activeScenario] || bundle.scenarios[0];
  const formatDocket = (cycle) => JSON.stringify({
    scenario: activeScenario,
    mission: cycle.id,
    status: 'accepted_for_demo_chronicle',
    capability: cycle.capability_package.id,
    hashes: {
      missionContract: cycle.mission_contract_hash,
      proofPacket: cycle.proof_packet_hash,
      evidenceDocket: cycle.evidence_docket_hash,
      selectionCertificate: cycle.selection_certificate_hash
    },
    valueMoved: 0,
    publicBoundary: 'browser-local synthetic demonstration only'
  }, null, 2);
  function reset() {
    running = false;
    $$('.scenario').forEach(b => b.classList.toggle('active', b.dataset.scenario === activeScenario));
    $$('.step').forEach(s => s.classList.remove('active','done'));
    $$('.node').forEach(n => n.classList.remove('active'));
    const s = scenario();
    setText('scenario', s.scenario.name);
    setText('verified', s.metrics.verified_work_start + '→' + s.metrics.verified_work_end);
    setText('debt', s.metrics.proof_debt_start + '→' + s.metrics.proof_debt_end);
    setText('cost', s.metrics.cost_index_start + '→' + s.metrics.cost_index_end);
    setText('risk', s.metrics.risk_index_start + '→' + s.metrics.risk_index_end);
    $$('.dial').forEach((d, i) => {
      const vals = [s.metrics.verified_work_start, 100 - s.metrics.proof_debt_start, 100 - s.metrics.cost_index_start, 100 - s.metrics.risk_index_start];
      d.style.setProperty('--value', Math.round(vals[i] * 3.6) + 'deg');
    });
    if (trace) trace.textContent = 'System ready. Chronicle contains only accepted proof. Choose a scenario or run the compounding cycle.';
    if (output) output.textContent = JSON.stringify({status:'ready', scenario: s.scenario.id, data:'none', valueMoved:0}, null, 2);
  }
  function run() {
    if (running) return;
    running = true;
    reset();
    const s = scenario();
    log('• Mission series committed: ' + s.scenario.name);
    log('• Data posture: no user data, no upload, no wallet, no value movement.');
    s.cycles.forEach((cycle, idx) => {
      setTimeout(() => {
        const row = $('[data-step="' + cycle.id + '"]');
        const node = $('[data-node="' + (idx + 1) + '"]');
        row?.classList.add('active');
        node?.classList.add('active');
        log('• ' + cycle.id + ' ' + cycle.name + ': ' + cycle.stage);
        log('  proof packet ' + cycle.proof_packet_hash.slice(0, 12) + '… passed; capability admitted → ' + cycle.capability_package.id + '.');
        if (output) output.textContent = formatDocket(cycle);
        setText('verifiedNow', String(cycle.verifiedWork));
        setText('debtNow', String(cycle.proofDebt));
        setText('reuseNow', '+' + cycle.reuse);
        $$('.dial').forEach((d, i) => {
          const vals = [cycle.verifiedWork, 100 - cycle.proofDebt, 100 - cycle.costIndex, 100 - cycle.riskIndex];
          d.style.setProperty('--value', Math.round(vals[i] * 3.6) + 'deg');
        });
        setTimeout(() => { row?.classList.remove('active'); row?.classList.add('done'); }, 500);
      }, 480 + idx * 1050);
    });
    setTimeout(() => {
      log('• RESULT: accepted proof became Chronicle memory; memory produced reusable capability; the harder mission inherits only proof-carrying work.');
      running = false;
    }, 4050);
  }
  function download() {
    const s = scenario();
    const payload = { ...bundle, selected_scenario: s };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {type:'application/json'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'goalos-capability-compounding-demo-bundle-' + activeScenario + '.json';
    a.click();
    URL.revokeObjectURL(a.href);
  }
  $$('[data-scenario]').forEach(btn => btn.addEventListener('click', () => { activeScenario = btn.dataset.scenario; reset(); }));
  $$('[data-run]').forEach(btn => btn.addEventListener('click', run));
  $$('[data-reset]').forEach(btn => btn.addEventListener('click', reset));
  $$('[data-download]').forEach(btn => btn.addEventListener('click', download));
  $$('[data-tab]').forEach(btn => btn.addEventListener('click', () => {
    $$('.tab').forEach(t => t.classList.toggle('active', t === btn));
    const s = scenario();
    const last = s.cycles.at(-1);
    const views = {
      docket: formatDocket(last),
      library: JSON.stringify(s.cycles.map(c => c.capability_package), null, 2),
      chronicle: JSON.stringify(s.cycles.map(c => ({entry:c.chronicle_entry_id, capability:c.capability_package.id, evidence:c.evidence_docket_hash})), null, 2),
      score: JSON.stringify(s.metrics, null, 2)
    };
    if (output) output.textContent = views[btn.dataset.tab] || views.docket;
  }));
  reset();
})();
`;
write('assets/capability-compounding-v14-2.js', js.trim());

const scenarioButtons = cfg.scenarios.map(s => `<button class="scenario" data-scenario="${esc(s.id)}"><b>${esc(s.name)}</b><span>${esc(s.mission)}</span></button>`).join('\n');
const steps = cfg.cycles.map(c => `<div class="step" data-step="${esc(c.id)}"><div class="id">${esc(c.id)}</div><div><b>${esc(c.name)}</b><br><span class="small">${esc(c.capability)}</span></div><div class="score">${c.verifiedWork}</div></div>`).join('\n');
const matrixRows = cfg.cycles.map(c => `<div class="matrixRow"><b>${esc(c.id)}</b><span>${esc(c.stage)}</span><strong>${esc(c.capability)}</strong><span>${c.verifiedWork} work · ${c.proofDebt} debt</span></div>`).join('\n');
const gates = cfg.gates.map((g,i) => `<span class="chip">${String(i+1).padStart(2,'0')} ${esc(g)}</span>`).join('');
const laws = cfg.law.map((l,i) => `<article class="panel"><div class="num">0${i+1}</div><h3>${esc(l)}</h3><p class="small">GoalOS does not let unsupported output become durable institutional memory or future routing authority.</p></article>`).join('\n');
const nav = `<nav class="nav"><a class="brand" href="index.html"><span class="mark"></span><span>GoalOS Signoff Pro<br><small>Capability Compounding Lab</small></span></a><div class="navlinks"><a href="browser-beta.html">Browser beta</a><a href="mission-001.html">Mission 001</a><a href="proof-gradient-lab.html">Selection gate</a><a href="capability-compounding-lab.html">Compounding</a><a href="evidence-docket-demo.html">Evidence docket</a><a href="no-user-data.html">Data posture</a><a class="cta" href="capability-compounding-lab.html">Run the lab</a></div></nav>`;
const footer = `<footer><div><strong>GoalOS Signoff Pro</strong><p>Proof-to-acceptance · Evidence Dockets · Chronicle memory · reusable capability.</p></div><div><a href="privacy.html">Privacy</a><a href="terms.html">Terms</a><a href="no-user-data.html">No User Data</a><a href="agialpha-token-boundary.html">$AGIALPHA boundary</a></div></footer><div class="legal-rail" data-goalos-legal-rail="v12"><b>Public site rule</b> ${esc(cfg.publicSiteRule)}</div>`;
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(cfg.title)} · GoalOS Signoff Pro</title><meta name="description" content="Interactive browser-local GoalOS demonstration showing how accepted proof becomes Chronicle memory and reusable capability."><link rel="stylesheet" href="assets/capability-compounding-v14-2.css"></head><body><div class="stars"></div>${nav}<main>
<section class="hero wrap">
  <div>
    <div class="eyebrow">Verified experience becomes capability</div>
    <h1>Accepted proof becomes <span class="gradient">institutional memory.</span></h1>
    <p class="lead">${esc(cfg.thesis)} GoalOS does not let every output influence the next run. Only proof-carrying work that passes gates enters Chronicle and becomes reusable capability.</p>
    <div class="actions"><button class="btn primary" data-run>Run compounding cycle</button><a class="btn" href="mission-001.html">Inspect Mission 001</a><button class="btn" data-download>Download demo bundle</button></div>
    <div class="chips"><span class="chip">Browser-local</span><span class="chip">No input</span><span class="chip">No upload</span><span class="chip">No value moved</span></div>
  </div>
  <aside class="stage">
    <div class="capsule"><div class="orbitRing r1"></div><div class="orbitRing r2"></div><div class="core">α</div><div class="node n1" data-node="1"><b>Proof</b><span>claims bound</span></div><div class="node n2" data-node="2"><b>Gate</b><span>risk checked</span></div><div class="node n3" data-node="3"><b>Chronicle</b><span>accepted only</span></div><div class="node n4" data-node="4"><b>Capability</b><span>reusable</span></div></div>
    <div class="statGrid"><div class="stat"><strong data-metric="verified">62→88</strong><span>verified work</span></div><div class="stat"><strong data-metric="debt">38→11</strong><span>proof debt</span></div><div class="stat"><strong data-metric="cost">100→71</strong><span>cost index</span></div><div class="stat"><strong data-metric="risk">22→9</strong><span>risk index</span></div></div>
  </aside>
</section>
<section class="section wrap">
  <div class="eyebrow">Choose the public-safe mission series</div>
  <h2>Same proof law. Different work class.</h2>
  <p class="lead">Click a scenario, then run the cycle. The page changes its synthetic Evidence Docket, Chronicle entries, capability packages, and scoreboard entirely in your browser.</p>
  <div class="scenarioGrid">${scenarioButtons}</div>
</section>
<section class="section wrap lab" id="lab">
  <div class="panel">
    <div class="eyebrow">Browser lab</div>
    <h2>Watch proof become capability.</h2>
    <p class="lead"><span data-metric="scenario">AI research acceptance</span></p>
    <div class="dials"><div class="dial"><span><b data-metric="verifiedNow">62</b><small>verified</small></span></div><div class="dial"><span><b data-metric="debtNow">38</b><small>proof debt</small></span></div><div class="dial"><span><b data-metric="reuseNow">+0</b><small>reuse lift</small></span></div><div class="dial"><span><b>0</b><small>value moved</small></span></div></div>
    <div class="timeline">${steps}</div>
    <div class="actions"><button class="btn primary" data-run>Run again</button><button class="btn" data-reset>Reset</button><button class="btn" data-download>Download bundle</button></div>
  </div>
  <div class="panel">
    <h3>Evidence-state trace</h3>
    <pre class="trace" data-trace>System ready. Chronicle contains only accepted proof. Choose a scenario or run the compounding cycle.</pre>
    <div class="tabs"><button class="tab active" data-tab="docket">Docket</button><button class="tab" data-tab="library">Capability library</button><button class="tab" data-tab="chronicle">Chronicle</button><button class="tab" data-tab="score">Scoreboard</button></div>
    <pre class="trace" data-output>{"status":"ready","data":"none","valueMoved":0}</pre>
  </div>
</section>
<section class="section wrap">
  <div class="eyebrow">Transfer matrix</div>
  <h2>Every accepted mission leaves a reusable object.</h2>
  <div class="matrix">${matrixRows}</div>
</section>
<section class="section wrap">
  <div class="eyebrow">Hard gates</div>
  <h2>Score does not write memory. Gates do.</h2>
  <p class="lead">The page intentionally separates attractive output from institutional inheritance. The next mission can reuse only the part that survived the proof corridor.</p>
  <div class="chips">${gates}</div>
</section>
<section class="section wrap">
  <div class="eyebrow">The compact law</div>
  <h2>AI output is abundant. Verified experience is scarce.</h2>
  <div class="law">${laws}</div>
</section>
</main>${footer}<script src="assets/capability-compounding-v14-2.js"></script></body></html>`;
write(cfg.slug, html);

const homePath = out('index.html');
if (fs.existsSync(homePath)) {
  let home = fs.readFileSync(homePath, 'utf8');
  home = home.replace(/<section[^>]*capability-compounding-home-rail[\s\S]*?<\/section>/gi, '');
  if (!home.includes('capability-compounding-lab.html')) {
    const rail = `<section class="section wrap capability-compounding-home-rail" style="padding:80px 0"><div class="panel" style="border:1px solid rgba(118,255,217,.42);background:rgba(18,36,33,.75);border-radius:28px;padding:32px"><div class="eyebrow">Capability compounding</div><h2 style="font-size:clamp(42px,5vw,72px);line-height:.9;margin:14px 0">Accepted proof becomes reusable capability.</h2><p class="lead">Open the browser-local compounding lab: mission → evidence → selection → Chronicle → capability → harder mission.</p><div class="actions"><a class="btn primary" href="capability-compounding-lab.html">Open compounding lab</a><a class="btn" href="capability-compounding-demo-bundle.json">Download demo bundle</a></div></div></section>`;
    const footerIndex = home.search(/<footer\b/i);
    home = footerIndex >= 0 ? home.slice(0, footerIndex) + rail + home.slice(footerIndex) : home.replace('</main>', rail + '</main>');
    fs.writeFileSync(homePath, home);
  }
}

const sitemapPath = out('sitemap.xml');
const url = 'https://montrealai.github.io/goalos-signoff-pro/capability-compounding-lab.html';
if (fs.existsSync(sitemapPath)) {
  let sitemap = fs.readFileSync(sitemapPath, 'utf8');
  if (!sitemap.includes(url)) sitemap = sitemap.replace('</urlset>', `<url><loc>${url}</loc></url></urlset>`);
  fs.writeFileSync(sitemapPath, sitemap);
}

console.log(`GoalOS Capability Compounding Lab v14.2 generated at ${out(cfg.slug)}`);
