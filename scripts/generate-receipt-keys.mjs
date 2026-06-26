#!/usr/bin/env node
import { createHash, createPrivateKey, createPublicKey, generateKeyPairSync } from "node:crypto";
import { readLocalEnv, writeLocalEnv, envPath } from "./env-file.mjs";

const force = process.argv.includes("--force");
const values = readLocalEnv();
if (values.RECEIPT_SIGNING_PRIVATE_KEY_PEM && values.RECEIPT_SIGNING_PUBLIC_KEY_PEM && !force) {
  console.log(`✓ Receipt signing keys already exist in ${envPath}`);
  console.log("  Nothing changed. Use --force only when intentionally rotating keys.");
  process.exit(0);
}
const { privateKey, publicKey } = generateKeyPairSync("ed25519");
const privatePem = privateKey.export({ type: "pkcs8", format: "pem" }).toString();
const publicPem = publicKey.export({ type: "spki", format: "pem" }).toString();
const fingerprint = createHash("sha256").update(createPublicKey(publicPem).export({ type: "spki", format: "der" })).digest("hex");
const derived = createPublicKey(createPrivateKey(privatePem)).export({ type: "spki", format: "der" });
if (!derived.equals(createPublicKey(publicPem).export({ type: "spki", format: "der" }))) throw new Error("Generated key pair failed its consistency check.");
const month = new Date().toISOString().slice(0, 7);
writeLocalEnv({ ...values, RECEIPT_SIGNING_PRIVATE_KEY_PEM: privatePem, RECEIPT_SIGNING_PUBLIC_KEY_PEM: publicPem, RECEIPT_SIGNING_KEY_ID: `goalos-signoff-${month}-${fingerprint.slice(0, 12)}` }, { backup: force });
console.log(`✓ Generated a new Ed25519 Mission Receipt signing key pair.`);
console.log(`✓ Saved it privately to ${envPath}`);
console.log(`✓ Public-key fingerprint: ${fingerprint}`);
console.log("  The private key was not printed. Never commit or share .env.local.");
