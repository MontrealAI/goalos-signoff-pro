# Developer Build and Verify

## Install

```bash
npm ci
```

## Build and checks

```bash
npm run lint
npm run typecheck
npm run test
npm run build
npm run site:build:public-labs
npm run site:verify:workflows
npm run site:verify:routes
npm run site:verify:public-labs
npm run site:verify:all
```

## Workflow/script coupling

Every workflow reference to `node scripts/*.mjs` must point to a committed file. Run `npm run site:verify:workflows` before opening a PR.

## Public route coupling

Every flagship route and alias must exist under `site/`, and JSON manifests must be regenerated. Run `npm run site:verify:routes`.
