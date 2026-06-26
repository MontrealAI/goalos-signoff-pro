export type GoalOSTemplateId = "ai_research" | "ai_automation" | "software_delivery" | "content_marketing" | "grant_milestone";

export type GoalOSTemplateCriterion = {
  title: string;
  description: string;
  required: boolean;
  evidence: string[];
};

export type GoalOSTemplate = {
  id: GoalOSTemplateId;
  category: string;
  title: string;
  shortTitle: string;
  summary: string;
  bestFor: string;
  buyerPromise: string;
  criteria: GoalOSTemplateCriterion[];
  reviewerChecklist: string[];
  pricingHint: string;
};

export const goalosTemplates: GoalOSTemplate[] = [
  {
    id: "ai_research",
    category: "AI research and strategy",
    title: "AI Research & Strategy Signoff",
    shortTitle: "Research report",
    summary: "Produce a decision-ready research or strategy deliverable with current sources, visible uncertainty, and a clear recommendation.",
    bestFor: "AI consultants, analysts, founders, investor memos, market research, board prep.",
    buyerPromise: "Know whether the report is evidence-backed enough to accept, share, or invoice.",
    pricingHint: "Good starter paid template: $99 independent review or included in Pro.",
    criteria: [
      { title: "Required scope is fully covered", description: "Every topic and question named in the brief receives a substantive answer.", required: true, evidence: ["Final report", "scope matrix"] },
      { title: "Claims are linked to supporting sources", description: "Material factual claims include traceable citations or source notes.", required: true, evidence: ["source list", "claim-source table"] },
      { title: "Sources meet freshness requirements", description: "The agreed freshness window is met or older sources are justified.", required: true, evidence: ["source date export", "links"] },
      { title: "Recommendations are actionable", description: "Each recommendation includes rationale, owner, cost/risk notes, and next step.", required: true, evidence: ["recommendation section"] },
      { title: "Uncertainty and disagreements are disclosed", description: "Missing evidence, assumptions, disagreement, and limitations are visible.", required: true, evidence: ["limitations section"] }
    ],
    reviewerChecklist: ["Open at least three cited sources", "Check whether the core recommendation follows from evidence", "Confirm no scope item is missing", "Confirm uncertainty is visible"],
  },
  {
    id: "ai_automation",
    category: "AI automation delivery",
    title: "AI Workflow Automation Signoff",
    shortTitle: "Automation pilot",
    summary: "Accept a bounded AI automation only after the happy path, failure path, human override, and rollback evidence are clear.",
    bestFor: "No-code automations, agent workflows, support triage, sales ops, internal productivity pilots.",
    buyerPromise: "Know whether the automation is safe enough to use in the agreed environment.",
    pricingHint: "Best initial package: $249 setup + $99 review.",
    criteria: [
      { title: "Happy path completes end-to-end", description: "A representative input completes the entire workflow with the expected output.", required: true, evidence: ["screen recording", "run log", "sample input/output"] },
      { title: "Failure behavior is tested", description: "Invalid input, unavailable services, and partial failure behavior are documented.", required: true, evidence: ["failure test notes"] },
      { title: "Human review and override exist", description: "A responsible person can pause, correct, approve, or reject outputs.", required: true, evidence: ["operator instructions"] },
      { title: "Data and permission boundaries are disclosed", description: "Inputs, outputs, tools, credentials, retention, and third parties are listed.", required: true, evidence: ["data flow diagram"] },
      { title: "Rollback instructions are complete", description: "The client can disable the automation and restore the previous process.", required: true, evidence: ["rollback runbook"] }
    ],
    reviewerChecklist: ["Run one representative case", "Read the rollback instructions", "Confirm no secret is exposed", "Check human override is practical"],
  },
  {
    id: "software_delivery",
    category: "Software and product delivery",
    title: "Software Feature Acceptance Signoff",
    shortTitle: "Software feature",
    summary: "Accept software when the requirements, tests, install steps, screenshots, and known issues are documented.",
    bestFor: "Freelance software, AI-coded features, internal tools, prototype handoff.",
    buyerPromise: "Know exactly which build was accepted and what evidence came with it.",
    pricingHint: "Good Pro plan retention wedge for agencies.",
    criteria: [
      { title: "Required features are implemented", description: "Every required feature has an evidence-backed response.", required: true, evidence: ["feature demo", "screenshots"] },
      { title: "Automated or manual tests are provided", description: "Test evidence is attached or exclusions are clearly justified.", required: true, evidence: ["test output", "QA checklist"] },
      { title: "Clean setup instructions reproduce the result", description: "A reviewer can install, run, or inspect the product from the instructions.", required: true, evidence: ["README", "install log"] },
      { title: "Security-sensitive behavior is disclosed", description: "Secrets, permissions, data retention, external APIs, and admin paths are documented.", required: true, evidence: ["security notes"] },
      { title: "Known issues and deferred work are visible", description: "Limitations are not hidden inside chat or informal messages.", required: true, evidence: ["known issues list"] }
    ],
    reviewerChecklist: ["Open the exact accepted build", "Check test evidence", "Read known issues", "Confirm sensitive behavior is documented"],
  },
  {
    id: "content_marketing",
    category: "Content and marketing",
    title: "Content Campaign Signoff",
    shortTitle: "Content campaign",
    summary: "Accept AI-assisted content only after brand, factual, source, legal-review, and publication-readiness checks are complete.",
    bestFor: "Marketing agencies, founder-led content, launch pages, thought leadership.",
    buyerPromise: "Know which copy was approved, what claims it makes, and what still needs legal or brand review.",
    pricingHint: "Good team plan template for agencies.",
    criteria: [
      { title: "Final assets are present", description: "All copy, images, landing-page files, or social assets are attached.", required: true, evidence: ["asset bundle"] },
      { title: "Brand and audience fit is reviewed", description: "Tone, claims, and calls to action match the agreed audience and brand rules.", required: true, evidence: ["brand checklist"] },
      { title: "Factual claims are supported", description: "Claims about product, customers, competitors, or performance include sources or owner approval.", required: true, evidence: ["claim review table"] },
      { title: "Risky claims are flagged", description: "Financial, medical, legal, safety, or performance claims are flagged for appropriate review.", required: true, evidence: ["risk notes"] },
      { title: "Publication checklist is complete", description: "Owner, channel, timing, assets, and outstanding approvals are recorded.", required: true, evidence: ["launch checklist"] }
    ],
    reviewerChecklist: ["Review every public claim", "Confirm channel and owner", "Check risk notes", "Confirm final asset bundle"],
  },
  {
    id: "grant_milestone",
    category: "Grant and milestone review",
    title: "Grant / Milestone Acceptance Signoff",
    shortTitle: "Grant milestone",
    summary: "Accept a milestone only after scope, deliverables, evidence, budget notes, and public/private boundaries are recorded.",
    bestFor: "DAOs, grant programs, accelerators, research labs, internal milestone funding.",
    buyerPromise: "Make milestone acceptance transparent without forcing escrow on day one.",
    pricingHint: "Best Web3-native pilot wedge; add optional verified receipt.",
    criteria: [
      { title: "Milestone scope matches the award", description: "The submitted work maps to the exact milestone or grant requirement.", required: true, evidence: ["milestone mapping"] },
      { title: "Deliverables are accessible", description: "Public links, private files, repos, or demos are attached and fingerprinted.", required: true, evidence: ["deliverable bundle"] },
      { title: "Progress evidence is complete", description: "Logs, commits, screenshots, demos, or reports support the claimed progress.", required: true, evidence: ["progress evidence"] },
      { title: "Budget and resource notes are visible", description: "The reviewer can understand what was spent, deferred, or out of scope.", required: false, evidence: ["budget notes"] },
      { title: "Public/private boundaries are clear", description: "The receipt can be verified without leaking sensitive private evidence.", required: true, evidence: ["redaction notes"] }
    ],
    reviewerChecklist: ["Compare with grant scope", "Open public deliverables", "Verify private evidence was not over-shared", "Confirm acceptance is bounded"],
  }
];

export function findGoalOSTemplate(id: string | null | undefined) {
  return goalosTemplates.find((template) => template.id === id) ?? null;
}
