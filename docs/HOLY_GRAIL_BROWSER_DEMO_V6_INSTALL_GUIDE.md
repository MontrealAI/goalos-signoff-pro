# GoalOS Signoff Pro — Holy Grail Browser Demo v6

This package adds the final browser-only proof-loop experience to the existing `MontrealAI/goalos-signoff-pro` repository.

It does not create a new repo. It does not collect data. It does not add forms, inputs, uploads, wallets, cookies, analytics, payments, or value movement.

## Add these files through GitHub Web UI

Create or replace:

```text
config/holy-grail-browser-demo.json
scripts/build-holy-grail-browser-demo.mjs
scripts/verify-holy-grail-browser-demo.mjs
scripts/generate-holy-grail-demo-bundle.mjs
scripts/finalize-public-site-boundaries.mjs
.github/workflows/pages.yml
.github/workflows/website-quality.yml
.github/workflows/holy-grail-browser-demo.yml
```

Commit message:

```text
Add Holy Grail browser demo v6
```

## Run

1. Actions → Website quality gate → Run workflow → main
2. Actions → Holy Grail Browser Demo Autopilot → Run workflow → main
3. Actions → Deploy GoalOS Signoff Pro production site → Run workflow → main

## Open

```text
https://montrealai.github.io/goalos-signoff-pro/holy-grail.html
https://montrealai.github.io/goalos-signoff-pro/proof-run-001.html
https://montrealai.github.io/goalos-signoff-pro/proof-gated-work-machine.html
https://montrealai.github.io/goalos-signoff-pro/compounding-loop.html
```

## User experience

The user clicks **Launch proof loop**. The browser advances through:

```text
Mission → Work → Proof → Validation → Verified Experience → Chronicle → Reusable Capability → Settlement Signal → Reinvestment → Harder Mission
```

The user can click **Download demo docket** to download a synthetic, public-safe JSON proof bundle generated entirely in the browser.
