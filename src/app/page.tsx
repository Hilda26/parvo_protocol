"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Archive, BadgeDollarSign, LoaderCircle, Radar, Search, ShieldCheck, Waypoints } from "lucide-react";
import { BondCard } from "@/components/bond-card";
import { CreateBondForm } from "@/components/create-bond-form";
import { EMPTY_DASHBOARD, loadDashboard } from "@/lib/parvo";

export default function Home() {
  const [dashboard, setDashboard] = useState(EMPTY_DASHBOARD);
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  const refresh = useCallback(async () => {
    setLoading(true);
    await loadDashboard()
      .then((next) => { setDashboard(next); setError(undefined); })
      .catch((cause) => { setDashboard(EMPTY_DASHBOARD); setError(cause instanceof Error ? cause.message : "Unable to load Parvo."); });
    setLoading(false);
  }, []);

  useEffect(() => { void refresh(); }, [refresh]);

  const bonds = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return dashboard.bonds;
    return dashboard.bonds.filter((bond) => `${bond.bond_id} ${bond.url} ${bond.state}`.toLowerCase().includes(needle));
  }, [dashboard.bonds, query]);

  return (
    <main className="pv-body">
      <section className="hero-grid">
        <div>
          <p className="eyebrow">Archive-backed assurance</p>
          <h1>Public promises with a memory.</h1>
          <p className="lede">Parvo lets teams stake GEN behind a published promise. If archived versions later show the promise weakened or disappeared, the named payee can be made whole after a contest window.</p>
          <div className="searchbar">
            <Search size={17} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search bonds" />
          </div>
        </div>
        <div className="orbital-panel" aria-label="Parvo ledger status">
          <div className="orbital-ring"><Radar size={42} /></div>
          <Metric icon={<BadgeDollarSign size={18} />} label="Escrowed" value={`${dashboard.ledger.total_escrowed ?? "0"} GEN`} />
          <Metric icon={<ShieldCheck size={18} />} label="Paid to payees" value={`${dashboard.ledger.total_paid_to_payees ?? "0"} GEN`} />
          <Metric icon={<Waypoints size={18} />} label="Checks run" value={String(dashboard.ledger.checks_run ?? "0")} />
        </div>
      </section>

      {error && <p className="pv-alert">{error}</p>}
      {loading && <p className="muted"><LoaderCircle className="spin" size={16} /> Reading archive bonds...</p>}

      <section className="workspace-grid">
        <div>
          <div className="section-heading">
            <div>
              <p className="eyebrow">Live assurance</p>
              <h2>Promise bonds</h2>
            </div>
            <span className="soft-stat">{dashboard.ledger.bonds_created ?? "0"} created</span>
          </div>
          <div className="bonds-grid">
            {bonds.map((bond) => <BondCard key={String(bond.bond_id)} bond={bond} />)}
            {bonds.length === 0 && !loading && !error && <EmptyBonds />}
          </div>
        </div>
        <CreateBondForm onFinalized={refresh} />
      </section>
    </main>
  );
}

function Metric({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return <div className="metric">{icon}<span>{label}</span><strong>{value}</strong></div>;
}

function EmptyBonds() {
  return (
    <article className="empty-state">
      <p className="eyebrow">No promises bonded</p>
      <h3>Create the first public assurance capsule.</h3>
      <p>Parvo intentionally avoids fake fallback data. When the contract is empty, the dashboard stays empty.</p>
      <Archive size={22} />
    </article>
  );
}
