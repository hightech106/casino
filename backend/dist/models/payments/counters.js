"use strict";
/**
 * Module providing atomic counter functionality for generating unique sequential indices.
 * Used for HD wallet derivation index allocation.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Counters = void 0;
const mongoose_1 = require("mongoose");
const CountersSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    value: {
        type: Number,
        required: true,
        default: 0,
        min: 0
    }
}, { timestamps: true });

exports.Counters = (0, mongoose_1.model)('counters', CountersSchema);

