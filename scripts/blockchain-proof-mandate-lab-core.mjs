import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

export const root = process.cwd();
export const scriptDir = path.dirname(fileURLToPath(import.meta.url));
export const configPath = fs.existsSync(path.join(root, 'config', 'blockchain-proof-mandate-lab.json'))
  ? path.join(root, 'config', 'blockchain-proof-mandate-lab.json')
  : path.join(scriptDir, '..', 'config', 'blockchain-proof-mandate-lab.json');
export const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
export const siteDir = path.join(root, 'site');
export const artifactsDir = path.join(root, 'artifacts', 'blockchain-proof-mandate-lab-v29');
export const digest = value => crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex');
export const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));

export function selectedScenario(id = process.env.GOALOS_PROOF_MANDATE_SCENARIO || process.argv[2] || 'dao-grant-payout') {
  return config.scenarios.find(s => s.id === id) || config.scenarios[0];
}

export function requirementScore(requirement, index) {
  const weights = Object.values(config.scoreWeights);
  return weights[index % weights.length];
}

export function makeArtifacts(now = new Date().toISOString(), scenarioId = process.env.GOALOS_PROOF_MANDATE_SCENARIO || 'dao-grant-payout') {
  const scenario = selectedScenario(scenarioId);
  const proofRequestCard = {
    type: 'GoalOSProofPackageRequestCardV29',
    version: config.version,
    motto: config.motto,
    oneLiner: config.oneLiner,
    copyPasteAsk: 'Before we trust, fund, list, vote, approve, settle, or promote this blockchain claim: where is the proof package?',
    requiredPackage: config.proofRequirements.map((r, index) => ({ order: index + 1, ...r, weight: requirementScore(r, index), requirementRoot: `sha256:${digest(r).slice(0, 32)}` })),
    publicSafeUse: 'Copy this into DAO proposals, grant reviews, partner diligence, audit closeout, treasury approvals, and community questions.',
    valueMoved: 0,
    noWallet: true,
    noUserData: true
  };

  const stakeholderRequirementMap = {
    type: 'GoalOSStakeholderRequirementMapV29',
    version: config.version,
    message: 'Every stakeholder can ask the same simple question, then require the same proof package before trust escalates.',
    stakeholders: config.stakeholders.map((s, index) => ({ order: index + 1, ...s, defaultGate: 'proof package required', escalation: 'No proof package → hold trust, funding, governance, settlement, or public reliance.' })),
    valueMoved: 0
  };

  const dueDiligenceScorecard = {
    type: 'GoalOSBlockchainDueDiligenceScorecardV29',
    version: config.version,
    selectedScenario: scenario,
    scoringRule: 'Require at least 85/100 plus human authority and receipt before settlement readiness.',
    weights: config.scoreWeights,
    candidates: [
      { id: 'announcement-only', name: 'Announcement-only project', mission: 0, evidence: 5, replay: 0, validation: 0, risk: 0, authority: 0, receipt: 0, state: 'CLAIM_ONLY' },
      { id: 'partial-evidence', name: 'Partial evidence project', mission: 12, evidence: 14, replay: 5, validation: 0, risk: 3, authority: 0, receipt: 0, state: 'EVIDENCE_SUBMITTED' },
      { id: 'goalos-proof-package', name: 'GoalOS proof-package project', mission: 15, evidence: 20, replay: 15, validation: 20, risk: 10, authority: 10, receipt: 10, state: 'RECEIPT_READY' }
    ].map(c => ({ ...c, score: c.mission + c.evidence + c.replay + c.validation + c.risk + c.authority + c.receipt, verdict: c.state === 'RECEIPT_READY' ? 'credibility-ready in this public demo' : c.state === 'CLAIM_ONLY' ? 'do not rely yet' : 'hold pending validation, authority, and receipt' })),
    valueMoved: 0
  };

  const daoPolicyTemplate = {
    type: 'GoalOSDAOProofRequirementPolicyTemplateV29',
    version: config.version,
    title: 'No proof package, no payout, no upgrade, no closure, no serious trust.',
    policyClauses: [
      'Every material funding, upgrade, grant, audit-remediation, RWA, AI-agent, or treasury claim must link to a proof package.',
      'A proof package must include mission contract, evidence docket, replay path, validator review, risk ledger, human authority, and signed receipt.',
      'Announcement-only claims remain CLAIM_ONLY and cannot trigger settlement readiness.',
      'Partial evidence may enter review but remains on hold until validation, authority, and receipt are complete.',
      'Public dashboards may show proof status, claim maturity, challenge state, and receipt hash without exposing private or confidential data.'
    ],
    defaultMotion: 'Resolved: this organization requires a GoalOS-style proof package before material trust, payout, governance approval, or settlement readiness.',
    valueMoved: 0
  };

  const rfpTemplate = {
    type: 'GoalOSGrantTreasuryRFPProofTemplateV29',
    version: config.version,
    title: 'Proof Package Requirement for Blockchain Vendors, Grantees, and Partners',
    instructions: 'Attach this requirement to grants, RFPs, milestone agreements, partner approvals, and treasury vendor scopes.',
    requiredFields: config.proofRequirements.map(r => ({ field: r.label, whyItMatters: r.plainEnglish, missingResult: r.blockIfMissing })),
    acceptanceLanguage: 'Payment, recognition, launch support, listing support, public endorsement, or governance readiness should not proceed until the receipt-ready proof package is complete.',
    valueMoved: 0
  };

  const decisionTree = {
    type: 'GoalOSSettlementReadinessDecisionTreeV29',
    version: config.version,
    selectedScenario: scenario.id,
    steps: config.decisionStates.map((d, index) => ({ order: index + 1, ...d, nextAction: d.state === 'RECEIPT_READY' ? 'Consider settlement readiness under applicable governance and law.' : 'Request missing proof and keep irreversible action paused.' })),
    hardStops: ['no proof package', 'no replay path for high-stakes claims', 'no validator review', 'unresolved critical risk', 'no human authority', 'no signed receipt'],
    valueMoved: 0
  };

  const dashboardSchema = {
    type: 'GoalOSPublicProofDashboardSchemaV29',
    version: config.version,
    purpose: 'A corporate-friendly public dashboard schema that lets stakeholders see proof status without exposing private data.',
    columns: ['project', 'claim', 'mission', 'evidence', 'replay', 'validation', 'risk', 'authority', 'receipt', 'decision_state', 'last_reviewed', 'public_proof_url'],
    exampleRow: {
      project: 'Synthetic Blockchain Project',
      claim: scenario.trustEvent,
      mission: 'present',
      evidence: 'present',
      replay: 'present',
      validation: 'passed in public demo',
      risk: 'bounded',
      authority: 'recorded',
      receipt: 'synthetic receipt ready',
      decision_state: 'RECEIPT_READY',
      public_proof_url: config.primaryRoute
    },
    publicSafeFieldsOnly: true,
    valueMoved: 0
  };

  const manifest = {
    id: config.id,
    title: config.title,
    version: config.version,
    generatedAt: now,
    primaryRoute: config.primaryRoute,
    aliases: config.aliases,
    routes: [config.primaryRoute, ...config.aliases],
    artifacts: [
      'blockchain-proof-mandate-lab-manifest.json',
      'proof-package-request-card.json',
      'stakeholder-requirement-map.json',
      'blockchain-due-diligence-scorecard.json',
      'dao-proof-requirement-policy.json',
      'grant-treasury-rfp-proof-template.json',
      'settlement-readiness-decision-tree.json',
      'public-proof-dashboard-schema.json',
      'blockchain-proof-mandate-demo-bundle.json'
    ],
    motto: config.motto,
    tagline: config.tagline,
    canonicalHash: `sha256:${digest({ proofRequestCard, stakeholderRequirementMap, dueDiligenceScorecard, decisionTree }).slice(0, 48)}`,
    boundary: config.boundary,
    valueMoved: 0
  };

  const bundle = {
    type: 'GoalOSSignoffProBlockchainProofMandateLabV29Bundle',
    generatedAt: now,
    manifest,
    proofRequestCard,
    stakeholderRequirementMap,
    dueDiligenceScorecard,
    daoPolicyTemplate,
    rfpTemplate,
    decisionTree,
    dashboardSchema,
    receipt: {
      type: 'SyntheticProofMandateReceiptV29',
      receiptId: `receipt-v29-${digest({ scenario: scenario.id, now }).slice(0, 18)}`,
      decisionState: 'RECEIPT_READY_SYNTHETIC_PUBLIC_DEMO',
      statement: 'This lab demonstrates how stakeholders can require proof packages before trust, funding, governance, reputation, or settlement readiness.',
      receiptRoot: `sha256:${digest({ manifest, dueDiligenceScorecard }).slice(0, 48)}`,
      signerBoundary: 'Synthetic public demonstration receipt only.',
      valueMoved: 0,
      noUserData: true,
      noWallet: true
    }
  };

  return { manifest, proofRequestCard, stakeholderRequirementMap, dueDiligenceScorecard, daoPolicyTemplate, rfpTemplate, decisionTree, dashboardSchema, bundle };
}

export function writeJson(dir, name, data) {
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, name), JSON.stringify(data, null, 2) + '\n');
}
