import { z } from "zod";
import { archivableSchema, baseRecordSchema } from "./base";

export const supplierSchema = baseRecordSchema
  .extend(archivableSchema.shape)
  .extend({
    name: z.string().trim().min(1),
    phone: z.string().trim().min(1).optional(),
  });
export type Supplier = z.infer<typeof supplierSchema>;
