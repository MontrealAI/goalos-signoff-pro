import { describe, expect, it } from "vitest";
import { createReceiptPdf } from "./pdf";
import type { ReceiptEnvelope } from "./public";

const envelope: ReceiptEnvelope = {
  verified: true,
  valid: true,
  revokedAt: null,
  revocationReason: null,
  visibility: "private",
  publicKeyPem: "PUBLIC",
  record: {
    id: "r1", project_id: "p1", submission_id: "s1", public_id: "gs_demo", canonical_sha256: `0x${"a".repeat(64)}`,
    signature: "sig", algorithm: "Ed25519", public_key_id: "key-1", public_key_pem: "PUBLIC", issued_at: "2026-01-01T00:00:00.000Z", revoked_at: null, revocation_reason: null,
    canonical_json: {
      schema: "goalos.signoff.receipt.v1", receiptId: "r1", publicId: "gs_demo", issuedAt: "2026-01-01T00:00:00.000Z",
      mission: { projectId: "p1", title: "Résumé — evidence Ω", summary: "A signed acceptance record.", briefVersion: 1, deadline: null, commitmentHash: `0x${"1".repeat(64)}` },
      participants: [],
      acceptanceCriteria: [{ id: "c1", title: "Required evidence", description: "", required: true, responseStatus: "met", response: "Provided.", evidenceArtifactHashes: ["b".repeat(64)] }],
      submission: { id: "s1", version: 1, summary: "Delivery completed.", limitations: "No material limitations.", aiUseNotes: "AI assisted drafting.", submittedAt: "2026-01-01T00:00:00.000Z", evidenceDocketHash: `0x${"2".repeat(64)}` },
      artifacts: [{ id: "a1", filename: "résumé.pdf", mimeType: "application/pdf", sizeBytes: 100, sha256: "b".repeat(64), description: "Evidence" }],
      checks: [{ code: "ready", label: "Ready", status: "pass", detail: "Complete" }], reviews: [],
      finalDecision: { decision: "accepted", comment: "Accepted.", decidedAt: "2026-01-01T00:00:00.000Z", deciderSubjectHash: `0x${"3".repeat(64)}`, decisionHash: `0x${"4".repeat(64)}` },
      protocolReady: { claimBoundaryHash: `0x${"5".repeat(64)}`, riskLedgerHash: `0x${"6".repeat(64)}`, proofBundleHash: `0x${"7".repeat(64)}`, onchainAnchored: false, chainId: null, transactionHash: null }
    }
  }
};

describe("Mission Receipt PDF", () => {
  it("renders a valid PDF even when user content contains Unicode", async () => {
    const bytes = await createReceiptPdf(envelope);
    expect(Buffer.from(bytes).subarray(0, 5).toString()).toBe("%PDF-");
    expect(bytes.byteLength).toBeGreaterThan(1000);
  });
});
