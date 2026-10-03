import { describe, expect, it } from "vitest";
import { purchaseLineTotal, purchaseTotal } from "./purchase";

describe("purchaseLineTotal", () => {
  it("multiplies the shown amount by the price per unit", () => {
    expect(purchaseLineTotal(250, "quintal", 8000)).toBe(20000);
    expect(purchaseLineTotal(12.5, "kg", 80)).toBe(1000);
    expect(purchaseLineTotal(150, "sack", 4000, 50)).toBe(12000);
  });

  it("rejects negative or non-finite prices", () => {
    expect(() => purchaseLineTotal(100, "kg", -1)).toThrow(RangeError);
    expect(() => purchaseLineTotal(100, "kg", Number.NaN)).toThrow(RangeError);
  });
});

describe("purchaseTotal", () => {
  it("returns 0 for no items", () => {
    expect(purchaseTotal([])).toBe(0);
  });

  it("sums the line totals", () => {
    expect(
      purchaseTotal([
        { lineTotal: 20000 },
        { lineTotal: 1000 },
        { lineTotal: 12000.5 },
      ]),
    ).toBe(33000.5);
  });
});
