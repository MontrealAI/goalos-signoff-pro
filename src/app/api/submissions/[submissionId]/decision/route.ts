import { requireRouteUser } from "@/lib/auth/route-user";
import { issueReceiptForSubmission } from "@/lib/receipt/issue";
import { decisionSchema } from "@/lib/validation";
import { handleRouteError, ok } from "@/lib/http";
import { assertSafeMutation } from "@/lib/security/request";

export async function POST(request: Request, context: { params: Promise<{ submissionId: string }> }) {
  try {
    assertSafeMutation(request);
    const { submissionId } = await context.params;
    const { supabase } = await requireRouteUser();
    const payload = decisionSchema.parse(await request.json());
    const decisionResult = await supabase.rpc("record_final_decision", { p_submission_id: submissionId, p_decision: payload.decision, p_comment: payload.comment });
    if (decisionResult.error) throw new Error(decisionResult.error.message);
    if (payload.decision !== "accepted") return ok({ decisionId: decisionResult.data, receipt: null }, 201);
    try {
      const receipt = await issueReceiptForSubmission(submissionId);
      return ok({ decisionId: decisionResult.data, receipt }, 201);
    } catch (receiptError) {
      console.error("Decision recorded but receipt issuance failed", receiptError);
      return ok({ decisionId: decisionResult.data, receipt: null, receiptPending: true, warning: "Acceptance was recorded, but receipt issuance needs to be retried after checking the signing-key setup." }, 202);
    }
  } catch (error) {
    return handleRouteError(error);
  }
}
