"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ClipboardCheck } from "lucide-react";
import { requestJson } from "@/lib/client-api";

export function ReviewForm({ submissionId }: { submissionId: string }) {
  const router = useRouter();
  const [recommendation, setRecommendation] = useState<"accept" | "changes_requested" | "reject">("accept");
  const [notes, setNotes] = useState("");
  const [state, setState] = useState<{ loading: boolean; error: string | null }>({ loading: false, error: null });
  async function submit(event: React.FormEvent) {
    event.preventDefault(); setState({ loading: true, error: null });
    try { await requestJson(`/api/submissions/${submissionId}/reviews`, { method: "POST", body: JSON.stringify({ recommendation, notes }) }); setState({ loading: false, error: null }); router.refresh(); }
    catch (error) { setState({ loading: false, error: error instanceof Error ? error.message : "Could not record review." }); }
  }
  return <form className="card" onSubmit={submit}><div className="row"><span className="icon-box" style={{ margin: 0 }}><ClipboardCheck size={19} /></span><div><h3>Reviewer recommendation</h3><p className="muted small" style={{ margin: 0 }}>The client retains authority over the final decision.</p></div></div><div className="field" style={{ marginTop: 16 }}><label htmlFor="recommendation">Recommendation</label><select id="recommendation" className="select" value={recommendation} onChange={(event) => setRecommendation(event.target.value as typeof recommendation)}><option value="accept">Recommend acceptance</option><option value="changes_requested">Recommend changes</option><option value="reject">Recommend rejection</option></select></div><div className="field" style={{ marginTop: 12 }}><label htmlFor="review-notes">Review notes</label><textarea id="review-notes" className="textarea" required minLength={3} value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Explain the evidence reviewed, concerns, and rationale." /></div>{state.error && <div className="notice error" style={{ marginTop: 12 }}>{state.error}</div>}<div className="form-actions"><button className="button" disabled={state.loading || notes.trim().length < 3}>{state.loading ? "Recording…" : "Record recommendation"}</button></div></form>;
}
