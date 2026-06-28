# GoalOS Signoff Pro — Sovereign Experience Stream Lab v15.2 install guide

This package fixes the Website quality gate error where `sovereign-experience-lab.html` and `sovereign-experience-stream-lab.html` did not contain exactly one `data-goalos-legal-rail="v12"` rail.

It also upgrades the page into a richer browser-local lab.

## Files to add or replace

Copy these files into `MontrealAI/goalos-signoff-pro`:

```text
config/sovereign-experience-stream-lab.json
scripts/build-sovereign-experience-lab-page.mjs
scripts/verify-sovereign-experience-lab-page.mjs
scripts/verify-public-demo-routes.mjs
scripts/generate-sovereign-experience-lab-bundle.mjs
.github/workflows/pages.yml
.github/workflows/website-quality.yml
.github/workflows/sovereign-experience-stream-lab.yml
```

Commit with:

```text
Enhance Sovereign Experience Stream Lab and fix legal rail gate
```

## Run order

1. `Actions → Website quality gate → Run workflow → main`
2. `Actions → Sovereign Experience Stream Lab Autopilot → Run workflow`
3. `Actions → Deploy GoalOS Signoff Pro production site → Run workflow → main`

## Expected result

```text
GoalOS production site gate PASS
GoalOS Sovereign Experience Stream Lab v15.2 gate PASS
GoalOS public demo route registry PASS
```

## Verify after deploy

Open:

```text
https://montrealai.github.io/goalos-signoff-pro/sovereign-experience-stream-lab.html
https://montrealai.github.io/goalos-signoff-pro/sovereign-experience-lab.html
https://montrealai.github.io/goalos-signoff-pro/sovereign-experience-stream-demo-bundle.json
https://montrealai.github.io/goalos-signoff-pro/grounded-reward-ledger.json
https://montrealai.github.io/goalos-signoff-pro/temporal-option-registry.json
https://montrealai.github.io/goalos-signoff-pro/router-policy-update-certificate.json
https://montrealai.github.io/goalos-signoff-pro/experience-reanalyze-report.json
```

## Public-site safety posture

The page is browser-local and public-safe:

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
