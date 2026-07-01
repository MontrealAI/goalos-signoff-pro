#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import crypto from 'node:crypto';

const root = process.cwd();
const siteDir = path.join(root, 'site');
fs.mkdirSync(siteDir, { recursive: true });

const labs = [
  {
    version: 'v22',
    title: 'Action Graph & Human Authority Lab',
    route: 'action-graph-authority-lab.html',
    aliases: ['human-authority-action-lab.html', 'scoped-action-lab.html'],
    builder: 'scripts/build-action-graph-authority-lab-page.mjs',
    generator: 'scripts/generate-action-graph-authority-lab-bundle.mjs',
    verifier: 'scripts/verify-action-graph-authority-lab-page.mjs',
    proof: 'Decision → scoped actions → authority gate → rollback → receipt.',
    audience: 'Executives, reviewers, compliance teams, AI delivery leads.',
    promise: 'Shows why GoalOS prepares action, but does not self-authorize high-impact action.',
    artifacts: ['action-graph-demo-bundle.json', 'scoped-action-plan.json', 'human-authority-gate.json', 'action-reason-trace.json', 'action-rollback-map.json', 'action-graph-receipt.json', 'action-graph-authority-manifest.json']
  },
  {
    version: 'v23',
    title: 'Proof-Carrying Artifact & Evolution Ledger Lab',
    route: 'proof-carrying-artifact-lab.html',
    aliases: ['artifact-vault-lab.html', 'evolution-ledger-lab.html', 'upgrade-right-lab.html'],
    builder: 'scripts/build-proof-carrying-artifact-lab-page.mjs',
    generator: 'scripts/generate-proof-carrying-artifact-lab-bundle.mjs',
    verifier: 'scripts/verify-proof-carrying-artifact-lab-page.mjs',
    proof: 'Candidate artifact → proof gates → immutable version → evolution ledger → upgrade right.',
    audience: 'Product teams, AI platform teams, governance stewards.',
    promise: 'Shows how reusable capability earns the right to influence future work.',
    artifacts: ['proof-carrying-artifact-demo-bundle.json', 'artifact-vault-index.json', 'selection-certificate-demo.json', 'evolution-ledger-entry-demo.json', 'rollout-receipt-demo.json', 'rollback-receipt-demo.json', 'proof-backed-upgrade-right.json', 'proof-carrying-artifact-manifest.json']
  },
  {
    version: 'v24',
    title: 'Independent Replay & Claim Promotion Lab',
    route: 'independent-replay-lab.html',
    aliases: ['replay-council-lab.html', 'claim-promotion-lab.html'],
    builder: 'scripts/build-independent-replay-lab-page.mjs',
    generator: 'scripts/generate-independent-replay-lab-bundle.mjs',
    verifier: 'scripts/verify-independent-replay-lab-page.mjs',
    proof: 'Proof packet → independent replay → challenge window → claim maturity promotion.',
    audience: 'Research reviewers, auditors, grant evaluators, technical diligence teams.',
    promise: 'Shows that one run is not proof; replay makes a claim institutionally usable.',
    artifacts: ['independent-replay-demo-bundle.json', 'replay-operator-reports.json', 'claim-promotion-certificate.json', 'public-evidence-review-card.json', 'reproduction-manifest.json', 'independent-replay-manifest.json']
  },
  {
    version: 'v25',
    title: 'ProofZero Planning & Evidence Reanalyze Lab',
    route: 'proofzero-planning-lab.html',
    aliases: ['evidence-reanalyze-lab.html', 'latent-work-state-lab.html', 'bounded-search-lab.html'],
    builder: 'scripts/build-proofzero-planning-lab-page.mjs',
    generator: 'scripts/generate-proofzero-planning-lab-bundle.mjs',
    verifier: 'scripts/verify-proofzero-planning-lab-page.mjs',
    proof: 'Latent work state → bounded search → validator-aware backup → evidence reanalysis.',
    audience: 'AI operators, mission designers, evaluation teams.',
    promise: 'Shows how GoalOS plans over proof-relevant work states instead of persuasive futures.',
    artifacts: ['proofzero-planning-demo-bundle.json', 'latent-work-state-report.json', 'evidence-reanalyze-ledger.json', 'planning-depth-scoreboard.json', 'router-policy-update.json', 'proofzero-planning-manifest.json']
  },
  {
    version: 'v26',
    title: 'Proof-Gated Mission Foundry & Curriculum Lab',
    route: 'mission-foundry-lab.html',
    aliases: ['curriculum-lab.html', 'harder-mission-lab.html'],
    builder: 'scripts/build-mission-foundry-lab-page.mjs',
    generator: 'scripts/generate-mission-foundry-lab-bundle.mjs',
    verifier: 'scripts/verify-mission-foundry-lab-page.mjs',
    proof: 'Accepted proof → mission seeds → interestingness filter → quarantine/admission → harder mission.',
    audience: 'Program owners, frontier evaluation teams, autonomous work architects.',
    promise: 'Shows how accepted proof becomes curriculum rather than a dead artifact.',
    artifacts: ['mission-foundry-demo-bundle.json', 'generated-mission-curriculum.json', 'mission-seed-certificate.json', 'interestingness-filter-report.json', 'mission-quarantine-ledger.json', 'mission-foundry-manifest.json']
  },
  {
    version: 'v27',
    title: 'Process-Resolved Evidence Lab',
    route: 'process-evidence-lab.html',
    aliases: ['process-trace-lab.html', 'proof-native-workbench-lab.html', 'evidence-lineage-lab.html'],
    builder: 'scripts/build-process-evidence-lab-page.mjs',
    generator: 'scripts/generate-process-evidence-lab-bundle.mjs',
    verifier: 'scripts/verify-process-evidence-lab-page.mjs',
    proof: 'Trace steps → claim lineage → tool scope → contradiction pass → validator report.',
    audience: 'Corporate reviewers, analysts, legal/compliance observers, AI assurance teams.',
    promise: 'Shows that final output is not enough; process-resolved evidence determines review readiness.',
    artifacts: ['process-evidence-demo-bundle.json', 'process-validator-report.json', 'action-reason-trace-ledger.json', 'tool-scope-ledger.json', 'claim-lineage-map.json', 'process-evidence-manifest.json']
  }
];

