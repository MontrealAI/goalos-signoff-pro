# Web3 Verification Runbook

**Product:** GoalOS Signoff Pro v1.1  
**Audience:** GoalOS team, pilot customers, operators  
**Owner:** GoalOS product and operations  
**Status:** Ready for private beta  
**Version:** 1.1.0  
**Updated:** 2026-06-26T00:05:06Z

> How to introduce optional verified receipts safely.

---

## Launch order

1. Signed SaaS receipts.
2. Sepolia testnet anchors for internal users.
3. Sepolia anchors for pilot customers who opt in.
4. Mainnet receipt-only anchoring only after review.
5. AGIALPHA/bonded review only after protocol gates.

## What users see

```text
Add public verification to this receipt
```

They should not see:

```text
Configure RPC, buy ETH, sign transaction, approve token
```

## Safety checklist

- [ ] Private files not pinned publicly
- [ ] Only receipt hash anchored
- [ ] No custody
- [ ] No token transfer
- [ ] No escrow
- [ ] Clear fee display
- [ ] Failed anchor does not invalidate SaaS receipt
