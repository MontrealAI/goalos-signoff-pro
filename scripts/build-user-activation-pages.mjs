import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const ROOT = process.cwd();
const SITE = path.join(ROOT, 'site');
const CONFIG_PATH = path.join(ROOT, 'config/goalos-proof-missions.json');
const CONFIG = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
const BASE = '/goalos-signoff-pro/';
const email = CONFIG.contactEmail || 'info@quebec.ai';
const pages = [];

fs.mkdirSync(SITE, { recursive: true });
fs.mkdirSync(path.join(SITE, 'assets'), { recursive: true });
fs.mkdirSync(path.join(SITE, 'social'), { recursive: true });

function esc(s){return String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function href(file){return `${BASE}${file}`;}
function mailto(subject, body=''){
  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
function nav(active=''){
  const links = [
    ['index.html','Home'], ['start.html','Start'], ['proof-mission.html','Proof Mission'], ['examples.html','Examples'],
    ['evidence-docket-demo.html','Docket'], ['verify.html','Verify'], ['how-it-works.html','How it works'],
    ['pricing.html','Pricing'], ['resources.html','Resources'], ['contact.html','Contact']
  ];
  return `<header class="ua-nav"><a class="ua-brand" href="${href('index.html')}"><span class="ua-brand-mark">◆</span><span><b>GOALOS SIGNOFF PRO</b><small>PROOF-TO-ACTION INSTITUTION</small></span></a><nav>${links.map(([f,l])=>`<a class="${active===f?'active':''}" href="${href(f)}">${l}</a>`).join('')}</nav><a class="ua-cta small" href="${mailto('GoalOS Signoff Pro — request a 48-hour Proof Mission','Hello GoalOS team,\n\nI would like to request a 48-hour Proof Mission.\n\nName:\nOrganization:\nEmail:\nAI work package:\nDeadline:\nWould you like independent review?:\n')}">Request access</a></header>`;
}
function shell({file,title,eyebrow='',summary='',body='',active='',description=''}){
  pages.push(file);
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${esc(title)} · GoalOS Signoff Pro</title><meta name="description" content="${esc(description || summary || title)}"><meta property="og:title" content="${esc(title)} · GoalOS Signoff Pro"><meta property="og:description" content="${esc(summary || description || title)}"><meta property="og:type" content="website"><meta property="og:url" content="https://montrealai.github.io/goalos-signoff-pro/${file}"><link rel="canonical" href="https://montrealai.github.io/goalos-signoff-pro/${file}"><link rel="stylesheet" href="${BASE}assets/user-activation.css"><script defer src="${BASE}assets/user-activation.js"></script></head><body><canvas id="uaField" aria-hidden="true"></canvas>${nav(active||file)}<main class="ua-page"><section class="ua-hero"><p class="ua-eyebrow">${esc(eyebrow)}</p><h1>${title}</h1>${summary?`<p class="ua-summary">${summary}</p>`:''}</section>${body}</main>${activationRail()}<footer class="ua-footer"><b>GoalOS Signoff Pro</b><span>AI work acceptance · evidence review · governed decision states</span><a href="${mailto('GoalOS Signoff Pro inquiry')}">${email}</a><a href="${href('user-activation-manifest.json')}">Manifest</a></footer></body></html>`;
  fs.writeFileSync(path.join(SITE,file), html, 'utf8');
}
function card(title, body, extra=''){return `<article class="ua-card"><h3>${title}</h3><p>${body}</p>${extra}</article>`;}
function stat(n,l){return `<div class="ua-stat"><b>${n}</b><span>${l}</span></div>`;}
function gate(n,t,b){return `<li><span>${n}</span><b>${t}</b><small>${b}</small></li>`;}
function button(label,file){return `<a class="ua-cta" href="${href(file)}">${label}</a>`;}
function ghost(label,file){return `<a class="ua-ghost" href="${href(file)}">${label}</a>`;}
function table(rows){return `<div class="ua-table">${rows.map(r=>`<div>${r.map(c=>`<span>${c}</span>`).join('')}</div>`).join('')}</div>`;}
function activationRail(){return `<div class="goalos-activation-rail"><a href="${href('proof-mission.html')}">Request a Proof Mission</a><a href="${href('evidence-docket-demo.html')}">Example Docket</a><a href="${href('verify.html')}">Verify Receipt</a><a href="${href('start.html')}">Start Here</a></div>`;}

const steps = [
  ['01','Mission Contract','Define the objective, decision, constraints, sources, reviewer, and done condition.'],
  ['02','Evidence Docket','Bind claims to source provenance, evidence, baselines, costs, risks, and replay path.'],
  ['03','Verifier Mesh','Ask whether claims are supported, contradicted, stale, risky, or incomplete.'],
  ['04','Governed Decision State','Turn evidence into accept, change-request, reject, or escalate.'],
  ['05','Mission Receipt','Seal the accepted version, evidence hashes, reviewer decision, and replay boundary.'],
  ['06','Reusable Capability','Preserve templates, criteria, evidence patterns, and lessons for the next mission.']
];
const stepList = steps.map(([n,t,b])=>gate(n,t,b)).join('');
const proofMissionMail = mailto('GoalOS Signoff Pro — 48-hour Proof Mission request','Hello GoalOS team,\n\nI would like to request a 48-hour Proof Mission.\n\nName:\nOrganization:\nEmail:\nAI-delivered work package:\nDecision this should support:\nDeadline:\nEvidence currently available:\nWould you like independent review?:\n');

shell({file:'start.html', active:'start.html', eyebrow:'START HERE', title:'Start with one AI deliverable.', summary:'A normal user path for turning AI output into evidence, review, acceptance, and a signed Mission Receipt.', body:`
<section class="ua-split"><div><h2>What can I do in the next 60 seconds?</h2><p>Choose one AI-delivered work package that someone needs to accept, approve, reject, fund, or revise. GoalOS gives it structure: mission, criteria, evidence, review, decision, receipt.</p><div class="ua-actions"><a class="ua-cta" href="${proofMissionMail}">Request a 48-hour Proof Mission</a>${ghost('See an Example Docket','evidence-docket-demo.html')}${ghost('Verify a Receipt','verify.html')}</div></div><div class="ua-console"><ol>${stepList}</ol></div></section>
<section class="ua-grid four">${stat('1','AI work package')}${stat('6','proof gates')}${stat('10','deliverables')}${stat('∞','receipt replay')}</section>
<section class="ua-band"><h2>For users, the product is simple.</h2><p>You bring one consequential AI deliverable. GoalOS produces an acceptance-ready proof package that a client, reviewer, executive, or team can inspect.</p></section>`});

shell({file:'proof-mission.html', active:'proof-mission.html', eyebrow:'48-HOUR PROOF MISSION', title:'Give GoalOS one serious AI-delivered work package.', summary:'Receive an Evidence Docket, verifier report, risk ledger, executive brief, decision deck, action graph, Chronicle entry, reusable capability package, and signed Mission Receipt.', body:`
<section class="ua-split"><div class="ua-panel"><h2>The founding offer</h2><p>A focused proof mission turns an AI deliverable into a governed decision state. The strongest output is not the largest report; it is the clearest path from uncertainty to justified action.</p><div class="ua-actions"><a class="ua-cta" href="${proofMissionMail}">Request a 48-hour Proof Mission</a>${ghost('View deliverables','deliverables.html')}</div></div><div class="ua-console"><ol>${gate('01','Send the work','Report, automation, code, vendor proposal, grant milestone, or strategy package.')}${gate('02','State the decision','What should a reviewer be able to accept, reject, approve, or escalate?')}${gate('03','Map evidence','Claims, sources, screenshots, tests, links, notes, and unresolved assumptions.')}${gate('04','Review proof','Verifier report, risk ledger, and decision state become inspectable.')}${gate('05','Receive the package','Evidence Docket, executive brief, decision deck, action graph, receipt, and reusable capability.')}</ol></div></section>
<section class="ua-grid three">${CONFIG.examples.slice(0,6).map(e=>card(e.title, `${e.input} ${e.process}`)).join('')}</section>`});

shell({file:'examples.html', active:'examples.html', eyebrow:'EXAMPLES', title:'See where Signoff fits.', summary:'Concrete proof mission examples for agencies, consultants, AI teams, grant programs, and institutional reviewers.', body:`
<section class="ua-grid two">${CONFIG.examples.map(e=>card(e.title, `<b>Input:</b> ${e.input}<br><br><b>Process:</b> ${e.process}<br><br><b>Output:</b> ${e.output}<br><br><b>Decision:</b> ${e.decision}`, `<a class="ua-mini" href="${BASE}examples/proof-missions/${e.slug}/README.md">View repo example →</a>`)).join('')}</section>`});

const docketTabs = [
 ['Manifest','Mission: AI Research Report Acceptance. Version: demo-public. Institution: GoalOS Signoff Pro. Boundary: public-safe summary, no private customer data.'],
 ['Claims matrix','Claim 1: Market report covers five competitors. Evidence: report sections and source list. Status: supported. Claim 2: Pricing comparison is current. Evidence: sources dated within twelve months. Status: needs reviewer confirmation.'],
 ['Source provenance','Sources are separated into primary, secondary, and inferred materials. Time-sensitive facts require date stamps. Unsupported claims remain open.'],
 ['Evidence','Artifacts include report PDF hash, spreadsheet hash, source list hash, reviewer notes hash, and revision history.'],
 ['Verifier report','Checks: claim support, source freshness, contradiction coverage, risk disclosure, acceptance criteria, and replay path.'],
 ['Risk ledger','Open risks: stale sources, hidden assumptions, incomplete competitor pricing, reviewer uncertainty, and downstream action risk.'],
 ['Decision state','Current state: ready for human review. Available decisions: accept, request changes, reject, or escalate.'],
 ['Action graph','Next actions: update pricing source, attach spreadsheet, resolve contradiction, reviewer signoff, seal receipt.'],
 ['Receipt','Receipt ID: GS-DEMO-RESEARCH-001. Decision: REQUEST_CHANGES_READY_FOR_REVIEW. Signature: demo placeholder. Hashes: public-safe.'],
 ['Replay path','Reopen manifest, verify hashes, inspect claims matrix, read verifier report, compare accepted version, and check receipt state.']
];
shell({file:'evidence-docket-demo.html', active:'evidence-docket-demo.html', eyebrow:'SAMPLE EVIDENCE DOCKET', title:'This is what proof looks like.', summary:'A public-safe sample proof room: claims, evidence, verifier notes, risk, decision state, receipt, and replay path.', body:`
<section class="ua-tabs" data-tabs><div class="ua-tab-buttons">${docketTabs.map(([t],i)=>`<button${i===0?' class="active"':''}>${t}</button>`).join('')}</div><div class="ua-tab-panels">${docketTabs.map(([t,b],i)=>`<article${i===0?' class="active"':''}><h2>${t}</h2><p>${b}</p></article>`).join('')}</div></section>
<section class="ua-split"><div class="ua-panel"><h2>Public-safe by design</h2><p>The public docket shows enough to audit the claim boundary without exposing private files, raw traces, or confidential workpapers.</p></div><div class="ua-panel"><h2>Decision-ready</h2><p>The goal is not to overwhelm a reviewer. The goal is to make the decision inspectable, defensible, and actionable.</p></div></section>`});

shell({file:'verify.html', active:'verify.html', eyebrow:'VERIFY', title:'Verify a Mission Receipt.', summary:'Paste a demo receipt or load the sample. This public verifier checks structure, required hashes, and decision state locally in the browser.', body:`
<section class="ua-split"><div><textarea id="receiptInput" aria-label="Mission Receipt JSON" placeholder="Paste Mission Receipt JSON here"></textarea><div class="ua-actions"><button class="ua-cta" id="loadDemo">Load demo receipt</button><button class="ua-ghost" id="verifyReceipt">Verify locally</button></div><div class="ua-result" id="verifyResult">Awaiting receipt.</div></div><div class="ua-console"><ol>${gate('01','Receipt ID','Is the receipt identifiable?')}${gate('02','Decision state','Is the outcome explicit?')}${gate('03','Evidence hashes','Are the accepted artifacts fingerprinted?')}${gate('04','Issuer','Who sealed the receipt?')}${gate('05','Replay path','Can a reviewer inspect the evidence boundary?')}</ol></div></section>`});

shell({file:'deliverables.html', active:'deliverables.html', eyebrow:'WHAT YOU RECEIVE', title:'A proof mission is a package, not a report.', summary:'Each deliverable has a job: make the AI work easier to inspect, defend, accept, revise, or reuse.', body:`
<section class="ua-grid two">${CONFIG.deliverables.map((d,i)=>card(d, [
 'One-page decision summary for executives.', 'Slide-style recommendation package for stakeholders.', 'Claim-evidence-risk proof room.', 'What is claimed, not claimed, and what evidence supports it.', 'Review findings, missing evidence, contradictions, and readiness.', 'Risks, assumptions, reversibility, and unresolved points.', 'Next actions, owners, dependencies, approvals, and rollback notes.', 'Signed record of decision, hashes, reviewer, and accepted version.', 'Durable history of mission, proof, and decision state.', 'Reusable criteria, templates, evidence patterns, and operating lessons.'
][i] || 'Proof mission artifact.')).join('')}</section>`});

shell({file:'how-it-works.html', active:'how-it-works.html', eyebrow:'HOW IT WORKS', title:'Define the work. Collect the evidence. Record the decision.', summary:'The user path translates the proof doctrine into a practical product workflow.', body:`
<section class="ua-console wide"><ol>${stepList}</ol></section><section class="ua-band"><h2>Plain-English loop</h2><p>Mission Contract → Evidence Docket → Verifier Mesh → Governed Decision State → Mission Receipt → Reusable Capability.</p></section><section class="ua-grid three">${card('Define done','Success criteria and failure criteria are written before acceptance.')}${card('Proof before acceptance','Claims must map to evidence before a receipt is sealed.')}${card('Reuse what works','Accepted missions become reusable criteria, templates, and capability packages.')}</section>`});

shell({file:'pricing.html', active:'pricing.html', eyebrow:'PRICING', title:'Simple private-beta pricing.', summary:'Start with proof missions. Keep token mechanics and settlement out of the mainstream buying path until later protocol gates are ready.', body:`
<section class="ua-pricing">${CONFIG.pricing.map((p,i)=>`<article class="${i===1?'featured':''}"><h2>${p.name}</h2><h3>${p.price}</h3><p>${p.description}</p><p><b>Best for:</b> ${p.bestFor}</p><a class="ua-cta" href="${proofMissionMail}">Request access</a></article>`).join('')}</section>`});

const faqs = [
 ['What is GoalOS Signoff Pro?','An acceptance layer for AI-delivered work: mission briefs, evidence, review, human authorization, and signed receipts.'],
 ['Do I need a wallet?','No. The mainstream private-beta path starts with normal web and email flows. Optional verified receipts can come later.'],
 ['What do I send you?','One AI-delivered work package plus the decision it should support and the evidence currently available.'],
 ['What do I receive?','Evidence Docket, verifier report, risk ledger, executive brief, decision deck, action graph, Chronicle entry, capability package, and Mission Receipt.'],
 ['Does GoalOS decide for me?','No. GoalOS prepares the evidence and decision state; a client, reviewer, or designated authority makes the acceptance decision.'],
 ['Is this legal, financial, medical, or security advice?','No. It is an evidence and acceptance workflow. High-stakes domains require qualified human review.']
];
shell({file:'faq.html', active:'faq.html', eyebrow:'FAQ', title:'Questions normal users ask first.', summary:'Clear answers before protocol details.', body:`<section class="ua-faq">${faqs.map(([q,a])=>`<details><summary>${q}</summary><p>${a}</p></details>`).join('')}</section>`});

shell({file:'contact.html', active:'contact.html', eyebrow:'CONTACT', title:'Bring one serious AI delivery into Signoff.', summary:'Use this page to request a private beta conversation or a 48-hour Proof Mission.', body:`
<section class="ua-split"><div class="ua-panel"><h2>Contact</h2><p>Email the GoalOS team with one AI work package and the decision it should support.</p><p><a class="ua-cta" href="${proofMissionMail}">${email}</a></p></div><div class="ua-console"><ol>${gate('01','Name + organization','Who should we contact?')}${gate('02','AI work package','What needs to be accepted or reviewed?')}${gate('03','Decision deadline','When do you need the evidence package?')}${gate('04','Reviewer path','Who should accept, request changes, or reject?')}</ol></div></section>`});

shell({file:'request-access.html', active:'request-access.html', eyebrow:'REQUEST ACCESS', title:'Request a private beta proof mission.', summary:'GitHub Pages is static, so the first request flow opens a prefilled email to info@quebec.ai.', body:`
<section class="ua-split"><div class="ua-panel"><h2>Fields to include</h2>${table([['Field','What to provide'],['Name','Your name'],['Organization','Company, agency, team, grant program, or institution'],['Email','Best contact email'],['Work package','The AI-delivered work to inspect'],['Deadline','When a decision is needed'],['Independent review','Yes, no, or unsure']])}<div class="ua-actions"><a class="ua-cta" href="${proofMissionMail}">Open request email</a></div></div><div class="ua-panel"><h2>Best first fit</h2><p>AI research reports, automation delivery, software feature handoff, vendor review, grant milestones, market-entry decisions, and enterprise AI pilot acceptance.</p></div></section>`});

shell({file:'press.html', active:'press.html', eyebrow:'PRESS KIT', title:'Share the proof-to-acceptance story.', summary:'Public copy, social post text, founder quote, product description, and launch assets.', body:`
<section class="ua-grid two">${card('Product one-liner','GoalOS Signoff Pro is the institutional acceptance layer for AI-delivered work.')}${card('Launch post','The AI era needs proof of work. Define done. Prove delivery. Preserve trust.', `<button class="ua-ghost" data-copy="The AI era needs proof of work.\n\nGoalOS Signoff Pro is the institutional acceptance layer for AI-delivered work: mission briefs, evidence, review, human authorization, and signed receipts.\n\nDefine done. Prove delivery. Preserve trust.\n\nhttps://montrealai.github.io/goalos-signoff-pro/\n\n#MontrealAI">Copy launch post</button>`)}${card('Founder quote','“AI output is abundant. Institutional acceptance is scarce. GoalOS turns output into proof, proof into decisions, and decisions into reusable capability.”')}${card('Public assets','Download the social copy and product descriptions from the repository public/social folder.', `<a class="ua-mini" href="${BASE}social/launch-post.txt">Launch post →</a>`)}</section>`});

shell({file:'glossary.html', active:'resources.html', eyebrow:'GLOSSARY', title:'Proof terms, in normal language.', summary:'A plain-English dictionary for the concepts used across GoalOS Signoff Pro.', body:`<section class="ua-grid two">${Object.entries(CONFIG.glossary).map(([k,v])=>card(k,v)).join('')}</section>`});

shell({file:'executive-architecture.html', active:'resources.html', eyebrow:'EXECUTIVE ARCHITECTURE', title:'AI output is abundant. Institutional acceptance is scarce.', summary:'GoalOS converts output into evidence, evidence into review, review into receipts, and receipts into reusable capability.', body:`
<section class="ua-console wide"><ol>${gate('01','AI output','Models and agents produce reports, workflows, traces, code, and analysis.')}${gate('02','Acceptance gap','Organizations need to know what is supported, risky, incomplete, and accepted.')}${gate('03','Evidence system','GoalOS maps claims to evidence, provenance, risk, and reviewer notes.')}${gate('04','Decision state','The evidence becomes a governed decision state that can be accepted or revised.')}${gate('05','Receipt and reuse','The accepted version becomes a signed record and reusable capability package.')}</ol></section>`});

shell({file:'implementation.html', active:'resources.html', eyebrow:'IMPLEMENTATION MAP', title:'Public claims map to repository code.', summary:'A practical map from website capability to implementation surface in MontrealAI/goalos-signoff-pro.', body:`
<section class="ua-table-wrap">${table([['Capability','Repository evidence','User value'],['Mission briefs','src/app/projects/new, schemas, Supabase migrations','Define done before review'],['Evidence uploads','src/app/api/projects/*/uploads, artifact tables, hash validation','Preserve accepted versions'],['Evidence assistant','src/lib/evidence-assistant*','Find missing criteria and unmapped artifacts'],['Human review','src/app/api/projects/*/reviews, review components','Reviewer recommendation is preserved'],['Final decision','src/app/api/projects/*/decisions, receipt issue path','Client/designated authority remains final gate'],['Signed receipts','src/lib/receipt/*','Tamper-evident acceptance record'],['Receipt verification','src/app/verify and public verification pages','Replay and inspect accepted version'],['Sovereign Machine Economy model','src/lib/sovereign-machine-economy/*','Implementation-backed doctrine']])}</section>`});

shell({file:'trust-architecture.html', active:'resources.html', eyebrow:'TRUST ARCHITECTURE', title:'Trust is designed into the acceptance path.', summary:'Human authority, evidence before acceptance, signed receipts, replayable proof, review trail, change requests, and revocation.', body:`
<section class="ua-grid three">${['Human authority','Evidence before acceptance','Signed receipts','Replayable proof','Private data boundary','Review trail','Change requests','Revocation','Implementation parity'].map((x,i)=>card(x,[
 'The client or designated reviewer remains the acceptance gate.', 'Claims map to evidence before decision state.', 'The accepted version is sealed with hashes and a receipt.', 'Reviewers can inspect the accepted version and evidence boundary.', 'Private files can remain private while public-safe proof is shared.', 'Reviewer notes and recommendations are preserved.', 'A request for changes creates a new version, not silent mutation.', 'A receipt can be marked revoked or superseded.', 'Website claims are checked against implementation evidence.'
][i])).join('')}</section>`});

shell({file:'customers.html', active:'resources.html', eyebrow:'CUSTOMERS', title:'Built for people who accept consequential AI work.', summary:'The first users are consultants, agencies, AI teams, grant programs, reviewers, and executives who need proof before acceptance.', body:`<section class="ua-grid three">${['AI consultants','AI agencies','Enterprise AI teams','Grant programs','Procurement teams','Executives and reviewers'].map((x,i)=>card(x,[
 'Attach a Mission Receipt to client delivery.', 'Create a repeatable acceptance package for every project.', 'Turn pilot output into reviewable decision states.', 'Verify milestone evidence before approval.', 'Separate vendor claims from evidence and risk.', 'Make acceptance decisions without reading every raw trace.'
][i])).join('')}</section>`});

shell({file:'security.html', active:'resources.html', eyebrow:'SECURITY', title:'Security posture for proof missions.', summary:'GoalOS treats evidence, review, identity, privacy, and publication as security-relevant product surfaces.', body:`<section class="ua-grid two">${card('Private files stay controlled','The public pages are static. Sensitive customer materials belong in controlled project storage or private appendices, not public artifacts.')}${card('No secret publication','Quality gates scan generated public artifacts for secret-like values and forbidden files.')}${card('Human review boundary','High-impact, irreversible, regulated, or security-sensitive decisions require designated human review.')}${card('Defensive scope','Security examples are repo-owned, defensive, and review-oriented; no external scanning or unsafe autonomy is part of the public site.')}</section>`});

shell({file:'resources.html', active:'resources.html', eyebrow:'RESOURCES', title:'Everything a user needs next.', summary:'Start, examples, proof mission, Evidence Docket, verifier, glossary, architecture, implementation map, and docs.', body:`<section class="ua-grid three">${[
 ['Start','start.html','Begin with one AI deliverable.'],['Proof Mission','proof-mission.html','Request a 48-hour proof package.'],['Example Docket','evidence-docket-demo.html','Inspect a sample proof room.'],['Verify','verify.html','Check a demo receipt locally.'],['Glossary','glossary.html','Learn the terms.'],['Architecture','executive-architecture.html','Understand the executive logic.'],['Implementation','implementation.html','Map claims to code.'],['Press','press.html','Share launch assets.'],['Roadmap','status.html','See product stage.']].map(([t,f,b])=>card(t,b,`<a class="ua-mini" href="${href(f)}">Open →</a>`)).join('')}</section>`});

shell({file:'status.html', active:'resources.html', eyebrow:'STATUS', title:'Public product status.', summary:'A simple view of what is live, what is private beta, and what comes next.', body:`
<section class="ua-grid three">${stat('LIVE','public website')}${stat('PASS','pages workflow')}${stat('PASS','SME parity')}${stat('BETA','proof missions')}${stat('DEMO','receipt verifier')}${stat('FUTURE','optional protocol rails')}</section>
<section class="ua-panel"><h2>Roadmap</h2>${table(CONFIG.roadmap.map(r=>[r.stage, r.name, r.status]))}</section>`});

shell({file:'changelog.html', active:'resources.html', eyebrow:'CHANGELOG', title:'Product evolution log.', summary:'The public-facing record of the Signoff Pro website and proof mission surface.', body:`
<section class="ua-console"><ol>${gate('v1.0','Signoff Pro repository','Commercial Signoff workflow, receipts, optional verification path.')}${gate('v2.0','Sovereign Machine Economy','Proof OS, AEP-001, machine economy, constitution pages.')}${gate('v3.0','User Activation Layer','Start path, proof mission offer, examples, docket demo, verifier, pricing, docs, press kit, quality gates.')}</ol></section>`});

shell({file:'case-studies.html', active:'resources.html', eyebrow:'CASE STUDIES', title:'Case-study templates are ready for real pilots.', summary:'The site includes public-safe placeholders so the first accepted proof missions can become polished case studies without changing architecture.', body:`<section class="ua-grid three">${['AI research acceptance','Automation delivery signoff','Grant milestone proof','Vendor review','Market-entry decision','Defensive readiness review'].map(x=>card(x,'Template ready. Publish only after customer permission, evidence review, and claim-boundary check.')).join('')}</section>`});

shell({file:'evidence-hub.html', active:'resources.html', eyebrow:'EVIDENCE HUB', title:'A public index for proof artifacts.', summary:'A future home for public-safe Evidence Dockets, receipt manifests, demo runs, and proof mission summaries.', body:`<section class="ua-grid two">${card('Demo Evidence Docket','The first public-safe docket is available now.', `<a class="ua-mini" href="${href('evidence-docket-demo.html')}">Open demo docket →</a>`)}${card('Generated demo artifacts','Use the GitHub Action to generate a public-safe demo proof mission artifact bundle.', `<a class="ua-mini" href="${href('demo-proof-mission/README.md')}">Generated artifact path →</a>`)}${card('Future pilot dockets','Real pilot dockets will appear here after approval and review.')}${card('Evidence standards','Claims, baselines, proof packets, risks, replay path, and receipt state.')}</section>`});

shell({file:'reviewer-network.html', active:'resources.html', eyebrow:'REVIEWER NETWORK', title:'Reviewers turn evidence into accountable decisions.', summary:'The reviewer network page explains roles, expectations, and how review can become more formal over time.', body:`<section class="ua-grid three">${card('Reviewer role','Inspect evidence, identify gaps, preserve dissent, and recommend accept, changes, reject, or escalate.')}${card('Reviewer standards','Separation of claims from evidence, uncertainty disclosure, conflict awareness, and decision trace.')}${card('Future path','Reputation, credentials, optional bonding, and protocol-backed review come later after gates and review.')}</section>`});

shell({file:'capability-library.html', active:'resources.html', eyebrow:'CAPABILITY LIBRARY', title:'Accepted missions become reusable capability.', summary:'Proof missions should not end as PDFs. They should create templates, criteria, evidence patterns, and workflows reusable in future missions.', body:`<section class="ua-grid three">${['Acceptance criteria templates','Evidence mapping patterns','Verifier checklists','Risk ledger patterns','Decision deck outlines','Receipt schemas'].map(x=>card(x,'Reusable artifact generated or refined from accepted proof missions.')).join('')}</section>`});

shell({file:'chronicle.html', active:'resources.html', eyebrow:'CHRONICLE', title:'The mission record becomes institutional memory.', summary:'Chronicle is the durable history of missions, evidence, decisions, receipts, and reusable capability packages.', body:`<section class="ua-console"><ol>${gate('01','Mission opened','Objective, decision, criteria, and boundary recorded.')}${gate('02','Evidence gathered','Claims, sources, files, and risks mapped.')}${gate('03','Review completed','Reviewer notes and decision state preserved.')}${gate('04','Receipt sealed','Accepted version and hash boundary recorded.')}${gate('05','Capability reused','Lessons, templates, and patterns improve the next mission.')}</ol></section>`});

// Add links/activation rail to existing homepage if present.
const home = path.join(SITE,'index.html');
if(fs.existsSync(home)){
  if(!pages.includes('index.html')) pages.unshift('index.html');
  let html = fs.readFileSync(home,'utf8');
  const insert = `<section class="ua-home-conversion" aria-label="Start GoalOS Signoff Pro"><h2>Start with one AI deliverable.</h2><p>I have AI work to approve · I need evidence before accepting it · I want a signed Mission Receipt · I want an independent review.</p><div><a href="${href('proof-mission.html')}">Request a Proof Mission</a><a href="${href('evidence-docket-demo.html')}">See an Example Docket</a><a href="${href('verify.html')}">Verify a Receipt</a></div></section>`;
  if(!html.includes('ua-home-conversion')) html = html.replace('</main>', `${insert}</main>`);
  const asset = `<link rel="stylesheet" href="${BASE}assets/user-activation.css"><script defer src="${BASE}assets/user-activation.js"></script>`;
  if(!html.includes('user-activation.css')) html = html.replace('</head>', `${asset}</head>`);
  if(!html.includes('goalos-activation-rail')) html = html.replace('</body>', `${activationRail()}</body>`);
  fs.writeFileSync(home, html, 'utf8');
}

// CSS/JS
const css = `:root{--bg:#02070a;--panel:rgba(255,255,255,.07);--line:rgba(255,255,255,.14);--mint:#6cf7dc;--cyan:#72e7ff;--gold:#ffe982;--cream:#f7f2e7;--muted:#aebcc8;--violet:#9987ff;--max:1120px;--radius:30px}*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:radial-gradient(circle at 78% 18%,rgba(108,247,220,.18),transparent 28%),radial-gradient(circle at 10% 78%,rgba(135,112,255,.16),transparent 30%),linear-gradient(135deg,#020609,#061518 48%,#03050b);color:var(--cream);font:16px/1.65 Inter,ui-sans-serif,system-ui,-apple-system,Segoe UI,Arial,sans-serif;min-height:100vh;overflow-x:hidden}#uaField{position:fixed;inset:0;z-index:-1;opacity:.43}.ua-nav{height:78px;display:flex;align-items:center;gap:24px;justify-content:space-between;padding:0 clamp(18px,4vw,52px);position:sticky;top:0;z-index:20;background:rgba(1,5,8,.74);backdrop-filter:blur(20px);border-bottom:1px solid rgba(255,255,255,.08)}.ua-brand{display:flex;align-items:center;gap:12px;color:var(--cream);text-decoration:none;min-width:max-content}.ua-brand-mark{display:grid;place-items:center;width:36px;height:36px;border:1px solid rgba(108,247,220,.45);border-radius:13px;color:var(--mint);box-shadow:0 0 28px rgba(108,247,220,.28)}.ua-brand b{display:block;font-size:.8rem;letter-spacing:.17em}.ua-brand small{display:block;color:var(--muted);font-size:.62rem;letter-spacing:.18em}.ua-nav nav{display:flex;gap:8px;align-items:center;overflow:auto}.ua-nav nav a{color:#dce7ee;text-decoration:none;font-weight:850;font-size:.78rem;padding:10px 12px;border-radius:999px;white-space:nowrap}.ua-nav nav a.active,.ua-nav nav a:hover{background:rgba(255,255,255,.10)}.ua-cta,.ua-ghost{display:inline-flex;align-items:center;justify-content:center;border-radius:999px;padding:13px 20px;text-decoration:none;font-weight:900;border:1px solid rgba(255,255,255,.18);cursor:pointer}.ua-cta{background:linear-gradient(135deg,#f8ff9e,#5cf5e3 65%,#73dfff);color:#001112;box-shadow:0 12px 42px rgba(108,247,220,.20)}.ua-cta.small{padding:11px 16px}.ua-ghost{background:rgba(255,255,255,.07);color:var(--cream)}.ua-page{max-width:var(--max);margin:0 auto;padding:96px 22px 120px}.ua-hero{max-width:960px;margin-bottom:72px}.ua-eyebrow{color:var(--mint);letter-spacing:.36em;font-size:.78rem;font-weight:900;text-transform:uppercase}.ua-hero h1{font-size:clamp(3rem,8vw,7.2rem);line-height:.9;letter-spacing:-.078em;margin:10px 0 22px;text-wrap:balance;max-width:980px}.ua-summary{max-width:840px;font-size:clamp(1.08rem,2vw,1.45rem);color:#d5e2ea}.ua-split{display:grid;grid-template-columns:1fr 1fr;gap:28px;align-items:center;margin:40px 0 72px}.ua-actions{display:flex;flex-wrap:wrap;gap:12px;margin-top:26px}.ua-card,.ua-console,.ua-panel,.ua-band,.ua-stack,.ua-pricing article,.ua-home-conversion{background:linear-gradient(180deg,rgba(255,255,255,.075),rgba(255,255,255,.035));border:1px solid rgba(255,255,255,.12);border-radius:var(--radius);padding:28px;box-shadow:inset 0 1px 0 rgba(255,255,255,.10),0 24px 80px rgba(0,0,0,.24)}.ua-card h3,.ua-panel h2,.ua-band h2,.ua-console h2,.ua-home-conversion h2{font-size:clamp(1.45rem,3vw,2.8rem);line-height:1;margin:0 0 12px;letter-spacing:-.06em}.ua-card p,.ua-panel p,.ua-band p,.ua-home-conversion p{color:#c5d1dd}.ua-grid{display:grid;gap:18px;margin:28px 0}.ua-grid.two{grid-template-columns:repeat(2,minmax(0,1fr))}.ua-grid.three{grid-template-columns:repeat(3,minmax(0,1fr))}.ua-grid.four{grid-template-columns:repeat(4,minmax(0,1fr))}.ua-console ol,.ua-stack{list-style:none;margin:0;padding:0}.ua-console li,.ua-stack span{display:grid;grid-template-columns:44px 1fr;gap:12px;align-items:start;border:1px solid rgba(108,247,220,.25);border-radius:18px;padding:18px;margin:0 0 12px;background:rgba(108,247,220,.055)}.ua-console li span,.ua-stack b{color:var(--gold);font-weight:900}.ua-console li b{display:block}.ua-console li small{color:#b8c8d7}.ua-stat{padding:22px;border:1px solid rgba(255,255,255,.13);border-radius:18px;background:rgba(255,255,255,.05)}.ua-stat b{display:block;color:var(--gold);font-size:2.4rem;line-height:1}.ua-stat span{display:block;letter-spacing:.16em;text-transform:uppercase;font-size:.72rem;color:#c9d5df;font-weight:900}.ua-band{margin:70px 0;text-align:center}.ua-mini{color:var(--mint);font-weight:900;text-decoration:none}.ua-json,textarea{width:100%;min-height:360px;background:#03070b;color:#d7ffee;border:1px solid rgba(108,247,220,.22);border-radius:20px;padding:18px;overflow:auto;white-space:pre-wrap}.ua-tabs{margin:60px 0}.ua-tab-buttons{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px}.ua-tab-buttons button{border:1px solid rgba(255,255,255,.13);background:rgba(255,255,255,.07);color:#fff;border-radius:999px;padding:10px 14px;font-weight:900}.ua-tab-buttons button.active{background:var(--mint);color:#001112}.ua-tab-panels article{display:none}.ua-tab-panels article.active{display:block;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);border-radius:24px;padding:24px}.ua-table{border:1px solid rgba(255,255,255,.12);border-radius:20px;overflow:hidden}.ua-table div{display:grid;grid-template-columns:1fr 1.4fr 1fr}.ua-table div:first-child{background:rgba(108,247,220,.10);font-weight:900}.ua-table span{padding:14px;border-bottom:1px solid rgba(255,255,255,.10);color:#d6e1ea}.ua-pricing{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px}.ua-pricing h2{font-size:2.5rem;letter-spacing:-.07em}.ua-pricing .featured{outline:2px solid rgba(108,247,220,.45)}.ua-faq details{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);border-radius:20px;padding:20px;margin:12px 0}.ua-faq summary{font-weight:900;font-size:1.2rem;cursor:pointer}.ua-result{margin-top:14px;padding:18px;border-radius:18px;background:rgba(108,247,220,.08);border:1px solid rgba(108,247,220,.25)}.wide{max-width:900px;margin:auto}.goalos-activation-rail{position:fixed;left:50%;bottom:22px;transform:translateX(-50%);z-index:50;display:flex;gap:10px;flex-wrap:wrap;justify-content:center;background:rgba(1,6,10,.74);backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,.13);border-radius:999px;padding:10px;box-shadow:0 20px 80px rgba(0,0,0,.35)}.goalos-activation-rail a{color:#001112;background:linear-gradient(135deg,#f8ff9e,#70f9e4);padding:10px 14px;border-radius:999px;font-weight:900;text-decoration:none;font-size:.78rem}.ua-home-conversion{max-width:1000px;margin:80px auto 40px}.ua-home-conversion div{display:flex;gap:12px;flex-wrap:wrap}.ua-home-conversion a{color:#001112;background:linear-gradient(135deg,#f8ff9e,#70f9e4);padding:12px 16px;border-radius:999px;font-weight:900;text-decoration:none}.ua-footer{display:flex;gap:18px;align-items:center;justify-content:center;flex-wrap:wrap;padding:26px;color:#b7c3cf;border-top:1px solid rgba(255,255,255,.09);background:#02060a}.ua-footer a{color:var(--mint);text-decoration:none}@media(max-width:960px){.ua-split,.ua-grid.two,.ua-grid.three,.ua-grid.four,.ua-pricing{grid-template-columns:1fr}.ua-nav{height:auto;padding:16px;align-items:flex-start;flex-wrap:wrap}.ua-nav nav{max-width:100%;order:3;width:100%}.ua-hero h1{font-size:clamp(3rem,14vw,5.4rem)}.goalos-activation-rail{position:static;transform:none;border-radius:22px;margin:20px}.ua-table div{grid-template-columns:1fr}.ua-page{padding-top:56px}}`;
fs.writeFileSync(path.join(SITE,'assets/user-activation.css'), css, 'utf8');

const js = `(function(){
const c=document.getElementById('uaField'); if(c){const ctx=c.getContext('2d');let w,h,pts=[];function resize(){w=c.width=innerWidth;h=c.height=innerHeight;pts=Array.from({length:Math.min(100,Math.floor(w*h/17000))},()=>({x:Math.random()*w,y:Math.random()*h,vx:(Math.random()-.5)*.34,vy:(Math.random()-.5)*.34,r:Math.random()*1.8+.4}));}resize();addEventListener('resize',resize);function draw(){ctx.clearRect(0,0,w,h);for(const p of pts){p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>w)p.vx*=-1;if(p.y<0||p.y>h)p.vy*=-1;ctx.fillStyle='rgba(108,247,220,.82)';ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill();}ctx.strokeStyle='rgba(108,247,220,.13)';for(let i=0;i<pts.length;i++)for(let j=i+1;j<pts.length;j++){const a=pts[i],b=pts[j],d=Math.hypot(a.x-b.x,a.y-b.y);if(d<130){ctx.globalAlpha=1-d/130;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();ctx.globalAlpha=1;}}requestAnimationFrame(draw);}draw();}
document.querySelectorAll('[data-tabs]').forEach(t=>{const bs=[...t.querySelectorAll('.ua-tab-buttons button')],ps=[...t.querySelectorAll('.ua-tab-panels article')];function show(i){bs.forEach((b,k)=>b.classList.toggle('active',k===i));ps.forEach((p,k)=>p.classList.toggle('active',k===i));}bs.forEach((b,i)=>b.addEventListener('click',()=>show(i)));show(0);});
document.querySelectorAll('[data-copy]').forEach(b=>b.addEventListener('click',()=>navigator.clipboard?.writeText(b.getAttribute('data-copy')).then(()=>{b.textContent='Copied'})));
const demo={publicId:'GS-DEMO-RESEARCH-001',title:'AI Research Report Acceptance Demo',decision:'REQUEST_CHANGES_READY_FOR_REVIEW',issuer:'GoalOS Signoff Pro Demo',issuedAt:'2026-06-27T00:00:00Z',hashes:{missionContract:'sha256:8fd4-demo',claimsMatrix:'sha256:1ac9-demo',evidencePackage:'sha256:72ce-demo',receipt:'sha256:9821-demo'}};
const input=document.getElementById('receiptInput'), result=document.getElementById('verifyResult');document.getElementById('loadDemo')?.addEventListener('click',()=>{input.value=JSON.stringify(demo,null,2);result.textContent='Demo loaded. Click Verify locally.'});document.getElementById('verifyReceipt')?.addEventListener('click',()=>{try{const o=JSON.parse(input.value);const missing=['publicId','title','decision','hashes'].filter(k=>!o[k]);if(missing.length)throw new Error('Missing: '+missing.join(', '));const hashOk=Object.values(o.hashes||{}).every(v=>String(v).startsWith('sha256:'));result.innerHTML=hashOk?'<b>Receipt structure valid.</b><br>Decision state: '+String(o.decision)+'<br>Issuer: '+String(o.issuer||'not supplied'):'<b>Receipt parsed, but hash format needs review.</b>';}catch(e){result.textContent='Could not verify: '+e.message;}});
})();`;
fs.writeFileSync(path.join(SITE,'assets/user-activation.js'), js, 'utf8');

// Social assets in site and repo-facing public/social.
const social = {
  'launch-post.txt': `The AI era needs proof of work.\n\nGoalOS Signoff Pro is the institutional acceptance layer for AI-delivered work: mission briefs, evidence, review, human authorization, and signed receipts.\n\nDefine done. Prove delivery. Preserve trust.\n\nhttps://montrealai.github.io/goalos-signoff-pro/\n\n#MontrealAI\n`,
  'product-one-liner.txt': 'GoalOS Signoff Pro is the institutional acceptance layer for AI-delivered work.\n',
  'founder-quote.txt': 'AI output is abundant. Institutional acceptance is scarce. GoalOS turns output into proof, proof into decisions, and decisions into reusable capability.\n',
  'description-short.txt': 'GoalOS Signoff Pro helps teams define done, bind evidence, review AI-delivered work, and issue signed Mission Receipts.\n',
  'description-long.txt': 'GoalOS Signoff Pro is a proof-to-acceptance product for AI-delivered work. It turns a mission brief, acceptance criteria, evidence, review, risk, and human authorization into a signed Mission Receipt and reusable capability package.\n'
};
for (const [name, content] of Object.entries(social)) fs.writeFileSync(path.join(SITE,'social',name), content, 'utf8');
fs.writeFileSync(path.join(SITE,'social/logo-card.svg'), `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><rect width="1200" height="630" fill="#02070a"/><defs><radialGradient id="g" cx="50%" cy="50%"><stop offset="0" stop-color="#6cf7dc"/><stop offset="1" stop-color="#02070a"/></radialGradient></defs><circle cx="600" cy="250" r="150" fill="url(#g)" opacity=".8"/><text x="80" y="160" fill="#f7f2e7" font-family="Arial" font-size="82" font-weight="800">GoalOS Signoff Pro</text><text x="80" y="255" fill="#6cf7dc" font-family="Arial" font-size="40" font-weight="700">Define done. Prove delivery. Preserve trust.</text><text x="80" y="560" fill="#ffe982" font-family="Arial" font-size="28">montrealai.github.io/goalos-signoff-pro/</text></svg>`, 'utf8');

// Copy repo public/social if present.
const repoSocial = path.join(ROOT,'public/social');
if (fs.existsSync(repoSocial)) {
  for (const f of fs.readdirSync(repoSocial)) {
    const p = path.join(repoSocial,f);
    if (fs.statSync(p).isFile()) fs.copyFileSync(p, path.join(SITE,'social',f));
  }
}

// Copy public-safe example proof missions into the Pages artifact so links work.
function copyDir(src, dst){
  if(!fs.existsSync(src)) return;
  fs.mkdirSync(dst,{recursive:true});
  for(const e of fs.readdirSync(src,{withFileTypes:true})){
    const sp=path.join(src,e.name), dp=path.join(dst,e.name);
    if(e.isDirectory()) copyDir(sp,dp); else fs.copyFileSync(sp,dp);
  }
}
copyDir(path.join(ROOT,'examples/proof-missions'), path.join(SITE,'examples/proof-missions'));
// Add a static demo Proof Mission bundle for the Evidence Hub.
const demoOut = path.join(SITE,'demo-proof-mission');
fs.mkdirSync(demoOut,{recursive:true});
const demoReceipt = {publicId:'GS-DEMO-RESEARCH-001', title:'AI Research Report Acceptance Demo', issuer:'GoalOS Signoff Pro Demo', decision:'REQUEST_CHANGES_READY_FOR_REVIEW', hashes:{missionContract:'sha256:8fd4-demo', claimsMatrix:'sha256:1ac9-demo', evidencePackage:'sha256:72ce-demo', receipt:'sha256:9821-demo'}};
fs.writeFileSync(path.join(demoOut,'mission-receipt.json'), JSON.stringify(demoReceipt,null,2));
fs.writeFileSync(path.join(demoOut,'README.md'), '# Demo Proof Mission\n\nPublic-safe demo artifacts for GoalOS Signoff Pro.\n\n- mission-receipt.json\n- evidence-docket-demo.html\n\nContact: info@quebec.ai\n');
fs.writeFileSync(path.join(demoOut,'public-report.html'), '<!doctype html><html><head><meta charset="utf-8"><title>Demo Proof Mission</title></head><body><h1>Demo Proof Mission</h1><p>Receipt: GS-DEMO-RESEARCH-001</p></body></html>');

function walk(dir, acc=[]){ for(const e of fs.readdirSync(dir,{withFileTypes:true})){ const p=path.join(dir,e.name); if(e.isDirectory()) walk(p,acc); else acc.push(p);} return acc; }
const files = walk(SITE);
const manifest = {
  version:'2.0.0-complete',
  generatedAt:new Date().toISOString(),
  contactEmail:email,
  productionUrl:CONFIG.productionUrl,
  pages,
  sha256:Object.fromEntries(files.map(f=>[path.relative(SITE,f).replaceAll('\\','/'), crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex')]))
};
fs.writeFileSync(path.join(SITE,'user-activation-manifest.json'), JSON.stringify(manifest,null,2),'utf8');
console.log(`GoalOS User Activation Layer generated ${pages.length} pages`);
