"use strict";
/**
 * TRON admin sweep controller.
 * Handles sweeping funds from user deposit addresses to treasury wallet.
 */
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
exports.sweepTronFunds = void 0;
const models_1 = require("../../models");
const base_1 = require("../base");
const tronHD_1 = require("../../utils/tronHD");
// Note: tronweb needs to be installed: npm install tronweb
let TronWeb;
try {
    const tronwebModule = require("tronweb");
    TronWeb = tronwebModule.TronWeb || tronwebModule.default || tronwebModule;
}
catch (error) {
    console.error('[tronSweep] Missing dependency. Please install: npm install tronweb');
    throw new Error('tronweb package is required for TRON sweep operations. Please install it: npm install tronweb');
}
// Initialize TronWeb with configurable fullnode
const TRON_FULLNODE = process.env.TRON_FULLNODE || 'https://api.trongrid.io';
const TRON_API_KEY = process.env.TRON_API_KEY;
const TRON_TREASURY_ADDRESS = process.env.TRON_TREASURY_ADDRESS;
// TRX fee reserve (leave some TRX for transaction fees)
const TRX_FEE_RESERVE = parseFloat(process.env.TRON_FEE_RESERVE) || 2.0; // Default: reserve 2 TRX for fees
const tronWeb = new TronWeb({
    fullHost: TRON_FULLNODE,
    headers: TRON_API_KEY ? { "TRON-PRO-API-KEY": TRON_API_KEY } : undefined
});
/**
 * Get USDT and USDC contract addresses from currencies collection or env vars.
 */
const getTokenContracts = () => __awaiter(void 0, void 0, void 0, function* () {
    // Try env vars first
    let usdtContract = process.env.TRON_USDT_CONTRACT;
    let usdcContract = process.env.TRON_USDC_CONTRACT;
    // If not in env, fetch from currencies collection
    if (!usdtContract || !usdcContract) {
        const tronCurrencies = yield models_1.Currencies.find({
            blockchain: 'tron',
            symbol: { $in: ['USDT', 'USDC'] },
            status: true
        }).lean();
        for (const currency of tronCurrencies) {
            if (currency.symbol === 'USDT' && currency.contractAddress) {
                usdtContract = currency.contractAddress;
            }
            if (currency.symbol === 'USDC' && currency.contractAddress) {
                usdcContract = currency.contractAddress;
            }
        }
    }
    // Defaults if still not found (mainnet contracts)
    if (!usdtContract) {
        usdtContract = 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t'; // Mainnet USDT (TRC20)
    }
    if (!usdcContract) {
        usdcContract = 'TLZSucJRjnqBKwvQz6n5hd29gbS4P7u7w8'; // Mainnet USDC (TRC20)
    }
    return { usdtContract, usdcContract };
});
/**
 * Fetch TRX native balance for a given address.
 */
const getTRXBalance = (address) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const balanceSun = yield tronWeb.trx.getBalance(address);
        const balanceTrx = balanceSun ? parseFloat(balanceSun.toString()) / 1e6 : 0;
        return balanceTrx;
    }
    catch (error) {
        console.error(`[sweepTronFunds] Error fetching TRX balance for ${address}:`, error.message);
        throw error;
    }
});
/**
 * Fetch TRC20 token balance for a given address and contract.
 */
const getTRC20Balance = (address, contractAddress, decimals) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const contract = yield tronWeb.contract().at(contractAddress);
        const balanceResult = yield contract.balanceOf(address).call();
        const rawBalance = balanceResult ? balanceResult.toString() : '0';
        const balanceNum = parseFloat(rawBalance) || 0;
        const decimalsValue = decimals || 6;
        const balanceUi = balanceNum / Math.pow(10, decimalsValue);
        return balanceUi;
    }
    catch (error) {
        console.error(`[sweepTronFunds] Error fetching TRC20 balance for ${address} (contract ${contractAddress}):`, error.message);
        throw error;
    }
});
/**
 * Sweep TRX native tokens from source address to destination address.
 */
