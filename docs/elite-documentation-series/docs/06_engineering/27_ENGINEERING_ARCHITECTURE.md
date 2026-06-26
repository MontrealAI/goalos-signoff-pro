# Engineering Architecture

**Product:** GoalOS Signoff Pro v1.1  
**Audience:** GoalOS team, pilot customers, operators  
**Owner:** GoalOS product and operations  
**Status:** Ready for private beta  
**Version:** 1.1.0  
**Updated:** 2026-06-26T00:05:06Z

> The production-grade architecture for Signoff Pro v1.1.

---

## Architecture overview

```text
Next.js app
  → Auth and workspace access
  → Postgres data model with RLS
  → Private object storage
  → Receipt signing service
  → Evidence assistant
  → Optional IPFS / Sepolia anchoring
```

## Core services

| Service | Responsibility |
| --- | --- |
| Web app | User interface and routes |
| Database | Projects, roles, submissions, decisions, receipts |
| Storage | Private evidence files |
| Receipt service | Hashing, signing, PDF/JSON generation |
| Evidence assistant | Mechanical checks and warnings |
| Email service | Magic links and notifications |
| Billing adapter | Stripe or manual invoices |
| Anchor relayer | Optional receipt hash anchoring only |


## Architectural rules

- Never store secret keys in code
- Never expose service-role database keys to the browser
- Private files are not published to IPFS by default
- Receipt signatures are deterministic and versioned
- All user access is role checked
- Every important state change emits an audit event
- Blockchain anchoring is optional and non-custodial
