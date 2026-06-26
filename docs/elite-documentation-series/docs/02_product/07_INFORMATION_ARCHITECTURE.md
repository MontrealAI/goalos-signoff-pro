# Information Architecture

**Product:** GoalOS Signoff Pro v1.1  
**Audience:** GoalOS team, pilot customers, operators  
**Owner:** GoalOS product and operations  
**Status:** Ready for private beta  
**Version:** 1.1.0  
**Updated:** 2026-06-26T00:05:06Z

> Navigation, screens, and content hierarchy for a mainstream user experience.

---

## Top-level navigation

| Area | Purpose | Primary users |
| --- | --- | --- |
| Dashboard | Show active Signoffs and next actions | All |
| Templates | Start from common work types | Client/admin |
| Projects | Create and manage Signoff workflows | All |
| Reviews | Review pending submissions | Reviewers/clients |
| Receipts | Find accepted receipts and verification status | All |
| Settings | Manage organization, billing, members | Admins |


## Project lifecycle screens

```text
Create brief
  ↓
Invite participants
  ↓
Builder submission
  ↓
Evidence assistant
  ↓
Reviewer recommendation
  ↓
Client decision
  ↓
Mission Receipt
  ↓
Optional verified receipt
```

## Dashboard cards

- Needs brief completion
- Waiting for builder
- Needs reviewer decision
- Changes requested
- Ready for client acceptance
- Accepted receipt issued
- Verification pending

## Empty state rules

Every empty screen must answer:

- What is this page?
- What should I do next?
- How long will it take?
- Where can I see an example?
