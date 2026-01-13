/**
 * Joi validation schemas for Keno game-related request parameters.
 * Validates bet amounts and selected numbers for Keno game.
 * Ensures game integrity by validating inputs before processing bets.
 */
import Joi from 'joi';

const keno = Joi.object({
    amount: Joi.number().min(0.01).required(),
    selected: Joi.array().required()
});

export default {
    keno
};
