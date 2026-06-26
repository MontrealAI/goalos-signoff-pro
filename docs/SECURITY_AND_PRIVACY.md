# Security and privacy guide

## Security posture

This package is designed as a security-conscious private-beta MVP. It uses standard defensive controls but has not undergone an independent penetration test, formal audit, or compliance certification.

## Controls included

### Authentication and authorization

- Passwordless authentication through Supabase Auth
- Server-side JWT claim validation
- Explicit client, builder, reviewer, and observer roles
- PostgreSQL Row Level Security
- Client-only final decisions and receipt revocation
- One-time invitation tokens stored only as SHA-256 hashes
- Seven-day invitation expiry

### Data protection

- Private Supabase Storage bucket
- Short-lived signed download URLs
- Maximum 25 MB per file
- Allowed MIME-type list
- Server-side re-download and SHA-256 validation after upload
- Private-by-default receipt visibility
- Non-indexed receipt verification routes
- No browser exposure of the Supabase secret key or receipt private key

### Application integrity

- Same-origin protection on state-changing routes
- JSON-only mutation endpoints
- Request-size checks
- Frozen brief and criteria in the MVP
- Authoritative mechanical checks computed in PostgreSQL
- Immutable submission revisions
- Ed25519 receipt signatures
- Per-receipt public key persistence for safe signing-key rotation
- Permanent, visible receipt revocation
- Private/no-store API response headers
- Security response headers for framing, MIME sniffing, referrers, and browser permissions

## Secrets

### Public/browser values

These may be embedded in the browser application:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
NEXT_PUBLIC_APP_URL
```

The publishable key is not a substitute for access control; Row Level Security remains essential.

### Server-only secrets

Never place these in GitHub or any `NEXT_PUBLIC_` variable:

```text
SUPABASE_SECRET_KEY
RECEIPT_SIGNING_PRIVATE_KEY_PEM
RESEND_API_KEY
```

Treat the receipt private key as a signing authority. Rotate it if exposure is suspected. Existing receipts remain verifiable because their public key is stored with the receipt.

## Receipt meaning

A valid receipt proves that:

- its canonical contents match the signed record;
- the recorded artifact fingerprints and decision have not changed;
- the configured GoalOS Signoff signing service issued it;
- it has not been marked revoked in the current service database.

It does not independently prove that uploaded files were truthful, malware-free, legal, or professionally adequate.

## Known security gaps before broader production

Add or independently evaluate the following before using sensitive or regulated data:

- Malware scanning and file quarantine
- Content-disarm-and-reconstruction for active document formats
- Organization tenancy and administrator controls
- Enterprise SSO and MFA requirements
- Application-level rate limiting and bot protection
- Centralized security logging and alerting
- Tested backup and point-in-time recovery
- Automated retention and deletion jobs
- Data-processing agreements and privacy notices
- Penetration testing and dependency review
- Secure support and incident-response operations
- Key-management service or hardware-backed signing for higher assurance

## Incident response — immediate actions

### Suspected Supabase secret exposure

1. Disable public access if needed.
2. Rotate the Supabase secret key.
3. update Vercel environment variables.
4. Redeploy.
5. Review Auth, database, and storage logs.
6. Notify affected users according to applicable obligations.

### Suspected receipt private-key exposure

1. Stop receipt issuance.
2. Generate a new Ed25519 key pair.
3. Update the three signing variables.
4. Redeploy.
5. Preserve the old public key.
6. Review receipts issued during the exposure window.
7. Revoke affected receipts when appropriate.

### Incorrect receipt

The client opens the project’s Receipt tab and permanently revokes it with a clear reason. Revocation does not erase history; it tells verifiers not to treat the receipt as current approval.

## Privacy operating rules

- Collect only information needed for the Signoff.
- Use private receipt visibility unless link access is necessary.
- Do not upload special-category, health, financial-account, classified, or highly sensitive personal data during the initial pilot.
- Publish a retention period and deletion process before serving external customers.
- Ensure invited users understand who operates the service and where data is stored.
