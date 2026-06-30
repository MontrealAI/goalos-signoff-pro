# GoalOS Signoff Pro — Independent Replay & Claim Promotion Lab v24

This package adds a public browser-local demo page that explains the GoalOS claim-promotion rule:

> One run is not proof. Replay makes it public.

The page is public-safe. It uses no forms, no inputs, no uploads, no email gate, no wallet connection, no cookies, no analytics, no payments, and no user data.

## Files to add or replace

Copy these files into `MontrealAI/goalos-signoff-pro`:

```text
config/independent-replay-lab.json
scripts/build-independent-replay-lab-page.mjs
scripts/verify-independent-replay-lab-page.mjs
scripts/generate-independent-replay-lab-bundle.mjs
scripts/verify-public-demo-routes.mjs
.github/workflows/pages.yml
.github/workflows/website-quality.yml
.github/workflows/independent-replay-lab.yml
```

Commit:

```text
Add Independent Replay Claim Promotion Lab
```

## Run the workflows

1. `Actions → Website quality gate → Run workflow → main`
2. `Actions → Independent Replay Lab Autopilot → Run workflow`
3. `Actions → Deploy GoalOS Signoff Pro production site → Run workflow → main`

## Production URLs

```text
https://montrealai.github.io/goalos-signoff-pro/independent-replay-lab.html
https://montrealai.github.io/goalos-signoff-pro/replay-council-lab.html
https://montrealai.github.io/goalos-signoff-pro/claim-promotion-lab.html
```

## Public artifacts

```text
independent-replay-demo-bundle.json
replay-operator-reports.json
claim-promotion-certificate.json
public-evidence-review-card.json
reproduction-manifest.json
independent-replay-manifest.json
```

## Expected quality result

```text
GoalOS Independent Replay & Claim Promotion Lab v24 gate PASS
GoalOS public demo route registry PASS
```
