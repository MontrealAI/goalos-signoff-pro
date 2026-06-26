# Security Policy

## Supported status

GoalOS Signoff Pro v1.1 is a private-beta product package. It is not a Mainnet escrow, custody, AGIALPHA staking, or settlement release.

## Reporting a vulnerability

Open a private security report or contact the repository owner directly. Do not post sensitive findings in public issues.

Please include:

- affected version or commit,
- steps to reproduce,
- impact,
- screenshots or logs if safe,
- whether any secret or customer data may be involved.

## Secret exposure

If a secret is exposed:

1. Revoke or rotate it immediately.
2. Remove it from the repository history if needed.
3. Delete affected logs if possible.
4. Document the incident.
5. Verify the replacement secret works.

## Hard security boundaries

Never commit:

```text
private keys
seed phrases
wallet mnemonics
Supabase service-role keys
Stripe live secret keys
production .env files
Mainnet deployer secrets
customer private evidence
```

## Blockchain boundary

The optional blockchain code is receipt-anchoring infrastructure only. It must not be treated as audited Mainnet escrow or AGIALPHA staking.
