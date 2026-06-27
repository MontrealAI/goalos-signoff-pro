# GoalOS Signoff Pro — User Delight Quality Fix v4.1

This hotfix fixes the Website Quality Gate failure:

```text
User Delight Autopilot v4 gate: FAIL
- Textareas are not allowed on public demo pages
```

## What changed

v4.1 preserves the zero-user-data posture by converting any legacy public `<form>`, `<input>`, or `<textarea>` elements into static, non-collecting public information panels before verification.

It also keeps the Demo Lab visible and useful:

- `demo-lab.html` has visible content immediately.
- The homepage demo rail is inserted before footer/legal rails.
- The demo proof cycle remains browser-local.
- The demo artifacts are generated.
- The verifier blocks future public forms, inputs, and textareas.

## Files to replace

Replace these files in `MontrealAI/goalos-signoff-pro`:

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
Fix User Delight public demo quality gate
```

## Run checks

Run:

```text
Actions → Website quality gate → Run workflow → main
```

Expected:

```text
GoalOS website quality gate: PASS
GoalOS legal zero-data gate: PASS
AGIALPHA external token boundary gate: PASS
GoalOS public artifact safety gate: PASS
GoalOS User Delight Autopilot v4.1 gate: PASS
```

Then run:

```text
Actions → Deploy GoalOS Signoff Pro production site → Run workflow → main
```

Expected:

```text
Build and verify public production site: PASS
Deploy to GitHub Pages: PASS
```

## Verify live pages

Open:

```text
https://montrealai.github.io/goalos-signoff-pro/
https://montrealai.github.io/goalos-signoff-pro/demo-lab.html
https://montrealai.github.io/goalos-signoff-pro/evidence-docket-lab.html
https://montrealai.github.io/goalos-signoff-pro/receipt-verifier-demo.html
```

Confirm:

- Demo Lab is not blank.
- The proof cycle is visible and clickable.
- No public text entry boxes appear.
- No upload, form, wallet, cookie, or analytics path appears.
- The contact email remains `info@quebec.ai`.
