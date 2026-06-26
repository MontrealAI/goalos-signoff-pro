import { loadVisibleReceipt } from "@/lib/receipt/public";
import { createReceiptPdf } from "@/lib/receipt/pdf";
import { fail, handleRouteError } from "@/lib/http";

export const runtime = "nodejs";

export async function GET(_request: Request, context: { params: Promise<{ publicId: string }> }) {
  try {
    const { publicId } = await context.params;
    const envelope = await loadVisibleReceipt(publicId);
    if (!envelope) return fail("Receipt not found or not accessible.", 404);
    const pdf = await createReceiptPdf(envelope);
    return new Response(Buffer.from(pdf), { headers: { "content-type": "application/pdf", "content-disposition": `attachment; filename="goalos-signoff-${publicId}.pdf"`, "cache-control": "private, no-store" } });
  } catch (error) {
    return handleRouteError(error);
  }
}
