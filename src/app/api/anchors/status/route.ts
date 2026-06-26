import { requireRouteUser } from "@/lib/auth/route-user";
import { handleRouteError, ok } from "@/lib/http";

export async function GET(request: Request) {
  try {
    const { supabase } = await requireRouteUser();
    const url = new URL(request.url);
    const publicId = url.searchParams.get("publicId") || "";
    if (!publicId) throw new Error("Missing public receipt id");
    const { data: receipt, error } = await supabase.from("receipts").select("id,public_id").eq("public_id", publicId).maybeSingle();
    if (error) throw new Error(error.message);
    if (!receipt) throw new Error("Receipt not found");
    const anchors = await supabase.from("blockchain_anchors").select("chain_id,contract_address,transaction_hash,block_number,receipt_cid,evidence_cid,status,explorer_url,created_at").eq("receipt_id", receipt.id).order("created_at", { ascending: false });
    if (anchors.error) throw new Error(anchors.error.message);
    const requests = await supabase.from("blockchain_anchor_requests").select("id,status,transaction_hash,last_error,created_at,updated_at").eq("receipt_id", receipt.id).order("created_at", { ascending: false }).limit(5);
    if (requests.error) throw new Error(requests.error.message);
    return ok({ anchors: anchors.data || [], requests: requests.data || [] });
  } catch (error) {
    return handleRouteError(error);
  }
}
