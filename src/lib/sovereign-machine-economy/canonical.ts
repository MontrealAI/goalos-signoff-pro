import type { GoalOSCommit, SovereignMachineEconomyState } from './types';

export const SOVEREIGN_MACHINE_ECONOMY_NAME = 'GoalOS AGIALPHA Ascension — Sovereign Machine Economy' as const;

export const SOVEREIGN_MACHINE_ECONOMY_DOCTRINE = {
  publicLoop: ['Aim', 'Act', 'Prove', 'Evolve'],
  protocolLoop: ['Commit', 'Execute', 'Prove', 'Evolve'],
  acceptanceChain: ['Commission', 'Submit', 'Map', 'Review', 'Accept', 'Receipt'],
  invariant: 'Evidence earns authority; authority remains reviewable.',
  pilotEmail: 'info@quebec.ai'
} as const;

export const DEFAULT_SME_COMMIT: GoalOSCommit = {
  id: 'goalos-sme-genesis-commit',
  objective: 'Convert one AI-delivered work package into a governed decision state with evidence, review, and signed receipt.',
  successCriteria: [
    'Mission objective is explicit',
    'Claims are mapped to evidence',
    'Contradictions and uncertainty are visible',
    'Reviewer decision is recorded',
    'Receipt can be replayed or inspected'
  ],
  failureCriteria: [
    'Unsupported claim becomes accepted default',
    'Private workspace data is published publicly',
    'Reviewer decision is bypassed',
    'Receipt cannot be verified'
  ],
  constraints: [
    'No automatic human acceptance',
    'No public leakage of private prompts or customer files',
    'No settlement action without explicit gated capability',
    'No unsupported empirical claim promotion'
  ],
  authority: 'Client or designated reviewer is the terminal acceptance authority.',
  riskClass: 'medium',
  budgetLabel: 'Private beta proof mission budget',
  allowedTools: ['evidence-upload', 'sha256-fingerprint', 'review-form', 'receipt-signer', 'optional-anchor-request'],
  requiredEvaluators: ['human-reviewer', 'mechanical-completeness-check'],
  approvalRules: ['all required criteria answered', 'human final decision present', 'receipt generated after acceptance'],
  dataBoundary: 'Public proofs expose commitments, hashes, CIDs, receipts, and status; private documents stay in controlled storage.',
  rollbackObligations: ['receipt revocation path', 'change-request history', 'artifact version retention'],
  claimBoundary: ['private-beta product posture', 'optional verification path', 'future protocol rails remain gated']
};

export function buildDemoSovereignMachineEconomyState(): SovereignMachineEconomyState {
  const commit = DEFAULT_SME_COMMIT;
  const runCommitment = {
    id: 'run-root-genesis-001',
    goalOSCommitId: commit.id,
    agentSet: ['client', 'builder', 'reviewer', 'evidence-assistant'],
    planGraphHash: 'sha256:plan-graph-demo',
    artifactVersionRoots: ['sha256:brief-v1', 'sha256:evidence-package-v1'],
    toolPermissionRoot: 'sha256:tool-permission-root-demo',
    contextRoot: 'sha256:context-root-demo',
    policyRoot: 'sha256:policy-root-demo',
    runtimeEnvironment: 'goalos-signoff-pro-private-beta',
    budgetLimitLabel: 'bounded pilot budget',
    latencyLimitLabel: 'review-cycle SLA',
    signerSet: ['client', 'reviewer']
  };

  const proofPacket = {
    id: 'proof-packet-genesis-001',
    runCommitmentId: runCommitment.id,
    traceRoot: 'sha256:trace-root-demo',
    outputHash: 'sha256:output-hash-demo',
    policyDecisionRoot: 'sha256:policy-decision-root-demo',
    toolHistoryRoot: 'sha256:tool-history-root-demo',
    evalResultRoot: 'sha256:eval-result-root-demo',
    costLabel: 'pilot-cost-ledger-demo',
    latencyLabel: 'pilot-latency-ledger-demo',
    errors: [],
    creditAssignment: ['brief-author', 'evidence-mapper', 'human-reviewer'],
    evidenceUri: 'public-safe-evidence-docket-demo',
    signatureBundle: ['sig:client-demo', 'sig:reviewer-demo']
  };

  const evalAttestation = {
    id: 'eval-attestation-genesis-001',
    schemaId: 'goalos-signoff-pro-evidence-completeness-v1',
    proofPacketId: proofPacket.id,
    baseline: 'unstructured-email-acceptance',
    candidate: 'goalos-signoff-pro-receipt',
    verdict: 'pass' as const,
    evaluator: 'human-reviewer',
    notes: ['criteria mapped', 'receipt generated', 'decision retained'],
    signature: 'sig:evaluator-demo'
  };

  const evidenceDocket = {
    id: 'evidence-docket-genesis-001',
    manifest: 'goalos-sme-demo-manifest',
    claimsMatrix: ['mission-defined', 'evidence-mapped', 'human-reviewed', 'receipt-sealed'],
    sourceProvenance: ['uploaded-artifact-fingerprints', 'reviewer-decision-record'],
    contradictionRegister: ['none-recorded-demo'],
    baselines: ['email-thread-approval', 'shared-drive-deliverable'],
    proofPackets: [proofPacket],
    evaluatorAttestations: [evalAttestation],
    riskLedger: ['scope-bound', 'private-data-boundary-preserved'],
    costLedger: ['pilot-cost-ledger-demo'],
    replayPath: ['open-receipt', 'verify-artifact-hash', 'inspect-review-decision'],
    claimBoundary: commit.claimBoundary,
    publicPrivateBoundary: commit.dataBoundary
  };

  const selectionCertificate = {
    id: 'selection-certificate-genesis-001',
    decision: 'accept' as const,
    scope: 'private-beta-signoff-receipt',
    rollbackTarget: 'request-changes',
    challengeWindow: 'review-cycle',
    gates: {
      proofValid: 'passed' as const,
      evalPass: 'passed' as const,
      scopeAuthorized: 'passed' as const,
      rollbackReady: 'passed' as const,
      humanDecision: 'passed' as const
    },
    signer: 'human-reviewer'
  };

  const chronicleEntry = {
    id: 'chronicle-entry-genesis-001',
    entryType: 'ChronicleEntry' as const,
    publicFields: {
      evidenceDocketId: evidenceDocket.id,
      selectionCertificateId: selectionCertificate.id,
      capability: 'signoff-receipt-workflow'
    },
    privateCounterpartLabel: 'private workspace evidence package',
    timestampIso: '2026-06-27T00:00:00.000Z'
  };

  return {
    goalOSCommit: commit,
    runCommitment,
    evidenceDocket,
    selectionCertificate,
    decisionState: {
      id: 'governed-decision-state-genesis-001',
      objective: commit.objective,
      evidenceDocketId: evidenceDocket.id,
      verifierSummary: 'Criteria mapped, evidence recorded, reviewer decision preserved, receipt sealed.',
      decision: selectionCertificate.decision,
      actionGraph: ['notify client', 'export receipt', 'retain evidence', 'package reusable capability'],
      chronicleEntry,
      reusableCapabilityPackage: ['mission-template', 'criteria-map', 'evidence-checklist', 'receipt-schema'],
      reviewerFrontier: 'human_final'
    },
    ledger: [chronicleEntry]
  };
}