const run = script => {
  const file = path.join(root, script);
  if (!fs.existsSync(file)) {
    console.log(`skip missing ${script}`);
    return;
  }
  const result = spawnSync(process.execPath, [script], { cwd: root, stdio: 'inherit' });
  if (result.status !== 0) process.exit(result.status || 1);
};

const escapeHtml = value => String(value).replace(/[&<>"']/g, ch => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[ch]));
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');

for (const lab of labs) run(lab.builder);

const generatedAt = new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');
const manifest = {
  id: 'goalos-signoff-pro-public-labs-v22-v27',
  title: 'GoalOS Signoff Pro public demonstration labs v22-v27',
  generatedAt,
  posture: {
    browserLocal: true,
    forms: false,
    inputs: false,
    uploads: false,
    cookies: false,
    analytics: false,
    wallets: false,
    payments: false,
    personalData: false,
    confidentialData: false,
    valueMoved: 0
  },
  routes: ['public-demo-labs.html', 'goalos-public-demo-labs.html', ...labs.flatMap(l => [l.route, ...l.aliases])],
  labs: labs.map(({ version, title, route, aliases, proof, audience, promise, artifacts }) => ({ version, title, route, aliases, proof, audience, promise, artifacts }))
};
manifest.manifestHash = `sha256:${sha256(JSON.stringify(manifest))}`;
fs.writeFileSync(path.join(siteDir, 'goalos-public-demo-labs-v22-v27.json'), JSON.stringify(manifest, null, 2) + '\n');

const labCards = labs.map((lab, i) => `
<article class="lab-card">
  <div class="lab-kicker"><span>${escapeHtml(lab.version)}</span><span>${String(i + 1).padStart(2, '0')}</span></div>
  <h2>${escapeHtml(lab.title)}</h2>
  <p class="promise">${escapeHtml(lab.promise)}</p>
  <div class="proof-line"><b>Proof loop</b><span>${escapeHtml(lab.proof)}</span></div>
  <div class="audience"><b>Best for</b><span>${escapeHtml(lab.audience)}</span></div>
  <div class="routes"><a class="primary" href="${escapeHtml(lab.route)}">Open lab</a>${lab.aliases.slice(0, 2).map(a => `<a href="${escapeHtml(a)}">${escapeHtml(a.replace(/\.html$/, '').replace(/-/g, ' '))}</a>`).join('')}</div>
</article>`).join('\n');

const evidenceRows = labs.map(lab => `
<tr><td>${escapeHtml(lab.version)}</td><td><a href="${escapeHtml(lab.route)}">${escapeHtml(lab.title)}</a></td><td>${escapeHtml(lab.artifacts.slice(0, 3).join(' · '))}${lab.artifacts.length > 3 ? ' · …' : ''}</td><td>0</td></tr>`).join('\n');

const hubHtml = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>GoalOS Signoff Pro — Public Demo Labs v22-v27</title>
<meta name="description" content="Six browser-local public demonstration labs for the core GoalOS idea: autonomous work must produce proof before acceptance, reuse, replay, action, curriculum, or settlement signals." />
<style>
:root{color-scheme:dark;--bg:#04070a;--panel:#0b1417;--panel2:#101d22;--text:#fff8eb;--muted:#b8c9ce;--line:rgba(153,255,232,.24);--accent:#7cffdc;--accent2:#f4ff9a;--hot:#62e8ff}*{box-sizing:border-box}body{margin:0;font-family:Inter,ui-sans-serif,system-ui,-apple-system,Segoe UI,sans-serif;background:radial-gradient(circle at 12% 8%,rgba(124,255,220,.2),transparent 30%),radial-gradient(circle at 88% 0,rgba(98,232,255,.16),transparent 34%),linear-gradient(180deg,#031014,#04070a 45%,#020304);color:var(--text)}a{color:inherit;text-decoration:none}.topbar{position:sticky;top:0;z-index:10;display:flex;align-items:center;justify-content:space-between;gap:20px;padding:18px clamp(18px,4vw,56px);backdrop-filter:blur(22px);background:rgba(4,7,10,.72);border-bottom:1px solid rgba(255,255,255,.08)}.brand{display:flex;align-items:center;gap:12px;font-weight:950;letter-spacing:-.02em}.brand mark{display:grid;place-items:center;width:38px;height:38px;border-radius:14px;background:linear-gradient(135deg,var(--accent2),var(--hot));color:#061010}.nav{display:flex;gap:10px;flex-wrap:wrap;justify-content:flex-end}.nav a,.pill{padding:10px 14px;border:1px solid rgba(255,255,255,.12);border-radius:999px;color:var(--muted);font-size:13px}.nav a:hover,.pill.primary{background:linear-gradient(135deg,var(--accent2),var(--hot));color:#061010;border-color:transparent;font-weight:900}.hero{width:min(1180px,92vw);margin:0 auto;padding:84px 0 40px;display:grid;grid-template-columns:minmax(0,1.1fr) minmax(320px,.9fr);gap:34px;align-items:end}.eyebrow{color:var(--accent);font-weight:950;letter-spacing:.28em;text-transform:uppercase;font-size:12px}.hero h1{font-size:clamp(52px,8.4vw,116px);line-height:.84;letter-spacing:-.09em;margin:16px 0}.lead{font-size:clamp(19px,2.2vw,26px);line-height:1.35;color:#d8ebef;max-width:820px}.hero-card{border:1px solid var(--line);border-radius:34px;background:linear-gradient(145deg,rgba(13,29,34,.88),rgba(4,9,11,.9));padding:28px;box-shadow:0 28px 100px rgba(0,0,0,.42)}.hero-card .metric{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin-top:22px}.metric div{padding:18px;border-radius:22px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.08)}.metric b{display:block;font-size:32px}.metric span{color:var(--muted);font-size:13px}.flow{width:min(1180px,92vw);margin:26px auto 0;display:grid;grid-template-columns:repeat(9,1fr);gap:8px}.flow span{min-height:70px;border:1px solid rgba(124,255,220,.22);border-radius:18px;background:rgba(255,255,255,.055);display:grid;place-items:center;text-align:center;padding:10px;color:#dff7f2;font-size:12px;font-weight:800}.section{width:min(1180px,92vw);margin:80px auto}.section-head{display:flex;justify-content:space-between;gap:28px;align-items:end;margin-bottom:24px}.section-head h2{font-size:clamp(36px,5vw,70px);line-height:.9;letter-spacing:-.06em;margin:8px 0}.section-head p{max-width:530px;color:var(--muted);line-height:1.55}.grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px}.lab-card{min-height:420px;border:1px solid rgba(255,255,255,.12);border-radius:30px;background:linear-gradient(155deg,rgba(16,32,38,.92),rgba(4,8,10,.96));padding:24px;display:flex;flex-direction:column;position:relative;overflow:hidden}.lab-card:before{content:"";position:absolute;inset:-1px;background:radial-gradient(circle at 20% 0,rgba(124,255,220,.2),transparent 34%);pointer-events:none}.lab-card>*{position:relative}.lab-kicker{display:flex;justify-content:space-between;align-items:center;color:#061010}.lab-kicker span{display:inline-flex;padding:8px 10px;border-radius:999px;background:linear-gradient(135deg,var(--accent2),var(--hot));font-weight:950;font-size:12px}.lab-card h2{font-size:30px;line-height:1;letter-spacing:-.04em;margin:22px 0 12px}.promise{color:#dcecef;line-height:1.5}.proof-line,.audience{margin-top:16px;padding:16px;border-radius:20px;border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.045)}.proof-line b,.audience b{display:block;color:var(--accent);font-size:12px;text-transform:uppercase;letter-spacing:.16em;margin-bottom:8px}.proof-line span,.audience span{color:var(--muted);line-height:1.45}.routes{margin-top:auto;display:flex;gap:8px;flex-wrap:wrap;padding-top:18px}.routes a{padding:10px 12px;border-radius:999px;border:1px solid rgba(255,255,255,.12);font-size:12px;color:#dbecef}.routes a.primary{background:linear-gradient(135deg,var(--accent2),var(--hot));color:#061010;border:0;font-weight:950}.matrix{border:1px solid rgba(255,255,255,.12);border-radius:28px;overflow:hidden;background:rgba(255,255,255,.04)}table{width:100%;border-collapse:collapse}th,td{text-align:left;padding:16px;border-bottom:1px solid rgba(255,255,255,.08);vertical-align:top}th{font-size:12px;text-transform:uppercase;letter-spacing:.18em;color:var(--accent)}td{color:#dcecef}td:first-child{font-weight:950;color:var(--accent2)}.rule{position:sticky;bottom:0;margin-top:80px;padding:14px clamp(18px,4vw,56px);display:flex;gap:12px;align-items:center;justify-content:center;background:rgba(4,7,10,.86);border-top:1px solid rgba(255,255,255,.1);color:#cbdde0;text-align:center;font-size:13px}.rule b{color:var(--accent)}.footer{width:min(1180px,92vw);margin:80px auto 40px;padding-top:24px;border-top:1px solid rgba(255,255,255,.12);display:flex;justify-content:space-between;gap:20px;color:var(--muted)}@media(max-width:900px){.hero{grid-template-columns:1fr}.grid{grid-template-columns:1fr}.flow{grid-template-columns:1fr 1fr}.section-head{display:block}.topbar{align-items:flex-start;flex-direction:column}.footer{flex-direction:column}}
</style>
</head>
<body>
<header class="topbar"><a class="brand" href="index.html"><mark>α</mark><span>GoalOS Signoff Pro<br><small>Public demo labs v22-v27</small></span></a><nav class="nav"><a href="index.html">Institution</a><a href="browser-beta.html">Browser beta</a><a href="mission-001.html">Mission 001</a><a href="goalos-public-demo-labs-v22-v27.json">Manifest</a></nav></header>
<main>
<section class="hero"><div><p class="eyebrow">Core GoalOS idea, made public</p><h1>Six proof labs for governed autonomous work.</h1><p class="lead">These browser-local demonstrations show the GoalOS thesis in a user-friendly, executive-readable way: autonomous work becomes useful when evidence, replay, human authority, reusable capability, curriculum, and process lineage are proof-gated.</p><p><a class="pill primary" href="action-graph-authority-lab.html">Start with v22</a> <a class="pill" href="process-evidence-lab.html">Jump to v27</a></p></div><aside class="hero-card"><p class="eyebrow">Public-safe posture</p><h2>Nothing leaves the browser.</h2><p class="promise">No accounts, no forms, no inputs, no uploads, no cookies, no analytics, no wallets, no payments, no personal or confidential data, and no value moved.</p><div class="metric"><div><b>6</b><span>new flagship demos</span></div><div><b>21</b><span>primary + alias routes</span></div><div><b>0</b><span>value moved</span></div><div><b>1</b><span>global manifest</span></div></div></aside></section>
<div class="flow"><span>Mission</span><span>Work</span><span>Proof</span><span>Validation</span><span>Replay</span><span>Authority</span><span>Chronicle</span><span>Reuse</span><span>Harder mission</span></div>
<section class="section"><div class="section-head"><div><p class="eyebrow">Demonstration suite</p><h2>Each lab explains one missing layer.</h2></div><p>Use this page as the corporate-friendly front door. Each card opens a polished public demo and links to inspectable JSON artifacts generated by the autonomous workflow.</p></div><div class="grid">${labCards}</div></section>
<section class="section"><div class="section-head"><div><p class="eyebrow">Evidence map</p><h2>Proof surfaces, not black boxes.</h2></div><p>The labs publish route-level demonstrations plus public-safe artifacts. The global manifest records every route and declares the site boundary.</p></div><div class="matrix"><table><thead><tr><th>Version</th><th>Lab</th><th>Representative public artifacts</th><th>Value moved</th></tr></thead><tbody>${evidenceRows}</tbody></table></div></section>
</main>
<footer class="footer" data-goalos-footer="canonical"><div><b>GoalOS Signoff Pro</b><br><span>Proof-to-acceptance · human authority · replay · reusable capability · evidence lineage.</span></div><nav class="nav"><a href="no-user-data.html">No User Data</a><a href="agialpha-token-boundary.html">$AGIALPHA boundary</a><a href="goalos-public-demo-labs-v22-v27.json">Global manifest</a></nav></footer>
<div class="rule" data-goalos-legal-rail="v12"><b>Public site rule</b><span>No forms · no inputs · no uploads · no cookies · no analytics · no wallets · no payments · no personal or confidential data.</span></div>
</body>
</html>`;

for (const route of ['public-demo-labs.html', 'goalos-public-demo-labs.html']) {
  fs.writeFileSync(path.join(siteDir, route), hubHtml);
}

const indexPath = path.join(siteDir, 'index.html');
if (fs.existsSync(indexPath)) {
  let index = fs.readFileSync(indexPath, 'utf8');
  index = index.replace(/<!-- GOALOS_PUBLIC_LABS_V22_V27_START -->[\s\S]*?<!-- GOALOS_PUBLIC_LABS_V22_V27_END -->/g, '');
  const cards = labs.map(lab => `<a href="${escapeHtml(lab.route)}"><b>${escapeHtml(lab.version)}</b><span>${escapeHtml(lab.title)}</span></a>`).join('');
  const rail = `<!-- GOALOS_PUBLIC_LABS_V22_V27_START --><section class="goalos-public-labs-hub" data-goalos-public-labs-v22-v27="true" style="width:min(1180px,92vw);margin:84px auto;padding:34px;border:1px solid rgba(124,255,220,.26);border-radius:34px;background:linear-gradient(145deg,rgba(12,31,36,.92),rgba(4,8,10,.96));box-shadow:0 30px 100px rgba(0,0,0,.38)"><div style="color:#7cffdc;font-weight:950;letter-spacing:.28em;text-transform:uppercase;font-size:12px">GoalOS public demonstration suite</div><h2 style="font-size:clamp(38px,6vw,82px);line-height:.88;letter-spacing:-.07em;margin:16px 0;color:#fff8eb">Six new proof labs for governed autonomous work.</h2><p style="max-width:820px;color:#d8ebef;font-size:18px;line-height:1.55">Explore how GoalOS turns AI work into scoped actions, proof-carrying artifacts, independent replay, ProofZero planning, harder mission curricula, and process-resolved evidence.</p><p><a href="public-demo-labs.html" style="display:inline-block;margin:12px 10px 20px 0;padding:14px 18px;border-radius:999px;background:linear-gradient(135deg,#f4ff9a,#62e8ff);color:#061010;font-weight:950;text-decoration:none">Open the global demo hub</a><a href="goalos-public-demo-labs-v22-v27.json" style="display:inline-block;margin:12px 0 20px 0;padding:14px 18px;border-radius:999px;border:1px solid rgba(255,255,255,.16);color:#d8ebef;text-decoration:none">Inspect manifest</a></p><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:10px">${cards.replaceAll('<a ', '<a style="display:block;padding:16px;border-radius:20px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);text-decoration:none;color:#fff8eb" ')} </div></section><!-- GOALOS_PUBLIC_LABS_V22_V27_END -->`;
  const mainEnd = index.lastIndexOf('</main>');
  if (mainEnd >= 0) index = index.slice(0, mainEnd) + rail + index.slice(mainEnd);
  else {
    const footerMatch = index.search(/<footer\b/i);
    index = footerMatch >= 0 ? index.slice(0, footerMatch) + rail + index.slice(footerMatch) : index.replace(/<\/body>/i, rail + '</body>');
  }
  fs.writeFileSync(indexPath, index);
}

console.log(`GoalOS public demo labs v22-v27 generated ${manifest.routes.length} routes plus hub manifest at ${siteDir}`);
