"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2, LoaderCircle, UserPlus } from "lucide-react";
import { requestJson } from "@/lib/client-api";

interface InvitationInfo {
  email: string;
  role: string;
  expiresAt: string;
  project: { id: string; title: string; summary: string };
}

export function InvitationCard({ token, currentEmail }: { token: string; currentEmail: string | null }) {
  const router = useRouter();
  const [info, setInfo] = useState<InvitationInfo | null>(null);
  const [state, setState] = useState<{ loading: boolean; accepting: boolean; error: string | null }>({ loading: true, accepting: false, error: null });
  useEffect(() => {
    requestJson<InvitationInfo>(`/api/invitations/${token}`).then((data) => { setInfo(data); setState({ loading: false, accepting: false, error: null }); }).catch((error) => setState({ loading: false, accepting: false, error: error instanceof Error ? error.message : "Invitation unavailable." }));
  }, [token]);
  if (state.loading) return <div className="form-card row"><LoaderCircle size={20} /><span>Loading invitation…</span></div>;
  if (state.error || !info) return <div className="form-card stack"><h1 style={{ fontSize: 38 }}>Invitation unavailable</h1><div className="notice error">{state.error ?? "This link is invalid or expired."}</div><Link className="button secondary" href="/">Return home</Link></div>;
  const signedInCorrectly = currentEmail?.toLowerCase() === info.email.toLowerCase();
  return <div className="form-card stack"><div className="icon-box" style={{ width: 54, height: 54 }}><UserPlus size={25} /></div><div><span className="eyebrow">Private invitation</span><h1 style={{ fontSize: 42, marginTop: 14 }}>{info.project.title}</h1><p className="muted">{info.project.summary}</p></div><div className="card" style={{ boxShadow: "none" }}><div className="row between"><span>Invited email</span><strong>{info.email}</strong></div><div className="row between" style={{ marginTop: 10 }}><span>Role</span><span className="status">{info.role}</span></div><div className="row between" style={{ marginTop: 10 }}><span>Expires</span><strong>{new Date(info.expiresAt).toLocaleString()}</strong></div></div>
    {!currentEmail ? <div className="stack"><div className="notice warning">Sign in using <strong>{info.email}</strong>. You will return here automatically.</div><Link className="button" href={`/login?next=${encodeURIComponent(`/invite/${token}`)}`}>Sign in to accept</Link></div> : !signedInCorrectly ? <div className="notice error">You are signed in as <strong>{currentEmail}</strong>. Sign out, then use <strong>{info.email}</strong>.</div> : <button className="button" disabled={state.accepting} onClick={async () => { setState({ loading: false, accepting: true, error: null }); try { const data = await requestJson<{ projectId: string }>(`/api/invitations/${token}`, { method: "POST", body: "{}" }); router.push(`/projects/${data.projectId}`); router.refresh(); } catch (error) { setState({ loading: false, accepting: false, error: error instanceof Error ? error.message : "Could not accept invitation." }); } }}>{state.accepting ? "Accepting…" : <><CheckCircle2 size={17} /> Accept invitation</>}</button>}
    <p className="help">Do not forward this link. It grants access only after sign-in with the invited email address.</p></div>;
}
