import { createClient } from "@supabase/supabase-js";
import { serverSupabaseEnv } from "@/lib/env";

export function createAdminSupabaseClient() {
  const { url, secretKey } = serverSupabaseEnv();
  if (!url || !secretKey) throw new Error("Server Supabase credentials are not configured.");
  return createClient(url, secretKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false }
  });
}
