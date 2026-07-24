import express from 'express';
import { protectAdmin } from '../middleware/authMiddleware.js';
import {
  getServices,
  getServiceById,
  createService,
  updateService,
  toggleServiceStatus,
  deleteService
} from '../controllers/serviceController.js';

const router = express.Router();

router.get('/', getServices);
router.get('/:id', getServiceById);
router.post('/', protectAdmin, createService);
router.put('/:id', protectAdmin, updateService);
router.patch('/:id/toggle', protectAdmin, toggleServiceStatus);
router.delete('/:id', protectAdmin, deleteService);

export default router;