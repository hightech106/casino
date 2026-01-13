/**
 * Joi validation schemas for all game-related request parameters.
 * Validates bet amounts, game configurations, and game-specific parameters for all casino games.
 * Ensures game integrity by validating inputs before processing bets and game actions.
 */
import Joi from 'joi';

const plinko = Joi.object({
    amount: Joi.number().required(),
    difficulty: Joi.string().required(),
    pins: Joi.number().required()
});

const mine = {
    play: Joi.object({
        amount: Joi.number().min(0.01).required(),
        mines: Joi.number().min(1).required()
    }),
    bet: Joi.object({
        point: Joi.number().min(0).required()
    }),
    autobet: Joi.object({
        points: Joi.array().required(),
        amount: Joi.number().min(0.01).required(),
        mines: Joi.number().min(1).required()
    })
};

const amount = Joi.object({
    amount: Joi.number().min(0.01).required()
});

const blackjack = {
    play: Joi.object({
        amount: Joi.number().min(0.01).required(),
        clientSeed: Joi.string().allow(null, '').optional()
    }),
    insurance: Joi.object({
        confirm: Joi.boolean().required()
    })
};

const wheel = Joi.object({
    amount: Joi.number().min(0.01).required(),
    color: Joi.string().required(),
    mode: Joi.boolean().required()
});

const dice = Joi.object({
    amount: Joi.number().min(0.01).required(),
    multiplier: Joi.number().min(1).required(),
    target: Joi.number().required(),
    mode: Joi.boolean().required()
});

const limbo = Joi.object({
    amount: Joi.number().min(0.01).required(),
    multiplier: Joi.number().min(1).required()
});

const keno = Joi.object({
    amount: Joi.number().min(0.01).required(),
    selected: Joi.array().required()
});

const hilo = {
    create: Joi.object({
        amount: Joi.number().min(0.01).required(),
        startCard: Joi.any().required()
    }),
    bet: Joi.object({
        type: Joi.string().required()
    })
};

const videopoker = {
    bet: Joi.object({
        amount: Joi.number().min(0.01).required()
    }),
    draw: Joi.object({
        holdIndexes: Joi.array().required()
    })
};

const baccarat = {
    create: Joi.object({
        clientSeed: Joi.string().allow('', null).required()
    }),
    bet: Joi.object({
        currency: Joi.string().allow('', null).optional(),
        bets: Joi.object().required()
    })
};

const goal = {
    create: Joi.object({
        amount: Joi.number().min(0.01).required(),
        size: Joi.number().min(0).required()
    }),
    bet: Joi.object({
        position: Joi.number().min(0).required()
    })
};

const roulette = {
    create: Joi.object({
        clientSeed: Joi.string().allow("", null).required(),
    }),
    bet: Joi.object({
        bets: Joi.array().required()
    })
};

export default {
    plinko,
    mine,
    amount,
    blackjack,
    wheel,
    dice,
    limbo,
    keno,
    hilo,
    videopoker,
    baccarat,
    goal,
    roulette
};
