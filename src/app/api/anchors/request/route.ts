import crypto from "node:crypto";
import { requireRouteUser } from "@/lib/auth/route-user";
import { handleRouteError, ok } from "@/lib/http";
import { assertSafeMutation } from "@/lib/security/request";

function sha256Hex(value: string) {
  return "0x" + crypto.createHash("sha256").update(value).digest("hex");
}

export async function POST(request: Request) {
  try {
    assertSafeMutation(request);
    const { supabase } = await requireRouteUser();
    const payload = await request.json() as { publicId?: string; receiptCid?: string; evidenceCid?: string };
    const publicId = String(payload.publicId || "").trim();
    if (!publicId) throw new Error("Missing public receipt id");
    const { data: receipt, error } = await supabase.from("receipts").select("id,project_id,public_id,canonical_json,canonical_sha256,issued_at,revoked_at").eq("public_id", publicId).maybeSingle();
    if (error) throw new Error(error.message);
    if (!receipt) throw new Error("Receipt not found");
    if (receipt.revoked_at) throw new Error("Revoked receipts cannot be anchored");
    const canonical = JSON.stringify(receipt.canonical_json);
    const evidenceRoot = sha256Hex(canonical + "::evidence-root");
    const publicIdHash = sha256Hex(receipt.public_id);
    const acceptedAt = Math.floor(new Date(receipt.issued_at).getTime() / 1000);
    const { data: inserted, error: insertError } = await supabase.from("blockchain_anchor_requests").insert({
      receipt_id: receipt.id,
      receipt_hash: receipt.canonical_sha256,
      public_id_hash: publicIdHash,
      evidence_root: evidenceRoot,
      receipt_cid: payload.receiptCid || null,
      evidence_cid: payload.evidenceCid || null,
      accepted_at_unix: acceptedAt
    }).select("id,status,created_at").single();
    if (insertError) throw new Error(insertError.message);
    return ok({ request: inserted, receiptHash: receipt.canonical_sha256, publicIdHash, evidenceRoot });
  } catch (error) {
    return handleRouteError(error);
  }
}
