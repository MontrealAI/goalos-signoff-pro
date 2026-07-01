import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const ROOT = process.cwd();
const REPORT_DIR = path.join(ROOT, 'verification');
const REPORT_PATH = path.join(REPORT_DIR, 'sovereign-machine-economy-parity-report.json');
const configPath = path.join(ROOT, 'config', 'sovereign-machine-economy.json');
const schemaPath = path.join(ROOT, 'schemas', 'sovereign-machine-economy.schema.json');
const generatorPath = path.join(ROOT, 'scripts', 'build-sovereign-machine-economy-pages.mjs');
const implDir = path.join(ROOT, 'src', 'lib', 'sovereign-machine-economy');

function exists(file) { return fs.existsSync(file); }
function read(file) { return fs.readFileSync(file, 'utf8'); }
function readJson(file) { return JSON.parse(read(file)); }
function sha(file) { return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex'); }
function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}
function assert(condition, message, failures) { if (!condition) failures.push(message); }

const failures = [];
const warnings = [];
assert(exists(configPath), 'Missing config/sovereign-machine-economy.json', failures);
assert(exists(schemaPath), 'Missing schemas/sovereign-machine-economy.schema.json', failures);
assert(exists(generatorPath), 'Missing scripts/build-sovereign-machine-economy-pages.mjs', failures);
assert(exists(path.join(ROOT, '.github', 'workflows', 'sovereign-machine-economy.yml')), 'Missing autonomous Sovereign Machine Economy workflow', failures);
assert(exists(path.join(ROOT, '.github', 'workflows', 'pages.yml')), 'Missing GitHub Pages workflow', failures);

const implFiles = [
  'types.ts',
  'canonical.ts',
  'validate.ts',
  'index.ts',
  'validate.test.ts'
];
for (const file of implFiles) assert(exists(path.join(implDir, file)), `Missing implementation file src/lib/sovereign-machine-economy/${file}`, failures);

let config = null;
if (exists(configPath)) {
  config = readJson(configPath);
  assert(config.repository === 'MontrealAI/goalos-signoff-pro', 'Config repository must remain MontrealAI/goalos-signoff-pro', failures);
  assert(config.pilotEmail === 'info@quebec.ai', 'Pilot email must be info@quebec.ai', failures);
  assert(Array.isArray(config.modules) && config.modules.length >= 6, 'At least six economy modules are required', failures);
  assert(Array.isArray(config.previousIterationMapping) && config.previousIterationMapping.length >= 3, 'Previous iteration mapping must cover Agent, Node, and Jobs surfaces', failures);
  assert(config.publicPages.some((page) => page.file === 'sovereign-machine-economy.html'), 'Sovereign Machine Economy page must be generated', failures);
}

const requiredTerms = [
  'GoalOSCommit', 'RunCommitment', 'ProofPacket', 'EvalAttestation', 'SelectionCertificate', 'EvolutionLedgerEntry', 'EvidenceDocket', 'GovernedDecisionState'
];
const implText = walk(implDir).filter((file) => file.endsWith('.ts')).map(read).join('\n');
for (const term of requiredTerms) assert(implText.includes(term), `Implementation does not define or expose ${term}`, failures);
assert(implText.includes('human_final'), 'Implementation must represent human final authority', failures);
assert(implText.includes('publicPrivateBoundary'), 'Implementation must represent public/private proof boundary', failures);
assert(implText.includes('rollback'), 'Implementation must represent rollback/revision path', failures);

const websiteText = [generatorPath, configPath].filter(exists).map(read).join('\n');
const unsupportedClaims = [
  'user funds authorized',
  'Mainnet settlement is live',
  'AGIALPHA staking is live',
  'autonomous acceptance',
  'guaranteed return',
  'realized AGI',
  'realized ASI',
  'superintelligence achieved'
];
for (const claim of unsupportedClaims) {
  const allowedInHardNo = config && Array.isArray(config.hardNoClaims) && config.hardNoClaims.includes(claim);
  if (websiteText.includes(claim) && !allowedInHardNo) failures.push(`Unsupported public claim found outside hardNoClaims: ${claim}`);
}

const packageLock = path.join(ROOT, 'package-lock.json');
if (exists(packageLock)) {
  const lock = read(packageLock);
  if (lock.includes('packages.applied-caas-gateway') || lock.includes('internal.api.openai')) failures.push('Root package-lock.json still references internal package registry');
}
const blockchainLock = path.join(ROOT, 'blockchain', 'package-lock.json');
if (exists(blockchainLock)) {
  const lock = read(blockchainLock);
  if (lock.includes('packages.applied-caas-gateway') || lock.includes('internal.api.openai')) failures.push('blockchain/package-lock.json still references internal package registry');
}

const report = {
  status: failures.length ? 'FAIL' : 'PASS',
  generatedAt: new Date().toISOString(),
  repository: 'MontrealAI/goalos-signoff-pro',
  files: {
    config: exists(configPath) ? sha(configPath) : null,
    schema: exists(schemaPath) ? sha(schemaPath) : null,
    generator: exists(generatorPath) ? sha(generatorPath) : null,
    implementationFiles: Object.fromEntries(implFiles.map((file) => {
      const full = path.join(implDir, file);
      return [file, exists(full) ? sha(full) : null];
    }))
  },
  capabilities: [
    'Mission commitments',
    'Bounded run commitments',
    'Proof packets',
    'Evidence dockets',
    'Evaluator attestations',
    'Human acceptance gate',
    'Selection certificates',
    'Evolution ledger entries',
    'Governed decision state',
    'Reusable capability chronicle',
    'Public website generation',
    'Claim boundary guardrail'
  ],
  warnings,
  failures
};
fs.mkdirSync(REPORT_DIR, { recursive: true });
fs.writeFileSync(REPORT_PATH, `${JSON.stringify(report, null, 2)}\n`);
console.log(`GoalOS Sovereign Machine Economy parity: ${report.status}`);
console.log(`Report: ${path.relative(ROOT, REPORT_PATH)}`);
if (failures.length) {
  console.error(failures.map((failure) => `- ${failure}`).join('\n'));
  process.exit(1);
}
