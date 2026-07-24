import express from 'express';
import { protectAdmin } from '../middleware/authMiddleware.js';
import { protectCustomer } from '../middleware/authMiddleware.js';
import { createOrder, getOrderByOrderId, getOrders, updateOrderStatus } from '../controllers/orderController.js';

const router = express.Router();
router.post('/', protectCustomer, createOrder);
router.get('/:orderId', getOrderByOrderId);
router.get('/', protectAdmin, getOrders);
router.patch('/:id/status', protectAdmin, updateOrderStatus);

export default router;