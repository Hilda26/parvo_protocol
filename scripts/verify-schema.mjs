import { readFileSync } from "node:fs";

const source = readFileSync(new URL("../contracts/Parvo.py", import.meta.url), "utf8");
const required = [
  "class Parvo(gl.Contract)",
  "def create_bond",
  "def check_commitment",
  "def contest_breach",
  "def adjudicate_contest",
  "def settle_breach",
  "def expire_bond",
  "def list_bonds",
  "def get_bond",
  "def bond_history",
  "def commitment_status",
  "def get_ledger",
  "def get_limits",
];

const missing = required.filter((needle) => !source.includes(needle));
if (missing.length) {
  console.error(`Parvo contract missing expected entries: ${missing.join(", ")}`);
  process.exit(1);
}

console.log("Parvo schema surface verified.");
