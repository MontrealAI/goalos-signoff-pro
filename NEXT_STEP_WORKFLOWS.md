# Next step: add workflows manually

The repository package was imported successfully, excluding `.github/workflows/**`.

GitHub blocks GitHub Actions' own bot token from creating or updating workflow files unless that token has the special `workflows` permission. This is why the earlier import failed.

Add CI workflows manually through the GitHub web UI or GitHub Desktop after this import commit succeeds.
