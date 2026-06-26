import { sha256Prefixed, stableStringify } from "@/lib/crypto";
import type { AcceptanceCriterion, Artifact, CriterionResponse, Decision, GoalOSReceipt, MechanicalCheck, Project, ProjectMember, Review, Submission } from "@/lib/domain";

export interface ReceiptInput {
  receiptId: string;
  publicId: string;
  issuedAt: string;
  project: Project;
  criteria: AcceptanceCriterion[];
  members: ProjectMember[];
  submission: Submission;
  responses: CriterionResponse[];
  artifacts: Artifact[];
  checks: MechanicalCheck[];
  reviews: Review[];
  decision: Decision;
}

const subjectHash = (id: string) => sha256Prefixed(`goalos:subject:${id}`);

export function buildReceipt(input: ReceiptInput): GoalOSReceipt {
  const responseByCriterion = new Map(input.responses.map((response) => [response.criterion_id, response]));
  const artifactById = new Map(input.artifacts.map((artifact) => [artifact.id, artifact]));
  const missionCommitment = {
    projectId: input.project.id,
    title: input.project.title,
    summary: input.project.summary,
    briefVersion: input.project.brief_version,
    deadline: input.project.deadline,
    criteria: input.criteria.map(({ id, title, description, required, position }) => ({ id, title, description, required, position }))
  };
  const evidenceDocket = {
    submissionId: input.submission.id,
    version: input.submission.version,
    summary: input.submission.summary,
    limitations: input.submission.limitations,
    aiUseNotes: input.submission.ai_use_notes,
    artifacts: input.artifacts.map(({ id, filename, mime_type, size_bytes, sha256, description }) => ({ id, filename, mimeType: mime_type, sizeBytes: size_bytes, sha256, description })),
    responses: input.responses
  };
  const decisionPayload = {
    decision: input.decision.decision,
    comment: input.decision.comment,
    decidedAt: input.decision.created_at,
    decidedBy: input.decision.decided_by
  };
  const claimBoundary = {
    checks: input.checks,
    limitations: input.submission.limitations,
    note: "Mechanical checks establish completeness and integrity signals; they do not certify external factual truth or professional suitability."
  };
  const riskLedger = {
    limitations: input.submission.limitations,
    partialCriteria: input.responses.filter((response) => response.status === "partial").map((response) => response.criterion_id),
    unmetCriteria: input.responses.filter((response) => response.status === "not_met").map((response) => response.criterion_id),
    warnings: input.checks.filter((check) => check.status === "warning")
  };

  const receipt: GoalOSReceipt = {
    schema: "goalos.signoff.receipt.v1",
    receiptId: input.receiptId,
    publicId: input.publicId,
    issuedAt: input.issuedAt,
    mission: {
      projectId: input.project.id,
      title: input.project.title,
      summary: input.project.summary,
      briefVersion: input.project.brief_version,
      deadline: input.project.deadline,
      commitmentHash: sha256Prefixed(stableStringify(missionCommitment))
    },
    participants: input.members.map((member) => ({
      role: member.role,
      displayName: member.profile?.display_name?.trim() || member.profile?.email?.split("@")[0] || "Participant",
      subjectHash: subjectHash(member.user_id)
    })),
    acceptanceCriteria: input.criteria.map((criterion) => {
      const response = responseByCriterion.get(criterion.id);
      const hashes = (response?.artifact_ids ?? []).map((artifactId) => artifactById.get(artifactId)?.sha256).filter((value): value is string => Boolean(value));
      return {
        id: criterion.id,
        title: criterion.title,
        description: criterion.description,
        required: criterion.required,
        responseStatus: response?.status ?? "not_met",
        response: response?.response ?? "",
        evidenceArtifactHashes: hashes
      };
    }),
    submission: {
      id: input.submission.id,
      version: input.submission.version,
      summary: input.submission.summary,
      limitations: input.submission.limitations,
      aiUseNotes: input.submission.ai_use_notes,
      submittedAt: input.submission.submitted_at,
      evidenceDocketHash: sha256Prefixed(stableStringify(evidenceDocket))
    },
    artifacts: input.artifacts.map((artifact) => ({
      id: artifact.id,
      filename: artifact.filename,
      mimeType: artifact.mime_type,
      sizeBytes: artifact.size_bytes,
      sha256: artifact.sha256,
      description: artifact.description
    })),
    checks: input.checks,
    reviews: input.reviews.map((review) => ({
      recommendation: review.recommendation,
      notes: review.notes,
      reviewerSubjectHash: subjectHash(review.reviewer_id),
      createdAt: review.created_at
    })),
    finalDecision: {
      decision: input.decision.decision,
      comment: input.decision.comment,
      decidedAt: input.decision.created_at,
      deciderSubjectHash: subjectHash(input.decision.decided_by),
      decisionHash: sha256Prefixed(stableStringify(decisionPayload))
    },
    protocolReady: {
      claimBoundaryHash: sha256Prefixed(stableStringify(claimBoundary)),
      riskLedgerHash: sha256Prefixed(stableStringify(riskLedger)),
      proofBundleHash: "",
      onchainAnchored: false,
      chainId: null,
      transactionHash: null
    }
  };
  receipt.protocolReady.proofBundleHash = sha256Prefixed(stableStringify({ ...receipt, protocolReady: { ...receipt.protocolReady, proofBundleHash: "" } }));
  return receipt;
}
