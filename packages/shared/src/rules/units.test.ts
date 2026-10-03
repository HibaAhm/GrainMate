import { describe, expect, it } from "vitest";
import { fromKg, KG_PER_QUINTAL, toKg } from "./units";

describe("toKg", () => {
  it("keeps kg as kg", () => {
    expect(toKg(12.5, "kg")).toBe(12.5);
  });

  it("converts quintals: 1 quintal = 100 kg", () => {
    expect(KG_PER_QUINTAL).toBe(100);
    expect(toKg(1, "quintal")).toBe(100);
    expect(toKg(2.5, "quintal")).toBe(250);
  });

  it("converts sacks using the product sack weight", () => {
    expect(toKg(3, "sack", 50)).toBe(150);
    expect(toKg(1.5, "sack", 100)).toBe(150);
  });

  it("requires sackWeightKg for sacks", () => {
    expect(() => toKg(1, "sack")).toThrow(RangeError);
    expect(() => toKg(1, "sack", 0)).toThrow(RangeError);
    expect(() => toKg(1, "sack", -5)).toThrow(RangeError);
  });

  it("rejects non-finite amounts", () => {
    expect(() => toKg(Number.NaN, "kg")).toThrow(RangeError);
    expect(() => toKg(Number.POSITIVE_INFINITY, "quintal")).toThrow(RangeError);
  });
});

describe("fromKg", () => {
  it("converts kg to quintals and sacks", () => {
    expect(fromKg(250, "quintal")).toBe(2.5);
    expect(fromKg(150, "sack", 50)).toBe(3);
    expect(fromKg(12.5, "kg")).toBe(12.5);
  });

  it("is the inverse of toKg", () => {
    expect(fromKg(toKg(7.25, "sack", 40), "sack", 40)).toBeCloseTo(7.25);
    expect(fromKg(toKg(0.3, "quintal"), "quintal")).toBeCloseTo(0.3);
  });

  it("requires sackWeightKg for sacks", () => {
    expect(() => fromKg(100, "sack")).toThrow(RangeError);
  });
});
