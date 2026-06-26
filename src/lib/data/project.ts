import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { AcceptanceCriterion, Artifact, AuditEvent, CriterionResponse, Decision, MechanicalCheck, Project, ProjectMember, ProjectRole, ProjectWorkspaceData, ReceiptRecord, Review, Submission } from "@/lib/domain";

function assertNoError(error: { message: string } | null, context: string) {
  if (error) throw new Error(`${context}: ${error.message}`);
}

export async function loadProjectWorkspace(projectId: string, currentUserId: string): Promise<ProjectWorkspaceData | null> {
  const supabase = await createServerSupabaseClient();
  const [projectResult, criteriaResult, membersResult, artifactsResult, roleResult, auditResult] = await Promise.all([
    supabase.from("projects").select("*").eq("id", projectId).maybeSingle(),
    supabase.from("acceptance_criteria").select("*").eq("project_id", projectId).order("position"),
    supabase.from("project_members").select("project_id,user_id,role,profile:profiles!project_members_user_id_fkey(id,email,display_name)").eq("project_id", projectId),
    supabase.from("artifacts").select("*").eq("project_id", projectId).order("created_at"),
    supabase.from("project_members").select("role").eq("project_id", projectId).eq("user_id", currentUserId).maybeSingle(),
    supabase.from("audit_events").select("*").eq("project_id", projectId).order("created_at", { ascending: false }).limit(100)
  ]);
  if (projectResult.error?.code === "PGRST116" || !projectResult.data) return null;
  assertNoError(projectResult.error, "Project");
  assertNoError(criteriaResult.error, "Criteria");
  assertNoError(membersResult.error, "Members");
  assertNoError(artifactsResult.error, "Artifacts");
  assertNoError(roleResult.error, "Membership");
  assertNoError(auditResult.error, "Activity");
  if (!roleResult.data?.role) return null;

  const latest = await supabase.from("submissions").select("*").eq("project_id", projectId).order("version", { ascending: false }).limit(1).maybeSingle();
  assertNoError(latest.error, "Submission");
  const submission: Submission | null = latest.data as Submission | null;
  let submissionArtifactIds: string[] = [];
  let responses: CriterionResponse[] = [];
  let checks: MechanicalCheck[] = [];
  let reviews: Review[] = [];
  let decision: Decision | null = null;
  let receipt: ReceiptRecord | null = null;

  if (submission) {
    const [responsesResult, evidenceResult, checksResult, reviewsResult, decisionResult, receiptResult, selectedArtifactsResult] = await Promise.all([
      supabase.from("criterion_responses").select("criterion_id,status,response").eq("submission_id", submission.id),
      supabase.from("criterion_evidence").select("criterion_id,artifact_id").eq("submission_id", submission.id),
      supabase.from("mechanical_checks").select("code,label,status,detail").eq("submission_id", submission.id),
      supabase.from("reviews").select("*,reviewer:profiles!reviews_reviewer_id_fkey(id,email,display_name)").eq("submission_id", submission.id).order("created_at"),
      supabase.from("decisions").select("*,decider:profiles!decisions_decided_by_fkey(id,email,display_name)").eq("submission_id", submission.id).maybeSingle(),
      supabase.from("receipts").select("*").eq("submission_id", submission.id).maybeSingle(),
      supabase.from("submission_artifacts").select("artifact_id").eq("submission_id", submission.id)
    ]);
    [responsesResult, evidenceResult, checksResult, reviewsResult, decisionResult, receiptResult, selectedArtifactsResult].forEach((result, index) => assertNoError(result.error, ["Responses", "Evidence", "Checks", "Reviews", "Decision", "Receipt", "Selected artifacts"][index]));
    const evidenceByCriterion = new Map<string, string[]>();
    for (const row of evidenceResult.data ?? []) {
      const list = evidenceByCriterion.get(row.criterion_id) ?? [];
      list.push(row.artifact_id);
      evidenceByCriterion.set(row.criterion_id, list);
    }
    responses = (responsesResult.data ?? []).map((row) => ({ ...row, artifact_ids: evidenceByCriterion.get(row.criterion_id) ?? [] })) as CriterionResponse[];
    checks = checksResult.data as MechanicalCheck[];
    reviews = reviewsResult.data as unknown as Review[];
    decision = decisionResult.data as unknown as Decision | null;
    receipt = receiptResult.data as unknown as ReceiptRecord | null;
    submissionArtifactIds = (selectedArtifactsResult.data ?? []).map((row) => row.artifact_id);
  }

  return {
    project: projectResult.data as Project,
    criteria: criteriaResult.data as AcceptanceCriterion[],
    members: (membersResult.data ?? []).map((row) => ({ project_id: row.project_id, user_id: row.user_id, role: row.role, profile: Array.isArray(row.profile) ? row.profile[0] : row.profile })) as ProjectMember[],
    artifacts: artifactsResult.data as Artifact[],
    submission,
    submissionArtifactIds,
    responses,
    checks,
    reviews,
    decision,
    receipt,
    auditEvents: (auditResult.data ?? []) as AuditEvent[],
    currentUserId,
    currentRole: roleResult.data.role as ProjectRole
  };
}
