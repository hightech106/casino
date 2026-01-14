/**
 * Payment processing controller handling deposits, withdrawals, and currency management.
 * Supports multiple payment methods: cryptocurrencies (Ethereum, Solana), CoinPayments, NowPayments,
 * and fiat payments. Manages balance updates, transaction history, and payment verification.
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
exports.depositTron = exports.getTronDepositAddress = exports.checkSolanaDeposits = exports.getSolanaDepositAddress = exports.confirmSmartContractPayment = exports.calcUsetToCrypto = exports.withdrawal = exports.getAvailableCoins = exports.getPaymentsPeriod = exports.getCurrenciesFiat = exports.getFiatNowpay = exports.exchangeNowpay = exports.createNowpay = exports.getPaymentMethod = exports.removePendingPayment = exports.withdrawalTimer = exports.getAdminBalance = exports.updateBalance = exports.getBalances = exports.getCurrencies = exports.getTransactions = exports.getTransactionResult = exports.depositSolana = exports.deposit = void 0;
const axios_1 = require("axios");
const request = require("request");
const moment = require("moment-timezone");
const units_1 = require("@ethersproject/units");
const { LAMPORTS_PER_SOL } = require('@solana/web3.js');
const base_1 = require("../base");
const models_1 = require("../../models");
const coinpayment_1 = require("./coinpayment");
const ethereum_1 = require("./ethereum");
const solana_1 = require("./solana");
const tron_1 = require("./tron");
// Import TronWeb for address conversion (used in depositTron)
let TronWeb;
try {
    TronWeb = require("tronweb");
    // Initialize TronWeb instance for address conversion
    var tronWeb = new TronWeb({
        fullHost: process.env.TRON_RPC_URL || 'https://api.trongrid.io'
    });
}
catch (error) {
    // TronWeb will be required when depositTron is called
    console.warn('[payment/index] TronWeb not available. TRON deposits will fail until tronweb is installed.');
}
const timelesstech_1 = require("../games/timelesstech");
const affiliate_1 = require("../../utils/affiliate");
const own_affiliate_1 = require("../../utils/own_affilate");
// fiatConverter only used for getFiatToCryptoRate (crypto price conversion)
// convertFiatCurrency removed - all amounts are in LU
const fiatConverter_1 = require("../../utils/fiatConverter");
const utils_1 = require("../../utils");
const tracking_1 = require("../journey/tracking");
const IPN = require('coinpayments-ipn');
const solanaHD_1 = require("../../utils/solanaHD");
const tronHD_1 = require("../../utils/tronHD");
const ipn_url = `${process.env.API_URL}${process.env.IPN_URL}`;
const depositAddress = process.env.E_D_PUBLIC_ADDRESS;
const widthrawAddress = process.env.E_W_PUBLIC_ADDRESS;
const solanaAddress = process.env.S_W_PUBLIC_ADDRESS;
// NOW_PAYMENT constants - only used in deprecated fiat functions (commented out)
// const NOW_PAYMENT_API = process.env.NOW_PAYMENT_API;
// const NOW_PAYMENT_API_KEY = process.env.NOW_PAYMENT_API_KEY;
// const NOW_PAYMENT_CALL_BACK = process.env.NOW_PAYMENT_CALL_BACK;
const MIN_DEPOSIT_LU = 10; // LU is USD-equivalent (1 LU = 1 USD)
const deposit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, currencyId } = req.body; // currencyId is the crypto being deposited
    if (!userId || !currencyId) {
        res.status(400).json('Invalid field!');
        return;
    }
    
    // Get LU currency
    const luCurrency = yield models_1.Currencies.findOne({ symbol: 'LU' });
    if (!luCurrency) {
        res.status(500).json('System configuration error: LU currency not found');
        return;
    }
    
    // Get user's LU balance (find or create)
    let balance = yield models_1.Balances.findOne({
        userId: (0, base_1.ObjectId)(userId),
        currency: luCurrency._id,
        status: true,
    });
    
    if (!balance) {
        // Create LU balance if doesn't exist
        balance = yield models_1.Balances.create({
            userId: (0, base_1.ObjectId)(userId),
            currency: luCurrency._id,
            balance: 0,
            bonus: 0,
            status: true,
        });
    }
    
    // currencyId is the crypto currency being deposited
    const currency = yield models_1.Currencies.findById((0, base_1.ObjectId)(currencyId));
    if (!currency) {
        res.status(400).json('Invalid currency!');
        return;
    }
    else if (!currency.deposit) {
        res.status(400).json('Deposit disabled!');
        return;
    }
    const payment = yield models_1.Payments.create({
        userId,
        balanceId,
        currencyId: currency._id,
        currency: currency.payment,
        status: 0,
        method: 1,
        ipn_type: 'deposit',
        status_text: 'pending',
    });
    try {
        const result = yield coinpayment_1.coinpayment.getCallbackAddress({
            currency: currency.payment,
            label: String(payment._id),
            ipn_url,
        });
        res.json(result);
    }
    catch (error) {
        yield models_1.Payments.deleteOne({ _id: payment._id });
        if (error.code === 'ENOTFOUND') {
            res.status(400).json('Server error!');
        }
        else {
            res.status(400).json(error.extra.data.error);
        }
    }
});
exports.deposit = deposit;
const depositSolana = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get user from request (set by auth middleware)
        const user = req.user;
        if (!user || !user._id) {
            return res.status(401).json({ error: 'Unauthorized', message: 'User not authenticated' });
        }
        const userId = user._id;
        
        const { currencyId, txn_id, from, bonusId } = req.body;
        if (!currencyId || !txn_id) {
            return res.status(400).json({ error: 'Invalid field!', message: 'currencyId and txn_id are required' });
        }
        
        // Validate currency is a Solana currency
        const currency = yield models_1.Currencies.findById(currencyId);
        if (!currency) {
            console.error(`[depositSolana] Currency not found: currencyId=${currencyId}, userId=${userId}, txn_id=${txn_id}`);
            return res.status(400).json({ error: 'Invalid currency!', message: 'Currency not found' });
        }
        
        if (currency.blockchain !== 'solana') {
            console.error(`[depositSolana] Invalid blockchain: currencyId=${currencyId}, blockchain=${currency.blockchain}, userId=${userId}, txn_id=${txn_id}`);
            return res.status(400).json({ 
                error: 'Invalid currency!', 
                message: 'Currency must be a Solana currency (blockchain=solana)' 
            });
        }
        
        // Get user's derived deposit address (or create if doesn't exist)
        let userDepositAddress = yield models_1.DepositAddresses.findOne({
            userId: (0, base_1.ObjectId)(userId),
            blockchain: 'solana'
        });
        
        // Auto-create address if it doesn't exist (for deposits)
        if (!userDepositAddress) {
            console.log(`[depositSolana] Creating deposit address for user: userId=${userId}, txn_id=${txn_id}`);
            try {
                // Use the same logic as getSolanaDepositAddress to create address
                const solanaHD_1 = require("../../utils/solanaHD");
                const counterName = `solana_deposit_index`;
                let counter = yield models_1.Counters.findOneAndUpdate(
                    { name: counterName },
                    { $inc: { value: 1 } },
                    { upsert: true, new: true }
                );
                if (!counter) {
                    counter = yield models_1.Counters.create({ name: counterName, value: 0 });
                    counter = yield models_1.Counters.findOneAndUpdate(
                        { name: counterName },
                        { $inc: { value: 1 } },
                        { new: true }
                    );
                }
                const index = counter.value;
                const derived = yield (0, solanaHD_1.deriveSolanaAddress)(index);
                userDepositAddress = yield models_1.DepositAddresses.create({
                    userId: (0, base_1.ObjectId)(userId),
                    blockchain: 'solana',
                    index: index,
                    address: derived.address
                });
                console.log(`[depositSolana] Created deposit address ${derived.address} for user ${userId}`);
            }
            catch (createError) {
                // Handle race condition - another request might have created it
                if (createError.code === 11000) {
                    userDepositAddress = yield models_1.DepositAddresses.findOne({
                        userId: (0, base_1.ObjectId)(userId),
                        blockchain: 'solana'
                    });
                }
                if (!userDepositAddress) {
                    console.error(`[depositSolana] Failed to create deposit address: userId=${userId}, error=${createError.message}`);
                    return res.status(500).json({ 
                        error: 'Failed to create deposit address', 
                        message: 'Could not create Solana deposit address. Please try again.' 
                    });
                }
            }
        }
        
        const userDepositAddr = userDepositAddress.address.toLowerCase();
        
        // Check idempotency: if transaction already processed, return existing payment
        const existingPayment = yield models_1.Payments.findOne({ txn_id });
        if (existingPayment) {
            if (existingPayment.status === 100) {
                console.log(`[depositSolana] Transaction already confirmed: txn_id=${txn_id}, userId=${userId}, paymentId=${existingPayment._id}`);
                return res.json({ 
                    message: 'Transaction already confirmed', 
                    payment: existingPayment 
                });
            }
            // If pending, continue to verify (but log warning)
            console.warn(`[depositSolana] Transaction exists but not confirmed: txn_id=${txn_id}, userId=${userId}, status=${existingPayment.status}`);
        }
        
        // Get LU currency
        const luCurrency = yield models_1.Currencies.findOne({ symbol: 'LU' });
        if (!luCurrency) {
            console.error(`[depositSolana] LU currency not found: userId=${userId}, txn_id=${txn_id}`);
            return res.status(500).json({ error: 'System configuration error', message: 'LU currency not found' });
        }
        
        // Get user's LU balance (create if missing)
        let balances = yield models_1.Balances.findOne({
            userId: (0, base_1.ObjectId)(userId),
            currency: luCurrency._id,
            status: true,
        });
        
        if (!balances) {
            balances = yield models_1.Balances.create({
                userId: (0, base_1.ObjectId)(userId),
                currency: luCurrency._id,
                balance: 0,
                bonus: 0,
                status: true,
            });
        }
        
        // Fetch transaction from Solana blockchain
        const txnResponse = yield (0, solana_1.getTxnSolana)(txn_id, 'jsonParsed');
        
        if (!txnResponse || !txnResponse.status || txnResponse.status !== 200) {
            console.error(`[depositSolana] Transaction fetch failed: txn_id=${txn_id}, userId=${userId}, status=${txnResponse?.status}`);
            return res.status(400).json({ 
                error: 'Transaction not found', 
                message: 'Transaction not found on Solana blockchain' 
            });
        }
        
        const txnData = txnResponse.data?.result;
        if (!txnData) {
            console.error(`[depositSolana] Transaction data is null: txn_id=${txn_id}, userId=${userId}`);
            return res.status(400).json({ 
                error: 'Transaction not found', 
                message: 'Transaction data not available' 
            });
        }
        
        // Check transaction metadata exists
        if (!txnData.meta) {
            console.error(`[depositSolana] Transaction metadata missing: txn_id=${txn_id}, userId=${userId}`);
            return res.status(400).json({ 
                error: 'Transaction invalid', 
                message: 'Transaction metadata not available' 
            });
        }
        
        // Check transaction status - meta.err is null if successful, non-null if failed
        if (txnData.meta.err !== null && txnData.meta.err !== undefined) {
            console.error(`[depositSolana] Transaction failed on blockchain: txn_id=${txn_id}, userId=${userId}, err=${JSON.stringify(txnData.meta.err)}`);
            return res.status(400).json({ 
                error: 'Transaction failed', 
                message: 'Transaction failed on blockchain' 
            });
        }
        
        let amount = 0;
        let senderAddress = null;
        let recipientAddress = null;
        let isSOLNative = false;
        
        // Parse transaction based on currency type
        // Native SOL: symbol is 'SOL' AND (isNative is true OR contractAddress is empty/missing)
        const isNativeSOL = currency.symbol === 'SOL' && (currency.isNative === true || !currency.contractAddress || currency.contractAddress.trim() === '');
        
        if (isNativeSOL) {
            // SOL native transfer - check SystemProgram transfer
            isSOLNative = true;
            const instructions = txnData.transaction.message.instructions || [];
            
            // Try jsonParsed format first
            for (const instruction of instructions) {
                // jsonParsed format: instruction.parsed exists
                if (instruction.parsed && instruction.parsed.type === 'transfer') {
                    const transfer = instruction.parsed;
                    const toAddress = transfer.destination?.toLowerCase();
                    const fromAddress = transfer.source?.toLowerCase();
                    
                    // Check if this transfer is to the user's deposit address
                    if (toAddress === userDepositAddr) {
                        recipientAddress = toAddress;
                        senderAddress = fromAddress || from?.toLowerCase();
                        // Amount is in lamports, convert to SOL
                        amount = (transfer.lamports || 0) / LAMPORTS_PER_SOL;
                        console.log(`[depositSolana] Found SOL transfer via jsonParsed: from=${senderAddress}, to=${recipientAddress}, amount=${amount} SOL`);
                        break;
                    }
                }
                // Check programId for system program
                else if (instruction.programId === '11111111111111111111111111111111' || 
                         (typeof instruction.programId === 'object' && instruction.programId.toString() === '11111111111111111111111111111111')) {
                    // This is a system program instruction, but not parsed
                    // We'll use balance changes instead
                }
            }
            
            // Fallback: check account balance changes (works for both formats)
            if (amount === 0 && txnData.meta.preBalances && txnData.meta.postBalances) {
                const accountKeys = txnData.transaction.message.accountKeys || [];
                console.log(`[depositSolana] Using balance change method: checking ${accountKeys.length} accounts for userDepositAddr=${userDepositAddr}`);
                
                // First, find all accounts that match the user's deposit address
                const matchingAccounts = [];
                for (let i = 0; i < accountKeys.length && i < txnData.meta.preBalances.length; i++) {
                    let accountKey;
                    if (typeof accountKeys[i] === 'string') {
                        accountKey = accountKeys[i].toLowerCase();
                    }
                    else if (accountKeys[i].pubkey) {
                        accountKey = accountKeys[i].pubkey.toLowerCase();
                    }
                    else {
                        continue;
                    }
                    
                    if (accountKey === userDepositAddr) {
                        const preBalance = txnData.meta.preBalances[i] || 0;
                        const postBalance = txnData.meta.postBalances[i] || 0;
                        const balanceChange = (postBalance - preBalance) / LAMPORTS_PER_SOL;
                        matchingAccounts.push({ index: i, accountKey, balanceChange });
                    }
                }
                
                // Use the account with the largest positive balance change
                if (matchingAccounts.length > 0) {
                    const bestMatch = matchingAccounts.reduce((best, current) => 
                        current.balanceChange > (best.balanceChange || 0) ? current : best
                    );
                    
                    if (bestMatch.balanceChange > 0) {
                        amount = bestMatch.balanceChange;
                        recipientAddress = bestMatch.accountKey;
                        console.log(`[depositSolana] Found SOL transfer via balance change: account=${bestMatch.accountKey}, amount=${amount} SOL`);
                        
                        // Find sender from other accounts (account that decreased)
                        for (let j = 0; j < accountKeys.length && j < txnData.meta.preBalances.length; j++) {
                            if (j !== bestMatch.index) {
                                const senderPreBalance = txnData.meta.preBalances[j] || 0;
                                const senderPostBalance = txnData.meta.postBalances[j] || 0;
                                if (senderPreBalance > senderPostBalance) {
                                    if (typeof accountKeys[j] === 'string') {
                                        senderAddress = accountKeys[j].toLowerCase();
                                    }
                                    else if (accountKeys[j].pubkey) {
                                        senderAddress = accountKeys[j].pubkey.toLowerCase();
                                    }
                                    break;
                                }
                            }
                        }
                    }
                }
            }
            
            // If still no recipient found, log all account keys for debugging
            if (!recipientAddress) {
                const accountKeys = txnData.transaction.message.accountKeys || [];
                console.error(`[depositSolana] Could not find recipient address. User deposit address: ${userDepositAddr}`);
                console.error(`[depositSolana] Transaction account keys:`, accountKeys.map((k, i) => ({
                    index: i,
                    key: typeof k === 'string' ? k.toLowerCase() : (k.pubkey ? k.pubkey.toLowerCase() : 'unknown'),
                    preBalance: txnData.meta.preBalances?.[i],
                    postBalance: txnData.meta.postBalances?.[i],
                    balanceChange: txnData.meta.preBalances?.[i] && txnData.meta.postBalances?.[i] ? 
                        (txnData.meta.postBalances[i] - txnData.meta.preBalances[i]) / LAMPORTS_PER_SOL : 0
                })));
            }
        }
        else {
            // SPL token transfer
            const preTokenBalances = txnData.meta.preTokenBalances || [];
            const postTokenBalances = txnData.meta.postTokenBalances || [];
            const expectedMint = currency.contractAddress?.toLowerCase();
            
            if (!expectedMint) {
                console.error(`[depositSolana] Currency contractAddress missing: currencyId=${currencyId}, symbol=${currency.symbol}, userId=${userId}, txn_id=${txn_id}`);
                return res.status(400).json({ 
                    error: 'Invalid currency configuration', 
                    message: 'Currency contractAddress (mint) is required for SPL token deposits' 
                });
            }
            
            // Find token balance changes for user's deposit address
            // Match by owner (user's deposit address) and mint (token contract address)
            // Note: Token account indexes may differ between pre/post, so we match by owner+mint
            for (const postBalance of postTokenBalances) {
                const owner = postBalance.owner?.toLowerCase();
                const mint = postBalance.mint?.toLowerCase();
                
                if (owner === userDepositAddr && mint === expectedMint) {
                    // Find corresponding pre-balance by owner+mint (not by index)
                    const preBalance = preTokenBalances.find(pb => 
                        pb.owner?.toLowerCase() === owner && 
                        pb.mint?.toLowerCase() === mint &&
                        pb.accountIndex === postBalance.accountIndex // Also match by accountIndex if available
                    ) || preTokenBalances.find(pb => 
                        pb.owner?.toLowerCase() === owner && 
                        pb.mint?.toLowerCase() === mint
                    ); // Fallback: match by owner+mint only
                    
                    const preAmount = preBalance?.uiTokenAmount?.uiAmount || 0;
                    const postAmount = postBalance.uiTokenAmount?.uiAmount || 0;
                    const tokenAmount = postAmount - preAmount;
                    
                    if (tokenAmount > 0) {
                        amount = tokenAmount;
                        recipientAddress = owner;
                        // Find sender from other token balance changes
                        for (const pre of preTokenBalances) {
                            if (pre.mint?.toLowerCase() === mint && pre.owner?.toLowerCase() !== owner) {
                                const correspondingPost = postTokenBalances.find(p => 
                                    (p.accountIndex === pre.accountIndex || // Match by accountIndex first
                                     (p.owner?.toLowerCase() === pre.owner?.toLowerCase())) && 
                                    p.mint?.toLowerCase() === mint
                                );
                                if (correspondingPost) {
                                    const senderPreAmount = pre.uiTokenAmount?.uiAmount || 0;
                                    const senderPostAmount = correspondingPost.uiTokenAmount?.uiAmount || 0;
                                    if (senderPreAmount > senderPostAmount) {
                                        senderAddress = pre.owner?.toLowerCase();
                                        break;
                                    }
                                }
                            }
                        }
                        break;
                    }
                }
            }
        }
        
        // Verify recipient matches user's deposit address
        if (!recipientAddress || recipientAddress !== userDepositAddr) {
            console.error(`[depositSolana] Recipient mismatch: expected=${userDepositAddr}, found=${recipientAddress || 'null'}, txn_id=${txn_id}, userId=${userId}`);
            console.error(`[depositSolana] Transaction accountKeys:`, txnData.transaction.message.accountKeys?.map((k, i) => ({
                index: i,
                key: typeof k === 'string' ? k : k.pubkey,
                preBalance: txnData.meta.preBalances?.[i],
                postBalance: txnData.meta.postBalances?.[i]
            })));
            return res.status(400).json({ 
                error: 'Invalid recipient', 
                message: `Transaction recipient (${recipientAddress || 'not found'}) does not match user deposit address (${userDepositAddr})` 
            });
        }
        
        if (amount <= 0) {
            return res.status(400).json({ 
                error: 'Invalid amount', 
                message: 'No valid deposit amount found in transaction' 
            });
        }
        
        // Convert crypto amount to LU (USD)
        let luAmount = 0;
        
        if (currency.symbol === 'USDC' || currency.symbol === 'USDT') {
            // Stablecoins: 1:1 with USD/LU
            luAmount = amount;
        }
        else if (currency.symbol === 'SOL') {
            // Get SOL price in USD from Binance
            const rateResult = yield (0, fiatConverter_1.getFiatToCryptoRate)(currency, 'USD', 1);
            if (!rateResult || !rateResult.price_per_crypto_usd) {
                return res.status(500).json({ 
                    error: 'Price fetch failed', 
                    message: 'Failed to get SOL price for conversion' 
                });
            }
            luAmount = amount * rateResult.price_per_crypto_usd;
        }
        else {
            return res.status(400).json({ 
                error: 'Unsupported currency', 
                message: `Currency ${currency.symbol} not supported for Solana deposits` 
            });
        }
        
        luAmount = (0, base_1.NumberFix)(luAmount, 2);
        
        // Check minimum deposit
        if (luAmount < MIN_DEPOSIT_LU) {
            console.warn(`[depositSolana] Amount below minimum: txn_id=${txn_id}, userId=${userId}, amount=${amount}, luAmount=${luAmount}, min=${MIN_DEPOSIT_LU}`);
            return res.status(400).json({ 
                error: 'Amount too small', 
                message: `Minimum deposit is ${MIN_DEPOSIT_LU} LU` 
            });
        }
        
        // Log deposit details (without sensitive data)
        const mint = currency.contractAddress || 'native';
        console.log(`[depositSolana] Processing deposit: txn_id=${txn_id}, userId=${userId}, derivedAddress=${userDepositAddr}, mint=${mint}, amount=${amount}, luAmount=${luAmount}, currency=${currency.symbol}`);
        
        // Create or update payment record (with error handling for duplicate txn_id)
        let payment;
        try {
            payment = yield models_1.Payments.findOneAndUpdate(
                { txn_id },
                {
                    userId: (0, base_1.ObjectId)(userId),
                    balanceId: balances._id,
                    currencyId: currencyId,
                    currency: currency.payment || currency.symbol,
                    address: userDepositAddr,
                    from: senderAddress || from || '',
                    amount: amount,
                    fiat_amount: luAmount,
                    status: 100,
                    status_text: 'confirmed',
                    method: 0,
                    ipn_type: 'deposit',
                    txn_id: txn_id,
                    bonusId: bonusId || null,
                },
                { upsert: true, new: true, setDefaultsOnInsert: true }
            );
        }
        catch (createError) {
            // Handle unique index violation (race condition)
            if (createError.code === 11000 && createError.keyPattern?.txn_id) {
                // Transaction was already processed by another request
                const existingPayment = yield models_1.Payments.findOne({ txn_id });
                if (existingPayment && existingPayment.status === 100) {
                    console.log(`[depositSolana] Transaction already processed (race condition): txn_id=${txn_id}, userId=${userId}, paymentId=${existingPayment._id}`);
                    return res.json({
                        message: 'Transaction already confirmed',
                        payment: existingPayment
                    });
                }
            }
            throw createError;
        }
        
        // Credit balance
        yield (0, base_1.balanceUpdate)({
            req,
            balanceId: balances._id,
            amount: luAmount,
            type: 'deposit-solana',
        });
        
        // Process affiliate postback
        if (user && user.affiliate) {
            try {
                yield (0, own_affiliate_1.depositPostBack)(
                    user._id,
                    user.username,
                    payment._id,
                    luAmount,
                    'LU'
                );
                console.log(`[depositSolana] Affiliate postback sent: userId=${userId}, txn_id=${txn_id}, luAmount=${luAmount}`);
            }
            catch (error) {
                console.error(`[depositSolana] Affiliate postback error: userId=${userId}, txn_id=${txn_id}`, error);
            }
        }
        
        // Process deposit bonus if applicable
        if (payment.bonusId) {
            payment.fiat_amount = luAmount;
            payment.balanceId = balances._id;
            yield setDepositBonus(payment, luAmount);
            console.log(`[depositSolana] Deposit bonus processed: userId=${userId}, txn_id=${txn_id}, bonusId=${payment.bonusId}`);
        }
        
        console.log(`[depositSolana] Deposit confirmed successfully: txn_id=${txn_id}, userId=${userId}, paymentId=${payment._id}, luAmount=${luAmount}`);
        return res.json({
            message: 'Deposit confirmed successfully',
            payment: payment
        });
    }
    catch (error) {
        // Ensure we don't log sensitive data (mnemonic, private keys)
        const errorMessage = error.message || 'Failed to process Solana deposit';
        const sanitizedMessage = errorMessage.replace(/SOLANA_DEPOSIT_MNEMONIC|SOLANA_MASTER_SEED|mnemonic|seed/gi, '[REDACTED]');
        console.error(`[depositSolana] Error: userId=${req.user?._id || 'unknown'}, txn_id=${req.body?.txn_id || 'unknown'}`, sanitizedMessage);
        return res.status(500).json({
            error: 'Internal Server Error',
            message: sanitizedMessage
        });
    }
});
exports.depositSolana = depositSolana;
/**
 * Processes a TRON deposit by verifying the transaction and crediting the user's balance.
 * Supports TRC20 tokens (USDT, USDC) with 1:1 LU conversion.
 * TRX native deposits are currently rejected (can be extended later).
 * 
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {Promise<void>} JSON response with payment confirmation
 */
