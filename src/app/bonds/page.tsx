"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { LoaderCircle } from "lucide-react";
import { BondCard } from "@/components/bond-card";
import { EMPTY_DASHBOARD, loadDashboard, type Dashboard } from "@/lib/parvo";

export default function BondsPage() {
  const [dashboard, setDashboard] = useState<Dashboard>(EMPTY_DASHBOARD);
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void loadDashboard()
      .then((next) => { setDashboard(next); setError(undefined); })
      .catch((cause) => { setError(cause instanceof Error ? cause.message : "Unable to load promise bonds."); })
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="pv-body">
      <Link className="back-link" href="/">Back to command</Link>
      <p className="eyebrow">Promise atlas</p>
      <h1>Bonded commitments</h1>
      {error && <p className="pv-alert">{error}</p>}
      {loading && !error && <p className="muted"><LoaderCircle className="spin" size={16} /> Reading bonds...</p>}
      <div className="bonds-grid wide">
        {dashboard.bonds.map((bond) => <BondCard key={String(bond.bond_id)} bond={bond} />)}
        {dashboard.bonds.length === 0 && !loading && !error && (
          <article className="empty-state">
            <p className="eyebrow">No bonds yet</p>
            <h3>No one has staked a public promise on this contract.</h3>
            <p>Create one from the command page with a URL, archive timestamp, payee, and stake.</p>
          </article>
        )}
      </div>
    </main>
  );
}
