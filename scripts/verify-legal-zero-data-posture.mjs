import fs from 'node:fs';
import path from 'node:path';
const ROOT = process.cwd();
const SITE = path.join(ROOT, 'site');
const errors = [];
if (!fs.existsSync(SITE)) errors.push('site/ does not exist');
const required = ['no-user-data.html','privacy.html','terms.html','legal.html','data-policy.html','acceptable-use.html','investment-boundary.html','cookie-policy.html','subprocessors.html','security-boundary.html','legal-zero-data-manifest.json'];
function walk(d,a=[]){if(!fs.existsSync(d)) return a; for(const e of fs.readdirSync(d,{withFileTypes:true})){const p=path.join(d,e.name); if(e.isDirectory()) walk(p,a); else a.push(p);} return a;}
function rel(f){return path.relative(SITE,f).replaceAll('\\','/');}
for(const f of required){const p=path.join(SITE,f); if(!fs.existsSync(p)) errors.push(`Missing legal public file: ${f}`); else if(f.endsWith('.html')){const h=fs.readFileSync(p,'utf8'); if(h.length<2200) errors.push(`${f} is too thin`); if(f==='no-user-data.html' && !/No User Data|No user data|zero-user-data/i.test(h)) errors.push('no-user-data page lacks clear heading');}}
const files=walk(SITE);
const htmlFiles=files.filter(f=>f.endsWith('.html'));
const forbidden = [
  /contact@montreal\.ai/i,
  /we collect user data/i,
  /upload your personal data/i,
  /send confidential files/i,
  /send health data/i,
  /send payment data/i,
  /investment opportunity/i,
  /guaranteed\s+returns?/i,
  /guaranteed\s+ROI/i,
  /guaranteed\s+profits?/i,
  /guaranteed\s+yield/i,
  /expectation\s+of\s+profit\s+from\s+others/i,
  /purchase\s+(a\s+)?token/i,
  /buy\s+(the\s+)?token/i,
  /token sale is live/i,
  /securities offering is live/i,
  /production escrow is live/i,
  /mainnet settlement is live/i,
  /AGIALPHA staking is live/i,
  /<form\b/i,
  /<input\b/i,
  /<textarea\b/i,
  /<select\b/i,
  /google-analytics\.com|googletagmanager\.com|facebook\.net|doubleclick\.net|segment\.com|mixpanel\.com|plausible\.io/i,
  /document\.cookie\s*=/i,
  /walletconnect|connect wallet/i,
  /localStorage\.setItem|sessionStorage\.setItem/i
];
for(const f of files){const r=rel(f); if(/\.env($|\.)|node_modules|\.git|\.next/.test(r)) errors.push(`Forbidden public artifact file: ${r}`); if(/\.(html|js|css|json|txt|svg|xml)$/i.test(r)){const t=fs.readFileSync(f,'utf8'); for(const re of forbidden) if(re.test(t)) errors.push(`${r} matches forbidden pattern ${re}`);}}
const missingRail=[];
for(const f of htmlFiles){const h=fs.readFileSync(f,'utf8'); if(!h.includes('legal-rail')) missingRail.push(rel(f));}
if(missingRail.length) errors.push(`Legal rail missing from ${missingRail.length}/${htmlFiles.length} HTML pages: ${missingRail.slice(0,25).join(', ')}${missingRail.length>25?' ...':''}`);
const manifest=path.join(SITE,'legal-zero-data-manifest.json');
if(fs.existsSync(manifest)){try{const m=JSON.parse(fs.readFileSync(manifest,'utf8')); if(m.contactEmail!=='info@quebec.ai') errors.push('legal manifest contact is not info@quebec.ai'); if(!String(m.posture||'').includes('zero-user-data')) errors.push('legal manifest posture mismatch');}catch(e){errors.push('legal-zero-data-manifest.json is not valid JSON');}}
const boundaryManifest=path.join(SITE,'public-boundary-finalization-manifest.json');
if(!fs.existsSync(boundaryManifest)) errors.push('Missing public-boundary-finalization-manifest.json; finalizer did not run');
if(errors.length){console.error('GoalOS legal zero-data gate FAILED'); for(const e of errors) console.error(' - '+e); process.exit(1);} 
console.log(`GoalOS legal zero-data gate PASS (${htmlFiles.length}/${htmlFiles.length} HTML pages have legal rail; ${files.length} public files scanned)`);
