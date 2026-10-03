import { describe, expect, it } from "vitest";
import { stockKgFromMovements } from "./stock";

const teff = "11111111-1111-4111-8111-111111111111";
const wheat = "22222222-2222-4222-8222-222222222222";

describe("stockKgFromMovements", () => {
  it("is 0 with no movements", () => {
    expect(stockKgFromMovements([], teff)).toBe(0);
  });

  it("sums the movements of one type only", () => {
    const movements = [
      { typeId: teff, changeKg: 250, cancelled: false },
      { typeId: teff, changeKg: -12.5, cancelled: false },
      { typeId: wheat, changeKg: 1000, cancelled: false },
    ];
    expect(stockKgFromMovements(movements, teff)).toBe(237.5);
    expect(stockKgFromMovements(movements, wheat)).toBe(1000);
  });

  it("ignores cancelled movements", () => {
    const movements = [
      { typeId: teff, changeKg: 250, cancelled: false },
      { typeId: teff, changeKg: 500, cancelled: true },
    ];
    expect(stockKgFromMovements(movements, teff)).toBe(250);
  });

  it("a reversal movement undoes an earlier one", () => {
    const movements = [
      { typeId: teff, changeKg: 250, cancelled: false },
      { typeId: teff, changeKg: -250, cancelled: false },
    ];
    expect(stockKgFromMovements(movements, teff)).toBe(0);
  });
});
