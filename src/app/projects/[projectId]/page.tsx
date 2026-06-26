import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireCurrentUser } from "@/lib/auth/current-user";
import { loadProjectWorkspace } from "@/lib/data/project";
import { ProjectWorkspace } from "@/components/projects/project-workspace";
export const metadata: Metadata = { title: "Signoff workspace" };
export const dynamic = "force-dynamic";
export default async function ProjectPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  const user = await requireCurrentUser(`/projects/${projectId}`);
  const data = await loadProjectWorkspace(projectId, user.id);
  if (!data) notFound();
  return <ProjectWorkspace data={data} />;
}
