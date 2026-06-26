import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { DemoWorkspace } from "@/components/demo/demo-workspace";
export const metadata: Metadata = { title: "Interactive demo" };
export default function DemoPage() { return <main className="page"><div className="container"><div className="page-head"><div><span className="eyebrow">No setup required</span><h1 style={{ fontSize: 48, marginTop: 15 }}>Walk through one Signoff</h1><p>Click through the brief, delivery, review, and receipt. This sample uses no account or backend.</p></div><Link className="button" href="/login">Create a real Signoff <ArrowRight size={17} /></Link></div><DemoWorkspace /></div></main>; }
