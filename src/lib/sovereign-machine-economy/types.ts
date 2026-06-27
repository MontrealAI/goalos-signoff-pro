export type RiskClass = 'low' | 'medium' | 'high' | 'critical';
export type GateState = 'pending' | 'passed' | 'blocked' | 'requires_review';
export type SelectionDecision = 'accept' | 'request_changes' | 'reject' | 'escalate' | 'canary' | 'roll_back';

export interface GoalOSCommit {
  id: string;
  objective: string;
  successCriteria: string[];
  failureCriteria: string[];
  constraints: string[];
  authority: string;
  riskClass: RiskClass;
  budgetLabel: string;
  deadlineIso?: string;
  allowedTools: string[];
  requiredEvaluators: string[];
  approvalRules: string[];
  dataBoundary: string;
  rollbackObligations: string[];
  claimBoundary: string[];
}

export interface RunCommitment {
  id: string;
  goalOSCommitId: string;
  agentSet: string[];
  planGraphHash: string;
  artifactVersionRoots: string[];
  toolPermissionRoot: string;
  contextRoot: string;
  policyRoot: string;
  runtimeEnvironment: string;
  budgetLimitLabel: string;
  latencyLimitLabel: string;
  signerSet: string[];
}

export interface ProofPacket {
  id: string;
  runCommitmentId: string;
  traceRoot: string;
  outputHash: string;
  policyDecisionRoot: string;
  toolHistoryRoot: string;
  evalResultRoot: string;
  costLabel: string;
  latencyLabel: string;
  errors: string[];
  creditAssignment: string[];
  evidenceUri: string;
  signatureBundle: string[];
}

export interface EvalAttestation {
  id: string;
  schemaId: string;
  proofPacketId: string;
  baseline: string;
  candidate: string;
  verdict: 'pass' | 'fail' | 'inconclusive';
  evaluator: string;
  notes: string[];
  signature: string;
}

export interface EvidenceDocket {
  id: string;
  manifest: string;
  claimsMatrix: string[];
  sourceProvenance: string[];
  contradictionRegister: string[];
  baselines: string[];
  proofPackets: ProofPacket[];
  evaluatorAttestations: EvalAttestation[];
  riskLedger: string[];
  costLedger: string[];
  replayPath: string[];
  claimBoundary: string[];
  publicPrivateBoundary: string;
}

export interface SelectionCertificate {
  id: string;
  decision: SelectionDecision;
  scope: string;
  canary?: string;
  rollbackTarget?: string;
  challengeWindow?: string;
  gates: Record<string, GateState>;
  signer: string;
}

export interface EvolutionLedgerEntry {
  id: string;
  entryType: 'JobCommit' | 'RunRoot' | 'ProofRoot' | 'EvalAttestation' | 'SelectionCertificate' | 'RolloutReceipt' | 'RollbackReceipt' | 'ChronicleEntry';
  publicFields: Record<string, string>;
  privateCounterpartLabel: string;
  timestampIso: string;
}

export interface GovernedDecisionState {
  id: string;
  objective: string;
  evidenceDocketId: string;
  verifierSummary: string;
  decision: SelectionDecision;
  actionGraph: string[];
  chronicleEntry: EvolutionLedgerEntry;
  reusableCapabilityPackage: string[];
  reviewerFrontier: 'human_final' | 'institutional_board' | 'external_auditor';
}

export interface SovereignMachineEconomyState {
  goalOSCommit: GoalOSCommit;
  runCommitment: RunCommitment;
  evidenceDocket: EvidenceDocket;
  selectionCertificate: SelectionCertificate;
  decisionState: GovernedDecisionState;
  ledger: EvolutionLedgerEntry[];
}
