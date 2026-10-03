"use client";

import { createClient } from "genlayer-js";
import { studionet } from "genlayer-js/chains";
import { TransactionStatus } from "genlayer-js/types";
import type { CalldataEncodable, TransactionHash } from "genlayer-js/types";

const DEFAULT_CONTRACT_ADDRESS = "0xe38Fcd81fbFD216A0d44968463784f822a682602" as const;
export const CONTRACT_ADDRESS = (process.env.NEXT_PUBLIC_PARVO_CONTRACT || DEFAULT_CONTRACT_ADDRESS) as `0x${string}` | undefined;
const endpoint = process.env.NEXT_PUBLIC_GENLAYER_ENDPOINT ?? "https://studio.genlayer.com/api";
const explorer = "https://explorer-studio.genlayer.com";

export type BondState = "ACTIVE" | "BREACH_CLAIMED" | "CONTESTED" | "BREACHED" | "EXPIRED" | string;

export type BondListItem = {
  bond_id: string;
  url: string;
  state: BondState;
  stake: string;
  expires_at: string;
  cursor_timestamp: string;
  checks_passed: string;
  points_recorded: string;
};

export type Bond = BondListItem & {
  promisor: string;
  payee: string;
  commitment: string;
  commitment_sha256: string;
  anchor: string;
  baseline_timestamp: string;
  term_days: string;
  created_at: string;
  run_length: string;
  breach_first_timestamp: string;
  breach_first_digest: string;
  breach_second_timestamp: string;
  breach_second_digest: string;
  breach_excerpt: string;
  breach_rationale: string;
  contest_deadline: string;
  contest_url: string;
  contest_timestamp: string;
  contest_bond: string;
  contest_outcome: string;
  paid_to_payee: string;
  returned_to_promisor: string;
};

export type HistoryPoint = {
  timestamp: string;
  digest: string;
  raw_len: string;
  encoding: string;
  decoded_sha256: string;
  text_len: string;
  qualified: boolean | string;
  failed_gates: string;
  classification: "HOLDS" | "WEAKENED" | "ABSENT" | "INDETERMINATE" | string;
  excerpt: string;
  rationale: string;
  observed_at: string;
};

export type CommitmentStatus = {
  state: BondState;
  url: string;
  commitment: string;
  baseline_timestamp: string;
  cursor_timestamp: string;
  expires_at: string;
  examined: string;
  qualified: string;
  gate_rejected: string;
  holds: string;
  weakened: string;
  absent: string;
  indeterminate: string;
  run_length: string;
  breach_run_needed: string;
};

export type ParvoLedger = {
  total_escrowed: string;
  total_paid_to_payees: string;
  total_returned_to_promisors: string;
  bonds_created: string;
  checks_run: string;
  breaches_claimed: string;
  contests_filed: string;
  fee_basis_points: string;
};

export type Limits = Record<string, string>;
export type Dashboard = { ledger: ParvoLedger; bonds: BondListItem[]; limits: Limits };

export const EMPTY_LEDGER: ParvoLedger = {
  total_escrowed: "0",
  total_paid_to_payees: "0",
  total_returned_to_promisors: "0",
  bonds_created: "0",
  checks_run: "0",
  breaches_claimed: "0",
  contests_filed: "0",
  fee_basis_points: "0",
};

export const EMPTY_DASHBOARD: Dashboard = { ledger: EMPTY_LEDGER, bonds: [], limits: {} };

export const txUrl = (hash: string) => `${explorer}/tx/${hash}`;
export const addressUrl = (address: string) => `${explorer}/address/${address}`;

type EncodedArg =
  | string
  | number
  | boolean
  | null
  | EncodedArg[]
  | { __parvoBigInt: string }
  | { [key: string]: EncodedArg };

function client(account?: `0x${string}`) {
  return createClient({ chain: studionet, endpoint, account, provider: typeof window === "undefined" ? undefined : window.ethereum });
}

function configuredAddress(): `0x${string}` {
  if (!CONTRACT_ADDRESS || /^0x0{40}$/i.test(CONTRACT_ADDRESS)) throw new Error("Parvo contract not configured.");
  return CONTRACT_ADDRESS;
}

export async function readContract<T>(functionName: string, args: CalldataEncodable[] = []): Promise<T> {
  if (typeof window !== "undefined") {
    const response = await fetch("/api/parvo/read", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ functionName, args: args.map(encodeArg) }),
    });
    const payload = await response.json() as { result?: T; error?: string };
    if (!response.ok || payload.error) {
      throw new Error(`Unable to read Parvo on StudioNet: ${payload.error ?? response.statusText}`);
    }
    return payload.result as T;
  }

  try {
    return await client().readContract({ address: configuredAddress(), functionName, args }) as T;
  } catch (error) {
    throw new Error(`Unable to read Parvo on StudioNet: ${error instanceof Error ? error.message : "RPC request failed."}`);
  }
}

function encodeArg(value: CalldataEncodable): EncodedArg {
  if (typeof value === "bigint") return { __parvoBigInt: value.toString() };
  if (Array.isArray(value)) return value.map((item) => encodeArg(item as CalldataEncodable));
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, encodeArg(item as CalldataEncodable)]));
  }
  return value as EncodedArg;
}

export async function loadDashboard(): Promise<Dashboard> {
  const [ledger, bonds, limits] = await Promise.all([
    readContract<ParvoLedger>("get_ledger"),
    readContract<BondListItem[]>("list_bonds"),
    readContract<Limits>("get_limits"),
  ]);
  return { ledger, bonds, limits };
}

export async function loadBond(id: string): Promise<{ bond: Bond; status: CommitmentStatus; history: HistoryPoint[] }> {
  const [bond, status, history] = await Promise.all([
    readContract<Bond>("get_bond", [id]),
    readContract<CommitmentStatus>("commitment_status", [id]),
    readContract<HistoryPoint[]>("bond_history", [id]),
  ]);
  return { bond, status, history };
}

export async function writeContract(account: `0x${string}`, functionName: string, args: CalldataEncodable[], value = 0n) {
  const writer = client(account);
  await writer.connect("studionet");
  return await writer.writeContract({ address: configuredAddress(), functionName, args, value, consensusMaxRotations: 3 }) as TransactionHash;
}

export async function waitFinalized(account: `0x${string}`, hash: TransactionHash) {
  const writer = client(account);
  await writer.connect("studionet");
  await writer.waitForTransactionReceipt({ hash, status: TransactionStatus.FINALIZED, interval: 5000, retries: 180 });
  const transaction = await writer.getTransaction({ hash });
  const execution = transaction?.consensus_data?.leader_receipt?.[0]?.execution_result;
  if (execution && execution !== "SUCCESS") throw new Error(`Finalized transaction rolled back (${execution}).`);
  return { transaction, triggered: (transaction as unknown as { triggered_transactions?: string[] } | undefined)?.triggered_transactions ?? [] };
}

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
      on?: (event: string, handler: (...args: unknown[]) => void) => void;
      removeListener?: (event: string, handler: (...args: unknown[]) => void) => void;
    };
  }
}
