/**
 * Solana blockchain payment integration controller.
 * Handles SOL and SPL token deposits and withdrawals using Solana Web3.
 * Manages transaction creation, signing, and confirmation for Solana-based payments.
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
exports.getAddressBalances = exports.getSignaturesForAddress = exports.sweepSPLToken = exports.sweepSOL = exports.getAddressTokenBalance = exports.getAddressSOLBalance = exports.getSOLbalance = exports.transferSPL = exports.transferSOL = exports.getTxnSolana = void 0;
const axios_1 = require("axios");
const bs58 = require("bs58");
const spl_token_1 = require("@solana/spl-token");
const { RpcResponseAndContext, TokenAmount, Keypair, Transaction, Connection, PublicKey, clusterApiUrl, SystemProgram, LAMPORTS_PER_SOL, Cluster } = require('@solana/web3.js');
let param;
let URL;
let connection;
let PRIVKEY;
let txWallet;
try {
    // Support SOLANA_CLUSTER (cluster name) or NETWORK_URL (fallback), and SOLANA_RPC_URL (full URL override)
    param = process.env.SOLANA_CLUSTER || process.env.NETWORK_URL || 'mainnet-beta';
    if (process.env.SOLANA_RPC_URL) {
        URL = process.env.SOLANA_RPC_URL;
        connection = new Connection(process.env.SOLANA_RPC_URL);
    }
    else {
        URL = clusterApiUrl(param);
        connection = new Connection(clusterApiUrl(param));
    }
    // PRIVKEY = decrypt(process.env.S_W_PRIVATE_ADDRESS as string);
    PRIVKEY = "";
    if (PRIVKEY) {
        txWallet = Keypair.fromSecretKey(bs58.decode(PRIVKEY));
    }
}
catch (error) {
    console.log('Solana web3 error !!!', error);
}
/**
 * Fetches a Solana transaction by signature.
 * Uses jsonParsed encoding for better transaction parsing.
 * @param signature - Transaction signature (base58 string)
 * @param encoding - Encoding format ('jsonParsed' or 'base58', default: 'jsonParsed')
 * @returns Transaction data or null if not found
 */
const getTxnSolana = (signature, encoding = 'jsonParsed') => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const res = yield (0, axios_1.default)(URL, {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            data: {
                jsonrpc: '2.0',
                id: 'get-transaction',
                method: 'getTransaction',
                params: [
                    signature,
                    {
                        encoding: encoding,
                        maxSupportedTransactionVersion: 0
                    }
                ]
            }
        });
        return res;
    }
    catch (error) {
        console.error('[getTxnSolana] Error fetching transaction:', error);
        throw error;
    }
});
exports.getTxnSolana = getTxnSolana;
/**
 * Gets transaction signatures for a Solana address.
 * @param address - Solana address (base58 string)
 * @param limit - Maximum number of signatures to return (default: 100)
 * @param before - Optional signature to start from (for pagination)
 * @returns Array of transaction signatures
 */
