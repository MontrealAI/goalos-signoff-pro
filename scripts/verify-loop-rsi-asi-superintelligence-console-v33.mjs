#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd();
const site=path.join(root,'site');
const required=[
  'loop-rsi-asi-superintelligence-lab.html',
  'loop-to-rsi-to-asi.html',
  'asi-superintelligence-console.html',
  'assets/goalos-v33-loop-rsi-asi-console.css',
  'assets/goalos-v33-loop-rsi-asi-console.js',
  'loop-rsi-asi-superintelligence-v33-manifest.json',
  'loop-rsi-asi-state-machine-v33.json',
  'asi-readiness-governance-boundary-v33.json',
  'rsi-to-asi-escalation-gates-v33.json',
  'move37-to-asi-dossier-template-v33.json',
  'superintelligence-readiness-rubric-v33.json',
  'loop-rsi-asi-console-script-v33.json',
  'loop-rsi-asi-demo-bundle-v33.json',
  'goalos-public-demo-labs-v22-v33.json'
];
const missing=required.filter(f=>!fs.existsSync(path.join(site,f)));
if(missing.length){console.error('Missing v33 files:',missing.join(', ')); process.exit(1)}
const html=fs.readFileSync(path.join(site,'loop-rsi-asi-superintelligence-lab.html'),'utf8');
const must=['Loop to RSI to','ASI Superintelligence','No Proof.','No ungoverned superintelligence','no external AI calls','Synthetic Mission Receipt'];
const absent=must.filter(s=>!html.includes(s));
if(absent.length){console.error('Missing required copy:',absent.join(', ')); process.exit(1)}
const forbidden=[/<form\b/i,/<input\b/i,/<textarea\b/i,/fetch\s*\(/i,/XMLHttpRequest/i,/localStorage/i,/document\.cookie/i,/window\.ethereum/i,/WalletConnect/i,/stripe/i,/paypal/i,/gtag\s*\(/i,/analytics\.js/i];
const corpus=html+'\n'+fs.readFileSync(path.join(site,'assets','goalos-v33-loop-rsi-asi-console.js'),'utf8');
const bad=forbidden.filter(rx=>rx.test(corpus)).map(String);
if(bad.length){console.error('Forbidden public-safety pattern detected:',bad.join(', ')); process.exit(1)}
const boundary=JSON.parse(fs.readFileSync(path.join(site,'asi-readiness-governance-boundary-v33.json'),'utf8'));
if(boundary.notAchievedASI!==true || boundary.valueMoved!==0 || boundary.noExternalAiCalls!==true){console.error('Public safety boundary is not strict enough.'); process.exit(1)}
const manifest=JSON.parse(fs.readFileSync(path.join(site,'loop-rsi-asi-superintelligence-v33-manifest.json'),'utf8'));
if(!manifest.publicSafe || !manifest.zeroValueMoved || manifest.publicSafety?.claimsAchievedASI!==false){console.error('Manifest boundary failed.'); process.exit(1)}
console.log('GoalOS Loop → RSI → ASI Superintelligence Console Lab v33 verification PASS');
