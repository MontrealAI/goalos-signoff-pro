import type { Metadata } from "next";
import { InvitationCard } from "@/components/projects/invitation-card";
import { getCurrentUser } from "@/lib/auth/current-user";
import { publicSupabaseEnv } from "@/lib/env";
export const metadata: Metadata = { title: "Invitation", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";
export default async function InvitationPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  let email: string | null = null;
  if (publicSupabaseEnv().configured) { try { email = (await getCurrentUser())?.email ?? null; } catch { email = null; } }
  return <main className="page"><div className="narrow"><InvitationCard token={token} currentEmail={email} /></div></main>;
}
