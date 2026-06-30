# GoalOS Signoff Pro — Governed Decision State Quality Stabilizer v20.4

## Problem fixed

The GitHub Action failed with:

```text
GoalOS Governed Decision State Lab v18 gate FAILED
 - governed-decision-state-lab.html missing required phrase: No forms · no uploads
 - decision-state-lab.html missing required phrase: No forms · no uploads
```

The root cause is verifier phrase drift across independently generated labs. Some labs/normalizers emit the newer public-site phrase `No forms · no inputs · no uploads`, while the older Governed Decision State verifier still requires the legacy exact substring `No forms · no uploads`.

## Files to replace

Copy these files into the repository root:

```text
scripts/normalize-public-site-boundaries.mjs
scripts/repair-governed-decision-state-public-rule.mjs
scripts/verify-governed-decision-state-lab-page.mjs
scripts/verify-public-site-boundary-phrases.mjs
.github/workflows/website-quality.yml
.github/workflows/pages.yml
```

Commit:

```text
Stabilize Governed Decision State public rule phrase
```

## Run order

1. Actions → Website quality gate → Run workflow → main
2. Actions → Deploy GoalOS Signoff Pro production site → Run workflow → main

Expected pass lines:

```text
GoalOS public-site boundary normalizer PASS
GoalOS Governed Decision State public-rule repair PASS
GoalOS public-site boundary phrase gate PASS
GoalOS Governed Decision State Lab v18.5 gate PASS
```

## What the stabilizer guarantees

Each non-404 HTML page has exactly one v12 legal rail and exactly one canonical footer.
The governed decision routes explicitly contain both verifier-compatible phrases:

```text
No forms · no uploads
No forms · no inputs · no uploads
```

No forms, inputs, textareas, selects, uploads, wallet path, cookies, analytics, payments, personal data request, confidential data request, or value movement are introduced.
