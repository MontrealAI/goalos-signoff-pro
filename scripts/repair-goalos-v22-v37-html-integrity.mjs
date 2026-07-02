#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd();
const site=path.join(root,'site');
if(!fs.existsSync(site)){console.error('Missing site directory');process.exit(1)}
const RULE='No forms · no text inputs · no uploads · no cookies · no analytics · no wallets · no payments · no external AI calls · no personal or confidential data · zero value moved.';
const rail=`<aside class="site-rule" data-goalos-legal-rail="v12"><b>Public site rule</b><span>${RULE}</span><a href="no-user-data.html">Read the rule</a></aside>`;
const footer=`<footer class="g37-footer goalos-universal-footer"><div><strong>GoalOS Signoff Pro</strong><span>Proof-to-acceptance · v22-v37 public-safe proof labs · browser-local demos.</span></div><nav><a href="index.html">Home</a><a href="goalos-v22-v37-command-center.html">Command Center</a><a href="public-demo-labs.html">All Labs</a><a href="ai-research-strategy-signoff-console.html">v37</a><a href="no-user-data.html">No User Data</a></nav>${rail}</footer>`;
function stripRails(s){return s.replace(/<aside\b[^>]*data-goalos-legal-rail=["']v12["'][\s\S]*?<\/aside>/gi,'').replace(/<div\b[^>]*data-goalos-legal-rail=["']v12["'][\s\S]*?<\/div>/gi,'').replace(/<section\b[^>]*data-goalos-legal-rail=["']v12["'][\s\S]*?<\/section>/gi,'')}
function normalize(s){let out=stripRails(s).replace(/<footer\b[\s\S]*?<\/footer>/gi,''); if(!/goalos-v37-product-console\.css/.test(out)&&/<\/head>/i.test(out))out=out.replace(/<\/head>/i,'<link rel="stylesheet" href="assets/goalos-v37-product-console.css"></head>'); if(!/goalos-ultimate-v35\.css/.test(out)&&/<\/head>/i.test(out))out=out.replace(/<\/head>/i,'<link rel="stylesheet" href="assets/goalos-ultimate-v35.css"></head>'); if(/<\/body>/i.test(out))out=out.replace(/<\/body>/i,`${footer}</body>`); else out+=footer; return out;}
const files=fs.readdirSync(site,{recursive:true}).filter(f=>f.endsWith('.html'));
let repaired=0;
for(const rel of files){const p=path.join(site,rel);const before=fs.readFileSync(p,'utf8');const after=normalize(before);if(after!==before){fs.writeFileSync(p,after);repaired++;}}
const errors=[];
for(const rel of files){const html=fs.readFileSync(path.join(site,rel),'utf8');const rails=(html.match(/data-goalos-legal-rail="v12"/g)||[]).length;const footers=(html.match(/<footer\b/gi)||[]).length;if(rails!==1)errors.push(`${rel}: expected 1 legal rail, found ${rails}`);if(footers!==1)errors.push(`${rel}: expected 1 footer, found ${footers}`);}
if(errors.length){console.error('GoalOS v22-v37 HTML integrity repair failed');errors.slice(0,80).forEach(e=>console.error(' - '+e));process.exit(1)}
console.log(`GoalOS v22-v37 HTML integrity repair PASS: ${files.length} HTML files checked, ${repaired} repaired.`);
