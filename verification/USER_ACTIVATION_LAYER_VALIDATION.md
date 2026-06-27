# GoalOS Signoff Pro User Activation Layer v1 — Validation

Package contents were generated for direct installation into `MontrealAI/goalos-signoff-pro`.

Validated locally against the latest repository ZIP by generating the public site with:

```bash
node scripts/build-asi-apex-v6-pages.mjs
node scripts/build-sovereign-machine-economy-pages.mjs
node scripts/build-user-activation-pages.mjs
node scripts/verify-website-quality.mjs
node scripts/generate-demo-proof-mission.mjs
```

Expected status: PASS.

## Local run output

### node scripts/build-asi-apex-v6-pages.mjs
Exit: 0
```
GoalOS Signoff Pro ASI Apex v6.1 generated 26 files at /mnt/data/goalos-user-activation-test/goalos-signoff-pro-main/site
Site hash 0c4fac5a7b0d10b0d6cedf3a3454871267d74aae32ae3445cd7d28e6968c3507

```
### node scripts/build-sovereign-machine-economy-pages.mjs
Exit: 0
```
Sovereign Machine Economy pages generated: sovereign-machine-economy.html, proof-os.html, machine-economy.html, constitution.html, proof-missions.html
Site hash: ca721ba3169a498c92028c6d58873ed7da8655919d08fe414f63b8656a6b82c0

```
### node scripts/build-user-activation-pages.mjs
Exit: 0
```
GoalOS User Activation Layer generated 12 pages

```
### node scripts/verify-website-quality.mjs
Exit: 0
```
GoalOS website quality: PASS

```
### node scripts/generate-demo-proof-mission.mjs
Exit: 0
```
Demo Proof Mission generated at artifacts/demo-proof-mission

```