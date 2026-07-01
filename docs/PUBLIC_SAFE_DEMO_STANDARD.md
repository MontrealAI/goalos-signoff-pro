# Public-safe demo standard

GoalOS Signoff Pro public demos exist to explain proof logic without becoming an intake, wallet, payment, custody, analytics, or production-authority surface.

## Required posture

Every public demo must remain:

- browser-local or static/read-only;
- sample-data oriented;
- claim-bounded;
- no wallet connection;
- no token approval;
- no network switching;
- no transaction broadcast;
- no custody, escrow release, payment, token sale, or value movement;
- no analytics, cookies, tracking pixels, or third-party tracking scripts;
- no public uploads, public forms, user-data intake, customer data, personal data, confidential data, or regulated data;
- no legal, financial, tax, investment, medical, safety-certification, ROI, AGI/ASI, empirical SOTA, external-audit, or production-certification overclaim.

## Required page copy

Each public demo page should make these five points visible without requiring a reader to inspect source code:

1. **What this demonstrates** — the proof, acceptance, replay, authority, or receipt concept.
2. **What proof object it emits or illustrates** — Evidence Docket, Mission Receipt, ProofBundle, validator report, ledger, claim matrix, or manifest.
3. **What is simulated** — settlement-readiness, authority routing, replay, anchoring, or validation when applicable.
4. **What is not done** — no wallet, no funds, no upload, no production authority, and no advice.
5. **Where to inspect next** — demo catalog, user guide, verifier script, route manifest, or JSON artifact.

## Safe implementation checklist

Before adding or changing a public demo:

- [ ] Update the source builder, config, or manifest before generated `site/` output.
- [ ] Preserve historical aliases and route discoverability.
- [ ] Add or update the user guide and `docs/DEMO_CATALOG.md` entry.
- [ ] Include boundary footer links to legal/privacy/no-user-data/AGIALPHA boundary material.
- [ ] Avoid external assets unless already justified by repository convention.
- [ ] Avoid form actions, file inputs, wallet calls, payment calls, analytics tags, cookie writes, and hidden network calls.
- [ ] Run the relevant builder, route verifier, public-safe verifier, and `git diff --check`.

## Public-safe scanner patterns

Implementation scans should fail on public routes that introduce patterns such as:

- `ethereum.request({ method: 'eth_requestAccounts' })`
- `wallet_addEthereumChain`
- `eth_sendTransaction`
- `input type="file"`
- `form action=`
- cookie-setting code
- analytics script tags or calls
- public payment checkout flows

Boundary pages may mention these terms as prohibitions. The scanner should focus on implementation patterns in generated public routes.

## Acceptance rule

A demo is releasable only when a first-time visitor can answer:

- What am I looking at?
- What proof object is being demonstrated?
- What is browser-local or simulated?
- What is explicitly not enabled?
- How do I verify the route or artifact locally?

If any answer is unclear, improve the copy before publishing.
