import fs from 'node:fs';
import path from 'node:path';
const ROOT = process.cwd();
const SITE = path.join(ROOT, 'site');
const BASE = '/goalos-signoff-pro/';
const required = [
 'index.html','start.html','proof-mission.html','examples.html','evidence-docket-demo.html','verify.html','deliverables.html','pricing.html','faq.html','contact.html','request-access.html','press.html','how-it-works.html','customers.html','security.html','resources.html','status.html','changelog.html','case-studies.html','evidence-hub.html','reviewer-network.html','capability-library.html','chronicle.html','glossary.html','executive-architecture.html','implementation.html','trust-architecture.html','user-activation-manifest.json'
];
const forbidden = ['contact@montreal.ai','escrow is live','agialpha staking is live','mainnet settlement is live','user funds authorized','guaranteed ROI','guaranteed return','achieved ASI','achieved AGI','external audit completed'];
const errors = [];
function read(file){ return fs.readFileSync(path.join(SITE,file),'utf8'); }
for (const file of required) {
  const p = path.join(SITE,file);
  if (!fs.existsSync(p)) errors.push(`Missing required site file: ${file}`);
  else if (file.endsWith('.html')) {
    const html = read(file);
    if (html.length < 2400 && !['404.html'].includes(file)) errors.push(`${file} is too thin (${html.length} bytes)`);
    if (!/<main\b/i.test(html)) errors.push(`${file} lacks a main element`);
    if (/href="mailto:contact@montreal\.ai/i.test(html)) errors.push(`${file} uses disallowed email`);
    for (const phrase of forbidden) if (html.toLowerCase().includes(phrase.toLowerCase())) errors.push(`${file} contains unsupported phrase: ${phrase}`);
  }
}
function walk(dir, acc=[]){ for (const e of fs.readdirSync(dir,{withFileTypes:true})) { const p=path.join(dir,e.name); if(e.isDirectory()) walk(p,acc); else acc.push(p);} return acc; }
const files = fs.existsSync(SITE) ? walk(SITE) : [];
for (const f of files) {
  const rel = path.relative(SITE,f).replaceAll('\\','/');
  if (/\.env($|\.)|node_modules|\.git|\.next/.test(rel)) errors.push(`Forbidden file in public artifact: ${rel}`);
  if (/\.(html|js|css|json|txt|xml|svg)$/i.test(rel)) {
    const text = fs.readFileSync(f,'utf8');
    for (const phrase of forbidden) if (text.toLowerCase().includes(phrase.toLowerCase())) errors.push(`${rel} contains unsupported phrase: ${phrase}`);
  }
}
// Internal link check.
for (const f of files.filter(f=>f.endsWith('.html'))) {
  const html = fs.readFileSync(f,'utf8');
  const rel = path.relative(SITE,f).replaceAll('\\','/');
  const matches = [...html.matchAll(/href="([^"]+)"/g)].map(m=>m[1]);
  for (const h of matches) {
    if (h.startsWith('http') || h.startsWith('mailto:') || h.startsWith('#')) continue;
    if (h.startsWith(BASE)) {
      const clean = decodeURIComponent(h.slice(BASE.length).split('#')[0].split('?')[0] || 'index.html');
      const target = path.join(SITE, clean);
      if (!fs.existsSync(target)) errors.push(`${rel} links to missing ${clean}`);
    }
  }
}
const manifestPath = path.join(SITE,'user-activation-manifest.json');
if (fs.existsSync(manifestPath)) {
  const m = JSON.parse(fs.readFileSync(manifestPath,'utf8'));
  if (m.contactEmail !== 'info@quebec.ai') errors.push('manifest contactEmail is not info@quebec.ai');
  for (const f of required.filter(f=>f.endsWith('.html'))) if (!m.pages.includes(f)) errors.push(`manifest does not list ${f}`);
}
if (errors.length) {
  console.error('GoalOS website quality gate FAILED');
  for (const e of errors) console.error(' - '+e);
  process.exit(1);
}
console.log(`GoalOS website quality gate PASS (${required.length} required files checked, ${files.length} public files scanned)`);
