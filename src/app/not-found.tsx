import Link from "next/link";
import { SearchX } from "lucide-react";

export default function NotFound() {
  return <main className="page"><div className="narrow"><div className="form-card stack" style={{ textAlign: "center" }}><div className="icon-box" style={{ margin: "0 auto" }}><SearchX size={22} /></div><h1 style={{ fontSize: 42 }}>This page is not available</h1><p className="muted">The link may be expired, private, revoked, or mistyped.</p><div className="row wrap" style={{ justifyContent: "center" }}><Link className="button" href="/">Return home</Link><Link className="button secondary" href="/dashboard">Open dashboard</Link></div></div></div></main>;
}
