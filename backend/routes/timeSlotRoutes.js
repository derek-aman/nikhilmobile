import express from 'express';
import { getTimeSlots, createTimeSlot } from '../controllers/timeSlotController.js';

const router = express.Router();
router.get('/', getTimeSlots);
router.post('/', createTimeSlot);

export default router;