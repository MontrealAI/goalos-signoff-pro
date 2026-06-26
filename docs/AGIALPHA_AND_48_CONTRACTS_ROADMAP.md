# AGIALPHA and 48-contract integration roadmap

The hybrid product uses blockchain immediately for hash anchoring, but it does not use AGIALPHA, bonds, escrow, or settlement in v1.

## Why not immediately

The 48-contract deployment still requires independent revalidation, source identity, production activation, and user-fund authorization before public economic use. Until then, AGIALPHA should not be required from mainstream customers.

## Practical integration ladder

1. **Receipt anchoring** — accepted SaaS receipts anchored on a minimal, no-custody registry.
2. **Protocol mapping** — each Signoff exports GoalOS-compatible commitment, evidence docket, claims matrix, proof bundle, and receipt hashes.
3. **Optional GoalOS registration** — after Mainnet readiness, register mature receipts into the existing AEP evidence/proof registries.
4. **Bonded review** — reviewers can post AGIALPHA collateral after reviewer-bond defects are remediated and audited.
5. **Proof-to-payment** — escrow and settlement only after explicit user-fund authorization.

## AGIALPHA role later

- Reviewer/evaluator bonds.
- Builder claim bonds.
- Challenge stakes.
- Proof Card and credential fees.
- Optional protocol treasury fees.

Stable money should remain the default for mainstream work payments.
