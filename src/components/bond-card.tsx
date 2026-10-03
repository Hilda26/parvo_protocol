import Link from "next/link";
import { Archive, ExternalLink, ShieldCheck } from "lucide-react";
import type { BondListItem } from "@/lib/parvo";
import { bondLabel, statusTone } from "@/lib/contract/status";

export function BondCard({ bond }: { bond: BondListItem }) {
  const status = String(bond.state);
  const points = Number(bond.points_recorded ?? 0);
  const checks = Number(bond.checks_passed ?? 0);

  return (
    <article className="bond-card">
      <div className="bond-card-top">
        <span className={`badge ${statusTone(status)}`}>{bondLabel(status)}</span>
        {status === "ACTIVE" ? <ShieldCheck size={18} /> : <Archive size={18} />}
      </div>
      <h3><Link href={`/bonds/${encodeURIComponent(String(bond.bond_id))}`}>{String(bond.bond_id)}</Link></h3>
      <p>{String(bond.url)}</p>
      <div className="bond-meter" aria-label="Archive progress">
        <span style={{ width: `${Math.min(100, Math.max(10, points * 12))}%` }} />
      </div>
      <div className="bond-meta">
        <span>{String(bond.stake ?? "0")} GEN staked</span>
        <span>{checks} checks</span>
        <a href={String(bond.url)} target="_blank" rel="noreferrer">Source <ExternalLink size={12} /></a>
      </div>
    </article>
  );
}
