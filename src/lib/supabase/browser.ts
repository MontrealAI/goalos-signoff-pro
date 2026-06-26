import { createBrowserClient } from "@supabase/ssr";
import { publicSupabaseEnv } from "@/lib/env";

export function createBrowserSupabaseClient() {
  const { url, key } = publicSupabaseEnv();
  if (!url || !key) throw new Error("Supabase is not configured. See START_HERE.html.");
  return createBrowserClient(url, key);
}