const getSignaturesForAddress = (address, limit = 100, before = null) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pubkey = new PublicKey(address);
        const options = {
            limit: limit,
        };
        if (before) {
            options.before = before;
        }
        const signatures = yield connection.getSignaturesForAddress(pubkey, options);
        return signatures.map(sig => sig.signature);
    }
    catch (error) {
        console.error(`[getSignaturesForAddress] Error getting signatures for ${address}:`, error);
        throw error;
    }
});
exports.getSignaturesForAddress = getSignaturesForAddress;
const transferSOL = (amount, destAddress) => __awaiter(void 0, void 0, void 0, function* () {
    const transaction = new Transaction().add(SystemProgram.transfer({
        fromPubkey: txWallet.publicKey,
        toPubkey: new PublicKey(destAddress),
        lamports: Math.floor(Number(amount) * LAMPORTS_PER_SOL)
    }));
    transaction.feePayer = txWallet.publicKey;
    const txhash = yield connection.sendTransaction(transaction, [txWallet]);
    console.log(`txhash: ${txhash}`);
    return txhash;
});
exports.transferSOL = transferSOL;
const transferSPL = (tokenMintAddress, amount, destAddress) => __awaiter(void 0, void 0, void 0, function* () {
    const mintPubkey = new PublicKey(tokenMintAddress);
    const destPubkey = new PublicKey(destAddress);
    const fromTokenAccount = yield (0, spl_token_1.getOrCreateAssociatedTokenAccount)(connection, txWallet, mintPubkey, txWallet.publicKey);
    const tokenAccountBalance = yield connection.getTokenAccountBalance(fromTokenAccount.address);
    if (tokenAccountBalance) {
        const decimals = tokenAccountBalance.value.decimals;
        const toTokenAccount = yield (0, spl_token_1.getOrCreateAssociatedTokenAccount)(connection, txWallet, mintPubkey, destPubkey);
        const transaction = new Transaction().add((0, spl_token_1.createTransferCheckedInstruction)(fromTokenAccount.address, mintPubkey, toTokenAccount.address, txWallet.publicKey, Math.floor(Number(amount) * Math.pow(10, decimals)), decimals));
        const txhash = yield connection.sendTransaction(transaction, [txWallet]);
        return txhash;
    }
    return '';
});
exports.transferSPL = transferSPL;
const getSOLbalance = (walletAddress, currency) => __awaiter(void 0, void 0, void 0, function* () {
    const ownerPubkey = new PublicKey(walletAddress);
    let tokenBalance = 0;
    try {
        if (currency.symbol === 'SOL') {
            tokenBalance = (yield connection.getBalance(ownerPubkey)) / LAMPORTS_PER_SOL;
        }
        else {
            const mintPubkey = new PublicKey(currency.contractAddress);
            const ownerTokenAccount = yield (0, spl_token_1.getOrCreateAssociatedTokenAccount)(connection, txWallet, mintPubkey, ownerPubkey);
            const tokenAccountBalance = yield connection.getTokenAccountBalance(ownerTokenAccount.address);
            tokenBalance = Number(tokenAccountBalance.value.amount) / Math.pow(10, tokenAccountBalance.value.decimals);
        }
    }
    catch (error) {
        tokenBalance = 0;
    }
    return tokenBalance;
});
exports.getSOLbalance = getSOLbalance;
/**
 * Gets SOL balance for an address (in SOL, not lamports).
 * @param {string} address - Solana address (base58)
 * @returns {Promise<number>} Balance in SOL
 */
const getAddressSOLBalance = (address) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ownerPubkey = new PublicKey(address);
        const balance = yield connection.getBalance(ownerPubkey);
        return balance / LAMPORTS_PER_SOL;
    }
    catch (error) {
        console.error(`[getAddressSOLBalance] Error getting SOL balance for ${address}:`, error);
        return 0;
    }
});
exports.getAddressSOLBalance = getAddressSOLBalance;
/**
 * Gets SPL token balance for an address.
 * @param {string} address - Solana address (base58)
 * @param {string} mintAddress - Token mint address (base58)
 * @returns {Promise<{amount: number, decimals: number}>} Token balance and decimals
 */
const getAddressTokenBalance = (address, mintAddress) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ownerPubkey = new PublicKey(address);
        const mintPubkey = new PublicKey(mintAddress);
        // Get associated token account address
        const ataAddress = yield (0, spl_token_1.getAssociatedTokenAddress)(mintPubkey, ownerPubkey);
        // Check if token account exists
        const accountInfo = yield connection.getAccountInfo(ataAddress);
        if (!accountInfo) {
            return { amount: 0, decimals: 0 };
        }
        // Get token account balance
        const tokenAccountBalance = yield connection.getTokenAccountBalance(ataAddress);
        const decimals = tokenAccountBalance.value.decimals;
        const amount = Number(tokenAccountBalance.value.amount) / Math.pow(10, decimals);
        return { amount, decimals };
    }
    catch (error) {
        console.error(`[getAddressTokenBalance] Error getting token balance for ${address}, mint ${mintAddress}:`, error);
        return { amount: 0, decimals: 0 };
    }
});
exports.getAddressTokenBalance = getAddressTokenBalance;
/**
 * Sweeps SOL from a source address to destination address.
 * @param {Keypair} sourceKeypair - Keypair of source address (for signing)
 * @param {string} destinationAddress - Destination address (base58)
 * @param {number} amountUi - Amount in SOL (UI units)
 * @returns {Promise<string>} Transaction signature
 */
