#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = process.cwd();
const site = path.join(root, 'site');
const configPath = path.join(root, 'config', 'proof-carrying-artifact-lab.json');
const cfg = fs.existsSync(configPath) ? JSON.parse(fs.readFileSync(configPath, 'utf8')) : {
  version: '23.0.0',
  routes: ['proof-carrying-artifact-lab.html', 'artifact-vault-lab.html', 'evolution-ledger-lab.html', 'upgrade-right-lab.html'],
  scenarios: [{ id: 'research', label: 'Research acceptance workflow', artifactClass: 'capability-package', objective: 'Turn a public-safe research acceptance workflow into a reusable proof-carrying capability.', riskClass: 'medium', domain: 'AI research review' }]
};
fs.mkdirSync(site, { recursive: true });

const now = new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');
const sha = value => crypto.createHash('sha256').update(typeof value === 'string' ? value : JSON.stringify(value)).digest('hex');
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

const gateStages = [
  { id: 'artifact-id', label: 'Artifact identity', rule: 'The reusable unit receives a stable family identifier and immutable version hash.', posture: 'identity' },
  { id: 'proof-history', label: 'Proof history', rule: 'Every version references ProofPackets, verifier results, costs, risks, and replay notes.', posture: 'proof' },
  { id: 'baseline', label: 'Baseline comparison', rule: 'No upgrade right exists without a comparator and a measured advantage under constraints.', posture: 'eval' },
  { id: 'scope', label: 'Scope boundary', rule: 'The artifact may influence only the tenant, risk class, workflow, or domain authorized by the certificate.', posture: 'scope' },
  { id: 'selection', label: 'Selection Gate', rule: 'Score is advisory. Proof, eval, risk, rollback, canary, scope, and challenge gates decide.', posture: 'gate' },
  { id: 'ledger', label: 'Evolution Ledger', rule: 'Promotion emits an append-only public-safe entry: commitment, proof root, selection, rollout, rollback pointer.', posture: 'ledger' },
  { id: 'upgrade-right', label: 'Upgrade right', rule: 'The artifact earns the governed right to influence future work only after the gates clear.', posture: 'right' },
  { id: 'chronicle', label: 'Chronicle memory', rule: 'Accepted proof becomes reusable institutional memory; rejected output becomes warning memory only.', posture: 'memory' }
];

function versionCandidates(scenario) {
  return [
    {
      id: 'V0', label: 'Persuasive artifact', status: 'REJECTED', tone: 'blocked',
      reason: 'Useful language is not reusable capability. Missing ProofPacket, baseline, replay, and rollback target.',
      proofValid: false, evalPass: false, rollbackReady: false, challengeWindowCleared: false,
      verifiedValue: 12, proofDebt: 88, falsePromotionRisk: 76
    },
    {
      id: 'V1', label: 'Proof-linked candidate', status: 'HELD', tone: 'held',
      reason: 'Evidence exists, but baseline comparison and scope boundary are incomplete.',
      proofValid: true, evalPass: false, rollbackReady: false, challengeWindowCleared: false,
      verifiedValue: 41, proofDebt: 54, falsePromotionRisk: 39
    },
    {
      id: 'V2', label: 'Canary candidate', status: 'CANARY', tone: 'canary',
      reason: 'Proof and baseline clear; canary monitoring and challenge window remain open.',
      proofValid: true, evalPass: true, rollbackReady: true, challengeWindowCleared: false,
      verifiedValue: 67, proofDebt: 23, falsePromotionRisk: 16
    },
    {
      id: 'V3', label: 'Proof-carrying artifact', status: 'ACTIVE_SYNTHETIC', tone: 'active',
      reason: 'Proof, eval, risk, rollback, canary, scope, and challenge gates clear. Upgrade right earned for the synthetic demo scope.',
      proofValid: true, evalPass: true, rollbackReady: true, challengeWindowCleared: true,
      verifiedValue: scenario.riskClass === 'high' ? 72 : 84, proofDebt: scenario.riskClass === 'high' ? 18 : 9, falsePromotionRisk: scenario.riskClass === 'high' ? 11 : 5
    }
  ];
}

