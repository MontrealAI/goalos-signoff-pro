# Validator Mesh & Falsification Lab — User Guide

The lab demonstrates a core GoalOS idea:

```text
Proof is not accepted. It is attacked first.
```

A user opens:

```text
validator-mesh-lab.html
```

Then clicks:

```text
Run verifier mesh
```

The browser runs four synthetic candidates through a public-safe verifier mesh:

| Candidate | Outcome | Why |
|---|---|---|
| C0 — Confident report | Rejected | Unsupported claims and no replay path |
| C1 — Proof packet with contradiction | Challenged | A contradiction survives the verifier mesh |
| C2 — Collusive-looking approval | Quarantined | Validator diversity and commit-reveal checks fail |
| C3 — Proof-carrying decision package | Accepted for decision review | Replay, negative controls, diverse validators, and challenge window clear |

## What the page teaches

A single evaluator is not authority. A score is not authority. A beautiful output is not authority.

GoalOS checks whether a deliverable survives:

```text
source reality
claim support
contradiction review
risk ledger
replay path
negative controls
human authority boundary
```

Only work that survives the mesh becomes decision-review ready.

## What users can download

Users can download a public-safe synthetic demo bundle directly from the browser. The GitHub Action also generates:

```text
00_manifest.json
01_candidates.json
02_verifier_mesh_report.json
03_commit_reveal_record.json
04_falsification_ladder.json
05_challenge_resolution.json
06_decision_state.json
README.md
```

## What the demo does not do

It does not collect data, upload files, connect wallets, move value, provide legal advice, provide financial advice, certify production work, or claim external audit completion.
