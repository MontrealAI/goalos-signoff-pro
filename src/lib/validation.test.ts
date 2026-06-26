import { describe, expect, it } from "vitest";
import { isAllowedFilePair, projectSchema, safeFilename, uploadIntentSchema } from "./validation";

describe("input validation", () => {
  it("normalizes unsafe filenames", () => {
    expect(safeFilename("../../Résumé <final>.pdf")).toBe("Resume-_final_.pdf");
  });

  it("rejects an obvious extension and MIME mismatch", () => {
    expect(isAllowedFilePair("report.pdf", "application/pdf")).toBe(true);
    expect(isAllowedFilePair("report.exe", "application/pdf")).toBe(false);
  });

  it("rejects oversized upload intents", () => {
    const result = uploadIntentSchema.safeParse({ filename: "large.pdf", mimeType: "application/pdf", sizeBytes: 26 * 1024 * 1024, sha256: "a".repeat(64), description: "" });
    expect(result.success).toBe(false);
  });

  it("accepts a minimal valid project", () => {
    expect(projectSchema.safeParse({ title: "Test Signoff", summary: "A sufficiently detailed project summary.", deadline: "", receipt_visibility: "private", criteria: [{ title: "Deliver report", description: "", required: true, position: 0 }] }).success).toBe(true);
  });
});
