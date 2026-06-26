# Operations runbook

## Daily during a pilot

- Check Vercel deployment and function errors.
- Check Supabase Auth, database, and storage health.
- Respond to failed invitations and receipt issuance errors.
- Confirm no server secret appears in logs or support messages.

## Weekly

- Review storage growth and stale upload intents.
- Review audit events for unexpected activity.
- Test one magic-link login and receipt verification.
- Review dependency alerts.
- Export or validate a backup according to policy.
- Review user feedback and unresolved support cases.

## Monthly

- Rehearse recovery from a database backup.
- Review all active team and provider accounts.
- Remove unnecessary access.
- Review signing-key policy and incident log.
- Reassess file retention and deletion.
- Run `npm run check` on the current source.

## Safe deployment process

1. Make changes in a branch.
2. Let CI run typecheck, lint, tests, and build.
3. Review changes to database SQL, authentication, storage, API routes, and environment handling carefully.
4. Test in a preview environment using non-sensitive data.
5. Merge only after review.
6. Verify the production deployment and one critical user flow.

## Signing-key rotation

1. Generate a new pair with the offline tool or `npm run setup:keys -- --force`.
2. Record the new public-key fingerprint and key ID.
3. Replace all three Vercel signing variables in one controlled change.
4. Redeploy.
5. Issue and verify a disposable receipt.
6. Preserve old public keys; each historical receipt already stores the key needed for verification.

## Database changes

`SUPABASE_SETUP.sql` is for a fresh project. After launch, use explicit incremental migration files, test them against a backup or staging project, and never paste unreviewed destructive SQL into production.
