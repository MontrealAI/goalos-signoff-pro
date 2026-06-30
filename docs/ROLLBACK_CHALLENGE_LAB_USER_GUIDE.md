# Rollback & Challenge Window Lab — user guide

Open `rollback-challenge-lab.html`, then click **Run challenge window**.

The browser demonstrates four synthetic candidates:

- C0 is blocked because it has no rollback target or replay path.
- C1 is rolled back because the challenge window finds a claim-boundary contradiction.
- C2 is held because the canary monitor detects delayed risk.
- C3 reaches simulation release-readiness because proof, evaluation, rollback, canary, scope, challenge, and human-gate conditions clear.

The lab shows why GoalOS is not merely a proof viewer. It is a release-control system: unsupported output cannot become institutional authority, and failure becomes a reusable warning rather than trusted memory.

No user data is requested or collected.
