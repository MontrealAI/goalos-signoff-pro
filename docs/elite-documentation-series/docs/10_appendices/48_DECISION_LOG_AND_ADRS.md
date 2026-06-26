# Decision Log and ADRs

**Product:** GoalOS Signoff Pro v1.1  
**Audience:** GoalOS team, pilot customers, operators  
**Owner:** GoalOS product and operations  
**Status:** Ready for private beta  
**Version:** 1.1.0  
**Updated:** 2026-06-26T00:05:06Z

> Architectural and product decisions to preserve context.

---

## ADR-001: SaaS-first, Web3-optional

**Decision:** Mainstream users begin with ordinary SaaS workflow; blockchain verification is optional.  
**Reason:** Reduces adoption friction and preserves protocol upside.  
**Consequence:** Initial product does not require wallet, AGIALPHA, or gas.

## ADR-002: Human acceptance authority

**Decision:** AI assistant cannot accept work.  
**Reason:** Acceptance is subjective and consequential.  
**Consequence:** Human decision is required for receipts.

## ADR-003: No escrow in v1.1

**Decision:** Payment is handled off-platform or by invoice hooks.  
**Reason:** Escrow requires legal, operational, and smart-contract readiness.  
**Consequence:** GoalOS proves acceptance workflow before custody.

## ADR-004: Private evidence by default

**Decision:** IPFS/public anchoring uses hashes and opt-in metadata only.  
**Reason:** Customers may upload confidential files.  
**Consequence:** Verified receipts do not automatically publish evidence contents.
