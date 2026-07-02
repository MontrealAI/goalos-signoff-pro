
import fs from 'fs';
import path from 'path';

const root = process.cwd();
const site = path.join(root, 'site');
const assets = path.join(site, 'assets');
fs.mkdirSync(assets, { recursive: true });
fs.mkdirSync(path.join(root,'docs'), { recursive: true });
fs.mkdirSync(path.join(root,'verification'), { recursive: true });

const pkgDir = path.dirname(new URL(import.meta.url).pathname);
const localConfig = path.join(root, 'config', 'goalos-v41-autopilot-playbooks.json');
const contractConfig = path.join(root, 'config', 'agialpha-mainnet-contracts-v38.json');
const data = JSON.parse(fs.readFileSync(localConfig, 'utf8'));
const contractData = fs.existsSync(contractConfig) ? JSON.parse(fs.readFileSync(contractConfig, 'utf8')) : { contracts: [] };

const cssSrc = path.join(root, 'site', 'assets', 'goalos-v41-autopilot.css');
const jsSrc = path.join(root, 'site', 'assets', 'goalos-v41-autopilot.js');
if (!fs.existsSync(cssSrc) || !fs.existsSync(jsSrc)) {
  throw new Error('Missing v41 CSS/JS assets. Upload the complete v41 package.');
}

const publicData = {
  version: data.version,
  name: data.name,
  publicSafeBoundary: data.publicSafeBoundary,
  roles: data.roles,
  modes: data.modes,
  playbooks: data.playbooks,
  routeAllowlist: data.routeAllowlist
};
fs.writeFileSync(path.join(site, 'goalos-v41-autopilot-knowledge.json'), JSON.stringify(publicData, null, 2));
fs.writeFileSync(path.join(site, 'goalos-v41-contract-rails-index.json'), JSON.stringify({
  releaseFacts: contractData.releaseFacts || {},
  externalAgialpha: contractData.externalAgialpha || {},
  contracts: contractData.contracts || [],
  families: contractData.families || [],
  tiers: contractData.tiers || []
}, null, 2));
fs.writeFileSync(path.join(site, 'goalos-v41-autopilot-policy.json'), JSON.stringify({
  defaultMode: 'browser-local',
  localQuestionInput: true,
  externalAiCallsByDefault: false,
  uploadAllowed: false,
  walletActions: false,
  payments: false,
  analytics: false,
  cookies: false,
  routeAllowlistOnly: true,
  endpointMode: 'optional server-side adapter only; never expose API keys in browser JavaScript',
  productionRequirements: ['rate limits','origin allowlist','moderation/policy filter','prompt-injection defenses','same-site route allowlist','no raw prompt logging by default','human review for settlement or production authority']
}, null, 2));

const contracts = contractData.contracts || [];
const aliases = ['goalos-autopilot.html','autopilot.html','tell-goalos.html','universal-command-box.html','goalos-take-care-of-everything.html','mission-autopilot.html','intent-to-mission.html','v41.html'];
const commandAliases = ['goalos-v22-v41-command-center.html'];

