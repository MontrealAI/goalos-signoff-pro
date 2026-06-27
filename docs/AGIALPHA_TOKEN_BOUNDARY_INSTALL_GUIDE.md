# Install AGIALPHA External Token Boundary v1.1

Add this package to the existing repository:

```text
MontrealAI/goalos-signoff-pro
```

Do not create a new repository.

## Files to add or replace

```text
config/agialpha-token-boundary.json
scripts/build-agialpha-token-boundary-pages.mjs
scripts/verify-agialpha-token-boundary.mjs
docs/AGIALPHA_EXTERNAL_TOKEN_BOUNDARY.md
.github/workflows/agialpha-token-boundary.yml
.github/workflows/pages.yml
```

## GitHub Web UI steps

1. Add `config/agialpha-token-boundary.json`.
2. Add the two scripts under `scripts/`.
3. Add `docs/AGIALPHA_EXTERNAL_TOKEN_BOUNDARY.md`.
4. Add `.github/workflows/agialpha-token-boundary.yml`.
5. Replace `.github/workflows/pages.yml` with the package version.
6. Run `Actions → AGIALPHA external token boundary gate → Run workflow → main`.
7. Run `Actions → Deploy GoalOS Signoff Pro production site → Run workflow → main`.

## Verify after deploy

Open:

```text
https://montrealai.github.io/goalos-signoff-pro/agialpha.html
https://montrealai.github.io/goalos-signoff-pro/agialpha-token-boundary.html
https://montrealai.github.io/goalos-signoff-pro/agialpha-token-manifest.json
```
