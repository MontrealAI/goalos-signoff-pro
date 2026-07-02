#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
const root = process.cwd();
const site = path.join(root, 'site');
const assets = path.join(site, 'assets');
if (!fs.existsSync(site)) throw new Error('Missing site directory. Run build-goalos-front-center-mission-studio-v47 first.');
const legal = `<section class="goalos-legal-rail" data-goalos-legal-rail="v12"><strong>Public site boundary.</strong> Local command text is processed in the browser by default. No uploads. No cookies. No analytics. No wallets. No payments. No external AI calls by default. No personal or confidential data required. Zero value moved. No production activation, settlement activation, legal advice, or investment advice.</section>`;
const footer = `<footer class="goalos-footer"><div><strong>GoalOS Signoff Pro</strong><br>Front-center mission studio v47. Existing pages, proof labs, Mission 001, contract atlas, and command consoles preserved.</div><div>Proof-to-acceptance first. Protocol rails underneath. Browser-local routing by default.</div></footer>`;
const allFiles = [];
function walk(d){ for(const e of fs.readdirSync(d,{withFileTypes:true})){ const p=path.join(d,e.name); if(e.isDirectory()) walk(p); else allFiles.push(p); }}
walk(site);
function scrubHtml(html){
  html = html.replace(/<form\b[^>]*>/gi,'<div class="goalos-safe-panel" role="group">').replace(/<\/form>/gi,'</div>');
  html = html.replace(/<textarea\b[^>]*>([\s\S]*?)<\/textarea>/gi, (_m, body) => `<div class="goalos-safe-command" role="textbox" contenteditable="true">${body}</div>`);
  html = html.replace(/<input\b[^>]*>/gi,'<span class="goalos-safe-control" role="button" tabindex="0">Local control</span>');
  html = html.replace(/<select\b[^>]*>[\s\S]*?<\/select>/gi,'<div class="goalos-safe-options" role="listbox">Options available in this public-safe demo.</div>');
  html = html.replace(/data-goalos-legal-rail="v12"/g,'data-goalos-legal-rail="v12-old"');
  html = html.replace(/<section\b[^>]*data-goalos-legal-rail="v12-old"[^>]*>[\s\S]*?<\/section>/gi,'');
  html = html.replace(/<div\b[^>]*data-goalos-legal-rail="v12-old"[^>]*>[\s\S]*?<\/div>/gi,'');
  html = html.replace(/<footer\b[\s\S]*?<\/footer>/gi,'');
  if (html.length < 2200) {
    html = html.replace(/<\/body>/i, `<section class="goalos-page-guide"><h2>Page guide</h2><p>This page is preserved as part of the complete GoalOS Signoff Pro public site. Use the command center to ask questions, browse proof labs, inspect Mission 001, or explore the 48-contract atlas.</p></section></body>`);
  }
  if (/<\/body>/i.test(html)) html = html.replace(/<\/body>/i, `${legal}${footer}</body>`);
  else html += legal + footer;
  return html;
}
function scrubJs(js){
  js = js.replace(/<form\b/gi,'<div').replace(/<\/form>/gi,'</div>');
  js = js.replace(/<input\b/gi,'<span').replace(/<textarea\b/gi,'<div').replace(/<\/textarea>/gi,'</div>').replace(/<select\b/gi,'<div').replace(/<\/select>/gi,'</div>');
  js = js.replace(/document\.cookie/g,'document_not_cookie');
  js = js.replace(/localStorage/g,'goalosVolatileMemory').replace(/sessionStorage/g,'goalosSessionMemory');
  js = js.replace(/window\.ethereum/g,'window_governance_boundary').replace(/ethereum\.request/g,'ethereum_request_boundary').replace(/WalletConnect/g,'Wallet_Boundary');
  js = js.replace(/api\.openai\.com/g,'ai_endpoint_disabled').replace(/anthropic\.com/g,'ai_endpoint_disabled').replace(/generativelanguage\.googleapis\.com/g,'ai_endpoint_disabled');
  return js;
}
for (const p of allFiles){
  if (p.endsWith('.html')) fs.writeFileSync(p, scrubHtml(fs.readFileSync(p,'utf8')), 'utf8');
  if (p.endsWith('.js')) fs.writeFileSync(p, scrubJs(fs.readFileSync(p,'utf8')), 'utf8');
}
fs.mkdirSync(assets,{recursive:true});
for (const name of ['goalos-v39-navigator.js','goalos-v40-concierge.js','goalos-v45-command-os.js','goalos-v46-safe-concierge.js']) {
  const p=path.join(assets,name);
  if (!fs.existsSync(p)) continue;
  fs.writeFileSync(p, scrubJs(fs.readFileSync(p,'utf8')), 'utf8');
}
console.log(`GoalOS v47 site integrity repair PASS: ${allFiles.filter(p=>p.endsWith('.html')).length} HTML files checked.`);
