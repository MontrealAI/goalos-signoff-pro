#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd();
const site=path.join(root,'site');
const required=[
  'index.html',
  'goalos-universal-command-center.html',
  'all-pages.html',
  'assets/goalos-v45-command-os.js',
  'assets/goalos-v46-safe-concierge.js',
  'assets/goalos-v40-concierge.js',
  'goalos-v46-public-safe-command-repair-manifest.json'
];
const errors=[];
for(const rel of required){ if(!fs.existsSync(path.join(site,rel))) errors.push(`Missing ${rel}`); }
function walk(dir){const out=[]; if(!fs.existsSync(dir)) return out; for(const e of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,e.name); if(e.isDirectory()) out.push(...walk(p)); else if(e.isFile()&&/\.(html|js)$/i.test(e.name)) out.push(p);} return out;}
for(const fp of walk(site)){
  const rel=path.relative(site,fp).replaceAll(path.sep,'/');
  const text=fs.readFileSync(fp,'utf8');
  for(const [re,label] of [[/<form\b/i,'form'],[/<input\b/i,'input'],[/<textarea\b/i,'textarea'],[/<select\b/i,'select']]) if(re.test(text)) errors.push(`${rel}: blocked ${label} fragment`);
  if(fp.endsWith('.html')){
    const rails=(text.match(/data-goalos-legal-rail="v12"/g)||[]).length;
    const footers=(text.match(/<footer\b/gi)||[]).length;
    if(rails!==1) errors.push(`${rel}: expected one legal rail, found ${rails}`);
    if(footers!==1) errors.push(`${rel}: expected one footer, found ${footers}`);
  }
}
if(errors.length){console.error('GoalOS public-safe command OS v46 verification FAIL'); errors.slice(0,140).forEach(e=>console.error('- '+e)); process.exit(1);} 
console.log(`GoalOS public-safe command OS v46 verification PASS: ${walk(site).length} HTML/JS files checked; legacy concierge assets repaired.`);
