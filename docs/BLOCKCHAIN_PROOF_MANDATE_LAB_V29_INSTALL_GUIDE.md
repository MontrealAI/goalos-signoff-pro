# Install Guide — GoalOS Signoff Pro Public Lab v29

## Drop-in install

```bash
unzip goalos-signoff-pro-blockchain-proof-mandate-lab-v29.zip
cp -R goalos-signoff-pro-blockchain-proof-mandate-lab-v29/. .
git add .
git commit -m "Add GoalOS Blockchain Proof Mandate Lab v29"
git push origin main
```

## Build locally

```bash
rm -rf site artifacts
mkdir -p site artifacts
node scripts/build-goalos-production-site.mjs
node scripts/build-goalos-signoff-public-labs-v22-v29.mjs
node scripts/generate-blockchain-proof-mandate-lab-bundle.mjs dao-grant-payout
node scripts/verify-goalos-signoff-public-labs-v22-v29.mjs
node scripts/verify-blockchain-proof-mandate-lab-page.mjs
```

## GitHub Action

Run:

```text
GoalOS Signoff Pro — Global Public Demo Labs v22-v29
```

Recommended:

```text
proof_mandate_scenario: dao-grant-payout
commit_generated_site: true
deploy_pages: true
```
