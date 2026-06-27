import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const ROOT = process.cwd();
const SITE = path.join(ROOT, 'site');
const CONFIG = JSON.parse(fs.readFileSync(path.join(ROOT, 'config/goalos-proof-missions.json'), 'utf8'));
const BASE = '/goalos-signoff-pro/';
const email = CONFIG.contactEmail || 'info@quebec.ai';

fs.mkdirSync(SITE, { recursive: true });
fs.mkdirSync(path.join(SITE, 'assets'), { recursive: true });

function esc(s){ return String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function href(file){ return `${BASE}${file}`; }
function mailto(subject, body=''){
  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
function nav(active=''){
  const links = [
    ['index.html','Signoff Pro'],['start.html','Start'],['proof-mission.html','Proof Mission'],['examples.html','Examples'],['evidence-docket-demo.html','Evidence Docket'],['verify.html','Verify'],['deliverables.html','Deliverables'],['pricing.html','Pricing'],['sovereign-machine-economy.html','Sovereign Economy']
  ];
  return `<header class="ua-nav"><a class="ua-brand" href="${href('index.html')}"><span class="ua-brand-mark">◇</span><span><b>GOALOS SIGNOFF PRO</b><small>PROOF-TO-ACCEPTANCE INSTITUTION</small></span></a><nav>${links.map(([f,l])=>`<a class="${active===f?'active':''}" href="${href(f)}">${l}</a>`).join('')}</nav><a class="ua-cta small" href="${mailto('GoalOS Signoff Pro proof mission request','Hello GoalOS team,\n\nI would like to request a proof mission for one AI-delivered work package.\n\nOrganization:\nWork package:\nDeadline:\nDesired reviewer:\n')}">Request access</a></header>`;
}
function shell({file,title,eyebrow='',summary='',body='',active='',description=''}){
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${esc(title)} · GoalOS Signoff Pro</title><meta name="description" content="${esc(description || summary || title)}"><meta property="og:title" content="${esc(title)} · GoalOS Signoff Pro"><meta property="og:description" content="${esc(summary || description || title)}"><meta property="og:type" content="website"><meta property="og:url" content="https://montrealai.github.io/goalos-signoff-pro/${file}"><link rel="stylesheet" href="${BASE}assets/user-activation.css"><script defer src="${BASE}assets/user-activation.js"></script></head><body><canvas id="uaField" aria-hidden="true"></canvas>${nav(active||file)}<main class="ua-page"><section class="ua-hero"><p class="ua-eyebrow">${esc(eyebrow)}</p><h1>${title}</h1>${summary?`<p class="ua-summary">${summary}</p>`:''}</section>${body}</main><footer class="ua-footer"><b>GoalOS Signoff Pro</b><span>AI work acceptance · evidence review · signed receipts · proof missions</span><a href="${mailto('GoalOS Signoff Pro inquiry')}">${email}</a><a href="${href('sme-manifest.json')}">Manifest</a></footer></body></html>`;
  fs.writeFileSync(path.join(SITE,file), html, 'utf8');
}
function card(title, body, extra='') { return `<article class="ua-card"><h3>${title}</h3><p>${body}</p>${extra}</article>`; }
function stat(n,l){return `<div class="ua-stat"><b>${n}</b><span>${l}</span></div>`;}
function gate(n,t,b){return `<li><span>${n}</span><b>${t}</b><small>${b}</small></li>`}
function table(rows){return `<div class="ua-table">${rows.map(r=>`<div>${r.map(c=>`<span>${c}</span>`).join('')}</div>`).join('')}</div>`}

const gates = ['Objective','Mission Contract','Evidence Docket','Verifier Report','Risk Ledger','Decision State','Action Graph','Mission Receipt','Chronicle','Capability Package'];
const gateList = gates.map((g,i)=>gate(String(i+1).padStart(2,'0'), g, [
  'The decision to support and what done means.',
  'Scope, success criteria, constraints, sources, risk, reviewer, and done condition.',
  'Public-safe proof room for claims, sources, baselines, proof packets, costs, risks, and replay.',
  'Independent-looking review questions, gaps, contradictions, freshness, and support checks.',
  'Risks, assumptions, reversibility, unresolved issues, and required human judgment.',
  'Accept, request changes, reject, or escalate — with rationale preserved.',
  'Owners, next actions, dependencies, approvals, proof requirements, and rollback notes.',
  'Signed record of the accepted version and evidence boundary.',
  'Durable history of mission, decision, evidence, and reusable capability.',
  'What the organization can reuse next time.'
][i])).join('');

shell({file:'start.html', active:'start.html', eyebrow:'START HERE', title:'Start with one AI deliverable.', summary:'Choose one serious AI-delivered work package. GoalOS turns it into a mission, evidence, review, decision, and receipt.', body:`
<section class="ua-split"><div><h2>What can I do in the next 60 seconds?</h2><p>Pick the path that matches your situation. You do not need to understand the protocol to start; you only need one piece of AI-delivered work that deserves an acceptance record.</p><div class="ua-actions"><a class="ua-cta" href="${href('proof-mission.html')}">Request a Proof Mission</a><a class="ua-ghost" href="${href('evidence-docket-demo.html')}">See a sample docket</a><a class="ua-ghost" href="${href('verify.html')}">Verify a receipt</a></div></div><div class="ua-console"><ol>${gate('01','Define done','State what should be accepted and what evidence is required.')}${gate('02','Submit work','Attach the report, files, links, tests, or screenshots.')}${gate('03','Map evidence','Connect each claim and deliverable to support.')}${gate('04','Review','Human reviewer accepts, requests changes, rejects, or escalates.')}${gate('05','Seal receipt','GoalOS records the accepted version and replay path.')}</ol></div></section>
<section class="ua-grid three">${card('For clients','See what you are accepting before you approve AI-assisted work.')} ${card('For builders','Submit evidence in a format that reduces ambiguity and speeds approval.')} ${card('For reviewers','Inspect claims, risk, sources, limitations, and version history from one proof room.')}</section>
<section class="ua-band"><h2>Fastest useful outcome</h2><p>Send us one AI-delivered work package and we will help turn it into a public-safe Evidence Docket and Mission Receipt structure for review.</p><a class="ua-cta" href="${mailto('Request a GoalOS Proof Mission','Hello GoalOS team,\n\nI want to start with one AI-delivered work package.\n\nWork package:\nDecision needed:\nDeadline:\nEvidence available:\nReviewer / approver:\n')}">Email ${email}</a></section>`});

shell({file:'proof-mission.html', active:'proof-mission.html', eyebrow:'48-HOUR PROOF MISSION', title:'Move one objective from uncertainty to justified action.', summary:'A Proof Mission converts one high-stakes AI-delivered work package into an Evidence Docket, verifier report, risk ledger, decision deck, action graph, and signed Mission Receipt.', body:`
<section class="ua-split"><div><h2>The founding offer</h2><p>Bring one consequential AI deliverable: a research report, automation milestone, vendor review, grant milestone, strategy memo, or internal AI pilot. GoalOS turns it into a proof-backed decision package that an executive, reviewer, or client can inspect.</p><div class="ua-actions"><a class="ua-cta" href="${mailto('48-hour GoalOS Proof Mission','Hello GoalOS team,\n\nI would like to request a 48-hour Proof Mission.\n\nOrganization:\nAI-delivered work package:\nDecision to support:\nDeadline:\nEvidence currently available:\n')}">Request the 48-hour mission</a><a class="ua-ghost" href="${href('deliverables.html')}">See what you receive</a></div></div><div class="ua-stack">${CONFIG.deliverables.map((d,i)=>`<span><b>${String(i+1).padStart(2,'0')}</b>${d}</span>`).join('')}</div></section>
<section class="ua-grid four">${stat('1','work package')}${stat('48h','target cycle')}${stat('10+','proof artifacts')}${stat('1','human decision')}</section>
<section class="ua-panel"><h2>Good first missions</h2><div class="ua-grid two">${CONFIG.exampleMissions.slice(0,6).map(m=>card(m.title,`Input: ${m.input}. Output: ${m.output}.`)).join('')}</div></section>`});

shell({file:'examples.html', active:'examples.html', eyebrow:'EXAMPLES', title:'Proof missions people can understand.', summary:'Concrete examples make the system real: one input, one review path, one evidence package, one decision record.', body:`
<section class="ua-grid two">${CONFIG.exampleMissions.map(m=>card(m.title, `<b>Input:</b> ${m.input}<br><br><b>GoalOS output:</b> ${m.output}`, `<a class="ua-mini" href="${href('evidence-docket-demo.html')}">View sample structure</a>`)).join('')}</section>
<section class="ua-band"><h2>Have a different use case?</h2><p>Send the work package and the decision you need to support. The first step is not a platform migration; it is one proof mission.</p><a class="ua-cta" href="${mailto('GoalOS example mission request','Hello GoalOS team,\n\nMy use case is:\nWork package:\nDecision to support:\n')}">Ask if your mission fits</a></section>`});

const sampleDocket = {
  publicId:'GS-DEMO-RESEARCH-001',
  title:'AI Research Report Acceptance Demo',
  institution:'GoalOS Signoff Pro',
  signer:'demo-receipt-signer',
  decision:'REQUEST_CHANGES_READY_FOR_REVIEW',
  generatedAt:'2026-06-27T00:00:00.000Z',
  hashes:{ missionContract:'sha256:8fd4-demo', claimsMatrix:'sha256:1ac9-demo', evidencePackage:'sha256:72ce-demo', receipt:'sha256:9821-demo' },
  claims:[
    {claim:'The report covers five named competitors.', evidence:'report sections 2-6, source table rows 1-19', status:'supported'},
    {claim:'Pricing comparison is current enough for review.', evidence:'pricing sheet and dated source links', status:'requires freshness review'},
    {claim:'Recommendation follows from the evidence.', evidence:'decision matrix, risk notes, assumptions', status:'supported with caveats'}
  ],
  gates:['mission contract present','claims matrix present','source provenance present','contradictions surfaced','risk ledger present','human review required','receipt replay path present']
};

shell({file:'evidence-docket-demo.html', active:'evidence-docket-demo.html', eyebrow:'SAMPLE EVIDENCE DOCKET', title:'This is what proof looks like.', summary:'A public-safe proof room for one AI-delivered work package: claims, sources, baselines, proof packets, evaluator notes, risks, and replay path.', body:`
<section class="ua-split"><div><h2>Demo docket: ${sampleDocket.title}</h2><p>This page is a sample product artifact, not a legal certification. It shows the shape of the record a client, reviewer, or operator should expect before acceptance.</p><div class="ua-actions"><a class="ua-cta" href="${href('verify.html')}">Try the verifier</a><button class="ua-ghost" data-copy='${esc(JSON.stringify(sampleDocket))}'>Copy demo receipt JSON</button></div></div><pre class="ua-json">${esc(JSON.stringify(sampleDocket, null, 2))}</pre></section>
<section class="ua-tabs" data-tabs><div class="ua-tab-buttons"><button>Manifest</button><button>Claims</button><button>Provenance</button><button>Risk</button><button>Decision</button><button>Replay</button></div><div class="ua-tab-panels"><article><h3>Manifest</h3>${table([['Public ID',sampleDocket.publicId],['Decision',sampleDocket.decision],['Boundary','public-safe summary with private evidence appendices reserved for scoped review']])}</article><article><h3>Claims matrix</h3>${table(sampleDocket.claims.map(c=>[c.claim,c.evidence,c.status]))}</article><article><h3>Source provenance</h3><p>Primary sources are separated from secondary interpretation. Time-sensitive claims carry dates. Unsupported claims become questions, not accepted facts.</p></article><article><h3>Risk ledger</h3><p>Open assumptions, freshness gaps, conflicting evidence, missing tests, and irreversible actions are surfaced before signoff.</p></article><article><h3>Decision state</h3><p>The reviewer can accept, request changes, reject, or escalate. The receipt records the version and rationale.</p></article><article><h3>Replay path</h3><p>Artifacts are identified by hashes and public-safe pointers. A reviewer can inspect what changed between versions.</p></article></div></section>`});

shell({file:'verify.html', active:'verify.html', eyebrow:'MISSION RECEIPT VERIFIER', title:'Paste a receipt. Inspect the record.', summary:'A simple public verifier for Mission Receipt JSON. The first version verifies demo structure, required fields, and hash shape client-side.', body:`
<section class="ua-split"><div><h2>Try it now</h2><p>Paste a Mission Receipt JSON object or use the demo. The verifier checks the structure and shows the decision state. Later deployments can connect the same interface to the signed receipt backend and optional public anchors.</p><div class="ua-actions"><button class="ua-cta" id="loadDemo">Load demo receipt</button><button class="ua-ghost" id="verifyReceipt">Verify locally</button></div></div><div class="ua-console"><textarea id="receiptInput" spellcheck="false" aria-label="Receipt JSON"></textarea><div id="verifyResult" class="ua-result">Awaiting receipt.</div></div></section>`});

shell({file:'deliverables.html', active:'deliverables.html', eyebrow:'WHAT YOU RECEIVE', title:'Not a longer report. A decision package.', summary:'GoalOS packages AI-delivered work into evidence, review, action, memory, and reusable capability.', body:`
<section class="ua-grid three">${CONFIG.deliverables.map((d,i)=>card(d, [
 'Scope, objective, constraints, and acceptance criteria.',
 'Public-safe proof room for claims and artifacts.',
 'Every major claim mapped to evidence or uncertainty.',
 'Where information came from and how current it is.',
 'Independent review questions, gaps, and contradictions.',
 'Risks, assumptions, reversibility, and escalation paths.',
 'One-page executive readout for the actual decision.',
 'Slides/briefing structure for stakeholders.',
 'Next actions, owners, dependencies, approvals, rollback.',
 'Accepted version, evidence fingerprints, reviewer decision.',
 'Durable mission memory and decision history.',
 'Reusable template or capability for future related work.'
 ][i] || 'Included in the proof mission package.')).join('')}</section>`});

shell({file:'pricing.html', active:'pricing.html', eyebrow:'PRIVATE BETA PRICING', title:'Simple pricing for serious pilots.', summary:'Start with one proof mission. Expand only when the evidence shows value.', body:`
<section class="ua-pricing"><article><p>Private beta</p><h2>Invite-only</h2><p>For early teams that want to test the workflow and help shape the product.</p><a class="ua-cta" href="${mailto('GoalOS Signoff Pro private beta','Hello GoalOS team,\n\nI would like private beta access.\n')}">Request beta access</a></article><article class="featured"><p>Proof Mission</p><h2>From $500-$2,500</h2><p>One AI-delivered work package converted into an Evidence Docket, verifier report, risk ledger, decision deck, action graph, and receipt.</p><a class="ua-cta" href="${mailto('GoalOS Proof Mission pricing inquiry','Hello GoalOS team,\n\nI would like pricing for a Proof Mission.\n')}">Discuss a mission</a></article><article><p>Team / Enterprise</p><h2>Custom</h2><p>For agencies, grant programs, enterprise AI teams, and repeatable acceptance workflows.</p><a class="ua-ghost" href="${mailto('GoalOS team deployment inquiry','Hello GoalOS team,\n\nWe would like to discuss a team deployment.\n')}">Contact</a></article></section>`});

shell({file:'faq.html', active:'faq.html', eyebrow:'FAQ', title:'Plain answers for serious users.', summary:'GoalOS can be deep. The first user experience should be simple.', body:`
<section class="ua-faq">${[
 ['What is GoalOS Signoff Pro?','A workflow for defining done, collecting evidence, getting human review, and issuing a Mission Receipt for AI-delivered work.'],
 ['What is a Proof Mission?','A focused engagement around one AI-delivered work package that produces an Evidence Docket and decision package.'],
 ['Do I need a wallet?','No for the mainstream product and proof mission intake. Optional verified receipts can come later.'],
 ['What makes this different from a report?','A report is text. A GoalOS package records claims, evidence, risks, review, action, receipt, and replay path.'],
 ['Who is it for?','AI consultants, agencies, enterprise AI pilot teams, grant programs, procurement teams, and reviewers of consequential AI output.'],
 ['How do I start?','Send one work package and the decision you need to support to info@quebec.ai.']
].map(([q,a])=>`<details><summary>${q}</summary><p>${a}</p></details>`).join('')}</section>`});

shell({file:'contact.html', active:'contact.html', eyebrow:'CONTACT', title:'Bring one serious AI work package.', summary:'The fastest way to evaluate GoalOS is to run one proof mission.', body:`
<section class="ua-split"><div><h2>Email the GoalOS team</h2><p>Use this contact for private beta access, pilot questions, proof mission requests, and institutional review inquiries.</p><a class="ua-cta" href="${mailto('GoalOS Signoff Pro inquiry','Hello GoalOS team,\n\nI would like to discuss GoalOS Signoff Pro.\n\nName:\nOrganization:\nUse case:\n')}">${email}</a></div><div class="ua-card"><h3>Helpful to include</h3><ul><li>What work needs acceptance?</li><li>Who delivered it?</li><li>Who reviews it?</li><li>What evidence already exists?</li><li>What decision is needed?</li></ul></div></section>`});

shell({file:'request-access.html', active:'request-access.html', eyebrow:'REQUEST ACCESS', title:'Request private beta access.', summary:'Use the email template to start with one proof mission.', body:`
<section class="ua-console wide"><h2>Email template</h2><pre>Hello GoalOS team,

I would like to request access to GoalOS Signoff Pro.

Name:
Organization:
Role:
AI-delivered work package:
Decision to support:
Deadline:
Evidence currently available:
Would you like independent review? yes / no

Thank you.</pre><a class="ua-cta" href="${mailto('GoalOS Signoff Pro private beta request','Hello GoalOS team,\n\nI would like to request access to GoalOS Signoff Pro.\n\nName:\nOrganization:\nRole:\nAI-delivered work package:\nDecision to support:\nDeadline:\nEvidence currently available:\nWould you like independent review? yes / no\n')}">Open email</a></section>`});

shell({file:'press.html', active:'press.html', eyebrow:'PRESS KIT', title:'Share the product clearly.', summary:'Launch copy, product one-liners, founder-ready language, and public links.', body:`
<section class="ua-grid two">${card('One-liner','GoalOS Signoff Pro is the institutional acceptance layer for AI-delivered work.')} ${card('Short description','Define done, bind evidence, preserve human review, and issue signed Mission Receipts for AI-assisted deliverables.')} ${card('Launch post','The AI era needs proof of work. GoalOS Signoff Pro turns AI-delivered work into mission briefs, evidence, review, human authorization, and signed receipts.')} ${card('URL','https://montrealai.github.io/goalos-signoff-pro/')}</section>`});

shell({file:'implementation.html', active:'implementation.html', eyebrow:'IMPLEMENTATION MAP', title:'The public claims are tied to code.', summary:'A practical map from website capability to repository surface.', body:`
<section class="ua-panel"><h2>Capability-to-code map</h2>${table([
 ['Mission briefs','src/lib/validation.ts, src/lib/domain.ts, Supabase project + criteria schema'],
 ['Evidence uploads','src/app/api/projects/[projectId]/uploads/*, SHA-256 validation, artifact storage model'],
 ['Evidence mapping','criterion responses, submissions route, artifact-to-criterion relationship'],
 ['Human review','review routes, reviewer role, review form/workspace model'],
 ['Final decision','receipt issue path, client-controlled decision model, signed Mission Receipt'],
 ['Receipt verification','receipt canonicalization, JSON/PDF export, public verify page'],
 ['Sovereign Machine Economy','src/lib/sovereign-machine-economy/*, parity workflow, generated pages'],
 ['Public website','scripts/build-asi-apex-v6-pages.mjs, build-sovereign-machine-economy-pages.mjs, build-user-activation-pages.mjs']
])}</section>`});

// Inject activation rail into existing home if present
const indexPath = path.join(SITE, 'index.html');
if (fs.existsSync(indexPath)) {
  let html = fs.readFileSync(indexPath, 'utf8');
  if (!html.includes('goalos-activation-rail')) {
    const rail = `<section class="goalos-activation-rail"><a href="${BASE}start.html">Start here</a><a href="${BASE}proof-mission.html">Request a Proof Mission</a><a href="${BASE}evidence-docket-demo.html">See a sample docket</a><a href="${BASE}verify.html">Verify a receipt</a></section>`;
    html = html.replace('</head>', `<link rel="stylesheet" href="${BASE}assets/user-activation.css"></head>`).replace('</body>', `${rail}<script defer src="${BASE}assets/user-activation.js"></script></body>`);
    fs.writeFileSync(indexPath, html, 'utf8');
  }
}

// Sitemap
const pages = ['start.html','proof-mission.html','examples.html','evidence-docket-demo.html','verify.html','deliverables.html','pricing.html','faq.html','contact.html','request-access.html','press.html','implementation.html'];
const sitemapPath = path.join(SITE,'sitemap.xml');
let sitemap = fs.existsSync(sitemapPath) ? fs.readFileSync(sitemapPath,'utf8') : `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>`;
const extra = pages.filter(p=>!sitemap.includes(p)).map(p=>`<url><loc>https://montrealai.github.io/goalos-signoff-pro/${p}</loc></url>`).join('\n');
sitemap = sitemap.replace('</urlset>', `${extra}\n</urlset>`);
fs.writeFileSync(sitemapPath, sitemap, 'utf8');

// Assets
const css = `
:root{--bg:#02070b;--panel:rgba(255,255,255,.06);--line:rgba(150,255,226,.22);--mint:#6cf7dc;--cyan:#72dfff;--gold:#ffe98a;--cream:#f7f1e7;--muted:#aeb9c9;--radius:28px;--max:1120px}*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:radial-gradient(circle at 72% 16%,rgba(62,247,215,.18),transparent 30%),radial-gradient(circle at 12% 72%,rgba(146,126,255,.15),transparent 30%),linear-gradient(135deg,#02060a,#061416 48%,#03050b);color:var(--cream);font:16px/1.65 Inter,ui-sans-serif,system-ui,-apple-system,Segoe UI,Arial,sans-serif;min-height:100vh;overflow-x:hidden}#uaField{position:fixed;inset:0;z-index:-1;opacity:.45}.ua-nav{height:78px;display:flex;align-items:center;gap:28px;justify-content:space-between;padding:0 clamp(18px,4vw,52px);position:sticky;top:0;z-index:20;background:rgba(1,5,8,.72);backdrop-filter:blur(20px);border-bottom:1px solid rgba(255,255,255,.08)}.ua-brand{display:flex;align-items:center;gap:12px;color:var(--cream);text-decoration:none;min-width:max-content}.ua-brand-mark{display:grid;place-items:center;width:36px;height:36px;border:1px solid var(--line);border-radius:12px;color:var(--mint);box-shadow:0 0 28px rgba(108,247,220,.28)}.ua-brand b{display:block;font-size:.8rem;letter-spacing:.17em}.ua-brand small{display:block;color:var(--muted);font-size:.62rem;letter-spacing:.18em}.ua-nav nav{display:flex;gap:8px;align-items:center;overflow:auto}.ua-nav nav a{color:#dce7ee;text-decoration:none;font-weight:800;font-size:.78rem;padding:10px 12px;border-radius:999px;white-space:nowrap}.ua-nav nav a.active,.ua-nav nav a:hover{background:rgba(255,255,255,.09)}.ua-cta,.ua-ghost{display:inline-flex;align-items:center;justify-content:center;border-radius:999px;padding:13px 20px;text-decoration:none;font-weight:900;border:1px solid rgba(255,255,255,.18);cursor:pointer}.ua-cta{background:linear-gradient(135deg,#f8ff9e,#5cf5e3 65%,#73dfff);color:#001112;box-shadow:0 12px 40px rgba(108,247,220,.20)}.ua-cta.small{padding:11px 16px}.ua-ghost{background:rgba(255,255,255,.07);color:var(--cream)}.ua-page{max-width:var(--max);margin:0 auto;padding:96px 22px 110px}.ua-hero{max-width:900px;margin-bottom:72px}.ua-eyebrow{color:var(--mint);letter-spacing:.36em;font-size:.78rem;font-weight:900;text-transform:uppercase}.ua-hero h1{font-size:clamp(3rem,9vw,7.8rem);line-height:.88;letter-spacing:-.08em;margin:10px 0 22px;text-wrap:balance}.ua-summary{max-width:820px;font-size:clamp(1.08rem,2vw,1.45rem);color:#d5e2ea}.ua-split{display:grid;grid-template-columns:1fr 1fr;gap:28px;align-items:center;margin:40px 0 72px}.ua-actions{display:flex;flex-wrap:wrap;gap:12px;margin-top:26px}.ua-card,.ua-console,.ua-panel,.ua-band,.ua-stack,.ua-pricing article{background:linear-gradient(180deg,rgba(255,255,255,.075),rgba(255,255,255,.035));border:1px solid rgba(255,255,255,.12);border-radius:var(--radius);padding:28px;box-shadow:inset 0 1px 0 rgba(255,255,255,.10),0 24px 80px rgba(0,0,0,.24)}.ua-card h3,.ua-panel h2,.ua-band h2,.ua-console h2{font-size:clamp(1.45rem,3vw,2.8rem);line-height:1;margin:0 0 12px;letter-spacing:-.06em}.ua-card p,.ua-panel p,.ua-band p{color:#c5d1dd}.ua-grid{display:grid;gap:18px;margin:28px 0}.ua-grid.two{grid-template-columns:repeat(2,minmax(0,1fr))}.ua-grid.three{grid-template-columns:repeat(3,minmax(0,1fr))}.ua-grid.four{grid-template-columns:repeat(4,minmax(0,1fr))}.ua-console ol,.ua-stack{list-style:none;margin:0;padding:0}.ua-console li,.ua-stack span{display:grid;grid-template-columns:44px 1fr;gap:12px;align-items:start;border:1px solid rgba(108,247,220,.25);border-radius:18px;padding:18px;margin:0 0 12px;background:rgba(108,247,220,.055)}.ua-console li span,.ua-stack b{color:var(--gold);font-weight:900}.ua-console li b{display:block}.ua-console li small{color:#b8c8d7}.ua-stat{padding:22px;border:1px solid rgba(255,255,255,.13);border-radius:18px;background:rgba(255,255,255,.05)}.ua-stat b{display:block;color:var(--gold);font-size:2.4rem;line-height:1}.ua-stat span{display:block;letter-spacing:.16em;text-transform:uppercase;font-size:.72rem;color:#c9d5df;font-weight:900}.ua-band{margin:70px 0;text-align:center}.ua-stack span{grid-template-columns:44px 1fr}.ua-mini{color:var(--mint);font-weight:900;text-decoration:none}.ua-json,textarea{width:100%;min-height:360px;background:#03070b;color:#d7ffee;border:1px solid rgba(108,247,220,.22);border-radius:20px;padding:18px;overflow:auto;white-space:pre-wrap}.ua-tabs{margin:60px 0}.ua-tab-buttons{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px}.ua-tab-buttons button{border:1px solid rgba(255,255,255,.13);background:rgba(255,255,255,.07);color:#fff;border-radius:999px;padding:10px 14px;font-weight:900}.ua-tab-buttons button.active{background:var(--mint);color:#001112}.ua-tab-panels article{display:none}.ua-tab-panels article.active{display:block;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);border-radius:24px;padding:24px}.ua-table{border:1px solid rgba(255,255,255,.12);border-radius:20px;overflow:hidden}.ua-table div{display:grid;grid-template-columns:1fr 1.4fr 1fr}.ua-table span{padding:14px;border-bottom:1px solid rgba(255,255,255,.10);color:#d6e1ea}.ua-pricing{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px}.ua-pricing h2{font-size:2.5rem;letter-spacing:-.07em}.ua-pricing .featured{outline:2px solid rgba(108,247,220,.45)}.ua-faq details{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);border-radius:20px;padding:20px;margin:12px 0}.ua-faq summary{font-weight:900;font-size:1.2rem;cursor:pointer}.ua-result{margin-top:14px;padding:18px;border-radius:18px;background:rgba(108,247,220,.08);border:1px solid rgba(108,247,220,.25)}.wide{max-width:900px;margin:auto}.goalos-activation-rail{position:fixed;left:50%;bottom:22px;transform:translateX(-50%);z-index:50;display:flex;gap:10px;flex-wrap:wrap;justify-content:center;background:rgba(1,6,10,.74);backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,.13);border-radius:999px;padding:10px;box-shadow:0 20px 80px rgba(0,0,0,.35)}.goalos-activation-rail a{color:#001112;background:linear-gradient(135deg,#f8ff9e,#70f9e4);padding:10px 14px;border-radius:999px;font-weight:900;text-decoration:none;font-size:.78rem}.ua-footer{display:flex;gap:18px;align-items:center;justify-content:center;flex-wrap:wrap;padding:26px;color:#b7c3cf;border-top:1px solid rgba(255,255,255,.09);background:#02060a}.ua-footer a{color:var(--mint);text-decoration:none}@media(max-width:900px){.ua-split,.ua-grid.two,.ua-grid.three,.ua-grid.four,.ua-pricing{grid-template-columns:1fr}.ua-nav{height:auto;padding:16px;align-items:flex-start}.ua-nav nav{max-width:100%;order:3;width:100%}.ua-hero h1{font-size:clamp(3rem,14vw,5.4rem)}.goalos-activation-rail{position:static;transform:none;border-radius:22px;margin:20px}}
`;
fs.writeFileSync(path.join(SITE,'assets/user-activation.css'), css, 'utf8');
const js = `
(function(){
const c=document.getElementById('uaField'); if(c){ const ctx=c.getContext('2d'); let w,h,pts=[]; function resize(){w=c.width=innerWidth;h=c.height=innerHeight;pts=Array.from({length:Math.min(90,Math.floor(w*h/18000))},()=>({x:Math.random()*w,y:Math.random()*h,vx:(Math.random()-.5)*.35,vy:(Math.random()-.5)*.35,r:Math.random()*1.8+0.4}));} resize(); addEventListener('resize',resize); function draw(){ctx.clearRect(0,0,w,h);ctx.fillStyle='rgba(108,247,220,.75)';pts.forEach(p=>{p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>w)p.vx*=-1;if(p.y<0||p.y>h)p.vy*=-1;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill();});ctx.strokeStyle='rgba(108,247,220,.12)';for(let i=0;i<pts.length;i++)for(let j=i+1;j<pts.length;j++){const a=pts[i],b=pts[j],d=Math.hypot(a.x-b.x,a.y-b.y);if(d<120){ctx.globalAlpha=1-d/120;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();ctx.globalAlpha=1;}}requestAnimationFrame(draw);} draw();}
document.querySelectorAll('[data-tabs]').forEach(t=>{const bs=[...t.querySelectorAll('.ua-tab-buttons button')], ps=[...t.querySelectorAll('.ua-tab-panels article')]; function show(i){bs.forEach((b,k)=>b.classList.toggle('active',k===i));ps.forEach((p,k)=>p.classList.toggle('active',k===i));} bs.forEach((b,i)=>b.addEventListener('click',()=>show(i))); show(0);});
document.querySelectorAll('[data-copy]').forEach(b=>b.addEventListener('click',()=>navigator.clipboard?.writeText(b.getAttribute('data-copy')).then(()=>{b.textContent='Copied'})));
const demo={publicId:'GS-DEMO-RESEARCH-001',title:'AI Research Report Acceptance Demo',decision:'REQUEST_CHANGES_READY_FOR_REVIEW',hashes:{missionContract:'sha256:8fd4-demo',claimsMatrix:'sha256:1ac9-demo',evidencePackage:'sha256:72ce-demo',receipt:'sha256:9821-demo'},required:['missionContract','claimsMatrix','evidencePackage','receipt']};
const input=document.getElementById('receiptInput'), result=document.getElementById('verifyResult'); document.getElementById('loadDemo')?.addEventListener('click',()=>{input.value=JSON.stringify(demo,null,2); result.textContent='Demo loaded. Click Verify locally.'}); document.getElementById('verifyReceipt')?.addEventListener('click',()=>{try{const o=JSON.parse(input.value); const missing=['publicId','title','decision','hashes'].filter(k=>!o[k]); if(missing.length) throw new Error('Missing: '+missing.join(', ')); const hashOk=Object.values(o.hashes||{}).every(v=>String(v).startsWith('sha256:')); result.innerHTML=hashOk?'<b>Receipt structure valid.</b><br>Decision state: '+String(o.decision):'<b>Receipt parsed, but hash format needs review.</b>';}catch(e){result.textContent='Could not verify: '+e.message;}});
})();
`;
fs.writeFileSync(path.join(SITE,'assets/user-activation.js'), js, 'utf8');

// Manifest
const files=[]; function walk(d){ for(const e of fs.readdirSync(d,{withFileTypes:true})){ const p=path.join(d,e.name); if(e.isDirectory()) walk(p); else files.push(p);} } walk(SITE);
const manifest={version:'1.0.0',generatedAt:new Date().toISOString(),pages,contactEmail:email,sha256:Object.fromEntries(files.map(f=>[path.relative(SITE,f).replaceAll('\\','/'),crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex')]))};
fs.writeFileSync(path.join(SITE,'user-activation-manifest.json'), JSON.stringify(manifest,null,2), 'utf8');
console.log(`GoalOS User Activation Layer generated ${pages.length} pages`);
