import { z } from "zod";
import {
  baseRecordSchema,
  cancellableSchema,
  idSchema,
  isoDateSchema,
  kgSchema,
  moneySchema,
} from "./base";
import { unitSchema } from "./product";

/**
 * One line of a purchase. Stored inside the purchase, not as its own record.
 * amountKg is the truth; unitShown and pricePerUnit are what the user typed.
 */
export const purchaseItemSchema = z.object({
  typeId: idSchema,
  amountKg: kgSchema.positive(),
  unitShown: unitSchema,
  /** Price for one unitShown (per kg, per quintal, or per sack). */
  pricePerUnit: moneySchema,
  /** amount in unitShown × pricePerUnit, stored so totals never drift. */
  lineTotal: moneySchema,
});
export type PurchaseItem = z.infer<typeof purchaseItemSchema>;

export const purchaseSchema = baseRecordSchema
  .extend(cancellableSchema.shape)
  .extend({
    supplierId: idSchema,
    items: z.array(purchaseItemSchema).min(1),
    total: moneySchema,
    /** Date the supplier must be paid by. null when there is no credit. */
    dueDate: isoDateSchema.nullable(),
  });
export type Purchase = z.infer<typeof purchaseSchema>;
