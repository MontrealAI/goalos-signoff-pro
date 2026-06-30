# GoalOS Signoff Pro — Governed Decision State Lab v18

This package adds a new flagship public demonstration page while preserving the zero-user-data posture.

## Production link

`https://montrealai.github.io/goalos-signoff-pro/governed-decision-state-lab.html`

Stable alias:

`https://montrealai.github.io/goalos-signoff-pro/decision-state-lab.html`

## Add / replace these files

```text
config/governed-decision-state-lab.json
scripts/build-governed-decision-state-lab-page.mjs
scripts/verify-governed-decision-state-lab-page.mjs
scripts/generate-governed-decision-state-lab-bundle.mjs
scripts/verify-public-demo-routes.mjs
.github/workflows/pages.yml
.github/workflows/website-quality.yml
.github/workflows/governed-decision-state-lab.yml
```

Commit message:

```text
Add Governed Decision State Lab
```

## Run in GitHub

1. Actions → Website quality gate → Run workflow → main
2. Actions → Governed Decision State Lab Autopilot → Run workflow
3. Actions → Deploy GoalOS Signoff Pro production site → Run workflow → main

## Expected public artifacts

```text
governed-decision-state-demo-bundle.json
governed-decision-state-certificate.json
action-graph-demo.json
verifier-mesh-report.json
contradiction-register.json
decision-state-manifest.json
```

## Public-site safety posture

No forms. No inputs. No textareas. No uploads. No wallet. No cookies. No analytics. No payments. No personal or confidential data. No value moved.
