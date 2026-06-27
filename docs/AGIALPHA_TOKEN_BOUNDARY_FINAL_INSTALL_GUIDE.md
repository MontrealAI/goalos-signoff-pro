# GoalOS Signoff Pro — AGIALPHA External Token Boundary v1.2 Final

This hotfix resolves the current GitHub Actions failure:

```text
Secret-like marker found: seed phrase
```

That was a false positive caused by protective legal/no-user-data language such as "do not send wallet recovery material." The v1.2 verifier still blocks real secret patterns, but it no longer treats ordinary safety-warning words as leaked credentials.

## What this final package enforces

- `$AGIALPHA` is referenced as an external Ethereum Mainnet token at `0xA61a3B3a130a9c20768EEBF97E21515A6046a1fA`.
- GoalOS, MontrealAI, and QuebecAI do not sell, issue, broker, custody, distribute, redeem, stake, or make it available.
- The public site provides no investment, financial, trading, tax, custody, brokerage, or legal advice.
- Public pages may warn users not to send sensitive materials.
- Actual secrets remain blocked: private-key assignments, PEM private keys, live API keys, GitHub tokens, service-role key assignments, and forbidden contact email drift.

## Install through GitHub Web UI

Replace or create these files:

```text
config/agialpha-token-boundary.json
scripts/build-agialpha-token-boundary-pages.mjs
scripts/verify-agialpha-token-boundary.mjs
scripts/verify-public-artifact-safety.mjs
.github/workflows/agialpha-token-boundary.yml
.github/workflows/pages.yml
```

Commit message:

```text
Fix AGIALPHA external token boundary gate
```

Then run:

```text
Actions → AGIALPHA external token boundary gate → Run workflow → main
```

Expected result:

```text
AGIALPHA external token boundary gate: PASS
GoalOS public artifact safety gate: PASS
```

Then run:

```text
Actions → Deploy GoalOS Signoff Pro production site → Run workflow → main
```

Expected result:

```text
Build and verify public production site    PASS
Deploy to GitHub Pages                     PASS
```

Verify:

```text
https://montrealai.github.io/goalos-signoff-pro/agialpha.html
https://montrealai.github.io/goalos-signoff-pro/agialpha-token-boundary.html
https://montrealai.github.io/goalos-signoff-pro/agialpha-token-manifest.json
```
