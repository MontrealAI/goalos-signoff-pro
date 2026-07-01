#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd();
const site=path.join(root,'site');
const files=fs.readdirSync(site).filter(f=>/\.(html|js)$/i.test(f));
const rules=[[/<form\b/i,'form element'],[/<input\b/i,'input element'],[/<textarea\b/i,'textarea element'],[/type=["']?file/i,'file upload'],[/navigator\.sendBeacon/i,'sendBeacon'],[/document\.cookie/i,'cookie access'],[/window\.ethereum|ethereum\.request|WalletConnect|web3\s*provider/i,'wallet/web3 API'],[/api\.openai\.com|anthropic\.com|generativelanguage\.googleapis\.com/i,'external AI API'],[/google-analytics|googletagmanager|gtag\(|segment\.com|mixpanel|tracking pixel/i,'analytics/tracking'],[/<script\b[^>]+src=["']https?:\/\//i,'external script'],[/checkout|stripe\.com|paypal|payment intent/i,'payment/checkout']];
const errors=[];
for(const f of files){const rel='site/'+f; const text=fs.readFileSync(path.join(site,f),'utf8'); for(const [re,label] of rules){ if(re.test(text)) errors.push(`${rel}: forbidden ${label}`); }}
if(errors.length){console.error('GoalOS public-safe scan FAIL'); for(const e of errors) console.error(' - '+e); process.exit(1);} 
console.log(`GoalOS public-safe scan PASS (${files.length} site HTML/JS files checked).`);
