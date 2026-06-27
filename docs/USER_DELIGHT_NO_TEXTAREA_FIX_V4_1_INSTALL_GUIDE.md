# GoalOS Signoff Pro — User Delight No-Textarea Fix v4.1

## What this fixes

The Website quality gate failed because a legacy User Activation page still generated a public `<textarea>` control. The public website is intentionally zero-user-data: no forms, no uploads, no text entry, no accounts, no wallets, no cookies, and no analytics.

This patch keeps the demo delightful while preserving that posture:

- `demo-lab.html` remains visible and interactive.
- `receipt-verifier-demo.html` and `verify.html` use a built-in public-safe receipt sample instead of a paste box.
- The generator hardens all generated HTML and removes any legacy form, input, or text-entry controls left by earlier layers.
- The verifier now fails with the exact offending file path if a public control appears again.
- The manifest records the fix.

## Files to replace in GitHub Web UI

Replace these files:

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
Fix public demo controls and verifier quality gate
```

## Run order

Run these in GitHub:

```text
Actions → Website quality gate → Run workflow → main
Actions → User Delight Demo Autopilot → Run workflow → main
Actions → Deploy GoalOS Signoff Pro production site → Run workflow → main
```

## Expected result

```text
GoalOS website quality gate: PASS
GoalOS legal zero-data gate: PASS
AGIALPHA external token boundary gate: PASS
GoalOS public artifact safety gate: PASS
GoalOS User Delight Autopilot v4.1 gate: PASS
Deploy GoalOS Signoff Pro production site: PASS
```

## Pages to inspect after deployment

```text
https://montrealai.github.io/goalos-signoff-pro/
https://montrealai.github.io/goalos-signoff-pro/demo-lab.html
https://montrealai.github.io/goalos-signoff-pro/receipt-verifier-demo.html
https://montrealai.github.io/goalos-signoff-pro/verify.html
https://montrealai.github.io/goalos-signoff-pro/evidence-docket-demo.html
```

## What to confirm visually

- The homepage demo block appears inside product content, not after the footer.
- Demo Lab is not blank.
- Receipt verifier has no paste box.
- Verify page has no paste box.
- Users can click “Verify demo receipt” and see a result.
- The public data posture remains clear: no forms, no uploads, no wallets, no cookies, no analytics.
