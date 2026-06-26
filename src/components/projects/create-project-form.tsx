"use client";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, WandSparkles } from "lucide-react";

type CriterionDraft = { key: string; title: string; description: string; required: boolean };

const templates: Record<string, { title: string; summary: string; criteria: Array<Omit<CriterionDraft, "key">> }> = {
  research: { title: "AI Research & Strategy Signoff", summary: "Produce a decision-ready research report with current sources, clear recommendations, and disclosed uncertainty.", criteria: [
    { title: "Required scope is fully covered", description: "Every topic in the brief receives substantive analysis.", required: true },
    { title: "Claims are linked to supporting sources", description: "Material factual claims include traceable evidence.", required: true },
    { title: "Sources meet freshness requirements", description: "Older sources are identified and justified.", required: true },
    { title: "Recommendations are actionable", description: "Each recommendation states rationale and next step.", required: true },
    { title: "Limitations and disagreements are disclosed", description: "Uncertainty, gaps, and assumptions are visible.", required: true }
  ] },
  automation: { title: "AI Workflow Automation Signoff", summary: "Accept a bounded automation only after happy path, failure behavior, override, and rollback evidence are clear.", criteria: [
    { title: "Happy path completes end-to-end", description: "A representative input produces the expected output.", required: true },
    { title: "Failure behavior is tested", description: "Invalid input and unavailable services are documented.", required: true },
    { title: "Human review and override exist", description: "A responsible person can pause, correct, or reject actions.", required: true },
    { title: "Data and permission boundaries are disclosed", description: "Credentials, tools, retention, and third parties are listed.", required: true },
    { title: "Rollback instructions are complete", description: "The prior process can be restored.", required: true }
  ] },
  software: { title: "Software Feature Acceptance Signoff", summary: "Accept software only after requirements, tests, setup steps, screenshots, and known issues are documented.", criteria: [
    { title: "Required features are implemented", description: "Every required feature has an evidence-backed response.", required: true },
    { title: "Automated or manual tests are provided", description: "Test evidence is attached or exclusions are justified.", required: true },
    { title: "Clean setup instructions reproduce the result", description: "A reviewer can install or inspect the product.", required: true },
    { title: "Security-sensitive behavior is disclosed", description: "Secrets, permissions, data retention, and external APIs are documented.", required: true },
    { title: "Known issues and deferred work are visible", description: "Limitations are explicit.", required: true }
  ] },
  content: { title: "Content Campaign Signoff", summary: "Accept AI-assisted marketing content after brand, factual, source, and publication-readiness checks.", criteria: [
    { title: "Final assets are present", description: "All copy, images, landing-page files, or social assets are attached.", required: true },
    { title: "Brand and audience fit is reviewed", description: "Tone and calls to action match the agreed rules.", required: true },
    { title: "Factual claims are supported", description: "Claims include sources or owner approval.", required: true },
    { title: "Risky claims are flagged", description: "Regulated or performance claims are marked for review.", required: true },
    { title: "Publication checklist is complete", description: "Owner, channel, timing, and approvals are recorded.", required: true }
  ] },
  milestone: { title: "Grant / Milestone Acceptance Signoff", summary: "Accept a milestone after scope, deliverables, evidence, budget notes, and public/private boundaries are recorded.", criteria: [
    { title: "Milestone scope matches the award", description: "Work maps to the exact requirement.", required: true },
    { title: "Deliverables are accessible", description: "Public links, private files, repos, or demos are attached.", required: true },
    { title: "Progress evidence is complete", description: "Logs, commits, screenshots, demos, or reports support claims.", required: true },
    { title: "Budget and resource notes are visible", description: "Spend, deferrals, and out-of-scope items are documented.", required: false },
    { title: "Public/private boundaries are clear", description: "Verification does not leak private evidence.", required: true }
  ] }
};

const freshCriterion = (): CriterionDraft => ({ key: crypto.randomUUID(), title: "", description: "", required: true });

