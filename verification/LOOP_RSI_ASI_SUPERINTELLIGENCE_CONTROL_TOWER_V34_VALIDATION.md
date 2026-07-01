# v34 validation

Expected local checks:

```bash
node scripts/build-goalos-signoff-public-labs-v22-v34.mjs
node scripts/verify-loop-rsi-asi-superintelligence-control-tower-v34.mjs
```

The verifier checks:

- all v34 routes exist;
- CSS and JS assets exist;
- public JSON artifacts exist;
- mandatory boundary phrases appear;
- no forms, text inputs, textareas, external network calls, cookie writes, or localStorage writes appear in the v34 public HTML/JS.
