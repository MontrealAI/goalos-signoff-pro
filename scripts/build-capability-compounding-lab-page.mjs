import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = process.cwd();
const site = path.join(root, 'site');
const cfgPath = path.join(root, 'config', 'capability-compounding-lab.json');
const cfg = fs.existsSync(cfgPath) ? JSON.parse(fs.readFileSync(cfgPath, 'utf8')) : {
  version: '14.0.0-final',
  title: 'GoalOS Capability Compounding Lab',
  slug: 'capability-compounding-lab.html',
  thesis: 'Accepted proof becomes reusable capability. Reusable capability makes the next mission cheaper, safer, and more verifiable.',
  publicSiteRule: 'No forms · no inputs · no uploads · no cookies · no analytics · no wallets · no payments · no personal or confidential data.',
  claimBoundary: 'Synthetic browser-local demonstration. No AGI/ASI attainment, empirical SOTA, external audit, settlement activation, staking activation, production certification, or value movement is claimed.',
  missions: [
    { id:'M1', name:'First governed decision', objective:'Turn an AI research output into a reviewable Evidence Docket.', acceptedCapability:'ClaimMatrixVerifier-v1', verifiedWork:62, proofDebt:38, costIndex:100, riskIndex:22 },
    { id:'M2', name:'Reuse the proof pattern', objective:'Use the prior capability to review a harder software delivery package.', acceptedCapability:'EvidenceRoutingTemplate-v1', verifiedWork:77, proofDebt:24, costIndex:82, riskIndex:16 },
    { id:'M3', name:'Harder mission with memory', objective:'Apply the Chronicle and capability package to a multi-agent coordination benchmark packet.', acceptedCapability:'ReplayReadyMissionDocket-v1', verifiedWork:88, proofDebt:11, costIndex:71, riskIndex:9 }
  ],
  gates: ['Mission Contract','Evidence Docket','Verifier Report','Risk Ledger','Selection Certificate','Chronicle Entry','Capability Package']
};

fs.mkdirSync(path.join(site, 'assets'), { recursive: true });

function sha256(value) {
  return crypto.createHash('sha256').update(typeof value === 'string' ? value : JSON.stringify(value)).digest('hex');
}
function esc(value) {
  return String(value).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
}
function write(name, text) {
  fs.writeFileSync(path.join(site, name), text);
}

const bundle = {
  schema: 'goalos.capability_compounding.demo_bundle.v1',
  version: cfg.version,
  claim_boundary: cfg.claimBoundary,
  public_site_rule: cfg.publicSiteRule,
  thesis: cfg.thesis,
  generated_at: new Date(0).toISOString(),
  invariant: 'Only accepted proof becomes reusable capability.',
  missions: cfg.missions.map((m, index) => ({
    ...m,
    mission_contract_hash: sha256(['mission', m.id, m.objective]),
    evidence_docket_hash: sha256(['docket', m.id, m.verifiedWork, m.proofDebt]),
    selection_certificate: {
      decision: 'accept_for_demo_chronicle',
      gate_count: cfg.gates.length,
      rollback_ready: true,
      scope: 'browser-local synthetic public demonstration'
    },
    chronicle_entry: `chronicle:${m.id}:accepted:${index + 1}`,
    capability_package: {
      id: m.acceptedCapability,
      initiation_condition: 'future public-safe demo mission with matching acceptance criteria',
      reuse_scope: 'synthetic browser demonstration only',
      replay_path: `capability-compounding-lab.html#${m.id.toLowerCase()}`
    }
  })),
  metrics: {
    verified_work_start: cfg.missions[0].verifiedWork,
    verified_work_end: cfg.missions[cfg.missions.length - 1].verifiedWork,
    proof_debt_start: cfg.missions[0].proofDebt,
    proof_debt_end: cfg.missions[cfg.missions.length - 1].proofDebt,
    synthetic_reuse_lift_points: cfg.missions[cfg.missions.length - 1].verifiedWork - cfg.missions[0].verifiedWork,
    synthetic_proof_debt_reduction_points: cfg.missions[0].proofDebt - cfg.missions[cfg.missions.length - 1].proofDebt
  }
};

