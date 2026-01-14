/**
 * Utility functions index providing shared helper functions.
 * Manages cryptocurrency coin data caching, admin roles configuration, and common utility exports.
 * Central location for reusable utility functions used throughout the application.
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
exports.ADMIN_ROLES = exports.NOT_TRANSLATE = exports.initCryptoCoins = exports.getCryptoCoins = exports.AVAILABLE_COINS = void 0;
const models_1 = require("../models");

// Mutable array for crypto coins (updated dynamically)
exports.AVAILABLE_COINS = [];

// Cache time tracking
let cacheTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Dynamic function to get crypto coins from database
const getCryptoCoins = () => __awaiter(void 0, void 0, void 0, function* () {
    const now = Date.now();
    
    // Return cached data if still valid
    if (exports.AVAILABLE_COINS.length > 0 && (now - cacheTime) < CACHE_DURATION) {
        return exports.AVAILABLE_COINS;
    }
    
    try {
        const currencies = yield models_1.Currencies.find(
            { isFiat: false, status: true }
        ).lean();
        
        // Clear and update the array (keep same reference)
        exports.AVAILABLE_COINS.length = 0;
        currencies.forEach((coin) => {
            const { _id, withdrawal, ...rest } = coin;
            exports.AVAILABLE_COINS.push({
                ...rest,
                currencyId: _id.toString(),
                withdrawable: withdrawal || false
            });
        });
        
        cacheTime = now;
        console.log(`[CryptoCoins] Loaded ${exports.AVAILABLE_COINS.length} crypto currencies from database`);
        return exports.AVAILABLE_COINS;
    } catch (error) {
        console.error('Error fetching crypto coins:', error);
        return exports.AVAILABLE_COINS; // Return cached data as fallback
    }
});
exports.getCryptoCoins = getCryptoCoins;

// Initialize function to be called on server startup
const initCryptoCoins = () => __awaiter(void 0, void 0, void 0, function* () {
    yield getCryptoCoins();
    console.log('[CryptoCoins] Initialized:', exports.AVAILABLE_COINS.map(c => c.symbol).join(', '));
});
exports.initCryptoCoins = initCryptoCoins;
exports.NOT_TRANSLATE = [
    'Home/Away',
    'Match Corners',
    'Asian Corners',
    'Corners European Handicap',
    'Corners 1x2',
    'Corners Over Under',
    'Corners Asian Handicap',
    'Home Corners Over/Under',
    'Away Corners Over/Under',
    'Total Corners',
    'Total Corners (3 way)'
];
exports.ADMIN_ROLES = ['super_admin', 'admin', 'agent'];
