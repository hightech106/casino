/**
 * Main router configuration that aggregates all route modules.
 * Registers base routes for authentication, games, users, RTP (Return to Player), and GGR (Gross Gaming Revenue).
 * Centralizes route organization and provides a single entry point for all API endpoints.
 */
import express from 'express';
// base
import authRoute from './base/auth.route';
import gameRoute from './base/game.route';
import userRoute from './base/user.route';
import rtpRoute from './base/rtp.route';
import ggrRoute from './base/ggr.route';

const routes = [
    // base
    {
        path: '/auth',
        route: authRoute
    },
    {
        path: '/game',
        route: gameRoute
    },
    {
        path: '/user',
        route: userRoute
    },
    {
        path: '/rtp',
        route: rtpRoute
    },
    {
        path: '/ggr',
        route: ggrRoute
    },
];

const router = express.Router();
routes.forEach((route: any) => {
    router.use(route.path, route.route);
});

export default router;
