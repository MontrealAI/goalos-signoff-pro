# GoalOS Signoff Pro — User Delight No-Input Fix v4.1

This package fixes the Website quality gate failure:

```text
User Delight Autopilot v4 gate: FAIL
- Textareas are not allowed on public demo pages
```

## What changed

- The public demo pages are now no-input by design.
- `verify.html` and `receipt-verifier-demo.html` use bundled demo receipt data instead of asking visitors to paste JSON.
- Any legacy public `<form>`, `<input>`, or `<textarea>` elements left by older generators are sanitized after page generation.
- The homepage demo rail stays above footer/legal/boundary rails.
- `demo-lab.html` remains visible without relying on reveal animations.
- The GitHub Actions workflows use Node 24 to avoid the Node 20 deprecation warnings.

## Files to replace in GitHub Web UI

Replace or create these files:

```text
scripts/build-user-delight-pages.mjs
scripts/verify-user-delight-autopilot.mjs
scripts/generate-user-delight-demo.mjs
.github/workflows/pages.yml
.github/workflows/website-quality.yml
.github/workflows/user-delight-autopilot.yml
config/user-delight-autopilot.json
```

Use commit message:

```text
Fix public demo no-input quality gate
```

## Run

1. `Actions → Website quality gate → Run workflow → main`
2. `Actions → User Delight Demo Autopilot → Run workflow → main`
3. `Actions → Deploy GoalOS Signoff Pro production site → Run workflow → main`

Expected result:

```text
Website quality gate: PASS
User Delight Demo Autopilot: PASS
Deploy GoalOS Signoff Pro production site: PASS
```

## Verify live pages

Open:

```text
https://montrealai.github.io/goalos-signoff-pro/demo-lab.html
https://montrealai.github.io/goalos-signoff-pro/verify.html
https://montrealai.github.io/goalos-signoff-pro/evidence-docket-demo.html
https://montrealai.github.io/goalos-signoff-pro/autonomous-demo.html
```

Confirm:

```text
No blank page
No form
No input
No textarea
No upload
No wallet
No cookies
No analytics
Visible demo content
Launch proof cycle button works
Verify demo receipt button works
```
