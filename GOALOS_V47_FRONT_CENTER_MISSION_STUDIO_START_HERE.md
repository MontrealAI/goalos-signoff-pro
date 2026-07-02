# GoalOS Signoff Pro v47 — Front-Center Mission Studio

This package adds a separate front-and-center GoalOS command experience while preserving the existing website.

## Best route after deployment

`goalos-front-center.html`

The homepage is also updated to open with the command studio, while the previous homepage is preserved as `classic-home-before-v47.html`.

## User experience

A visitor types what they want in one large local command box. GoalOS produces:

- mission type;
- acceptance criteria;
- evidence checklist;
- reviewer path;
- 48-contract rail map;
- recommended page;
- synthetic Mission Receipt.

## Public-safe default

The command text is processed in the browser by default. No uploads, cookies, analytics, wallets, payments, external AI calls, personal/confidential data requirement, or value movement.

## GitHub Web UI install

1. Unzip this package.
2. Open the unzipped folder.
3. Drag the contents into the root of `MontrealAI/goalos-signoff-pro` using GitHub → Add file → Upload files.
4. Make sure `.github/`, `scripts/`, `config/`, `docs/`, `site/`, `serverless/`, and `verification/` are included.
5. Run **GoalOS Signoff Pro — Front-Center Mission Studio v47**.
6. Use `commit_generated_site: true` and `deploy_pages: true`.
