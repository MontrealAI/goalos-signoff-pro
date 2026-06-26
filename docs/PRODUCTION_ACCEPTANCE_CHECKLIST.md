# Production Acceptance Checklist

Complete this before inviting customers beyond a small private beta.

## Technical

- [ ] CI is green on the exact release commit.
- [ ] Supabase RLS migration is applied on a fresh production project.
- [ ] File uploads are private.
- [ ] Magic-link authentication works.
- [ ] Invite links expire correctly.
- [ ] Receipt signing key is generated offline or in a trusted local environment.
- [ ] Receipt public key is published.
- [ ] Offline receipt verifier successfully verifies a production receipt.
- [ ] Receipt tampering is detected.
- [ ] Backups are enabled and restore-tested.
- [ ] Monitoring alerts are configured.
- [ ] Error logs do not contain secrets or sensitive files.
- [ ] Rate limits or abuse controls are enabled.

## Security

- [ ] All secrets are stored only in the deployment environment.
- [ ] Service-role key is never exposed to the browser.
- [ ] Branch protection is enabled.
- [ ] CODEOWNERS protects migrations, auth code, and receipt-signing code.
- [ ] Dependency updates are reviewed.
- [ ] A test user cannot access another user’s private project.
- [ ] Storage paths cannot be guessed to retrieve files without authorization.
- [ ] Incident-response owner is named.
- [ ] First security review is completed before broad launch.

## Product

- [ ] Landing page says no wallet, no AGIALPHA, no Ethereum transaction.
- [ ] Product does not claim automatic factual truth verification.
- [ ] Demo project works.
- [ ] A nontechnical tester can complete the flow without help.
- [ ] Receipt language is understandable.
- [ ] Exported PDF and JSON are useful for invoices or project files.

## Operations

- [ ] Support email is configured.
- [ ] Privacy policy and terms are reviewed.
- [ ] Data retention policy is defined.
- [ ] User deletion process is defined.
- [ ] Customer pilot list is approved.
- [ ] Rollback plan is documented.

## Pilot success criteria

- [ ] 10 real Signoffs attempted.
- [ ] 7 completed end-to-end.
- [ ] 3 users say they would use it again.
- [ ] 0 broken receipts.
- [ ] 0 lost evidence.
- [ ] 0 unapproved public data leaks.
