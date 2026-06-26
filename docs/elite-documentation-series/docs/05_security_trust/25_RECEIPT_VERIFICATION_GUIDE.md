# Receipt Verification Guide

**Product:** GoalOS Signoff Pro v1.1  
**Audience:** GoalOS team, pilot customers, operators  
**Owner:** GoalOS product and operations  
**Status:** Ready for private beta  
**Version:** 1.1.0  
**Updated:** 2026-06-26T00:05:06Z

> How users and auditors verify a receipt.

---

## Plain-language verification

A receipt is valid when:

- The receipt signature is valid
- The receipt has not been revoked
- The brief hash matches the accepted brief
- The evidence manifest hash matches the accepted evidence list
- Optional anchor hash matches the on-chain record if anchoring was used

## Verification page states

| State | User-facing text |
| --- | --- |
| Valid | This receipt is authentic and has not been modified. |
| Modified | This receipt does not match the signed record. Do not rely on it. |
| Revoked | This receipt was revoked. See revocation reason. |
| Private | This receipt exists, but private evidence is not visible to you. |
| Anchored | This receipt hash was anchored publicly. |
| Anchor mismatch | The public anchor does not match this receipt. |


## Offline verification

A technical user should be able to verify JSON receipt files without accessing GoalOS, using the included verifier and public signing key.

## Customer warning

Verification proves receipt integrity. It does not prove the real-world truth of every statement in the deliverable.
