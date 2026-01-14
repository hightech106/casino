"use strict";
/**
 * Admin controller for viewing TRON deposit addresses and their balances.
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(value); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(value); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTronDepositAddresses = void 0;
const models_1 = require("../../models");
const base_1 = require("../base");
const p_limit_1 = require("p-limit");
// Note: tronweb needs to be installed: npm install tronweb
let TronWeb;
try {
    const tronwebModule = require("tronweb");
    TronWeb = tronwebModule.TronWeb || tronwebModule.default || tronwebModule;
}
catch (error) {
    console.error('[tronDepositAddresses] Missing dependency. Please install: npm install tronweb');
    throw new Error('tronweb package is required for TRON balance fetching. Please install it: npm install tronweb');
}
// Initialize TronWeb with configurable fullnode
const TRON_FULLNODE = process.env.TRON_FULLNODE || 'https://api.trongrid.io';
const TRON_API_KEY = process.env.TRON_API_KEY;
const tronWeb = new TronWeb({
    fullHost: TRON_FULLNODE,
    headers: TRON_API_KEY ? { "TRON-PRO-API-KEY": TRON_API_KEY } : undefined,
    privateKey: '01' // Dummy private key, only for API interaction, not signing
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
 * Fetch TRC20 token balance for a given address and contract.
 * Uses TronWeb contract call to read balanceOf(address).
 */
const getTRC20Balance = (address, contractAddress, decimals) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Validate address format
        if (!address || !address.startsWith('T') || address.length !== 34) {
            throw new Error(`Invalid TRON address: ${address}`);
        }
        // Validate contract address
        if (!contractAddress || !contractAddress.startsWith('T') || contractAddress.length !== 34) {
            throw new Error(`Invalid contract address: ${contractAddress}`);
        }
        // Create contract instance
        const contract = yield tronWeb.contract().at(contractAddress);
        // Call balanceOf(address)
        const balanceResult = yield contract.balanceOf(address).call();
        // balanceResult is a BigNumber-like object, convert to string then number
        const rawBalance = balanceResult ? balanceResult.toString() : '0';
        const balanceNum = parseFloat(rawBalance) || 0;
        // Apply decimals (default 6 for TRC20 tokens)
        const decimalsValue = decimals || 6;
        const balanceUi = balanceNum / Math.pow(10, decimalsValue);
        return balanceUi;
    }
    catch (error) {
        console.error(`[getTRC20Balance] Error fetching balance for ${address} (contract ${contractAddress}):`, error.message);
        // Return 0 on error, don't fail the whole request
        return 0;
    }
});
/**
 * Fetch TRX native balance for a given address.
 * Uses TronWeb trx.getBalance which returns balance in SUN (1 TRX = 1e6 SUN).
 */
const getTRXBalance = (address) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Validate address format
        if (!address || !address.startsWith('T') || address.length !== 34) {
            throw new Error(`Invalid TRON address: ${address}`);
        }
        // Get balance in SUN (smallest unit)
        const balanceSun = yield tronWeb.trx.getBalance(address);
        // Convert SUN to TRX (1 TRX = 1e6 SUN)
        const balanceTrx = balanceSun ? parseFloat(balanceSun.toString()) / 1e6 : 0;
        return balanceTrx;
    }
    catch (error) {
        console.error(`[getTRXBalance] Error fetching TRX balance for ${address}:`, error.message);
        // Return 0 on error, don't fail the whole request
        return 0;
    }
});
/**
 * Fetch all balances (TRX, USDT, USDC) for a TRON address.
 */
