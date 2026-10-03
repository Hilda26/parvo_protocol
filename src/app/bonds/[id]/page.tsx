"use client";

import Link from "next/link";
import { use, useCallback, useEffect, useState } from "react";
import { ExternalLink, LoaderCircle } from "lucide-react";
import { BondActions } from "@/components/bond-actions";
import { addressUrl, loadBond, type Bond, type CommitmentStatus, type HistoryPoint } from "@/lib/parvo";
import { bondLabel, pointLabel, statusTone } from "@/lib/contract/status";

export default function BondDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [bond, setBond] = useState<Bond>();
  const [status, setStatus] = useState<CommitmentStatus>();
  const [history, setHistory] = useState<HistoryPoint[]>([]);
  const [error, setError] = useState<string>();

  const refresh = useCallback(async () => {
    try {
      const next = await loadBond(id);
      setBond(next.bond);
      setStatus(next.status);
      setHistory(next.history);
      setError(undefined);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to load bond.");
    }
  }, [id]);

  useEffect(() => { void refresh(); }, [refresh]);

  if (error) return <main className="pv-body"><p className="pv-alert">{error}</p><Link className="back-link" href="/">Back to command</Link></main>;
  if (!bond || !status) return <main className="pv-body"><p className="muted"><LoaderCircle className="spin" size={16} /> Reading bond...</p></main>;

  const state = String(bond.state);
  const breachProgress = Math.min(100, Math.round((Number(status.run_length || 0) / Math.max(1, Number(status.breach_run_needed || 2))) * 100));

  return (
    <main className="pv-body">
      <Link className="back-link" href="/">Back to command</Link>
      <section className="bond-detail">
        <p className="eyebrow">Assurance capsule</p>
        <h1>{String(bond.bond_id)}</h1>
        <p className="lede"><span className={`badge ${statusTone(state)}`}>{bondLabel(state)}</span> {String(bond.stake)} GEN stake · expires {String(bond.expires_at || "after term")}</p>
      </section>

      <section className="detail-grid">
        <article className="panel">
          <p className="eyebrow">Quoted promise</p>
          <p className="trigger-copy">{String(bond.commitment)}</p>
          <dl className="detail-list">
            <dt>Promisor</dt><dd><a href={addressUrl(String(bond.promisor))} target="_blank" rel="noreferrer"><code>{String(bond.promisor)}</code></a></dd>
            <dt>Payee</dt><dd><a href={addressUrl(String(bond.payee))} target="_blank" rel="noreferrer"><code>{String(bond.payee)}</code></a></dd>
            <dt>Source</dt><dd><a href={String(bond.url)} target="_blank" rel="noreferrer">Open page <ExternalLink size={12} /></a></dd>
            <dt>Baseline</dt><dd>{String(bond.baseline_timestamp)}</dd>
            <dt>Anchor</dt><dd>{String(bond.anchor)}</dd>
            <dt>Commitment hash</dt><dd><code>{String(bond.commitment_sha256)}</code></dd>
          </dl>
        </article>
        <BondActions bond={bond} onFinalized={refresh} />
      </section>

      <section className="panel status-panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Breach meter</p>
            <h2>Archive signal</h2>
          </div>
          <span className="soft-stat">{String(status.run_length)} / {String(status.breach_run_needed)} run</span>
        </div>
        <div className="bond-meter large"><span style={{ width: `${breachProgress}%` }} /></div>
        <div className="status-grid">
          <Metric label="Examined" value={String(status.examined)} />
          <Metric label="Qualified" value={String(status.qualified)} />
          <Metric label="Holds" value={String(status.holds)} />
          <Metric label="Weakened" value={String(status.weakened)} />
          <Metric label="Absent" value={String(status.absent)} />
          <Metric label="Gate rejected" value={String(status.gate_rejected)} />
        </div>
      </section>

      {state === "BREACH_CLAIMED" && (
        <section className="panel breach-panel">
          <p className="eyebrow">Breach claim</p>
          <h2>Two archive changes tripped the policy</h2>
          <p className="evidence-excerpt">{String(bond.breach_excerpt || "No excerpt recorded.")}</p>
          <p className="muted">{String(bond.breach_rationale || "No rationale recorded.")}</p>
          <dl className="detail-list">
            <dt>First point</dt><dd>{String(bond.breach_first_timestamp)}</dd>
            <dt>Second point</dt><dd>{String(bond.breach_second_timestamp)}</dd>
            <dt>Contest deadline</dt><dd>{String(bond.contest_deadline)}</dd>
          </dl>
        </section>
      )}

      <section className="panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Archive timeline</p>
            <h2>Checked snapshots</h2>
          </div>
          <span className="soft-stat">{history.length} frames</span>
        </div>
        <div className="timeline-list">
          {history.length === 0 && <p className="muted">No archive points checked yet.</p>}
          {history.map((point) => (
            <article key={`${point.timestamp}-${point.digest}`} className="timeline-row">
              <span className={`badge ${statusTone(String(point.classification))}`}>{point.classification ? pointLabel(String(point.classification)) : "Gate rejected"}</span>
              <strong>{String(point.timestamp)}</strong>
              <p>{String(point.excerpt || point.failed_gates || "Snapshot admitted without excerpt.")}</p>
              {point.rationale && <small>{String(point.rationale)}</small>}
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="status-metric"><span>{label}</span><strong>{value}</strong></div>;
}
