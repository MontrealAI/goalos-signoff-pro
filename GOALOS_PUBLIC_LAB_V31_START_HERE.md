# GoalOS Signoff Pro v31 — Start Here

## Executive AI Proof Console & Guided Website Experience Lab

This package adds the visitor-first experience layer the public site still needs after v28, v29, and v30.

It does **not** remove existing pages. It adds a guided, interactive, public-safe console that helps first-time visitors understand GoalOS quickly:

> Blockchain proves the transaction. GoalOS proves the work.  
> No Proof. No Trust. No Settlement.

## What it adds

- `executive-ai-proof-console.html` — flagship guided console.
- `console.html`, `ai-proof-console.html`, `interactive-proof-console.html`, and other easy aliases.
- Role-based proof scenarios for DAO delegates, founders, auditors, investors, enterprises, and AI-agent operators.
- Dynamic proof gates using buttons and preloaded synthetic scenarios.
- A homepage spotlight section.
- A floating “Guided console” affordance across public HTML pages.
- A v22-v31 manifest.
- Public-safe machine-readable artifacts.
- GitHub Actions for one-click build, verification, commit, and Pages deployment.

## Public-safe boundary

The console is dynamic and AI-styled, but it does not use a model API or collect data.

It includes:

- no forms;
- no text inputs;
- no uploads;
- no cookies;
- no analytics;
- no wallet connection;
- no payments;
- no personal or confidential data;
- zero value moved.

## Best GitHub Web UI path

1. Download and unzip the package.
2. Open the unzipped folder.
3. Go to the root of `MontrealAI/goalos-signoff-pro` on GitHub.
4. Click **Add file → Upload files**.
5. Drag the **contents inside** the unzipped folder into GitHub.
6. Make sure the hidden `.github` folder is included.
7. Commit to a new branch.
8. Run **Actions → GoalOS Signoff Pro — Executive AI Proof Console v31**.
9. Use:

```text
commit_generated_site: true
deploy_pages: true
```

## Commit message

```text
Add GoalOS Executive AI Proof Console v31
```

## Branch name

```text
add-goalos-signoff-v31-executive-ai-proof-console
```
