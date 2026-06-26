"use client";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";
export function LogoutButton() {
  const router = useRouter();
  return <button className="button ghost small" onClick={async () => { await createBrowserSupabaseClient().auth.signOut(); router.push("/"); router.refresh(); }}><LogOut size={14} /> Sign out</button>;
}
