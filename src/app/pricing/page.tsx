import Link from "next/link";
import { CheckCircle2, ShieldCheck } from "lucide-react";
import { CheckoutButton } from "@/components/billing/checkout-button";
import { commercialPlans } from "@/lib/billing";

export default function PricingPage() {
  return <main className="page"><div className="container">
    <div className="page-head"><div><span className="eyebrow"><ShieldCheck size={14} /> Commercial launch pricing</span><h1>Simple pricing for accepting AI work.</h1><p>Start with the software workflow. No wallet, no AGIALPHA, no Ethereum transaction, no escrow.</p></div></div>
    <div className="grid-3">
      <article className="card elevated">
        <h2>Free</h2><p className="lead">3 Signoffs / month</p><p className="muted">Best for trying one real client handoff.</p>
        <ul className="stack small"><li>Briefs and acceptance criteria</li><li>Private evidence uploads</li><li>Client approval flow</li><li>Signed receipt export</li></ul>
        <Link className="button secondary" href="/login">Start free</Link>
      </article>
      {(Object.entries(commercialPlans) as ["pro" | "team", typeof commercialPlans.pro][]).map(([id, plan]) => <article className="card elevated" key={id}>
        <h2>{plan.name}</h2><p className="lead">{plan.monthlyPrice}</p><p className="muted">{plan.audience}</p>
        <ul className="stack small">{plan.features.map(feature => <li className="row" key={feature}><CheckCircle2 size={15} /> {feature}</li>)}</ul>
        <CheckoutButton plan={id} />
      </article>)}
    </div>
    <section className="section"><div className="callout"><div><h2>Need human review?</h2><p>Offer independent proof review as a manually scheduled service first. Add automated marketplace economics only after demand and operational quality are proven.</p></div><Link className="button secondary" href="/demo">Explore demo</Link></div></section>
  </div></main>;
}
