import { appUrl } from "@/lib/env";

const clean = (value: string | undefined) => value?.trim() || undefined;

export type CommercialPlanId = "pro" | "team";

export const commercialPlans: Record<CommercialPlanId, { name: string; monthlyPrice: string; priceEnv: string; audience: string; features: string[] }> = {
  pro: {
    name: "Professional",
    monthlyPrice: "$49/mo",
    priceEnv: "STRIPE_PRICE_PRO_MONTHLY",
    audience: "Independent consultants and solo operators",
    features: ["Unlimited personal Signoffs", "Client and reviewer invite links", "Signed Mission Receipts", "PDF + JSON exports", "Private project evidence"]
  },
  team: {
    name: "Team",
    monthlyPrice: "$249/mo",
    priceEnv: "STRIPE_PRICE_TEAM_MONTHLY",
    audience: "Small agencies, AI teams and delivery groups",
    features: ["Everything in Professional", "Shared team workspace", "Reusable acceptance templates", "Reviewer workflow", "Priority onboarding support"]
  }
};

export function stripeEnv() {
  const secretKey = clean(process.env.STRIPE_SECRET_KEY);
  const webhookSecret = clean(process.env.STRIPE_WEBHOOK_SECRET);
  const customerPortalUrl = clean(process.env.STRIPE_CUSTOMER_PORTAL_URL);
  const priceIds: Record<CommercialPlanId, string | undefined> = {
    pro: clean(process.env.STRIPE_PRICE_PRO_MONTHLY),
    team: clean(process.env.STRIPE_PRICE_TEAM_MONTHLY)
  };
  return { secretKey, webhookSecret, customerPortalUrl, priceIds, configured: Boolean(secretKey && priceIds.pro && priceIds.team) };
}

export function checkoutUrls() {
  const base = appUrl();
  return {
    success_url: `${base}/dashboard?checkout=success`,
    cancel_url: `${base}/pricing?checkout=cancelled`
  };
}

export function assertPlan(value: unknown): CommercialPlanId {
  if (value === "pro" || value === "team") return value;
  throw new Error("Unsupported billing plan");
}
