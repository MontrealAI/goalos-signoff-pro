import type { Metadata } from "next";
import Link from "next/link";
import { Plus, Sparkles } from "lucide-react";
import { requireCurrentUser } from "@/lib/auth/current-user";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { StatusBadge } from "@/components/ui/status-badge";
import { LogoutButton } from "@/components/auth/logout-button";
export const metadata: Metadata = { title: "Dashboard" };
export const dynamic = "force-dynamic";
export default async function DashboardPage() {
  const user = await requireCurrentUser("/dashboard");
  const supabase = await createServerSupabaseClient();
  const result = await supabase.from("project_members").select("role,project:projects(*)").eq("user_id", user.id).order("joined_at", { ascending: false });
  if (result.error) throw new Error(result.error.message);
  const memberships = (result.data ?? []).map((row) => ({ role: row.role, project: Array.isArray(row.project) ? row.project[0] : row.project })).filter((row) => row.project);
  return <main className="page"><div className="container"><div className="page-head"><div><span className="eyebrow"><Sparkles size={14} /> Your acceptance workspace</span><h1 style={{ fontSize: 48, marginTop: 14 }}>Signoffs</h1><p>{user.email}</p></div><div className="row"><LogoutButton /><Link className="button" href="/projects/new"><Plus size={17} /> New Signoff</Link></div></div>
    {memberships.length === 0 ? <div className="empty"><div className="icon-box" style={{ marginInline: "auto" }}><Plus size={22} /></div><h2 style={{ fontSize: 30 }}>Create your first Signoff</h2><p className="muted">Define the assignment and acceptance criteria, then invite a builder or reviewer.</p><Link className="button" href="/projects/new">Create a Signoff</Link></div> : <div className="dashboard-grid">{memberships.map(({ project, role }) => <Link className="project-card" href={`/projects/${project.id}`} key={project.id}><div className="row between"><StatusBadge status={project.status} /><span className="status">{role}</span></div><h3>{project.title}</h3><p className="muted small">{project.summary}</p><div className="project-meta"><span>Brief v{project.brief_version}</span><span>{new Date(project.updated_at).toLocaleDateString()}</span></div></Link>)}</div>}
  </div></main>;
}
