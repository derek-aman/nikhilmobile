import express from 'express';
import { protectCustomer, protectAdmin } from '../middleware/authMiddleware.js';
import { getCustomerNotifications, getAdminNotifications, markAsRead } from '../controllers/notificationController.js';

const router = express.Router();

router.get('/customer', protectCustomer, getCustomerNotifications);
router.get('/admin', protectAdmin, getAdminNotifications);
router.patch('/:id/read', markAsRead);

export default router;