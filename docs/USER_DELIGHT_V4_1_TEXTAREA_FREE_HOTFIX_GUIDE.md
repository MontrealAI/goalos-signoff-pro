# GoalOS Signoff Pro — User Delight Autopilot v4.1

## Purpose

This hotfix resolves the production quality-gate failure:

```text
User Delight Autopilot v4 gate: FAIL
- Textareas are not allowed on public demo pages
```

The public site keeps the zero-user-data posture. The verifier now uses only the built-in demo receipt and never asks a visitor to paste, type, upload, connect a wallet, sign in, or submit data.

## Files to add or replace

Replace these files in `MontrealAI/goalos-signoff-pro`:

```text
scripts/build-user-delight-pages.mjs
scripts/verify-user-delight-autopilot.mjs
scripts/generate-user-delight-demo.mjs
scripts/build-user-activation-pages.mjs
scripts/verify-website-quality.mjs
.github/workflows/pages.yml
.github/workflows/website-quality.yml
.github/workflows/user-delight-autopilot.yml
config/user-delight-autopilot.json
config/goalos-proof-missions.json
```

## What changed

- `verify.html` is overwritten with a zero-data, no-input receipt verifier.
- Legacy public `<textarea>`, `<input>`, and `<form>` elements are removed from generated public HTML.
- The Demo Lab remains visible and interactive.
- Public example README files are generated into `site/examples/proof-missions/...` so internal links do not break.
- Workflows now use newer Node-24-compatible GitHub Actions tags where available.

## Run order

1. Commit the replacement files.
2. Run:

```text
Actions → Website quality gate → Run workflow → main
```

3. Run:

```text
Actions → User Delight Demo Autopilot → Run workflow → main
```

4. Run:

```text
Actions → Deploy GoalOS Signoff Pro production site → Run workflow → main
```

## Expected result

```text
GoalOS website quality gate PASS
AGIALPHA external token boundary gate PASS
GoalOS public artifact safety gate PASS
GoalOS User Delight Autopilot v4.1 gate PASS
Deploy to GitHub Pages PASS
```

## Pages to verify after deploy

```text
https://montrealai.github.io/goalos-signoff-pro/demo-lab.html
https://montrealai.github.io/goalos-signoff-pro/verify.html
https://montrealai.github.io/goalos-signoff-pro/evidence-docket-demo.html
https://montrealai.github.io/goalos-signoff-pro/examples.html
```

## User experience rule

The public demo must be delightful and useful while remaining zero-data:

```text
No forms
No text boxes
No uploads
No sign-in
No wallet
No cookies
No analytics
No personal or confidential data
```