function makeBundle(scenario = cfg.scenarios[0]) {
  const versions = versionCandidates(scenario).map(v => ({
    ...v,
    versionHash: sha(`${scenario.id}:${v.id}:${v.label}:${v.status}`).slice(0, 32),
    proofPacketRoot: v.proofValid ? sha(`proof:${scenario.id}:${v.id}`).slice(0, 32) : null,
    rollbackTarget: v.rollbackReady ? `${scenario.id}-last-known-good-${v.id === 'V3' ? 'V2' : 'V1'}` : null,
    scope: v.status === 'ACTIVE_SYNTHETIC' ? `${scenario.domain} / public-safe browser demo` : 'not promoted',
    valueMoved: 0
  }));
  const active = versions.find(v => v.status === 'ACTIVE_SYNTHETIC');
  const artifactVault = {
    artifactFamilyId: `GOALOS-PCA-${scenario.id.toUpperCase()}-SYNTHETIC`,
    artifactClass: scenario.artifactClass,
    objective: scenario.objective,
    riskClass: scenario.riskClass,
    domain: scenario.domain,
    immutableVersions: versions,
    invariant: 'A reusable artifact cannot silently mutate; a new version must carry proof and pass gates.',
    noUserData: true,
    valueMoved: 0
  };
  const proofHistory = versions.map(v => ({
    version: v.id,
    versionHash: v.versionHash,
    proofPacketRoot: v.proofPacketRoot,
    evidenceDocketPointer: v.proofValid ? `demo://evidence-docket/${scenario.id}/${v.id}` : null,
    baseline: v.evalPass ? 'B5 current governed workflow' : null,
    challenger: 'B0 output-only baseline',
    verifiedValue: v.verifiedValue,
    proofDebt: v.proofDebt,
    falsePromotionRisk: v.falsePromotionRisk,
    verdict: v.status,
    reason: v.reason,
    valueMoved: 0
  }));
  const selectionCertificate = {
    certificateId: `SELECTION-CERT-${scenario.id.toUpperCase()}-V3-SYNTHETIC`,
    promotedVersion: active.id,
    promotedVersionHash: active.versionHash,
    decision: 'PROMOTE_WITHIN_SYNTHETIC_BROWSER_SCOPE',
    hardGates: {
      proofValid: true,
      evalPass: true,
      riskWithinBoundary: true,
      rollbackReady: true,
      canaryReady: true,
      scopeAuthorized: true,
      challengeWindowCleared: true
    },
    blockedVersions: versions.filter(v => v.id !== active.id).map(v => ({ version: v.id, status: v.status, reason: v.reason })),
    scope: active.scope,
    valueMoved: 0
  };
  const evolutionLedgerEntry = {
    ledgerEntryId: `EVOLUTION-LEDGER-${scenario.id.toUpperCase()}-${active.id}-SYNTHETIC`,
    generatedAt: now,
    eventType: 'SELECTION_CERTIFICATE_EMITTED',
    artifactFamilyId: artifactVault.artifactFamilyId,
    versionHash: active.versionHash,
    proofRoot: active.proofPacketRoot,
    selectionCertificateHash: sha(selectionCertificate),
    rolloutReceiptHash: sha(`rollout:${scenario.id}:${active.id}`),
    rollbackReceiptHash: sha(`rollback:${scenario.id}:last-known-good`),
    publicPrivateBoundary: 'Public-safe commitments only; no private prompts, traces, documents, customer data, credentials, or confidential rationale.',
    valueMoved: 0
  };
  const rolloutReceipt = {
    receiptId: `ROLLOUT-RECEIPT-${scenario.id.toUpperCase()}-SYNTHETIC`,
    version: active.id,
    status: 'SYNTHETIC_CANARY_CLEARED',
    canaryScope: 'browser-local demo only',
    monitoringCondition: 'false promotion risk must remain below scenario threshold; challenge window must clear',
    valueMoved: 0
  };
  const rollbackReceipt = {
    receiptId: `ROLLBACK-RECEIPT-${scenario.id.toUpperCase()}-SYNTHETIC`,
    lastKnownGoodState: `${scenario.id}-last-known-good-V2`,
    trigger: 'proof invalidation, challenge success, scope drift, privacy boundary failure, or human authority hold',
    status: 'ROLLBACK_READY_SYNTHETIC',
    valueMoved: 0
  };
  const upgradeRight = {
    rightId: `PROOF-BACKED-UPGRADE-RIGHT-${scenario.id.toUpperCase()}-SYNTHETIC`,
    holder: 'GoalOS synthetic public demo artifact',
    right: 'May influence future synthetic missions within explicit public-safe scope after selection gates clear.',
    notARightTo: ['move value','use private data','self-authorize external action','bypass human authority','claim production certification'],
    proofCondition: 'SelectionCertificate + EvolutionLedgerEntry + RolloutReceipt + RollbackReceipt',
    active: true,
    valueMoved: 0
  };
  const manifest = {
    name: 'GoalOS Signoff Pro — Proof-Carrying Artifact & Evolution Ledger Lab',
    version: cfg.version || '23.0.0',
    generatedAt: now,
    routes: cfg.routes,
    scenario: scenario.id,
    browserLocal: true,
    noUserData: true,
    noExternalAction: true,
    valueMoved: 0
  };
  return { manifest, artifactVault, proofHistory, selectionCertificate, evolutionLedgerEntry, rolloutReceipt, rollbackReceipt, upgradeRight };
}