function esc(s){return String(s).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));}
function nav(){return `<nav class="nav"><div class="wrap nav-inner"><a class="brand" href="index.html"><span class="orb"></span><span>GOALOS SIGNOFF PRO</span></a><div class="nav-actions"><a class="pill primary" href="goalos-autopilot.html">Autopilot</a><a class="pill" href="ask-goalos-live.html">Ask GoalOS</a><a class="pill" href="public-demo-labs.html">All labs</a><a class="pill" href="agialpha-48-contract-atlas.html">48 contracts</a><a class="pill" href="browser-beta.html">Browser beta</a></div></div></nav>`}
function footer(){return `<footer class="footer"><div class="wrap"><strong>GoalOS Universal Autopilot v41</strong><p>Public-safe demo. Local question input is processed in the browser by default. No uploads, cookies, analytics, wallets, payments, external AI calls by default, personal/confidential data requirement, or value moved. No claim of production activation, live settlement, legal certification, investment advice, achieved AGI, achieved ASI, or autonomous deployment authority.</p></div></footer><div class="floating"><a class="pill primary" href="goalos-autopilot.html">Autopilot</a><a class="pill" href="public-demo-labs.html">All labs</a><a class="pill" href="ask-goalos-live.html">Ask</a></div><div id="toast" style="position:fixed;left:50%;bottom:84px;transform:translateX(-50%);background:#0b1020;border:1px solid rgba(255,255,255,.18);padding:10px 14px;border-radius:999px;opacity:0;transition:.2s;z-index:80">Copied.</div>`}
function page(){return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>GoalOS Autopilot — Tell GoalOS what you want</title><meta name="description" content="A public-safe GoalOS Autopilot console: type what you want, receive a mission plan, evidence checklist, route, protocol map, and synthetic receipt."><link rel="stylesheet" href="assets/goalos-v41-autopilot.css"></head><body>${nav()}<main><section class="hero"><div class="wrap"><div class="hero-card"><div class="eyebrow">v41 · Universal Autopilot Command Console</div><h1>Tell GoalOS what you want.</h1><p>GoalOS turns plain-language intent into a mission, acceptance criteria, evidence plan, review route, protocol rail map, and synthetic Mission Receipt — all in a button-safe, browser-local public demo.</p><div class="hero-actions"><a class="pill primary" href="#console">Start Autopilot</a><a class="pill gold" href="ai-research-strategy-signoff-console.html">Product-first Signoff</a><a class="pill" href="agialpha-48-contract-atlas.html">Explore 48 contracts</a><a class="pill" href="loop-rsi-asi-superintelligence-mission-simulator-lab.html">RSI / ASI simulator</a></div></div></div></section><section class="wrap grid cols-3"><div class="panel"><div class="eyebrow">One box</div><h3>Describe the outcome</h3><p class="muted">Use normal language: “I need a client to accept an AI report,” “release a DAO grant only after proof,” or “govern a Move‑37 candidate.”</p></div><div class="panel"><div class="eyebrow">Autoplan</div><h3>Mission, proof, route</h3><p class="muted">The console maps your request to evidence, gates, review, protocol rails, and the next page to open.</p></div><div class="panel"><div class="eyebrow">Boundary</div><h3>Local by default</h3><p class="muted">The text stays in the browser unless a future server-side endpoint is deliberately deployed. No API keys in the browser.</p></div></section><section id="console" class="wrap console"><div class="input-card"><div class="eyebrow">User intent</div><h2>What do you want GoalOS to take care of?</h2><textarea id="intent" aria-label="Describe what you want GoalOS to do"></textarea><div class="chips"><button class="chip active" data-role="first_timer">First-time visitor</button><button class="chip" data-role="ai_consultant">AI consultant</button><button class="chip" data-role="client_reviewer">Client reviewer</button><button class="chip" data-role="dao_treasury">DAO / treasury</button><button class="chip" data-role="protocol_operator">Protocol operator</button><button class="chip" data-role="rsi_governance">RSI / ASI</button></div><div class="chips"><button class="chip active" data-mode="start">Start</button><button class="chip" data-mode="signoff">Signoff</button><button class="chip" data-mode="proof">Proof</button><button class="chip" data-mode="settlement">Settlement</button><button class="chip" data-mode="protocol">48 contracts</button><button class="chip" data-mode="rsi">RSI / ASI</button></div><div class="button-row"><button class="primary" id="runAutopilot">Run Autopilot</button><button id="copyStandard">Copy public standard</button></div><div class="notice"><strong>Try:</strong> <button data-example="I delivered an AI research report to a client and need proof that it is ready to accept.">AI report signoff</button> <button data-example="We need to release a DAO grant milestone only if evidence, review, and challenge windows pass.">DAO grant payout</button> <button data-example="Explain which 48 Mainnet contracts support verified Signoff and settlement.">48 contracts</button> <button data-example="I want to govern a Move-37 breakthrough candidate with replay, stress tests, and a dossier.">RSI breakthrough</button></div></div><div class="result-card" id="result"></div></section><section class="wrap grid cols-2"><div class="panel"><div class="eyebrow">Customer product</div><h2>Proof-to-acceptance first.</h2><p class="muted">The first product remains simple: define done, submit work, check evidence, obtain human approval, issue a Mission Receipt.</p><a class="pill primary" href="ai-research-strategy-signoff-console.html">Open Signoff product console</a></div><div class="panel"><div class="eyebrow">Protocol underneath</div><h2>Proof-to-payment later.</h2><p class="muted">When authorized and audited, GoalOS can map accepted work to commitments, dockets, proof bundles, reviewer bonds, credentials, reputation, disputes, rewards, and settlement rails.</p><a class="pill" href="agialpha-48-contract-atlas.html">Open 48-contract atlas</a></div></section><section class="wrap panel"><div class="eyebrow">Full autonomous flow</div><h2>Intent → Mission → Evidence → Review → Receipt → Route</h2><div class="timeline"><div><strong>1. Intent</strong><br><span class="muted">Understand what the visitor wants.</span></div><div><strong>2. Mission</strong><br><span class="muted">Define done, constraints, risk, authority.</span></div><div><strong>3. Proof</strong><br><span class="muted">Build evidence checklist and proof objects.</span></div><div><strong>4. Review</strong><br><span class="muted">Route to signoff, reviewer, or council.</span></div><div><strong>5. Receipt</strong><br><span class="muted">Generate a synthetic acceptance record.</span></div></div></section></main><script>window.GOALOS_V41_DATA=${JSON.stringify(publicData)};window.GOALOS_V41_CONTRACTS=${JSON.stringify(contracts).replace(/</g,'\\u003c')};</script><script src="assets/goalos-v41-autopilot.js"></script>${footer()}</body></html>`}
const html = page();
for (const a of [...aliases, ...commandAliases]) fs.writeFileSync(path.join(site,a),html);

// Minimal bridge/manifest pages
const manifest = {
  version:'v41',
  generatedAt:new Date().toISOString(),
  routes:[...aliases,...commandAliases],
  assets:['assets/goalos-v41-autopilot.css','assets/goalos-v41-autopilot.js'],
  publicSafe: true,
  localQuestionInput: true,
  externalAiCallsByDefault: false,
  contractsIndexed: contracts.length,
  suite:'v22-v41'
};
fs.writeFileSync(path.join(site,'goalos-v41-autopilot-manifest.json'),JSON.stringify(manifest,null,2));
fs.writeFileSync(path.join(site,'goalos-v41-route-allowlist.json'),JSON.stringify({routes:data.routeAllowlist},null,2));
fs.writeFileSync(path.join(site,'goalos-v22-v41-route-catalog.json'),JSON.stringify({version:'v22-v41', latest:'v41', flagship:'goalos-autopilot.html', routes:[...new Set([...(data.routeAllowlist||[]),...aliases,...commandAliases])]},null,2));

// Optional discoverability injection, additive only.
function inject(file){
  const p=path.join(site,file); if(!fs.existsSync(p)) return;
  let s=fs.readFileSync(p,'utf8'); if(s.includes('goalos-v41-autopilot.css')) return;
  const link='<link rel="stylesheet" href="assets/goalos-v41-autopilot.css">';
  s=s.replace('</head>',`${link}</head>`);
  const cta='<div style="position:fixed;right:18px;bottom:18px;z-index:9999"><a href="goalos-autopilot.html" style="display:inline-flex;align-items:center;gap:8px;padding:12px 16px;border-radius:999px;background:linear-gradient(90deg,#a8ff9e,#63f6e8);color:#06120f;font-weight:900;text-decoration:none;box-shadow:0 20px 60px rgba(0,0,0,.35)">Tell GoalOS what you want</a></div>';
  s=s.replace('</body>',`${cta}</body>`);
  fs.writeFileSync(p,s);
}
['index.html','public-demo-labs.html','website-guide.html'].forEach(inject);

fs.writeFileSync(path.join(root,'verification','GOALOS_V41_AUTOPILOT_VALIDATION.md'),`# GoalOS v41 Autopilot Validation\n\nGenerated routes: ${manifest.routes.join(', ')}\n\nContracts indexed: ${contracts.length}\n\nPublic-safe default: browser-local text input, no uploads, no wallets, no payments, no external AI calls by default.\n`);
console.log(`GoalOS Universal Autopilot v41 build complete: ${manifest.routes.length} routes, ${contracts.length} contracts indexed.`);
