import { describe, expect, it } from "vitest";
import {
  formatRecoveryCode,
  generateRecoveryCode,
  isValidRecoveryCode,
  normalizeRecoveryCode,
  RECOVERY_CODE_ALPHABET,
  RECOVERY_CODE_LENGTH,
  RECOVERY_PROOF_LABEL,
} from "./recovery-code";

describe("RECOVERY_CODE_ALPHABET", () => {
  it("has 32 unique characters without 0, O, 1, I", () => {
    expect(RECOVERY_CODE_ALPHABET).toHaveLength(32);
    expect(new Set(RECOVERY_CODE_ALPHABET).size).toBe(32);
    for (const banned of ["0", "O", "1", "I"]) {
      expect(RECOVERY_CODE_ALPHABET).not.toContain(banned);
    }
  });
});

describe("generateRecoveryCode", () => {
  it("maps each byte to one alphabet character (byte % 32)", () => {
    const bytes = Uint8Array.from([
      0, 1, 2, 31, 32, 33, 255, 100, 200, 64, 128, 7,
    ]);
    const expected = Array.from(
      bytes,
      (b) => RECOVERY_CODE_ALPHABET[b % 32],
    ).join("");
    expect(generateRecoveryCode(bytes)).toBe(expected);
    // 0→A 1→B 2→C 31→9 32→A 33→B 255→9 100→E 200→J 64→A 128→A 7→H
    expect(generateRecoveryCode(bytes)).toBe("ABC9AB9EJAAH");
  });

  it("always returns 12 valid characters", () => {
    const bytes = Uint8Array.from({ length: 12 }, (_, i) => (i * 37) % 256);
    const code = generateRecoveryCode(bytes);
    expect(code).toHaveLength(RECOVERY_CODE_LENGTH);
    expect(isValidRecoveryCode(code)).toBe(true);
  });

  it("uses only the first 12 bytes when more are given", () => {
    const twelve = Uint8Array.from({ length: 12 }, (_, i) => i);
    const sixteen = Uint8Array.from({ length: 16 }, (_, i) => i);
    expect(generateRecoveryCode(sixteen)).toBe(generateRecoveryCode(twelve));
  });

  it("is deterministic for the same bytes", () => {
    const bytes = Uint8Array.from({ length: 12 }, () => 200);
    expect(generateRecoveryCode(bytes)).toBe(generateRecoveryCode(bytes));
  });

  it("throws when fewer than 12 bytes are given", () => {
    expect(() => generateRecoveryCode(new Uint8Array(11))).toThrow(RangeError);
  });
});

describe("normalizeRecoveryCode", () => {
  it("uppercases and removes dashes and spaces", () => {
    expect(normalizeRecoveryCode("k7f2-9qxm-4tb8")).toBe("K7F29QXM4TB8");
    expect(normalizeRecoveryCode(" k7f2 9QXM\t4tb8 ")).toBe("K7F29QXM4TB8");
    expect(normalizeRecoveryCode("K7F29QXM4TB8")).toBe("K7F29QXM4TB8");
  });
});

describe("isValidRecoveryCode", () => {
  it("accepts 12 alphabet characters in any style", () => {
    expect(isValidRecoveryCode("K7F29QXM4TB8")).toBe(true);
    expect(isValidRecoveryCode("k7f2-9qxm-4tb8")).toBe(true);
    expect(isValidRecoveryCode("K7F2 9QXM 4TB8")).toBe(true);
  });

  it("rejects wrong length", () => {
    expect(isValidRecoveryCode("")).toBe(false);
    expect(isValidRecoveryCode("K7F29QXM4TB")).toBe(false);
    expect(isValidRecoveryCode("K7F29QXM4TB8A")).toBe(false);
  });

  it("rejects characters outside the alphabet", () => {
    expect(isValidRecoveryCode("K7F29QXM4TB0")).toBe(false); // 0
    expect(isValidRecoveryCode("K7F29QXM4TBO")).toBe(false); // O
    expect(isValidRecoveryCode("K7F29QXM4TB1")).toBe(false); // 1
    expect(isValidRecoveryCode("K7F29QXM4TBI")).toBe(false); // I
    expect(isValidRecoveryCode("K7F29QXM4TB!")).toBe(false);
  });
});

describe("formatRecoveryCode", () => {
  it("formats as 3 groups of 4", () => {
    expect(formatRecoveryCode("K7F29QXM4TB8")).toBe("K7F2-9QXM-4TB8");
  });

  it("accepts an already formatted or lowercase code", () => {
    expect(formatRecoveryCode("k7f2-9qxm-4tb8")).toBe("K7F2-9QXM-4TB8");
    expect(formatRecoveryCode("k7f2 9qxm 4tb8")).toBe("K7F2-9QXM-4TB8");
  });

  it("throws on an invalid code and does not echo it in the message", () => {
    expect(() => formatRecoveryCode("BADCODE")).toThrow(RangeError);
    expect(() => formatRecoveryCode("BADCODE")).not.toThrow(/BADCODE/);
  });
});

describe("RECOVERY_PROOF_LABEL", () => {
  it("is a fixed non-empty text", () => {
    expect(typeof RECOVERY_PROOF_LABEL).toBe("string");
    expect(RECOVERY_PROOF_LABEL.length).toBeGreaterThan(0);
    expect(RECOVERY_PROOF_LABEL).toBe("grainmate-recovery-v1:");
  });
});
