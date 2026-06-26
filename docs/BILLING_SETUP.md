# Optional Stripe billing setup

Billing is optional. Leave these fields blank for a free private beta.

## What billing does

The commercial package includes a simple Stripe Checkout integration for Professional and Team plans.

It does not control project permissions by itself. For production, connect Stripe webhook events to plan limits before enforcing paid usage.

## Environment variables

Add these server-side environment variables:

```text
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PRICE_PRO_MONTHLY=price_...
STRIPE_PRICE_TEAM_MONTHLY=price_...
STRIPE_CUSTOMER_PORTAL_URL=https://billing.stripe.com/...
STRIPE_WEBHOOK_SECRET=whsec_...
```

Use test-mode values until you complete your first pilot.

## Recommended launch posture

1. Start with the free plan and manual invoices.
2. Turn on Stripe Checkout for Professional and Team only after the workflow is stable.
3. Treat human review as a manually scheduled service first.
4. Add automatic plan-limit enforcement after pilot feedback.

## Safety

Never put the Stripe secret key in browser code, README files, screenshots, or public issue comments.
