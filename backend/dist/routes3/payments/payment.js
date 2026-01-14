"use strict";
/**
 * Module providing payment functionality.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const express_promise_router_1 = require("express-promise-router");
const auth_1 = require("../../middlewares/auth");
const payment_1 = require("../../controllers/payment");
const validation_1 = require("../../middlewares/validation");
const router = (0, express_promise_router_1.default)();
router.post('/getPaymentMethod', payment_1.getPaymentMethod);
router.post('/getTransactionResult', payment_1.getTransactionResult);
router.post('/getAdminBalance', auth_1.AVerifytoken, payment_1.getAdminBalance);
router.post('/deposit', validation_1.V.body(validation_1.Validator.Payments.Payment.Deposit), auth_1.verifyToken, auth_1.checkUser, payment_1.deposit);
router.post('/withdrawal', validation_1.V.body(validation_1.Validator.Payments.Payment.Withdrawal), auth_1.verifyToken, auth_1.checkUser, payment_1.withdrawal);
router.post('/get-currency', auth_1.verifyToken, payment_1.getCurrencies);
router.post('/get-balance', validation_1.V.body(validation_1.Validator.UserId), auth_1.verifyToken, auth_1.checkUser, payment_1.getBalances);
router.post('/get-transaction', validation_1.V.body(validation_1.Validator.UserId), auth_1.verifyToken, auth_1.checkUser, payment_1.getTransactions);
router.post('/updateBalance', validation_1.V.body(validation_1.Validator.Payments.Payment.UpdateBalance), auth_1.AGVerifytoken, payment_1.updateBalance);
exports.default = router;
