#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = process.cwd();
const siteDir = path.join(root, 'site');
const configPath = path.join(root, 'config', 'blockchain-credibility-lab.json');
const fallbackConfigPath = path.join(path.dirname(new URL(import.meta.url).pathname), '..', 'config', 'blockchain-credibility-lab.json');
const config = JSON.parse(fs.readFileSync(fs.existsSync(configPath) ? configPath : fallbackConfigPath, 'utf8'));
fs.mkdirSync(siteDir, { recursive: true });

const now = new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');
const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[ch]));
const digest = value => crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex');
const ready = config.candidates.find(c => c.status.includes('SETTLEMENT_READY'));
const routes = [config.primaryRoute, ...config.aliases];

const gateRows = config.proofGates.map((g, i) => ({
  ...g,
  order: i + 1,
  commitment: `sha256:${digest(g).slice(0, 32)}`,
  publicPrivateBoundary: 'public-safe commitment only; private project workpapers stay outside the public demo'
}));
const scenarioRows = config.scenarios.map((s, i) => ({
  ...s,
  proofRoot: `sha256:${digest({ s, gates: gateRows.map(g => g.id) }).slice(0, 32)}`,
  selectedByDefault: i === 0
}));
const requirementMap = {
  type: 'ProofPackageRequirementMap',
  rule: 'Blockchain proves the transaction. GoalOS proves the work.',
  standard: 'No Proof. No Trust. No Settlement.',
  gates: gateRows,
  requiredFor: ['grant payout', 'treasury spend', 'protocol upgrade', 'audit remediation', 'AI-agent settlement', 'RWA claim maturity', 'governance execution'],
  notEnough: ['announcement', 'dashboard alone', 'tweet thread', 'unmapped GitHub commit', 'unlinked audit badge', 'private verbal approval'],
  valueMoved: 0
};
const readinessLedger = {
  type: 'TrustSettlementReadinessLedger',
  settlementMode: 'synthetic-public-demo',
  candidates: config.candidates.map(c => ({
    id: c.id,
    name: c.name,
    status: c.status,
    proofScore: c.proofScore,
    trustScore: c.trustScore,
    settlementReadiness: c.settlementReadiness,
    reason: c.reason,
    action: c.id === ready.id ? 'emit settlement-readiness signal only' : 'block, hold, or challenge'
  })),
  acceptedCandidate: ready.id,
  valueMoved: 0,
  noWallet: true,
  noPayments: true
};
const stakeholderDemandCard = {
  type: 'StakeholderDemandCard',
  question: 'Where is the proof package?',
  demands: config.stakeholders,
  iconicLines: config.iconicLines,
  plainEnglishRule: 'Do not ask communities to trust a blockchain project because it sounds credible. Show what was promised, what was delivered, what evidence exists, who reviewed it, what risk remains, and what justifies settlement.',
  valueMoved: 0
};
const standard = {
  type: 'NoProofNoSettlementStandard',
  name: 'GoalOS Blockchain Credibility Standard',
  version: config.version,
  tagline: 'No Proof. No Trust. No Settlement.',
  operatingPrinciples: [
    'Claims do not settle; accepted proof settles.',
    'A smart contract can move value, but GoalOS explains why value deserves to move.',
    'Off-chain work becomes on-chain-referenceable only through mission, evidence, replay, validation, risk, authority, and receipt.',
    'Human authority remains explicit for consequential acceptance.',
    'Public demos stay browser-local and move zero value.'
  ],
  valueMoved: 0
};
const receipt = {
  type: 'BlockchainSettlementReceiptDemo',
  receiptId: `goalos-v28-${digest({ now, ready }).slice(0, 12)}`,
  decisionState: 'SETTLEMENT_READY_SYNTHETIC_PUBLIC_DEMO',
  acceptedCandidate: ready.id,
  settlementSignal: 'proof-package-complete; human-authority-required-before-live-use',
  receiptRoot: `sha256:${digest({ requirementMap, readinessLedger, stakeholderDemandCard }).slice(0, 48)}`,
  noUserData: true,
  noWallet: true,
  valueMoved: 0
};
const manifest = {
  id: config.id,
  title: config.title,
  version: config.version,
  generatedAt: now,
  primaryRoute: config.primaryRoute,
  aliases: config.aliases,
  publicArtifacts: config.publicArtifacts,
  boundary: config.boundary,
  canonicalDemoHash: `sha256:${digest({ scenarioRows, gateRows, receipt }).slice(0, 48)}`
};
const bundle = {
  type: 'BlockchainCredibilityDemoBundle',
  generatedAt: now,
  manifest,
  scenarios: scenarioRows,
  requirementMap,
  readinessLedger,
  stakeholderDemandCard,
  standard,
  receipt
};
const writeJson = (name, data) => fs.writeFileSync(path.join(siteDir, name), JSON.stringify(data, null, 2) + '\n');
writeJson('blockchain-credibility-manifest.json', manifest);
writeJson('proof-package-requirement-map.json', requirementMap);
writeJson('no-proof-no-settlement-standard.json', standard);
writeJson('trust-settlement-readiness-ledger.json', readinessLedger);
writeJson('stakeholder-demand-card.json', stakeholderDemandCard);
writeJson('blockchain-settlement-receipt-demo.json', receipt);
writeJson('blockchain-credibility-demo-bundle.json', bundle);

