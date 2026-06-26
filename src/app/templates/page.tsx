import Link from "next/link";
import { goalosTemplates } from "@/lib/templates";

export default function TemplatesPage() {
  return <main className="page"><div className="container">
    <div className="page-head"><div><span className="eyebrow">GoalOS Signoff Pro v1.1 templates</span><h1>Five launch-ready Signoff workflows.</h1><p>Each template turns a common AI-work delivery into acceptance criteria, evidence requirements, reviewer checks, and a monetizable product surface.</p></div><Link href="/projects/new" className="button">Create Signoff</Link></div>
    <div className="grid-3">{goalosTemplates.map(template => <article className="card" key={template.id}><span className="status">{template.category}</span><h3>{template.title}</h3><p className="muted small">{template.summary}</p><p className="small"><strong>Best for:</strong> {template.bestFor}</p><div className="criteria-list" style={{ marginTop: 12 }}>{template.criteria.map((criterion, index) => <div className="criteria-item" key={criterion.title}><strong>{index + 1}. {criterion.title}</strong><p className="muted small">{criterion.description}</p><div className="row wrap">{criterion.evidence.map(item => <span className="status" key={item}>{item}</span>)}</div></div>)}</div><div className="notice" style={{ marginTop: 14 }}>{template.pricingHint}</div></article>)}</div>
  </div></main>;
}
