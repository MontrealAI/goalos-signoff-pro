# Mainnet boundary and safety

This product is production-grade for SaaS private beta. Its Web3 functions are feature-gated.

## Allowed before audit / activation

- SaaS Signoffs
- signed receipts
- receipt verification
- Sepolia anchoring
- public demos with testnet only

## Not allowed yet

- Mainnet escrow
- user-fund custody
- AGIALPHA mandatory onboarding
- AGIALPHA reviewer bonds with public users
- proof-to-payment settlement
- claims of external audit completion
- claims that the current 48-contract deployment is fully production activated

## Mainnet anchoring gate

Mainnet anchoring may be enabled after:

- independent revalidation is PASS
- source identity is proven or the new anchor contract is independently verified
- privacy review is complete
- relayer limits are configured
- incident response is tested
- at least one person reviews every production anchor configuration change

## User-fund gate

Escrow or settlement requires a separate fund-authorization gate. Anchoring a receipt is not the same as holding money.
