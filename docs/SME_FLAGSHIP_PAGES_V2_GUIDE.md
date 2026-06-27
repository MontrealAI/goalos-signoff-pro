# GoalOS Signoff Pro — Sovereign Machine Economy Flagship Pages v2

This package replaces the thin Sovereign Machine Economy pages with substantial, polished, production-ready public pages.

## What it fixes

- `proof-os.html` is no longer a sparse hero section.
- `sovereign-machine-economy.html` becomes a flagship synthesis page.
- `machine-economy.html` becomes a real architecture page.
- `constitution.html` becomes a substantial AEP-001 object-model and selection-law page.
- `proof-missions.html` becomes a credible private-beta proof-mission page.
- The right-side console no longer clips the proof theatre.
- The workflow now checks that the generated pages are not thin.

## Files to install

Replace these files in `MontrealAI/goalos-signoff-pro`:

```text
.github/workflows/pages.yml
scripts/build-sovereign-machine-economy-pages.mjs
```

## GitHub web UI installation

### 1. Replace the generator

Open:

```text
scripts/build-sovereign-machine-economy-pages.mjs
```

Click the pencil icon, select everything, delete it, paste the v2 generator, and commit directly to `main` with:

```text
Upgrade Sovereign Machine Economy flagship pages
```

### 2. Replace the Pages workflow

Open:

```text
.github/workflows/pages.yml
```

Click the pencil icon, select everything, delete it, paste the v2 workflow, and commit directly to `main` with:

```text
Require substantial flagship pages before production deploy
```

### 3. Run the deployment

Go to:

```text
Actions → Deploy GoalOS Signoff Pro production site → Run workflow → main
```

Expected result:

```text
Build and verify public production site     PASS
Deploy to GitHub Pages                      PASS
```

### 4. Inspect the live pages

Open:

```text
https://montrealai.github.io/goalos-signoff-pro/sovereign-machine-economy.html
https://montrealai.github.io/goalos-signoff-pro/proof-os.html
https://montrealai.github.io/goalos-signoff-pro/machine-economy.html
https://montrealai.github.io/goalos-signoff-pro/constitution.html
https://montrealai.github.io/goalos-signoff-pro/proof-missions.html
```

## Acceptance checklist

Before calling it final, confirm:

```text
No text is clipped.
No large blank hero-only pages remain.
The console does not overflow its card.
Proof OS has a real proof theatre and evidence docket section.
Machine Economy has architecture rails and market topology.
Constitution has object graph, selection law, public/private boundary, and conformance ladder.
Proof Missions uses info@quebec.ai.
GitHub Pages workflow is green.
Sovereign Machine Economy parity gate is green.
```


## Local validation result

This package was tested against the latest uploaded repository ZIP and passed the Sovereign Machine Economy parity gate. All five generated pages are above the workflow substance threshold.