const getAddressBalances = (address, usdtContract, usdcContract) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Fetch balances in parallel
        const [trxBalance, usdtBalance, usdcBalance] = yield Promise.all([
            getTRXBalance(address),
            getTRC20Balance(address, usdtContract, 6), // USDT uses 6 decimals
            getTRC20Balance(address, usdcContract, 6) // USDC uses 6 decimals
        ]);
        return {
            trxBalanceUi: trxBalance || 0,
            usdtUi: usdtBalance || 0,
            usdcUi: usdcBalance || 0
        };
    }
    catch (error) {
        console.error(`[getAddressBalances] Error fetching balances for ${address}:`, error.message);
        // Return zero balances on error
        return {
            trxBalanceUi: 0,
            usdtUi: 0,
            usdcUi: 0
        };
    }
});
/**
 * Admin endpoint to list TRON deposit addresses with balances.
 * 
 * GET /api/v2/payments/admin/tron/deposit-addresses
 * Query params:
 *   - limit: number (default: 50)
 *   - page: number (default: 1)
 *   - search: string (optional: userId substring or address)
 */
const getTronDepositAddresses = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const admin = req.user;
        if (!admin || !admin._id) {
            return res.status(401).json({ error: 'Unauthorized', message: 'Admin not authenticated' });
        }
        // Parse query parameters
        const limit = parseInt(req.query.limit) || 50;
        const page = parseInt(req.query.page) || 1;
        const search = req.query.search ? String(req.query.search).trim() : '';
        const skip = (page - 1) * limit;
        // Build query
        let query = {
            blockchain: 'tron'
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
        console.log(`[getTronDepositAddresses] Found ${total} total TRON deposit addresses in database`);
        // Get deposit addresses with pagination
        const depositAddresses = yield models_1.DepositAddresses.find(query)
            .populate('userId', 'username email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();
        console.log(`[getTronDepositAddresses] Returning ${depositAddresses.length} addresses for page ${page}`);
        // If no addresses found, return empty result
        if (!depositAddresses || depositAddresses.length === 0) {
            console.log(`[getTronDepositAddresses] No deposit addresses found`);
            return res.json({
                rows: [],
                total: 0,
                page: page,
                limit: limit,
                totalPages: 0
            });
        }
        // Get token contracts
        const { usdtContract, usdcContract } = yield getTokenContracts();
        console.log(`[getTronDepositAddresses] Using USDT contract: ${usdtContract}, USDC contract: ${usdcContract}`);
        // Fetch balances with concurrency limit (max 10 concurrent calls)
        const limitConcurrency = (0, p_limit_1.default)(10);
        const balancePromises = depositAddresses.map((depositAddr) => limitConcurrency(() => __awaiter(void 0, void 0, void 0, function* () {
            try {
                // Fetch balances from blockchain
                const balances = yield getAddressBalances(depositAddr.address, usdtContract, usdcContract);
                return Object.assign({ depositAddr }, balances);
            }
            catch (balanceError) {
                console.error(`[getTronDepositAddresses] Error fetching balance for ${depositAddr.address}:`, balanceError.message);
                // Return address with zero balances if balance fetch fails
                return {
                    depositAddr: depositAddr,
                    trxBalanceUi: 0,
                    usdtUi: 0,
                    usdcUi: 0
                };
            }
        })));
        const resultsWithBalances = yield Promise.all(balancePromises);
        // Format response
        const rows = resultsWithBalances.map((result) => {
            const depositAddr = result.depositAddr;
            const userId = depositAddr && depositAddr.userId ? depositAddr.userId : null;
            return {
                userId: userId ? (userId._id ? userId._id.toString() : userId.toString()) : null,
                address: depositAddr.address,
                index: depositAddr.index,
                trxBalanceUi: result.trxBalanceUi !== undefined ? result.trxBalanceUi : 0,
                usdtUi: result.usdtUi !== undefined ? result.usdtUi : 0,
                usdcUi: result.usdcUi !== undefined ? result.usdcUi : 0,
                updatedAt: depositAddr.updatedAt || depositAddr.createdAt
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
        console.error('[getTronDepositAddresses] Error:', error);
        return res.status(500).json({
            error: 'Internal Server Error',
            message: error.message || 'Failed to get TRON deposit addresses'
        });
    }
});
exports.getTronDepositAddresses = getTronDepositAddresses;
