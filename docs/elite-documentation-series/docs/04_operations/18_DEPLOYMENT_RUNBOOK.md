# Deployment Runbook

**Product:** GoalOS Signoff Pro v1.1  
**Audience:** GoalOS team, pilot customers, operators  
**Owner:** GoalOS product and operations  
**Status:** Ready for private beta  
**Version:** 1.1.0  
**Updated:** 2026-06-26T00:05:06Z

> Step-by-step deployment process for staging and pilot production.

---

## Environments

| Environment | Purpose | Data |
| --- | --- | --- |
| Local | Developer testing | Fake/local |
| Staging | Internal acceptance testing | Synthetic |
| Pilot production | Private beta customers | Real customer data |
| Verified receipt testnet | Optional Sepolia anchoring | Public receipt hashes only |


## Pre-deployment checklist

- [ ] CI green
- [ ] Database migrations reviewed
- [ ] RLS policies tested
- [ ] Secrets set in platform dashboard only
- [ ] No `.env` in repository
- [ ] Receipt signing key generated
- [ ] Backup policy confirmed
- [ ] Admin account created
- [ ] Support inbox ready

## Deployment steps

1. Create staging project.
2. Apply database schema and RLS policies.
3. Configure storage buckets.
4. Configure environment variables.
5. Deploy frontend.
6. Run smoke tests.
7. Create sample Signoff.
8. Verify receipt export.
9. Test unauthorized access.
10. Promote configuration to pilot production.

## Rollback plan

- Disable new project creation
- Freeze receipt issuance if signing issue exists
- Preserve existing data
- Restore previous frontend deployment
- Communicate known issue to pilot users
- Run incident review before re-enabling
