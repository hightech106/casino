"use strict";
/**
 * Admin controller for viewing Solana deposit addresses and their balances.
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
exports.generateAllSolanaAddresses = exports.getSolanaDepositAddresses = void 0;
const models_1 = require("../../models");
const base_1 = require("../base");
const solana_1 = require("./solana");
const solanaHD_1 = require("../../utils/solanaHD");
const p_limit_1 = require("p-limit");
// Simple in-memory cache with TTL (10 seconds - shorter for more real-time data)
const balanceCache = new Map();
const CACHE_TTL = 10 * 1000; // 10 seconds
const getCachedBalance = (address) => {
    const cached = balanceCache.get(address);
    if (cached && (Date.now() - cached.timestamp) < CACHE_TTL) {
        return cached.balances;
    }
    return null;
};
const setCachedBalance = (address, balances) => {
    balanceCache.set(address, {
        balances: balances,
        timestamp: Date.now()
    });
};
// Function to clear cache for an address or all addresses
const clearCache = (address) => {
    if (address) {
        balanceCache.delete(address);
    } else {
        balanceCache.clear();
    }
};
/**
 * Get USDC and USDT mint addresses from env or currencies collection.
 */
const getTokenMints = () => __awaiter(void 0, void 0, void 0, function* () {
    // Try env vars first
    let usdcMint = process.env.SOLANA_USDC_MINT;
    let usdtMint = process.env.SOLANA_USDT_MINT;
    // If not in env, fetch from currencies collection
    if (!usdcMint || !usdtMint) {
        const solanaCurrencies = yield models_1.Currencies.find({
            blockchain: 'solana',
            status: true
        }).lean();
        for (const currency of solanaCurrencies) {
            if (currency.symbol === 'USDC' && currency.contractAddress) {
                usdcMint = currency.contractAddress;
            }
            if (currency.symbol === 'USDT' && currency.contractAddress) {
                usdtMint = currency.contractAddress;
            }
        }
    }
    // Defaults if still not found
    if (!usdcMint) {
        usdcMint = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'; // Mainnet USDC
    }
    if (!usdtMint) {
        usdtMint = 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB'; // Mainnet USDT
    }
    return { usdcMint, usdtMint };
});
/**
 * Admin endpoint to list Solana deposit addresses with balances.
 * 
 * GET /api/v2/admin/solana/deposit-addresses
 * Query params:
 *   - limit: number (default: 50)
 *   - page: number (default: 1)
 *   - search: string (optional: userId or address)
 */
