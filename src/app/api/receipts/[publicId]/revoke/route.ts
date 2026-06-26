import { requireRouteUser } from "@/lib/auth/route-user";
import { handleRouteError, ok } from "@/lib/http";
import { assertSafeMutation } from "@/lib/security/request";
import { z } from "zod";

const schema = z.object({ reason: z.string().trim().min(3).max(1000) });

export async function POST(request: Request, context: { params: Promise<{ publicId: string }> }) {
  try {
    assertSafeMutation(request);
    const { publicId } = await context.params;
    const { supabase } = await requireRouteUser();
    const { reason } = schema.parse(await request.json());
    const result = await supabase.rpc("revoke_signoff_receipt", { p_public_id: publicId, p_reason: reason });
    if (result.error) throw new Error(result.error.message);
    return ok({ revoked: result.data === true });
  } catch (error) {
    return handleRouteError(error);
  }
}
