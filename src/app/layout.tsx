import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { publicSupabaseEnv } from "@/lib/env";
import { getCurrentUser } from "@/lib/auth/current-user";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "GoalOS Signoff", template: "%s · GoalOS Signoff" },
  description: "Define done, verify the evidence, obtain human approval, and issue a trusted Mission Receipt for AI-assisted work.",
  manifest: "/manifest.webmanifest",
  robots: { index: true, follow: true }
};

export const viewport: Viewport = { themeColor: "#123d30" };

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  let user = null;
  if (publicSupabaseEnv().configured) {
    try { user = await getCurrentUser(); } catch { user = null; }
  }
  return <html lang="en"><body>
    <header className="site-header"><div className="container header-inner"><Logo /><nav className="nav" aria-label="Primary navigation"><Link className="mobile-hide" href="/templates">Templates</Link><Link className="mobile-hide" href="/pricing">Pricing</Link><Link className="mobile-hide" href="/security">Security</Link><Link className="mobile-hide" href="/demo">Demo</Link><Link className="mobile-hide" href="/setup">Setup</Link>{user ? <Link className="button small" href="/dashboard">Dashboard</Link> : <Link className="button small" href="/login">Open Signoff</Link>}</nav></div></header>
    {children}
    <footer><div className="container footer-inner"><span>GoalOS Signoff · Human authority over AI-assisted work</span><span>No wallet · No token · No blockchain transaction in Phase 1</span></div></footer>
  </body></html>;
}
