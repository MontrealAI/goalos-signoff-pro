#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd();
const site=path.join(root,'site');
if(!fs.existsSync(site)){console.error('Missing site/ directory. Run the GoalOS site build first.');process.exit(1)}
const LEGAL='<aside class="site-rule" data-goalos-legal-rail="v12"><b>Public site rule</b><span>No forms · no inputs · no uploads · no cookies · no analytics · no wallets · no payments · no personal or confidential data · zero value moved.</span><a href="no-user-data.html">Read the rule</a></aside>';
const FOOTER='<footer class="footer goalos-universal-footer"><div><b>GoalOS Signoff Pro</b><span>Proof-to-acceptance · public-safe proof labs · browser-local demos · protocol rails atlas.</span></div><nav><a href="index.html">Home</a><a href="goalos-v22-v38-command-center.html">Command Center</a><a href="public-demo-labs.html">All Labs</a><a href="agialpha-48-contract-atlas.html">48 Contracts</a><a href="no-user-data.html">No User Data</a></nav>'+LEGAL+'</footer>';
const htmlFiles=fs.readdirSync(site,{recursive:true}).filter(f=>f.endsWith('.html'));
function removeRails(html){return html.replace(/<(aside|div|section)\b[^>]*data-goalos-legal-rail=["']v12["'][\s\S]*?<\/\1>/gi,'')}
function normalizeFooter(html){const footerRe=/<footer\b[\s\S]*?<\/footer>/gi;let out=removeRails(html).replace(footerRe,'');let footer=FOOTER;if(/<\/body>/i.test(out)) out=out.replace(/<\/body>/i,footer+'</body>'); else out+=footer;return out;}
function ensureAssets(rel, html){let out=html;if(/<head[\s>]/i.test(out)&&!/goalos-v38-contract-atlas\.css/.test(out)){const prefix=rel.includes('/')?'../':'';out=out.replace(/<\/head>/i,`<link rel="stylesheet" href="${prefix}assets/goalos-v38-contract-atlas.css"><script src="${prefix}assets/goalos-v38-contract-atlas.js" defer></script></head>`)}return out;}
let repaired=0;
for(const rel of htmlFiles){const p=path.join(site,rel);const before=fs.readFileSync(p,'utf8');let html=before;html=normalizeFooter(html);html=ensureAssets(rel,html);if(html!==before){fs.writeFileSync(p,html);repaired++;}}
const errors=[];
for(const rel of htmlFiles){const html=fs.readFileSync(path.join(site,rel),'utf8');const rails=(html.match(/data-goalos-legal-rail="v12"/g)||[]).length;const footers=(html.match(/<footer\b/gi)||[]).length;if(rails!==1)errors.push(`${rel}: expected 1 legal rail, found ${rails}`);if(footers!==1)errors.push(`${rel}: expected 1 footer, found ${footers}`)}
if(errors.length){console.error('GoalOS v22-v38 HTML integrity repair failed');errors.slice(0,80).forEach(e=>console.error('- '+e));process.exit(1)}
console.log(`GoalOS v22-v38 HTML integrity repair PASS: ${htmlFiles.length} HTML files checked, ${repaired} repaired.`);
