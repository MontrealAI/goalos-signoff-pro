import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import type { ReceiptRecord } from "@/lib/domain";

export function VerifiedReceiptUpgrade({ receipt }: { receipt: ReceiptRecord | null }) {
  if (!receipt) return null;
  return <div className="card elevated"><div className="row between"><div className="row"><span className="icon-box" style={{ margin: 0 }}><ShieldCheck size={19} /></span><div><h2 style={{ fontSize: 28 }}>Upgrade to verified receipt</h2><p className="muted small" style={{ margin: 0 }}>Optionally publish a redacted receipt hash to IPFS/Sepolia after human review.</p></div></div><Link className="button secondary" href="/verified">View verified receipt setup</Link></div><div className="notice" style={{ marginTop: 14 }}>Default launch mode keeps this off. Enable only after your first ten signed receipts are working reliably.</div></div>;
}
