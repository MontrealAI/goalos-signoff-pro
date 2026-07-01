#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

export const root = process.cwd();
export const siteDir = path.join(root, 'site');
export const artifactsDir = path.join(root, 'artifacts', 'proof-before-settlement-research-lab-v30');
const configPath = path.join(root, 'config', 'proof-before-settlement-research-lab.json');
export const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

export const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[ch]));
export const sha256 = value => crypto.createHash('sha256').update(String(value)).digest('hex');
export const writeJson = (base, name, data) => {
  fs.mkdirSync(base, { recursive: true });
  fs.writeFileSync(path.join(base, name), JSON.stringify(data, null, 2) + '\n');
};
export const copyDir = (src, dest) => {
  if (!fs.existsSync(src)) return false;
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
  return true;
};

export function makeArtifacts(now = new Date().toISOString().replace(/\.\d{3}Z$/, 'Z'), scenario = 'dao-grant-standard') {
  const proofObjects = ['Mission Contract','Evidence Docket','ProofBundle','Replay Log','Validator Report','Risk Ledger','Human Authority Gate','Mission Receipt','Optional Anchor','Chronicle Entry'];
  const acceptancePredicate = {
    id: 'acceptance-predicate-v30',
    expression: 'accept(mission) := mission.exists && evidence.complete && replay.available && validation.passed && risk.bounded && humanAuthority.explicit && receipt.signed && publicBoundary.disclosed',
    plainEnglish: 'A mission is not settlement-ready merely because a result exists. It becomes settlement-ready only when the required proof, replay, validation, risk, authority, receipt, and boundary gates pass.',
    blockedIfMissing: proofObjects.map(name => ({ name, outcome: 'settlement readiness blocked' }))
  };
  const settlementSafetyInvariant = {
    id: 'settlement-safety-invariant-v30',
    invariant: 'No accepted settlement signal without a complete proof package and explicit authority boundary.',
    unsafeShortcuts: ['announcement-only milestone', 'dashboard-only evidence', 'unaudited upgrade claim', 'tweet/thread as proof', 'GitHub commit without acceptance criteria', 'AI-agent output without replay', 'audit badge without remediation packet'],
    safePath: ['mission', 'evidence', 'replay', 'validation', 'risk ledger', 'human signoff', 'signed receipt', 'challenge/appeal route', 'settlement-readiness decision']
  };
  const claimMaturity = [
    { level: 0, state: 'unsubmitted', publicMeaning: 'A claim exists but no proof package has been submitted.' },
    { level: 1, state: 'submitted', publicMeaning: 'Evidence has been provided but not yet validated.' },
    { level: 2, state: 'internally-checked', publicMeaning: 'The project has run completeness and integrity checks.' },
    { level: 3, state: 'review-ready', publicMeaning: 'The proof package is structured enough for external review.' },
    { level: 4, state: 'independently-replayed', publicMeaning: 'A qualified independent party can reproduce or inspect the claim path.' },
    { level: 5, state: 'accepted', publicMeaning: 'Human/governance authority has accepted the claim within stated boundaries.' },
    { level: 6, state: 'anchored-or-receipted', publicMeaning: 'A signed receipt, public hash, or optional anchor records the decision.' },
    { level: 7, state: 'chronicle-admitted', publicMeaning: 'The accepted proof may influence future missions, reputation, or reusable capability.' }
  ];
  const dueDiligenceRubric = {
    id: 'proof-before-settlement-due-diligence-rubric-v30',
    scoring: '0 = missing, 1 = asserted, 2 = documented, 3 = replayable/reviewed, 4 = accepted with signed receipt',
    maximumScore: 40,
    categories: proofObjects.map((name, index) => ({ id: `gate-${String(index+1).padStart(2,'0')}`, name, score: 4, requiredQuestion: `Can the project show the ${name}?` }))
  };
  const executiveTearSheet = {
    id: 'proof-before-settlement-executive-tear-sheet-v30',
    title: config.title,
    coreThesis: config.motto,
    standard: config.tagline,
    targetDecision: 'Should a blockchain project be trusted, funded, upgraded, partnered with, or treated as settlement-ready?',
    answer: 'Only after the proof package exists, passes review, and produces an explicit receipt-bound decision.',
    executiveActions: ['Require proof packages for material milestones.', 'Attach receipts to treasury, grant, audit, and upgrade decisions.', 'Publish public-safe claim boundaries.', 'Use accepted proof as institutional memory, not raw marketing.']
  };
  const adoptionProgram = {
    id: 'proof-before-settlement-adoption-blueprint-v30',
    scenario,
    phases: config.adoptionBlueprint,
    primaryKpi: 'percentage of material claims linked to accepted proof packages',
    secondaryKpis: ['dispute rate', 'time to acceptance decision', 'replay pass rate', 'risk-ledger closure rate', 'receipt coverage', 'number of claims demoted due to missing proof']
  };
  const mandatePack = {
    id: 'proof-before-settlement-mandate-clauses-v30',
    clauses: config.standardClauses,
    modelRequirement: 'Any blockchain project seeking credibility should publish a public-safe proof package for material claims before requesting trust, funds, governance approval, or settlement readiness.'
  };
  const researchTranslationMap = {
    id: 'research-to-product-translation-map-v30',
    translation: [
      { researchConcept: 'work-verification gap', productSurface: 'proof package request card', stakeholderOutcome: 'everyone can ask where the proof is' },
      { researchConcept: 'acceptance predicate', productSurface: 'Signoff Pro gate checklist', stakeholderOutcome: 'settlement readiness becomes auditable' },
      { researchConcept: 'claim-maturity lattice', productSurface: 'public proof dashboard', stakeholderOutcome: 'raw claims cannot masquerade as accepted proof' },
      { researchConcept: 'settlement-safety invariant', productSurface: 'No Proof / No Trust / No Settlement rule', stakeholderOutcome: 'value moves only after proof qualifies' },
      { researchConcept: 'Chronicle admission', productSurface: 'proof-backed institutional memory', stakeholderOutcome: 'future work uses accepted proof, not noise' }
    ]
  };
  const publicManifest = {
    id: config.id,
    version: config.version,
    title: config.title,
    generatedAt: now,
    primaryRoute: config.primaryRoute,
    aliases: config.aliases,
    paperAssets: config.paperAssets,
    artifacts: [
      'proof-before-settlement-research-manifest.json',
      'proof-before-settlement-executive-tear-sheet.json',
      'proof-before-settlement-acceptance-predicate.json',
      'settlement-safety-invariant.json',
      'claim-maturity-lattice-v30.json',
      'proof-before-settlement-due-diligence-rubric.json',
      'proof-before-settlement-adoption-blueprint.json',
      'proof-before-settlement-mandate-clauses.json',
      'research-to-product-translation-map.json',
      'proof-before-settlement-research-demo-bundle.json'
    ],
    posture: config.publicSafePosture,
    boundary: {
      liveSettlement: false,
      walletConnection: false,
      valueMoved: 0,
      legalOrInvestmentAdvice: false,
      externalFactualCertification: false,
      productionAuthority: false
    },
    standard: config.tagline,
    manifestHash: null
  };
  publicManifest.manifestHash = `sha256:${sha256(JSON.stringify(publicManifest))}`;
  const bundle = { manifest: publicManifest, executiveTearSheet, acceptancePredicate, settlementSafetyInvariant, claimMaturity, dueDiligenceRubric, adoptionProgram, mandatePack, researchTranslationMap, researchObjects: config.researchObjects, audienceQuestions: config.audiences };
  bundle.bundleHash = `sha256:${sha256(JSON.stringify(bundle))}`;
  return { manifest: publicManifest, executiveTearSheet, acceptancePredicate, settlementSafetyInvariant, claimMaturity, dueDiligenceRubric, adoptionProgram, mandatePack, researchTranslationMap, bundle };
}
