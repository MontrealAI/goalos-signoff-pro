import Link from "next/link";
import { Blocks, Database, ShieldCheck } from "lucide-react";

export default function VerifiedPage() {
  return <main className="page"><div className="container">
    <div className="page-head"><div><span className="eyebrow"><Blocks size={14} /> Optional blockchain verification</span><h1>Verified Signoff adds IPFS and Ethereum to the receipt — without making customers use crypto.</h1><p>GoalOS keeps the mainstream SaaS workflow. When a customer wants a stronger public proof, the service can pin the final receipt to IPFS and anchor its hash on Ethereum.</p></div></div>
    <div className="grid-3">
      <article className="card"><div className="icon-box"><ShieldCheck /></div><h3>Signed receipt first</h3><p>The client still accepts work through the normal Signoff workflow. Human acceptance remains the source of authority.</p></article>
      <article className="card"><div className="icon-box"><Database /></div><h3>IPFS receipt copy</h3><p>The final receipt JSON can be pinned to IPFS. Sensitive evidence can remain private or encrypted.</p></article>
      <article className="card"><div className="icon-box"><Blocks /></div><h3>Ethereum anchor</h3><p>A small non-custodial contract records the receipt hash and CIDs. It holds no funds and requires no AGIALPHA.</p></article>
    </div>
    <div className="notice warning" style={{marginTop: 24}}>Use Sepolia first. Mainnet anchoring, AGIALPHA bonds, and escrow are separate later gates.</div>
    <div className="row wrap" style={{marginTop: 24}}><Link className="button" href="/login">Create a Signoff</Link><Link className="button secondary" href="/security">Read security boundaries</Link></div>
  </div></main>;
}
