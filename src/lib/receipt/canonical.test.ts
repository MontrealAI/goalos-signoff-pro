import { describe, expect, it } from "vitest";
import { buildReceipt } from "./canonical";

const base = {
  receiptId: "11111111-1111-4111-8111-111111111111",
  publicId: "gs_abcdefghijklmnopqrstuvwx",
  issuedAt: "2026-01-01T00:00:00.000Z",
  project: { id: "21111111-1111-4111-8111-111111111111", owner_id: "u1", title: "Research delivery", summary: "Complete the requested research delivery.", status: "accepted" as const, deadline: null, brief_version: 1, receipt_visibility: "private" as const, created_at: "2026-01-01T00:00:00.000Z", updated_at: "2026-01-01T00:00:00.000Z" },
  criteria: [{ id: "31111111-1111-4111-8111-111111111111", project_id: "21111111-1111-4111-8111-111111111111", title: "Current evidence", description: "Use current evidence.", required: true, position: 0 }],
  members: [{ project_id: "21111111-1111-4111-8111-111111111111", user_id: "u1", role: "client" as const, profile: { id: "u1", email: "client@example.com", display_name: "Client" } }],
  submission: { id: "41111111-1111-4111-8111-111111111111", project_id: "21111111-1111-4111-8111-111111111111", version: 1, submitted_by: "u2", summary: "The requested delivery is complete.", limitations: "No material limitations are currently known.", ai_use_notes: "AI assisted drafting and a human reviewed the result.", status: "accepted" as const, created_at: "2026-01-01T00:00:00.000Z", submitted_at: "2026-01-01T00:00:00.000Z" },
  responses: [{ criterion_id: "31111111-1111-4111-8111-111111111111", status: "met" as const, response: "The report contains current evidence.", artifact_ids: ["51111111-1111-4111-8111-111111111111"] }],
  artifacts: [{ id: "51111111-1111-4111-8111-111111111111", project_id: "21111111-1111-4111-8111-111111111111", uploaded_by: "u2", storage_path: "p/a.pdf", filename: "a.pdf", mime_type: "application/pdf", size_bytes: 100, sha256: "a".repeat(64), description: "Report", created_at: "2026-01-01T00:00:00.000Z" }],
  checks: [{ code: "ready", label: "Ready", status: "pass" as const, detail: "Complete" }],
  reviews: [],
  decision: { id: "61111111-1111-4111-8111-111111111111", submission_id: "41111111-1111-4111-8111-111111111111", decided_by: "u1", decision: "accepted" as const, comment: "Accepted against the brief.", created_at: "2026-01-01T00:00:00.000Z" }
};

describe("receipt construction", () => {
  it("builds deterministic protocol-ready hashes and binds criterion evidence", () => {
    const first = buildReceipt(base);
    const second = buildReceipt(base);
    expect(first).toEqual(second);
    expect(first.mission.commitmentHash).toMatch(/^0x[a-f0-9]{64}$/);
    expect(first.submission.evidenceDocketHash).toMatch(/^0x[a-f0-9]{64}$/);
    expect(first.protocolReady.proofBundleHash).toMatch(/^0x[a-f0-9]{64}$/);
    expect(first.acceptanceCriteria[0].evidenceArtifactHashes).toEqual(["a".repeat(64)]);
    expect(first.protocolReady.onchainAnchored).toBe(false);
  });
});
