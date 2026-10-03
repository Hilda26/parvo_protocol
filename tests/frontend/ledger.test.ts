import { describe, expect, it } from "vitest";
import { EMPTY_DASHBOARD } from "@/lib/parvo";

describe("Parvo dashboard fallback", () => {
  it("does not invent promise bonds when reads fail", () => {
    expect(EMPTY_DASHBOARD.ledger.bonds_created).toBe("0");
    expect(EMPTY_DASHBOARD.ledger.total_escrowed).toBe("0");
    expect(EMPTY_DASHBOARD.bonds).toEqual([]);
  });
});
