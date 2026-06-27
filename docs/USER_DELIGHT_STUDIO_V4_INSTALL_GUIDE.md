# GoalOS Signoff Pro — User Delight Studio v4 install guide

This package fixes the two visible production issues:

1. The homepage demo block is moved above the footer and privacy/legal links.
2. `demo-lab.html` is no longer blank if JavaScript fails; the demo content is visible by default, with JavaScript used only to enhance the proof-cycle animation.

It also improves the demo experience with a browser-local proof mission theatre, scenario selector, visible proof gates, Evidence Docket demo, receipt verifier demo, and autonomous GitHub Action demo bundle generation.

## Files to replace or add

Add or replace these files in `MontrealAI/goalos-signoff-pro`:

```text
config/user-delight-autopilot.json
scripts/build-user-delight-pages.mjs
scripts/verify-user-delight-autopilot.mjs
scripts/generate-user-delight-demo.mjs
.github/workflows/pages.yml
.github/workflows/website-quality.yml
.github/workflows/user-delight-autopilot.yml
```

## GitHub web UI steps

1. Open the repository on GitHub.
2. Add or replace the files above.
3. Commit directly to `main` with:

```text
Fix user delight demo experience
```

4. Run:

```text
Actions → Website quality gate → Run workflow → main
```

5. Run:

```text
Actions → User Delight Demo Autopilot → Run workflow → main
```

Choose one scenario, such as `ai-research-report`. When the workflow turns green, download the generated artifact bundle.

6. Run:

```text
Actions → Deploy GoalOS Signoff Pro production site → Run workflow → main
```

## Verify after deploy

Open:

```text
https://montrealai.github.io/goalos-signoff-pro/
https://montrealai.github.io/goalos-signoff-pro/demo-lab.html
https://montrealai.github.io/goalos-signoff-pro/evidence-docket-demo.html
https://montrealai.github.io/goalos-signoff-pro/verify.html
https://montrealai.github.io/goalos-signoff-pro/autonomous-demo.html
```

Expected result:

- The homepage demo block appears above the footer.
- The demo lab has visible content immediately.
- The proof cycle button advances from 0 to 100.
- Users can choose a demo mission.
- Evidence Docket and receipt verifier pages are not empty.
- All public-site contact paths use `info@quebec.ai`.
- The public site keeps the zero-user-data posture.
