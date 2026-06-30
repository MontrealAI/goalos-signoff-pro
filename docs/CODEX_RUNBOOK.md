# Codex runbook

## Working rules

1. Read `AGENTS.md` before editing.
2. Preserve the public-safe posture: no public wallet, upload, payment, analytics, cookies, or user-data intake.
3. If a route is generated, edit the builder/generator first and regenerate the route.
4. Keep strong claims tied to Evidence Dockets, ProofBundles, replay, validation, and human authority.
5. Run the strongest available checks and record skipped checks with reasons.

## Commands

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

## Updating v22-v27 labs

Update `scripts/build-goalos-signoff-public-labs-v22-v27.mjs`, lab-specific builders/generators, and matching config/artifact manifests. Then regenerate and verify. Do not introduce external scripts or analytics.
