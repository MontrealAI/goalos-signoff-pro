# Web3 anchoring runbook

## Safe launch order

1. Launch Signoff Core with no blockchain required.
2. Deploy `GoalOSSignoffHybridAnchorV1` to Sepolia.
3. Anchor internal test receipts only.
4. Verify explorer source and transaction events.
5. Enable the `/anchor` page for private beta testers.
6. Only after review, deploy a fresh audited anchor contract to Mainnet.

## What anchoring does

Anchoring writes four hashes to Ethereum:

- `receiptHash`
- `envelopeHash`
- `evidenceRoot`
- `metadataHash`

It does not upload private documents. It does not move funds. It does not require AGIALPHA. It does not approve tokens.

## Environment variables

```text
NEXT_PUBLIC_SIGNOFF_ANCHOR_CHAIN_ID=11155111
NEXT_PUBLIC_SIGNOFF_ANCHOR_ADDRESS=<Sepolia anchor contract>
```

## User messaging

Use: "Anchor this accepted receipt".

Avoid: "Settle", "pay", "stake", "earn", "yield", or "production activated".

## Mainnet gate

Mainnet anchoring should wait for:

- Sepolia pilot success.
- Contract review.
- Source verification.
- Emergency revoke semantics accepted.
- Customer-facing explanation approved.
