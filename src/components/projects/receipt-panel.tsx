"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Ban, CheckCircle2, Download, ExternalLink, RefreshCw, ShieldAlert } from "lucide-react";
import type { ReceiptRecord } from "@/lib/domain";
import { requestJson } from "@/lib/client-api";
import { CopyButton } from "@/components/ui/copy-button";

export function ReceiptPanel({ receipt, submissionId, accepted, canRevoke }: { receipt: ReceiptRecord | null; submissionId: string | null; accepted: boolean; canRevoke: boolean }) {
  const router = useRouter();
  const [state, setState] = useState<{ loading: boolean; error: string | null }>({ loading: false, error: null });
  const [showRevoke, setShowRevoke] = useState(false);
  const [reason, setReason] = useState("");
  if (!receipt && accepted && submissionId) return <div className="card stack"><h3>Acceptance was recorded</h3><p className="muted">The signed receipt was not generated automatically. This normally means the signing keys still need setup.</p>{state.error && <div className="notice error">{state.error}</div>}<button className="button" disabled={state.loading} onClick={async () => { setState({ loading: true, error: null }); try { await requestJson(`/api/submissions/${submissionId}/receipt`, { method: "POST", body: "{}" }); router.refresh(); } catch (error) { setState({ loading: false, error: error instanceof Error ? error.message : "Could not issue receipt." }); } }}>{state.loading ? "Issuing…" : <><RefreshCw size={16} /> Retry receipt issuance</>}</button></div>;
  if (!receipt) return <div className="empty"><h3>No Mission Receipt yet</h3><p className="muted">A receipt is issued only after the client accepts a submitted package.</p></div>;
  const verifyPath = `/verify/${receipt.public_id}`;
  const revoked = Boolean(receipt.revoked_at);

  async function revokeReceipt(event: React.FormEvent) {
    event.preventDefault();
    if (!receipt || reason.trim().length < 3) return;
    setState({ loading: true, error: null });
    try {
      await requestJson(`/api/receipts/${receipt.public_id}/revoke`, { method: "POST", body: JSON.stringify({ reason }) });
      setShowRevoke(false);
      router.refresh();
    } catch (error) {
      setState({ loading: false, error: error instanceof Error ? error.message : "Could not revoke receipt." });
    }
  }

  return <div className="stack">
    <div className={revoked ? "card" : "receipt-hero"}><div className="row between"><div className="receipt-mark">{revoked ? <ShieldAlert size={31} /> : <CheckCircle2 size={31} />}</div><span className={`status ${revoked ? "fail" : "pass"}`}>{revoked ? "revoked" : "signature issued"}</span></div><h2 style={{ fontSize: 34, marginTop: 20 }}>Mission Receipt</h2><p>{revoked ? "This signed historical record has been revoked and must not be treated as a currently valid approval." : "The accepted brief, evidence fingerprints, checks, decisions, and limitations are bound into one signed record."}</p>{revoked && <div className="notice error"><strong>Revocation reason:</strong> {receipt.revocation_reason || "No reason recorded."}</div>}<div className="metric-row"><div className="metric"><strong>{receipt.canonical_json.acceptanceCriteria.length}</strong><span>criteria recorded</span></div><div className="metric"><strong>{receipt.canonical_json.artifacts.length}</strong><span>artifact hashes</span></div><div className="metric"><strong>{receipt.algorithm}</strong><span>signature</span></div></div></div>
    <div className="card stack"><div><strong>Receipt ID</strong><div className="hash">{receipt.public_id}</div></div><div><strong>Canonical SHA-256</strong><div className="hash">{receipt.canonical_sha256}</div></div><div className="row wrap"><Link className="button" href={verifyPath}><ExternalLink size={16} /> Verify receipt</Link><a className="button secondary" href={`/api/receipts/${receipt.public_id}/pdf`}><Download size={16} /> PDF</a><a className="button secondary" href={`/api/receipts/${receipt.public_id}/json`}><Download size={16} /> JSON</a><CopyButton value={verifyPath} label="Copy verification link" /></div></div>
    {canRevoke && !revoked && <div className="card stack"><div><h3>Emergency receipt revocation</h3><p className="muted small">Use only when a receipt was issued in error, compromised, or must no longer be relied upon. Revocation is permanent and remains visible.</p></div>{showRevoke ? <form className="stack" onSubmit={revokeReceipt}><div className="field"><label htmlFor="revocation-reason">Reason for revocation</label><textarea id="revocation-reason" className="textarea" value={reason} onChange={(event) => setReason(event.target.value)} minLength={3} maxLength={1000} required placeholder="Explain why this receipt must no longer be treated as valid." /></div>{state.error && <div className="notice error">{state.error}</div>}<div className="row wrap"><button className="button danger" disabled={state.loading || reason.trim().length < 3}>{state.loading ? "Revoking…" : <><Ban size={16} /> Permanently revoke</>}</button><button type="button" className="button secondary" onClick={() => setShowRevoke(false)}>Cancel</button></div></form> : <button className="button secondary" onClick={() => setShowRevoke(true)}><Ban size={16} /> Start revocation</button>}</div>}
  </div>;
}
