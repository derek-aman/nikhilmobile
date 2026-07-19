import express from 'express';

import { protectAdmin , protectCustomer} from '../middleware/authMiddleware.js';
import {
  createAppointment,
  getAppointmentByBookingId,
  getAppointments,
  updateAppointmentStatus
} from '../controllers/appointmentController.js';

const router = express.Router();

router.post('/', protectCustomer, createAppointment);
router.get('/:bookingId', getAppointmentByBookingId);
router.get('/', protectAdmin, getAppointments);
router.patch('/:id/status', protectAdmin, updateAppointmentStatus);

export default router;