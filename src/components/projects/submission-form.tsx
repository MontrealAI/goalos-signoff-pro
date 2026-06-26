"use client";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Send, TriangleAlert, XCircle } from "lucide-react";
import type { AcceptanceCriterion, Artifact, CriterionResponse, Submission } from "@/lib/domain";
import { canSubmit, runMechanicalChecks } from "@/lib/checks/mechanical";
import { requestJson } from "@/lib/client-api";
import { StatusBadge } from "@/components/ui/status-badge";

function buildInitialResponses(criteria: AcceptanceCriterion[], previous: CriterionResponse[]): CriterionResponse[] {
  const prior = new Map(previous.map((response) => [response.criterion_id, response]));
  return criteria.map((criterion) => prior.get(criterion.id) ?? { criterion_id: criterion.id, status: "met", response: "", artifact_ids: [] });
}

export function SubmissionForm({ projectId, criteria, artifacts, previousSubmission, previousResponses }: { projectId: string; criteria: AcceptanceCriterion[]; artifacts: Artifact[]; previousSubmission: Submission | null; previousResponses: CriterionResponse[] }) {
  const router = useRouter();
  const [summary, setSummary] = useState(previousSubmission?.summary ?? "");
  const [limitations, setLimitations] = useState(previousSubmission?.limitations ?? "No material limitations are currently known.");
  const [aiUseNotes, setAiUseNotes] = useState(previousSubmission?.ai_use_notes ?? "Describe whether AI was used, what it did, and what a human reviewed.");
  const [responses, setResponses] = useState<CriterionResponse[]>(() => buildInitialResponses(criteria, previousResponses));
  const [state, setState] = useState<{ loading: boolean; error: string | null; success: string | null }>({ loading: false, error: null, success: null });
  const selectedIds = useMemo(() => [...new Set(responses.flatMap((response) => response.artifact_ids))], [responses]);
  const selectedArtifacts = useMemo(() => artifacts.filter((artifact) => selectedIds.includes(artifact.id)), [artifacts, selectedIds]);
  const checks = useMemo(() => runMechanicalChecks({ criteria, responses, artifacts: selectedArtifacts, summary, limitations, aiUseNotes }), [criteria, responses, selectedArtifacts, summary, limitations, aiUseNotes]);
  const ready = canSubmit(checks);

  function updateResponse(criterionId: string, patch: Partial<CriterionResponse>) {
    setResponses((current) => current.map((response) => response.criterion_id === criterionId ? { ...response, ...patch } : response));
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setState({ loading: true, error: null, success: null });
    try {
      const result = await requestJson<{ submissionId: string }>(`/api/projects/${projectId}/submissions`, { method: "POST", body: JSON.stringify({ summary, limitations, aiUseNotes, artifactIds: selectedIds, responses }) });
      setState({ loading: false, error: null, success: `Submission ${result.submissionId.slice(0, 8)} was sent for review.` });
      router.refresh();
    } catch (error) {
      setState({ loading: false, error: error instanceof Error ? error.message : "Could not submit the package.", success: null });
    }
  }

  return <form className="stack" onSubmit={submit}>
    {previousSubmission && <div className="notice warning">You are preparing a new revision from submission v{previousSubmission.version}. The prior record remains preserved.</div>}
    <div className="card"><h3>Delivery declaration</h3><div className="form-grid" style={{ marginTop: 16 }}><div className="field full"><label htmlFor="delivery-summary">What was delivered?</label><textarea id="delivery-summary" className="textarea" value={summary} onChange={(event) => setSummary(event.target.value)} placeholder="Summarize the completed work and the result." /></div><div className="field full"><label htmlFor="limitations">Limitations and unresolved issues</label><textarea id="limitations" className="textarea" value={limitations} onChange={(event) => setLimitations(event.target.value)} placeholder="State what remains uncertain, incomplete, or out of scope." /></div><div className="field full"><label htmlFor="ai-use">AI-use and human-review disclosure</label><textarea id="ai-use" className="textarea" value={aiUseNotes} onChange={(event) => setAiUseNotes(event.target.value)} placeholder="Explain where AI was used and what received human review." /></div></div></div>
    <div className="card"><div className="row between"><div><h3>Map evidence to every criterion</h3><p className="muted small">A file may support more than one criterion.</p></div><span className="status">{selectedArtifacts.length} files selected</span></div><div className="criteria-list" style={{ marginTop: 16 }}>{criteria.map((criterion, index) => { const response = responses.find((item) => item.criterion_id === criterion.id)!; return <div className="criteria-item" key={criterion.id}><div className="row between"><div><strong>{index + 1}. {criterion.title}</strong>{criterion.required && <span className="status" style={{ marginLeft: 8 }}>required</span>}</div><select className="select" style={{ width: 170 }} value={response.status} onChange={(event) => updateResponse(criterion.id, { status: event.target.value as CriterionResponse["status"] })}><option value="met">Met</option><option value="partial">Partially met</option><option value="not_met">Not met</option><option value="not_applicable">Not applicable</option></select></div>{criterion.description && <p className="muted small">{criterion.description}</p>}<div className="field"><label htmlFor={`response-${criterion.id}`}>Builder response</label><textarea id={`response-${criterion.id}`} className="textarea" style={{ minHeight: 82 }} value={response.response} onChange={(event) => updateResponse(criterion.id, { response: event.target.value })} placeholder="Explain how the delivery satisfies this criterion." /></div><div className="field" style={{ marginTop: 12 }}><label>Supporting evidence</label>{artifacts.length === 0 ? <div className="notice warning">Upload at least one evidence file first.</div> : <div className="grid-2">{artifacts.map((artifact) => <label className="checkbox artifact-item" key={`${criterion.id}-${artifact.id}`}><input type="checkbox" checked={response.artifact_ids.includes(artifact.id)} onChange={(event) => updateResponse(criterion.id, { artifact_ids: event.target.checked ? [...response.artifact_ids, artifact.id] : response.artifact_ids.filter((id) => id !== artifact.id) })} /><span><strong>{artifact.filename}</strong><span className="small muted" style={{ display: "block" }}>{artifact.description || "Evidence artifact"}</span></span></label>)}</div>}</div></div>; })}</div></div>
    <div className="card"><div className="row between"><div><h3>Automatic readiness checks</h3><p className="muted small">These checks test completeness and integrity, not external factual truth.</p></div><StatusBadge status={ready ? "pass" : "fail"} /></div><div className="check-list" style={{ marginTop: 16 }}>{checks.map((check) => <div className="check-item row" key={check.code}>{check.status === "pass" ? <CheckCircle2 size={18} color="#17643c" /> : check.status === "warning" ? <TriangleAlert size={18} color="#996515" /> : <XCircle size={18} color="#9f3030" />}<div><strong>{check.label}</strong><div className="small muted">{check.detail}</div></div></div>)}</div></div>
    {state.error && <div className="notice error">{state.error}</div>}{state.success && <div className="notice">{state.success}</div>}
    <div className="form-actions"><button className="button" disabled={!ready || state.loading}>{state.loading ? "Submitting…" : <><Send size={16} /> Submit for review</>}</button></div>
  </form>;
}
