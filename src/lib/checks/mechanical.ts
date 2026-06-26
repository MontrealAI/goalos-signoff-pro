import type { AcceptanceCriterion, Artifact, CriterionResponse, MechanicalCheck } from "@/lib/domain";

export interface MechanicalCheckInput {
  criteria: AcceptanceCriterion[];
  responses: CriterionResponse[];
  artifacts: Artifact[];
  summary: string;
  limitations: string;
  aiUseNotes: string;
}

export function runMechanicalChecks(input: MechanicalCheckInput): MechanicalCheck[] {
  const responseByCriterion = new Map(input.responses.map((response) => [response.criterion_id, response]));
  const required = input.criteria.filter((criterion) => criterion.required);
  const requiredAnswered = required.filter((criterion) => {
    const response = responseByCriterion.get(criterion.id);
    return Boolean(response?.response.trim()) && response?.status !== "not_met";
  });
  const requiredWithEvidence = required.filter((criterion) => {
    const response = responseByCriterion.get(criterion.id);
    return Boolean(response && response.artifact_ids.length > 0);
  });
  const hashesValid = input.artifacts.every((artifact) => /^[a-f0-9]{64}$/.test(artifact.sha256));
  const mappedArtifactIds = new Set(input.responses.flatMap((response) => response.artifact_ids));
  const mappedArtifacts = input.artifacts.filter((artifact) => mappedArtifactIds.has(artifact.id));
  const partialCount = input.responses.filter((response) => response.status === "partial").length;
  const notMetCount = input.responses.filter((response) => response.status === "not_met").length;

  return [
    {
      code: "submission_summary",
      label: "Delivery summary supplied",
      status: input.summary.trim().length >= 20 ? "pass" : "fail",
      detail: input.summary.trim().length >= 20 ? "The submission explains what was delivered." : "Add a delivery summary of at least 20 characters."
    },
    {
      code: "required_criteria_answered",
      label: "Required criteria answered",
      status: requiredAnswered.length === required.length ? "pass" : "fail",
      detail: `${requiredAnswered.length}/${required.length} required criteria have a substantive response and are not marked unmet.`
    },
    {
      code: "required_criteria_evidence",
      label: "Required criteria linked to evidence",
      status: requiredWithEvidence.length === required.length ? "pass" : "fail",
      detail: `${requiredWithEvidence.length}/${required.length} required criteria reference at least one artifact.`
    },
    {
      code: "artifact_integrity",
      label: "Artifact fingerprints recorded",
      status: input.artifacts.length > 0 && hashesValid ? "pass" : "fail",
      detail: input.artifacts.length === 0 ? "No artifact has been attached." : hashesValid ? `${input.artifacts.length} artifact hashes are present.` : "One or more artifact hashes are invalid."
    },
    {
      code: "artifact_mapping",
      label: "Evidence is mapped to criteria",
      status: mappedArtifacts.length === input.artifacts.length ? "pass" : "warning",
      detail: `${mappedArtifacts.length}/${input.artifacts.length} artifacts are linked to at least one acceptance criterion.`
    },
    {
      code: "limitations_disclosed",
      label: "Limitations disclosed",
      status: input.limitations.trim().length >= 10 ? "pass" : "warning",
      detail: input.limitations.trim().length >= 10 ? "Limitations and unresolved issues were disclosed." : "Add a short limitations statement, even if there are no known limitations."
    },
    {
      code: "ai_use_disclosed",
      label: "AI use disclosed",
      status: input.aiUseNotes.trim().length >= 10 ? "pass" : "warning",
      detail: input.aiUseNotes.trim().length >= 10 ? "The submission describes where AI was or was not used." : "Explain where AI was used and what received human review."
    },
    {
      code: "criterion_exceptions",
      label: "Criterion exceptions surfaced",
      status: notMetCount > 0 ? "fail" : partialCount > 0 ? "warning" : "pass",
      detail: notMetCount > 0 ? `${notMetCount} criterion responses are marked unmet.` : partialCount > 0 ? `${partialCount} criterion responses are marked partial and require reviewer judgment.` : "No criterion is marked partial or unmet."
    }
  ];
}

export function canSubmit(checks: MechanicalCheck[]): boolean {
  return !checks.some((check) => check.status === "fail");
}
