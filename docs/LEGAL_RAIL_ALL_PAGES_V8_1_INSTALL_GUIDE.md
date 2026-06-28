# GoalOS Signoff Pro — Legal Rail All Pages v8.1 Final Fix

This fixes the Website quality gate failure:

```text
GoalOS legal zero-data gate FAILED
- Legal rail only found on 45/69 pages
```

## What happened

The legal zero-data generator added the public-site rule to the pages that existed at that point in the build. Later generators added or overwrote additional pages, so only part of the final public artifact had the rule.

## What this patch does

1. Runs all page generators.
2. Runs the browser-beta production hardener.
3. Runs the public-site boundary finalizer last.
4. Injects the legal rail into every generated HTML page.
5. Replaces stale email/request-gate language with browser-local beta language.
6. Removes legacy forms, inputs, textareas, and selects from generated public HTML.
7. Preserves no-user-data, no-wallet, no-cookie, no-payment, no-upload posture.
8. Reorders the build so browser-beta fallback pages do not overwrite flagship Holy Grail or multi-agent pages.

## Files to replace

```text
config/legal-zero-data-posture.json
scripts/finalize-public-site-boundaries.mjs
scripts/verify-legal-zero-data-posture.mjs
scripts/verify-user-delight-autopilot.mjs
.github/workflows/website-quality.yml
.github/workflows/pages.yml
```

## Commit message

```text
Fix legal rail coverage across all public pages
```

## Run in GitHub

1. Actions → Website quality gate → Run workflow → main
2. Actions → Deploy GoalOS Signoff Pro production site → Run workflow → main

Expected result:

```text
GoalOS legal zero-data gate PASS (all HTML pages have legal rail)
GoalOS User Delight Autopilot gate PASS
Holy Grail Browser Demo gate PASS
Multi-Agent Sovereign Institution gate PASS
GoalOS Browser Beta Production gate PASS
```

## Verify live

Open:

```text
https://montrealai.github.io/goalos-signoff-pro/
https://montrealai.github.io/goalos-signoff-pro/browser-beta.html
https://montrealai.github.io/goalos-signoff-pro/holy-grail.html
https://montrealai.github.io/goalos-signoff-pro/multi-agent-sovereign-institution.html
https://montrealai.github.io/goalos-signoff-pro/no-user-data.html
```

Every page should retain the public-site rule and no generated page should ask for email, uploads, forms, wallets, payments, analytics, or personal/confidential data.
