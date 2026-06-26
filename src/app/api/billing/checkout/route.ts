import { assertPlan, checkoutUrls, commercialPlans, stripeEnv } from "@/lib/billing";
import { requireRouteUser } from "@/lib/auth/route-user";
import { handleRouteError, ok } from "@/lib/http";
import { assertSafeMutation } from "@/lib/security/request";

async function createStripeCheckoutSession(params: { secretKey: string; priceId: string; email: string | null; plan: string }) {
  const { success_url, cancel_url } = checkoutUrls();
  const body = new URLSearchParams({
    mode: "subscription",
    "line_items[0][price]": params.priceId,
    "line_items[0][quantity]": "1",
    success_url,
    cancel_url,
    allow_promotion_codes: "true",
    "metadata[goalos_plan]": params.plan
  });
  if (params.email) body.set("customer_email", params.email);
  const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: { authorization: `Bearer ${params.secretKey}`, "content-type": "application/x-www-form-urlencoded" },
    body
  });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload?.error?.message ?? "Stripe checkout failed");
  return payload as { id: string; url: string };
}

export async function POST(request: Request) {
  try {
    assertSafeMutation(request);
    const { user } = await requireRouteUser();
    const { plan: rawPlan } = await request.json();
    const plan = assertPlan(rawPlan);
    const env = stripeEnv();
    if (!env.secretKey || !env.priceIds[plan]) throw new Error("Billing is not configured. Ask the workspace owner to add Stripe environment variables.");
    const session = await createStripeCheckoutSession({ secretKey: env.secretKey, priceId: env.priceIds[plan]!, email: user.email, plan: commercialPlans[plan].name });
    return ok({ id: session.id, url: session.url });
  } catch (error) {
    return handleRouteError(error);
  }
}
