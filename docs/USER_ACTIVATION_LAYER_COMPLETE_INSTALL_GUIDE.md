# User Activation Layer Complete v2 — GitHub Web UI Install Guide

This package implements all requested user-facing pages, repo docs, examples, demo artifacts, public social assets, and autonomous GitHub Actions.

## Add or replace these files

- `config/goalos-proof-missions.json`
- `scripts/build-user-activation-pages.mjs`
- `scripts/verify-website-quality.mjs`
- `scripts/generate-demo-proof-mission.mjs`
- `scripts/ensure-user-activation-package-json.mjs`
- `.github/workflows/pages.yml`
- `.github/workflows/website-quality.yml`
- `.github/workflows/generate-demo-proof-mission.yml`
- `.github/workflows/apply-user-activation-package-settings.yml`
- `START_HERE.md`
- `ROADMAP.md`
- `docs/*`
- `examples/proof-missions/*`
- `public/social/*`

## Run the actions

1. `Actions → Website quality gate → Run workflow → main`
2. `Actions → Generate demo Proof Mission → Run workflow → main`
3. `Actions → Deploy GoalOS Signoff Pro production site → Run workflow → main`
4. Optional: temporarily set Actions to read/write, then run `Apply User Activation package settings` to add `npm run demo:proof-mission` to `package.json`; return Actions to read-only after it commits.

## Verify the live pages

Open:

- `/start.html`
- `/proof-mission.html`
- `/examples.html`
- `/evidence-docket-demo.html`
- `/verify.html`
- `/deliverables.html`
- `/how-it-works.html`
- `/pricing.html`
- `/faq.html`
- `/request-access.html`
- `/press.html`
- `/implementation.html`
- `/glossary.html`
- `/executive-architecture.html`
- `/evidence-hub.html`
- `/chronicle.html`
