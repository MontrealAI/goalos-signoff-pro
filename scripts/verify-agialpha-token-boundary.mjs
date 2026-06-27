#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd();
const site=path.join(root,'site');
const cfgPath=path.join(root,'config/agialpha-token-boundary.json');
const errors=[];
function readJson(p){return JSON.parse(fs.readFileSync(p,'utf8'));}
function walk(dir,out=[]){
  if(!fs.existsSync(dir)) return out;
  for(const e of fs.readdirSync(dir,{withFileTypes:true})){
    const p=path.join(dir,e.name);
    if(e.isDirectory()) walk(p,out); else out.push(p);
  }
  return out;
}
function rel(p){return path.relative(site,p).replaceAll('\\','/');}
function sentenceContainsPositiveClaim(text, phrase){
  const needle=phrase.toLowerCase();
  const sentences=text.toLowerCase().split(/(?<=[.!?])\s+|\n+/g);
  const negators=/\b(no|not|never|without|does not|do not|cannot|forbidden|blocked|unsupported|not available|not sold|no claim|no public claim)\b/i;
  return sentences.some(s=>s.includes(needle) && !negators.test(s));
}
if(!fs.existsSync(site)) errors.push('Missing site/ directory. Build public site first.');
if(!fs.existsSync(cfgPath)) errors.push('Missing config/agialpha-token-boundary.json.');
const cfg=fs.existsSync(cfgPath)?readJson(cfgPath):{};
const required=['agialpha.html','agialpha-token-boundary.html','agialpha-token-manifest.json','assets/agialpha-token-boundary.css'];
for(const f of required){
  const p=path.join(site,f);
  if(!fs.existsSync(p)) errors.push(`Missing ${f}`);
  else if(f.endsWith('.html') && fs.readFileSync(p,'utf8').length<3800) errors.push(`${f} is too thin for production token boundary.`);
}
const textFiles=walk(site).filter(f=>/\.(html|json|txt|xml|svg)$/i.test(f));
const all=textFiles.map(f=>fs.readFileSync(f,'utf8')).join('\n');
const lower=all.toLowerCase();
if(cfg.contractAddress && !lower.includes(cfg.contractAddress.toLowerCase())) errors.push('AGIALPHA contract address missing from public site.');
if(cfg.contact && !lower.includes(cfg.contact.toLowerCase())) errors.push('info@quebec.ai missing from public site.');
if(lower.includes('contact@montreal.ai')) errors.push('Forbidden contact@montreal.ai present.');
for(const req of cfg.requiredBoundaryClaims || []) if(!lower.includes(String(req).toLowerCase())) errors.push(`Required boundary claim missing: ${req}`);
for(const bad of cfg.forbiddenPositiveClaims || []) if(sentenceContainsPositiveClaim(all,bad)) errors.push(`Forbidden positive token claim found without negation: ${bad}`);
const manifest=path.join(site,'agialpha-token-manifest.json');
if(fs.existsSync(manifest)){
  try{
    const m=readJson(manifest);
    if(m?.token?.contractAddress !== cfg.contractAddress) errors.push('AGIALPHA manifest contract address mismatch.');
    if(!m?.files || !m.files['agialpha.html']) errors.push('AGIALPHA manifest missing file hashes.');
  }catch(e){errors.push(`AGIALPHA manifest JSON invalid: ${e.message}`)}
}
const highSignal=[
  {name:'PEM private key',re:/-----BEGIN (?:RSA |EC |OPENSSH |DSA |ENCRYPTED )?PRIVATE KEY-----/i},
  {name:'OpenAI live secret',re:/\bsk-(?:live|proj)-[A-Za-z0-9_-]{18,}\b/},
  {name:'Stripe live secret',re:/\bsk_live_[A-Za-z0-9]{18,}\b/},
  {name:'GitHub token',re:/\bgh[pousr]_[A-Za-z0-9_]{30,}\b/},
  {name:'secret assignment',re:/(?:PRIVATE_KEY|WALLET_PRIVATE_KEY|DEPLOYER_PRIVATE_KEY|MNEMONIC|SEED_PHRASE|SECRET_PHRASE|SUPABASE_SERVICE_ROLE_KEY|AWS_SECRET_ACCESS_KEY)\s*[=:]\s*['\"]?[^'\"\s]{16,}/i}
];
for(const file of textFiles){
  const t=fs.readFileSync(file,'utf8');
  for(const {name,re} of highSignal) if(re.test(t)) errors.push(`${rel(file)} contains ${name}.`);
}
if(errors.length){
  console.error('AGIALPHA external token boundary gate: FAIL');
  for(const e of errors) console.error('- '+e);
  process.exit(1);
}
console.log(`AGIALPHA external token boundary gate: PASS (${textFiles.length} public files scanned, advisory legal text allowed)`);
