import type { EvidenceDocket, GoalOSCommit, SelectionCertificate, SovereignMachineEconomyState } from './types';

export interface GateEvaluation {
  ok: boolean;
  passed: string[];
  blocked: string[];
  warnings: string[];
}

export function evaluateGoalOSCommit(commit: GoalOSCommit): GateEvaluation {
  const blocked: string[] = [];
  const warnings: string[] = [];

  if (!commit.objective.trim()) blocked.push('objective missing');
  if (commit.successCriteria.length === 0) blocked.push('success criteria missing');
  if (commit.requiredEvaluators.length === 0) blocked.push('required evaluator missing');
  if (!commit.authority.toLowerCase().includes('reviewer') && !commit.authority.toLowerCase().includes('client')) {
    warnings.push('terminal human authority not obvious in authority text');
  }
  if (!commit.dataBoundary.toLowerCase().includes('private')) warnings.push('data boundary should mention private data treatment');

  return {
    ok: blocked.length === 0,
    passed: ['objective', 'criteria', 'authority', 'dataBoundary'].filter((gate) => !blocked.some((item) => item.includes(gate))),
    blocked,
    warnings
  };
}

export function evaluateEvidenceDocket(docket: EvidenceDocket): GateEvaluation {
  const blocked: string[] = [];
  const warnings: string[] = [];

  if (!docket.manifest) blocked.push('manifest missing');
  if (docket.claimsMatrix.length === 0) blocked.push('claims matrix missing');
  if (docket.proofPackets.length === 0) blocked.push('proof packet missing');
  if (docket.evaluatorAttestations.length === 0) blocked.push('evaluator attestation missing');
  if (docket.replayPath.length === 0) blocked.push('replay path missing');
  if (docket.riskLedger.length === 0) warnings.push('risk ledger should not be empty');
  if (docket.costLedger.length === 0) warnings.push('cost ledger should not be empty');

  return {
    ok: blocked.length === 0,
    passed: ['manifest', 'claimsMatrix', 'proofPackets', 'attestations', 'replayPath'].filter((gate) => !blocked.some((item) => item.toLowerCase().includes(gate.toLowerCase()))),
    blocked,
    warnings
  };
}

export function evaluateSelectionCertificate(certificate: SelectionCertificate): GateEvaluation {
  const blocked = Object.entries(certificate.gates)
    .filter(([, state]) => state !== 'passed')
    .map(([gate, state]) => `${gate}: ${state}`);

  const warnings: string[] = [];
  if (certificate.decision === 'accept' && !certificate.signer) blocked.push('accept decision missing signer');
  if (certificate.decision === 'accept' && !certificate.rollbackTarget) warnings.push('accepted packages should retain rollback target');

  return {
    ok: blocked.length === 0,
    passed: Object.keys(certificate.gates).filter((gate) => certificate.gates[gate] === 'passed'),
    blocked,
    warnings
  };
}

export function evaluateSovereignMachineEconomyState(state: SovereignMachineEconomyState): GateEvaluation {
  const evaluations = [
    evaluateGoalOSCommit(state.goalOSCommit),
    evaluateEvidenceDocket(state.evidenceDocket),
    evaluateSelectionCertificate(state.selectionCertificate)
  ];

  const blocked = evaluations.flatMap((evaluation) => evaluation.blocked);
  const warnings = evaluations.flatMap((evaluation) => evaluation.warnings);
  const passed = evaluations.flatMap((evaluation) => evaluation.passed);

  if (state.decisionState.reviewerFrontier !== 'human_final' && state.decisionState.reviewerFrontier !== 'institutional_board') {
    warnings.push('reviewer frontier should be explicit for institutional acceptance');
  }

  return {
    ok: blocked.length === 0,
    passed,
    blocked,
    warnings
  };
}