const capabilityLibrary = {
  schema: 'goalos.capability_library.public_demo.v1',
  capabilities: bundle.missions.map(m => m.capability_package),
  admission_rule: 'ProofValid AND EvalPass AND RiskWithinBoundary AND RollbackReady AND ChallengeCleared'
};
const chronicle = {
  schema: 'goalos.chronicle.public_demo.v1',
  entries: bundle.missions.map(m => ({ id: m.chronicle_entry, mission: m.id, capability: m.acceptedCapability, evidenceDocketHash: m.evidence_docket_hash }))
};

write('capability-compounding-demo-bundle.json', JSON.stringify(bundle, null, 2));
write('capability-package-library.json', JSON.stringify(capabilityLibrary, null, 2));
write('chronicle-compounding-entry.json', JSON.stringify(chronicle, null, 2));
write('capability-compounding-manifest.json', JSON.stringify({
  page: 'capability-compounding-lab.html',
  artifacts: ['capability-compounding-demo-bundle.json','capability-package-library.json','chronicle-compounding-entry.json'],
  bundle_hash: sha256(bundle),
  generated_by: 'scripts/build-capability-compounding-lab-page.mjs',
  version: cfg.version
}, null, 2));

const css = `
:root{--bg:#030807;--panel:rgba(18,36,33,.72);--panel2:rgba(14,27,27,.92);--line:rgba(108,255,220,.35);--line2:rgba(255,231,121,.32);--mint:#76ffd9;--cyan:#68e8ff;--gold:#ffed8a;--cream:#fff8ec;--muted:#b9cbc8;--bad:#ff7d9c;--shadow:0 28px 90px rgba(0,0,0,.45),0 0 90px rgba(103,255,220,.08)}
*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:radial-gradient(circle at 70% 12%,rgba(73,255,218,.18),transparent 28%),radial-gradient(circle at 22% 78%,rgba(130,121,255,.13),transparent 34%),linear-gradient(180deg,#020604,#061817 55%,#030807);color:var(--cream);font-family:Inter,ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;overflow-x:hidden}body:before{content:"";position:fixed;inset:0;background-image:linear-gradient(rgba(255,255,255,.045) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.035) 1px,transparent 1px);background-size:74px 74px;mask-image:linear-gradient(to bottom,rgba(0,0,0,.85),rgba(0,0,0,.15));pointer-events:none}.nav{position:sticky;top:0;z-index:40;display:flex;align-items:center;justify-content:space-between;padding:24px clamp(20px,5vw,72px);border-bottom:1px solid var(--line);background:rgba(2,6,8,.82);backdrop-filter:blur(18px)}.brand{display:flex;gap:14px;align-items:center;text-decoration:none;color:var(--cream);font-weight:900;letter-spacing:.18em;text-transform:uppercase;font-size:13px}.mark{width:42px;height:42px;border-radius:14px;border:1px solid var(--line);background:radial-gradient(circle,var(--mint),#0c1d20 55%,#071011);box-shadow:0 0 34px rgba(118,255,217,.45)}.navlinks{display:flex;gap:18px;align-items:center;flex-wrap:wrap}.navlinks a{color:var(--cream);text-decoration:none;font-weight:850;font-size:13px;opacity:.92}.navlinks .cta,.btn.primary{background:linear-gradient(135deg,var(--gold),var(--mint),var(--cyan));color:#02100d;border:0;box-shadow:0 12px 40px rgba(105,255,220,.25)}.navlinks .cta{padding:14px 22px;border-radius:999px}.wrap{width:min(1160px,calc(100% - 40px));margin:auto}.hero{min-height:calc(100vh - 90px);display:grid;grid-template-columns:minmax(0,1.03fr) minmax(360px,.97fr);gap:clamp(32px,6vw,76px);align-items:center;padding:clamp(72px,10vh,140px) 0}.eyebrow{display:flex;align-items:center;gap:14px;color:var(--mint);font-size:12px;font-weight:950;text-transform:uppercase;letter-spacing:.42em}.eyebrow:before{content:"";width:46px;height:2px;background:var(--mint);box-shadow:0 0 18px var(--mint)}h1{font-size:clamp(54px,8.3vw,118px);line-height:.82;letter-spacing:-.075em;margin:28px 0 24px;max-width:760px}.gradient{font-family:Georgia,serif;font-style:italic;font-weight:500;background:linear-gradient(90deg,var(--gold),var(--mint),var(--cyan),#a995ff);-webkit-background-clip:text;background-clip:text;color:transparent}.lead{font-size:clamp(18px,2.2vw,26px);line-height:1.42;color:#e6f4f2;max-width:690px}.actions{display:flex;gap:14px;flex-wrap:wrap;margin:34px 0}.btn{appearance:none;border:1px solid rgba(255,255,255,.18);background:rgba(255,255,255,.09);color:var(--cream);text-decoration:none;border-radius:999px;padding:15px 22px;font-weight:950;cursor:pointer}.chips,.metrics{display:flex;gap:12px;flex-wrap:wrap}.chip{padding:10px 14px;border:1px solid var(--line);border-radius:999px;color:#cffff3;font-size:12px;font-weight:900;letter-spacing:.08em;text-transform:uppercase;background:rgba(3,14,13,.68)}.console{position:relative;border:1px solid var(--line);border-radius:34px;background:linear-gradient(150deg,rgba(48,86,78,.8),rgba(8,19,18,.92));padding:24px;box-shadow:var(--shadow);overflow:hidden}.console:before{content:"";position:absolute;inset:-30%;background:conic-gradient(from 100deg,transparent,rgba(118,255,217,.28),transparent,rgba(255,237,138,.2),transparent);animation:spin 14s linear infinite;opacity:.55}.console>*{position:relative}.orbit{height:330px;border-radius:28px;border:1px solid rgba(255,255,255,.14);background:radial-gradient(circle at center,rgba(118,255,217,.55),rgba(104,232,255,.16) 18%,rgba(255,237,138,.08) 36%,rgba(0,0,0,.2) 58%,rgba(0,0,0,.35));display:grid;place-items:center;overflow:hidden}.core{width:128px;height:128px;border-radius:50%;display:grid;place-items:center;background:radial-gradient(circle,var(--gold),var(--mint) 45%,var(--cyan));color:#031410;font-size:64px;font-family:Georgia,serif;box-shadow:0 0 70px rgba(118,255,217,.58)}.node{position:absolute;border:1px solid var(--line);border-radius:16px;background:rgba(4,17,17,.92);padding:12px 14px;min-width:122px;text-align:center;box-shadow:0 0 24px rgba(118,255,217,.12)}.node b{display:block;color:var(--mint);font-size:12px}.node span{font-size:11px;color:var(--muted)}.n1{left:30px;top:80px}.n2{right:36px;top:95px}.n3{left:52px;bottom:68px}.n4{right:42px;bottom:76px}.cards{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:24px}.card,.panel{border:1px solid rgba(255,255,255,.17);background:var(--panel);border-radius:22px;padding:22px}.card strong{display:block;color:var(--gold);font-size:26px}.card span{color:var(--muted);font-size:12px;text-transform:uppercase;letter-spacing:.16em;font-weight:900}.section{padding:90px 0}.section h2{font-size:clamp(42px,6vw,82px);line-height:.88;letter-spacing:-.06em;margin:18px 0}.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}.mission{position:relative;min-height:360px}.mission .num{color:var(--gold);font-weight:950;letter-spacing:.18em}.mission h3{font-size:30px;line-height:1;margin:12px 0}.bar{height:10px;border-radius:999px;background:rgba(255,255,255,.08);overflow:hidden;margin:15px 0}.bar i{display:block;height:100%;width:var(--w);background:linear-gradient(90deg,var(--mint),var(--cyan),var(--gold));border-radius:inherit}.lab{display:grid;grid-template-columns:1fr 1fr;gap:20px;align-items:stretch}.trace{min-height:330px;background:#020a09;border:1px solid rgba(118,255,217,.28);border-radius:20px;padding:20px;color:#caffe9;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:13px;line-height:1.7}.ledger{display:grid;gap:12px}.ledger-row{display:grid;grid-template-columns:120px 1fr auto;gap:12px;align-items:center;border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.055);border-radius:18px;padding:14px}.ledger-row b{color:var(--gold)}.legal-rail{width:min(980px,calc(100% - 40px));margin:50px auto 42px;padding:14px 24px;border:1px solid var(--line);border-radius:999px;background:rgba(2,10,10,.86);text-align:center;color:#cfeeea;font-size:13px}.legal-rail b{color:var(--gold)}footer{border-top:1px solid rgba(118,255,217,.22);background:rgba(0,0,0,.35);padding:42px clamp(20px,5vw,72px);display:flex;justify-content:space-between;gap:28px;flex-wrap:wrap}footer a{color:var(--mint);text-decoration:none;font-weight:850;margin-right:18px}@keyframes spin{to{transform:rotate(360deg)}}@media (max-width:960px){.hero,.lab{grid-template-columns:1fr}.grid,.cards{grid-template-columns:1fr}.nav{position:relative}.navlinks{display:none}h1{font-size:clamp(52px,16vw,78px)}.console{border-radius:24px}.orbit{height:300px}.node{position:static;margin:8px;display:inline-block}.n1,.n2,.n3,.n4{left:auto;right:auto;top:auto;bottom:auto}}
`;
fs.writeFileSync(path.join(site, 'assets', 'capability-compounding-v14.css'), css.trim());

