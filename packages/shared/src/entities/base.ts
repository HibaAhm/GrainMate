import { z } from "zod";

/** UUID created on the phone. It is never replaced by the server. */
export const idSchema = z.uuid();

/** ISO 8601 Gregorian date-time string, e.g. "2026-10-03T06:00:00.000Z". */
export const isoDateTimeSchema = z.iso.datetime({ offset: true });

/** ISO 8601 Gregorian calendar date, e.g. "2026-10-03". */
export const isoDateSchema = z.iso.date();

/** Weight in kilograms. Decimals are allowed (12.5). */
export const kgSchema = z.number().nonnegative();

/** Money amount (ETB). Decimals are allowed. */
export const moneySchema = z.number().nonnegative();

/**
 * Fields that every stored record has.
 * Records are never deleted; they are archived or cancelled instead.
 */
export const baseRecordSchema = z.object({
  id: idSchema,
  ownerId: idSchema,
  version: z.number().int().min(1),
  createdAt: isoDateTimeSchema,
  updatedAt: isoDateTimeSchema,
});

export type BaseRecord = z.infer<typeof baseRecordSchema>;

/** Master data (product, type, supplier) is archived, not deleted. */
export const archivableSchema = z.object({ archived: z.boolean() });

/** Transactions (purchase, payment, adjustment, movement) are cancelled, not deleted. */
export const cancellableSchema = z.object({ cancelled: z.boolean() });
