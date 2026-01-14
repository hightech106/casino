"use strict";
/**
 * Module providing crypto price conversion functionality.
 * Simplified to only handle LU (USD-equivalent) to crypto conversion.
 * All fiat conversion logic removed - we only use LU internally.
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : adopt(value instanceof P ? value : new P(function (resolve) { resolve(value); })).then(fulfilled, rejected); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFiatToCryptoRate = void 0;
const axios_1 = require("axios");

// Binance API for crypto prices
const BINANCE_API_URL = 'https://api.binance.com/api/v3/ticker/price';

// Map custom crypto symbols to standard symbols
const CRYPTO_SYMBOL_MAP = {
    'WBNB': 'BNB',
    'WMATIC': 'MATIC',
    'WETH': 'ETH',
    'WBTC': 'BTC',
    'WUSDT': 'USDT',
    'WUSDC': 'USDC',
    'WDAI': 'DAI',
    'USDBC': 'USDC',
    'CBETH': 'ETH',
    'BTCB': 'BTC'  // Binance-Peg Bitcoin to Bitcoin
};

// Get base crypto symbol (remove network suffix)
const getBaseSymbol = (symbol) => {
    return symbol.toUpperCase().replace(/TRC20|ERC20|BEP20|BSC/g, '');
};

/**
 * Converts LU (USD-equivalent) amount to crypto using Binance API.
 * Since we only use LU internally, fiat_symbol is always 'USD' or 'LU' (normalized to USD).
 * @param currency - Crypto currency object with symbol
 * @param fiat_symbol - Always 'USD' or 'LU' (normalized to USD)
 * @param fiat_amount - Amount in LU (USD-equivalent)
 * @returns Crypto conversion result or false on error
 */
const getFiatToCryptoRate = ({ symbol }, fiat_symbol, fiat_amount) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const baseSymbol = getBaseSymbol(symbol);
        const mappedSymbol = CRYPTO_SYMBOL_MAP[baseSymbol] || baseSymbol;
        // Normalize LU to USD (LU is USD-equivalent, 1:1)
        const fiatUpper = fiat_symbol.toUpperCase() === 'LU' ? 'USD' : fiat_symbol.toUpperCase();
        
        // Only USD/LU supported - all amounts are in LU
        if (fiatUpper !== 'USD') {
            console.error(`Unsupported fiat symbol: ${fiatUpper}. Only USD/LU (LU) is supported.`);
            return false;
        }
        
        // Stablecoins (USDT, USDC) - 1:1 with USD/LU
        if (mappedSymbol === 'USDT' || mappedSymbol === 'USDC') {
            return {
                crypto_amount: fiat_amount,
                fiat_amount,
                price_per_crypto: 1,
                usd_amount: fiat_amount
            };
        }
        
        // Get crypto price in USDT from Binance
        const tradingPair = `${mappedSymbol}USDT`;
        const binanceUrl = `${BINANCE_API_URL}?symbol=${tradingPair}`;
        
        const binanceRes = yield axios_1.default.get(binanceUrl);
        
        if (!(binanceRes === null || binanceRes === void 0 ? void 0 : binanceRes.data) || !binanceRes.data.price) {
            console.error(`No price data from Binance for ${tradingPair}`);
            return false;
        }
        
        const priceInUsd = parseFloat(binanceRes.data.price);
        
        if (!priceInUsd || priceInUsd <= 0) {
            console.error(`Invalid price for ${tradingPair}: ${priceInUsd}`);
            return false;
        }
        
        // Calculate crypto amount: LU amount / crypto price in USD
        const crypto_amount = fiat_amount / priceInUsd;
        
        return {
            crypto_amount: crypto_amount,
            fiat_amount,
            price_per_crypto_usd: priceInUsd,
            fiat_to_usd_rate: 1, // Always 1 since LU = USD
            usd_amount: fiat_amount
        };
    }
    catch (error) {
        console.error(`Error getting crypto rate => `, ((_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.data) || error);
        return false;
    }
});
exports.getFiatToCryptoRate = getFiatToCryptoRate;
