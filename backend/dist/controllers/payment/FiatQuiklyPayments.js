"use strict";
/**
 * Module providing FiatQuiklyPayments functionality.
 */
/**
 * FiatQuikly payment gateway integration. Processes fiat currency payments.
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
exports.checkPaymentStatus = exports.depositFiatQuikly = void 0;
const crypto_1 = require("crypto");
const axios_1 = require("axios");
const models_1 = require("../../models");
const own_affiliate_1 = require("../../utils/own_affilate");
// All fiat payment constants and helpers removed - fiat deposits not supported
// const paymentStatus = new Map();
// const QUIKIPAY_URL = process.env.QUIKIPAY_URL;
// const SECRET_KEY = process.env.SECRET_KEY_QUIKLY;
// const API_KEY = process.env.API_KEY_QUIKLY;
// const SUCCESS_URL = process.env.QUIKIPAY_SUCCESS_URL;
// const CANCEL_URL = process.env.QUIKIPAY_CANCEL_URL;
// const CALLBACK_URL = process.env.QUIKIPAY_CALLBACK_URL;
// const generateOrderId = () => {
//     return Math.floor(100000000 + Math.random() * 900000000).toString();
// };
// const generateSignature = (payload, secret) => {
//     const values = Object.values(payload).filter(val => val !== undefined && val !== null);
//     const concatenatedString = values.join('') + secret;
//     return (0, crypto_1.createHash)('sha256').update(concatenatedString).digest('hex');
// };
// DEPRECATED: Fiat deposits not supported - only crypto deposits accepted
const depositFiatQuikly = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.status(403).json({ error: 'Fiat deposits not supported', message: 'Only crypto deposits are accepted' });
    /* REMOVED - Dead code after return
    try {
        const { customer_name, customer_email, currency_code, amount } = req.body;
        const userId = req.user;
        const order_id = generateOrderId();
        const paymentPayload = {
            merchant: API_KEY,
            customer_name,
            customer_email,
            currency: currency_code,
            amount,
            order_id,
            success_url: SUCCESS_URL,
            cancel_url: CANCEL_URL,
            callback_url: CALLBACK_URL,
        };
        const signature = generateSignature(paymentPayload, SECRET_KEY);
        paymentPayload.signature = signature;
        const response = yield axios_1.default.post(QUIKIPAY_URL, paymentPayload);
        console.log(response.data, "---------------------------------");
        yield models_1.Payments.create({
            userId,
            address: 'qikipay',
            paymentId: order_id,
            payment_link: response.data.payment_link,
            status: -1,
            status_text: 'pending',
            method: 0,
            ipn_type: 'deposit'
        });
        res.status(200).json(Object.assign(Object.assign({}, response.data), { order_id }));
    }
    catch (error) {
        console.error('Error processing payment:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
    */
});
exports.depositFiatQuikly = depositFiatQuikly;
const checkPaymentStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { order_id, userId, amount, currency } = req.query;
        res.json("success");
    }
    catch (error) {
        console.error('Error checking payment status:', error);
        res.status(500).json({ error: 'Internal Server Error', message: error });
    }
});
exports.checkPaymentStatus = checkPaymentStatus;
