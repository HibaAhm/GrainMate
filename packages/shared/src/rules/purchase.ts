import type { Unit } from "../entities/product";
import type { PurchaseItem } from "../entities/purchase";
import { fromKg } from "./units";

/** Line total = amount shown in unitShown × pricePerUnit. */
export function purchaseLineTotal(
  amountKg: number,
  unitShown: Unit,
  pricePerUnit: number,
  sackWeightKg?: number,
): number {
  if (!Number.isFinite(pricePerUnit) || pricePerUnit < 0) {
    throw new RangeError("pricePerUnit must be a non-negative finite number");
  }
  return fromKg(amountKg, unitShown, sackWeightKg) * pricePerUnit;
}

/** Sum of all line totals of a purchase. */
export function purchaseTotal(
  items: readonly Pick<PurchaseItem, "lineTotal">[],
): number {
  return items.reduce((sum, item) => sum + item.lineTotal, 0);
}
