#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import crypto from 'node:crypto';
import { config, siteDir, esc } from './proof-before-settlement-research-lab-core.mjs';

const root = process.cwd();
const sha256 = value => crypto.createHash('sha256').update(String(value)).digest('hex');
const run = script => {
  if (!fs.existsSync(path.join(root, script))) { console.log(`skip missing ${script}`); return; }
  const r = spawnSync(process.execPath, [script], { cwd: root, stdio: 'inherit' });
  if (r.status !== 0) process.exit(r.status || 1);
};

fs.mkdirSync(siteDir, { recursive: true });
if (fs.existsSync(path.join(root, 'scripts/build-goalos-signoff-public-labs-v22-v29.mjs'))) run('scripts/build-goalos-signoff-public-labs-v22-v29.mjs');
else if (fs.existsSync(path.join(root, 'scripts/build-goalos-signoff-public-labs-v22-v27.mjs'))) run('scripts/build-goalos-signoff-public-labs-v22-v27.mjs');
run('scripts/build-proof-before-settlement-research-lab-page.mjs');

function loadBaseManifest() {
  const candidates = ['goalos-public-demo-labs-v22-v29.json','goalos-public-demo-labs-v22-v28.json','goalos-public-demo-labs-v22-v27.json'];
  for (const c of candidates) {
    const p = path.join(siteDir, c);
    if (fs.existsSync(p)) return JSON.parse(fs.readFileSync(p, 'utf8'));
  }
  return { posture: { browserLocal: true, forms: false, inputs: false, uploads: false, cookies: false, analytics: false, wallets: false, payments: false, personalData: false, confidentialData: false, valueMoved: 0 }, routes: ['public-demo-labs.html','goalos-public-demo-labs.html'], labs: [] };
}
const base = loadBaseManifest();
const v30 = {
  version: 'v30',
  title: 'Proof Before Settlement Institutional Research Lab',
  route: config.primaryRoute,
  aliases: config.aliases,
  proof: 'Research paper → proof model → acceptance predicate → settlement-safety invariant → adoption mandate.',
  audience: 'Foundations, DAOs, auditors, investors, exchanges, enterprises, partners, and serious blockchain projects.',
  promise: 'Turns the elite Proof Before Settlement paper into a public standard stakeholders can read, download, cite, and require.',
  artifacts: ['proof-before-settlement-research-manifest.json','proof-before-settlement-executive-tear-sheet.json','proof-before-settlement-acceptance-predicate.json','settlement-safety-invariant.json','claim-maturity-lattice-v30.json','proof-before-settlement-due-diligence-rubric.json','proof-before-settlement-adoption-blueprint.json','proof-before-settlement-mandate-clauses.json','research-to-product-translation-map.json','proof-before-settlement-research-demo-bundle.json']
};
const labs = [...(base.labs || []).filter(l => l.version !== 'v30'), v30].sort((a,b) => Number(String(a.version).replace(/\D/g,'')) - Number(String(b.version).replace(/\D/g,'')));
const routeSet = new Set(['public-demo-labs.html','goalos-public-demo-labs.html']);
for (const lab of labs) for (const r of [lab.route, ...(lab.aliases || [])]) routeSet.add(r);
const shortRoutes = ['paper.html','research.html','proof-before-settlement-paper.html','settlement-safety-lab.html','institutional-research-lab.html'];
for (const r of shortRoutes) routeSet.add(r);
const manifest = {
  id: 'goalos-signoff-pro-public-labs-v22-v30',
  title: 'GoalOS Signoff Pro public demonstration labs v22-v30',
  generatedAt: new Date().toISOString().replace(/\.\d{3}Z$/, 'Z'),
  posture: base.posture || { browserLocal: true, forms: false, inputs: false, uploads: false, cookies: false, analytics: false, wallets: false, payments: false, personalData: false, confidentialData: false, valueMoved: 0 },
  routes: [...routeSet],
  labs,
  flagship: {
    v28: 'Blockchain Credibility Standard Lab',
    v29: 'Blockchain Proof Mandate & Due Diligence Lab',
    v30: 'Proof Before Settlement Institutional Research Lab',
    message: 'Blockchain proves the transaction. GoalOS proves the work.',
    standard: 'No Proof. No Trust. No Settlement.'
  }
};
manifest.manifestHash = `sha256:${sha256(JSON.stringify(manifest))}`;
fs.writeFileSync(path.join(siteDir, 'goalos-public-demo-labs-v22-v30.json'), JSON.stringify(manifest, null, 2) + '\n');

