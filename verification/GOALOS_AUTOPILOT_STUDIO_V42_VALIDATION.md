# GoalOS Autopilot Studio v42 validation

Required checks:

- `node scripts/build-goalos-signoff-public-labs-v22-v42.mjs`
- `node scripts/verify-goalos-signoff-public-labs-v22-v42.mjs`

The verifier checks that the Autopilot page, command center, knowledge map, CSS, JavaScript, and manifest exist; that the page contains the requested plain-language command box; that at least 40 contract rails are indexed; and that the browser JS does not use cookies, localStorage persistence, or external AI calls by default.
