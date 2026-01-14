"use strict";
/**
 * Module providing deposit addresses functionality for HD-derived addresses.
 * Stores per-user deposit addresses for different blockchains (e.g., Solana).
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DepositAddresses = void 0;
const mongoose_1 = require("mongoose");
const DepositAddressesSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: 'users',
        index: true
    },
    blockchain: {
        type: String,
        required: true,
        enum: ['solana', 'evm', 'bitcoin', 'tron', 'ton'],
        index: true
    },
    index: {
        type: Number,
        required: true,
        min: 0
    },
    address: {
        type: String,
        required: true
    }
}, { timestamps: true });

// Compound unique index: one address per user per blockchain
DepositAddressesSchema.index({ userId: 1, blockchain: 1 }, { unique: true });

// Compound unique index: one address per index per blockchain (prevent index collisions)
DepositAddressesSchema.index({ blockchain: 1, index: 1 }, { unique: true });

exports.DepositAddresses = (0, mongoose_1.model)('deposit_addresses', DepositAddressesSchema);

