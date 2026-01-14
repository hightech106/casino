/**
 * TRON HD wallet derivation utility.
 * Derives TRON addresses from a master mnemonic using BIP44 derivation path.
 * 
 * Derivation path: m/44'/195'/{index}'/0'/0'
 * - 44' = BIP44 standard
 * - 195' = TRON coin type (BIP44)
 * - {index}' = Account index (hardened)
 * - 0' = Change index (hardened, always 0 for deposits)
 * - 0' = Address index (hardened, always 0 for deposits)
 * 
 * Self-check examples (for testing):
 * - index 0: Should return a valid base58 TRON address (starts with T)
 * - index 1: Should return a different valid base58 TRON address
 * - index 2: Should return another different valid base58 TRON address
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
exports.deriveTronPrivateKey = exports.deriveTronAddress = exports.validateMnemonic = void 0;
const bip39 = require("bip39");
// Note: bip32, tiny-secp256k1, and tronweb need to be installed: npm install bip32 tiny-secp256k1 tronweb
// bip32 is used for secp256k1 HD derivation
// tiny-secp256k1 is the ECC library required by bip32 v5+
// tronweb is used for TRON address conversion
let bip32;
let TronWeb;
try {
    const bip32Module = require("bip32");
    const ecc = require("tiny-secp256k1");
    // bip32 v5+ requires BIP32Factory with an ECC library
    const BIP32Factory = bip32Module.BIP32Factory || bip32Module.default;
    bip32 = BIP32Factory(ecc);
    const tronwebModule = require("tronweb");
    TronWeb = tronwebModule.TronWeb || tronwebModule.default || tronwebModule;
} catch (error) {
    console.error('[tronHD] Missing dependencies. Please install: npm install bip32 tiny-secp256k1 tronweb');
    throw new Error('bip32, tiny-secp256k1, and tronweb packages are required for TRON HD derivation. Please install them: npm install bip32 tiny-secp256k1 tronweb');
}
const TRON_COIN_TYPE = 195; // TRON's BIP44 coin type
const CHANGE_INDEX = 0; // Always 0 for deposits
const ADDRESS_INDEX = 0; // Always 0 for deposits
/**
 * Validates that the mnemonic is set and valid.
 * @returns {string} The mnemonic if valid
 * @throws {Error} If mnemonic is missing or invalid
 */
const validateMnemonic = () => {
    const mnemonic = process.env.TRON_DEPOSIT_MNEMONIC;
    if (!mnemonic) {
        throw new Error('TRON_DEPOSIT_MNEMONIC environment variable is not set');
    }
    // Validate mnemonic format (12 or 24 words)
    if (!bip39.validateMnemonic(mnemonic)) {
        throw new Error('Invalid mnemonic format in TRON_DEPOSIT_MNEMONIC');
    }
    return mnemonic;
};
exports.validateMnemonic = validateMnemonic;
/**
 * Converts a secp256k1 public key to TRON address.
 * TRON address is base58 encoded from: version byte (0x41) + 20-byte hash of public key
 * @param {Buffer} publicKey - The secp256k1 public key (33 bytes compressed or 65 bytes uncompressed)
 * @returns {string} The TRON address in base58 format
 */
const publicKeyToTronAddress = (publicKey) => {
    // TRON uses Keccak-256 (not SHA-256) for hashing
    // Hash the public key (skip the first byte if uncompressed, which is 0x04)
    let pubKeyBytes = publicKey;
    if (publicKey.length === 65 && publicKey[0] === 0x04) {
        // Uncompressed public key, skip the 0x04 prefix
        pubKeyBytes = publicKey.slice(1);
    }
    else if (publicKey.length === 33) {
        // Compressed public key, use as is
        pubKeyBytes = publicKey;
    }
    // Use Keccak-256 (SHA-3 variant) - TRON uses this
    // Node.js crypto doesn't have Keccak, so we'll use a workaround
    // For now, we'll use TronWeb's address.fromPrivateKey which handles this
    // But we need the private key, so we'll derive it first
    // Actually, let's use TronWeb's utils to convert public key to address
    // TronWeb.Address.fromPublicKey(publicKey) - but this might not be available
    // Let's use a different approach: derive private key, then use TronWeb to get address
    // This is handled in deriveTronAddress
    throw new Error('publicKeyToTronAddress should not be called directly - use deriveTronAddress instead');
};
/**
 * Derives a TRON address from the master mnemonic using the specified index.
 * 
 * @param {number} index - The derivation index (account index)
 * @returns {Promise<{index: number, address: string}>} The derived index and address
 * @throws {Error} If mnemonic is missing or derivation fails
 * 
 * Derivation path: m/44'/195'/{index}'/0'/0'
 */
