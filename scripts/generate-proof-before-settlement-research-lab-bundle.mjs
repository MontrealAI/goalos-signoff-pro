#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { root, artifactsDir, makeArtifacts, writeJson, copyDir } from './proof-before-settlement-research-lab-core.mjs';

const now = new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');
const artifacts = makeArtifacts(now, process.env.GOALOS_PROOF_BEFORE_SETTLEMENT_SCENARIO || process.argv[2] || 'dao-grant-standard');
fs.mkdirSync(artifactsDir, { recursive: true });
for (const [name, data] of [
  ['proof-before-settlement-research-manifest.json', artifacts.manifest],
  ['proof-before-settlement-executive-tear-sheet.json', artifacts.executiveTearSheet],
  ['proof-before-settlement-acceptance-predicate.json', artifacts.acceptancePredicate],
  ['settlement-safety-invariant.json', artifacts.settlementSafetyInvariant],
  ['claim-maturity-lattice-v30.json', artifacts.claimMaturity],
  ['proof-before-settlement-due-diligence-rubric.json', artifacts.dueDiligenceRubric],
  ['proof-before-settlement-adoption-blueprint.json', artifacts.adoptionProgram],
  ['proof-before-settlement-mandate-clauses.json', artifacts.mandatePack],
  ['research-to-product-translation-map.json', artifacts.researchTranslationMap],
  ['proof-before-settlement-research-demo-bundle.json', artifacts.bundle]
]) writeJson(artifactsDir, name, data);
copyDir(path.join(root, 'public', 'research', 'proof-before-settlement'), path.join(artifactsDir, 'research', 'proof-before-settlement'));
console.log(`GoalOS v30 proof-before-settlement research artifact bundle written to ${artifactsDir}`);
