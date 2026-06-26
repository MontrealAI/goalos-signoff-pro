import Link from "next/link";
import { ArrowRight, BadgeDollarSign, CheckCircle2, FileCheck2, GitBranch, ShieldCheck, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Pillar = {
  Icon: LucideIcon;
  title: string;
  copy: string;
};

const pillars: Pillar[] = [
  { Icon: FileCheck2, title: "Workflow", copy: "Briefs, evidence, change requests, reviewer recommendations, and final client decisions." },
  { Icon: Sparkles, title: "Evidence assistant", copy: "Deterministic readiness checks that prepare human review without pretending to certify truth." },
  { Icon: ShieldCheck, title: "Verified receipts", copy: "Signed Mission Receipts now; optional IPFS/Sepolia anchoring after your pilot gate." },
  { Icon: BadgeDollarSign, title: "Pilot monetization", copy: "Stripe-ready Pro/Team plans, manual invoice mode, and independent review offers." },
  { Icon: GitBranch, title: "Protocol path", copy: "Future AGIALPHA, bonded review, and proof-to-payment once Mainnet gates are passed." },
  { Icon: CheckCircle2, title: "Mainstream first", copy: "No wallet, no token, no gas, and no escrow required for ordinary customers." }
];

export default function ProPage() {
  return (
    <main className="page">
      <div className="container">
        <div className="page-head">
          <div>
            <span className="eyebrow">GoalOS Signoff Pro v1.1</span>
            <h1>Mainstream SaaS workflow with optional verified receipts.</h1>
            <p>
              Launch the customer-friendly product first, while preserving a credible path into blockchain verification,
              AGIALPHA-secured review, and proof-to-payment.
            </p>
          </div>
          <Link className="button" href="/projects/new">
            Create first Signoff <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </div>

        <div className="grid-3">
          {pillars.map(({ Icon, title, copy }) => (
            <article className="card" key={title}>
              <div className="icon-box">
                <Icon size={21} aria-hidden="true" />
              </div>
              <h3>{title}</h3>
              <p className="muted small">{copy}</p>
            </article>
          ))}
        </div>

        <div className="callout" style={{ marginTop: 28 }}>
          <div>
            <h2>Best commercial wedge</h2>
            <p>
              Start with AI consultants, agencies, software contractors, and grant programs that already need cleaner
              client acceptance records.
            </p>
          </div>
          <Link className="button secondary" href="/templates">
            View launch templates
          </Link>
        </div>
      </div>
    </main>
  );
}
