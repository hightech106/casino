"use strict";
/**
 * Index file exporting payments modules and routes.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const express_rate_limit_1 = require("express-rate-limit");
const express_promise_router_1 = require("express-promise-router");
const validation_1 = require("../../middlewares/validation");
const auth_1 = require("../../middlewares/auth");
const payment_1 = require("../../controllers/payment");
const FiatQuiklyPayments_1 = require("../../controllers/payment/FiatQuiklyPayments");
const TrioPayments_1 = require("../../controllers/payment/TrioPayments");
const router = (0, express_promise_router_1.default)();
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
});
const depositlimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 1000,
    max: 5, // Allow up to 5 deposits per minute (was 1)
    standardHeaders: true,
    legacyHeaders: false,
});
const Mlimiter = (0, express_rate_limit_1.default)({
    windowMs: 2000, // Increased from 500ms to 2 seconds
    max: 3, // Allow up to 3 requests per 2 seconds (was 1 per 500ms)
    standardHeaders: true,
    legacyHeaders: false,
});
router.post('/deposit', validation_1.V.body(validation_1.Validator.Payments.Payment.Deposit), auth_1.verifyToken, auth_1.checkUser, payment_1.deposit);
router.post('/s-deposit', Mlimiter, depositlimiter, validation_1.V.body(validation_1.Validator.Payments.Payment.SolanaDeposit), auth_1.verifyToken, auth_1.checkUser, payment_1.depositSolana);
router.post('/t-deposit', Mlimiter, depositlimiter, validation_1.V.body(validation_1.Validator.Payments.Payment.TronDeposit), auth_1.verifyToken, auth_1.checkUser, payment_1.depositTron);
router.post('/withdrawal', auth_1.verifyToken, validation_1.V.body(validation_1.Validator.Payments.Payment.Withdrawal), payment_1.withdrawal);
router.post('/get-currency', auth_1.verifyToken, payment_1.getAvailableCoins);
router.post('/get-balance', validation_1.V.body(validation_1.Validator.UserId), auth_1.verifyToken, auth_1.checkUser, payment_1.getBalances);
router.post('/get-transaction', validation_1.V.body(validation_1.Validator.UserId), auth_1.verifyToken, auth_1.checkUser, payment_1.getTransactions);
router.post('/deposit-now', validation_1.V.body(validation_1.Validator.Payments.Payment.DepositNow), auth_1.verifyToken, auth_1.checkUser, payment_1.createNowpay);
router.post('/exchange-now', validation_1.V.body(validation_1.Validator.Payments.Payment.ExchangeNow), auth_1.verifyToken, auth_1.checkUser, payment_1.exchangeNowpay);
router.post('/fiat-now', auth_1.verifyToken, payment_1.getFiatNowpay);
router.post('/get-currency-fiat', payment_1.getCurrenciesFiat);
router.post('/deposit-fiat-quikly', auth_1.verifyToken, validation_1.V.body(validation_1.Validator.Payments.Payment.DepositFiatQuikly), FiatQuiklyPayments_1.depositFiatQuikly);
router.get('/status-quikly', FiatQuiklyPayments_1.checkPaymentStatus);
router.post('/calc-usdt-crypto', auth_1.verifyToken, validation_1.V.body(validation_1.Validator.Payments.Payment.calcUsetToCrypto), payment_1.calcUsetToCrypto);
router.post('/confirm-smart-contract', auth_1.verifyToken, validation_1.V.body(validation_1.Validator.Payments.Payment.ConfirmSmartContract), payment_1.confirmSmartContractPayment);
router.post('/trio-session-create', auth_1.verifyToken, TrioPayments_1.createTrioSession);
router.post('/trio-status', auth_1.verifyToken, TrioPayments_1.checkTrioPaymentStatus);
router.post('/solana/deposit-address', auth_1.verifyToken, payment_1.getSolanaDepositAddress);
router.post('/solana/check-deposits', auth_1.verifyToken, payment_1.checkSolanaDeposits);
router.get('/tron/deposit-address', auth_1.verifyToken, payment_1.getTronDepositAddress);
// Admin-only Solana endpoints
router.get('/admin/solana/deposit-addresses', auth_1.AGVerifytoken, payment_1.getSolanaDepositAddresses);
router.post('/admin/solana/generate-all-addresses', auth_1.AGVerifytoken, payment_1.generateAllSolanaAddresses);
router.post('/admin/solana/sweep', auth_1.AGVerifytoken, validation_1.V.body(validation_1.Validator.Payments.Payment.SolanaSweep), payment_1.sweepSolanaFunds);
router.get('/admin/solana/sweeps', auth_1.AGVerifytoken, payment_1.getSolanaSweeps);
// Admin-only TRON endpoints
router.get('/admin/tron/deposit-addresses', auth_1.AGVerifytoken, payment_1.getTronDepositAddresses);
router.post('/admin/tron/sweep', auth_1.AGVerifytoken, validation_1.V.body(validation_1.Validator.Payments.Payment.TronSweep), payment_1.sweepTronFunds);
router.get('/admin/tron/sweeps', auth_1.AGVerifytoken, payment_1.getTronSweeps);
exports.default = router;
