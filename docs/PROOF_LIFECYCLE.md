# GoalOS proof lifecycle

GoalOS Signoff Pro turns AI-delivered output into reviewable institutional work. The public repository demonstrates the grammar of proof; it does not collect production evidence through public pages and does not grant production authority.

## Universal lifecycle

```mermaid
flowchart LR
  O[Objective] --> M[Mission Contract]
  M --> W[Work / Agent Execution]
  W --> E[Evidence Docket]
  E --> P[ProofBundle]
  P --> R[Replay]
  R --> V[Validation]
  V --> H[Human Authority]
  H --> D[Governed Decision State]
  D --> C[Chronicle]
  C --> K[Reusable Capability]
```

## Signoff Pro acceptance flow

```mermaid
flowchart LR
  B[Brief] --> C[Acceptance Criteria]
  C --> A[Artifacts]
  A --> E[Evidence Mapping]
  E --> R[Review]
  R --> H[Human Decision]
  H -->|Accept| MR[Signed Mission Receipt]
  H -->|Changes needed| CR[Change Request]
  H -->|Reject| RJ[Rejection Record]
  MR --> V[Verify Receipt]
```

## Claim maturity ladder

```mermaid
flowchart LR
  C0[Draft claim] --> C1[Evidence attached]
  C1 --> C2[ProofBundle generated]
  C2 --> C3[Replay passes]
  C3 --> C4[Reviewer accepts]
  C4 --> C5[Claim promoted]
  C5 --> C6[Chronicle memory]
  C2 -. weak evidence .-> Q[Quarantine]
  C3 -. replay fails .-> F[Do not promote]
```

## Public-safe boundary

```mermaid
flowchart TB
  subgraph Public[Public demo surface]
    P1[Static pages]
    P2[Browser-local demos]
    P3[Sample Evidence Dockets]
    P4[Receipt verification examples]
    P5[Claim boundaries]
  end
  subgraph NotPublic[Not provided by public demos]
    N1[Wallet connection]
    N2[Token approval]
    N3[Transaction broadcast]
    N4[Funds movement]
    N5[User data collection]
    N6[Production authority]
  end
  Public --> B[Public-safe boundary]
  B -. blocks .-> NotPublic
```

## Lifecycle gates

| Gate | Evidence question | Failure mode |
| --- | --- | --- |
| Objective | Is the work request explicit enough to review? | Ambiguous scope or unverifiable success criteria. |
| Mission Contract | Are roles, criteria, and constraints recorded? | Missing authority, risk, or acceptance boundary. |
| Evidence Docket | Does each claim have inspectable evidence? | No Evidence Docket, no strong public claim. |
| ProofBundle | Can evidence, hashes, receipts, and reports travel together? | No ProofBundle, no settlement signal. |
| Replay | Can a reviewer reproduce the relevant result or reasoning path? | No replay, no settlement. |
| Validation | Are contradictions, gaps, costs, and risks recorded? | Rubber-stamp review or hidden failure. |
| Human Authority | Did an authorized human decide? | No authority, no autonomy. |
| Chronicle | Is accepted learning preserved for future work? | Capability cannot safely compound. |

## What this lifecycle claims

It claims that GoalOS Signoff Pro can demonstrate a disciplined public grammar for acceptance: evidence, criteria mapping, replay, validation, human authority, and signed receipts.

## What it does not claim

It does not claim achieved AGI, achieved ASI, empirical SOTA, live settlement, legal or financial advice, external certification, production safety, or autonomous authority from public pages.
