# GoalOS Signoff Pro — Rollback & Challenge Window Lab v19 install guide

This package adds a browser-local public demonstration of the GoalOS release law: no proof, no propagation; no rollback, no release.

## Add files

Copy these files into `MontrealAI/goalos-signoff-pro`:

```text
config/rollback-challenge-lab.json
scripts/build-rollback-challenge-lab-page.mjs
scripts/verify-rollback-challenge-lab-page.mjs
scripts/generate-rollback-challenge-lab-bundle.mjs
scripts/verify-public-demo-routes.mjs
.github/workflows/pages.yml
.github/workflows/website-quality.yml
.github/workflows/rollback-challenge-lab.yml
```

Commit:

```text
Add Rollback Challenge Window Lab
```

## Run

```text
Actions → Website quality gate → Run workflow → main
Actions → Rollback Challenge Lab Autopilot → Run workflow
Actions → Deploy GoalOS Signoff Pro production site → Run workflow → main
```

## Verify

```text
https://montrealai.github.io/goalos-signoff-pro/rollback-challenge-lab.html
https://montrealai.github.io/goalos-signoff-pro/challenge-window-lab.html
```

The page is 100% browser-local and uses no forms, no inputs, no uploads, no cookies, no analytics, no wallet connection, no payments, and no user data.