const deriveTronAddress = (index) => __awaiter(void 0, void 0, void 0, function* () {
    if (typeof index !== 'number' || index < 0 || !Number.isInteger(index)) {
        throw new Error(`Invalid derivation index: ${index}. Must be a non-negative integer.`);
    }
    const mnemonic = (0, exports.validateMnemonic)();
    // Get derivation path template from env or use default
    const pathTemplate = process.env.TRON_DERIVATION_PATH_TEMPLATE || "m/44'/195'/{index}'/0'/0'";
    const derivationPath = pathTemplate.replace('{index}', index.toString());
    // Convert mnemonic to seed (returns Buffer)
    // NOTE: Never log mnemonic or seed - they are sensitive
    const seedBuffer = yield bip39.mnemonicToSeed(mnemonic);
    // Create root HD node from seed
    const root = bip32.fromSeed(seedBuffer);
    // Derive the child node using the derivation path
    const child = root.derivePath(derivationPath);
    // Get private key (32 bytes)
    const privateKey = child.privateKey;
    if (!privateKey) {
        throw new Error('Derived private key is null or undefined');
    }
    // Ensure privateKey is a Buffer
    let privateKeyBuffer;
    if (Buffer.isBuffer(privateKey)) {
        privateKeyBuffer = privateKey;
    } else if (typeof privateKey === 'string') {
        // If it's already a hex string, convert it back to Buffer
        privateKeyBuffer = Buffer.from(privateKey, 'hex');
    } else if (privateKey instanceof Uint8Array) {
        privateKeyBuffer = Buffer.from(privateKey);
    } else {
        throw new Error(`Unexpected private key type: ${typeof privateKey}, expected Buffer`);
    }
    // Validate buffer length (should be 32 bytes)
    if (privateKeyBuffer.length !== 32) {
        throw new Error(`Derived private key buffer length is ${privateKeyBuffer.length}, expected 32 bytes`);
    }
    // Convert private key to hex string
    // NOTE: Never log privateKeyHex - it is sensitive
    const privateKeyHex = privateKeyBuffer.toString('hex');
    // Validate private key hex format (should be 64 hex characters = 32 bytes)
    if (!privateKeyHex || privateKeyHex.length !== 64 || !/^[0-9a-fA-F]+$/.test(privateKeyHex)) {
        throw new Error(`Invalid private key hex format: length=${privateKeyHex ? privateKeyHex.length : 0}, expected 64`);
    }
    // Validate that private key is not all zeros (invalid key)
    if (/^0+$/.test(privateKeyHex)) {
        throw new Error('Derived private key is all zeros - invalid derivation');
    }
    // Validate that private key is within valid secp256k1 range (less than secp256k1 order)
    // secp256k1 order: 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141
    const maxPrivateKey = 'FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141';
    if (BigInt('0x' + privateKeyHex) >= BigInt('0x' + maxPrivateKey)) {
        throw new Error('Derived private key exceeds secp256k1 order - invalid key');
    }
    // Use TronWeb to convert private key to TRON address
    // TronWeb address format: base58 encoded with version byte 0x41
    let address;
    try {
        // Create TronWeb instance - use a simple config for address conversion only
        // We don't need a full node connection for address conversion
        const tronWeb = new TronWeb({
            fullHost: 'https://api.trongrid.io'
        });
        // Check if TronWeb is properly initialized
        if (!tronWeb || !tronWeb.address || typeof tronWeb.address.fromPrivateKey !== 'function') {
            throw new Error('TronWeb address conversion not available');
        }
        // Ensure private key is in correct format (64 hex chars, no 0x prefix)
        const cleanPrivateKeyHex = privateKeyHex.startsWith('0x') ? privateKeyHex.slice(2) : privateKeyHex;
        if (cleanPrivateKeyHex.length !== 64) {
            throw new Error(`Private key hex length is ${cleanPrivateKeyHex.length}, expected 64 characters`);
        }
        // Get address from private key
        // Note: fromPrivateKey can return false if the private key is invalid
        address = tronWeb.address.fromPrivateKey(cleanPrivateKeyHex);
        // TronWeb.fromPrivateKey returns false on error
        if (address === false || !address) {
            throw new Error(`TronWeb.fromPrivateKey returned false - invalid private key format or TronWeb error. Private key length: ${cleanPrivateKeyHex.length}`);
        }
        // Ensure address is a string
        if (typeof address !== 'string') {
            throw new Error(`TronWeb.fromPrivateKey returned non-string: ${typeof address}`);
        }
    } catch (tronError) {
        throw new Error(`Failed to convert private key to TRON address: ${tronError.message}`);
    }
    // Validate address format (TRON addresses start with 'T' and are 34 characters)
    if (typeof address !== 'string' || !address.startsWith('T') || address.length !== 34) {
        throw new Error(`Invalid TRON address derived: ${address} (type: ${typeof address}, length: ${address ? address.length : 0})`);
    }
    return {
        index: index,
        address: address
    };
});
exports.deriveTronAddress = deriveTronAddress;
/**
 * Derives a TRON private key from the master mnemonic using the specified index.
 * Returns the private key in hex format (for future sweeping operations).
 * 
 * @param {number} index - The derivation index (account index)
 * @returns {Promise<string>} The derived private key in hex format (64 characters, no 0x prefix)
 * @throws {Error} If mnemonic is missing or derivation fails
 * 
 * Derivation path: m/44'/195'/{index}'/0'/0'
 */
