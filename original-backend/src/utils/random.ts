/**
 * Cryptographic random number generation for provably fair games.
 * Generates seeds, hashes, and crash points using SHA-256 HMAC for verifiable randomness.
 * Combines private and public seeds to ensure fairness and allows verification of game outcomes.
 */
import crypto from 'crypto';
import config from '../config';
import { getPublicSeed } from './blockchain';

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

const generatePrivateSeed = async (): Promise<string> => {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(256, (error, buffer) => {
      if (error) reject(error);
      else resolve(buffer.toString('hex'));
    });
  });
};

const buildPrivateHash = (seed: string): string => {
  const hash = crypto.createHash('sha256').update(seed).digest('hex');
  return hash;
};

export const generatePrivateSeedHashPair = async (): Promise<{
  seed: string;
  hash: string;
} | null> => {
  try {
    const seed = await generatePrivateSeed();
    const hash = buildPrivateHash(seed);
    return { seed, hash };
  } catch (error) {
    return null;
  }
};

export const generateCrashRandom = async (
  privateSeed: string,
  publicSeed?: string
): Promise<{ publicSeed: string; crashPoint: number } | null> => {
  try {
    const _publicSeed = publicSeed || await getPublicSeed();
    const crashPoint = generateCrashPoint(privateSeed, _publicSeed);
    return { publicSeed: _publicSeed, crashPoint };
  } catch (error) {
    return null;
  }
};

const generateCrashPoint = (seed: string, salt: string): number => {
  const hash = crypto.createHmac('sha256', seed).update(salt).digest('hex');

  const hs = parseInt((100 / (config.games.crash.houseEdge * 100)).toString());
  if (isCrashHashDivisible(hash, hs)) {
    return 100;
  }

  const h = parseInt(hash.slice(0, 52 / 4), 16);
  const e = Math.pow(2, 52);

  return Math.floor((100 * e - h) / (e - h));
};

const isCrashHashDivisible = (hash: string, mod: number): boolean => {
  let val = 0;

  const o = hash.length % 4;
  for (let i = o > 0 ? o - 4 : 0; i < hash.length; i += 4) {
    val = ((val << 16) + parseInt(hash.substring(i, i + 4), 16)) % mod;
  }

  return val === 0;
};
