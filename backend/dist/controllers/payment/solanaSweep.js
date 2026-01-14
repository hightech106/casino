"use strict";
/**
 * Solana admin sweep controller.
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
exports.sweepSolanaFunds = void 0;
const models_1 = require("../../models");
const base_1 = require("../base");
const solanaHD_1 = require("../../utils/solanaHD");
const solana_1 = require("./solana");
/**
 * Admin endpoint to sweep funds from a user's Solana deposit address to treasury or custom address.
 * 
 * POST /api/v2/admin/solana/sweep
 * Body: {
 *   userId?: string,      // User ID (if provided, uses their deposit address)
 *   index?: number,        // Derivation index (if provided, derives address)
 *   mint?: string | null,  // Token mint address (null = SOL native)
 *   amountUi?: number,     // Amount in UI units (if omitted, sweeps max available)
 *   toAddress?: string     // Optional: Custom destination address (defaults to treasury)
 * }
 */
const sweepSolanaFunds = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const admin = req.user;
        if (!admin || !admin._id) {
            return res.status(401).json({ error: 'Unauthorized', message: 'Admin not authenticated' });
        }
        const { userId, index, mint, amountUi, toAddress } = req.body;
        // Validate input: must provide either userId or index
        if (!userId && (index === undefined || index === null)) {
            return res.status(400).json({
                error: 'Invalid request',
                message: 'Either userId or index must be provided'
            });
        }
        // Determine destination address: use provided toAddress or fall back to treasury
        let destinationAddress = toAddress;
        if (!destinationAddress) {
            // Get treasury address from env as fallback
            destinationAddress = process.env.SOLANA_TREASURY_ADDRESS;
            if (!destinationAddress) {
                console.error('[sweepSolanaFunds] SOLANA_TREASURY_ADDRESS not set and no toAddress provided');
                return res.status(500).json({
                    error: 'Configuration error',
                    message: 'Treasury address not configured and no destination address provided'
                });
            }
        }
        // Validate Solana address format (basic check)
        if (typeof destinationAddress !== 'string' || destinationAddress.length < 32 || destinationAddress.length > 44) {
            return res.status(400).json({
                error: 'Invalid request',
                message: 'Invalid destination address format'
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
                blockchain: 'solana'
            });
            if (!depositAddressDoc) {
                return res.status(404).json({
                    error: 'Not found',
                    message: `No Solana deposit address found for user ${userId}`
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
            const derived = yield (0, solanaHD_1.deriveSolanaAddress)(index);
            fromAddress = derived.address;
            // Optionally check if this address exists in DB
            depositAddressDoc = yield models_1.DepositAddresses.findOne({
                blockchain: 'solana',
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
        // Check if this sweep was already performed (idempotency)
        // We'll check after getting the signature, but log the attempt
        console.log(`[sweepSolanaFunds] Admin ${admin._id} initiating sweep from ${fromAddress} (index ${derivationIndex})`);
        // Determine amount to sweep
        let amountToSweep = amountUi;
        let decimals = 9; // Default for SOL
        let isNativeSOL = mint === null || mint === undefined || mint === '';
        if (isNativeSOL) {
            // SOL native transfer
            const balance = yield (0, solana_1.getAddressSOLBalance)(fromAddress);
            if (balance <= 0) {
                return res.status(400).json({
                    error: 'Insufficient balance',
                    message: `No SOL balance available at address ${fromAddress}`
                });
            }
            // Reserve SOL for transaction fees and rent-exempt minimum
            // Solana accounts need ~0.00089 SOL to stay rent-exempt
            // Transaction fees are typically ~0.000005 SOL
            // Reserve 0.001 SOL total (enough for rent + fees with buffer)
            const rentExemptMinimum = 0.00089; // Minimum balance to keep account rent-exempt
            const feeReserve = 0.0001; // Transaction fee buffer
            const totalReserve = rentExemptMinimum + feeReserve; // ~0.00099 SOL
            const availableBalance = Math.max(0, balance - totalReserve);
            if (amountUi === undefined || amountUi === null) {
                // Sweep max available
                amountToSweep = availableBalance;
            }
            else {
                // Sweep specified amount
                if (amountUi > availableBalance) {
                    return res.status(400).json({
                        error: 'Insufficient balance',
                        message: `Requested ${amountUi} SOL but only ${availableBalance} SOL available (after reserving ${totalReserve} SOL for rent-exempt minimum and transaction fees)`
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
        else {
            // SPL token transfer
            if (!mint || typeof mint !== 'string') {
                return res.status(400).json({
                    error: 'Invalid request',
                    message: 'mint address is required for SPL token sweeps'
                });
            }
            const tokenBalance = yield (0, solana_1.getAddressTokenBalance)(fromAddress, mint);
            if (tokenBalance.amount <= 0) {
                return res.status(400).json({
                    error: 'Insufficient balance',
                    message: `No token balance available at address ${fromAddress} for mint ${mint}`
                });
            }
            decimals = tokenBalance.decimals;
            if (amountUi === undefined || amountUi === null) {
                // Sweep max available
                amountToSweep = tokenBalance.amount;
            }
            else {
                // Sweep specified amount
                if (amountUi > tokenBalance.amount) {
                    return res.status(400).json({
                        error: 'Insufficient balance',
                        message: `Requested ${amountUi} tokens but only ${tokenBalance.amount} available`
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
        // Derive keypair for signing
        const sourceKeypair = yield (0, solanaHD_1.deriveSolanaKeypair)(derivationIndex);
        // Perform the sweep
        let signature;
        try {
            if (isNativeSOL) {
                signature = yield (0, solana_1.sweepSOL)(sourceKeypair, destinationAddress, amountToSweep);
            }
            else {
                signature = yield (0, solana_1.sweepSPLToken)(sourceKeypair, destinationAddress, mint, amountToSweep, decimals);
            }
        }
        catch (sweepError) {
            console.error(`[sweepSolanaFunds] Sweep transaction failed:`, sweepError);
            // Extract error message (sanitize to avoid exposing sensitive data)
            const errorMessage = sweepError.message || String(sweepError);
            const sanitizedMessage = errorMessage.replace(/mnemonic|seed|private.*key/gi, '[REDACTED]');
            // Create failed sweep record (without signature since transaction failed)
            try {
                const failedSweep = new models_1.SolanaSweeps({
                    adminId: admin._id,
                    userId: targetUserId || null,
                    addressId: depositAddressDoc ? depositAddressDoc._id : null,
                    index: derivationIndex,
                    fromAddress: fromAddress,
                    toAddress: destinationAddress,
                    mint: isNativeSOL ? null : mint,
                    amountUi: amountToSweep,
                    signature: `failed_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                    status: 'failed',
                    error: sanitizedMessage
                });
                yield failedSweep.save();
            }
            catch (saveError) {
                console.error('[sweepSolanaFunds] Failed to save failed sweep record:', saveError);
            }
            return res.status(500).json({
                error: 'Sweep failed',
                message: sanitizedMessage,
                fromAddress: fromAddress,
                toAddress: destinationAddress
            });
        }
        // Check for duplicate signature (idempotency)
        const existingSweep = yield models_1.SolanaSweeps.findOne({ signature: signature });
        if (existingSweep) {
            return res.json({
                success: true,
                message: 'Sweep already recorded',
                signature: existingSweep.signature,
                sweptAmountUi: existingSweep.amountUi,
                mint: existingSweep.mint,
                fromAddress: existingSweep.fromAddress,
                toAddress: existingSweep.toAddress,
                status: existingSweep.status
            });
        }
        // Create sweep record
        const sweepRecord = new models_1.SolanaSweeps({
            adminId: admin._id,
            userId: targetUserId || null,
            addressId: depositAddressDoc ? depositAddressDoc._id : null,
            index: derivationIndex,
            fromAddress: fromAddress,
            toAddress: destinationAddress,
            mint: isNativeSOL ? null : mint,
            amountUi: amountToSweep,
            signature: signature,
            status: 'confirmed'
        });
        yield sweepRecord.save();
        console.log(`[sweepSolanaFunds] Sweep successful: ${signature}, ${amountToSweep} ${isNativeSOL ? 'SOL' : 'tokens'} from ${fromAddress} to ${destinationAddress}`);
        return res.json({
            success: true,
            signature: signature,
            sweptAmountUi: amountToSweep,
            mint: isNativeSOL ? null : mint,
            fromAddress: fromAddress,
            toAddress: destinationAddress
        });
    }
    catch (error) {
        console.error('[sweepSolanaFunds] Error:', error);
        // Sanitize error message to avoid exposing mnemonic
        const errorMessage = error.message || String(error);
        const sanitizedMessage = errorMessage.replace(/mnemonic|seed|private.*key/gi, '[REDACTED]');
        return res.status(500).json({
            error: 'Internal server error',
            message: sanitizedMessage
        });
    }
});
exports.sweepSolanaFunds = sweepSolanaFunds;
/**
 * Admin endpoint to get sweep transaction history/logs.
 * 
 * GET /api/v2/admin/solana/sweeps
 * Query params:
 *   limit?: number (default: 50)
 *   page?: number (default: 1)
 *   userId?: string (filter by user ID)
 *   status?: string (filter by status: pending, confirmed, failed)
 */
const getSolanaSweeps = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const total = yield models_1.SolanaSweeps.countDocuments(query);
        // Get sweeps with pagination
        const sweeps = yield models_1.SolanaSweeps.find(query)
            .populate('adminId', 'username email')
            .populate('userId', 'username email')
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip((page - 1) * limit)
            .lean();
        return res.json({
            success: true,
            rows: sweeps,
            total: total,
            page: page,
            totalPages: Math.ceil(total / limit)
        });
    }
    catch (error) {
        console.error('[getSolanaSweeps] Error:', error);
        return res.status(500).json({
            error: 'Internal server error',
            message: error.message || String(error)
        });
    }
});
exports.getSolanaSweeps = getSolanaSweeps;

