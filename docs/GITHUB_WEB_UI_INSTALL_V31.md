# GitHub Web UI Install — v31

## Install without terminal

1. Unzip the v31 package locally.
2. Open the unzipped folder.
3. In GitHub, open the root of `MontrealAI/goalos-signoff-pro`.
4. Click **Add file → Upload files**.
5. Drag the contents of the unzipped folder into the upload area.
6. Include `.github`.
7. Commit to a new branch.
8. Open a pull request.
9. Run the workflow:

```text
Actions → GoalOS Signoff Pro — Executive AI Proof Console v31
```

Recommended workflow settings:

```text
commit_generated_site: true
deploy_pages: true
```

## Hidden `.github` folder

On macOS, press:

```text
Command + Shift + .
```

On Windows, enable:

```text
View → Show → Hidden items
```

## Expected live routes

After deployment:

```text
https://montrealai.github.io/goalos-signoff-pro/executive-ai-proof-console.html
https://montrealai.github.io/goalos-signoff-pro/console.html
https://montrealai.github.io/goalos-signoff-pro/ai-proof-console.html
```
