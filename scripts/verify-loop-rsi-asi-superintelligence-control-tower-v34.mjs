#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
const ROOT = process.cwd();
const SITE = path.join(ROOT, 'site');
const required = [
  "assets/goalos-v34-loop-rsi-asi.css",
  "assets/goalos-v34-loop-rsi-asi.js",
  "loop-rsi-asi-superintelligence-control-tower-lab.html",
  "asi-control-tower.html",
  "superintelligence-control-tower.html",
  "governed-asi-console.html",
  "asi-readiness-flight-simulator.html",
  "loop-to-rsi-to-asi-v34.html",
  "proof-gated-superintelligence.html",
  "asi-governance-dashboard.html",
  "move37-asi-control-room.html",
  "no-ungoverned-superintelligence-v34.html",
  "v34.html",
  "loop-rsi-asi-v34-manifest.json",
  "asi-control-tower-state-machine-v34.json",
  "asi-governance-console-scenarios-v34.json",
  "asi-readiness-gates-v34.json",
  "move37-asi-dossier-v34.json",
  "superintelligence-council-charter-v34.json",
  "rollback-and-containment-drill-v34.json",
  "public-safe-ai-console-boundary-v34.json",
  "rsi-source-document-index-v34.json",
  "goalos-public-demo-labs-v22-v34.json",
  "goalos-signoff-pro-site-map-v22-v34.json",
  "loop-rsi-asi-v34-demo-bundle.json"
];
let ok = true;
for (const rel of required) { if (!fs.existsSync(path.join(SITE, rel))) { console.error('Missing v34 file:', rel); ok = false; } }
const htmlPath = path.join(SITE, 'loop-rsi-asi-superintelligence-control-tower-lab.html');
const html = fs.existsSync(htmlPath) ? fs.readFileSync(htmlPath,'utf8') : '';
const mustInclude = ['GoalOS proves work','RSI governs invention','ASI must not self-authorize','No forms','No text inputs','No external AI calls','zero value moved'];
for (const token of mustInclude) { if (!html.includes(token)) { console.error('Missing required phrase:', token); ok = false; } }
const forbidden = ['<form','<input','<textarea','fetch(','XMLHttpRequest','document.cookie','localStorage.setItem'];
for (const token of forbidden) { if (html.includes(token)) { console.error('Forbidden public-site token in HTML:', token); ok = false; } }
const js = fs.existsSync(path.join(SITE,'assets/goalos-v34-loop-rsi-asi.js')) ? fs.readFileSync(path.join(SITE,'assets/goalos-v34-loop-rsi-asi.js'),'utf8') : '';
for (const token of ['fetch(','XMLHttpRequest','document.cookie','localStorage.setItem']) { if (js.includes(token)) { console.error('Forbidden public-site token in JS:', token); ok = false; } }
if (!ok) process.exit(1);
console.log('GoalOS Loop → RSI → ASI Superintelligence Control Tower Lab v34 verification PASS');
