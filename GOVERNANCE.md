# Governance

This repository is governed as a private-beta commercial product repository.

## Current decision model

- Product owner approves scope and launch boundaries.
- Technical owner approves architecture and code-quality gates.
- Security reviewer approves auth, storage, receipt-signing, and blockchain-anchor changes.
- Mainnet, AGIALPHA, escrow, or custody changes require a separate written decision and external review.

## Hard boundaries

The following require a new approval process before implementation:

- User-fund custody.
- Escrow.
- AGIALPHA staking or slashing.
- Mainnet settlement.
- Automatic payment release.
- Production blockchain anchoring beyond receipt hashes.
- Legal, compliance, or audit claims.

## Decision log

Use pull requests and `docs/elite-documentation-series/board/ADR_LOG.md` or equivalent docs to preserve major decisions.
