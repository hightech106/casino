/**
 * Solana HD wallet derivation utility.
 * Derives Solana addresses from a master mnemonic using BIP44 derivation path.
 * 
 * Derivation path: m/44'/501'/{index}'/0'
 * - 44' = BIP44 standard
 * - 501' = Solana coin type
 * - {index}' = Account index (hardened)
 * - 0' = Change index (hardened, always 0 for deposits)
 * 
 * Self-check examples (for testing):
 * - index 0: Should return a valid base58 Solana address
 * - index 1: Should return a different valid base58 Solana address
 * - index 2: Should return another different valid base58 Solana address
 */
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deriveSolanaKeypair = exports.deriveSolanaAddress = exports.validateMnemonic = void 0;
const bip39 = require("bip39");
const ed25519_hd_key_1 = require("ed25519-hd-key");
const { Keypair } = require('@solana/web3.js');
const SOLANA_COIN_TYPE = 501; // Solana's BIP44 coin type
const CHANGE_INDEX = 0; // Always 0 for deposits
/**
 * Validates that the mnemonic is set and valid.
 * @returns {string} The mnemonic if valid
 * @throws {Error} If mnemonic is missing or invalid
 */
const validateMnemonic = () => {
    const mnemonic = process.env.SOLANA_DEPOSIT_MNEMONIC || process.env.SOLANA_MASTER_SEED;
    if (!mnemonic) {
        throw new Error('SOLANA_DEPOSIT_MNEMONIC or SOLANA_MASTER_SEED environment variable is not set');
    }
    // Validate mnemonic format (12 or 24 words)
    if (!bip39.validateMnemonic(mnemonic)) {
        throw new Error('Invalid mnemonic format in SOLANA_DEPOSIT_MNEMONIC or SOLANA_MASTER_SEED');
    }
    return mnemonic;
};
exports.validateMnemonic = validateMnemonic;
/**
 * Derives a Solana address from the master mnemonic using the specified index.
 * 
 * @param {number} index - The derivation index (account index)
 * @returns {Promise<{publicKey: string, address: string}>} The derived public key and address
 * @throws {Error} If mnemonic is missing or derivation fails
 * 
 * Derivation path: m/44'/501'/{index}'/0'
 */
const deriveSolanaAddress = (index) => __awaiter(void 0, void 0, void 0, function* () {
    if (typeof index !== 'number' || index < 0 || !Number.isInteger(index)) {
        throw new Error(`Invalid derivation index: ${index}. Must be a non-negative integer.`);
    }
    const mnemonic = (0, exports.validateMnemonic)();
    // Convert mnemonic to seed (returns Buffer)
    const seedBuffer = yield bip39.mnemonicToSeed(mnemonic);
    // Convert Buffer to hex string for ed25519-hd-key
    const seedHex = seedBuffer.toString('hex');
    // Derive path: m/44'/501'/{index}'/0'
    // Format: m/purpose'/coin_type'/account'/change'
    const derivationPath = `m/44'/${SOLANA_COIN_TYPE}'/${index}'/${CHANGE_INDEX}'`;
    // Derive the key using ed25519-hd-key
    // derivePath returns { key: Buffer, chainCode: Buffer }
    const derived = (0, ed25519_hd_key_1.derivePath)(derivationPath, seedHex);
    // Create Solana Keypair from derived seed (32 bytes)
    // Keypair.fromSeed expects a Uint8Array of 32 bytes
    const seedBytes = Buffer.from(derived.key);
    if (seedBytes.length !== 32) {
        throw new Error(`Derived seed length is ${seedBytes.length}, expected 32 bytes`);
    }
    const keypair = Keypair.fromSeed(new Uint8Array(seedBytes));
    // Return public key as base58 string (Solana address format)
    const address = keypair.publicKey.toBase58();
    return {
        publicKey: keypair.publicKey,
        address: address
    };
});
exports.deriveSolanaAddress = deriveSolanaAddress;
/**
 * Derives a Solana Keypair from the master mnemonic using the specified index.
 * Returns the full Keypair (including private key) for signing transactions.
 * 
 * @param {number} index - The derivation index (account index)
 * @returns {Promise<Keypair>} The derived Solana Keypair
 * @throws {Error} If mnemonic is missing or derivation fails
 * 
 * Derivation path: m/44'/501'/{index}'/0'
 */
const deriveSolanaKeypair = (index) => __awaiter(void 0, void 0, void 0, function* () {
    if (typeof index !== 'number' || index < 0 || !Number.isInteger(index)) {
        throw new Error(`Invalid derivation index: ${index}. Must be a non-negative integer.`);
    }
    const mnemonic = (0, exports.validateMnemonic)();
    // Convert mnemonic to seed (returns Buffer)
    const seedBuffer = yield bip39.mnemonicToSeed(mnemonic);
    // Convert Buffer to hex string for ed25519-hd-key
    const seedHex = seedBuffer.toString('hex');
    // Derive path: m/44'/501'/{index}'/0'
    const derivationPath = `m/44'/${SOLANA_COIN_TYPE}'/${index}'/${CHANGE_INDEX}'`;
    // Derive the key using ed25519-hd-key
    const derived = (0, ed25519_hd_key_1.derivePath)(derivationPath, seedHex);
    // Create Solana Keypair from derived seed (32 bytes)
    const seedBytes = Buffer.from(derived.key);
    if (seedBytes.length !== 32) {
        throw new Error(`Derived seed length is ${seedBytes.length}, expected 32 bytes`);
    }
    const keypair = Keypair.fromSeed(new Uint8Array(seedBytes));
    return keypair;
});
exports.deriveSolanaKeypair = deriveSolanaKeypair;

