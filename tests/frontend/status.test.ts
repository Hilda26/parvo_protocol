import { describe, expect, it } from "vitest";
import { bondLabel, pointLabel, statusTone } from "@/lib/contract/status";

describe("Parvo status helpers", () => {
  it("labels bond states for readers", () => {
    expect(bondLabel("ACTIVE")).toBe("Protected");
    expect(bondLabel("BREACH_CLAIMED")).toBe("Breach window");
    expect(bondLabel("BREACHED")).toBe("Paid out");
  });

  it("maps active, claimed, and breached states to distinct tones", () => {
    expect(statusTone("ACTIVE")).toBe("aqua");
    expect(statusTone("CONTESTED")).toBe("violet");
    expect(statusTone("ABSENT")).toBe("rose");
  });

  it("labels archive point classifications", () => {
    expect(pointLabel("HOLDS")).toBe("Still holds");
    expect(pointLabel("INDETERMINATE")).toBe("Indeterminate");
  });
});
