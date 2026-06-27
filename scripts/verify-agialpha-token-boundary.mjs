#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd(); const site=path.join(root,'site');
const cfg=JSON.parse(fs.readFileSync(path.join(root,'config/agialpha-token-boundary.json'),'utf8'));
let errors=[];
for(const rel of ['agialpha.html','agialpha-token-boundary.html','agialpha-token-manifest.json','assets/agialpha-token-boundary.css']) if(!fs.existsSync(path.join(site,rel))) errors.push(`Missing ${rel}`);
const files=[]; function walk(d){ if(!fs.existsSync(d)) return; for(const e of fs.readdirSync(d,{withFileTypes:true})){const p=path.join(d,e.name); if(e.isDirectory()) walk(p); else if(/\.(html|json|txt|xml)$/i.test(p)) files.push(p)}} walk(site);
const all=files.map(f=>fs.readFileSync(f,'utf8')).join('\n'); const lower=all.toLowerCase();
if(!lower.includes(cfg.contractAddress.toLowerCase())) errors.push('AGIALPHA contract address missing from public site.');
if(!lower.includes(cfg.contact.toLowerCase())) errors.push('info@quebec.ai missing from public site.');
if(lower.includes('contact@montreal.ai')) errors.push('Forbidden contact@montreal.ai present.');
for(const req of cfg.requiredBoundaryClaims) if(!lower.includes(req.toLowerCase())) errors.push(`Required boundary claim missing: ${req}`);
for(const bad of cfg.forbiddenPositiveClaims) if(lower.includes(bad.toLowerCase())) errors.push(`Forbidden positive token claim found: ${bad}`);
for(const marker of ['private_key','mnemonic','seed phrase','service_role','sk_live_','wallet private key']) if(lower.includes(marker)) errors.push(`Secret-like marker found: ${marker}`);
if(errors.length){console.error('AGIALPHA external token boundary gate: FAIL'); for(const e of errors) console.error('- '+e); process.exit(1)}
console.log('AGIALPHA external token boundary gate: PASS');
