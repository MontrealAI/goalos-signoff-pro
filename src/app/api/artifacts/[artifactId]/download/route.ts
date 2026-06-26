import { NextResponse } from "next/server";
import { requireRouteUser } from "@/lib/auth/route-user";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { fail, handleRouteError } from "@/lib/http";

export async function GET(_request: Request, context: { params: Promise<{ artifactId: string }> }) {
  try {
    const { artifactId } = await context.params;
    const { supabase } = await requireRouteUser();
    const result = await supabase.from("artifacts").select("storage_path").eq("id", artifactId).maybeSingle();
    if (result.error) throw new Error(result.error.message);
    if (!result.data) return fail("Artifact not found.", 404);
    const admin = createAdminSupabaseClient();
    const signed = await admin.storage.from("signoff-artifacts").createSignedUrl(result.data.storage_path, 60, { download: true });
    if (signed.error || !signed.data?.signedUrl) throw new Error(signed.error?.message ?? "Could not create download link.");
    return NextResponse.redirect(signed.data.signedUrl);
  } catch (error) {
    return handleRouteError(error);
  }
}
