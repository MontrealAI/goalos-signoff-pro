# Quality Assurance Plan

**Product:** GoalOS Signoff Pro v1.1  
**Audience:** GoalOS team, pilot customers, operators  
**Owner:** GoalOS product and operations  
**Status:** Ready for private beta  
**Version:** 1.1.0  
**Updated:** 2026-06-26T00:05:06Z

> Manual and automated testing before inviting real users.

---

## Critical test paths

| Path | Expected result |
| --- | --- |
| Client creates project | Project created with correct owner |
| Builder submits evidence | Evidence visible only to authorized users |
| Reviewer requests changes | Builder sees actionable request |
| Builder submits v2 | Version history preserved |
| Client accepts v2 | Receipt references v2 only |
| Unauthorized user opens link | Access denied |
| Receipt verify | Signature/hash valid |
| Revoked receipt verify | Revocation shown |


## Security tests

- [ ] Try to access another workspace project
- [ ] Try to download unauthorized evidence
- [ ] Try expired invite link
- [ ] Try modified receipt JSON
- [ ] Try uploading unsupported file type
- [ ] Try malicious file name
- [ ] Try unauthenticated receipt route

## Launch gate

Do not start the pilot until every critical path passes in staging.
