# GoalOS Signoff Pro — Proof Gradient Selection Lab v13

This package adds one of the strongest public demonstrations of the core GoalOS idea:

> Score is advisory. Hard gates decide what may evolve.

The page is `proof-gradient-lab.html`. It runs entirely in the browser and shows four candidate artifacts entering the GoalOS Selection Gate. Only the candidate that passes proof, evaluation, risk, rollback, canary, scope, and challenge gates receives a synthetic `SelectionCertificate`, `EvolutionLedgerEntry`, and `EvidenceDocket`.

## What users can do

Users can open the page, click **Run Selection Gate**, watch the proof gates execute, then download a synthetic public-safe certificate and Evidence Docket.

No account, no form, no upload, no wallet, no cookies, no analytics, no user data, and no value moved.

## Files to add or replace

Add these files to `MontrealAI/goalos-signoff-pro`:

```text
config/proof-gradient-lab.json
scripts/build-proof-gradient-lab-page.mjs
scripts/verify-proof-gradient-lab-page.mjs
scripts/generate-proof-gradient-lab-bundle.mjs
.github/workflows/pages.yml
.github/workflows/website-quality.yml
.github/workflows/proof-gradient-lab.yml
```

Commit with:

```text
Add Proof Gradient Selection Lab
```

## Run the workflows

First run:

```text
Actions → Website quality gate → Run workflow → main
```

Expected result:

```text
GoalOS production site gate PASS
GoalOS Proof Gradient Selection Lab gate PASS
```

Then run:

```text
Actions → Proof Gradient Selection Lab Autopilot → Run workflow → main
```

Expected result:

```text
goalos-proof-gradient-selection-lab artifact generated
```

Then run:

```text
Actions → Deploy GoalOS Signoff Pro production site → Run workflow → main
```

Expected result:

```text
Build and verify canonical production site PASS
Deploy to GitHub Pages PASS
```

## Pages and artifacts after deployment

Open:

```text
https://montrealai.github.io/goalos-signoff-pro/proof-gradient-lab.html
https://montrealai.github.io/goalos-signoff-pro/proof-gradient-selection-certificate.json
https://montrealai.github.io/goalos-signoff-pro/proof-gradient-evolution-ledger-entry.json
https://montrealai.github.io/goalos-signoff-pro/proof-gradient-demo-docket.json
```

## Why this page matters

This is a compact demonstration of GoalOS as a proof-governed institution. It does not merely show proof as a concept; it shows how a candidate output earns, fails, or holds the right to influence future work.

The public claim remains bounded: this is a browser-local synthetic demonstration, not an external audit, production certification, live settlement, or empirical SOTA claim.
