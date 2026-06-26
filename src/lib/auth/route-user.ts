import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function requireRouteUser() {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims?.sub) throw new Error("Authentication required");
  return {
    supabase,
    user: { id: String(data.claims.sub), email: typeof data.claims.email === "string" ? data.claims.email : null }
  };
}
