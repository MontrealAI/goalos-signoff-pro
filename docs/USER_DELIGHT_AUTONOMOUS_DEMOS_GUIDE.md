# GoalOS Signoff Pro — User Delight & Autonomous Demos v3

This package adds a public, browser-local demo layer and a one-click GitHub Actions demo runner to `MontrealAI/goalos-signoff-pro`.

## What users get

- `demo-lab.html` — run a public-safe proof mission simulation in the browser.
- `examples.html` — choose familiar proof mission examples.
- `evidence-docket-demo.html` — inspect a sample Evidence Docket.
- `verify.html` — verify a sample Mission Receipt in the browser.
- `start.html` — a simple first-user path.
- `autonomous-demos.html` — click-by-click GitHub Actions demo instructions.

## What repo users get

- `Actions → Generate Delight Demo Proof Mission → Run workflow`
- A downloadable artifact package containing:
  - `mission-contract.json`
  - `claims-matrix.json`
  - `evidence-docket.json`
  - `verifier-report.json`
  - `risk-ledger.json`
  - `decision-state.json`
  - `action-graph.json`
  - `mission-receipt.json`
  - `public-report.html`

## Zero-data design

The demo layer uses predefined public-safe sample missions only. It does not ask visitors to upload files, connect wallets, create accounts, submit forms, make payments, accept cookies, or send personal/confidential data.

## GitHub web UI install

1. Add `config/goalos-delight-demo-lab.json`.
2. Add these scripts:
   - `scripts/build-delight-demo-lab-pages.mjs`
   - `scripts/verify-delight-demo-lab.mjs`
   - `scripts/generate-delight-demo-proof-mission.mjs`
3. Add these workflows:
   - `.github/workflows/delight-demo-lab.yml`
   - `.github/workflows/generate-delight-demo-proof-mission.yml`
4. Replace `.github/workflows/pages.yml` with the included production workflow.
5. Commit to `main`.
6. Run `Actions → Delight demo lab gate → Run workflow`.
7. Run `Actions → Generate Delight Demo Proof Mission → Run workflow`.
8. Run `Actions → Deploy GoalOS Signoff Pro production site → Run workflow`.

## Production checks

Expected green workflows:

- Delight demo lab gate
- Generate Delight Demo Proof Mission
- Deploy GoalOS Signoff Pro production site

After deploy, inspect:

- `https://montrealai.github.io/goalos-signoff-pro/demo-lab.html`
- `https://montrealai.github.io/goalos-signoff-pro/evidence-docket-demo.html`
- `https://montrealai.github.io/goalos-signoff-pro/verify.html`
- `https://montrealai.github.io/goalos-signoff-pro/autonomous-demos.html`
