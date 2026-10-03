/**
 * Weighted average buying price per kg after adding new stock.
 *
 * (oldStockKg × oldAvgPrice + addedKg × addedPricePerKg) / (oldStockKg + addedKg)
 *
 * If there was no stock before (0 or negative), the new price is simply the added price.
 */
export function newAverageBuyingPrice(
  oldStockKg: number,
  oldAvgPrice: number,
  addedKg: number,
  addedPricePerKg: number,
): number {
  for (const [name, value] of [
    ["oldStockKg", oldStockKg],
    ["oldAvgPrice", oldAvgPrice],
    ["addedKg", addedKg],
    ["addedPricePerKg", addedPricePerKg],
  ] as const) {
    if (!Number.isFinite(value)) {
      throw new RangeError(`${name} must be a finite number`);
    }
  }
  if (addedKg <= 0) {
    throw new RangeError("addedKg must be greater than 0");
  }
  if (addedPricePerKg < 0 || oldAvgPrice < 0) {
    throw new RangeError("prices must not be negative");
  }

  const existingKg = Math.max(0, oldStockKg);
  if (existingKg === 0) {
    return addedPricePerKg;
  }
  return (
    (existingKg * oldAvgPrice + addedKg * addedPricePerKg) /
    (existingKg + addedKg)
  );
}
