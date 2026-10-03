import { z } from "zod";
import { idSchema, isoDateTimeSchema } from "../entities/base";
import { paymentSchema } from "../entities/payment";
import { productSchema, productTypeSchema } from "../entities/product";
import { purchaseSchema } from "../entities/purchase";
import { stockAdjustmentSchema, stockMovementSchema } from "../entities/stock";
import { supplierSchema } from "../entities/supplier";

export const entityTypeSchema = z.enum([
  "product",
  "type",
  "supplier",
  "purchase",
  "payment",
  "stockAdjustment",
  "stockMovement",
]);
export type EntityType = z.infer<typeof entityTypeSchema>;

/** Look up the record schema for an entityType, e.g. to validate a sync payload. */
export const entitySchemas = {
  product: productSchema,
  type: productTypeSchema,
  supplier: supplierSchema,
  purchase: purchaseSchema,
  payment: paymentSchema,
  stockAdjustment: stockAdjustmentSchema,
  stockMovement: stockMovementSchema,
} as const satisfies Record<EntityType, z.ZodType>;

export const syncOperationKindSchema = z.enum(["create", "edit", "cancel"]);
export type SyncOperationKind = z.infer<typeof syncOperationKindSchema>;

/** Device id: any non-empty string the phone generates once and keeps. */
export const deviceIdSchema = z.string().trim().min(1);

/** One change recorded on the phone, replayed on the server in order. */
export const syncOperationSchema = z.object({
  /** UUID made on the phone. The server uses it to detect duplicates. */
  operationId: idSchema,
  entityType: entityTypeSchema,
  entityId: idSchema,
  operation: syncOperationKindSchema,
  /** The full record after the change. Validated with entitySchemas[entityType]. */
  payload: z.record(z.string(), z.unknown()),
  createdAt: isoDateTimeSchema,
});
export type SyncOperation = z.infer<typeof syncOperationSchema>;

export const pushRequestSchema = z.object({
  deviceId: deviceIdSchema,
  operations: z.array(syncOperationSchema),
});
export type PushRequest = z.infer<typeof pushRequestSchema>;

export const pushResultStatusSchema = z.enum([
  "applied",
  "duplicate",
  "rejected",
]);
export type PushResultStatus = z.infer<typeof pushResultStatusSchema>;

export const pushResultSchema = z.object({
  operationId: idSchema,
  status: pushResultStatusSchema,
  reason: z.string().optional(),
});
export type PushResult = z.infer<typeof pushResultSchema>;

export const pushResponseSchema = z.object({
  results: z.array(pushResultSchema),
});
export type PushResponse = z.infer<typeof pushResponseSchema>;

/** Opaque server-side position. The phone stores it and sends it back as `since`. */
export const syncMarkerSchema = z.string().min(1);
export type SyncMarker = z.infer<typeof syncMarkerSchema>;

export const pullRequestSchema = z.object({
  deviceId: deviceIdSchema,
  /** null on the first pull (get everything). */
  since: syncMarkerSchema.nullable(),
});
export type PullRequest = z.infer<typeof pullRequestSchema>;

/** One record the phone must upsert locally. */
export const syncChangeSchema = z.object({
  entityType: entityTypeSchema,
  entityId: idSchema,
  payload: z.record(z.string(), z.unknown()),
});
export type SyncChange = z.infer<typeof syncChangeSchema>;

export const pullResponseSchema = z.object({
  changes: z.array(syncChangeSchema),
  nextMarker: syncMarkerSchema,
  hasMore: z.boolean(),
});
export type PullResponse = z.infer<typeof pullResponseSchema>;

/** Lowercase hex SHA-256 of (RECOVERY_PROOF_LABEL + normalized code). */
export const recoveryProofSchema = z
  .string()
  .regex(/^[0-9a-f]{64}$/i, "recoveryProof must be a hex SHA-256 digest")
  .transform((s) => s.toLowerCase());

export const setupRequestSchema = z.object({
  deviceId: deviceIdSchema,
  ownerName: z.string().trim().min(1),
  shopName: z.string().trim().min(1),
  recoveryProof: recoveryProofSchema,
});
export type SetupRequest = z.infer<typeof setupRequestSchema>;
