import { describe, expect, it } from "vitest";
import { supplierBalance } from "./supplier-balance";

const out = "out" as const;

describe("supplierBalance", () => {
  it("is 0 with no records", () => {
    expect(supplierBalance([], [])).toBe(0);
  });

  it("is total minus paid", () => {
    const purchases = [
      { total: 20000, cancelled: false },
      { total: 5000, cancelled: false },
    ];
    const payments = [
      { amount: 10000, direction: out, cancelled: false },
      { amount: 2500, direction: out, cancelled: false },
    ];
    expect(supplierBalance(purchases, payments)).toBe(12500);
  });

  it("ignores cancelled purchases and payments", () => {
    const purchases = [
      { total: 20000, cancelled: false },
      { total: 99999, cancelled: true },
    ];
    const payments = [
      { amount: 5000, direction: out, cancelled: false },
      { amount: 15000, direction: out, cancelled: true },
    ];
    expect(supplierBalance(purchases, payments)).toBe(15000);
  });

  it("never goes below 0 when the supplier was overpaid", () => {
    const purchases = [{ total: 1000, cancelled: false }];
    const payments = [{ amount: 1500, direction: out, cancelled: false }];
    expect(supplierBalance(purchases, payments)).toBe(0);
  });
});
