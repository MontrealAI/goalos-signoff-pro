# GoalOS Signoff Pro — Process-Resolved Evidence Lab v27 Install Guide

This package adds a new public flagship demonstration page to `MontrealAI/goalos-signoff-pro`.

## New page

```text
process-evidence-lab.html
```

Stable aliases:

```text
process-trace-lab.html
proof-native-workbench-lab.html
evidence-lineage-lab.html
```

## Add or replace these files

```text
config/process-evidence-lab.json
scripts/build-process-evidence-lab-page.mjs
scripts/verify-process-evidence-lab-page.mjs
scripts/generate-process-evidence-lab-bundle.mjs
scripts/verify-public-demo-routes.mjs
.github/workflows/pages.yml
.github/workflows/website-quality.yml
.github/workflows/process-evidence-lab.yml
```

Commit with:

```text
Add Process-Resolved Evidence Lab
```

## Run workflows

```text
Actions → Website quality gate → Run workflow → main
Actions → Process-Resolved Evidence Lab Autopilot → Run workflow
Actions → Deploy GoalOS Signoff Pro production site → Run workflow → main
```

## Verify after deployment

```text
https://montrealai.github.io/goalos-signoff-pro/process-evidence-lab.html
https://montrealai.github.io/goalos-signoff-pro/process-trace-lab.html
https://montrealai.github.io/goalos-signoff-pro/proof-native-workbench-lab.html
https://montrealai.github.io/goalos-signoff-pro/evidence-lineage-lab.html
```

Inspect public artifacts:

```text
process-evidence-demo-bundle.json
process-validator-report.json
action-reason-trace-ledger.json
tool-scope-ledger.json
claim-lineage-map.json
process-evidence-manifest.json
```

## Expected result

The page runs entirely in the browser. It contains no forms, inputs, uploads, wallet connection, analytics, cookies, payments, personal data request, or value movement.
