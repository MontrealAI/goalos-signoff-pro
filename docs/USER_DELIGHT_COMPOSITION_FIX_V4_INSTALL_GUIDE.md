# GoalOS Signoff Pro — User Delight Composition Fix v4

This is the production hotfix for the two issues visible on the live site:

1. the homepage demo rail appeared below footer / privacy navigation;
2. `demo-lab.html` looked blank because demo content was not reliably visible.

## What this package changes

Replace these files in `MontrealAI/goalos-signoff-pro`:

```text
scripts/build-user-delight-pages.mjs
scripts/verify-user-delight-autopilot.mjs
scripts/generate-user-delight-demo.mjs
.github/workflows/pages.yml
.github/workflows/website-quality.yml
.github/workflows/user-delight-autopilot.yml
config/user-delight-autopilot.json
```

## What the fixed generator does

- The homepage demo rail is inserted **inside the main product content before the first footer**.
- Demo pages are visible even if JavaScript is slow or disabled.
- `demo-lab.html` contains an immediately visible proof console, launch button, scenario gallery, and deliverables section.
- The demo proof cycle advances from 0 to 100 and highlights the six acceptance gates.
- The public site remains no-user-data: no forms, uploads, cookies, analytics, wallet connection, or payment path.
- The verifier blocks regressions where the demo rail appears below footer/legal links again.

## GitHub Web UI steps

1. Open the repository: `MontrealAI/goalos-signoff-pro`.
2. Replace the files listed above.
3. Commit to `main` with:

```text
Fix user delight demo composition
```

4. Run:

```text
Actions → Website quality gate → Run workflow → main
```

5. Run:

```text
Actions → User Delight Demo Autopilot → Run workflow → main
```

6. Run:

```text
Actions → Deploy GoalOS Signoff Pro production site → Run workflow → main
```

## Verify production

Open:

```text
https://montrealai.github.io/goalos-signoff-pro/
https://montrealai.github.io/goalos-signoff-pro/demo-lab.html
https://montrealai.github.io/goalos-signoff-pro/evidence-docket-lab.html
https://montrealai.github.io/goalos-signoff-pro/receipt-verifier-demo.html
https://montrealai.github.io/goalos-signoff-pro/autonomous-demo.html
```

Expected result:

- homepage demo rail appears above footer/privacy/legal navigation;
- demo lab has visible content immediately below the navigation;
- Launch proof cycle works;
- no page appears blank;
- public-site protections remain intact.
