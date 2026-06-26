import { requireProjectRole } from "@/lib/auth/project-access";
import { requireRouteUser } from "@/lib/auth/route-user";
import { canSubmit, runMechanicalChecks } from "@/lib/checks/mechanical";
import type { AcceptanceCriterion, Artifact } from "@/lib/domain";
import { fail, handleRouteError, ok } from "@/lib/http";
import { submissionSchema } from "@/lib/validation";
import { assertSafeMutation } from "@/lib/security/request";

export async function POST(request: Request, context: { params: Promise<{ projectId: string }> }) {
  try {
    assertSafeMutation(request);
    const { projectId } = await context.params;
    const { supabase, user } = await requireRouteUser();
    await requireProjectRole(supabase, projectId, user.id, ["client", "builder"]);
    const payload = submissionSchema.parse(await request.json());
    const uniqueArtifactIds = [...new Set(payload.artifactIds)];
    const [criteriaResult, artifactsResult] = await Promise.all([
      supabase.from("acceptance_criteria").select("*").eq("project_id", projectId).order("position"),
      supabase.from("artifacts").select("*").eq("project_id", projectId).in("id", uniqueArtifactIds)
    ]);
    if (criteriaResult.error) throw new Error(criteriaResult.error.message);
    if (artifactsResult.error) throw new Error(artifactsResult.error.message);
    const criteria = criteriaResult.data as AcceptanceCriterion[];
    const artifacts = artifactsResult.data as Artifact[];
    if (artifacts.length !== uniqueArtifactIds.length) return fail("One or more selected artifacts are missing or inaccessible.", 422);
    const criterionIds = new Set(criteria.map((criterion) => criterion.id));
    const responseIds = new Set(payload.responses.map((response) => response.criterion_id));
    if (criterionIds.size !== responseIds.size || [...criterionIds].some((id) => !responseIds.has(id))) return fail("Answer every acceptance criterion before submitting.", 422);
    if (payload.responses.some((response) => response.artifact_ids.some((artifactId) => !uniqueArtifactIds.includes(artifactId)))) return fail("A criterion references an artifact that is not part of this submission.", 422);
    const checks = runMechanicalChecks({
      criteria,
      responses: payload.responses,
      artifacts,
      summary: payload.summary,
      limitations: payload.limitations,
      aiUseNotes: payload.aiUseNotes
    });
    if (!canSubmit(checks)) return fail("The package is not ready to submit. Resolve the failed checks first.", 422, { checks });
    const { data, error } = await supabase.rpc("create_signoff_submission", {
      p_project_id: projectId,
      p_summary: payload.summary,
      p_limitations: payload.limitations,
      p_ai_use_notes: payload.aiUseNotes,
      p_artifact_ids: uniqueArtifactIds,
      p_responses: payload.responses
    });
    if (error) throw new Error(error.message);
    return ok({ submissionId: data, checks }, 201);
  } catch (error) {
    return handleRouteError(error);
  }
}
