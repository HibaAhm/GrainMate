import { describe, expect, it } from "vitest";
import {
  entitySchemas,
  entityTypeSchema,
  pullRequestSchema,
  pullResponseSchema,
  pushRequestSchema,
  pushResponseSchema,
  setupRequestSchema,
  syncOperationSchema,
} from "./sync";

const opId = "3f2504e0-4f89-41d3-9a0c-0305e82c3301";
const entityId = "9b2c8f1e-0f3a-4b6d-8c2e-1a2b3c4d5e6f";

const operation = {
  operationId: opId,
  entityType: "supplier",
  entityId,
  operation: "create",
  payload: { name: "Abebe" },
  createdAt: "2026-10-03T06:00:00.000Z",
};

describe("entitySchemas", () => {
  it("has a schema for every entity type", () => {
    for (const type of entityTypeSchema.options) {
      expect(entitySchemas[type]).toBeDefined();
    }
  });
});

describe("syncOperationSchema", () => {
  it("accepts create, edit and cancel", () => {
    for (const kind of ["create", "edit", "cancel"]) {
      expect(
        syncOperationSchema.safeParse({ ...operation, operation: kind })
          .success,
      ).toBe(true);
    }
  });

  it("rejects delete (records are never removed)", () => {
    expect(
      syncOperationSchema.safeParse({ ...operation, operation: "delete" })
        .success,
    ).toBe(false);
  });

  it("rejects unknown entity types", () => {
    expect(
      syncOperationSchema.safeParse({ ...operation, entityType: "customer" })
        .success,
    ).toBe(false);
  });
});

describe("push", () => {
  it("accepts a push request and response", () => {
    expect(
      pushRequestSchema.safeParse({
        deviceId: "pixel-7",
        operations: [operation],
      }).success,
    ).toBe(true);
    expect(
      pushResponseSchema.safeParse({
        results: [
          { operationId: opId, status: "applied" },
          { operationId: opId, status: "duplicate" },
          { operationId: opId, status: "rejected", reason: "version conflict" },
        ],
      }).success,
    ).toBe(true);
  });

  it("rejects an empty deviceId and unknown statuses", () => {
    expect(
      pushRequestSchema.safeParse({ deviceId: " ", operations: [] }).success,
    ).toBe(false);
    expect(
      pushResponseSchema.safeParse({
        results: [{ operationId: opId, status: "failed" }],
      }).success,
    ).toBe(false);
  });
});

describe("pull", () => {
  it("accepts since = null for the first pull and a marker afterwards", () => {
    expect(
      pullRequestSchema.safeParse({ deviceId: "pixel-7", since: null }).success,
    ).toBe(true);
    expect(
      pullRequestSchema.safeParse({ deviceId: "pixel-7", since: "42" }).success,
    ).toBe(true);
    expect(
      pullRequestSchema.safeParse({ deviceId: "pixel-7", since: "" }).success,
    ).toBe(false);
  });

  it("accepts a pull response", () => {
    expect(
      pullResponseSchema.safeParse({
        changes: [
          { entityType: "product", entityId, payload: { name: "Teff" } },
        ],
        nextMarker: "43",
        hasMore: false,
      }).success,
    ).toBe(true);
  });
});

describe("setupRequestSchema", () => {
  const proof = "A".repeat(64).toLowerCase().replace(/a/g, "f");

  it("accepts a valid setup request and lowercases the proof", () => {
    const parsed = setupRequestSchema.parse({
      deviceId: "pixel-7",
      ownerName: "Abebe",
      shopName: "Abebe Grain",
      recoveryProof: proof.toUpperCase(),
    });
    expect(parsed.recoveryProof).toBe(proof);
  });

  it("rejects a proof that is not a hex SHA-256 digest", () => {
    const bad = { deviceId: "pixel-7", ownerName: "Abebe", shopName: "Shop" };
    expect(
      setupRequestSchema.safeParse({ ...bad, recoveryProof: "K7F2-9QXM-4TB8" })
        .success,
    ).toBe(false);
    expect(
      setupRequestSchema.safeParse({ ...bad, recoveryProof: "f".repeat(63) })
        .success,
    ).toBe(false);
  });
});