const deriveTronPrivateKey = (index) => __awaiter(void 0, void 0, void 0, function* () {
    if (typeof index !== 'number' || index < 0 || !Number.isInteger(index)) {
        throw new Error(`Invalid derivation index: ${index}. Must be a non-negative integer.`);
    }
    const mnemonic = (0, exports.validateMnemonic)();
    // Get derivation path template from env or use default
    const pathTemplate = process.env.TRON_DERIVATION_PATH_TEMPLATE || "m/44'/195'/{index}'/0'/0'";
    const derivationPath = pathTemplate.replace('{index}', index.toString());
    // Convert mnemonic to seed (returns Buffer)
    // NOTE: Never log mnemonic or seed - they are sensitive
    const seedBuffer = yield bip39.mnemonicToSeed(mnemonic);
    // Create root HD node from seed
    const root = bip32.fromSeed(seedBuffer);
    // Derive the child node using the derivation path
    const child = root.derivePath(derivationPath);
    // Get private key (32 bytes)
    const privateKey = child.privateKey;
    if (!privateKey) {
        throw new Error('Derived private key is null or undefined');
    }
    // Ensure privateKey is a Buffer
    let privateKeyBuffer;
    if (Buffer.isBuffer(privateKey)) {
        privateKeyBuffer = privateKey;
    } else if (typeof privateKey === 'string') {
        // If it's already a hex string, convert it back to Buffer
        privateKeyBuffer = Buffer.from(privateKey, 'hex');
    } else if (privateKey instanceof Uint8Array) {
        privateKeyBuffer = Buffer.from(privateKey);
    } else {
        throw new Error(`Unexpected private key type: ${typeof privateKey}, expected Buffer`);
    }
    // Validate buffer length (should be 32 bytes)
    if (privateKeyBuffer.length !== 32) {
        throw new Error(`Derived private key buffer length is ${privateKeyBuffer.length}, expected 32 bytes`);
    }
    // Convert private key to hex string (no 0x prefix)
    // NOTE: Never log privateKeyHex - it is sensitive, return only
    const privateKeyHex = privateKeyBuffer.toString('hex');
    // Validate hex length (should be 64 characters)
    if (privateKeyHex.length !== 64) {
        throw new Error(`Private key hex length is ${privateKeyHex.length}, expected 64 characters`);
    }
    return privateKeyHex;
});
exports.deriveTronPrivateKey = deriveTronPrivateKey;
