#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = process.cwd();
const cfgPath = path.join(root, 'config', 'capability-compounding-lab.json');
const cfg = fs.existsSync(cfgPath) ? JSON.parse(fs.readFileSync(cfgPath, 'utf8')) : JSON.parse(fs.readFileSync(new URL('../config/capability-compounding-lab.json', import.meta.url), 'utf8'));
const scenarioId = process.env.GOALOS_COMPOUNDING_SCENARIO || process.env.SCENARIO || process.argv[2] || 'research';
const outDir = path.join(root, 'artifacts', 'capability-compounding-lab', scenarioId);
fs.mkdirSync(outDir, { recursive: true });
const sha256 = v => crypto.createHash('sha256').update(typeof v === 'string' ? v : JSON.stringify(v)).digest('hex');
const scenario = cfg.scenarios.find(s => s.id === scenarioId) || cfg.scenarios[0];
const cycles = cfg.cycles.map((c, idx) => ({
  ...c,
  scenario: scenario.id,
  mission_contract_hash: sha256(['mission', scenario.id, c.id, c.stage]),
  proof_packet_hash: sha256(['proof', scenario.id, c.id, c.capability]),
  evidence_docket_hash: sha256(['docket', scenario.id, c.id, c.verifiedWork, c.proofDebt]),
  selection_certificate_hash: sha256(['selection', scenario.id, c.id, 'accept_for_demo_chronicle']),
  chronicle_entry_id: `chronicle:${scenario.id}:${c.id}:accepted`,
  capability_package: {
    id: `${c.capability}:${scenario.id}`,
    proof_history: [`proof:${scenario.id}:${c.id}`],
    initiation_condition: `future public-safe ${scenario.domain} mission with matching acceptance criteria`,
    reuse_scope: 'synthetic public demo only',
    value_moved: 0
  }
}));
const files = {
  '00_manifest.json': { schema:'goalos.capability_compounding.bundle_manifest.v2', version:cfg.version, scenario, generated_at:new Date(0).toISOString(), public_site_rule:cfg.publicSiteRule, claim_boundary:cfg.claimBoundary },
  '01_mission_series.json': { scenario, cycles: cycles.map(c => ({ id:c.id, name:c.name, stage:c.stage, capability:c.capability })) },
  '02_evidence_docket.json': { schema:'goalos.evidence_docket.capability_compounding_demo.v2', claims: cycles.map(c => ({ mission:c.id, claim:`${c.capability} is reusable for the next synthetic mission`, evidenceDocketHash:c.evidence_docket_hash, proofPacketHash:c.proof_packet_hash })) },
  '03_capability_library.json': { schema:'goalos.capability_library.demo.v2', capabilities: cycles.map(c => c.capability_package) },
  '04_chronicle_entry.json': { schema:'goalos.chronicle.demo.v2', entries: cycles.map(c => ({ id:c.chronicle_entry_id, evidenceDocketHash:c.evidence_docket_hash, capability:c.capability_package.id })) },
  '05_scoreboard.json': { verifiedWork:`${cycles[0].verifiedWork}→${cycles.at(-1).verifiedWork}`, proofDebt:`${cycles[0].proofDebt}→${cycles.at(-1).proofDebt}`, costIndex:`${cycles[0].costIndex}→${cycles.at(-1).costIndex}`, riskIndex:`${cycles[0].riskIndex}→${cycles.at(-1).riskIndex}` },
  'README.md': `# GoalOS Capability Compounding Lab Demo\n\nScenario: ${scenario.name}\n\nThis public-safe synthetic bundle demonstrates the GoalOS rule: accepted proof becomes reusable capability, reusable capability lowers proof debt, and only proof-carrying work enters Chronicle memory.\n\nNo user data, uploads, wallets, payments, cookies, analytics, or value movement are involved.\n`
};
for (const [name, content] of Object.entries(files)) fs.writeFileSync(path.join(outDir, name), typeof content === 'string' ? content : JSON.stringify(content, null, 2));
console.log(`Capability Compounding Lab bundle generated at ${outDir}`);