const sweepSOL = (sourceKeypair, destinationAddress, amountUi) => __awaiter(void 0, void 0, void 0, function* () {
    const destPubkey = new PublicKey(destinationAddress);
    const lamports = Math.floor(amountUi * LAMPORTS_PER_SOL);
    const transaction = new Transaction().add(SystemProgram.transfer({
        fromPubkey: sourceKeypair.publicKey,
        toPubkey: destPubkey,
        lamports: lamports
    }));
    // Use sendTransaction which handles blockhash automatically
    const signature = yield connection.sendTransaction(transaction, [sourceKeypair], {
        skipPreflight: false,
        maxRetries: 3
    });
    // Wait for confirmation
    yield connection.confirmTransaction(signature, 'confirmed');
    return signature;
});
exports.sweepSOL = sweepSOL;
/**
 * Sweeps SPL token from a source address to destination address.
 * @param {Keypair} sourceKeypair - Keypair of source address (for signing)
 * @param {string} destinationAddress - Destination address (base58)
 * @param {string} mintAddress - Token mint address (base58)
 * @param {number} amountUi - Amount in token UI units
 * @param {number} decimals - Token decimals
 * @returns {Promise<string>} Transaction signature
 */
const sweepSPLToken = (sourceKeypair, destinationAddress, mintAddress, amountUi, decimals) => __awaiter(void 0, void 0, void 0, function* () {
    const destPubkey = new PublicKey(destinationAddress);
    const mintPubkey = new PublicKey(mintAddress);
    // Get source ATA
    const sourceATA = yield (0, spl_token_1.getAssociatedTokenAddress)(mintPubkey, sourceKeypair.publicKey);
    // Get or create destination ATA
    const destATA = yield (0, spl_token_1.getAssociatedTokenAddress)(mintPubkey, destPubkey);
    // Check if destination ATA exists, create if not
    const destAccountInfo = yield connection.getAccountInfo(destATA);
    const transaction = new Transaction();
    if (!destAccountInfo) {
        // Add instruction to create ATA if it doesn't exist
        transaction.add((0, spl_token_1.createAssociatedTokenAccountInstruction)(
            sourceKeypair.publicKey, // payer
            destATA, // ata
            destPubkey, // owner
            mintPubkey // mint
        ));
    }
    // Convert UI amount to raw amount
    const rawAmount = Math.floor(amountUi * Math.pow(10, decimals));
    // Add transfer instruction
    transaction.add((0, spl_token_1.createTransferCheckedInstruction)(
        sourceATA, // from
        mintPubkey, // mint
        destATA, // to
        sourceKeypair.publicKey, // owner
        rawAmount, // amount (raw)
        decimals // decimals
    ));
    // Use sendTransaction which handles blockhash automatically
    const signature = yield connection.sendTransaction(transaction, [sourceKeypair], {
        skipPreflight: false,
        maxRetries: 3
    });
    // Wait for confirmation
    yield connection.confirmTransaction(signature, 'confirmed');
    return signature;
});
exports.sweepSPLToken = sweepSPLToken;
/**
 * Gets all balances (SOL, USDC, USDT) for a Solana address.
 * @param {string} address - Solana address (base58)
 * @param {string} usdcMint - USDC mint address (default from env or currencies)
 * @param {string} usdtMint - USDT mint address (default from env or currencies)
 * @returns {Promise<{solBalanceUi: number, usdcBalanceUi: number, usdtBalanceUi: number}>}
 */
const getAddressBalances = (address, usdcMint, usdtMint) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ownerPubkey = new PublicKey(address);
        // Get SOL balance
        const solBalance = yield connection.getBalance(ownerPubkey);
        const solBalanceUi = solBalance / LAMPORTS_PER_SOL;
        // Get all token accounts for this address
        const tokenAccounts = yield connection.getParsedTokenAccountsByOwner(ownerPubkey, {
            programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA')
        });
        let usdcBalanceUi = 0;
        let usdtBalanceUi = 0;
        // Find USDC and USDT balances from token accounts
        for (const tokenAccount of tokenAccounts.value) {
            const mint = tokenAccount.account.data.parsed.info.mint;
            const amount = tokenAccount.account.data.parsed.info.tokenAmount.uiAmount;
            if (mint === usdcMint) {
                usdcBalanceUi = amount || 0;
            }
            else if (mint === usdtMint) {
                usdtBalanceUi = amount || 0;
            }
        }
        return {
            solBalanceUi: solBalanceUi,
            usdcBalanceUi: usdcBalanceUi,
            usdtBalanceUi: usdtBalanceUi
        };
    }
    catch (error) {
        console.error(`[getAddressBalances] Error getting balances for ${address}:`, error);
        return {
            solBalanceUi: 0,
            usdcBalanceUi: 0,
            usdtBalanceUi: 0
        };
    }
});
exports.getAddressBalances = getAddressBalances;
