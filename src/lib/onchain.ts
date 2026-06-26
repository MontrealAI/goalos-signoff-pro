import { createHash } from "node:crypto";
import type { GoalOSReceipt } from "./domain";

export type AnchorMode = "offchain" | "sepolia" | "mainnet_pending_audit";

export interface AnchorRecord {
  schema: "goalos.signoff.anchor.v1";
  mode: AnchorMode;
  chainId: number | null;
  registryAddress: string | null;
  receiptHash: string;
  receiptPublicId: string;
  projectId: string;
  submissionId: string;
  evidenceDocketHash: string;
  decisionHash: string;
  txHash: string | null;
  blockNumber: number | null;
  anchoredAt: string | null;
  status: "not_requested" | "queued" | "submitted" | "confirmed" | "failed";
}

export function sha256Hex(value: string): string {
  return createHash("sha256").update(value, "utf8").digest("hex");
}

export function canonicalize(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonicalize).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.entries(value as Record<string, unknown>).sort(([a],[b]) => a.localeCompare(b)).map(([k,v]) => `${JSON.stringify(k)}:${canonicalize(v)}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

export function receiptHash(receipt: GoalOSReceipt): string {
  return sha256Hex(canonicalize(receipt));
}

export function buildPendingAnchor(receipt: GoalOSReceipt): AnchorRecord {
  return {
    schema: "goalos.signoff.anchor.v1",
    mode: "offchain",
    chainId: null,
    registryAddress: null,
    receiptHash: receiptHash(receipt),
    receiptPublicId: receipt.publicId,
    projectId: receipt.mission.projectId,
    submissionId: receipt.submission.id,
    evidenceDocketHash: receipt.submission.evidenceDocketHash,
    decisionHash: receipt.finalDecision.decisionHash,
    txHash: null,
    blockNumber: null,
    anchoredAt: null,
    status: "not_requested"
  };
}

export function isSupportedVerificationChain(chainId: number): boolean {
  return chainId === 11155111 || chainId === 1;
}

export function chainLabel(chainId: number | null): string {
  if (chainId === 11155111) return "Sepolia testnet";
  if (chainId === 1) return "Ethereum Mainnet";
  return "Not anchored";
}
