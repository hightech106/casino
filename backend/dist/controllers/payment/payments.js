"use strict";
/**
 * Module providing payments functionality.
 */
/**
 * Payment processing controller. Handles payment method configuration and processing.
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
exports.rejectPaymentById = exports.approvePaymentById = exports.approveWithdrawal = exports.deleteOne = exports.updateOne = exports.create = exports.csv = exports.list = exports.getOne = exports.get = exports.callback = void 0;
const crypto = require("crypto");
const mongoose_1 = require("mongoose");
const models_1 = require("../../models");
const base_1 = require("../base");
const timelesstech_1 = require("../games/timelesstech");
const own_affiliate_1 = require("../../utils/own_affilate");
// fiatConverter removed - no longer used (all amounts are in LU)
const IPN_SECRET_KEY = process.env.IPN_SECRET_KEY;
const NOW_PAYMENT_API = process.env.NOW_PAYMENT_API;
const aggregateQuery = [
    {
        $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'user',
        },
    },
    {
        $lookup: {
            from: 'currencies',
            localField: 'currencyId',
            foreignField: '_id',
            as: 'currency',
        },
    },
    {
        $unwind: '$user',
    },
    {
        $unwind: '$currency',
    },
    {
        $project: {
            'currency.abi': 0,
        },
    },
    {
        $sort: { createdAt: -1 },
    },
];
// export const checkDepositBonus = async ({ balanceId, paymentsId, deposit_amount, currency }: PaymentBonusCheck) => {
//     try {
//         const EVENT_REQ = ["campaign_free_bet", "campaign_free_spin", "free_spin_bonus"];
//         const balance = await Balances.findById(balanceId).populate('userId');
//         const user = balance.userId;
//         if (!balance) return false;
//         // affiliate
//         if (user.affiliate && deposit_amount && paymentsId && currency) {
//             const param = {
//                 playerid: user._id,
//                 transaction_id: paymentsId,
//                 local_amount: deposit_amount,
//                 local_currency: currency
//             }
//             await depositPostBack(param);
//         }
//         //
//         const currentDate = new Date();
//         const bonus = await Bonus.find({
//             event: { $in: EVENT_REQ },
//             currency: balance.currency._id,
//             deposit_amount: { $gte: deposit_amount },
//             status: true,
//         });
//         bonus.forEach(async (row) => {
//             if (!row.players.includes("all") && !row.players.includes(String(user._id)))
//                 return;
//             if (!row.country.includes("all") && !row.country.includes(String(user.country_reg)))
//                 return;
//             const startDate = new Date(row.date[0]);
//             const endDate = new Date(row.date[1]);
//             if (currentDate < startDate || currentDate > endDate)
//                 return;
//             const exists = await BonusHistories.findOne({
//                 bonusId: row._id,
//                 userId: user._id,
//             });
//             let bonushis: any = null;
//             if (exists) return;
//             bonushis = await BonusHistories.create({
//                 bonusId: row._id,
//                 userId: user._id,
//                 paymentsId,
//                 amount: row.amount,
//                 event: row.event,
//                 isDeposit: true,
//                 finished: false
//             });
//         });
//     } catch (err) {
//         console.error(err);
//         return false;
//     }
// }
const callback = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const nowpaymentSig = req.headers['x-nowpayments-sig'];
        const hmac = crypto.createHmac('sha512', IPN_SECRET_KEY);
        hmac.update(JSON.stringify(req.body, Object.keys(req.body).sort()));
        const signature = hmac.digest('hex');
        console.log('==============now callback==============');
        console.log(req.body, nowpaymentSig, signature);
        console.log('==============req.body==============');
        // if (signature == nowpaymentSig) {
        const { payment_id, pay_amount, pay_address, actually_paid, payment_status, type } = req.body;
        if (type !== 'crypto2crypto')
            return res.json(true);
        let payment = yield models_1.Payments.findOne({
            paymentId: payment_id,
            // status_text: payment_status
        });
        if (!payment && actually_paid > 0) {
            const oldpayment = yield models_1.Payments.findOne({
                pay_address: pay_address,
            });
            payment = yield models_1.Payments.findOneAndUpdate({ paymentId: payment_id }, {
                userId: oldpayment.userId,
                currencyId: oldpayment.currencyId,
                balanceId: oldpayment.balanceId,
                amount: pay_amount,
                address: pay_address,
                status: -3,
                ipn_type: 'deposit',
                status_text: 'pending',
            }, { upsert: true, new: true });
        }
        console.log('payment', payment);
        let status = -3;
        let status_text = '';
        if (payment && payment.status_text !== payment_status) {
            status_text = payment_status;
            switch (payment_status) {
                case 'finished':
                    status_text = 'confirmed';
                    status = 3;
                    console.log('payment.userId', payment.userId);
                    
                    // Get LU currency
                    const luCurrency = yield models_1.Currencies.findOne({ symbol: 'LU' });
                    if (!luCurrency) {
                        console.error('LU currency not found in callback');
                        break;
                    }
                    
                    // Get user's LU balance
                    let balance = yield models_1.Balances.findOne({
                        userId: payment.userId,
                        currency: luCurrency._id,
                        status: true,
                    });
                    
                    if (!balance) {
                        balance = yield models_1.Balances.create({
                            userId: payment.userId,
                            currency: luCurrency._id,
                            balance: 0,
                            bonus: 0,
                            status: true,
                        });
                    }
                    
                    // All amounts are in LU (price = 1)
                    const depositCurrency = yield models_1.Currencies.findById(payment.currencyId);
                    // actually_paid is the crypto amount
                    const cryptoAmount = actually_paid;
                    const luAmount = (0, base_1.NumberFix)(cryptoAmount, 2);
                    const cryptoAmountFixed = (0, base_1.NumberFix)(cryptoAmount, depositCurrency?.decimals || 18);
                    
                    // Update payment: amount = crypto amount, fiat_amount = LU amount
                    yield models_1.Payments.updateOne({ paymentId: payment_id }, {
                        status,
                        amount: cryptoAmountFixed, // Crypto amount
                        actually_paid: cryptoAmount,
                        fiat_amount: luAmount, // LU amount
                        status_text,
                        data: JSON.stringify(req.body),
                    });
                    
                    // Add LU to balance
                    yield models_1.Balances.findByIdAndUpdate(balance._id, { 
                        $inc: { balance: luAmount } 
                    });
                    
                    // Process deposit bonus if applicable
                    if (payment.bonusId) {
                        const payment_1 = require('./index');
                        const updatedPayment = yield models_1.Payments.findOne({ paymentId: payment_id });
                        if (updatedPayment) {
                            updatedPayment.fiat_amount = luAmount;
                            updatedPayment.balanceId = balance._id;
                            yield payment_1.setDepositBonus(updatedPayment, luAmount);
                        }
                    }
                    break;
                case 'failed':
                    status_text = 'canceled';
                    status = -4;
                    // Don't add balance on failed payment
                    break;
                case 'refunded':
                    status = -5;
                    break;
                case 'expired':
                    status = -6;
                    break;
                default:
                    break;
            }
            yield models_1.Payments.updateOne({ paymentId: payment_id }, {
                status,
                actually_paid,
                status_text,
                data: JSON.stringify(req.body),
            });
        }
        res.json(true);
    }
    catch (e) {
        console.log(e, 'error');
        return res.status(400).json('Interanal server error');
    }
});
exports.callback = callback;
const get = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const results = yield models_1.Payments.aggregate(aggregateQuery);
    res.json(results);
});
exports.get = get;
const getOne = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield models_1.Payments.aggregate([{ $match: { _id: (0, base_1.ObjectId)(req.params.id) } }, ...aggregateQuery]);
    res.json(result[0]);
});
exports.getOne = getOne;

const list = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { pageSize = null, page = null, userId = null, type = null, currency = null, sort = null, column = null, date = null, method, search = '', } = req.body;
    let query = {};
    const query2 = {};
    let sortQuery = { createdAt: -1 };
    if (userId) {
        query.userId = (0, base_1.ObjectId)(userId);
    }
    if (type) {
        query.ipn_type = type;
    }
    if (currency) {
        query.currencyId = (0, base_1.ObjectId)(currency);
    }
    if (date && date[0] && date[1]) {
        query.createdAt = { $gte: new Date(date[0]), $lte: new Date(date[1]) };
    }
    if (column) {
        sortQuery = { [column]: sort ? sort : 1 };
    }
    if (method !== '' && method !== undefined) {
        query.method = method;
    }
    if (search) {
        query = Object.assign(Object.assign({}, query), { $or: [
                { address: { $regex: search, $options: 'i' } },
                { currency: { $regex: search, $options: 'i' } },
                { ipn_type: { $regex: search, $options: 'i' } },
                { status_text: { $regex: search, $options: 'i' } },
                // Check for valid ObjectId before searching in `_id`
                ...(mongoose_1.default.Types.ObjectId.isValid(search) ? [{ _id: new mongoose_1.default.Types.ObjectId(search) }] : []),
            ] });
    }
    let count = 0;
    if (req.user && req.user.rolesId.type === 'agent') {
        query2['user.creatorId'] = req.user._id;
        const results = yield models_1.Payments.aggregate([{ $match: query }, ...aggregateQuery, { $match: query2 }]);
        count = results.length;
    }
    else {
        count = yield models_1.Payments.countDocuments(query);
    }
    if (!pageSize || !page) {
        const results = yield models_1.Payments.aggregate([{ $match: query }, ...aggregateQuery, { $match: query2 }, { $sort: sortQuery }]);
        res.json({ results, count });
    }
    else {
        const results = yield models_1.Payments.aggregate([
            { $match: query },
            ...aggregateQuery,
            { $match: query2 },
            { $sort: sortQuery },
            { $skip: (page - 1) * pageSize },
            { $limit: pageSize },
        ]);
        res.json({ results, count });
    }
});
exports.list = list;

const csv = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId = null, type = null, currency = null, sort = null, column = null, date = null, method } = req.body;
    const query = {};
    const query2 = {};
    let sortQuery = { createdAt: -1 };
    if (userId) {
        query.userId = (0, base_1.ObjectId)(userId);
    }
    if (type) {
        query.ipn_type = type;
    }
    if (date && date[0] && date[1]) {
        query.createdAt = { $gte: new Date(date[0]), $lte: new Date(date[1]) };
    }
    if (column) {
        sortQuery = { [column]: sort ? sort : 1 };
    }
    if (currency) {
        query.currencyId = currency;
    }
    if (method !== '' && method !== undefined) {
        query.method = method;
    }
    if (req.user && req.user.rolesId.type === 'agent') {
        query2['user.creatorId'] = req.user._id;
    }
    const results = yield models_1.Payments.aggregate([
        { $match: query },
        ...aggregateQuery,
        { $match: query2 },
        { $sort: sortQuery },
        {
            $project: {
                _id: 0,
                ID: '$_id',
                Username: '$user.username',
                Email: '$user.email',
                TransactionHash: '$txn_id',
                Amount: {
                    $concat: [{ $convert: { input: '$amount', to: 'string' } }, ' ', '$currency.symbol'],
                },
                Address: '$address',
                Status: '$status_text',
                Type: '$ipn_type',
                CreatedAt: '$updatedAt',
            },
        },
    ]);
    res.json(results);
});
exports.csv = csv;
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield models_1.Payments.create(req.body);
    res.json(result);
});
exports.create = create;
const updateOne = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = { _id: (0, base_1.ObjectId)(req.params.id) };
    yield models_1.Payments.updateOne(query, req.body);
    const result = yield models_1.Payments.aggregate([{ $match: query }, ...aggregateQuery]);
    res.json(result[0]);
});
exports.updateOne = updateOne;
const deleteOne = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield models_1.Payments.deleteOne({ _id: (0, base_1.ObjectId)(req.params.id) });
    res.json(result);
});
exports.deleteOne = deleteOne;

// const approveWithdrawal = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
//     const { status, paymentId } = req.body;
//     if (status === 'pending') {
//         yield models_1.Payments.updateOne({ _id: (0, base_1.ObjectId)(paymentId) }, { status: -2, status_text: 'pending' });
//         return res.json(true);
//     }
//     else if (status === 'approve') {
//         const payment = yield models_1.Payments.findByIdAndUpdate({ _id: (0, base_1.ObjectId)(paymentId) }, {
//             status: 105,
//             status_text: 'approve',
//         });
//         const balance = yield models_1.Balances.findByIdAndUpdate(payment.balanceId);
//         if (balance.balance < payment.fiat_amount)
//             return res.status(429).json('Player Balance is not enough!');
//         return res.json(true);
//     }
//     else if (status === 'confirmed') {
//         const payment = yield models_1.Payments.findById(paymentId);
//         const balance = yield models_1.Balances.findByIdAndUpdate(payment.balanceId);
//         if (balance.balance < payment.fiat_amount)
//             return res.status(429).json('Player Balance is not enough!');
//         yield models_1.Payments.updateOne({ _id: payment._id }, { status: 2, status_text: 'confirmed', actually_paid: payment.amount });
//         yield models_1.BonusHistories.updateOne({
//             userId: payment.userId,
//             $or: [
//                 {
//                     status: 'active',
//                 },
//                 // {
//                 //     status: 'processing',
//                 // },
//             ],
//         }, { status: 'canceled' });
//         yield (0, base_1.balanceUpdate)({
//             req,
//             balanceId: payment.balanceId,
//             amount: payment.fiat_amount * -1,
//             type: 'withdrawal',
//         });
//         yield (0, timelesstech_1.cancelCampaign)(payment.userId);
//         return res.json(true);
//     }
//     else if (status === 'canceled') {
//         yield models_1.Payments.updateOne({ _id: (0, base_1.ObjectId)(paymentId) }, { status: -1, status_text: 'canceled' });
//         // await balanceUpdate({
//         //     req,
//         //     balanceId: payment.balanceId,
//         //     amount: payment.fiat_amount,
//         //     type: 'withdrawal-canceled'
//         // });
//         return res.json(true);
//     }
// });
// exports.approveWithdrawal = approveWithdrawal;

const approveWithdrawal = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { status, paymentId } = req.body;

    // Проверяем, что paymentId валиден
    if (!paymentId || !mongoose_1.Types.ObjectId.isValid(paymentId)) {
        return res.status(400).json('Invalid paymentId');
    }

    if (status === 'pending') {
        yield models_1.Payments.updateOne(
            { _id: new mongoose_1.Types.ObjectId(paymentId) },
            { $set: { status: -2, status_text: 'pending' } }
        );
        return res.json(true);
    } else if (status === 'approve') {
        const payment = yield models_1.Payments.findByIdAndUpdate(
            new mongoose_1.Types.ObjectId(paymentId),
            { $set: { status: 105, status_text: 'approve' } },
            { new: true }
        );

        if (!payment) {
            return res.status(404).json('Payment not found');
        }

        // Balance already deducted when withdrawal was created (status: pending)
        // No need to check or deduct again here
        return res.json(true);
    } else if (status === 'confirmed') {
        const payment = yield models_1.Payments.findById(paymentId);
        if (!payment) {
            return res.status(404).json('Payment not found');
        }

        if (!payment.balanceId || !mongoose_1.Types.ObjectId.isValid(payment.balanceId)) {
            return res.status(400).json('Invalid balanceId');
        }

        // Balance already deducted when withdrawal was created (status: pending)
        // No need to deduct again - just update status to confirmed
        yield models_1.Payments.updateOne(
            { _id: payment._id },
            { $set: { status: 2, status_text: 'confirmed', actually_paid: payment.amount } }
        );

        yield models_1.BonusHistories.updateOne(
            {
                userId: payment.userId,
                $or: [{ status: 'active' }],
            },
            { $set: { status: 'canceled' } }
        );

        // Balance was already deducted when withdrawal was created (status: pending)
        // No need to call balanceUpdate again - balance history already recorded

        yield (0, timelesstech_1.cancelCampaign)(payment.userId);
        const user = yield models_1.Users.findById(payment.userId);
        if (user.affiliate) {
        try {
            yield (0, own_affiliate_1.withdrawalPostBack)(
                payment.userId.toString(),
                user.username,
                payment._id.toString(),
                payment.fiat_amount,
                payment.currency
            );
        } catch (error) {
            console.error('Error in withdrawalPostBack:', error);
        }
    }

        return res.json(true);
    } else if (status === 'canceled') {
        const payment = yield models_1.Payments.findById(paymentId);
        if (!payment) {
            return res.status(404).json('Payment not found');
        }

        // Update payment status to canceled
        yield models_1.Payments.updateOne(
            { _id: new mongoose_1.Types.ObjectId(paymentId) },
            { $set: { status: -1, status_text: 'canceled' } }
        );

        // CRITICAL: Refund balance when withdrawal is canceled
        // Balance was deducted when withdrawal was created, so we must refund it
        if (payment.balanceId && payment.fiat_amount) {
            yield (0, base_1.balanceUpdate)({
                req,
                balanceId: payment.balanceId,
                amount: payment.fiat_amount, // Refund the fiat amount
                type: 'withdrawal-canceled',
            });
            console.log(`Withdrawal ${paymentId} canceled - refunded ${payment.fiat_amount} to balance ${payment.balanceId}`);
        }

        return res.json(true);
    } else {
        return res.status(400).json('Invalid status');
    }
});
exports.approveWithdrawal = approveWithdrawal;

const approvePaymentById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { txid } = req.body;
        if (!id || !mongoose_1.Types.ObjectId.isValid(id)) {
            return res.status(400).json('Invalid payment ID');
        }
        if (!txid || typeof txid !== 'string' || txid.trim().length === 0) {
            return res.status(400).json('Transaction ID (txid) is required');
        }
        // Update payment status to 'Sent' only if status_text is 'pending'
        const updateResult = yield models_1.Payments.updateOne(
            { _id: new mongoose_1.Types.ObjectId(id), status_text: 'pending' },
            { $set: { status: 2, status_text: 'Sent', txn_id: txid.trim(), updatedAt: new Date() } }
        );
        if (updateResult.matchedCount === 0) {
            return res.status(409).json('Payment is not in Pending status');
        }
        // Get payment details with user and currency
        const payment = yield models_1.Payments.findById(id)
            .populate('userId')
            .populate('currencyId');
        if (!payment) {
            return res.status(404).json('Payment not found');
        }
        const user = payment.userId;
        const currency = payment.currencyId;
        // Format amount with currency symbol
        const amountFormatted = `${currency?.symbol || ''} ${payment.amount || payment.fiat_amount || 0}`;
        // Get current time in a readable format
        const currentTime = new Date().toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZoneName: 'short'
        });
        // Send email via SendGrid
        const sendgrid_1 = require('../../utils/sendgrid');
        const MARKETING_EMAIL = process.env.MARKETING_EMAIL;
        const APP_NAME = process.env.APP_NAME;
        yield (0, sendgrid_1.sendMail)({
            to: user.email,
            from: { email: MARKETING_EMAIL, name: APP_NAME },
            subject: 'Withdrawal Approved',
            templateId: 'd-d37b0e4661224cbea155643dd99cfdbd',
            dynamicTemplateData: {
                amount: amountFormatted,
                time: currentTime,
                address: payment.address || '',
                txid: txid.trim(),
            },
        });
        // Emit socket event to admin namespace
        const io = req.app.get('io');
        if (io) {
            io.of('/admin').emit('admin:withdrawal-approved', {
                paymentId: id,
                userId: user._id,
                amount: amountFormatted,
            });
        }
        res.json({ success: true, message: 'Withdrawal approved successfully' });
    }
    catch (error) {
        console.error('Error in approvePaymentById:', error);
        return res.status(500).json('Internal server error');
    }
});
exports.approvePaymentById = approvePaymentById;

const rejectPaymentById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { reason } = req.body;
        if (!id || !mongoose_1.Types.ObjectId.isValid(id)) {
            return res.status(400).json('Invalid payment ID');
        }
        if (!reason || typeof reason !== 'string' || reason.trim().length === 0) {
            return res.status(400).json('Reason is required');
        }
        if (reason.length > 255) {
            return res.status(400).json('Reason must be 255 characters or less');
        }
        // Update payment status to 'Failed' only if status_text is 'pending'
        const updateResult = yield models_1.Payments.updateOne(
            { _id: new mongoose_1.Types.ObjectId(id), status_text: 'pending' },
            {
                $set: {
                    status: -1,
                    status_text: 'Failed',
                    failReason: reason.trim(),
                    updatedAt: new Date(),
                },
            }
        );
        if (updateResult.matchedCount === 0) {
            return res.status(409).json('Payment is not in Pending status');
        }
        // Get payment details
        const payment = yield models_1.Payments.findById(id)
            .populate('userId')
            .populate('currencyId');
        if (!payment) {
            return res.status(404).json('Payment not found');
        }
        const user = payment.userId;
        const currency = payment.currencyId;
        // Use the exact fiat_amount that was locked in the payment request
        // For crypto withdrawals, fiat_amount might be 0, so fallback to amount
        const fiatAmount = payment.fiat_amount || payment.amount || 0;
        console.log('[rejectPaymentById] Payment details:', {
            paymentId: id,
            fiat_amount: payment.fiat_amount,
            amount: payment.amount,
            fiatAmountToRefund: fiatAmount,
            balanceId: payment.balanceId,
        });
        
        // Refund the exact fiat amount to user's balance
        let updatedBalance = null;
        if (payment.balanceId && fiatAmount > 0) {
            console.log('[rejectPaymentById] Refunding fiatAmount:', fiatAmount, 'to balanceId:', payment.balanceId);
            const base_1 = require('../base');
            
            // Get balance before update for logging
            const balanceBefore = yield models_1.Balances.findById(payment.balanceId);
            console.log('[rejectPaymentById] Balance before refund:', balanceBefore ? { balance: balanceBefore.balance } : 'Not found');
            
            // Update balance in balances table and create balance history
            // balanceUpdate also sends socket event to user's frontend (if socket is connected)
            console.log('[rejectPaymentById] Calling balanceUpdate with:', { balanceId: payment.balanceId, amount: fiatAmount, type: 'withdrawal-canceled', userId: user._id });
            updatedBalance = yield (0, base_1.balanceUpdate)({
                req,
                balanceId: payment.balanceId,
                amount: fiatAmount,
                type: 'withdrawal-canceled',
            });
            
            console.log('[rejectPaymentById] Balance after refund:', updatedBalance ? { balance: updatedBalance.balance, status: updatedBalance.status, userId: updatedBalance.userId } : 'Update failed');
            
            // Update the balance history record with custom message "rejected withdrawal – amount returned"
            // Find the most recently created balance history for this withdrawal cancellation
            // Query by userId, currency, type, and recent timestamp (within last 10 seconds)
            const recentHistory = yield models_1.BalanceHistories.findOne({
                userId: user._id,
                currency: currency._id,
                type: 'withdrawal-canceled',
                createdAt: { $gte: new Date(Date.now() - 10000) }, // Created within last 10 seconds
            }).sort({ createdAt: -1 });
            
            if (recentHistory) {
                yield models_1.BalanceHistories.findByIdAndUpdate(recentHistory._id, {
                    $set: {
                        info: 'rejected withdrawal – amount returned',
                    },
                });
                console.log('[rejectPaymentById] Balance history updated with custom message:', recentHistory._id);
            } else {
                console.log('[rejectPaymentById] WARNING: Balance history record not found to update. Balance was still refunded successfully.');
            }
        } else {
            console.log('[rejectPaymentById] WARNING: Cannot refund - balanceId:', payment.balanceId, 'fiatAmount:', fiatAmount);
        }
        // Format amount with currency symbol
        const amountFormatted = `${currency?.symbol || ''} ${fiatAmount}`;
        // Get current time in a readable format
        const currentTime = new Date().toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZoneName: 'short'
        });
        // Send email via SendGrid
        const sendgrid_1 = require('../../utils/sendgrid');
        const MARKETING_EMAIL = process.env.MARKETING_EMAIL;
        const APP_NAME = process.env.APP_NAME;
        yield (0, sendgrid_1.sendMail)({
            to: user.email,
            from: { email: MARKETING_EMAIL, name: APP_NAME },
            subject: 'Withdrawal Declined',
            templateId: 'd-88a7ffc1210649fb8f2db4ea67e24798',
            dynamicTemplateData: {
                reason: reason.trim(),
                amount: amountFormatted,
                time: currentTime,
            },
        });
        // Emit socket events
        const io = req.app.get('io');
        if (io) {
            // Send notification to admin namespace
            io.of('/admin').emit('admin:withdrawal-failed', {
                paymentId: id,
                userId: user._id,
                reason: reason.trim(),
                amount: amountFormatted,
            });
            
            // Get user's session with active socket connection - use same query as UpdateSite
            const session = yield models_1.Sessions.findOne({ 
                userId: user._id, 
                socketId: { $ne: null, $ne: '' }
            });
            
            console.log('[rejectPaymentById] Session lookup for userId:', user._id, 'found:', session ? { socketId: session.socketId, socketIdType: typeof session.socketId, hasSocketId: !!session.socketId } : 'No active session');
            
            if (session && session.socketId && session.socketId !== '' && session.socketId !== null && typeof session.socketId === 'string') {
                // Send balance update to user's frontend
                let balanceToSend = null;
                if (updatedBalance && updatedBalance.status) {
                    balanceToSend = updatedBalance;
                } else if (payment.balanceId) {
                    // Fallback: fetch balance if updatedBalance wasn't available
                    balanceToSend = yield models_1.Balances.findById(payment.balanceId);
                }
                
                if (balanceToSend && balanceToSend.status) {
                    console.log('[rejectPaymentById] Sending balance event to socketId:', session.socketId, 'balance:', balanceToSend.balance, 'bonus:', balanceToSend.bonus);
                    // Send to default socket namespace (user's frontend) - not admin namespace
                    io.to(session.socketId).emit('balance', {
                        balance: balanceToSend.balance,
                        bonus: balanceToSend.bonus || 0,
                    });
                } else {
                    console.log('[rejectPaymentById] WARNING: Balance not found for balanceId:', payment.balanceId);
                }
                
                // Send alert notification to user's frontend (default socket namespace)
                const alertMsg = `Your withdrawal of ${amountFormatted} has been declined. Reason: ${reason.trim()}. The amount has been returned to your balance.`;
                console.log('[rejectPaymentById] Sending alert event to socketId:', session.socketId);
                io.to(session.socketId).emit('alert', {
                    msg: alertMsg,
                    type: 'error',
                });
            } else {
                console.log('[rejectPaymentById] WARNING: User socket not connected. Balance updated in database, but real-time update not sent.');
                console.log('[rejectPaymentById] User will see updated balance after page refresh.');
            }
        } else {
            console.log('[rejectPaymentById] Socket.io instance not found');
        }
        res.json({ success: true, message: 'Withdrawal rejected successfully' });
    }
    catch (error) {
        console.error('Error in rejectPaymentById:', error);
        return res.status(500).json('Internal server error');
    }
});
exports.rejectPaymentById = rejectPaymentById;

// const checkExchangeStatus = async () => {
//     try {
//         const datas = await Exchanges.find({ status: "WAITING" });
//         console.log("//check//Exchange//Status", datas.length);
//         if (!datas.length) return false;
//         const token = await authNOW();
//         if (!token) return false;
//         for (const key in datas) {
//             if (Object.prototype.hasOwnProperty.call(datas, key)) {
//                 const element = datas[key];
//                 const res = await axios.get(`${NOW_PAYMENT_API}/v1/conversion/${element.id}`, {
//                     headers: {
//                         "Authorization": `Bearer ${token}`
//                     }
//                 });
//                 if (res?.data) {
//                     const { result } = res.data;
//                     console.log(result, "==>result");
//                     await Exchanges.updateOne({ id: element.id }, { status: result.status });
//                     if (result.status === "FINISHED") {
//                         await Balances.updateOne({ userId: element.userId, currency: element.to_currency_id }, { $inc: { balance: result.to_amount } });
//                     }
//                     if (result.status === "REJECTED") {
//                         await Balances.updateOne({ userId: element.userId, currency: element.from_currency_id }, { $inc: { balance: result.from_amount } });
//                     }
//                 }
//             }
//         }
//     } catch (err) {
//         console.error(err);
//         return false;
//     }
// }
// const job = new CronJob(process.env.EXCHANGE_TIME as string, () => {
//     checkExchangeStatus();
// });
// job.start();
