import fs from 'node:fs';
import path from 'node:path';
const ROOT = process.cwd();
const site = path.join(ROOT, 'site');
const required = ['index.html','signoff-product-protocol-ladder-lab.html','goalos-v22-v36-command-center.html','public-demo-labs.html','proof-to-payment-console.html','48-contract-rails.html','agialpha-protocol-rails.html','goalos-public-demo-labs-v22-v36.json','signoff-product-strategy-v36.json','proof-to-payment-protocol-ladder-v36.json','agialpha-contract-rails-map-v36.json'];
let errors=[];
for(const rel of required){ if(!fs.existsSync(path.join(site, rel))) errors.push(`Missing ${rel}`); }
for(const rel of required.filter(r=>r.endsWith('.html'))){
  const txt=fs.readFileSync(path.join(site, rel),'utf8');
  for(const needle of ['goalos signoff','v36','no forms','no text inputs','zero value moved']) if(!txt.toLowerCase().includes(needle)) errors.push(`${rel} missing ${needle}`);
  if(/<\s*(form|input|textarea|select)\b/i.test(txt)) errors.push(`${rel} contains a prohibited form/input/select/textarea tag`);
  if(!txt.includes('signoff-product-protocol-ladder-lab.html')) errors.push(`${rel} missing v36 product route link`);
}
const manifest = JSON.parse(fs.readFileSync(path.join(site,'goalos-public-demo-labs-v22-v36.json'),'utf8'));
if(manifest.count !== 15 || !Array.isArray(manifest.labs) || manifest.labs.length !== 15) errors.push('Manifest does not list 15 labs');
if(!manifest.labs.some(l=>l.v==='v36')) errors.push('Manifest missing v36');
const strategy = JSON.parse(fs.readFileSync(path.join(site,'signoff-product-strategy-v36.json'),'utf8'));
if(strategy.product_tiers.length !== 4) errors.push('Strategy missing four product tiers');
if(!strategy.public_boundary.includes('No wallets')) errors.push('Boundary missing no wallets');
if(errors.length){ console.error(errors.join('\n')); process.exit(1); }
console.log('GoalOS Signoff Product & Protocol Ladder v36 verification PASS.');
