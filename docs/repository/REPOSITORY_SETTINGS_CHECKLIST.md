# Repository Settings Checklist for MontrealAI

Use this after the first successful upload to the MontrealAI-owned repository.

## 1. Basic repository settings

Recommended starting state:

```text
Owner: MontrealAI
Repository: goalos-signoff-pro
Visibility: Private
Default branch: main
Issues: enabled
Discussions: optional
Projects: optional
Wiki: disabled unless you explicitly use it
```

## 2. Actions permissions

Open:

```text
Settings → Actions → General
```

Recommended settings:

```text
Actions permissions: Allow GitHub Actions and reusable workflows
Workflow permissions: Read repository contents permission
Allow GitHub Actions to create and approve pull requests: Off by default
```

Turn write permissions on only for a specific workflow that truly needs it.

## 3. CODEOWNERS

The package is already configured for MontrealAI.

Confirm this file exists:

```text
.github/CODEOWNERS
```

Confirm it contains active entries for:

```text
@MontrealAI
```

Do not enable CODEOWNER-required branch protection until you confirm `@MontrealAI` has write access to the repository. If MontrealAI later creates teams, you may replace broad ownership with team entries such as:

```text
@MontrealAI/product
@MontrealAI/engineering
@MontrealAI/security
```

Only use real teams with repository write access.

## 4. Branch protection or ruleset

Protect `main` before real development.

Required rules:

```text
Require a pull request before merging
Require approvals: 1 or 2
Require review from Code Owners
Dismiss stale pull request approvals when new commits are pushed
Require status checks to pass
Require branches to be up to date before merging
Block force pushes
Block branch deletion
Do not allow bypass unless you have a documented emergency process
```

Required status checks:

```text
GoalOS Signoff CI / Type, lint, test, and production build
GoalOS Repository Readiness / Repository boundary and governance checks
```

## 5. Secrets

Do not add secrets until the repository is protected.

When needed, use:

```text
Settings → Secrets and variables → Actions
```

Use repository secrets only for ordinary CI/deployment. Use environment secrets for protected deployments.

Never commit secrets into the repository.

## 6. Dependabot

Dependabot is already configured in:

```text
.github/dependabot.yml
```

Review dependency pull requests like normal code changes. Do not auto-merge production dependency updates until CI is green.

## 7. Security features

Enable available GitHub security features:

```text
Dependabot alerts
Dependabot security updates
Secret scanning, if available on your plan
Code scanning, if you add CodeQL later
Private vulnerability reporting, if public
```

## 8. First merge policy

Until pilot launch, use this rule:

```text
No direct pushes to main.
Every change goes through a pull request.
Every pull request must have green CI.
Every security-sensitive pull request needs a second reviewer.
```

## 9. Product boundary

Keep these disabled during the first private beta:

```text
Mainnet anchoring
AGIALPHA staking
Escrow
Custody
Automated settlement
User-fund authorization
```
