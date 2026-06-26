# Contributing

GoalOS Signoff Pro uses a simple, review-first workflow.

## Ground rules

- Create a branch for every change.
- Open a pull request.
- Wait for CI to pass.
- Request review from the relevant CODEOWNER.
- Do not commit secrets or private customer data.
- Keep Mainnet, AGIALPHA staking, escrow, and custody features behind explicit roadmap gates.

## Local checks

```bash
npm ci
npm run check
npm run package:verify
```

Optional blockchain checks:

```bash
npm --prefix blockchain ci
npm --prefix blockchain run package:verify
npm --prefix blockchain run test
```

## Pull request standard

A good pull request includes:

- what changed,
- why it changed,
- screenshots for UI changes,
- migration notes for database changes,
- security notes for auth/storage/receipt changes,
- rollback notes if relevant.
