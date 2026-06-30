# GoalOS Signoff Pro — Action Graph & Human Authority Lab v22 Install Guide

This package adds a new public browser-local demo page:

```text
action-graph-authority-lab.html
human-authority-action-lab.html
scoped-action-lab.html
```

It demonstrates the GoalOS proof-to-action boundary: a governed decision can produce a scoped Action Graph, but the browser demo never executes external actions, never moves value, and never collects user data.

## Install with GitHub Web UI

In `MontrealAI/goalos-signoff-pro`, add or replace:

```text
config/action-graph-authority-lab.json
scripts/build-action-graph-authority-lab-page.mjs
scripts/verify-action-graph-authority-lab-page.mjs
scripts/generate-action-graph-authority-lab-bundle.mjs
scripts/verify-public-demo-routes.mjs
.github/workflows/pages.yml
.github/workflows/website-quality.yml
.github/workflows/action-graph-authority-lab.yml
```

Commit:

```text
Add Action Graph Human Authority Lab
```

Run:

```text
Actions → Website quality gate → Run workflow → main
Actions → Action Graph Authority Lab Autopilot → Run workflow
Actions → Deploy GoalOS Signoff Pro production site → Run workflow → main
```

## Production URLs

```text
https://montrealai.github.io/goalos-signoff-pro/action-graph-authority-lab.html
https://montrealai.github.io/goalos-signoff-pro/human-authority-action-lab.html
https://montrealai.github.io/goalos-signoff-pro/scoped-action-lab.html
```
