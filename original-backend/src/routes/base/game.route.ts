/**
 * Game routes for Keno game.
 * Handles game play, betting, and history retrieval.
 * Routes require authentication and use Joi validation for game parameters.
 */
import express from 'express';
import { createValidator } from 'express-joi-validation';

// middleware
import { auth } from '@middlewares/auth';
import VSGamechema from '@middlewares/validation/game';
import { getKenoHistory, playKeno } from '@controllers/keno.controller';

const router = express.Router();
const validator = createValidator();

// keno
router.post('/keno/play', auth, validator.body(VSGamechema.keno), playKeno);
router.get('/keno/history', getKenoHistory);

export default router;
