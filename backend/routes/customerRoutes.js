import express from 'express';
import { protectCustomer } from '../middleware/authMiddleware.js'

import { getMyProfile } from '../controllers/customerController.js';

const router = express.Router();

router.get('/me', protectCustomer, getMyProfile);

export default router;