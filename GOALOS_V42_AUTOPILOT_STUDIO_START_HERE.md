# GoalOS Signoff Pro — Universal Outcome Autopilot Studio v42

Use this package when you want the website to provide one simple command box:

> Tell GoalOS what you want.

GoalOS then produces a mission plan, acceptance criteria, evidence checklist, reviewer route, 48-contract rail map, recommended next page, and synthetic Mission Receipt.

## GitHub Web UI install

1. Download and unzip the package.
2. Open the unzipped folder.
3. In GitHub, open the root of `MontrealAI/goalos-signoff-pro`.
4. Click **Add file → Upload files**.
5. Drag the **contents inside** this folder into GitHub.
6. Make sure `.github/`, `scripts/`, `config/`, `site/`, `serverless/`, `docs/`, and `verification/` are included.
7. Commit to a new branch.
8. Run **Actions → GoalOS Signoff Pro — Universal Outcome Autopilot Studio v42**.

Recommended workflow settings:

```text
commit_generated_site: true
deploy_pages: true
deploy_timeout_ms: 3600000
```

Best route after deployment:

```text
https://montrealai.github.io/goalos-signoff-pro/goalos-autopilot-studio.html
```

## Public-safe default

The command box is processed locally in the browser. By default there are no uploads, cookies, analytics, wallet connections, payments, external AI calls, personal/confidential data requirements, or value movement.

A server-side live AI endpoint can be added later using `serverless/goalos-v42-autopilot-worker.example.js`, but do not put provider API keys in browser JavaScript.