const js = `
(() => {
  const missions = ${JSON.stringify(bundle.missions)};
  const trace = document.querySelector('[data-compounding-trace]');
  const rows = [...document.querySelectorAll('[data-compounding-row]')];
  const output = document.querySelector('[data-compounding-output]');
  const run = document.querySelector('[data-compounding-run]');
  const reset = document.querySelector('[data-compounding-reset]');
  const download = document.querySelector('[data-compounding-download]');
  const bundle = ${JSON.stringify(bundle)};
  const log = (line) => { if (trace) trace.textContent += '\\n' + line; };
  const setOutput = (mission) => { if (!output) return; output.textContent = JSON.stringify({ mission: mission.id, acceptedCapability: mission.acceptedCapability, verifiedWork: mission.verifiedWork, proofDebt: mission.proofDebt, chronicle: mission.chronicle_entry, valueMoved: 0 }, null, 2); };
  const resetAll = () => { if (trace) trace.textContent = 'System ready. Capability memory empty. Awaiting first mission.'; rows.forEach(r => r.style.borderColor = 'rgba(255,255,255,.12)'); if (output) output.textContent = JSON.stringify({ status: 'ready', data: 'none', valueMoved: 0 }, null, 2); };
  run?.addEventListener('click', () => {
    resetAll();
    missions.forEach((m, idx) => {
      setTimeout(() => {
        rows[idx]?.style.setProperty('border-color','rgba(118,255,217,.78)');
        log('• ' + m.id + ' committed: ' + m.name);
        log('  proof packet checked; verifier report passed; risk ledger within boundary.');
        log('  accepted capability → ' + m.acceptedCapability + '; Chronicle updated.');
        setOutput(m);
      }, 500 + idx * 950);
    });
    setTimeout(() => log('• Result: verified work rises, proof debt falls, future mission inherits only accepted proof.'), 3550);
  });
  reset?.addEventListener('click', resetAll);
  download?.addEventListener('click', () => {
    const blob = new Blob([JSON.stringify(bundle, null, 2)], {type:'application/json'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'goalos-capability-compounding-demo-bundle.json';
    a.click();
    URL.revokeObjectURL(a.href);
  });
  resetAll();
})();
`;
fs.writeFileSync(path.join(site, 'assets', 'capability-compounding-v14.js'), js.trim());

