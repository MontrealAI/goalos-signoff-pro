import Link from "next/link";
import { ArrowRight, CheckCircle2, FileCheck2, Fingerprint, ShieldCheck, Sparkles, UsersRound, Workflow } from "lucide-react";

export default function HomePage() {
  return <main>
    <section className="hero"><div className="container">
      <span className="eyebrow"><Sparkles size={14} /> GoalOS Signoff Pro v1.1</span>
      <h1>Know when AI work is actually done.</h1>
      <p className="lead">Define the brief, collect evidence, request changes, obtain human approval, issue a signed Mission Receipt, monetize the workflow, and optionally anchor a redacted receipt hash later.</p>
      <div className="hero-actions"><Link className="button" href="/login">Create a Signoff <ArrowRight size={17} /></Link><Link className="button secondary" href="/templates">View templates</Link><Link className="button ghost" href="/pricing">Pricing</Link><Link className="button ghost" href="/pro">Why Pro</Link></div>
      <div className="trust-line"><span><CheckCircle2 size={15} /> No customer wallet by default</span><span><CheckCircle2 size={15} /> No AGIALPHA required</span><span><CheckCircle2 size={15} /> Optional blockchain proof</span><span><CheckCircle2 size={15} /> Human final authority</span></div>
    </div></section>

    <section className="section alt"><div className="container">
      <div className="section-head"><h2>One clear workflow from brief to acceptance</h2><p>GoalOS automates the administration and integrity checks. The client retains authority over the final decision.</p></div>
      <div className="grid-4">
        <div className="step"><div className="step-number">01 · DEFINE</div><h3>Write what “done” means</h3><p className="muted">Set deliverables, acceptance criteria, evidence requirements, deadline, and reviewer.</p></div>
        <div className="step"><div className="step-number">02 · DELIVER</div><h3>Submit work and evidence</h3><p className="muted">Upload private files, explain AI use, disclose limitations, and map evidence to every criterion.</p></div>
        <div className="step"><div className="step-number">03 · REVIEW</div><h3>Check the exact package</h3><p className="muted">GoalOS runs mechanical checks. A human reviewer accepts, requests changes, or rejects.</p></div>
        <div className="step"><div className="step-number">04 · RECEIPT</div><h3>Issue a verifiable record</h3><p className="muted">The accepted brief, evidence fingerprints, decision, and limitations are digitally signed.</p></div>
      </div>
    </div></section>

    <section className="section"><div className="container">
      <div className="section-head"><h2>Built for serious, practical delivery</h2><p>A commercially focused product for consultants, agencies, research teams, software contractors, enterprise AI pilots, grant programs, and client-service teams.</p></div>
      <div className="grid-3">
        <article className="card"><div className="icon-box"><Workflow size={21} /></div><h3>Acceptance criteria first</h3><p>Reduce disputes by agreeing on observable requirements before delivery.</p></article>
        <article className="card"><div className="icon-box"><Fingerprint size={21} /></div><h3>Immutable file fingerprints</h3><p>Every submitted artifact receives a server-verified SHA-256 fingerprint.</p></article>
        <article className="card"><div className="icon-box"><FileCheck2 size={21} /></div><h3>Evidence-to-criterion mapping</h3><p>Reviewers see exactly which evidence supports each acceptance requirement.</p></article>
        <article className="card"><div className="icon-box"><UsersRound size={21} /></div><h3>Separated roles</h3><p>Client, builder, reviewer, and observer permissions are explicit and protected.</p></article>
        <article className="card"><div className="icon-box"><ShieldCheck size={21} /></div><h3>Human final authority</h3><p>Automated checks never pretend to establish external factual truth.</p></article>
        <article className="card"><div className="icon-box"><CheckCircle2 size={21} /></div><h3>Hybrid verified receipts</h3><p>Signed receipts work immediately; accepted receipt hashes can later be anchored on-chain for public verification.</p></article>
      </div>
    </div></section>

    <section className="section"><div className="container"><div className="callout"><div><h2>Launch mainstream Signoff, then add optional blockchain proof.</h2><p>Start with the customer-friendly SaaS workflow, then enable Sepolia/Mainnet hash anchoring without requiring customer wallets. Keep bonded review and settlement for later safety gates.</p></div><Link className="button secondary" href="/setup">See setup steps <ArrowRight size={17} /></Link></div></div></section>
  </main>;
}
