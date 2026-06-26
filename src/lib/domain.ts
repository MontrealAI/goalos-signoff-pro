export type ProjectStatus = "draft" | "open" | "submitted" | "changes_requested" | "accepted" | "rejected" | "archived";
export type ProjectRole = "client" | "builder" | "reviewer" | "observer";
export type CriterionResponseStatus = "met" | "partial" | "not_met" | "not_applicable";
export type CheckStatus = "pass" | "warning" | "fail";
export type ReviewRecommendation = "accept" | "changes_requested" | "reject";
export type FinalDecision = "accepted" | "changes_requested" | "rejected";

export interface Profile {
  id: string;
  email: string | null;
  display_name: string | null;
}

export interface AcceptanceCriterion {
  id: string;
  project_id: string;
  title: string;
  description: string;
  required: boolean;
  position: number;
}

export interface ProjectMember {
  project_id: string;
  user_id: string;
  role: ProjectRole;
  profile?: Profile | null;
}

export interface Project {
  id: string;
  owner_id: string;
  title: string;
  summary: string;
  status: ProjectStatus;
  deadline: string | null;
  brief_version: number;
  receipt_visibility: "private" | "link";
  created_at: string;
  updated_at: string;
}

export interface Artifact {
  id: string;
  project_id: string;
  uploaded_by: string;
  storage_path: string;
  filename: string;
  mime_type: string;
  size_bytes: number;
  sha256: string;
  description: string;
  created_at: string;
}

export interface CriterionResponse {
  criterion_id: string;
  status: CriterionResponseStatus;
  response: string;
  artifact_ids: string[];
}

export interface MechanicalCheck {
  code: string;
  label: string;
  status: CheckStatus;
  detail: string;
}

export interface Submission {
  id: string;
  project_id: string;
  version: number;
  submitted_by: string;
  summary: string;
  limitations: string;
  ai_use_notes: string;
  status: "submitted" | "changes_requested" | "accepted" | "rejected";
  created_at: string;
  submitted_at: string;
}

export interface Review {
  id: string;
  submission_id: string;
  reviewer_id: string;
  recommendation: ReviewRecommendation;
  notes: string;
  created_at: string;
  reviewer?: Profile | null;
}

export interface Decision {
  id: string;
  submission_id: string;
  decided_by: string;
  decision: FinalDecision;
  comment: string;
  created_at: string;
  decider?: Profile | null;
}

export interface ReceiptRecord {
  id: string;
  project_id: string;
  submission_id: string;
  public_id: string;
  canonical_json: GoalOSReceipt;
  canonical_sha256: string;
  signature: string;
  algorithm: "Ed25519";
  public_key_id: string;
  public_key_pem: string;
  issued_at: string;
  revoked_at: string | null;
  revocation_reason: string | null;
}

export interface GoalOSReceipt {
  schema: "goalos.signoff.receipt.v1";
  receiptId: string;
  publicId: string;
  issuedAt: string;
  mission: {
    projectId: string;
    title: string;
    summary: string;
    briefVersion: number;
    deadline: string | null;
    commitmentHash: string;
  };
  participants: Array<{ role: ProjectRole; displayName: string; subjectHash: string }>;
  acceptanceCriteria: Array<{
    id: string;
    title: string;
    description: string;
    required: boolean;
    responseStatus: CriterionResponseStatus;
    response: string;
    evidenceArtifactHashes: string[];
  }>;
  submission: {
    id: string;
    version: number;
    summary: string;
    limitations: string;
    aiUseNotes: string;
    submittedAt: string;
    evidenceDocketHash: string;
  };
  artifacts: Array<{
    id: string;
    filename: string;
    mimeType: string;
    sizeBytes: number;
    sha256: string;
    description: string;
  }>;
  checks: MechanicalCheck[];
  reviews: Array<{
    recommendation: ReviewRecommendation;
    notes: string;
    reviewerSubjectHash: string;
    createdAt: string;
  }>;
  finalDecision: {
    decision: FinalDecision;
    comment: string;
    decidedAt: string;
    deciderSubjectHash: string;
    decisionHash: string;
  };
  protocolReady: {
    claimBoundaryHash: string;
    riskLedgerHash: string;
    proofBundleHash: string;
    onchainAnchored: boolean;
    chainId: number | null;
    transactionHash: string | null;
    anchorStatus?: "not_requested" | "queued" | "submitted" | "confirmed" | "failed";
    anchorRegistry?: string | null;
  };
}

export interface AuditEvent {
  id: number;
  project_id: string;
  actor_id: string | null;
  event_type: string;
  target_type: string | null;
  target_id: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface ProjectWorkspaceData {
  project: Project;
  criteria: AcceptanceCriterion[];
  members: ProjectMember[];
  artifacts: Artifact[];
  submission: Submission | null;
  submissionArtifactIds: string[];
  responses: CriterionResponse[];
  checks: MechanicalCheck[];
  reviews: Review[];
  decision: Decision | null;
  receipt: ReceiptRecord | null;
  auditEvents: AuditEvent[];
  currentUserId: string;
  currentRole: ProjectRole;
}
