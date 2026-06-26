"use client";
import { useState } from "react";
import { MailPlus } from "lucide-react";
import { requestJson } from "@/lib/client-api";
import { CopyButton } from "@/components/ui/copy-button";
import type { ProjectMember } from "@/lib/domain";

export function InvitePanel({ projectId, members }: { projectId: string; members: ProjectMember[] }) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"builder" | "reviewer" | "observer">("builder");
  const [result, setResult] = useState<{ inviteUrl: string; emailSent: boolean; emailWarning: string | null } | null>(null);
  const [state, setState] = useState<{ loading: boolean; error: string | null }>({ loading: false, error: null });
  async function invite(event: React.FormEvent) {
    event.preventDefault();
    setState({ loading: true, error: null });
    try {
      const data = await requestJson<{ inviteUrl: string; emailSent: boolean; emailWarning: string | null }>(`/api/projects/${projectId}/invitations`, { method: "POST", body: JSON.stringify({ email, role }) });
      setResult(data);
      setState({ loading: false, error: null });
    } catch (error) {
      setState({ loading: false, error: error instanceof Error ? error.message : "Could not create invitation." });
    }
  }
  return <div className="stack">
    <div className="card"><h3>Project members</h3><div style={{ marginTop: 12 }}>{members.map((member) => { const name = member.profile?.display_name || member.profile?.email || "Participant"; return <div className="member" key={member.user_id}><div className="row"><span className="avatar">{name.slice(0, 1).toUpperCase()}</span><div><strong>{name}</strong><div className="small muted">{member.profile?.email}</div></div></div><span className="status">{member.role}</span></div>; })}</div></div>
    <form className="card" onSubmit={invite}><div className="row"><span className="icon-box" style={{ margin: 0 }}><MailPlus size={19} /></span><div><h3>Invite someone</h3><p className="muted small" style={{ margin: 0 }}>They sign in with the invited email address.</p></div></div><div className="form-grid" style={{ marginTop: 18 }}><div className="field"><label htmlFor="invite-email">Email</label><input id="invite-email" className="input" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="person@company.com" /></div><div className="field"><label htmlFor="invite-role">Role</label><select id="invite-role" className="select" value={role} onChange={(event) => setRole(event.target.value as typeof role)}><option value="builder">Builder — submits work</option><option value="reviewer">Reviewer — recommends a decision</option><option value="observer">Observer — read-only access</option></select></div></div>{state.error && <div className="notice error" style={{ marginTop: 14 }}>{state.error}</div>}<div className="form-actions"><button className="button" disabled={state.loading}>{state.loading ? "Creating…" : "Create invitation"}</button></div></form>
    {result && <div className="card stack"><h3>Invitation ready</h3><div className={result.emailSent ? "notice" : "notice warning"}>{result.emailSent ? "The invitation email was sent." : "Email is not configured, so copy and send this private link yourself."}{result.emailWarning && <div className="small" style={{ marginTop: 5 }}>{result.emailWarning}</div>}</div><div className="field"><label>Private invitation link</label><input className="input" readOnly value={result.inviteUrl} /></div><div className="row"><CopyButton value={result.inviteUrl} label="Copy invitation link" /><button type="button" className="button ghost small" onClick={() => { setResult(null); setEmail(""); }}>Done</button></div><p className="help">The link expires in seven days and should not be posted publicly.</p></div>}
  </div>;
}
