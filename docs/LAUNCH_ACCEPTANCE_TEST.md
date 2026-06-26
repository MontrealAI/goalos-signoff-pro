# Launch acceptance test

Run this checklist before inviting real users.

## Accounts

Create three test users:

- Client
- Builder
- Reviewer

## Test mission

Title: AI research report signoff

Acceptance criteria:

1. At least five competitors are covered.
2. Source list is attached.
3. Pricing comparison is included.
4. Three recommendations are included.
5. Risks and uncertainties are disclosed.

## Pass criteria

- Client can create the project.
- Builder invitation works.
- Reviewer invitation works.
- Builder can upload an evidence file.
- Browser SHA-256 and server SHA-256 match.
- Builder can submit a version.
- Mechanical checks run.
- Reviewer can recommend accept, changes, or reject.
- Client can request changes.
- Builder can resubmit version 2.
- Reviewer can recommend accept.
- Client can accept.
- Mission Receipt is issued.
- PDF downloads.
- JSON downloads.
- Public verification page works when link visibility is enabled.
- Offline verification tool detects tampering.
- Audit events are visible in the project history.

## Do not launch if

- A non-member can access project files.
- Receipt verification accepts a modified file or modified JSON.
- Invitations do not expire.
- A builder can accept their own work.
- A reviewer can change a client decision.
- A private receipt is visible without permission.
- Email contains broken links.
- The setup status page reports missing required configuration.
