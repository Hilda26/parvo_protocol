const BOND_LABELS: Record<string, string> = {
  ACTIVE: "Protected",
  BREACH_CLAIMED: "Breach window",
  CONTESTED: "In contest",
  BREACHED: "Paid out",
  EXPIRED: "Returned",
};

const POINT_LABELS: Record<string, string> = {
  HOLDS: "Still holds",
  WEAKENED: "Weakened",
  ABSENT: "Absent",
  INDETERMINATE: "Indeterminate",
};

export function bondLabel(status: string) {
  return BOND_LABELS[status] ?? status.toLowerCase().replaceAll("_", " ");
}

export function pointLabel(status: string) {
  return POINT_LABELS[status] ?? status.toLowerCase().replaceAll("_", " ");
}

export function statusTone(status: string) {
  if (["ACTIVE", "HOLDS", "EXPIRED"].includes(status)) return "aqua";
  if (["BREACH_CLAIMED", "CONTESTED", "INDETERMINATE"].includes(status)) return "violet";
  if (["WEAKENED", "ABSENT", "BREACHED"].includes(status)) return "rose";
  return "glass";
}
