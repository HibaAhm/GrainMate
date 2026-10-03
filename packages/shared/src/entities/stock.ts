import { z } from "zod";
import { baseRecordSchema, cancellableSchema, idSchema } from "./base";

/** A kg change that is not zero. Positive adds stock, negative removes it. */
const changeKgSchema = z
  .number()
  .refine((n) => n !== 0, { message: "changeKg must not be 0" });

export const stockAdjustmentReasonSchema = z.enum([
  "Spoiled",
  "Lost",
  "Recount",
  "Other",
]);
export type StockAdjustmentReason = z.infer<typeof stockAdjustmentReasonSchema>;

/** A manual correction entered by the shop owner. It produces a stock movement. */
export const stockAdjustmentSchema = baseRecordSchema
  .extend(cancellableSchema.shape)
  .extend({
    typeId: idSchema,
    changeKg: changeKgSchema,
    reason: stockAdjustmentReasonSchema,
    note: z.string().trim(),
  });
export type StockAdjustment = z.infer<typeof stockAdjustmentSchema>;

export const stockMovementReasonSchema = z.enum([
  "purchase",
  "sale",
  "order",
  "adjustment",
  "reversal",
  "closeRemaining",
]);
export type StockMovementReason = z.infer<typeof stockMovementReasonSchema>;

/**
 * The only thing that changes stock. Stock of a type = sum of its movements.
 * Undo is done by adding a "reversal" movement, not by editing this one.
 */
export const stockMovementSchema = baseRecordSchema
  .extend(cancellableSchema.shape)
  .extend({
    typeId: idSchema,
    changeKg: changeKgSchema,
    reason: stockMovementReasonSchema,
    /** The purchase, sale, order, adjustment, or movement that caused this change. */
    linkedRecordId: idSchema,
  });
export type StockMovement = z.infer<typeof stockMovementSchema>;
