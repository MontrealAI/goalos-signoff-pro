# GoalOS Signoff Pro — Public-Private Proof Boundary Lab v17 Install Guide

This package adds a new browser-local flagship public demonstration to `MontrealAI/goalos-signoff-pro`.

## What it adds

New public pages:

```text
public-private-proof-boundary-lab.html
proof-boundary-lab.html
```

New public-safe artifacts:

```text
proof-boundary-demo-bundle.json
public-proof-commitments.json
private-appendix-manifest.json
redaction-map.json
evidence-docket-boundary.json
proof-ledger-commitment.json
public-private-proof-boundary-manifest.json
```

New GitHub Action:

```text
Actions → Public-Private Proof Boundary Lab Autopilot
```

## Why this page matters

The page demonstrates the core GoalOS boundary:

```text
Do not publish private intelligence.
Publish proof commitments.
```

It shows how private execution, private prompts, raw traces, customer files, credentials, privileged notes, and sensitive workpapers stay outside the public site while public proof commitments, hashes, redaction maps, attestations, risk summaries, and claim boundaries remain inspectable.

## Install through GitHub Web UI

In the existing repository:

```text
MontrealAI/goalos-signoff-pro
```

add or replace these files:

```text
config/public-private-proof-boundary-lab.json

scripts/build-public-private-proof-boundary-lab-page.mjs
scripts/verify-public-private-proof-boundary-lab-page.mjs
scripts/generate-public-private-proof-boundary-lab-bundle.mjs
scripts/verify-public-demo-routes.mjs

.github/workflows/pages.yml
.github/workflows/website-quality.yml
.github/workflows/public-private-proof-boundary-lab.yml
```

Commit with:

```text
Add Public-Private Proof Boundary Lab
```

## Run the workflows

First:

```text
Actions → Website quality gate → Run workflow → main
```

Then:

```text
Actions → Public-Private Proof Boundary Lab Autopilot → Run workflow
```

Choose a scenario:

```text
research-acceptance
software-delivery
procurement-review
safety-escalation
```

Then deploy:

```text
Actions → Deploy GoalOS Signoff Pro production site → Run workflow → main
```

## Verify after deploy

Open:

```text
https://montrealai.github.io/goalos-signoff-pro/public-private-proof-boundary-lab.html
https://montrealai.github.io/goalos-signoff-pro/proof-boundary-lab.html
https://montrealai.github.io/goalos-signoff-pro/public-proof-commitments.json
https://montrealai.github.io/goalos-signoff-pro/private-appendix-manifest.json
https://montrealai.github.io/goalos-signoff-pro/redaction-map.json
https://montrealai.github.io/goalos-signoff-pro/evidence-docket-boundary.json
https://montrealai.github.io/goalos-signoff-pro/proof-ledger-commitment.json
```

## Expected quality-gate output

```text
GoalOS Public-Private Proof Boundary Lab v17 gate PASS
GoalOS public demo route registry PASS
```

## Public-site safety posture

The page is intentionally:

```text
100% browser-local
No forms
No inputs
No textareas
No uploads
No email gate
No wallet connection
No cookies
No analytics
No payments
No personal data
No confidential data
No value moved
```
