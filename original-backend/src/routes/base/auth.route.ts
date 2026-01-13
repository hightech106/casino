/**
 * Authentication routes for user registration, login, logout, and admin authentication.
 * Handles JWT-based session management and integrates with external auth services.
 * All routes use Joi validation middleware for request validation.
 */
import express from 'express';
import { createValidator } from 'express-joi-validation';

import { register, logout, me, login } from '../../controllers/auth.controller';
// middleware
import { auth, authAdmin } from '../../middlewares/auth';
import VSchema from '../../middlewares/validation/auth';

const router = express.Router();
const validator = createValidator();


router.post('/logout', auth, logout);
router.post('/login', validator.body(VSchema.login), login);
router.post('/register', validator.body(VSchema.register), register);

router.get('/admin/me', authAdmin, me);

export default router;