const depositTron = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get user from request (set by auth middleware)
        const user = req.user;
        if (!user || !user._id) {
            return res.status(401).json({ error: 'Unauthorized', message: 'User not authenticated' });
        }
        const userId = user._id;
        const { currencyId, txn_id, from, bonusId } = req.body;
        if (!currencyId || !txn_id) {
            return res.status(400).json({ error: 'Invalid field!', message: 'currencyId and txn_id are required' });
        }
        // Validate currency is a TRON currency
        const currency = yield models_1.Currencies.findById(currencyId);
        if (!currency) {
            console.error(`[depositTron] Currency not found: currencyId=${currencyId}, userId=${userId}, txn_id=${txn_id}`);
            return res.status(400).json({ error: 'Invalid currency!', message: 'Currency not found' });
        }
        if (currency.blockchain !== 'tron') {
            console.error(`[depositTron] Invalid blockchain: currencyId=${currencyId}, blockchain=${currency.blockchain}, userId=${userId}, txn_id=${txn_id}`);
            return res.status(400).json({ 
                error: 'Invalid currency!', 
                message: 'Currency must be a TRON currency (blockchain=tron)' 
            });
        }
        // Reject TRX native deposits for now (as per requirements)
        const isNativeTRX = currency.symbol === 'TRX' && (currency.isNative === true || !currency.contractAddress || currency.contractAddress.trim() === '');
        if (isNativeTRX) {
            return res.status(400).json({ 
                error: 'TRX native deposits not supported', 
                message: 'TRX native deposits are currently not supported. Please use TRC20 tokens (USDT, USDC) for deposits.' 
            });
        }
        // Validate contractAddress is required for TRC20 tokens (non-native)
        const expectedContractAddress = currency.contractAddress;
        if (!expectedContractAddress || typeof expectedContractAddress !== 'string' || expectedContractAddress.trim() === '') {
            console.error(`[depositTron] Contract address missing: currencyId=${currencyId}, symbol=${currency.symbol}, isNative=${currency.isNative}, userId=${userId}, txn_id=${txn_id}`);
            return res.status(400).json({ 
                error: 'Contract mismatch', 
                message: 'Currency contractAddress is required for TRC20 token deposits' 
            });
        }
        // Get user's derived deposit address (or create if doesn't exist)
        let userDepositAddress = yield models_1.DepositAddresses.findOne({
            userId: (0, base_1.ObjectId)(userId),
            blockchain: 'tron'
        });
        // Auto-create address if it doesn't exist (for deposits)
        if (!userDepositAddress) {
            console.log(`[depositTron] Creating deposit address for user: userId=${userId}, txn_id=${txn_id}`);
            try {
                // Use the same logic as getTronDepositAddress to create address
                const counterName = `tron_deposit_index`;
                let counter = yield models_1.Counters.findOneAndUpdate(
                    { name: counterName },
                    { $inc: { value: 1 } },
                    { upsert: true, new: true }
                );
                if (!counter) {
                    counter = yield models_1.Counters.create({ name: counterName, value: 0 });
                    counter = yield models_1.Counters.findOneAndUpdate(
                        { name: counterName },
                        { $inc: { value: 1 } },
                        { new: true }
                    );
                }
                const index = counter.value;
                const derived = yield (0, tronHD_1.deriveTronAddress)(index);
                userDepositAddress = yield models_1.DepositAddresses.create({
                    userId: (0, base_1.ObjectId)(userId),
                    blockchain: 'tron',
                    index: index,
                    address: derived.address
                });
                console.log(`[depositTron] Created deposit address ${derived.address} for user ${userId}`);
            }
            catch (createError) {
                // Handle race condition - another request might have created it
                if (createError.code === 11000) {
                    userDepositAddress = yield models_1.DepositAddresses.findOne({
                        userId: (0, base_1.ObjectId)(userId),
                        blockchain: 'tron'
                    });
                }
                if (!userDepositAddress) {
                    console.error(`[depositTron] Failed to create deposit address: userId=${userId}, error=${createError.message}`);
                    return res.status(500).json({ 
                        error: 'Failed to create deposit address', 
                        message: 'Could not create TRON deposit address. Please try again.' 
                    });
                }
            }
        }
        const userDepositAddr = userDepositAddress.address.toLowerCase();
        // Check idempotency: if transaction already processed, return existing payment
        const existingPayment = yield models_1.Payments.findOne({ txn_id });
        if (existingPayment) {
            if (existingPayment.status === 100) {
                console.log(`[depositTron] Transaction already confirmed: txn_id=${txn_id}, userId=${userId}, paymentId=${existingPayment._id}`);
                return res.json({ 
                    message: 'Transaction already confirmed', 
                    payment: existingPayment 
                });
            }
            // If pending, continue to verify (but log warning)
            console.warn(`[depositTron] Transaction exists but not confirmed: txn_id=${txn_id}, userId=${userId}, status=${existingPayment.status}`);
        }
        // Get LU currency
        const luCurrency = yield models_1.Currencies.findOne({ symbol: 'LU' });
        if (!luCurrency) {
            console.error(`[depositTron] LU currency not found: userId=${userId}, txn_id=${txn_id}`);
            return res.status(500).json({ error: 'System configuration error', message: 'LU currency not found' });
        }
        // Get user's LU balance (create if missing)
        let balances = yield models_1.Balances.findOne({
            userId: (0, base_1.ObjectId)(userId),
            currency: luCurrency._id,
            status: true,
        });
        if (!balances) {
            balances = yield models_1.Balances.create({
                userId: (0, base_1.ObjectId)(userId),
                currency: luCurrency._id,
                balance: 0,
                bonus: 0,
                status: true,
            });
        }
        // Normalize contract address for comparison (do this early for consistent logging)
        const expectedContractAddressLower = expectedContractAddress.toLowerCase().trim();
        // Fetch transaction from TRON blockchain
        const txnData = yield (0, tron_1.getTronTransaction)(txn_id);
        if (!txnData || !txnData.transaction) {
            console.error(`[depositTron] TX not found: userId=${userId}, currencyId=${currencyId}, txn_id=${txn_id}, derivedAddress=${userDepositAddress.address}, contract=${expectedContractAddressLower}`);
            return res.status(400).json({ 
                error: 'TX not found', 
                message: 'Transaction not found on TRON blockchain' 
            });
        }
        // Check transaction status - MUST verify success before crediting
        const transactionInfo = txnData.transactionInfo;
        if (!transactionInfo) {
            console.error(`[depositTron] TX info missing: userId=${userId}, currencyId=${currencyId}, txn_id=${txn_id}, derivedAddress=${userDepositAddress.address}, contract=${expectedContractAddressLower}`);
            return res.status(400).json({ 
                error: 'TX not found', 
                message: 'Transaction info not available' 
            });
        }
        // Verify transaction was successful (result must be 'SUCCESS')
        const txResult = transactionInfo.result;
        if (!txResult || txResult !== 'SUCCESS') {
            console.error(`[depositTron] TX failed: userId=${userId}, currencyId=${currencyId}, txn_id=${txn_id}, derivedAddress=${userDepositAddress.address}, contract=${expectedContractAddressLower}, result=${txResult || 'null'}`);
            return res.status(400).json({ 
                error: 'TX failed', 
                message: `Transaction failed on blockchain: ${txResult || 'unknown error'}` 
            });
        }
        let amount = 0;
        let senderAddress = null;
        let recipientAddress = null;
        let foundTransferEvent = false;
        // Parse TRC20 Transfer event from TronGrid events
        const events = txnData.events || [];
        for (const event of events) {
            // Check if this is a Transfer event
            if (event.event_name !== 'Transfer') {
                continue;
            }
            // Validate contract address matches expected contract
            const eventContractAddress = event.contract_address ? event.contract_address.toLowerCase().trim() : null;
            if (!eventContractAddress || eventContractAddress !== expectedContractAddressLower) {
                // Contract mismatch - log but continue checking other events
                continue;
            }
            // Found matching contract - extract Transfer event data
            foundTransferEvent = true;
            const eventData = event.result || {};
            let toAddress = null;
            let fromAddress = null;
            let rawValue = null;
            // Handle different event data formats
            if (eventData.to) {
                // Convert hex address to base58 TRON address
                try {
                    toAddress = tronWeb.address.fromHex(eventData.to).toLowerCase();
                }
                catch (hexError) {
                    // If already base58, use as is
                    toAddress = eventData.to.toLowerCase();
                }
            }
            if (eventData.from) {
                try {
                    fromAddress = tronWeb.address.fromHex(eventData.from).toLowerCase();
                }
                catch (hexError) {
                    fromAddress = eventData.from.toLowerCase();
                }
            }
            rawValue = eventData.value;
            if (toAddress === userDepositAddr && rawValue) {
                // Convert raw value to token amount using decimals
                // rawValue is a string representation of the big number
                const decimals = currency.decimals || 6;
                // Handle both string and number formats
                const rawValueNum = typeof rawValue === 'string' ? parseFloat(rawValue) : rawValue;
                amount = rawValueNum / Math.pow(10, decimals);
                recipientAddress = toAddress;
                senderAddress = fromAddress || from?.toLowerCase();
                break;
            }
        }
        // Verify Transfer event was found for the expected contract
        if (!foundTransferEvent) {
            console.error(`[depositTron] Transfer event missing: userId=${userId}, currencyId=${currencyId}, txn_id=${txn_id}, derivedAddress=${userDepositAddress.address}, contract=${expectedContractAddressLower}, eventsFound=${events.length}`);
            return res.status(400).json({ 
                error: 'Transfer event missing', 
                message: `No Transfer event found for contract ${expectedContractAddressLower} in transaction` 
            });
        }
        // Verify recipient matches user's deposit address
        if (!recipientAddress || recipientAddress !== userDepositAddr) {
            console.error(`[depositTron] Recipient address mismatch: userId=${userId}, currencyId=${currencyId}, txn_id=${txn_id}, derivedAddress=${userDepositAddress.address}, contract=${expectedContractAddressLower}, expected=${userDepositAddr}, found=${recipientAddress || 'null'}`);
            return res.status(400).json({ 
                error: 'Recipient address mismatch', 
                message: `Transaction recipient (${recipientAddress || 'not found'}) does not match user deposit address (${userDepositAddr})` 
            });
        }
        if (amount <= 0) {
            console.error(`[depositTron] Invalid amount: userId=${userId}, currencyId=${currencyId}, txn_id=${txn_id}, derivedAddress=${userDepositAddress.address}, contract=${expectedContractAddressLower}, amount=${amount}`);
            return res.status(400).json({ 
                error: 'Invalid amount', 
                message: 'No valid deposit amount found in transaction' 
            });
        }
        // Convert crypto amount to LU (USD)
        // For TRC20 stablecoins (USDT, USDC), use 1:1 conversion
        let luAmount = 0;
        if (currency.symbol === 'USDT' || currency.symbol === 'USDC') {
            // Stablecoins: 1:1 with USD/LU
            luAmount = amount;
        }
        else {
            // Other TRC20 tokens - could add price conversion here if needed
            return res.status(400).json({ 
                error: 'Unsupported currency', 
                message: `Currency ${currency.symbol} not supported for TRON deposits. Only USDT and USDC are supported.` 
            });
        }
        luAmount = (0, base_1.NumberFix)(luAmount, 2);
        // Check minimum deposit
        if (luAmount < MIN_DEPOSIT_LU) {
            console.warn(`[depositTron] Amount below minimum: txn_id=${txn_id}, userId=${userId}, amount=${amount}, luAmount=${luAmount}, min=${MIN_DEPOSIT_LU}`);
            return res.status(400).json({ 
                error: 'Amount too small', 
                message: `Minimum deposit is ${MIN_DEPOSIT_LU} LU` 
            });
        }
        // Structured log before processing deposit
        console.log(`[depositTron] Processing deposit: userId=${userId}, currencyId=${currencyId}, txn_id=${txn_id}, derivedAddress=${userDepositAddress.address}, amount=${amount}, contract=${expectedContractAddressLower}, symbol=${currency.symbol}, luAmount=${luAmount}`);
        // Create or update payment record (with error handling for duplicate txn_id)
        // Payments model has unique index on txn_id, so duplicates are handled safely
        let payment;
        try {
            payment = yield models_1.Payments.findOneAndUpdate(
                { txn_id },
                {
                    userId: (0, base_1.ObjectId)(userId),
                    balanceId: balances._id,
                    currencyId: currencyId,
                    currency: currency.payment || currency.symbol,
                    address: userDepositAddr,
                    from: senderAddress || from || '',
                    amount: amount,
                    fiat_amount: luAmount,
                    status: 100,
                    status_text: 'confirmed',
                    method: 0,
                    ipn_type: 'deposit',
                    txn_id: txn_id,
                    bonusId: bonusId || null,
                },
                { upsert: true, new: true, setDefaultsOnInsert: true }
            );
        }
        catch (createError) {
            // Handle unique index violation (race condition) - Payments model has unique index on txn_id
            if (createError.code === 11000 && createError.keyPattern?.txn_id) {
                // Transaction was already processed by another request
                const existingPayment = yield models_1.Payments.findOne({ txn_id });
                if (existingPayment && existingPayment.status === 100) {
                    console.log(`[depositTron] Transaction already processed (race condition): userId=${userId}, currencyId=${currencyId}, txn_id=${txn_id}, paymentId=${existingPayment._id}`);
                    return res.json({
                        message: 'Transaction already confirmed',
                        payment: existingPayment
                    });
                }
            }
            // Re-throw other errors
            console.error(`[depositTron] Payment creation error: userId=${userId}, currencyId=${currencyId}, txn_id=${txn_id}, error=${createError.message}`);
            throw createError;
        }
        // Credit balance
        yield (0, base_1.balanceUpdate)({
            req,
            balanceId: balances._id,
            amount: luAmount,
            type: 'deposit-tron',
        });
        // Process affiliate postback
        if (user && user.affiliate) {
            try {
                yield (0, own_affiliate_1.depositPostBack)(
                    user._id,
                    user.username,
                    payment._id,
                    luAmount,
                    'LU'
                );
                console.log(`[depositTron] Affiliate postback sent: userId=${userId}, txn_id=${txn_id}, luAmount=${luAmount}`);
            }
            catch (error) {
                console.error(`[depositTron] Affiliate postback error: userId=${userId}, txn_id=${txn_id}`, error);
            }
        }
        // Process deposit bonus if applicable
        if (payment.bonusId) {
            payment.fiat_amount = luAmount;
            payment.balanceId = balances._id;
            yield setDepositBonus(payment, luAmount);
            console.log(`[depositTron] Deposit bonus processed: userId=${userId}, txn_id=${txn_id}, bonusId=${payment.bonusId}`);
        }
        console.log(`[depositTron] Deposit confirmed successfully: txn_id=${txn_id}, userId=${userId}, paymentId=${payment._id}, luAmount=${luAmount}`);
        return res.json({
            message: 'Deposit confirmed successfully',
            payment: payment
        });
    }
    catch (error) {
        // Ensure we don't log sensitive data (mnemonic, private keys)
        const errorMessage = error.message || 'Failed to process TRON deposit';
        const sanitizedMessage = errorMessage.replace(/TRON_DEPOSIT_MNEMONIC|mnemonic|seed|private.*key/gi, '[REDACTED]');
        console.error(`[depositTron] Error: userId=${req.user?._id || 'unknown'}, txn_id=${req.body?.txn_id || 'unknown'}`, sanitizedMessage);
        return res.status(500).json({
            error: 'Internal Server Error',
            message: sanitizedMessage
        });
    }
});
exports.depositTron = depositTron;
const getTransactionResult = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.get(`hmac`) ||
        !req.body ||
        !req.body.ipn_mode ||
        req.body.ipn_mode !== `hmac` ||
        process.env.MERCHANT_ID !== req.body.merchant) {
        res.send('error');
        return;
    }
    const hmac = req.get(`hmac`);
    const ipnSecret = process.env.IPN_SECRET;
    const payload = req.body;
    let isValid;
    try {
        isValid = IPN.verify(hmac, ipnSecret, payload);
    }
    catch (e) {
        res.send('error');
        return;
    }
    if (!(payload === null || payload === void 0 ? void 0 : payload.amount)) {
        console.log(payload);
        return;
    }
    if (isValid) {
        try {
            const { label, address, amount, amounti, currency, ipn_id, ipn_mode, ipn_type, merchant, status, status_text, txn_id } = payload;
            const data = {
                address,
                amount,
                amounti,
                currency,
                ipn_id,
                ipn_mode,
                ipn_type,
                merchant,
                status,
                status_text,
                txn_id,
            };
            if ((0, base_1.NumberFix)(amount, 5) === 0)
                return;
            if (ipn_type === 'deposit') {
                if (!amount || !payload.fee)
                    return console.log(`fee`, payload);
                data.id = payload.deposit_id;
                data.amount = amount - payload.fee;
                data.status_text = status === '100' ? 'confirmed' : data.status_text;
                const result = yield models_1.Payments.findOne({ _id: (0, base_1.ObjectId)(label) });
                if (result && result.status !== 100) {
                    yield models_1.Payments.updateOne({ _id: (0, base_1.ObjectId)(label) }, data);
                    if (status === '100') {
                        // Get LU currency
                        const luCurrency = yield models_1.Currencies.findOne({ symbol: 'LU' });
                        if (!luCurrency) {
                            console.error('LU currency not found in getTransactionResult');
                            return;
                        }
                        
                        // Get user's LU balance
                        let balance = yield models_1.Balances.findOne({
                            userId: result.userId,
                            currency: luCurrency._id,
                            status: true,
                        });
                        
                        if (!balance) {
                            balance = yield models_1.Balances.create({
                                userId: result.userId,
                                currency: luCurrency._id,
                                balance: 0,
                                bonus: 0,
                                status: true,
                            });
                        }
                        
                        // Convert crypto amount to LU (USD)
                        const depositCurrency = yield models_1.Currencies.findById(result.currencyId);
                        const cryptoAmount = amount - payload.fee; // Crypto amount
                        let luAmount = cryptoAmount;
                        
                        luAmount = (0, base_1.NumberFix)(luAmount, 2);
                        const cryptoAmountFixed = (0, base_1.NumberFix)(cryptoAmount, depositCurrency?.decimals || 18);
                        
                        // Update payment: amount = crypto amount, fiat_amount = LU amount
                        yield models_1.Payments.updateOne({ _id: (0, base_1.ObjectId)(label) }, {
                            amount: cryptoAmountFixed, // Crypto amount
                            fiat_amount: luAmount, // LU amount
                        });
                        
                        // Add LU to balance
                        (0, base_1.balanceUpdate)({
                            req,
                            balanceId: balance._id,
                            amount: luAmount,
                            type: 'deposit-coinpayment',
                        });
                        
                        // Update result with fiat_amount for bonus processing
                        result.fiat_amount = luAmount;
                        result.balanceId = balance._id;
                        
                        // Process deposit bonus if applicable
                        if (result.bonusId) {
                            yield setDepositBonus(result, luAmount);
                        }
                        
                        const user = yield models_1.Users.findById(result.userId);
    if (balance && balance.userId && user.affiliate) {
        try {
            yield (0, own_affiliate_1.depositPostBack)(
                balance.userId._id,
                user.username,
                result._id,
                amount - payload.fee,
                currency
            );
        } catch (error) {
            console.error('[depositPostBack] Error in coinpayment callback:', error);
        }
    }
                    }
                }
            }
            else if (ipn_type === 'withdrawal') {
                data.id = payload.id;
                if (status === '2') {
                    data.status_text = 'confirmed';
                }
                else if (status === '-1') {
                    data.status_text = 'canceled';
                }
                else if (status === '-6') {
                    data.status_text = 'canceled';
                }
                else {
                    console.log(data.status_text);
                }
                const result = yield models_1.Payments.findOne({ id: payload.id });
                if (result && result.status !== 2) {
                    yield models_1.Payments.updateOne({ id: payload.id }, data);
                }
            }
            else {
                console.log('isValid deposit withdrawal error');
            }
        }
        catch (error) {
            console.log('isValid', error);
            res.json(error);
        }
    }
    else {
        console.log('hmac error');
    }
});
exports.getTransactionResult = getTransactionResult;
const getTransactions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.body;
        const result = yield models_1.Payments.find({
            userId: (0, base_1.ObjectId)(userId),
            status: { $ne: 0 },
        })
            .populate('currencyId')
            .sort({ createdAt: -1 });
        return res.json(result);
    }
    catch (error) {
        console.error('Error getTransactions =>', error);
        return res.status(500).json('Internal Server Error');
    }
});
exports.getTransactions = getTransactions;
const getCurrencies = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield models_1.Currencies.find({ status: true }).sort({
            order: 1,
            createdAt: 1,
        });
        return res.json(result);
    }
    catch (error) {
        console.error('Error getCurrencies =>', error);
        return res.status(500).json('Internal Server Error');
    }
});
exports.getCurrencies = getCurrencies;
const getBalances = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.body;
    const result = yield models_1.Balances.find({
        userId: (0, base_1.ObjectId)(userId),
    }).sort({ status: -1, balance: -1 });
    res.json(result);
});
exports.getBalances = getBalances;

