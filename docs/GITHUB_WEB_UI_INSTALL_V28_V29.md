# GitHub Web UI Install — v28/v29 Institutional Website Update

## 1. Download and unzip

Download the ZIP package and unzip it on your computer.

## 2. Open the repository root

Go to `https://github.com/MontrealAI/goalos-signoff-pro`.

## 3. Upload the contents

Click **Add file → Upload files** and drag the **contents inside** the unzipped folder. Do not upload the ZIP file itself.

Make sure the hidden `.github` folder is included.

macOS: press `Command + Shift + .` to show hidden folders.

Windows: enable **View → Show → Hidden items**.

## 4. Commit safely

Commit message:

```text
Update GoalOS Signoff Pro institutional website v22-v29
```

Recommended: create a new branch and pull request.

Branch name:

```text
update-goalos-signoff-pro-v22-v29-institutional-site
```

## 5. Run the action

Open **Actions → GoalOS Signoff Pro — Institutional Website v22-v29 → Run workflow**.

Recommended settings:

```text
commit_generated_site: true
deploy_pages: true
```

## 6. Check live routes

After deployment, check:

```text
/blockchain-proof-mandate-lab.html
/blockchain-credibility-lab.html
/public-demo-labs.html
/proof-package.html
/blockchain.html
```