function writeJson(name, value) { fs.writeFileSync(path.join(site, name), JSON.stringify(value, null, 2) + '\n'); }

const bundles = Object.fromEntries(cfg.scenarios.map(s => [s.id, makeBundle(s)]));
const defaultBundle = bundles.research || Object.values(bundles)[0];
writeJson('proof-carrying-artifact-demo-bundle.json', defaultBundle);
writeJson('artifact-vault-index.json', defaultBundle.artifactVault);
writeJson('selection-certificate-demo.json', defaultBundle.selectionCertificate);
writeJson('evolution-ledger-entry-demo.json', defaultBundle.evolutionLedgerEntry);
writeJson('rollout-receipt-demo.json', defaultBundle.rolloutReceipt);
writeJson('rollback-receipt-demo.json', defaultBundle.rollbackReceipt);
writeJson('proof-backed-upgrade-right.json', defaultBundle.upgradeRight);
writeJson('proof-carrying-artifact-manifest.json', defaultBundle.manifest);

const bundleJson = JSON.stringify(bundles).replace(/</g, '\\u003c');
const configJson = JSON.stringify({ version: cfg.version, scenarios: cfg.scenarios, gateStages }).replace(/</g, '\\u003c');

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>GoalOS Signoff Pro — Proof-Carrying Artifact & Evolution Ledger Lab</title>
<meta name="description" content="A browser-local GoalOS lab showing how accepted proof becomes a versioned, rollbackable, proof-carrying artifact with an Evolution Ledger entry and proof-backed upgrade right." />
<style>
:root{--bg:#020806;--panel:rgba(17,35,32,.78);--panel2:rgba(3,10,11,.9);--line:rgba(117,255,215,.36);--line2:rgba(255,234,127,.50);--mint:#75ffd7;--cyan:#75e7ff;--cream:#fff8ea;--gold:#fff08a;--muted:#b8cccc;--danger:#ff7f9e;--purple:#b9a1ff;--shadow:0 34px 90px rgba(0,0,0,.48),0 0 70px rgba(117,255,215,.13)}
*{box-sizing:border-box}body{margin:0;background:radial-gradient(circle at 72% 18%,rgba(83,255,219,.18),transparent 32%),radial-gradient(circle at 12% 82%,rgba(178,148,255,.14),transparent 31%),linear-gradient(118deg,#020806,#051412 49%,#050b16);color:var(--cream);font-family:Inter,ui-sans-serif,system-ui,-apple-system,Segoe UI,Arial,sans-serif;overflow-x:hidden}body:before{content:"";position:fixed;inset:0;background-image:linear-gradient(rgba(255,255,255,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.035) 1px,transparent 1px);background-size:62px 62px;mask-image:linear-gradient(to bottom,rgba(0,0,0,.9),rgba(0,0,0,.28));pointer-events:none}.stars{position:fixed;inset:0;pointer-events:none;opacity:.65;background-image:radial-gradient(circle at 12% 20%,var(--mint) 0 1px,transparent 2px),radial-gradient(circle at 28% 72%,var(--gold) 0 1px,transparent 2px),radial-gradient(circle at 84% 22%,var(--cyan) 0 1px,transparent 2px),radial-gradient(circle at 68% 80%,var(--purple) 0 1px,transparent 2px);background-size:300px 220px;animation:float 24s linear infinite}.nav{height:88px;padding:0 5vw;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid rgba(117,255,215,.22);background:rgba(0,0,0,.54);backdrop-filter:blur(18px);position:sticky;top:0;z-index:20}.brand{display:flex;gap:14px;align-items:center;text-decoration:none;color:var(--cream);letter-spacing:.18em}.brand b{font-size:12px}.brand span span{display:block;font-size:10px;color:#b7c8c8}.mark{width:36px;height:36px;border-radius:12px;border:1px solid var(--line);background:radial-gradient(circle,var(--gold),var(--mint) 35%,transparent 36%);box-shadow:0 0 24px rgba(117,255,215,.55)}.navlinks{display:flex;gap:24px;align-items:center}.nav a{color:var(--cream);text-decoration:none;font-size:12px;font-weight:900}.pill{border:1px solid rgba(255,255,255,.2);padding:11px 18px;border-radius:999px;background:rgba(255,255,255,.08)}.primary{background:linear-gradient(135deg,#eaff9a,#61ecff);color:#04110f;border:0;box-shadow:0 0 30px rgba(117,255,215,.34)}button{font:inherit;cursor:pointer;color:inherit;border:1px solid rgba(255,255,255,.22);background:rgba(255,255,255,.09);border-radius:999px;padding:13px 18px;font-weight:900}.hero{min-height:91vh;display:grid;grid-template-columns:minmax(0,1.02fr) minmax(360px,.98fr);gap:56px;align-items:center;width:min(1220px,92vw);margin:0 auto;padding:76px 0}.eyebrow{color:var(--mint);letter-spacing:.35em;text-transform:uppercase;font-weight:950;font-size:12px}.eyebrow:before{content:"";display:inline-block;width:38px;height:1px;background:var(--mint);vertical-align:middle;margin-right:16px;box-shadow:0 0 18px var(--mint)}h1{font-size:clamp(54px,8vw,120px);line-height:.87;letter-spacing:-.082em;margin:22px 0 20px}.grad{font-family:Georgia,serif;font-style:italic;font-weight:400;background:linear-gradient(100deg,var(--gold),var(--mint),var(--cyan),var(--purple));-webkit-background-clip:text;color:transparent}.lead{font-size:clamp(18px,2.05vw,24px);line-height:1.5;max-width:720px;color:#edf8f5}.rule{margin:24px 0;padding:18px 20px;border:1px solid var(--line2);border-radius:20px;background:linear-gradient(135deg,rgba(255,240,138,.12),rgba(117,255,215,.09));font-weight:900;color:var(--gold)}.actions{display:flex;flex-wrap:wrap;gap:14px;margin:26px 0}.chips{display:flex;gap:10px;flex-wrap:wrap}.chip{font-size:11px;letter-spacing:.13em;font-weight:950;border:1px solid var(--line);border-radius:999px;padding:9px 12px;background:rgba(4,18,17,.72);color:#cffff4}.console{position:relative;border:1px solid var(--line);border-radius:36px;background:linear-gradient(145deg,rgba(23,57,50,.84),rgba(4,12,14,.86));padding:22px;box-shadow:var(--shadow);overflow:hidden}.console:before{content:"";position:absolute;inset:-80px;background:conic-gradient(from 120deg,transparent,var(--mint),transparent,var(--cyan),transparent);opacity:.16;animation:spin 16s linear infinite}.inner{position:relative;background:rgba(2,8,9,.78);border:1px solid rgba(255,255,255,.08);border-radius:28px;padding:24px;min-height:610px}.topline{display:flex;justify-content:space-between;color:var(--mint);font-size:11px;letter-spacing:.22em;font-weight:950}.artifact-orb{width:180px;height:180px;margin:24px auto;border-radius:34px;display:grid;place-items:center;background:radial-gradient(circle,var(--gold),var(--mint) 34%,var(--cyan) 58%,rgba(117,255,215,.05) 59%);box-shadow:0 0 90px rgba(117,255,215,.46);position:relative;transform:rotate(45deg)}.artifact-orb:before,.artifact-orb:after{content:"";position:absolute;inset:-28px;border:1px dashed rgba(117,255,215,.34);border-radius:40px;animation:spin 12s linear infinite}.artifact-orb:after{inset:-54px;border-color:rgba(255,240,138,.25);animation-duration:19s;animation-direction:reverse}.artifact-orb b{font-family:Georgia,serif;font-size:72px;color:#06100e;transform:rotate(-45deg)}.versions{display:grid;gap:12px;margin-top:26px}.version{border:1px solid rgba(117,255,215,.32);border-radius:18px;background:rgba(255,255,255,.06);padding:14px;display:grid;grid-template-columns:46px 1fr 110px;gap:12px;align-items:center;transition:.35s}.version.active{border-color:var(--gold);box-shadow:0 0 28px rgba(255,240,138,.24);transform:translateY(-3px)}.version.blocked{border-color:rgba(255,127,158,.72)}.version.held{border-color:rgba(255,240,138,.6)}.version.canary{border-color:rgba(117,231,255,.65)}.version.done{border-color:rgba(117,255,215,.9)}.num{color:var(--gold);font-weight:950;letter-spacing:.12em}.status{text-align:right;font-size:10px;letter-spacing:.13em;color:var(--mint);font-weight:950}.version small{color:var(--muted)}.metrics{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:18px}.metric{border:1px solid rgba(255,255,255,.13);border-radius:16px;background:rgba(255,255,255,.06);padding:14px}.metric strong{display:block;color:var(--mint);font-size:26px}.metric span{font-size:10px;letter-spacing:.18em;text-transform:uppercase;color:var(--muted);font-weight:900}.section{width:min(1180px,92vw);margin:0 auto;padding:86px 0}.panel{border:1px solid var(--line);border-radius:30px;background:linear-gradient(145deg,rgba(23,57,50,.72),rgba(4,12,14,.82));padding:30px;box-shadow:var(--shadow)}.lab{display:grid;grid-template-columns:.9fr 1.1fr;gap:24px}.scenario{border:1px solid rgba(255,255,255,.13);background:rgba(255,255,255,.06);border-radius:20px;padding:16px;margin:10px 0;cursor:pointer}.scenario.active{border-color:var(--mint);box-shadow:0 0 22px rgba(117,255,215,.18)}.scenario b{display:block}.scenario span{color:var(--muted);font-size:13px}.trace{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;background:#020808;border:1px solid rgba(255,255,255,.14);border-radius:18px;padding:18px;min-height:230px;white-space:pre-wrap;color:#d4fff2}.tabs{display:flex;flex-wrap:wrap;gap:10px;margin-bottom:14px}.tabs button{padding:10px 14px}.tabs button.active{background:rgba(117,255,215,.18);border-color:var(--mint)}pre{white-space:pre-wrap;word-break:break-word;margin:0;font-size:12px;line-height:1.55;color:#d5fff3}.ladder{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}.gate{border:1px solid rgba(117,255,215,.25);border-radius:20px;background:rgba(255,255,255,.055);padding:16px;min-height:148px}.gate b{display:block;font-size:18px;margin:8px 0}.footer{border-top:1px solid rgba(117,255,215,.24);background:rgba(0,0,0,.46);padding:42px 5vw;display:flex;justify-content:space-between;gap:28px;color:#d4e4e4}.rail{width:min(900px,92vw);margin:28px auto 54px;border:1px solid var(--line);border-radius:999px;padding:12px 18px;text-align:center;background:#020808;color:#cfeee8;font-size:13px}.rail b{color:var(--gold)}@keyframes spin{to{transform:rotate(360deg)}}@keyframes float{to{background-position:300px 220px}}@media(max-width:900px){.hero,.lab{grid-template-columns:1fr}.navlinks{display:none}.metrics{grid-template-columns:repeat(2,1fr)}h1{font-size:56px}.footer{display:block}.ladder{grid-template-columns:1fr 1fr}.version{grid-template-columns:38px 1fr}.status{text-align:left}.hero{padding-top:40px}}
</style>
</head>
<body>
<div class="stars"></div>
<nav class="nav"><a class="brand" href="./"><span class="mark"></span><span><b>GOALOS SIGNOFF PRO</b><span>PROOF-CARRYING ARTIFACT LAB</span></span></a><div class="navlinks"><a href="browser-beta.html">Browser beta</a><a href="mission-001.html">Mission 001</a><a href="proof-gradient-lab.html">Selection gate</a><a href="capability-compounding-lab.html">Compounding</a><a href="governed-decision-state-lab.html">Decision state</a><a href="no-user-data.html">Data posture</a></div><a class="pill primary" href="browser-beta.html">Open browser beta</a></nav>
<main>
<section class="hero">
  <div>
    <div class="eyebrow">Proof-backed upgrade rights</div>
    <h1>Reusable intelligence must become <span class="grad">proof-carrying.</span></h1>
    <p class="lead">A good answer is not reusable capability. GoalOS turns accepted proof into immutable artifact versions, selection certificates, rollout receipts, rollback receipts, and append-only Evolution Ledger entries.</p>
    <div class="rule">No proof, no evolution. No eval, no propagation. No rollback, no release.</div>
    <div class="actions"><button class="primary" data-run>Run artifact gate</button><button data-download>Download artifact package</button><a class="pill" href="capability-compounding-lab.html">Inspect compounding</a></div>
    <div class="chips"><span class="chip">BROWSER-LOCAL</span><span class="chip">NO INPUT</span><span class="chip">NO UPLOAD</span><span class="chip">NO WALLET</span><span class="chip">NO VALUE MOVED</span></div>
  </div>
  <div class="console" aria-label="Proof-carrying artifact console"><div class="inner"><div class="topline"><span>ARTIFACT VAULT</span><span id="mode">AWAITING RUN</span></div><div class="artifact-orb"><b>α</b></div><div class="versions" id="versionGraph"></div><div class="metrics"><div class="metric"><strong id="valueMetric">0</strong><span>Verified value</span></div><div class="metric"><strong id="debtMetric">88</strong><span>Proof debt</span></div><div class="metric"><strong id="rightMetric">HELD</strong><span>Upgrade right</span></div></div></div></div>
</section>
<section class="section"><div class="lab"><div class="panel"><div class="eyebrow">Choose artifact family</div><h2>One useful pattern. Four possible fates.</h2><p class="lead" style="font-size:18px">Run the gate to see why GoalOS does not let every output become memory. Only the version with proof, baseline, scope, canary, rollback, and challenge clearance earns an upgrade right.</p><div id="scenarios"></div><div class="actions"><button class="primary" data-run>Run artifact gate</button><button data-reset>Reset</button></div><div class="trace" id="trace">System ready. Artifact versions awaiting Selection Gate.</div></div><div class="panel"><div class="eyebrow">Inspectable proof package</div><h2>Evolution object bundle</h2><div class="tabs" id="tabs"></div><pre id="tabPanel"></pre></div></div></section>
<section class="section"><div class="panel"><div class="eyebrow">Core GoalOS idea</div><h2>Accepted proof can become institutional memory; output alone cannot.</h2><div class="ladder"><div class="gate"><span class="num">01</span><b>Immutable version</b><small>Every reusable artifact version is hash-addressed. No silent mutation.</small></div><div class="gate"><span class="num">02</span><b>Selection certificate</b><small>Promotion requires proof, eval, risk, canary, rollback, scope, and challenge clearance.</small></div><div class="gate"><span class="num">03</span><b>Evolution ledger</b><small>Public-safe commitments make the upgrade challengeable without publishing private intelligence.</small></div><div class="gate"><span class="num">04</span><b>Upgrade right</b><small>The artifact earns a bounded right to influence future work; it does not self-authorize action.</small></div></div></div></section>
</main>
<footer class="footer" data-goalos-footer="v12"><div><b>GoalOS Signoff Pro</b><p>AI-era work acceptance · proof-carrying artifacts · Evolution Ledger entries · rollbackable memory.</p></div><div class="navlinks" style="display:flex"><a href="privacy.html">Privacy</a><a href="terms.html">Terms</a><a href="no-user-data.html">No User Data</a><a href="agialpha-token-boundary.html">$AGIALPHA Boundary</a></div></footer>
<div class="rail" data-goalos-legal-rail="v12"><b>Public site rule</b> No forms · no inputs · no uploads · no cookies · no analytics · no wallets · no payments · no personal or confidential data.</div>
<script>
const CONFIG = ${configJson};
const BUNDLES = ${bundleJson};
let scenario = CONFIG.scenarios[0].id;
let tab = 'artifactVault';
const $ = q => document.querySelector(q);
const $$ = q => [...document.querySelectorAll(q)];
const labels = {artifactVault:'Artifact vault', proofHistory:'Proof history', selectionCertificate:'Selection cert', evolutionLedgerEntry:'Evolution ledger', rolloutReceipt:'Rollout', rollbackReceipt:'Rollback', upgradeRight:'Upgrade right'};
function bundle(){ return BUNDLES[scenario] || Object.values(BUNDLES)[0]; }
function renderScenarios(){ $('#scenarios').innerHTML = CONFIG.scenarios.map(s => '<div class="scenario '+(s.id===scenario?'active':'')+'" data-scenario="'+s.id+'"><b>'+s.label+'</b><span>'+s.objective+'</span></div>').join(''); $$('.scenario').forEach(el=>el.onclick=()=>{scenario=el.dataset.scenario; renderAll();}); }
function renderVersions(activeIndex=-1){ const versions=bundle().artifactVault.immutableVersions; $('#versionGraph').innerHTML = versions.map((v,i)=>'<div class="version '+(i===activeIndex?'active ':'')+(v.tone==='active'?'done':v.tone)+'"><div class="num">'+v.id+'</div><div><b>'+v.label+'</b><small>'+v.reason+'</small></div><div class="status">'+v.status+'</div></div>').join(''); const v=versions[Math.max(0,activeIndex)] || versions[0]; $('#valueMetric').textContent=v.verifiedValue; $('#debtMetric').textContent=v.proofDebt; $('#rightMetric').textContent=v.status==='ACTIVE_SYNTHETIC'?'EARNED':(v.status==='CANARY'?'CANARY':'HELD'); }
function renderTabs(){ $('#tabs').innerHTML = Object.keys(labels).map(k => '<button class="'+(tab===k?'active':'')+'" data-tab="'+k+'">'+labels[k]+'</button>').join(''); $$('#tabs button').forEach(b=>b.onclick=()=>{tab=b.dataset.tab;renderTabs();}); $('#tabPanel').textContent=JSON.stringify(bundle()[tab],null,2); }
function renderAll(){ renderScenarios(); renderVersions(-1); renderTabs(); $('#trace').textContent='System ready. Artifact versions awaiting Selection Gate.'; $('#mode').textContent='AWAITING RUN'; }
function run(){ const versions=bundle().artifactVault.immutableVersions; const lines=[]; let i=0; $('#mode').textContent='SELECTION GATE RUNNING'; const tick=()=>{ const v=versions[i]; renderVersions(i); lines.push('• '+v.id+' '+v.label+' → '+v.status+' — '+v.reason); $('#trace').textContent=lines.join('\\n'); i++; if(i<versions.length){ setTimeout(tick,760); } else { $('#mode').textContent='UPGRADE RIGHT EARNED'; lines.push('• SelectionCertificate emitted.'); lines.push('• EvolutionLedgerEntry committed as public-safe synthetic proof.'); lines.push('• RollbackReceipt preserved.'); lines.push('• DONE: proof-carrying artifact admitted to synthetic Chronicle scope.'); $('#trace').textContent=lines.join('\\n'); tab='selectionCertificate'; renderTabs(); }}; tick(); }
function download(){ const payload=JSON.stringify(bundle(),null,2); const blob=new Blob([payload],{type:'application/json'}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='goalos-proof-carrying-artifact-demo-bundle.json'; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url); }
$$('[data-run]').forEach(b=>b.onclick=run); $$('[data-reset]').forEach(b=>b.onclick=renderAll); $$('[data-download]').forEach(b=>b.onclick=download); renderAll();
</script>
</body>
</html>`;

for (const route of cfg.routes) fs.writeFileSync(path.join(site, route), html);

function injectHomepageRail() {
  const indexPath = path.join(site, 'index.html');
  if (!fs.existsSync(indexPath)) return;
  let index = fs.readFileSync(indexPath, 'utf8');
  if (index.includes('data-goalos-proof-artifact-rail="v23"')) return;
  const rail = `\n<section class="section" data-goalos-proof-artifact-rail="v23"><div class="panel"><div class="eyebrow">Proof-carrying artifacts</div><h2>Make reusable intelligence earn its upgrade right.</h2><p>Run the browser-local Artifact Vault lab: output enters as a candidate, proof gates decide, and only rollbackable proof-carrying artifacts may influence future work.</p><div class="actions"><a class="pill primary" href="proof-carrying-artifact-lab.html">Run artifact gate</a><a class="pill" href="evolution-ledger-lab.html">Inspect Evolution Ledger</a></div></div></section>\n`;
  const footerIndex = index.search(/<footer\b/i);
  if (footerIndex >= 0) index = index.slice(0, footerIndex) + rail + index.slice(footerIndex);
  else index += rail;
  fs.writeFileSync(indexPath, index);
}
injectHomepageRail();

console.log(`GoalOS Proof-Carrying Artifact Lab v${cfg.version || '23.0.0'} generated ${cfg.routes.length} routes and public artifacts at ${site}`);
