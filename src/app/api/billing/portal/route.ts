import { stripeEnv } from "@/lib/billing";
import { requireRouteUser } from "@/lib/auth/route-user";
import { handleRouteError, ok } from "@/lib/http";
import { assertSafeMutation } from "@/lib/security/request";

export async function POST(request: Request) {
  try {
    assertSafeMutation(request);
    await requireRouteUser();
    const env = stripeEnv();
    if (!env.customerPortalUrl) throw new Error("Customer portal is not configured yet.");
    return ok({ url: env.customerPortalUrl });
  } catch (error) {
    return handleRouteError(error);
  }
}
