# GoalOS Signoff Pro — Proof-Gated Coordination Browser Experience v11

This package replaces the public website generation path with one canonical production composer.

It adds the browser-only experience for the thesis:

> Large multi-agent systems coordinate to maximum effect when they become proof-governed sovereign institutions.

## What users get

- Open browser beta with no request and no email.
- Run a proof-to-acceptance cycle in the browser.
- Run a proof-gated coordination cycle in the browser.
- Inspect the built-in Evidence Docket.
- Verify the built-in demo receipt.
- Download a synthetic public-safe demo docket.
- No forms, inputs, uploads, wallet, cookies, analytics, payments, or user data.

## Files to add or replace

Add or replace these files in `MontrealAI/goalos-signoff-pro`:

```text
config/goalos-production-site.json
config/proof-gated-coordination-demo.json
scripts/build-goalos-production-site.mjs
scripts/verify-goalos-production-site.mjs
scripts/verify-website-quality.mjs
scripts/generate-proof-gated-coordination-demo-bundle.mjs
scripts/generate-browser-beta-demo-bundle.mjs
.github/workflows/pages.yml
.github/workflows/website-quality.yml
.github/workflows/proof-gated-coordination-demo.yml
.github/workflows/browser-beta-demo.yml
```

Commit with:

```text
Add proof-gated coordination browser experience
```

## Run the workflows

1. `Actions → Website quality gate → Run workflow → main`
2. `Actions → Proof-Gated Coordination Demo Autopilot → Run workflow → choose a scenario`
3. `Actions → Deploy GoalOS Signoff Pro production site → Run workflow → main`

## After deployment

Open:

```text
https://montrealai.github.io/goalos-signoff-pro/
https://montrealai.github.io/goalos-signoff-pro/proof-gated-coordination.html
https://montrealai.github.io/goalos-signoff-pro/coordination-lab.html
https://montrealai.github.io/goalos-signoff-pro/coordination-theatre.html
https://montrealai.github.io/goalos-signoff-pro/evidence-docket-demo.html
https://montrealai.github.io/goalos-signoff-pro/verify.html
```

## Expected result

The website quality gate should print:

```text
GoalOS production site gate PASS
```

The production Pages workflow should print:

```text
Build and verify canonical production site PASS
Deploy to GitHub Pages PASS
```
