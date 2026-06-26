import { loadVisibleReceipt } from "@/lib/receipt/public";
import { fail, handleRouteError } from "@/lib/http";

export async function GET(_request: Request, context: { params: Promise<{ publicId: string }> }) {
  try {
    const { publicId } = await context.params;
    const envelope = await loadVisibleReceipt(publicId);
    if (!envelope) return fail("Receipt not found or not accessible.", 404);
    return new Response(JSON.stringify({
      schema: "goalos.signoff.envelope.v1",
      verified: envelope.verified,
      valid: envelope.valid,
      revokedAt: envelope.revokedAt,
      revocationReason: envelope.revocationReason,
      canonicalSha256: envelope.record.canonical_sha256,
      signature: envelope.record.signature,
      algorithm: envelope.record.algorithm,
      publicKeyId: envelope.record.public_key_id,
      publicKeyPem: envelope.publicKeyPem,
      receipt: envelope.record.canonical_json
    }, null, 2), {
      headers: { "content-type": "application/json; charset=utf-8", "content-disposition": `attachment; filename="goalos-signoff-${publicId}.json"`, "cache-control": "private, no-store" }
    });
  } catch (error) {
    return handleRouteError(error);
  }
}
