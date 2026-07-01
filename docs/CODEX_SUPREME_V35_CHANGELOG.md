# Codex Supreme v35 Changelog

## 2026-07-01 — Supreme v35 institutional upgrade

### Website

- Regenerated the v22-v35 public suite from committed source builders.
- Updated the v22-v35 command-center generator so the command center is the obvious first stop and the synthetic receipt is static/sample-data only.
- Reframed v22-v27 as the first chapter of the complete v22-v35 suite rather than the whole suite.
- Preserved all flagship routes, required aliases, and historical bridge routes (`all-labs.html`, `labs.html`, `docs.html`, `documentation.html`, `route-catalog.html`) through the v22-v35 generator.

### Documentation

- Added the Supreme v35 audit and changelog.
- Added current guides for the command center, website, public labs, GitHub Web UI path, workflows/verification, public-safe boundary, claim boundary, route catalog, and RSI/ASI-readiness boundary.
- Added root GitHub Web UI upload/install instructions.

### Workflows and scripts

- Verified workflow references to `node scripts/*.mjs` with the repository verifier.
- Kept the canonical v22-v35 complete repair/publish workflow as the one-go path.
- Rebuilt the committed `site/` output through the v22-v35 source builder and made preservation-sensitive legacy routes deterministic generator outputs when the production rebuild prunes old compatibility files.

### Removals

No files were removed in this pass.
