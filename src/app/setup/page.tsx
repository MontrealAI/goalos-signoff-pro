import type { Metadata } from "next";
import { CheckCircle2, Circle, KeyRound, Server, Signature } from "lucide-react";
import { publicSupabaseEnv, serverSupabaseEnv, signingEnv } from "@/lib/env";
export const metadata: Metadata = { title: "Setup status" };
export const dynamic = "force-dynamic";
export default function SetupPage() {
  const publicEnv = publicSupabaseEnv();
  const serverEnv = serverSupabaseEnv();
  const signing = signingEnv();
  const rows = [
    { label: "Supabase public URL and publishable key", ready: publicEnv.configured, icon: Server },
    { label: "Supabase server secret key", ready: serverEnv.serverConfigured, icon: KeyRound },
    { label: "Ed25519 receipt signing keys", ready: signing.configured, icon: Signature }
  ];
  return <main className="page"><div className="narrow"><div className="page-head"><div><h1 style={{ fontSize: 48 }}>Setup status</h1><p>This page shows only whether each setting exists. Secret values are never displayed.</p></div></div><div className="form-card stack">{rows.map(({ label, ready, icon: Icon }) => <div className="row between" key={label}><div className="row"><span className="icon-box" style={{ margin: 0 }}><Icon size={19} /></span><strong>{label}</strong></div><span className={`status ${ready ? "pass" : "warning"}`}>{ready ? <><CheckCircle2 size={12} /> ready</> : <><Circle size={12} /> needs setup</>}</span></div>)}<div className={rows.every((row) => row.ready) ? "notice" : "notice warning"}>{rows.every((row) => row.ready) ? "The core service is configured. Run npm run setup:check for a deeper local check." : "Open START_HERE.html in the downloaded package and follow the numbered setup guide."}</div></div></div></main>;
}
