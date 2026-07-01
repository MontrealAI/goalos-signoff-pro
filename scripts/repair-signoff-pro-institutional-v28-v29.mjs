#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = process.cwd();
const site = path.join(root, 'site');
const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[ch]));
const sha256 = value => crypto.createHash('sha256').update(String(value)).digest('hex');
const read = rel => fs.readFileSync(path.join(site, rel), 'utf8');
const write = (rel, value) => { fs.mkdirSync(path.dirname(path.join(site, rel)), { recursive: true }); fs.writeFileSync(path.join(site, rel), value); };
const exists = rel => fs.existsSync(path.join(site, rel));

if (!fs.existsSync(site)) {
  console.error('site/ missing. Run the production builder first.');
  process.exit(1);
}

const labs = [
  ['v22','Action Graph & Human Authority','Action is not authority. Proof earns scope.','action-graph-authority-lab.html'],
  ['v23','Proof-Carrying Artifact','Reusable capability must carry proof.','proof-carrying-artifact-lab.html'],
  ['v24','Independent Replay','One run is not proof. Replay makes it public.','independent-replay-lab.html'],
  ['v25','ProofZero Planning','Plan over proof states, not persuasive futures.','proofzero-planning-lab.html'],
  ['v26','Mission Foundry','Accepted proof becomes the next harder mission.','mission-foundry-lab.html'],
  ['v27','Process-Resolved Evidence','Final output is not proof. Process lineage matters.','process-evidence-lab.html'],
  ['v28','Blockchain Credibility Standard','Blockchain proves the transaction. GoalOS proves the work.','blockchain-credibility-lab.html'],
  ['v29','Blockchain Proof Mandate','Require the proof package before trust, funding, governance, or settlement readiness.','blockchain-proof-mandate-lab.html']
];

function sectionHtml() {
  const cards = labs.map(([version, title, line, href]) => `<a href="${esc(href)}" style="display:block;padding:18px;border:1px solid rgba(255,255,255,.12);border-radius:24px;background:rgba(255,255,255,.045);text-decoration:none"><span style="display:block;color:#86ffdf;font-weight:950;letter-spacing:.16em;text-transform:uppercase;font-size:11px">${esc(version)}</span><b style="display:block;margin:8px 0 6px;color:#fff8ee;font-size:20px;line-height:1.05">${esc(title)}</b><span style="display:block;color:#cfe2e6;line-height:1.45;font-size:14px">${esc(line)}</span></a>`).join('');
  return `<!-- GOALOS_PUBLIC_LABS_V22_V29_START --><section class="goalos-institutional-public-labs-v22-v29" style="width:min(1180px,92vw);margin:88px auto;padding:clamp(24px,4vw,42px);border:1px solid rgba(134,255,223,.34);border-radius:40px;background:radial-gradient(circle at 15% 0,rgba(134,255,223,.16),transparent 36%),linear-gradient(145deg,rgba(12,31,36,.95),rgba(4,8,10,.98));box-shadow:0 34px 110px rgba(0,0,0,.42)"><div style="color:#86ffdf;font-weight:950;letter-spacing:.24em;text-transform:uppercase;font-size:12px">GoalOS Signoff Pro · flagship public labs v22-v29</div><h2 style="font-size:clamp(42px,7vw,96px);line-height:.84;letter-spacing:-.08em;margin:16px 0 18px;color:#fff8ee">Blockchain proves the transaction.<br><span style="background:linear-gradient(90deg,#ffe889,#86ffdf,#68e9ff);-webkit-background-clip:text;background-clip:text;color:transparent">GoalOS proves the work.</span></h2><p style="max-width:960px;color:#d9edf0;font-size:19px;line-height:1.58">The website now tells the complete public story: AI work becomes institution-ready when it carries a mission, evidence, replay, validation, human authority, a signed receipt, and proof-gated settlement readiness. v28 introduces the blockchain credibility standard. v29 turns it into a due-diligence requirement anyone can ask for.</p><div style="display:flex;gap:12px;flex-wrap:wrap;margin:24px 0 30px"><a href="blockchain-proof-mandate-lab.html" style="display:inline-block;padding:15px 19px;border-radius:999px;background:linear-gradient(135deg,#ffe889,#86ffdf,#68e9ff);color:#061010;font-weight:950;text-decoration:none">Start with v29</a><a href="blockchain-credibility-lab.html" style="display:inline-block;padding:15px 19px;border-radius:999px;border:1px solid rgba(255,255,255,.18);color:#d9edf0;text-decoration:none;font-weight:850">Open v28</a><a href="public-demo-labs.html" style="display:inline-block;padding:15px 19px;border-radius:999px;border:1px solid rgba(255,255,255,.18);color:#d9edf0;text-decoration:none;font-weight:850">View all labs</a><a href="goalos-public-demo-labs-v22-v29.json" style="display:inline-block;padding:15px 19px;border-radius:999px;border:1px solid rgba(255,255,255,.18);color:#d9edf0;text-decoration:none;font-weight:850">Inspect manifest</a></div><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:14px">${cards}</div><div style="margin-top:28px;padding:20px;border:1px solid rgba(255,232,137,.32);border-radius:28px;background:rgba(255,232,137,.075);color:#fff8ee"><b style="display:block;font-size:22px;margin-bottom:8px">No Proof. No Trust. No Settlement.</b><span style="color:#d9edf0;line-height:1.5">This remains a public-safe demonstration layer only: no forms, no inputs, no uploads, no cookies, no analytics, no wallets, no payments, no personal or confidential data, and zero value moved.</span></div></section><!-- GOALOS_PUBLIC_LABS_V22_V29_END -->`;
}

