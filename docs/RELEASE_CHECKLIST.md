# Release checklist

## Code quality

- [ ] `npm ci` succeeds from a clean checkout
- [ ] `npm run typecheck` passes
- [ ] `npm run lint` passes
- [ ] `npm run test` passes
- [ ] `npm run build` passes
- [ ] Dependency audit reviewed
- [ ] No `.env`, key, token, or credential is committed

## Functional

- [ ] Landing page and interactive demo render
- [ ] Magic-link sign-in works
- [ ] Project creation works
- [ ] Client can invite builder/reviewer/observer
- [ ] Invitation is email-bound and one-time
- [ ] Private upload and server hash verification work
- [ ] Builder can submit only complete packages
- [ ] Reviewer recommendation works
- [ ] Only client can record final decision
- [ ] Accepted delivery issues a valid PDF/JSON receipt
- [ ] Private receipt requires membership
- [ ] Link-visible receipt works only with the unlisted URL
- [ ] Revocation permanently invalidates current reliance

## Operational

- [ ] Production URL configured in Supabase and Vercel
- [ ] Environment variables scoped correctly
- [ ] Spending and usage alerts enabled
- [ ] Backup and recovery tested
- [ ] Support and incident owner named
- [ ] Privacy notice, terms, and retention policy reviewed
- [ ] Pilot limitations communicated to every user
