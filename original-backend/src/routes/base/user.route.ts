/**
 * User-related routes for retrieving user history and account information.
 * Requires authentication to access user-specific data.
 * Provides endpoints for viewing game history and transaction records.
 */
import express from 'express';
import { createValidator } from 'express-joi-validation';

import {  getHistory, } from '../../controllers/user.controller';
// middleware
import { auth } from '../../middlewares/auth';
import VSchema from '../../middlewares/validation/auth';

const router = express.Router();
const validator = createValidator();

router.get('/history', auth, getHistory);

export default router;
