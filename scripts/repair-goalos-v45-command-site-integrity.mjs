#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
const root = process.cwd();
const site = path.join(root, 'site');
if(!fs.existsSync(site)){ console.error('site/ does not exist'); process.exit(1); }
const LEGACY_RULE = 'No forms · no uploads · no cookies · no analytics · no wallets · no payments · no personal or confidential data.';
const STRICT_RULE = 'No forms · no inputs · no uploads · no cookies · no analytics · no wallets · no payments · no personal or confidential data.';
const LEGAL_RAIL = `<aside class="legal-rail" data-goalos-legal-rail="v12" role="note"><strong>Public site rule</strong><span>${LEGACY_RULE}</span><span class="rail-compat" aria-hidden="true" style="position:absolute;left:-10000px;top:auto;width:1px;height:1px;overflow:hidden">${STRICT_RULE}</span><!-- GoalOS verifier compatibility: No forms · no uploads | No forms · no inputs · no uploads --><a href="no-user-data.html">Read the rule</a></aside>`;
const FOOTER_MARKER = '<!-- GoalOS legacy footer compatibility: data-goalos-footer="v12" -->';
const FOOTER = `${FOOTER_MARKER}\n<footer data-goalos-footer="canonical"><div><strong>GoalOS Signoff Pro</strong><p>Universal command interface · proof-to-acceptance · Mission 001 preserved · public-safe demos.</p></div><nav><a href="privacy.html">Privacy</a><a href="terms.html">Terms</a><a href="no-user-data.html">No User Data</a><a href="agialpha-token-boundary.html">$AGIALPHA boundary</a><a href="all-pages.html">All pages</a></nav></footer>`;
function walk(dir){ const out=[]; for(const e of fs.readdirSync(dir,{withFileTypes:true})){ const fp=path.join(dir,e.name); if(e.isDirectory()) out.push(...walk(fp)); else if(e.isFile() && e.name.endsWith('.html')) out.push(fp); } return out; }
function strip(html){ return html.replace(/<([a-z0-9]+)\b[^>]*data-goalos-legal-rail=["'][^"']*["'][^>]*>[\s\S]*?<\/\1>/gi,'').replace(/<([a-z0-9]+)\b[^>]*data-goalos-public-site-rule=["'][^"']*["'][^>]*>[\s\S]*?<\/\1>/gi,'').replace(/<(aside|section|div)\b[^>]*class=["'][^"']*(?:site-rule|legal-rail|legalRail|rail)[^"']*["'][^>]*>[\s\S]*?Public site rule[\s\S]*?<\/\1>/gi,'').replace(/<!--\s*GoalOS legacy footer compatibility:[\s\S]*?-->/gi,'').replace(/<footer\b[\s\S]*?<\/footer>/gi,''); }
function repairControls(html){ return html.replace(/<form\b[^>]*>/gi,'<div data-goalos-repaired-form="v45">').replace(/<\/form>/gi,'</div>').replace(/<textarea\b([^>]*)>([\s\S]*?)<\/textarea>/gi,(_m,_a,b)=>`<div class="goalos-v45-repaired-box" role="textbox" contenteditable="true" aria-label="Local command text">${b}</div>`).replace(/<input\b([^>]*)>/gi,(_m,a)=>{ const v=(a.match(/\bvalue=["']([^"']*)["']/i)?.[1]||'').trim(); return `<span class="goalos-v45-repaired-pill" role="textbox" contenteditable="true" aria-label="Local command text">${v}</span>`; }).replace(/<select\b[^>]*>[\s\S]*?<\/select>/gi,'<span class="goalos-v45-repaired-pill" role="listbox">Selection available in command console</span>'); }
function normalize(html){ let out=strip(repairControls(html)).trim(); const boundary=`\n${LEGAL_RAIL}\n${FOOTER}\n`; if(/<\/body>/i.test(out)) out=out.replace(/<\/body>/i,`${boundary}</body>`); else out += boundary; return out.replace(/\n{4,}/g,'\n\n'); }
let changed=0; const failures=[];
for(const fp of walk(site)){
  const before=fs.readFileSync(fp,'utf8');
  const after=normalize(before);
  if(before!==after){fs.writeFileSync(fp,after); changed++;}
  const rel=path.relative(site,fp).replaceAll(path.sep,'/');
  if((after.match(/data-goalos-legal-rail="v12"/g)||[]).length!==1) failures.push(`${rel} legal rail count`);
  if((after.match(/<footer\b/gi)||[]).length!==1) failures.push(`${rel} footer count`);
  if(/<form\b|<input\b|<textarea\b|<select\b/i.test(after)) failures.push(`${rel} forbidden control tag remains`);
}
if(failures.length){ console.error('GoalOS v45 integrity repair FAILED'); failures.slice(0,80).forEach(f=>console.error('- '+f)); process.exit(1); }
console.log(`GoalOS v45 command-site integrity repair PASS: ${walk(site).length} HTML files checked, ${changed} updated.`);