const updateBalance = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { balanceId, amount, type } = req.body;
        const balances = yield models_1.Balances.findById((0, base_1.ObjectId)(balanceId));
        if (type === 'withdrawal' && balances.balance < amount)
            return res.status(400).json('Balances not enough!');
        if (type === 'withdrawal') {
            yield (0, base_1.balanceUpdate)({
                req,
                balanceId,
                amount: amount * -1,
                type: `${type}-admin`,
            });
            yield models_1.Payments.create({
                paymentId: 'admin',
                currencyId: balances.currency._id,
                currency: balances.currency.symbol,
                userId: balances.userId,
                balanceId,
                amount,
                actually_paid: amount,
                address: 'admin',
                status: 2,
                method: 3,
                ipn_type: type,
                status_text: 'confirmed',
                txn_id: 'admin',
            });
        }
        else {
            yield (0, base_1.balanceUpdate)({ req, balanceId, amount, type: `${type}-admin` });
            yield models_1.Payments.create({
                paymentId: 'admin',
                currencyId: balances.currency._id,
                currency: balances.currency.symbol,
                userId: balances.userId,
                balanceId,
                amount,
                actually_paid: amount,
                address: 'admin',
                status: 100,
                method: 3,
                ipn_type: type,
                status_text: 'confirmed',
                txn_id: 'admin',
            });
        }
        return res.json({ status: true });
    }
    catch (error) {
        console.error('Payment Update Balance Error => ', error);
        return res.status(500).json('Internal Server Error');
    }
});
exports.updateBalance = updateBalance;
const getAdminBalance = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const address1 = depositAddress;
    const address2 = widthrawAddress;
    let balances;
    try {
        if (coinpayment_1.coinpayment && coinpayment_1.coinpayment.balances)
            balances = yield coinpayment_1.coinpayment.balances();
    }
    catch (error) {
        console.log(error);
    }
    const currencies = yield models_1.Currencies.find({ status: true }).select({
        _id: 0,
        abi: 1,
        symbol: 1,
        price: 1,
        contractAddress: 1,
        type: 1,
        payment: 1,
        network: 1,
        icon: 1,
    });
    const metamask = {};
    const solana = {};
    const coinpaymentData = {};
    let mtotal1 = 0;
    let mtotal2 = 0;
    let ctotal = 0;
    let stotal = 0;
    for (const i in currencies) {
        const currency = currencies[i];
        if (currency.type === 2 || currency.type === 0) {
            if (currency.network === 'ethereum') {
                if (currency.contractAddress !== 'ether') {
                    const contract = new ethereum_1.EthereumWeb3.eth.Contract(currency.abi, currency.contractAddress);
                    const balance1 = yield contract.methods.balanceOf(address1).call();
                    const balance2 = yield contract.methods.balanceOf(address2).call();
                    const decimals = yield contract.methods.decimals().call();
                    const amount1 = Number((0, units_1.formatUnits)(balance1, decimals));
                    const amount2 = Number((0, units_1.formatUnits)(balance2, decimals));
                    metamask[currency.symbol] = {
                        balance1: amount1,
                        balance2: amount2,
                        usdbalance1: amount1,
                        usdbalance2: amount2,
                    };
                    mtotal1 += amount1;
                    mtotal2 += amount2;
                }
                else {
                    const balance1 = yield ethereum_1.EthereumWeb3.eth.getBalance(address1);
                    const balance2 = yield ethereum_1.EthereumWeb3.eth.getBalance(address2);
                    const amount1 = Number((0, units_1.formatUnits)(balance1, 18));
                    const amount2 = Number((0, units_1.formatUnits)(balance2, 18));
                    metamask[currency.symbol] = {
                        balance1: amount1,
                        balance2: amount2,
                        usdbalance1: amount1,
                        usdbalance2: amount2,
                    };
                    mtotal1 += amount1;
                    mtotal2 += amount2;
                }
            }
            else if (currency.network === 'solana') {
                const amount = yield (0, solana_1.getSOLbalance)(solanaAddress, currency);
                solana[currency.symbol] = {
                    balance: amount,
                    usdbalance: amount,
                };
                stotal += amount;
            }
        }
        if (balances) {
            const balance = balances[currency.payment];
            if (balance) {
                coinpaymentData[currency.symbol] = {
                    balance: Number(balance.balancef),
                    usdbalance: Number(balance.balancef),
                };
                ctotal += Number(balance.balancef);
            }
        }
    }
    return res.json({ metamask, solana, coinpayment: coinpaymentData, ctotal, stotal, mtotal1, mtotal2 });
});
exports.getAdminBalance = getAdminBalance;
const withdrawalTimer = () => __awaiter(void 0, void 0, void 0, function* () {
    const processingPayment = yield models_1.Payments.findOne({
        method: 0,
        status: 1,
        ipn_type: 'withdrawal',
    })
        .populate('currencyId')
        .sort({ createdAt: 1 });
    if (processingPayment && processingPayment.currencyId) {
        const currency = processingPayment.currencyId;
        if (currency.network === 'ethereum') {
            const response = yield ethereum_1.EthereumWeb3.eth.getTransactionReceipt(processingPayment.txn_id);
            if (!response)
                return;
            if (!response.status) {
                yield models_1.Payments.updateOne({ _id: processingPayment._id }, { status: -1, status_text: 'canceled' });
                // Refund fiat_amount (balance was deducted in fiat when withdrawal was created)
                yield (0, base_1.balanceUpdate)({
                    req: { app: { get: () => null } }, // Pass minimal req object for socket emit
                    balanceId: processingPayment.balanceId,
                    amount: processingPayment.fiat_amount || processingPayment.amount,
                    type: 'withdrawal-metamask-canceled',
                });
            }
            else {
                yield models_1.Payments.updateOne({ _id: processingPayment._id }, { status: 2, status_text: 'confirmed' });
            }
        }
        else {
            const res = yield (0, solana_1.getTxnSolana)(processingPayment.txn_id);
            if (!res)
                return;
            if (!res.status) {
                yield models_1.Payments.updateOne({ _id: processingPayment._id }, { status: -1, status_text: 'canceled' });
                // Refund fiat_amount (balance was deducted in fiat when withdrawal was created)
                yield (0, base_1.balanceUpdate)({
                    req: { app: { get: () => null } }, // Pass minimal req object for socket emit
                    balanceId: processingPayment.balanceId,
                    amount: processingPayment.fiat_amount || processingPayment.amount,
                    type: 'withdrawal-solana-canceled',
                });
            }
            else {
                yield models_1.Payments.updateOne({ _id: processingPayment._id }, { status: 2, status_text: 'confirmed' });
            }
        }
    }
    else {
        const pendingPayment = yield models_1.Payments.findOne({
            method: 0,
            status: 105,
            ipn_type: 'withdrawal',
        })
            .populate('currencyId')
            .sort({ createdAt: 1 });
        if (pendingPayment && pendingPayment.currencyId) {
            const balance = yield models_1.Balances.findById(pendingPayment.balanceId);
            if (balance.balance < 0) {
                console.log('error =>', balance);
                yield models_1.Payments.updateOne({ _id: pendingPayment._id }, { status: -1, status_text: 'canceled' });
            }
            else {
                const currency = pendingPayment.currencyId;
                if (currency.network === 'ethereum') {
                    if (currency.symbol === 'ETH') {
                        (0, ethereum_1.transferEthererum)(widthrawAddress, pendingPayment.address, pendingPayment.amount)
                            .then((txn_id) => __awaiter(void 0, void 0, void 0, function* () {
                            yield models_1.Payments.updateOne({ _id: pendingPayment._id }, {
                                status: 1,
                                status_text: 'processing',
                                id: txn_id,
                                txn_id,
                            });
                        }))
                            .catch((error) => {
                            console.log('error', error);
                        });
                    }
                    else {
                        const currencyData = {
                            abi: currency.abi,
                            address: currency.contractAddress,
                            // price removed - always 1 (LU = USD)
                        };
                        (0, ethereum_1.transferErc20)(widthrawAddress, pendingPayment.address, currencyData, pendingPayment.amount)
                            .then((txn_id) => __awaiter(void 0, void 0, void 0, function* () {
                            yield models_1.Payments.updateOne({ _id: pendingPayment._id }, {
                                status: 1,
                                status_text: 'processing',
                                id: txn_id,
                                txn_id,
                            });
                        }))
                            .catch((error) => {
                            console.log('error', error);
                        });
                    }
                }
                else if (currency.network === 'solana') {
                    try {
                        let txn_id;
                        if (currency.symbol == 'SOL') {
                            txn_id = yield (0, solana_1.transferSOL)(pendingPayment.amount, pendingPayment.address);
                        }
                        else {
                            txn_id = yield (0, solana_1.transferSPL)(currency.contractAddress, pendingPayment.amount, pendingPayment.address);
                        }
                        if (!txn_id) {
                            yield models_1.Payments.updateOne({ _id: pendingPayment._id }, { status: -1, status_text: 'canceled' });
                            // Refund fiat_amount (balance was deducted in fiat when withdrawal was created)
                            yield (0, base_1.balanceUpdate)({
                                req: { app: { get: () => null } }, // Pass minimal req object for socket emit
                                balanceId: pendingPayment.balanceId,
                                amount: pendingPayment.fiat_amount || pendingPayment.amount,
                                type: 'withdrawal-solana-canceled',
                            });
                        }
                        else {
                            yield models_1.Payments.updateOne({ _id: pendingPayment._id }, { status: 1, status_text: 'processing', txn_id });
                        }
                    }
                    catch (error) {
                        console.log('payment error => ', error);
                    }
                }
            }
        }
    }
    const pendingPayment = yield models_1.Payments.findOne({
        method: 1,
        status: 105,
        ipn_type: 'withdrawal',
    })
        .populate('currencyId')
        .sort({ createdAt: 1 });
    if (pendingPayment) {
        const currency = pendingPayment.currencyId;
        const balance = yield models_1.Balances.findById(pendingPayment.balanceId);
        if (balance.balance < 0) {
            console.log('error =>', balance);
            yield models_1.Payments.updateOne({ _id: pendingPayment._id }, { status: -1, status_text: 'canceled' });
            // Refund fiat_amount (balance was deducted in fiat when withdrawal was created)
            yield (0, base_1.balanceUpdate)({
                req: { app: { get: () => null } }, // Pass minimal req object for socket emit
                balanceId: pendingPayment.balanceId,
                amount: pendingPayment.fiat_amount || pendingPayment.amount,
                type: 'withdrawal-coinpayment-canceled',
            });
            return;
        }
        try {
            const Opts = {
                amount: pendingPayment.amount,
                currency: currency.payment,
                ipn_url,
                address: pendingPayment.address,
            };
            const data = yield coinpayment_1.coinpayment.createWithdrawal(Opts);
            yield models_1.Payments.updateOne({ _id: pendingPayment._id }, { id: data.id, status: data.status, status_text: 'processing' });
        }
        catch (error) {
            console.log('coinpayment error => ', error);
        }
    }
});
exports.withdrawalTimer = withdrawalTimer;
const removePendingPayment = () => __awaiter(void 0, void 0, void 0, function* () {
    const date = moment().subtract(24, 'hours');
    yield models_1.Payments.find({
        ipn_type: 'deposit',
        status: 0,
        method: 1,
        createdAt: { $lte: date },
    });
});
exports.removePendingPayment = removePendingPayment;
const getPaymentMethod = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield models_1.Currencies.find({ status: true }).sort({ order: 1 }).select({
        _id: 0,
        icon: 1,
        name: 1,
        officialLink: 1,
    });
    res.json(result);
});
exports.getPaymentMethod = getPaymentMethod;
// DEPRECATED: Fiat deposits not supported - only crypto deposits accepted
const createNowpay = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.status(403).json({ error: 'Fiat deposits not supported', message: 'Only crypto deposits are accepted' });
    /* REMOVED - Dead code after return
    try {
        const { userId, amount, currencyId } = req.body;
        // const balance = await Balances.findOne({
        //     userId: ObjectId(userId),
        //     status: true,
        // });
        // if (!balance) return res.status(402).json("Currency is not allowed");
        let balance = yield models_1.Balances.findOne({
            userId: (0, base_1.ObjectId)(userId),
            currency: currencyId,
        });
        if (!balance)
            balance = yield models_1.Balances.create({
                userId,
                balance: 0,
                status: false,
                currency: currencyId,
            });
        const currency = yield models_1.Currencies.findOne({ _id: currencyId, status: true, deposit: true });
        if (!currency)
            return res.status(402).json('Currency is not allowed');
        if (amount <= 0 || amount < currency.minDeposit)
            return res.status(402).json(`Min Deposit amount is ${currency.minDeposit}`);
        axios_1.default
            .post(`${NOW_PAYMENT_API}/v1/payment`, {
            price_amount: 1,
            price_currency: 'usd',
            pay_currency: currency.payment,
            pay_amount: amount,
            ipn_callback_url: NOW_PAYMENT_CALL_BACK,
        }, {
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': NOW_PAYMENT_API_KEY,
            },
        })
            .then(({ data }) => __awaiter(void 0, void 0, void 0, function* () {
            const { payment_id, pay_address, pay_amount } = data;
            const payment = yield models_1.Payments.findOneAndUpdate({ paymentId: payment_id }, {
                userId,
                currencyId: currency._id,
                balanceId: balance._id,
                amount: pay_amount,
                address: pay_address,
                status: -3,
                ipn_type: 'deposit',
                status_text: 'pending',
            }, { upsert: true, new: true });
            res.json(payment);
        }))
            .catch((err) => {
            var _a, _b;
            console.log('error', err);
            return res.status(500).json((_b = (_a = err === null || err === void 0 ? void 0 : err.response) === null || _a === void 0 ? void 0 : _a.data.message) !== null && _b !== void 0 ? _b : 'server error !!!');
        });
    }
    catch (error) {
        console.error(error);
        return res.status(400).json('Internal Server Error');
    }
    */
});
exports.createNowpay = createNowpay;
// DEPRECATED: Currency exchange not supported - only crypto deposits/withdrawals accepted
const exchangeNowpay = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.status(403).json({ error: 'Currency exchange not supported', message: 'Only crypto deposits and withdrawals are accepted' });
    /* REMOVED - Dead code after return
    try {
        const { userId, amount, fromCurrencyId, toCurrencyId } = req.body;
        if (fromCurrencyId === toCurrencyId)
            return res.status(402).json('Currency is wrong');
        const balance = yield models_1.Balances.findOne({ userId, currency: fromCurrencyId });
        const tocurrency = yield models_1.Currencies.findOne({ _id: toCurrencyId, status: true });
        if (!tocurrency)
            return res.status(402).json('To Currency is not defined');
        if (balance < amount)
            return res.status(402).json('Your Balance is not enough');
        console.log(balance, '==>balance');
        const token = yield (0, base_1.authNOW)();
        console.log(token, '==>token');
        if (!token)
            return res.status(402).json('Auth TOKEN Error!');
        axios_1.default
            .post(`${NOW_PAYMENT_API}/v1/conversion`, {
            amount: amount.toString(),
            from_currency: balance.currency.payment,
            to_currency: tocurrency.payment,
        }, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        })
            .then(({ data }) => __awaiter(void 0, void 0, void 0, function* () {
            yield models_1.Balances.updateOne({ _id: balance._id }, { $inc: { balance: -1 * data.result.from_amount } });
            // Exchanges model removed - currency exchange tracking no longer needed
            return res.json('success');
        }))
            .catch((err) => {
            var _a, _b;
            console.log('error', err);
            return res.status(500).json((_b = (_a = err === null || err === void 0 ? void 0 : err.response) === null || _a === void 0 ? void 0 : _a.data.message) !== null && _b !== void 0 ? _b : 'server error !!!');
        });
    }
    catch (error) {
        console.error(error);
        return res.status(400).json('Internal Server Error');
    }
    */
});
exports.exchangeNowpay = exchangeNowpay;
// DEPRECATED: Fiat deposits not supported - only crypto deposits accepted
const getFiatNowpay = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.status(403).json({ error: 'Fiat deposits not supported', message: 'Only crypto deposits are accepted' });
});
exports.getFiatNowpay = getFiatNowpay;
const getCurrenciesFiat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Return only LU currency
        const luCurrency = yield models_1.Currencies.findOne({ symbol: 'LU' });
        if (!luCurrency) {
            return res.status(500).json('LU currency not configured');
        }
        return res.json([luCurrency]);
    } catch (error) {
        return res.status(500).json('Internal Server Error');
    }
});
exports.getCurrenciesFiat = getCurrenciesFiat;

