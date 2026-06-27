# GoalOS Signoff Pro — Holy Grail Browser Demo v1

This package adds a public, browser-only, no-user-data demo for the GoalOS thesis:

> GoalOS is not merely computationally expressive. It is a Holy Grail candidate for proof-gated open-ended work: Mission → Work → Proof → Validation → Verified Experience → Chronicle → Reusable Capability → Settlement Signal → Reinvestment → Harder Mission.

## What users get

After deployment, users can open:

- `https://montrealai.github.io/goalos-signoff-pro/holy-grail.html`
- `https://montrealai.github.io/goalos-signoff-pro/proof-gated-work-machine.html`
- `https://montrealai.github.io/goalos-signoff-pro/proof-run-001.html`
- `https://montrealai.github.io/goalos-signoff-pro/compounding-loop.html`

The demo runs 100% in the browser. It asks for no information.

## Public safety posture

The pages contain:

- no forms
- no text boxes
- no uploads
- no wallet connection
- no cookies
- no analytics
- no payments
- no personal data request
- no confidential data request
- no value movement

## Files to add / replace

Add or replace these files in `MontrealAI/goalos-signoff-pro`:

```text
config/holy-grail-browser-demo.json
scripts/build-holy-grail-browser-demo.mjs
scripts/verify-holy-grail-browser-demo.mjs
scripts/generate-holy-grail-demo-bundle.mjs
.github/workflows/holy-grail-browser-demo.yml
.github/workflows/pages.yml
.github/workflows/website-quality.yml
docs/HOLY_GRAIL_BROWSER_DEMO_INSTALL_GUIDE.md
docs/HOLY_GRAIL_USER_GUIDE.md
```

Commit message:

```text
Add Holy Grail browser demo
```

## Workflows to run

1. Run:

```text
Actions → Website quality gate → Run workflow → main
```

2. Run:

```text
Actions → Holy Grail Browser Demo Autopilot → Run workflow → main
```

Download the generated artifact named:

```text
goalos-holy-grail-proof-run-001-demo
```

3. Run:

```text
Actions → Deploy GoalOS Signoff Pro production site → Run workflow → main
```

## Verification after deployment

Open:

```text
https://montrealai.github.io/goalos-signoff-pro/holy-grail.html
https://montrealai.github.io/goalos-signoff-pro/proof-run-001.html
https://montrealai.github.io/goalos-signoff-pro/holy-grail-browser-manifest.json
```

Expected result:

- the flagship page is substantial;
- the Proof Run 001 page is immediately visible;
- users can click `Launch proof loop`;
- users can download a demo docket;
- no inputs, forms, uploads, wallets, cookies, analytics, or payments appear.
