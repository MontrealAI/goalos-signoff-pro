import Link from "next/link";
import { CheckCheck } from "lucide-react";
export function Logo() {
  return <Link href="/" className="brand"><span className="brand-mark"><CheckCheck size={19} /></span><span>GoalOS <span className="brand-sub">Signoff</span></span></Link>;
}
