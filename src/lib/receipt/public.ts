import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { verifyReceipt } from "@/lib/receipt/sign";
import type { GoalOSReceipt, ReceiptRecord } from "@/lib/domain";

export interface ReceiptEnvelope {
  record: ReceiptRecord;
  verified: boolean;
  valid: boolean;
  revokedAt: string | null;
  revocationReason: string | null;
  publicKeyPem: string | null;
  visibility: "private" | "link";
}

export async function loadVisibleReceipt(publicId: string): Promise<ReceiptEnvelope | null> {
  const admin = createAdminSupabaseClient();
  const result = await admin.from("receipts").select("*,project:projects(receipt_visibility)").eq("public_id", publicId).maybeSingle();
  if (result.error) throw new Error(result.error.message);
  if (!result.data) return null;
  const project = Array.isArray(result.data.project) ? result.data.project[0] : result.data.project;
  const visibility = (project?.receipt_visibility ?? "private") as "private" | "link";
  if (visibility === "private") {
    const supabase = await createServerSupabaseClient();
    const claimsResult = await supabase.auth.getClaims();
    const userId = claimsResult.data?.claims?.sub ? String(claimsResult.data.claims.sub) : null;
    if (!userId) return null;
    const membership = await admin.from("project_members").select("user_id").eq("project_id", result.data.project_id).eq("user_id", userId).maybeSingle();
    if (!membership.data) return null;
  }
  const record = result.data as unknown as ReceiptRecord;
  const publicKey = record.public_key_pem || null;
  const verified = verifyReceipt(record.canonical_json as GoalOSReceipt, record.signature, publicKey ?? undefined);
  return { record, verified, valid: verified && !record.revoked_at, revokedAt: record.revoked_at, revocationReason: record.revocation_reason, publicKeyPem: publicKey, visibility };
}
