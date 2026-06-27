# GoalOS Signoff Pro — Holy Grail Browser Demo v7 Quality Gate Repair

This package fixes the Website quality gate failure:

```text
holy-grail-demo-bundle.json contains unsupported phrase: guaranteed return
```

The phrase came from the old v1 claim-boundary sentence. It was protective wording, not an offer, but the quality gate correctly blocks the phrase anywhere in the public artifact.

## What this patch does

- Replaces the old Holy Grail browser-demo generator with a claim-safe version.
- Replaces the Holy Grail config with a version that does not contain the blocked phrase.
- Adds a final public-site boundary finalizer that removes legacy phrase artifacts before verification.
- Keeps the public demo zero-input: no forms, no inputs, no textareas, no uploads, no wallets, no cookies, no analytics, no payments, no user data.
- Keeps existing optional layers: ASI Apex, Sovereign Machine Economy, User Activation, Legal Zero-Data, AGIALPHA boundary, User Delight, and Multi-Agent demos.

## Install in GitHub web UI

Replace or create these files in `MontrealAI/goalos-signoff-pro`:

```text
config/holy-grail-browser-demo.json
scripts/build-holy-grail-browser-demo.mjs
scripts/verify-holy-grail-browser-demo.mjs
scripts/generate-holy-grail-demo-bundle.mjs
scripts/finalize-public-site-boundaries.mjs
.github/workflows/website-quality.yml
.github/workflows/pages.yml
.github/workflows/holy-grail-browser-demo.yml
```

Commit with:

```text
Fix Holy Grail browser demo quality gate
```

Then run:

```text
Actions → Website quality gate → Run workflow → main
```

Then run:

```text
Actions → Holy Grail Browser Demo Autopilot → Run workflow → main
```

Then run:

```text
Actions → Deploy GoalOS Signoff Pro production site → Run workflow → main
```

## Expected result

```text
Website quality gate: PASS
Holy Grail Browser Demo Autopilot: PASS
Deploy GoalOS Signoff Pro production site: PASS
```

## Verify production

Open:

```text
https://montrealai.github.io/goalos-signoff-pro/holy-grail.html
https://montrealai.github.io/goalos-signoff-pro/proof-run-001.html
https://montrealai.github.io/goalos-signoff-pro/proof-gated-work-machine.html
https://montrealai.github.io/goalos-signoff-pro/compounding-loop.html
```
