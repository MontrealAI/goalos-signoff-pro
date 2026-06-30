# GoalOS Signoff Pro — Proof-Gated Mission Foundry & Curriculum Lab v26

This package adds a new public browser-local demo page to `MontrealAI/goalos-signoff-pro`.

## Production routes

After deployment, inspect:

```text
https://montrealai.github.io/goalos-signoff-pro/mission-foundry-lab.html
https://montrealai.github.io/goalos-signoff-pro/curriculum-lab.html
https://montrealai.github.io/goalos-signoff-pro/harder-mission-lab.html
```

## What the page demonstrates

The page demonstrates the GoalOS mission-foundry law:

```text
Interestingness is allocation pressure.
Proof gates are admission authority.
```

The browser creates four synthetic public-safe mission seeds. It rejects the narrative-only seed, holds the incomplete seed, quarantines the risky seed, and admits only the bounded proof-gated seed.

## Files to add or replace

Add or replace these files in the repository:

```text
config/mission-foundry-lab.json
scripts/build-mission-foundry-lab-page.mjs
scripts/verify-mission-foundry-lab-page.mjs
scripts/generate-mission-foundry-lab-bundle.mjs
scripts/verify-public-demo-routes.mjs
.github/workflows/pages.yml
.github/workflows/website-quality.yml
.github/workflows/mission-foundry-lab.yml
```

Commit with:

```text
Add Proof-Gated Mission Foundry Lab
```

## Run in GitHub Web UI

1. Go to **Actions → Website quality gate → Run workflow → main**.
2. Confirm the quality gate passes.
3. Go to **Actions → Mission Foundry Lab Autopilot → Run workflow**.
4. Choose a scenario: `research`, `software`, `procurement`, or `safety`.
5. Confirm the artifact bundle is generated.
6. Go to **Actions → Deploy GoalOS Signoff Pro production site → Run workflow → main**.
7. Open the production links above.

## Expected quality-gate result

```text
GoalOS Mission Foundry Lab v26 gate PASS
GoalOS public demo route registry PASS
```

## Public-site posture

The page is static and browser-local.

```text
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

## Public artifacts

The page publishes public-safe synthetic artifacts:

```text
mission-foundry-demo-bundle.json
generated-mission-curriculum.json
mission-seed-certificate.json
interestingness-filter-report.json
mission-quarantine-ledger.json
mission-foundry-manifest.json
```

