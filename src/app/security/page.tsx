import { LockKeyhole, ShieldCheck, UserCheck } from "lucide-react";

export default function SecurityPage() {
  return <main className="page"><div className="container">
    <div className="page-head"><div><span className="eyebrow"><ShieldCheck size={14} /> Trust center</span><h1>Security and privacy boundaries, in plain English.</h1><p>GoalOS Signoff records acceptance of work. It does not take custody of project funds and does not autonomously decide factual truth.</p></div></div>
    <div className="grid-3">
      <article className="card"><div className="icon-box"><LockKeyhole /></div><h3>Private projects</h3><p>Project files are private by default, protected by role-based access, and fingerprinted before acceptance.</p></article>
      <article className="card"><div className="icon-box"><UserCheck /></div><h3>Human authority</h3><p>Automatic checks flag missing evidence and inconsistencies. A client or reviewer makes the acceptance decision.</p></article>
      <article className="card"><div className="icon-box"><ShieldCheck /></div><h3>Tamper-evident receipts</h3><p>Accepted submissions are signed with a dedicated receipt key so modified exports fail verification.</p></article>
    </div>
    <div className="form-card stack" style={{marginTop: 24}}><h2>Production boundaries</h2><p>Phase 1 has no wallet, no AGIALPHA, no Ethereum transaction, no escrow, and no automated settlement. Payment remains outside the product until later audited and authorized phases.</p><p className="notice warning">For mainstream customers, this is intentional: prove the acceptance workflow before adding blockchain or payment risk.</p></div>
  </div></main>;
}
