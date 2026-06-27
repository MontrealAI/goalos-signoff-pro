# GoalOS Multi-Agent Sovereign Institution Demo — Install Guide

This package adds a browser-only user experience for the thesis:

> Large multi-agent systems coordinate to optimal effect when they become proof-governed sovereign institutions.

It does not create a new repository. Install it into:

```text
MontrealAI/goalos-signoff-pro
```

## What users get

After deployment, users can open:

```text
https://montrealai.github.io/goalos-signoff-pro/multi-agent-sovereign-institution.html
https://montrealai.github.io/goalos-signoff-pro/coordination-theatre.html
https://montrealai.github.io/goalos-signoff-pro/proof-governed-swarm.html
https://montrealai.github.io/goalos-signoff-pro/agent-constellation-lab.html
```

They can click **Launch coordination cycle** and watch the browser run a public-safe synthetic coordination loop.

## Public safety posture

The demo is intentionally public-site safe:

- no forms
- no input boxes
- no textareas
- no uploads
- no sign-in
- no wallet connection
- no cookies
- no analytics
- no payments
- no user data
- no confidential data
- no value moved

## GitHub Web UI install steps

Add or replace these files:

```text
config/multi-agent-coordination-demo.json
scripts/build-multi-agent-coordination-demo.mjs
scripts/verify-multi-agent-coordination-demo.mjs
scripts/generate-multi-agent-coordination-demo-bundle.mjs
.github/workflows/pages.yml
.github/workflows/website-quality.yml
.github/workflows/multi-agent-coordination-demo.yml
docs/MULTI_AGENT_COORDINATION_DEMO_INSTALL_GUIDE.md
docs/MULTI_AGENT_COORDINATION_USER_GUIDE.md
```

Commit with:

```text
Add Multi-Agent Sovereign Institution browser demo
```

## Run the checks

Run:

```text
Actions → Website quality gate → Run workflow → main
```

Then run:

```text
Actions → Multi-Agent Coordination Demo Autopilot → Run workflow → main
```

Then run:

```text
Actions → Deploy GoalOS Signoff Pro production site → Run workflow → main
```

## Expected results

```text
Website quality gate: PASS
Multi-Agent Coordination Demo Autopilot: PASS
Production Pages deploy: PASS
```

## What to inspect after deploy

```text
/multi-agent-sovereign-institution.html
/coordination-theatre.html
/proof-governed-swarm.html
/agent-constellation-lab.html
/coordination-manifest.json
/multi-agent-demo-bundle.json
```
