#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd(); const site=path.join(root,'site');
const required=['ai-research-strategy-signoff-console.html','signoff-launch-console.html','know-when-ai-work-is-done.html','create-a-free-signoff.html','product-launch-console.html','ai-work-acceptance-console.html','mission-receipt-console.html','signoff-product-core.html','product-first-signoff.html','v37.html','ai-research-strategy-signoff-v37-manifest.json','signoff-acceptance-flow-v37.json','signoff-product-ladder-v37.json','protocol-contract-map-v37.json','agialpha-utility-boundary-v37.json','mission-receipt-sample-v37.json','go-to-market-wedge-v37.json','signoff-v37-demo-bundle.json'];
const errors=[];
for(const rel of required) if(!fs.existsSync(path.join(site,rel))) errors.push('Missing '+rel);
const htmls=required.filter(x=>x.endsWith('.html'));
const blocked=[/<form\b/i,/<input\b/i,/<textarea\b/i,/<select\b/i,/document\.cookie/i,/localStorage\b/i,/sessionStorage\b/i,/gtag\(/i,/google-analytics/i,/walletconnect/i,/connect wallet/i,/guaranteed\s+(return|profit|yield|roi)/i,/live\s+(escrow|staking|mainnet\s+settlement)/i];
for(const rel of htmls){const html=fs.readFileSync(path.join(site,rel),'utf8');for(const re of blocked) if(re.test(html)) errors.push(`${rel} contains blocked fragment ${re}`); for(const phrase of ['Know when AI work is actually done','Create','Submit','Check','Review','Receipt','Signoff Basic','Signoff Verified','Signoff Secured','Signoff & Settle','Mission Receipt']) if(!html.includes(phrase)) errors.push(`${rel} missing phrase ${phrase}`); const rails=(html.match(/data-goalos-legal-rail="v12"/g)||[]).length; if(rails!==1) errors.push(`${rel} must have exactly one legal rail`);}
const manifest=JSON.parse(fs.readFileSync(path.join(site,'ai-research-strategy-signoff-v37-manifest.json'),'utf8'));
if(!manifest.publicSafe||!manifest.zeroValueMoved||manifest.steps.length!==5||manifest.tiers.length!==4) errors.push('v37 manifest missing required public-safe product fields');
if(errors.length){console.error('GoalOS Signoff Product First Console v37 verification FAIL');errors.slice(0,80).forEach(e=>console.error(' - '+e));process.exit(1)}
console.log('GoalOS Signoff Product First Console v37 verification PASS.');
