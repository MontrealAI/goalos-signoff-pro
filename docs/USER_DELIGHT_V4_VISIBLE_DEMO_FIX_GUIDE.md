# GoalOS Signoff Pro — User Delight v4 Visible Demo Fix

This package fixes the two production UX issues reported on the live site:

1. The homepage demo block appeared below the footer / Privacy navigation.
2. `demo-lab.html` could render as an empty background because core content was hidden behind a JavaScript reveal state.

## What to replace

In `MontrealAI/goalos-signoff-pro`, add or replace these files:

```text
config/user-delight-autopilot.json
scripts/build-user-delight-pages.mjs
scripts/verify-user-delight-autopilot.mjs
scripts/generate-user-delight-demo.mjs
.github/workflows/pages.yml
.github/workflows/website-quality.yml
.github/workflows/user-delight-autopilot.yml
```

## What it changes

- Demo Lab content is visible immediately; it no longer depends on JavaScript to appear.
- The homepage “Run a browser-local proof mission demo” rail is inserted before the footer/legal links.
- `demo-lab.html` now has a real above-the-fold product demo: hero, proof console, progress ring, scenario cards, and proof package summary.
- The browser-local proof cycle progresses from 0 to 100.
- Receipt verification is interactive and browser-local.
- The GitHub Action demo can generate downloadable proof mission artifacts.
- The quality gate fails if the demo rail appears after the footer or if the demo page is too thin.

## Run the workflows

After committing the files, run:

```text
Actions → Website quality gate → Run workflow → main
```

Then run:

```text
Actions → User Delight Demo Autopilot → Run workflow → main
```

Then deploy:

```text
Actions → Deploy GoalOS Signoff Pro production site → Run workflow → main
```

## Verify in production

Open:

```text
https://montrealai.github.io/goalos-signoff-pro/
https://montrealai.github.io/goalos-signoff-pro/demo-lab.html
https://montrealai.github.io/goalos-signoff-pro/evidence-docket-lab.html
https://montrealai.github.io/goalos-signoff-pro/receipt-verifier-demo.html
https://montrealai.github.io/goalos-signoff-pro/autonomous-demo.html
```

Expected:

- The homepage demo rail appears before Privacy / Terms / footer links.
- The Demo Lab page shows visible content immediately.
- Clicking “Launch proof cycle” animates the gates and reaches 100.
- “Verify sample receipt” changes the verifier state to valid.
- No forms, uploads, sign-in, wallet, cookies, analytics, or user-data intake are introduced.
