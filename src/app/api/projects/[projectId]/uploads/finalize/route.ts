import { createHash } from "node:crypto";
import { requireProjectRole } from "@/lib/auth/project-access";
import { requireRouteUser } from "@/lib/auth/route-user";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { finalizeUploadSchema } from "@/lib/validation";
import { fail, handleRouteError, ok } from "@/lib/http";
import { assertSafeMutation } from "@/lib/security/request";

export const runtime = "nodejs";

export async function POST(request: Request, context: { params: Promise<{ projectId: string }> }) {
  try {
    assertSafeMutation(request);
    const { projectId } = await context.params;
    const { supabase, user } = await requireRouteUser();
    await requireProjectRole(supabase, projectId, user.id, ["client", "builder"]);
    const { intentId } = finalizeUploadSchema.parse(await request.json());
    const admin = createAdminSupabaseClient();
    const intentResult = await admin.from("upload_intents").select("*").eq("id", intentId).eq("project_id", projectId).maybeSingle();
    if (intentResult.error) throw new Error(intentResult.error.message);
    const intent = intentResult.data;
    if (!intent || intent.created_by !== user.id) return fail("Upload intent not found.", 404);
    if (intent.finalized_at) return fail("This upload was already finalized.", 409);
    if (new Date(intent.expires_at).getTime() < Date.now()) return fail("The upload link expired. Please upload the file again.", 410);
    const download = await admin.storage.from("signoff-artifacts").download(intent.storage_path);
    if (download.error || !download.data) throw new Error(download.error?.message ?? "The uploaded file could not be read.");
    const buffer = Buffer.from(await download.data.arrayBuffer());
    const observedHash = createHash("sha256").update(buffer).digest("hex");
    if (buffer.byteLength !== Number(intent.size_bytes) || observedHash !== intent.expected_sha256) {
      await admin.storage.from("signoff-artifacts").remove([intent.storage_path]);
      throw new Error("The uploaded file did not match its expected size or fingerprint and was deleted.");
    }
    const artifactResult = await admin.from("artifacts").insert({
      project_id: projectId,
      uploaded_by: user.id,
      upload_intent_id: intent.id,
      storage_path: intent.storage_path,
      filename: intent.filename,
      mime_type: intent.mime_type,
      size_bytes: intent.size_bytes,
      sha256: observedHash,
      description: intent.description
    }).select("*").single();
    if (artifactResult.error) throw new Error(artifactResult.error.message);
    await admin.from("upload_intents").update({ finalized_at: new Date().toISOString() }).eq("id", intent.id);
    await admin.from("audit_events").insert({ project_id: projectId, actor_id: user.id, event_type: "artifact.uploaded", target_type: "artifact", target_id: artifactResult.data.id, metadata: { sha256: observedHash, filename: intent.filename } });
    return ok({ artifact: artifactResult.data }, 201);
  } catch (error) {
    return handleRouteError(error);
  }
}