function patchHome() {
  if (!exists('index.html')) return;
  let html = read('index.html');
  html = html.replace(/12 packet files/g, '14 packet files');
  html = html.replace(/<!-- GOALOS_PUBLIC_LABS_V22_V27_START -->[\s\S]*?<!-- GOALOS_PUBLIC_LABS_V22_V27_END -->/g, '');
  html = html.replace(/<!-- GOALOS_BLOCKCHAIN_CREDIBILITY_LAB_V28_START -->[\s\S]*?<!-- GOALOS_BLOCKCHAIN_CREDIBILITY_LAB_V28_END -->/g, '');
  html = html.replace(/<!-- GOALOS_BLOCKCHAIN_PROOF_MANDATE_LAB_V29_START -->[\s\S]*?<!-- GOALOS_BLOCKCHAIN_PROOF_MANDATE_LAB_V29_END -->/g, '');
  html = html.replace(/<!-- GOALOS_PUBLIC_LABS_V22_V29_START -->[\s\S]*?<!-- GOALOS_PUBLIC_LABS_V22_V29_END -->/g, '');
  const navPatch = '<a href="public-demo-labs.html">Public labs</a><a href="blockchain-proof-mandate-lab.html">Blockchain proof</a>';
  html = html.replace(/(<nav[^>]*>)([\s\S]*?)(<\/nav>)/, (m, a, b, c) => b.includes('blockchain-proof-mandate-lab.html') ? m : `${a}${b}${navPatch}${c}`);
  const insert = sectionHtml();
  const pos = html.lastIndexOf('</main>');
  html = pos >= 0 ? html.slice(0, pos) + insert + html.slice(pos) : html.replace(/<\/body>/i, insert + '</body>');
  write('index.html', html);
}

function addShortRoutes() {
  const aliases = [
    ['blockchain.html', 'blockchain-proof-mandate-lab.html'],
    ['proof-package.html', 'blockchain-proof-mandate-lab.html'],
    ['proof-mandate.html', 'blockchain-proof-mandate-lab.html'],
    ['due-diligence.html', 'blockchain-proof-mandate-lab.html'],
    ['credibility-standard.html', 'blockchain-credibility-lab.html'],
    ['proof-before-settlement.html', 'blockchain-credibility-lab.html'],
    ['no-proof-no-settlement.html', 'blockchain-proof-mandate-lab.html']
  ];
  for (const [alias, target] of aliases) {
    if (exists(target)) {
      let html = read(target);
      html = html.replace(/<title>(.*?)<\/title>/, `<title>GoalOS Signoff Pro — ${esc(alias.replace(/\.html$/, '').replace(/-/g, ' '))}</title>`);
      html = html.replace(/<link rel="canonical"[^>]*>/g, '');
      write(alias, html);
    }
  }
}

function updateManifest() {
  const manifestPath = path.join(site, 'goalos-public-demo-labs-v22-v29.json');
  if (!fs.existsSync(manifestPath)) return;
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  const shortRoutes = ['blockchain.html','proof-package.html','proof-mandate.html','due-diligence.html','credibility-standard.html','proof-before-settlement.html','no-proof-no-settlement.html'];
  const routeSet = new Set([...(manifest.routes || []), ...shortRoutes]);
  manifest.routes = [...routeSet];
  manifest.institutionalUpdate = {
    id: 'goalos-signoff-pro-institutional-website-update-v28-v29',
    message: 'Blockchain proves the transaction. GoalOS proves the work.',
    standard: 'No Proof. No Trust. No Settlement.',
    frontDoorRoutes: shortRoutes,
    publicSafe: true,
    valueMoved: 0
  };
  delete manifest.manifestHash;
  manifest.manifestHash = `sha256:${sha256(JSON.stringify(manifest))}`;
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
}

function writeSiteMap() {
  const siteMap = {
    id: 'goalos-signoff-pro-institutional-site-map-v28-v29',
    generatedAt: new Date().toISOString().replace(/\.\d{3}Z$/, 'Z'),
    canonicalMessage: 'Blockchain proves the transaction. GoalOS proves the work.',
    standard: 'No Proof. No Trust. No Settlement.',
    startHere: [
      { label: 'General visitor', route: 'index.html', reason: 'Understand the Signoff Institution.' },
      { label: 'Blockchain project or DAO', route: 'blockchain-proof-mandate-lab.html', reason: 'See what proof package stakeholders should require.' },
      { label: 'Investor, partner, exchange, auditor', route: 'due-diligence.html', reason: 'Use the due-diligence and proof-mandate flow.' },
      { label: 'Developer or reviewer', route: 'mission-001.html', reason: 'Inspect the reproducibility packet.' },
      { label: 'AI work operator', route: 'public-demo-labs.html', reason: 'Walk through the complete v22-v29 proof curriculum.' }
    ],
    publicSafePosture: {
      forms: false, inputs: false, uploads: false, cookies: false, analytics: false, wallets: false, payments: false, personalData: false, confidentialData: false, valueMoved: 0
    },
    proofPackage: ['Mission Contract','Evidence Docket','Replay Path','Validator Report','Risk Ledger','Human Signoff','Mission Receipt','Settlement Readiness Boundary'],
    routes: ['index.html','public-demo-labs.html','blockchain-credibility-lab.html','blockchain-proof-mandate-lab.html','blockchain.html','proof-package.html','proof-before-settlement.html','mission-001.html','verify.html']
  };
  siteMap.hash = `sha256:${sha256(JSON.stringify(siteMap))}`;
  write('goalos-signoff-pro-site-map-v28-v29.json', JSON.stringify(siteMap, null, 2) + '\n');
}

patchHome();
addShortRoutes();
updateManifest();
writeSiteMap();
console.log('GoalOS Signoff Pro institutional homepage and route repair v28-v29 PASS');
