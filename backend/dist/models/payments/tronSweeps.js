"use strict";
/**
 * TRON sweep transaction history model.
 * Records all admin-initiated sweeps from user deposit addresses to treasury wallet.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.TronSweeps = void 0;
const mongoose_1 = require("mongoose");
const TronSweepsSchema = new mongoose_1.Schema({
    adminId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: 'users',
        index: true
    },
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: false,
        default: null,
        ref: 'users',
        index: true
    },
    addressId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: false,
        default: null,
        ref: 'deposit_addresses',
        index: true
    },
    index: {
        type: Number,
        required: true,
        min: 0
    },
    fromAddress: {
        type: String,
        required: true
    },
    toAddress: {
        type: String,
        required: true
    },
    symbol: {
        type: String,
        required: true,
        enum: ['TRX', 'USDT', 'USDC']
    },
    contractAddress: {
        type: String,
        default: null // null for TRX native, contract address for TRC20 tokens
    },
    amountUi: {
        type: Number,
        required: true,
        min: 0
    },
    txid: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    status: {
        type: String,
        required: true,
        enum: ['pending', 'confirmed', 'failed'],
        default: 'pending'
    },
    error: {
        type: String,
        default: null
    }
}, { timestamps: true });
// Unique index on txid to prevent duplicate sweeps
TronSweepsSchema.index({ txid: 1 }, { unique: true });
// Index for querying by user
TronSweepsSchema.index({ userId: 1, createdAt: -1 });
// Index for querying by address
TronSweepsSchema.index({ addressId: 1, createdAt: -1 });
exports.TronSweeps = (0, mongoose_1.model)('tron_sweeps', TronSweepsSchema);
