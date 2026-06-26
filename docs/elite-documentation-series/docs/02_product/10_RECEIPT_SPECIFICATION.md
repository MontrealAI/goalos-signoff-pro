# Mission Receipt Specification

**Product:** GoalOS Signoff Pro v1.1  
**Audience:** GoalOS team, pilot customers, operators  
**Owner:** GoalOS product and operations  
**Status:** Ready for private beta  
**Version:** 1.1.0  
**Updated:** 2026-06-26T00:05:06Z

> What a Mission Receipt contains, how it is signed, and how it is verified.

---

## Receipt purpose

A Mission Receipt is the durable record of what was accepted.

## Required fields

| Field | Purpose |
| --- | --- |
| receipt_id | Unique identifier |
| project_id | Links receipt to project |
| brief_hash | Locks accepted brief |
| submission_hash | Locks accepted submission |
| evidence_manifest_hash | Locks evidence list |
| decision | accepted / rejected / changes requested |
| decision_actor | Human who made decision |
| decision_timestamp | When decision happened |
| limitations | Disclosed remaining uncertainty |
| signature | GoalOS signing proof |
| verification_url | Where it can be checked |
| anchor_status | none / sepolia / mainnet later |


## Private evidence rule

The receipt may contain file names and hashes, but private file contents should remain protected unless explicitly published by the project owner.

## Verification states

| State | Meaning |
| --- | --- |
| Valid | Signature and hashes match |
| Modified | Receipt or file hash changed |
| Revoked | GoalOS revoked the receipt with reason |
| Anchor pending | SaaS receipt valid; blockchain anchor not completed |
| Anchored | Receipt hash found at the expected chain/address |


## Receipt design principle

A receipt should be readable by a business person and verifiable by a technical reviewer.
