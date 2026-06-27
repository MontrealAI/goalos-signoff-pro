#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd();
const site=path.join(root,'site');
const errors=[];
function walk(dir,out=[]){
  if(!fs.existsSync(dir)) return out;
  for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
    const p=path.join(dir,entry.name);
    if(entry.isDirectory()) walk(p,out); else out.push(p);
  }
  return out;
}
function rel(p){return path.relative(site,p).replaceAll('\\','/');}
function textFiles(){return walk(site).filter(f=>/\.(html|js|css|json|txt|xml|svg|md)$/i.test(f));}
if(!fs.existsSync(site)) errors.push('Missing site/ directory.');
for(const f of walk(site)){
  const r=rel(f);
  if(/(^|\/)\.env($|\.)/i.test(r) || /(^|\/)node_modules(\/|$)/i.test(r) || /(^|\/)\.git(\/|$)/i.test(r) || /(^|\/)\.next(\/|$)/i.test(r)) errors.push(`Forbidden public artifact path: ${r}`);
}
const highSignal=[
  {name:'PEM private key',re:/-----BEGIN (?:RSA |EC |OPENSSH |DSA |ENCRYPTED )?PRIVATE KEY-----/i},
  {name:'OpenAI live secret',re:/\bsk-(?:live|proj)-[A-Za-z0-9_-]{18,}\b/},
  {name:'Stripe live secret',re:/\bsk_live_[A-Za-z0-9]{18,}\b/},
  {name:'GitHub token',re:/\bgh[pousr]_[A-Za-z0-9_]{30,}\b/},
  {name:'AWS secret assignment',re:/AWS_SECRET_ACCESS_KEY\s*[=:]\s*['\"]?[A-Za-z0-9/+=]{20,}/i},
  {name:'Supabase service role assignment',re:/SUPABASE_SERVICE_ROLE_KEY\s*[=:]\s*['\"]?[A-Za-z0-9._-]{20,}/i},
  {name:'private key assignment',re:/(?:PRIVATE_KEY|WALLET_PRIVATE_KEY|DEPLOYER_PRIVATE_KEY)\s*[=:]\s*['\"]?(?:0x)?[A-Fa-f0-9]{64}\b/},
  {name:'mnemonic assignment',re:/(?:MNEMONIC|SEED_PHRASE|SECRET_PHRASE)\s*[=:]\s*['\"][^'\"]{20,}['\"]/i},
  {name:'forbidden contact email',re:/contact@montreal\.ai/i}
];
for(const file of textFiles()){
  const t=fs.readFileSync(file,'utf8');
  for(const {name,re} of highSignal) if(re.test(t)) errors.push(`${rel(file)} contains ${name}.`);
}
if(errors.length){
  console.error('GoalOS public artifact safety gate: FAIL');
  for(const e of errors) console.error('- '+e);
  process.exit(1);
}
console.log(`GoalOS public artifact safety gate: PASS (${textFiles().length} text files scanned, advisory legal warnings allowed)`);