// const setDepositBonus = (payment, amount) => __awaiter(void 0, void 0, void 0, function* () {
//     const bonus = yield models_1.Bonus.findById(payment.bonusId);
//     if (!bonus)
//         return;
//     if (bonus.deposit_amount_from > amount || bonus.deposit_amount_to < amount)
//         return;
//     let bonusAmount = 0;
//     if (bonus.amount_type === 'fixed')
//         bonusAmount = bonus.amount;
//     if (bonus.amount_type === 'percentage') {
//         bonusAmount = (0, base_1.NumberFix)((amount / 100) * bonus.amount, 2);
//         if (bonus.up_to_amount && bonusAmount > bonus.up_to_amount)
//             bonusAmount = bonus.up_to_amount;
//     }
//     if (bonus.amount_type === 'cashback')
//         bonusAmount = bonus.amount;
//     yield models_1.BonusHistories.create({
//         bonusId: payment.bonusId,
//         userId: payment.userId,
//         paymentsId: payment._id,
//         amount: bonusAmount,
//         isDeposit: amount,
//         status: bonus.spend_amount > 0 ? 'processing' : 'active',
//     });
//     if (bonus.spend_amount <= 0) {
//         yield models_1.Balances.findByIdAndUpdate(payment.balanceId, { $inc: { bonus: bonusAmount } });
//         const en = bonus.lang.find((e) => e.lang === 'en') || bonus.lang[0];
//         yield models_1.Notification.create({
//             title: `New Bonus`,
//             description: `You have got new bonus! (${en.title})  ${process.env.DOMAIN}/en/user/my-shares`,
//             players: [String(payment.userId)],
//             country: ['all'],
//             auto: true,
//         });
//         yield (0, tracking_1.trackBonus)(payment.userId, bonus);
//         if (bonus.event.type !== 'casino')
//             return;
//         if (!bonus.games_freespin?.length)
//             return;
//         if (!bonus.free_spin)
//             return;
//         let free_spin = bonus.free_spin;
//         if (bonus.free_spin_type === 'percentage') {
//             free_spin = Math.round((amount / 100) * free_spin);
//             if (bonus.free_spin_up_to_amt && free_spin > bonus.free_spin_up_to_amt)
//                 free_spin = bonus.free_spin_up_to_amt;
//         }
//         yield (0, timelesstech_1.createCampaign)(bonus.games_freespin, String(payment.userId), free_spin, new Date(bonus.to_date), en.title, bonus.max_bet_free_spin);
//     }
// });

