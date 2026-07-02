#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd(); const site=path.join(root,'site');
const html=[];function walk(d){if(!fs.existsSync(d))return;for(const e of fs.readdirSync(d,{withFileTypes:true})){const p=path.join(d,e.name);if(e.isDirectory())walk(p);else if(e.isFile()&&p.endsWith('.html'))html.push(p)}}walk(site);
for(const p of html){let h=fs.readFileSync(p,'utf8');const depth=path.relative(site,path.dirname(p)).split(path.sep).filter(Boolean).length;const prefix=depth?('../'.repeat(depth)):'';const css=`<link rel="stylesheet" href="${prefix}assets/goalos-v40-concierge.css" data-goalos-v40="css">`;const js=`<script src="${prefix}assets/goalos-v40-concierge.js" defer data-goalos-v40="js"></script>`;if(!h.includes('data-goalos-v40="css"')) h=h.includes('</head>')?h.replace('</head>',css+'</head>'):css+h;if(!h.includes('data-goalos-v40="js"')) h=h.includes('</body>')?h.replace('</body>',js+'</body>'):h+js;h=h.replace(/Public site ruleNo forms/g,'Public site rule: No forms');
  const count=(h.match(/data-goalos-legal-rail="v12"/g)||[]).length;
  if(count===0){
    const legal='<section data-goalos-legal-rail="v12" style="border:1px solid rgba(167,255,131,.25);border-radius:14px;padding:12px;margin:20px 0"><strong>Public site boundary</strong>: local/static public demo; no uploads, cookies, analytics, wallets, payments, external AI calls by default, personal/confidential data required, or value moved.</section>';
    h=h.includes('<footer')?h.replace('<footer', legal+'<footer'):h+legal;
  }
  fs.writeFileSync(p,h)}
console.log(`GoalOS v22-v40 HTML integrity repair PASS: ${html.length} HTML files checked.`);
