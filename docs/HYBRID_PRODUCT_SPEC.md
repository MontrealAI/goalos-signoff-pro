# GoalOS Signoff Hybrid — Product Specification

## Product thesis

The best commercial product combines mainstream ease with blockchain-grade verifiability. Customers should not need crypto to get value, but the best receipts should be independently verifiable without trusting a mutable database.

## Customer-visible product

A customer sees a clean five-step workflow:

1. Create brief.
2. Invite builder and reviewer.
3. Submit evidence.
4. Review and accept or request changes.
5. Issue signed receipt; optionally upgrade to Verified.

## Verification ladder

### Basic

The receipt is digitally signed by GoalOS. This is enough for invoices, project closeout, private beta, and most mainstream workflows.

### Verified

The receipt JSON is pinned to IPFS, the receipt hash is anchored to Ethereum, and the verification page displays the transaction and CID. GoalOS sponsors the transaction so the customer does not need ETH.

### Web3-native

For crypto-native teams, a wallet-visible receipt flow can be added, but it should not be the default experience.

### AGIALPHA-secured

Reviewer bonds, dispute stakes, Proof Cards, and settlement are later protocol tiers. These are intentionally disabled in the commercial MVP.

## Acceptance authority

GoalOS does not autonomously decide whether subjective work is correct. It organizes evidence and checks completeness, but a human client or reviewer makes the acceptance decision.

## Why this is commercially stronger

- SaaS removes adoption friction.
- IPFS/Ethereum creates verifiability.
- The product creates protocol-compatible artifacts before asking users to understand protocol mechanics.
- AGIALPHA becomes a future security layer instead of a forced login token.
