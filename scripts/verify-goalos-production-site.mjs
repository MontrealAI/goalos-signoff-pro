#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
const ROOT = process.cwd();
const SITE = path.join(ROOT, 'site');
const requiredPages = ['index.html','browser-beta.html','mission-001.html','mission-001-replay.html','benchmark-reproducibility.html','benchmark-packet.html','coordination-benchmark.html','evidence-docket-demo.html','verify.html','proof-gated-coordination.html','coordination-lab.html','no-user-data.html','agialpha-token-boundary.html'];
const requiredPacket = ['mission-001/00_manifest.json','mission-001/01_mission_contract.json','mission-001/02_environment.json','mission-001/03_benchmark_tasks.json','mission-001/04_baselines.json','mission-001/05_runner_config.json','mission-001/06_proof_bundle.json','mission-001/07_replay_log.ndjson','mission-001/08_cost_ledger.json','mission-001/09_safety_ledger.json','mission-001/10_validator_report.json','mission-001/11_scoreboard.json','mission-001/12_claims_matrix.json','mission-001/README.md','mission-001-benchmark-packet.json'];
let failures = [];
const exists = rel => fs.existsSync(path.join(SITE, rel));
for (const rel of [...requiredPages, ...requiredPacket]) if (!exists(rel)) failures.push(`Missing required file: ${rel}`);
const htmlFiles = fs.existsSync(SITE) ? fs.readdirSync(SITE,{recursive:true}).filter(f=>f.endsWith('.html')) : [];
if (htmlFiles.length < 50) failures.push(`Expected at least 50 HTML pages, found ${htmlFiles.length}`);
const badFragments = [/<form\b/i, /<input\b/i, /<textarea\b/i, /<select\b/i, /contact@montreal\.ai/i, /guaranteed\s+(return|profit|yield|roi)/i, /live\s+(escrow|staking|mainnet\s+settlement)/i, /connect\s+wallet/i, /walletconnect/i, /document\.cookie/i, /localStorage\b/i, /sessionStorage\b/i, /google-analytics/i, /gtag\(/i, /plausible/i];
for (const rel of htmlFiles) {
  const content = fs.readFileSync(path.join(SITE,rel),'utf8');
  if ((content.match(/data-goalos-legal-rail="v12"/g)||[]).length !== 1) failures.push(`${rel} must contain exactly one v12 legal rail`);
  if ((content.match(/<footer\b/gi)||[]).length !== 1) failures.push(`${rel} must contain exactly one footer`);
  if (content.length < 1800) failures.push(`${rel} is too thin (${content.length} bytes)`);
  for (const re of badFragments) if (re.test(content)) failures.push(`${rel} contains blocked fragment ${re}`);
}
function read(rel){return fs.existsSync(path.join(SITE,rel)) ? fs.readFileSync(path.join(SITE,rel),'utf8') : ''}
const home = read('index.html');
if (home.indexOf('Benchmark-ready proof') < 0 || home.indexOf('Mission 001') < 0) failures.push('Homepage does not expose Mission 001 benchmark-ready proof section');
if (home.indexOf('Benchmark-ready proof') > home.indexOf('<footer')) failures.push('Homepage benchmark section appears after footer');
const mission = read('mission-001.html');
for (const phrase of ['mission contract','environment','B0-B6','runner config','proof bundle','replay log','cost ledger','safety ledger','validator report','scoreboard','claims matrix']) {
  if (!mission.toLowerCase().includes(phrase.toLowerCase())) failures.push(`mission-001.html missing reproducibility detail: ${phrase}`);
}
const score = JSON.parse(read('mission-001/11_scoreboard.json') || '{}');
if (!Array.isArray(score.baselines) || score.baselines.length < 7) failures.push('Scoreboard must contain B0-B6 baselines');
const safety = JSON.parse(read('mission-001/09_safety_ledger.json') || '{}');
if (safety.criticalSafetyIncidents !== 0 || safety.personalDataRequested !== false || safety.walletConnection !== false) failures.push('Safety ledger does not preserve zero-user-data/no-wallet posture');
const manifest = JSON.parse(read('mission-001/00_manifest.json') || '{}');
if (!manifest.requiredFiles || manifest.requiredFiles.length < 14) failures.push('Mission 001 manifest missing required file list');
if (failures.length) { console.error('GoalOS production site gate FAILED'); failures.slice(0,60).forEach(f=>console.error('- '+f)); process.exit(1); }
console.log(`GoalOS production site gate PASS (${htmlFiles.length} HTML pages, ${requiredPacket.length} packet files checked)`);
