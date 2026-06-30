# GoalOS Public-Private Proof Boundary Lab — User Guide

Open:

```text
public-private-proof-boundary-lab.html
```

The page demonstrates one GoalOS rule:

```text
Private execution stays private.
Public proof remains verifiable.
```

## What to click

Click:

```text
Run boundary pass
```

The browser runs a synthetic proof-boundary sequence:

```text
Private execution
→ Redaction pass
→ Public proof commitments
→ Selection record
```

## What the four scenarios mean

```text
AI research acceptance
```

Shows how a research memo can expose claims, sources, and verification status without publishing private drafts or reviewer notes.

```text
Software delivery review
```

Shows how a software delivery can expose commit hashes, tests, SBOM digests, and rollback pointers without publishing internal repository traces.

```text
Procurement proof room
```

Shows how vendor-review evidence can expose a decision matrix digest and risk summary without publishing commercial details.

```text
Safety escalation boundary
```

Shows how a high-risk trace is preserved as a public-safe quarantine record without granting authority or publishing sensitive content.

## What the tabs show

```text
Public proof
```

The hashes, commitments, proof packet references, and validator-attestation references that are safe to publish.

```text
Private manifest
```

A public-safe list of private classes that are withheld. It does not contain the private material itself.

```text
Redaction
```

A map from private classes to safe public handling: hash-only, summary-only, reason-code-only, or withheld private appendix.

```text
Docket
```

The public-safe Evidence Docket boundary record.

```text
Ledger
```

The proof-ledger commitment set. It demonstrates the principle: put proof commitments on public rails, not private intelligence.

```text
Bundle
```

The full public-safe synthetic demo bundle.

## Important boundary

This page is a demonstration. It does not collect information, publish private files, connect to a wallet, move value, run a real external audit, certify production readiness, or perform a blockchain transaction.
