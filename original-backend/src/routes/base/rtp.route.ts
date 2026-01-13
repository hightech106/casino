/**
 * Return to Player (RTP) configuration routes for managing game RTP settings.
 * Allows admins to view and update RTP percentages for different games.
 * Requires admin authentication for modification operations.
 */
import express from 'express';
import { createValidator } from 'express-joi-validation';
import * as configController from '../../controllers/rtp.controller';
import { authAdmin } from '../../middlewares/auth';
import VSchema from '../../middlewares/validation/auth';

const router = express.Router();
const validator = createValidator();

router.get('/', configController.getRTPs);
router.patch('/', authAdmin, validator.body(VSchema.rtp), configController.updateRTPs);

export default router; 