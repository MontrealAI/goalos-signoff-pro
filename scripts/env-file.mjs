import fs from "node:fs";
import path from "node:path";

export const envPath = path.resolve(process.cwd(), ".env.local");

export function parseEnv(text = "") {
  const result = {};
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const index = line.indexOf("=");
    if (index < 1) continue;
    const key = line.slice(0, index).trim();
    let value = line.slice(index + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) value = value.slice(1, -1);
    result[key] = value.replace(/\\n/g, "\n").replace(/\\"/g, '"').replace(/\\\\/g, "\\");
  }
  return result;
}

function quote(value) {
  return `"${String(value).replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/"/g, '\\"')}"`;
}

export function readLocalEnv() {
  return fs.existsSync(envPath) ? parseEnv(fs.readFileSync(envPath, "utf8")) : {};
}

export function writeLocalEnv(values, { backup = true } = {}) {
  if (backup && fs.existsSync(envPath)) {
    const stamp = new Date().toISOString().replace(/[:.]/g, "-");
    fs.copyFileSync(envPath, `${envPath}.backup-${stamp}`);
  }
  const ordered = [
    ["# GoalOS Signoff local configuration. Never commit this file."],
    ["NEXT_PUBLIC_SUPABASE_URL", values.NEXT_PUBLIC_SUPABASE_URL ?? ""],
    ["NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", values.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? ""],
    ["SUPABASE_SECRET_KEY", values.SUPABASE_SECRET_KEY ?? ""],
    ["NEXT_PUBLIC_APP_URL", values.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"],
    [],
    ["# Mission Receipt signing keys. The private key is server-only."],
    ["RECEIPT_SIGNING_PRIVATE_KEY_PEM", values.RECEIPT_SIGNING_PRIVATE_KEY_PEM ?? ""],
    ["RECEIPT_SIGNING_PUBLIC_KEY_PEM", values.RECEIPT_SIGNING_PUBLIC_KEY_PEM ?? ""],
    ["RECEIPT_SIGNING_KEY_ID", values.RECEIPT_SIGNING_KEY_ID ?? ""],
    [],
    ["# Optional invitation email through Resend."],
    ["RESEND_API_KEY", values.RESEND_API_KEY ?? ""],
    ["RESEND_FROM_EMAIL", values.RESEND_FROM_EMAIL ?? "GoalOS Signoff <signoff@example.com>"]
  ];
  const text = ordered.map((entry) => {
    if (entry.length === 0) return "";
    if (entry.length === 1) return entry[0];
    return `${entry[0]}=${quote(entry[1])}`;
  }).join("\n") + "\n";
  fs.writeFileSync(envPath, text, { mode: 0o600 });
  try { fs.chmodSync(envPath, 0o600); } catch {}
}
