# AGENTS.md — GoalOS Signoff Pro

## Repository overview

GoalOS Signoff Pro is the human acceptance and signed-receipt layer for AI work. It contains a private-beta/SaaS acceptance workspace scaffold, public browser-local demos, proof-lab artifacts, optional receipt anchoring examples, and documentation for safe institutional review. The public suite currently runs from **v22 through v35**; v35 is the latest public-safe mission simulator.

## Public-safe non-negotiables

- No public wallet connection, token approval, network switching, transaction broadcast, custody, escrow release, value movement, payment, or token sale.
- No analytics, cookies, tracking pixels, external scripts, secrets, API keys, user uploads, public form intake, personal data, customer data, confidential data, or regulated data on public demo pages.
- Public demos are browser-local, deterministic, sample-data oriented, and claim-bounded.
- Settlement-readiness pages are simulated/read-only unless explicitly separated as expert-only and human-authority gated.

## Claim-boundary rules

- No Evidence Docket, no strong public claim.
- No ProofBundle, no settlement signal.
- No replay, no settlement.
- Do not claim realized AGI or ASI, empirical SOTA, production RSI, production certification, external audit completion, guaranteed ROI, legal advice, financial advice, tax advice, investment advice, autonomous deployment authority, or safe autonomy proven.
- Use “ASI-readiness gates,” “public-safe deterministic demonstration,” “synthetic receipt,” and “governance console” for v32-v35.
- AGIALPHA references are identity/protocol-boundary references only unless an explicit boundary document says otherwise.

## Static site generation rules

- If a public page is generated, edit the source builder/generator first and regenerate derived files.
- Keep `site/` static and GitHub Pages-compatible under `/goalos-signoff-pro/`.
- Do not introduce npm dependencies unless unavoidable and documented.
- Prefer relative links for repository files and absolute links for production websites.
- Keep historical install guides; curate them through `docs/INDEX.md` instead of deleting them.

## v22-v35 preservation rules

- Preserve every flagship v22-v35 lab route and manifest.
- The command center canonical route is `site/goalos-v22-v35-command-center.html`.
- Required aliases: `site/start-here.html`, `site/latest.html`, `site/command-center.html`, `site/experience.html`, `site/demo.html`, `site/proof-to-superintelligence.html`, `site/governed-superintelligence.html`, and `site/v22-v35.html`.
- Do not remove existing labs, docs, workflows, artifacts, or routes unless there is a clear technical conflict, legal/safety issue, duplicate generated artifact that must be consolidated, or broken/stale file replaced with a better equivalent. Explain any removal in the PR.

## Script/workflow coupling rules

- If a workflow references `node scripts/*.mjs`, that script must exist and be verified.
- Run `npm run site:verify:workflows` before committing workflow changes.
- Run `npm run site:verify:routes` after changing public routes, aliases, manifests, or flagship pages.
- The canonical one-go workflow is `.github/workflows/goalos-signoff-v22-v35-complete-repair-and-publish.yml`.

## Documentation update requirements

- README, docs index, command center guide, GitHub Web UI guide, and claim boundary must mention v22-v35 and v35 latest when public suite references change.
- Public docs must remain non-legal-advice, non-financial-advice, and non-investment-advice.
- Mermaid diagrams must be valid on GitHub.

## HTML/CSS accessibility rules

- Use semantic headings, readable link text, visible focus states, accessible contrast, responsive cards, and no keyboard traps.
- Respect `prefers-reduced-motion` when adding animation.
- Avoid noisy gradients that harm readability and tiny text on mobile.

## Test commands

```bash
node --version
npm --version
npm ci
npm run typecheck
npm run lint
npm run test
npm run build
npm run site:verify:workflows
npm run site:build:public-labs
npm run site:verify:routes
npm run site:verify:public-labs
npm run site:verify:all
npm run repo:verify
npm run package:verify
npm run institutional:verify
git diff --check
```

## PR expectations

- Include an audit summary, website changes, docs/repository changes, GitHub Actions repairs, public-safe boundary confirmation, validation results, and route preview list/screenshots.
- Do not commit secrets, generated junk, local environment files, customer data, personal data, or live private configuration.

## Codex review guidelines

When reviewing or changing this repository, flag P0/P1 issues for missing workflow scripts, broken public routes, public pages that collect data, external scripts or analytics, wallet/payment functionality on public demo pages, AGI/ASI/production-RSI overclaims, accessibility regressions, stale v22-v35 version claims, or missing documentation for new public routes.
