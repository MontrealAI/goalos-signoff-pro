# GoalOS Signoff Pro — Canonical Production Site v10

This package replaces the fragile multi-generator Pages stack with one canonical production composer.

## Why this exists

The previous site was visually breaking because several independent generators were writing pages in different styles and at different times. That produced duplicate legal rails, footer ordering issues, thin fallback pages, and malformed browser-beta links.

Version 10 fixes this by generating the entire public website from one source of truth:

```text
scripts/build-goalos-production-site.mjs
```

The production site is now:

```text
browser beta first
no email gate
no forms
no inputs
no uploads
no wallets
no cookies
no analytics
one footer
one legal rail per page
no duplicate rails
no legacy fallback blocks after footer
```

## Files to add or replace

Add or replace these files in `MontrealAI/goalos-signoff-pro`:

```text
config/goalos-production-site.json
scripts/build-goalos-production-site.mjs
scripts/verify-goalos-production-site.mjs
scripts/verify-website-quality.mjs
scripts/generate-browser-beta-demo-bundle.mjs
.github/workflows/pages.yml
.github/workflows/website-quality.yml
.github/workflows/browser-beta-demo.yml
```

Commit with:

```text
Replace public site with canonical browser beta production composer
```

## Run in GitHub

1. Go to **Actions → Website quality gate → Run workflow → main**.
2. Expected: `GoalOS production site gate PASS`.
3. Go to **Actions → Browser Beta Demo Autopilot → Run workflow → main**.
4. Expected: downloadable `goalos-browser-beta-demo-bundle` artifact.
5. Go to **Actions → Deploy GoalOS Signoff Pro production site → Run workflow → main**.
6. Expected: Pages deploy succeeds.

## Check after deploy

Open:

```text
https://montrealai.github.io/goalos-signoff-pro/
https://montrealai.github.io/goalos-signoff-pro/browser-beta.html
https://montrealai.github.io/goalos-signoff-pro/demo-lab.html
https://montrealai.github.io/goalos-signoff-pro/proof-run-001.html
https://montrealai.github.io/goalos-signoff-pro/multi-agent-sovereign-institution.html
https://montrealai.github.io/goalos-signoff-pro/coordination-theatre.html
https://montrealai.github.io/goalos-signoff-pro/evidence-docket-demo.html
https://montrealai.github.io/goalos-signoff-pro/verify.html
```

## What to expect visually

The homepage should now flow as:

```text
Hero
Browser beta open to everyone
Holy Grail proof loop
Multi-agent institution demo
Footer
Public site rule
```

The public-site rule should appear once per page, inside the footer area, not floating over the content.

## Important

Do not run old public-site generators after this composer. They can overwrite the canonical pages with older fallback fragments. The replacement workflows in this package intentionally use the v10 composer directly.
