import { generateKeyPairSync } from "node:crypto";
import { afterEach, describe, expect, it } from "vitest";
import { signReceipt, verifyReceipt } from "./sign";
import type { GoalOSReceipt } from "@/lib/domain";

const original = { ...process.env };
afterEach(() => { process.env = { ...original }; });

const receipt: GoalOSReceipt = {
  schema: "goalos.signoff.receipt.v1", receiptId: "r", publicId: "p", issuedAt: "2026-01-01T00:00:00.000Z",
  mission: { projectId: "m", title: "Title", summary: "Summary", briefVersion: 1, deadline: null, commitmentHash: "0x1" },
  participants: [], acceptanceCriteria: [],
  submission: { id: "s", version: 1, summary: "Done", limitations: "None", aiUseNotes: "AI used", submittedAt: "2026-01-01T00:00:00.000Z", evidenceDocketHash: "0x2" },
  artifacts: [], checks: [], reviews: [],
  finalDecision: { decision: "accepted", comment: "Accepted", decidedAt: "2026-01-01T00:00:00.000Z", deciderSubjectHash: "0x3", decisionHash: "0x4" },
  protocolReady: { claimBoundaryHash: "0x5", riskLedgerHash: "0x6", proofBundleHash: "0x7", onchainAnchored: false, chainId: null, transactionHash: null }
};

describe("receipt signatures", () => {
  it("signs and detects tampering", () => {
    const { privateKey, publicKey } = generateKeyPairSync("ed25519", { privateKeyEncoding: { type: "pkcs8", format: "pem" }, publicKeyEncoding: { type: "spki", format: "pem" } });
    process.env.RECEIPT_SIGNING_PRIVATE_KEY_PEM = privateKey.toString();
    process.env.RECEIPT_SIGNING_PUBLIC_KEY_PEM = publicKey.toString();
    const signed = signReceipt(receipt);
    expect(verifyReceipt(receipt, signed.signature)).toBe(true);
    expect(verifyReceipt({ ...receipt, publicId: "tampered" }, signed.signature)).toBe(false);
  });
});
