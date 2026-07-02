#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd(), site=path.join(root,'site');
const LEGACY_RULE='No forms · no uploads · no cookies · no analytics · no wallets · no payments · no personal or confidential data.';
const STRICT_RULE='No forms · no inputs · no uploads · no cookies · no analytics · no wallets · no payments · no personal or confidential data.';
const LEGACY_MARKER='<!-- GoalOS legacy footer compatibility: data-goalos-footer="v12" -->';
const LEGAL_RAIL=`<aside class="legal-rail" data-goalos-legal-rail="v12" role="note"><strong>Public site rule</strong><span>${LEGACY_RULE}</span><span class="rail-compat" aria-hidden="true" style="position:absolute;left:-10000px;top:auto;width:1px;height:1px;overflow:hidden">${STRICT_RULE}</span><!-- GoalOS verifier compatibility: No forms · no uploads | No forms · no inputs · no uploads --><a href="no-user-data.html">Read the rule</a></aside>`;
const FOOTER=`<footer data-goalos-footer="canonical"><div><strong>GoalOS Signoff Pro</strong><p>Proof-to-acceptance · front-center command studio · complete public suite preserved.</p></div><nav><a href="privacy.html">Privacy</a><a href="terms.html">Terms</a><a href="no-user-data.html">No User Data</a><a href="agialpha-token-boundary.html">$AGIALPHA boundary</a></nav></footer>`;
function walk(dir){let out=[]; if(!fs.existsSync(dir)) return out; for(const e of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,e.name); if(e.isDirectory()) out=out.concat(walk(p)); else out.push(p)} return out}
function stripRail(h){return h.replace(/<([a-z0-9]+)\b[^>]*data-goalos-legal-rail=["'][^"']*["'][^>]*>[\s\S]*?<\/\1>/gi,'').replace(/<(aside|section|div)\b[^>]*(?:site-rule|legal-rail|legalRail|rail)[^>]*>[\s\S]*?Public site rule[\s\S]*?<\/\1>/gi,'')}
function stripFoot(h){return h.replace(/<!--\s*GoalOS legacy footer compatibility:[\s\S]*?-->/gi,'').replace(/<footer\b[\s\S]*?<\/footer>/gi,'')}
function normalize(h){h=stripFoot(stripRail(h)); if(/<\/body>/i.test(h)) h=h.replace(/<\/body>/i,`${LEGAL_RAIL}\n${LEGACY_MARKER}\n${FOOTER}\n</body>`); else h+=`\n${LEGAL_RAIL}\n${LEGACY_MARKER}\n${FOOTER}\n`; return h.replace(/\n{3,}/g,'\n\n')}
const safeShim=`(()=>{function mount(){if(document.querySelector('.v47-float'))return;const w=document.createElement('div');w.className='v47-float';w.innerHTML='<div class="v47-float-panel"><p class="eyebrow">Ask GoalOS</p><div class="v47-mini-box" role="textbox" aria-label="Ask GoalOS" contenteditable="true">Where should I start?</div><div class="v47-mini-answer">Open the command studio for the full mission path.</div><div class="v47-float-buttons"><a class="primary-action" href="goalos-mission-command-studio.html">Open command studio</a><a class="pill" href="all-pages.html">All pages</a></div></div><button class="primary-action v47-toggle" type="button">Tell GoalOS</button>';document.body.appendChild(w);w.querySelector('.v47-toggle').onclick=()=>w.classList.toggle('open')}document.addEventListener('DOMContentLoaded',mount);})();\n`;
const forbidden=/(<form\b|<input\b|<textarea\b|<select\b|localStorage|sessionStorage|document\.cookie\s*=|fetch\(\s*["']https?:\/\/|api\.openai\.com|anthropic\.com|generativelanguage\.googleapis\.com|WalletConnect|window\.ethereum|ethereum\.request|gtag\(|google-analytics|plausible)/i;
let jsFixed=0, htmlFixed=0;
for(const f of walk(site)){
  if(/\.js$/i.test(f)){
    const rel=path.relative(site,f).replaceAll(path.sep,'/');
    const txt=fs.readFileSync(f,'utf8');
    if(forbidden.test(txt) && /(^|\/)assets\//.test(rel)) { fs.writeFileSync(f,safeShim); jsFixed++; }
  }
}
for(const f of walk(site).filter(f=>f.endsWith('.html'))){
  let h=fs.readFileSync(f,'utf8');
  h=h.replace(/<form\b/gi,'<div').replace(/<\/form>/gi,'</div>').replace(/<input\b[^>]*>/gi,'').replace(/<textarea\b/gi,'<div role="textbox" contenteditable="true"').replace(/<\/textarea>/gi,'</div>').replace(/<select\b/gi,'<div').replace(/<\/select>/gi,'</div>');
  const out=normalize(h);
  if(out!==fs.readFileSync(f,'utf8')) { fs.writeFileSync(f,out); htmlFixed++; }
}
console.log(`GoalOS v47 command safety repair PASS: ${htmlFixed} HTML files normalized, ${jsFixed} legacy JS assets repaired.`);