const nav = `
<nav class="nav"><a class="brand" href="index.html"><span class="mark"></span><span>GoalOS Signoff Pro<br><small>Capability Compounding Lab</small></span></a><div class="navlinks"><a href="browser-beta.html">Browser beta</a><a href="mission-001.html">Mission 001</a><a href="proof-gradient-lab.html">Selection gate</a><a href="capability-compounding-lab.html">Compounding</a><a href="evidence-docket-demo.html">Evidence docket</a><a href="no-user-data.html">Data posture</a><a class="cta" href="capability-compounding-lab.html">Run the lab</a></div></nav>`;
const footer = `
<footer><div><strong>GoalOS Signoff Pro</strong><p>Proof-to-acceptance · Evidence Dockets · Chronicle memory · reusable capability.</p></div><div><a href="privacy.html">Privacy</a><a href="terms.html">Terms</a><a href="no-user-data.html">No User Data</a><a href="agialpha-token-boundary.html">$AGIALPHA boundary</a></div></footer><div class="legal-rail" data-goalos-legal-rail="v12"><b>Public site rule</b> ${esc(cfg.publicSiteRule)}</div>`;

const missionCards = cfg.missions.map((m, idx) => `
<article class="mission panel" id="${m.id.toLowerCase()}">
  <div class="num">0${idx+1} · ${esc(m.id)}</div>
  <h3>${esc(m.name)}</h3>
  <p>${esc(m.objective)}</p>
  <p><b>Accepted capability:</b><br>${esc(m.acceptedCapability)}</p>
  <div class="bar" title="verified work"><i style="--w:${m.verifiedWork}%"></i></div>
  <small>Verified work ${m.verifiedWork} · proof debt ${m.proofDebt} · cost index ${m.costIndex} · risk index ${m.riskIndex}</small>
</article>`).join('\n');

