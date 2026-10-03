import { describe, expect, it } from "vitest";
import { newAverageBuyingPrice } from "./average-price";

describe("newAverageBuyingPrice", () => {
  it("returns a weighted average", () => {
    // 100 kg at 80 + 100 kg at 100 = 200 kg worth 18000 → 90 per kg
    expect(newAverageBuyingPrice(100, 80, 100, 100)).toBe(90);
    // 300 kg at 60 + 100 kg at 100 = 400 kg worth 28000 → 70 per kg
    expect(newAverageBuyingPrice(300, 60, 100, 100)).toBe(70);
  });

  it("works with decimals", () => {
    expect(newAverageBuyingPrice(12.5, 80, 12.5, 90)).toBeCloseTo(85);
  });

  it("uses the added price when there was no stock before", () => {
    expect(newAverageBuyingPrice(0, 0, 50, 95)).toBe(95);
    expect(newAverageBuyingPrice(0, 80, 50, 95)).toBe(95);
  });

  it("treats negative old stock as 0", () => {
    expect(newAverageBuyingPrice(-20, 80, 50, 95)).toBe(95);
  });

  it("rejects an addedKg of 0 or less", () => {
    expect(() => newAverageBuyingPrice(100, 80, 0, 90)).toThrow(RangeError);
    expect(() => newAverageBuyingPrice(100, 80, -5, 90)).toThrow(RangeError);
  });

  it("rejects negative prices and non-finite numbers", () => {
    expect(() => newAverageBuyingPrice(100, -1, 10, 90)).toThrow(RangeError);
    expect(() => newAverageBuyingPrice(100, 80, 10, -90)).toThrow(RangeError);
    expect(() => newAverageBuyingPrice(Number.NaN, 80, 10, 90)).toThrow(
      RangeError,
    );
  });
});
