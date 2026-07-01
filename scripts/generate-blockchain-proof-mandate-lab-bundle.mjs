#!/usr/bin/env node
import { artifactsDir, makeArtifacts, writeJson } from './blockchain-proof-mandate-lab-core.mjs';

const scenario = process.argv[2] || process.env.GOALOS_PROOF_MANDATE_SCENARIO || 'dao-grant-payout';
const now = new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');
const artifacts = makeArtifacts(now, scenario);
for (const [name, data] of [
  ['blockchain-proof-mandate-lab-manifest.json', artifacts.manifest],
  ['proof-package-request-card.json', artifacts.proofRequestCard],
  ['stakeholder-requirement-map.json', artifacts.stakeholderRequirementMap],
  ['blockchain-due-diligence-scorecard.json', artifacts.dueDiligenceScorecard],
  ['dao-proof-requirement-policy.json', artifacts.daoPolicyTemplate],
  ['grant-treasury-rfp-proof-template.json', artifacts.rfpTemplate],
  ['settlement-readiness-decision-tree.json', artifacts.decisionTree],
  ['public-proof-dashboard-schema.json', artifacts.dashboardSchema],
  ['blockchain-proof-mandate-demo-bundle.json', artifacts.bundle]
]) writeJson(artifactsDir, name, data);
console.log(`GoalOS Blockchain Proof Mandate Lab v29 bundle generated for scenario=${scenario} at ${artifactsDir}`);
