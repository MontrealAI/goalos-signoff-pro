# GoalOS Signoff Pro — ProofZero Planning & Evidence Reanalyze Lab v25

This package adds a new flagship public demo to `MontrealAI/goalos-signoff-pro`.

## Core idea

```text
Plan over proof-relevant work states, not persuasive futures.
Search is advisory. Proof decides.
```

The page demonstrates how GoalOS can search possible organizational actions before acting, while keeping the result advisory until proof, replay, validators, risk boundaries, rollback, and human authority clear.

## Routes added

```text
proofzero-planning-lab.html
evidence-reanalyze-lab.html
latent-work-state-lab.html
bounded-search-lab.html
```

## Public artifacts added

```text
proofzero-planning-demo-bundle.json
latent-work-state-report.json
evidence-reanalyze-ledger.json
planning-depth-scoreboard.json
router-policy-update.json
proofzero-planning-manifest.json
```

## GitHub Action added

```text
Actions → ProofZero Planning Lab Autopilot
```

## Install through GitHub Web UI

In `MontrealAI/goalos-signoff-pro`, add or replace:

```text
config/proofzero-planning-lab.json
scripts/build-proofzero-planning-lab-page.mjs
scripts/verify-proofzero-planning-lab-page.mjs
scripts/generate-proofzero-planning-lab-bundle.mjs
scripts/verify-public-demo-routes.mjs
.github/workflows/pages.yml
.github/workflows/website-quality.yml
.github/workflows/proofzero-planning-lab.yml
```

Commit with:

```text
Add ProofZero Planning Evidence Reanalyze Lab
```

## Run workflows

First:

```text
Actions → Website quality gate → Run workflow → main
```

Then:

```text
Actions → ProofZero Planning Lab Autopilot → Run workflow
```

Then:

```text
Actions → Deploy GoalOS Signoff Pro production site → Run workflow → main
```

## Verify after deploy

Open:

```text
https://montrealai.github.io/goalos-signoff-pro/proofzero-planning-lab.html
https://montrealai.github.io/goalos-signoff-pro/evidence-reanalyze-lab.html
https://montrealai.github.io/goalos-signoff-pro/latent-work-state-lab.html
https://montrealai.github.io/goalos-signoff-pro/bounded-search-lab.html
```

Inspect:

```text
https://montrealai.github.io/goalos-signoff-pro/proofzero-planning-demo-bundle.json
https://montrealai.github.io/goalos-signoff-pro/latent-work-state-report.json
https://montrealai.github.io/goalos-signoff-pro/evidence-reanalyze-ledger.json
https://montrealai.github.io/goalos-signoff-pro/planning-depth-scoreboard.json
https://montrealai.github.io/goalos-signoff-pro/router-policy-update.json
```

## Public posture

```text
No forms
No inputs
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