const ledgerRows = cfg.missions.map((m, idx) => `
<div class="ledger-row" data-compounding-row><b>${esc(m.id)}</b><span>${esc(m.name)} → ${esc(m.acceptedCapability)}</span><strong>${m.verifiedWork}</strong></div>`).join('\n');

const page = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(cfg.title)} · GoalOS Signoff Pro</title><meta name="description" content="A browser-local GoalOS demonstration showing how accepted proof becomes reusable capability and compounding institutional memory."><link rel="stylesheet" href="assets/capability-compounding-v14.css"></head><body>${nav}
<main>
<section class="hero wrap">
  <div>
    <div class="eyebrow">Verified experience becomes capability</div>
    <h1>Accepted proof becomes <span class="gradient">institutional memory.</span></h1>
    <p class="lead">${esc(cfg.thesis)} GoalOS does not let every output influence the next run. Only proof-carrying work that passes gates enters Chronicle and becomes reusable capability.</p>
    <div class="actions"><button class="btn primary" data-compounding-run>Run compounding cycle</button><a class="btn" href="mission-001.html">Inspect Mission 001</a><button class="btn" data-compounding-download>Download demo bundle</button></div>
    <div class="chips"><span class="chip">Browser-local</span><span class="chip">No input</span><span class="chip">No upload</span><span class="chip">No value moved</span></div>
  </div>
  <aside class="console">
    <div class="orbit"><div class="core">α</div><div class="node n1"><b>Proof</b><span>Claims bound</span></div><div class="node n2"><b>Gate</b><span>Risk checked</span></div><div class="node n3"><b>Chronicle</b><span>Accepted only</span></div><div class="node n4"><b>Capability</b><span>Reusable</span></div></div>
    <div class="cards"><div class="card"><strong>${bundle.metrics.verified_work_start}→${bundle.metrics.verified_work_end}</strong><span>verified work</span></div><div class="card"><strong>${bundle.metrics.proof_debt_start}→${bundle.metrics.proof_debt_end}</strong><span>proof debt</span></div><div class="card"><strong>${bundle.missions.length}</strong><span>missions</span></div></div>
  </aside>
