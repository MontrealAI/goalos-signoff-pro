# Data Protection and Retention

**Product:** GoalOS Signoff Pro v1.1  
**Audience:** GoalOS team, pilot customers, operators  
**Owner:** GoalOS product and operations  
**Status:** Ready for private beta  
**Version:** 1.1.0  
**Updated:** 2026-06-26T00:05:06Z

> How customer files and evidence should be handled.

---

## Data classes

| Class | Examples | Default treatment |
| --- | --- | --- |
| Public | Public receipt metadata, optional anchor hash | Publish only with opt-in |
| Customer private | Briefs, evidence, comments | Workspace access only |
| Sensitive secrets | Signing keys, API keys | Secret manager only |
| Operational logs | Access logs, error logs | Restricted internal access |
| Billing data | Plan, invoice IDs | Minimal storage; use payment processor |


## Retention defaults

| Data | Private beta default |
| --- | --- |
| Active project data | Retain while project active |
| Accepted receipts | Retain unless customer deletes/revokes |
| Raw evidence files | 180 days default, configurable |
| Audit events | 1 year default for pilot |
| Support tickets | 1 year unless customer requests deletion |
| Logs | 30–90 days depending on sensitivity |


## Deletion process

- [ ] Verify requester authority
- [ ] Export receipt if requested
- [ ] Delete private files
- [ ] Mark receipt revoked if integrity cannot be preserved
- [ ] Record deletion audit event
- [ ] Confirm completion
