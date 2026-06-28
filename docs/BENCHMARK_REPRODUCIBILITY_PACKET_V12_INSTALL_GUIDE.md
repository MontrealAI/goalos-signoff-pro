# GoalOS Signoff Pro — Benchmark Reproducibility Packet v12 Install Guide

This package fixes the user feedback: the site must expose the hard details needed to attempt Mission 001, not only the concept of proof.

## Files to add or replace

Add these files to `MontrealAI/goalos-signoff-pro`:

```text
config/goalos-production-site.json
config/mission-001-benchmark.json
scripts/build-goalos-production-site.mjs
scripts/verify-goalos-production-site.mjs
scripts/verify-website-quality.mjs
scripts/generate-mission-001-benchmark-packet.mjs
scripts/generate-browser-beta-demo-bundle.mjs
.github/workflows/pages.yml
.github/workflows/website-quality.yml
.github/workflows/mission-001-benchmark-reproducibility.yml
.github/workflows/browser-beta-demo.yml
docs/BENCHMARK_REPRODUCIBILITY_PACKET_V12_INSTALL_GUIDE.md
docs/MISSION_001_REPRODUCIBILITY_USER_GUIDE.md
```

Commit with:

```text
Add Mission 001 benchmark reproducibility packet
```

## Run the workflows

1. `Actions -> Website quality gate -> Run workflow -> main`
2. `Actions -> Mission 001 Benchmark Reproducibility Packet -> Run workflow`
3. `Actions -> Deploy GoalOS Signoff Pro production site -> Run workflow -> main`

## Verify production pages

```text
https://montrealai.github.io/goalos-signoff-pro/mission-001.html
https://montrealai.github.io/goalos-signoff-pro/mission-001-replay.html
https://montrealai.github.io/goalos-signoff-pro/benchmark-reproducibility.html
https://montrealai.github.io/goalos-signoff-pro/benchmark-packet.html
https://montrealai.github.io/goalos-signoff-pro/coordination-benchmark.html
```

## What users can now do

Users can open Mission 001, inspect every benchmark artifact, run the replay in the browser, and run a GitHub Action that creates the same packet as an artifact.

No form, no upload, no account, no wallet, no user data, no external data.
