import type { AcceptanceCriterion, Artifact, CriterionResponse, MechanicalCheck } from "@/lib/domain";

export type EvidenceAssistantSeverity = "good" | "attention" | "blocker";
export type EvidenceAssistantItem = { code: string; severity: EvidenceAssistantSeverity; title: string; detail: string; suggestedAction: string };
export type EvidenceAssistantReport = { readinessScore: number; status: "ready_for_review" | "needs_attention" | "blocked"; items: EvidenceAssistantItem[] };

export interface EvidenceAssistantInput {
  criteria: AcceptanceCriterion[];
  responses: CriterionResponse[];
  artifacts: Artifact[];
  checks: MechanicalCheck[];
  limitations?: string | null;
  aiUseNotes?: string | null;
}

export function runEvidenceAssistant(input: EvidenceAssistantInput): EvidenceAssistantReport {
  const items: EvidenceAssistantItem[] = [];
  const responseByCriterion = new Map(input.responses.map((response) => [response.criterion_id, response]));
  const required = input.criteria.filter((criterion) => criterion.required);
  const missingRequired = required.filter((criterion) => !responseByCriterion.get(criterion.id) || responseByCriterion.get(criterion.id)?.status === "not_met");
  if (missingRequired.length) {
    items.push({ code: "required_missing", severity: "blocker", title: "Required criteria are unresolved", detail: `${missingRequired.length} required criteria are missing or marked not met.`, suggestedAction: "Ask the builder to respond to every required criterion before review." });
  }
  const criteriaWithoutEvidence = required.filter((criterion) => (responseByCriterion.get(criterion.id)?.artifact_ids.length ?? 0) === 0);
  if (criteriaWithoutEvidence.length) {
    items.push({ code: "evidence_missing", severity: "blocker", title: "Required criteria need attached evidence", detail: `${criteriaWithoutEvidence.length} required criteria have no attached evidence file.`, suggestedAction: "Attach at least one artifact to each required criterion or explicitly mark it not applicable." });
  }
  const failedChecks = input.checks.filter((check) => check.status === "fail");
  const warnings = input.checks.filter((check) => check.status === "warning");
  if (failedChecks.length) items.push({ code: "mechanical_failures", severity: "blocker", title: "Mechanical checks failed", detail: failedChecks.map((check) => check.label).join(", "), suggestedAction: "Resolve failed checks before final acceptance." });
  if (warnings.length) items.push({ code: "mechanical_warnings", severity: "attention", title: "Review warnings are present", detail: warnings.map((check) => check.label).join(", "), suggestedAction: "Review the warnings and either resolve them or document why they are acceptable." });
  if (!input.limitations || input.limitations.trim().length < 10) items.push({ code: "limitations_short", severity: "attention", title: "Limitations are not clearly disclosed", detail: "The submission has a very short or empty limitations statement.", suggestedAction: "Add a plain-language list of known limitations, uncertainty, and deferred work." });
  if (!input.aiUseNotes || input.aiUseNotes.trim().length < 10) items.push({ code: "ai_use_short", severity: "attention", title: "AI-use disclosure is incomplete", detail: "The submission does not clearly explain where AI was used and what received human review.", suggestedAction: "Add a concise AI-use and human-review disclosure." });
  if (input.artifacts.length === 0) items.push({ code: "no_artifacts", severity: "blocker", title: "No evidence files are attached", detail: "A Signoff without artifacts is hard to defend.", suggestedAction: "Attach a deliverable, source list, test output, screenshot, or other evidence." });
  const unmapped = input.artifacts.filter((artifact) => !input.responses.some((response) => response.artifact_ids.includes(artifact.id)));
  if (unmapped.length) items.push({ code: "unmapped_artifacts", severity: "attention", title: "Some artifacts are not mapped", detail: `${unmapped.length} artifact(s) are attached but not tied to a criterion.`, suggestedAction: "Map every artifact to at least one acceptance criterion or remove it from the delivery package." });
  if (!items.length) items.push({ code: "ready", severity: "good", title: "Ready for human review", detail: "The evidence package is mechanically complete. A human reviewer still decides whether the work is acceptable.", suggestedAction: "Proceed to reviewer recommendation and client decision." });
  const blockers = items.filter((item) => item.severity === "blocker").length;
  const attention = items.filter((item) => item.severity === "attention").length;
  const readinessScore = Math.max(0, Math.round(100 - blockers * 30 - attention * 10));
  const status = blockers ? "blocked" : attention ? "needs_attention" : "ready_for_review";
  return { readinessScore, status, items };
}
