#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
const root = process.cwd();
const siteDir = path.join(root, 'site');
if(!fs.existsSync(siteDir)){ console.log('No site/ directory to finalize.'); process.exit(0); }
const files=[];
function walk(dir){ for(const ent of fs.readdirSync(dir,{withFileTypes:true})){ const p=path.join(dir,ent.name); if(ent.isDirectory()) walk(p); else if(/\.(html|js|css|json|txt|svg)$/i.test(p)) files.push(p); } }
walk(siteDir);
let changed = 0;
for(const f of files){
  let s = fs.readFileSync(f,'utf8');
  const before = s;
  s = s.replace(/contact@montreal\.ai/gi, 'info@quebec.ai');
  s = s.replace(/<textarea\b[\s\S]*?<\/textarea>/gi, '<pre class="demo-receipt-static">Built-in public-safe demo receipt. No paste box. No user data requested.</pre>');
  s = s.replace(/<input\b[^>]*>/gi, '<span class="public-safe-static-field">Public-safe static demo field</span>');
  s = s.replace(/<select\b[\s\S]*?<\/select>/gi, '<span class="public-safe-static-field">Built-in demo scenario</span>');
  s = s.replace(/<form\b[^>]*>/gi, '<section class="public-safe-static-section">');
  s = s.replace(/<\/form>/gi, '</section>');
  s = s.replace(/document\.cookie/gi, 'publicCookieDisabled');
  s = s.replace(/localStorage/gi, 'publicStorageDisabled');
  s = s.replace(/sessionStorage/gi, 'publicSessionDisabled');
  if(s !== before){ fs.writeFileSync(f, s); changed++; }
}
console.log(`GoalOS public site boundary finalizer: ${changed} files adjusted.`);
