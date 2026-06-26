import { randomToken, sha256Hex } from "@/lib/crypto";
import { appUrl } from "@/lib/env";
import { sendInvitationEmail } from "@/lib/email";
import { requireProjectRole } from "@/lib/auth/project-access";
import { requireRouteUser } from "@/lib/auth/route-user";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { handleRouteError, ok } from "@/lib/http";
import { invitationSchema } from "@/lib/validation";
import { assertSafeMutation } from "@/lib/security/request";

export async function POST(request: Request, context: { params: Promise<{ projectId: string }> }) {
  try {
    assertSafeMutation(request);
    const { projectId } = await context.params;
    const { supabase, user } = await requireRouteUser();
    await requireProjectRole(supabase, projectId, user.id, ["client"]);
    const payload = invitationSchema.parse(await request.json());
    const { data: project, error: projectError } = await supabase.from("projects").select("title").eq("id", projectId).single();
    if (projectError || !project) throw new Error("Project not found.");
    const token = randomToken(32);
    const tokenHash = sha256Hex(token);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    const admin = createAdminSupabaseClient();
    const { data: invitation, error } = await admin.from("invitations").insert({
      project_id: projectId,
      email: payload.email,
      role: payload.role,
      token_hash: tokenHash,
      expires_at: expiresAt,
      created_by: user.id
    }).select("id").single();
    if (error) throw new Error(error.message);
    const inviteUrl = `${appUrl().replace(/\/$/, "")}/invite/${token}`;
    let emailSent = false;
    let emailWarning: string | null = null;
    try {
      const emailResult = await sendInvitationEmail({ to: payload.email, projectTitle: project.title, role: payload.role, inviteUrl });
      emailSent = emailResult.sent;
      if (!emailResult.sent) emailWarning = emailResult.reason ?? null;
    } catch (emailError) {
      emailWarning = emailError instanceof Error ? emailError.message : "Email was not sent.";
    }
    await admin.from("audit_events").insert({ project_id: projectId, actor_id: user.id, event_type: "invitation.created", target_type: "invitation", target_id: invitation.id, metadata: { role: payload.role, emailSent } });
    return ok({ inviteUrl, expiresAt, emailSent, emailWarning }, 201);
  } catch (error) {
    return handleRouteError(error);
  }
}
