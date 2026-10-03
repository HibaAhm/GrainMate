import { describe, expect, it } from "vitest";
import { baseRecordSchema } from "./base";
import { paymentSchema } from "./payment";
import { productSchema, productTypeSchema } from "./product";
import { purchaseSchema } from "./purchase";
import { stockAdjustmentSchema, stockMovementSchema } from "./stock";
import { supplierSchema } from "./supplier";

const id = "3f2504e0-4f89-41d3-9a0c-0305e82c3301";
const ownerId = "9b2c8f1e-0f3a-4b6d-8c2e-1a2b3c4d5e6f";
const other = "7d9f6a1c-2b3e-4f5a-9c8d-0e1f2a3b4c5d";

const base = {
  id,
  ownerId,
  version: 1,
  createdAt: "2026-10-03T06:00:00.000Z",
  updatedAt: "2026-10-03T06:00:00.000Z",
};

describe("baseRecordSchema", () => {
  it("accepts a valid base record", () => {
    expect(baseRecordSchema.parse(base)).toEqual(base);
  });

  it("accepts ISO strings with a timezone offset", () => {
    expect(
      baseRecordSchema.safeParse({
        ...base,
        createdAt: "2026-10-03T09:00:00+03:00",
      }).success,
    ).toBe(true);
  });

  it("rejects a non-UUID id", () => {
    expect(baseRecordSchema.safeParse({ ...base, id: "abc" }).success).toBe(
      false,
    );
  });

  it("rejects version below 1 or not an integer", () => {
    expect(baseRecordSchema.safeParse({ ...base, version: 0 }).success).toBe(
      false,
    );
    expect(baseRecordSchema.safeParse({ ...base, version: 1.5 }).success).toBe(
      false,
    );
  });

  it("rejects non-ISO dates", () => {
    expect(
      baseRecordSchema.safeParse({ ...base, createdAt: "03/10/2026" }).success,
    ).toBe(false);
  });
});

describe("productSchema", () => {
  const product = {
    ...base,
    name: "Teff",
    baseUnit: "quintal",
    sackWeightKg: 50,
    archived: false,
  };

  it("accepts a valid product", () => {
    expect(productSchema.parse(product)).toEqual(product);
  });

  it("requires archived, a name and a positive sack weight", () => {
    expect(
      productSchema.safeParse({ ...product, archived: undefined }).success,
    ).toBe(false);
    expect(productSchema.safeParse({ ...product, name: "  " }).success).toBe(
      false,
    );
    expect(
      productSchema.safeParse({ ...product, sackWeightKg: 0 }).success,
    ).toBe(false);
    expect(
      productSchema.safeParse({ ...product, baseUnit: "ton" }).success,
    ).toBe(false);
  });
});

describe("productTypeSchema", () => {
  const type = {
    ...base,
    productId: other,
    name: "White Teff",
    stockKg: 237.5,
    price: 120,
    avgBuyingPricePerKg: 95.5,
    lowStockKg: 50,
    archived: false,
  };

  it("accepts a valid type", () => {
    expect(productTypeSchema.parse(type)).toEqual(type);
  });

  it("rejects negative prices", () => {
    expect(productTypeSchema.safeParse({ ...type, price: -1 }).success).toBe(
      false,
    );
    expect(
      productTypeSchema.safeParse({ ...type, avgBuyingPricePerKg: -1 }).success,
    ).toBe(false);
  });
});

describe("supplierSchema", () => {
  const supplier = { ...base, name: "Abebe", archived: false };

  it("accepts a supplier with or without a phone", () => {
    expect(supplierSchema.parse(supplier)).toEqual(supplier);
    expect(
      supplierSchema.parse({ ...supplier, phone: "+251911000000" }).phone,
    ).toBe("+251911000000");
  });
});

describe("purchaseSchema", () => {
  const item = {
    typeId: other,
    amountKg: 250,
    unitShown: "quintal",
    pricePerUnit: 8000,
    lineTotal: 20000,
  };
  const purchase = {
    ...base,
    supplierId: other,
    items: [item],
    total: 20000,
    dueDate: "2026-11-01",
    cancelled: false,
  };

  it("accepts a valid purchase", () => {
    expect(purchaseSchema.parse(purchase)).toEqual(purchase);
  });

  it("allows dueDate to be null", () => {
    expect(
      purchaseSchema.safeParse({ ...purchase, dueDate: null }).success,
    ).toBe(true);
  });

  it("requires at least one item", () => {
    expect(purchaseSchema.safeParse({ ...purchase, items: [] }).success).toBe(
      false,
    );
  });

  it("rejects an item with 0 kg", () => {
    expect(
      purchaseSchema.safeParse({
        ...purchase,
        items: [{ ...item, amountKg: 0 }],
      }).success,
    ).toBe(false);
  });
});

describe("paymentSchema", () => {
  const payment = {
    ...base,
    direction: "out",
    supplierId: other,
    purchaseId: other,
    amount: 5000,
    method: "Cash",
    cancelled: false,
  };

  it("accepts cash and mobile banking payments", () => {
    expect(paymentSchema.parse(payment)).toEqual(payment);
    expect(
      paymentSchema.safeParse({
        ...payment,
        method: "MobileBanking",
        screenshotLink: "file:///x.jpg",
      }).success,
    ).toBe(true);
  });

  it("rejects other directions, methods, and a zero amount", () => {
    expect(
      paymentSchema.safeParse({ ...payment, direction: "in" }).success,
    ).toBe(false);
    expect(
      paymentSchema.safeParse({ ...payment, method: "Card" }).success,
    ).toBe(false);
    expect(paymentSchema.safeParse({ ...payment, amount: 0 }).success).toBe(
      false,
    );
  });
});

describe("stockAdjustmentSchema", () => {
  const adjustment = {
    ...base,
    typeId: other,
    changeKg: -12.5,
    reason: "Spoiled",
    note: "",
    cancelled: false,
  };

  it("accepts a valid adjustment", () => {
    expect(stockAdjustmentSchema.parse(adjustment)).toEqual(adjustment);
  });

  it("rejects a 0 change and unknown reasons", () => {
    expect(
      stockAdjustmentSchema.safeParse({ ...adjustment, changeKg: 0 }).success,
    ).toBe(false);
    expect(
      stockAdjustmentSchema.safeParse({ ...adjustment, reason: "Stolen" })
        .success,
    ).toBe(false);
  });
});

describe("stockMovementSchema", () => {
  const movement = {
    ...base,
    typeId: other,
    changeKg: 250,
    reason: "purchase",
    linkedRecordId: other,
    cancelled: false,
  };

  it("accepts every movement reason", () => {
    for (const reason of [
      "purchase",
      "sale",
      "order",
      "adjustment",
      "reversal",
      "closeRemaining",
    ]) {
      expect(
        stockMovementSchema.safeParse({ ...movement, reason }).success,
      ).toBe(true);
    }
  });

  it("requires a linked record and a non-zero change", () => {
    expect(
      stockMovementSchema.safeParse({ ...movement, linkedRecordId: "x" })
        .success,
    ).toBe(false);
    expect(
      stockMovementSchema.safeParse({ ...movement, changeKg: 0 }).success,
    ).toBe(false);
  });
});
