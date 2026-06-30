# GoalOS Signoff Pro — Public-Site Boundary Compatibility v20.5

## Purpose

This patch fixes the current GitHub Actions failure:

```text
GoalOS public-site boundary phrase gate FAILED
- falsification-lab.html missing legacy phrase: No forms · no uploads
- validator-mesh-lab.html missing legacy phrase: No forms · no uploads
```

The root cause is verifier wording drift across incremental GoalOS labs. Some older verifiers require the legacy public-site phrase:

```text
No forms · no uploads
```

Newer verifiers require the stricter phrase:

```text
No forms · no inputs · no uploads
```

The production site must satisfy both without weakening any privacy, data, wallet, payment, or claim-boundary gate.

## What this patch does

- Replaces the Validator Mesh legal-rail repair script so `validator-mesh-lab.html` and `falsification-lab.html` contain both verifier-compatible phrases.
- Replaces the global public-site boundary normalizer so every generated HTML page gets exactly one canonical v12 legal rail and exactly one canonical footer.
- Adds a final all-site compatibility repair script that runs after all targeted lab repairs.
- Updates both workflows so the final compatibility pass happens before phrase verification and again before the final quality verifiers.

## Files to add or replace

```text
scripts/repair-validator-mesh-legal-rails.mjs
scripts/normalize-public-site-boundaries.mjs
scripts/repair-public-site-boundary-compatibility.mjs
scripts/repair-governed-decision-state-public-rule.mjs
scripts/verify-public-site-boundary-phrases.mjs
scripts/verify-governed-decision-state-lab-page.mjs
.github/workflows/website-quality.yml
.github/workflows/pages.yml
docs/PUBLIC_SITE_BOUNDARY_COMPATIBILITY_V20_5_INSTALL_GUIDE.md
verification/PUBLIC_SITE_BOUNDARY_COMPATIBILITY_V20_5_VALIDATION.md
```

## Commit message

```text
Stabilize public-site boundary compatibility across GoalOS labs
```

## Run order

1. `Actions → Website quality gate → Run workflow → main`
2. `Actions → Deploy GoalOS Signoff Pro production site → Run workflow → main`

## Expected result

```text
GoalOS Validator Mesh legal rail repair PASS
GoalOS public-site boundary compatibility repair PASS
GoalOS public-site boundary phrase gate PASS
GoalOS Governed Decision State Lab v18.5 gate PASS
GoalOS Validator Mesh & Falsification Lab v20.2 gate PASS
```

## Verify after deploy

Open:

```text
https://montrealai.github.io/goalos-signoff-pro/validator-mesh-lab.html
https://montrealai.github.io/goalos-signoff-pro/falsification-lab.html
https://montrealai.github.io/goalos-signoff-pro/governed-decision-state-lab.html
https://montrealai.github.io/goalos-signoff-pro/decision-state-lab.html
```

Each page should contain exactly one v12 public-site rule rail, exactly one canonical footer, and both compatibility phrases:

```text
No forms · no uploads
No forms · no inputs · no uploads
```

The strict posture remains unchanged:

```text
No forms, no inputs, no textareas, no selects, no uploads, no email gate, no wallet connection, no cookies, no analytics, no payments, no personal data, no confidential data, no value moved.
```
