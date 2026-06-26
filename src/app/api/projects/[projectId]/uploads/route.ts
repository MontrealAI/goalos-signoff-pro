import { randomUUID } from "node:crypto";
import { requireProjectRole } from "@/lib/auth/project-access";
import { requireRouteUser } from "@/lib/auth/route-user";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { allowedMimeTypes, isAllowedFilePair, safeFilename, uploadIntentSchema } from "@/lib/validation";
import { handleRouteError, ok } from "@/lib/http";
import { assertSafeMutation } from "@/lib/security/request";

export async function POST(request: Request, context: { params: Promise<{ projectId: string }> }) {
  try {
    assertSafeMutation(request);
    const { projectId } = await context.params;
    const { supabase, user } = await requireRouteUser();
    await requireProjectRole(supabase, projectId, user.id, ["client", "builder"]);
    const payload = uploadIntentSchema.parse(await request.json());
    if (!allowedMimeTypes.has(payload.mimeType)) throw new Error("This file type is not allowed. Use PDF, Office, text, JSON, ZIP, PNG, JPEG, or WebP.");
    if (!isAllowedFilePair(payload.filename, payload.mimeType)) throw new Error("The filename extension does not match the selected file type.");
    const filename = safeFilename(payload.filename);
    const storagePath = `${projectId}/${user.id}/${randomUUID()}-${filename}`;
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000).toISOString();
    const admin = createAdminSupabaseClient();
    const intentResult = await admin.from("upload_intents").insert({
      project_id: projectId,
      created_by: user.id,
      storage_path: storagePath,
      filename,
      mime_type: payload.mimeType,
      size_bytes: payload.sizeBytes,
      expected_sha256: payload.sha256,
      description: payload.description,
      expires_at: expiresAt
    }).select("id").single();
    if (intentResult.error) throw new Error(intentResult.error.message);
    const signedResult = await admin.storage.from("signoff-artifacts").createSignedUploadUrl(storagePath, { upsert: false });
    if (signedResult.error || !signedResult.data?.token) {
      await admin.from("upload_intents").delete().eq("id", intentResult.data.id);
      throw new Error(signedResult.error?.message ?? "Could not create a secure upload link.");
    }
    return ok({ intentId: intentResult.data.id, path: storagePath, token: signedResult.data.token, expiresAt }, 201);
  } catch (error) {
    return handleRouteError(error);
  }
}
