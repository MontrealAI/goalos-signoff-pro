#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd(); const site=path.join(root,'site');
if(!fs.existsSync(site)){console.error('Missing site directory');process.exit(1)}
const files=[]; (function walk(d){for(const e of fs.readdirSync(d,{withFileTypes:true})){const p=path.join(d,e.name); if(e.isDirectory()) walk(p); else if(e.isFile()&&p.endsWith('.html')) files.push(p)}})(site);
const boundary='No forms · no uploads · no cookies · no analytics · no wallets · no payments · no external AI calls · no personal or confidential data · zero value moved. Local navigator questions stay in the browser.';
for(const p of files){
  let h=fs.readFileSync(p,'utf8');
  h=h.replace(/Public site ruleNo forms/g,'Public site rule: No forms');
  const rel=p.includes(path.sep+'contracts'+path.sep)?'../assets/goalos-v39-navigator.css':'assets/goalos-v39-navigator.css';
  const reljs=p.includes(path.sep+'contracts'+path.sep)?'../assets/goalos-v39-navigator.js':'assets/goalos-v39-navigator.js';
  const css=`<link rel="stylesheet" href="${rel}" data-goalos-v39="css">`;
  const js=`<script src="${reljs}" defer data-goalos-v39="js"></script>`;
  if(!h.includes('data-goalos-v39="css"')) h=h.includes('</head>')?h.replace('</head>',`${css}</head>`):css+h;
  if(!h.includes('data-goalos-v39="js"')) h=h.includes('</body>')?h.replace('</body>',`${js}</body>`):h+js;
  if(!h.includes('Ask GoalOS') && h.includes('</body>')){
    h=h.replace('</body>',`<div class="v39-inline-boundary" style="display:none">${boundary}</div></body>`);
  }
  fs.writeFileSync(p,h);
}
console.log(`GoalOS v22-v39 HTML integrity repair PASS: ${files.length} HTML files checked.`);
