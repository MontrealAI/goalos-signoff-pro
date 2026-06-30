#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
const root = process.cwd();
const site = path.join(root, 'site');
const required = [
  'governed-decision-state-lab.html',
  'decision-state-lab.html',
  'governed-decision-state-demo-bundle.json',
  'governed-decision-state-certificate.json',
  'action-graph-demo.json',
  'verifier-mesh-report.json',
  'contradiction-register.json',
  'decision-state-manifest.json',
  'assets/governed-decision-state-lab-v18.css',
  'assets/governed-decision-state-lab-v18.js'
];
let errors=[];
const read=(rel)=>fs.readFileSync(path.join(site,rel),'utf8');
for(const rel of required){ if(!fs.existsSync(path.join(site,rel))) errors.push(`${rel} missing`); }
if(!errors.length){
  for(const rel of ['governed-decision-state-lab.html','decision-state-lab.html']){
    const html=read(rel);
    if(html.includes('Route Not Found')) errors.push(`${rel} contains Route Not Found fallback`);
    if((html.match(/data-goalos-legal-rail="v12"/g)||[]).length !== 1) errors.push(`${rel} must contain exactly one v12 legal rail`);
    if((html.match(/<footer\b/gi)||[]).length !== 1) errors.push(`${rel} must contain exactly one footer`);
    for(const bad of ['<form','<input','<textarea','<select','connect wallet','walletconnect','localStorage','sessionStorage','document.cookie','gtag(','mailto:','contact@montreal.ai']){
      if(html.toLowerCase().includes(bad.toLowerCase())) errors.push(`${rel} contains forbidden public-site marker: ${bad}`);
    }
    for(const must of ['Not a report','A decision state','Run decision state','claims matrix','risk ledger','Action graph','No forms · no uploads']){
      if(!html.includes(must)) errors.push(`${rel} missing required phrase: ${must}`);
    }
  }
  const js = read('assets/governed-decision-state-lab-v18.js');
  try{ new Function(js); }catch(e){ errors.push(`browser JS syntax failed: ${e.message}`); }
  const bundle = JSON.parse(read('governed-decision-state-demo-bundle.json'));
  const cert = JSON.parse(read('governed-decision-state-certificate.json'));
  if(!bundle.records || Object.keys(bundle.records).length < 4) errors.push('demo bundle must contain at least four decision scenarios');
  if(!String(cert.outcome || '').includes('ACCEPT')) errors.push('default decision certificate should demonstrate an accepted receipt-ready state');
  if(cert.valueMoved !== 0) errors.push('decision certificate must not move value');
  if(!bundle.doctrine?.thesis?.includes('governed decision state')) errors.push('bundle doctrine thesis missing');
  for(const rel of ['governed-decision-state-demo-bundle.json','governed-decision-state-certificate.json','action-graph-demo.json','verifier-mesh-report.json','contradiction-register.json','decision-state-manifest.json']){
    const txt = read(rel).toLowerCase();
    for(const bad of ['guaranteed return','guaranteed profit','achieved agi','achieved asi','superintelligence achieved','live-staking-unsupported-marker','active mainnet settlement' ,'mainnet settlement is live','contact@montreal.ai']){
      if(txt.includes(bad)) errors.push(`${rel} contains unsupported phrase: ${bad}`);
    }
  }
}
if(errors.length){ console.error('GoalOS Governed Decision State Lab v18 gate FAILED'); for(const e of errors) console.error(' - '+e); process.exit(1); }
console.log('GoalOS Governed Decision State Lab v18 gate PASS');
