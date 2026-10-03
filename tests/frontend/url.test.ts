import { describe, expect, it } from "vitest";
import { isBondId, isHttpsUrl } from "@/lib/validation/url";

describe("Parvo input validation", () => {
  it("accepts only https urls", () => {
    expect(isHttpsUrl("https://example.com/report")).toBe(true);
    expect(isHttpsUrl("http://example.com/report")).toBe(false);
    expect(isHttpsUrl("not a url")).toBe(false);
  });

  it("keeps bond ids route-safe and contract-safe", () => {
    expect(isBondId("promise-bond_1")).toBe(true);
    expect(isBondId("ab")).toBe(false);
    expect(isBondId("bad/id")).toBe(false);
  });
});
