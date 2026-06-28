# GoalOS Signoff Pro — Proof Gradient Route Fix v13.1

This patch fixes the public route:

```text
https://montrealai.github.io/goalos-signoff-pro/proof-gradient-lab.html
```

If that URL currently shows `Route Not Found`, it means the canonical site generator ran without the Proof Gradient page extension. Install this package and run the updated workflows.

## Files to add or replace

```text
config/proof-gradient-lab.json
scripts/build-proof-gradient-lab-page.mjs
scripts/verify-proof-gradient-lab-page.mjs
scripts/generate-proof-gradient-lab-bundle.mjs
scripts/verify-public-demo-routes.mjs
.github/workflows/pages.yml
.github/workflows/website-quality.yml
.github/workflows/proof-gradient-lab.yml
```

## GitHub Web UI steps

1. Open the repository: `MontrealAI/goalos-signoff-pro`.
2. Add or replace the files listed above.
3. Commit to `main` with:

```text
Fix Proof Gradient public demo route
```

4. Run:

```text
Actions → Website quality gate → Run workflow → main
```

5. Run:

```text
Actions → Proof Gradient Selection Lab Autopilot → Run workflow → main
```

6. Run:

```text
Actions → Deploy GoalOS Signoff Pro production site → Run workflow → main
```

## Expected result

```text
GoalOS Proof Gradient Selection Lab gate PASS
GoalOS public demo route registry PASS
Deploy to GitHub Pages PASS
```

## Verify production

Open:

```text
https://montrealai.github.io/goalos-signoff-pro/proof-gradient-lab.html
https://montrealai.github.io/goalos-signoff-pro/proof-gradient-selection-certificate.json
https://montrealai.github.io/goalos-signoff-pro/proof-gradient-evolution-ledger-entry.json
https://montrealai.github.io/goalos-signoff-pro/proof-gradient-demo-docket.json
```

The page should show the flagship Proof Gradient Selection Lab, not a 404 fallback.
