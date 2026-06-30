# ProofZero Planning & Evidence Reanalyze Lab — User Guide

## What this demonstrates

A normal system may plan from language. GoalOS plans from a proof-relevant work state:

```text
mission objective
claims coverage
contradiction load
validator capacity
risk boundary
rollback readiness
proof debt
```

Then it runs a bounded work search and keeps every proposed action advisory until validation clears.

## How to use it

1. Open `proofzero-planning-lab.html`.
2. Choose a public-safe scenario.
3. Click `Run bounded work search`.
4. Watch the planning control loop.
5. Inspect the JSON packet tabs.
6. Download the demo bundle.

## What to look for

The lab shows four candidate planning modes:

```text
B0 — Narrative planner          reject
B1 — Heuristic router           baseline
B2 — Latent model without gate  hold
B3 — ProofZero work planner     promote
```

The promotion is synthetic and public-safe. It means the browser demo promotes the idea of bounded proof planning; it does not promote a production policy or move value.

## Evidence Reanalyze

Evidence Reanalyze revisits older proof bundles and asks:

```text
Which old runs remain valid?
Which old runs must be quarantined?
Which traces can update routing policy?
Which traces are unsafe to learn from?
```

Only replayable, provenance-preserving, validator-cleared traces can update future routing.

## Public boundary

This page does not claim external audit, production certification, empirical SOTA, active settlement, custody, staking, value movement, achieved AGI, achieved ASI, or autonomous production authority.
