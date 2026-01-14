/**
 * TRON blockchain utilities for transaction verification and address operations.
 * Uses TronWeb and TronGrid API for fetching transaction data.
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
exports.getTronTransaction = void 0;
const axios_1 = require("axios");
// Note: tronweb needs to be installed: npm install tronweb
let TronWeb;
try {
    const tronwebModule = require("tronweb");
    TronWeb = tronwebModule.TronWeb || tronwebModule.default || tronwebModule;
} catch (error) {
    console.error('[tron] Missing dependency. Please install: npm install tronweb');
    throw new Error('tronweb package is required for TRON transaction verification. Please install it: npm install tronweb');
}
// Initialize TronWeb with mainnet
const tronWeb = new TronWeb({
    fullHost: process.env.TRON_RPC_URL || 'https://api.trongrid.io'
});
// TronGrid API base URL
const TRONGRID_API = process.env.TRONGRID_API_URL || 'https://api.trongrid.io';
/**
 * Fetches a TRON transaction by transaction ID.
 * Uses TronWeb and TronGrid API for comprehensive transaction data.
 * 
 * @param txid - Transaction ID (hex string, 64 characters)
 * @returns Transaction data including transaction info and events
 */
const getTronTransaction = (txid) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Validate txid format (should be hex, 64 characters)
        if (!txid || typeof txid !== 'string') {
            throw new Error('Invalid transaction ID');
        }
        // Normalize txid (remove 0x prefix if present, ensure lowercase)
        const normalizedTxid = txid.startsWith('0x') ? txid.slice(2) : txid;
        if (normalizedTxid.length !== 64) {
            throw new Error(`Invalid transaction ID length: expected 64 hex characters, got ${normalizedTxid.length}`);
        }
        // Fetch transaction using TronWeb
        const transaction = yield tronWeb.trx.getTransaction(normalizedTxid);
        if (!transaction) {
            throw new Error('Transaction not found');
        }
        // Fetch transaction info (includes receipt, logs, etc.)
        const transactionInfo = yield tronWeb.trx.getTransactionInfo(normalizedTxid);
        // Fetch events from TronGrid API (for TRC20 token transfers)
        let events = [];
        try {
            const eventsResponse = yield axios_1.default.get(`${TRONGRID_API}/v1/transactions/${normalizedTxid}/events`, {
                timeout: 10000
            });
            if (eventsResponse.data && eventsResponse.data.data) {
                events = eventsResponse.data.data;
            }
        }
        catch (eventsError) {
            // Events endpoint might fail, but transaction might still be valid
            // Log warning but don't fail the whole operation
            console.warn(`[getTronTransaction] Failed to fetch events for tx ${normalizedTxid}:`, eventsError.message);
        }
        return {
            transaction: transaction,
            transactionInfo: transactionInfo,
            events: events,
            txid: normalizedTxid
        };
    }
    catch (error) {
        console.error('[getTronTransaction] Error fetching transaction:', error);
        throw error;
    }
});
exports.getTronTransaction = getTronTransaction;
