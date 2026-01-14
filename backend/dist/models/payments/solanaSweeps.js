"use strict";
/**
 * Solana sweep transaction history model.
 * Records all admin-initiated sweeps from user deposit addresses to treasury wallet.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolanaSweeps = void 0;
const mongoose_1 = require("mongoose");
const SolanaSweepsSchema = new mongoose_1.Schema({
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
    mint: {
        type: String,
        default: null // null means SOL (native)
    },
    amountUi: {
        type: Number,
        required: true,
        min: 0
    },
    signature: {
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
// Unique index on signature to prevent duplicate sweeps
SolanaSweepsSchema.index({ signature: 1 }, { unique: true });
// Index for querying by user
SolanaSweepsSchema.index({ userId: 1, createdAt: -1 });
// Index for querying by address
SolanaSweepsSchema.index({ addressId: 1, createdAt: -1 });
exports.SolanaSweeps = (0, mongoose_1.model)('solana_sweeps', SolanaSweepsSchema);

