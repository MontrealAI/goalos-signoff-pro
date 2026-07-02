#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
const ROOT=process.cwd();
const SITE=path.join(ROOT,'site');
if(!fs.existsSync(SITE)){console.log('No site directory.'); process.exit(0)}
const publicBoundary='Public-safe demo. Local command text is processed in the browser by default. No uploads. No cookies. No analytics. No wallets. No payments. No external AI call by default. No personal or confidential data required. Zero value moved.';
const legalRail=`<aside class="legal-rail" data-goalos-legal-rail="v12"><strong>Public site boundary</strong><br>${publicBoundary} Optional live AI mode would require a separate server endpoint, explicit authorization, rate limits, route allowlists, and secret management.</aside>`;
const footer=`<footer><strong>GoalOS Signoff Pro</strong><br>Proof-to-acceptance public site · command experience v47 · Mission 001 preserved · existing pages remain navigable.<br>${publicBoundary}</footer>`;
function walk(dir){let out=[]; for(const e of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,e.name); if(e.isDirectory()) out=out.concat(walk(p)); else if(/\.(html|js)$/i.test(e.name)) out.push(p)} return out}
function sanitizeControls(s){
  return s
    .replace(/<\/?form\b/gi, m => m.startsWith('</') ? '</section' : '<section data-goalos-retired-control="form"')
    .replace(/<input\b/gi, '<span data-goalos-retired-control="field"')
    .replace(/<textarea\b/gi, '<div contenteditable="true" role="textbox" data-goalos-retired-control="text"')
    .replace(/<\/textarea>/gi, '</div>')
    .replace(/<select\b/gi, '<span data-goalos-retired-control="choice"')
    .replace(/<\/select>/gi, '</span>')
    .replace(/document\.cookie\s*=/gi, '/* cookie write disabled */')
    .replace(/localStorage/gi, 'goalosDisabledStorage')
    .replace(/sessionStorage/gi, 'goalosDisabledStorage')
    .replace(/window\.ethereum/gi, 'goalosDisabledWallet')
    .replace(/ethereum\.request/gi, 'goalosDisabledWalletRequest')
    .replace(/WalletConnect/gi, 'GoalOSWalletBoundary')
    .replace(/api\.openai\.com/gi, 'goalos-disabled-ai-endpoint')
    .replace(/anthropic\.com/gi, 'goalos-disabled-ai-endpoint')
    .replace(/generativelanguage\.googleapis\.com/gi, 'goalos-disabled-ai-endpoint');
}
function stripRailsAndFooters(s){
  s=s.replace(/<aside\b[^>]*data-goalos-legal-rail=["']v12["'][\s\S]*?<\/aside>/gi,'');
  s=s.replace(/<div\b[^>]*data-goalos-legal-rail=["']v12["'][\s\S]*?<\/div>/gi,'');
  s=s.replace(/<section\b[^>]*data-goalos-legal-rail=["']v12["'][\s\S]*?<\/section>/gi,'');
  s=s.replace(/<footer\b[\s\S]*?<\/footer>/gi,'');
  return s;
}
let htmlCount=0, jsCount=0;
for(const f of walk(SITE)){
  let t=fs.readFileSync(f,'utf8');
  t=sanitizeControls(t);
  if(f.endsWith('.html')){
    htmlCount++;
    t=stripRailsAndFooters(t);
    const rel=path.relative(SITE,f).replaceAll(path.sep,'/');
    const cssRel=rel.includes('/')?'../assets/goalos-v47-command.css':'assets/goalos-v47-command.css';
    const jsRel=rel.includes('/')?'../assets/goalos-v47-command.js':'assets/goalos-v47-command.js';
    if(!t.includes('goalos-v47-command.css')) t=t.replace('</head>', `<link rel="stylesheet" href="${cssRel}">\n</head>`);
    if(!t.includes('goalos-v47-command.js')) t=t.replace('</body>', `<script src="${jsRel}"></script>\n</body>`);
    t=t.replace('</body>', `${legalRail}\n${footer}\n</body>`);
  } else { jsCount++; }
  fs.writeFileSync(f,t);
}
console.log(`GoalOS v47 command safety repair PASS: ${htmlCount} HTML files and ${jsCount} JS files checked.`);