const scenarioButtons = scenarioRows.map(s => `<button class="scenario-btn${s.selectedByDefault ? ' active' : ''}" type="button" data-scenario="${esc(s.id)}">${esc(s.label)}</button>`).join('');
const gateCards = gateRows.map(g => `<article class="gate-card"><b>${esc(g.id)}</b><h3>${esc(g.name)}</h3><p>${esc(g.question)}</p><span>${esc(g.artifact)}</span></article>`).join('\n');
const candidateRows = config.candidates.map(c => `<tr><td>${esc(c.id)}</td><td>${esc(c.name)}</td><td><span class="status ${esc(c.status.toLowerCase().replaceAll('_','-'))}">${esc(c.status)}</span></td><td>${esc(c.proofScore)}</td><td>${esc(c.trustScore)}</td><td>${esc(c.settlementReadiness)}</td><td>${esc(c.reason)}</td></tr>`).join('\n');
const stakeholderCards = config.stakeholders.map(s => `<article><h3>${esc(s.name)}</h3><p>${esc(s.demand)}</p></article>`).join('\n');
const artifactLinks = config.publicArtifacts.map(a => `<a class="artifact" href="${esc(a)}"><b>${esc(a)}</b><span>Public-safe JSON artifact · zero value moved</span></a>`).join('\n');
const flow = ['Mission', 'Evidence', 'Replay', 'Validation', 'Risk', 'Human Signoff', 'Receipt', 'Settlement Signal'].map(x => `<span>${esc(x)}</span>`).join('<i>→</i>');
const scriptData = JSON.stringify(scenarioRows).replace(/</g, '\\u003c');

