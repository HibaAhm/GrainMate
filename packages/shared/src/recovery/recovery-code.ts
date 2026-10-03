/** 32 characters. No 0, O, 1, I so the code cannot be misread. */
export const RECOVERY_CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export const RECOVERY_CODE_LENGTH = 12;

const GROUP_SIZE = 4;

/**
 * Fixed label that both the phone and the server prepend before hashing:
 *
 *   recoveryProof = SHA-256(RECOVERY_PROOF_LABEL + normalizeRecoveryCode(code))
 *
 * Only the proof is ever stored or sent. The plain code stays on paper with the owner.
 */
export const RECOVERY_PROOF_LABEL = "grainmate-recovery-v1:";

const VALID_CODE = new RegExp(
  `^[${RECOVERY_CODE_ALPHABET}]{${RECOVERY_CODE_LENGTH}}$`,
);

/**
 * Build a 12-character recovery code from random bytes.
 * One byte per character. 256 is divisible by 32, so `byte % 32` is uniform.
 * The caller provides the bytes (expo-crypto on the phone, fixed bytes in tests).
 */
export function generateRecoveryCode(randomBytes: Uint8Array): string {
  if (randomBytes.length < RECOVERY_CODE_LENGTH) {
    throw new RangeError(
      `randomBytes must have at least ${RECOVERY_CODE_LENGTH} bytes`,
    );
  }
  let code = "";
  for (let i = 0; i < RECOVERY_CODE_LENGTH; i++) {
    const byte = randomBytes[i];
    if (byte === undefined) {
      throw new RangeError("randomBytes is shorter than expected");
    }
    code += RECOVERY_CODE_ALPHABET[byte % RECOVERY_CODE_ALPHABET.length];
  }
  return code;
}

/** Uppercase and strip dashes and whitespace so "k7f2 9qxm-4tb8" becomes "K7F29QXM4TB8". */
export function normalizeRecoveryCode(text: string): string {
  return text.toUpperCase().replace(/[-\s]/g, "");
}

/** True only for exactly 12 characters from the alphabet (after normalizing). */
export function isValidRecoveryCode(text: string): boolean {
  return VALID_CODE.test(normalizeRecoveryCode(text));
}

/** "K7F29QXM4TB8" → "K7F2-9QXM-4TB8". Throws on an invalid code without echoing it. */
export function formatRecoveryCode(code: string): string {
  const normalized = normalizeRecoveryCode(code);
  if (!VALID_CODE.test(normalized)) {
    throw new RangeError("recovery code is not valid");
  }
  const groups: string[] = [];
  for (let i = 0; i < normalized.length; i += GROUP_SIZE) {
    groups.push(normalized.slice(i, i + GROUP_SIZE));
  }
  return groups.join("-");
}
