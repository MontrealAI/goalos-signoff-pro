# GoalOS Signoff Pro — User Delight Autopilot v3

This package adds the next user-friendly layer to the existing `MontrealAI/goalos-signoff-pro` repository. It does not create a new repository.

## What it adds

- A browser-local demo lab.
- A proof mission builder page.
- A demo gallery.
- An Evidence Docket lab.
- A Mission Receipt verifier demo.
- An autonomous GitHub Actions demo that generates a complete public-safe Proof Mission bundle.
- A production Pages workflow that builds every site layer and blocks deployment if the demo/user experience breaks.

## Files to add or replace

Create or replace these files in GitHub web UI:

```text
config/user-delight-autopilot.json
scripts/build-user-delight-pages.mjs
scripts/generate-user-delight-demo.mjs
scripts/verify-user-delight-autopilot.mjs
.github/workflows/user-delight-autopilot.yml
.github/workflows/website-quality.yml
.github/workflows/pages.yml
docs/USER_DELIGHT_AUTOPILOT_INSTALL_GUIDE.md
docs/DEMO_LAB_USER_GUIDE.md
docs/AUTONOMOUS_DEMO_RUNBOOK.md
```

## Run order

1. Commit the files to `main`.
2. Run **Website quality gate**.
3. Run **User Delight Demo Autopilot** and download the generated artifact.
4. Run **Deploy GoalOS Signoff Pro production site**.
5. Open the new live pages.

## Live pages to inspect

```text
https://montrealai.github.io/goalos-signoff-pro/demo-lab.html
https://montrealai.github.io/goalos-signoff-pro/proof-mission-builder.html
https://montrealai.github.io/goalos-signoff-pro/demo-gallery.html
https://montrealai.github.io/goalos-signoff-pro/evidence-docket-lab.html
https://montrealai.github.io/goalos-signoff-pro/receipt-verifier-demo.html
https://montrealai.github.io/goalos-signoff-pro/autonomous-demo.html
https://montrealai.github.io/goalos-signoff-pro/user-delight-manifest.json
```

## What users can do

Users can click through a delightful proof mission demo without signing in, uploading files, connecting a wallet, or giving data. They can inspect a sample Evidence Docket, run a demo receipt verification, and see what a Proof Mission produces.

## What GitHub users can do

Nontechnical repository users can open:

```text
Actions → User Delight Demo Autopilot → Run workflow
```

They choose a scenario and download a generated bundle containing:

```text
mission-contract.json
claims-matrix.json
evidence-docket.json
verifier-report.json
risk-ledger.json
action-graph.json
decision-state.json
mission-receipt.json
public-report.html
README.md
```

## Boundaries preserved

The public demo remains public-safe:

- no forms
- no upload
- no sign-in
- no wallet
- no cookies
- no analytics
- no user data
- no external scripts
- all contact uses `info@quebec.ai`

