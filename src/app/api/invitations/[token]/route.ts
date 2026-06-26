import { sha256Hex } from "@/lib/crypto";
import { requireRouteUser } from "@/lib/auth/route-user";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { fail, handleRouteError, ok } from "@/lib/http";
import { assertSafeMutation } from "@/lib/security/request";

async function loadInvitation(token: string) {
  const admin = createAdminSupabaseClient();
  const { data, error } = await admin.from("invitations").select("*,project:projects(id,title,summary)").eq("token_hash", sha256Hex(token)).maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) return { admin, invitation: null };
  return { admin, invitation: data };
}

export async function GET(_request: Request, context: { params: Promise<{ token: string }> }) {
  try {
    const { token } = await context.params;
    const { invitation } = await loadInvitation(token);
    if (!invitation) return fail("Invitation not found.", 404);
    if (invitation.accepted_at) return fail("This invitation has already been used.", 410);
    if (new Date(invitation.expires_at).getTime() < Date.now()) return fail("This invitation has expired.", 410);
    const project = Array.isArray(invitation.project) ? invitation.project[0] : invitation.project;
    return ok({ email: invitation.email, role: invitation.role, expiresAt: invitation.expires_at, project });
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function POST(request: Request, context: { params: Promise<{ token: string }> }) {
  try {
    assertSafeMutation(request);
    const { token } = await context.params;
    const { user } = await requireRouteUser();
    const { admin, invitation } = await loadInvitation(token);
    if (!invitation) return fail("Invitation not found.", 404);
    if (invitation.accepted_at) return fail("This invitation has already been used.", 410);
    if (new Date(invitation.expires_at).getTime() < Date.now()) return fail("This invitation has expired.", 410);
    if (!user.email || user.email.toLowerCase() !== String(invitation.email).toLowerCase()) return fail(`Sign in as ${invitation.email} to accept this invitation.`, 403);
    const { error: memberError } = await admin.from("project_members").upsert({ project_id: invitation.project_id, user_id: user.id, role: invitation.role, invited_by: invitation.created_by }, { onConflict: "project_id,user_id" });
    if (memberError) throw new Error(memberError.message);
    const { error: updateError } = await admin.from("invitations").update({ accepted_at: new Date().toISOString() }).eq("id", invitation.id).is("accepted_at", null);
    if (updateError) throw new Error(updateError.message);
    await admin.from("audit_events").insert({ project_id: invitation.project_id, actor_id: user.id, event_type: "invitation.accepted", target_type: "invitation", target_id: invitation.id, metadata: { role: invitation.role } });
    return ok({ projectId: invitation.project_id, role: invitation.role });
  } catch (error) {
    return handleRouteError(error);
  }
}
