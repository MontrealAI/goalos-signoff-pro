import { requireProjectRole } from "@/lib/auth/project-access";
import { requireRouteUser } from "@/lib/auth/route-user";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { handleRouteError, ok } from "@/lib/http";
import { reviewSchema } from "@/lib/validation";
import { assertSafeMutation } from "@/lib/security/request";

export async function POST(request: Request, context: { params: Promise<{ submissionId: string }> }) {
  try {
    assertSafeMutation(request);
    const { submissionId } = await context.params;
    const { supabase, user } = await requireRouteUser();
    const payload = reviewSchema.parse(await request.json());
    const submissionResult = await supabase.from("submissions").select("project_id,status").eq("id", submissionId).maybeSingle();
    if (submissionResult.error || !submissionResult.data) throw new Error("Submission not found.");
    await requireProjectRole(supabase, submissionResult.data.project_id, user.id, ["reviewer", "client"]);
    if (submissionResult.data.status !== "submitted") throw new Error("This submission is no longer open for review.");
    const reviewResult = await supabase.from("reviews").insert({ submission_id: submissionId, reviewer_id: user.id, recommendation: payload.recommendation, notes: payload.notes }).select("*").single();
    if (reviewResult.error) throw new Error(reviewResult.error.code === "23505" ? "You have already reviewed this submission." : reviewResult.error.message);
    const admin = createAdminSupabaseClient();
    await admin.from("audit_events").insert({ project_id: submissionResult.data.project_id, actor_id: user.id, event_type: "review.recorded", target_type: "review", target_id: reviewResult.data.id, metadata: { recommendation: payload.recommendation } });
    return ok({ review: reviewResult.data }, 201);
  } catch (error) {
    return handleRouteError(error);
  }
}
