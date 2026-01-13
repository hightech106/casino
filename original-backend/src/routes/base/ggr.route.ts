/**
 * Gross Gaming Revenue (GGR) reporting routes for analytics and financial tracking.
 * Provides endpoints for GGR by game, time period (daily/monthly/yearly), and summary statistics.
 * All routes require admin authentication for access to financial data.
 */
import { Router } from 'express';
import { authAdmin } from '@middlewares/auth';
import {
    getGGRForGame,
    getGGRForPeriod,
    getDailyGGR,
    getMonthlyGGR,
    getYearlyGGR,
    getGGRSummary
} from '../../controllers/ggr.controller';

const router = Router();

// GGR Routes - All require authentication
router.use(authAdmin);

// Get GGR for a specific game
router.get('/game/:gameType', getGGRForGame);

// Get GGR for a specific time period
router.get('/period', getGGRForPeriod);

// Get daily GGR
router.get('/daily', getDailyGGR);

// Get monthly GGR
router.get('/monthly', getMonthlyGGR);

// Get yearly GGR
router.get('/yearly', getYearlyGGR);

// Get GGR summary for all games
router.get('/summary', getGGRSummary);

export default router; 