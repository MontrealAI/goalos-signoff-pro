# GoalOS Signoff Pro — Global Public Demo Labs v22-v27

This package adds one global public demonstration suite to GoalOS Signoff Pro.

It installs the source builders, configs, docs, verification gates, and GitHub Actions needed to add and deploy:

1. GoalOS Signoff Pro — Action Graph & Human Authority Lab v22
2. GoalOS Signoff Pro — Proof-Carrying Artifact & Evolution Ledger Lab v23
3. GoalOS Signoff Pro — Independent Replay & Claim Promotion Lab v24
4. GoalOS Signoff Pro — ProofZero Planning & Evidence Reanalyze Lab v25
5. GoalOS Signoff Pro — Proof-Gated Mission Foundry & Curriculum Lab v26
6. GoalOS Signoff Pro — Process-Resolved Evidence Lab v27

It also adds a global executive-friendly hub:

- `public-demo-labs.html`
- `goalos-public-demo-labs.html`
- `goalos-public-demo-labs-v22-v27.json`

## One-go install

From a clean checkout of `MontrealAI/goalos-signoff-pro`:

```bash
unzip goalos-signoff-public-labs-v22-v27-global-action.zip
cp -R goalos-signoff-public-labs-v22-v27-global-action/. .
git add .
git commit -m "Add GoalOS Signoff Pro public demo labs v22-v27"
git push origin main
```

The updated `pages.yml` deploy workflow will build and deploy the full public website with all six new labs.

## Manual autonomous run

After pushing, open GitHub Actions and run:

`GoalOS Signoff Pro — Global Public Demo Labs v22-v27`

Default inputs are public-safe. The action can:

- build the full site;
- generate one artifact bundle per lab;
- verify production and v22-v27 gates;
- upload the generated site preview;
- optionally commit generated `site/` and `artifacts/`;
- optionally deploy to GitHub Pages.

## Public site posture

The new hub and lab pages are public demonstrations only:

- no forms;
- no inputs;
- no uploads;
- no cookies;
- no analytics;
- no wallets;
- no payments;
- no personal or confidential data;
- no value moved.