const sweepTRX = (fromPrivateKey, toAddress, amountTrx) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Set private key for signing
        tronWeb.setPrivateKey(fromPrivateKey);
        // Convert TRX to SUN (1 TRX = 1e6 SUN)
        const amountSun = Math.floor(amountTrx * 1e6);
        // Build transaction
        const transaction = yield tronWeb.transactionBuilder.sendTrx(toAddress, amountSun, tronWeb.address.fromPrivateKey(fromPrivateKey));
        // Sign transaction
        const signedTransaction = yield tronWeb.trx.sign(transaction, fromPrivateKey);
        // Broadcast transaction
        const result = yield tronWeb.trx.broadcast(signedTransaction);
        if (result.result === true && result.txid) {
            return result.txid;
        }
        else {
            throw new Error(`Transaction broadcast failed: ${result.message || 'Unknown error'}`);
        }
    }
    catch (error) {
        console.error('[sweepTRX] Error sweeping TRX:', error);
        throw error;
    }
});
/**
 * Sweep TRC20 tokens from source address to destination address.
 */
const sweepTRC20 = (fromPrivateKey, toAddress, contractAddress, amountUi, decimals) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Set private key for signing
        tronWeb.setPrivateKey(fromPrivateKey);
        const fromAddress = tronWeb.address.fromPrivateKey(fromPrivateKey);
        // Create contract instance
        const contract = yield tronWeb.contract().at(contractAddress);
        // Convert UI amount to raw amount (apply decimals)
        const decimalsValue = decimals || 6;
        const amountRaw = Math.floor(amountUi * Math.pow(10, decimalsValue));
        // Call transfer function
        const transaction = yield contract.transfer(toAddress, amountRaw).send({
            feeLimit: 100000000 // 100 TRX fee limit (in SUN)
        });
        // Transaction is already signed and broadcast by TronWeb
        if (transaction && transaction.txid) {
            return transaction.txid;
        }
        else {
            throw new Error('Transaction failed: no txid returned');
        }
    }
    catch (error) {
        console.error('[sweepTRC20] Error sweeping TRC20:', error);
        throw error;
    }
});
/**
 * Admin endpoint to sweep funds from a user's TRON deposit address to treasury.
 * 
 * POST /api/v2/payments/admin/tron/sweep
 * Body: {
 *   userId?: string,      // User ID (if provided, uses their deposit address)
 *   index?: number,        // Derivation index (if provided, derives address)
 *   symbol: "TRX" | "USDT" | "USDC",  // Required: which token to sweep
 *   amountUi?: number     // Amount in UI units (if omitted, sweeps max available)
 * }
 */
