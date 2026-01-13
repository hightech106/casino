/**
 * Joi validation schemas for authentication-related requests.
 * Validates registration, login, and RTP configuration request bodies.
 * Ensures required fields are present and meet type/constraint requirements.
 */
import Joi from 'joi';

const register = Joi.object({
    userId: Joi.string().required(),
    email: Joi.string().required(),
    username: Joi.string().required(),
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    currency: Joi.string().required(),
    currencyIcon: Joi.string().allow('', null).optional(),
    avatar: Joi.string().allow('', null).optional(),
    balance: Joi.number().min(0).optional(),
    callback_url: Joi.string().required()
});

const login = Joi.object({
    token: Joi.string().required(),
    callback_url: Joi.string().required()
});

const rtp = Joi.object({
    game_type: Joi.string().required(),
    rtp: Joi.number().min(0).max(100).required()
});

export default { login, register, rtp };
