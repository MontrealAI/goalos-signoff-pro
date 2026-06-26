import { describe, expect, it } from "vitest";
import { runEvidenceAssistant } from "@/lib/evidence-assistant";

const criterion = { id: "c1", project_id: "p", title: "Evidence required", description: "", required: true, position: 0, created_at: new Date().toISOString() };
const artifact = { id: "a1", project_id: "p", uploaded_by: "u", storage_path: "p/a", filename: "report.pdf", mime_type: "application/pdf", size_bytes: 100, sha256: "a".repeat(64), description: "report", created_at: new Date().toISOString() };

describe("runEvidenceAssistant", () => {
  it("blocks incomplete submissions", () => {
    const report = runEvidenceAssistant({ criteria: [criterion], responses: [], artifacts: [], checks: [], limitations: "", aiUseNotes: "" });
    expect(report.status).toBe("blocked");
    expect(report.items.some((item) => item.code === "required_missing")).toBe(true);
  });
  it("marks complete packages ready for review", () => {
    const report = runEvidenceAssistant({
      criteria: [criterion], artifacts: [artifact], checks: [{ code: "ok", label: "OK", status: "pass", detail: "ok" }], limitations: "Known limitations are disclosed.", aiUseNotes: "AI use was reviewed by a human.",
      responses: [{ criterion_id: "c1", status: "met", response: "Met with attached report", artifact_ids: ["a1"] }]
    });
    expect(report.status).toBe("ready_for_review");
    expect(report.readinessScore).toBe(100);
  });
});
