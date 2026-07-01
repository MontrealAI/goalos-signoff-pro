# GoalOS Signoff Pro — v33/v34 GitHub Actions Error Correction

## What this fixes

Your failed run shows this error:

```text
Error: Missing site/loop-rsi-asi-superintelligence-lab.html. Upload the complete v33 package.
```

The real issue is that the production site build regenerates `site/` first. That can wipe the uploaded v33 route before the v33 builder checks for it. This package makes v33 self-contained by storing the source page/assets/artifacts under:

```text
docs/generated-source/v33/site/
```

Then the v33 builder restores the route after the production site rebuild.

## Also corrected

- Replaces the failing v33 build script.
- Replaces the v33 verifier with a safer route/artifact verifier.
- Replaces the v22-v33 global builder so optional prior scripts are skipped cleanly if absent.
- Updates v33 and v34 workflows to Node.js 24 with `actions/checkout@v5` and `actions/setup-node@v5`.
- Preserves public-safe posture: no forms, no text inputs, no uploads, no wallets, no payments, no external AI calls, zero value moved.

## GitHub Web UI install

1. Download this ZIP and unzip it.
2. Open the unzipped folder.
3. In GitHub, go to the root of `MontrealAI/goalos-signoff-pro`.
4. Click **Add file → Upload files**.
5. Drag the **contents inside** the unzipped folder.
6. Make sure the hidden `.github` folder is included.
7. Commit to a new branch or directly to `main`.
8. Re-run:

```text
Actions → GoalOS Signoff Pro — Loop to RSI to ASI v33
```

Recommended settings:

```text
commit_generated_site: true
deploy_pages: true
```

After v33 passes, run the v34 workflow if you want to deploy the Control Tower.
