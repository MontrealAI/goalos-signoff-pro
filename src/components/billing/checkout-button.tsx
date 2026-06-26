"use client";

import { useState } from "react";

export function CheckoutButton({ plan }: { plan: "pro" | "team" }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  async function startCheckout() {
    setBusy(true);
    setError(null);
    try {
      const response = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ plan })
      });
      const payload = await response.json();
      if (!response.ok || !payload?.url) throw new Error(payload?.error ?? "Checkout is not configured yet");
      window.location.href = payload.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed");
      setBusy(false);
    }
  }
  return <div className="stack">
    <button className="button" type="button" onClick={startCheckout} disabled={busy}>{busy ? "Opening checkout..." : "Start plan"}</button>
    {error ? <p className="notice warning">{error}</p> : null}
  </div>;
}