</section>
<section class="section wrap">
  <div class="eyebrow">The compounding law</div>
  <h2>Memory accepts only proof.</h2>
  <p class="lead">The core GoalOS idea is not that agents produce more output. It is that accepted work becomes a reusable capability package, rejected work becomes a lesson, and future routing inherits only verified experience.</p>
  <div class="grid">${missionCards}</div>
</section>
<section class="section wrap">
  <div class="eyebrow">Run the browser lab</div>
  <h2>Watch capability compound without collecting anything.</h2>
  <div class="lab">
    <div class="panel">
      <h3>Capability ledger</h3>
      <p>Each mission must pass the hard gates before its result is admitted into Chronicle.</p>
      <div class="ledger">${ledgerRows}</div>
      <div class="actions"><button class="btn primary" data-compounding-run>Run again</button><button class="btn" data-compounding-reset>Reset</button></div>
    </div>
    <div class="panel">
      <h3>Evidence-state trace</h3>
      <pre class="trace" data-compounding-trace>System ready. Capability memory empty. Awaiting first mission.</pre>
      <h3>Current docket view</h3>
      <pre class="trace" data-compounding-output>{"status":"ready","data":"none","valueMoved":0}</pre>
    </div>
  </div>
</section>
<section class="section wrap">
  <div class="eyebrow">Why this matters</div>
  <h2>Not more work. Better inheritance.</h2>
  <div class="grid">
    <article class="panel"><h3>No proof, no memory.</h3><p>Unsupported claims do not become default truth. They remain outside Chronicle.</p></article>
    <article class="panel"><h3>No eval, no propagation.</h3><p>High-scoring candidates still need proof validity, risk control, rollback, and challenge clearance.</p></article>
    <article class="panel"><h3>No replay, no capability.</h3><p>A reusable capability must carry enough evidence for future teams and systems to inspect its basis.</p></article>
  </div>
</section>
</main>${footer}<script src="assets/capability-compounding-v14.js"></script></body></html>`;
write(cfg.slug, page);

const homePath = path.join(site, 'index.html');
if (fs.existsSync(homePath)) {
  let home = fs.readFileSync(homePath, 'utf8');
  if (!home.includes('capability-compounding-home-rail')) {
    const rail = `<section class="section wrap capability-compounding-home-rail" style="padding:80px 0"><div class="panel" style="border:1px solid rgba(118,255,217,.42);background:rgba(18,36,33,.75);border-radius:28px;padding:32px"><div class="eyebrow">Capability compounding</div><h2 style="font-size:clamp(42px,5vw,72px);line-height:.9;margin:14px 0">Accepted proof becomes reusable capability.</h2><p class="lead">Run the browser-local compounding lab: mission → evidence → selection → Chronicle → capability → harder mission.</p><div class="actions"><a class="btn primary" href="capability-compounding-lab.html">Open compounding lab</a><a class="btn" href="capability-compounding-demo-bundle.json">Download demo bundle</a></div></div></section>`;
    const footerIndex = home.search(/<footer\b/i);
    if (footerIndex >= 0) home = home.slice(0, footerIndex) + rail + home.slice(footerIndex);
    else home = home.replace('</main>', rail + '</main>');
    fs.writeFileSync(homePath, home);
  }
} else {
  write('index.html', page.replace(/capability-compounding-lab\.html/g, 'index.html'));
}

const sitemapPath = path.join(site, 'sitemap.xml');
const url = 'https://montrealai.github.io/goalos-signoff-pro/capability-compounding-lab.html';
if (fs.existsSync(sitemapPath)) {
  let sitemap = fs.readFileSync(sitemapPath, 'utf8');
  if (!sitemap.includes(url)) sitemap = sitemap.replace('</urlset>', `<url><loc>${url}</loc></url></urlset>`);
  fs.writeFileSync(sitemapPath, sitemap);
}

console.log(`GoalOS Capability Compounding Lab generated at ${path.join(site, cfg.slug)}`);