const setDepositBonus = (payment, amount) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`[setDepositBonus] Processing bonus for payment ${payment._id}, amount ${amount}`);
    const bonus = yield models_1.Bonus.findById(payment.bonusId);
    if (!bonus) {
        console.log(`[setDepositBonus] Bonus not found: ${payment.bonusId}`);
        return;
    }
    console.log(`[setDepositBonus] Bonus found: ${bonus._id}, title: ${bonus.lang.find(e => e.lang === 'en')?.title || 'unknown'}`);
    // Get LU currency
    const luCurrency = yield models_1.Currencies.findOne({ symbol: 'LU' });
    if (!luCurrency) {
        console.log(`[setDepositBonus] LU currency not found`);
        return;
    }
    
    // Get user's LU balance
    const balance = yield models_1.Balances.findOne({
        userId: payment.userId,
        currency: luCurrency._id,
        status: true,
    });
    if (!balance) {
        console.log(`[setDepositBonus] No LU balance found for payment ${payment._id}`);
        return;
    }
    
    // amount parameter should be in LU (fiat_amount)
    // Find bonus currency config for LU
    const matchingCurrency = bonus.currencies.find(curr => 
        curr.currency === 'LU' || String(curr.currency) === String(luCurrency._id)
    );
    if (!matchingCurrency) {
        console.log(`[setDepositBonus] No matching currency for bonus ${bonus._id}, user currency: ${userCurrencySymbol}`);
        return;
    }
    console.log(`[setDepositBonus] Checking amount ${amount} against bonus ${bonus._id}: [${matchingCurrency.deposit_amount_from}, ${matchingCurrency.deposit_amount_to}]`);
    if (matchingCurrency.deposit_amount_from > amount || matchingCurrency.deposit_amount_to < amount) {
        console.log(`[setDepositBonus] Amount ${amount} out of range for bonus ${bonus._id}`);
        return;
    }
    let bonusAmount = 0;
    if (matchingCurrency.amount_type === 'fixed') {
        bonusAmount = matchingCurrency.amount;
        console.log(`[setDepositBonus] Fixed bonus amount: ${bonusAmount}`);
    }
    if (matchingCurrency.amount_type === 'percentage') {
        bonusAmount = (0, base_1.NumberFix)((amount / 100) * matchingCurrency.amount, 2);
        if (matchingCurrency.up_to_amount && bonusAmount > matchingCurrency.up_to_amount) {
            bonusAmount = matchingCurrency.up_to_amount;
        }
        console.log(`[setDepositBonus] Percentage bonus calculated: ${bonusAmount}`);
    }
    if (matchingCurrency.amount_type === 'cashback') {
        bonusAmount = matchingCurrency.amount;
        console.log(`[setDepositBonus] Cashback bonus amount: ${bonusAmount}`);
    }
    // Проверяем, есть ли уже запись в BonusHistories для userId и bonusId
    const existingBonusHistory = yield models_1.BonusHistories.findOne({
        userId: payment.userId,
        bonusId: payment.bonusId,
    });
    if (existingBonusHistory) {
        console.log(`[setDepositBonus] Existing BonusHistories found for user ${payment.userId}, bonus ${bonus._id}: ${existingBonusHistory._id}`);
        // Обновляем существующую запись
        yield models_1.BonusHistories.findOneAndUpdate(
            { _id: existingBonusHistory._id },
            {
                amount: bonusAmount,
                isDeposit: amount,
                paymentsId: payment._id,
                status: matchingCurrency.spend_amount > 0 ? 'processing' : 'active',
            },
            { new: true }
        );
        console.log(`[setDepositBonus] Updated BonusHistories: ${existingBonusHistory._id}`);
    } else {
        console.log(`[setDepositBonus] No existing BonusHistories, creating new for user ${payment.userId}, bonus ${bonus._id}`);
        // Создаём новую запись
        yield models_1.BonusHistories.create({
            bonusId: payment.bonusId,
            wager_amount: matchingCurrency.wager,
            userId: payment.userId,
            paymentsId: payment._id,
            amount: bonusAmount,
            isDeposit: amount,
            status: matchingCurrency.spend_amount > 0 ? 'processing' : 'active',
        });
        console.log(`[setDepositBonus] Created new BonusHistories for user ${payment.userId}, bonus ${bonus._id}`);
    }
    if (matchingCurrency.spend_amount <= 0) {
        console.log(`[setDepositBonus] Applying bonus to balance: ${bonusAmount}`);
        yield models_1.Balances.findByIdAndUpdate(balance._id, { $inc: { bonus: bonusAmount } });
        const en = bonus.lang.find((e) => e.lang === 'en') || bonus.lang[0];
        console.log(`[setDepositBonus] Creating notification for user ${payment.userId}: ${en.title}`);
        yield models_1.Notification.create({
            title: `New Bonus`,
            description: `You have got new bonus! (${en.title})  ${process.env.DOMAIN}/en/user/my-shares`,
            players: [String(payment.userId)],
            country: ['all'],
            auto: true,
        });
        console.log(`[setDepositBonus] Tracking bonus for user ${payment.userId}`);
        yield (0, tracking_1.trackBonus)(payment.userId, bonus);
        if (bonus.event.type !== 'casino') {
            console.log(`[setDepositBonus] Not a casino bonus, skipping free spins`);
            return;
        }
        if (!matchingCurrency.games.length) {
            console.log(`[setDepositBonus] No games specified for free spins`);
            return;
        }
        if (!matchingCurrency.free_spin) {
            console.log(`[setDepositBonus] No free spins configured for bonus ${bonus._id}`);
            return;
        }
        let free_spin = matchingCurrency.free_spin;
        if (matchingCurrency.free_spin_type === 'percentage') {
            free_spin = Math.round((amount / 100) * free_spin);
            if (matchingCurrency.free_spin_up_to_amt && free_spin > matchingCurrency.free_spin_up_to_amt) {
                free_spin = matchingCurrency.free_spin_up_to_amt;
            }
            console.log(`[setDepositBonus] Calculated free spins: ${free_spin}`);
        }
        console.log(`[setDepositBonus] Creating campaign for ${free_spin} free spins`);
        yield (0, timelesstech_1.createCampaign)(
            matchingCurrency.free_games,
            String(payment.userId),
            free_spin,
            new Date(bonus.to_date),
            en.title,
            matchingCurrency.max_bet_free_spin
        );
    } else {
        console.log(`[setDepositBonus] Bonus in processing state, spend_amount: ${matchingCurrency.spend_amount}`);
    }
});
exports.setDepositBonus = setDepositBonus;

