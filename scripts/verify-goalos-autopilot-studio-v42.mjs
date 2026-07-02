import fs from 'node:fs';
import path from 'node:path';
const root = process.cwd();
const site = path.join(root, 'site');
const required = [
  'goalos-autopilot-studio.html',
  'goalos-v22-v42-command-center.html',
  'goalos-v42-autopilot-knowledge.json',
  'goalos-v42-autopilot-manifest.json',
  'assets/goalos-v42-autopilot.css',
  'assets/goalos-v42-autopilot.js'
];
let errors = [];
for (const f of required) if (!fs.existsSync(path.join(site, f))) errors.push(`Missing ${f}`);
const html = fs.existsSync(path.join(site,'goalos-autopilot-studio.html')) ? fs.readFileSync(path.join(site,'goalos-autopilot-studio.html'),'utf8') : '';
for (const token of ['Tell GoalOS what you want','goalosIntent','Copy receipt']) if (!html.includes(token)) errors.push(`Autopilot page missing token: ${token}`);
const lowerHtml = html.toLowerCase();
for (const token of ['no uploads','no external ai']) if (!lowerHtml.includes(token)) errors.push(`Autopilot page missing public-safe token: ${token}`);
const js = fs.existsSync(path.join(site,'assets/goalos-v42-autopilot.js')) ? fs.readFileSync(path.join(site,'assets/goalos-v42-autopilot.js'),'utf8') : '';
for (const banned of ['localStorage.setItem','document.cookie','fetch("https://','fetch(\'https://']) if (js.includes(banned)) errors.push(`Public-safe JS check failed: ${banned}`);
let knowledge = null;
try { knowledge = JSON.parse(fs.readFileSync(path.join(site,'goalos-v42-autopilot-knowledge.json'),'utf8')); } catch (e) { errors.push('Knowledge JSON is invalid'); }
if (knowledge) {
  if ((knowledge.contracts || []).length < 40) errors.push(`Expected at least 40 contract rails indexed, found ${(knowledge.contracts || []).length}`);
  if ((knowledge.missionTypes || []).length < 8) errors.push('Expected at least 8 mission types');
  if (!knowledge.publicSafe && !knowledge.boundary) errors.push('Public-safe boundary missing');
}
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
console.log(`GoalOS Universal Outcome Autopilot Studio v42 verification PASS: ${knowledge.contracts.length} contracts indexed; local text input enabled; no external AI by default.`);
