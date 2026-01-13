/**
 * Cryptographic random number generation utilities.
 * Generates seeds and hashes using SHA-256 for verifiable randomness.
 */
import crypto from 'crypto';

export const generateSeed = (): string => {
  const buffer = crypto.randomBytes(32);
  return buffer.toString("hex");
};

export const seedHash = (seed: string): string => {
  const hash = crypto.createHash("sha256").update(seed).digest("hex");
  return hash;
};

export const combineSeeds = (seed: string, salt: string): string => {
  return crypto.createHmac("sha256", seed).update(salt).digest("hex");
}
