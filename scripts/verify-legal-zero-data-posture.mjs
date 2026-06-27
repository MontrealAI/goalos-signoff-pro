import fs from 'node:fs';
import path from 'node:path';
const ROOT=process.cwd();
const SITE=path.join(ROOT,'site');
const required=['no-user-data.html','privacy.html','terms.html','legal.html','data-policy.html','acceptable-use.html','investment-boundary.html','cookie-policy.html','subprocessors.html','security-boundary.html','legal-zero-data-manifest.json'];
const errors=[];
for(const f of required){const p=path.join(SITE,f); if(!fs.existsSync(p)) errors.push(`Missing legal public file: ${f}`); else if(f.endsWith('.html')){const h=fs.readFileSync(p,'utf8'); if(h.length<2600) errors.push(`${f} is too thin`); if(!h.includes('No user data') && !h.includes('No User Data') && f==='no-user-data.html') errors.push('no-user-data page lacks clear heading');}}
function walk(d,a=[]){for(const e of fs.readdirSync(d,{withFileTypes:true})){const p=path.join(d,e.name); if(e.isDirectory()) walk(p,a); else a.push(p);} return a;}
const files=walk(SITE);
const forbidden=[
 /contact@montreal\.ai/i,
 /we collect user data/i,
 /upload your personal data/i,
 /send confidential files/i,
 /send health data/i,
 /send payment data/i,
 /investment opportunity/i,
 /guaranteed returns/i,
 /expectation of profit from others/i,
 /purchase\s+(a\s+)?token/i,
 /buy\s+(the\s+)?token/i,
 /token sale is live/i,
 /securities offering is live/i,
 /production escrow is live/i,
 /mainnet settlement is live/i,
 /AGIALPHA staking is live/i,
 /<form\b/i,
 /google-analytics\.com|googletagmanager\.com|facebook\.net|doubleclick\.net|segment\.com|mixpanel\.com|plausible\.io/i,
 /document\.cookie\s*=/i,
 /walletconnect|connect wallet/i
];
for(const f of files){const rel=path.relative(SITE,f).replaceAll('\\','/'); if(/\.env($|\.)|node_modules|\.git|\.next/.test(rel)) errors.push(`Forbidden public artifact file: ${rel}`); if(/\.(html|js|css|json|txt|svg|xml)$/i.test(rel)){const t=fs.readFileSync(f,'utf8'); for(const re of forbidden) if(re.test(t)) errors.push(`${rel} matches forbidden pattern ${re}`); }}
const allHtml=files.filter(f=>f.endsWith('.html'));
let legalRailCount=0;
for(const f of allHtml){const h=fs.readFileSync(f,'utf8'); if(h.includes('legal-rail')) legalRailCount++;}
if(legalRailCount < Math.max(8, Math.floor(allHtml.length*0.75))) errors.push(`Legal rail only found on ${legalRailCount}/${allHtml.length} pages`);
const manifest=path.join(SITE,'legal-zero-data-manifest.json');
if(fs.existsSync(manifest)){const m=JSON.parse(fs.readFileSync(manifest,'utf8')); if(m.contactEmail!=='info@quebec.ai') errors.push('legal manifest contact is not info@quebec.ai'); if(m.posture!=='public-site-zero-user-data-by-design') errors.push('legal manifest posture mismatch');}
if(errors.length){console.error('GoalOS legal zero-data gate FAILED'); for(const e of errors) console.error(' - '+e); process.exit(1);} 
console.log(`GoalOS legal zero-data gate PASS (${required.length} legal files, ${files.length} public files scanned)`);
