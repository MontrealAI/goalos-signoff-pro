import { requireRouteUser } from "@/lib/auth/route-user";
import { requireProjectRole } from "@/lib/auth/project-access";
import { issueReceiptForSubmission } from "@/lib/receipt/issue";
import { handleRouteError, ok } from "@/lib/http";
import { assertSafeMutation } from "@/lib/security/request";

export async function POST(request: Request, context: { params: Promise<{ submissionId: string }> }) {
  try {
    assertSafeMutation(request);
    const { submissionId } = await context.params;
    const { supabase, user } = await requireRouteUser();
    const submissionResult = await supabase.from("submissions").select("project_id,status").eq("id", submissionId).maybeSingle();
    if (submissionResult.error || !submissionResult.data) throw new Error("Submission not found.");
    await requireProjectRole(supabase, submissionResult.data.project_id, user.id, ["client"]);
    if (submissionResult.data.status !== "accepted") throw new Error("Only an accepted submission can receive a receipt.");
    return ok({ receipt: await issueReceiptForSubmission(submissionId) }, 201);
  } catch (error) {
    return handleRouteError(error);
  }
}
