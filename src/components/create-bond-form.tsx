"use client";

import { useMemo, useState } from "react";
import { CircleDollarSign, ShieldPlus } from "lucide-react";
import { NetworkGuard, useNetworkGuard } from "@/components/network-guard";
import { TxLifecycleList } from "@/components/tx-lifecycle";
import { useWalletAction } from "@/components/wallet-action";
import { isBondId, isHttpsUrl } from "@/lib/validation/url";

const DEFAULT_PAYEE = "0x0000000000000000000000000000000000000000";

export function CreateBondForm({ onFinalized }: { onFinalized: () => Promise<void> }) {
  const [bondId, setBondId] = useState("parvo-uptime-promise-1");
  const [url, setUrl] = useState("https://example.com/status");
  const [commitment, setCommitment] = useState("We will publish a customer-facing service status update within four hours of any verified outage affecting production users.");
  const [baselineTimestamp, setBaselineTimestamp] = useState("20260901000000");
  const [anchorWords, setAnchorWords] = useState("service status update");
  const [anchorTerminal, setAnchorTerminal] = useState("production users.");
  const [payee, setPayee] = useState(DEFAULT_PAYEE);
  const [termDays, setTermDays] = useState("90");
  const [stake, setStake] = useState("5");
  const { error, transactions, send } = useWalletAction(onFinalized);
  const { wrongNetwork } = useNetworkGuard();

  const anchorJson = useMemo(() => {
    const words = anchorWords.split(/[\s,]+/).map((word) => word.trim()).filter(Boolean);
    return JSON.stringify(words);
  }, [anchorWords]);

  const valid = isBondId(bondId)
    && isHttpsUrl(url)
    && commitment.trim().length >= 40
    && /^[0-9]{14}$/.test(baselineTimestamp)
    && anchorWords.split(/[\s,]+/).filter(Boolean).length >= 3
    && anchorTerminal.trim().length >= 3
    && /^0x[a-fA-F0-9]{40}$/.test(payee)
    && Number.parseInt(termDays || "0", 10) >= 30
    && Number.parseInt(termDays || "0", 10) <= 1095
    && Number.parseInt(stake || "0", 10) > 0;

  return (
    <section className="panel submit-panel">
      <p className="eyebrow">Assurance capsule</p>
      <h2>Create a promise bond</h2>
      <NetworkGuard />
      {error && <p className="form-error">{error}</p>}
      <form onSubmit={(event) => {
        event.preventDefault();
        if (!valid) return;
        void send(
          "Create promise bond",
          "create_bond",
          [
            bondId.trim(),
            url.trim(),
            commitment.trim(),
            baselineTimestamp.trim(),
            anchorJson,
            anchorTerminal.trim(),
            payee.trim(),
            Number.parseInt(termDays, 10),
          ],
          BigInt(stake)
        );
      }}>
        <label>Bond ID<input value={bondId} onChange={(event) => setBondId(event.target.value)} /></label>
        <label>Published promise URL<input type="url" value={url} onChange={(event) => setUrl(event.target.value)} /></label>
        <label>Quoted commitment<textarea value={commitment} onChange={(event) => setCommitment(event.target.value)} /></label>
        <div className="form-grid">
          <label>Baseline archive timestamp<input value={baselineTimestamp} onChange={(event) => setBaselineTimestamp(event.target.value.replace(/\D/g, "").slice(0, 14))} /></label>
          <label>Term days<input inputMode="numeric" value={termDays} onChange={(event) => setTermDays(event.target.value.replace(/\D/g, ""))} /></label>
        </div>
        <label>Anchor words<input value={anchorWords} onChange={(event) => setAnchorWords(event.target.value)} /></label>
        <label>Anchor terminal text<input value={anchorTerminal} onChange={(event) => setAnchorTerminal(event.target.value)} /></label>
        <div className="form-grid">
          <label>Payee address<input value={payee} onChange={(event) => setPayee(event.target.value)} /></label>
          <label>Stake<input inputMode="numeric" value={stake} onChange={(event) => setStake(event.target.value.replace(/\D/g, ""))} /></label>
        </div>
        <button disabled={!valid || wrongNetwork}><ShieldPlus size={16} /> Bond promise</button>
      </form>
      <div className="preview-strip">
        <CircleDollarSign size={16} />
        <span>{stake || "0"} GEN backs this promise. If Parvo sees two qualifying archive changes where it no longer holds, the payee can receive the stake after the contest window.</span>
      </div>
      <TxLifecycleList transactions={transactions} />
    </section>
  );
}
