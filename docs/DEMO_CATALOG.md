# Demo catalog

GoalOS Signoff Pro public demos are browser-local, public-safe, and claim-bounded. They are designed to explain proof-governed acceptance, not to collect data or move value.

| Demo | Route / source | What it demonstrates | Output artifact | Boundary | Best next click |
| --- | --- | --- | --- | --- | --- |
| Institutional front door | `site/index.html` | Start-by-intent entry for visitors, executives, reviewers, operators, developers, and legal/risk reviewers. | Public site hub | No intake; no analytics; no wallet. | Production website |
| Browser beta | generated browser beta routes when present | Private-beta acceptance workspace narrative. | Demo workspace explanation | Public route is informational only. | `docs/PUBLIC_SITE_OPERATIONS.md` |
| Mission 001 | generated Mission 001 routes/artifacts when present | Reproducibility packet, Evidence Docket, and signed receipt review flow. | Sample receipt / packet | Sample data only; no legal acceptance guarantee. | `docs/MISSION_001_REPRODUCIBILITY_USER_GUIDE.md` |
| Receipt verifier | generated verifier route when present | How a receipt hash and replay path can be inspected. | Verification report | No live transaction broadcast; no advice. | `TOOLS/VERIFY_RECEIPT.html` |
| Settlement-readiness lab | proof-settlement route/artifacts when generated | Proof-to-settlement controls and simulated readiness signal. | Settlement-readiness signal | Simulated only; no escrow release and no value moved. | `docs/PROOF_TO_SETTLEMENT_CONTROL_LAB_USER_GUIDE.md` |
| v22 Action Graph & Human Authority | `public-demo-labs.html` → `action-graph-authority-lab.html` | Scoped action and human authority gate. | Authority-gated action receipt | GoalOS prepares; humans authorize. | Open v22 lab |
| v23 Proof-Carrying Artifact | `proof-carrying-artifact-lab.html` | Capability reuse with proof and evolution ledger. | Proof-backed upgrade right | Demonstration artifact only. | Open v23 lab |
| v24 Independent Replay | `independent-replay-lab.html` | Replay council and claim promotion. | Claim promotion certificate | Claim maturity requires replay. | Open v24 lab |
| v25 ProofZero Planning | `proofzero-planning-lab.html` | Planning over proof-relevant work states. | Evidence reanalysis ledger | Planning demo; no autonomous authority. | Open v25 lab |
| v26 Mission Foundry | `mission-foundry-lab.html` | Accepted proof becomes curriculum. | Mission seed certificate | Curriculum demo only. | Open v26 lab |
| v27 Process Evidence | `process-evidence-lab.html` | Claim lineage, tool scope, contradictions, and validator report. | Process validator report | Public-safe sample traces only. | Open v27 lab |

## Route aliases and manifest

The v22-v27 suite publishes `site/goalos-public-demo-labs-v22-v27.json`, `site/public-demo-labs.html`, and `site/goalos-public-demo-labs.html`. Treat the manifest as the public route inventory for those labs.
