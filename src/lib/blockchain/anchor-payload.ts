import { createHash } from "node:crypto";

export type GoalOSAnchorPayload = {
  schemaVersion: "1.0";
  product: "GoalOS Signoff Hybrid";
  receiptHash: `0x${string}`;
  evidenceRoot: `0x${string}`;
  decisionHash: `0x${string}`;
  receiptURI?: string;
  network: "sepolia" | "ethereum-mainnet";
  chainId: number;
  contractAddress: `0x${string}`;
};

export function canonicalizeAnchorPayload(payload: GoalOSAnchorPayload): string {
  return JSON.stringify(payload, Object.keys(payload).sort());
}

export function anchorPayloadHash(payload: GoalOSAnchorPayload): `0x${string}` {
  return `0x${createHash("sha256").update(canonicalizeAnchorPayload(payload)).digest("hex")}`;
}

export function bytes32FromHex(value: string, label: string): `0x${string}` {
  if (!/^0x[0-9a-fA-F]{64}$/.test(value)) throw new Error(`${label} must be a 32-byte hex string`);
  return value as `0x${string}`;
}
