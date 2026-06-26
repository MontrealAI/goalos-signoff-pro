# API and Event Contracts

**Product:** GoalOS Signoff Pro v1.1  
**Audience:** GoalOS team, pilot customers, operators  
**Owner:** GoalOS product and operations  
**Status:** Ready for private beta  
**Version:** 1.1.0  
**Updated:** 2026-06-26T00:05:06Z

> The actions, states, and audit events developers must implement consistently.

---

## Project states

```text
DRAFT → INVITED → SUBMITTED → IN_REVIEW → CHANGES_REQUESTED → RESUBMITTED → ACCEPTED → RECEIPT_ISSUED
```

Alternate terminal states:

```text
REJECTED
CANCELLED
REVOKED
```

## Required audit events

- project.created
- brief.updated
- participant.invited
- submission.created
- evidence.uploaded
- review.created
- changes.requested
- decision.accepted
- receipt.issued
- receipt.revoked
- anchor.requested
- anchor.confirmed

## API design rules

- Use idempotency keys for receipt issuance
- Validate role server-side
- Hash files before signing receipt
- Never trust client-submitted hashes without server verification
- Return user-friendly errors
- Do not leak organization IDs in public errors