const getPaymentsPeriod = (userId, day) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const date = Date.now() - day * 24 * 60 * 60 * 1000;
        const payments = yield models_1.Payments.find({
            status: 3,
            userId,
            createdAt: { $gte: new Date(date) },
        });
        if (!payments.length)
            return { deposit: 0, withdraw: 0 };
        let deposit = 0;
        let withdraw = 0;
        payments.forEach((row) => {
            if (row.ipn_type === 'deposit')
                // Use fiat_amount (LU) if available, otherwise actually_paid
                deposit += row.fiat_amount || row.actually_paid || 0;
            if (row.ipn_type === 'withdrawal')
                // Use fiat_amount (LU) if available, otherwise actually_paid
                withdraw += row.fiat_amount || row.actually_paid || 0;
        });
        return { deposit, withdraw };
    }
    catch (error) {
        console.error('Get Depost & Withdaw =>', error);
        return { deposit: 0, withdraw: 0 };
    }
});
exports.getPaymentsPeriod = getPaymentsPeriod;
// Get available crypto coins
const getAvailableCoins = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return res.json(utils_1.AVAILABLE_COINS);
    }
    catch (error) {
        console.error('Error getting coin remitter currencies =>', error);
        return res.status(500).json('Internal Server Error');
    }
});
exports.getAvailableCoins = getAvailableCoins;

const withdrawal = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { amount, currency, address } = req.body;
        const user = req === null || req === void 0 ? void 0 : req.user;
        if (!user)
            return res.status(402).json('User not found');
        
        // Validate required fields
        if (!amount || amount <= 0)
            return res.status(402).json('Invalid withdrawal amount');
        if (!currency)
            return res.status(402).json('Currency is required');
        if (!address)
            return res.status(402).json('Address is required');
        
        // Get LU currency
        const luCurrency = yield models_1.Currencies.findOne({ symbol: 'LU' });
        if (!luCurrency) {
            return res.status(500).json('System configuration error: LU currency not found');
        }
        
        // Get user's LU balance
        const balance = yield models_1.Balances.findOne({ 
            userId: user._id, 
            currency: luCurrency._id,
            status: true 
        });
        if (!balance)
            return res.status(402).json('Balance not found');
        
        // Validate currency (crypto to withdraw to)
        // currency parameter should be the currency id (number), not symbol
        const currencyId = typeof currency === 'number' ? currency : parseInt(currency, 10);
        if (isNaN(currencyId) || currencyId <= 0) {
            return res.status(402).json({ error: 'Invalid currency', message: 'Currency must be a valid numeric ID, not a symbol' });
        }
        const _currency = utils_1.AVAILABLE_COINS.find((row) => row.id === currencyId);
        console.log(_currency, 'currencyId', currencyId, currency);
        if (!_currency)
            return res.status(402).json({ error: 'Currency not found', message: `Currency with id ${currencyId} is not found or not withdrawable` });
        
        // Convert LU (USD) to crypto
        // amount is in LU, convert to requested crypto
        const rateResult = yield (0, fiatConverter_1.getFiatToCryptoRate)(_currency, 'USD', amount);
        if (!rateResult)
            return res.status(402).json('Failed to get exchange rate');
        
        // Convert LU amount to crypto amount
        // rateResult.crypto_amount = how much crypto you get for the LU amount
        const crypto_amount = (0, base_1.NumberFix)(rateResult.crypto_amount, 18);
        const lu_amount = (0, base_1.NumberFix)(amount, 2); // LU amount requested
        
        // Validate user has enough balance (check current balance including pending withdrawals)
        // Get total pending withdrawals for this user to calculate available balance
        const pendingWithdrawals = yield models_1.Payments.find({
            userId: user._id,
            ipn_type: 'withdrawal',
            status: { $in: [-2, 105] }, // pending or approved but not yet sent
        });
        const pendingTotal = pendingWithdrawals.reduce((sum, p) => sum + (p.fiat_amount || 0), 0);
        const availableBalance = balance.balance - pendingTotal;
        
        if (availableBalance < lu_amount)
            return res.status(402).json('Insufficient balance');
        
        // Create withdrawal request
        let createParams = {
            userId: user._id,
            balanceId: balance._id,
            currencyId: _currency.currencyId,
            amount: crypto_amount, // Crypto amount to send (converted from LU)
            fiat_amount: lu_amount, // LU amount to deduct from balance
            address: address,
            status: -2, // Pending status
            status_text: 'pending',
            ipn_type: 'withdrawal',
            // Only crypto withdrawals accepted
        };

        // Store additional request data
        const param = { ...req.body };
        delete param.amount;
        createParams.data = JSON.stringify(param);

        // Save withdrawal request to database
        const withdrawalRequest = yield models_1.Payments.create(createParams);

        // CRITICAL: Deduct balance immediately when withdrawal is pending
        // This prevents double-spending and ensures funds are locked
        yield (0, base_1.balanceUpdate)({
            req,
            balanceId: balance._id,
            amount: lu_amount * -1, // Deduct LU amount
            type: 'withdrawal-pending',
        });
        
        console.log(`Withdrawal request created: ${withdrawalRequest._id}, LU: ${lu_amount}, Crypto: ${crypto_amount} ${currency}. Balance deducted immediately.`);
        
        return res.json({
            success: true,
            message: 'Withdrawal request submitted successfully',
            withdrawalId: withdrawalRequest._id,
            luAmount: lu_amount,
            cryptoAmount: crypto_amount,
            currency: currency,
            status: 'pending'
        });
    }
    catch (error) {
        console.error('Error processing withdrawal:', error);
        return res.status(500).json('Internal server error');
    }
});
exports.withdrawal = withdrawal;

