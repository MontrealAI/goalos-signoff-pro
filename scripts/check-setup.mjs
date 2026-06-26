#!/usr/bin/env node
import { createPrivateKey, createPublicKey } from "node:crypto";
import { readLocalEnv, envPath } from "./env-file.mjs";

const values = { ...readLocalEnv(), ...process.env };
const results = [];
const placeholder = (value = "") => !value || /YOUR_|\.\.\.|example\.com/i.test(value);
const check = (label, condition, detail) => results.push({ label, condition: Boolean(condition), detail });

let appUrlValid = false;
try {
  const parsed = new URL(values.NEXT_PUBLIC_APP_URL || "");
  appUrlValid = parsed.protocol === "https:" || ["localhost", "127.0.0.1"].includes(parsed.hostname);
} catch {}
check("Supabase project URL", !placeholder(values.NEXT_PUBLIC_SUPABASE_URL) && /^https:\/\/.+\.supabase\.co\/?$/i.test(values.NEXT_PUBLIC_SUPABASE_URL || ""), "Use the Project URL from Supabase Settings → API.");
check("Supabase publishable key", !placeholder(values.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || values.NEXT_PUBLIC_SUPABASE_ANON_KEY), "Use a publishable key (or legacy anon key), never the secret key.");
check("Supabase server secret", !placeholder(values.SUPABASE_SECRET_KEY || values.SUPABASE_SERVICE_ROLE_KEY), "This value must remain server-only.");
check("Application URL", appUrlValid, "Use http://localhost:3000 locally or your final https:// domain.");

let signingValid = false;
let signingDetail = "Generate keys with npm run setup:keys.";
try {
  const privatePem = (values.RECEIPT_SIGNING_PRIVATE_KEY_PEM || "").replace(/\\n/g, "\n");
  const publicPem = (values.RECEIPT_SIGNING_PUBLIC_KEY_PEM || "").replace(/\\n/g, "\n");
  const expected = createPublicKey(publicPem).export({ type: "spki", format: "der" });
  const derived = createPublicKey(createPrivateKey(privatePem)).export({ type: "spki", format: "der" });
  signingValid = expected.equals(derived) && Boolean(values.RECEIPT_SIGNING_KEY_ID);
  signingDetail = signingValid ? "Private/public Ed25519 keys match and a key ID is present." : signingDetail;
} catch {}
check("Mission Receipt signing keys", signingValid, signingDetail);
check("Separate public and secret credentials", (values.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || values.NEXT_PUBLIC_SUPABASE_ANON_KEY) !== (values.SUPABASE_SECRET_KEY || values.SUPABASE_SERVICE_ROLE_KEY), "The browser key and server secret must not be the same value.");

console.log(`GoalOS Signoff setup check (${envPath})\n`);
for (const row of results) console.log(`${row.condition ? "✓" : "✗"} ${row.label}\n  ${row.detail}`);
console.log(`\nOptional invitation email: ${values.RESEND_API_KEY ? "configured" : "not configured (copyable invitation links will still work)"}`);
const failed = results.filter((row) => !row.condition);
if (failed.length) {
  console.error(`\nSetup is not complete: ${failed.length} required check${failed.length === 1 ? "" : "s"} failed.`);
  process.exit(1);
}
console.log("\nAll required local settings passed.");
