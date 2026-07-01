# Flowcharts

Purpose: collect Mermaid diagrams for the proof-to-acceptance, RSI, ASI, and release pipeline.

Best first action: open [`site/goalos-v22-v35-command-center.html`](../site/goalos-v22-v35-command-center.html), then continue to the recommended lab.

Relevant routes: [`site/index.html`](../site/index.html), [`site/public-demo-labs.html`](../site/public-demo-labs.html), [`site/goalos-v22-v35-command-center.html`](../site/goalos-v22-v35-command-center.html), [`site/loop-rsi-asi-superintelligence-mission-simulator-lab.html`](../site/loop-rsi-asi-superintelligence-mission-simulator-lab.html).

Verification command: `npm run site:all`.

Public-safe boundary: no forms, no inputs, no uploads, no cookies, no analytics, no wallets, no payments, no external AI calls, no personal data, zero value moved. This is not legal advice, financial advice, investment advice, live settlement, achieved AGI/ASI, or production RSI.

```mermaid
flowchart LR
  Objective-->MissionContract-->Work-->EvidenceDocket-->Replay-->Validation-->HumanSignoff-->SignedReceipt-->SettlementReadinessBoundary
```

```mermaid
flowchart LR
  Blockchain[Blockchain proves transaction]-->DueDiligence[Require proof package]
  GoalOS[GoalOS proves work]-->Validation-->Receipt-->SettlementReadiness[Settlement-readiness boundary]
```

```mermaid
flowchart LR
  target-->emit-->filter-->atlas-->testPlan[test-plan]-->eval-->insert-->promote
```

```mermaid
flowchart LR
  recognize-->reproduce-->stressTest[stress-test]-->persist-->dossier-->CouncilReview[human/council review]
```

```mermaid
stateDiagram-v2
  [*] --> Claim
  Claim --> ProofLoop
  ProofLoop --> RSIKernel
  RSIKernel --> Dossier
  Dossier --> ASILock
  ASILock --> CouncilReview
  CouncilReview --> Promote: approved
  CouncilReview --> Rollback: rejected or unsafe
```

```mermaid
flowchart LR
  Commit-->Install[npm ci]-->Build[npm run build]-->BuildSite[site build]-->Verify[site verify]-->Artifact[preview artifact]-->Pages[GitHub Pages deploy]
```

Back to [docs index](INDEX.md).
