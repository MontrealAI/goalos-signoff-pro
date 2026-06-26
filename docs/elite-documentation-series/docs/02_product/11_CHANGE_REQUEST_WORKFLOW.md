# Change Request Workflow

**Product:** GoalOS Signoff Pro v1.1  
**Audience:** GoalOS team, pilot customers, operators  
**Owner:** GoalOS product and operations  
**Status:** Ready for private beta  
**Version:** 1.1.0  
**Updated:** 2026-06-26T00:05:06Z

> How revision loops work before acceptance.

---

## Why it matters

Most real work is not accepted on the first submission. A strong Signoff product must support revision loops.

## States

```text
Draft brief
Brief approved
Submitted v1
Changes requested
Submitted v2
Reviewer recommended accept
Client accepted
Receipt issued
```

## Change request fields

- Requested by
- Requested at
- Affected criteria
- Specific change required
- Severity
- Due date
- Builder response
- Resolved status

## Rules

- [ ] A receipt can only reference an accepted submission version
- [ ] Rejected versions remain in history but are not accepted
- [ ] Change requests must reference one or more criteria
- [ ] Builder can respond with notes and new evidence
- [ ] Reviewer can mark each request resolved or unresolved
- [ ] Client sees unresolved requests before accepting

## User-friendly copy

Use:

> This version is not accepted yet. The reviewer requested 3 changes.

Avoid:

> Submission state transition invalid.