const css = `
:root{color-scheme:dark;--bg:#030608;--panel:rgba(10,22,28,.78);--panel2:rgba(19,38,45,.72);--line:rgba(131,255,226,.28);--text:#fff7e8;--muted:#b8cbd0;--mint:#80ffde;--cyan:#65e8ff;--gold:#fff19b;--red:#ff8aa0;--shadow:0 30px 100px rgba(0,0,0,.48);--radius:30px}*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:radial-gradient(circle at 15% 10%,rgba(128,255,222,.22),transparent 28%),radial-gradient(circle at 88% 18%,rgba(101,232,255,.16),transparent 31%),radial-gradient(circle at 45% 100%,rgba(255,241,155,.09),transparent 34%),linear-gradient(135deg,#02090b,#061316 46%,#030608);color:var(--text);font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;overflow-x:hidden}body:before{content:"";position:fixed;inset:0;pointer-events:none;background-image:linear-gradient(rgba(255,255,255,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.035) 1px,transparent 1px);background-size:72px 72px;mask-image:linear-gradient(to bottom,rgba(0,0,0,.9),transparent 95%)}a{color:inherit}.topbar{position:sticky;top:0;z-index:20;display:flex;justify-content:space-between;align-items:center;gap:20px;padding:18px clamp(18px,4vw,58px);background:rgba(2,7,10,.78);backdrop-filter:blur(20px);border-bottom:1px solid var(--line)}.brand{display:flex;gap:12px;align-items:center;font-weight:950;letter-spacing:.16em;text-transform:uppercase;font-size:12px;text-decoration:none}.brand-mark{display:grid;place-items:center;width:42px;height:42px;border-radius:15px;color:#03110f;background:linear-gradient(135deg,var(--gold),var(--mint),var(--cyan));box-shadow:0 0 35px rgba(128,255,222,.35)}nav{display:flex;gap:10px;flex-wrap:wrap;justify-content:flex-end}nav a{font-weight:850;text-decoration:none;font-size:13px;padding:10px 14px;border-radius:999px;border:1px solid rgba(255,255,255,.12);color:#d9eeee}.wrap{width:min(1220px,calc(100% - 36px));margin:0 auto}.hero{min-height:820px;display:grid;grid-template-columns:minmax(0,1.1fr) minmax(360px,.9fr);gap:clamp(36px,7vw,82px);align-items:center;padding:100px 0}.eyebrow{color:var(--mint);font-weight:950;text-transform:uppercase;letter-spacing:.36em;font-size:12px}.hero h1{font-size:clamp(58px,8vw,124px);line-height:.82;letter-spacing:-.075em;margin:22px 0 24px}.hero h1 em{display:block;font-family:Georgia,serif;font-style:italic;font-weight:500;color:transparent;background:linear-gradient(100deg,var(--gold),var(--mint),var(--cyan));-webkit-background-clip:text}.lead{font-size:clamp(19px,2.2vw,28px);line-height:1.4;color:#e8f2ef;max-width:820px}.tagline{display:inline-flex;gap:8px;align-items:center;margin-top:18px;padding:13px 17px;border-radius:999px;border:1px solid var(--line);background:rgba(0,0,0,.32);font-weight:950;color:var(--gold)}.cta{display:flex;gap:13px;flex-wrap:wrap;margin-top:28px}.btn{display:inline-flex;align-items:center;justify-content:center;min-height:50px;padding:0 23px;border-radius:999px;text-decoration:none;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.16);font-weight:950}.btn.primary{background:linear-gradient(120deg,var(--gold),var(--mint),var(--cyan));color:#03100f;border:0}.console,.section,.card,.artifact,.gate-card,.scenario-panel{border:1px solid var(--line);border-radius:var(--radius);background:linear-gradient(145deg,var(--panel2),var(--panel));box-shadow:var(--shadow);backdrop-filter:blur(12px)}.console{padding:28px}.console-top{display:flex;justify-content:space-between;gap:16px;color:var(--mint);font-weight:950;letter-spacing:.26em;text-transform:uppercase;font-size:11px}.console h2{font-size:clamp(34px,4vw,58px);line-height:.92;letter-spacing:-.055em;margin:22px 0 16px}.flow{display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin:22px 0}.flow span{border:1px solid rgba(255,255,255,.14);border-radius:999px;padding:10px 12px;color:#eafffb;background:rgba(255,255,255,.06);font-size:12px;font-weight:900}.flow i{color:var(--mint);font-style:normal}.kpis{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:20px}.kpis article{border:1px solid rgba(255,255,255,.14);border-radius:20px;padding:18px;background:rgba(0,0,0,.24)}.kpis b{display:block;color:var(--gold);font-size:34px}.kpis span{color:var(--muted);text-transform:uppercase;letter-spacing:.18em;font-size:10px}.section{padding:clamp(28px,5vw,58px);margin:42px 0}.section h2{font-size:clamp(42px,6vw,86px);line-height:.9;letter-spacing:-.065em;margin:0 0 18px}.section>p{font-size:20px;line-height:1.55;color:#ddecdf;max-width:820px}.grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px}.grid.two{grid-template-columns:repeat(2,minmax(0,1fr))}.gate-card,.card{padding:24px}.gate-card b{display:inline-grid;place-items:center;width:42px;height:42px;border-radius:14px;background:rgba(128,255,222,.12);border:1px solid var(--line);color:var(--mint)}.gate-card h3,.card h3{font-size:28px;line-height:.95;margin:14px 0 10px;letter-spacing:-.04em}.gate-card p,.card p{color:#d8e6e5;line-height:1.5}.gate-card span{display:block;color:var(--gold);font-weight:900;margin-top:14px}.scenario-panel{padding:28px;margin-top:24px}.scenario-buttons{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:22px}.scenario-btn{appearance:none;border:1px solid rgba(255,255,255,.16);background:rgba(255,255,255,.08);color:var(--text);border-radius:999px;padding:12px 15px;font-weight:950;cursor:pointer}.scenario-btn.active{background:linear-gradient(120deg,var(--gold),var(--mint));color:#03100f;border-color:transparent}.scenario-output{display:grid;grid-template-columns:1fr .8fr;gap:24px;align-items:stretch}.scenario-output h3{font-size:42px;line-height:.95;margin:0 0 12px;letter-spacing:-.05em}.scenario-output p{color:#ddecdf;line-height:1.55}.proof-list{display:grid;gap:8px;margin:18px 0}.proof-list span{padding:12px;border-radius:14px;border:1px solid rgba(128,255,222,.22);background:rgba(0,0,0,.24)}.readiness{display:grid;place-items:center;border-radius:24px;border:1px solid rgba(255,255,255,.12);background:radial-gradient(circle at 50% 35%,rgba(128,255,222,.25),rgba(0,0,0,.3) 50%);min-height:300px;text-align:center}.readiness b{font-size:78px;color:var(--gold);letter-spacing:-.08em}.readiness span{display:block;color:var(--mint);font-weight:950;text-transform:uppercase;letter-spacing:.18em;font-size:12px}.table-wrap{overflow:auto;border:1px solid var(--line);border-radius:24px;background:rgba(0,0,0,.28);margin-top:22px}table{width:100%;border-collapse:collapse;min-width:960px}th,td{padding:16px;border-bottom:1px solid rgba(255,255,255,.1);text-align:left;vertical-align:top}th{color:var(--mint);font-size:12px;text-transform:uppercase;letter-spacing:.17em}.status{display:inline-block;border-radius:999px;padding:8px 10px;background:rgba(255,255,255,.09);border:1px solid rgba(255,255,255,.14);font-size:11px;font-weight:950}.status.settlement-ready-synthetic{color:#06100f;background:linear-gradient(120deg,var(--gold),var(--mint))}.artifacts{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;margin-top:22px}.artifact{padding:18px;text-decoration:none}.artifact b{display:block;color:var(--gold);font-family:ui-monospace,Menlo,monospace;word-break:break-word}.artifact span{display:block;color:#d5e5e1;margin-top:8px}.rule{display:flex;gap:10px;flex-wrap:wrap;margin-top:20px}.rule span{padding:10px 12px;border-radius:999px;border:1px solid var(--line);background:rgba(0,0,0,.28);color:#eafffb;font-size:12px;font-weight:900}.legal-rail{margin:44px 0;padding:18px;border:1px solid var(--line);border-radius:22px;background:rgba(0,0,0,.36);color:#d8ece7}.footer{width:100vw;margin-left:calc(50% - 50vw);padding:44px clamp(18px,5vw,68px) 76px;border-top:1px solid var(--line);background:rgba(0,0,0,.52);display:grid;grid-template-columns:1fr auto;gap:22px;align-items:start}.footer a{color:var(--mint);font-weight:900;text-decoration:none}.footer small{display:block;color:var(--muted);margin-top:8px;max-width:850px}.footer nav{justify-content:flex-end}@media(max-width:960px){.topbar{position:relative;align-items:flex-start;flex-direction:column}.hero,.scenario-output{grid-template-columns:1fr}.grid,.grid.two,.artifacts,.kpis{grid-template-columns:1fr}.footer{grid-template-columns:1fr}.footer nav{justify-content:flex-start}.hero{padding:68px 0;min-height:auto}}
`;
const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${esc(config.title)}</title>
<meta name="description" content="GoalOS Signoff Pro v28 demonstrates a user-friendly blockchain credibility standard: no proof package, no serious trust, no settlement readiness." />
<style>${css}</style>
</head>
<body>
<header class="topbar">
  <a class="brand" href="index.html"><span class="brand-mark">G</span><span>GoalOS Signoff Pro<br><small>Blockchain Credibility Lab v28</small></span></a>
  <nav aria-label="Primary">
    <a href="public-demo-labs.html">Demo hub</a>
    <a href="#standard">Standard</a>
    <a href="#scenario">Run lab</a>
    <a href="#artifacts">Artifacts</a>
  </nav>
