# Workflows and Verification

Canonical one-go workflow: `.github/workflows/goalos-signoff-v22-v35-complete-repair-and-publish.yml`.

Core commands:

```bash
npm ci
npm run site:verify:workflows
npm run site:build:v22-v35
npm run site:verify:v22-v35
npm run site:verify:routes
npm run site:verify:public-safe
npm run site:verify:links
npm run site:verify:all
```

The workflow/script verifier ensures every `node scripts/*.mjs` reference in workflows points to a committed script.
