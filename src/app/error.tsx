"use client";
import { useEffect } from "react";
import Link from "next/link";
import { CircleAlert, RefreshCw } from "lucide-react";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return <main className="page"><div className="narrow"><div className="form-card stack"><div className="icon-box"><CircleAlert size={22} /></div><h1 style={{ fontSize: 42 }}>The service could not finish that request</h1><p className="muted">Your data has not been intentionally changed. Try again, then check the setup status if the problem continues.</p>{error.digest && <div className="hash">Support reference: {error.digest}</div>}<div className="row wrap"><button className="button" onClick={reset}><RefreshCw size={16} /> Try again</button><Link className="button secondary" href="/setup">Setup status</Link></div></div></div></main>;
}
