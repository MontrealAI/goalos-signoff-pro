# GoalOS Signoff Pro — Browser Beta Final Production Install Guide

This package removes the email/request gate and makes the beta experience available directly in the browser.

## What changes

- The public CTA becomes **Open browser beta**.
- The old phrase “Use this page to request a private beta conversation or a 48-hour Proof Mission” is removed.
- `contact.html`, `request-access.html`, and `pilot.html` become browser-beta entry pages instead of email/request pages.
- The homepage is rebuilt so demo sections appear inside the main product narrative, not below the footer/legal rails.
- Public demo pages are no-input: no forms, no inputs, no textareas, no uploads, no wallets, no cookies, no analytics, no payments, no user data.
- A final production verifier blocks layout/order regressions and unsupported phrases.

## Files to add or replace

Copy these files into `MontrealAI/goalos-signoff-pro`:

```text
config/browser-beta-experience.json
scripts/build-browser-beta-experience.mjs
scripts/finalize-browser-beta-production.mjs
scripts/verify-browser-beta-production.mjs
scripts/generate-browser-beta-demo-bundle.mjs
.github/workflows/pages.yml
.github/workflows/website-quality.yml
.github/workflows/browser-beta-demo.yml
```

Commit with:

```text
Open browser beta and fix production composition
```

## Run the workflows

1. `Actions → Website quality gate → Run workflow → main`
2. `Actions → Browser Beta Demo Autopilot → Run workflow → main`
3. `Actions → Deploy GoalOS Signoff Pro production site → Run workflow → main`

## Verify after deploy

Open:

```text
https://montrealai.github.io/goalos-signoff-pro/
https://montrealai.github.io/goalos-signoff-pro/browser-beta.html
https://montrealai.github.io/goalos-signoff-pro/demo-lab.html
https://montrealai.github.io/goalos-signoff-pro/contact.html
https://montrealai.github.io/goalos-signoff-pro/verify.html
```

Expected result:

- homepage hero displays cleanly;
- browser beta module appears before footer/legal rails;
- contact page says the browser beta is open and requires no email;
- no public demo page contains a form/input/textarea/select;
- users can launch a proof cycle and download a synthetic demo docket entirely in the browser.
