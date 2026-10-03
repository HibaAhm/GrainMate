import { z } from "zod";
import { archivableSchema, baseRecordSchema, idSchema, kgSchema } from "./base";

/** Units a quantity can be shown in. Stock is always stored in kg. */
export const unitSchema = z.enum(["kg", "quintal", "sack"]);
export type Unit = z.infer<typeof unitSchema>;

/** A grain product, e.g. "Teff". Its types are separate records. */
export const productSchema = baseRecordSchema
  .extend(archivableSchema.shape)
  .extend({
    name: z.string().trim().min(1),
    baseUnit: unitSchema,
    /** Weight of one sack of this product. Needed to convert sacks to kg. */
    sackWeightKg: kgSchema.positive(),
  });
export type Product = z.infer<typeof productSchema>;

/** A type (grade/variety) of a product, e.g. "White Teff". Stock and price live here. */
export const productTypeSchema = baseRecordSchema
  .extend(archivableSchema.shape)
  .extend({
    productId: idSchema,
    name: z.string().trim().min(1),
    /** Current stock in kg. Derived from stock movements, never edited by hand. */
    stockKg: z.number(),
    /** Selling price per kg. */
    price: z.number().nonnegative(),
    /** Weighted average buying price per kg. */
    avgBuyingPricePerKg: z.number().nonnegative(),
    /** Warn when stockKg falls to or below this. */
    lowStockKg: kgSchema,
  });
export type ProductType = z.infer<typeof productTypeSchema>;