</header>
<main class="wrap">
  <section class="hero">
    <div>
      <div class="eyebrow">GoalOS Signoff Pro · v28 public lab</div>
      <h1>Blockchain settles value. <em>GoalOS settles trust.</em></h1>
      <p class="lead"><strong>Blockchain proves the transaction. GoalOS proves the work.</strong> This lab turns the blockchain credibility problem into a simple public standard: mission, evidence, replay, validation, risk, human authority, receipt, and only then settlement readiness.</p>
      <div class="tagline">No Proof. No Trust. No Settlement.</div>
      <div class="cta"><a class="btn primary" href="#scenario">Run the credibility lab</a><a class="btn" href="blockchain-credibility-demo-bundle.json">Download public bundle</a></div>
      <div class="rule"><span>No forms</span><span>No inputs</span><span>No uploads</span><span>No cookies</span><span>No analytics</span><span>No wallets</span><span>No payments</span><span>No personal or confidential data</span></div>
    </div>
    <aside class="console" aria-label="Proof to settlement console">
      <div class="console-top"><span>Proof-to-settlement</span><span>zero value moved</span></div>
      <h2>Do not just move value. Prove it was earned.</h2>
      <div class="flow">${flow}</div>
      <div class="kpis"><article><b>8</b><span>proof gates</span></article><article><b>6</b><span>blockchain cases</span></article><article><b>0</b><span>value moved</span></article></div>
    </aside>
  </section>

  <section id="standard" class="section">
    <h2>The credibility layer blockchain is missing.</h2>
    <p>Smart contracts can execute rules, but projects still need to prove that off-chain work deserves consequences: treasury payouts, upgrade approvals, grant closure, remediation credit, AI-agent settlement, or claim maturity. GoalOS makes that proof package obvious, reviewable, replayable, and human-authorized.</p>
    <div class="grid three">
      <article class="card"><h3>Proof before trust.</h3><p>Communities should not accept vague announcements when a project can publish a mission, Evidence Docket, validation report, risk ledger, and receipt.</p></article>
      <article class="card"><h3>Validation before settlement.</h3><p>Settlement readiness is earned only when evidence survives checks, replay, challenge windows, and human authority.</p></article>
      <article class="card"><h3>Receipts before reputation.</h3><p>A signed Mission Receipt creates an institutional record of what was promised, delivered, accepted, and still bounded.</p></article>
    </div>
  </section>

  <section class="section">
    <h2>The v28 proof gates.</h2>
    <p>Every serious blockchain workflow handling funds, governance, upgrades, audits, AI agents, or public trust should be able to show this package before asking for credibility.</p>
    <div class="grid">${gateCards}</div>
  </section>

  <section id="scenario" class="section">
    <h2>Run the blockchain credibility lab.</h2>
    <p>Choose a common blockchain situation. The lab shows the public-safe proof package that should exist before trust, reputation, governance action, or settlement readiness moves.</p>
    <div class="scenario-panel">
      <div class="scenario-buttons">${scenarioButtons}</div>
      <div class="scenario-output">
        <div>
          <h3 data-scenario-headline>${esc(scenarioRows[0].headline)}</h3>
          <p data-scenario-objective>${esc(scenarioRows[0].objective)}</p>
          <div class="proof-list" data-scenario-proof>${scenarioRows[0].proofPackage.map(x => `<span>${esc(x)}</span>`).join('')}</div>
          <p><strong>Settlement rule:</strong> <span data-scenario-rule>${esc(scenarioRows[0].settlementRule)}</span></p>
          <p><strong>Value at stake:</strong> <span data-scenario-value>${esc(scenarioRows[0].valueAtStake)}</span></p>
        </div>
        <div class="readiness"><b>92</b><span>settlement-ready signal only</span><p>Public demonstration: no wallet, no payment, no value moved.</p></div>
      </div>
    </div>
  </section>

  <section class="section">
    <h2>What counts as credible?</h2>
    <p>This is the simple difference between claim-based blockchain credibility and proof-packaged blockchain credibility.</p>
    <div class="table-wrap"><table><thead><tr><th>ID</th><th>Credibility mode</th><th>Status</th><th>Proof</th><th>Trust</th><th>Settlement readiness</th><th>Reason</th></tr></thead><tbody>${candidateRows}</tbody></table></div>
  </section>

  <section class="section">
    <h2>Everyone can ask one question.</h2>
    <p><strong>Where is the proof package?</strong> This is the user-friendly demand that makes blockchain projects more credible, auditable, fundable, governable, and harder to misrepresent.</p>
    <div class="grid">${stakeholderCards}</div>
  </section>

  <section id="artifacts" class="section">
    <h2>Public artifacts.</h2>
    <p>These JSON files make the v28 demo inspectable. They are synthetic, browser-local, public-safe, and carry no private project data.</p>
    <div class="artifacts">${artifactLinks}</div>
  </section>

  <section class="legal-rail" data-goalos-legal-rail="v12">
    <strong>Public demonstration boundary.</strong> ${esc(config.boundary.claimBoundary)} ${esc(config.boundary.publicRule)}
  </section>
