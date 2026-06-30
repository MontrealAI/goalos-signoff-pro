# GoalOS Signoff Pro — Proof-to-Settlement Control Lab v16

This package adds a new public demonstration page while keeping the existing GoalOS Signoff Pro website architecture claim-bounded and zero-user-data by design.

## What it adds

Public page:

```text
proof-settlement-lab.html
```

Alias:

```text
settlement-control-lab.html
```

Public-safe artifacts:

```text
proof-settlement-demo-bundle.json
settlement-readiness-certificate.json
alpha-work-unit-ledger.json
commit-reveal-validator-record.json
challenge-window-receipt.json
simulated-chronicle-entry.json
proof-settlement-lab-manifest.json
```

GitHub Action:

```text
Actions → Proof-to-Settlement Control Lab Autopilot
```

## Install with GitHub Web UI

In the existing repository:

```text
MontrealAI/goalos-signoff-pro
```

add or replace these files:

```text
config/proof-settlement-lab.json
scripts/build-proof-settlement-lab-page.mjs
scripts/verify-proof-settlement-lab-page.mjs
scripts/generate-proof-settlement-lab-bundle.mjs
scripts/verify-public-demo-routes.mjs
.github/workflows/pages.yml
.github/workflows/website-quality.yml
.github/workflows/proof-settlement-lab.yml
```

Commit message:

```text
Add Proof-to-Settlement Control Lab
```

## Run the workflows

1. Run:

```text
Actions → Website quality gate → Run workflow → main
```

2. Run:

```text
Actions → Proof-to-Settlement Control Lab Autopilot → Run workflow
```

3. Run:

```text
Actions → Deploy GoalOS Signoff Pro production site → Run workflow → main
```

## Expected output

The quality gate should report:

```text
GoalOS Proof-to-Settlement Control Lab v16 gate PASS
GoalOS public demo route registry PASS
```

## Verify after deploy

Open:

```text
https://montrealai.github.io/goalos-signoff-pro/proof-settlement-lab.html
https://montrealai.github.io/goalos-signoff-pro/settlement-control-lab.html
https://montrealai.github.io/goalos-signoff-pro/settlement-readiness-certificate.json
https://montrealai.github.io/goalos-signoff-pro/alpha-work-unit-ledger.json
```

## Public-site boundary

The page is browser-local and public-safe:

```text
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

The page demonstrates settlement-readiness logic only. It does not custody assets, move value, execute escrow, perform a wallet signature, or perform a Mainnet transaction.
