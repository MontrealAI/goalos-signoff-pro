import { randomUUID } from "node:crypto";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { randomToken } from "@/lib/crypto";
import { signingEnv } from "@/lib/env";
import { buildReceipt } from "@/lib/receipt/canonical";
import { signReceipt } from "@/lib/receipt/sign";
import type { AcceptanceCriterion, Artifact, CriterionResponse, Decision, MechanicalCheck, Project, ProjectMember, ReceiptRecord, Review, Submission } from "@/lib/domain";

function requireData<T>(data: T | null, error: { message: string } | null, label: string): T {
  if (error || data == null) throw new Error(`${label}: ${error?.message ?? "missing"}`);
  return data;
}

export async function issueReceiptForSubmission(submissionId: string): Promise<ReceiptRecord> {
  const admin = createAdminSupabaseClient();
  const existing = await admin.from("receipts").select("*").eq("submission_id", submissionId).maybeSingle();
  if (existing.data) return existing.data as ReceiptRecord;
  if (existing.error) throw new Error(existing.error.message);

  const submissionResult = await admin.from("submissions").select("*").eq("id", submissionId).single();
  const submission = requireData(submissionResult.data as Submission | null, submissionResult.error, "Submission");
  const [projectResult, criteriaResult, membersResult, artifactLinksResult, responseResult, evidenceResult, checksResult, reviewsResult, decisionResult] = await Promise.all([
    admin.from("projects").select("*").eq("id", submission.project_id).single(),
    admin.from("acceptance_criteria").select("*").eq("project_id", submission.project_id).order("position"),
    admin.from("project_members").select("project_id,user_id,role,profile:profiles!project_members_user_id_fkey(id,email,display_name)").eq("project_id", submission.project_id),
    admin.from("submission_artifacts").select("artifact_id").eq("submission_id", submissionId),
    admin.from("criterion_responses").select("criterion_id,status,response").eq("submission_id", submissionId),
    admin.from("criterion_evidence").select("criterion_id,artifact_id").eq("submission_id", submissionId),
    admin.from("mechanical_checks").select("code,label,status,detail").eq("submission_id", submissionId),
    admin.from("reviews").select("*,reviewer:profiles!reviews_reviewer_id_fkey(id,email,display_name)").eq("submission_id", submissionId).order("created_at"),
    admin.from("decisions").select("*,decider:profiles!decisions_decided_by_fkey(id,email,display_name)").eq("submission_id", submissionId).single()
  ]);
  const project = requireData(projectResult.data as Project | null, projectResult.error, "Project");
  const decision = requireData(decisionResult.data as unknown as Decision | null, decisionResult.error, "Decision");
  if (decision.decision !== "accepted") throw new Error("A receipt can be issued only for an accepted submission.");
  for (const [label, result] of [["Criteria", criteriaResult], ["Members", membersResult], ["Artifact links", artifactLinksResult], ["Responses", responseResult], ["Evidence", evidenceResult], ["Checks", checksResult], ["Reviews", reviewsResult]] as const) {
    if (result.error) throw new Error(`${label}: ${result.error.message}`);
  }
  const artifactIds = (artifactLinksResult.data ?? []).map((row) => row.artifact_id);
  const artifactResult = artifactIds.length ? await admin.from("artifacts").select("*").in("id", artifactIds).order("created_at") : { data: [], error: null };
  if (artifactResult.error) throw new Error(`Artifacts: ${artifactResult.error.message}`);
  const evidenceByCriterion = new Map<string, string[]>();
  for (const row of evidenceResult.data ?? []) {
    const list = evidenceByCriterion.get(row.criterion_id) ?? [];
    list.push(row.artifact_id);
    evidenceByCriterion.set(row.criterion_id, list);
  }
  const responses = (responseResult.data ?? []).map((row) => ({ ...row, artifact_ids: evidenceByCriterion.get(row.criterion_id) ?? [] })) as CriterionResponse[];
  const receiptId = randomUUID();
  const publicId = `gs_${randomToken(18)}`;
  const issuedAt = new Date().toISOString();
  const receipt = buildReceipt({
    receiptId,
    publicId,
    issuedAt,
    project,
    criteria: criteriaResult.data as AcceptanceCriterion[],
    members: (membersResult.data ?? []).map((row) => ({ project_id: row.project_id, user_id: row.user_id, role: row.role, profile: Array.isArray(row.profile) ? row.profile[0] : row.profile })) as ProjectMember[],
    submission,
    responses,
    artifacts: artifactResult.data as Artifact[],
    checks: checksResult.data as MechanicalCheck[],
    reviews: reviewsResult.data as unknown as Review[],
    decision
  });
  const signed = signReceipt(receipt);
  const publicKeyPem = signingEnv().publicKey;
  if (!publicKeyPem) throw new Error("Receipt signing public key is not configured.");
  const inserted = await admin.from("receipts").insert({
    id: receiptId,
    project_id: project.id,
    submission_id: submission.id,
    public_id: publicId,
    canonical_json: signed.canonicalJson,
    canonical_sha256: signed.canonicalSha256,
    signature: signed.signature,
    algorithm: signed.algorithm,
    public_key_id: signed.publicKeyId,
    public_key_pem: publicKeyPem,
    issued_at: issuedAt
  }).select("*").single();
  if (inserted.error) throw new Error(`Receipt: ${inserted.error.message}`);
  await admin.from("audit_events").insert({ project_id: project.id, actor_id: decision.decided_by, event_type: "receipt.issued", target_type: "receipt", target_id: receiptId, metadata: { publicId, canonicalSha256: signed.canonicalSha256 } });
  return inserted.data as ReceiptRecord;
}