const calcUsetToCrypto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req === null || req === void 0 ? void 0 : req.user;
        if (!user) {
            return res.status(403).json('User not found!');
        }
        const { id, symbol, amount } = req.body; // amount is in LU, id is the currency identifier
        // Use id as primary identifier, fallback to symbol for backward compatibility
        let _currency = null;
        if (id) {
            _currency = utils_1.AVAILABLE_COINS.find((row) => row.id === id);
        } else if (symbol) {
            console.warn(`[calcUsetToCrypto] Using deprecated symbol '${symbol}' - should use id instead`);
            _currency = utils_1.AVAILABLE_COINS.find((row) => row.symbol === symbol);
        }
        if (!_currency)
            return res.status(403).json({ error: 'Currency not found', message: id ? `Currency with id ${id} not found` : `Currency with symbol ${symbol} not found` });
        
        // Always use LU (USD-equivalent) for conversion
        // Handle 'LU' as equivalent to 'USD' (1:1)
        const fiatSymbol = req.body.fiatSymbol || 'LU';
        const normalizedFiatSymbol = fiatSymbol.toUpperCase() === 'LU' ? 'USD' : fiatSymbol.toUpperCase();
        const result = yield (0, fiatConverter_1.getFiatToCryptoRate)(_currency, normalizedFiatSymbol, amount);
        if (!result)
            return res.status(403).json('Fiat rate api error');
        return res.json(result);
    }
    catch (error) {
        console.error('Error checking payment status:', error);
        return res.status(500).json({ error: 'Internal Server Error', message: error });
    }
});
exports.calcUsetToCrypto = calcUsetToCrypto;
const confirmSmartContractPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req === null || req === void 0 ? void 0 : req.user;
        if (!user) {
            return res.status(403).json('User not found!');
        }
        const { id, symbol, amount, fiatAmount, transactionHash, contractAddress, from, bonusId } = req.body;
        // Validate required fields - use id as primary identifier
        // amount = crypto amount, fiatAmount = LU amount
        if (!id || !amount || !fiatAmount || !transactionHash || !contractAddress || !from) {
            return res.status(400).json({ error: 'Missing required fields', message: 'id, amount (crypto), fiatAmount (LU), transactionHash, contractAddress, and from are required' });
        }
        // Find currency by id (unique identifier)
        const _currency = utils_1.AVAILABLE_COINS.find((row) => row.id === id);
        if (!_currency) {
            console.error(`[confirmSmartContractPayment] Currency with id ${id} not found in AVAILABLE_COINS`);
            return res.status(403).json({ error: 'Currency not found', message: `Currency with id ${id} is not available` });
        }
        // Get currency from database by id
        const currency = yield models_1.Currencies.findOne({ id: id });
        if (!currency) {
            console.error(`[confirmSmartContractPayment] Currency with id ${id} not found in database`);
            return res.status(403).json({ error: 'Currency not found', message: `Currency with id ${id} not found in database` });
        }
        console.log(`[confirmSmartContractPayment] Found currency: id=${id}, name=${currency.name}, symbol=${currency.symbol}, network=${currency.network || 'N/A'}`);
        // Check if payment already exists
        const existingPayment = yield models_1.Payments.findOne({ txn_id: transactionHash });
        if (existingPayment) {
            // Return existing payment if already confirmed
            if (existingPayment.status === 100) {
                return res.json({ payment: existingPayment });
            }
        }
        // Verify transaction on blockchain
        let web3;
        try {
            // Use currency's RPC URL if available, otherwise use Ethereum Web3
            if (_currency.rpcUrl) {
                const Web3 = require('web3');
                web3 = new Web3(_currency.rpcUrl);
            }
            else {
                web3 = ethereum_1.EthereumWeb3;
            }
            // Get transaction receipt
            const receipt = yield web3.eth.getTransactionReceipt(transactionHash);
            if (!receipt) {
                return res.status(400).json('Transaction receipt not found');
            }
            // Check transaction status (can be boolean true/false or hex string '0x1'/'0x0')
            const isSuccess = receipt.status === true || receipt.status === '0x1' || receipt.status === 1;
            if (!isSuccess) {
                return res.status(400).json('Transaction failed');
            }
            // Get transaction details
            const tx = yield web3.eth.getTransaction(transactionHash);
            if (!tx) {
                return res.status(400).json('Transaction not found');
            }
            // Verify transaction details
            if (tx.to && tx.to.toLowerCase() !== contractAddress.toLowerCase()) {
                return res.status(400).json('Invalid contract address');
            }
            if (tx.from && tx.from.toLowerCase() !== from.toLowerCase()) {
                return res.status(400).json('Invalid sender address');
            }
        }
        catch (error) {
            console.error('Error verifying transaction:', error);
            return res.status(500).json({ error: 'Failed to verify transaction', message: error.message });
        }
        // Get LU currency
        const luCurrency = yield models_1.Currencies.findOne({ symbol: 'LU' });
        if (!luCurrency) {
            return res.status(500).json('System configuration error: LU currency not found');
        }
        
        // Get user's LU balance
        let balance = yield models_1.Balances.findOne({ 
            userId: user._id, 
            currency: luCurrency._id,
            status: true 
        });
        if (!balance) {
            // Create LU balance if doesn't exist
            balance = yield models_1.Balances.create({
                userId: user._id,
                currency: luCurrency._id,
                balance: 0,
                bonus: 0,
                status: true,
            });
        }
        
        // amount from request is the crypto amount (e.g., 0.1 BNB, 100 USDT)
        // fiatAmount from request is the LU amount (e.g., 10 LU)
        const cryptoAmount = (0, base_1.NumberFix)(amount, currency.decimals || 18); // Crypto amount with proper decimals
        const luAmount = (0, base_1.NumberFix)(fiatAmount, 2); // LU amount from request (2 decimals)
        
        // Create or update payment record
        const payment = yield models_1.Payments.findOneAndUpdate({ txn_id: transactionHash }, {
            userId: user._id,
            balanceId: balance._id,
            currencyId: currency._id,
            currency: currency.symbol,
            amount: cryptoAmount, // Crypto amount (e.g., 0.1 ETH)
            actually_paid: cryptoAmount,
            fiat_amount: luAmount, // LU amount (e.g., 0.1 LU)
            address: contractAddress,
            status: 100,
            status_text: 'confirmed',
            method: 0,
            ipn_type: 'deposit',
            txn_id: transactionHash,
            bonusId: bonusId || null,
            data: JSON.stringify({
                transactionHash,
                contractAddress,
                from,
                symbol,
            }),
        }, { upsert: true, new: true });
        
        // Update balance with LU amount
        yield (0, base_1.balanceUpdate)({
            req,
            balanceId: balance._id,
            amount: luAmount,
            type: 'deposit-smart-contract',
        });
        
        // Process deposit bonus if applicable
        if (payment.bonusId) {
            payment.fiat_amount = luAmount;
            payment.balanceId = balance._id;
            yield setDepositBonus(payment, luAmount);
        }
        
        // Handle affiliate postback
        if (user.affiliate) {
            try {
                yield (0, own_affiliate_1.depositPostBack)(
                    user._id,
                    user.username,
                    transactionHash,
                    cryptoAmount,
                    currency.symbol
                );
                console.log('[depositPostBack] Smart contract postback sent successfully');
            }
            catch (error) {
                console.error('[depositPostBack] Error in smart contract callback:', error);
            }
        }
        return res.json({ payment });
    }
    catch (error) {
        console.error('Error confirming smart contract payment:', error);
        return res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
});
exports.confirmSmartContractPayment = confirmSmartContractPayment;
/**
 * Automatically checks for new Solana deposits for a user's deposit address.
 * Scans recent transactions and automatically confirms any new deposits.
 */
