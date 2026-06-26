#!/usr/bin/env node
import { createHash, generateKeyPairSync } from "node:crypto";
import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { readLocalEnv, writeLocalEnv, envPath } from "./env-file.mjs";

const rl = createInterface({ input, output });
const current = readLocalEnv();
const ask = async (label, fallback = "") => {
  const suffix = fallback ? ` [press Enter to keep the current value]` : "";
  const answer = (await rl.question(`${label}${suffix}: `)).trim();
  return answer || fallback;
};
console.log("\nGoalOS Signoff setup wizard\n");
console.log("This wizard writes only to .env.local on this computer. It does not send your values anywhere.\n");
const values = { ...current };
values.NEXT_PUBLIC_SUPABASE_URL = await ask("1/5 Supabase Project URL", current.NEXT_PUBLIC_SUPABASE_URL);
values.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = await ask("2/5 Supabase publishable key", current.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);
values.SUPABASE_SECRET_KEY = await ask("3/5 Supabase secret key (server-only)", current.SUPABASE_SECRET_KEY);
values.NEXT_PUBLIC_APP_URL = await ask("4/5 App URL", current.NEXT_PUBLIC_APP_URL || "http://localhost:3000");
const emailChoice = (await rl.question("5/5 Configure optional Resend invitation email now? (y/N): ")).trim().toLowerCase();
if (emailChoice === "y" || emailChoice === "yes") {
  values.RESEND_API_KEY = await ask("Resend API key", current.RESEND_API_KEY);
  values.RESEND_FROM_EMAIL = await ask("Verified sender", current.RESEND_FROM_EMAIL || "GoalOS Signoff <signoff@example.com>");
}
if (!values.RECEIPT_SIGNING_PRIVATE_KEY_PEM || !values.RECEIPT_SIGNING_PUBLIC_KEY_PEM) {
  const { privateKey, publicKey } = generateKeyPairSync("ed25519");
  values.RECEIPT_SIGNING_PRIVATE_KEY_PEM = privateKey.export({ type: "pkcs8", format: "pem" }).toString();
  values.RECEIPT_SIGNING_PUBLIC_KEY_PEM = publicKey.export({ type: "spki", format: "pem" }).toString();
  const fingerprint = createHash("sha256").update(publicKey.export({ type: "spki", format: "der" })).digest("hex");
  values.RECEIPT_SIGNING_KEY_ID = `goalos-signoff-${new Date().toISOString().slice(0, 7)}-${fingerprint.slice(0, 12)}`;
}
writeLocalEnv(values, { backup: true });
rl.close();
console.log(`\n✓ Saved ${envPath}`);
console.log("✓ Generated receipt signing keys if they were missing.");
console.log("✓ No secret values were printed.");
console.log("\nNext: run npm run setup:check");