const getSolanaDepositAddresses = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const admin = req.user;
        if (!admin || !admin._id) {
            return res.status(401).json({ error: 'Unauthorized', message: 'Admin not authenticated' });
        }
        // Parse query parameters
        const limit = parseInt(req.query.limit) || 50;
        const page = parseInt(req.query.page) || 1;
        const search = req.query.search ? String(req.query.search).trim() : '';
        const refresh = req.query.refresh === 'true'; // Force refresh balances
        const skip = (page - 1) * limit;
        
        // Clear cache if refresh is requested
        if (refresh) {
            clearCache();
        }
        // Build query
        let query = {
            blockchain: 'solana'
        };
        if (search) {
            // Search by userId (ObjectId) or address
            const isObjectId = /^[0-9a-fA-F]{24}$/.test(search);
            if (isObjectId) {
                query.userId = (0, base_1.ObjectId)(search);
            }
            else {
                // Search by address (case-insensitive partial match)
                query.address = { $regex: search, $options: 'i' };
            }
        }
        
        // Get total count
        const total = yield models_1.DepositAddresses.countDocuments(query);
        console.log(`[getSolanaDepositAddresses] Found ${total} total Solana deposit addresses in database`);
        
        // Get deposit addresses with pagination
        const depositAddresses = yield models_1.DepositAddresses.find(query)
            .populate('userId', 'username email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();
        
        console.log(`[getSolanaDepositAddresses] Returning ${depositAddresses.length} addresses for page ${page}`);
        // If no addresses found, return empty result
        if (!depositAddresses || depositAddresses.length === 0) {
            console.log(`[getSolanaDepositAddresses] No deposit addresses found`);
            return res.json({
                rows: [],
                total: 0,
                page: page,
                limit: limit,
                totalPages: 0
            });
        }
        
        // Get token mints
        const { usdcMint, usdtMint } = yield getTokenMints();
        // Fetch balances with concurrency limit (max 10 concurrent RPC calls)
        const limitConcurrency = (0, p_limit_1.default)(10);
        const balancePromises = depositAddresses.map((depositAddr) => limitConcurrency(() => __awaiter(void 0, void 0, void 0, function* () {
            try {
                // Check cache first (skip if refresh requested)
                if (!refresh) {
                    const cached = getCachedBalance(depositAddr.address);
                    if (cached) {
                        return Object.assign({ depositAddr }, cached);
                    }
                }
                // Fetch balances from RPC (always fetch fresh from blockchain)
                const balances = yield (0, solana_1.getAddressBalances)(depositAddr.address, usdcMint, usdtMint);
                // Cache the result
                setCachedBalance(depositAddr.address, balances);
                return Object.assign({ depositAddr }, balances);
            }
            catch (balanceError) {
                console.error(`[getSolanaDepositAddresses] Error fetching balance for ${depositAddr.address}:`, balanceError);
                // Return address with zero balances if balance fetch fails
                return {
                    depositAddr: depositAddr,
                    solBalanceUi: 0,
                    usdcBalanceUi: 0,
                    usdtBalanceUi: 0
                };
            }
        })));
        const resultsWithBalances = yield Promise.all(balancePromises);
        // Get last deposit time for each address (from Payments collection)
        const addresses = depositAddresses.map(addr => addr.address);
        const lastDeposits = yield models_1.Payments.aggregate([
            {
                $match: {
                    address: { $in: addresses },
                    type: 'deposit',
                    status: 'success'
                }
            },
            {
                $group: {
                    _id: '$address',
                    lastDepositTime: { $max: '$createdAt' }
                }
            }
        ]);
        // Create a map of address -> lastDepositTime
        const lastDepositMap = new Map();
        lastDeposits.forEach((deposit) => {
            lastDepositMap.set(deposit._id, deposit.lastDepositTime);
        });
        // Format response - include ALL addresses regardless of balance (even if 0)
        const rows = resultsWithBalances.map((result) => {
            // Handle both successful and error cases
            const depositAddr = result.depositAddr;
            const solBalanceUi = result.solBalanceUi !== undefined ? result.solBalanceUi : 0;
            const usdcBalanceUi = result.usdcBalanceUi !== undefined ? result.usdcBalanceUi : 0;
            const usdtBalanceUi = result.usdtBalanceUi !== undefined ? result.usdtBalanceUi : 0;
            const userId = depositAddr && depositAddr.userId ? depositAddr.userId : null;
            return {
                userId: userId ? (userId._id ? userId._id.toString() : userId.toString()) : null,
                username: userId && userId.username ? userId.username : null,
                email: userId && userId.email ? userId.email : null,
                address: depositAddr.address,
                index: depositAddr.index,
                solBalanceUi: solBalanceUi || 0, // Ensure 0 is shown, not undefined
                usdcBalanceUi: usdcBalanceUi || 0, // Ensure 0 is shown, not undefined
                usdtBalanceUi: usdtBalanceUi || 0, // Ensure 0 is shown, not undefined
                lastDepositTime: lastDepositMap.get(depositAddr.address) || null,
                createdAt: depositAddr.createdAt,
                updatedAt: depositAddr.updatedAt
            };
        });
        return res.json({
            rows: rows,
            total: total,
            page: page,
            limit: limit,
            totalPages: Math.ceil(total / limit)
        });
    }
    catch (error) {
        console.error('[getSolanaDepositAddresses] Error:', error);
        return res.status(500).json({
            error: 'Internal Server Error',
            message: error.message || 'Failed to get Solana deposit addresses'
        });
    }
});
exports.getSolanaDepositAddresses = getSolanaDepositAddresses;
/**
 * Admin endpoint to generate Solana deposit addresses for all users who don't have one.
 * 
 * POST /api/v2/admin/solana/generate-all-addresses
 * This will create deposit addresses for all users who don't have a Solana deposit address yet.
 */
