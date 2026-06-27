# GoalOS Signoff Pro — User Delight Quality Gate Fix v4.1

This patch fixes the current Website quality gate failure and keeps the public demo layer usable.

## What it fixes

- Replaces the User Delight verifier so it checks visible content, homepage placement, safe artifacts, and valid JavaScript.
- Removes the brittle decorative-background / texture failure class.
- Keeps the demo lab visible even if JavaScript is slow or unavailable.
- Keeps the homepage demo rail above footer/legal/token boundary navigation.
- Preserves the zero-user-data posture: no forms, no uploads, no cookies, no analytics, no wallets, no payments.

## Files to replace in GitHub Web UI

Replace or create:

```text
scripts/build-user-delight-pages.mjs
scripts/verify-user-delight-autopilot.mjs
scripts/generate-user-delight-demo.mjs
.github/workflows/pages.yml
.github/workflows/website-quality.yml
.github/workflows/user-delight-autopilot.yml
config/user-delight-autopilot.json
```

Commit message:

```text
Fix User Delight quality gate and visible demo lab
```

## Run order

1. Actions → Website quality gate → Run workflow → main
2. Actions → User Delight Demo Autopilot → Run workflow → main
3. Actions → Deploy GoalOS Signoff Pro production site → Run workflow → main

## Check live pages

```text
https://montrealai.github.io/goalos-signoff-pro/demo-lab.html
https://montrealai.github.io/goalos-signoff-pro/proof-mission-builder.html
https://montrealai.github.io/goalos-signoff-pro/evidence-docket-lab.html
https://montrealai.github.io/goalos-signoff-pro/receipt-verifier-demo.html
https://montrealai.github.io/goalos-signoff-pro/autonomous-demo.html
```
