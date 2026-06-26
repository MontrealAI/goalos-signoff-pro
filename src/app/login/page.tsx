import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth/login-form";
import { getCurrentUser } from "@/lib/auth/current-user";
import { publicSupabaseEnv } from "@/lib/env";
export const metadata: Metadata = { title: "Sign in" };
export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string; error?: string }> }) {
  const params = await searchParams;
  if (!publicSupabaseEnv().configured) return <main className="page"><div className="narrow"><div className="form-card stack"><h1 style={{ fontSize: 40 }}>One setup step remains</h1><p className="muted">The interactive demo works now, but real accounts require Supabase. Open START_HERE.html from the download package.</p><div className="row"><Link className="button" href="/demo">Open demo</Link><Link className="button secondary" href="/setup">View setup status</Link></div></div></div></main>;
  const user = await getCurrentUser();
  if (user) redirect(params.next?.startsWith("/") ? params.next : "/dashboard");
  return <main className="page"><div className="narrow"><div className="form-card"><LoginForm next={params.next} />{params.error && <div className="notice error" style={{ marginTop: 18 }}>The sign-in link could not be completed. Please request a new link.</div>}</div></div></main>;
}
