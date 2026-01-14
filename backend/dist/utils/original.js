"use strict";
/**
 * Module providing original functionality.
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
exports.signupOriginal = void 0;
const axios_1 = require("axios");
const ORIGINAL_GAME_API = process.env.ORIGINAL_GAME_API;
const DOMAIN = process.env.DOMAIN;
const signupOriginal = (data) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const param = Object.assign(Object.assign({}, data), { callback_url: `${DOMAIN}/api/v2/users/update-user-balance` });
        console.log('signupOriginal param:', param);
        yield axios_1.default.post(`${ORIGINAL_GAME_API}/api/auth/register`, param);
        return true;
    } catch (err) {
        console.error('signupOriginal error:', err);
        return false;
    }
});
exports.signupOriginal = signupOriginal;