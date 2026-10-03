import type { Payment } from "../entities/payment";
import type { Purchase } from "../entities/purchase";

type BalancePurchase = Pick<Purchase, "total" | "cancelled">;
type BalancePayment = Pick<Payment, "amount" | "direction" | "cancelled">;

/**
 * What the shop still owes one supplier: purchases minus payments, never below 0.
 * Pass the purchases and payments of that one supplier. Cancelled records are ignored.
 */
export function supplierBalance(
  purchases: readonly BalancePurchase[],
  payments: readonly BalancePayment[],
): number {
  const owed = purchases
    .filter((p) => !p.cancelled)
    .reduce((sum, p) => sum + p.total, 0);
  const paid = payments
    .filter((p) => !p.cancelled && p.direction === "out")
    .reduce((sum, p) => sum + p.amount, 0);
  return Math.max(0, owed - paid);
}