const cards = labs.map((lab, i) => `<article class="card ${lab.version === 'v30' ? 'featured' : ''}"><div class="kicker"><span>${esc(lab.version)}</span><span>${String(i+1).padStart(2,'0')}</span></div><h2>${esc(lab.title)}</h2><p>${esc(lab.promise)}</p><div class="loop"><b>Proof loop</b><span>${esc(lab.proof)}</span></div><div class="audience"><b>Best for</b><span>${esc(lab.audience)}</span></div><a class="open" href="${esc(lab.route)}">Open lab</a></article>`).join('\n');
const rows = labs.map(lab => `<tr><td>${esc(lab.version)}</td><td><a href="${esc(lab.route)}">${esc(lab.title)}</a></td><td>${esc(lab.promise)}</td><td>0</td></tr>`).join('\n');
const css = `:root{color-scheme:dark;--bg:#030608;--panel:rgba(13,25,31,.76);--line:rgba(232,196,110,.30);--text:#fff8ec;--muted:#b8cbd0;--mint:#80ffde;--cyan:#65e8ff;--gold:#e8c46e;--champagne:#fff2c2;--shadow:0 30px 100px rgba(0,0,0,.5)}*{box-sizing:border-box}body{margin:0;background:radial-gradient(circle at 18% 0,rgba(232,196,110,.2),transparent 30%),radial-gradient(circle at 90% 8%,rgba(128,255,222,.13),transparent 32%),linear-gradient(135deg,#02090b,#071416 55%,#030608);color:var(--text);font-family:Inter,ui-sans-serif,system-ui,-apple-system,Segoe UI,sans-serif}a{color:inherit}.top{position:sticky;top:0;z-index:10;display:flex;justify-content:space-between;gap:18px;padding:18px clamp(18px,4vw,56px);background:rgba(2,7,10,.78);backdrop-filter:blur(20px);border-bottom:1px solid var(--line)}.brand{font-weight:950;letter-spacing:.14em;text-transform:uppercase;text-decoration:none}.top nav{display:flex;gap:10px;flex-wrap:wrap}.top nav a{font-size:13px;font-weight:850;text-decoration:none;padding:10px 13px;border:1px solid rgba(255,255,255,.12);border-radius:999px}.wrap{width:min(1240px,calc(100% - 36px));margin:0 auto}.hero{min-height:680px;display:grid;align-items:center;padding:92px 0}.eyebrow{color:var(--gold);font-weight:950;letter-spacing:.36em;text-transform:uppercase;font-size:12px}h1{font-size:clamp(56px,8vw,118px);line-height:.82;letter-spacing:-.075em;margin:20px 0}h1 em{display:block;font-family:Georgia,serif;font-style:italic;font-weight:500;color:transparent;background:linear-gradient(100deg,var(--champagne),var(--gold),var(--mint),var(--cyan));-webkit-background-clip:text}.lead{font-size:clamp(19px,2.2vw,27px);line-height:1.42;color:#e9f3ef;max-width:960px}.btns{display:flex;gap:12px;flex-wrap:wrap;margin-top:26px}.btn{display:inline-flex;align-items:center;justify-content:center;min-height:50px;padding:0 22px;border-radius:999px;text-decoration:none;border:1px solid rgba(255,255,255,.15);font-weight:950}.btn.primary{background:linear-gradient(120deg,var(--champagne),var(--gold),var(--mint));color:#03100f;border:0}.safe{display:flex;gap:9px;flex-wrap:wrap;margin-top:28px}.safe span{padding:9px 11px;border:1px solid rgba(255,255,255,.12);border-radius:999px;color:var(--muted);font-size:12px}.grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px;margin-bottom:70px}.card{padding:26px;border:1px solid var(--line);border-radius:32px;background:linear-gradient(145deg,rgba(255,255,255,.075),rgba(255,255,255,.035));box-shadow:var(--shadow)}.card.featured{grid-column:span 2;border-color:rgba(232,196,110,.64);background:linear-gradient(145deg,rgba(232,196,110,.16),rgba(128,255,222,.06))}.kicker{display:flex;justify-content:space-between;color:var(--gold);font-weight:950;letter-spacing:.2em;text-transform:uppercase;font-size:12px}.card h2{font-size:clamp(30px,3.5vw,54px);line-height:.92;letter-spacing:-.055em;margin:18px 0}.card p,.loop span,.audience span{color:var(--muted);line-height:1.55}.loop,.audience{margin-top:14px;padding-top:14px;border-top:1px solid rgba(255,255,255,.1);display:grid;gap:6px}.loop b,.audience b{color:#fff8ec}.open{display:inline-flex;margin-top:18px;padding:13px 16px;border-radius:999px;background:linear-gradient(120deg,var(--champagne),var(--gold),var(--mint));color:#06100f;text-decoration:none;font-weight:950}.matrix{border:1px solid rgba(255,255,255,.12);border-radius:28px;overflow:auto;background:rgba(255,255,255,.045);margin-bottom:80px}table{width:100%;border-collapse:collapse;min-width:860px}th,td{text-align:left;padding:16px;border-bottom:1px solid rgba(255,255,255,.08);vertical-align:top}th{color:var(--gold);font-size:12px;text-transform:uppercase;letter-spacing:.15em}.footer{border-top:1px solid rgba(255,255,255,.12);padding:30px 0 42px;color:var(--muted)}.site-rule{position:sticky;bottom:0;z-index:50;padding:13px 18px;text-align:center;background:rgba(2,7,9,.9);backdrop-filter:blur(16px);border-top:1px solid var(--line);font-size:13px;color:var(--muted)}.site-rule b{color:var(--gold)}@media(max-width:1050px){.grid{grid-template-columns:1fr}.card.featured{grid-column:auto}.top{align-items:flex-start;flex-direction:column}h1{font-size:54px}}`;
const hub = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>GoalOS Signoff Pro Public Demo Labs v22-v30</title><meta name="description" content="A public-safe suite of GoalOS Signoff Pro demonstration labs."><style>${css}</style></head><body><header class="top"><a class="brand" href="index.html">GoalOS Signoff Pro</a><nav><a href="index.html">Institution</a><a href="goalos-public-demo-labs-v22-v30.json">Manifest</a><a href="proof-before-settlement-research-lab.html">v30</a></nav></header><main class="wrap"><section class="hero"><div><p class="eyebrow">Public demonstration suite · v22-v30</p><h1>Proof-gated work. <em>Now with the research standard.</em></h1><p class="lead">Nine public-safe labs show the GoalOS idea from action authority and evidence lineage to blockchain credibility, stakeholder proof mandates, and the institutional Proof Before Settlement research standard.</p><div class="btns"><a class="btn primary" href="proof-before-settlement-research-lab.html">Open flagship v30</a><a class="btn" href="goalos-public-demo-labs-v22-v30.json">Download manifest</a><a class="btn" href="research/proof-before-settlement/GoalOS_Proof_Before_Settlement_Elite_Edition.pdf">Download paper</a></div><div class="safe"><span>No forms</span><span>No inputs</span><span>No uploads</span><span>No cookies</span><span>No analytics</span><span>No wallets</span><span>No payments</span><span>No personal or confidential data</span><span>0 value moved</span></div></div></section><section class="grid">${cards}</section><section class="matrix"><table><thead><tr><th>Version</th><th>Lab</th><th>Purpose</th><th>Value moved</th></tr></thead><tbody>${rows}</tbody></table></section></main><footer class="wrap footer"><b>GoalOS Signoff Pro public labs v22-v30</b><p>Blockchain proves the transaction. GoalOS proves the work. No Proof. No Trust. No Settlement.</p></footer><div class="site-rule" data-goalos-legal-rail="v12"><b>Public site rule</b> No forms, no inputs, no uploads, no cookies, no analytics, no wallets, no payments, no personal or confidential data.</div></body></html>`;
fs.writeFileSync(path.join(siteDir, 'public-demo-labs.html'), hub);
fs.writeFileSync(path.join(siteDir, 'goalos-public-demo-labs.html'), hub);

const indexPath = path.join(siteDir, 'index.html');
if (fs.existsSync(indexPath)) {
  let index = fs.readFileSync(indexPath, 'utf8')
    .replace(/12 packet files/g, '14 packet files')
    .replace(/<!-- GOALOS_PUBLIC_LABS_V22_V27_START -->[\s\S]*?<!-- GOALOS_PUBLIC_LABS_V22_V27_END -->/g, '')
    .replace(/<!-- GOALOS_PUBLIC_LABS_V22_V28_START -->[\s\S]*?<!-- GOALOS_PUBLIC_LABS_V22_V28_END -->/g, '')
    .replace(/<!-- GOALOS_PUBLIC_LABS_V22_V29_START -->[\s\S]*?<!-- GOALOS_PUBLIC_LABS_V22_V29_END -->/g, '')
    .replace(/<!-- GOALOS_PUBLIC_LABS_V22_V30_START -->[\s\S]*?<!-- GOALOS_PUBLIC_LABS_V22_V30_END -->/g, '');
  const spotlight = `<!-- GOALOS_PUBLIC_LABS_V22_V30_START --><section class="goalos-public-labs-v22-v30" style="width:min(1180px,92vw);margin:88px auto;padding:clamp(24px,4vw,42px);border:1px solid rgba(232,196,110,.38);border-radius:40px;background:radial-gradient(circle at 15% 0,rgba(232,196,110,.17),transparent 36%),linear-gradient(145deg,rgba(12,31,36,.95),rgba(4,8,10,.98));box-shadow:0 34px 110px rgba(0,0,0,.42)"><div style="color:#e8c46e;font-weight:950;letter-spacing:.24em;text-transform:uppercase;font-size:12px">GoalOS Signoff Pro · flagship public labs v22-v30</div><h2 style="font-size:clamp(42px,7vw,96px);line-height:.84;letter-spacing:-.08em;margin:16px 0 18px;color:#fff8ee">Blockchain proves the transaction.<br><span style="background:linear-gradient(90deg,#fff2c2,#e8c46e,#86ffdf,#68e9ff);-webkit-background-clip:text;background-clip:text;color:transparent">GoalOS proves the work.</span></h2><p style="max-width:960px;color:#d9edf0;font-size:19px;line-height:1.58">v30 adds the institutional Proof Before Settlement research lab: a prestigious public paper, formal proof model, adoption blueprint, mandate clauses, and due-diligence artifacts for serious blockchain credibility.</p><p><a href="proof-before-settlement-research-lab.html" style="display:inline-block;margin:12px 10px 0 0;padding:15px 19px;border-radius:999px;background:linear-gradient(135deg,#fff2c2,#e8c46e,#86ffdf);color:#061010;font-weight:950;text-decoration:none">Open v30 research lab</a><a href="research/proof-before-settlement/GoalOS_Proof_Before_Settlement_Elite_Edition.pdf" style="display:inline-block;margin:12px 10px 0 0;padding:15px 19px;border-radius:999px;border:1px solid rgba(255,255,255,.18);color:#d9edf0;text-decoration:none;font-weight:850">Download paper</a><a href="public-demo-labs.html" style="display:inline-block;margin:12px 0 0 0;padding:15px 19px;border-radius:999px;border:1px solid rgba(255,255,255,.18);color:#d9edf0;text-decoration:none;font-weight:850">View all labs</a></p><div style="margin-top:28px;padding:20px;border:1px solid rgba(255,232,137,.32);border-radius:28px;background:rgba(255,232,137,.075);color:#fff8ee"><b style="display:block;font-size:22px;margin-bottom:8px">No Proof. No Trust. No Settlement.</b><span style="color:#d9edf0;line-height:1.5">Public-safe demonstration only: no forms, no inputs, no uploads, no cookies, no analytics, no wallets, no payments, no personal or confidential data, and zero value moved.</span></div></section><!-- GOALOS_PUBLIC_LABS_V22_V30_END -->`;
  const pos = index.lastIndexOf('</main>');
  index = pos >= 0 ? index.slice(0, pos) + spotlight + index.slice(pos) : index.replace(/<\/body>/i, spotlight + '</body>');
  fs.writeFileSync(indexPath, index);
}

const siteMap = {
  id: 'goalos-signoff-pro-institutional-site-map-v22-v30',
  generatedAt: new Date().toISOString().replace(/\.\d{3}Z$/, 'Z'),
  canonicalMessage: 'Blockchain proves the transaction. GoalOS proves the work.',
  standard: 'No Proof. No Trust. No Settlement.',
  flagshipRoute: config.primaryRoute,
  paper: 'research/proof-before-settlement/GoalOS_Proof_Before_Settlement_Elite_Edition.pdf',
  publicSafePosture: manifest.posture,
  routes: manifest.routes
};
siteMap.hash = `sha256:${sha256(JSON.stringify(siteMap))}`;
fs.writeFileSync(path.join(siteDir, 'goalos-signoff-pro-site-map-v22-v30.json'), JSON.stringify(siteMap, null, 2) + '\n');
console.log(`GoalOS Signoff Pro public labs v22-v30 generated ${manifest.routes.length} routes and manifest goalos-public-demo-labs-v22-v30.json`);
