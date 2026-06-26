# Receipt Signing Architecture

**Product:** GoalOS Signoff Pro v1.1  
**Audience:** GoalOS team, pilot customers, operators  
**Owner:** GoalOS product and operations  
**Status:** Ready for private beta  
**Version:** 1.1.0  
**Updated:** 2026-06-26T00:05:06Z

> How signed Mission Receipts should be created and protected.

---

## Signing goals

- Bind receipt to accepted brief
- Bind receipt to exact evidence manifest
- Bind receipt to final decision
- Enable offline verification
- Support key rotation
- Support revocation

## Recommended signing flow

```text
Collect canonical receipt JSON
Normalize field order
Hash canonical JSON
Sign hash with active receipt signing key
Store signature, signing key ID, and public key
Emit receipt.issued audit event
```

## Key management rules

- [ ] Store private signing key in secret manager only
- [ ] Use different keys for staging and production
- [ ] Publish public verification key
- [ ] Rotate key on schedule or compromise
- [ ] Keep old public keys for historical receipts
- [ ] Record key ID on every receipt

## Canonicalization

The JSON canonicalization method must be stable. Avoid signing pretty-printed or user-order-dependent JSON.
