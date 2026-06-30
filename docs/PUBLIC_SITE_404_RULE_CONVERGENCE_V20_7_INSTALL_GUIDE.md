# GoalOS Signoff Pro — Public-Site 404 Rule Convergence v20.7

## What this fixes

The current Website quality gate fails after all prior production/lab checks pass:

```text
GoalOS website quality gate FAILED
- 404.html must contain exactly one public-site rule.
```

This package adds a final, idempotent 404 repair and verification step. The generated `404.html` is rewritten into a clean, browser-local, claim-bounded safe-return page containing exactly:

```text
1 data-goalos-legal-rail="v12"
1 visible Public site rule
1 data-goalos-footer="canonical"
1 legacy data-goalos-footer="v12" compatibility marker
```

It also preserves the newer and older public-site rule phrases:

```text
No forms · no uploads
No forms · no inputs · no uploads
```

## Files to add or replace

```text
scripts/goalos-boundary-shared.mjs
scripts/normalize-public-site-boundaries.mjs
scripts/repair-public-site-boundary-compatibility.mjs
scripts/repair-public-site-footer-compatibility.mjs
scripts/repair-governed-decision-state-public-rule.mjs
scripts/repair-validator-mesh-legal-rails.mjs
scripts/repair-rollback-challenge-footer-compatibility.mjs
scripts/repair-404-public-site-rule.mjs
scripts/verify-public-site-boundary-phrases.mjs
scripts/verify-404-public-site-rule.mjs
scripts/verify-rollback-challenge-lab-page.mjs
.github/workflows/website-quality.yml
.github/workflows/pages.yml
```

## GitHub Web UI installation

1. Open `https://github.com/MontrealAI/goalos-signoff-pro`.
2. For each file above, choose **Add file → Create new file** or open the existing file and click the pencil icon.
3. Paste the matching file content from this package.
4. Commit to `main` with:

```text
Stabilize 404 public-site rule boundary
```

## Run order

Run:

```text
Actions → Website quality gate → Run workflow → main
```

Expected new pass lines:

```text
GoalOS 404 public-site rule repair PASS
GoalOS public-site boundary phrase gate PASS
GoalOS 404 public-site rule gate PASS
GoalOS website quality gate PASS
```

Then run:

```text
Actions → Deploy GoalOS Signoff Pro production site → Run workflow → main
```

## Why this is robust

The repair runs after site generation, after lab generation, after targeted lab repairs, after boundary/footer compatibility repair, and immediately before the final Website quality verifier. It also runs again after lab verifiers in case a legacy verifier or generator rewrites optional demo routes.

The page remains static and public-safe:

```text
No forms
No inputs
No uploads
No wallet path
No analytics
No cookies
No email gate
No personal data request
No confidential data request
No value movement
```
