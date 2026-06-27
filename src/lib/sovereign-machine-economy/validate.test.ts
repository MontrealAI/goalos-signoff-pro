import { describe, expect, it } from 'vitest';
import { buildDemoSovereignMachineEconomyState } from './canonical';
import { evaluateSovereignMachineEconomyState } from './validate';

describe('sovereign machine economy state', () => {
  it('keeps the canonical demo in a reviewable accepted state', () => {
    const state = buildDemoSovereignMachineEconomyState();
    const evaluation = evaluateSovereignMachineEconomyState(state);
    expect(evaluation.ok).toBe(true);
    expect(evaluation.blocked).toEqual([]);
    expect(state.decisionState.reviewerFrontier).toBe('human_final');
  });
});
