# GoalOS Signoff Pro — Validator Mesh Legal-Rail Stabilization v20.2

This package fixes the GitHub Actions failure where the production gate reported:

```text
falsification-lab.html must contain exactly one v12 legal rail
validator-mesh-lab.html must contain exactly one v12 legal rail
```

## What caused the failure

The original Validator Mesh page was valid as a standalone lab, but the full production site now has many incremental page generators. Depending on install order, a later canonical generator or public-boundary finalizer can leave extension pages with zero or duplicate legal rails. The correct fix is not to weaken the verifier. The correct fix is to normalize the public-site boundary after every page generator has run.

## What this package adds

Public pages preserved:

```text
validator-mesh-lab.html
falsification-lab.html
```

Public artifacts preserved:

```text
validator-mesh-demo-bundle.json
commit-reveal-verifier-record.json
falsification-report.json
validator-diversity-ledger.json
challenge-resolution-receipt.json
validator-mesh-manifest.json
```

Stabilization files:

```text
scripts/repair-validator-mesh-legal-rails.mjs
scripts/normalize-public-site-boundaries.mjs
scripts/verify-public-demo-routes.mjs
.github/workflows/pages.yml
.github/workflows/website-quality.yml
```

The normalizer guarantees every HTML page has exactly one canonical public-site legal rail:

```html
data-goalos-legal-rail="v12"
```

The Validator Mesh repair script specifically guarantees:

```text
validator-mesh-lab.html     exactly one canonical v12 legal rail and one canonical footer
falsification-lab.html      exactly one canonical v12 legal rail and one canonical footer
```

## Files to add or replace

In `MontrealAI/goalos-signoff-pro`, add or replace:

```text
config/validator-mesh-lab.json
scripts/build-validator-mesh-lab-page.mjs
scripts/verify-validator-mesh-lab-page.mjs
scripts/generate-validator-mesh-lab-bundle.mjs
scripts/repair-validator-mesh-legal-rails.mjs
scripts/normalize-public-site-boundaries.mjs
scripts/verify-public-demo-routes.mjs
.github/workflows/pages.yml
.github/workflows/website-quality.yml
.github/workflows/validator-mesh-lab.yml
docs/VALIDATOR_MESH_LAB_V20_2_INSTALL_GUIDE.md
docs/VALIDATOR_MESH_LAB_USER_GUIDE.md
verification/VALIDATOR_MESH_LAB_V20_2_VALIDATION.md
```

Commit with:

```text
Fix Validator Mesh legal rail gate
```

## Run order

1. Run:

```text
Actions → Website quality gate → Run workflow → main
```

2. Run:

```text
Actions → Validator Mesh Falsification Lab Autopilot → Run workflow
```

3. Run:

```text
Actions → Deploy GoalOS Signoff Pro production site → Run workflow → main
```

## Expected quality output

```text
GoalOS Validator Mesh legal rail repair PASS
GoalOS public-site boundary normalizer PASS
GoalOS Validator Mesh & Falsification Lab v20.2 gate PASS
GoalOS public demo route registry PASS
```

## Verify after deploy

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

## Public-site safety posture

The lab remains:

```text
100% browser-local
No forms
No inputs
No textareas
No selects
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

## What users see

The lab still demonstrates:

```text
Proof is not accepted.
Proof is attacked first.
```

Users can run a browser-local falsification gauntlet and see four synthetic candidates move through source reality, claim support, contradiction checks, commit-reveal validator records, negative controls, challenge windows, risk ledgers, replay checks, and a human authority boundary.
