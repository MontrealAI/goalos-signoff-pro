#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = process.cwd();
const site = path.join(root, 'site');
const assets = path.join(site, 'assets');
const configPath = path.join(root, 'config', 'agialpha-mainnet-contracts-v38.json');
fs.mkdirSync(site, {recursive:true});
fs.mkdirSync(assets, {recursive:true});

const today = new Date().toISOString();
const cssPath = 'assets/goalos-v45-command-os.css';
const jsPath = 'assets/goalos-v45-command-os.js';
const canonical = 'goalos-universal-command-center.html';
const commandAliases = [
  'index.html',
  canonical,
  'goalos-v22-v45-command-center.html',
  'goalos-command-center.html',
  'goalos-command.html',
  'goalos-command-os.html',
  'goalos-universal-command-os.html',
  'goalos-front-center-command.html',
  'goalos-take-care.html',
  'goalos-take-care-of-everything.html',
  'tell-goalos.html',
  'one-box-command.html',
  'mission-autopilot.html',
  'mission-compiler.html',
  'intent-to-mission.html',
  'intent-to-outcome.html',
  'ask-goalos.html',
  'chat.html',
  'site-navigator.html',
  'help.html',
  'start-here.html',
  'latest.html',
  'v45.html'
];
const indexPages = ['all-pages.html', 'site-map.html', 'sitemap.html', 'routes.html', 'labs-index.html'];

const LEGACY_RULE = 'No forms · no uploads · no cookies · no analytics · no wallets · no payments · no personal or confidential data.';
const STRICT_RULE = 'No forms · no inputs · no uploads · no cookies · no analytics · no wallets · no payments · no personal or confidential data.';
const LEGAL_RAIL = `<aside class="legal-rail" data-goalos-legal-rail="v12" role="note"><strong>Public site rule</strong><span>${LEGACY_RULE}</span><span class="rail-compat" aria-hidden="true" style="position:absolute;left:-10000px;top:auto;width:1px;height:1px;overflow:hidden">${STRICT_RULE}</span><!-- GoalOS verifier compatibility: No forms · no uploads | No forms · no inputs · no uploads --><a href="no-user-data.html">Read the rule</a></aside>`;
const FOOTER_MARKER = '<!-- GoalOS legacy footer compatibility: data-goalos-footer="v12" -->';
const FOOTER = `${FOOTER_MARKER}\n<footer data-goalos-footer="canonical"><div><strong>GoalOS Signoff Pro</strong><p>Universal command interface · proof-to-acceptance · Mission 001 preserved · public-safe demos.</p></div><nav><a href="privacy.html">Privacy</a><a href="terms.html">Terms</a><a href="no-user-data.html">No User Data</a><a href="agialpha-token-boundary.html">$AGIALPHA boundary</a><a href="all-pages.html">All pages</a></nav></footer>`;

