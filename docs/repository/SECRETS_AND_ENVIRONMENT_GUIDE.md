# Secrets and Environment Guide

## Safe rule

The repository stores code. Your deployment provider stores production secrets.

## Files that are safe to commit

```text
.env.example
example JSON files
public configuration examples
```

## Files that are not safe to commit

```text
.env
.env.local
.env.production
service-role keys
private keys
mnemonics
wallet seed phrases
Stripe live secret keys
Supabase service-role keys
Vercel tokens
```

## Typical product secrets later

For the SaaS deployment, you will eventually need values such as:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
RECEIPT_SIGNING_PRIVATE_KEY
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
```

The public Supabase anon key may be exposed to the browser, but the service-role key must remain private.

## Recommended storage

- Local development: local `.env.local`, never committed.
- Hosted application: deployment provider environment variables.
- Protected release automation: GitHub environment secrets with required reviewers.

## Rotation policy

Rotate a secret immediately if it appears in:

- a repository file,
- a GitHub issue,
- a pull request,
- a workflow log,
- a screenshot,
- a support thread.
