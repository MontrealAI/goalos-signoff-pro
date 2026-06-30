# Action Graph & Human Authority Lab — User Guide

Open `action-graph-authority-lab.html` and click **Run action graph**.

The browser-local lab shows how GoalOS transforms a governed decision state into a scoped action graph.

## What to watch

```text
Decision State
→ Action Proposal
→ Scope Check
→ Proof Requirement
→ Human Authority
→ Action-Reason Trace
→ Rollback Path
→ Receipt
→ Chronicle Boundary
```

The important lesson:

```text
Proof-to-action is a boundary, not an autopilot.
```

The demo intentionally blocks any external action that lacks authority. It contains no forms, inputs, uploads, wallets, cookies, analytics, payments, personal data, confidential data, or value movement.

## Downloaded bundle

The browser and GitHub Action produce a public-safe synthetic bundle containing:

```text
00_manifest.json
01_action_graph.json
02_authority_gate.json
03_action_reason_trace.json
04_rollback_map.json
05_receipt.json
README.md
```
