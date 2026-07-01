# GitHub Web UI Guide

1. Download the repository ZIP or upgrade package.
2. Unzip it locally.
3. Upload the contents of the unzipped folder, not the outer folder.
4. Include hidden folders such as `.github/`.
5. Commit to a branch, preferably `codex/supreme-v35-institutional-website-repository-upgrade`.
6. Run `.github/workflows/goalos-signoff-v22-v35-complete-repair-and-publish.yml`.
7. Use workflow inputs `commit_generated_site: true` and `deploy_pages: true` when you want the workflow to commit generated files and deploy Pages.
8. Check `site/goalos-v22-v35-command-center.html` after deployment.

If a workflow reports a missing script, upload the full package contents again and make sure `scripts/*.mjs` files were included.
