# Operator anchoring runbook

## Modes

### Off

No blockchain action. Standard signed receipts only.

### Manual

A human operator reviews an anchor request and runs an anchoring tool with a dedicated wallet.

### Relayer

A backend service sponsors anchoring. This is convenient but requires stronger key management.

## Recommended first launch

Use `manual` on Sepolia.

## Relayer safety requirements

- Use a fresh dedicated relayer wallet.
- Keep only small gas balances.
- Never use a treasury wallet.
- Store the key in a managed secret store or KMS.
- Rate-limit anchoring.
- Require a valid accepted receipt.
- Refuse revoked receipts.
- Log every transaction hash.
- Reconcile every transaction with the database.

## Anchoring evidence checklist

- Receipt public ID
- Receipt hash
- Evidence root
- Brief hash
- Decision hash
- Chain ID
- Anchor contract address
- Transaction hash
- Block number
- Block hash
- Operator address
- Customer paid gas: false
- Customer required AGIALPHA: false
- Escrow enabled: false

## Failure handling

If anchoring fails, the Signoff remains valid as a signed SaaS receipt. The system should mark the anchor request failed and allow retry.