const sweepTronFunds = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const admin = req.user;
        if (!admin || !admin._id) {
            return res.status(401).json({ error: 'Unauthorized', message: 'Admin not authenticated' });
        }
        const { userId, index, symbol, amountUi } = req.body;
        // Validate symbol is required
        if (!symbol || !['TRX', 'USDT', 'USDC'].includes(symbol)) {
            return res.status(400).json({
                error: 'Invalid request',
                message: 'symbol is required and must be one of: TRX, USDT, USDC'
            });
        }
        // Validate input: must provide either userId or index
        if (!userId && (index === undefined || index === null)) {
            return res.status(400).json({
                error: 'Invalid request',
                message: 'Either userId or index must be provided'
            });
        }
        // Get treasury address from env (required)
        const treasuryAddress = TRON_TREASURY_ADDRESS;
        if (!treasuryAddress) {
            console.error('[sweepTronFunds] TRON_TREASURY_ADDRESS not set');
            return res.status(500).json({
                error: 'Configuration error',
                message: 'Treasury address not configured (TRON_TREASURY_ADDRESS environment variable required)'
            });
        }
        // Validate treasury address format
        if (!treasuryAddress.startsWith('T') || treasuryAddress.length !== 34) {
            return res.status(500).json({
                error: 'Configuration error',
                message: 'Invalid treasury address format'
            });
        }
        let depositAddressDoc = null;
        let derivationIndex = null;
        let fromAddress = null;
        let targetUserId = null;
        // Determine index and address
        if (userId) {
            // Load deposit address from DB
            depositAddressDoc = yield models_1.DepositAddresses.findOne({
                userId: (0, base_1.ObjectId)(userId),
                blockchain: 'tron'
            });
            if (!depositAddressDoc) {
                return res.status(404).json({
                    error: 'Not found',
                    message: `No TRON deposit address found for user ${userId}`
                });
            }
            derivationIndex = depositAddressDoc.index;
            fromAddress = depositAddressDoc.address;
            targetUserId = depositAddressDoc.userId;
        }
        else if (index !== undefined && index !== null) {
            // Use provided index
            derivationIndex = index;
            // Derive address from index
            const derived = yield (0, tronHD_1.deriveTronAddress)(index);
            fromAddress = derived.address;
            // Optionally check if this address exists in DB
            depositAddressDoc = yield models_1.DepositAddresses.findOne({
                blockchain: 'tron',
                index: index
            });
            if (depositAddressDoc) {
                targetUserId = depositAddressDoc.userId;
            }
        }
        if (!fromAddress || derivationIndex === null) {
            return res.status(500).json({
                error: 'Internal error',
                message: 'Failed to determine source address'
            });
        }
        console.log(`[sweepTronFunds] Admin ${admin._id} initiating sweep from ${fromAddress} (index ${derivationIndex}), symbol: ${symbol}`);
        // Derive private key for signing (NEVER expose to frontend)
        const fromPrivateKey = yield (0, tronHD_1.deriveTronPrivateKey)(derivationIndex);
        // Determine amount to sweep and contract address
        let amountToSweep = amountUi;
        let contractAddress = null;
        let decimals = 6; // Default for TRC20 tokens
        if (symbol === 'TRX') {
            // TRX native transfer
            const balance = yield getTRXBalance(fromAddress);
            if (balance <= 0) {
                return res.status(400).json({
                    error: 'Insufficient balance',
                    message: `No TRX balance available at address ${fromAddress}`
                });
            }
            // Reserve TRX for transaction fees
            const availableBalance = Math.max(0, balance - TRX_FEE_RESERVE);
            if (amountUi === undefined || amountUi === null) {
                // Sweep max available
                amountToSweep = availableBalance;
            }
            else {
                // Sweep specified amount
                if (amountUi > availableBalance) {
                    return res.status(400).json({
                        error: 'Insufficient balance',
                        message: `Requested ${amountUi} TRX but only ${availableBalance} TRX available (after reserving ${TRX_FEE_RESERVE} TRX for transaction fees)`
                    });
                }
                amountToSweep = amountUi;
            }
            if (amountToSweep <= 0) {
                return res.status(400).json({
                    error: 'Invalid amount',
                    message: `Amount to sweep must be greater than 0 (available: ${availableBalance} TRX after fee reserve)`
                });
            }
        }
        else {
            // TRC20 token transfer (USDT or USDC)
            const { usdtContract, usdcContract } = yield getTokenContracts();
            if (symbol === 'USDT') {
                contractAddress = usdtContract;
            }
            else if (symbol === 'USDC') {
                contractAddress = usdcContract;
            }
            if (!contractAddress) {
                return res.status(500).json({
                    error: 'Configuration error',
                    message: `Contract address not found for ${symbol}`
                });
            }
            // Check TRX balance for fees (TRC20 transfers require TRX for energy/bandwidth)
            const trxBalance = yield getTRXBalance(fromAddress);
            const MIN_TRX_FOR_TRC20 = 1.0;
            if (trxBalance < MIN_TRX_FOR_TRC20) {
                return res.status(400).json({
                    error: 'Insufficient energy/bandwidth',
                    message: `Address ${fromAddress} has insufficient TRX (${trxBalance.toFixed(6)} TRX) to pay for TRC20 transfer fees. Minimum ${MIN_TRX_FOR_TRC20} TRX required for energy/bandwidth. Please ensure the address has enough TRX to cover transaction fees.`
                });
            }
            // Get token balance
            const tokenBalance = yield getTRC20Balance(fromAddress, contractAddress, decimals);
            if (tokenBalance <= 0) {
                return res.status(400).json({
                    error: 'Insufficient balance',
                    message: `No ${symbol} balance available at address ${fromAddress}`
                });
            }
            if (amountUi === undefined || amountUi === null) {
                // Sweep max available
                amountToSweep = tokenBalance;
            }
            else {
                // Sweep specified amount
                if (amountUi > tokenBalance) {
                    return res.status(400).json({
                        error: 'Insufficient balance',
                        message: `Requested ${amountUi} ${symbol} but only ${tokenBalance} available`
                    });
                }
                amountToSweep = amountUi;
            }
            if (amountToSweep <= 0) {
                return res.status(400).json({
                    error: 'Invalid amount',
                    message: 'Amount to sweep must be greater than 0'
                });
            }
        }
        // Check idempotency: if same sweep request already exists (same userId/index/symbol/amountUi), return existing record
        // This prevents duplicate sweeps if the same request is made multiple times
        const idempotencyQuery = {
            userId: targetUserId || null,
            index: derivationIndex,
            symbol: symbol,
            fromAddress: fromAddress,
            toAddress: treasuryAddress,
            amountUi: amountToSweep,
            status: 'confirmed'
        };
        const existingSweep = yield models_1.TronSweeps.findOne(idempotencyQuery).sort({ createdAt: -1 });
        if (existingSweep) {
            console.log(`[sweepTronFunds] Idempotency check: Found existing sweep with same parameters, returning existing record: txid=${existingSweep.txid}`);
            return res.json({
                success: true,
                message: 'Sweep already recorded',
                txid: existingSweep.txid,
                sweptAmountUi: existingSweep.amountUi,
                symbol: existingSweep.symbol,
                fromAddress: existingSweep.fromAddress,
                toAddress: existingSweep.toAddress,
                status: existingSweep.status
            });
        }
        // Perform the sweep
        let txid;
        try {
            if (symbol === 'TRX') {
                txid = yield sweepTRX(fromPrivateKey, treasuryAddress, amountToSweep);
            }
            else {
                txid = yield sweepTRC20(fromPrivateKey, treasuryAddress, contractAddress, amountToSweep, decimals);
            }
        }
        catch (sweepError) {
            console.error(`[sweepTronFunds] Sweep transaction failed:`, sweepError);
            // Extract error message (sanitize to avoid exposing sensitive data)
            const errorMessage = sweepError.message || String(sweepError);
            let sanitizedMessage = errorMessage.replace(/mnemonic|seed|private.*key/gi, '[REDACTED]');
            // Improve error messages for common TRON issues
            if (errorMessage.includes('insufficient') || errorMessage.includes('balance')) {
                sanitizedMessage = `Insufficient balance: ${sanitizedMessage}`;
            }
            else if (errorMessage.includes('energy') || errorMessage.includes('bandwidth') || errorMessage.includes('resource')) {
                sanitizedMessage = `Insufficient energy/bandwidth: Address needs TRX to pay for transaction fees. ${sanitizedMessage}`;
            }
            else if (errorMessage.includes('address') || errorMessage.includes('invalid')) {
                sanitizedMessage = `Invalid address: ${sanitizedMessage}`;
            }
            else if (errorMessage.includes('txid') || errorMessage.includes('transaction')) {
                sanitizedMessage = `Transaction error: ${sanitizedMessage}`;
            }
            // Create failed sweep record
            try {
                const failedSweep = new models_1.TronSweeps({
                    adminId: admin._id,
                    userId: targetUserId || null,
                    addressId: depositAddressDoc ? depositAddressDoc._id : null,
                    index: derivationIndex,
                    fromAddress: fromAddress,
                    toAddress: treasuryAddress,
                    symbol: symbol,
                    contractAddress: contractAddress,
                    amountUi: amountToSweep,
                    txid: `failed_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                    status: 'failed',
                    error: sanitizedMessage
                });
                yield failedSweep.save();
            }
            catch (saveError) {
                console.error('[sweepTronFunds] Failed to save failed sweep record:', saveError);
            }
            return res.status(500).json({
                error: 'Sweep failed',
                message: sanitizedMessage,
                fromAddress: fromAddress,
                toAddress: treasuryAddress
            });
        }
        // Check for duplicate txid (additional idempotency check after transaction)
        const existingSweepByTxid = yield models_1.TronSweeps.findOne({ txid: txid });
        if (existingSweepByTxid) {
            console.log(`[sweepTronFunds] Duplicate txid detected: ${txid}, returning existing record`);
            return res.json({
                success: true,
                message: 'Sweep already recorded',
                txid: existingSweepByTxid.txid,
                sweptAmountUi: existingSweepByTxid.amountUi,
                symbol: existingSweepByTxid.symbol,
                fromAddress: existingSweepByTxid.fromAddress,
                toAddress: existingSweepByTxid.toAddress,
                status: existingSweepByTxid.status
            });
        }
        // Create sweep record
        const sweepRecord = new models_1.TronSweeps({
            adminId: admin._id,
            userId: targetUserId || null,
            addressId: depositAddressDoc ? depositAddressDoc._id : null,
            index: derivationIndex,
            fromAddress: fromAddress,
            toAddress: treasuryAddress,
            symbol: symbol,
            contractAddress: contractAddress,
            amountUi: amountToSweep,
            txid: txid,
            status: 'confirmed'
        });
        yield sweepRecord.save();
        console.log(`[sweepTronFunds] Sweep successful: ${txid}, ${amountToSweep} ${symbol} from ${fromAddress} to ${treasuryAddress}`);
        return res.json({
            success: true,
            txid: txid,
            fromAddress: fromAddress,
            toAddress: treasuryAddress,
            symbol: symbol,
            sweptAmountUi: amountToSweep
        });
    }
    catch (error) {
        console.error('[sweepTronFunds] Error:', error);
        // Sanitize error message to avoid exposing mnemonic
        const errorMessage = error.message || String(error);
        const sanitizedMessage = errorMessage.replace(/mnemonic|seed|private.*key/gi, '[REDACTED]');
        return res.status(500).json({
            error: 'Internal server error',
            message: sanitizedMessage
        });
    }
});
exports.sweepTronFunds = sweepTronFunds;
/**
 * Admin endpoint to get TRON sweep transaction history/logs.
 * 
 * GET /api/v2/payments/admin/tron/sweeps
 * Query params:
 *   limit?: number (default: 50)
 *   page?: number (default: 1)
 *   userId?: string (filter by user ID)
 *   status?: string (filter by status: pending, confirmed, failed)
 */
const getTronSweeps = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const admin = req.user;
        if (!admin || !admin._id) {
            return res.status(401).json({ error: 'Unauthorized', message: 'Admin not authenticated' });
        }
        const limit = parseInt(req.query.limit) || 50;
        const page = parseInt(req.query.page) || 1;
        const userId = req.query.userId;
        const status = req.query.status;
        // Build query
        const query = {};
        if (userId) {
            query.userId = (0, base_1.ObjectId)(userId);
        }
        if (status && ['pending', 'confirmed', 'failed'].includes(status)) {
            query.status = status;
        }
        // Get total count
        const total = yield models_1.TronSweeps.countDocuments(query);
        // Get sweeps with pagination
        const sweeps = yield models_1.TronSweeps.find(query)
            .populate('adminId', 'username email')
            .populate('userId', 'username email')
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip((page - 1) * limit)
            .lean();
        // Format response
        const rows = sweeps.map((sweep) => ({
            _id: sweep._id,
            adminId: sweep.adminId,
            userId: sweep.userId,
            index: sweep.index,
            fromAddress: sweep.fromAddress,
            toAddress: sweep.toAddress,
            symbol: sweep.symbol,
            contractAddress: sweep.contractAddress,
            amountUi: sweep.amountUi,
            txid: sweep.txid,
            status: sweep.status,
            error: sweep.error,
            createdAt: sweep.createdAt,
            updatedAt: sweep.updatedAt
        }));
        return res.json({
            success: true,
            rows: rows,
            total: total,
            page: page,
            limit: limit,
            totalPages: Math.ceil(total / limit)
        });
    }
    catch (error) {
        console.error('[getTronSweeps] Error:', error);
        return res.status(500).json({
            error: 'Internal server error',
            message: error.message || String(error)
        });
    }
});
exports.getTronSweeps = getTronSweeps;
