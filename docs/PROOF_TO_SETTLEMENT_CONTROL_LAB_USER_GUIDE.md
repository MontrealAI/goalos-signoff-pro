# Proof-to-Settlement Control Lab — User Guide

## What this page demonstrates

The lab demonstrates a core GoalOS rule:

```text
No ProofBundle, no settlement signal.
```

It shows that AI output does not become economically consequential merely because it is persuasive. It must clear proof, replay, validator, challenge-window, risk, and human-authority gates.

## How to use it

Open:

```text
proof-settlement-lab.html
```

Then choose a candidate:

```text
C0 — Output-only report
C1 — Proof packet with replay gap
C2 — Replayable ProofBundle
C3 — High-impact human gate
```

Click:

```text
Run all candidates
```

The lab will show:

```text
which gates pass
which gates hold
which gates fail
which candidate earns a synthetic settlement-readiness signal
which candidate remains blocked
```

## What to look for

The important lesson is not the number. The important lesson is the boundary:

```text
Output-only work receives 0 synthetic α-WU.
Replay gaps are challenged.
High-impact work preserves human authority.
Only proof-cleared work emits a synthetic readiness certificate.
```

## What the page does not do

The page does not:

```text
connect a wallet
ask for personal information
ask for files
move money
settle funds
custody assets
perform a blockchain transaction
```

It is a public-safe demonstration of the control architecture.
