"use client";
import { useState } from "react";
import { Mail, Send } from "lucide-react";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

export function LoginForm({ next = "/dashboard" }: { next?: string }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<{ loading: boolean; sent: boolean; error: string | null }>({ loading: false, sent: false, error: null });
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setState({ loading: true, sent: false, error: null });
    try {
      const supabase = createBrowserSupabaseClient();
      const callback = `${window.location.origin}/auth/callback?next=${encodeURIComponent(next.startsWith("/") ? next : "/dashboard")}`;
      const { error } = await supabase.auth.signInWithOtp({ email: email.trim(), options: { emailRedirectTo: callback, shouldCreateUser: true } });
      if (error) throw error;
      setState({ loading: false, sent: true, error: null });
    } catch (error) {
      setState({ loading: false, sent: false, error: error instanceof Error ? error.message : "Could not send the secure link." });
    }
  }
  if (state.sent) return <div className="stack"><div className="icon-box" style={{ width: 52, height: 52 }}><Mail size={24} /></div><h2 style={{ fontSize: 30 }}>Check your email</h2><p className="muted">We sent a secure sign-in link to <strong>{email}</strong>. The link may take a minute to arrive.</p><button className="button secondary" onClick={() => setState({ loading: false, sent: false, error: null })}>Use a different email</button></div>;
  return <form onSubmit={submit} className="stack">
    <div><h2 style={{ fontSize: 30 }}>Sign in without a password</h2><p className="muted">Enter your email. GoalOS will send a secure one-time link.</p></div>
    <div className="field"><label htmlFor="email">Email address</label><input id="email" className="input" type="email" required autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@company.com" /></div>
    {state.error && <div className="notice error">{state.error}</div>}
    <button className="button" disabled={state.loading || !email.trim()}>{state.loading ? "Sending…" : <><Send size={17} /> Send secure sign-in link</>}</button>
    <p className="help">No wallet, password, token, or browser extension is required.</p>
  </form>;
}
