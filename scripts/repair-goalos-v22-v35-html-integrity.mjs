#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
const root = process.cwd();
const site = path.join(root, 'site');
if (!fs.existsSync(site)) { console.error('Missing site/ directory. Run the GoalOS site build first.'); process.exit(1); }
const LEGAL_RAIL = '<aside class="site-rule" data-goalos-legal-rail="v12"><b>Public site rule:</b><span>No forms · no inputs · no uploads · no cookies · no analytics · no wallets · no payments · no personal or confidential data · zero value moved.</span><a href="no-user-data.html">Read the rule</a></aside>';
const FOOTER = `<footer class="footer goalos-universal-footer"><div><b>GoalOS Signoff Pro</b><span>Proof-to-acceptance · public-safe proof labs · browser-local demos · complete v22-v35 suite.</span></div><nav><a href="index.html">Home</a><a href="goalos-v22-v35-command-center.html">Command Center</a><a href="public-demo-labs.html">All Labs</a><a href="loop-rsi-asi-superintelligence-mission-simulator-lab.html">v35</a><a href="no-user-data.html">No User Data</a><a href="agialpha-token-boundary.html">$AGIALPHA boundary</a></nav>${LEGAL_RAIL}</footer>`;
const htmlFiles = fs.readdirSync(site,{recursive:true}).filter(f=>f.endsWith('.html'));
let repaired=0;
function stripRails(html){ return html.replace(/<aside\b[^>]*data-goalos-legal-rail=["']v12["'][\s\S]*?<\/aside>/gi,'').replace(/<div\b[^>]*data-goalos-legal-rail=["']v12["'][\s\S]*?<\/div>/gi,'').replace(/<section\b[^>]*data-goalos-legal-rail=["']v12["'][\s\S]*?<\/section>/gi,''); }
for(const rel of htmlFiles){
  const file=path.join(site,rel); let html=fs.readFileSync(file,'utf8'); const before=html;
  html=html.replace(/Public site ruleNo forms/g,'Public site rule: No forms').replace(/Public site rule\s*No forms/g,'Public site rule: No forms');
  if(/<head[\s>]/i.test(html) && !/goalos-diamond-v35\.css/.test(html)) html=html.replace(/<\/head>/i,'<link rel="stylesheet" href="assets/goalos-diamond-v35.css">\n</head>');
  if(/<\/body>/i.test(html) && !/goalos-diamond-v35\.js/.test(html)) html=html.replace(/<\/body>/i,'<script defer src="assets/goalos-diamond-v35.js"></script>\n</body>');
  const footers=html.match(/<footer\b[\s\S]*?<\/footer>/gi)||[];
  html=html.replace(/<footer\b[\s\S]*?<\/footer>/gi,'');
  html=stripRails(html);
  let footer=footers[0] || FOOTER;
  footer=stripRails(footer);
  if(!/<footer\b/i.test(footer)) footer=FOOTER;
  footer=footer.replace(/<\/footer>/i, `${LEGAL_RAIL}</footer>`);
  html=/<\/body>/i.test(html) ? html.replace(/<\/body>/i, `${footer}\n</body>`) : html + footer;
  if(html!==before){ fs.writeFileSync(file,html); repaired++; }
}
const errors=[];
for(const rel of htmlFiles){ const t=fs.readFileSync(path.join(site,rel),'utf8'); const rails=(t.match(/data-goalos-legal-rail="v12"/g)||[]).length; const footers=(t.match(/<footer\b/gi)||[]).length; if(rails!==1) errors.push(`${rel}: expected one legal rail, found ${rails}`); if(footers!==1) errors.push(`${rel}: expected one footer, found ${footers}`); if(t.includes('Public site ruleNo forms')) errors.push(`${rel}: malformed public site rule text`); }
if(errors.length){ console.error('GoalOS HTML integrity repair failed:'); for(const e of errors.slice(0,80)) console.error(' - '+e); process.exit(1); }
console.log(`GoalOS v22-v35 HTML integrity repair PASS: ${htmlFiles.length} HTML files checked, ${repaired} repaired.`);
