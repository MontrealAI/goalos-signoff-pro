# Validation — GoalOS Signoff Pro Public Labs v22-v27 Global Autopilot

Local validation was performed against the uploaded `goalos-signoff-pro-main` repository package.

## Build commands validated

```bash
rm -rf site artifacts
mkdir -p site artifacts
node scripts/build-goalos-production-site.mjs
for f in \
  scripts/build-proof-gradient-lab-page.mjs \
  scripts/build-capability-compounding-lab-page.mjs \
  scripts/build-sovereign-experience-lab-page.mjs \
  scripts/build-proof-settlement-lab-page.mjs \
  scripts/build-public-private-proof-boundary-lab-page.mjs \
  scripts/build-governed-decision-state-lab-page.mjs \
  scripts/build-rollback-challenge-lab-page.mjs \
  scripts/build-validator-mesh-lab-page.mjs \
  scripts/build-until-done-lab-page.mjs; do
  if [ -f "$f" ]; then node "$f"; fi
done
node scripts/build-goalos-signoff-public-labs-v22-v27.mjs
node scripts/verify-goalos-production-site.mjs
node scripts/verify-goalos-signoff-public-labs-v22-v27.mjs
```

## Result

- production site gate passed;
- v22 gate passed;
- v23 gate passed;
- v24 gate passed;
- v25 gate passed;
- v26 gate passed;
- v27 gate passed;
- global v22-v27 gate passed;
- 23 v22-v27 HTML routes checked;
- 40 v22-v27 JSON artifacts checked;
- generated site preview contained 105 HTML pages in the local test.

## Boundary

The package is public-demo only. It does not add forms, inputs, uploads, cookies, analytics, wallet connections, payment flows, custody, staking, escrow, Mainnet settlement, production certification, external audit claims, or value movement.

