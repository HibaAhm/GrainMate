import { z } from "zod";
import {
  baseRecordSchema,
  cancellableSchema,
  idSchema,
  moneySchema,
} from "./base";

/** Phase 1 only has money going out to suppliers. */
export const paymentDirectionSchema = z.enum(["out"]);
export type PaymentDirection = z.infer<typeof paymentDirectionSchema>;

export const paymentMethodSchema = z.enum(["Cash", "MobileBanking"]);
export type PaymentMethod = z.infer<typeof paymentMethodSchema>;

export const paymentSchema = baseRecordSchema
  .extend(cancellableSchema.shape)
  .extend({
    direction: paymentDirectionSchema,
    supplierId: idSchema,
    purchaseId: idSchema,
    amount: moneySchema.positive(),
    method: paymentMethodSchema,
    /** Link or local path to a transfer screenshot (mobile banking). */
    screenshotLink: z.string().trim().min(1).optional(),
  });
export type Payment = z.infer<typeof paymentSchema>;
