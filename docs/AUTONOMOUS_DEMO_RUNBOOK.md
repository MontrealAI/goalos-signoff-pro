# Autonomous Demo Runbook

## Purpose

This runbook explains how a nontechnical user can generate a demo Proof Mission from GitHub Actions.

## Steps

1. Open the repository.
2. Click **Actions**.
3. Click **User Delight Demo Autopilot**.
4. Click **Run workflow**.
5. Choose a scenario.
6. Click **Run workflow** again.
7. Wait for a green check.
8. Open the workflow run.
9. Download the generated artifact.

## What the artifact contains

The workflow generates a public-safe proof package:

```text
mission-contract.json
claims-matrix.json
evidence-docket.json
verifier-report.json
risk-ledger.json
action-graph.json
decision-state.json
mission-receipt.json
public-report.html
README.md
```

## Good result

A good result has:

```text
Workflow status: green
Artifact present: yes
Receipt hash: present
Docket hash: present
Public-safe notice: present
```

