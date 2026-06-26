"use client";
import { useState } from "react";
import { CheckCircle2, ClipboardCheck, FileText, ReceiptText, UploadCloud } from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";

const criteria = [
  { title: "Analyze at least five direct competitors", status: "met", evidence: "competitive-analysis.pdf" },
  { title: "Use sources published within 12 months", status: "met", evidence: "source-register.csv" },
  { title: "Include a current pricing comparison", status: "met", evidence: "pricing-model.xlsx" },
  { title: "Provide three actionable recommendations", status: "met", evidence: "competitive-analysis.pdf" },
  { title: "Disclose uncertainty and limitations", status: "met", evidence: "competitive-analysis.pdf" }
];

export function DemoWorkspace() {
  const [step, setStep] = useState<"brief" | "delivery" | "review" | "receipt">("brief");
  const steps = [
    ["brief", ClipboardCheck, "Brief"],
    ["delivery", UploadCloud, "Delivery"],
    ["review", CheckCircle2, "Review"],
    ["receipt", ReceiptText, "Receipt"]
  ] as const;
  return (
    <div className="demo-shell">
      <div className="demo-window">
        <div className="demo-top"><span className="demo-dot" /><span className="demo-dot" /><span className="demo-dot" /></div>
        <div className="demo-body">
          <div className="row wrap" style={{ marginBottom: 24 }}>
            {steps.map(([id, Icon, label]) => (
              <button key={id} className={`button ${step === id ? "" : "secondary"} small`} onClick={() => setStep(id)}><Icon size={14} />{label}</button>
            ))}
          </div>
          {step === "brief" && (
            <div className="stack">
              <div><StatusBadge status="open" /><h2 style={{ marginTop: 12, fontSize: 32 }}>AI market intelligence report</h2><p className="muted">Produce a decision-ready competitive analysis for a new enterprise AI product.</p></div>
              <div className="card"><h3>Acceptance criteria</h3><div className="criteria-list" style={{ marginTop: 14 }}>{criteria.map((criterion, index) => <div className="criteria-item" key={criterion.title}><strong>{index + 1}. {criterion.title}</strong><div className="small muted">Required</div></div>)}</div></div>
            </div>
          )}
          {step === "delivery" && (
            <div className="stack">
              <div><StatusBadge status="submitted" /><h2 style={{ marginTop: 12, fontSize: 32 }}>Delivery package v1</h2><p className="muted">AI assisted source discovery and drafting. A human analyst verified every cited source and recommendation.</p></div>
              <div className="grid-3">{["competitive-analysis.pdf", "source-register.csv", "pricing-model.xlsx"].map((file) => <div className="artifact-item" key={file}><FileText size={20} /><h4 style={{ marginTop: 10 }}>{file}</h4><span className="status pass">hash verified</span></div>)}</div>
              <div className="notice">Limitations disclosed: two private competitor enterprise prices could not be independently verified.</div>
            </div>
          )}
          {step === "review" && (
            <div className="stack">
              <div><StatusBadge status="submitted" /><h2 style={{ marginTop: 12, fontSize: 32 }}>Ready for human decision</h2><p className="muted">Mechanical checks establish package completeness and integrity—not external truth.</p></div>
              <div className="criteria-list">{criteria.map((criterion) => <div className="criteria-item row between" key={criterion.title}><div><strong>{criterion.title}</strong><div className="small muted">Evidence: {criterion.evidence}</div></div><StatusBadge status={criterion.status} /></div>)}</div>
              <div className="row"><button className="button" onClick={() => setStep("receipt")}>Accept delivery</button><button className="button secondary">Request changes</button></div>
            </div>
          )}
          {step === "receipt" && (
            <div className="receipt-hero">
              <div className="row between"><div className="receipt-mark"><CheckCircle2 size={31} /></div><StatusBadge status="accepted" /></div>
              <h2 style={{ marginTop: 20, fontSize: 34 }}>Mission Receipt issued</h2><p>The client accepted delivery package v1 against brief version 1.</p>
              <div className="metric-row"><div className="metric"><strong>5/5</strong><span>criteria met</span></div><div className="metric"><strong>3</strong><span>artifacts verified</span></div><div className="metric"><strong>Ed25519</strong><span>signed receipt</span></div></div>
              <div className="hash" style={{ color: "#d6e9df", marginTop: 22 }}>0x69f8b297b10d...7a1424b1</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
