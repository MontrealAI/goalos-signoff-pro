#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const root = process.cwd();
const required = [
  'README.md','START_HERE.html','START_HERE.md','SUPABASE_SETUP.sql','SUPABASE_PRO_ADDONS.sql','package.json','package-lock.json',
  'src/lib/templates.ts','src/lib/evidence-assistant.ts','src/lib/pilot-analytics.ts','src/components/projects/evidence-assistant-panel.tsx','src/components/projects/change-request-panel.tsx','src/components/projects/verified-receipt-upgrade.tsx',
  'src/app/pro/page.tsx','src/app/pilot/page.tsx','src/app/invoices/page.tsx','src/app/verify/page.tsx','src/app/templates/page.tsx',
  'schemas/goalos-change-request.schema.json','schemas/goalos-evidence-assistant-report.schema.json','schemas/goalos-pilot-event.schema.json',
  'docs/PRO_V1_1_PRODUCT_SPEC.md','docs/PRO_V1_1_LAUNCH_PLAYBOOK.md','docs/EVIDENCE_ASSISTANT_GUIDE.md','docs/CHANGE_REQUEST_WORKFLOW.md','docs/PILOT_MONETIZATION.md','docs/VERIFIED_RECEIPT_RUNBOOK.md','docs/AGIALPHA_LATER_PATH.md','docs/PRODUCTION_BOUNDARY.md',
  'examples/public-demo-project.json','examples/pilot-analytics-sample.json'
];
const failures=[];
for (const file of required) if (!fs.existsSync(path.join(root,file))) failures.push(`missing ${file}`);
for (const file of ['package.json','package-lock.json','schemas/goalos-change-request.schema.json','schemas/goalos-evidence-assistant-report.schema.json','schemas/goalos-pilot-event.schema.json','examples/public-demo-project.json','examples/pilot-analytics-sample.json']) {
  try { JSON.parse(fs.readFileSync(path.join(root,file),'utf8')); } catch (error) { failures.push(`invalid JSON ${file}: ${error.message}`); }
}
const pkg=JSON.parse(fs.readFileSync(path.join(root,'package.json'),'utf8'));
if (pkg.version !== '1.1.0') failures.push('package version must be 1.1.0');
const sql=fs.readFileSync(path.join(root,'SUPABASE_PRO_ADDONS.sql'),'utf8');
for (const needle of ['change_requests','evidence_assistant_reports','pilot_events','invoice_records','enable row level security']) if (!sql.includes(needle)) failures.push(`SUPABASE_PRO_ADDONS.sql missing ${needle}`);
const env=fs.readFileSync(path.join(root,'.env.example'),'utf8');
for (const forbidden of [/PRIVATE_KEY=.*[0-9a-fA-F]{32,}/]) if (forbidden.test(env)) failures.push(`.env.example may contain a secret-like value: ${forbidden}`);
const textFiles=[];
function walk(dir){ for (const ent of fs.readdirSync(dir,{withFileTypes:true})) { const p=path.join(dir,ent.name); const rel=path.relative(root,p); if (['node_modules','.next','.git','dist'].some(skip => rel.split(path.sep).includes(skip))) continue; if (ent.isDirectory()) walk(p); else textFiles.push(rel); } }
walk(root);
const manifest=textFiles.map(rel => ({ path: rel, bytes: fs.statSync(path.join(root,rel)).size, sha256: crypto.createHash('sha256').update(fs.readFileSync(path.join(root,rel))).digest('hex') })).sort((a,b)=>a.path.localeCompare(b.path));
fs.mkdirSync(path.join(root,'verification'),{recursive:true});
fs.writeFileSync(path.join(root,'verification/pro-v1.1-package-verification.json'), JSON.stringify({ status: failures.length?'FAIL':'PASS', checkedAt: new Date().toISOString(), version: pkg.version, files: manifest.length, requiredFiles: required.length, failures, manifestSha256: crypto.createHash('sha256').update(JSON.stringify(manifest)).digest('hex') }, null, 2)+'\n');
if (failures.length) { console.error('GoalOS Signoff Pro v1.1 package verification failed:\n- '+failures.join('\n- ')); process.exit(1); }
console.log(`GoalOS Signoff Pro v1.1 package verification PASS (${required.length} required Pro artifacts).`);
