import { createPrivateKey, createPublicKey, sign, verify } from "node:crypto";
import { sha256Prefixed, stableStringify } from "@/lib/crypto";
import { signingEnv } from "@/lib/env";
import type { GoalOSReceipt } from "@/lib/domain";

export interface SignedReceipt {
  canonicalJson: GoalOSReceipt;
  canonicalString: string;
  canonicalSha256: string;
  signature: string;
  algorithm: "Ed25519";
  publicKeyId: string;
}

export function signReceipt(receipt: GoalOSReceipt): SignedReceipt {
  const env = signingEnv();
  if (!env.privateKey || !env.publicKey) throw new Error("Receipt signing keys are not configured.");
  const canonicalString = stableStringify(receipt);
  const signature = sign(null, Buffer.from(canonicalString), createPrivateKey(env.privateKey)).toString("base64url");
  return {
    canonicalJson: receipt,
    canonicalString,
    canonicalSha256: sha256Prefixed(canonicalString),
    signature,
    algorithm: "Ed25519",
    publicKeyId: env.keyId
  };
}

export function verifyReceipt(receipt: GoalOSReceipt, signature: string, publicKeyPem?: string): boolean {
  const env = signingEnv();
  const key = publicKeyPem?.replace(/\\n/g, "\n") ?? env.publicKey;
  if (!key) return false;
  return verify(null, Buffer.from(stableStringify(receipt)), createPublicKey(key), Buffer.from(signature, "base64url"));
}
