# v30 Validation Gate

The v30 package is valid when:

- `proof-before-settlement-research-lab.html` exists.
- All alias routes exist.
- The elite PDF and LaTeX assets are copied into `site/research/proof-before-settlement/`.
- The v30 manifest is valid JSON.
- The global v22-v30 manifest includes v28, v29, and v30.
- The homepage spotlight says `Blockchain proves the transaction. GoalOS proves the work.`
- No public route contains forms, inputs, uploads, wallet connection code, cookies, analytics, payments, or personal/confidential-data capture.

Run:

```bash
node scripts/build-goalos-signoff-pro-institutional-v22-v30.mjs
node scripts/verify-proof-before-settlement-research-lab-page.mjs
node scripts/verify-goalos-signoff-public-labs-v22-v30.mjs
```
