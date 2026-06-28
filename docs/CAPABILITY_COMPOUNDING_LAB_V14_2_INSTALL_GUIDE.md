# GoalOS Signoff Pro — Capability Compounding Lab v14.2 Install Guide

This package enhances the existing page:

```text
https://montrealai.github.io/goalos-signoff-pro/capability-compounding-lab.html
```

It keeps the same URL and replaces the previous static-looking page with a richer browser-local lab.

## What it adds

- Four no-input public-safe scenarios.
- A browser-local compounding cycle.
- Animated proof → gate → Chronicle → capability visualization.
- Evidence-state trace.
- Capability library tab.
- Chronicle tab.
- Scoreboard tab.
- Public JSON artifacts.
- GitHub Action to generate a downloadable demo bundle.

## Safety posture

The page uses no forms, no inputs, no textareas, no uploads, no wallet connection, no cookies, no analytics, no payments, no personal data, and no confidential data.

## Files to add or replace

```text
config/capability-compounding-lab.json
scripts/build-capability-compounding-lab-page.mjs
scripts/verify-capability-compounding-lab-page.mjs
scripts/verify-public-demo-routes.mjs
scripts/generate-capability-compounding-lab-bundle.mjs
.github/workflows/pages.yml
.github/workflows/website-quality.yml
.github/workflows/capability-compounding-lab.yml
```

## GitHub Web UI steps

1. Open the repository `MontrealAI/goalos-signoff-pro`.
2. Add or replace the files listed above.
3. Commit directly to `main` with:

```text
Enhance Capability Compounding Lab
```

## Run the workflows

Run:

```text
Actions → Website quality gate → Run workflow → main
```

Then run:

```text
Actions → Capability Compounding Lab Autopilot → Run workflow
```

Choose one scenario:

```text
research
software
security
policy
```

Then run:

```text
Actions → Deploy GoalOS Signoff Pro production site → Run workflow → main
```

## Verify production

Open:

```text
https://montrealai.github.io/goalos-signoff-pro/capability-compounding-lab.html
https://montrealai.github.io/goalos-signoff-pro/capability-compounding-demo-bundle.json
https://montrealai.github.io/goalos-signoff-pro/capability-package-library.json
https://montrealai.github.io/goalos-signoff-pro/chronicle-compounding-entry.json
https://montrealai.github.io/goalos-signoff-pro/capability-compounding-scoreboard.json
```

Expected: the lab shows visible content immediately, the buttons run the proof-to-capability cycle in the browser, and the quality gate passes.
