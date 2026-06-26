# Verified Receipt Runbook

Signed receipts work without blockchain. Verified receipts add optional public proof.

## Launch order

1. Signed receipt works.
2. Offline verifier works.
3. Public/private redaction rules are reviewed.
4. Sepolia anchoring is tested.
5. Receipt page displays anchor link.
6. Only after review, consider Mainnet hash anchoring.

## Never include in public anchor payloads

- Private evidence files.
- Email addresses unless explicitly allowed.
- API keys.
- Internal notes.
- Payment details.
- Any secret.