export function CreateProjectForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [deadline, setDeadline] = useState("");
  const [visibility, setVisibility] = useState<"private" | "link">("private");
  const [criteria, setCriteria] = useState<CriterionDraft[]>([freshCriterion()]);
  const [state, setState] = useState<{ loading: boolean; error: string | null }>({ loading: false, error: null });
  const valid = useMemo(() => title.trim().length >= 3 && summary.trim().length >= 10 && criteria.length > 0 && criteria.every((criterion) => criterion.title.trim().length >= 3), [title, summary, criteria]);

  function applyTemplate(name: string) {
    const template = templates[name];
    setTitle(template.title);
    setSummary(template.summary);
    setCriteria(template.criteria.map((criterion) => ({ ...criterion, key: crypto.randomUUID() })));
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setState({ loading: true, error: null });
    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          title,
          summary,
          deadline: deadline ? new Date(`${deadline}T23:59:59`).toISOString() : "",
          receipt_visibility: visibility,
          criteria: criteria.map((criterion, position) => ({ title: criterion.title, description: criterion.description, required: criterion.required, position }))
        })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Could not create Signoff.");
      router.push(`/projects/${result.data.projectId}`);
      router.refresh();
    } catch (error) {
      setState({ loading: false, error: error instanceof Error ? error.message : "Could not create Signoff." });
    }
  }

  return <form className="form-card" onSubmit={submit}>
    <div className="stack">
      <div><h2 style={{ fontSize: 28 }}>Start from a useful template</h2><p className="muted">Choose one, then edit anything. Templates are starting points, not hidden rules.</p><div className="row wrap"><button type="button" className="button secondary small" onClick={() => applyTemplate("research")}><WandSparkles size={14} /> Research report</button><button type="button" className="button secondary small" onClick={() => applyTemplate("automation")}><WandSparkles size={14} /> Automation pilot</button><button type="button" className="button secondary small" onClick={() => applyTemplate("software")}><WandSparkles size={14} /> Software feature</button><button type="button" className="button secondary small" onClick={() => applyTemplate("content")}><WandSparkles size={14} /> Content campaign</button><button type="button" className="button secondary small" onClick={() => applyTemplate("milestone")}><WandSparkles size={14} /> Grant milestone</button></div></div>
      <div className="form-grid">
        <div className="field full"><label htmlFor="title">Signoff title</label><input id="title" className="input" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Example: Competitive intelligence report" maxLength={160} required /></div>
        <div className="field full"><label htmlFor="summary">What must be delivered?</label><textarea id="summary" className="textarea" value={summary} onChange={(event) => setSummary(event.target.value)} placeholder="Describe the assignment, intended audience, and expected outcome." maxLength={5000} required /></div>
        <div className="field"><label htmlFor="deadline">Deadline <span className="muted">(optional)</span></label><input id="deadline" className="input" type="date" value={deadline} onChange={(event) => setDeadline(event.target.value)} /></div>
        <div className="field"><label htmlFor="visibility">Receipt verification</label><select id="visibility" className="select" value={visibility} onChange={(event) => setVisibility(event.target.value as "private" | "link")}><option value="private">Project members only (recommended)</option><option value="link">Anyone with the private receipt link</option></select></div>
      </div>
      {visibility === "link" && <div className="notice warning">Anyone who receives the verification link can read the final brief, acceptance criteria, reviewer notes, evidence filenames and hashes, decision, and disclosed limitations. The uploaded files themselves remain private.</div>}
      <div className="row between"><div><h2 style={{ fontSize: 28 }}>Acceptance criteria</h2><p className="muted small">Describe observable conditions a human reviewer can evaluate.</p></div><button type="button" className="button secondary small" onClick={() => setCriteria((current) => [...current, freshCriterion()])}><Plus size={14} /> Add criterion</button></div>
      <div className="criteria-list">{criteria.map((criterion, index) => <div className="criteria-item" key={criterion.key}><div className="row between" style={{ marginBottom: 12 }}><strong>Criterion {index + 1}</strong>{criteria.length > 1 && <button type="button" className="button ghost small" aria-label={`Remove criterion ${index + 1}`} onClick={() => setCriteria((current) => current.filter((item) => item.key !== criterion.key))}><Trash2 size={15} /> Remove</button>}</div><div className="field"><label htmlFor={`criterion-${criterion.key}`}>Requirement</label><input id={`criterion-${criterion.key}`} className="input" value={criterion.title} onChange={(event) => setCriteria((current) => current.map((item) => item.key === criterion.key ? { ...item, title: event.target.value } : item))} placeholder="Example: Every material claim has a source" maxLength={240} required /></div><div className="field" style={{ marginTop: 12 }}><label htmlFor={`description-${criterion.key}`}>How should it be evaluated?</label><textarea id={`description-${criterion.key}`} className="textarea" style={{ minHeight: 78 }} value={criterion.description} onChange={(event) => setCriteria((current) => current.map((item) => item.key === criterion.key ? { ...item, description: event.target.value } : item))} placeholder="Explain what evidence or observation is sufficient." maxLength={4000} /></div><label className="checkbox" style={{ marginTop: 12 }}><input type="checkbox" checked={criterion.required} onChange={(event) => setCriteria((current) => current.map((item) => item.key === criterion.key ? { ...item, required: event.target.checked } : item))} /> Required for acceptance</label></div>)}</div>
      <div className="notice">GoalOS will freeze this brief as version 1. Later submissions will be evaluated against these exact criteria.</div>
      {state.error && <div className="notice error">{state.error}</div>}
      <div className="form-actions"><button className="button" disabled={!valid || state.loading}>{state.loading ? "Creating…" : "Create Signoff"}</button></div>
    </div>
  </form>;
}
