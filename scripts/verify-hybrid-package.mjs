import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const root = path.resolve(import.meta.dirname, '..');
const required = [
  'README.md','START_HERE.html','SUPABASE_SETUP.sql','SUPABASE_HYBRID_ADDONS.sql',
  'contracts/GoalOSSignoffAnchorV1.sol','blockchain/package.json','blockchain/scripts/compile-anchor.mjs',
  'services/anchor-relayer/package.json','services/anchor-relayer/src/relayer.mjs',
  'config/hybrid-launch-gates.json','config/goalos-48-contract-integration-map.json',
  'docs/HYBRID_PRODUCT_SPEC.md','docs/BLOCKCHAIN_ANCHORING_GUIDE.md','docs/AGIALPHA_AND_48_CONTRACT_PATH.md','docs/COSTS_AND_PRICING_HYBRID.md','docs/MAINNET_AND_ESCROW_BOUNDARY.md'
];
const missing = required.filter(f => !fs.existsSync(path.join(root, f)));
if (missing.length) throw new Error('Missing hybrid files: ' + missing.join(', '));
const contract = fs.readFileSync(path.join(root, 'contracts/GoalOSSignoffAnchorV1.sol'), 'utf8');
const disallowed = [/IERC20/, /safeTransferFrom\(/, /transferFrom\(/, /withdraw\(/i];
const found = disallowed.filter(re => re.test(contract)).map(String);
if (found.length) throw new Error('Anchor contract contains custody-like patterns: ' + found.join(', '));
for (const f of ['SUPABASE_HYBRID_ADDONS.sql','services/anchor-relayer/src/relayer.mjs','.env.example']) {
  const text = fs.readFileSync(path.join(root, f), 'utf8');
  if (/PRIVATE_KEY=.*[0-9a-fA-F]{32,}/.test(text)) throw new Error(`Possible secret in ${f}`);
}
const manifest = [];
function walk(dir) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    const rel = path.relative(root, p);
    if (['node_modules','.next','dist','.git'].some(skip => rel.split(path.sep).includes(skip))) continue;
    if (ent.isDirectory()) walk(p);
    else manifest.push({ path: rel, sha256: crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex'), bytes: fs.statSync(p).size });
  }
}
walk(root);
fs.mkdirSync(path.join(root, 'verification'), { recursive: true });
fs.writeFileSync(path.join(root, 'verification/hybrid-package-verification.json'), JSON.stringify({ status: 'PASS', checkedAt: new Date().toISOString(), files: manifest.length, requiredFiles: required.length, packageRoot: path.basename(root) }, null, 2) + '\n');
console.log('GoalOS Signoff hybrid package verification PASS');
