import type { StockMovement } from "../entities/stock";

type StockInput = Pick<StockMovement, "typeId" | "changeKg" | "cancelled">;

/**
 * Stock is never edited directly. It is the sum of the stock movements of a type.
 * Cancelled movements are ignored. Undo should use a "reversal" movement.
 */
export function stockKgFromMovements(
  movements: readonly StockInput[],
  typeId: string,
): number {
  return movements
    .filter((m) => m.typeId === typeId && !m.cancelled)
    .reduce((sum, m) => sum + m.changeKg, 0);
}
