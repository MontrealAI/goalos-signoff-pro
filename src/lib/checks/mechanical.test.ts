import { describe, expect, it } from "vitest";
import { canSubmit, runMechanicalChecks } from "./mechanical";

const criterion = { id: "c1", project_id: "p1", title: "Current sources", description: "Use current sources", required: true, position: 0 };
const artifact = { id: "a1", project_id: "p1", uploaded_by: "u1", storage_path: "p1/u1/a.pdf", filename: "a.pdf", mime_type: "application/pdf", size_bytes: 10, sha256: "a".repeat(64), description: "Report", created_at: new Date().toISOString() };

describe("runMechanicalChecks", () => {
  it("passes a complete package", () => {
    const checks = runMechanicalChecks({ criteria: [criterion], responses: [{ criterion_id: "c1", status: "met", response: "Evidence is in the report.", artifact_ids: ["a1"] }], artifacts: [artifact], summary: "A complete competitive research report was delivered.", limitations: "No material limitations are known.", aiUseNotes: "AI assisted drafting; a human checked sources." });
    expect(canSubmit(checks)).toBe(true);
    expect(checks.every((check) => check.status !== "fail")).toBe(true);
  });

  it("fails when required evidence is absent", () => {
    const checks = runMechanicalChecks({ criteria: [criterion], responses: [{ criterion_id: "c1", status: "met", response: "Done", artifact_ids: [] }], artifacts: [], summary: "A complete competitive research report was delivered.", limitations: "No material limitations are known.", aiUseNotes: "AI assisted drafting; a human checked sources." });
    expect(canSubmit(checks)).toBe(false);
  });
});
