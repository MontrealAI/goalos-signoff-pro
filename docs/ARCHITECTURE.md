# Architecture

## System overview

```text
Browser
  ├─ Next.js pages and client components
  ├─ Browser SHA-256 before file upload
  └─ Supabase magic-link authentication
        │
        ▼
Next.js server routes
  ├─ Same-origin mutation checks
  ├─ Auth claim validation
  ├─ Project-role checks
  ├─ Short-lived signed upload/download URLs
  ├─ Server SHA-256 validation
  ├─ Receipt construction and Ed25519 signing
  └─ Optional Resend invitation delivery
        │
        ▼
Supabase
  ├─ Auth users
  ├─ PostgreSQL records
  ├─ Row Level Security
  ├─ Security-definer workflow functions
  ├─ Audit events
  └─ Private Storage bucket
```

## Trust boundaries

### Browser

The browser is untrusted for authorization and final integrity decisions. It improves usability by hashing files before upload and showing readiness checks, but the server and database repeat authoritative checks.

### Next.js server

The server has access to the Supabase secret key and receipt private key. These credentials must remain in server-only environment variables.

### Supabase database

PostgreSQL enforces membership visibility, workflow transitions, client-only decisions, complete submissions, and receipt revocation. Row Level Security protects ordinary authenticated queries.

### Storage

The artifact bucket is private. Upload and download access uses short-lived signed URLs after authenticated role checks.

### Receipt verifier

A verifier checks the canonical receipt against the stored Ed25519 public key. Validity also requires the receipt not to be revoked in the current service database.

## Core records

- `projects`: frozen brief and state
- `project_members`: role assignments
- `acceptance_criteria`: objective requirements
- `invitations`: hashed one-time invitations
- `upload_intents`: temporary upload authorization and expected file fingerprint
- `artifacts`: verified evidence metadata
- `submissions`: versioned delivery declaration
- `criterion_responses`: builder response to each criterion
- `criterion_evidence`: evidence mapping
- `mechanical_checks`: authoritative readiness signals
- `reviews`: human recommendations
- `decisions`: client’s final authority record
- `receipts`: signed immutable record and revocation state
- `audit_events`: append-only operational history

## Receipt signing

1. The server loads the accepted brief, exact submission, artifacts, checks, reviews, and decision.
2. Values are canonicalized with stable object-key ordering.
3. Protocol-compatible SHA-256 hashes are generated.
4. The canonical JSON is signed with Ed25519.
5. The signature, canonical hash, key ID, and public key are stored with the receipt.
6. PDF and JSON exports are generated from the signed record.

## Failure behavior

- Missing or invalid environment variables fail closed.
- Unauthorized database records remain hidden through RLS.
- Mismatched upload size/hash causes deletion and failure.
- Incomplete submissions are rejected.
- A submission with failed checks cannot be accepted.
- A receipt is issued only after an accepted client decision.
- A revoked receipt remains visible as authentic history but invalid current approval.
