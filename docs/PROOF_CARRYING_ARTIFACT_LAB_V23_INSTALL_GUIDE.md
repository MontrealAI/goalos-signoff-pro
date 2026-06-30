# GoalOS Signoff Pro — Proof-Carrying Artifact & Evolution Ledger Lab v23 Install Guide

This package adds a new browser-local public demonstration page to `MontrealAI/goalos-signoff-pro`.

## New public routes

```text
proof-carrying-artifact-lab.html
artifact-vault-lab.html
evolution-ledger-lab.html
upgrade-right-lab.html
```

## New public artifacts

```text
proof-carrying-artifact-demo-bundle.json
artifact-vault-index.json
selection-certificate-demo.json
evolution-ledger-entry-demo.json
rollout-receipt-demo.json
rollback-receipt-demo.json
proof-backed-upgrade-right.json
proof-carrying-artifact-manifest.json
```

## Files to add or replace

```text
config/proof-carrying-artifact-lab.json
scripts/build-proof-carrying-artifact-lab-page.mjs
scripts/verify-proof-carrying-artifact-lab-page.mjs
scripts/generate-proof-carrying-artifact-lab-bundle.mjs
scripts/verify-public-demo-routes.mjs
.github/workflows/pages.yml
.github/workflows/website-quality.yml
.github/workflows/proof-carrying-artifact-lab.yml
```

## GitHub Web UI install steps

1. Open the repository.
2. Add the files from this package using **Add file → Create new file** or edit existing files.
3. Commit with:

```text
Add Proof-Carrying Artifact Lab
```

4. Run:

```text
Actions → Website quality gate → Run workflow → main
```

5. Run:

```text
Actions → Proof-Carrying Artifact Lab Autopilot → Run workflow
```

6. Run:

```text
Actions → Deploy GoalOS Signoff Pro production site → Run workflow → main
```

## Expected result

The public page should load at:

```text
https://montrealai.github.io/goalos-signoff-pro/proof-carrying-artifact-lab.html
```

The page remains browser-local and public-safe: no forms, no inputs, no uploads, no wallet, no cookies, no analytics, no personal data, no confidential data, and no value moved.
