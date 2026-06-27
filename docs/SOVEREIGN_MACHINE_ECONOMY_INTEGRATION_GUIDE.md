# GoalOS AGIALPHA Ascension — Sovereign Machine Economy Integration Guide

This kit enhances the existing repository:

```text
MontrealAI/goalos-signoff-pro
```

It does **not** create a new repository.

The goal is to connect GoalOS Signoff Pro to the broader GoalOS AGIALPHA Ascension doctrine: mission commitments, bounded runs, evidence dockets, verifier attestations, human acceptance gates, signed receipts, reusable capability, and future protocol rails.

## What this adds

| Area | Added files |
|---|---|
| Product source | `config/sovereign-machine-economy.json` |
| Implementation model | `src/lib/sovereign-machine-economy/*` |
| Website generator | `scripts/build-sovereign-machine-economy-pages.mjs` |
| Parity verifier | `scripts/verify-sovereign-machine-economy.mjs` |
| Autonomous checks | `.github/workflows/sovereign-machine-economy.yml` |
| Production Pages workflow | `.github/workflows/pages.yml` |
| Schema | `schemas/sovereign-machine-economy.schema.json` |

## What the production website gains

The Pages action adds these pages to the existing production site:

```text
/sovereign-machine-economy.html
/proof-os.html
/machine-economy.html
/constitution.html
/proof-missions.html
/sme-manifest.json
```

It also injects a Sovereign Machine Economy entry point into the existing homepage.

## What the code gains

The repository gains a real TypeScript object model for:

```text
GoalOSCommit
RunCommitment
ProofPacket
EvalAttestation
EvidenceDocket
SelectionCertificate
EvolutionLedgerEntry
GovernedDecisionState
SovereignMachineEconomyState
```

This is deliberately implementation-grounded: the website can now point to a matching code model, not merely a visual narrative.

## Safe posture

The kit blocks public artifacts from implying unsupported live capabilities such as live user-fund authorization, live AGIALPHA staking, live Mainnet settlement, automatic acceptance, or guaranteed empirical claims.

It expresses those boundaries through architecture: human gates, evidence packets, replay paths, rollback targets, and reviewer decisions.
