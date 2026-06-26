import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { publicSupabaseEnv } from "@/lib/env";

export async function createServerSupabaseClient() {
  const { url, key } = publicSupabaseEnv();
  if (!url || !key) throw new Error("Supabase is not configured. See START_HERE.html.");
  const cookieStore = await cookies();
  return createServerClient(url, key, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (cookiesToSet) => {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // A Server Component cannot always write cookies. proxy.ts refreshes sessions.
        }
      }
    }
  });
}
