"use client";
import { useState } from "react";
import { Check, Copy } from "lucide-react";
export function CopyButton({ value, label = "Copy" }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return <button type="button" className="button secondary small" onClick={async () => { const resolved = value.startsWith("/") ? `${window.location.origin}${value}` : value; await navigator.clipboard.writeText(resolved); setCopied(true); setTimeout(() => setCopied(false), 1800); }}>{copied ? <Check size={14} /> : <Copy size={14} />}{copied ? "Copied" : label}</button>;
}
