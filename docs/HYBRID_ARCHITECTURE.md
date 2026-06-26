# Hybrid architecture

GoalOS Signoff Hybrid has three layers.

## 1. Mainstream application layer

This is the product customers use every day.

- Authentication
- Projects
- Roles
- Invitations
- File uploads
- Evidence mapping
- Reviews
- Decisions
- Signed receipts
- Billing
- Support

This layer uses Supabase and Next.js because mainstream users need account recovery, private files, notifications, and a familiar web experience.

## 2. Verification layer

This layer turns an accepted receipt into a publicly verifiable hash record.

- Receipt canonicalization
- Receipt SHA-256 hash
- Evidence root
- Brief hash
- Decision hash
- Optional IPFS/public URI
- On-chain anchor event
- Explorer verification link

This layer is optional. It should not block the normal customer workflow.

## 3. Protocol economy layer

This is the future GoalOS/AGIALPHA layer.

- Reviewer bonds
- Builder bonds
- Disputes
- Slashing
- Credentials
- Reputation
- Settlement

This is deliberately gated. It should not be enabled before contract remediation, audits, production activation, and user-fund authorization.

## Recommended deployment pattern

```text
Customer browser
  ↓
Next.js app
  ↓
Supabase Auth / Postgres / Storage
  ↓
Signed Mission Receipt
  ↓ optional
GoalOS Anchor Contract
  ↓ future
GoalOS 48-contract protocol + AGIALPHA-secured economics
```

## Security principle

Do not make the user pay for blockchain complexity. GoalOS can sponsor verification while giving users a verifiable receipt.
