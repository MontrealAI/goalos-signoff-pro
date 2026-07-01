# GitHub Web UI Install Steps for Non-Technical Maintainers

1. Download the ZIP package or repository ZIP.
2. Unzip it on your computer.
3. Open the unzipped folder. Upload the contents inside the folder, not the outside wrapper folder.
4. Make sure hidden files are visible so the hidden `.github` folder is included.
5. In GitHub, choose **Add file → Upload files** at the repository root.
6. Drag all contents into GitHub.
7. Commit to a new branch.
8. Open **Actions** and run **GoalOS Signoff Pro — Complete v22-v35 Repair and Publish**.
9. Keep `commit_generated_site` enabled if you want generated files committed. Keep `deploy_pages` enabled if you want GitHub Pages updated.
10. After the workflow finishes, open the Pages URL and verify `/goalos-signoff-pro/goalos-v22-v35-command-center.html`.

Do not paste secrets, customer data, personal data, wallet keys, or private configuration into the public repository.
