# GoalOS Signoff Pro — Until-DONE Mission Control Lab v21 Install Guide

This package adds a new public browser-local GoalOS demonstration page:

```text
until-done-lab.html
mission-control-lab.html
proof-debt-lab.html
```

It demonstrates the GoalOS run-to-completion law:

```text
GoalOS runs until proof is done.
```

## Files to add or replace

In `MontrealAI/goalos-signoff-pro`, add or replace:

```text
config/until-done-lab.json
scripts/build-until-done-lab-page.mjs
scripts/verify-until-done-lab-page.mjs
scripts/generate-until-done-lab-bundle.mjs
scripts/verify-public-demo-routes.mjs
.github/workflows/pages.yml
.github/workflows/website-quality.yml
.github/workflows/until-done-lab.yml
```

## GitHub Web UI steps

1. Open the repository.
2. Add or replace each file from this package.
3. Commit with:

```text
Add Until-DONE Mission Control Lab
```

4. Run:

```text
Actions → Website quality gate → Run workflow → main
```

5. Run:

```text
Actions → Until-DONE Mission Control Lab Autopilot → Run workflow
```

6. Run:

```text
Actions → Deploy GoalOS Signoff Pro production site → Run workflow → main
```

## Expected public links

```text
https://montrealai.github.io/goalos-signoff-pro/until-done-lab.html
https://montrealai.github.io/goalos-signoff-pro/mission-control-lab.html
https://montrealai.github.io/goalos-signoff-pro/proof-debt-lab.html
```

## Expected generated public artifacts

```text
until-done-demo-bundle.json
mission-done-certificate.json
proof-debt-burndown-ledger.json
until-done-action-graph.json
until-done-chronicle-entry.json
until-done-manifest.json
```

## Safety posture

The page is public-safe and browser-local:

```text
No forms
No inputs
No textareas
No uploads
No email gate
No wallet connection
No cookies
No analytics
No payments
No personal data
No confidential data
No value moved
```
