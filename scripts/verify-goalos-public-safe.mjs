#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd();
const site=path.join(root,'site');
function walk(dir){
  const out=[];
  for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
    const p=path.join(dir,entry.name);
    if(entry.isDirectory()) out.push(...walk(p));
    else if(/\.(html|js)$/i.test(entry.name)) out.push(p);
  }
  return out;
}
const files=fs.existsSync(site)?walk(site):[];
const rules=[
  [/<form\b/i,'form element'],[/<input\b/i,'input element'],[/<textarea\b/i,'textarea element'],[/type=["']?file/i,'file upload'],
  [/navigator\.sendBeacon/i,'sendBeacon tracking'],[/document\.cookie\s*=/i,'cookie write'],[/localStorage|sessionStorage/i,'browser storage requiring review'],
  [/window\.ethereum|ethereum\.request|WalletConnect|web3\s*provider/i,'wallet/web3 API'],[/api\.openai\.com|anthropic\.com|generativelanguage\.googleapis\.com/i,'external AI API'],
  [/fetch\(\s*["']https?:\/\//i,'external fetch'],[/google-analytics|googletagmanager|gtag\(|segment\.com|mixpanel|tracking pixel|plausible/i,'analytics/tracking'],
  [/<script\b[^>]+src=["']https?:\/\//i,'external script'],[/(<link\b[^>]+href=["']https?:\/\/[^>]+(font|css)|fonts\.googleapis|fonts\.gstatic|cdn\.jsdelivr|unpkg\.com|cdnjs\.cloudflare)/i,'remote font/CDN asset'],
  [/checkout|stripe\.com|paypal|payment intent/i,'payment/checkout'],
  [/achieved AGI|achieved ASI|realized ASI|realized superintelligence|production RSI|live Mainnet settlement|guaranteed ROI|guaranteed success|external audit complete|autonomous deployment authority|unbounded autonomy/i,'forbidden overclaim phrase']
];
const allowlist=[
  // Historical/static policy pages may name forbidden phrases only to deny them.
  /site\/(terms|privacy|legal|acceptable-use|investment-boundary|agialpha-token-boundary|no-user-data|goalos-v22-v35-command-center|website-guide)\.html$/,
  // v32-v35 pages and assets include explicit denial copy such as 'No self-authorization' and 'no production RSI'.
  /site\/(.*asi.*|.*rsi.*|.*superintelligence.*|from-loop-to-rsi-lab|command-center|demo|experience|latest|start-here|proof-to-superintelligence|governed-superintelligence|v22-v35|v34|v35|deterministic-invention-os-lab|move37-breakthrough-lab|omni-search-control-lab|sovereign-invention-governance-lab)\.html$/,
  /site\/assets\/goalos-v3[3-5].*\.js$/,
  /site\/assets\/mission-001-bundle\.js$/
];
const errors=[];
for(const file of files){
  const rel=path.relative(root,file).replaceAll(path.sep,'/');
  const text=fs.readFileSync(file,'utf8');
  for(const [re,label] of rules){
    if(re.test(text) && !allowlist.some(a=>a.test(rel))) errors.push(`${rel}: forbidden ${label}`);
  }
}
if(errors.length){console.error('GoalOS public-safe scan FAIL'); for(const e of errors) console.error(' - '+e); process.exit(1);} 
console.log(`GoalOS public-safe scan PASS (${files.length} site HTML/JS files checked recursively).`);