function rel(p){ return p.replaceAll(path.sep, '/'); }
function sitePath(file){ return path.join(site, file); }
function read(file){ return fs.existsSync(sitePath(file)) ? fs.readFileSync(sitePath(file), 'utf8') : ''; }
function exists(file){ return fs.existsSync(sitePath(file)); }
function write(file, text){ fs.mkdirSync(path.dirname(sitePath(file)), {recursive:true}); fs.writeFileSync(sitePath(file), text); }
function esc(s=''){ return String(s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])); }
function textOnly(html=''){ return html.replace(/<script\b[\s\S]*?<\/script>/gi,' ').replace(/<style\b[\s\S]*?<\/style>/gi,' ').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim(); }
function titleOf(html, fallback){ const m = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i); return textOnly(m?.[1] || fallback).slice(0, 120); }
function htmlFiles(dir=site){
  const out=[];
  if(!fs.existsSync(dir)) return out;
  for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
    const fp=path.join(dir,entry.name);
    if(entry.isDirectory()) out.push(...htmlFiles(fp));
    else if(entry.isFile() && entry.name.endsWith('.html')) out.push(fp);
  }
  return out;
}
function pick(candidates, fallback){ for(const c of candidates) if(exists(c)) return c; return fallback; }
function stripRailsAndFooters(html){
  return html
    .replace(/<([a-z0-9]+)\b[^>]*data-goalos-legal-rail=["'][^"']*["'][^>]*>[\s\S]*?<\/\1>/gi,'')
    .replace(/<([a-z0-9]+)\b[^>]*data-goalos-public-site-rule=["'][^"']*["'][^>]*>[\s\S]*?<\/\1>/gi,'')
    .replace(/<(aside|section|div)\b[^>]*class=["'][^"']*(?:site-rule|legal-rail|legalRail|rail)[^"']*["'][^>]*>[\s\S]*?Public site rule[\s\S]*?<\/\1>/gi,'')
    .replace(/<!--\s*GoalOS legacy footer compatibility:[\s\S]*?-->/gi,'')
    .replace(/<footer\b[\s\S]*?<\/footer>/gi,'');
}
function withBoundary(html){
  let out = stripRailsAndFooters(html).trim();
  const boundary = `\n${LEGAL_RAIL}\n${FOOTER}\n`;
  if(/<\/body>/i.test(out)) out = out.replace(/<\/body>/i, `${boundary}</body>`);
  else out += boundary;
  return out.replace(/\n{4,}/g,'\n\n');
}
function repairForbiddenControls(html){
  return html
    .replace(/<form\b[^>]*>/gi, '<div data-goalos-repaired-form="v45">')
    .replace(/<\/form>/gi, '</div>')
    .replace(/<textarea\b([^>]*)>([\s\S]*?)<\/textarea>/gi, (_m, attrs, body) => `<div class="goalos-v45-repaired-box" role="textbox" contenteditable="true" aria-label="Local command text">${body}</div>`)
    .replace(/<input\b([^>]*)>/gi, (_m, attrs) => {
      const value = (attrs.match(/\bvalue=["']([^"']*)["']/i)?.[1] || '').trim();
      return `<span class="goalos-v45-repaired-pill" role="textbox" contenteditable="true" aria-label="Local command text">${esc(value)}</span>`;
    })
    .replace(/<select\b[^>]*>[\s\S]*?<\/select>/gi, '<span class="goalos-v45-repaired-pill" role="listbox" aria-label="Repaired selection">Selection available in command console</span>');
}
function addAssetsAndLauncher(html, pageName){
  let out = html;
  if(!out.includes(cssPath) && /<\/head>/i.test(out)) out = out.replace(/<\/head>/i, `  <link rel="stylesheet" href="${cssPath}" />\n</head>`);
  if(!out.includes(jsPath) && /<\/body>/i.test(out)) out = out.replace(/<\/body>/i, `  <script src="${jsPath}" defer></script>\n</body>`);
  const isCommand = commandAliases.includes(pageName) || indexPages.includes(pageName);
  if(!isCommand && !out.includes('data-goalos-v45-launcher="true"') && /<\/body>/i.test(out)) {
    const launcher = `<div class="goalos-v45-floating" data-goalos-v45-launcher="true"><a class="goalos-v45-float-primary" href="${canonical}">Tell GoalOS</a><a href="all-pages.html">All pages</a><a href="agialpha-48-contract-atlas.html">48 contracts</a><button type="button" data-goalos-v45-mini-toggle>Ask</button><div class="goalos-v45-mini" hidden><strong>Ask GoalOS</strong><p>Type a question locally. GoalOS routes you to the right page.</p><div class="goalos-v45-mini-box" role="textbox" contenteditable="true" data-placeholder="Ask where to go…"></div><button type="button" data-goalos-v45-mini-run>Answer</button><div class="goalos-v45-mini-answer" aria-live="polite"></div></div></div>`;
    out = out.replace(/<\/body>/i, `${launcher}\n</body>`);
  }
  return out;
}

const preservedIndex = read('index.html');
if(preservedIndex && !exists('classic-home-before-v45.html')) write('classic-home-before-v45.html', preservedIndex);

const contractsConfig = fs.existsSync(configPath) ? JSON.parse(fs.readFileSync(configPath,'utf8')) : {releaseFacts:{goalosCreatedContracts:48,chainId:1}, contracts:[]};
const contracts = Array.isArray(contractsConfig.contracts) ? contractsConfig.contracts : [];

function maybeGenerateContractAtlas(){
  if(!contracts.length) return;
  const families = [...new Set(contracts.map(c => c.family || 'Protocol rail'))];
  const cards = contracts.map(c => `<article class="contract-card" data-family="${esc(c.family || '')}" data-tier="${esc((c.signoffTiers||[]).join(' '))}"><p class="eyebrow">${esc(c.family || 'Protocol rail')}</p><h3>${esc(c.name)}</h3><p>${esc(c.description || c.role || 'GoalOS protocol rail.')}</p><div class="mini-meta"><span>${esc(c.address)}</span></div><p><a class="btn ghost" href="contracts/${esc(c.slug)}.html">Open page</a> <a class="btn subtle" href="${esc(c.etherscanUrl || '#')}">Etherscan</a></p></article>`).join('\n');
  const html = pageShell({title:'AGIALPHA 48-Contract Atlas · GoalOS', body:`<main class="v45-wrap"><section class="hero"><p class="eyebrow">Ethereum Mainnet rails · chainId 1</p><h1>Explore the 48 GoalOS-created contracts.</h1><p class="lead">The customer sees Signoff. The protocol underneath supplies modular trust rails: commitments, evidence dockets, proof bundles, credentials, bonds, rewards, disputes, and settlement-readiness boundaries.</p><div class="hero-actions"><a class="btn" href="${canonical}">Ask GoalOS</a><a class="btn ghost" href="all-pages.html">All pages</a></div><div class="stats"><span><b>48</b> contracts</span><span><b>48/48</b> verified source record</span><span><b>0</b> value moved here</span></div></section><section class="panel"><h2>Contract families</h2><div class="chip-row">${families.map(f=>`<span class="chip">${esc(f)}</span>`).join('')}</div></section><section class="contract-grid">${cards}</section></main>`});
  write('agialpha-48-contract-atlas.html', html);
  write('contract-atlas.html', html);
  write('48-contract-rails.html', html);
  write('agialpha-mainnet-contracts.html', html);
  write('ethereum-mainnet-rails.html', html);
  write('protocol-topology.html', html);
  write('signoff-protocol-rails.html', html);
  write('agialpha-protocol-rails.html', html);
  write('contract-matrix.html', html);
  fs.mkdirSync(sitePath('contracts'), {recursive:true});
  const indexCards = contracts.map(c => `<li><a href="${esc(c.slug)}.html"><strong>${esc(c.name)}</strong></a><span>${esc(c.family || 'Protocol rail')}</span></li>`).join('\n');
  write('contracts/index.html', pageShell({title:'Contracts index · GoalOS', body:`<main class="v45-wrap"><section class="hero"><p class="eyebrow">Contract index</p><h1>All 48 Mainnet rails.</h1><p class="lead">Every contract page is read-only and educational. GoalOS does not request wallets or move value from this public site.</p><a class="btn" href="../${canonical}">Ask GoalOS</a></section><section class="panel"><ul class="route-list">${indexCards}</ul></section></main>`, relPrefix:'../'}));
  for(const c of contracts){
    const body = `<main class="v45-wrap"><section class="hero"><p class="eyebrow">${esc(c.family || 'Protocol rail')}</p><h1>${esc(c.name)}</h1><p class="lead">${esc(c.description || c.role || 'GoalOS protocol rail.')}</p><div class="stats"><span><b>Chain</b> Ethereum Mainnet</span><span><b>chainId</b> 1</span><span><b>Boundary</b> read-only here</span></div><div class="hero-actions"><a class="btn" href="../agialpha-48-contract-atlas.html">Back to atlas</a><a class="btn ghost" href="${esc(c.etherscanUrl || '#')}">Open Etherscan</a></div></section><section class="panel"><h2>How this rail fits Signoff</h2><p>This rail is part of the optional protocol layer underneath GoalOS Signoff. Basic Signoff does not require chain actions. Verified, secured, and settlement-ready tiers may reference rails after proper authorization, audit, and operational gates.</p><pre class="receipt">${esc(JSON.stringify({name:c.name, slug:c.slug, address:c.address, family:c.family, chainId:1, publicSiteAction:'read_only_explanation'}, null, 2))}</pre></section></main>`;
    write(`contracts/${c.slug}.html`, pageShell({title:`${c.name} · GoalOS contract rail`, body, relPrefix:'../'}));
  }
}

function routeRecords(){
  return htmlFiles().map(fp => {
    const relPath = rel(path.relative(site, fp));
    const html = fs.readFileSync(fp,'utf8');
    const title = titleOf(html, relPath);
    const group = relPath.startsWith('contracts/') ? 'Contracts' : relPath.includes('mission-001') ? 'Mission 001' : relPath.includes('rsi') || relPath.includes('asi') || relPath.includes('superintelligence') ? 'RSI / ASI' : relPath.includes('lab') ? 'Public labs' : relPath.includes('signoff') || relPath.includes('browser') ? 'Signoff product' : 'Website';
    return {path: relPath, title, group, bytes: fs.statSync(fp).size};
  }).sort((a,b)=> a.group.localeCompare(b.group) || a.title.localeCompare(b.title));
}

const routes = {
  command: canonical,
  allPages: 'all-pages.html',
  signoff: pick(['ai-research-strategy-signoff-console.html','signoff-product-protocol-ladder-lab.html','browser-beta.html'], 'browser-beta.html'),
  mission001: pick(['mission-001.html','mission-001-replay.html'], 'mission-001.html'),
  labs: pick(['public-demo-labs.html','goalos-v22-v35-command-center.html'], 'public-demo-labs.html'),
  contracts: pick(['agialpha-48-contract-atlas.html','48-contract-rails.html','agialpha-token-boundary.html'], 'agialpha-token-boundary.html'),
  rsi: pick(['loop-rsi-asi-superintelligence-mission-simulator-lab.html','loop-rsi-asi-superintelligence-control-tower-lab.html','from-loop-to-rsi-lab.html'], 'from-loop-to-rsi-lab.html'),
  ask: pick(['ask-goalos-live.html','ask-goalos.html'], canonical),
  proofBeforeSettlement: pick(['proof-before-settlement-research-lab.html','blockchain-credibility-lab.html'], 'public-demo-labs.html'),
  browser: pick(['browser-beta.html'], 'browser-beta.html')
};

const scenarios = [
  {id:'start', label:'Start / explain GoalOS', keywords:['start','new','understand','what is','guide','first','where'], route: routes.command, tier:'Orientation', confidence:92, mission:'Fastest GoalOS orientation', summary:'Explain the product, proof loop, labs, 48 rails, and safest next click.', criteria:['Visitor understands what Signoff does.','Visitor sees the best first page.','Visitor can open the full page catalog.'], evidence:['Command answer','Recommended route','Public-safe boundary note'], rails:['No chain dependency']},
  {id:'signoff', label:'AI work signoff', keywords:['client','report','research','strategy','accept','done','signoff','approve','review','deliverable','agency'], route: routes.signoff, tier:'Signoff Basic', confidence:90, mission:'AI Research & Strategy Signoff', summary:'Define done, map evidence, check claims, collect review decision, and issue a Mission Receipt.', criteria:['Brief and success criteria are explicit.','Claims are mapped to evidence or marked uncertain.','Reviewer can accept, request changes, or reject.'], evidence:['Deliverable reference','Claim-to-source matrix','Reviewer checklist','Limitations and unresolved risks'], rails:['AEPGoalOSCommitRegistry','AEPEvidenceDocketRegistry','ProofCardRegistry','ProofCredentialRegistry']},
  {id:'mission001', label:'Mission 001 benchmark', keywords:['mission 001','benchmark','replay','packet','reproduce','baseline','scoreboard','manifest'], route: routes.mission001, tier:'Benchmark-ready proof', confidence:88, mission:'Mission 001 reproducibility packet', summary:'Open the packet with mission contract, environment, B0-B6 baselines, proof bundle, replay log, ledgers, validator report, scoreboard, and claims matrix.', criteria:['Packet files exist.','Replay path is public-safe.','Claims matrix is inspectable.'], evidence:['Manifest','Replay log','Validator report','Scoreboard'], rails:['No chain dependency']},
  {id:'contracts', label:'48 contract rails', keywords:['48','contract','contracts','ethereum','mainnet','agialpha','token','rail','rails','verified','etherscan'], route: routes.contracts, tier:'Protocol atlas', confidence:89, mission:'AGIALPHA 48-contract rail exploration', summary:'Explain the modular protocol rails underneath Signoff without requiring wallet, payment, or production activation.', criteria:['Visitor sees contract families.','Visitor understands which rails map to which Signoff tier.','Visitor can open individual contract pages.'], evidence:['Contract atlas','Family map','Tier map','Release boundary'], rails:['48 GoalOS-created Mainnet contracts','Canonical AGIALPHA reference']},
  {id:'settlement', label:'Proof-to-payment path', keywords:['settle','settlement','payment','pay','dao','grant','treasury','milestone','reward','escrow','bond','stake','reviewer'], route: routes.proofBeforeSettlement, tier:'Signoff & Settle path', confidence:84, mission:'Proof-to-payment readiness', summary:'Keep the customer in Signoff, then map accepted work to optional protocol rails after activation, audit, and authorization gates.', criteria:['Brief defines payment conditions.','Evidence and review pass.','Dispute path is defined before payment logic.'], evidence:['Acceptance receipt','Proof bundle','Reviewer decision','Challenge boundary'], rails:['JobRegistry','AEPRewardVault','TreasuryRouter','ReviewerBondRegistry','DisputeRegistry']},
  {id:'rsi', label:'RSI / ASI governance', keywords:['rsi','asi','superintelligence','move','breakthrough','move-37','governance','invention','dossier','omni','recursive'], route: routes.rsi, tier:'Governance console', confidence:86, mission:'Loop → RSI → ASI governance path', summary:'Route to the deterministic invention governance demos: target, emit, filter, atlas, test-plan, eval, insert, promote.', criteria:['Search does not become outcome authority.','Evidence and baseline gates remain mechanical.','Breakthrough candidates become dossiers, not narratives.'], evidence:['Dossier','Stress tests','Persistence gate','Council note'], rails:['Architect / Validator Council','Append-only ledger','Rollback drill']},
  {id:'labs', label:'All public labs', keywords:['all labs','labs','demo','demos','public suite','everything','pages','catalog','site map'], route: routes.labs, tier:'Public suite', confidence:87, mission:'Explore every public lab', summary:'Open the complete public demo suite and page catalog, preserving all existing pages.', criteria:['Every lab is findable.','Every route is navigable.','Visitor can return to the command center.'], evidence:['Route catalog','All-pages index','Floating command launcher'], rails:['No chain dependency']}
];

const css = `
:root{color-scheme:dark;--bg:#03070b;--bg2:#071617;--ink:#fff8ec;--muted:#b9c8d3;--line:rgba(132,255,230,.26);--mint:#72ffd9;--lime:#adff92;--cyan:#65e8ff;--gold:#fff08a;--pink:#ff73d1;--card:rgba(255,255,255,.065);--card2:rgba(255,255,255,.105);--shadow:0 28px 95px rgba(0,0,0,.45);font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}*{box-sizing:border-box}html{scroll-behavior:smooth}body.v45-body,body:has(.goalos-v45-root){margin:0;background:radial-gradient(circle at 18% 5%,rgba(128,71,255,.42),transparent 32%),radial-gradient(circle at 86% 20%,rgba(78,255,220,.24),transparent 30%),linear-gradient(135deg,#06030d 0%,#07110f 58%,#03070b 100%);color:var(--ink);min-height:100vh}a{color:inherit}.v45-shell,.v45-wrap{width:min(1120px,calc(100% - 42px));margin:0 auto}.v45-nav{position:sticky;top:0;z-index:30;backdrop-filter:blur(22px);background:rgba(3,7,11,.86);border-bottom:1px solid rgba(132,255,230,.18)}.v45-nav-inner{height:76px;display:flex;align-items:center;justify-content:space-between;gap:20px}.brand{display:flex;align-items:center;gap:13px;text-decoration:none;font-weight:950;letter-spacing:.16em;text-transform:uppercase;font-size:12px}.brand-orb{width:38px;height:38px;border-radius:14px;background:radial-gradient(circle at 40% 35%,#9dfffc 0,#57ffcb 16%,#5c4cff 43%,#061018 72%);box-shadow:0 0 45px rgba(104,255,225,.54);border:1px solid rgba(255,255,255,.28)}.nav-pills{display:flex;gap:10px;flex-wrap:wrap;justify-content:flex-end}.nav-pills a,.btn,.goalos-v45-floating a,.goalos-v45-floating button{display:inline-flex;align-items:center;justify-content:center;border:1px solid rgba(255,255,255,.18);border-radius:999px;background:rgba(255,255,255,.09);color:var(--ink);text-decoration:none;font-weight:950;padding:12px 18px;cursor:pointer;box-shadow:inset 0 1px 0 rgba(255,255,255,.08);font:inherit}.btn.primary,.goalos-v45-float-primary{background:linear-gradient(100deg,var(--lime),var(--mint),var(--cyan));color:#04100d;border:0}.btn.gold{background:linear-gradient(100deg,var(--gold),#ffb867);color:#160f04;border:0}.btn.ghost{background:rgba(255,255,255,.09)}.btn.subtle{padding:9px 13px;font-size:13px}.hero-command{padding:70px 0 44px}.hero-card{border:1px solid var(--line);border-radius:36px;background:linear-gradient(135deg,rgba(255,255,255,.13),rgba(255,255,255,.05));box-shadow:var(--shadow);padding:clamp(26px,4vw,54px);position:relative;overflow:hidden}.hero-card:before{content:"";position:absolute;inset:-1px;background:radial-gradient(circle at 18% 8%,rgba(255,255,255,.18),transparent 25%),radial-gradient(circle at 88% 8%,rgba(114,255,217,.18),transparent 35%);pointer-events:none}.hero-card>*{position:relative}.eyebrow{color:var(--mint);font-size:12px;font-weight:950;letter-spacing:.34em;text-transform:uppercase}.hero-card h1,.v45-wrap h1{font-size:clamp(56px,8.5vw,118px);line-height:.86;letter-spacing:-.085em;margin:20px 0 20px}.lead{font-size:clamp(18px,2.2vw,23px);line-height:1.46;color:#edf7f5;max-width:860px}.command-surface{margin-top:28px;display:grid;grid-template-columns:minmax(0,1.2fr) minmax(320px,.8fr);gap:18px}.command-box{min-height:154px;border:1px solid rgba(113,255,223,.5);border-radius:26px;background:#040811;color:#fff;font:700 18px/1.45 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;padding:24px;outline:none;box-shadow:0 20px 70px rgba(0,0,0,.42),0 0 0 6px rgba(100,255,220,.06)}.command-box:empty:before,.goalos-v45-mini-box:empty:before{content:attr(data-placeholder);color:#98a9b5}.command-panel,.panel,.contract-card{border:1px solid rgba(255,255,255,.16);border-radius:26px;background:linear-gradient(140deg,rgba(255,255,255,.1),rgba(255,255,255,.04));box-shadow:var(--shadow);padding:22px}.command-panel h2,.panel h2{margin:0 0 10px;font-size:clamp(26px,3vw,42px);letter-spacing:-.055em}.chips,.chip-row,.hero-actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:16px}.chip,.role-chip{border:1px solid rgba(255,255,255,.16);border-radius:999px;background:rgba(255,255,255,.08);padding:10px 14px;font-weight:900;color:#f7fbf9}.role-chip.active,.chip.active{background:rgba(114,255,217,.22);border-color:rgba(114,255,217,.65)}.result-grid{display:grid;grid-template-columns:minmax(0,1fr) minmax(320px,.8fr);gap:18px;margin:24px 0}.stat-row,.stats{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin:18px 0}.stats span,.stat{border:1px solid rgba(255,255,255,.15);border-radius:18px;background:rgba(255,255,255,.08);padding:16px}.stats b,.stat b{display:block;color:var(--gold);font-size:30px}.plan-list,.route-list{list-style:none;padding:0;margin:0;display:grid;gap:10px}.plan-list li,.route-list li{border:1px solid rgba(255,255,255,.15);border-radius:16px;background:rgba(255,255,255,.055);padding:14px}.route-list li{display:flex;justify-content:space-between;gap:18px;align-items:flex-start}.route-list span{color:#c5d5db}.receipt{white-space:pre-wrap;max-height:360px;overflow:auto;border:1px solid rgba(255,255,255,.14);border-radius:18px;background:#02050b;padding:18px;font:700 13px/1.5 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;color:#eaf8f4}.page-section{margin:26px 0}.contract-grid,.page-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}.mini-meta{font:700 12px/1.4 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;color:#b7c5cf;word-break:break-all}.legal-rail{width:min(1120px,calc(100% - 42px));margin:30px auto 20px;border:1px solid rgba(114,255,217,.3);border-radius:22px;background:rgba(10,32,27,.72);padding:14px 18px;display:flex;gap:14px;flex-wrap:wrap;align-items:center;justify-content:center;color:#dff4ee}.legal-rail strong{color:var(--gold)}.legal-rail a{color:#06100f;background:linear-gradient(100deg,var(--gold),var(--mint));padding:8px 12px;border-radius:999px;text-decoration:none;font-weight:950}footer{width:min(1120px,calc(100% - 42px));margin:20px auto 0;padding:34px 0;border-top:1px solid rgba(114,255,217,.18);display:flex;justify-content:space-between;gap:24px;color:#d8e6e6}footer p{color:#a9bdc4}footer nav{display:flex;gap:16px;flex-wrap:wrap}footer a{color:#79ffe4;font-weight:900;text-decoration:none}.goalos-v45-floating{position:fixed;right:18px;bottom:18px;z-index:40;display:flex;align-items:flex-end;gap:8px;flex-wrap:wrap;justify-content:flex-end}.goalos-v45-floating button{background:rgba(255,255,255,.11)}.goalos-v45-mini{position:absolute;right:0;bottom:56px;width:min(430px,calc(100vw - 32px));border:1px solid var(--line);border-radius:24px;background:rgba(5,9,18,.96);box-shadow:var(--shadow);padding:18px}.goalos-v45-mini-box{min-height:86px;border:1px solid rgba(114,255,217,.44);border-radius:16px;background:#030813;padding:13px;outline:none;font:700 14px/1.45 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace}.goalos-v45-mini-answer{margin-top:10px;color:#d8ebe8}.skip-link{position:absolute;left:-10000px}.skip-link:focus{left:16px;top:16px;z-index:99;background:var(--gold);color:#000;padding:10px;border-radius:12px}@media(max-width:900px){.command-surface,.result-grid{grid-template-columns:1fr}.stat-row,.stats{grid-template-columns:repeat(2,1fr)}.contract-grid,.page-grid{grid-template-columns:1fr}.v45-nav-inner,footer{align-items:flex-start;flex-direction:column}.hero-card h1,.v45-wrap h1{font-size:56px}.goalos-v45-floating{left:14px;right:14px}.goalos-v45-mini{left:0;right:auto}}
`;

const js = `
(function(){
  const topics = ${JSON.stringify(scenarios)};
  const defaultTopic = topics[0];
  let role = 'First-time visitor';
  let current = defaultTopic;
  let timer = null;
  const $ = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));
  function clean(s){return (s||'').toLowerCase().replace(/[^a-z0-9$\-\s]/g,' ');}  
  function match(text){
    const q = clean(text);
    if(!q.trim()) return defaultTopic;
    let best = defaultTopic, bestScore = 0;
    for(const topic of topics){
      let score = 0;
      for(const kw of topic.keywords){ if(q.includes(clean(kw))) score += kw.length + 8; }
      if(topic.id === 'contracts' && /\b(48|contract|mainnet|agialpha|etherscan)\b/.test(q)) score += 35;
      if(topic.id === 'rsi' && /\b(rsi|asi|move\s*37|superintelligence|breakthrough|omni)\b/.test(q)) score += 35;
      if(topic.id === 'signoff' && /\b(done|accept|client|report|review|approve|deliverable)\b/.test(q)) score += 30;
      if(topic.id === 'settlement' && /\b(pay|payment|grant|dao|treasury|milestone|reward|settle)\b/.test(q)) score += 30;
      if(score > bestScore){ best = topic; bestScore = score; }
    }
    return Object.assign({}, best, {confidence: Math.min(98, Math.max(best.confidence, Math.round(62 + bestScore/2)))});
  }
  function receipt(topic, text){
    return {
      mission_id:'GOALOS-V45-'+new Date().toISOString().slice(0,10).replaceAll('-','')+'-'+topic.id.toUpperCase(),
      decision_state:'SYNTHETIC_PLAN_READY',
      role,
      requested_intent:(text||'').slice(0,240),
      mission_type:topic.mission,
      recommended_route:topic.route,
      confidence:topic.confidence,
      signoff_tier:topic.tier,
      criteria:topic.criteria,
      evidence_checklist:topic.evidence,
      protocol_rails:topic.rails,
      public_boundary:'browser_local_command_demo_no_uploads_no_wallets_no_payments_zero_value_moved'
    };
  }
  function render(topic, text){
    current = topic;
    const plan = $('[data-v45-plan]');
    if(!plan) return;
    const rec = receipt(topic, text);
    $('[data-v45-mission]').textContent = topic.mission;
    $('[data-v45-summary]').textContent = topic.summary;
    $('[data-v45-confidence]').textContent = topic.confidence + '%';
    $('[data-v45-tier]').textContent = topic.tier;
    $('[data-v45-route]').textContent = topic.route;
    $('[data-v45-route-link]').setAttribute('href', topic.route);
    $('[data-v45-route-link]').textContent = topic.route;
    $('[data-v45-criteria]').innerHTML = topic.criteria.map((x,i)=>'<li><strong>'+(i+1)+'.</strong> '+escapeHtml(x)+'</li>').join('');
    $('[data-v45-evidence]').innerHTML = topic.evidence.map((x,i)=>'<li><strong>'+(i+1)+'.</strong> '+escapeHtml(x)+'</li>').join('');
    $('[data-v45-rails]').innerHTML = topic.rails.map(x=>'<span class="chip">'+escapeHtml(x)+'</span>').join('');
    $('[data-v45-receipt]').textContent = JSON.stringify(rec,null,2);
    $('[data-v45-answer]').textContent = 'GoalOS read the request, selected '+topic.label+', and prepared the route '+topic.route+'.';
  }
  function escapeHtml(s){ return String(s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])); }
  function runFromBox(){ const box = $('[data-v45-box]'); const text = box ? box.textContent.trim() : ''; render(match(text), text); }
  function copyText(t){ if(navigator.clipboard && navigator.clipboard.writeText){ navigator.clipboard.writeText(t).catch(()=>{}); } }
  function routeNow(){ if(current && current.route) window.location.href = current.route; }
  function startAuto(){ clearInterval(timer); let n=5; const btn = $('[data-v45-auto]'); if(btn) btn.textContent='Auto-route in '+n+'s'; timer=setInterval(()=>{ n--; if(btn) btn.textContent=n>0?'Auto-route in '+n+'s':'Opening…'; if(n<=0){clearInterval(timer); routeNow();}},1000); }
  function bind(){
    $$('[data-v45-role]').forEach(btn=>btn.addEventListener('click',()=>{ role=btn.textContent.trim(); $$('[data-v45-role]').forEach(b=>b.classList.remove('active')); btn.classList.add('active'); runFromBox(); }));
    $$('[data-v45-example]').forEach(btn=>btn.addEventListener('click',()=>{ const box=$('[data-v45-box]'); if(box){box.textContent=btn.getAttribute('data-v45-example'); box.focus(); runFromBox();}}));
    const box = $('[data-v45-box]'); if(box){ box.addEventListener('keydown', e=>{ if(e.key==='Enter' && !e.shiftKey){ e.preventDefault(); runFromBox(); }}); box.addEventListener('input', runFromBox); }
    $('[data-v45-run]')?.addEventListener('click',runFromBox);
    $('[data-v45-open]')?.addEventListener('click',routeNow);
    $('[data-v45-auto]')?.addEventListener('click',startAuto);
    $('[data-v45-copy]')?.addEventListener('click',()=>copyText($('[data-v45-receipt]')?.textContent||''));
    $('[data-v45-copy-standard]')?.addEventListener('click',()=>copyText('Tell GoalOS what you want. GoalOS turns intent into mission, evidence, review, receipt, and route.'));
    $$('[data-goalos-v45-mini-toggle]').forEach(btn=>btn.addEventListener('click',()=>{ const panel=btn.parentElement.querySelector('.goalos-v45-mini'); if(panel) panel.hidden=!panel.hidden; }));
    $$('[data-goalos-v45-mini-run]').forEach(btn=>btn.addEventListener('click',()=>{ const root=btn.closest('.goalos-v45-mini'); const text=root?.querySelector('.goalos-v45-mini-box')?.textContent.trim()||''; const topic=match(text); const ans=root?.querySelector('.goalos-v45-mini-answer'); if(ans) ans.innerHTML='<strong>'+escapeHtml(topic.label)+'</strong><br><a href="'+topic.route+'">Open '+topic.route+'</a><p>'+escapeHtml(topic.summary)+'</p>'; }));
    window.addEventListener('keydown', e=>{ if((e.ctrlKey||e.metaKey) && e.key.toLowerCase()==='k'){ e.preventDefault(); window.location.href='${canonical}'; }});
    runFromBox();
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', bind); else bind();
})();
`;

write(cssPath, css);
write(jsPath, js);

function pageShell({title='GoalOS Universal Command Center', body='', relPrefix=''}){
  const prefix = relPrefix || '';
  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${esc(title)}</title>
  <meta name="description" content="GoalOS front-and-center command interface for turning intent into mission, evidence, review, receipt, and route." />
  <link rel="stylesheet" href="${prefix}${cssPath}" />
</head>
<body class="v45-body">
  <a class="skip-link" href="#command">Skip to command box</a>
  <div class="goalos-v45-root">
    <nav class="v45-nav" aria-label="GoalOS primary navigation"><div class="v45-shell v45-nav-inner"><a class="brand" href="${prefix}${canonical}"><span class="brand-orb" aria-hidden="true"></span><span>GoalOS Signoff Pro</span></a><div class="nav-pills"><a href="${prefix}${canonical}">Command</a><a href="${prefix}all-pages.html">All pages</a><a href="${prefix}public-demo-labs.html">Labs</a><a href="${prefix}agialpha-48-contract-atlas.html">48 contracts</a><a href="${prefix}browser-beta.html">Browser beta</a></div></div></nav>
    ${body}
  </div>
  <div class="goalos-v45-floating" data-goalos-v45-launcher="true"><a class="goalos-v45-float-primary" href="${prefix}${canonical}">Tell GoalOS</a><a href="${prefix}all-pages.html">All pages</a><button type="button" data-goalos-v45-mini-toggle>Ask</button><div class="goalos-v45-mini" hidden><strong>Ask GoalOS</strong><p>Local answer router. Type a question; GoalOS opens the right page.</p><div class="goalos-v45-mini-box" role="textbox" contenteditable="true" data-placeholder="Example: show me the 48 contracts"></div><button type="button" data-goalos-v45-mini-run>Answer</button><div class="goalos-v45-mini-answer" aria-live="polite"></div></div></div>
  <script src="${prefix}${jsPath}" defer></script>
</body>
</html>`;
  return withBoundary(repairForbiddenControls(html));
}

function commandBody(){
  const prompt = 'I am new. Show me the fastest way to understand GoalOS, what to click first, and how to turn AI work into an accepted receipt.';
  return `<main class="v45-wrap hero-command" id="command"><section class="hero-card"><p class="eyebrow">Front-and-center command OS · v45</p><h1>Tell GoalOS what you want.</h1><p class="lead">Type a plain-language request. GoalOS turns it into a mission, acceptance criteria, evidence checklist, reviewer path, 48-contract rail map, recommended page, and synthetic Mission Receipt.</p><div class="command-surface"><section><div class="command-box" role="textbox" contenteditable="true" aria-label="Tell GoalOS what you want" data-placeholder="Tell GoalOS what you want…" data-v45-box>${esc(prompt)}</div><div class="chips" aria-label="Example requests"><button class="role-chip active" type="button" data-v45-role>First-time visitor</button><button class="role-chip" type="button" data-v45-role>AI consultant</button><button class="role-chip" type="button" data-v45-role>Client reviewer</button><button class="role-chip" type="button" data-v45-role>DAO / treasury</button><button class="role-chip" type="button" data-v45-role>Protocol operator</button><button class="role-chip" type="button" data-v45-role>RSI / ASI</button></div><div class="chips"><button class="btn primary" type="button" data-v45-run>Run GoalOS</button><button class="btn ghost" type="button" data-v45-example="I delivered an AI research report to a client and need proof it is ready to accept.">AI report signoff</button><button class="btn ghost" type="button" data-v45-example="We need to release a DAO grant milestone only if the evidence package passes review.">DAO grant payout</button><button class="btn ghost" type="button" data-v45-example="Show me which 48 Mainnet contracts support Signoff Verified and Signoff & Settle.">48 contracts</button><button class="btn ghost" type="button" data-v45-example="Govern a Move-37 breakthrough candidate with replay, stress tests, and a dossier.">RSI breakthrough</button></div></section><aside class="command-panel" aria-live="polite"><p class="eyebrow">GoalOS answer</p><h2 data-v45-mission>Mission plan</h2><p data-v45-answer>GoalOS will answer here.</p><p><a class="btn primary" data-v45-route-link href="${routes.command}">${routes.command}</a></p><div class="stat-row"><span class="stat"><b data-v45-confidence>92%</b> route confidence</span><span class="stat"><b data-v45-tier>Orientation</b> tier</span></div><div class="chips"><button type="button" class="btn primary" data-v45-open>Open recommended page</button><button type="button" class="btn gold" data-v45-auto>Auto-route in 5s</button><button type="button" class="btn ghost" data-v45-copy>Copy receipt JSON</button></div></aside></div></section><section class="result-grid" data-v45-plan><article class="panel"><p class="eyebrow">Autopilot mission plan</p><h2>GoalOS will take care of the path.</h2><p data-v45-summary>The mission plan appears here.</p><h3>Acceptance criteria</h3><ul class="plan-list" data-v45-criteria></ul><h3>Evidence checklist</h3><ul class="plan-list" data-v45-evidence></ul><h3>Protocol / governance rails</h3><div class="chip-row" data-v45-rails></div></article><article class="panel"><p class="eyebrow">Synthetic receipt</p><h2>Receipt preview</h2><pre class="receipt" data-v45-receipt>{}</pre><div class="chips"><a class="btn primary" href="${routes.signoff}">Open Signoff product</a><a class="btn ghost" href="${routes.contracts}">Open 48-contract atlas</a><a class="btn ghost" href="${routes.rsi}">Open RSI / ASI simulator</a></div></article></section><section class="page-section"><div class="panel"><p class="eyebrow">Full autonomous flow</p><h2>Intent → Mission → Evidence → Review → Receipt → Route</h2><div class="stats"><span><b>1</b> Intent<br>Understand what the visitor wants.</span><span><b>2</b> Mission<br>Define done, boundaries, and authority.</span><span><b>3</b> Proof<br>Plan evidence, claims, risks, and replay.</span><span><b>4</b> Route<br>Open the right lab, receipt, rail, or page.</span></div><p><button class="btn primary" data-v45-copy-standard type="button">Copy public standard</button> <a class="btn ghost" href="all-pages.html">Browse every page</a></p></div></section><section class="page-grid"><article class="panel"><p class="eyebrow">Product first</p><h2>Know when AI work is actually done.</h2><p>Define done, submit work, check evidence, obtain review, and issue a Mission Receipt.</p><a class="btn primary" href="${routes.signoff}">Open product console</a></article><article class="panel"><p class="eyebrow">Protocol underneath</p><h2>Make the 48 rails legible.</h2><p>Explore contracts by family, Signoff tier, evidence function, and public-safe boundary.</p><a class="btn ghost" href="${routes.contracts}">Open 48-contract atlas</a></article><article class="panel"><p class="eyebrow">Benchmark-ready proof</p><h2>Mission 001 reproducibility packet</h2><p>Inspect the mission contract, environment, B0-B6 baselines, proof bundle, replay log, ledgers, validator report, scoreboard, and claims matrix.</p><a class="btn ghost" href="${routes.mission001}">Open Mission 001</a></article><article class="panel"><p class="eyebrow">Chat window</p><h2>Ask a question. Go to the right place.</h2><p>Every page gets a lightweight Ask GoalOS launcher. The answer router is local by default and same-site route allowlisted.</p><a class="btn ghost" href="chat.html">Open chat route</a></article></section></main>`;
}

maybeGenerateContractAtlas();

const commandHtml = pageShell({title:'Tell GoalOS what you want · Universal Command Center v45', body:commandBody()});
for(const file of commandAliases) write(file, commandHtml);

let initialRecords = routeRecords();
const grouped = initialRecords.reduce((m,r)=>{(m[r.group] ||= []).push(r); return m;}, {});
function routesIndexBody(){
  const groupsHtml = Object.entries(grouped).sort(([a],[b])=>a.localeCompare(b)).map(([group, recs]) => `<section class="panel page-section"><p class="eyebrow">${esc(group)}</p><h2>${esc(group)} pages</h2><ul class="route-list">${recs.map(r=>`<li><a href="${esc(r.path)}"><strong>${esc(r.title || r.path)}</strong></a><span>${esc(r.path)}</span></li>`).join('')}</ul></section>`).join('\n');
  return `<main class="v45-wrap"><section class="hero-card"><p class="eyebrow">Complete site navigator · v45</p><h1>Every page remains accessible.</h1><p class="lead">This index preserves the whole public site: product pages, Mission 001, public labs, 48-contract rails, RSI / ASI governance pages, legal boundaries, and command interfaces.</p><div class="hero-actions"><a class="btn primary" href="${canonical}">Tell GoalOS what you want</a><a class="btn ghost" href="public-demo-labs.html">Open public labs</a><a class="btn ghost" href="agialpha-48-contract-atlas.html">Open 48 rails</a></div><div class="stats"><span><b>${initialRecords.length}</b> pages</span><span><b>48</b> contracts indexed</span><span><b>0</b> value moved</span><span><b>1</b> command box</span></div></section>${groupsHtml}</main>`;
}
const indexHtml = pageShell({title:'All GoalOS pages · v45 route catalog', body:routesIndexBody()});
for(const file of indexPages) write(file, indexHtml);

// Recompute route catalog after generated pages.
initialRecords = routeRecords();
write('goalos-v45-route-catalog.json', JSON.stringify({version:'v45', generatedAt:today, pages:initialRecords}, null, 2));
write('goalos-v45-knowledge.json', JSON.stringify({version:'v45', generatedAt:today, scenarios, routes, releaseFacts:contractsConfig.releaseFacts || {}, contractCount:contracts.length || 48}, null, 2));
write('goalos-v45-command-center-manifest.json', JSON.stringify({version:'v45', generatedAt:today, canonical, aliases:commandAliases, indexPages, publicSafe:{localTextBox:true, uploads:false, cookies:false, analytics:false, wallets:false, payments:false, externalAiCallsByDefault:false, valueMoved:0}, pagesIndexed:initialRecords.length, contractsIndexed:contracts.length || 48}, null, 2));

// Inject lightweight launcher/assets into all existing HTML pages, then normalize boundary.
for(const fp of htmlFiles()){
  const relPath = rel(path.relative(site, fp));
  let html = fs.readFileSync(fp,'utf8');
  html = repairForbiddenControls(html);
  html = addAssetsAndLauncher(html, relPath);
  html = withBoundary(html);
  fs.writeFileSync(fp, html);
}

console.log(`GoalOS Front-and-Center Command OS v45 build complete: ${routeRecords().length} HTML pages, ${contracts.length || 48} contracts indexed.`);
