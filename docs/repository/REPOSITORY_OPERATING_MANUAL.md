# Repository Operating Manual

## Weekly owner routine

1. Check open pull requests.
2. Check Dependabot alerts.
3. Check failed workflow runs.
4. Confirm no secrets were committed.
5. Review open issues tagged `pilot-feedback`.
6. Record customer learnings in the pilot tracker.

## Release routine

1. Create a release branch.
2. Confirm `npm run check` passes locally or in CI.
3. Confirm `npm run package:verify` passes.
4. Update `CHANGELOG.md`.
5. Tag the release.
6. Attach the release notes.
7. Deploy only after the release checklist passes.

## Incident routine

1. Stop deployment if active.
2. Preserve logs.
3. Rotate any exposed secret.
4. Open a private incident issue.
5. Notify affected users if data may be exposed.
6. Write a short post-incident report.

## Mainnet and token boundary

This repository must not be used to launch Mainnet escrow or AGIALPHA staking without a new security review, external audit, and explicit governance decision.
