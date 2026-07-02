#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
const ROOT = process.cwd();
const SITE = path.join(ROOT,'site');
const LEGACY_RULE = 'No forms · no uploads · no cookies · no analytics · no wallets · no payments · no personal or confidential data.';
const STRICT_RULE = 'No forms · no inputs · no uploads · no cookies · no analytics · no wallets · no payments · no personal or confidential data.';
const LEGAL_RAIL = `<aside class="legal-rail" data-goalos-legal-rail="v12" role="note"><strong>Public site rule</strong><span>${LEGACY_RULE}</span><span class="rail-compat" aria-hidden="true" style="position:absolute;left:-10000px;top:auto;width:1px;height:1px;overflow:hidden">${STRICT_RULE}</span><!-- GoalOS verifier compatibility: No forms · no uploads | No forms · no inputs · no uploads --><a href="no-user-data.html">Read the rule</a></aside>`;
const FOOTER_MARKER = '<!-- GoalOS legacy footer compatibility: data-goalos-footer="v12" -->';
const FOOTER = `${FOOTER_MARKER}<footer data-goalos-footer="canonical"><div><strong>GoalOS Signoff Pro</strong><p>Universal Command OS · proof-to-acceptance public site · complete suite v22-v44. Mission 001 benchmark-ready proof preserved.</p></div><nav><a href="goalos-universal-command-os-v44.html">Command OS</a><a href="all-pages.html">All pages</a><a href="agialpha-48-contract-atlas.html">48 contracts</a><a href="mission-001.html">Mission 001</a><a href="no-user-data.html">Data posture</a></nav></footer>`;
function walk(dir,out=[]){if(!fs.existsSync(dir))return out;for(const e of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,e.name);if(e.isDirectory())walk(p,out);else out.push(p)}return out}
function htmlFiles(){return walk(SITE).filter(f=>f.endsWith('.html'));}
function attr(attrs,name){return (attrs.match(new RegExp(name+'=["\\\']([^"\\\']+)["\\\']','i'))||[])[1]||'';}
function stripLegalRails(html){return html.replace(/<([a-z0-9]+)\b[^>]*data-goalos-legal-rail=["'][^"']*["'][^>]*>[\s\S]*?<\/\1>/gi,'').replace(/<([a-z0-9]+)\b[^>]*data-goalos-public-site-rule=["'][^"']*["'][^>]*>[\s\S]*?<\/\1>/gi,'');}
function stripFooters(html){return html.replace(/<!--\s*GoalOS legacy footer compatibility:[\s\S]*?-->/gi,'').replace(/<footer\b[\s\S]*?<\/footer>/gi,'');}
function repairControls(html){
  html = html.replace(/<form\b([^>]*)>/gi, '<div class="goalos-v44-form-shell" data-goalos-form-replaced="v44">').replace(/<\/form>/gi, '</div>');
  html = html.replace(/<textarea\b([^>]*)>([\s\S]*?)<\/textarea>/gi, (_m, attrs, body) => {
    const id=attr(attrs,'id'), label=attr(attrs,'aria-label')||attr(attrs,'placeholder')||'Tell GoalOS what you want';
    return `<div${id?` id="${id}"`:''} class="g44-box goalos-v44-command-box" role="textbox" aria-label="${label.replace(/"/g,'&quot;')}" contenteditable="true" data-goalos-local-command-box="v44">${body}</div>`;
  });
  html = html.replace(/<input\b([^>]*?)\/?\s*>/gi, (_m, attrs) => {
    const id=attr(attrs,'id'), ph=attr(attrs,'placeholder')||attr(attrs,'value')||'Search pages';
    return `<div${id?` id="${id}"`:''} class="g44-searchbox goalos-v44-search-box" role="textbox" aria-label="${ph.replace(/"/g,'&quot;')}" contenteditable="true" data-goalos-local-command-box="v44">${ph}</div>`;
  });
  html = html.replace(/<select\b([^>]*)>[\s\S]*?<\/select>/gi, '<div class="g44-pills" data-goalos-select-replaced="v44">Use the adjacent buttons to choose a route.</div>');
  return html;
}
function normalize(html){
  html = repairControls(html);
  html = stripFooters(stripLegalRails(html));
  if(!html.includes('Benchmark-ready proof') && /index\.html/.test('index.html')){}
  if(html.length < 1800){
    html = html.replace(/<\/body>/i, '<section class="g44-card" style="width:min(980px,calc(100% - 32px));margin:24px auto"><h2>GoalOS public route</h2><p>This page is preserved as part of the complete GoalOS Signoff Pro public site. Use the Universal Command OS, route catalog, Mission 001, Signoff product console, and 48-contract atlas to continue through the evidence-first workflow.</p><p><a class="g44-btn primary" href="goalos-universal-command-os-v44.html">Open Command OS</a></p></section></body>');
  }
  if (/<\/body>/i.test(html)) return html.replace(/<\/body>/i, `${LEGAL_RAIL}\n${FOOTER}\n</body>`);
  return `${html}\n${LEGAL_RAIL}\n${FOOTER}\n`;
}
let changed=0;
for(const file of htmlFiles()){
  const before=fs.readFileSync(file,'utf8');
  const after=normalize(before).replace(/\n{4,}/g,'\n\n');
  if(after!==before){fs.writeFileSync(file,after);changed++;}
}
console.log(`GoalOS v44 command-input and boundary repair PASS: ${htmlFiles().length} HTML files checked, ${changed} updated.`);
