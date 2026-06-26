import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { requireCurrentUser } from "@/lib/auth/current-user";
import { CreateProjectForm } from "@/components/projects/create-project-form";
export const metadata: Metadata = { title: "New Signoff" };
export const dynamic = "force-dynamic";
export default async function NewProjectPage() {
  await requireCurrentUser("/projects/new");
  return <main className="page"><div className="narrow"><div className="page-head"><div><Link className="button ghost small" href="/dashboard"><ArrowLeft size={14} /> Dashboard</Link><h1 style={{ fontSize: 48, marginTop: 12 }}>Create a Signoff</h1><p>Write the brief and the conditions that will govern acceptance.</p></div></div><CreateProjectForm /></div></main>;
}
