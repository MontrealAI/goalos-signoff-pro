# DevOps and CI/CD

**Product:** GoalOS Signoff Pro v1.1  
**Audience:** GoalOS team, pilot customers, operators  
**Owner:** GoalOS product and operations  
**Status:** Ready for private beta  
**Version:** 1.1.0  
**Updated:** 2026-06-26T00:05:06Z

> How to run reliable deployments without breaking customer trust.

---

## CI must run

- [ ] Install dependencies from lockfile
- [ ] Typecheck
- [ ] Lint
- [ ] Unit tests
- [ ] RLS tests
- [ ] Build
- [ ] Secret-file scan
- [ ] Package-boundary check

## Deployment requirements

- Protected main branch
- Pull request review for production changes
- Separate staging and production environments
- No secrets in repository
- Environment-variable review before production
- Rollback button available

## Release checklist

- [ ] Version noted
- [ ] Migrations reviewed
- [ ] Backup verified
- [ ] Feature flags set
- [ ] Support notified
- [ ] Smoke test passed after deploy
- [ ] Release notes written
