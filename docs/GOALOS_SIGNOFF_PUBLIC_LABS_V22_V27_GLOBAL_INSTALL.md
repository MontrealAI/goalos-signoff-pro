# Install Guide — GoalOS Signoff Pro Public Labs v22-v27 Global Autopilot

## What this adds

This installer adds one global build/verify/deploy path for the next six flagship public demonstrations:

- v22 Action Graph & Human Authority
- v23 Proof-Carrying Artifact & Evolution Ledger
- v24 Independent Replay & Claim Promotion
- v25 ProofZero Planning & Evidence Reanalyze
- v26 Proof-Gated Mission Foundry & Curriculum
- v27 Process-Resolved Evidence

It also adds a single public hub page that makes the suite understandable for corporate users, reviewers, and non-technical stakeholders.

## Files added or updated

- `.github/workflows/pages.yml`
- `.github/workflows/website-quality.yml`
- `.github/workflows/goalos-signoff-public-labs-v22-v27.yml`
- `scripts/build-goalos-signoff-public-labs-v22-v27.mjs`
- `scripts/verify-goalos-signoff-public-labs-v22-v27.mjs`
- the six lab builder/generator/verifier scripts
- the six lab config files
- the six lab user/install guides
- the six lab validation notes

## Deploy behavior

The updated Pages workflow does this on push to `main`:

1. deletes and recreates `site/` and `artifacts/`;
2. builds the canonical production site;
3. builds the existing public demo labs v13-v21 when their builders exist;
4. builds the global v22-v27 suite;
5. verifies the production site;
6. verifies the v22-v27 suite;
7. uploads and deploys `site/` to GitHub Pages.

## Global manual action

The manual action is useful when you want a one-click autonomous pass with scenario-specific artifact bundles.

Action name:

`GoalOS Signoff Pro — Global Public Demo Labs v22-v27`

Recommended defaults:

- all scenarios: `research`
- `commit_generated_site`: `true`
- `deploy_pages`: `true`

## Expected live routes

- `public-demo-labs.html`
- `goalos-public-demo-labs.html`
- `action-graph-authority-lab.html`
- `human-authority-action-lab.html`
- `scoped-action-lab.html`
- `proof-carrying-artifact-lab.html`
- `artifact-vault-lab.html`
- `evolution-ledger-lab.html`
- `upgrade-right-lab.html`
- `independent-replay-lab.html`
- `replay-council-lab.html`
- `claim-promotion-lab.html`
- `proofzero-planning-lab.html`
- `evidence-reanalyze-lab.html`
- `latent-work-state-lab.html`
- `bounded-search-lab.html`
- `mission-foundry-lab.html`
- `curriculum-lab.html`
- `harder-mission-lab.html`
- `process-evidence-lab.html`
- `process-trace-lab.html`
- `proof-native-workbench-lab.html`
- `evidence-lineage-lab.html`

