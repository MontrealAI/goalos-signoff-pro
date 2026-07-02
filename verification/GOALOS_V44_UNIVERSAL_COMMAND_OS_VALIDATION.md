# v44 validation

Expected gates:

- `node scripts/build-goalos-signoff-public-labs-v22-v44.mjs`
- `node scripts/repair-goalos-v44-command-inputs-and-boundaries.mjs`
- `node scripts/verify-goalos-signoff-public-labs-v22-v44.mjs`
- `node scripts/verify-goalos-production-site.mjs`
- `node scripts/verify-public-artifact-safety.mjs`

The repair step is intentional: it converts legacy generated form controls into gate-safe command boxes and normalizes every HTML page to exactly one v12 legal rail and one footer.
