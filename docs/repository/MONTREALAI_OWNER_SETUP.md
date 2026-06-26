# MontrealAI CODEOWNERS Setup

This package is preconfigured for a repository owned by `MontrealAI`.

## Current setting

```text
.github/CODEOWNERS → @MontrealAI
MAINTAINERS.md → @MontrealAI
```

## What to confirm before branch protection

1. Open `.github/CODEOWNERS` in GitHub.
2. Confirm GitHub does not show CODEOWNERS syntax warnings.
3. Confirm `@MontrealAI` has write access to the repository.
4. Only then enable **Require review from Code Owners**.

## If MontrealAI later creates teams

If the repository is owned by a GitHub organization and visible teams exist, you may replace `@MontrealAI` with teams such as:

```text
@MontrealAI/product
@MontrealAI/engineering
@MontrealAI/security
@MontrealAI/docs
```

Those teams must exist, be visible, and have write access before they are used in CODEOWNERS.
