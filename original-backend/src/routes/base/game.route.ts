/**
 * Game routes for all casino game types (crash, coinflip, plinko, blackjack, etc.).
 * Handles game play, betting, history retrieval, and game-specific operations.
 * Most routes require authentication and use Joi validation for game parameters.
 */
import express from 'express';
import { createValidator } from 'express-joi-validation';

// middleware
import { auth } from '@middlewares/auth';
import VSGamechema from '@middlewares/validation/game';
import { getCoinflip } from '@controllers/coinflip.controller';
import { getCrash, getUserCrashData } from '@controllers/crash.controller';
import { getPlinkoHistory, playPlinko } from '@controllers/plinko.controller';
import { betFlowerPoker, getFlowerPokerHistory, playFlowerPoker } from '@controllers/flowerpoker.controller';
import {
    autoBetMine,
    betMine,
    cashOutMine,
    getMineHistory,
    getMineStatus,
    playMineGame
} from '@controllers/mine.controller';
import {
    doubleBlackjack,
    getBlackjackHistory,
    hitBlackjack,
    insuranceBlackjack,
    playBlackjack,
    splitBlackjack,
    standBlackjack
} from '@controllers/blackjack.controller';
import { getWheelHistory, playWheel } from '@controllers/wheel.controller';
import { getDiceHistory, playDice } from '@controllers/dice.controller';
import { playDiamonds, getDiamondsHistory } from '@controllers/diamonds.controller';
import { getLimboHistory, playLimbo } from '@controllers/limbo.controller';
import { getKenoHistory, playKeno } from '@controllers/keno.controller';
import { betHilo, cashoutHilo, createHilo, getHilo, getHiloHistory } from '@controllers/hilo.controller';
import { betVideoPoker, drawVideoPoker, getVideoPoker, getVideoPokerHistory } from '@controllers/videopoker.controller';
import { betBaccaratSingle, createBaccaratSingle, getBaccaratSingleHistory } from '@controllers/baccarat_s.controller';
import { betGoal, cashoutGoal, createGoal, getGoalHistory } from '@controllers/goal.controller';
import { betRoulette, createRoulette, getRouletteHistory } from '@controllers/roulette.controller';

const router = express.Router();
const validator = createValidator();

// crash
router.get('/crash', getCrash);
router.get('/crash/me', auth, getUserCrashData);

// coinflip
router.get('/coinflip', getCoinflip);

// plinko
router.post('/plinko', auth, validator.body(VSGamechema.plinko), playPlinko);
router.get('/plinko/history', getPlinkoHistory);

// flowerpoker

router.post('/flower-poker/create', auth, playFlowerPoker);
router.post('/flower-poker/bet', auth, validator.body(VSGamechema.amount), betFlowerPoker);
router.get('/flower-poker/history', getFlowerPokerHistory);

// mine
router.get('/mine/status', auth, getMineStatus);

router.post('/mine/create', auth, validator.body(VSGamechema.mine.play), playMineGame);

router.post('/mine/bet', auth, validator.body(VSGamechema.mine.bet), betMine);

router.post('/mine/autobet', auth, validator.body(VSGamechema.mine.autobet), autoBetMine);

router.post('/mine/cashout', auth, cashOutMine);

router.get('/mine/history', getMineHistory);

// blackjack

router.post('/blackjack/start', auth, validator.body(VSGamechema.blackjack.play), playBlackjack);

router.post('/blackjack/hit', auth, hitBlackjack);

router.post('/blackjack/stand', auth, standBlackjack);

router.post('/blackjack/split', auth, splitBlackjack);

router.post('/blackjack/double', auth, doubleBlackjack);

router.post('/blackjack/insurance', auth, validator.body(VSGamechema.blackjack.insurance), insuranceBlackjack);

router.get('/blackjack/history', getBlackjackHistory);

// wheel

router.post('/wheel/play', auth, validator.body(VSGamechema.wheel), playWheel);
router.get('/wheel/history', getWheelHistory);

// dice

router.post('/dice/play', auth, validator.body(VSGamechema.dice), playDice);

router.get('/dice/history', getDiceHistory);

// diamonds

router.post('/diamonds/play', auth, validator.body(VSGamechema.amount), playDiamonds);
router.get('/diamonds/history', getDiamondsHistory);

// limbo

router.post('/limbo/play', auth, validator.body(VSGamechema.limbo), playLimbo);
router.get('/limbo/history', getLimboHistory);

// keno

router.post('/keno/play', auth, validator.body(VSGamechema.keno), playKeno);
router.get('/keno/history', getKenoHistory);

// hilo

router.get('/hilo/game', auth, getHilo);
router.post('/hilo/create', auth, validator.body(VSGamechema.hilo.create), createHilo);
router.post('/hilo/bet', auth, validator.body(VSGamechema.hilo.bet), betHilo);
router.post('/hilo/cashout', auth, validator.body(VSGamechema.hilo.create), cashoutHilo);
router.get('/hilo/history', getHiloHistory);

// videopoker

router.get('/videopoker', auth, getVideoPoker);
router.post('/videopoker/bet', auth, validator.body(VSGamechema.videopoker.bet), betVideoPoker);
router.post('/videopoker/draw', auth, validator.body(VSGamechema.videopoker.draw), drawVideoPoker);
router.get('/videopoker/history', getVideoPokerHistory);

// baccarat_single

router.post('/baccarat_s', auth, validator.body(VSGamechema.baccarat.create), createBaccaratSingle);
router.post('/baccarat_s/bet', auth, validator.body(VSGamechema.baccarat.bet), betBaccaratSingle);
router.get('/baccarat_s/history', getBaccaratSingleHistory);

// goal

router.post('/goal/create', auth, validator.body(VSGamechema.goal.create), createGoal);
router.post('/goal/bet', auth, validator.body(VSGamechema.goal.bet), betGoal);
router.post('/goal/cashout', auth, cashoutGoal);
router.get('/goal/history', getGoalHistory);

// roulette

router.post('/roulette/create', auth, validator.body(VSGamechema.roulette.create), createRoulette);
router.post('/roulette/bet', auth, validator.body(VSGamechema.roulette.bet), betRoulette);
router.get('/roulette/history', getRouletteHistory);

export default router;
