import Link from "next/link";

export default function VerifyLandingPage() {
  return <main className="page"><div className="container"><div className="page-head"><div><span className="eyebrow">Receipt verification</span><h1>Verify what was accepted.</h1><p>GoalOS receipts prove the accepted brief, accepted submission, evidence fingerprints, reviewer recommendation, client decision, and optional blockchain anchor.</p></div><Link className="button" href="/verified">Verified receipt setup</Link></div><div className="card"><h2>How verification works</h2><ol className="stack"><li>Open the receipt link or paste the public receipt ID.</li><li>Confirm the signature, receipt hash, and revocation status.</li><li>For private projects, compare file fingerprints without exposing confidential documents.</li><li>For verified receipts, check the IPFS CID and Sepolia/Mainnet anchor.</li></ol></div></div></main>;
}
