# Data and Privacy Model

## Data stored

GoalOS stores account information, project briefs, acceptance criteria, submitted artifacts, file hashes, reviewer notes, final decisions, signed receipts, and audit events.

## Private by default

Projects and files are private to project members. Receipt visibility defaults to private.

## Integrity model

Every uploaded artifact receives a SHA-256 fingerprint. The final receipt contains hashes of the accepted artifacts and decision record.

## Signing model

GoalOS signs the canonical receipt JSON with an Ed25519 key. The public key is included so receipts can be verified later.

## Human authority model

Automated checks support decision-making. They do not certify the external truth of every claim.

## Retention recommendation

For the first production beta, keep customer data until the customer deletes the project or requests deletion. Add workspace-level retention policies for enterprise users later.
