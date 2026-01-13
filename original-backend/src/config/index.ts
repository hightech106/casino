/**
 * Main configuration module that loads and validates environment variables.
 * Defines game-specific settings (bet limits, fees, VIP levels) and JWT configuration.
 * Validates required environment variables using Joi schema validation.
 */
import dotenv from 'dotenv';
import path from 'path';
import Joi from 'joi';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const envVarsSchema = Joi.object()
    .keys({
        NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
        PORT: Joi.number().default(5000),
        DATABASE_URL: Joi.string().required().description('MongoDB Conection URL'),
        JWT_SECRET: Joi.string().required().description('JWT secret key'),
        JWT_ACCESS_EXPIRATION_MINUTES: Joi.number().default(60).description('minutes after which access tokens expire'),
        JWT_REFRESH_EXPIRATION_DAYS: Joi.number().default(60).description('days after which refresh tokens expire'),
        JWT_RESET_PASSWORD_EXPIRATION_MINUTES: Joi.number()
            .default(60)
            .description('minutes after which reset password token expires'),
        JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: Joi.number()
            .default(60)
            .description('minutes after which verify email token expires')
    })
    .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

const games = {
    vip: {
        levels: [
            {
                name: 'None',
                wagerNeeded: 0,
                rakebackPercentage: 0
            },
            {
                name: 'Bronze',
                wagerNeeded: 10000,
                rakebackPercentage: 10
            },
            {
                name: 'Silver',
                wagerNeeded: 15000,
                rakebackPercentage: 12
            },
            {
                name: 'Gold',
                wagerNeeded: 20000,
                rakebackPercentage: 14
            },
            {
                name: 'Diamond',
                wagerNeeded: 30000,
                rakebackPercentage: 16
            }
        ]
    },
    affiliates: {
        earningPercentage: 20 // How many percentage of house edge the affiliator will get
    }
};

export default {
    env: envVars.NODE_ENV,
    port: envVars.PORT,
    mongodbURL: envVars.DATABASE_URL,
    expireTime: 10, // minutes
    session: {
        secret: envVars.SESSION_SECRET,
        cookieName: envVars.SESSION_COOKIE_NAME
    },
    jwt: {
        secret: envVars.JWT_SECRET,
        accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
        refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
        resetPasswordExpirationMinutes: envVars.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
        verifyEmailExpirationMinutes: envVars.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
        tokenTypes: {
            ACCESS: 'access',
            REFRESH: 'refresh',
            RESET_PASSWORD: 'resetPassword',
            VERIFY_EMAIL: 'verifyEmail'
        }
    },
    sport: {
        api_key: envVars.SPORT_API_KEY
    },
    botToken: envVars?.BOT_ACCESS_TOKEN || '',
    games
};
