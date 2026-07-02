#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
const ROOT=process.cwd();const SITE=path.join(ROOT,'site');const data=JSON.parse(fs.readFileSync(path.join(SITE,'agialpha-48-contract-atlas-v38-data.json'),'utf8'));
const errors=[];function exists(rel){return fs.existsSync(path.join(SITE,rel));}function read(rel){return exists(rel)?fs.readFileSync(path.join(SITE,rel),'utf8'):'';}
const required=['agialpha-48-contract-atlas.html','goalos-v22-v38-command-center.html','public-demo-labs.html','index.html','goalos-public-demo-labs-v22-v38.json','signoff-to-48-contracts-map-v38.json','agialpha-48-contract-atlas-v38-manifest.json','contracts/index.html'];
for(const r of required)if(!exists(r))errors.push(`Missing ${r}`);
if(data.contracts?.length!==48)errors.push(`Expected 48 contracts, got ${data.contracts?.length}`);
for(const c of data.contracts||[]){if(!exists(`contracts/${c.slug}.html`))errors.push(`Missing contract page ${c.slug}`);if(!/^0x[a-fA-F0-9]{40}$/.test(c.address))errors.push(`Bad address ${c.name}`)}
const atlas=read('agialpha-48-contract-atlas.html');
for(const phrase of ['48 GoalOS-created Mainnet contracts','Signoff Basic','Signoff Verified','Signoff Secured','Signoff & Settle','Configured, not activated','Etherscan']) if(!atlas.includes(phrase)) errors.push(`Atlas missing phrase ${phrase}`);
const home=read('index.html');
for(const phrase of ['Know when AI work is actually done','Explore 48 protocol rails','Mission 001','Benchmark-ready proof']) if(!home.includes(phrase)) errors.push(`Home missing phrase ${phrase}`);
const labs=read('public-demo-labs.html');
for(const phrase of ['v22-v38','v38','AGIALPHA 48-Contract Atlas']) if(!labs.includes(phrase)) errors.push(`Labs missing phrase ${phrase}`);
const htmls=[];function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,e.name);if(e.isDirectory())walk(p);else if(p.endsWith('.html'))htmls.push(p)}}walk(SITE);
for(const p of htmls){const t=fs.readFileSync(p,'utf8');const rel=path.relative(SITE,p).replaceAll('\\','/');if((t.match(/data-goalos-legal-rail="v12"/g)||[]).length!==1)errors.push(`${rel} legal rail count`);if((t.match(/<footer\b/gi)||[]).length!==1)errors.push(`${rel} footer count`);if(/<form\b|<input\b|<textarea\b|<select\b|document\.cookie|localStorage|sessionStorage|connect\s+wallet|walletconnect|google-analytics|gtag\(/i.test(t))errors.push(`${rel} contains blocked public-site fragment`);}
if(errors.length){console.error('GoalOS AGIALPHA 48-contract atlas v38 verification FAIL');for(const e of errors.slice(0,80))console.error('- '+e);process.exit(1)}
console.log(`GoalOS AGIALPHA 48-contract atlas v38 verification PASS: ${data.contracts.length} contracts, ${htmls.length} HTML pages checked.`);