const checkSolanaDeposits = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        // More lenient check - checkUser middleware should have already validated
        if (!user) {
            console.error('[checkSolanaDeposits] No user in request - middleware should have caught this');
            return res.status(401).json({ error: 'Unauthorized', message: 'User not authenticated' });
        }
        const userId = user._id || user.id;
        if (!userId) {
            console.error('[checkSolanaDeposits] User object missing _id field:', user);
            return res.status(401).json({ error: 'Unauthorized', message: 'Invalid user data' });
        }
        
        // Get user's deposit address
        const userDepositAddress = yield models_1.DepositAddresses.findOne({
            userId: (0, base_1.ObjectId)(userId),
            blockchain: 'solana'
        });
        
        if (!userDepositAddress) {
            return res.json({ 
                message: 'No deposit address found. Address will be created on first deposit.',
                depositsFound: 0,
                depositsConfirmed: []
            });
        }
        
        const depositAddress = userDepositAddress.address;
        console.log(`[checkSolanaDeposits] Checking deposits for address: ${depositAddress}, userId: ${userId}`);
        
        // Get recent transaction signatures for this address (last 50 transactions)
        let signatures = [];
        try {
            signatures = yield (0, solana_1.getSignaturesForAddress)(depositAddress, 50);
        } catch (sigError) {
            console.error(`[checkSolanaDeposits] Error getting signatures:`, sigError);
            // Return success with empty results instead of failing
            return res.json({
                message: 'Error fetching transaction signatures',
                depositsFound: 0,
                depositsConfirmed: [],
                error: sigError.message
            });
        }
        
        if (!signatures || signatures.length === 0) {
            return res.json({
                message: 'No recent transactions found',
                depositsFound: 0,
                depositsConfirmed: []
            });
        }
        
        // Get all Solana currencies
        const solanaCurrencies = yield models_1.Currencies.find({ blockchain: 'solana' });
        if (!solanaCurrencies || solanaCurrencies.length === 0) {
            return res.status(400).json({ 
                error: 'No Solana currencies configured',
                message: 'No Solana currencies found in database' 
            });
        }
        
        const confirmedDeposits = [];
        const errors = [];
        
        // Check each transaction signature
        for (const signature of signatures) {
            try {
                // Skip if already processed
                const existingPayment = yield models_1.Payments.findOne({ txn_id: signature });
                if (existingPayment && existingPayment.status === 100) {
                    continue; // Already confirmed, skip
                }
                
                // Try to confirm deposit for each Solana currency
                // We'll call depositSolana for each currency to let it handle the validation
                for (const currency of solanaCurrencies) {
                    try {
                        // Create a mock request to call depositSolana
                        const mockReq = {
                            user: user,
                            body: {
                                currencyId: currency._id.toString(),
                                txn_id: signature
                            }
                        };
                        
                        // Create a mock response to capture the result
                        let depositResult = null;
                        let depositError = null;
                        let statusCode = 200;
                        
                        const mockRes = {
                            status: (code) => {
                                statusCode = code;
                                return {
                                    json: (data) => {
                                        depositError = data;
                                    }
                                };
                            },
                            json: (data) => {
                                depositResult = data;
                            }
                        };
                        
                        // Call depositSolana - it will validate and process the deposit
                        // Wrap in try-catch to handle any thrown errors
                        try {
                            // Reset result/error tracking for each call
                            depositResult = null;
                            depositError = null;
                            statusCode = 200;
                            
                            yield depositSolana(mockReq, mockRes);
                            
                            if (depositResult && depositResult.payment) {
                                confirmedDeposits.push({
                                    signature: signature,
                                    currency: currency.symbol,
                                    payment: depositResult.payment,
                                    status: 'confirmed'
                                });
                                // Only process one currency per transaction
                                break;
                            } else if (depositError) {
                                // If it's "already confirmed", that's fine - skip
                                if (depositError.message && (
                                    depositError.message.includes('already confirmed') ||
                                    depositError.message.includes('already processed') ||
                                    depositError.message.includes('Transaction already confirmed')
                                )) {
                                    // Skip - already processed
                                    break; // Transaction already processed, no need to check other currencies
                                } else if (statusCode === 400 && depositError.message && (
                                    depositError.message.includes('Invalid recipient') ||
                                    depositError.message.includes('does not match') ||
                                    depositError.message.includes('recipient')
                                )) {
                                    // This transaction doesn't match this currency, try next currency
                                    continue;
                                } else if (statusCode === 401) {
                                    // Auth error - this shouldn't happen but if it does, skip this transaction
                                    console.error(`[checkSolanaDeposits] Unexpected 401 from depositSolana for ${currency.symbol}/${signature}`);
                                    break; // Don't try other currencies for this transaction
                                } else {
                                    // Other error - log but continue
                                    errors.push({ 
                                        signature, 
                                        currency: currency.symbol, 
                                        error: depositError.message || depositError.error 
                                    });
                                }
                            }
                        } catch (depositCallError) {
                            // If depositSolana throws an error (not just returns error status), catch it
                            console.error(`[checkSolanaDeposits] depositSolana threw error for ${currency.symbol}/${signature}:`, depositCallError);
                            // If it's an auth error, skip this transaction entirely
                            if (depositCallError.message && depositCallError.message.includes('Unauthorized')) {
                                console.error(`[checkSolanaDeposits] Auth error detected, skipping transaction ${signature}`);
                                break; // Don't try other currencies
                            }
                            // Continue to next currency - don't fail the entire check
                            continue;
                        }
                    }
                    catch (currencyError) {
                        // If error is about recipient mismatch, try next currency
                        if (currencyError.message && currencyError.message.includes('recipient')) {
                            continue;
                        }
                        console.error(`[checkSolanaDeposits] Error processing currency ${currency.symbol} for signature ${signature}:`, currencyError);
                        errors.push({ signature, currency: currency.symbol, error: currencyError.message });
                    }
                }
            }
            catch (sigError) {
                console.error(`[checkSolanaDeposits] Error processing signature ${signature}:`, sigError);
                errors.push({ signature, error: sigError.message });
            }
        }
        
        return res.json({
            message: `Checked ${signatures.length} transactions. Found ${confirmedDeposits.length} new deposits.`,
            depositsFound: confirmedDeposits.length,
            depositsConfirmed: confirmedDeposits,
            errors: errors.length > 0 ? errors.slice(0, 10) : undefined // Limit errors to first 10
        });
    }
    catch (error) {
        console.error('[checkSolanaDeposits] Error checking deposits:', error);
        console.error('[checkSolanaDeposits] Error stack:', error.stack);
        // CRITICAL: Always return 200 (not 401 or 500) to prevent logout
        // Return success with error details so it doesn't trigger logout
        return res.status(200).json({ 
            error: 'Error checking deposits', 
            message: error.message || 'Failed to check deposits. Please try again.',
            depositsFound: 0,
            depositsConfirmed: []
        });
    }
});
exports.checkSolanaDeposits = checkSolanaDeposits;
const getSolanaDepositAddress = (req, res, retryCount = 0) => __awaiter(void 0, void 0, void 0, function* () {
    const MAX_RETRIES = 3;
    try {
        const user = req.user;
        if (!user || !user._id) {
            return res.status(401).json({ error: 'Unauthorized', message: 'User not authenticated' });
        }
        const userId = user._id;
        const blockchain = 'solana';
        // Check if user already has a deposit address
        let depositAddress = yield models_1.DepositAddresses.findOne({
            userId: (0, base_1.ObjectId)(userId),
            blockchain: blockchain
        });
        if (depositAddress) {
            // Return existing address
            return res.json({
                blockchain: depositAddress.blockchain,
                address: depositAddress.address,
                index: depositAddress.index
            });
        }
        // User doesn't have an address yet - allocate a new index atomically
        // Use findOneAndUpdate with $inc to atomically increment the counter
        const counterName = `solana_deposit_index`;
        let counter = yield models_1.Counters.findOneAndUpdate(
            { name: counterName },
            { $inc: { value: 1 } },
            { upsert: true, new: true }
        );
        if (!counter) {
            // If counter doesn't exist, create it starting at 0, then increment
            counter = yield models_1.Counters.create({ name: counterName, value: 0 });
            counter = yield models_1.Counters.findOneAndUpdate(
                { name: counterName },
                { $inc: { value: 1 } },
                { new: true }
            );
        }
        const index = counter.value;
        // Derive the address for this index
        let derivedAddress;
        try {
            const derived = yield (0, solanaHD_1.deriveSolanaAddress)(index);
            derivedAddress = derived.address;
        }
        catch (derivationError) {
            console.error('[getSolanaDepositAddress] HD derivation error:', derivationError);
            // Rollback counter increment if derivation fails
            yield models_1.Counters.findOneAndUpdate(
                { name: counterName },
                { $inc: { value: -1 } }
            );
            if (derivationError.message.includes('SOLANA_DEPOSIT_MNEMONIC') || derivationError.message.includes('SOLANA_MASTER_SEED')) {
                return res.status(500).json({
                    error: 'Configuration Error',
                    message: 'Solana deposit mnemonic not configured. Please set SOLANA_DEPOSIT_MNEMONIC or SOLANA_MASTER_SEED environment variable.'
                });
            }
            return res.status(500).json({
                error: 'Derivation Error',
                message: 'Failed to derive Solana address: ' + derivationError.message
            });
        }
        // Try to create the deposit address record
        // Use try-catch to handle race condition if two requests happen simultaneously
        try {
            depositAddress = yield models_1.DepositAddresses.create({
                userId: (0, base_1.ObjectId)(userId),
                blockchain: blockchain,
                index: index,
                address: derivedAddress
            });
        }
        catch (createError) {
            // Handle duplicate key error (race condition)
            if (createError.code === 11000) {
                // Check if it's a user+blockchain duplicate (another request created it for this user)
                if (createError.keyPattern && createError.keyPattern.userId && createError.keyPattern.blockchain) {
                    // Another request already created the address for this user
                    // Fetch the existing one
                    depositAddress = yield models_1.DepositAddresses.findOne({
                        userId: (0, base_1.ObjectId)(userId),
                        blockchain: blockchain
                    });
                    if (depositAddress) {
                        return res.json({
                            blockchain: depositAddress.blockchain,
                            address: depositAddress.address,
                            index: depositAddress.index
                        });
                    }
                }
                // If it's an index collision (different user got same index), we need to retry
                // This should be extremely rare, but handle it
                if (createError.keyPattern && createError.keyPattern.index && retryCount < MAX_RETRIES) {
                    console.error(`[getSolanaDepositAddress] Index collision detected (attempt ${retryCount + 1}/${MAX_RETRIES}), retrying...`);
                    // Recursively retry with incremented retry count
                    return yield getSolanaDepositAddress(req, res, retryCount + 1);
                }
            }
            // If we've exhausted retries or it's a different error, throw it
            throw createError;
        }
        return res.json({
            blockchain: depositAddress.blockchain,
            address: depositAddress.address,
            index: depositAddress.index
        });
    }
    catch (error) {
        console.error('[getSolanaDepositAddress] Error:', error);
        return res.status(500).json({
            error: 'Internal Server Error',
            message: error.message || 'Failed to get Solana deposit address'
        });
    }
});
exports.getSolanaDepositAddress = getSolanaDepositAddress;
/**
 * Gets or creates a TRON deposit address for the authenticated user.
 * Uses HD wallet derivation with atomic index allocation to ensure thread-safety.
 * 
 * @param {Request} req - Express request object (must have req.user from auth middleware)
 * @param {Response} res - Express response object
 * @param {number} retryCount - Internal retry counter for handling index collisions
 * @returns {Promise<void>} JSON response with blockchain, address, and index
 */
const getTronDepositAddress = (req, res, retryCount = 0) => __awaiter(void 0, void 0, void 0, function* () {
    const MAX_RETRIES = 3;
    try {
        const user = req.user;
        if (!user || !user._id) {
            return res.status(401).json({ error: 'Unauthorized', message: 'User not authenticated' });
        }
        const userId = user._id;
        const blockchain = 'tron';
        // Check if user already has a deposit address
        let depositAddress = yield models_1.DepositAddresses.findOne({
            userId: (0, base_1.ObjectId)(userId),
            blockchain: blockchain
        });
        if (depositAddress) {
            // Return existing address
            return res.json({
                blockchain: depositAddress.blockchain,
                address: depositAddress.address,
                index: depositAddress.index
            });
        }
        // User doesn't have an address yet - allocate a new index atomically
        // Use findOneAndUpdate with $inc to atomically increment the counter
        const counterName = `tron_deposit_index`;
        let counter = yield models_1.Counters.findOneAndUpdate(
            { name: counterName },
            { $inc: { value: 1 } },
            { upsert: true, new: true }
        );
        if (!counter) {
            // If counter doesn't exist, create it starting at 0, then increment
            counter = yield models_1.Counters.create({ name: counterName, value: 0 });
            counter = yield models_1.Counters.findOneAndUpdate(
                { name: counterName },
                { $inc: { value: 1 } },
                { new: true }
            );
        }
        const index = counter.value;
        // Derive the address for this index
        let derivedAddress;
        try {
            const derived = yield (0, tronHD_1.deriveTronAddress)(index);
            derivedAddress = derived.address;
        }
        catch (derivationError) {
            console.error('[getTronDepositAddress] HD derivation error:', derivationError);
            // Rollback counter increment if derivation fails
            yield models_1.Counters.findOneAndUpdate(
                { name: counterName },
                { $inc: { value: -1 } }
            );
            if (derivationError.message.includes('TRON_DEPOSIT_MNEMONIC')) {
                return res.status(500).json({
                    error: 'Configuration Error',
                    message: 'TRON deposit mnemonic not configured. Please set TRON_DEPOSIT_MNEMONIC environment variable.'
                });
            }
            return res.status(500).json({
                error: 'Derivation Error',
                message: 'Failed to derive TRON address: ' + derivationError.message
            });
        }
        // Try to create the deposit address record
        // Use try-catch to handle race condition if two requests happen simultaneously
        try {
            depositAddress = yield models_1.DepositAddresses.create({
                userId: (0, base_1.ObjectId)(userId),
                blockchain: blockchain,
                index: index,
                address: derivedAddress
            });
        }
        catch (createError) {
            // Handle duplicate key error (race condition)
            if (createError.code === 11000) {
                // Check if it's a user+blockchain duplicate (another request created it for this user)
                if (createError.keyPattern && createError.keyPattern.userId && createError.keyPattern.blockchain) {
                    // Another request already created the address for this user
                    // Fetch the existing one
                    depositAddress = yield models_1.DepositAddresses.findOne({
                        userId: (0, base_1.ObjectId)(userId),
                        blockchain: blockchain
                    });
                    if (depositAddress) {
                        return res.json({
                            blockchain: depositAddress.blockchain,
                            address: depositAddress.address,
                            index: depositAddress.index
                        });
                    }
                }
                // If it's an index collision (different user got same index), we need to retry
                // This should be extremely rare, but handle it
                if (createError.keyPattern && createError.keyPattern.index && retryCount < MAX_RETRIES) {
                    console.error(`[getTronDepositAddress] Index collision detected (attempt ${retryCount + 1}/${MAX_RETRIES}), retrying...`);
                    // Recursively retry with incremented retry count
                    return yield getTronDepositAddress(req, res, retryCount + 1);
                }
            }
            // If we've exhausted retries or it's a different error, throw it
            throw createError;
        }
        return res.json({
            blockchain: depositAddress.blockchain,
            address: depositAddress.address,
            index: depositAddress.index
        });
    }
    catch (error) {
        console.error('[getTronDepositAddress] Error:', error);
        return res.status(500).json({
            error: 'Internal Server Error',
            message: error.message || 'Failed to get TRON deposit address'
        });
    }
});
exports.getTronDepositAddress = getTronDepositAddress;
// Export Solana sweep controller
const solanaSweep_1 = require("./solanaSweep");
exports.sweepSolanaFunds = solanaSweep_1.sweepSolanaFunds;
exports.getSolanaSweeps = solanaSweep_1.getSolanaSweeps;
// Export Solana deposit addresses controller
const solanaDepositAddresses_1 = require("./solanaDepositAddresses");
exports.getSolanaDepositAddresses = solanaDepositAddresses_1.getSolanaDepositAddresses;
exports.generateAllSolanaAddresses = solanaDepositAddresses_1.generateAllSolanaAddresses;
// Export TRON deposit addresses controller
const tronDepositAddresses_1 = require("./tronDepositAddresses");
exports.getTronDepositAddresses = tronDepositAddresses_1.getTronDepositAddresses;
// Export TRON sweep controller
const tronSweep_1 = require("./tronSweep");
exports.sweepTronFunds = tronSweep_1.sweepTronFunds;
exports.getTronSweeps = tronSweep_1.getTronSweeps;