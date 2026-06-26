import Link from "next/link";
import { pilotMetrics } from "@/lib/pilot-analytics";

export default function PilotPage() {
  return <main className="page"><div className="container"><div className="page-head"><div><span className="eyebrow">Pilot dashboard</span><h1>Measure whether people actually want Signoff.</h1><p>Do not measure hype. Measure completed Signoffs, repeat intent, broken receipts, lost evidence, and security surprises.</p></div><Link className="button" href="/demo">Open demo workspace</Link></div><div className="grid-3">{pilotMetrics.map(metric => <article className="card" key={metric.key}><span className="status">target {metric.target}</span><h3>{metric.label}</h3><p className="muted small">Track this weekly during the first customer pilot.</p></article>)}</div><div className="notice" style={{ marginTop: 24 }}>The private-beta success gate is 10 attempted Signoffs, 7 completed receipts, 3 users saying they would use it again, and zero lost evidence or broken receipts.</div></div></main>;
}
