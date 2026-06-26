"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, RotateCcw, X } from "lucide-react";
import { requestJson } from "@/lib/client-api";

export function DecisionForm({ submissionId }: { submissionId: string }) {
  const router = useRouter();
  const [decision, setDecision] = useState<"accepted" | "changes_requested" | "rejected">("accepted");
  const [comment, setComment] = useState("");
  const [state, setState] = useState<{ loading: boolean; error: string | null; warning: string | null }>({ loading: false, error: null, warning: null });
  async function submit(event: React.FormEvent) {
    event.preventDefault(); setState({ loading: true, error: null, warning: null });
    try {
      const result = await requestJson<{ receiptPending?: boolean; warning?: string }>(`/api/submissions/${submissionId}/decision`, { method: "POST", body: JSON.stringify({ decision, comment }) });
      setState({ loading: false, error: null, warning: result.warning ?? null });
      router.refresh();
    } catch (error) { setState({ loading: false, error: error instanceof Error ? error.message : "Could not record final decision.", warning: null }); }
  }
  const icon = decision === "accepted" ? <Check size={16} /> : decision === "changes_requested" ? <RotateCcw size={16} /> : <X size={16} />;
  return <form className="card elevated" onSubmit={submit}><h3>Client final decision</h3><p className="muted small">This is the authoritative acceptance decision recorded in the Mission Receipt.</p><div className="field"><label htmlFor="decision">Decision</label><select id="decision" className="select" value={decision} onChange={(event) => setDecision(event.target.value as typeof decision)}><option value="accepted">Accept delivery</option><option value="changes_requested">Request changes</option><option value="rejected">Reject delivery</option></select></div><div className="field" style={{ marginTop: 12 }}><label htmlFor="decision-comment">Decision rationale</label><textarea id="decision-comment" className="textarea" required minLength={3} value={comment} onChange={(event) => setComment(event.target.value)} placeholder="Explain why the package is accepted, needs revision, or is rejected." /></div>{state.error && <div className="notice error" style={{ marginTop: 12 }}>{state.error}</div>}{state.warning && <div className="notice warning" style={{ marginTop: 12 }}>{state.warning}</div>}<div className="form-actions"><button className={`button ${decision === "rejected" ? "danger" : ""}`} disabled={state.loading || comment.trim().length < 3}>{state.loading ? "Recording…" : <>{icon} Record final decision</>}</button></div></form>;
}
