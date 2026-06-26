#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const required = [
  "START_HERE.html", "START_HERE.md", "README.md", "SUPABASE_SETUP.sql", "package.json", "package-lock.json",
  "src/app/page.tsx", "src/app/demo/page.tsx", "src/app/setup/page.tsx", "src/lib/receipt/sign.ts",
  "supabase/migrations/0001_goalos_signoff.sql", "schemas/goalos-signoff-receipt.schema.json",
  "TOOLS/RECEIPT_KEY_GENERATOR.html", "TOOLS/VERIFY_RECEIPT.html", ".github/workflows/ci.yml"
];
const failures = [];
for (const relative of required) if (!fs.existsSync(path.join(root, relative))) failures.push(`missing ${relative}`);
for (const forbidden of [".env", ".env.local", "node_modules", ".next"]) if (fs.existsSync(path.join(root, forbidden))) failures.push(`must not be packaged: ${forbidden}`);
for (const relative of ["package.json", "schemas/goalos-signoff-receipt.schema.json", "schemas/goalos-signoff-envelope.schema.json", "examples/sample-signoff-brief.json"]) {
  try { JSON.parse(fs.readFileSync(path.join(root, relative), "utf8")); } catch (error) { failures.push(`invalid JSON in ${relative}: ${error.message}`); }
}
const setup = fs.readFileSync(path.join(root, "SUPABASE_SETUP.sql"), "utf8");
const initial = fs.readFileSync(path.join(root, "supabase/migrations/0001_goalos_signoff.sql"), "utf8");
if (!setup.includes(initial.slice(0, 500))) failures.push("SUPABASE_SETUP.sql does not include the initial schema migration");
if (!setup.includes("enable row level security")) failures.push("database setup does not enable Row Level Security");
if (!setup.includes("public.revoke_signoff_receipt")) failures.push("receipt-revocation function is missing");
const pkg = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
if (pkg.private !== true) failures.push("package.json must remain private to prevent accidental npm publishing");
if (failures.length) {
  console.error("GoalOS Signoff package verification failed:\n- " + failures.join("\n- "));
  process.exit(1);
}
console.log(`GoalOS Signoff commercial package verification PASS (${required.length} required artifacts, schema bundle, JSON syntax, RLS, and secret-file boundary).`);
