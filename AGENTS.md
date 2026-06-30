# AGENTS.md — GoalOS Signoff Pro

## Project identity

GoalOS Signoff Pro is the human acceptance and signed-receipt layer for AI work. The repository contains a private-beta/SaaS acceptance workspace scaffold, public browser-local demos, proof-lab artifacts, optional receipt anchoring examples, and documentation for safe institutional review.

## Public-safe invariants

- No public wallet connection, token approval, network switching, transaction broadcast, custody, escrow release, value movement, payment, or token sale.
- No analytics, cookies, tracking pixels, external scripts, secrets, API keys, user uploads, public form intake, personal data, customer data, confidential data, or regulated data on public demo pages.
- Public demos are browser-local, public-safe, and claim-bounded.
- Settlement-readiness pages are simulated/read-only unless explicitly separated as expert-only and human-authority gated.

## Claim-boundary rules

- No Evidence Docket, no strong public claim.
- No ProofBundle, no settlement signal.
- No replay, no settlement.
- Do not claim completed AGI or ASI, empirical SOTA, production certification, external audit completion, guaranteed ROI, legal advice, financial advice, tax advice, investment advice, autonomous sovereignty, or safe autonomy proven.
- AGIALPHA references are identity/protocol-boundary references only unless an explicit boundary document says otherwise.

## Documentation style rules

- Use clear identity, 30-second explanation, best first clicks, what-this-is / what-this-is-not, proof lifecycle, local verification, public-safe boundaries, route catalog, glossary, FAQ, and release checklist sections where appropriate.
- Prefer relative links for repository files and absolute links for production websites.
- Keep historical install guides; curate them through `docs/INDEX.md` instead of deleting them.

## HTML/CSS accessibility rules

- Use semantic headings, readable link text, visible focus states, accessible contrast, responsive cards, and no keyboard traps.
- Respect `prefers-reduced-motion` when adding animation.
- Do not add dependency-heavy redesigns or remote assets unless already justified by repository convention.

## Workflow and build rules

- If a public page is generated, edit the source builder/generator first and regenerate derived files.
- Keep `site/` static and GitHub Pages-compatible under `/goalos-signoff-pro/`.
- Do not introduce npm dependencies unless unavoidable and documented.

## Security rules

- Never commit secrets, API keys, customer data, personal data, or live private configuration.
- Treat optional anchoring/blockchain examples as separate from public no-wallet demos.
- Keep public verifiers browser-local and sample-data oriented unless explicitly documented otherwise.

## How to run tests

```bash
node --version
npm --version
npm ci
npm run typecheck
npm run lint
npm run test
npm run build
npm run repo:verify
npm run repo:all
npm run package:verify
npm run pro:verify
npm run hybrid:anchor:check
node scripts/verify-goalos-production-site.mjs
node scripts/verify-goalos-signoff-public-labs-v22-v27.mjs
git diff --check
```

## How to update route manifests

- Update the relevant `config/*.json`, builder, generator, or manifest source.
- Regenerate with the corresponding `scripts/build-*.mjs` or workflow script.
- Verify all generated routes and aliases remain reachable.

## Review guidelines

- Treat broken public routes, broken docs links, or misleading badges as P1.
- Treat any new wallet connection, token approval, transaction broadcast, payment, upload, analytics, cookie, or user-data collection on public demo pages as P1 unless explicitly isolated in an expert-only gated surface and documented.
- Treat unsupported AGI/ASI, SOTA, production certification, external audit, ROI, legal/financial/tax advice, or live settlement claims as P1.
- Treat missing public-safe boundary copy on new demo pages as P1.
- Treat accessibility regressions on public pages as P1.
- Treat failing verification scripts as P1 unless clearly documented as environment/secret-dependent.
