# GoalOS Signoff Pro — Validator Mesh & Falsification Lab v20 Install Guide

This package adds a new public browser-only demonstration to `MontrealAI/goalos-signoff-pro`.

## What it adds

Public pages:

- `validator-mesh-lab.html`
- `falsification-lab.html`

Public artifacts:

- `validator-mesh-demo-bundle.json`
- `commit-reveal-verifier-record.json`
- `falsification-report.json`
- `validator-diversity-ledger.json`
- `challenge-resolution-receipt.json`
- `validator-mesh-manifest.json`

GitHub Action:

- `Validator Mesh Falsification Lab Autopilot`

## Install through GitHub Web UI

1. Open `https://github.com/MontrealAI/goalos-signoff-pro`.
2. Add or replace the files from this package.
3. Commit with:

```text
Add Validator Mesh Falsification Lab
```

## Files to add

```text
config/validator-mesh-lab.json
scripts/build-validator-mesh-lab-page.mjs
scripts/verify-validator-mesh-lab-page.mjs
scripts/generate-validator-mesh-lab-bundle.mjs
scripts/verify-public-demo-routes.mjs
.github/workflows/pages.yml
.github/workflows/website-quality.yml
.github/workflows/validator-mesh-lab.yml
docs/VALIDATOR_MESH_LAB_V20_INSTALL_GUIDE.md
docs/VALIDATOR_MESH_LAB_USER_GUIDE.md
```

## Run workflows

Run:

```text
Actions → Website quality gate → Run workflow → main
```

Then:

```text
Actions → Validator Mesh Falsification Lab Autopilot → Run workflow
```

Then:

```text
Actions → Deploy GoalOS Signoff Pro production site → Run workflow → main
```

## Verify after deployment

Open:

```text
https://montrealai.github.io/goalos-signoff-pro/validator-mesh-lab.html
https://montrealai.github.io/goalos-signoff-pro/falsification-lab.html
https://montrealai.github.io/goalos-signoff-pro/validator-mesh-demo-bundle.json
https://montrealai.github.io/goalos-signoff-pro/commit-reveal-verifier-record.json
https://montrealai.github.io/goalos-signoff-pro/falsification-report.json
https://montrealai.github.io/goalos-signoff-pro/validator-diversity-ledger.json
https://montrealai.github.io/goalos-signoff-pro/challenge-resolution-receipt.json
```

## Expected gate output

```text
GoalOS Validator Mesh & Falsification Lab v20 gate PASS
GoalOS public demo route registry PASS
```

## Safety posture

The lab is public-safe and browser-local:

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
