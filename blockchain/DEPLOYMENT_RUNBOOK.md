# GoalOS Signoff Hybrid blockchain deployment runbook

This is the optional trust-anchor layer for the mainstream SaaS product.

## What goes on-chain

Only hashes and public verification metadata:

- `receiptHash`
- `evidenceRoot`
- `decisionHash`
- optional public `receiptURI`
- public participant wallet addresses only when provided

Do not put private files, customer notes, emails, source documents, confidential reports, prices, or personal data on-chain.

## Recommended sequence

1. Launch SaaS Signoff first with signed receipts.
2. Deploy `GoalOSSignoffAnchorV1` to Sepolia.
3. Anchor internal test receipts only.
4. Add the “Verified on Sepolia” customer badge.
5. Run a pilot with gas sponsored by GoalOS.
6. Run security review and operational readiness.
7. Only then consider Mainnet anchoring.

## Mainnet gates

Mainnet anchoring should stay disabled until:

- independent live revalidation is PASS,
- source identity is PASS,
- the anchoring contract has been reviewed,
- the operational signer is a Safe/KMS-managed relayer,
- no private data can be anchored by mistake,
- monitoring and revocation procedures are tested.

This package intentionally does not enable AGIALPHA staking, escrow, or user-fund settlement.
