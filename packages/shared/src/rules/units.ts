import type { Unit } from "../entities/product";

export const KG_PER_QUINTAL = 100;

function assertFinite(value: number, name: string): void {
  if (!Number.isFinite(value)) {
    throw new RangeError(`${name} must be a finite number`);
  }
}

function kgPerUnit(unit: Unit, sackWeightKg?: number): number {
  switch (unit) {
    case "kg":
      return 1;
    case "quintal":
      return KG_PER_QUINTAL;
    case "sack":
      if (sackWeightKg === undefined) {
        throw new RangeError("sackWeightKg is required to convert sacks");
      }
      assertFinite(sackWeightKg, "sackWeightKg");
      if (sackWeightKg <= 0) {
        throw new RangeError("sackWeightKg must be greater than 0");
      }
      return sackWeightKg;
  }
}

/** Convert an amount in the given unit to kilograms. 1 quintal = 100 kg. 1 sack = sackWeightKg. */
export function toKg(
  amount: number,
  unit: Unit,
  sackWeightKg?: number,
): number {
  assertFinite(amount, "amount");
  return amount * kgPerUnit(unit, sackWeightKg);
}

/** Convert kilograms to the given unit. The inverse of toKg. */
export function fromKg(kg: number, unit: Unit, sackWeightKg?: number): number {
  assertFinite(kg, "kg");
  return kg / kgPerUnit(unit, sackWeightKg);
}
