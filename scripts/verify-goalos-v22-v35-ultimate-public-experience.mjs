#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
const root = process.cwd();
const site = path.join(root, 'site');
const required = [
  'index.html','public-demo-labs.html','goalos-v22-v35-command-center.html','start-here.html','latest.html','command-center.html','experience.html','demo.html','proof-to-superintelligence.html','governed-superintelligence.html','v22-v35.html','start.html','website-guide.html','docs.html','documentation.html','route-catalog.html','goalos-v22-v35-route-catalog.json','goalos-v22-v35-experience-audit.json',
  'action-graph-authority-lab.html','proof-carrying-artifact-lab.html','independent-replay-lab.html','proofzero-planning-lab.html','mission-foundry-lab.html','process-evidence-lab.html','blockchain-credibility-lab.html','blockchain-proof-mandate-lab.html','proof-before-settlement-research-lab.html','executive-ai-proof-console.html','from-loop-to-rsi-lab.html','loop-rsi-asi-superintelligence-lab.html','loop-rsi-asi-superintelligence-control-tower-lab.html','loop-rsi-asi-superintelligence-mission-simulator-lab.html'
];
const errors = [];
const exists = rel => fs.existsSync(path.join(site, rel));
const read = rel => exists(rel) ? fs.readFileSync(path.join(site, rel), 'utf8') : '';
for (const rel of required) if (!exists(rel)) errors.push(`Missing ${rel}`);
const htmls = fs.existsSync(site) ? fs.readdirSync(site, {recursive:true}).filter(f => f.endsWith('.html')) : [];
if (htmls.length < 100) errors.push(`Expected a complete site with at least 100 HTML pages, found ${htmls.length}`);
for (const rel of htmls) {
  const html = read(rel);
  const rails = (html.match(/data-goalos-legal-rail="v12"/g)||[]).length;
  const footers = (html.match(/<footer\b/gi)||[]).length;
  if (rails !== 1) errors.push(`${rel}: expected one legal rail, found ${rails}`);
  if (footers !== 1) errors.push(`${rel}: expected one footer, found ${footers}`);
}
const home = read('index.html');
for (const phrase of ['complete public labs v22-v35','Start with one command center','v35 mission simulator']) if (!home.includes(phrase)) errors.push(`Homepage missing: ${phrase}`);
if (/flagship public labs v22-v30/.test(home)) errors.push('Homepage still contains stale v22-v30 flagship framing');
const command = read('goalos-v22-v35-command-center.html');
for (const phrase of ['Complete v22-v35 public experience','Choose your role','Proof Before Settlement','RSI governs invention','ASI must not self-authorize','Open recommended lab']) if (!command.includes(phrase)) errors.push(`Command center missing: ${phrase}`);
const catalog = read('public-demo-labs.html');
for (const lab of ['v22','v23','v24','v25','v26','v27','v28','v29','v30','v31','v32','v33','v34','v35']) if (!catalog.includes(lab)) errors.push(`Public lab catalog missing ${lab}`);
const json = JSON.parse(read('goalos-v22-v35-route-catalog.json') || '{}');
if (!Array.isArray(json.labs) || json.labs.length !== 14) errors.push('Route catalog JSON must list exactly 14 public labs from v22-v35');
const boundary = ['No forms','no text inputs','no uploads','no cookies','no analytics','no wallets','no payments','no external AI calls','zero value moved'];
const all = [home, command, catalog, read('website-guide.html')].join('\n');
for (const phrase of boundary) if (!all.toLowerCase().includes(phrase.toLowerCase())) errors.push(`Missing public-safe boundary phrase: ${phrase}`);
if (errors.length) { console.error('GoalOS v22-v35 ultimate public experience verification FAILED'); errors.slice(0,100).forEach(e=>console.error(' - '+e)); process.exit(1); }
console.log(`GoalOS v22-v35 ultimate public experience verification PASS: ${htmls.length} HTML pages and 14 labs checked.`);