</main>
<footer class="footer" data-goalos-footer="canonical">
  <div><strong>GoalOS Signoff Pro — Blockchain Credibility Standard Lab v28</strong><small>Core rule: blockchain proves the transaction; GoalOS proves the work. This public page is a static demonstration. It does not request data, include wallet use, move funds, certify external facts, or activate live settlement.</small></div>
  <nav aria-label="Footer"><a href="index.html">Home</a><a href="public-demo-labs.html">Demo hub</a><a href="blockchain-credibility-manifest.json">Manifest</a></nav>
</footer>
<script>
const scenarios = ${scriptData};
const byId = id => document.querySelector(id);
const proofBox = byId('[data-scenario-proof]');
function renderScenario(id){
  const scenario = scenarios.find(item => item.id === id) || scenarios[0];
  document.querySelectorAll('[data-scenario]').forEach(btn => btn.classList.toggle('active', btn.dataset.scenario === scenario.id));
  byId('[data-scenario-headline]').textContent = scenario.headline;
  byId('[data-scenario-objective]').textContent = scenario.objective;
  byId('[data-scenario-rule]').textContent = scenario.settlementRule;
  byId('[data-scenario-value]').textContent = scenario.valueAtStake;
  proofBox.innerHTML = scenario.proofPackage.map(item => '<span>' + item + '</span>').join('');
}
document.querySelectorAll('[data-scenario]').forEach(btn => btn.addEventListener('click', () => renderScenario(btn.dataset.scenario)));
</script>
</body>
</html>`;

for (const route of routes) fs.writeFileSync(path.join(siteDir, route), html);
console.log(`GoalOS Blockchain Credibility Standard Lab v28 generated ${routes.length} routes and ${config.publicArtifacts.length} artifacts`);
