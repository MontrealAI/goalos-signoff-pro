#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
const site=path.join(process.cwd(),'site');
const required=['signoff-product-protocol-ladder-lab.html','product-protocol-ladder.html','protocol-ladder.html','proof-to-payment-ladder.html','48-contract-rails.html','agialpha-protocol-rails.html','signoff-basic.html','signoff-verified.html','signoff-secured.html','signoff-settle.html','v36.html','signoff-product-protocol-ladder-v36-manifest.json'];
const errors=[];for(const rel of required)if(!fs.existsSync(path.join(site,rel)))errors.push('Missing '+rel);
for(const rel of required.filter(x=>x.endsWith('.html'))){const html=fs.readFileSync(path.join(site,rel),'utf8');for(const phrase of ['Proof-to-acceptance first','Proof-to-payment later','Signoff Basic','Signoff Verified','Signoff Secured','Signoff & Settle'])if(!html.includes(phrase))errors.push(`${rel} missing ${phrase}`); if((html.match(/data-goalos-legal-rail="v12"/g)||[]).length!==1)errors.push(`${rel} missing single legal rail`); if(/<form\b|<input\b|<textarea\b|<select\b|document\.cookie|localStorage|walletconnect|connect wallet/i.test(html))errors.push(`${rel} contains blocked public site fragment`);}
if(errors.length){console.error('GoalOS Signoff Product Protocol Ladder v36 verification FAIL');errors.slice(0,80).forEach(e=>console.error(' - '+e));process.exit(1)}
console.log('GoalOS Signoff Product Protocol Ladder v36 verification PASS.');
