# GoalOS Capability Compounding Lab v14 — Install Guide

This package adds one of the clearest public GoalOS demonstrations:

> Accepted proof becomes reusable capability.

It runs entirely in the browser and keeps the public-site rule intact: no forms, no inputs, no uploads, no cookies, no analytics, no wallets, no payments, and no personal or confidential data.

## Files to add or replace

Add these files to `MontrealAI/goalos-signoff-pro`:

```text
config/capability-compounding-lab.json
scripts/build-capability-compounding-lab-page.mjs
scripts/verify-capability-compounding-lab-page.mjs
scripts/generate-capability-compounding-lab-bundle.mjs
.github/workflows/pages.yml
.github/workflows/website-quality.yml
.github/workflows/capability-compounding-lab.yml
```

Commit with:

```text
Add Capability Compounding Lab
```

## Run workflows

1. Run:

```text
Actions → Website quality gate → Run workflow → main
```

2. Run:

```text
Actions → Capability Compounding Lab Autopilot → Run workflow → main
```

3. Run:

```text
Actions → Deploy GoalOS Signoff Pro production site → Run workflow → main
```

## Inspect after deploy

```text
https://montrealai.github.io/goalos-signoff-pro/capability-compounding-lab.html
https://montrealai.github.io/goalos-signoff-pro/capability-compounding-demo-bundle.json
https://montrealai.github.io/goalos-signoff-pro/capability-package-library.json
https://montrealai.github.io/goalos-signoff-pro/chronicle-compounding-entry.json
```

## What users can do

Users can click **Run compounding cycle** and watch three synthetic missions move through proof, selection, Chronicle, and reusable capability. They can also download the public-safe demo bundle.

## Important boundary

This is a synthetic, browser-local demonstration. It does not claim AGI/ASI attainment, empirical SOTA, external audit, production certification, settlement activation, staking activation, or value movement.
