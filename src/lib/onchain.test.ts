import { describe, expect, it } from "vitest";
import { buildPendingAnchor, canonicalize, chainLabel, isSupportedVerificationChain, sha256Hex } from "./onchain";
import type { GoalOSReceipt } from "./domain";

const receipt: GoalOSReceipt = {
  schema: "goalos.signoff.receipt.v1",
  receiptId: "r1",
  publicId: "GS-1",
  issuedAt: "2026-01-01T00:00:00Z",
  mission: { projectId: "p1", title: "T", summary: "S", briefVersion: 1, deadline: null, commitmentHash: "h1" },
  participants: [],
  acceptanceCriteria: [],
  submission: { id: "s1", version: 1, summary: "done", limitations: "none", aiUseNotes: "used", submittedAt: "2026-01-01T00:00:00Z", evidenceDocketHash: "e1" },
  artifacts: [],
  checks: [],
  reviews: [],
  finalDecision: { decision: "accepted", comment: "ok", decidedAt: "2026-01-01T00:00:00Z", deciderSubjectHash: "d1", decisionHash: "dec1" },
  protocolReady: { claimBoundaryHash: "c1", riskLedgerHash: "r1", proofBundleHash: "p1", onchainAnchored: false, chainId: null, transactionHash: null }
};

describe("hybrid onchain helpers", () => {
  it("canonicalizes objects deterministically", () => {
    expect(canonicalize({ b: 2, a: 1 })).toBe(canonicalize({ a: 1, b: 2 }));
    expect(sha256Hex(canonicalize({ a: 1 }))).toHaveLength(64);
  });

  it("builds a pending anchor from a receipt", () => {
    const anchor = buildPendingAnchor(receipt);
    expect(anchor.schema).toBe("goalos.signoff.anchor.v1");
    expect(anchor.status).toBe("not_requested");
    expect(anchor.receiptPublicId).toBe("GS-1");
    expect(anchor.receiptHash).toHaveLength(64);
  });

  it("labels only Sepolia and Mainnet as supported", () => {
    expect(isSupportedVerificationChain(11155111)).toBe(true);
    expect(isSupportedVerificationChain(1)).toBe(true);
    expect(isSupportedVerificationChain(137)).toBe(false);
    expect(chainLabel(11155111)).toBe("Sepolia testnet");
  });
});
