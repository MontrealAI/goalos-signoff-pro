#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
const site = path.join(process.cwd(), 'site');
const legacyNeedle = 'No forms · no uploads';
const strictNeedle = 'No forms · no inputs · no uploads';
if (!fs.existsSync(site)) {
  console.log('GoalOS boundary phrase verifier skipped: site/ does not exist');
  process.exit(0);
}
const htmlFiles = [];
function walk(dir){ for(const e of fs.readdirSync(dir,{withFileTypes:true})){ const fp=path.join(dir,e.name); if(e.isDirectory()) walk(fp); else if(e.isFile() && e.name.endsWith('.html')) htmlFiles.push(fp); } }
walk(site);
const errors=[];
for(const fp of htmlFiles){
  const rel=path.relative(site,fp).replaceAll(path.sep,'/');
  if(rel.startsWith('404')) continue;
  const html=fs.readFileSync(fp,'utf8');
  if((html.match(/data-goalos-legal-rail="v12"/g)||[]).length!==1) errors.push(`${rel} must contain exactly one v12 legal rail`);
  if((html.match(/data-goalos-footer="canonical"/g)||[]).length!==1) errors.push(`${rel} must contain exactly one canonical footer`);
  if(!html.includes(legacyNeedle)) errors.push(`${rel} missing legacy phrase: ${legacyNeedle}`);
  if(!html.includes(strictNeedle)) errors.push(`${rel} missing strict phrase: ${strictNeedle}`);
}
if(errors.length){ console.error('GoalOS public-site boundary phrase gate FAILED'); for(const e of errors) console.error(' - '+e); process.exit(1); }
console.log(`GoalOS public-site boundary phrase gate PASS (${htmlFiles.length} HTML pages checked)`);
