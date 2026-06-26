import type { SupabaseClient } from "@supabase/supabase-js";
import type { ProjectRole } from "@/lib/domain";

export async function requireProjectRole(supabase: SupabaseClient, projectId: string, userId: string, roles: ProjectRole[]) {
  const { data, error } = await supabase.from("project_members").select("role").eq("project_id", projectId).eq("user_id", userId).maybeSingle();
  if (error || !data || !roles.includes(data.role as ProjectRole)) throw new Error("You do not have permission to perform this action.");
  return data.role as ProjectRole;
}
