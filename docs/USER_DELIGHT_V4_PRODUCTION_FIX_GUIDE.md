# GoalOS Signoff Pro — User Delight v4 Production Fix

This package fixes the two production issues reported on the live GitHub Pages site:

1. The homepage demo card appeared below the footer / legal navigation area.
2. `/demo-lab.html` could render as an empty atmospheric background because the generated browser script had a syntax error and the page depended on JavaScript to reveal content.

## What to replace

Replace these files in `MontrealAI/goalos-signoff-pro`:

```text
config/user-delight-autopilot.json
scripts/build-user-delight-pages.mjs
scripts/verify-user-delight-autopilot.mjs
scripts/generate-user-delight-demo.mjs
.github/workflows/pages.yml
.github/workflows/website-quality.yml
.github/workflows/user-delight-autopilot.yml
```

## Commit message

```text
Fix User Delight demo placement and browser demo rendering
```

## Run these workflows

1. `Actions → Website quality gate → Run workflow → main`
2. `Actions → User Delight Demo Autopilot → Run workflow → main`
3. `Actions → Deploy GoalOS Signoff Pro production site → Run workflow → main`

## What to verify after deployment

Open:

```text
https://montrealai.github.io/goalos-signoff-pro/
https://montrealai.github.io/goalos-signoff-pro/demo-lab.html
https://montrealai.github.io/goalos-signoff-pro/evidence-docket-lab.html
https://montrealai.github.io/goalos-signoff-pro/receipt-verifier-demo.html
https://montrealai.github.io/goalos-signoff-pro/autonomous-demo.html
```

Expected result:

- The homepage demo rail appears immediately after the top institutional hero section, before the footer, privacy/legal links, and token boundary rail.
- The demo lab page shows visible content immediately, even before JavaScript runs.
- The proof cycle advances from 0 to 100 when the user clicks **Launch proof cycle**.
- The receipt verifier shows a valid demo receipt state when the user clicks **Verify demo receipt**.
- No forms, uploads, wallets, cookies, analytics, or user-data collection are introduced.

## Why this is safer

The public demo is browser-local and public-safe. It demonstrates the product workflow without collecting visitor data, requesting uploads, connecting wallets, storing cookies, or requiring sign-in.
