# Install GoalOS Signoff Pro User Activation Layer v1

Use GitHub web UI.

## 1. Add the config

Create:

```text
config/goalos-proof-missions.json
```

Paste the package file and commit:

```text
Add GoalOS proof mission configuration
```

## 2. Add scripts

Create:

```text
scripts/build-user-activation-pages.mjs
scripts/verify-website-quality.mjs
scripts/generate-demo-proof-mission.mjs
```

Commit:

```text
Add user activation website and proof mission scripts
```

## 3. Add workflows

Create or replace:

```text
.github/workflows/pages.yml
.github/workflows/website-quality.yml
.github/workflows/generate-demo-proof-mission.yml
```

Commit:

```text
Add user activation website workflows
```

## 4. Add docs and examples

Add:

```text
START_HERE_USER_ACTIVATION.md
docs/PROOF_MISSION_GUIDE.md
docs/EVIDENCE_DOCKET_GUIDE.md
docs/RECEIPT_VERIFICATION_GUIDE.md
docs/WEBSITE_OPERATIONS.md
docs/RELEASE_CHECKLIST.md
examples/proof-missions/**
```

Commit:

```text
Add proof mission docs and examples
```

## 5. Run workflows

Run:

```text
Actions → Website quality gate → Run workflow → main
```

Then run:

```text
Actions → Generate demo Proof Mission → Run workflow → main
```

Then run:

```text
Actions → Deploy GoalOS Signoff Pro production site → Run workflow → main
```

## 6. Verify production

Open:

```text
https://montrealai.github.io/goalos-signoff-pro/start.html
https://montrealai.github.io/goalos-signoff-pro/proof-mission.html
https://montrealai.github.io/goalos-signoff-pro/evidence-docket-demo.html
https://montrealai.github.io/goalos-signoff-pro/verify.html
```
