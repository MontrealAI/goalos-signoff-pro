
import fs from 'fs';
import path from 'path';
const root = process.cwd();
const site = path.join(root,'site');
const required = [
  'goalos-autopilot.html','autopilot.html','tell-goalos.html','universal-command-box.html','goalos-take-care-of-everything.html','mission-autopilot.html','intent-to-mission.html','v41.html','goalos-v22-v41-command-center.html',
  'assets/goalos-v41-autopilot.css','assets/goalos-v41-autopilot.js','goalos-v41-autopilot-knowledge.json','goalos-v41-contract-rails-index.json','goalos-v41-autopilot-policy.json','goalos-v41-autopilot-manifest.json'
];
let missing=[]; for(const f of required){if(!fs.existsSync(path.join(site,f))) missing.push(f)}
if(missing.length) throw new Error('Missing v41 files: '+missing.join(', '));
const html = fs.readFileSync(path.join(site,'goalos-autopilot.html'),'utf8');
const must = ['Tell GoalOS what you want','What do you want GoalOS to take care of','Run Autopilot','synthetic Mission Receipt','goalos-v41-autopilot.js'];
for(const m of must){if(!html.includes(m)) throw new Error('Missing required page text: '+m)}
const forbiddenSitePatterns = [/https:\/\/www\.googletagmanager/i,/google-analytics/i,/walletconnect/i,/eth_requestAccounts/i,/personal confidential data required/i];
for(const file of required.filter(f=>f.endsWith('.html')||f.endsWith('.js')||f.endsWith('.json'))){
  const s=fs.readFileSync(path.join(site,file),'utf8');
  for(const rx of forbiddenSitePatterns){if(rx.test(s)) throw new Error(`Forbidden pattern ${rx} in ${file}`)}
}
const policy = JSON.parse(fs.readFileSync(path.join(site,'goalos-v41-autopilot-policy.json'),'utf8'));
if(policy.externalAiCallsByDefault !== false || policy.walletActions !== false || policy.payments !== false) throw new Error('Public-safe policy flags invalid.');
const contracts = JSON.parse(fs.readFileSync(path.join(site,'goalos-v41-contract-rails-index.json'),'utf8')).contracts || [];
if(contracts.length && contracts.length !== 48) throw new Error('Expected 48 contracts when contract config is present; found '+contracts.length);
console.log(`GoalOS Universal Autopilot v41 verification PASS: ${contracts.length} contracts indexed, local question input enabled, external AI disabled by default.`);
