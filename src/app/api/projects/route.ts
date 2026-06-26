import { projectSchema } from "@/lib/validation";
import { requireRouteUser } from "@/lib/auth/route-user";
import { handleRouteError, ok } from "@/lib/http";
import { assertSafeMutation } from "@/lib/security/request";

export async function POST(request: Request) {
  try {
    assertSafeMutation(request);
    const { supabase } = await requireRouteUser();
    const payload = projectSchema.parse(await request.json());
    const { data, error } = await supabase.rpc("create_signoff_project", { p_payload: payload });
    if (error) throw new Error(error.message);
    return ok({ projectId: data }, 201);
  } catch (error) {
    return handleRouteError(error);
  }
}
