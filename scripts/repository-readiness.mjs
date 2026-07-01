import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const required = [
  'README.md',
  'LICENSE',
  'SECURITY.md',
  'CONTRIBUTING.md',
  'GOVERNANCE.md',
  'MAINTAINERS.md',
  '.github/CODEOWNERS',
  '.github/PULL_REQUEST_TEMPLATE.md',
  '.github/dependabot.yml',
  '.github/workflows/ci.yml',
  'docs/repository/GITHUB_UPLOAD_GUIDE.md',
  'docs/repository/REPOSITORY_SETTINGS_CHECKLIST.md',
  'docs/PRO_V1_1_PRODUCT_SPEC.md',
  'docs/PRO_V1_1_LAUNCH_PLAYBOOK.md',
  'supabase/migrations',
  'src',
  'schemas',
  'config/hybrid-launch-gates.json'
];
const forbiddenNames = new Set(['.env', '.env.local', '.env.production']);
const forbiddenDirs = new Set(['node_modules', '.next']);
const forbiddenPatterns = [
  /-----BEGIN [A-Z ]*PRIVATE KEY-----/i,
  /sk_live_[0-9A-Za-z]{16,}/,
  /rk_live_[0-9A-Za-z]{16,}/,
  /whsec_[0-9A-Za-z]{16,}/,
  /supabase_service_role_[0-9A-Za-z_-]{16,}/i
];
const scanSkipPrefixes = ['docs/', 'README.md', 'SECURITY.md', 'CONTRIBUTING.md', 'GOVERNANCE.md', 'MAINTAINERS.md', 'GITHUB_REPOSITORY_START_HERE.html', '.env.example', 'scripts/repository-readiness.mjs'];
function exists(rel){ return fs.existsSync(path.join(root, rel)); }
function walk(dir, rows=[]){
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const rel = path.relative(root, full).replaceAll(path.sep, '/');
    const st = fs.statSync(full);
    if (st.isDirectory()) {
      if (forbiddenDirs.has(name)) rows.push({type:'forbidden-dir', rel});
      else walk(full, rows);
    } else {
      rows.push({type:'file', rel, full, name, size: st.size});
    }
  }
  return rows;
}
const failures=[];

const codeownersPath = path.join(root, '.github/CODEOWNERS');
if (fs.existsSync(codeownersPath)) {
  const activeLines = fs.readFileSync(codeownersPath, 'utf8').split(/\r?\n/).filter(line => line.trim() && !line.trim().startsWith('#'));
  if (!activeLines.some(line => line.includes('@' + 'MontrealAI'))) failures.push('MontrealAI-owned package must include active @MontrealAI CODEOWNERS rules');
  if (activeLines.some(line => /__CODEOWNER__|@your-github|@your-org|@your-/.test(line))) failures.push('CODEOWNERS contains active placeholder owner text');
}
const maintainersPath = path.join(root, 'MAINTAINERS.md');
if (fs.existsSync(maintainersPath) && !fs.readFileSync(maintainersPath, 'utf8').includes('@' + 'MontrealAI')) failures.push('MAINTAINERS.md must identify @MontrealAI');
for (const rel of required) if (!exists(rel)) failures.push(`missing required path: ${rel}`);
for (const row of walk(root)) {
  if (row.type === 'forbidden-dir') failures.push(`forbidden directory packaged: ${row.rel}`);
  if (row.type !== 'file') continue;
  if (forbiddenNames.has(row.name)) failures.push(`forbidden env file packaged: ${row.rel}`);
  if (row.size > 5_000_000) continue;
  if (scanSkipPrefixes.some(prefix => row.rel === prefix || row.rel.startsWith(prefix))) continue;
  const text = fs.readFileSync(row.full, 'utf8');
  for (const p of forbiddenPatterns) if (p.test(text)) failures.push(`possible secret pattern in ${row.rel}: ${p}`);
}
const report = {
  schema: 'goalos.signoff.repository_readiness.v1',
  status: failures.length ? 'FAIL' : 'PASS',
  checkedAt: new Date().toISOString(),
  requiredPaths: required.length,
  failures
};
fs.mkdirSync(path.join(root, 'verification'), {recursive:true});
fs.writeFileSync(path.join(root, 'verification/repository-readiness.json'), JSON.stringify(report, null, 2) + '\n');
if (failures.length) {
  console.error(JSON.stringify(report, null, 2));
  process.exit(1);
}
console.log('GoalOS repository readiness PASS');
