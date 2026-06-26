# Optional Verified Receipts Architecture

**Product:** GoalOS Signoff Pro v1.1  
**Audience:** GoalOS team, pilot customers, operators  
**Owner:** GoalOS product and operations  
**Status:** Ready for private beta  
**Version:** 1.1.0  
**Updated:** 2026-06-26T00:05:06Z

> How IPFS and Ethereum anchoring fit into the mainstream product.

---

## Principle

The customer should not need to understand Web3 to benefit from a verified receipt.

## What gets anchored

Only receipt hashes and public metadata required for verification. Private evidence stays private unless explicitly published.

## Recommended states

| State | Meaning |
| --- | --- |
| not_requested | Ordinary signed receipt only |
| requested | Customer asked for verification |
| ipfs_pinned | Receipt package pinned to IPFS |
| sepolia_anchored | Testnet anchor completed |
| mainnet_ready_later | Only after review and explicit approval |
| failed | Anchor attempt failed; receipt still signed |


## User-facing copy

> Verified receipts add a public timestamped proof of the receipt hash. They do not publish your private files.

## Safety boundary

Do not add Mainnet anchoring or AGIALPHA paths until the relevant gates are documented, tested, and approved.
