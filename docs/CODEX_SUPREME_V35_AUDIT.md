# Codex Supreme v35 Audit

- Branch: `work` (preferred PR branch requested: `codex/supreme-v35-institutional-website-repository-upgrade`).
- Commit audited: `87071dbce0f7e2fd17734fb308425b27ddfafc6a`.
- Audit date/time: 2026-07-01 UTC.
- Live-site network inspection: available. The live homepage at `https://montrealai.github.io/goalos-signoff-pro/` still exposed stale “Six new proof labs” v22-v27 framing near the public-suite section, while the command center route was live and readable through v35.

## Repository files inspected

Inspected root instructions and presentation (`AGENTS.md`, `README.md`, `package.json`, `.github/PULL_REQUEST_TEMPLATE.md`, issue templates), workflow files in `.github/workflows/`, scripts in `scripts/*.mjs`, public-site HTML/JSON in `site/`, configs in `config/*.json`, verification notes in `verification/`, artifacts in `artifacts/**/*.json`, and generated-source resilience material in `docs/generated-source/**`.

## Website pages inspected

`site/index.html`, `site/public-demo-labs.html`, `site/goalos-v22-v35-command-center.html`, aliases (`start-here.html`, `latest.html`, `command-center.html`, `experience.html`, `demo.html`, `proof-to-superintelligence.html`, `governed-superintelligence.html`, `v22-v35.html`), `site/website-guide.html`, `site/browser-beta.html`, `site/mission-001.html`, `site/mission-001-replay.html`, `site/verify.html`, `site/no-user-data.html`, v32-v35 pages, and public JSON catalogs/manifests.

## Current route inventory

- Canonical entry: `site/goalos-v22-v35-command-center.html`.
- Required aliases: present and regenerated from the command-center builder.
- Required flagship pages: present after `npm run site:build:v22-v35`.
- Machine-readable catalogs: `site/goalos-v22-v35-route-catalog.json`, `site/goalos-public-demo-labs-v22-v35.json`, and `site/goalos-signoff-pro-site-map-v22-v35.json`.

## v22-v35 coverage matrix

| Version | Primary route | Status |
| --- | --- | --- |
| v22 | `action-graph-authority-lab.html` | Present |
| v23 | `proof-carrying-artifact-lab.html` | Present |
| v24 | `independent-replay-lab.html` | Present |
| v25 | `proofzero-planning-lab.html` | Present |
| v26 | `mission-foundry-lab.html` | Present |
| v27 | `process-evidence-lab.html` | Present |
| v28 | `blockchain-credibility-lab.html` | Present |
| v29 | `blockchain-proof-mandate-lab.html` | Present |
| v30 | `proof-before-settlement-research-lab.html` | Present |
| v31 | `executive-ai-proof-console.html` | Present |
| v32 | `from-loop-to-rsi-lab.html` | Present |
| v33 | `loop-rsi-asi-superintelligence-lab.html` | Present |
| v34 | `loop-rsi-asi-superintelligence-control-tower-lab.html` | Present |
| v35 | `loop-rsi-asi-superintelligence-mission-simulator-lab.html` | Present/latest |

## Stale version references and action taken

- Live homepage and generated `public-demo-labs.html` contained v22-v27-only copy. The v22-v35 enhancer now rewrites stale “six proof labs” homepage phrasing and regenerates `public-demo-labs.html` as a complete v22-v35 hub.
- Historical docs and validation reports still mention older suite cuts (`v22-v27`, `v22-v30`, etc.) where they are explicitly archival; these were preserved rather than deleted.

## Workflow-to-script dependency map

`npm run site:verify:workflows` verifies every workflow `node scripts/*.mjs` reference. Required v35 scripts exist: `verify-workflow-script-references.mjs`, `check-site-route-integrity.mjs`, `verify-goalos-public-safe.mjs`, `verify-goalos-signoff-public-labs-v22-v35.mjs`, `repair-goalos-v22-v35-html-integrity.mjs`, `verify-goalos-v22-v35-ultimate-public-experience.mjs`, and `verify-public-artifact-safety.mjs`.

## Package-script dependency map

`package.json` includes `site:build:v22-v35`, `site:verify:v22-v35`, `site:verify:public-safe`, `site:verify:routes`, `site:verify:workflows`, `site:verify:links`, `site:verify:all`, and `site:all`. These point to committed scripts and passed focused verification during this audit.

## Build/generation resilience review

The canonical `scripts/build-goalos-signoff-public-labs-v22-v35.mjs` regenerates v22-v35 in order and then applies the institutional command-center layer. The final enhancer now also regenerates the complete demo hub, so production rebuilds no longer leave that hub stranded at v22-v27 framing.

## Link, boundary, claim, accessibility, and metadata findings

- Broken/suspicious internal links: focused route/link verification passed.
- Public-safe boundary gaps: public-safe verifier passed for site HTML/JS.
- Claim-boundary risks: artifact safety gate passed with advisory legal warnings allowed for boundary disclaimers.
- Pages missing next-step CTAs: command center and hub now make the next click explicit.
- Accessibility/mobile: command-center and hub controls are button/link based, responsive, and keep visible focus from browser defaults plus high-contrast cards; deeper page-by-page manual screen-reader testing remains follow-up.
- SEO/social metadata: command center and hub include titles/descriptions; broader OG/Twitter coverage can be expanded later.

## Actions taken

1. Regenerated v22-v35 public labs.
2. Updated the final v22-v35 enhancer so generated homepage copy is normalized away from stale six-lab framing.
3. Rebuilt `site/public-demo-labs.html`/`site/goalos-public-demo-labs.html` as a chaptered v22-v35 hub from the shared lab matrix.
4. Corrected README workflow-script naming and added the ultimate-experience integrity workflow badge.
5. Recorded this concrete audit and changelog update.

## Validation commands run and results

- `npm run site:build:v22-v35` — PASS.
- `npm run site:verify:v22-v35` — PASS.
- `npm run site:verify:routes` — PASS.
- `npm run site:verify:public-safe` — PASS.
- `npm run site:verify:links` — PASS.

## Known follow-up work

- Full manual visual QA on deployed GitHub Pages after merge.
- Optional OG/Twitter metadata expansion across every historical lab page.
- Optional screenshot artifact capture from a browser runner in CI.
