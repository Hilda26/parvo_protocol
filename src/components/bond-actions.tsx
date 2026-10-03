"use client";

import { useState } from "react";
import { ArchiveRestore, BadgeCheck, CircleStop, RefreshCw, Scale, ShieldAlert } from "lucide-react";
import type { Bond } from "@/lib/parvo";
import { NetworkGuard, useNetworkGuard } from "@/components/network-guard";
import { TxLifecycleList } from "@/components/tx-lifecycle";
import { useWalletAction } from "@/components/wallet-action";
import { isHttpsUrl } from "@/lib/validation/url";

export function BondActions({ bond, onFinalized }: { bond: Bond; onFinalized: () => Promise<void> }) {
  const [contestUrl, setContestUrl] = useState(String(bond.url || "https://example.com/status"));
  const [contestTimestamp, setContestTimestamp] = useState(String(bond.breach_first_timestamp || bond.cursor_timestamp || bond.baseline_timestamp || "20260901000000"));
  const [contestBond, setContestBond] = useState(String(bond.contest_bond && bond.contest_bond !== "0" ? bond.contest_bond : Math.max(1, Math.floor(Number(bond.stake || 0) / 10))));
  const { error, transactions, send } = useWalletAction(onFinalized);
  const { wrongNetwork } = useNetworkGuard();
  const state = String(bond.state);
  const contestValid = state === "BREACH_CLAIMED" && isHttpsUrl(contestUrl) && /^[0-9]{14}$/.test(contestTimestamp) && Number.parseInt(contestBond || "0", 10) > 0;

  return (
    <section className="panel action-panel">
      <p className="eyebrow">Archive desk</p>
      <h2>Move this promise</h2>
      <NetworkGuard />
      {error && <p className="form-error">{error}</p>}

      {state === "ACTIVE" && (
        <>
          <button disabled={wrongNetwork} onClick={() => void send("Check archives", "check_commitment", [String(bond.bond_id)])}>
            <RefreshCw size={16} /> Check archives
          </button>
          <button className="quiet" disabled={wrongNetwork} onClick={() => void send("Expire bond", "expire_bond", [String(bond.bond_id)])}>
            <CircleStop size={16} /> Expire if term ended
          </button>
        </>
      )}

      {state === "BREACH_CLAIMED" && (
        <form onSubmit={(event) => {
          event.preventDefault();
          if (!contestValid) return;
          void send("Contest breach", "contest_breach", [String(bond.bond_id), contestUrl.trim(), contestTimestamp.trim()], BigInt(contestBond));
        }}>
          <label>Evidence archive URL<input type="url" value={contestUrl} onChange={(event) => setContestUrl(event.target.value)} /></label>
          <label>Evidence timestamp<input value={contestTimestamp} onChange={(event) => setContestTimestamp(event.target.value.replace(/\D/g, "").slice(0, 14))} /></label>
          <label>Contest bond<input inputMode="numeric" value={contestBond} onChange={(event) => setContestBond(event.target.value.replace(/\D/g, ""))} /></label>
          <button disabled={!contestValid || wrongNetwork}><ShieldAlert size={16} /> Contest breach</button>
          <button type="button" className="quiet" disabled={wrongNetwork} onClick={() => void send("Settle breach", "settle_breach", [String(bond.bond_id)])}>
            <Scale size={16} /> Settle after window
          </button>
        </form>
      )}

      {state === "CONTESTED" && (
        <button disabled={wrongNetwork} onClick={() => void send("Adjudicate contest", "adjudicate_contest", [String(bond.bond_id)])}>
          <BadgeCheck size={16} /> Adjudicate contest
        </button>
      )}

      {["BREACHED", "EXPIRED"].includes(state) && (
        <p className="muted"><ArchiveRestore size={16} /> This promise is closed on-chain.</p>
      )}

      <TxLifecycleList transactions={transactions} />
    </section>
  );
}