const generateAllSolanaAddresses = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const admin = req.user;
        if (!admin || !admin._id) {
            return res.status(401).json({ error: 'Unauthorized', message: 'Admin not authenticated' });
        }
        console.log('[generateAllSolanaAddresses] Starting to generate addresses for all users...');
        // Get all users
        const allUsers = yield models_1.Users.find({ status: true }).select('_id username email').lean();
        console.log(`[generateAllSolanaAddresses] Found ${allUsers.length} active users`);
        // Get all existing Solana deposit addresses
        const existingAddresses = yield models_1.DepositAddresses.find({
            blockchain: 'solana'
        }).select('userId').lean();
        const existingUserIds = new Set(existingAddresses.map(addr => addr.userId.toString()));
        // Find users without Solana deposit addresses
        const usersWithoutAddresses = allUsers.filter(user => !existingUserIds.has(user._id.toString()));
        console.log(`[generateAllSolanaAddresses] ${usersWithoutAddresses.length} users need Solana deposit addresses`);
        if (usersWithoutAddresses.length === 0) {
            return res.json({
                success: true,
                message: 'All users already have Solana deposit addresses',
                created: 0,
                total: allUsers.length
            });
        }
        // Get the counter for Solana deposit index
        const counterName = `solana_deposit_index`;
        let counter = yield models_1.Counters.findOne({ name: counterName });
        let currentIndex = counter ? counter.value : 0;
        // Generate addresses for users without them
        let created = 0;
        let errors = 0;
        const BATCH_SIZE = 50; // Process in batches to avoid overwhelming the system
        for (let i = 0; i < usersWithoutAddresses.length; i += BATCH_SIZE) {
            const batch = usersWithoutAddresses.slice(i, i + BATCH_SIZE);
            const addressPromises = batch.map((user) => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    // Check again if address was created (race condition)
                    const existing = yield models_1.DepositAddresses.findOne({
                        userId: user._id,
                        blockchain: 'solana'
                    });
                    if (existing) {
                        return { success: false, reason: 'already_exists', userId: user._id };
                    }
                    // Atomically increment counter
                    counter = yield models_1.Counters.findOneAndUpdate(
                        { name: counterName },
                        { $inc: { value: 1 } },
                        { upsert: true, new: true }
                    );
                    const index = counter.value;
                    // Derive address
                    const derived = yield (0, solanaHD_1.deriveSolanaAddress)(index);
                    // Create deposit address record
                    try {
                        yield models_1.DepositAddresses.create({
                            userId: user._id,
                            blockchain: 'solana',
                            index: index,
                            address: derived.address
                        });
                        return { success: true, userId: user._id, address: derived.address, index };
                    }
                    catch (createError) {
                        // Handle race conditions
                        if (createError.code === 11000) {
                            // Check if another process created it
                            const existing = yield models_1.DepositAddresses.findOne({
                                userId: user._id,
                                blockchain: 'solana'
                            });
                            if (existing) {
                                return { success: false, reason: 'already_exists', userId: user._id };
                            }
                        }
                        // Rollback counter if creation failed
                        yield models_1.Counters.findOneAndUpdate(
                            { name: counterName },
                            { $inc: { value: -1 } }
                        );
                        throw createError;
                    }
                }
                catch (error) {
                    console.error(`[generateAllSolanaAddresses] Error creating address for user ${user._id}:`, error);
                    return { success: false, reason: 'error', userId: user._id, error: error.message };
                }
            }));
            const results = yield Promise.all(addressPromises);
            results.forEach((result) => {
                if (result.success) {
                    created++;
                }
                else {
                    errors++;
                }
            });
            console.log(`[generateAllSolanaAddresses] Processed batch ${Math.floor(i / BATCH_SIZE) + 1}, created: ${created}, errors: ${errors}`);
            // Small delay between batches to avoid overwhelming the system
            if (i + BATCH_SIZE < usersWithoutAddresses.length) {
                yield new Promise((resolve) => setTimeout(resolve, 100));
            }
        }
        console.log(`[generateAllSolanaAddresses] Completed. Created ${created} addresses, ${errors} errors`);
        return res.json({
            success: true,
            message: `Generated ${created} Solana deposit addresses`,
            created: created,
            errors: errors,
            total: allUsers.length,
            alreadyHadAddress: allUsers.length - usersWithoutAddresses.length
        });
    }
    catch (error) {
        console.error('[generateAllSolanaAddresses] Error:', error);
        return res.status(500).json({
            error: 'Internal Server Error',
            message: error.message || 'Failed to generate Solana deposit addresses'
        });
    }
});
exports.generateAllSolanaAddresses = generateAllSolanaAddresses;

