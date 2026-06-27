# Zero-Data Legal Shield Install Guide

Add these files to the existing `MontrealAI/goalos-signoff-pro` repository after the User Activation Layer package:

- `config/legal-zero-data-posture.json`
- `scripts/build-legal-zero-data-pages.mjs`
- `scripts/verify-legal-zero-data-posture.mjs`
- `.github/workflows/legal-zero-data.yml`
- replacement `.github/workflows/pages.yml`
- updated `.github/workflows/website-quality.yml`
- `LEGAL.md`
- `docs/LEGAL_POSTURE.md`
- `docs/NO_USER_DATA_POLICY.md`
- `docs/PRIVACY_BY_DESIGN.md`
- `docs/TERMS_OF_USE_TEMPLATE.md`
- `docs/ACCEPTABLE_USE_POLICY.md`
- `docs/REGULATED_DATA_PLAYBOOK.md`
- `docs/INVESTMENT_TOKEN_BOUNDARY.md`
- `docs/DPA_NOT_OFFERED_BY_DEFAULT.md`
- `docs/LEGAL_RELEASE_CHECKLIST.md`

Run:

1. `Actions → Legal zero-data posture gate → Run workflow → main`
2. `Actions → Website quality gate → Run workflow → main`
3. `Actions → Deploy GoalOS Signoff Pro production site → Run workflow → main`

Inspect:

- `/no-user-data.html`
- `/privacy.html`
- `/terms.html`
- `/legal.html`
- `/data-policy.html`
- `/acceptable-use.html`
- `/investment-boundary.html`
- `/cookie-policy.html`
- `/subprocessors.html`
- `/security-boundary.html`

The public site should clearly communicate and implement: no forms, no uploads, no cookies, no analytics, no wallet connection, no payment collection, and no personal/confidential/regulated data intake.
