import { AlertTriangle, CheckCircle2, Sparkles } from "lucide-react";
import type { AcceptanceCriterion, Artifact, CriterionResponse, MechanicalCheck } from "@/lib/domain";
import { runEvidenceAssistant } from "@/lib/evidence-assistant";
import { StatusBadge } from "@/components/ui/status-badge";

export function EvidenceAssistantPanel({ criteria, responses, artifacts, checks, limitations, aiUseNotes }: { criteria: AcceptanceCriterion[]; responses: CriterionResponse[]; artifacts: Artifact[]; checks: MechanicalCheck[]; limitations?: string | null; aiUseNotes?: string | null }) {
  const report = runEvidenceAssistant({ criteria, responses, artifacts, checks, limitations, aiUseNotes });
  const badgeStatus = report.status === "ready_for_review" ? "pass" : report.status === "blocked" ? "fail" : "warning";
  return <div className="card elevated"><div className="row between"><div className="row"><span className="icon-box" style={{ margin: 0 }}><Sparkles size={19} /></span><div><h2 style={{ fontSize: 28 }}>Evidence assistant</h2><p className="muted small" style={{ margin: 0 }}>Mechanical review prep. It does not replace client or expert judgment.</p></div></div><div className="row"><span className="status">{report.readinessScore}/100</span><StatusBadge status={badgeStatus} /></div></div><div className="check-list" style={{ marginTop: 16 }}>{report.items.map((item) => <div className="check-item" key={item.code}><div className="row between"><strong>{item.title}</strong>{item.severity === "good" ? <CheckCircle2 size={17} /> : <AlertTriangle size={17} />}</div><p className="small muted">{item.detail}</p><div className="notice" style={{ marginTop: 8 }}>{item.suggestedAction}</div></div>)}</div></div>;
}
