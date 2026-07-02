#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const root=process.cwd();
const site=path.join(root,'site');
const assets=path.join(site,'assets');
fs.mkdirSync(site,{recursive:true}); fs.mkdirSync(assets,{recursive:true});
const safeRead=(p,f='')=>fs.existsSync(p)?fs.readFileSync(p,'utf8'):f;
const write=(p,s)=>{fs.mkdirSync(path.dirname(p),{recursive:true}); fs.writeFileSync(p,s);};
const copyIf=(src,dst)=>{if(fs.existsSync(src)){fs.mkdirSync(path.dirname(dst),{recursive:true});fs.copyFileSync(src,dst)}};
const slugify=s=>String(s||'').replace(/([a-z])([A-Z])/g,'$1-$2').replace(/[^a-zA-Z0-9]+/g,'-').replace(/^-|-$/g,'').toLowerCase();
const now=new Date().toISOString();
const contractsPath=path.join(root,'config','agialpha-mainnet-contracts-v38.json');
const contractsConfig=JSON.parse(safeRead(contractsPath,'{"contracts":[],"releaseFacts":{},"tiers":[]}'));
const scenarios=JSON.parse(safeRead(path.join(root,'config','goalos-v39-navigator-scenarios.json'),'{}'));
const release=contractsConfig.releaseFacts||{};
const contracts=(contractsConfig.contracts||[]).map(c=>({
  ...c,
  slug:c.slug||slugify(c.name),
  route:`contracts/${c.slug||slugify(c.name)}.html`,
  keywords:[c.name,c.family,c.role,c.primaryTier,...(c.productTiers||[]),...(c.flowStages||[])].filter(Boolean).join(' ').toLowerCase()
}));
const baseTopics=[
  {id:'start',title:'Start here',route:'goalos-v22-v39-command-center.html',icon:'✦',keywords:['start','begin','home','command center','first time','new visitor','where should i start','what should i click'],answer:'Start with the command center. It asks who you are, explains the simplest next step, and routes you to the right proof lab or product console.'},
  {id:'signoff',title:'GoalOS Signoff',route:'ai-research-strategy-signoff-console.html',icon:'✓',keywords:['signoff','ai work done','know when ai work is done','client review','approve','needs changes','reject','mission receipt','ai research','strategy report'],answer:'GoalOS Signoff is the customer-facing product: define done, submit evidence, check completeness, obtain human approval, and issue a Mission Receipt.'},
  {id:'v37',title:'AI Research & Strategy Signoff',route:'ai-research-strategy-signoff-console.html',icon:'37',keywords:['v37','ai research','strategy signoff','free signoff','product first','consultant','agency','client'],answer:'v37 is the product-first console. It shows the five-step experience: Create → Submit → Check → Review → Receipt.'},
  {id:'browser',title:'Browser beta',route:'browser-beta.html',icon:'⌁',keywords:['browser beta','no data','public safe','local','privacy','upload','cookie','analytics','wallet'],answer:'The browser beta is the safest demo path: it runs locally, needs no wallet, moves no value, and lets visitors inspect the proof cycle without giving data.'},
  {id:'mission001',title:'Mission 001',route:'mission-001.html',icon:'001',keywords:['mission 001','benchmark','reproducibility','packet','proof bundle','replay','validator','claims matrix'],answer:'Mission 001 is the benchmark-ready reproducibility packet: mission contract, environment, baselines, proof bundle, replay log, ledgers, validator report, scoreboard, and claims matrix.'},
  {id:'labs',title:'All public labs',route:'public-demo-labs.html',icon:'14+',keywords:['all labs','public labs','v22','v23','v24','v25','v26','v27','v28','v29','v30','v31','v32','v33','v34','v35','v36','v37','v38','suite'],answer:'Open the public lab catalog to see the full GoalOS arc: proof loop, blockchain credibility, Proof Before Settlement, RSI/ASI governance, product-first Signoff, and the 48-contract atlas.'},
  {id:'contracts',title:'48 Mainnet contract atlas',route:'agialpha-48-contract-atlas.html',icon:'48',keywords:['48 contracts','mainnet','contract atlas','ethereum','chainid','chain id','agialpha','etherscan','verified contracts','protocol rails'],answer:`The 48-contract atlas explains the GoalOS-created Ethereum Mainnet rails. The release records ${release.goalosCreatedContracts||48} GoalOS-created contracts, ${release.etherscanSourceVerification||'48 / 48 verified'} Etherscan source verification, and a configured but not production-activated boundary.`},
  {id:'contract-index',title:'Individual contract pages',route:'contracts/index.html',icon:'◇',keywords:['contract pages','contracts index','individual contract','etherscan links','addresses'],answer:'Open the contract index to inspect every GoalOS-created Mainnet contract, grouped by family, role, Signoff tier, proof stage, address, and Etherscan link.'},
  {id:'basic',title:'Signoff Basic',route:'signoff-basic.html',icon:'B',keywords:['basic','signoff basic','no chain','no wallet','saas','off chain','evidence docket'],answer:'Signoff Basic is the acquisition product: no wallet, no chain transaction, no token requirement, but produces a protocol-compatible Evidence Docket and Mission Receipt.'},
  {id:'verified',title:'Signoff Verified',route:'signoff-verified.html',icon:'V',keywords:['verified','signoff verified','hash','anchor','proof card','credential','commit registry','proof bundle','evidence docket'],answer:'Signoff Verified adds hashes, proof cards, credentials, replay references, and protocol-compatible evidence records. It should not require the customer to handle token approvals.'},
  {id:'secured',title:'Signoff Secured',route:'signoff-secured.html',icon:'S',keywords:['secured','signoff secured','reviewer bond','staking','slashing','challenge window','evaluator'],answer:'Signoff Secured adds accountable review: reviewer/evaluator bonds, challenge windows, reputation, claim boundaries, falsification, and appeal rails after audit and authorization gates.'},
  {id:'settle',title:'Signoff & Settle',route:'signoff-settle.html',icon:'$',keywords:['settle','signoff settle','payment','proof to payment','escrow','reward vault','job registry','treasury router','agialpha settlement'],answer:'Signoff & Settle is the advanced tier where accepted work can trigger bounded rewards, escrow, reputation, dispute handling, and settlement rails after production authorization.'},
  {id:'token',title:'$AGIALPHA role',route:'agialpha-48-contract-atlas.html#tiers',icon:'α',keywords:['agialpha','token','alpha','fees','stake','bond','rewards','settlement asset','security asset'],answer:'$AGIALPHA is not the Signoff product. It is the optional economic security and settlement asset: fees, bonds, reviewer stakes, challenge stakes, work rewards, and protocol revenue where authorized.'},
  {id:'boundary',title:'Production boundary',route:'agialpha.html',icon:'!',keywords:['live settlement','production activation','user funds','external audit','audit completion','wallet','is this live','risk','boundary','not activated'],answer:'The public site is educational and read-only. It does not authorize user funds, production activation, token approvals, or live settlement. The Mainnet release is configured and verified, not a public-fund activation.'},
  {id:'proof-before-settlement',title:'Proof Before Settlement',route:'proof-before-settlement-research-lab.html',icon:'30',keywords:['v30','proof before settlement','blockchain proves transaction','goalos proves work','research paper','settlement safety'],answer:'Proof Before Settlement formalizes the core standard: blockchain proves the transaction; GoalOS proves the work. Evidence, validation, receipt, and claim boundaries come before settlement readiness.'},
  {id:'rsi',title:'From Loop to RSI',route:'from-loop-to-rsi-lab.html',icon:'32',keywords:['rsi','from loop to rsi','deterministic invention','target emit filter atlas test plan eval insert promote','omni','move 37'],answer:'The RSI arc upgrades proof-gated work into governed invention: deterministic pipeline, schema-bound artifacts, baseline comparisons, Move-37 dossiers, and mechanical gates.'},
  {id:'asi',title:'ASI Mission Simulator',route:'loop-rsi-asi-superintelligence-mission-simulator-lab.html',icon:'35',keywords:['asi','superintelligence','v35','mission simulator','control tower','rollback','council','dossier'],answer:'The v35 Mission Simulator lets visitors run the Loop → RSI → ASI path through gates, scenarios, dossiers, council review, rollback, and synthetic receipt logic.'},
  {id:'v38',title:'AGIALPHA 48-Contract Atlas',route:'agialpha-48-contract-atlas.html',icon:'38',keywords:['v38','atlas','protocol topology','48 contract rails','contract matrix'],answer:'v38 is the contract atlas: a friendly interface over the 48 GoalOS-created Mainnet contracts, mapping each rail to product tiers and proof-to-settlement stages.'},
  {id:'v39',title:'Ask GoalOS Navigator',route:'ask-goalos.html',icon:'39',keywords:['v39','chat','ask goalos','navigator','questions','autonomous','redirect','route'],answer:'v39 adds the autonomous site navigator: ask a question, receive a browser-local answer, and get routed to the best page or proof object.'}
];
const contractTopics=contracts.map(c=>({
  id:`contract-${c.slug}`,
  title:c.name,
  route:c.route,
  icon:'◇',
  keywords:[c.name,c.address,c.family,c.role,c.description,c.primaryTier,...(c.productTiers||[]),...(c.flowStages||[])].filter(Boolean),
  answer:`${c.name} is a ${c.family||'GoalOS'} rail for ${c.role||c.primaryTier||'the protocol'}. In Signoff, it belongs mainly to the ${c.primaryTier||'protocol'} layer and supports ${(c.flowStages||['proof-to-settlement']).join(', ')}. Open its page for address, Etherscan link, role, tier, and public-safe boundary.`
}));
const familyMap={};
for(const c of contracts){(familyMap[c.family] ||= []).push(c)}
const familyTopics=Object.entries(familyMap).map(([family,list])=>({
  id:`family-${slugify(family)}`,
  title:family,
  route:'agialpha-48-contract-atlas.html#families',
  icon:'▦',
  keywords:[family, ...list.map(c=>c.name), ...list.map(c=>c.primaryTier)].filter(Boolean),
  answer:`${family} contains ${list.length} GoalOS-created Mainnet contract${list.length===1?'':'s'}: ${list.slice(0,8).map(c=>c.name).join(', ')}${list.length>8?'…':''}. Open the atlas to filter the full family and inspect individual contract pages.`
}));
const topics=[...baseTopics,...familyTopics,...contractTopics];
const routes=fs.readdirSync(site).filter(f=>f.endsWith('.html')).sort();
const manifest={
  version:'v39.0.0',
  title:'GoalOS Signoff Pro — Autonomous Site Navigator & Redirect Console',
  generatedAt:now,
  canonicalRoute:'ask-goalos.html',
  aliasRoutes:['chat.html','site-navigator.html','goalos-concierge.html','autonomous-redirect-console.html','answer-router.html','v39.html','help.html'],
  baseTopics:baseTopics.length,
  contractTopics:contractTopics.length,
  familyTopics:familyTopics.length,
  knownRoutes:routes.length,
  publicSafe:scenarios.publicSafe,
  releaseFacts:release,
  boundary:'Static GitHub Pages implementation. Browser-local deterministic answer routing by default. No external AI calls, no wallet, no uploads, no analytics, no payments, zero value moved.'
};
const knowledge={...manifest, roles:scenarios.roles||[], quickQuestions:scenarios.quickQuestions||[], topics, contracts:contracts.map(c=>({name:c.name,slug:c.slug,address:c.address,family:c.family,role:c.role,route:c.route,primaryTier:c.primaryTier,flowStages:c.flowStages,etherscanUrl:c.etherscanUrl}))};
write(path.join(site,'goalos-v39-navigator-knowledge.json'), JSON.stringify(knowledge,null,2));
write(path.join(site,'goalos-v39-autonomous-navigator-manifest.json'), JSON.stringify(manifest,null,2));
write(path.join(site,'goalos-v39-question-route-map.json'), JSON.stringify(topics.map(t=>({id:t.id,title:t.title,route:t.route,keywords:t.keywords})),null,2));
function page(title, body, extra=''){
const legal='<section class="v39-legal" data-goalos-legal-rail="v12"><strong>Public-safe local navigator:</strong> no uploads · no cookies · no analytics · no wallets · no payments · no external AI calls · zero value moved. Questions are processed in the browser and are not stored by this static page.</section>';
const footer='<footer class="v39-footer"><strong>GoalOS Signoff Pro</strong><span>Autonomous Site Navigator v39 · browser-local answer routing · no production settlement or user-fund authorization.</span></footer>';
return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title><meta name="description" content="GoalOS Signoff Pro autonomous site navigator: ask questions, get public-safe answers, and open the right proof page."><link rel="stylesheet" href="assets/goalos-v39-navigator.css"><link rel="stylesheet" href="assets/goalos-v38-contract-atlas.css"></head><body class="goalos-v39-shell"><main>${body}</main>${extra}${legal}${footer}<script src="assets/goalos-v39-navigator.js" defer data-goalos-v39="js"></script></body></html>`
}
const labCards=baseTopics.filter(t=>['signoff','contracts','mission001','labs','rsi','asi','proof-before-settlement','v37','v38'].includes(t.id)).map(t=>`<a class="v39-card" href="${t.route}"><span>${t.icon}</span><strong>${t.title}</strong><em>${t.answer}</em></a>`).join('');
const roleButtons=(scenarios.roles||[]).map(r=>`<button type="button" data-v39-question="${r.defaultQuestion.replaceAll('"','&quot;')}" class="v39-chip">${r.label}</button>`).join('');
const questionButtons=(scenarios.quickQuestions||[]).map(q=>`<button type="button" data-v39-question="${q.replaceAll('"','&quot;')}" class="v39-chip v39-chip-bright">${q}</button>`).join('');
const askBody=`
<nav class="v39-nav"><a href="index.html">GoalOS Signoff Pro</a><span>Autonomous Navigator v39</span><a href="agialpha-48-contract-atlas.html">48-contract atlas</a><a href="public-demo-labs.html">All labs</a></nav>
<section class="v39-hero"><div><p class="v39-kicker">Browser-local answer router · public-safe</p><h1>Ask GoalOS. Get the right page.</h1><p class="v39-lede">Ask about Signoff, Mission 001, the 48 Mainnet contracts, $AGIALPHA rails, Proof Before Settlement, RSI/ASI governance, or which demo to open next. The navigator answers in your browser and routes you to the best public page.</p><div class="v39-actions"><button class="v39-primary" data-v39-question="Where should I start?">Start guided chat</button><a class="v39-secondary" href="goalos-v22-v38-command-center.html">Open command center</a><a class="v39-secondary" href="agialpha-48-contract-atlas.html">Explore 48 contracts</a></div></div><aside class="v39-proofbox"><strong>Public-safe by default</strong><span>No uploads</span><span>No wallet</span><span>No payments</span><span>No analytics</span><span>No external AI calls</span><span>Zero value moved</span></aside></section>
<section class="v39-console-wrap" id="ask"><div class="v39-console" data-v39-chat-root data-v39-full="true" data-v39-label="GoalOS Navigator"></div></section>
<section class="v39-section"><p class="v39-kicker">Choose your role</p><h2>One click to the right path</h2><div class="v39-chip-grid">${roleButtons}</div></section>
<section class="v39-section"><p class="v39-kicker">Most useful destinations</p><h2>Proof-to-acceptance, protocol rails, and governed invention</h2><div class="v39-card-grid">${labCards}</div></section>
<section class="v39-section"><p class="v39-kicker">48 GoalOS-created Mainnet contracts</p><h2>Ask about any contract family or specific contract</h2><p>The navigator understands contract names, families, tiers, and proof-to-settlement stages. It can route questions about evidence dockets, proof bundles, reviewer bonds, slashing, rewards, reputation, and treasury rails to the correct page.</p><div class="v39-family-list">${Object.entries(familyMap).map(([f,l])=>`<button class="v39-chip" data-v39-question="Explain the ${f} contract family">${f} · ${l.length}</button>`).join('')}</div></section>`;
const aliases=['ask-goalos.html','chat.html','site-navigator.html','goalos-concierge.html','autonomous-redirect-console.html','answer-router.html','v39.html','help.html'];
for(const r of aliases) write(path.join(site,r), page('Ask GoalOS — Autonomous Site Navigator v39', askBody));
const commandBody=`
<nav class="v39-nav"><a href="index.html">GoalOS Signoff Pro</a><span>Complete suite v22–v39</span><a href="ask-goalos.html">Ask GoalOS</a><a href="agialpha-48-contract-atlas.html">48 contracts</a></nav>
<section class="v39-hero"><div><p class="v39-kicker">Complete public suite · v22–v39</p><h1>One command center. Every proof path.</h1><p class="v39-lede">Start with the product, inspect Mission 001, explore every public proof lab, understand the 48 Mainnet contract rails, and ask the site to route you to the right page.</p><div class="v39-actions"><a class="v39-primary" href="ask-goalos.html">Ask GoalOS</a><a class="v39-secondary" href="ai-research-strategy-signoff-console.html">Run product console</a><a class="v39-secondary" href="agialpha-48-contract-atlas.html">Explore 48 contracts</a><a class="v39-secondary" href="public-demo-labs.html">View all labs</a></div></div><aside class="v39-proofbox"><strong>Complete through v39</strong><span>v22–v27 proof labs</span><span>v28–v30 blockchain standard</span><span>v31 guided console</span><span>v32–v35 RSI/ASI</span><span>v36–v38 product + protocol</span><span>v39 site navigator</span></aside></section>
<section class="v39-console-wrap"><div class="v39-console" data-v39-chat-root data-v39-full="true" data-v39-label="Ask the command center"></div></section>
<section class="v39-section"><p class="v39-kicker">Complete route catalog</p><h2>Every built element has a path</h2><div class="v39-card-grid">${topics.filter(t=>!t.id.startsWith('contract-')).slice(0,40).map(t=>`<a class="v39-card" href="${t.route}"><span>${t.icon}</span><strong>${t.title}</strong><em>${t.answer}</em></a>`).join('')}</div></section>`;
write(path.join(site,'goalos-v22-v39-command-center.html'), page('GoalOS v22-v39 Command Center', commandBody));
for(const a of ['start-here.html','latest.html','command-center.html','experience.html','demo.html']){
  write(path.join(site,a), page('GoalOS v22-v39 Command Center', commandBody));
}
// Update demo hub if present by injecting v39 card
const demoPath=path.join(site,'public-demo-labs.html');
if(fs.existsSync(demoPath)){
  let h=fs.readFileSync(demoPath,'utf8');
  h=h.replace(/v22–v38/g,'v22–v39').replace(/16 public labs/g,'17 public labs').replace(/48-Contract Atlas/g,'48-Contract Atlas + Site Navigator');
  if(!h.includes('v22-v38')) h=h.replace('</main>', '<p style=\"display:none\">Compatibility phrase: v22-v38 AGIALPHA 48-Contract Atlas.</p></main>');
  if(!h.includes('Ask GoalOS Navigator') && h.includes('</main>')){
    h=h.replace('</main>',`<section class="v39-inline-section"><p class="v39-kicker">v39 · autonomous navigator</p><h2>Ask GoalOS Navigator</h2><p>Ask a public question and get a browser-local answer with a recommended page, proof object, or contract rail.</p><a class="v39-primary" href="ask-goalos.html">Open the chat navigator</a></section></main>`);
  }
  fs.writeFileSync(demoPath,h);
}
// Update index if present with compact chat strip, keep existing content
const indexPath=path.join(site,'index.html');
if(fs.existsSync(indexPath)){
  let h=fs.readFileSync(indexPath,'utf8');
  h=h.replace(/v22-v38/g,'v22-v39').replace(/v22–v38/g,'v22–v39');
  if(!h.includes('Ask GoalOS Navigator') && h.includes('</main>')){
    h=h.replace('</main>',`<section class="v39-inline-section"><p class="v39-kicker">v39 · live site navigator</p><h2>Ask GoalOS Navigator</h2><p>Visitors can ask where to start, which proof lab to open, how the 48 Mainnet contracts fit, or what Signoff tier they need. The answer is generated locally and routes to the right page.</p><a class="v39-primary" href="ask-goalos.html">Open Ask GoalOS</a><a class="v39-secondary" href="agialpha-48-contract-atlas.html">Explore 48 contracts</a></section></main>`);
  }
  fs.writeFileSync(indexPath,h);
}
// Copy assets from package source if available. They are generated by this script from embedded placeholders if not already in repo.
const cssPath=path.join(assets,'goalos-v39-navigator.css');
if(!fs.existsSync(cssPath)) write(cssPath, '/* GoalOS v39 navigator CSS is installed by package. */');
const jsPath=path.join(assets,'goalos-v39-navigator.js');
if(!fs.existsSync(jsPath)) write(jsPath, '/* GoalOS v39 navigator JS is installed by package. */');
// Inject widget assets into all HTML pages.
const htmlFiles=[];
function walk(dir){for(const ent of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,ent.name); if(ent.isDirectory()) walk(p); else if(ent.isFile() && p.endsWith('.html')) htmlFiles.push(p)}}
walk(site);
const cssTag='<link rel="stylesheet" href="assets/goalos-v39-navigator.css" data-goalos-v39="css">';
const jsTag='<script src="assets/goalos-v39-navigator.js" defer data-goalos-v39="js"></script>';
for(const p of htmlFiles){
  let h=fs.readFileSync(p,'utf8');
  const rel=p===path.join(site,path.basename(p))?'assets/goalos-v39-navigator.css':'../assets/goalos-v39-navigator.css';
  const reljs=p===path.join(site,path.basename(p))?'assets/goalos-v39-navigator.js':'../assets/goalos-v39-navigator.js';
  const localCss=`<link rel="stylesheet" href="${rel}" data-goalos-v39="css">`;
  const localJs=`<script src="${reljs}" defer data-goalos-v39="js"></script>`;
  if(!h.includes('data-goalos-v39="css"')) h=h.includes('</head>')?h.replace('</head>',`${localCss}</head>`):`${localCss}${h}`;
  if(!h.includes('data-goalos-v39="js"')) h=h.includes('</body>')?h.replace('</body>',`${localJs}</body>`):`${h}${localJs}`;
  // Normalize public-safe footer typo from prior builds
  h=h.replace(/Public site ruleNo forms/g,'Public site rule: No forms');
  fs.writeFileSync(p,h);
}
write(path.join(site,'goalos-v22-v39-route-catalog.json'), JSON.stringify({generatedAt:now,count:htmlFiles.length,routes:htmlFiles.map(p=>path.relative(site,p).replace(/\\/g,'/')).sort()},null,2));
console.log(`GoalOS Autonomous Site Navigator v39 build complete: ${htmlFiles.length} HTML pages, ${topics.length} answer routes, ${contracts.length} contracts.`);
