# Product scope — GoalOS Signoff Phase 1

## Product promise

**Know when AI-assisted work is actually done.**

GoalOS Signoff creates a structured acceptance process for deliverables produced by humans, AI systems, or both.

## Target users

The first wedge is:

- AI consultants
- Small AI agencies
- Research and strategy teams
- Software contractors
- Enterprise AI pilot owners

## Roles

### Client

Creates the brief, controls participants, reviews the evidence, and has exclusive authority over the final decision and receipt revocation.

### Builder

Uploads deliverables, describes AI involvement and limitations, and maps evidence to every criterion.

### Reviewer

Examines the package and records a recommendation. The recommendation informs but does not replace the client’s decision.

### Observer

Receives read-only project access.

## In-scope workflow

1. Create a frozen brief.
2. Invite participants.
3. Upload private artifacts.
4. Verify artifact size and SHA-256.
5. Submit a versioned evidence package.
6. Run mechanical checks.
7. Record review recommendations.
8. Record the client’s final decision.
9. Issue an Ed25519-signed PDF/JSON Mission Receipt after acceptance.
10. Verify or permanently revoke the receipt.

## Human authority boundary

GoalOS can determine whether files exist, hashes match, criteria have answers, evidence links exist, and disclosure fields are populated.

GoalOS does not autonomously determine that:

- every factual claim is true;
- professional advice is suitable;
- legal or regulatory requirements are satisfied;
- a deliverable is safe to deploy;
- payment is owed under external law or contract.

Those remain human or separately governed decisions.

## Out of scope for Phase 1

- Wallet connection
- AGIALPHA use
- Ethereum anchoring
- Escrow or payment release
- Reviewer bonding or slashing
- Public reviewer marketplace
- Automated dispute adjudication
- Guaranteed identity verification
- Qualified electronic signatures
- Compliance certification

## Product success metric

A meaningful first milestone is:

> Twenty real users complete a Signoff, and at least five voluntarily share or attach the Mission Receipt to an actual client or internal approval workflow.
