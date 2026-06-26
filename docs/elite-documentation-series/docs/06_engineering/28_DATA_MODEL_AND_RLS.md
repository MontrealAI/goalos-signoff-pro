# Data Model and Row Level Security

**Product:** GoalOS Signoff Pro v1.1  
**Audience:** GoalOS team, pilot customers, operators  
**Owner:** GoalOS product and operations  
**Status:** Ready for private beta  
**Version:** 1.1.0  
**Updated:** 2026-06-26T00:05:06Z

> Tables, access rules, and implementation expectations.

---

## Core tables

| Table | Purpose |
| --- | --- |
| organizations | Workspace ownership |
| organization_members | Roles and membership |
| projects | Signoff projects |
| acceptance_criteria | Criteria for done |
| submissions | Builder versions |
| evidence_files | Uploaded artifacts and hashes |
| evidence_mappings | Evidence to criterion links |
| reviews | Reviewer recommendations |
| decisions | Client final decisions |
| receipts | Signed Mission Receipts |
| audit_events | Important state changes |
| receipt_anchors | Optional blockchain anchors |
| billing_customers | Billing metadata only |


## RLS principles

- Users can see only organizations they belong to
- Builders can submit only to invited projects
- Reviewers can review assigned projects
- Only clients/admins can issue final acceptance
- Receipts can be shared through explicit verification links
- Service role is used only on the server

## Critical RLS tests

- [ ] Member cannot read another organization project
- [ ] Builder cannot accept project
- [ ] Reviewer cannot modify brief
- [ ] Observer cannot upload evidence
- [ ] Expired invite cannot access project
- [ ] Public receipt link cannot expose private files
