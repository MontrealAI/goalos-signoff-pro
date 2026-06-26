# GitHub Upload Guide for MontrealAI

This guide turns the GoalOS Signoff Pro package into its own GitHub repository under the `MontrealAI` GitHub account.

## Recommended repository name

```text
goalos-signoff-pro
```

Start private. You can make it public later after the first green CI run, a secret review, and a private-beta readiness review.

## Option A — easiest: GitHub Desktop

1. Sign in to GitHub as the MontrealAI account or an account that can create repositories under MontrealAI.
2. Open GitHub in your browser.
3. Click the `+` button in the top-right corner.
4. Click **New repository**.
5. Owner: `MontrealAI`.
6. Repository name: `goalos-signoff-pro`.
7. Visibility: **Private** for first setup.
8. Click **Create repository**.
9. Click **Set up in Desktop** or clone it from GitHub Desktop.
10. Open the cloned folder on your computer.
11. Copy every file and folder from this package into that cloned folder.
12. Return to GitHub Desktop.
13. You should see many changed files.
14. Commit message:

```text
Initial GoalOS Signoff Pro repository
```

15. Click **Commit to main**.
16. Click **Push origin**.
17. Open the repository on GitHub and confirm the files are visible.

## Option B — browser upload

This can work, but GitHub Desktop is safer because this package includes hidden folders such as `.github`.

1. Create the repository under `MontrealAI`.
2. Click **Add file**.
3. Click **Upload files**.
4. Drag the unzipped files and folders into the page.
5. Commit with:

```text
Initial GoalOS Signoff Pro repository
```

6. Confirm `.github/workflows/ci.yml`, `.github/workflows/repository-readiness.yml`, and `.github/CODEOWNERS` are present.

## After upload

1. Open the **Actions** tab.
2. Wait for the CI and repository-readiness workflows.
3. A green check means the repository package loaded correctly.
4. A red result means open the failed job and share the logs with a developer.

## MontrealAI ownership is already configured

This package is preconfigured for `@MontrealAI`.

The active file is:

```text
.github/CODEOWNERS
```

It already points to:

```text
@MontrealAI
```

Do not run owner-neutral setup unless the repository is later moved or MontrealAI creates more specific teams. If needed later:

```bash
npm run repo:owner -- --owner @MontrealAI
```

or, for future team-based ownership:

```bash
npm run repo:owner -- --owner @MontrealAI/product --engineering @MontrealAI/engineering --security @MontrealAI/security
```

Only use team names that actually exist and have repository write access.

## Do not upload

Never upload:

```text
.env
.env.local
.env.production
Supabase service-role key
Stripe live secret key
Wallet private key
Seed phrase
Mnemonic
Mainnet deployer key
node_modules/
.next/
```

The repository includes `.gitignore` and package checks to help prevent these mistakes, but manual caution is still required.

## MontrealAI CODEOWNERS confirmation

This package is preconfigured with `@MontrealAI` in `.github/CODEOWNERS`. Do not run owner setup commands. Before enabling required CODEOWNER review, confirm `@MontrealAI` has write access and GitHub shows no CODEOWNERS syntax warnings.
