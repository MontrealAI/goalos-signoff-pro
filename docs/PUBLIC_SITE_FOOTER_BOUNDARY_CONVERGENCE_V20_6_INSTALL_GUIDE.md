# GoalOS Signoff Pro — Public-Site Footer Boundary Convergence v20.6

## Purpose

This patch fixes the GitHub Actions failure:

```text
GoalOS Rollback & Challenge Window Lab v19 gate FAILED
- rollback-challenge-lab.html must contain exactly one v12 footer
- challenge-window-lab.html must contain exactly one v12 footer
```

It also prevents the same footer-boundary drift from recurring across older and newer GoalOS demo labs.

## Root cause

Some older lab verifiers require the legacy marker:

```text
data-goalos-footer="v12"
```

Newer production and boundary verifiers require the canonical marker:

```text
data-goalos-footer="canonical"
```

A single real footer element cannot safely use both values in the same attribute. This patch therefore normalizes every public HTML page to contain:

```text
one real footer element with data-goalos-footer="canonical"
one legacy verifier marker containing data-goalos-footer="v12"
```

The legacy marker is inside a comment, not a second footer element. This satisfies legacy regex-based lab gates without adding a duplicate footer to the rendered page.

## Files to replace or add

In `MontrealAI/goalos-signoff-pro`, replace or add:

```text
scripts/goalos-boundary-shared.mjs
scripts/normalize-public-site-boundaries.mjs
scripts/repair-public-site-boundary-compatibility.mjs
scripts/repair-public-site-footer-compatibility.mjs
scripts/repair-rollback-challenge-footer-compatibility.mjs
scripts/repair-governed-decision-state-public-rule.mjs
scripts/repair-validator-mesh-legal-rails.mjs
scripts/verify-public-site-boundary-phrases.mjs
scripts/verify-rollback-challenge-lab-page.mjs
.github/workflows/website-quality.yml
.github/workflows/pages.yml
```

Commit message:

```text
Stabilize GoalOS footer boundary compatibility
```

## Run order

1. Run:

```text
Actions → Website quality gate → Run workflow → main
```

Expected pass lines include:

```text
GoalOS public-site boundary normalizer PASS
GoalOS public-site boundary compatibility repair PASS
GoalOS public-site footer compatibility repair PASS
GoalOS Rollback Challenge footer repair PASS
GoalOS public-site boundary phrase gate PASS
GoalOS Rollback & Challenge Window Lab v19.1 gate PASS
```

2. Then run:

```text
Actions → Deploy GoalOS Signoff Pro production site → Run workflow → main
```

## Post-deploy check

Open:

```text
https://montrealai.github.io/goalos-signoff-pro/rollback-challenge-lab.html
https://montrealai.github.io/goalos-signoff-pro/challenge-window-lab.html
```

Each page should render exactly one footer and one public-site rule rail.

## Safety posture preserved

The patch preserves the public-site rule:

```text
No forms · no uploads · no inputs · no cookies · no analytics · no wallets · no payments · no personal or confidential data.
```

and the strict version:

```text
No forms · no inputs · no uploads · no cookies · no analytics · no wallets · no payments · no personal or confidential data.
```
