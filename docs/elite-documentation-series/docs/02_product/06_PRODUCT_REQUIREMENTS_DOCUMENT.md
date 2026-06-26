# Product Requirements Document

**Product:** GoalOS Signoff Pro v1.1  
**Audience:** GoalOS team, pilot customers, operators  
**Owner:** GoalOS product and operations  
**Status:** Ready for private beta  
**Version:** 1.1.0  
**Updated:** 2026-06-26T00:05:06Z

> The source of truth for what Signoff Pro v1.1 must do.

---

## Objective

Build a mainstream, private-beta SaaS workflow that enables users to create, review, accept, and verify AI-assisted deliverables.

## Core jobs to be done

| Job | User story | Acceptance test |
| --- | --- | --- |
| Create brief | As a client, I define what done means | Brief has title, deliverables, criteria, deadline, participants |
| Submit evidence | As a builder, I upload work and map evidence to criteria | Every required criterion can be mapped to evidence |
| Review | As a reviewer, I recommend accept/request changes/reject | Recommendation is recorded with comments and timestamp |
| Accept | As a client, I accept only the final version | Receipt references the accepted version only |
| Verify | As a third party, I verify receipt authenticity | Signature and hashes validate without modifying data |


## Must-have features

- Magic-link authentication
- Organization workspace
- Role-based access
- Invitation links
- Brief templates
- Evidence uploads
- Criteria mapping
- Evidence assistant warnings
- Revision loop
- Client final decision
- Signed Mission Receipt
- PDF and JSON export
- Offline verifier
- Audit events
- Receipt revocation

## Should-have features

- Stripe checkout/invoice hooks
- Pilot analytics
- Optional IPFS/Sepolia anchoring
- Public/private receipt verification page
- Comment threads
- Email reminders

## Not in v1.1

- Escrow
- AGIALPHA staking
- Mainnet settlement
- Automated legal contracts
- Autonomous acceptance
- Consumer marketplace

## Functional acceptance checklist

- [ ] Client can create project from template
- [ ] Builder can submit v1 evidence
- [ ] Reviewer can request changes
- [ ] Builder can submit v2
- [ ] Client can accept v2
- [ ] Receipt includes v2 only
- [ ] Receipt verifies offline
- [ ] Unauthorized users cannot access private evidence
- [ ] Audit log shows all key events
