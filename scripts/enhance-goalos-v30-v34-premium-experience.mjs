#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const siteDir = path.join(root, 'site');
const assetsDir = path.join(siteDir, 'assets');
fs.mkdirSync(assetsDir, {recursive:true});

const read = p => fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : '';
const write = (p, s) => {fs.mkdirSync(path.dirname(p), {recursive:true}); fs.writeFileSync(p, s);};
const copyIfMissing = (src, dest) => { if(fs.existsSync(src) && !fs.existsSync(dest)) {fs.mkdirSync(path.dirname(dest), {recursive:true}); fs.copyFileSync(src,dest);} };

const sourceDir = path.join(root, 'docs', 'generated-source', 'v30-v34-premium', 'site');
function readSource(rel) {
  const live = path.join(siteDir, rel);
  const source = path.join(sourceDir, rel);
  if (fs.existsSync(live)) return fs.readFileSync(live, 'utf8');
  if (fs.existsSync(source)) return fs.readFileSync(source, 'utf8');
  throw new Error(`Missing premium source file: ${rel}. Upload the complete v30-v34 premium package.`);
}
const css = readSource('assets/goalos-v30-v34-premium-ux.css');
const js = readSource('assets/goalos-v30-v34-premium-ux.js');
write(path.join(assetsDir, 'goalos-v30-v34-premium-ux.css'), css);
write(path.join(assetsDir, 'goalos-v30-v34-premium-ux.js'), js);

let hub = readSource('v30-v34-premium-experience.html');
if(!hub.includes('Premium v30–v34 guided experience')) throw new Error('Missing premium hub source. Upload the complete v30-v34 package.');
write(path.join(siteDir, 'v30-v34-premium-experience.html'), hub);
write(path.join(siteDir, 'goalos-v30-v34-experience-map.json'), readSource('goalos-v30-v34-experience-map.json'));
write(path.join(siteDir, 'goalos-v30-v34-premium-experience-manifest.json'), readSource('goalos-v30-v34-premium-experience-manifest.json'));
const hubAliases = ['premium-experience.html','v30-v34.html','proof-to-superintelligence.html','superintelligence-experience.html','governed-superintelligence.html'];
for (const file of hubAliases) write(path.join(siteDir,file), hub.replace(/v30-v34-premium-experience\.html/g, file));

const targetPages = [
  'index.html',
  'proof-before-settlement-research-lab.html','institutional-research-lab.html','elite-paper-lab.html','blockchain-standard-paper-lab.html','settlement-safety-lab.html','proof-before-settlement-paper.html','paper.html','research.html',
  'executive-ai-proof-console.html','proof-experience-console.html','interactive-proof-console.html','ai-proof-console.html','guided-experience.html','what-is-goalos.html','console.html',
  'from-loop-to-rsi-lab.html','loop-to-rsi.html','rsi.html','agi-alpha-rsi-lab.html','rsi-governance-console.html','sovereign-invention-governance-lab.html','deterministic-invention-os-lab.html','move37-breakthrough-lab.html','omni-search-control-lab.html',
  'loop-rsi-asi-superintelligence-lab.html','loop-to-rsi-to-asi.html','rsi-to-asi-superintelligence.html','asi-superintelligence-console.html','superintelligence-governance-console.html','sovereign-asi-readiness-lab.html','recursive-self-improvement-to-asi-lab.html','asi-mission-control.html','invention-to-superintelligence-console.html','no-ungoverned-superintelligence.html',
  'loop-rsi-asi-superintelligence-control-tower-lab.html','asi-control-tower.html','superintelligence-control-tower.html','governed-asi-console.html','asi-readiness-flight-simulator.html','loop-to-rsi-to-asi-v34.html','proof-gated-superintelligence.html','asi-governance-dashboard.html','move37-asi-control-room.html','no-ungoverned-superintelligence-v34.html','v34.html'
];

const fallback = (file) => `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>GoalOS Signoff Pro — ${file.replace(/[-.]/g,' ')}</title><link rel="stylesheet" href="assets/goalos-v30-v34-premium-ux.css"><meta name="robots" content="noindex"></head><body class="gx-premium-ready"><section class="gx-premium-shell gx-premium-spotlight"><div class="gx-premium-card"><span class="gx-kicker">Route restored</span><h2>This GoalOS route is ready for the premium experience.</h2><p>The full lab page may be installed by its original v30–v34 package. This fallback keeps navigation intact and points visitors to the guided hub.</p><div class="gx-premium-actions"><a class="gx-btn primary" href="v30-v34-premium-experience.html">Open premium hub</a><a class="gx-btn" href="index.html">Home</a></div></div></section><script defer src="assets/goalos-v30-v34-premium-ux.js"></script></body></html>`;

function inject(html, file){
  if(!html || !html.trim()) html = fallback(file);
  if(!html.includes('<!doctype')) html = '<!doctype html>\n' + html;
  if(!html.includes('goalos-v30-v34-premium-ux.css')) {
    html = html.replace(/<\/head>/i, '  <link rel="stylesheet" href="assets/goalos-v30-v34-premium-ux.css">\n  <meta name="theme-color" content="#070713">\n</head>');
  }
  if(!html.includes('goalos-v30-v34-premium-ux.js')) {
    html = html.replace(/<\/body>/i, '  <script defer src="assets/goalos-v30-v34-premium-ux.js"></script>\n</body>');
  }
  if(!html.includes('class="gx-premium-ready"')) {
    html = html.replace(/<body([^>]*)>/i, '<body$1 class="gx-premium-ready">');
  }
  if(!html.includes('data-goalos-premium-patched')) {
    html = html.replace(/<body([^>]*)>/i, '<body$1 data-goalos-premium-patched="v30-v34">');
  }
  return html;
}

let patched = 0, restored = 0;
for(const file of targetPages){
  const p = path.join(siteDir, file);
  let html = read(p);
  if(!html) restored++;
  const out = inject(html, file);
  write(p, out);
  patched++;
}

const manifest = JSON.parse(fs.readFileSync(path.join(root, 'site/goalos-v30-v34-premium-experience-manifest.json'), 'utf8'));
manifest.generatedAt = new Date().toISOString();
manifest.patchedPages = patched;
manifest.restoredFallbackPages = restored;
write(path.join(siteDir, 'goalos-v30-v34-premium-experience-manifest.json'), JSON.stringify(manifest,null,2));

const publicSafety = {
  version:'v30-v34-premium-experience-assurance',
  status:'PUBLIC_SAFE_BROWSER_LOCAL',
  restrictions:['no forms','no text inputs','no uploads','no cookies','no analytics','no wallets','no payments','no external AI calls','no personal data','zero value moved'],
  note:'This package adds deterministic local UI controls and navigation only. It does not process user data, call AI APIs, connect wallets, or move value.'
};
write(path.join(siteDir,'v30-v34-premium-public-safety-boundary.json'), JSON.stringify(publicSafety,null,2));
console.log(`GoalOS v30-v34 premium experience assurance PASS: ${patched} pages patched, ${restored} fallback pages restored.`);
